// scripts/prerender.ts — SSG。各ページの dist/<page>/index.html に
// クローラー向けの静的フォールバックHTML・per-page meta・JSON-LD を焼き込み、sitemap.xml を生成する。
// 実行: npx tsx scripts/prerender.ts（npm run predeploy 内）
import * as fs from 'fs';
import * as path from 'path';
import { modules } from '../src/data/modules';
import { glossary } from '../src/data/glossary';
import { chapterNames } from '../src/data/chapters';
import { EXAM_CONFIG } from '../src/data/examConfig';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE = '/color-g3';
const BASE_URL = 'https://study-apps.com/color-g3';
const SITE_NAME = '色彩検定3級 学習ノート';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function stripMarkdown(text: string): string {
  return text
    .replace(/\[\[term:([^\]]+)\]\]/g, '$1')   // 用語リンク → 語のみ
    .replace(/\[\[[^\]]*\]\]/g, '')             // [[huecircle]] / [[tonemap]]
    .replace(/^#{1,6}\s+/gm, '')                // 見出し
    .replace(/\*\*(.*?)\*\*/g, '$1')            // 太字
    .replace(/^[-*]\s+/gm, '・')                // 箇条書き
    .replace(/^\d+\.\s+/gm, '')                 // 番号リスト
    .replace(/^\|.*\|$/gm, '')                  // 表
    .replace(/^[-|:\s]+$/gm, '')                // 表区切り
    .replace(/^---+$/gm, '')                    // 水平線
    .replace(/`([^`]+)`/g, '$1')                // コード
    .replace(/[💡🎯⚠️📖]/g, '')                 // コールアウト絵文字マーカー
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const banner = `<div style="background:#f3e7e7;border-bottom:1px solid #e3cccc;padding:10px 16px;font-size:0.88rem;text-align:center;margin-bottom:16px;border-radius:6px;max-width:820px;margin-left:auto;margin-right:auto"><a href="https://study-apps.com/" style="color:#6f242d;text-decoration:none;font-weight:600">← study-apps.com 学習サイト集トップへ</a></div>`;
const disclaimer = `<p style="font-size:0.8rem;color:#888;margin-top:20px;border-top:1px solid #eee;padding-top:12px">※本サイトは個人による学習支援サイトであり、色彩検定協会の公式サイトではありません。試験の最新情報は必ず公式サイトでご確認ください。</p>`;
const articleOpen = `<article id="static-fallback" style="font-family:sans-serif;line-height:1.8;max-width:820px;margin:0 auto;padding:24px 16px;color:#2a2622">`;

console.log('--- color-g3 SSG prerender ---');
if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('dist/index.html が見つかりません。先に npm run build を実行してください。');
  process.exit(1);
}
const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

// ── ホーム ──────────────────────────────────────
const chapterListHtml = (() => {
  const byCh: Record<number, typeof modules> = {};
  for (const m of modules) (byCh[m.chapter] ||= [] as unknown as typeof modules).push(m);
  return Object.keys(byCh).map(Number).sort((a, b) => a - b).map((n) => {
    const items = byCh[n].map((m) =>
      `<li style="margin:8px 0"><a href="${BASE}/${m.id}/" style="color:#8c2f39;font-weight:600;text-decoration:none">${esc(m.title)}</a><br><span style="color:#5b554d;font-size:0.9rem">${esc(m.description)}</span></li>`
    ).join('\n');
    return `<h2 style="font-size:1.2rem;margin:22px 0 8px;border-bottom:1px solid #e4ded4;padding-bottom:4px">第${n}章 ${esc(chapterNames[n])}</h2><ul style="list-style:none;padding:0;margin:0">${items}</ul>`;
  }).join('\n');
})();

const homeDesc = '色彩検定3級の独学者向け学習ノート。光と色のしくみ、PCCSの色相環とトーン、配色技法、慣用色名までを図と確認問題でやさしく解説します。';
const homeFallback = `${banner}${articleOpen}
  <h1 style="font-size:1.8rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:14px">${SITE_NAME}</h1>
  <p style="color:#5b554d;margin-bottom:20px">${homeDesc}光と色の物理・心理から、PCCSの色相環・トーン、配色技法、慣用色名まで、初学者がつまずきやすいところを図と各10問の確認問題でていねいに解説します。</p>
  ${chapterListHtml}
  <nav style="margin-top:28px;border-top:1px solid #e4ded4;padding-top:16px;display:flex;gap:16px;flex-wrap:wrap">
    <a href="${BASE}/glossary/" style="color:#8c2f39">用語集</a>
    <a href="${BASE}/guide/" style="color:#8c2f39">試験ガイド</a>
    <a href="${BASE}/about/" style="color:#8c2f39">このサイトについて</a>
    <a href="${BASE}/privacy/" style="color:#8c2f39;font-size:0.85rem">プライバシーポリシー</a>
  </nav>
  ${disclaimer}
