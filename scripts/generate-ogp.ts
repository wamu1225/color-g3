// scripts/generate-ogp.ts — OGP画像（1200×630）を public/ogp.png に生成する。
// 実行: npx tsx scripts/generate-ogp.ts
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const FONT = "'Yu Gothic','Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,'Noto Sans JP',sans-serif";

// 右側に配置する色相ディスク（favicon と同じ6セグメントの模式・大きめ）
function hueDisc(cx: number, cy: number, r: number): string {
  const seg = [
    '#c0392b', '#e08e0b', '#3a8a4f', '#2b79b8', '#5b4b9e', '#8c2f6e',
  ];
  const parts: string[] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    parts.push(`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${seg[i]}"/>`);
  }
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${(r * 0.4).toFixed(1)}" fill="#faf8f5"/>`);
  return parts.join('');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf8f5"/>
  <rect x="0" y="0" width="14" height="630" fill="#8c2f39"/>
  <text x="90" y="210" font-family="${FONT}" font-size="78" font-weight="700" fill="#2a2622">色彩検定 3級</text>
  <text x="90" y="296" font-family="${FONT}" font-size="46" font-weight="600" fill="#8c2f39">学習ノート</text>
  <text x="90" y="392" font-family="${FONT}" font-size="26" fill="#5b554d">PCCSの色相環・トーンから配色技法・慣用色名まで、</text>
  <text x="90" y="430" font-family="${FONT}" font-size="26" fill="#5b554d">図と各10問の確認問題でやさしく学べる無料サイト</text>
  <line x1="90" y1="498" x2="720" y2="498" stroke="#d3cabb" stroke-width="2"/>
  <text x="90" y="548" font-family="${FONT}" font-size="24" fill="#8c2f39" font-weight="600">study-apps.com/color-g3/</text>
  ${hueDisc(1000, 315, 150)}
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ ogp.png (1200x630) を生成: ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
