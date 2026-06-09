const NINE9_CATALOG = "./Nine9產品目錄_英文版.pdf";

const NINE9_DATA = [
  {
    id: "spotting-centering",
    name: "定點 / 中心孔",
    english: "Spotting / Centering",
    icon: "target",
    note: "用於定位、中心孔、倒角前置與小徑鑽孔前導。",
    series: [
      {
        id: "ace-spot-drill",
        name: "ACE Spot Drill",
        page: 14,
        note: "60 / 90 / 120 / 142 度可換式刀片，強調精度、冷卻與效率。",
        specs: ["Spotting", "Countersink", "Coolant", "High rigidity"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=14` },
          { name: "切削資料", type: "data", status: "available", url: "./index.html?product=ace-spot-drill" },
          { name: "選型備註", type: "note", status: "available", note: "適合高剛性定位、倒角與沉頭前處理。" }
        ]
      },
      {
        id: "micro-nc-spot-drill",
        name: "Micro Spot Drill / NC Spot Drill",
        page: 24,
        note: "Micro Spot Drill 提供 0.1 / 0.2 mm bottom width；NC Spot Drill 支援多角度與多用途。",
        specs: ["90 / 120 / 142 degrees", "60-145 degrees", "Spotting", "Chamfering"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=24` },
          { name: "應用檢核", type: "note", status: "available", note: "曲面、斜面或小孔加工前導定位可優先比較此系列。" }
        ]
      },
      {
        id: "i-center",
        name: "i-Center",
        page: 54,
        note: "可換式中心鑽，具重複精度與中心出水能力。",
        specs: ["Pilot dia. 1-10 mm", "DIN 332", "Coolant through"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=54` },
          { name: "選型備註", type: "note", status: "available", note: "適合需要縮短中心鑽設定時間與穩定刀長的製程。" }
        ]
      }
    ]
  },
  {
    id: "chamfering",
    name: "倒角 / 沉頭",
    english: "Chamfering / Countersink",
    icon: "bevel",
    note: "用於外緣倒角、孔口倒角、沉頭與複合式去毛邊。",
    series: [
      {
        id: "chamfer-mill",
        name: "Chamfer Mill",
        page: 86,
        note: "45 度倒角銑削，小徑沉頭與高速進給應用。",
        specs: ["45 degrees", "Countersink", "Small chamfer insert"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=86` },
          { name: "選型備註", type: "note", status: "available", note: "孔口倒角、沉頭與高效率倒角可由此系列開始。" }
        ]
      },
      {
        id: "nc-spot-chamfer",
        name: "NC Spot Drill",
        page: 24,
        note: "同一基礎刀桿可支援 spotting、grooving、chamfering、engraving 與 facing。",
        specs: ["60-145 degrees", "Multi-application", "CNC turning / machining centers"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=24` },
          { name: "選型備註", type: "note", status: "available", note: "當同一把刀需要兼作定位、倒角與刻字時優先評估。" }
        ]
      }
    ]
  },
  {
    id: "deburring",
    name: "去毛邊",
    english: "Deburring",
    icon: "spark",
    note: "用於孔口、背倒角、小徑孔與複合式去毛邊。",
    series: [
      {
        id: "nc-deburring",
        name: "NC Deburring",
        page: 92,
        note: "6 刃刀片，高進給；最小倒角直徑可到小孔應用。",
        specs: ["60 / 90 degrees", "6 flutes", "Fine hole deburring"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=92` },
          { name: "應用檢核", type: "note", status: "available", note: "重視倒角深度與直徑位置穩定性時使用。" }
        ]
      },
      {
        id: "mcc-deburring-threading",
        name: "MCC Mill Deburring / Threading",
        page: 84,
        note: "同系列支援 60 / 90 度去毛邊與 55 / 60 度螺紋銑削。",
        specs: ["Back deburring", "55 / 60 degree threading", "6 flutes"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=84` },
          { name: "螺紋計算器", type: "calculator", status: "available", url: "https://cwli.dev/Nine-9/CuttingData/index.html" }
        ]
      }
    ]
  },
  {
    id: "engraving",
    name: "刻字 / 雕刻",
    english: "Engraving",
    icon: "pen",
    note: "用於零件標示、模具、醫療零件與高表面品質刻字。",
    series: [
      {
        id: "engraving-tool",
        name: "Engraving Tool",
        page: 68,
        note: "30 / 45 / 60 / 90 度角度選擇，多面研磨以降低毛邊。",
        specs: ["30 / 45 / 60 / 90 degrees", "Burr-free", "Marking"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=68` },
          { name: "選型備註", type: "note", status: "available", note: "依刻線寬度、材質與角度需求選擇刀片角度。" }
        ]
      }
    ]
  },
  {
    id: "drilling",
    name: "鑽孔 / 螺旋插補",
    english: "Drilling / Helical Interpolation",
    icon: "drill",
    note: "用於螺旋插補、大徑孔、深孔與自動化排屑。",
    series: [
      {
        id: "nc-helix-drill",
        name: "NC Helix Drill",
        page: 114,
        note: "以 helical interpolation 加工，6 把刀覆蓋 ø13-ø65 mm。",
        specs: ["ø13-ø65 mm", "Circular ramping", "Max ramping angle 20 degrees"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=114` },
          { name: "G-code 產生器", type: "calculator", status: "available", url: "https://ulysses-li.github.io/Threads/Website/index.html" }
        ]
      },
      {
        id: "super-power-drill",
        name: "Super Power Drill / Super Drill",
        page: 128,
        note: "可換式鑽孔，3xD / 4xD / 5-10xD，部分可達 12xD。",
        specs: ["3xD / 4xD", "5-10xD", "ø10-ø40 mm"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=128` },
          { name: "選型備註", type: "note", status: "available", note: "斜面直接鑽孔、長切屑材與高孔徑精度需求可優先評估。" }
        ]
      }
    ]
  },
  {
    id: "milling",
    name: "銑削 / ER 系統",
    english: "Milling / Ergo System",
    icon: "mill",
    note: "用於小徑銑削、快換 ER 刀柄與高重複精度製程。",
    series: [
      {
        id: "ergo-system",
        name: "Ergo ER Taper-Shank Cutter",
        page: 98,
        note: "整合 ER11 / ER16 / ER20 刀柄，支援銑刀、定點鑽、刻字、倒角、中心鑽與 Chamfer Mill。",
        specs: ["ER11 / ER16 / ER20", "Quick change", "Repeatability"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=98` },
          { name: "選型備註", type: "note", status: "available", note: "需要縮短換刀與設定時間時使用 Ergo 系統。" }
        ]
      },
      {
        id: "power-mill",
        name: "Power Mill",
        page: 142,
        note: "小徑可換式銑刀，重視耐磨與肩銑切削刃強度。",
        specs: ["Start from ø10 mm", "Screw fit / Cylindrical", "Shoulder milling"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=142` },
          { name: "選型備註", type: "note", status: "available", note: "肩銑、小徑銑削與高耐磨刀片需求可由此系列開始。" }
        ]
      }
    ]
  },
  {
    id: "boring",
    name: "搪孔 / 精搪",
    english: "Boring",
    icon: "circle",
    note: "用於小孔精搪、可調式搪孔與取代部分鉸刀製程。",
    series: [
      {
        id: "ninebore",
        name: "NineBore Boring Tool",
        page: 148,
        note: "偏心調整搪孔桿，調整範圍 ±0.1 mm，ø5-ø50 mm 刀桿可互換。",
        specs: ["ø5-ø50 mm", "±0.1 mm adjustment", "G6.3 / 10,000 rpm"],
        tools: [
          { name: "PDF 型錄章節", type: "catalog", status: "available", url: `${NINE9_CATALOG}#page=148` },
          { name: "選型備註", type: "note", status: "available", note: "加工中心或專用機上的精搪與鉸刀替代製程可評估。" }
        ]
      }
    ]
  }
];
