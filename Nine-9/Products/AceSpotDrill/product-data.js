const PRODUCT_PAGE_DATA = {
  "productName": "ACE Spot Drill",
  "downloads": [
    {
      "title": "Catalog",
      "image": "",
      "href": ""
    },
    {
      "title": "Cutting Data",
      "image": "",
      "href": ""
    }
  ],
  "programming": {
    "title": "NC Program Generator",
    "desc": "ACE Spot Drill technical support area for catalog downloads, cutting data, NC programming support, and knowledge-base FAQ.",
    "href": ""
  },
  "faqs": [
    {
      "topic": "Technical FAQ",
      "question": "ACE 可以取代 NC Spot Drill 嗎？",
      "answer": "可以在特定 spotting / 定位應用中取代，但要確認客戶要求的是孔口直徑、深度、角度還是靜點尺寸。`120°` 案例中，`φ10、Ap=2 mm` 會得到約 `136.4°` 的開口角與 `3.07 mm` 靜點，不一定等同傳統 NC Spot Drill 的結果。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 加工深度超過多少要啄鑽？",
      "answer": "經驗規則：60° 加工深度小於 `Tmax/3` 可不啄鑽；超過 `Tmax/3` 建議啄鑽。深加工若不啄鑽，排屑不佳可能造成擠壓、摩擦、破裂、崩刃。"
    },
    {
      "topic": "Technical FAQ",
      "question": "啄鑽 Q 值怎麼抓？",
      "answer": "先計算 `t/Tmax`，再依參數圖表或經驗起測。信件案例：\n\n- `S9MT1603-060`，`t/Tmax=0.535`，建議 `Q=0.3 mm`。\n- `S9MT1003-060`，孔約 4.8~5 mm，建議 `Q=0.2 mm`。\n- `S9MT2004-060`，切深 8.8 mm，曾提供 `Q=0.3` 與 `Q=0.5` 的加工時間比較。"
    },
    {
      "topic": "Technical FAQ",
      "question": "不銹鋼 316L 用什麼參數？",
      "answer": "信件建議：\n\nS9MT0802-090 NC5254\nVc = 30~60 m/min\nf = 0.01~0.04 mm/rev"
    },
    {
      "topic": "Technical FAQ",
      "question": "鋁合金 A5050 / A7070 點面壽命不好怎麼判斷？",
      "answer": "先看是否有崩刃與震動。信件中客戶用 `S=2400 rpm, F=300~400 mm/min`，加工徑 14 mm，推算 `Vc≈105 m/min, f≈0.125~0.16 mm/rev`，參數本身不算特殊。若壽命不好，應追問實際孔數、磨耗照片、夾持剛性、冷卻、是否震動。"
    },
    {
      "topic": "Technical FAQ",
      "question": "SKD11 壽命不足怎麼改善？",
      "answer": "SKD11 是高碳高合金冷作模具鋼，抗磨性高，刀片損耗大。建議降低 `Vc`，保持或提高每轉進給。信件案例：`S=4000 -> 2000 rpm`、`S=5000 -> 2500 rpm`，`F` 暫維持不變。若表面粗糙度不佳，再降低 `F`。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 120° 加工後角度不準，是刀片角度問題嗎？",
      "answer": "不一定。生產紀錄中 120° 刀片角度約 `119.6°~120.3°`，若刀片量測正常，問題可能來自切削側推力、量測位置、倒角尺寸、速度、鍛造件夾持定位或先加工小孔造成的影響。可嘗試分刀精修、降低轉速與進給、先倒角後加工小孔。"
    },
    {
      "topic": "Technical FAQ",
      "question": "SCM415 加工 M6 定位孔容易破或毛邊怎麼辦？",
      "answer": "SCM415 低碳合金鋼較不易斷屑。若 M6 定位孔包含倒角，孔尺寸可能大於 7 mm 甚至接近 8 mm。建議使用 `NC5254` 降低切削阻力，或加大使用 `SI10` 刀片以改善接近滿刀造成的排屑問題。"
    },
    {
      "topic": "Technical FAQ",
      "question": "客戶只有提供 NC 程式，能直接建議嗎？",
      "answer": "不建議直接下結論。若程式深度跨度超過刀片 `Tmax`，或看起來像螺旋加工，需請客戶提供工件圖、加工剖面、目標尺寸與刀具路徑。案例中 `S9MT0802-060` 的 `Tmax=5.6 mm`，但客戶程式 Z 跨度達 `12.957 mm`，明顯需補資料。"
    },
    {
      "topic": "Technical FAQ",
      "question": "刀片寄回檢查時，為什麼還要客戶補資料？",
      "answer": "單看刀片照片只能判斷磨耗外觀，無法知道每個刃口對應的加工條件。若同一刀片不同刃口磨耗差異很大，常見原因是客戶做了不同測試。需補材料、加工條件、孔尺寸、深度、冷卻、夾持與每個刃口的使用紀錄。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 刀桿柄部公差是多少？",
      "answer": "信件回覆為：柄部軸公差設定 `h7`。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 可以做 Morse taper 或左轉特殊刀片嗎？",
      "answer": "信件回覆：\n\n- Morse taper：目前星艦刀桿沒有承接。\n- 左轉或特殊刀片：目前尚未開放訂製特殊刀片計畫。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 是否可用在車床？",
      "answer": "有車床用方柄圖面案例，例如 `99688-SI08-12方柄` / `99688-SI08-L1212MF`。但需以圖面確認尺寸、刀片位置與客戶機台需求，不能直接視為標準品全系列可供。"
    },
    {
      "topic": "Technical FAQ",
      "question": "刀片安裝要注意什麼？",
      "answer": "刀座與刀片需清潔，刀片要完全平貼刀座並用手壓緊，再鎖螺絲。建議用扭力扳手。刀片未貼平可能造成偏擺、角度誤差、震動、崩刃。"
    },
    {
      "topic": "Technical FAQ",
      "question": "ACE 的設計變更重點是什麼？",
      "answer": "2023/06/30 設變通知指出：為增加壽命與排屑效果，將鑽尖靜點加厚並加大排屑隙角，讓切屑有足夠空間排出，提高刀片耐用度。"
    }
  ]
};
