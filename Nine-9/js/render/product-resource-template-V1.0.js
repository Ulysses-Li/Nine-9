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

function getRangeMidpoint(range) {
  if (!Array.isArray(range) || range.length !== 2) return null;

  const min = Number(range[0]);
  const max = Number(range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  return (min + max) / 2;
}

function formatRange(range, suffix = "") {
  if (!Array.isArray(range) || range.length !== 2) return "-";

  return `${escapeHTML(range[0])}-${escapeHTML(range[1])}${suffix}`;
}

function formatDecimal(value, digits) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";

  return number.toFixed(digits).replace(/\.?0+$/, "");
}

function getSelectedCuttingData() {
  const cuttingData = PRODUCT_PAGE_DATA.cuttingData;
  if (!cuttingData) return null;

  const operationId = document.getElementById("cuttingOperation")?.value;
  const insertId = document.getElementById("cuttingInsert")?.value;
  const angle = document.getElementById("cuttingAngle")?.value;
  const materialId = document.getElementById("cuttingMaterial")?.value;

  const operation = cuttingData.operations.find(item => item.id === operationId);
  const insert = operation?.insertGroups.find(item => item.id === insertId);
  const angleData = insert?.angles?.[angle];
  const material = operation?.materials?.[materialId];
  const feedRange = angleData?.f?.[materialId];

  if (!operation || !insert || !angleData || !material || !feedRange) return null;

  return { operation, insert, angle, material, feedRange };
}

function updateCuttingDataOptions() {
  const cuttingData = PRODUCT_PAGE_DATA.cuttingData;
  const operationSelect = document.getElementById("cuttingOperation");
  const insertSelect = document.getElementById("cuttingInsert");
  const angleSelect = document.getElementById("cuttingAngle");
  const materialSelect = document.getElementById("cuttingMaterial");

  if (!cuttingData || !operationSelect || !insertSelect || !angleSelect || !materialSelect) return;

  const operation = cuttingData.operations.find(item => item.id === operationSelect.value) || cuttingData.operations[0];
  const currentInsert = insertSelect.value;
  const currentAngle = angleSelect.value;
  const currentMaterial = materialSelect.value;

  insertSelect.innerHTML = operation.insertGroups.map(item => `
    <option value="${escapeHTML(item.id)}">${escapeHTML(item.label)}</option>
  `).join("");

  const selectedInsert = operation.insertGroups.find(item => item.id === currentInsert) || operation.insertGroups[0];
  insertSelect.value = selectedInsert.id;

  angleSelect.innerHTML = Object.keys(selectedInsert.angles).map(angle => `
    <option value="${escapeHTML(angle)}">${escapeHTML(angle)} deg</option>
  `).join("");

  angleSelect.value = selectedInsert.angles[currentAngle] ? currentAngle : Object.keys(selectedInsert.angles)[0];

  materialSelect.innerHTML = Object.entries(operation.materials).map(([id, material]) => `
    <option value="${escapeHTML(id)}">${escapeHTML(material.label)}</option>
  `).join("");

  materialSelect.value = operation.materials[currentMaterial] ? currentMaterial : Object.keys(operation.materials)[0];
}

function updateCuttingDataCalculator({ resetRecommended = false } = {}) {
  const selected = getSelectedCuttingData();
  const vcInput = document.getElementById("cuttingVc");
  const feedInput = document.getElementById("cuttingFeed");
  const diameterInput = document.getElementById("cuttingDiameter");
  const rpmOutput = document.getElementById("cuttingRpm");
  const feedRateOutput = document.getElementById("cuttingFeedRate");
  const recommendation = document.getElementById("cuttingRecommendation");

  if (!selected || !vcInput || !feedInput || !diameterInput || !rpmOutput || !feedRateOutput || !recommendation) return;

  const defaultVc = getRangeMidpoint(selected.material.vc);
  const defaultFeed = getRangeMidpoint(selected.feedRange);

  if (resetRecommended || !vcInput.value) {
    vcInput.value = defaultVc == null ? "" : formatDecimal(defaultVc, 3);
  }

  if (resetRecommended || !feedInput.value) {
    feedInput.value = defaultFeed == null ? "" : formatDecimal(defaultFeed, 4);
  }

  if (!diameterInput.value) {
    diameterInput.value = formatDecimal(selected.insert.diameter, 3);
  }

  const diameter = Number(diameterInput.value);
  const vc = Number(vcInput.value);
  const feed = Number(feedInput.value);
  const rpm = Number.isFinite(diameter) && diameter > 0 && Number.isFinite(vc) && vc > 0
    ? (1000 * vc) / (Math.PI * diameter)
    : null;
  const feedRate = rpm != null && Number.isFinite(feed) && feed > 0 ? rpm * feed : null;

  rpmOutput.value = rpm == null ? "" : rpm.toFixed(0);
  feedRateOutput.value = feedRate == null ? "" : feedRate.toFixed(1);

  recommendation.innerHTML = `
    <div class="cutting-summary-item">
      <span>Vc Range</span>
      <strong>${formatRange(selected.material.vc, " m/min")}</strong>
    </div>
    <div class="cutting-summary-item">
      <span>Feed Range</span>
      <strong>${formatRange(selected.feedRange, " mm/rev")}</strong>
    </div>
    <div class="cutting-summary-item">
      <span>Grade</span>
      <strong>${escapeHTML(selected.material.grade)}</strong>
    </div>
    ${selected.operation.showQ ? `
      <div class="cutting-summary-item">
        <span>Q</span>
        <strong>${escapeHTML(selected.material.q || "-")}</strong>
      </div>
    ` : ""}
  `;
}

