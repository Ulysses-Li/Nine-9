import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { explainFirestoreTimeout, firebaseErrorToChinese, withTimeout } from "./firestore-health.js";

export const SUPER_ADMIN_EMAIL = "louis962911@gmail.com";

export function normalizeRole(profile = {}, user = null) {
  if ((profile.email || user?.email || "").toLowerCase() === SUPER_ADMIN_EMAIL) {
    return "super_admin";
  }

  return profile.role || "user";
}

export async function getCurrentUserProfile(user = auth.currentUser) {
  if (!user) {
    return null;
  }

  let userSnap;

  try {
    userSnap = await withTimeout(
      getDoc(doc(db, "users", user.uid)),
      15000,
      "Firestore 讀取會員資料逾時，請確認 Firestore Database。"
    );
  } catch (error) {
    const setupMessage = await explainFirestoreTimeout(user.uid);
    throw new Error(setupMessage || error.message);
  }

  if (!userSnap.exists()) {
    return null;
  }

  const profile = userSnap.data();
  profile.role = normalizeRole(profile, user);

  return {
    user,
    profile
  };
}

export function requireLogin(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "./login.html";
      return;
    }

    try {
      const isSuperAdmin = (user.email || "").toLowerCase() === SUPER_ADMIN_EMAIL;

      if (!user.emailVerified && !isSuperAdmin) {
        alert("信箱尚未驗證。請先到信箱點擊驗證連結，再回來登入。");
        await signOut(auth);
        window.location.href = "./login.html";
        return;
      }

      const current = await getCurrentUserProfile(user);

      if (!current) {
        alert("找不到會員資料，請聯絡管理員。");
        await signOut(auth);
        window.location.href = "./login.html";
        return;
      }

      const status = current.profile.status || "active";

      if (status === "disabled") {
        alert("這個帳號已被停用，請聯絡管理員。");
        await signOut(auth);
        window.location.href = "./login.html";
        return;
      }

      callback(current.user, current.profile);
    } catch (error) {
      console.error(error);
      alert(firebaseErrorToChinese(error, "讀取會員資料失敗，請聯絡管理員。"));
      await signOut(auth);
      window.location.href = "./login.html";
    }
  });
}

export function requireAdmin(callback) {
  requireLogin((user, profile) => {
    if (!["admin", "super_admin"].includes(profile.role)) {
      alert("你沒有管理員權限。");
      window.location.href = "./dashboard.html";
      return;
    }

    callback(user, profile);
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = "./login.html";
}
