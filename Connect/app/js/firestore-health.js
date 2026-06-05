import { firebaseConfig } from "./firebase.js";

const DATABASE_MISSING_TEXT = "Firestore Database 尚未建立，請先到 Firebase Console 建立 Cloud Firestore Database。";

export function withTimeout(promise, milliseconds, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, milliseconds);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

export async function explainFirestoreTimeout(uid) {
  if (!uid) {
    return null;
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${uid}?key=${firebaseConfig.apiKey}`;
    const response = await fetch(url);

    if (response.status !== 404) {
      return null;
    }

    const body = await response.text();

    if (body.includes("database (default) does not exist") || body.includes("database") && body.includes("does not exist")) {
      return DATABASE_MISSING_TEXT;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function firebaseErrorToChinese(error, fallback) {
  const code = error?.code;
  const map = {
    "auth/email-already-in-use": "這個 Email 已經註冊過，請回到登入頁登入。若會員資料曾被移除，登入後會自動補回。",
    "auth/invalid-email": "Email 格式不正確。",
    "auth/invalid-credential": "帳號或密碼錯誤。",
    "auth/network-request-failed": "網路連線失敗，請稍後再試。",
    "auth/operation-not-allowed": "Firebase 尚未啟用 Email/Password 登入方式。",
    "auth/too-many-requests": "嘗試次數過多，請稍後再試。",
    "auth/user-not-found": "找不到這個帳號。",
    "auth/weak-password": "密碼強度不足，請至少輸入 6 個字元。",
    "auth/wrong-password": "密碼錯誤。",
    "not-found": DATABASE_MISSING_TEXT,
    "permission-denied": "權限不足，請確認 Firestore Rules 已發布，且會員文件存在。",
    "unavailable": "Firestore 目前無法連線，請確認網路或 Firebase 服務狀態。"
  };

  return map[code] || error?.message || fallback;
}
