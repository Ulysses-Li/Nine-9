/*
  products-render.js
  用意：
  1. 讀取 products-data.js 的 PRODUCT_FAMILIES。
  2. 自動產生 Products Card。
  3. 手機版點擊上方區塊才展開 Related Products。
*/

document.addEventListener("DOMContentLoaded", () => {
  renderProductsCards();
  bindMobileCardToggle();
});

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProductsCards() {
  const grid = document.getElementById("productsGrid");

  if (!grid) return;

  grid.innerHTML = PRODUCT_FAMILIES.map((family) => {
    return `
      <div class="col-12 col-sm-6 col-lg-4 col-xl-4">
        <article class="product-family-card">

          <button class="product-family-head" type="button">
            <div class="product-family-icon" aria-hidden="true">
              <img
                src="${escapeHTML(family.image)}"
                alt="${escapeHTML(family.title)}"
                class="product-family-img"
              >
            </div>

            <div class="product-family-name-wrap">
              <h2 class="product-family-name">${escapeHTML(family.title)}</h2>
            </div>
          </button>

          <div class="product-family-body">
            <div class="related-title">Related Products</div>

            <ul class="related-list">
              ${family.products.map((item) => `
                <li>
                  <a href="${escapeHTML(item.href)}">${escapeHTML(item.name)}</a>
                </li>
              `).join("")}
            </ul>
          </div>

        </article>
      </div>
    `;
  }).join("");
}

/*
  bindMobileCardToggle()
  用意：
  手機版點擊產品卡片上方區塊時，展開或收合 Related Products。
*/
function bindMobileCardToggle() {
  document.addEventListener("click", (event) => {
    const head = event.target.closest(".product-family-head");

    if (!head) return;

    const card = head.closest(".product-family-card");

    if (!card) return;

    card.classList.toggle("is-open");
  });
}