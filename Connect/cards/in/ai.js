/* =========================================================
   ai.js
   - 讀網站（r.jina.ai）
   - 產業判斷（Gemini 文字模型）
   - 名片辨識（Gemini Vision）
   ========================================================= */

(function () {
  "use strict";

  const AGENT_PLATFORM_BASE_URL =
    "https://aiplatform.googleapis.com/v1/publishers/google/models";
  const INDUSTRY_MODEL = "gemini-2.5-flash";
  const BUSINESS_CARD_MODEL = "gemini-3-flash-preview";
  const INDUSTRY_VALUES = ["semiconductor", "machining", "both", "neither", "unknown"];
  const INDUSTRY_CONFIDENCE_THRESHOLD = 70;

  const INDUSTRY_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
      industry: {
        type: "string",
        enum: INDUSTRY_VALUES,
        description: "依明確產品或服務證據判斷的產業分類。證據不足時必須輸出 unknown。"
      },
      confidence: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "產業分類信心分數；只有具體產品或服務證據才能給高分。"
      },
      reasons: {
        type: "array",
        maxItems: 3,
        items: { type: "string" },
        description: "最多三項繁體中文判斷理由。"
      },
      evidence_keywords: {
        type: "array",
        maxItems: 8,
        items: { type: "string" },
        description: "實際出現在輸入內容中的產品、製程或服務關鍵字。"
      }
    },
    required: ["industry", "confidence", "reasons", "evidence_keywords"]
  };

  function buildModelEndpoint(model, apiKey) {
    return (
      `${AGENT_PLATFORM_BASE_URL}/${encodeURIComponent(model)}` +
      `:generateContent?key=${encodeURIComponent(apiKey)}`
    );
  }

  function cleanWebsiteText(value) {
    const ignored = /^(cookie|privacy|terms|copyright|all rights reserved|隱私權|使用條款|版權)/i;
    const seen = new Set();

    return String(value || "")
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line && !ignored.test(line))
      .filter((line) => {
        const key = line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .join("\n")
      .slice(0, 8000);
  }

  // URL：補 https://
  function normalizeUrl(u) {
    const s = (u || "").trim();
    if (!s) return "";
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  }

  // 讀網站文字（r.jina.ai）
  async function fetchWebsiteText(url, timeoutMs = 9000) {
    const normalized = normalizeUrl(url);
    if (!normalized) return "";

    // r.jina.ai 支援把網站轉成可讀文字
    const readerUrl = `https://r.jina.ai/http://` + normalized.replace(/^https?:\/\//i, "");

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(readerUrl, { signal: ctrl.signal });
      if (!res.ok) return "";
      const text = await res.text();
      return cleanWebsiteText(text);
    } catch {
      return "";
    } finally {
      clearTimeout(timer);
    }
  }

  // 產業判斷（你昨天那版 JSON 規格）
  function explainGeminiError(status, raw) {
    const text = typeof raw === "string" ? raw : JSON.stringify(raw || {});

    if (text.includes("API_KEY_INVALID")) {
      return "Google Cloud API Key 無效，請確認管理員後台中的金鑰是否正確。";
    }

    if (text.includes("PERMISSION_DENIED")) {
      return "API Key 沒有 Agent Platform 使用權限，請確認 API 已啟用及金鑰限制設定。";
    }

    if (text.includes("RESOURCE_EXHAUSTED")) {
      return "Gemini API 用量或配額已滿，請稍後再試或更換 API Key。";
    }

    return `Gemini API 呼叫失敗（HTTP ${status}）：${text}`;
  }

  async function industryAnalyzeByGemini({ apiKey, url, text }) {
    const prompt = `
你是產業分析師，請判斷該公司是否屬於：
- semiconductor（半導體）
- machining（加工產業，例如 CNC、精密加工、模具、治具）
- both / neither / unknown

【輸入】
網址：${url || "(未提供)"}
文字：${text || "(未提供)"}

判斷規則：
- 只根據輸入中明確出現的產品、製程或服務判斷。
- 公司名稱、部門或職稱不能單獨作為產業證據。
- semiconductor 與 machining 都有獨立明確證據時才輸出 both。
- 證據不足、內容矛盾或無法確認時輸出 unknown。

【輸出】
只輸出 JSON，繁體中文：
{
  "industry": "...",
  "confidence": 0-100,
  "reasons": ["..."],
  "evidence_keywords": ["..."]
}
`.trim();

    const endpoint = buildModelEndpoint(INDUSTRY_MODEL, apiKey);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: INDUSTRY_RESPONSE_SCHEMA,
          temperature: 0
        }
      })
    });

    const raw = await res.json();
    if (!res.ok) {
      throw new Error(explainGeminiError(res.status, raw));
    }

    const textOut = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) throw new Error("AI 沒回資料");

    const r = JSON.parse(textOut);
    const confidence = Math.max(0, Math.min(100, Number(r.confidence) || 0));
    const rawIndustry = INDUSTRY_VALUES.includes(r.industry) ? r.industry : "unknown";
    return {
      industry: confidence >= INDUSTRY_CONFIDENCE_THRESHOLD ? rawIndustry : "unknown",
      confidence,
      reasons: Array.isArray(r.reasons) ? r.reasons.map(String) : [],
      evidence_keywords: Array.isArray(r.evidence_keywords) ? r.evidence_keywords.map(String) : []
    };
  }

  // 名片辨識（Vision）
  async function recognizeBusinessCardByGeminiVision({ apiKey, file, promptText, responseSchema }) {
    const endpoint = buildModelEndpoint(BUSINESS_CARD_MODEL, apiKey);

    const imageBase64 = await fileToBase64(file);
    const mimeType = file.type || "image/jpeg";

    const body = {
      contents: [{
        role: "user",
        parts: [
          { text: promptText },
          { inlineData: { mimeType, data: imageBase64 } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // 回傳原始文字，主程式決定怎麼記錄 raw
    const rawText = await res.text();

    if (!res.ok) {
      // 讓主程式把 HTTP 狀態與內容一起呈現
      throw new Error(explainGeminiError(res.status, rawText));
    }

    // 這裡把 text parse 出來（因為 Gemini 有時回的是 JSON 包在 candidates）
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      // 如果回傳不是 JSON（極少），直接丟出去讓主程式記錄 raw
      throw new Error(`Response JSON parse failed: ${rawText}`);
    }

    const textOut = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || "")
      .join("")
      .trim();

    if (!textOut) {
      // 有些情況 candidates 為空，直接把整包 data 丟給主程式除錯
      throw new Error(`AI 沒回可解析內容：${JSON.stringify(data)}`);
    }

    return { textOut, data }; // textOut 給 JSON.parse、data 給 raw 除錯
  }

  // 檔案轉 base64（純工具）
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 將 API 掛到 window，讓 app.js 直接呼叫
  window.AI = {
    fetchWebsiteText,
    industryAnalyzeByGemini,
    recognizeBusinessCardByGeminiVision,
    normalizeUrl
  };

})();

/* =========================================================
   程式後註解（ai.js）
   - fetchWebsiteText：用 r.jina.ai 抓網站文字，提供產業判斷更多線索
   - industryAnalyzeByGemini：文字模型（便宜、穩）→ JSON 結果
   - recognizeBusinessCardByGeminiVision：Vision 模型（看圖）→ JSON Schema
   - app.js 負責「串流程」與「更新 UI」，ai.js 只做 AI 呼叫
   ========================================================= */
