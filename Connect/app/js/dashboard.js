import { db } from "./firebase.js";
import { requireLogin, logout, normalizeRole } from "./auth-guard.js";
import { doc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userJobTitle = document.getElementById("userJobTitle");
const userRole = document.getElementById("userRole");
const userRoleBadge = document.getElementById("userRoleBadge");
const userStatus = document.getElementById("userStatus");
const userStatusBadge = document.getElementById("userStatusBadge");
const userAvatar = document.getElementById("userAvatar");
const userUid = document.getElementById("userUid");
const profileNameValue = document.getElementById("profileNameValue");
const profileAgeValue = document.getElementById("profileAgeValue");
const profileGenderValue = document.getElementById("profileGenderValue");
const profileJobTitleValue = document.getElementById("profileJobTitleValue");
const profileMarketTypeValue = document.getElementById("profileMarketTypeValue");
const profileEmailValue = document.getElementById("profileEmailValue");
const navLoginName = document.getElementById("navLoginName");
const toolReadyText = document.getElementById("toolReadyText");
const businessToolLink = document.getElementById("businessToolLink");
const userGeminiApiKey = document.getElementById("userGeminiApiKey");
const userGasWebAppUrl = document.getElementById("userGasWebAppUrl");
const userGoogleSheetUrl = document.getElementById("userGoogleSheetUrl");
const userSheetName = document.getElementById("userSheetName");
const dashboardMsg = document.getElementById("dashboardMsg");
const adminLink = document.getElementById("adminLink");
const logoutBtn = document.getElementById("logoutBtn");
const requestGeminiApiKey = document.getElementById("requestGeminiApiKey");
const requestGasWebAppUrl = document.getElementById("requestGasWebAppUrl");
const requestGoogleSheetUrl = document.getElementById("requestGoogleSheetUrl");
const requestSheetName = document.getElementById("requestSheetName");
const openGasWebAppUrl = document.getElementById("openGasWebAppUrl");
const openGoogleSheetUrl = document.getElementById("openGoogleSheetUrl");
const workspaceHero = document.querySelector(".workspace-hero");

let currentSettings = {};
let currentUserUid = "";

const requestFields = {
  geminiApiKey: {
    label: "Google Cloud Agent Platform API Key",
    statusField: "geminiApiKeyRequestStatus",
    requestedAtField: "geminiApiKeyRequestedAt",
    button: requestGeminiApiKey,
    valueEl: userGeminiApiKey
  },
  businessCardsGasWebAppUrl: {
    label: "名片批次辨識 GAS Web App URL",
    statusField: "businessCardsGasWebAppUrlRequestStatus",
    requestedAtField: "businessCardsGasWebAppUrlRequestedAt",
    button: requestGasWebAppUrl,
    valueEl: userGasWebAppUrl
  },
  businessCardsGoogleSheetUrl: {
    label: "名片批次辨識 Google Sheet 連結",
    statusField: "businessCardsGoogleSheetUrlRequestStatus",
    requestedAtField: "businessCardsGoogleSheetUrlRequestedAt",
    button: requestGoogleSheetUrl,
    valueEl: userGoogleSheetUrl
  },
  businessCardsSheetName: {
    label: "名片批次辨識工作表名稱",
    statusField: "businessCardsSheetNameRequestStatus",
    requestedAtField: "businessCardsSheetNameRequestedAt",
    button: requestSheetName,
    valueEl: userSheetName
  }
};

function firstValue(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

requireLogin((user, profile) => {
  currentUserUid = user.uid;
  const displayName = profile.name || user.displayName || "未命名會員";
  const email = profile.email || user.email || "-";
  const jobTitle = profile.jobTitle || "尚未設定職位";
  const marketType = profile.marketType || "";
  const age = calculateAge(profile.birthDate);
  const gender = normalizeGender(profile.gender);
  const role = normalizeRole(profile, user);
  const status = profile.status || "active";

  currentSettings = {
    geminiApiKey: profile.geminiApiKey || "",
    geminiApiKeyRequestStatus: profile.geminiApiKeyRequestStatus || "",
    businessCardsGasWebAppUrl: firstValue(profile.businessCardsGasWebAppUrl, profile.gasWebAppUrl),
    businessCardsGasWebAppUrlRequestStatus: firstValue(profile.businessCardsGasWebAppUrlRequestStatus, profile.gasWebAppUrlRequestStatus),
    businessCardsGoogleSheetUrl: firstValue(profile.businessCardsGoogleSheetUrl, profile.googleSheetUrl),
    businessCardsGoogleSheetUrlRequestStatus: firstValue(profile.businessCardsGoogleSheetUrlRequestStatus, profile.googleSheetUrlRequestStatus),
    businessCardsSheetName: firstValue(profile.businessCardsSheetName, profile.sheetName),
    businessCardsSheetNameRequestStatus: firstValue(profile.businessCardsSheetNameRequestStatus, profile.sheetNameRequestStatus)
  };

  userAvatar.textContent = "";
  userAvatar.className = `profile-avatar profile-avatar-lg hero-gender-anchor ${genderClass(gender)}`;
  userAvatar.setAttribute("aria-hidden", "true");
  workspaceHero?.classList.remove("is-male", "is-female", "is-undisclosed");
  workspaceHero?.classList.add("has-gender-backdrop", genderClass(gender));
  workspaceHero?.setAttribute("aria-label", `目前登入者，性別：${genderToChinese(gender)}`);
  userName.textContent = displayName;
  userEmail.textContent = email;
  userJobTitle.textContent = jobTitle;
  profileNameValue.textContent = displayName;
  profileAgeValue.textContent = age ? `${age} 歲` : "尚未設定";
  profileGenderValue.textContent = genderToChinese(gender);
  profileJobTitleValue.textContent = jobTitle;
  profileMarketTypeValue.textContent = marketTypeToChinese(marketType);
  profileEmailValue.textContent = email;
  configureBusinessToolLink(marketType);
  navLoginName.textContent = `登入者：${displayName}`;
  userUid.textContent = shortUid(user.uid);
  userRole.textContent = roleToChinese(role);
  userRoleBadge.textContent = roleToChinese(role);
  userRoleBadge.className = `member-badge ${role === "super_admin" ? "is-super-admin" : role === "admin" ? "is-admin" : "is-user"}`;
  userStatus.textContent = statusToChinese(status);
  userStatusBadge.textContent = statusToChinese(status);
  userStatusBadge.className = `member-badge ${status === "disabled" ? "is-disabled" : "is-active"}`;

  renderSettings();

  if (["admin", "super_admin"].includes(role)) {
    adminLink.classList.remove("d-none");
  }
});

logoutBtn.addEventListener("click", logout);
requestGeminiApiKey.addEventListener("click", () => requestToolSetting("geminiApiKey"));
requestGasWebAppUrl.addEventListener("click", () => requestToolSetting("businessCardsGasWebAppUrl"));
requestGoogleSheetUrl.addEventListener("click", () => requestToolSetting("businessCardsGoogleSheetUrl"));
requestSheetName.addEventListener("click", () => requestToolSetting("businessCardsSheetName"));
openGasWebAppUrl.addEventListener("click", () => openUrl(currentSettings.businessCardsGasWebAppUrl));
openGoogleSheetUrl.addEventListener("click", () => openUrl(currentSettings.businessCardsGoogleSheetUrl));

function roleToChinese(role) {
  return {
    super_admin: "最大管理員",
    admin: "管理員",
    user: "一般會員"
  }[role] || "一般會員";
}

function statusToChinese(status) {
  return {
    active: "啟用",
    disabled: "停用"
  }[status] || "啟用";
}

function getInitials(name, email) {
  const source = (name || email || "?").trim();
  if (/[\u4e00-\u9fa5]/.test(source)) return source.slice(0, 1);
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

function normalizeGender(value) {
  return ["male", "female"].includes(value) ? value : "unknown";
}

function genderToChinese(value) {
  return {
    male: "男",
    female: "女",
    unknown: "未設定"
  }[normalizeGender(value)];
}

function marketTypeToChinese(value) {
  return {
    domestic: "內銷",
    export: "外銷"
  }[value] || "尚未設定市場";
}

function configureBusinessToolLink(marketType) {
  const isExport = marketType === "export";
  businessToolLink.href = isExport ? "../cards/out/index.html" : "../cards/in/index.html";
  businessToolLink.textContent = isExport ? "進入外銷名片批次辨識工具" : "進入名片批次辨識工具";
}

function genderClass(value) {
  return {
    male: "is-male",
    female: "is-female",
    unknown: "is-undisclosed"
  }[normalizeGender(value)];
}

function renderGenderCard(gender, fallbackText) {
  const normalized = normalizeGender(gender);
  const label = {
    male: "MALE",
    female: "FEMALE",
    unknown: "PROFILE"
  }[normalized];

  if (normalized === "unknown") {
    return `<span class="gender-mark">${escapeHtml((fallbackText || "未").slice(0, 1))}</span>`;
  }

  const iconClass = normalized === "male" ? "bi bi-gender-male" : "bi bi-gender-female";

  return `
    <i class="gender-mark ${iconClass}" aria-hidden="true"></i>
    <span class="gender-label">${label}</span>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function calculateAge(value) {
  if (!value) return null;

  const birthDate = new Date(`${value}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
    return null;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!birthdayPassed) age -= 1;
  return age >= 0 && age <= 120 ? age : null;
}

function shortUid(uid) {
  return uid && uid.length > 14 ? `${uid.slice(0, 7)}...${uid.slice(-5)}` : uid || "-";
}

function summarizeUrl(value) {
  if (!value) return "尚未設定";
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname.length > 1 ? "/..." : ""}`;
  } catch {
    return value;
  }
}

function renderSettings() {
  userGeminiApiKey.textContent = getRequestStatusText("geminiApiKey");
  userGasWebAppUrl.textContent = currentSettings.businessCardsGasWebAppUrl ? summarizeUrl(currentSettings.businessCardsGasWebAppUrl) : getRequestStatusText("businessCardsGasWebAppUrl");
  userGoogleSheetUrl.textContent = currentSettings.businessCardsGoogleSheetUrl ? summarizeUrl(currentSettings.businessCardsGoogleSheetUrl) : getRequestStatusText("businessCardsGoogleSheetUrl");
  userSheetName.textContent = currentSettings.businessCardsSheetName || getRequestStatusText("businessCardsSheetName");
  updateActionButtons();
  updateToolReadiness();
}

function getRequestStatusText(field) {
  const config = requestFields[field];
  if (currentSettings[field]) return "已設定";
  if (currentSettings[config.statusField] === "pending") return "申請中";
  if (currentSettings[config.statusField] === "rejected") return "已駁回，請重新申請";
  return "尚未申請";
}

function updateActionButtons() {
  Object.entries(requestFields).forEach(([field, config]) => {
    const hasValue = !!currentSettings[field];
    const isPending = currentSettings[config.statusField] === "pending";
    const row = config.button.closest(".setting-row");

    if (row) {
      row.classList.toggle("is-configured", hasValue);
      row.classList.toggle("is-pending", !hasValue && isPending);
      row.classList.toggle("needs-request", !hasValue && !isPending);
      row.classList.toggle("has-open-action", Boolean(row.querySelector(".setting-actions")));
    }

    config.button.disabled = hasValue || isPending;
    config.button.textContent = hasValue ? "已設定" : isPending ? "申請中" : "申請";
  });

  openGasWebAppUrl.disabled = !currentSettings.businessCardsGasWebAppUrl;
  openGoogleSheetUrl.disabled = !currentSettings.businessCardsGoogleSheetUrl;
}

function updateToolReadiness() {
  const required = ["geminiApiKey", "businessCardsGasWebAppUrl", "businessCardsGoogleSheetUrl", "businessCardsSheetName"];
  const readyCount = required.filter((field) => !!currentSettings[field]).length;
  const missingLabels = required
    .filter((field) => !currentSettings[field])
    .map((field) => requestFields[field].label);

  if (readyCount === required.length) {
    toolReadyText.textContent = "名片批次辨識工具設定已完整，可以進入工具。";
    toolReadyText.className = "tool-ready-text is-ready";
    businessToolLink.classList.remove("disabled");
    businessToolLink.removeAttribute("aria-disabled");
    return;
  }

  toolReadyText.textContent = `名片批次辨識工具設定 ${readyCount}/${required.length}，缺少：${missingLabels.join("、")}。`;
  toolReadyText.className = "tool-ready-text is-missing";
  businessToolLink.classList.add("disabled");
  businessToolLink.setAttribute("aria-disabled", "true");
}

async function requestToolSetting(field) {
  if (!currentUserUid) return;
  const config = requestFields[field];

  try {
    config.button.disabled = true;
    await updateDoc(doc(db, "users", currentUserUid), {
      [config.statusField]: "pending",
      [config.requestedAtField]: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    currentSettings[config.statusField] = "pending";
    renderSettings();
    showDashboardMsg(`已送出 ${config.label} 申請，管理員會在後台看到。`, "success");
  } catch (error) {
    console.error(error);
    showDashboardMsg(`申請失敗：${error.code || error.message}`);
  } finally {
    updateActionButtons();
  }
}

function openUrl(value) {
  if (value) window.open(value, "_blank", "noopener,noreferrer");
}

function showDashboardMsg(text, type = "danger") {
  dashboardMsg.textContent = text;
  dashboardMsg.className = type === "success" ? "status-msg text-success-soft" : "status-msg text-danger-soft";
}