</article>`;

let rootHtml = templateHtml.replace('<div id="root"></div>', `<div id="root">${homeFallback}</div>`);
const homeJsonLd = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${BASE_URL}/`,
  description: homeDesc, inLanguage: 'ja',
});
rootHtml = rootHtml.replace('</head>', `<script type="application/ld+json">${homeJsonLd}</script>\n  </head>`);
fs.writeFileSync(INDEX_HTML_PATH, rootHtml);

// base './' のため、サブディレクトリ用に相対パスを ../ に変換
const subTemplate = templateHtml
  .replace(/href="\.\/assets\//g, 'href="../assets/')
  .replace(/src="\.\/assets\//g, 'src="../assets/')
  .replace(/href="\.\/favicon\.svg"/g, 'href="../favicon.svg"');

function writePage(subpath: string, title: string, description: string, bodyHtml: string, jsonLd: object) {
  const dir = path.join(DIST_DIR, subpath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const pageTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}/${subpath}/`;
  let html = subTemplate
    .replace(`<title>${SITE_NAME}</title>`, `<title>${esc(pageTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace('<meta property="og:type" content="website" />', `<meta property="og:type" content="article" />`)
    .replace('<meta property="og:url" content="https://study-apps.com/color-g3/" />', `<meta property="og:url" content="${url}" />`)
    .replace('<link rel="canonical" href="https://study-apps.com/color-g3/" />', `<link rel="canonical" href="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ── モジュールページ ───────────────────────────
let count = 0;
for (const mod of modules) {
  const seoText = stripMarkdown(mod.content).slice(0, 2200);
  const body = `${banner}${articleOpen}
  <nav style="margin-bottom:14px;font-size:0.85rem"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">ホーム</a> / 第${mod.chapter}章 ${esc(chapterNames[mod.chapter])}</nav>
  <h1 style="font-size:1.55rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:12px">${esc(mod.title)}</h1>
  <p style="color:#5b554d;margin-bottom:18px;font-size:1.02rem">${esc(mod.description)}</p>
  <div style="white-space:pre-line;color:#2a2622">${esc(seoText)}</div>
  ${mod.keyPoints ? `<h2 style="font-size:1.1rem;margin:24px 0 8px">このモジュールのまとめ</h2><ul style="color:#2a2622">${mod.keyPoints.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
  <nav style="margin-top:28px;border-top:1px solid #e4ded4;padding-top:16px"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">← ホームへ戻る</a></nav>
  ${disclaimer}
</article>`;
  writePage(mod.id, mod.title, mod.description, body, {
    '@context': 'https://schema.org', '@type': 'LearningResource',
    name: mod.title, description: mod.description, url: `${BASE_URL}/${mod.id}/`,
    inLanguage: 'ja', learningResourceType: '学習モジュール',
    provider: { '@type': 'Organization', name: 'study-apps.com', url: 'https://study-apps.com' },
  });
  count++;
}

// ── 用語集 ──────────────────────────────────────
const glossaryItemsHtml = Object.values(glossary).map((t) =>
  `<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #eee"><strong style="font-size:1rem;color:#6f242d">${esc(t.term)}</strong><p style="margin:6px 0 0;color:#444">${esc(t.explanation)}</p></div>`
).join('\n');
writePage('glossary', '用語集', '色彩検定3級の頻出用語をやさしいことばで解説。色相・明度・彩度、PCCS、トーン、対比と同化、配色技法、慣用色名など試験に出る色彩用語を網羅。',
  `${banner}${articleOpen}
  <nav style="margin-bottom:14px"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">← ホームへ戻る</a></nav>
  <h1 style="font-size:1.6rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:18px">用語集</h1>
  <p style="color:#5b554d;margin-bottom:20px">色彩検定3級でよく問われる用語を、初学者向けにやさしく解説します。</p>
  ${glossaryItemsHtml}
  ${disclaimer}
</article>`,
  { '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: '色彩検定3級 用語集', url: `${BASE_URL}/glossary/`, inLanguage: 'ja' });

// ── 試験ガイド ──────────────────────────────────
const s = EXAM_CONFIG.schedule2026;
writePage('guide', '試験ガイド', '色彩検定3級の試験概要・出題形式・試験時間・合格基準・受験資格・年間スケジュールと学習の進め方を、公式情報をもとに整理。',
  `${banner}${articleOpen}
  <nav style="margin-bottom:14px"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">← ホームへ戻る</a></nav>
  <h1 style="font-size:1.6rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:18px">色彩検定3級 試験ガイド</h1>
  <p style="color:#5b554d;margin-bottom:18px">${EXAM_CONFIG.organizer}が実施する、${EXAM_CONFIG.patronage}の検定です。日程・検定料・合格基準は年度・回ごとに変わるため、申込前に必ず公式サイトでご確認ください。</p>
  <ul style="color:#2a2622;line-height:2">
    <li>実施団体：${EXAM_CONFIG.organizer}（${EXAM_CONFIG.patronage}）</li>
    <li>出題形式：${EXAM_CONFIG.format}（3級は記述・2次試験なし）</li>
    <li>試験時間：${EXAM_CONFIG.duration}分</li>
    <li>満点・合格基準：${EXAM_CONFIG.fullScore}点満点。${EXAM_CONFIG.passingScoreLabel}</li>
    <li>検定料：${EXAM_CONFIG.feeLabel}</li>
    <li>受験資格：${EXAM_CONFIG.eligibility}</li>
    <li>実施時期：${EXAM_CONFIG.frequency}（夏期＝${EXAM_CONFIG.summerMonth}月・冬期＝${EXAM_CONFIG.winterMonth}月）</li>
  </ul>
  <h2 style="font-size:1.15rem;margin:22px 0 8px">2026年度の日程</h2>
  <ul style="color:#2a2622;line-height:2">
    <li>夏期：${s.summerExamDate}（申込 ${s.summerApplication}）</li>
    <li>冬期：${s.winterExamDate}（申込 ${s.winterApplication}）</li>
  </ul>
  <h2 style="font-size:1.15rem;margin:22px 0 8px">学習の進め方</h2>
  <p style="color:#2a2622">本サイトは公式テキストの分野構成に沿って6章に分け、各モジュールに10問の確認問題を用意しています。特に合否を分けやすいのは、PCCSの色相環とトーンを自分で描けるようにすることと、対比/同化や配色技法など混同しやすい用語の区別です。</p>
  ${disclaimer}
</article>`,
  { '@context': 'https://schema.org', '@type': 'Article', headline: '色彩検定3級 試験ガイド', url: `${BASE_URL}/guide/`, inLanguage: 'ja' });

// ── About ───────────────────────────────────────
writePage('about', 'このサイトについて', '色彩検定3級 学習ノートの目的・コンテンツ構成・編集制作方針・運営者・お問い合わせ・免責事項について。',
  `${banner}${articleOpen}
  <nav style="margin-bottom:14px"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">← ホームへ戻る</a></nav>
  <h1 style="font-size:1.6rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:18px">このサイトについて</h1>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">サイトの目的と対象</h2>
  <p style="color:#444">「${SITE_NAME}」は、色彩検定3級の合格を目指す独学者のための学習支援サイトです。色の物理・心理から、PCCSの色相環・トーン、配色技法、慣用色名まで、初学者がつまずきやすいところを図と確認問題でていねいに解説します。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">コンテンツ構成</h2>
  <p style="color:#444">公式テキストの分野構成に沿って全6章・各モジュールに分け、本文・図・10問の理解度チェックで構成しています。あわせて用語集と試験ガイドを用意しています。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">編集・制作方針</h2>
  <p style="color:#444">本サイトの解説は、公式が示す出題範囲や一般的な色彩理論を参照しつつ、運営者が内容を理解したうえですべて自分のことばで一から書き起こしています。出典は事実確認のために用い、辞書・公式テキスト・規格の文章をそのまま転載することはしていません。色相環・トーンマップの図は学習用に自作した模式図で、正確な色味は公式テキストの色見本で確認するようご案内しています。誤りに気づいた場合は随時修正します。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">運営者について</h2>
  <p style="color:#444">個人が運営しています。広告収入（Google AdSense）はサーバー・ドメインなどの維持費に充てています。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">お問い合わせ</h2>
  <p style="color:#444">内容の誤りのご指摘やご意見は、<a href="https://forms.gle/ccMv7oKwz6ysDHBe6" target="_blank" rel="noopener noreferrer" style="color:#8c2f39">お問い合わせフォーム</a>よりお寄せください。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">免責事項</h2>
  <p style="color:#444">本サイトは内容の正確性に努めていますが、その完全性・正確性・有用性を保証するものではありません。本サイトは個人による学習支援サイトであり、色彩検定協会の公式サイトではありません。試験の最新情報・正確な情報は必ず公式サイトでご確認ください。本サイトの利用によって生じたいかなる損害についても責任を負いかねます。</p>
</article>`,
  { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'このサイトについて', url: `${BASE_URL}/about/`, inLanguage: 'ja' });

// ── Privacy ─────────────────────────────────────
writePage('privacy', 'プライバシーポリシー', '色彩検定3級 学習ノートのプライバシーポリシー。Google Analytics・Google AdSense・Cookie の利用と無効化方法、免責、お問い合わせについて。',
  `${banner}${articleOpen}
  <nav style="margin-bottom:14px"><a href="${BASE}/" style="color:#8c2f39;text-decoration:none">← ホームへ戻る</a></nav>
  <h1 style="font-size:1.6rem;font-weight:700;border-bottom:2px solid #8c2f39;padding-bottom:8px;margin-bottom:18px">プライバシーポリシー</h1>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">アクセス解析（Google Analytics）</h2>
  <p style="color:#444">本サイトは利用状況の把握のためGoogle Analytics（GA4）を利用しています。Cookieを用いて匿名のトラフィックデータを収集するもので、個人を特定する情報は含みません。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">広告配信（Google AdSense）</h2>
  <p style="color:#444">本サイトは第三者配信の広告サービスGoogle AdSenseを利用しています。第三者配信事業者はCookieを使用して、ユーザーの興味に応じた広告を表示することがあります。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">Cookieの送信と無効化</h2>
  <p style="color:#444">これらのCookieによりGoogleや広告事業者にデータが送信されます。ユーザーは<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style="color:#8c2f39">Googleの広告設定</a>でパーソナライズ広告を無効にでき、ブラウザの設定でCookieを無効にすることもできます。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">免責事項</h2>
  <p style="color:#444">本サイトの情報の利用により生じた損害について、運営者は責任を負いません。</p>
  <h2 style="font-size:1.15rem;margin:18px 0 6px">お問い合わせ</h2>
  <p style="color:#444">本ポリシーに関するお問い合わせは<a href="https://forms.gle/ccMv7oKwz6ysDHBe6" target="_blank" rel="noopener noreferrer" style="color:#8c2f39">お問い合わせフォーム</a>よりお願いします。</p>
  <p style="font-size:0.84rem;color:#888;margin-top:20px;border-top:1px solid #eee;padding-top:12px">最終更新日：2026年6月11日</p>
</article>`,
  { '@context': 'https://schema.org', '@type': 'WebPage', name: 'プライバシーポリシー', url: `${BASE_URL}/privacy/`, inLanguage: 'ja' });

// ── sitemap.xml ─────────────────────────────────
const today = '2026-06-11';
const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  ...modules.map((m) => ({ loc: `${BASE_URL}/${m.id}/`, priority: '0.8', changefreq: 'monthly' })),
  { loc: `${BASE_URL}/glossary/`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/guide/`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/about/`, priority: '0.4', changefreq: 'yearly' },
  { loc: `${BASE_URL}/privacy/`, priority: '0.3', changefreq: 'yearly' },
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);

console.log(`✓ モジュール ${count} ページ + 静的4ページ + sitemap.xml（全${urls.length}URL）を生成`);
