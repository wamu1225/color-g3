// HueCircle — PCCS 24色相環の模式図（SVG）
//
// 注意：表示する色は「色相環の構造（24色相・補色＝正反対・類似＝近接）」を直感的に
// つかむための模式的な色であり、PCCSの正確な色を再現したものではない。
// 正確な色味は公式テキストの色見本で確認すること（本文・キャプションでも明示する）。

// PCCS の24色相。番号・記号・代表的な色名（学習用ラベル）。
// 色（hsl）は学習用の近似で、環を一周するよう配置している。
const HUES: { no: number; symbol: string; name: string; hsl: string }[] = [
  { no: 1, symbol: 'pR', name: '紫みの赤', hsl: 'hsl(345 85% 50%)' },
  { no: 2, symbol: 'R', name: '赤', hsl: 'hsl(358 85% 50%)' },
  { no: 3, symbol: 'yR', name: '黄みの赤', hsl: 'hsl(10 85% 50%)' },
  { no: 4, symbol: 'rO', name: '赤みのだいだい', hsl: 'hsl(20 85% 50%)' },
  { no: 5, symbol: 'O', name: 'だいだい', hsl: 'hsl(30 85% 50%)' },
  { no: 6, symbol: 'yO', name: '黄みのだいだい', hsl: 'hsl(40 85% 50%)' },
  { no: 7, symbol: 'rY', name: '赤みの黄', hsl: 'hsl(48 88% 50%)' },
  { no: 8, symbol: 'Y', name: '黄', hsl: 'hsl(55 90% 50%)' },
  { no: 9, symbol: 'gY', name: '緑みの黄', hsl: 'hsl(68 75% 45%)' },
  { no: 10, symbol: 'YG', name: '黄緑', hsl: 'hsl(85 65% 45%)' },
  { no: 11, symbol: 'yG', name: '黄みの緑', hsl: 'hsl(105 55% 42%)' },
  { no: 12, symbol: 'G', name: '緑', hsl: 'hsl(135 55% 40%)' },
  { no: 13, symbol: 'bG', name: '青みの緑', hsl: 'hsl(160 55% 40%)' },
  { no: 14, symbol: 'BG', name: '青緑', hsl: 'hsl(178 60% 40%)' },
  { no: 15, symbol: 'BG', name: '青緑', hsl: 'hsl(190 65% 45%)' },
  { no: 16, symbol: 'gB', name: '緑みの青', hsl: 'hsl(200 70% 48%)' },
  { no: 17, symbol: 'B', name: '青', hsl: 'hsl(210 75% 50%)' },
  { no: 18, symbol: 'B', name: '青', hsl: 'hsl(220 75% 52%)' },
  { no: 19, symbol: 'pB', name: '紫みの青', hsl: 'hsl(235 65% 55%)' },
  { no: 20, symbol: 'V', name: 'すみれ', hsl: 'hsl(255 55% 55%)' },
  { no: 21, symbol: 'bP', name: '青みの紫', hsl: 'hsl(270 50% 52%)' },
  { no: 22, symbol: 'P', name: '紫', hsl: 'hsl(290 50% 50%)' },
  { no: 23, symbol: 'rP', name: '赤みの紫', hsl: 'hsl(312 60% 50%)' },
  { no: 24, symbol: 'RP', name: '赤紫', hsl: 'hsl(330 70% 50%)' },
];

function wedgePath(cx: number, cy: number, rOuter: number, rInner: number, a0: number, a1: number): string {
  const p = (r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180; // 12時方向を基準に時計回り
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x0o, y0o] = p(rOuter, a0);
  const [x1o, y1o] = p(rOuter, a1);
  const [x1i, y1i] = p(rInner, a1);
  const [x0i, y0i] = p(rInner, a0);
  return [
    `M ${x0o} ${y0o}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 0 0 ${x0i} ${y0i}`,
    'Z',
  ].join(' ');
}

interface Props {
  /** 強調する色相番号（補色線を引く）。省略時は線なし */
  highlight?: number;
}

export default function HueCircle({ highlight }: Props) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 150;
  const rInner = 96;
  const step = 360 / 24;

  const labelPos = (i: number) => {
    const mid = i * step + step / 2;
    const rad = ((mid - 90) * Math.PI) / 180;
    const rl = (rOuter + rInner) / 2;
    return [cx + rl * Math.cos(rad), cy + rl * Math.sin(rad)];
  };

  // 補色線（highlight と +12 番）
  let complementLine: null | { x1: number; y1: number; x2: number; y2: number } = null;
  if (highlight) {
    const i = HUES.findIndex((h) => h.no === highlight);
    if (i >= 0) {
      const a = i * step + step / 2;
      const b = a + 180;
      const pt = (ang: number) => {
        const rad = ((ang - 90) * Math.PI) / 180;
        return [cx + (rInner - 6) * Math.cos(rad), cy + (rInner - 6) * Math.sin(rad)];
      };
      const [x1, y1] = pt(a);
      const [x2, y2] = pt(b);
      complementLine = { x1, y1, x2, y2 };
    }
  }

  return (
    <figure className="viz">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        role="img"
        aria-label="PCCS 24色相環の模式図。色相が環状に並び、向かい合う色どうしが補色になる。"
      >
        {HUES.map((h, i) => {
          const a0 = i * step;
          const a1 = a0 + step;
          const [lx, ly] = labelPos(i);
          const isHi = highlight === h.no;
          return (
            <g key={h.no}>
              <path
                d={wedgePath(cx, cy, rOuter, rInner, a0, a1)}
                fill={h.hsl}
                stroke="#fff"
                strokeWidth={isHi ? 3 : 1.5}
                opacity={highlight && !isHi ? 0.78 : 1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight={isHi ? 700 : 500}
                fill="#fff"
                style={{ pointerEvents: 'none' }}
              >
                {h.no}
              </text>
            </g>
          );
        })}
        {complementLine && (
          <line
            x1={complementLine.x1}
            y1={complementLine.y1}
            x2={complementLine.x2}
            y2={complementLine.y2}
            stroke="#1a1a1a"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        )}
        <circle cx={cx} cy={cy} r={rInner - 12} fill="#faf8f5" stroke="#e4ded4" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight={700} fill="#3a3a3a">
          PCCS
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#6a6a6a">
          24色相環
        </text>
      </svg>
      <figcaption className="viz-caption">
        色相環の模式図。向かい合う位置どうしが補色、近い位置どうしが類似色相。
        ここで示す色は構造をつかむための目安で、正確な色味は公式テキストの色見本で確認してください。
      </figcaption>
    </figure>
  );
}