function bindCuttingDataCalculator() {
  const selects = ["cuttingOperation", "cuttingInsert", "cuttingAngle", "cuttingMaterial"];
  const inputs = ["cuttingDiameter", "cuttingVc", "cuttingFeed"];

  document.getElementById("cuttingOperation")?.addEventListener("change", () => {
    updateCuttingDataOptions();
    updateCuttingDataCalculator({ resetRecommended: true });
  });

  selects.slice(1).forEach(id => {
    document.getElementById(id)?.addEventListener("change", () => {
      updateCuttingDataOptions();
      updateCuttingDataCalculator({ resetRecommended: true });
    });
  });

  inputs.forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => {
      updateCuttingDataCalculator();
    });
  });
}

function renderCuttingDataCalculator() {
  const cuttingData = PRODUCT_PAGE_DATA.cuttingData;

  if (!cuttingData || !Array.isArray(cuttingData.operations) || !cuttingData.operations.length) {
    contentArea.innerHTML = `
      <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} Cutting Data Calculator</h1>
      <div class="title-line"></div>
      <div class="program-box">
        <div class="program-title">Cutting Data Calculator</div>
        <div class="program-desc">Coming soon</div>
      </div>
    `;
    return;
  }

  contentArea.innerHTML = `
    <h1 class="page-title">${escapeHTML(PRODUCT_PAGE_DATA.productName)} Cutting Data Calculator</h1>
    <div class="title-line"></div>

    <div class="cutting-calculator">
      <div class="cutting-form">
        <label>
          <span>Operation</span>
          <select id="cuttingOperation">
            ${cuttingData.operations.map(item => `
              <option value="${escapeHTML(item.id)}">${escapeHTML(item.label)}</option>
            `).join("")}
          </select>
        </label>

        <label>
          <span>Insert Size</span>
          <select id="cuttingInsert"></select>
        </label>

        <label>
          <span>Included Angle</span>
          <select id="cuttingAngle"></select>
        </label>

        <label>
          <span>Workpiece Material</span>
          <select id="cuttingMaterial"></select>
        </label>

        <label>
          <span>Machining Diameter D (mm)</span>
          <input id="cuttingDiameter" type="number" min="0" step="0.01">
        </label>

        <label>
          <span>Cutting Speed Vc (m/min)</span>
          <input id="cuttingVc" type="number" min="0" step="0.1">
        </label>

        <label>
          <span>Feed f (mm/rev)</span>
          <input id="cuttingFeed" type="number" min="0" step="0.001">
        </label>
      </div>

      <div class="cutting-results">
        <div>
          <h2>Recommended Cutting Data</h2>
          <div class="cutting-summary" id="cuttingRecommendation"></div>
        </div>

        <div class="cutting-output-grid">
          <label>
            <span>Spindle Speed</span>
            <input id="cuttingRpm" type="text" readonly>
            <em>RPM</em>
          </label>

          <label>
            <span>Feed Rate</span>
            <input id="cuttingFeedRate" type="text" readonly>
            <em>mm/min</em>
          </label>
        </div>

        <div class="cutting-formula">
          <div>RPM = 1000 x Vc / (pi x D)</div>
          <div>Feed Rate = RPM x f</div>
        </div>
      </div>
    </div>
  `;

  updateCuttingDataOptions();
  updateCuttingDataCalculator({ resetRecommended: true });
  bindCuttingDataCalculator();
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

  if (page === "cutting-data") {
    renderCuttingDataCalculator();
    return;
  }

  renderDownload();
}

function getPageFromHash() {
  const page = window.location.hash.replace("#", "");
  const validPages = ["download", "programming", "faq", "cutting-data"];

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
