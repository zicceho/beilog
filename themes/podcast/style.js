/* eslint-disable react/no-unknown-property */
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import CONFIG from './config'

export const Style = () => (
  <style jsx global>{`
    :root {
      --nianan-bg: ${CONFIG.NIANAN_BACKGROUND};
      --nianan-text: ${CONFIG.NIANAN_TEXT};
      --nianan-muted: ${CONFIG.NIANAN_MUTED};
      --nianan-border: ${CONFIG.NIANAN_BORDER};
      --nianan-accent: ${CONFIG.NIANAN_ACCENT};
      --nianan-max: ${CONFIG.NIANAN_MAX_WIDTH};
    }

    #theme-podcast {
      min-height: 100vh;
      background: var(--nianan-bg);
      color: var(--nianan-text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-size: 15px;
      line-height: 1.8;
      letter-spacing: 0;
    }

    #theme-podcast * { box-sizing: border-box; }
    #theme-podcast a { color: inherit; text-decoration: none; }
    #theme-podcast button, #theme-podcast input { font: inherit; }

    .nianan-site-header {
      border-bottom: 1px solid var(--nianan-border);
      background: rgba(255,255,255,.96);
    }

    .nianan-header-inner {
      max-width: var(--nianan-max);
      margin: 0 auto;
      min-height: 82px;
      padding: 0 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
    }

    .nianan-logo {
      display: inline-flex;
      align-items: center;
      min-width: 170px;
      font-size: 23px;
      font-weight: 700;
      letter-spacing: .06em;
    }

    .nianan-logo img {
      max-height: 48px;
      width: auto;
      object-fit: contain;
    }

    .nianan-desktop-nav { display:flex; align-items:center; gap: 26px; }
    .nianan-nav-link, .nianan-nav-search {
      color: #333 !important;
      font-size: 14px;
      transition: opacity .2s ease;
    }
    .nianan-nav-link:hover, .nianan-nav-search:hover, .nianan-nav-social:hover { opacity: .55; }
    .nianan-nav-dropdown { position:relative; }
    .nianan-nav-dropdown-trigger { border:0; background:transparent; padding:0; cursor:pointer; }
    .nianan-nav-chevron { font-size:9px; margin-left:5px; }
    .nianan-nav-dropdown-menu { position:absolute; right:0; top:calc(100% + 14px); min-width:150px; padding:7px 0; border:1px solid var(--nianan-border); background:var(--nianan-bg); box-shadow:0 8px 30px rgba(0,0,0,.08); }
    .nianan-nav-dropdown-item { display:block; padding:7px 14px; white-space:nowrap; font-size:13px; }
    .nianan-nav-dropdown-item:hover { background:#f4f4f4; }
    .dark #theme-podcast .nianan-nav-dropdown-item:hover { background:#202021; }
    .nianan-nav-social { color:#777 !important; font-size:12px; }
    .nianan-nav-search { width: 28px; height: 28px; display:flex; align-items:center; justify-content:center; }

    .nianan-mobile-toggle { display:none; border:0; background:none; cursor:pointer; color:#222; }
    .nianan-mobile-nav { display:none; }

    .nianan-main { min-height: calc(100vh - 160px); padding: 42px 28px 80px; }
    .nianan-shell {
      max-width: var(--nianan-max);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 250px;
      gap: 72px;
      align-items: start;
    }
    .nianan-main--full .nianan-shell { grid-template-columns: 1fr; }

    .nianan-content { min-width: 0; }
    .nianan-sidebar { border-left: 1px solid var(--nianan-border); padding-left: 30px; }
    .nianan-sidebar-section { margin: 0 0 38px; }
    .nianan-sidebar-section h3 { margin: 0 0 13px; font-size: 13px; font-weight: 700; letter-spacing: .09em; }
    .nianan-sidebar-list { margin:0; padding:0; list-style:none; }
    .nianan-sidebar-list li { margin: 7px 0; font-size: 14px; }
    .nianan-sidebar-list span { color: var(--nianan-muted); }
    .nianan-sidebar-list a:hover, .nianan-sidebar-links a:hover, .nianan-sidebar-tags a:hover { text-decoration: underline; }
    .nianan-sidebar-links { display:flex; flex-direction:column; gap: 6px; font-size:14px; }
    .nianan-sidebar-tags { display:flex; flex-wrap:wrap; gap: 8px 12px; font-size:13px; }

    .nianan-page-header { margin-bottom: 36px; }
    .nianan-page-header h1 { margin: 0; font-size: 34px; line-height:1.25; font-weight: 700; letter-spacing: -.02em; }
    .nianan-page-header p { margin: 12px 0 0; color: var(--nianan-muted); }
    .nianan-page-eyebrow, .nianan-section-label { font-size: 12px; color: var(--nianan-muted); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 9px; }

    .nianan-featured { padding-bottom: 45px; margin-bottom: 45px; border-bottom: 1px solid var(--nianan-border); }
    .nianan-featured h1 { font-size: clamp(30px, 4.1vw, 48px); line-height:1.23; margin: 0 0 12px; font-weight: 700; letter-spacing:-.03em; }
    .nianan-featured h1 a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 5px; }
    .nianan-featured > p { color:#444; margin: 18px 0 0; font-size: 16px; }

    .nianan-section { margin-bottom: 56px; }
    .nianan-section-heading { display:flex; justify-content:space-between; align-items:baseline; gap:20px; margin-bottom: 8px; }
    .nianan-section-heading h2 { margin:0; font-size: 17px; line-height:1.4; }
    .nianan-section-heading a { font-size:13px; color:var(--nianan-muted); }
    .nianan-section-heading a:hover { text-decoration:underline; }

    .nianan-entry { padding: 23px 0 28px; border-bottom:1px solid var(--nianan-border); }
    .nianan-entry:first-child { padding-top: 16px; }
    .nianan-entry-category, .nianan-note-category { display:inline-block; color:var(--nianan-muted) !important; font-size:12px; margin-bottom: 4px; }
    .nianan-entry-category:hover, .nianan-note-category:hover { text-decoration: underline; }
    .nianan-entry-title { margin:0; font-size: 22px; line-height:1.42; font-weight: 700; letter-spacing:-.01em; }
    .nianan-entry-title a:hover, .nianan-note-title a:hover { text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:4px; }
    .nianan-entry-meta, .nianan-article-meta { display:flex; flex-wrap:wrap; gap: 8px 16px; margin:8px 0 14px; color:var(--nianan-muted); font-size:12px; }
    .nianan-entry-summary { margin: 13px 0 0; font-size:14px; color:#555; }
    .nianan-entry-more, .nianan-note-more { display:inline-block; margin-top: 10px; color:var(--nianan-muted) !important; font-size:12px; }
    .nianan-entry-more:hover, .nianan-note-more:hover { color:var(--nianan-text) !important; text-decoration:underline; }

    .nianan-audio { margin: 13px 0 0; width:100%; }
    .nianan-audio audio { width:100%; height: 44px; display:block; }
    .nianan-audio--compact { margin-top: 10px; }
    .nianan-audio--compact audio { height: 40px; }
    #theme-podcast #notion-article audio { width:100%; display:block; margin:18px 0; }


    .nianan-audio-engine {
      position:absolute;
      width:1px;
      height:1px;
      opacity:0;
      pointer-events:none;
      overflow:hidden;
    }

    .nianan-mini-audio {
      width:100%;
      min-height:38px;
      display:flex;
      align-items:center;
      gap:9px;
      margin:13px 0 0;
    }
    .nianan-mini-audio--compact { margin-top:10px; }
    .nianan-mini-audio-play {
      flex:none;
      width:30px;
      height:30px;
      display:flex;
      align-items:center;
      justify-content:center;
      border:1px solid var(--nianan-border);
      border-radius:50%;
      background:transparent;
      color:var(--nianan-text);
      cursor:pointer;
      transition:background .2s ease,border-color .2s ease,transform .2s ease;
    }
    .nianan-mini-audio-play:hover { background:var(--nianan-text); color:var(--nianan-bg); border-color:var(--nianan-text); transform:translateY(-1px); }
    .nianan-mini-audio-track {
      position:relative;
      flex:1;
      height:24px;
      padding:0;
      border:0;
      background:transparent;
      cursor:pointer;
      display:flex;
      align-items:center;
    }
    .nianan-mini-audio-track::before {
      content:'';
      width:100%;
      height:2px;
      background:var(--nianan-border);
      display:block;
    }
    .nianan-mini-audio-fill {
      position:absolute;
      left:0;
      top:calc(50% - 1px);
      height:2px;
      background:linear-gradient(90deg,#8B9BD4 0%,#4A5A8A 50%,#3A4A7A 100%);
      pointer-events:none;
    }
    .nianan-mini-audio-time { flex:none; color:var(--nianan-muted); font-size:11px; font-variant-numeric:tabular-nums; min-width:40px; text-align:right; }

    .nianan-notion-audio-mount { margin:18px 0; }

    .nianan-global-player {
      position:fixed;
      left:50%;
      bottom:22px;
      transform:translateX(-50%);
      z-index:60;
      width:min(760px,calc(100vw - 40px));
      padding:9px;
      border:1px solid rgba(140,140,140,.25);
      border-radius:15px;
      background:rgba(255,255,255,.72);
      box-shadow:0 18px 55px rgba(0,0,0,.13);
      backdrop-filter:blur(28px) saturate(1.15);
      -webkit-backdrop-filter:blur(28px) saturate(1.15);
      transition:opacity .25s ease,transform .25s ease,visibility .25s ease;
    }
    .nianan-global-player--hidden {
      opacity:0;
      visibility:hidden;
      transform:translate(-50%,calc(100% + 18px));
      pointer-events:none;
    }
    .nianan-global-player-inner {
      display:flex;
      align-items:center;
      gap:9px;
      min-height:58px;
    }
    .nianan-global-cover {
      width:44px;
      height:44px;
      flex:none;
      overflow:hidden;
      border-radius:10px;
      background:linear-gradient(135deg,#dbe1f4,#8594c5);
      display:flex;
      align-items:center;
      justify-content:center;
      color:#fff;
      font-size:11px;
      letter-spacing:.12em;
    }
    .nianan-global-cover img { width:100%; height:100%; object-fit:cover; display:block; }
    .nianan-global-control {
      width:32px;
      height:32px;
      flex:none;
      padding:0;
      border:0;
      border-radius:50%;
      background:transparent;
      color:var(--nianan-text);
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
    }
    .nianan-global-control:hover { background:rgba(80,90,120,.10); }
    .nianan-global-control.is-active { background:rgba(58,74,122,.13); color:#3A4A7A; }
    .nianan-global-main { flex:1; min-width:0; }
    .nianan-global-title { overflow:hidden; white-space:nowrap; font-size:12px; font-weight:600; line-height:1.3; }
    .nianan-global-title span { display:inline-block; min-width:100%; }
    .nianan-global-title--scroll span { animation:nianan-title-marquee 12s linear infinite; padding-right:40px; }
    @keyframes nianan-title-marquee { 0%,18%{transform:translateX(0)} 82%,100%{transform:translateX(-35%)} }
    .nianan-global-progress-row { display:flex; align-items:center; gap:8px; margin-top:6px; color:var(--nianan-muted); font-size:10px; font-variant-numeric:tabular-nums; }
    .nianan-global-progress { position:relative; flex:1; height:13px; cursor:pointer; display:flex; align-items:center; }
    .nianan-global-progress::before { content:''; width:100%; height:2px; background:var(--nianan-border); }
    .nianan-global-progress-fill { position:absolute; left:0; top:calc(50% - 1px); height:2px; background:linear-gradient(90deg,#8B9BD4 0%,#4A5A8A 50%,#3A4A7A 100%); }
    .nianan-global-error { margin-top:3px; color:#a35a5a; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .nianan-global-desktop-controls { display:flex; align-items:center; gap:1px; }
    .nianan-global-rate { height:26px; min-width:36px; padding:0 6px; border:0; border-radius:13px; background:transparent; color:var(--nianan-muted); cursor:pointer; font-size:11px; }
    .nianan-global-rate:hover { background:rgba(80,90,120,.10); color:var(--nianan-text); }
    .nianan-global-volume { display:flex; align-items:center; gap:3px; }
    .nianan-global-volume input { width:58px; accent-color:#3A4A7A; }
    .nianan-global-more-wrap { display:none; position:relative; }
    .nianan-global-more-menu {
      position:absolute;
      right:0;
      bottom:41px;
      min-width:145px;
      padding:6px;
      border:1px solid var(--nianan-border);
      border-radius:10px;
      background:var(--nianan-bg);
      box-shadow:0 12px 35px rgba(0,0,0,.12);
    }
    .nianan-global-more-menu button,
    .nianan-global-more-menu label {
      width:100%;
      padding:8px 9px;
      border:0;
      background:transparent;
      color:var(--nianan-text);
      text-align:left;
      font-size:12px;
      cursor:pointer;
      display:block;
    }
    .nianan-global-more-menu button:hover { background:rgba(80,90,120,.08); }
    .nianan-global-more-menu input { width:100%; margin-top:5px; accent-color:#3A4A7A; }

    .nianan-footer-contact { display:inline-block; margin-top:5px; color:var(--nianan-text) !important; }
    .nianan-footer-contact:hover { text-decoration:underline !important; }

    .nianan-platform-links { display:flex; flex-wrap:wrap; gap:0 18px; margin-top:13px; font-size:12px; color:var(--nianan-muted); }
    .nianan-platform-links a:hover { color:var(--nianan-text); text-decoration:underline; }
    .nianan-note { padding: 22px 0 25px; border-bottom:1px solid var(--nianan-border); }
    .nianan-note-title { margin:0; font-size: 21px; line-height:1.45; font-weight:700; }
    .nianan-note-meta { color:var(--nianan-muted); font-size:12px; margin:7px 0 10px; }
    .nianan-note-summary { margin:0; color:#555; font-size:14px; }

    .nianan-subscribe-line { padding: 14px 0 19px; border-top:1px solid var(--nianan-border); border-bottom:1px solid var(--nianan-border); display:flex; gap: 22px; align-items:baseline; margin-bottom:28px; font-size:13px; }
    .nianan-subscribe-line > span { color:var(--nianan-muted); }
    .nianan-subscribe-line > div { display:flex; gap:18px; flex-wrap:wrap; }
    .nianan-subscribe-line a:hover { text-decoration:underline; }

    .nianan-archive-group { padding: 26px 0; border-bottom:1px solid var(--nianan-border); }
    .nianan-archive-group h2 { margin:0 0 14px; font-size:18px; }
    .nianan-archive-item { display:grid; grid-template-columns: 120px minmax(0,1fr); gap:18px; padding:8px 0; font-size:14px; }
    .nianan-archive-item span { color:var(--nianan-muted); font-size:12px; }
    .nianan-archive-item:hover strong { text-decoration:underline; }

    .nianan-index-list > a { display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid var(--nianan-border); font-size:15px; }
    .nianan-index-list > a:hover strong { text-decoration:underline; }
    .nianan-index-list span { color:var(--nianan-muted); font-size:12px; }

    .nianan-search-form { display:flex; width:100%; border-bottom:1px solid #222; margin: 0 0 28px; }
    .nianan-search-form input { flex:1; min-width:0; border:0; outline:0; padding:11px 0; background:transparent; color:var(--nianan-text); }
    .nianan-search-form button { border:0; background:transparent; cursor:pointer; color:#222; padding: 0 0 0 16px; font-size:13px; }
    .nianan-search-form button:hover { opacity:.6; }

    .nianan-pagination { display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; gap:20px; padding-top:25px; color:var(--nianan-muted); font-size:12px; }
    .nianan-pagination > :last-child { text-align:right; }
    .nianan-pagination a:hover { color:var(--nianan-text); text-decoration:underline; }
    .nianan-empty { padding: 40px 0; color: var(--nianan-muted); }

    .nianan-article-header { margin-bottom: 24px; }
    .nianan-article-header h1 { margin:0; font-size: clamp(31px, 5vw, 52px); line-height:1.2; letter-spacing:-.035em; }
    .nianan-article-body { margin-top:30px; }
    .nianan-article-body #notion-article { font-size:16px; line-height:1.95; }
    .nianan-article-body #notion-article p { margin: 0 0 1.25em; }
    .nianan-article-cover { width:100%; max-height:520px; object-fit:cover; margin-bottom:28px; }
    .nianan-adjacent { display:grid; grid-template-columns:1fr 1fr; gap:30px; margin-top:44px; padding-top:22px; border-top:1px solid var(--nianan-border); }
    .nianan-adjacent-item { display:flex; flex-direction:column; gap:4px; min-width:0; }
    .nianan-adjacent-item--next { text-align:right; }
    .nianan-adjacent-item span { color:var(--nianan-muted); font-size:11px; }
    .nianan-adjacent-item strong { font-size:14px; line-height:1.5; }
    .nianan-adjacent-item:hover strong { text-decoration:underline; }

    .nianan-copyright { margin-top:28px; padding:17px; background:#fafafa; border-left:2px solid var(--nianan-text); color:#666; font-size:12px; line-height:1.8; }
    .nianan-recommend { margin-top:35px; padding-top:28px; border-top:1px solid var(--nianan-border); }
    .nianan-recommend h2 { font-size:16px; margin:0 0 12px; }
    .nianan-recommend a { display:block; padding:6px 0; font-size:14px; }
    .nianan-recommend a:hover { text-decoration:underline; }

    .nianan-lock { max-width:520px; margin: 90px auto; text-align:center; }
    .nianan-lock-row { display:flex; margin-top:18px; }
    .nianan-lock-row input { flex:1; min-width:0; border:1px solid var(--nianan-border); border-right:0; padding:11px 14px; outline:none; }
    .nianan-lock-row button { border:0; background:#222; color:#fff; padding:0 20px; cursor:pointer; }
    .nianan-lock-tip { min-height:24px; margin-top:10px; font-size:12px; color:#c44; }

    .nianan-404 { min-height: 55vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }
    .nianan-404 > div { font-size:80px; line-height:1; font-weight:700; letter-spacing:-.08em; }
    .nianan-404 p { color:var(--nianan-muted); margin:15px 0; }
    .nianan-404 a { border-bottom:1px solid #222; }

    .nianan-float { position:fixed; right:22px; bottom:30px; z-index:30; display:flex; flex-direction:column; gap:1px; padding:5px; border:1px solid var(--nianan-border); background:var(--nianan-bg); opacity:0; visibility:hidden; transform:translateY(8px); transition:all .2s ease; }
    .nianan-float--visible { opacity:1; visibility:visible; transform:translateY(0); }
    .nianan-float button { width:30px; height:30px; border:0; background:transparent; color:var(--nianan-text); cursor:pointer; display:flex; align-items:center; justify-content:center; }
    .nianan-float button:hover { background:#f2f2f2; }

    .nianan-footer { border-top:1px solid var(--nianan-border); padding: 34px 28px 42px; }
    .nianan-footer-inner { max-width:var(--nianan-max); margin:0 auto; color:var(--nianan-muted); font-size:12px; line-height:1.8; text-align:center; }
    .nianan-footer-inner a { color:var(--nianan-text); }
    .dark #theme-podcast .nianan-float button:hover { background:#202021; }
    .nianan-footer-note { margin-top:4px; }
    .nianan-footer-powered { margin-top:7px; font-size:11px; opacity:.65; }

    .dark #theme-podcast { --nianan-bg:#0f0f10; --nianan-text:#e9e9e9; --nianan-muted:#9a9a9a; --nianan-border:#2c2c2d; }
    .dark #theme-podcast .nianan-site-header { background:rgba(15,15,16,.96); }
    .dark #theme-podcast .nianan-nav-link, .dark #theme-podcast .nianan-nav-search, .dark #theme-podcast .nianan-mobile-toggle { color:#eee !important; }
    .dark #theme-podcast .nianan-featured > p, .dark #theme-podcast .nianan-entry-summary, .dark #theme-podcast .nianan-note-summary { color:#c3c3c3; }
    .dark #theme-podcast .nianan-copyright { background:#171718; color:#aaa; }
    .dark #theme-podcast .nianan-lock-row input { background:#151516; color:#eee; }
    .dark #theme-podcast .nianan-lock-row button { background:#eee; color:#111; }
    .dark #theme-podcast .nianan-search-form { border-bottom-color:#eee; }
    .dark #theme-podcast { color-scheme: dark; }

    @media (max-width: 860px) {
      .nianan-shell { grid-template-columns:1fr; gap:45px; }
      .nianan-sidebar { border-left:0; border-top:1px solid var(--nianan-border); padding:35px 0 0; }
      .nianan-desktop-nav { display:none; }
      .nianan-mobile-toggle { display:block; }
      .nianan-mobile-nav { display:flex; flex-direction:column; max-width:var(--nianan-max); margin:0 auto; padding: 8px 28px 18px; border-top:1px solid var(--nianan-border); }
      .nianan-mobile-link { padding:9px 0; font-size:14px; border-bottom:1px solid var(--nianan-border); }
      .nianan-mobile-link:last-child { border-bottom:0; }
    }

    @media (max-width: 560px) {
      .nianan-header-inner, .nianan-main, .nianan-footer { padding-left:18px; padding-right:18px; }
      .nianan-header-inner { min-height:72px; }
      .nianan-logo { min-width:0; font-size:21px; }
      .nianan-main { padding-top:28px; }
      .nianan-slot-top { padding-left:18px; padding-right:18px; }
      .nianan-page-header h1 { font-size:30px; }
      .nianan-featured h1 { font-size:31px; }
      .nianan-entry-title, .nianan-note-title { font-size:19px; }
      .nianan-archive-item { grid-template-columns:85px minmax(0,1fr); gap:10px; }
      .nianan-adjacent { grid-template-columns:1fr; }
      .nianan-adjacent-item--next { text-align:left; }
      .nianan-global-player { bottom:12px; width:calc(100vw - 20px); padding:7px; border-radius:13px; }
      .nianan-global-player-inner { min-height:50px; gap:5px; }
      .nianan-global-cover { width:38px; height:38px; border-radius:8px; }
      .nianan-global-desktop-controls { display:none; }
      .nianan-global-more-wrap { display:block; }
      .nianan-global-control { width:30px; height:30px; }
    }

    ${themeConsoleStyle('podcast', CONFIG)}
  `}</style>
)
