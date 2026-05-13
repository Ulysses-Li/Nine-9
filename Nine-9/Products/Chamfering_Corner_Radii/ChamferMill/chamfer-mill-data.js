/* =========================================================
   Chamfer Mill Page Data
   用意：
   1. 集中管理 Chamfer Mill 產品頁資料
   2. 未來新增 PDF / FAQ / NC 程式只改這裡
========================================================= */

const PRODUCT_PAGE_DATA = {
  productName: "Chamfer Mill",

  downloads: [
    {
      title: "Catalog",
      image: "./img/chamfer-mill-catalog-cover.jpg",
      href: "./catalog/chamfer-mill-catalog.pdf"
    },
    {
      title: "Cutting Data",
      image: "./img/chamfer-mill-cutting-data-cover.jpg",
      href: "./cutting-data/chamfer-mill-cutting-data.pdf"
    }
  ],

  programming: {
    title: "NC Program Generator",
    desc:
      "此區可放 Chamfer Mill 專用 NC 程式產生器、加工條件計算器，或連結到外部 G-code 工具頁面。",
    href: "./nc-program/index.html"
  },

  faqs: [
    {
      title: "問題一",
      subtitle: "文字敘述",
      detailTitle: "問題一的技術問題",
      mediaText: "問題一\n圖片或影片",
      desc:
        "這裡放問題一的詳細說明，例如加工時可能遇到的原因、判斷方式與建議改善方向。"
    },
    {
      title: "問題二",
      subtitle: "文字敘述",
      detailTitle: "問題二的技術問題",
      mediaText: "問題二\n圖片或影片",
      desc:
        "這裡放問題二的詳細說明，例如刀具壽命、加工條件、切削聲音、負載變化等技術內容。"
    },
    {
      title: "問題三",
      subtitle: "文字敘述",
      detailTitle: "問題三的技術問題",
      mediaText: "問題三\n圖片或影片",
      desc:
        "這裡放問題三的詳細說明，例如毛邊、倒角品質、表面粗糙度或切削參數修正建議。"
    },
    {
      title: "問題四",
      subtitle: "文字敘述",
      detailTitle: "問題四的技術問題",
      mediaText: "問題四\n圖片或影片",
      desc:
        "這裡放問題四的詳細說明，例如毛邊、倒角品質、表面粗糙度或切削參數修正建議。"
    }
  ]
};