// ToneMap — PCCS 12トーンの模式図（SVG）
//
// 代表色相（赤）の12トーンを、横軸＝彩度・縦軸＝明度の面に配置して示す。
// 色・位置は「トーンの明るさ／あざやかさの関係」をつかむための模式であり、
// PCCSの正確な値を再現したものではない（正確な色味は公式テキストの色見本で確認）。

// x: 彩度（0=低い 〜 1=高い）, y: 明度（0=暗い 〜 1=明るい）
const TONES: { symbol: string; name: string; x: number; y: number; hsl: string; dark?: boolean }[] = [
  { symbol: 'p', name: 'ペール', x: 0.20, y: 0.92, hsl: 'hsl(358 45% 86%)' },
  { symbol: 'ltg', name: 'ライトグレイッシュ', x: 0.13, y: 0.76, hsl: 'hsl(358 18% 76%)' },
  { symbol: 'g', name: 'グレイッシュ', x: 0.15, y: 0.54, hsl: 'hsl(358 22% 56%)' },
  { symbol: 'dkg', name: 'ダークグレイッシュ', x: 0.13, y: 0.27, hsl: 'hsl(358 20% 33%)', dark: true },
  { symbol: 'lt', name: 'ライト', x: 0.46, y: 0.78, hsl: 'hsl(358 70% 72%)' },
  { symbol: 'sf', name: 'ソフト', x: 0.46, y: 0.57, hsl: 'hsl(358 50% 58%)' },
  { symbol: 'd', name: 'ダル', x: 0.46, y: 0.44, hsl: 'hsl(358 45% 46%)', dark: true },
  { symbol: 'dk', name: 'ダーク', x: 0.46, y: 0.28, hsl: 'hsl(358 55% 35%)', dark: true },
  { symbol: 'b', name: 'ブライト', x: 0.72, y: 0.74, hsl: 'hsl(358 85% 62%)' },
  { symbol: 's', name: 'ストロング', x: 0.78, y: 0.52, hsl: 'hsl(358 80% 50%)', dark: true },
  { symbol: 'dp', name: 'ディープ', x: 0.75, y: 0.31, hsl: 'hsl(358 80% 36%)', dark: true },
  { symbol: 'v', name: 'ビビッド', x: 0.93, y: 0.50, hsl: 'hsl(358 90% 47%)', dark: true },
];

interface Props {
  /** 強調するトーン記号（例 'v'）。省略時は強調なし */
  highlight?: string;
}

export default function ToneMap({ highlight }: Props) {
  const w = 360;
  const h = 320;
  const padL = 44;
  const padR = 16;
  const padT = 18;
  const padB = 40;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const sh = 30; // swatch 高さ
  const fs = 10.5; // ラベルの文字サイズ

  const X = (x: number) => padL + x * plotW;
  const Y = (y: number) => padT + (1 - y) * plotH;

  // swatch 幅はラベルの文字数に合わせる。
  // 固定幅(56px)だと「ライトグレイッシュ」「ダークグレイッシュ」(9文字)が枠からはみ出して
  // 見切れ、逆に短いラベル同士（ストロング×ビビッド）は箱が過大で重なっていた。
  const swOf = (name: string) => Math.max(44, name.length * fs + 12);

  // 箱がプロット枠の外にはみ出さないよう中心を寄せる（見切れの防止）
  const clampCx = (cx: number, sw: number) => {
    const min = padL + 2 + sw / 2;
    const max = padL + plotW - 2 - sw / 2;
    return Math.min(Math.max(cx, min), max);
  };

  // 配置を確定させる。横位置は彩度・縦位置は明度という意味を持つので動かせないが、
  // 箱同士が重なると読めなくなる（ストロング×ビビッドが実際に22px重なっていた）。
  // x は動かさず、重なった組だけ縦にわずかに逃がす（明度の上下関係は保つ向きに寄せる）。
  const laidOut = (() => {
    const items = TONES.map((t) => {
      const sw = swOf(t.name);
      return { t, sw, cx: clampCx(X(t.x), sw), cy: Y(t.y) };
    });
    for (let pass = 0; pass < 8; pass++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i];
          const b = items[j];
          const dx = Math.abs(a.cx - b.cx);
          const dy = Math.abs(a.cy - b.cy);
          if (dx >= (a.sw + b.sw) / 2 || dy >= sh + 2) continue;
          // 上にある方を上へ、下にある方を下へ（明度の上下関係を壊さない）
          const push = (sh + 2 - dy) / 2 + 0.5;
          const upper = a.cy <= b.cy ? a : b;
          const lower = upper === a ? b : a;
          upper.cy -= push;
          lower.cy += push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    return items;
  })();

  return (
    <figure className="viz">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="PCCS 12トーンの模式図。横軸が彩度、縦軸が明度で、各トーンの位置関係を示す。"
      >
        {/* プロット枠 */}
        <rect x={padL} y={padT} width={plotW} height={plotH} fill="#faf8f5" stroke="#e4ded4" />

        {/* 軸ラベル */}
        <text
          x={14}
          y={padT + plotH / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#5a5a5a"
          transform={`rotate(-90 14 ${padT + plotH / 2})`}
        >
          明度（上ほど明るい）
        </text>
        <text x={padL + plotW / 2} y={h - 10} textAnchor="middle" fontSize="12" fill="#5a5a5a">
          彩度（右ほどあざやか）
        </text>

        {/* トーン swatch */}
        {laidOut.map(({ t, sw, cx, cy }) => {
          const isHi = highlight === t.symbol;
          return (
            <g key={t.symbol}>
              <rect
                x={cx - sw / 2}
                y={cy - sh / 2}
                width={sw}
                height={sh}
                rx={5}
                fill={t.hsl}
                stroke={isHi ? '#1a1a1a' : '#ffffff'}
                strokeWidth={isHi ? 3 : 1.5}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fs}
                fontWeight={isHi ? 700 : 500}
                fill={t.dark ? '#ffffff' : '#2a2a2a'}
                style={{ pointerEvents: 'none' }}
              >
                {t.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="viz-caption">
        代表色相（赤）の12トーンを、彩度（横）と明度（縦）の面に配置した模式図。
        あざやかなビビッドは右、淡いペールは左上に位置します。色味の正確さは公式テキストの色見本で確認してください。
      </figcaption>
    </figure>
  );
}
