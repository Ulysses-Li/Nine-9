document.addEventListener("DOMContentLoaded", function () {
  bindMenu();
  renderPageFromHash();
  loadHeader();
  loadFooter();
});

const contentArea = document.getElementById("contentArea");
const menuLinks = document.querySelectorAll(".side-menu a");

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFaqAnswer(value) {
  const lines = String(value ?? "")
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return "<p>FAQ content is being prepared.</p>";
  }

  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  };

  lines.forEach(line => {
    const cleaned = line.replace(/^[-*]\s+/, "");
    const escaped = escapeHTML(cleaned);

    if (/^[-*]\s+/.test(line)) {
      listItems.push(escaped);
      return;
    }

    flushList();
    blocks.push(`<p>${escaped}</p>`);
  });

  flushList();
  return blocks.join("");
}

function getFaqQuestion(item) {
  return item.question || item.title || "FAQ";
}

function getFaqAnswer(item) {
  return item.answer || item.desc || "";
}

function getFaqTopic(item) {
  return item.topic || item.subtitle || "Technical FAQ";
}

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
          <div class="resource-title">${escapeHTML(item.title)}</div>

          <div class="resource-preview">
            ${item.image ? `
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}">
            ` : `
              <div class="resource-placeholder">Coming soon</div>
            `}
          </div>
        </${item.href ? "a" : "div"}>
      `).join("")}
    </div>
  `;
}

function renderProgramming() {
  const data = PRODUCT_PAGE_DATA.programming;

  contentArea.innerHTML = `
    <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} NC Program Generator</h1>
    <div class="title-line"></div>

    <div class="program-box">
      <div class="program-title">${escapeHTML(data.title)}</div>
      <div class="program-desc">${escapeHTML(data.desc)}</div>

      ${data.href ? `
        <a href="${escapeHTML(data.href)}" class="program-btn">Open NC Program Generator</a>
      ` : `
        <span class="program-btn is-disabled">Coming soon</span>
      `}
    </div>
  `;
}

function renderFaqList() {
  const faqs = PRODUCT_PAGE_DATA.faqs || [];

  contentArea.innerHTML = `
    <div class="faq-heading">
      <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} Technical FAQ</h1>
      <p>Knowledge-base answers for application selection, cutting data, setup checks, and troubleshooting.</p>
    </div>
    <div class="title-line"></div>

    <div class="faq-grid">
      ${faqs.map((item, index) => `
        <button class="faq-card" type="button" onclick="renderFaqDetail(${index})">
          <span class="faq-number">Q${index + 1}</span>
          <span class="faq-topic">${escapeHTML(getFaqTopic(item))}</span>
          <span class="faq-question">${escapeHTML(getFaqQuestion(item))}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderFaqDetail(index) {
  const faqs = PRODUCT_PAGE_DATA.faqs || [];
  const item = faqs[index];

  if (!item) {
    renderFaqList();
    return;
  }

  const prevIndex = index - 1;
  const nextIndex = index + 1;
  const question = getFaqQuestion(item);

  contentArea.innerHTML = `
    <button class="faq-back" type="button" onclick="renderFaqList()">Back to FAQ</button>

    <article class="faq-detail">
      <div class="faq-detail-header">
        <span class="faq-detail-kicker">Q${index + 1} / ${escapeHTML(getFaqTopic(item))}</span>
        <h1>${escapeHTML(question)}</h1>
      </div>

      <div class="faq-detail-body">
        <div class="faq-answer">
          ${formatFaqAnswer(getFaqAnswer(item))}
        </div>

        <div class="contact-box">
          Need case-specific confirmation?
          <span>Contact Nine9 Tech Support</span>
        </div>
      </div>
    </article>

    <div class="faq-nav">
      <button type="button" onclick="renderFaqDetail(${prevIndex})" ${prevIndex < 0 ? "disabled" : ""}>
        Previous${prevIndex >= 0 ? `: ${escapeHTML(getFaqQuestion(faqs[prevIndex]))}` : ""}
      </button>

      <button type="button" onclick="renderFaqDetail(${nextIndex})" ${nextIndex >= faqs.length ? "disabled" : ""}>
        ${nextIndex < faqs.length ? `Next: ${escapeHTML(getFaqQuestion(faqs[nextIndex]))}` : "Next"}
      </button>
    </div>
  `;
}

function setActiveMenu(page) {
  menuLinks.forEach(item => {
    item.classList.toggle("active", item.dataset.page === page);
  });
}

function renderPage(page) {
  setActiveMenu(page);

  if (page === "programming") {
    renderProgramming();
    return;
  }

  if (page === "faq") {
    renderFaqList();
    return;
  }

  renderDownload();
}

function getPageFromHash() {
  const page = window.location.hash.replace("#", "");
  const validPages = ["download", "programming", "faq"];

  return validPages.includes(page) ? page : "download";
}

function renderPageFromHash() {
  renderPage(getPageFromHash());
}

function bindMenu() {
  menuLinks.forEach(link => {
    link.addEventListener("click", function () {
      const page = this.dataset.page;

      if (window.location.hash === `#${page}`) {
        renderPage(page);
        return;
      }

      window.location.hash = page;
    });
  });

  window.addEventListener("hashchange", renderPageFromHash);
}

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

function loadFooter() {
  fetch("../../footer/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}
