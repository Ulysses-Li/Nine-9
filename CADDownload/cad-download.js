const CAD_DOWNLOAD_DATA = {
  dxf: [
    { label: "99616-06-6 (dxf)" },
    { label: "99616-06-5 (dxf)" },
    { label: "99616-06-6L (dxf)" }
  ],
  step: [
    { label: "99616-06-6_N9MT05T1CT (step)" },
    { label: "99616-06-5_N9MT05T1CT (step)" },
    { label: "99616-06-6L_N9MT05T1CT (step)" },
    { label: "99616-08-8_N9MT05T1CT (step)" },
    { label: "99616-06-6_N9MT05T1RC05 (step)" },
    { label: "99616-06-5_N9MT05T1RC05 (step)" },
    { label: "99616-06-6L_N9MT05T1RC05 (step)" }
  ]
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFilteredItems(type, query) {
  const normalizedQuery = query.trim().toLowerCase();
  const items = CAD_DOWNLOAD_DATA[type] || [];

  if (!normalizedQuery) return items;

  return items.filter(item => item.label.toLowerCase().includes(normalizedQuery));
}

function showCadStatus(type, item) {
  const status = document.getElementById(`${type}Status`);
  if (!status) return;

  if (item?.href) {
    window.location.href = item.href;
    return;
  }

  status.textContent = item
    ? `${item.label} - CAD file is being prepared.`
    : "CAD file is being prepared.";
}

function renderCadSuggestions(type) {
  const input = document.getElementById(`${type}Search`);
  const list = document.getElementById(`${type}List`);
  const status = document.getElementById(`${type}Status`);

  if (!input || !list) return;

  const items = getFilteredItems(type, input.value);

  if (status) status.textContent = "";

  if (!items.length) {
    list.innerHTML = `<li class="is-empty">No CAD file found</li>`;
    return;
  }

  list.innerHTML = items.map(item => `
    <li>
      <button type="button" data-label="${escapeHTML(item.label)}">
        ${escapeHTML(item.label)}
      </button>
    </li>
  `).join("");

  list.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      const selected = items.find(item => item.label === button.dataset.label);
      input.value = selected?.label || button.dataset.label;
      renderCadSuggestions(type);
      showCadStatus(type, selected);
    });
  });
}

function bindCadSearch(type) {
  const input = document.getElementById(`${type}Search`);
  const button = document.querySelector(`[data-cad-search="${type}"] .cad-input-row button`);

  if (!input || !button) return;

  input.addEventListener("input", () => renderCadSuggestions(type));

  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const firstMatch = getFilteredItems(type, input.value)[0] || null;
    showCadStatus(type, firstMatch);
  });

  button.addEventListener("click", () => {
    const firstMatch = getFilteredItems(type, input.value)[0] || null;
    showCadStatus(type, firstMatch);
  });

  renderCadSuggestions(type);
}

document.addEventListener("DOMContentLoaded", () => {
  bindCadSearch("dxf");
  bindCadSearch("step");
});
