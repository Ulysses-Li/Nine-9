const FAQ_PRODUCTS = [
  {
    id: "ace-spot-drill",
    name: "ACE Spot Drill",
    category: "Spotting / Chamfering",
    image: "../img/spotting.png",
    href: "../Products/AceSpotDrill/index.html#faq"
  },
  {
    id: "chamfer-mill",
    name: "Chamfer Mill",
    category: "Chamfering",
    image: "../img/chamfering.png",
    href: "../Products/ChamferMill/index.html#faq"
  },
  {
    id: "corner-rounding-rc",
    name: "Corner Rounding_RC Type",
    category: "Corner Rounding",
    image: "../img/chamfering.png",
    href: "../Products/CornerRoundingRC/index.html#faq"
  },
  {
    id: "corner-rounding-r",
    name: "Corner Rounding_R Type",
    category: "Corner Rounding",
    image: "../img/chamfering.png",
    href: "../Products/CornerRoundingR/index.html#faq"
  },
  {
    id: "ergo-er",
    name: "Ergo ER Taper-Shank Cutter",
    category: "Accessories / Cutter",
    image: "../img/Ergo.png",
    href: "../Products/ErgoER/index.html#faq"
  },
  {
    id: "icenter",
    name: "i-Center Center Drill",
    category: "Centering",
    image: "../img/centering.png",
    href: "../Products/ICenter/index.html#faq"
  },
  {
    id: "mcc-deburring",
    name: "MCC Deburring Mill",
    category: "Deburring",
    image: "../img/deburring.png",
    href: "../Products/MCCDeburring/index.html#faq"
  },
  {
    id: "mcc-thread-mill",
    name: "MCC Thread Mill",
    category: "Threading",
    image: "../img/threading.png",
    href: "../Products/MCCThreadMill/index.html#faq"
  },
  {
    id: "nc-spot-drill",
    name: "NC Spot Drill",
    category: "Spotting / Chamfering",
    image: "../img/spotting.png",
    href: "../Products/NCSpotDrill/index.html#faq"
  },
  {
    id: "micro-spot-drill",
    name: "Micro Spot Drill",
    category: "Engraving / Spotting",
    image: "../img/engraving.png",
    href: "../Products/MicroSpotDrill/index.html#faq"
  },
  {
    id: "n9mtw",
    name: "N9MT-W",
    category: "Engraving",
    image: "../img/engraving.png",
    href: "../Products/N9MTW/index.html#faq"
  },
  {
    id: "nc-deburring",
    name: "NC Deburring",
    category: "Deburring",
    image: "../img/deburring.png",
    href: "../Products/NCDeburring/index.html#faq"
  },
  {
    id: "nc-helix-drill",
    name: "NC Helix Drill",
    category: "Hole Making",
    image: "../img/helix.png",
    href: "../Products/NCHelixDrill/index.html#faq"
  },
  {
    id: "nine-bore",
    name: "NineBore Boring Tool",
    category: "Boring",
    image: "../img/boring.png",
    href: "../Products/NineBore/index.html#faq"
  },
  {
    id: "nine-swiss-boring",
    name: "NineSwiss Modular Head Boring Tool",
    category: "Boring",
    image: "../img/boring.png",
    href: "../Products/NineSwissBoring/index.html#faq"
  },
  {
    id: "nine-swiss-turning",
    name: "NineSwiss Modular Head Turning Tool",
    category: "Turning",
    image: "../img/turning.png",
    href: "../Products/NineSwissTurning/index.html#faq"
  },
  {
    id: "power-mill",
    name: "Power Mill",
    category: "Milling",
    image: "../img/milling.png",
    href: "../Products/PowerMill/index.html#faq"
  },
  {
    id: "super-drill",
    name: "Super Drill",
    category: "Drilling",
    image: "../img/drilling.png",
    href: "../Products/SuperDrill/index.html#faq"
  },
  {
    id: "super-power-drill",
    name: "Super Power Drill",
    category: "Drilling",
    image: "../img/drilling.png",
    href: "../Products/SuperPowerDrill/index.html#faq"
  },
  {
    id: "v060",
    name: "V060 / V045",
    category: "Engraving",
    image: "../img/engraving.png",
    href: "../Products/V060/index.html#faq"
  },
  {
    id: "w060",
    name: "W060",
    category: "Engraving",
    image: "../img/engraving.png",
    href: "../Products/W060/index.html#faq"
  },
  {
    id: "x060",
    name: "X060",
    category: "Engraving",
    image: "../img/engraving.png",
    href: "../Products/X060/index.html#faq"
  }
];

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderFaqProductCards() {
  const grid = document.getElementById("faqProductGrid");
  if (!grid) return;

  grid.innerHTML = FAQ_PRODUCTS.map((product, index) => `
    <a
      class="faq-product-card ${index === 0 ? "is-active" : ""}"
      href="${escapeHTML(product.href)}"
    >
      <img src="${escapeHTML(product.image)}" alt="">
      <span>${escapeHTML(product.category)}</span>
      <strong>${escapeHTML(product.name)}</strong>
      <em>Available</em>
    </a>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderFaqProductCards);
