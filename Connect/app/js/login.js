import { auth, db } from "./firebase.js";
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { explainFirestoreTimeout, firebaseErrorToChinese, withTimeout } from "./firestore-health.js";

const loginForm = document.getElementById("loginForm");
const submitBtn = loginForm.querySelector("button[type='submit']");
const msg = document.getElementById("msg");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const SUPER_ADMIN_EMAIL = "louis962911@gmail.com";

togglePassword.addEventListener("click", () => {
  const shouldShow = passwordInput.type === "password";
  passwordInput.type = shouldShow ? "text" : "password";
  togglePassword.textContent = shouldShow ? "隱藏" : "顯示";
  togglePassword.setAttribute("aria-label", shouldShow ? "隱藏密碼" : "顯示密碼");
});

function showMsg(text, type = "danger") {
  msg.textContent = text;
  msg.className = type === "success" ? "status-msg text-success-soft" : "status-msg text-danger-soft";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "登入中..." : "登入";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMsg("請輸入 Email 與密碼。");
    return;
  }

  try {
    setLoading(true);
    showMsg("正在登入...", "success");

    const userCredential = await withTimeout(
      signInWithEmailAndPassword(auth, email, password),
      15000,
      "Firebase Authentication 回應逾時，請確認 Firebase Authentication 設定。"
    );
    const user = userCredential.user;

    const isSuperAdmin = (user.email || email).toLowerCase() === SUPER_ADMIN_EMAIL;

    if (!user.emailVerified && !isSuperAdmin) {
      showMsg("信箱尚未驗證，正在補寄驗證信...", "success");
      await withTimeout(
        sendEmailVerification(user),
        15000,
        "Firebase 寄送驗證信逾時，請稍後再試。"
      );
      await signOut(auth);
      showMsg("驗證信已補寄。請到信箱點擊驗證連結，再回來登入。", "success");
      return;
    }

    showMsg("正在讀取會員資料...", "success");
    let userSnap;

    try {
      userSnap = await withTimeout(
        getDoc(doc(db, "users", user.uid)),
        15000,
        "Firestore 讀取會員資料逾時，請確認 Firestore Database 是否已建立。"
      );
    } catch (error) {
      const setupMessage = await explainFirestoreTimeout(user.uid);
      throw new Error(setupMessage || error.message);
    }

    let profile;

    if (!userSnap.exists()) {
      showMsg("找不到會員資料，正在自動補回...", "success");
      profile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "未命名會員",
        email: user.email || email,
        role: "user",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await withTimeout(
        setDoc(doc(db, "users", user.uid), profile),
        15000,
        "Firestore 補回會員資料逾時，請確認 Firestore Rules。"
      );
    } else {
      profile = userSnap.data();
    }

    const status = profile.status || "active";

    if (status === "disabled") {
      await signOut(auth);
      showMsg("這個帳號已被停用，請聯絡管理員。");
      return;
    }

    window.location.href = profile.role === "admin" ? "./admin.html" : "./dashboard.html";
  } catch (error) {
    console.error(error);
    showMsg(firebaseErrorToChinese(error, "登入失敗，請確認帳號密碼。"));
  } finally {
    setLoading(false);
  }
});
