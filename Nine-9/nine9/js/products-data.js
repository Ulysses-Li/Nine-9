/* =========================================================
   Nine9 Product Families
   用意：
   1. 集中管理所有產品分類
   2. 未來新增產品只要修改這份檔案
   3. 前端 Card / Menu / Sidebar 都可共用
   4. 結構化方便維護
========================================================= */

const PRODUCT_FAMILIES = [
  {
    title: "Spotting",
    image: "../img/spotting.png",
    href: "/Machining/Spotting/index.html",
    products: [
      { name: "ACE Spot Drill", href: "#ace-spot-drill" },
      { name: "Micro Spot Drill", href: "#micro-spot-drill" },
      { name: "NC Spot Drill", href: "#nc-spot-drill" }
    ]
  },

  {
    title: "Centering",
    image: "../img/centering.png",
    href: "/Machining/Centering/index.html",
    products: [
      { name: "i-Center Center Drill", href: "#i-center-center-drill" }
    ]
  },

  {
    title: "Drilling",
    image: "../img/drilling.png",
    href: "/Machining/Drilling/index.html",
    products: [
      { name: "Super Drill", href: "#super-drill" },
      { name: "Super Power Drill", href: "#super-power-drill" }
    ]
  },

  {
    title: "Boring",
    image: "../img/boring.png",
    href: "/Machining/Boring/index.html",
    products: [
      { name: "NineBore Boring Tool", href: "#ninebore-boring-tool" },
      { name: "NineSwiss Modular Head Boring Tool", href: "#nineswiss-modular-head-boring-tool" }
    ]
  },

  {
    title: "Milling",
    image: "../img/milling.png",
    href: "/Machining/Milling/index.html",
    products: [
      { name: "Power Mill", href: "#power-mill" }
    ]
  },

  {
    title: "NC Helix Drill",
    image: "../img/nc-helix-drill.png",
    href: "/Machining/NC_Helix_Drill/index.html",
    products: [
      { name: "NC Helix Drill", href: "#nc-helix-drill" }
    ]
  },

  {
    title: "Threading",
    image: "../img/threading.png",
    href: "/Machining/Threading/index.html",
    products: [
      { name: "MCC Thread Mill", href: "#mcc-thread-mill" }
    ]
  },

  {
    title: "Engraving",
    image: "../img/engraving.png",
    href: "/Machining/Engraving/index.html",
    products: [
      { name: "X060", href: "#x060" },
      { name: "V060 / V045", href: "#v060-v045" },
      { name: "W060", href: "#w060" },
      { name: "N9MT-W", href: "#n9mt-w" },
      { name: "NC Spot Drill", href: "#nc-spot-drill" }
    ]
  },

  {
    title: "Chamfering & Corner Radii",
    image: "../img/deburring-chamfering.png",
    href: "/Machining/Chamfering_Corner_Radii/index.html",
    products: [
      { name: "Chamfer Mill", href: "#chamfer-mill" },
      { name: "ACE Spot Drill", href: "#ace-spot-drill" },
      { name: "NC Spot Drill", href: "#nc-spot-drill" },
      { name: "Corner Rounding_RC Type", href: "#corner-rounding-rc-type" },
      { name: "Corner Rounding_R Type", href: "#corner-rounding-r-type" }
    ]
  },

  {
    title: "Deburring",
    image: "../img/deburring.png",
    href: "/Machining/Deburring/index.html",
    products: [
      { name: "NC Deburring", href: "#nc-deburring" },
      { name: "MCC Deburring Mill", href: "#mcc-deburring-mill" }
    ]
  },

  {
    title: "Turning",
    image: "../img/turning.png",
    href: "/Machining/Turning/index.html",
    products: [
      { name: "NineSwiss Modular Head Turning Tool", href: "#nineswiss-modular-head-turning-tool" },
      { name: "NineSwiss Modular Head Boring Tool", href: "#nineswiss-modular-head-boring-tool" }
    ]
  },

  {
    title: "ER Taper-Shank Cutter",
    image: "../img/ergo-er.png",
    href: "/Machining/ER_Taper-Shank_Cutter/index.html",
    products: [
      { name: "Ergo ER Taper-Shank Cutter", href: "#ergo-er-taper-shank-cutter" }
    ]
  }
];