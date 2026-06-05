/* =========================================================
   sheet.js
   - 驗證 GAS / Sheet URL
   - 呼叫 GAS Web App doPost 寫入 Google Sheet
   ========================================================= */

(function () {
  "use strict";

  function extractSheetId(sheetUrl) {
    const m = String(sheetUrl || "").match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : "";
  }

  function validateGasUrl(gasUrl) {
    const u = (gasUrl || "").trim();
    if (!u) return "請填 GAS Web App URL";
    if (!/^https:\/\/script\.google\.com\/macros\/s\//i.test(u)) return "GAS URL 看起來不對（要是 script.google.com/macros/s/.../exec）";
    if (!/\/exec(\?.*)?$/i.test(u)) return "GAS URL 必須是 /exec 結尾";
    return "";
  }

  function validateSheetUrl(sheetUrl) {
    const u = (sheetUrl || "").trim();
    if (!u) return "請貼 Google Sheet URL";
    if (u.includes("script.google.com")) return "你貼的是 GAS URL，不是 Google Sheet URL";
    if (!extractSheetId(u)) return "Google Sheet URL 格式錯誤（找不到 /spreadsheets/d/...）";
    return "";
  }

  async function writeToGoogleSheet({ gasUrl, sheetUrl, sheetName, rows }) {
    const gasErr = validateGasUrl(gasUrl);
    if (gasErr) throw new Error(gasErr);

    const sheetErr = validateSheetUrl(sheetUrl);
    if (sheetErr) throw new Error(sheetErr);

    const payload = {
      sheetUrl,
      sheetName: (sheetName || "名片資料").trim(),
      rows: Array.isArray(rows) ? rows : []
    };

    if (payload.rows.length === 0) throw new Error("沒有可寫入的 rows");

    const res = await fetch(gasUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // GAS 最穩
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || `Write sheet failed (${res.status})`);
    }
    return data;
  }

  window.SheetWriter = {
    extractSheetId,
    validateGasUrl,
    validateSheetUrl,
    writeToGoogleSheet
  };

})();

/* =========================================================
   程式後註解（sheet.js）
   - validateGasUrl：避免你把 /dev、deployment id、或缺 /exec 的網址貼進去
   - validateSheetUrl：避免你把 GAS URL 貼到 Sheet 欄位（你之前就是這個錯）
   - writeToGoogleSheet：只負責 POST → GAS，回傳 ok/wrote
   ========================================================= */
