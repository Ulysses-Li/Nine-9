# cwli.dev deployment

這個資料夾是整理後可上傳到 GitHub Pages / 自訂網域的版本。

## 路徑

- `/index.html`：入口頁，會導到 `/app/login.html`
- `/app/`：會員系統
- `/cards/in/`：內銷名片批次辨識工具
- `/cards/out/`：外銷名片批次辨識工具

## 使用方式

將 `cwli.dev` 內的所有內容放到 GitHub Pages 對應的網站根目錄。

登入後：

- 會員 `銷售市場 = 內銷` 會進入 `/cards/in/index.html`
- 會員 `銷售市場 = 外銷` 會進入 `/cards/out/index.html`

## 注意

Firebase 設定仍在 `/app/js/firebase.js`。
