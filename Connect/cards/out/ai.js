/* =========================================================
   ai.js

   功能：
   1. 透過 r.jina.ai 讀取公司網站文字
   2. 使用 Google Cloud Agent Platform 的 Gemini 判斷產業
   3. 使用 Gemini Vision 辨識名片

   注意：
   - 使用 Google Cloud Agent Platform API
   - 不要把正式 API Key 上傳到公開 GitHub
   ========================================================= */

(function () {
  "use strict";

  // Google Cloud Agent Platform API 網址
  const AGENT_PLATFORM_BASE_URL =
    "https://aiplatform.googleapis.com/v1/publishers/google/models";

  // 產業分析模型
  const INDUSTRY_MODEL = "gemini-2.5-flash";

  // 名片辨識模型
  // 如果出現 NOT_FOUND，可暫時改成 gemini-2.5-flash
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

  /**
   * 補齊網址的 https://
   */
  function normalizeUrl(url) {
    const value = (url || "").trim();

    if (!value) return "";

    return /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;
  }

  /**
   * 使用 r.jina.ai 讀取網站文字
   */
  async function fetchWebsiteText(url, timeoutMs = 9000) {
    const normalized = normalizeUrl(url);

    if (!normalized) return "";

    const readerUrl =
      "https://r.jina.ai/http://" +
      normalized.replace(/^https?:\/\//i, "");

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      timeoutMs
    );

    try {
      const response = await fetch(readerUrl, {
        signal: controller.signal
      });

      if (!response.ok) return "";

      const websiteText = await response.text();
      return cleanWebsiteText(websiteText);
    } catch (error) {
      console.warn("網站文字讀取失敗：", error);
      return "";
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 將 Gemini API 錯誤轉成中文訊息
   */
  function explainGeminiError(status, raw) {
    const text =
      typeof raw === "string"
        ? raw
        : JSON.stringify(raw || {});

    if (text.includes("API_KEY_INVALID")) {
      return "Google Cloud API Key 無效，請確認管理員後台中的金鑰是否正確。";
    }

    if (
      text.includes("PERMISSION_DENIED") ||
      text.includes("API_KEY_SERVICE_BLOCKED")
    ) {
      return "API Key 沒有 Agent Platform 使用權限，請確認 API 已啟用及金鑰限制設定。";
    }

    if (text.includes("RESOURCE_EXHAUSTED")) {
      return "Gemini 模型用量或 Google Cloud 配額已滿，請稍後再試。";
    }

    if (text.includes("NOT_FOUND")) {
      return "找不到指定的 Gemini 模型，請確認該模型是否支援目前的 Agent Platform 專案。";
    }

    if (text.includes("INVALID_ARGUMENT")) {
      return `送給 Gemini 的資料格式不正確（HTTP ${status}）：${text}`;
    }

    return `Gemini API 呼叫失敗（HTTP ${status}）：${text}`;
  }

  /**
   * 建立 Agent Platform 模型呼叫網址
   */
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

  /**
   * 使用 Gemini 分析公司產業
   */
  async function industryAnalyzeByGemini({
    apiKey,
    url,
    text
  }) {
    if (!apiKey) {
      throw new Error("尚未提供 Google Cloud API Key。");
    }

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

只輸出 JSON，內容使用繁體中文：

{
  "industry": "...",
  "confidence": 0-100,
  "reasons": ["..."],
  "evidence_keywords": ["..."]
}
`.trim();

    const endpoint = buildModelEndpoint(
      INDUSTRY_MODEL,
      apiKey
    );

    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],

        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: INDUSTRY_RESPONSE_SCHEMA,
          temperature: 0
        }
      })
    });

    const rawText = await response.text();

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(
        `Gemini 回傳內容不是有效 JSON：${rawText}`
      );
    }

    if (!response.ok) {
      throw new Error(
        explainGeminiError(response.status, data)
      );
    }

    const textOut = (
      data.candidates?.[0]?.content?.parts || []
    )
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!textOut) {
      throw new Error(
        `AI 沒有回傳可解析內容：${JSON.stringify(data)}`
      );
    }

    let result;

    try {
      result = JSON.parse(textOut);
    } catch {
      throw new Error(
        `產業分析結果不是有效 JSON：${textOut}`
      );
    }

    const confidence = Math.max(
      0,
      Math.min(100, Number(result.confidence) || 0)
    );
    const rawIndustry = INDUSTRY_VALUES.includes(result.industry)
      ? result.industry
      : "unknown";

    return {
      industry:
        confidence >= INDUSTRY_CONFIDENCE_THRESHOLD
          ? rawIndustry
          : "unknown",

      confidence,

      reasons:
        Array.isArray(result.reasons)
          ? result.reasons.map(String)
          : [],

      evidence_keywords:
        Array.isArray(result.evidence_keywords)
          ? result.evidence_keywords.map(String)
          : []
    };
  }

  /**
   * 使用 Gemini Vision 辨識名片
   */
  async function recognizeBusinessCardByGeminiVision({
    apiKey,
    file,
    promptText,
    responseSchema
  }) {
    if (!apiKey) {
      throw new Error("尚未提供 Google Cloud API Key。");
    }

    if (!file) {
      throw new Error("尚未選擇名片圖片。");
    }

    const endpoint = buildModelEndpoint(
      BUSINESS_CARD_MODEL,
      apiKey
    );

    const imageBase64 = await fileToBase64(file);
    const mimeType = file.type || "image/jpeg";

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: promptText
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],

      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(body)
    });

    // 保留完整回傳內容，方便除錯
    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(
        explainGeminiError(response.status, rawText)
      );
    }

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(
        `Gemini 回傳內容不是有效 JSON：${rawText}`
      );
    }

    const textOut = (
      data.candidates?.[0]?.content?.parts || []
    )
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!textOut) {
      throw new Error(
        `AI 沒有回傳可解析內容：${JSON.stringify(data)}`
      );
    }

    // textOut 提供給 app.js 解析
    // data 保留完整 API 回傳內容
    return {
      textOut,
      data
    };
  }

  /**
   * 將圖片檔案轉成 Base64
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || "");

        // 移除 data:image/...;base64, 前綴
        resolve(result.split(",")[1] || "");
      };

      reader.onerror = () => {
        reject(new Error("名片圖片讀取失敗。"));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * 掛到 window.AI
   * 讓 app.js 可以直接呼叫這些函式
   */
  window.AI = {
    fetchWebsiteText,
    industryAnalyzeByGemini,
    recognizeBusinessCardByGeminiVision,
    normalizeUrl
  };
})();

/* =========================================================
   程式結構說明

   normalizeUrl
   - 補齊網址的 https://

   fetchWebsiteText
   - 使用 r.jina.ai 抓取公司網站文字
   - 提供產業判斷更多依據

   industryAnalyzeByGemini
   - 使用 Gemini 文字模型分析公司產業
   - 回傳統一格式的 JSON

   recognizeBusinessCardByGeminiVision
   - 將名片圖片轉成 Base64
   - 使用 Gemini 多模態模型辨識
   - 依指定的 JSON Schema 回傳結果

   explainGeminiError
   - 將常見 Google Cloud API 錯誤轉成中文

   buildModelEndpoint
   - 建立 Agent Platform API 網址

   fileToBase64
   - 將瀏覽器選擇的圖片轉成 Base64

   app.js
   - 負責操作流程與更新畫面
   - ai.js 只負責網站讀取及 AI API 呼叫
   ========================================================= */
