/* =========================================================
   Chamfer Mill Render
   用意：
   1. 控制左側選單切換
   2. 產生 Download / Programming / FAQ 畫面
   3. 載入共用 Header / Footer
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  bindMenu();
  renderDownload();
  loadHeader();
  loadFooter();
});

/* =========================================================
   DOM
========================================================= */

const contentArea = document.getElementById("contentArea");
const menuLinks = document.querySelectorAll(".side-menu a");

/* =========================================================
   escapeHTML
   用意：
   防止特殊字元破壞 HTML 結構
========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   Render Download
========================================================= */

function renderDownload() {
  const data = PRODUCT_PAGE_DATA;

  contentArea.innerHTML = `
    <h1 class="page-title">${escapeHTML(data.productName)} Download</h1>
    <div class="title-line"></div>

    <div class="resource-grid">
      ${data.downloads.map(item => `
        <${item.href ? "a" : "div"}
          class="resource-card ${item.href ? "" : "is-disabled"}"
          ${item.href ? `href="${escapeHTML(item.href)}" target="_blank"` : ""}
        >
          <div class="resource-title">
            ${escapeHTML(item.title)}
          </div>

          <div class="resource-preview">
            ${item.image ? `
              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.title)}"
              >
            ` : `
              <div class="resource-placeholder">
                Coming soon
              </div>
            `}
          </div>
        </${item.href ? "a" : "div"}>
      `).join("")}
    </div>
  `;
}

/* =========================================================
   Render Programming
========================================================= */

function renderProgramming() {
  const data = PRODUCT_PAGE_DATA.programming;

  contentArea.innerHTML = `
    <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} NC 程式產生器</h1>
    <div class="title-line"></div>

    <div class="program-box">
      <div class="program-title">
        ${escapeHTML(data.title)}
      </div>

      <div class="program-desc">
        ${escapeHTML(data.desc)}
      </div>

      ${data.href ? `
        <a
          href="${escapeHTML(data.href)}"
          class="program-btn"
        >
          Open NC Program Generator
        </a>
      ` : `
        <span class="program-btn is-disabled">
          Coming soon
        </span>
      `}
    </div>
  `;
}

/* =========================================================
   Render FAQ List
========================================================= */

function renderFaqList() {
  const faqs = PRODUCT_PAGE_DATA.faqs;

  contentArea.innerHTML = `
    <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} 常見技術問題</h1>
    <div class="title-line"></div>

    <div class="faq-grid">
      ${faqs.map((item, index) => `
        <div
          class="faq-card"
          onclick="renderFaqDetail(${index})"
        >
          <div class="faq-img">圖</div>

          <div class="faq-text">
            ${escapeHTML(item.title)}<br>
            ${escapeHTML(item.subtitle)}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

/* =========================================================
   Render FAQ Detail
========================================================= */

function renderFaqDetail(index) {
  const faqs = PRODUCT_PAGE_DATA.faqs;
  const item = faqs[index];

  const prevIndex = index - 1;
  const nextIndex = index + 1;

  contentArea.innerHTML = `
    <div class="faq-detail">
      <div class="faq-detail-title">
        ${escapeHTML(item.detailTitle)}
      </div>

      <div class="faq-detail-body">
        <div class="faq-video">
          ${escapeHTML(item.mediaText).replaceAll("\n", "<br>")}
        </div>

        <div class="faq-desc-title">
          文字敘述
        </div>

        <div class="faq-desc">
          ${escapeHTML(item.desc)}
        </div>

        <div class="contact-box">
          聯絡我們
          <span>Contact Nine9 Tech Support</span>
        </div>

        <div class="faq-desc">
          詢問此主題與客戶可留言的表單
        </div>
      </div>
    </div>

    <div class="faq-nav">
      <button
        onclick="renderFaqDetail(${prevIndex})"
        ${prevIndex < 0 ? "disabled" : ""}
      >
        ◀ ${prevIndex >= 0 ? escapeHTML(faqs[prevIndex].title) : ""}
      </button>

      <button
        onclick="renderFaqDetail(${nextIndex})"
        ${nextIndex >= faqs.length ? "disabled" : ""}
      >
        ${nextIndex < faqs.length ? escapeHTML(faqs[nextIndex].title) : ""} ▶
      </button>
    </div>
  `;
}

/* =========================================================
   Bind Menu
========================================================= */

function bindMenu() {
  menuLinks.forEach(link => {
    link.addEventListener("click", function () {
      menuLinks.forEach(item => item.classList.remove("active"));
      this.classList.add("active");

      const page = this.dataset.page;

      if (page === "download") renderDownload();
      if (page === "programming") renderProgramming();
      if (page === "faq") renderFaqList();
    });
  });
}

/* =========================================================
   Load Header
========================================================= */

function loadHeader() {
  fetch("../../header/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      const mobileMenuBtn = document.getElementById("mobileMenuBtn");
      const topNav = document.getElementById("topNav");

      if (mobileMenuBtn && topNav) {
        mobileMenuBtn.addEventListener("click", function () {
          topNav.classList.toggle("active");
        });
      }
    });
}

/* =========================================================
   Load Footer
========================================================= */

function loadFooter() {
  fetch("../../footer/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}
