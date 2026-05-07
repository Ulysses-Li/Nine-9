/*
  products-data.js
  用意：
  1. 把 Products 分類資料集中管理。
  2. 未來要新增分類、改名稱、改圖示、改 Related Products，只要改這裡。
  3. render 程式不需要一直動，維護會比較乾淨。
*/

const PRODUCT_FAMILIES = [
  {
    title: "Spotting",
    image: "../img/spotting.png",
    href: "#spotting",
    products: [
      { name: "Ergo ER Taper-shank Indexable Cutters", href: "#ergo-er" },
      { name: "NineSwiss Modular Toolholder", href: "#nineswiss" }
    ]
  },
  {
    title: "Turning",
    image: "../img/turning.png",
    href: "#turning",
    products: [
      { name: "Ergo ER Taper-shank Indexable Cutters", href: "#ergo-er" },
      { name: "NineSwiss Modular Toolholder", href: "#nineswiss" }
    ]
  },
  {
    title: "Drilling",
    // icon: "fa-solid fa-circle-dot",
    image: "../img/drilling.png",
    href: "#drilling",
    products: [
      { name: "Spot Drill", href: "#spot-drill" },
      { name: "i-Center", href: "#i-center" },
      { name: "NC Helix Drill", href: "#nc-helix-drill" },
      { name: "Super Drill", href: "#super-drill" },
      { name: "Super Power Drill", href: "#super-power-drill" }
    ]
  },
  {
    title: "Milling",
    image: "../img/milling.png",
    href: "#milling",
    products: [
      { name: "Engraving Tools", href: "#engraving-tools" },
      { name: "Deburring & Threading Mill", href: "#deburring-threading-mill" },
      { name: "NC Helix Drill", href: "#nc-helix-drill" },
      { name: "Chamfer Mill", href: "#chamfer-mill" },
      { name: "Power Mill", href: "#power-mill" }
    ]
  },
  {
    title: "Boring",
    image: "../img/boring.png",
    href: "#boring",
    products: [
      { name: "Boring Tool", href: "#boring-tool" },
      { name: "NineSwiss Modular Toolholder", href: "#nineswiss" }
    ]
  },
  {
    title: "Chamfering",
    image: "../img/chamfering.png",
    href: "#chamfering",
    products: [
      { name: "Corner Rounding", href: "#corner-rounding" },
      { name: "Spot Drill", href: "#spot-drill" },
      { name: "Deburring & Threading Mill", href: "#deburring-threading-mill" },
      { name: "Chamfer Mill", href: "#chamfer-mill" }
    ]
  },
  {
    title: "Engraving",
    image: "../img/engraving.png",
    href: "#engraving",
    products: [
      { name: "Spot Drill", href: "#spot-drill" },
      { name: "Engraving Tools", href: "#engraving-tools" }
    ]
  },
  {
    title: "Accessories",
    image: "../img/accessories.png",
    href: "#accessories",
    products: [
      { name: "Technical Tools", href: "#technical-tools" },
      { name: "FAQ Support", href: "#faq" }
    ]
  }
];
