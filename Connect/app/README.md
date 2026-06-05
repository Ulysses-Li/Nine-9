# Firebase 會員管理系統

這是一個純 HTML、CSS、JavaScript ES Module 與 Firebase CDN module 製作的會員管理系統。專案不需要 npm、React、Vue 或打包工具。

## 功能

- Email / Password 註冊
- Email / Password 登入
- Firestore 建立會員資料
- 會員頁面顯示姓名、Email、Role、Status
- 管理員後台查看所有會員
- 管理員可修改會員 `role` 與 `status`
- 停用帳號無法登入或進入受保護頁面
- Firestore Rules 權限保護

## 專案結構

```text
firebase-member-system/
├─ login.html
├─ register.html
├─ dashboard.html
├─ admin.html
├─ firestore.rules
├─ README.md
├─ css/
│  └─ style.css
└─ js/
   ├─ firebase.js
   ├─ auth-guard.js
   ├─ login.js
   ├─ register.js
   ├─ dashboard.js
   └─ admin.js
```

## Firebase 設定

1. 到 Firebase Console 建立專案。
2. 在 Authentication 的 Sign-in method 啟用 Email/Password。
3. 建立 Firestore Database。
4. 到 Project settings 建立或查看 Web app。
5. 將 Firebase config 填入 `js/firebase.js`：

```js
const firebaseConfig = {
  apiKey: "你的 apiKey",
  authDomain: "你的 authDomain",
  projectId: "你的 projectId",
  storageBucket: "你的 storageBucket",
  messagingSenderId: "你的 messagingSenderId",
  appId: "你的 appId"
};
```

6. 將 `firestore.rules` 的內容貼到 Firebase Console 的 Firestore Rules 並發布。

## 會員資料格式

註冊成功後會建立：

```text
users/{uid}
```

資料格式：

```js
{
  uid: "Firebase Auth UID",
  name: "會員姓名",
  email: "會員 Email",
  role: "user",
  status: "active",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

`role` 可為 `user` 或 `admin`。`status` 可為 `active` 或 `disabled`。

## 建立第一個管理員

1. 先使用 `register.html` 註冊一個帳號。
2. 到 Firebase Console 開啟 Firestore Database。
3. 找到 `users` collection。
4. 找到剛註冊帳號的 UID 文件。
5. 將 `role` 從 `user` 改成 `admin`。
6. 確認 `status` 是 `active`。
7. 重新登入後會進入 `admin.html`。

## 本機執行

因為專案使用 ES Module，建議使用本機伺服器開啟：

```bash
python -m http.server 5500
```

開啟：

```text
http://localhost:5500/login.html
```

## 常見錯誤

- `auth/invalid-credential`：帳號或密碼錯誤。
- `auth/email-already-in-use`：Email 已經註冊過。
- `auth/weak-password`：密碼至少需要 6 個字元。
- `permission-denied`：Firestore Rules 未發布或權限設定不正確。
- 停用帳號：請由管理員把 `status` 改回 `active`。
