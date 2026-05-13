/* =========================================================
   chamfering-render.js
   用意：
   1. 渲染 Chamfering & Corner Radii 產品卡片
   2. 載入共用 Header
   3. 載入共用 Footer
   4. 綁定手機版漢堡選單
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  renderChamferingProducts();
  loadHeader();
  loadFooter();
});

/* =========================================================
   escapeHTML()
   用意：
   避免特殊字元破壞 HTML 結構
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
   renderChamferingProducts()
   用意：
   將 chamfering-data.js 裡的 CHAMFERING_PRODUCTS
   自動產生成產品卡片
========================================================= */

function renderChamferingProducts() {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  productGrid.innerHTML = CHAMFERING_PRODUCTS.map(product => `
    <a
      href="${escapeHTML(product.href)}"
      class="product-card"
    >
      <div class="product-image-box">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
        >

        <div class="product-desc">
          ${escapeHTML(product.description)}
        </div>
      </div>

      <div class="product-name">
        ${escapeHTML(product.name)}
      </div>
    </a>
  `).join("");
}

/* =========================================================
   loadHeader()
   用意：
   載入共用 Header，並在載入完成後綁定手機選單
========================================================= */

function loadHeader() {
  fetch("https://cwli.dev/Nine-9/header/header.html")
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
   loadFooter()
   用意：
   載入共用 Footer
========================================================= */

function loadFooter() {
  fetch("https://cwli.dev/Nine-9/footer/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}