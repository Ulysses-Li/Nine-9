/*
=========================================================
products-render.js

用意：
1. 讀取 products-data.js 的 PRODUCT_FAMILIES
2. 自動產生 Products Card
3. 點擊 Card 直接進入產品頁
4. 不再使用手機版展開模式
=========================================================
*/

/* =========================================================
   DOM Ready
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  renderProductsCards();

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
   renderProductsCards()

   用意：
   1. 將 PRODUCT_FAMILIES 轉成 Card
   2. 點擊 Card 可直接跳頁
========================================================= */

function renderProductsCards() {

  const grid =
    document.getElementById("productsGrid");

  if (!grid) return;

  grid.innerHTML = PRODUCT_FAMILIES.map((family) => {

    return `

      <div class="col-12 col-sm-6 col-lg-4 col-xl-4">

        <!-- =================================================
             Product Card
        ================================================== -->

        <article class="product-family-card">

          <!-- ===============================================
               點擊直接進頁面
          ================================================ -->

          <a
            href="${escapeHTML(family.href)}"
            class="product-family-link"
          >

            <!-- =============================================
                 Card 上方
            ============================================== -->

            <div class="product-family-head">

              <!-- 左側圖片 -->
              <div
                class="product-family-icon"
                aria-hidden="true"
              >

                <img
                  src="${escapeHTML(family.image)}"
                  alt="${escapeHTML(family.title)}"
                  class="product-family-img"
                >

              </div>

              <!-- 右側名稱 -->
              <div class="product-family-name-wrap">

                <h2 class="product-family-name">

                  ${escapeHTML(family.title)}

                </h2>

              </div>

            </div>

          </a>

          <!-- ===============================================
               Related Products
          ================================================ -->

          <div class="product-family-body">

            <div class="related-title">

              Related Products

            </div>

            <ul class="related-list">

              ${family.products.map((item) => `

                <li>

                  <a href="${escapeHTML(item.href)}">

                    ${escapeHTML(item.name)}

                  </a>

                </li>

              `).join("")}

            </ul>

          </div>

        </article>

      </div>

    `;

  }).join("");

}