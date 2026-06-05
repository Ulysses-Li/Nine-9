import { auth, db } from "../../app/js/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const ids = {
  aiKey: "aiKey",
  gasWebAppUrl: "gsGasUrl",
  googleSheetUrl: "gsSheetUrl",
  sheetName: "gsSheetName",
  status: "status",
  gsStatus: "gsStatus",
  saveKeyLocal: "saveKeyLocal",
  managedKeyStatus: "managedKeyStatus",
  managedGasStatus: "managedGasStatus",
  managedSheetStatus: "managedSheetStatus",
  managedSheetNameStatus: "managedSheetNameStatus"
};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    setStatus("尚未登入會員系統，請先登入後再使用名片工具。", "bad");
    setSheetStatus("無法讀取會員工具設定。");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      setStatus("找不到會員資料，請回登入頁重新登入。", "bad");
      setSheetStatus("無法讀取會員工具設定。");
      return;
    }

    const saveKeyLocal = document.getElementById(ids.saveKeyLocal);
    if (saveKeyLocal) {
      saveKeyLocal.checked = false;
      saveKeyLocal.disabled = true;
    }
    localStorage.removeItem("GEMINI_API_KEY");

    const profile = snap.data();
    const geminiApiKey = profile.geminiApiKey || "";
    const gasWebAppUrl = firstValue(profile.businessCardsGasWebAppUrl, profile.gasWebAppUrl);
    const googleSheetUrl = firstValue(profile.businessCardsGoogleSheetUrl, profile.googleSheetUrl);
    const sheetName = firstValue(profile.businessCardsSheetName, profile.sheetName) || "名片資料";

    applyInput(ids.aiKey, geminiApiKey);
    applyInput(ids.gasWebAppUrl, gasWebAppUrl);
    applyInput(ids.googleSheetUrl, googleSheetUrl);
    applyInput(ids.sheetName, sheetName);

    setManagedStatus(ids.managedKeyStatus, geminiApiKey ? "已由管理員設定" : "尚未設定，請到會員工作台申請。");
    setManagedStatus(ids.managedGasStatus, gasWebAppUrl ? "已由管理員設定：名片批次辨識工具" : "尚未設定，請到會員工作台申請。");
    setManagedStatus(ids.managedSheetStatus, googleSheetUrl ? "已由管理員設定：名片批次辨識工具" : "尚未設定，請到會員工作台申請。");
    setManagedStatus(ids.managedSheetNameStatus, sheetName || "尚未設定，預設使用：名片資料");

    const missing = [];
    if (!geminiApiKey) missing.push("Gemini API Key");
    if (!gasWebAppUrl) missing.push("名片批次辨識 GAS Web App URL");
    if (!googleSheetUrl) missing.push("名片批次辨識 Google Sheet 連結");
    if (!sheetName) missing.push("名片批次辨識工作表名稱");

    if (missing.length > 0) {
      setStatus(`名片批次辨識工具設定尚未完整：${missing.join("、")}。`, "bad");
      setSheetStatus("已載入可用設定，但仍有欄位未設定。");
      return;
    }

    setStatus("已從會員資料載入名片批次辨識工具設定，可以上傳名片開始辨識。", "ready");
    setSheetStatus("已載入管理員提供的名片批次辨識 Google Sheet 設定。");
  } catch (error) {
    console.error(error);
    setStatus(`讀取會員工具設定失敗：${error.code || error.message}`, "bad");
    setSheetStatus("請確認 Firebase 權限與網路連線。");
  }
});

function firstValue(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function applyInput(id, value) {
  const input = document.getElementById(id);
  if (!input) return;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function setStatus(message, mode = "ready") {
  const status = document.getElementById(ids.status);
  const pill = document.getElementById("statusPill");

  if (status) status.innerText = message;

  if (pill) {
    pill.style.display = "inline-block";
    pill.textContent = mode === "bad" ? "Error" : "Ready";
    pill.className = `pill ${mode === "bad" ? "pill-bad" : "pill-ok"}`;
  }
}

function setSheetStatus(message) {
  const status = document.getElementById(ids.gsStatus);
  if (status) status.innerText = message;
}

function setManagedStatus(id, message) {
  const status = document.getElementById(id);
  if (status) status.innerText = message;
}
