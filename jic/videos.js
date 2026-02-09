// videos.js
// 觀看過的影片資料（只看，不輸入）
// 用意：
// - date 有值：會顯示在月曆格子內（可點開播放）
// - date 空字串：會顯示在「每週訓練影片（未排日期）」區塊，方便直接看


window.CALENDAR_NOTES = {
  "2026-01-12": "Q4季會（休息）",
  "2026-04-08": "Q1季會（休息）",
  "2026-07-13": "Q2季會（休息）",
  "2026-10-12": "Q3季會（休息）",

  "2026-06-29": "盤點及內稽（休息）",
  "2026-06-30": "盤點及內稽（休息）",
  "2026-12-28": "盤點及內稽（休息）",
  "2026-12-29": "盤點及內稽（休息）",

  "2026-02-14": "春節假日",
  "2026-02-15": "春節假日",
  "2026-02-16": "春節假日（除夕）",
  "2026-02-17": "春節假日（初一）",
  "2026-02-18": "春節假日（初二）",
  "2026-02-19": "春節假日（初三）",
  "2026-02-20": "春節假日（初四）",
  "2026-02-21": "春節假日（初五）",
  "2026-02-22": "春節假日（初六）",
  "2026-02-23": "開工大吉！",

  "2026-01-01": "元旦假期",
  "2026-01-02": "公司假期",
  "2026-02-27": "和平紀念日(補假)",
  "2026-04-03": "兒童節(補假)",
  "2026-04-06": "清明節",
  "2026-05-01": "勞動節",
  "2026-06-19": "端午節",
  "2026-09-25": "中秋節",
  "2026-09-28": "教師節",
  "2026-10-09": "國慶日(補假)",
  "2026-10-09": "光復節(補假)",
  "2026-12-25": "行憲紀念日"

};

  window.VIDEO_DB = [
    {
      series: "1",
      name: "Most Shops Don’t Use Tool Holders the Same Way",
      date: "2026-01-05",
      url: "https://youtu.be/z4_EGRBNhGc?si=azr1vtaUmLL8chpT"
    },
    {
      series: "2",
      name: "Unboxing the INSANE Göltenbodt Tooling System",
      date: "",
      url: "https://www.youtube.com/embed/CTO734Y5eEU"
    },
    {
      series: "3",
      name: "ISCAR TECH-TALK - WHISPERLINE Anti-Vibration Holder",
      date: "",
      url: "https://www.youtube.com/embed/HREEbCnDXWM?start"
    },
    {
      series: "4",
      name: "ISCAR TECH-TALK - CUT-V-GRIP Multi-Functional V-Shape Inserts",
      date: "",
      url: "https://www.youtube.com/embed/Oag-AwSQDgY"
    },
    {
      series: "5",
      name: "Aircraft Camera Mount - Machining",
      date: "",
      url: "https://youtu.be/EDFEOYW0MFY?si=iiEMtAaGUvhBhMQl"
    },
    {
      series: "6",
      name: "HoCNC Milling Job Shop Work – Custom Dovetail Fixturing for High Production",
      date: "2026-01-19",
      url: "https://youtu.be/q7zEOxLzx4U?si=o7eZotMF83Euz1uD"
    },
    {
      series: "7",
      name: "CNC Milling Job Shop Work - Prototype Time!",
      date: "",
      url: "https://youtu.be/y5m2sUdnP6E?si=JnszM4Ca_pE_OnRI"
    },
    {
      series: "8",
      name: "Comparing Tool Holders: Nut and Collet, Hydraulic Clamping, Thermogrip, and Hydraulic Press Fit.",
      date: "",
      url: "https://youtu.be/pNIL2D3W3TY?si=xTwR-kC8_ghbxFU1"
    },
    {
      series: "9",
      name: "How to choose the right tool holder for your CNC Machine | DN Solutions",
      date: "",
      url: "https://youtu.be/n2J1Wlfw-Dw?si=ADCU3Lnu3jxJz0Ei"
    },
    {
      series: "10",
      name: "ER Collet Essentials. Do You Know? – Haas Automation Tip of the Day",
      date: "",
      url: "https://youtu.be/WKikm6cQKh0?si=7SnNfSqI2b2_G5-C"
    },
    {
      series: "11",
      name: "CNC Machining an aluminum part | Hermle C400 | SolidCAM | iMachining",
      date: "",
      url: "https://youtu.be/Djb-Akfz21g?si=Uyn1P7Nns4X84tCh"
    },
    {
      series: "12",
      name: "CNC Milling Job Shop Work - Evicting Some Serious Metal From A Housing",
      date: "",
      url: "https://youtu.be/5L8dQr3GUM0?si=5VYWJ3oz0fpITU12"
    },
    {
      series: "13",
      name: "Feed Adjustments",
      date: "2026-01-26",
      url: "https://youtu.be/Cdv0TJXl928?si=nxZGkOw0au4EQ0fC"
    },
    {
      series: "14",
      name: "Chip Thinning & High-Feed Machining",
      date: "",
      url: "https://youtu.be/hBQRAclNSuo?si=aAvLltnbBsO4ap6I"
    },
    {
      series: "15",
      name: "CNC Drilling & Spotting: Pro Techniques",
      date: "2026-01-26",
      url: "https://youtu.be/rEnvGdy_zzE?si=G1uOgk-bApTIO394"
    },
    {
      series: "16",
      name: "3 Tools 3 Strategies 3 Results | Swarf vs. Barrel vs. Ball",
      date: "",
      url: "https://youtu.be/8sjAFeJQpLY?si=tfKs91XG578S7NGf"
    },
    {
      series: "17",
      name: "20年經驗職人 vs AI 科技！決定人類命運の加工對決！",
      date: "2026-02-02",
      url: "https://youtu.be/ZF7z_D0r7JE?si=o1spsou3gqFl22gJ"
    },
    {
      series: "18",
      name: "看不見的「公差」，精品的關鍵！一口氣了解尺寸公差、幾何公差、配合公差",
      date: "2026-02-02",
      url: "https://youtu.be/6FB3MYw5w4E?si=1OCRYtwSwKGykmz-"
    },
    {
      series: "19",
      name: "Understanding GD&T",
      date: "",
      url: "https://youtu.be/G7wnGeR_69k?si=2OTp2M9PnxSxN59W"
    },
    {
      series: "20",
      name: "Holier than Thou: Precision Holes by Drilling, Boring, and Reaming",
      date: "",
      url: "https://youtu.be/Qs_kXVsTQPE?si=zEOT-Ew8oV6by_nO"
    },
    {
      series: "21",
      name: "How to Design Parts for CNC Machining",
      date: "",
      url: "https://youtu.be/qx_qqVmjCc0?si=ao1WMlu65SYl6QaW"
    },
    {
      series: "22",
      name: "CNC machines - The Types of CNC Machines Explained (3 and 5 axis)",
      date: "",
      url: "https://youtu.be/mdRTq2_qI9Y?si=CzG1gFlnI4-_bcOY"
    },
    {
      series: "23",
      name: "5-Axis VERSUS 3-Axis - Which Would You Choose? UMC-500SS or VF-4SS - Haas Automation, Inc.",
      date: "",
      url: "https://youtu.be/oFvBe7cqxOE?si=ZNbPRmTP3ikWCBcW"
    },
    {
      series: "24",
      name: "Poor Man’s Anti-Vibration Boring Bar Holder– Cutting Down on Resonance!",
      date: "2026-02-09",
      url: "https://youtu.be/lRb1z9edaYU?si=lHgoy9r6yz68rJq3"
    },
    {
      series: "25",
      name: "快速搞懂齒輪！這 8 種你都該認識",
      date: "2026-02-02",
      url: "https://youtu.be/o4qY2HVwBJM?si=RJ2OLLRwuy4648Y2"
    },
    {
      series: "26",
      name: "How I Set` Up a Swiss Lathe for a Real Production Job | The Lathe Lab Ep.15",
      date: "",
      url: "https://youtu.be/sFdzjVHg3AA?si=EbcHy5Y754iLW1Wa"
    },
    {
      series: "27",
      name: "続々登場！出来ない…が出来る!に変わる工具！　マンヨーツール",
      date: "",
      url: "https://youtu.be/lO5tQhhGxPQ?si=F0kqs45_lRrf9haL"
    },
    {
      series: "28",
      name: "CNC fail compilation – lessons in every crash. (懂加工看到都會嚇到的影片)",
      date: "",
      url: "https://youtu.be/LIDmjodj_oQ?si=e0B-bqOimcjwuYCc"
    },
    {
      series: "29",
      name: "認識CNC基礎教學!開箱德國上億元神獸級CNC！ 台中精機【隱形工廠】What's CNC?",
      date: "",
      url: "https://youtu.be/KZ0lIzlYHw4?si=CVNPoUqsHyaeNBKb"
    },
    {
      series: "30",
      name: "SY2-42E / Swiss-type / 走心式車床",
      date: "",
      url: "https://youtu.be/cxrU0N7TxAU?si=0fIAg-0eOs9jWz5P"
    },
    {
      series: "31",
      name: "CITIZEN Cincom L20-XII with ATC (Automatic Tool Changer) www.citizenmachinery.co.uk",
      date: "",
      url: "https://youtu.be/H4FujlzFNfI?si=09V_aq347NFtgdfl"
    },
    {
      series: "32",
      name: "Making a Chessboard with Chess Pieces - CNC Milling and Turning - Machining",
      date: "",
      url: "https://youtu.be/7iKmTnZvA34?si=O30rHvcVDIDLu7rn"
    },
    {
      series: "33",
      name: "到瑞士拍手錶工廠 機械錶製作曝光 你從沒想過的真實製造過程 我們全拍到了！【超認真少年】Switzerland Watch & Tourbillon Factory Horage",
      date: "",
      url: "https://youtu.be/sWyxd79_zrE?si=MggxT5zx1ARQej1t"
    },
    {
      series: "34",
      name: "驚人的鑄造技術！八旬匠人累積的技藝",
      date: "",
      url: "https://youtu.be/BIO2cWTA2oM?si=Myo8G6NVPwqnnPp_"
    },
    {
      series: "35",
      name: "批量生產活塞零件的製程。在日本用 6000 噸壓力機鍛造曲軸",
      date: "",
      url: "https://youtu.be/4NTKbSLObM8?si=xUMyNR-IcZh9y9kR"
    }
  ];

// 註解與用意：
// 這份 videos.js 只負責「資料」，不放任何 UI 程式碼。
// 讓你未來要新增影片，只要新增一個物件即可，不會動到主程式。
