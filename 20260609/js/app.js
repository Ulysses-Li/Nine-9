const state = {
  categoryId: null,
  seriesId: null,
  keyword: ""
};

const $ = (selector) => document.querySelector(selector);

const categoryList = $("#categoryList");
const seriesList = $("#seriesList");
const toolList = $("#toolList");
const seriesSection = $("#seriesSection");
const toolSection = $("#toolSection");
const breadcrumb = $("#breadcrumb");
const summary = $("#summary");
const keywordInput = $("#keyword");
const resetBtn = $("#resetBtn");

function getCategory() {
  return NINE9_DATA.find((category) => category.id === state.categoryId);
}

function getSeries() {
  const category = getCategory();
  return category?.series.find((series) => series.id === state.seriesId);
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function seriesSearchText(series) {
  return [
    series.name,
    series.note,
    series.page,
    ...(series.specs || []),
    ...(series.tools || []).map((tool) => `${tool.name} ${tool.note || ""}`)
  ].join(" ");
}

function categoryOwnSearchText(category) {
  return [
    category.name,
    category.english,
    category.note
  ].join(" ");
}

function categorySearchText(category) {
  return [
    categoryOwnSearchText(category),
    ...category.series.map(seriesSearchText)
  ].join(" ");
}

function matches(text) {
  if (!state.keyword) return true;
  return normalize(text).includes(normalize(state.keyword));
}

function filteredCategories() {
  return NINE9_DATA.filter((category) => matches(categorySearchText(category)));
}

function filteredSeries(category) {
  if (!category) return [];
  if (!state.keyword || matches(categoryOwnSearchText(category))) {
    return category.series;
  }
  return category.series.filter((series) => matches(seriesSearchText(series)));
}

function iconFor(icon) {
  const icons = {
    target: "◎",
    bevel: "◿",
    spark: "✦",
    pen: "✎",
    drill: "⌁",
    mill: "▦",
    circle: "○"
  };
  return icons[icon] || "•";
}

function typeLabel(type) {
  const labels = {
    catalog: "型錄",
    data: "資料",
    calculator: "工具",
    note: "備註"
  };
  return labels[type] || "資料";
}

function renderCategories() {
  const categories = filteredCategories();

  categoryList.innerHTML = categories.length
    ? categories.map((category) => `
        <button class="select-card ${category.id === state.categoryId ? "active" : ""}" type="button" data-category="${category.id}">
          <span class="count-badge">${category.series.length}</span>
          <span class="card-icon" aria-hidden="true">${iconFor(category.icon)}</span>
          <span class="card-title">${category.name}</span>
          <span class="card-subtitle">${category.english}</span>
          <span class="card-note">${category.note}</span>
        </button>
      `).join("")
    : `<div class="empty-state">找不到符合「${state.keyword}」的加工目的。</div>`;

  categoryList.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.categoryId = button.dataset.category;
      state.seriesId = null;
      renderAll();
    });
  });
}

function renderSeries() {
  const category = getCategory();

  if (!category) {
    seriesSection.hidden = true;
    seriesList.innerHTML = "";
    return;
  }

  const seriesItems = filteredSeries(category);
  seriesSection.hidden = false;
  seriesList.innerHTML = seriesItems.length
    ? seriesItems.map((series) => `
        <button class="select-card ${series.id === state.seriesId ? "active" : ""}" type="button" data-series="${series.id}">
          <span class="count-badge">P.${series.page}</span>
          <span class="card-icon" aria-hidden="true">▣</span>
          <span class="card-title">${series.name}</span>
          <span class="card-note">${series.note}</span>
          <span class="spec-row">${series.specs.map((spec) => `<span>${spec}</span>`).join("")}</span>
        </button>
      `).join("")
    : `<div class="empty-state">此分類中沒有符合「${state.keyword}」的產品系列。</div>`;

  seriesList.querySelectorAll("[data-series]").forEach((button) => {
    button.addEventListener("click", () => {
      state.seriesId = button.dataset.series;
      renderAll();
    });
  });
}

function renderTools() {
  const series = getSeries();

  if (!series) {
    toolSection.hidden = true;
    toolList.innerHTML = "";
    return;
  }

  toolSection.hidden = false;
  toolList.innerHTML = series.tools.map((tool) => {
    const body = `
      <span class="tool-type">${typeLabel(tool.type)}</span>
      <strong>${tool.name}</strong>
      <span>${tool.note || `前往 ${series.name} 相關資源。`}</span>
      <span class="status ${tool.status}">${tool.status === "available" ? "可使用" : "準備中"}</span>
    `;

    if (tool.status === "available" && tool.url) {
      return `<a class="tool-card" href="${tool.url}" target="${tool.url.startsWith("http") ? "_blank" : "_self"}" rel="noopener">${body}</a>`;
    }

    return `<div class="tool-card muted">${body}</div>`;
  }).join("");
}

function renderBreadcrumb() {
  const category = getCategory();
  const series = getSeries();
  const parts = [];
  if (category) parts.push(category.name);
  if (series) parts.push(series.name);
  breadcrumb.textContent = parts.length ? parts.join(" / ") : "尚未選擇";
}

function renderSummary() {
  const category = getCategory();
  const series = getSeries();

  if (!category) {
    summary.className = "summary-empty";
    summary.textContent = state.keyword
      ? "可直接從搜尋結果選擇加工目的。"
      : "請先選擇加工目的。";
    return;
  }

  if (!series) {
    summary.className = "summary-list";
    summary.innerHTML = filteredSeries(category).map((item) => `
      <article class="summary-item">
        <span class="summary-kicker">P.${item.page}</span>
        <h3>${item.name}</h3>
        <p>${item.note}</p>
      </article>
    `).join("");
    return;
  }

  summary.className = "detail-panel";
  summary.innerHTML = `
    <div>
      <span class="summary-kicker">PDF Page ${series.page}</span>
      <h3>${series.name}</h3>
      <p>${series.note}</p>
    </div>
    <div class="detail-specs">
      ${series.specs.map((spec) => `<span>${spec}</span>`).join("")}
    </div>
  `;
}

function renderAll() {
  renderCategories();
  renderSeries();
  renderTools();
  renderBreadcrumb();
  renderSummary();
}

function selectSeriesFromUrl() {
  const productId = new URLSearchParams(window.location.search).get("product");
  if (!productId) return;

  for (const category of NINE9_DATA) {
    const series = category.series.find((item) => item.id === productId);
    if (series) {
      state.categoryId = category.id;
      state.seriesId = series.id;
      return;
    }
  }
}

keywordInput.addEventListener("input", (event) => {
  state.keyword = event.target.value.trim();
  renderAll();
});

resetBtn.addEventListener("click", () => {
  state.categoryId = null;
  state.seriesId = null;
  state.keyword = "";
  keywordInput.value = "";
  renderAll();
});

selectSeriesFromUrl();
renderAll();
