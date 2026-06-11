// Swatch — 実色見本（スウォッチ）。[[swatches:KEY]] で本文に埋め込む。
import { swatchSets } from '../data/swatches';
import type { SwatchChip } from '../data/swatches';

function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  // 相対輝度のざっくり判定
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
}

function Chip({ chip }: { chip: SwatchChip }) {
  return (
    <div className="swatch-chip">
      <div className="swatch-color" style={{ background: chip.color, border: isLight(chip.color) ? '1px solid #d3cabb' : 'none' }} />
      {chip.name && <div className="swatch-name">{chip.name}</div>}
      {chip.note && <div className="swatch-note">{chip.note}</div>}
    </div>
  );
}

export default function Swatch({ setKey }: { setKey: string }) {
  const set = swatchSets[setKey];
  if (!set) return null;
  return (
    <figure className="viz swatch-viz">
      {set.groups ? (
        <div className="swatch-groups">
          {set.groups.map((g) => (
            <div className="swatch-group" key={g.label}>
              <div className="swatch-group-label">{g.label}</div>
              <div className="swatch-row">{g.chips.map((c, i) => <Chip key={i} chip={c} />)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="swatch-row">{(set.chips || []).map((c, i) => <Chip key={i} chip={c} />)}</div>
      )}
      {(set.caption || set.approxNote) && (
        <figcaption className="viz-caption">
          {set.caption}
          {set.approxNote && ' ここで示す色は学習用の目安で、正確な色味は公式テキストの色見本で確認してください。'}
        </figcaption>
      )}
    </figure>
  );
}
