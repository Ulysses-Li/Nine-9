/* =========================================================
   Nine9 Product Families
   用意：
   1. 集中管理所有產品分類
   2. 未來新增產品只要修改這份檔案
   3. 前端 Card / Menu / Sidebar 都可共用
   4. 結構化方便維護
========================================================= */

const PRODUCT_FAMILIES = [

  /* =========================================================
     Spotting & Centering
     用意：
     定位、定心、中心孔、預鑽孔加工
  ========================================================= */
  {
    title: "Spotting & Centering",
    image: "../img/spotting.png",
    href: "#spotting",

    products: [
      {
        name: "NC Spot Drill",
        href: "#nc-spot-drill"
      },

      {
        name: "ACE Spot Drill",
        href: "#ace-spot-drill"
      },

      {
        name: "Micro Spot Drill",
        href: "#micro-spot-drill"
      },

      {
        name: "i-Center",
        href: "#i-center"
      }
    ]
  },



  /* =========================================================
     Turning
     用意：
     車削加工、車床模組刀座相關
  ========================================================= */
  {
    title: "Turning",
    image: "../img/turning.png",
    href: "#turning",

    products: [
      {
        name: "NineSwiss Modular Toolholder",
        href: "#nineswiss"
      },

      {
        name: "Ergo ER Taper-shank Cutter",
        href: "#ergo-er"
      },

      {
        name: "NineBore Turning System",
        href: "#ninebore-turning"
      }
    ]
  },



  /* =========================================================
     Hole Making
     用意：
     孔加工類
     比單純 Drilling 更專業
  ========================================================= */
  {
    title: "Hole Making",
    image: "../img/drilling.png",
    href: "#hole-making",

    products: [
      {
        name: "NC Spot Drill",
        href: "#nc-spot-drill"
      },

      {
        name: "i-Center",
        href: "#i-center"
      },

      {
        name: "NC Helix Drill",
        href: "#nc-helix-drill"
      },

      {
        name: "Super Drill",
        href: "#super-drill"
      },

      {
        name: "Super Power Drill",
        href: "#super-power-drill"
      }
    ]
  },



  /* =========================================================
     Milling
     用意：
     銑削加工類
  ========================================================= */
  {
    title: "Milling",
    image: "../img/milling.png",
    href: "#milling",

    products: [
      {
        name: "Power Mill",
        href: "#power-mill"
      },

      {
        name: "MCC Mill",
        href: "#mcc-mill"
      },

      {
        name: "NC Helix Drill",
        href: "#nc-helix-drill"
      }
    ]
  },



  /* =========================================================
     Boring
     用意：
     搪孔加工類
  ========================================================= */
  {
    title: "Boring",
    image: "../img/boring.png",
    href: "#boring",

    products: [
      {
        name: "NineBore Boring Tool",
        href: "#ninebore"
      },

      {
        name: "Fine Boring System",
        href: "#fine-boring"
      }
    ]
  },



  /* =========================================================
     Chamfering & Deburring
     用意：
     倒角、去毛邊加工
  ========================================================= */
  {
    title: "Chamfering & Deburring",
    image: "../img/chamfering.png",
    href: "#chamfering",

    products: [
      {
        name: "Chamfer Mill",
        href: "#chamfer-mill"
      },

      {
        name: "NC Deburring",
        href: "#nc-deburring"
      },

      {
        name: "Corner Rounding",
        href: "#corner-rounding"
      },

      {
        name: "Deburring & Threading Mill",
        href: "#deburring-threading-mill"
      }
    ]
  },



  /* =========================================================
     Engraving
     用意：
     刻字、雕刻、Marking
  ========================================================= */
  {
    title: "Engraving",
    image: "../img/engraving.png",
    href: "#engraving",

    products: [
      {
        name: "Engraving Tool",
        href: "#engraving-tool"
      },

      {
        name: "Micro Engraving",
        href: "#micro-engraving"
      }
    ]
  },



  /* =========================================================
     Accessories
     用意：
     周邊配件與技術支援
  ========================================================= */
  {
    title: "Accessories",
    image: "../img/accessories.png",
    href: "#accessories",

    products: [
      {
        name: "Ergo System",
        href: "#ergo-system"
      },

      {
        name: "Extension Bar",
        href: "#extension-bar"
      },

      {
        name: "Tool Length Setter",
        href: "#tool-length-setter"
      },

      {
        name: "Technical Support",
        href: "#technical-support"
      },

      {
        name: "FAQ Support",
        href: "#faq"
      }
    ]
  }

];
