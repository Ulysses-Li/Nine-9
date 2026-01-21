/* =========================================================
   ai.js
   - 讀網站（r.jina.ai）
   - 產業判斷（Gemini 文字模型）
   - 名片辨識（Gemini Vision）
   ========================================================= */

(function () {
  "use strict";

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
      return (text || "").slice(0, 8000); // 控制長度，避免提示詞太大
    } catch {
      return "";
    } finally {
      clearTimeout(timer);
    }
  }

  // 產業判斷（你昨天那版 JSON 規格）
  async function industryAnalyzeByGemini({ apiKey, url, text }) {
    const prompt = `
你是產業分析師，請判斷該公司是否屬於：
- semiconductor（半導體）
- machining（加工產業，例如 CNC、精密加工、模具、治具）
- both / neither / unknown

【輸入】
網址：${url || "(未提供)"}
文字：${text || "(未提供)"}

【輸出】
只輸出 JSON，繁體中文：
{
  "industry": "...",
  "confidence": 0-100,
  "reasons": ["..."],
  "evidence_keywords": ["..."]
}
`.trim();

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    const raw = await res.json();
    const textOut = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) throw new Error("AI 沒回資料");

    const r = JSON.parse(textOut);
    return {
      industry: (r.industry || "unknown").toString(),
      confidence: Number.isFinite(+r.confidence) ? +r.confidence : 0,
      reasons: Array.isArray(r.reasons) ? r.reasons.map(String) : [],
      evidence_keywords: Array.isArray(r.evidence_keywords) ? r.evidence_keywords.map(String) : []
    };
  }

  // 名片辨識（Vision）
  async function recognizeBusinessCardByGeminiVision({ apiKey, file, promptText, responseJsonSchema }) {
    const model = "gemini-3-flash-preview";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const imageBase64 = await fileToBase64(file);
    const mimeType = file.type || "image/jpeg";

    const body = {
      contents: [{
        parts: [
          { text: promptText },
          { inline_data: { mime_type: mimeType, data: imageBase64 } }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json",
        response_json_schema: responseJsonSchema
      }
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    });

    // 回傳原始文字，主程式決定怎麼記錄 raw
    const rawText = await res.text();

    if (!res.ok) {
      // 讓主程式把 HTTP 狀態與內容一起呈現
      throw new Error(`HTTP ${res.status}: ${rawText}`);
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
