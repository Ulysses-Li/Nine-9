/* =========================================================
   app.js
   - UI/流程主控：上傳 → 批次 → 顯示 → 匯出 → (可選)寫入Sheet
   - 依賴：ai.js（window.AI） / sheet.js（window.SheetWriter）
   ========================================================= */

(function () {
  "use strict";

  // 全域狀態
  let selectedImageFiles = [];
  let results = [];
  let viewOnlyOk = false;
  let selectedIndex = -1;

  // DOM 工具
  const el = (id) => document.getElementById(id);

  // Sheet 狀態訊息
  function setGsStatus(msg) {
    const box = el("gsStatus");
    if (box) box.innerText = msg || "";
  }

  // 區域劃分：只保留縣市
  function normalizeRegionToCityCounty(regionText, addressText) {
    const s = `${regionText || ""} ${addressText || ""}`.trim();
    if (!s) return "";

    const cityCounty = [
      "臺北市","台北市","新北市","桃園市","臺中市","台中市","臺南市","台南市","高雄市",
      "基隆市","新竹市","嘉義市",
      "新竹縣","苗栗縣","彰化縣","南投縣","雲林縣","嘉義縣","屏東縣","宜蘭縣",
      "花蓮縣","臺東縣","台東縣","澎湖縣","金門縣","連江縣"
    ];
    for (const cc of cityCounty) {
      if (s.includes(cc)) return cc.replace("臺", "台");
    }
    return "";
  }

  // 統編：只留 8 碼
  function normalizeTaxId(v) {
    const s = (v || "").toString();
    const m = s.match(/\b\d{8}\b/);
    return m ? m[0] : "";
  }

  // 統一結果格式（OK）
  // Export version: the region field is used as Country while keeping the same data key.
  function normalizeRegionToCountry(regionText, addressText) {
    const region = (regionText || "").trim();
    if (region) return region;

    const source = `${addressText || ""}`.trim();
    if (!source) return "";

    const countries = [
      "Taiwan", "China", "Japan", "Korea", "South Korea", "Singapore", "Malaysia", "Thailand",
      "Vietnam", "Indonesia", "Philippines", "India", "United States", "USA", "Canada",
      "Mexico", "Germany", "France", "Italy", "United Kingdom", "UK", "Netherlands",
      "Australia", "New Zealand", "台灣", "臺灣", "中國", "日本", "韓國", "新加坡", "馬來西亞",
      "泰國", "越南", "印尼", "菲律賓", "印度", "美國", "加拿大", "墨西哥", "德國", "法國",
      "義大利", "英國", "荷蘭", "澳洲", "紐西蘭"
    ];

    return countries.find((country) => source.toLowerCase().includes(country.toLowerCase())) || "";
  }

  function normalizeEmail(v) {
    const value = String(v || "").trim().toLowerCase().replace(/^mailto:/, "");
    const match = value.match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    return match ? match[0] : "";
  }

  function makeOkResult(o) {
    const country = normalizeRegionToCountry(o.region, o.companyAddr);
    return {
      ok: true,
      error: "",
      lastName: o.lastName || "",
      firstName: o.firstName || "",
      companyName: o.companyName || "",
      companyTel: o.companyTel || "",
      email: (o.email || "").toLowerCase(),
      department: o.department || "",
      jobTitle: o.jobTitle || "",
      companyAddr: o.companyAddr || "",
      companyFax: o.companyFax || "",
      mobilePhone: o.mobilePhone || "",
      website: o.website || "",
      region: country || "",
      taxId: normalizeTaxId(o.taxId),
      note: o.note || "",
      fileName: o.fileName || "",

      industry: o.industry || "unknown",
      confidence: Number.isFinite(+o.confidence) ? +o.confidence : 0,
      reasons: Array.isArray(o.reasons) ? o.reasons : [],
      evidence_keywords: Array.isArray(o.evidence_keywords) ? o.evidence_keywords : []
    };
  }

  function makeFailResult(fileName, errorMsg, raw = "") {
    return {
      ok: false,
      error: errorMsg || "Unknown error",
      lastName: "",
      firstName: "",
      companyName: "",
      companyTel: "",
      email: "",
      department: "",
      jobTitle: "",
      companyAddr: "",
      companyFax: "",
      mobilePhone: "",
      website: "",
      region: "",
      taxId: "",
      note: "",
      fileName: fileName || "",
      raw,
      industry: "unknown",
      confidence: 0,
      reasons: [],
      evidence_keywords: []
    };
  }

  // 狀態條
  function setStatus(msg, mode = "ready") {
    el("status").innerText = msg || "";
    const pill = el("statusPill");
    pill.style.display = "inline-block";
    pill.textContent = mode === "run" ? "Running" : (mode === "ok" ? "Done" : (mode === "bad" ? "Error" : "Ready"));
    pill.className = "pill " + (mode === "bad" ? "pill-bad" : "pill-ok");
  }

  // Key：存/讀
  function refreshBtnState() {
    const hasKey = el("aiKey").value.trim().length > 0;
    const hasImg = selectedImageFiles.length > 0;
    el("btnAI").disabled = !(hasKey && hasImg);
  }

  function saveKeyIfNeeded() {
    const save = el("saveKeyLocal").checked;
    const key = el("aiKey").value.trim();
    if (save && key) localStorage.setItem("GEMINI_API_KEY", key);
    if (!save) localStorage.removeItem("GEMINI_API_KEY");
  }

  function loadKey() {
    const saved = localStorage.getItem("GEMINI_API_KEY") || "";
    el("aiKey").value = saved;
    setStatus(saved ? "已載入本機 Key。" : "本機沒有 Key。", saved ? "ready" : "bad");
    refreshBtnState();
  }

  function clearKey() {
    el("aiKey").value = "";
    localStorage.removeItem("GEMINI_API_KEY");
    setStatus("已清除 Key。", "ready");
    refreshBtnState();
  }

  // 表格渲染
  function escapeHtml(str) {
    return (str ?? "").toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderTable() {
    const tbody = el("resultTbody");
    tbody.innerHTML = "";

    const data = viewOnlyOk ? results.filter(r => r.ok) : results;

    if (selectedImageFiles.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="subtle py-4 text-center">尚未上傳圖片</td></tr>`;
      return;
    }
    if (results.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="subtle py-4 text-center">尚未辨識（請按「開始批次辨識」）</td></tr>`;
      return;
    }
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="subtle py-4 text-center">目前沒有符合條件的資料</td></tr>`;
      return;
    }

    data.forEach((r) => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";

      const fullName = `${r.firstName || ""} ${r.lastName || ""}`.trim() || "（未辨識姓名）";
      const statusHtml = r.ok ? `<span class="pill pill-ok">OK</span>` : `<span class="pill pill-bad">Fail</span>`;

      tr.innerHTML = `
        <td>${statusHtml}</td>
        <td>
          <div class="fw-semibold">${escapeHtml(fullName)}</div>
          ${r.ok ? "" : `<div class="subtle text-danger">${escapeHtml(r.error || "")}</div>`}
        </td>
        <td>${escapeHtml(r.companyName || "")}</td>
        <td>${escapeHtml(r.industry || "unknown")}</td>
        <td>${escapeHtml((r.email || "").toLowerCase())}</td>
        <td class="text-truncate" style="max-width:160px;" title="${escapeHtml(r.fileName || "")}">
          ${escapeHtml(r.fileName || "")}
        </td>
      `;

      tr.addEventListener("click", () => {
        const idx = results.indexOf(r);
        selectedIndex = idx;
        fillFields(r);
        fillIndustryUI(r);
        el("selectedInfo").innerText = r.fileName ? `已選取：${r.fileName}` : "已選取";
      });

      tbody.appendChild(tr);
    });
  }

  function updateStats() {
    const total = selectedImageFiles.length;
    const ok = results.filter(r => r.ok).length;
    const fail = results.filter(r => !r.ok).length;
    el("statTotal").innerText = total;
    el("statOk").innerText = ok;
    el("statFail").innerText = fail;
  }

  function showOnlyOk(flag) {
    viewOnlyOk = !!flag;
    renderTable();
  }

  // 詳細欄位
  function fillFields(o) {
    el("fLastName").value = o.lastName || "";
    el("fFirstName").value = o.firstName || "";
    el("fCompanyName").value = o.companyName || "";
    el("fCompanyTel").value = o.companyTel || "";
    el("fMobilePhone").value = o.mobilePhone || "";
    el("fCompanyFax").value = o.companyFax || "";
    el("fEmail").value = (o.email || "").toLowerCase();
    el("fDepartment").value = o.department || "";
    el("fJobTitle").value = o.jobTitle || "";
    el("fCompanyAddr").value = o.companyAddr || "";
    el("fWebsite").value = o.website || "";
    el("fRegion").value = o.region || "";
    el("fTaxId").value = o.taxId || "";
    el("fNote").value = o.note || "";
    el("fFileName").value = o.fileName || "";
  }

  function clearFields() {
    const ids = [
      "fLastName","fFirstName","fCompanyName","fCompanyTel","fMobilePhone","fCompanyFax",
      "fEmail","fDepartment","fJobTitle","fCompanyAddr","fWebsite","fRegion","fTaxId","fNote","fFileName"
    ];
    ids.forEach(id => el(id).value = "");
    el("selectedInfo").innerText = "未選取";
  }

  // 產業 UI
  function clearIndustryUI() {
    el("iBadge").textContent = "—";
    el("iBadge").className = "pill pill-ok";
    el("iIndustry").textContent = "—";
    el("iConfidence").textContent = "—";
    el("iReasons").innerHTML = "";
    el("iKeywords").innerHTML = "";
  }

  function fillIndustryUI(o) {
    const industry = (o.industry || "unknown").toString();
    const conf = Number.isFinite(+o.confidence) ? +o.confidence : 0;

    el("iIndustry").textContent = industry;
    el("iConfidence").textContent = `${conf} / 100`;

    const badge = el("iBadge");
    badge.textContent = industry;
    badge.className = "pill " + (conf >= 70 ? "pill-ok" : "pill-bad");

    const reasons = el("iReasons");
    reasons.innerHTML = "";
    (o.reasons || []).forEach(x => {
      const li = document.createElement("li");
      li.textContent = x;
      reasons.appendChild(li);
    });

    const keywords = el("iKeywords");
    keywords.innerHTML = "";
    (o.evidence_keywords || []).forEach(k => {
      const span = document.createElement("span");
      span.className = "kw";
      span.textContent = k;
      keywords.appendChild(span);
    });
  }

  // 清空
  function resetAll() {
    selectedImageFiles = [];
    results = [];
    selectedIndex = -1;

    el("imageInput").value = "";
    el("previewList").innerHTML = "";
    el("previewHint").style.display = "block";
    el("fileCount").innerText = "0 張";

    clearFields();
    clearIndustryUI();
    el("rawAI").value = "";
    renderTable();
    updateStats();
    setStatus("已清空。", "ready");
    setGsStatus("");
    refreshBtnState();
  }

  // 匯出：JSON / CSV
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const tmp = document.createElement("textarea");
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
  }

  async function copyAsJSON() {
    const payload = (results && results.length > 0) ? results : [];
    await copyToClipboard(JSON.stringify(payload, null, 2));
    alert("JSON 已複製");
  }

  function csvEscape(v) {
    const s = (v ?? "").toString();
    return /[,"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  async function copyAsCSV() {
    const headers = [
      "姓氏","名字","公司名稱","公司電話","電子郵件","部門","職稱","公司地址","公司傳真",
      "手機電話","公司網址","國家","統編","附註","檔案名稱",
      "industry","confidence","reasons","evidence_keywords",
      "OK","Error"
    ];

    const payload = (results && results.length > 0) ? results : [];

    const rows = payload.map(r => ([
      r.lastName || "",
      r.firstName || "",
      r.companyName || "",
      r.companyTel || "",
      (r.email || "").toLowerCase(),
      r.department || "",
      r.jobTitle || "",
      r.companyAddr || "",
      r.companyFax || "",
      r.mobilePhone || "",
      r.website || "",
      r.region || "",
      r.taxId || "",
      r.note || "",
      r.fileName || "",
      r.industry || "",
      (Number.isFinite(+r.confidence) ? +r.confidence : 0),
      (Array.isArray(r.reasons) ? r.reasons.join(" | ") : ""),
      (Array.isArray(r.evidence_keywords) ? r.evidence_keywords.join(" | ") : ""),
      r.ok ? "Y" : "N",
      r.error || ""
    ].map(csvEscape).join(",")));

    const csv = headers.join(",") + "\n" + rows.join("\n");
    await copyToClipboard(csv);
    alert("CSV 已複製（可直接貼到 Excel）");
  }

  // 手動判斷器
  async function manualAnalyze() {
    const apiKey = el("aiKey").value.trim();
    if (!apiKey) {
      el("mError").style.display = "block";
      el("mError").textContent = "請先設定 Google Cloud Agent Platform API Key";
      return;
    }

    el("mError").style.display = "none";
    el("mResult").style.display = "none";

    const url = el("mUrlInput").value.trim();
    const text = el("mTextInput").value.trim();

    if (!url && !text) {
      el("mError").style.display = "block";
      el("mError").textContent = "請至少輸入網址或文字";
      return;
    }

    el("mLoading").style.display = "block";

    try {
      let websiteText = "";
      if (url) {
        websiteText = await window.AI.fetchWebsiteText(url);
      }

      const mergedText = [
        text || "",
        websiteText ? `網站內容：${websiteText}` : ""
      ].filter(Boolean).join("\n");

      const r = await window.AI.industryAnalyzeByGemini({ apiKey, url, text: mergedText });

      el("mIndustry").textContent = r.industry;
      el("mConfidence").textContent = `${r.confidence} / 100`;

      const b = el("mBadge");
      b.textContent = r.industry;
      b.className = "pill " + (r.confidence >= 70 ? "pill-ok" : "pill-bad");

      const reasons = el("mReasons");
      reasons.innerHTML = "";
      (r.reasons || []).forEach(x => {
        const li = document.createElement("li");
        li.textContent = x;
        reasons.appendChild(li);
      });

      const keywords = el("mKeywords");
      keywords.innerHTML = "";
      (r.evidence_keywords || []).forEach(k => {
        const span = document.createElement("span");
        span.className = "kw";
        span.textContent = k;
        keywords.appendChild(span);
      });

      el("mResult").style.display = "block";
    } catch (e) {
      el("mError").style.display = "block";
      el("mError").textContent = e.message || "分析失敗";
    } finally {
      el("mLoading").style.display = "none";
    }
  }

  // ✅ 批次主流程（名片→產業→結果→可寫入Sheet）
  async function runGeminiVision() {
    const apiKey = el("aiKey").value.trim();
    if (!apiKey) return alert("請先設定 Google Cloud Agent Platform API Key");
    if (selectedImageFiles.length === 0) return alert("請先上傳名片圖片（可多張）");

    const enableWebsiteCheck = true;

    // Sheet 設定
    const enableWriteSheet = true;
    const gasUrlInput = (el("gsGasUrl")?.value || "").trim();
    const sheetUrlInput = (el("gsSheetUrl")?.value || "").trim();
    const sheetNameInput = (el("gsSheetName")?.value || "名片資料").trim();

    setGsStatus("");

    el("btnAI").disabled = true;
    results = [];
    selectedIndex = -1;
    el("rawAI").value = "";
    renderTable();
    updateStats();
    clearIndustryUI();

    // Vision prompt
    const promptText = `
你是名片辨識助手。請直接從名片圖片擷取資訊，並嚴格依照 JSON Schema 輸出。
規則：
- 抓不到的欄位請填 ""（空字串）
- email 請小寫
- lastName/firstName：
  - 中文姓名：通常第一個字為姓，其餘為名
  - 英文姓名：最後一個詞當 lastName，其餘當 firstName（例如 "Cheng-Wei Li" -> lastName:"Li", firstName:"Cheng-Wei"）
- companyTel：以公司市話/總機為主；mobilePhone：以手機為主；companyFax：傳真
- website：抓網址（含 www 或 http），沒有就 ""
- department / jobTitle：抓部門與職稱
- region：外銷版請只輸出「國家」，例如「Japan / United States / Germany / Singapore / 台灣」。不要輸出完整地址、不要輸出縣市。
- taxId：若看到「統編/統一編號」請抓 8 碼數字，否則 ""
- note：若名片上沒有備註，填 ""
- fileName 欄位請輸出 ""（程式會用圖片檔名覆蓋）
`.trim();

    const responseSchema = {
      type: "object",
      properties: {
        lastName: { type: "string", description: "名片持有人的姓氏；無法辨識時輸出空字串。" },
        firstName: { type: "string", description: "名片持有人的名字；無法辨識時輸出空字串。" },
        companyName: { type: "string", description: "名片上印製的公司或組織完整名稱。" },
        companyTel: { type: "string", description: "公司市話或總機，保留國碼與分機。" },
        email: { type: "string", description: "完整電子郵件地址，統一使用小寫。" },
        department: { type: "string", description: "名片持有人的部門。" },
        jobTitle: { type: "string", description: "名片持有人的職稱。" },
        companyAddr: { type: "string", description: "名片上完整公司地址。" },
        companyFax: { type: "string", description: "公司傳真號碼，不能與市話或手機混用。" },
        mobilePhone: { type: "string", description: "名片持有人的手機號碼，保留國碼。" },
        website: { type: "string", description: "公司網站網址；名片未提供時輸出空字串。" },
        region: { type: "string", description: "公司所在國家，例如Japan、United States或台灣；不要輸出完整地址或城市。" },
        taxId: { type: "string", description: "台灣統一編號的八位數字；未出現或不足八碼時輸出空字串。" },
        note: { type: "string", description: "名片上其他明確文字備註；不要自行推測。" },
        fileName: { type: "string", description: "固定輸出空字串，由程式填入圖片檔名。" }
      },
      required: [
        "lastName","firstName","companyName","companyTel","email",
        "department","jobTitle","companyAddr","companyFax","mobilePhone",
        "website","region","taxId","note","fileName"
      ]
    };

    try {
      setStatus("開始批次辨識…", "run");

      for (let i = 0; i < selectedImageFiles.length; i++) {
        const file = selectedImageFiles[i];
        setStatus(`名片辨識中 (${i + 1}/${selectedImageFiles.length})：${file.name}`, "run");

        try {
          // 1) Vision 取得名片欄位
          const { textOut, data } = await window.AI.recognizeBusinessCardByGeminiVision({
            apiKey,
            file,
            promptText,
            responseSchema
          });

          el("rawAI").value += `\n\n===== ${file.name} =====\n` + (textOut || JSON.stringify(data, null, 2));

          let obj;
          try {
            obj = JSON.parse(textOut);
          } catch (parseErr) {
            results.push(makeFailResult(file.name, `JSON parse failed: ${parseErr.message}`, textOut));
            renderTable(); updateStats();
            continue;
          }

          // 正規化
          obj.fileName = file.name;
          obj.email = normalizeEmail(obj.email);
          obj.region = normalizeRegionToCountry(obj.region, obj.companyAddr);
          obj.taxId = normalizeTaxId(obj.taxId);

          // 2) 產業判斷：可選抓網站
          let websiteText = "";
          if (enableWebsiteCheck && (obj.website || "").trim()) {
            setStatus(`抓網站內容 (${i + 1}/${selectedImageFiles.length})：${file.name}`, "run");
            websiteText = await window.AI.fetchWebsiteText(obj.website);
          }

          setStatus(`產業判斷中 (${i + 1}/${selectedImageFiles.length})：${file.name}`, "run");

          const industryText = [
            obj.companyName, obj.department, obj.jobTitle, obj.companyAddr, obj.note,
            websiteText ? `網站內容：${websiteText}` : ""
          ].filter(Boolean).join("\n");

          let ind;
          try {
            ind = await window.AI.industryAnalyzeByGemini({
              apiKey,
              url: (obj.website || "").trim(),
              text: industryText
            });
          } catch {
            ind = { industry: "unknown", confidence: 0, reasons: [], evidence_keywords: [] };
          }

          obj.industry = ind.industry;
          obj.confidence = ind.confidence;
          obj.reasons = ind.reasons;
          obj.evidence_keywords = ind.evidence_keywords;

          const okItem = makeOkResult(obj);
          results.push(okItem);

          selectedIndex = results.length - 1;
          fillFields(okItem);
          fillIndustryUI(okItem);
          el("selectedInfo").innerText = okItem.fileName ? `已選取：${okItem.fileName}` : "已選取";

        } catch (e) {
          // Vision HTTP error 或其他錯誤
          results.push(makeFailResult(file.name, e.message || String(e)));
          el("rawAI").value += `\n\n===== ${file.name} (ERROR) =====\n${e.message || String(e)}`;
        }

        renderTable();
        updateStats();
      }

      const okCount = results.filter(r => r.ok).length;
      setStatus(`完成：成功 ${okCount} / ${selectedImageFiles.length}`, okCount === 0 ? "bad" : "ok");

      // 3) 批次完成後 → 寫入 Google Sheet（只寫成功）
      try {
        if (enableWriteSheet) {
          if (!gasUrlInput) throw new Error("你勾了寫入 Sheet，但沒有填 GAS Web App URL");
          if (!sheetUrlInput) throw new Error("你勾了寫入 Sheet，但沒有填 Google Sheet 連結");

          setGsStatus("📤 寫入 Google Sheet 中…");

          const rows = results.filter(r => r.ok);
          if (rows.length === 0) {
            setGsStatus("沒有成功辨識的資料，已略過寫入 Google Sheet。");
            return;
          }

          const resp = await window.SheetWriter.writeToGoogleSheet({
            gasUrl: gasUrlInput,
            sheetUrl: sheetUrlInput,
            sheetName: sheetNameInput,
            rows
          });

          setGsStatus(`✅ 已寫入 ${resp.wrote ?? rows.length} 筆到：${sheetNameInput}`);
        } else {
          setGsStatus("（未啟用自動寫入 Google Sheet）");
        }
      } catch (e) {
        setGsStatus("❌ 寫入失敗：" + (e.message || e));
      }

    } catch (e) {
      console.error(e);
      setStatus("批次失敗：" + (e.message || e), "bad");
      alert("批次辨識失敗：請檢查 Key/模型/網路，或看 raw 回應與 console");
    } finally {
      refreshBtnState();
    }
  }

  // 上傳事件
  function onImagesSelected(files) {
    if (!files || files.length === 0) return;

    selectedImageFiles = files;
    results = [];
    selectedIndex = -1;

    el("previewList").innerHTML = "";
    files.forEach(f => {
      const img = document.createElement("img");
      img.className = "thumb";
      img.src = URL.createObjectURL(f);
      img.title = f.name;
      el("previewList").appendChild(img);
    });
    el("previewHint").style.display = "none";

    clearFields();
    clearIndustryUI();
    el("rawAI").value = "";
    renderTable();
    updateStats();

    el("fileCount").innerText = `${files.length} 張`;
    setStatus(`已選擇 ${files.length} 張圖片，準備辨識。`, "ready");
    refreshBtnState();
  }

  // 事件綁定
  function bindEvents() {
    el("aiKey").addEventListener("input", () => { saveKeyIfNeeded(); refreshBtnState(); });
    el("saveKeyLocal").addEventListener("change", saveKeyIfNeeded);

    el("btnLoadKey").addEventListener("click", loadKey);
    el("btnClearKey").addEventListener("click", clearKey);

    el("btnResetAll").addEventListener("click", resetAll);
    el("btnAI").addEventListener("click", runGeminiVision);

    el("btnCopyJSON").addEventListener("click", copyAsJSON);
    el("btnCopyCSV").addEventListener("click", copyAsCSV);
    el("btnCopyCSV2").addEventListener("click", copyAsCSV);

    el("btnShowAll").addEventListener("click", () => showOnlyOk(false));
    el("btnShowOk").addEventListener("click", () => showOnlyOk(true));

    el("btnManualAnalyze").addEventListener("click", manualAnalyze);

    el("btnClearRaw").addEventListener("click", () => { el("rawAI").value = ""; });

    el("imageInput").addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      onImagesSelected(files);
    });
  }

  // init
  (function init() {
    bindEvents();

    const saved = localStorage.getItem("GEMINI_API_KEY") || "";
    if (saved) {
      el("aiKey").value = saved;
      el("saveKeyLocal").checked = true;
      setStatus("已載入本機 Key（可直接上傳圖片開始）", "ready");
    } else {
      setStatus("請先貼上 Key，並上傳名片圖片。", "ready");
    }

    refreshBtnState();
    renderTable();
    updateStats();
    clearIndustryUI();
    setGsStatus("");
  })();

})();

/* =========================================================
   程式後註解（app.js）
   你可以把 app.js 當成「總指揮」：
   - 它不直接寫 AI，也不直接寫 Sheet
   - 它只負責：拿到圖片 → 呼叫 AI → 組合結果 → 更新 UI → (可選)寫入 Sheet

   你要除錯時：
   - AI 出錯：看 ai.js（fetchWebsiteText / recognize... / industryAnalyze...）
   - Sheet 寫入出錯：看 sheet.js（validateGasUrl / validateSheetUrl / writeToGoogleSheet）
   - UI/流程出錯：看 app.js（runGeminiVision / renderTable / fillFields）
   ========================================================= */
