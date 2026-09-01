import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { explainFirestoreTimeout, firebaseErrorToChinese, withTimeout } from "./firestore-health.js";

const registerForm = document.getElementById("registerForm");
const submitBtn = registerForm.querySelector("button[type='submit']");
const msg = document.getElementById("msg");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordHint = document.getElementById("confirmPasswordHint");

function showMsg(text, type = "danger") {
  msg.textContent = text;
  msg.className = type === "success" ? "status-msg text-success-soft" : "status-msg text-danger-soft";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "註冊中..." : "註冊";
}

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "隱藏" : "顯示";
    button.setAttribute("aria-label", `${isHidden ? "隱藏" : "顯示"}${input.labels?.[0]?.textContent || "密碼"}`);
  });
});

function updateConfirmPasswordHint() {
  if (!confirmPasswordInput.value) {
    confirmPasswordHint.textContent = "請再次輸入相同密碼。";
    confirmPasswordHint.className = "password-hint";
    return;
  }

  if (passwordInput.value === confirmPasswordInput.value) {
    confirmPasswordHint.textContent = "兩次密碼一致。";
    confirmPasswordHint.className = "password-hint is-valid";
    return;
  }

  confirmPasswordHint.textContent = "兩次密碼不一致。";
  confirmPasswordHint.className = "password-hint is-invalid";
}

passwordInput.addEventListener("input", updateConfirmPasswordHint);
confirmPasswordInput.addEventListener("input", updateConfirmPasswordHint);

function isValidBirthDate(value) {
  const date = new Date(`${value}T00:00:00`);
  const now = new Date();

  if (!value || Number.isNaN(date.getTime()) || date > now) {
    return false;
  }

  const age = now.getFullYear() - date.getFullYear();
  return age >= 0 && age <= 120;
}

function isValidGender(value) {
  return ["male", "female"].includes(value);
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const name = `${lastName}${firstName}`.trim();
  const birthDate = document.getElementById("birthDate").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!lastName || !firstName || !birthDate || !gender || !email || !password || !confirmPassword) {
    showMsg("請完整填寫所有欄位。");
    return;
  }

  if (!isValidBirthDate(birthDate)) {
    showMsg("請輸入有效的出生年月日。");
    return;
  }

  if (!isValidGender(gender)) {
    showMsg("請選擇性別。");
    return;
  }

  if (password.length < 6) {
    showMsg("密碼至少需要 6 個字元。");
    return;
  }

  if (password !== confirmPassword) {
    showMsg("兩次輸入的密碼不一致。");
    return;
  }

  try {
    setLoading(true);
    showMsg("正在建立登入帳號...", "success");

    const userCredential = await withTimeout(
      createUserWithEmailAndPassword(auth, email, password),
      15000,
      "Firebase Authentication 建立帳號逾時，請確認 Email/Password 登入方式已啟用。"
    );
    const user = userCredential.user;

    showMsg("正在更新會員名稱...", "success");
    await withTimeout(
      updateProfile(user, { displayName: name }),
      15000,
      "更新會員名稱逾時，請稍後再試。"
    );

    showMsg("正在寄出驗證信，請到信箱完成驗證。", "success");
    await withTimeout(
      sendEmailVerification(user),
      15000,
      "Firebase 寄送驗證信逾時，請稍後再試。"
    );

    showMsg("正在建立會員資料...", "success");
    try {
      await withTimeout(
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name,
          lastName,
          firstName,
          birthDate,
          gender,
          email,
          role: "user",
          status: "active",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }),
        15000,
        "Firestore 建立會員資料逾時，正在檢查 Firestore Database 狀態。"
      );
    } catch (error) {
      const setupMessage = await explainFirestoreTimeout(user.uid);
      throw new Error(setupMessage || error.message);
    }

    await signOut(auth);
    showMsg("註冊完成。驗證信已寄出，請先到信箱點擊驗證連結，再回來登入。", "success");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 2500);
  } catch (error) {
    console.error(error);
    showMsg(firebaseErrorToChinese(error, "註冊失敗，請稍後再試。"));
  } finally {
    setLoading(false);
  }
});
