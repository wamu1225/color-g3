// ConceptDiagram — 「見え方」の概念を図で示すSVG群。[[diagram:KEY]] で本文に埋め込む。
// 色・効果は学習用の模式。正確な色味は公式テキストの色見本で確認する前提。
import type { ReactNode } from 'react';

export const DIAGRAM_KEYS = [
  'mixing-additive',
  'mixing-subtractive',
  'contrast-value',
  'assimilation',
  'gradation-hue',
] as const;
export type DiagramKey = (typeof DIAGRAM_KEYS)[number];

function Figure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="viz diagram-viz">
      {children}
      <figcaption className="viz-caption">{label}</figcaption>
    </figure>
  );
}

// 加法混色：光の三原色を黒地で重ねると明るくなる（screen合成）
function MixingAdditive() {
  return (
    <Figure label="加法混色（光）。赤・緑・青の光を重ねるほど明るくなり、中心は白に近づく。">
      <svg viewBox="0 0 220 200" width="100%" role="img" aria-label="加法混色の模式図">
        <rect width="220" height="200" fill="#0a0a0a" rx="8" />
        <g style={{ mixBlendMode: 'screen' }}>
          <circle cx="110" cy="78" r="56" fill="#ff2a2a" />
          <circle cx="84" cy="124" r="56" fill="#22e022" />
          <circle cx="136" cy="124" r="56" fill="#2a6aff" />
        </g>
        <text x="110" y="34" textAnchor="middle" fill="#fff" fontSize="12">赤(R)</text>
        <text x="44" y="150" textAnchor="middle" fill="#fff" fontSize="12">緑(G)</text>
        <text x="176" y="150" textAnchor="middle" fill="#fff" fontSize="12">青(B)</text>
      </svg>
    </Figure>
  );
}

// 減法混色：色料の三原色を白地で重ねると暗くなる（multiply合成）
function MixingSubtractive() {
  return (
    <Figure label="減法混色（色料）。シアン・マゼンタ・イエローを重ねるほど暗くなり、中心は黒に近づく。">
      <svg viewBox="0 0 220 200" width="100%" role="img" aria-label="減法混色の模式図">
        <rect width="220" height="200" fill="#ffffff" stroke="#e4ded4" rx="8" />
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx="110" cy="78" r="56" fill="#16c4d4" />
          <circle cx="84" cy="124" r="56" fill="#e83bb0" />
          <circle cx="136" cy="124" r="56" fill="#f5e000" />
        </g>
        <text x="110" y="30" textAnchor="middle" fill="#2a2622" fontSize="12">シアン(C)</text>
        <text x="40" y="152" textAnchor="middle" fill="#2a2622" fontSize="12">マゼンタ(M)</text>
        <text x="182" y="152" textAnchor="middle" fill="#2a2622" fontSize="12">イエロー(Y)</text>
      </svg>
    </Figure>
  );
}

// 明度対比：同じ灰色が、明るい地では暗く・暗い地では明るく見える
function ContrastValue() {
  return (
    <Figure label="明度対比。中央の灰色は同じ色だが、明るい地の上では暗く、暗い地の上では明るく見える。">
      <svg viewBox="0 0 240 140" width="100%" role="img" aria-label="明度対比の模式図">
        <rect x="0" y="0" width="120" height="140" fill="#e8e8e8" />
        <rect x="120" y="0" width="120" height="140" fill="#2a2a2a" />
        <rect x="36" y="40" width="48" height="60" fill="#8a8a8a" />
        <rect x="156" y="40" width="48" height="60" fill="#8a8a8a" />
        <text x="60" y="124" textAnchor="middle" fill="#555" fontSize="11">明るい地</text>
        <text x="180" y="124" textAnchor="middle" fill="#ddd" fontSize="11">暗い地</text>
      </svg>
    </Figure>
  );
}

// 同化：同じ地の色が、細い白線では明るく・細い黒線では暗く見える
function Assimilation() {
  const lines = (stroke: string, x0: number) => {
    const arr = [];
    for (let y = 8; y < 132; y += 8) arr.push(<line key={y} x1={x0 + 6} y1={y} x2={x0 + 102} y2={y} stroke={stroke} strokeWidth="3" />);
    return arr;
  };
  return (
    <Figure label="同化。地はどちらも同じ色だが、細い白線を重ねると明るく、細い黒線を重ねると暗く見える。">
      <svg viewBox="0 0 228 140" width="100%" role="img" aria-label="同化の模式図">
        <rect x="6" y="4" width="102" height="132" fill="#c2543f" />
        <rect x="120" y="4" width="102" height="132" fill="#c2543f" />
        {lines('#ffffff', 6)}
        {lines('#1a1a1a', 120)}
        <text x="57" y="150" textAnchor="middle" fill="#555" fontSize="11">＋白い細線</text>
        <text x="171" y="150" textAnchor="middle" fill="#555" fontSize="11">＋黒い細線</text>
      </svg>
    </Figure>
  );
}

// グラデーション：色相を少しずつ変化させて並べる
function GradationHue() {
  return (
    <Figure label="グラデーション配色。色相（または明度・彩度）を少しずつ段階的に変化させ、連続した流れをつくる。">
      <svg viewBox="0 0 240 60" width="100%" role="img" aria-label="グラデーションの模式図">
        <defs>
          <linearGradient id="grad-hue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d32f2f" />
            <stop offset="25%" stopColor="#e8820c" />
            <stop offset="50%" stopColor="#f2c811" />
            <stop offset="75%" stopColor="#3a8a4f" />
            <stop offset="100%" stopColor="#2b79b8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="240" height="60" rx="8" fill="url(#grad-hue)" />
      </svg>
    </Figure>
  );
}

export default function ConceptDiagram({ dkey }: { dkey: string }) {
  switch (dkey) {
    case 'mixing-additive': return <MixingAdditive />;
    case 'mixing-subtractive': return <MixingSubtractive />;
    case 'contrast-value': return <ContrastValue />;
    case 'assimilation': return <Assimilation />;
    case 'gradation-hue': return <GradationHue />;
    default: return null;
  }
}
