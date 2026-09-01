import { db } from "./firebase.js";
import { requireAdmin, logout, normalizeRole, SUPER_ADMIN_EMAIL } from "./auth-guard.js";
import { collection, deleteDoc, getDocs, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const adminName = document.getElementById("adminName");
const logoutBtn = document.getElementById("logoutBtn");
const usersList = document.getElementById("usersList");
const refreshBtn = document.getElementById("refreshBtn");
const msg = document.getElementById("msg");
const memberSearch = document.getElementById("memberSearch");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");
const genderFilter = document.getElementById("genderFilter");
const requestFilter = document.getElementById("requestFilter");
const visibleCount = document.getElementById("visibleCount");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");

let currentAdminUid = "";
let currentAdminRole = "user";
let allUserDocs = [];

const managedSettings = [
  {
    group: "會員資料",
    field: "jobTitle",
    label: "職位名稱",
    type: "text",
    placeholder: "例如：業務經理、工程師、總經理"
  },
  {
    group: "會員資料",
    field: "marketType",
    label: "銷售市場",
    type: "select",
    options: [
      { value: "domestic", label: "內銷" },
      { value: "export", label: "外銷" }
    ],
    placeholder: ""
  },
  {
    group: "會員資料",
    field: "birthDate",
    label: "出生年月日",
    type: "date",
    placeholder: ""
  },
  {
    group: "會員資料",
    field: "gender",
    label: "性別",
    type: "select",
    options: [
      { value: "male", label: "男" },
      { value: "female", label: "女" }
    ],
    placeholder: ""
  },
  {
    group: "共用 AI 設定",
    field: "geminiApiKey",
    label: "Google Cloud Agent Platform API Key",
    type: "password",
    placeholder: "貼上此會員要使用的 Google Cloud Agent Platform API Key",
    statusField: "geminiApiKeyRequestStatus",
    requestedAtField: "geminiApiKeyRequestedAt",
    completedAtField: "geminiApiKeyCompletedAt"
  },
  {
    group: "名片批次辨識工具",
    field: "businessCardsGasWebAppUrl",
    legacyField: "gasWebAppUrl",
    label: "名片批次辨識 GAS Web App URL",
    type: "url",
    placeholder: "https://script.google.com/macros/s/...",
    statusField: "businessCardsGasWebAppUrlRequestStatus",
    legacyStatusField: "gasWebAppUrlRequestStatus",
    requestedAtField: "businessCardsGasWebAppUrlRequestedAt",
    legacyRequestedAtField: "gasWebAppUrlRequestedAt",
    completedAtField: "businessCardsGasWebAppUrlCompletedAt"
  },
  {
    group: "名片批次辨識工具",
    field: "businessCardsGoogleSheetUrl",
    legacyField: "googleSheetUrl",
    label: "名片批次辨識 Google Sheet 連結",
    type: "url",
    placeholder: "https://docs.google.com/spreadsheets/d/...",
    statusField: "businessCardsGoogleSheetUrlRequestStatus",
    legacyStatusField: "googleSheetUrlRequestStatus",
    requestedAtField: "businessCardsGoogleSheetUrlRequestedAt",
    legacyRequestedAtField: "googleSheetUrlRequestedAt",
    completedAtField: "businessCardsGoogleSheetUrlCompletedAt"
  },
  {
    group: "名片批次辨識工具",
    field: "businessCardsSheetName",
    legacyField: "sheetName",
    label: "名片批次辨識工作表名稱",
    type: "text",
    placeholder: "例如：名片資料",
    statusField: "businessCardsSheetNameRequestStatus",
    legacyStatusField: "sheetNameRequestStatus",
    requestedAtField: "businessCardsSheetNameRequestedAt",
    legacyRequestedAtField: "sheetNameRequestedAt",
    completedAtField: "businessCardsSheetNameCompletedAt"
  }
];

function showMsg(text, type = "danger") {
  msg.textContent = text;
  msg.className = type === "success" ? "status-msg text-success-soft" : "status-msg text-danger-soft";
}

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
  if (/[\u4e00-\u9fa5]/.test(source)) return source.slice(0, 2);
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

function shortUid(uid) {
  return uid && uid.length > 12 ? `${uid.slice(0, 6)}...${uid.slice(-4)}` : uid || "-";
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

function isSuperAdminEmail(email) {
  return (email || "").toLowerCase() === SUPER_ADMIN_EMAIL;
}

function getSettingValue(member, setting) {
  return member[setting.field] || (setting.legacyField ? member[setting.legacyField] : "") || "";
}

function getSettingStatus(member, setting) {
  return member[setting.statusField] || (setting.legacyStatusField ? member[setting.legacyStatusField] : "") || "";
}

function getRequestedAt(member, setting) {
  return member[setting.requestedAtField] || (setting.legacyRequestedAtField ? member[setting.legacyRequestedAtField] : null);
}

requireAdmin(async (user, profile) => {
  currentAdminUid = user.uid;
  currentAdminRole = normalizeRole(profile, user);
  adminName.textContent = `${profile.name || user.email || "管理員"}（${roleToChinese(currentAdminRole)}）`;
  await loadUsers();
});

logoutBtn.addEventListener("click", logout);
refreshBtn.addEventListener("click", loadUsers);
[memberSearch, roleFilter, statusFilter, genderFilter, requestFilter].forEach((control) => {
  control?.addEventListener("input", renderFilteredUsers);
  control?.addEventListener("change", renderFilteredUsers);
});

async function loadUsers() {
  try {
    refreshBtn.disabled = true;
    showMsg("正在讀取會員資料...", "success");
    usersList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "users"));
    if (snapshot.empty) {
      allUserDocs = [];
      updateAdminStats([]);
      usersList.innerHTML = `<div class="empty-state">目前沒有會員資料</div>`;
      showMsg("目前沒有會員資料。", "success");
      return;
    }

    const docs = [...snapshot.docs].sort((a, b) => {
      const aTime = a.data().createdAt?.toMillis?.() || 0;
      const bTime = b.data().createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    allUserDocs = docs;
    renderFilteredUsers();
    showMsg("會員資料讀取完成。", "success");
  } catch (error) {
    console.error(error);
    showMsg(`讀取失敗：${error.code || error.message}`);
  } finally {
    refreshBtn.disabled = false;
  }
}

function renderFilteredUsers() {
  const keyword = (memberSearch?.value || "").trim().toLowerCase();
  const roleValue = roleFilter?.value || "all";
  const statusValue = statusFilter?.value || "all";
  const genderValue = genderFilter?.value || "all";
  const requestValue = requestFilter?.value || "all";

  const filteredDocs = allUserDocs.filter((docSnap) => {
    const member = docSnap.data();
    const role = normalizeRole(member);
    const status = member.status || (member.disabled === true ? "disabled" : "active");
    const searchText = getMemberSearchText(member, docSnap.id);

    if (keyword && !searchText.includes(keyword)) return false;
    if (roleValue !== "all" && role !== roleValue) return false;
    if (statusValue !== "all" && status !== statusValue) return false;
    if (genderValue !== "all" && normalizeGender(member.gender) !== genderValue) return false;
    if (requestValue === "pending" && !hasPendingRequests(member)) return false;

    return true;
  });

  usersList.innerHTML = "";

  if (filteredDocs.length === 0) {
    usersList.innerHTML = `<div class="empty-state">找不到符合條件的會員。</div>`;
  } else {
    filteredDocs.forEach((docSnap) => renderMemberCard(docSnap));
    bindSaveButtons();
    bindDeleteButtons();
    bindRejectButtons();
  }

  updateAdminStats(filteredDocs);
}

function getMemberSearchText(member, uid) {
  return [
    member.name,
    member.lastName,
    member.firstName,
    member.email,
    member.jobTitle,
    marketTypeToChinese(member.marketType),
    member.birthDate,
    genderToChinese(member.gender),
    uid
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasPendingRequests(member) {
  return managedSettings.some((setting) => setting.statusField && getSettingStatus(member, setting) === "pending");
}

function updateAdminStats(visibleDocs) {
  const pendingTotal = allUserDocs.filter((docSnap) => hasPendingRequests(docSnap.data())).length;

  if (visibleCount) visibleCount.textContent = String(visibleDocs.length);
  if (totalCount) totalCount.textContent = String(allUserDocs.length);
  if (pendingCount) pendingCount.textContent = String(pendingTotal);
}

function renderMemberCard(docSnap) {
  const member = docSnap.data();
  const email = member.email || "-";
  const memberRole = normalizeRole(member);
  const displayName = member.name || "未命名會員";
  const jobTitle = member.jobTitle || "尚未設定職位";
  const marketType = member.marketType || "";
  const age = calculateAge(member.birthDate);
  const gender = normalizeGender(member.gender);
  const birthDateText = member.birthDate || "尚未設定生日";
  const status = member.status || (member.disabled === true ? "disabled" : "active");
  const createdAt = member.createdAt?.toDate ? member.createdAt.toDate().toLocaleString("zh-TW") : "-";
  const isProtectedSuperAdmin = isSuperAdminEmail(email);
  const canEditRole = currentAdminRole === "super_admin" && !isProtectedSuperAdmin;
  const canDelete = currentAdminRole === "super_admin" && docSnap.id !== currentAdminUid && !isProtectedSuperAdmin;

  const card = document.createElement("article");
  card.className = "member-card";
  card.innerHTML = `
    <div class="member-summary">
      <div class="member-avatar gender-card ${genderClass(gender)}" aria-label="性別圖卡：${genderToChinese(gender)}">${renderGenderCard(gender, getInitials(displayName, email))}</div>
      <div class="member-main">
        <div class="member-name-row">
          <h2>${escapeHtml(displayName)}</h2>
          <span class="member-badge ${memberRole === "super_admin" ? "is-super-admin" : memberRole === "admin" ? "is-admin" : "is-user"}">${roleToChinese(memberRole)}</span>
          <span class="member-badge ${status === "disabled" ? "is-disabled" : "is-active"}">${statusToChinese(status)}</span>
          ${renderRequestSummaryBadges(member)}
        </div>
        <div class="member-email">${escapeHtml(email)}</div>
        <div class="member-meta">
          <span>職位：${escapeHtml(jobTitle)}</span>
          <span>市場：${escapeHtml(marketTypeToChinese(marketType))}</span>
          <span>性別：${genderToChinese(gender)}</span>
          <span>年齡：${age ? `${age} 歲` : "尚未設定"}</span>
          <span>生日：${escapeHtml(birthDateText)}</span>
          <span>UID：${escapeHtml(shortUid(docSnap.id))}</span>
          <span>建立時間：${escapeHtml(createdAt)}</span>
        </div>
      </div>
    </div>

    <div class="member-controls">
      <label>
        <span>權限</span>
        <select class="form-select role-select" data-uid="${docSnap.id}" ${canEditRole ? "" : "disabled"}>
          <option value="user" ${memberRole === "user" ? "selected" : ""}>${roleToChinese("user")}</option>
          <option value="admin" ${memberRole === "admin" ? "selected" : ""}>${roleToChinese("admin")}</option>
          <option value="super_admin" ${memberRole === "super_admin" ? "selected" : ""}>${roleToChinese("super_admin")}</option>
        </select>
      </label>
      <label>
        <span>狀態</span>
        <select class="form-select status-select" data-uid="${docSnap.id}" ${isProtectedSuperAdmin ? "disabled" : ""}>
          <option value="active" ${status === "active" ? "selected" : ""}>${statusToChinese("active")}</option>
          <option value="disabled" ${status === "disabled" ? "selected" : ""}>${statusToChinese("disabled")}</option>
        </select>
      </label>
    </div>

    <div class="member-settings">
      ${managedSettings.map((setting) => renderSettingInput(member, docSnap.id, setting)).join("")}
    </div>

    <div class="member-actions">
      <button class="btn btn-primary save-btn" data-uid="${docSnap.id}">儲存</button>
      <button class="btn btn-outline-danger delete-btn" data-uid="${docSnap.id}" data-email="${escapeHtml(email)}" ${canDelete ? "" : "disabled"}>移除會員</button>
    </div>
  `;

  usersList.appendChild(card);
}

function renderRequestSummaryBadges(member) {
  return managedSettings
    .filter((setting) => setting.statusField && getSettingStatus(member, setting) === "pending")
    .map((setting) => `<span class="member-badge is-pending">${escapeHtml(setting.label)} 申請中</span>`)
    .join("");
}

function renderSettingInput(member, uid, setting) {
  const requestStatus = getRequestStatus(member, setting);
  const value = getSettingValue(member, setting);
  const rejectButton = setting.statusField && getSettingStatus(member, setting) === "pending"
    ? `<button class="btn btn-outline-danger btn-sm reject-request-btn" type="button" data-uid="${uid}" data-status-field="${setting.statusField}" data-rejected-at-field="${setting.field}RejectedAt" data-label="${escapeHtml(setting.label)}">駁回</button>`
    : "";
  const inputControl = setting.type === "select"
    ? `
      <select class="form-select setting-input" data-field="${setting.field}" data-uid="${uid}">
        <option value="">未設定</option>
        ${(setting.options || []).map((option) => `<option value="${escapeHtml(option.value)}" ${value === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
      </select>
    `
    : `<input class="form-control setting-input" data-field="${setting.field}" data-uid="${uid}" type="${setting.type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(setting.placeholder)}">`;

  return `
    <label class="setting-${escapeHtml(setting.field)}">
      <span>${escapeHtml(setting.label)}</span>
      ${inputControl}
      <small>
        <span class="member-badge ${requestStatus.className}">${escapeHtml(requestStatus.label)}</span>
        ${escapeHtml(requestStatus.help)}
        ${rejectButton}
      </small>
    </label>
  `;
}

function getRequestStatus(member, setting) {
  if (!setting.statusField) {
    return {
      className: getSettingValue(member, setting) ? "is-active" : "is-user",
      label: getSettingValue(member, setting) ? "已設定" : "未設定",
      help: "這是管理員維護的會員資料。"
    };
  }

  const requestedAtValue = getRequestedAt(member, setting);
  const requestedAt = requestedAtValue?.toDate ? requestedAtValue.toDate().toLocaleString("zh-TW") : "";
  const status = getSettingStatus(member, setting);

  if (getSettingValue(member, setting)) {
    return {
      className: "is-active",
      label: "已設定",
      help: requestedAt ? `申請時間：${requestedAt}` : "此欄位已由管理員設定。"
    };
  }

  if (status === "pending") {
    return {
      className: "is-pending",
      label: "申請中",
      help: requestedAt ? `會員申請時間：${requestedAt}` : "會員已送出申請，請補上設定。"
    };
  }

  if (status === "rejected") {
    return {
      className: "is-disabled",
      label: "已駁回",
      help: "此申請已駁回，會員可以重新申請。"
    };
  }

  return {
    className: "is-user",
    label: "未申請",
    help: "會員尚未申請此項設定。"
  };
}

function bindDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const confirmed = window.confirm(`確定要移除 ${btn.dataset.email || "這位會員"} 的會員資料嗎？這只會移除 Firestore 會員資料，不會刪除 Firebase Authentication 登入帳號。`);
      if (!confirmed) return;

      try {
        btn.disabled = true;
        await deleteDoc(doc(db, "users", btn.dataset.uid));
        showMsg("會員資料已移除；Firebase 登入帳號仍保留。", "success");
        await loadUsers();
      } catch (error) {
        console.error(error);
        showMsg(`移除失敗：${error.code || error.message}`);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function bindRejectButtons() {
  document.querySelectorAll(".reject-request-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const confirmed = window.confirm(`確定要駁回「${btn.dataset.label || "此項設定"}」申請嗎？會員之後可以重新申請。`);
      if (!confirmed) return;

      try {
        btn.disabled = true;
        await updateDoc(doc(db, "users", btn.dataset.uid), {
          [btn.dataset.statusField]: "rejected",
          [btn.dataset.rejectedAtField]: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        showMsg(`已駁回 ${btn.dataset.label || "此項設定"} 申請。`, "success");
        await loadUsers();
      } catch (error) {
        console.error(error);
        showMsg(`駁回失敗：${error.code || error.message}`);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function bindSaveButtons() {
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.uid;
      const roleSelect = document.querySelector(`.role-select[data-uid="${uid}"]`);
      const statusSelect = document.querySelector(`.status-select[data-uid="${uid}"]`);
      const settingInputs = document.querySelectorAll(`.setting-input[data-uid="${uid}"]`);
      const settings = {};

      settingInputs.forEach((input) => {
        settings[input.dataset.field] = input.value.trim();
      });

      managedSettings.forEach((setting) => {
        if (setting.statusField && settings[setting.field]) {
          settings[setting.statusField] = "completed";
          settings[setting.completedAtField] = serverTimestamp();
        }
      });

      if (currentAdminRole === "super_admin" && roleSelect && !roleSelect.disabled) {
        settings.role = roleSelect.value;
      }

      if (statusSelect && !statusSelect.disabled) {
        settings.status = statusSelect.value;
      }

      try {
        btn.disabled = true;
        await updateDoc(doc(db, "users", uid), {
          ...settings,
          updatedAt: serverTimestamp()
        });
        showMsg("會員資料與工具設定已儲存。", "success");
        await loadUsers();
      } catch (error) {
        console.error(error);
        showMsg(`儲存失敗：${error.code || error.message}`);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
