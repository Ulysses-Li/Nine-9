(() => {
  // 基礎字典 — 我已幫您加入日文、德文、西班牙文的翻譯
  const DICT = {
    'zh-TW': {
      // — 導覽列 & 共用文字 —
      'nav.sol': '解決方案',
      'nav.prod': '產品',
      'nav.dl': '下載',
      'nav.contact': '聯絡我們',
      'nav.lang': '語言／地區',
      'cta.learn': '進一步了解',
      'cta.download': '下載 PDF',
      'cta.buy': '購買 ›',

      // — Thread Milling 卡片 —
      'tm.badge': '全新',
      'tm.title': 'Thread Milling',
      'tm.desc': '專為工程師設計的智慧螺紋銑削工具，快速生成精準 G-code，提升加工效率與穩定性。',

      // — MCC Mill PDF 卡片 —
      'mcc.pdf1.title': 'Nine-9 MCC Mill 新版目錄',
      'mcc.pdf1.desc': '可下載完整的 Nine-9 MCC Mill 新版目錄。',
      'mcc.pdf2.title': 'MCC Mill - 60° Parallel Thread Datas',
      'mcc.pdf2.desc': '可下載完整的 MCC Mill- 60° Thread Milling 表單。',

      // — Helix Drill 卡片 —
      'helix.badge': '全新',
      'helix.title': 'NC Helix Drill',
      'helix.desc': '適用於多種材料的高效螺旋鑽孔刀具。',
      'helix.pdf1.title': 'Nine-9 NC Helix Drill 新版目錄',
      'helix.pdf1.desc': '可下載完整的 Nine-9 NC Helix Drill 新版目錄。'
    },
    'en-US': {
      // — Navigation & Common Text —
      'nav.sol': 'Solutions',
      'nav.prod': 'Products',
      'nav.dl': 'Downloads',
      'nav.contact': 'Contact',
      'nav.lang': 'Language/Region',
      'cta.learn': 'Learn More',
      'cta.download': 'Download PDF',
      'cta.buy': 'Buy ›',

      // — Thread Milling card —
      'tm.badge': 'NEW',
      'tm.title': 'Thread Milling',
      'tm.desc': 'An intelligent thread milling tool designed for engineers, quickly generating precise G-code to improve machining efficiency and stability.',

      // — MCC Mill PDF Cards —
      'mcc.pdf1.title': 'Nine-9 MCC Mill New Catalog',
      'mcc.pdf1.desc': 'Download the complete Nine-9 MCC Mill new catalog.',
      'mcc.pdf2.title': 'MCC Mill - 60° Parallel Thread Datas',
      'mcc.pdf2.desc': 'Download the complete MCC Mill- 60° Thread Milling data sheet.',

      // — Helix Drill Card —
      'helix.badge': 'NEW',
      'helix.title': 'NC Helix Drill',
      'helix.desc': 'High-efficiency helical drilling tools for various materials.',
      'helix.pdf1.title': 'Nine-9 NC Helix Drill New Catalog',
      'helix.pdf1.desc': 'Download the complete Nine-9 NC Helix Drill new catalog.'
    },
    'ja-JP': { // 新增：日文
      // — 導覽列 & 共用文字 —
      'nav.sol': 'ソリューション',
      'nav.prod': '製品',
      'nav.dl': 'ダウンロード',
      'nav.contact': 'お問い合わせ',
      'nav.lang': '言語／地域',
      'cta.learn': '詳細を見る',
      'cta.download': 'PDFをダウンロード',
      'cta.buy': '購入 ›',

      // — Thread Milling 卡片 —
      'tm.badge': '新機能',
      'tm.title': 'スレッドミリング',
      'tm.desc': 'エンジニア向けに設計されたインテリジェントなスレッドミリングツール。正確なGコードを迅速に生成し、加工効率と安定性を向上させます。',

      // — MCC Mill PDF 卡片 —
      'mcc.pdf1.title': 'Nine-9 MCC Mill 新カタログ',
      'mcc.pdf1.desc': 'Nine-9 MCC Millの新カタログ（完全版）をダウンロードできます。',
      'mcc.pdf2.title': 'MCC Mill - 60°平行ねじデータ',
      'mcc.pdf2.desc': 'MCC Mill 60°スレッドミリングの完全なデータシートをダウンロードできます。',

      // — Helix Drill 卡片 —
      'helix.badge': '新機能',
      'helix.title': 'NCヘリカルドリル',
      'helix.desc': '様々な材料に対応する高効率のヘリカルドリル工具。',
      'helix.pdf1.title': 'Nine-9 NCヘリカルドリル 新カタログ',
      'helix.pdf1.desc': 'Nine-9 NCヘリカルドリルの新カタログ（完全版）をダウンロードできます。'
    },
    'de-DE': { // 新增：德文
      // — Navigation & Common Text —
      'nav.sol': 'Lösungen',
      'nav.prod': 'Produkte',
      'nav.dl': 'Downloads',
      'nav.contact': 'Kontakt',
      'nav.lang': 'Sprache/Region',
      'cta.learn': 'Mehr erfahren',
      'cta.download': 'PDF herunterladen',
      'cta.buy': 'Kaufen ›',

      // — Thread Milling card —
      'tm.badge': 'NEU',
      'tm.title': 'Gewindefräsen',
      'tm.desc': 'Ein intelligentes Gewindefräswerkzeug für Ingenieure, das präzisen G-Code schnell generiert, um die Bearbeitungseffizienz und -stabilität zu verbessern.',

      // — MCC Mill PDF Cards —
      'mcc.pdf1.title': 'Nine-9 MCC Mill - Neuer Katalog',
      'mcc.pdf1.desc': 'Laden Sie den vollständigen neuen Katalog von Nine-9 MCC Mill herunter.',
      'mcc.pdf2.title': 'MCC Mill - 60° Parallelgewinde Daten',
      'mcc.pdf2.desc': 'Laden Sie das vollständige Datenblatt für MCC Mill- 60° Gewindefräsen herunter.',

      // — Helix Drill Card —
      'helix.badge': 'NEU',
      'helix.title': 'NC Helix Drill',
      'helix.desc': 'Hocheffiziente Spiralbohrwerkzeuge für verschiedene Materialien.',
      'helix.pdf1.title': 'Nine-9 NC Helix Drill - Neuer Katalog',
      'helix.pdf1.desc': 'Laden Sie den vollständigen neuen Katalog von Nine-9 NC Helix Drill herunter.'
    },
    'es-ES': { // 新增：西班牙文
      // — Navigation & Common Text —
      'nav.sol': 'Soluciones',
      'nav.prod': 'Productos',
      'nav.dl': 'Descargas',
      'nav.contact': 'Contacto',
      'nav.lang': 'Idioma/Región',
      'cta.learn': 'Saber más',
      'cta.download': 'Descargar PDF',
      'cta.buy': 'Comprar ›',

      // — Thread Milling card —
      'tm.badge': 'NUEVO',
      'tm.title': 'Fresado de Roscas',
      'tm.desc': 'Una herramienta inteligente de fresado de roscas diseñada para ingenieros, que genera rápidamente código G preciso para mejorar la eficiencia y la estabilidad del mecanizado.',

      // — MCC Mill PDF Cards —
      'mcc.pdf1.title': 'Nuevo Catálogo de Nine-9 MCC Mill',
      'mcc.pdf1.desc': 'Descargue el nuevo catálogo completo de Nine-9 MCC Mill.',
      'mcc.pdf2.title': 'Datos de Roscas Paralelas de 60° - MCC Mill',
      'mcc.pdf2.desc': 'Descargue la hoja de datos completa para el fresado de roscas de 60° de MCC Mill.',

      // — Helix Drill Card —
      'helix.badge': 'NUEVO',
      'helix.title': 'NC Helix Drill',
      'helix.desc': 'Herramientas de perforación helicoidal de alta eficiencia para diversos materiales.',
      'helix.pdf1.title': 'Nuevo Catálogo de Nine-9 NC Helix Drill',
      'helix.pdf1.desc': 'Descargue el nuevo catálogo completo de Nine-9 NC Helix Drill.'
    }
    // 未來若要新增更多語言，可在此處繼續添加，例如 'ko-KR': { ... }
  };

  const STORAGE_KEY = 'site.lang';

  function getInitialLang() {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('lang');
    if (q) return q;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // 預設回落 zh-TW
    return 'zh-TW';
  }

  function setLang(lang) {
    const dict = DICT[lang] || DICT['zh-TW'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    localStorage.setItem(STORAGE_KEY, lang);
    // 若你的網站是分路徑 /en/ /zh-TW/，可在此呼叫 redirectByLang(lang)
  }

  function initLangMenu() {
    document.querySelectorAll('.country-item:not(.disabled)')
      .forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const lang = a.getAttribute('data-lang');
          setLang(lang);
          // 如需導頁到不同子路徑，改為：redirectByLang(lang)
        });
      });
  }

  // 可選：依語言導頁（若你採多語分站）
  function redirectByLang(lang) {
    // 範例對映，可自行調整
    const map = {
      'zh-TW': '/zh-TW/',
      'en-US': '/en/',
      'ja-JP': '/ja/',
      'ko-KR': '/ko/'
    };
    if (map[lang]) window.location.href = map[lang];
  }

  // 啟動
  document.addEventListener('DOMContentLoaded', () => {
    setLang(getInitialLang());
    initLangMenu();
  });

  // 對外（可在其他檔案呼叫）
  window.LangCtl = { setLang };
})();
// ===== 以上內容請存成 /assets/lang-control.js ===== -->