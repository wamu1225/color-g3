// src/data/swatches.ts — 実色見本（スウォッチ）のレジストリ
//
// 本文から [[swatches:KEY]] で埋め込む。色は学習用の近似であり、PCCSやJISの正確な色を
// 再現したものではない（特に慣用色名は版・媒体で色味が異なるため、正確な色は公式テキストの
// 色見本で確認するよう Swatch コンポーネントのキャプションで明示する）。

export interface SwatchChip { color: string; name: string; note?: string; }
export interface SwatchGroup { label: string; chips: SwatchChip[]; }
export interface SwatchSet {
  /** フラットな並び（groups と排他） */
  chips?: SwatchChip[];
  /** グループ分けした並び */
  groups?: SwatchGroup[];
  /** 図の下の補足 */
  caption?: string;
  /** 慣用色名など「正確な色は公式テキストで」の注記を出すか */
  approxNote?: boolean;
}

export const swatchSets: Record<string, SwatchSet> = {
  'basic-colors': {
    chips: [
      { color: '#c0392b', name: '赤' },
      { color: '#e8820c', name: 'だいだい' },
      { color: '#f2c811', name: '黄' },
      { color: '#3a8a4f', name: '緑' },
      { color: '#2b79b8', name: '青' },
      { color: '#7b4fa0', name: '紫' },
      { color: '#ffffff', name: '白' },
      { color: '#9aa0a6', name: '灰色' },
      { color: '#2a2622', name: '黒' },
    ],
    caption: '基本色名の例。色を大きく分けるときの基準になることば。',
  },

  'chromatic-achromatic': {
    groups: [
      { label: '無彩色（明度だけ）', chips: [
        { color: '#ffffff', name: '白' },
        { color: '#bdbdbd', name: '明るい灰' },
        { color: '#757575', name: '灰' },
        { color: '#3a3a3a', name: '暗い灰' },
        { color: '#1a1a1a', name: '黒' },
      ] },
      { label: '有彩色（三属性すべて）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#f2c811', name: '黄' },
        { color: '#3a8a4f', name: '緑' },
        { color: '#2b79b8', name: '青' },
      ] },
    ],
    caption: '無彩色は明度だけ、有彩色は色相・明度・彩度の三属性すべてを持つ。',
  },

  'pure-clear-dull': {
    chips: [
      { color: '#e60012', name: '純色', note: '最もあざやか' },
      { color: '#f4a6ad', name: '明清色', note: '＋白' },
      { color: '#8e1115', name: '暗清色', note: '＋黒' },
      { color: '#b5736f', name: '濁色', note: '＋灰色' },
    ],
    caption: '同じ赤でも、白・黒・灰色の混ぜ方で清色・濁色に分かれる。',
  },

  'value-scale': {
    chips: [
      { color: '#ffffff', name: '高明度' },
      { color: '#cfcfcf', name: '' },
      { color: '#9a9a9a', name: '' },
      { color: '#5e5e5e', name: '' },
      { color: '#262626', name: '低明度' },
    ],
    caption: '明度のスケール。左ほど明るく、右ほど暗い（無彩色で示した例）。',
  },

  'chroma-scale': {
    chips: [
      { color: '#8f8f8f', name: '低彩度' },
      { color: '#b07a76', name: '' },
      { color: '#c85c52', name: '' },
      { color: '#e23a28', name: '' },
      { color: '#ec1c0c', name: '高彩度' },
    ],
    caption: '彩度のスケール。左ほどくすみ、右ほどあざやか（同じ赤系で明度をそろえた例）。',
  },

  'warm-cool': {
    groups: [
      { label: '暖色', chips: [
        { color: '#d32f2f', name: '赤' },
        { color: '#e8820c', name: '橙' },
        { color: '#f2c811', name: '黄' },
      ] },
      { label: '中性色', chips: [
        { color: '#3a8a4f', name: '緑' },
        { color: '#7b4fa0', name: '紫' },
      ] },
      { label: '寒色', chips: [
        { color: '#2b79b8', name: '青' },
        { color: '#2a9d8f', name: '青緑' },
      ] },
    ],
    caption: '暖色は暖かく進出・膨張、寒色は冷たく後退・収縮の効果と結びつく。',
  },

  'idiomatic-wa': {
    chips: [
      { color: '#fce2e4', name: '桜色' },
      { color: '#c9586f', name: '紅梅色' },
      { color: '#aacf53', name: '萌黄色' },
      { color: '#00a3af', name: '浅葱色（あさぎいろ）' },
      { color: '#e95464', name: '珊瑚色' },
      { color: '#1e50a2', name: '瑠璃色（るりいろ）' },
    ],
    approxNote: true,
    caption: '日本語に由来する和色名の例。',
  },

  'hue-schemes': {
    groups: [
      { label: '同一色相配色（色相は同じ・トーンで変化）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#e8a39c', name: '赤（明るいトーン）' },
      ] },
      { label: '隣接色相配色（すぐとなり）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#d35400', name: '赤みのだいだい' },
      ] },
      { label: '類似色相配色（近い）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#e8820c', name: 'だいだい' },
      ] },
      { label: '中差色相配色（やや離れる）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#8bab2e', name: '黄緑' },
      ] },
      { label: '対照色相配色（かなり離れる）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#3a8a4f', name: '緑' },
      ] },
      { label: '補色色相配色（正反対）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#2a9d8f', name: '青緑' },
      ] },
    ],
    caption: '赤を基準に、色相環での距離が離れるほど対比が強くなる例です。色相差が小さい配色ほどまとまりやすく、大きい配色ほど対比がはっきりします。',
  },

  'tone-schemes': {
    groups: [
      { label: 'トーンオントーン配色（色相そろえ・明度差）', chips: [
        { color: '#0d3b66', name: '濃い青' },
        { color: '#2b79b8', name: '青' },
        { color: '#9fc5e8', name: '淡い青' },
      ] },
      { label: 'トーンイントーン配色（トーンそろえ・色相自由）', chips: [
        { color: '#f4a6ad', name: '淡い赤' },
        { color: '#f2e29b', name: '淡い黄' },
        { color: '#a8d8d8', name: '淡い青緑' },
      ] },
    ],
    caption: 'トーンオントーンは色相を同じに保ち明度で変化をつけ、トーンイントーンはトーンをそろえ色相を変えます。',
  },

  'multicolor-schemes': {
    groups: [
      { label: 'ドミナントカラー配色（色相を共通・トーンで変化）', chips: [
        { color: '#0d3b66', name: '濃い青' },
        { color: '#2b79b8', name: '青' },
        { color: '#9fc5e8', name: '淡い青' },
      ] },
      { label: 'ドミナントトーン配色（トーンを共通・色相は自由）', chips: [
        { color: '#f4a6ad', name: '淡い赤' },
        { color: '#f2e29b', name: '淡い黄' },
        { color: '#a8d8d8', name: '淡い青緑' },
      ] },
      { label: 'カマイユ配色（ほぼ同じ）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#c24a3a', name: '赤（ごくわずかに違う）' },
      ] },
      { label: 'フォカマイユ配色（少しだけ差をつける）', chips: [
        { color: '#c0392b', name: '赤' },
        { color: '#b5573f', name: '赤みの茶（少し差がある）' },
      ] },
      { label: 'ビコロール配色（2色・明快な対比）', chips: [
        { color: '#d32f2f', name: '赤' },
        { color: '#1e50a2', name: '青' },
      ] },
      { label: 'トリコロール配色（3色・フランス国旗の例）', chips: [
        { color: '#0055a4', name: '青' },
        { color: '#ffffff', name: '白' },
        { color: '#ef4135', name: '赤' },
      ] },
    ],
    caption: 'ドミナント系は何か（色相かトーン）を共通させて支配し、カマイユ系は弱い対比、ビコロール系は明快な対比をつくります。',
  },

  'idiomatic-foreign': {
    chips: [
      { color: '#00a86b', name: 'エメラルドグリーン' },
      { color: '#0047ab', name: 'コバルトブルー' },
      { color: '#800000', name: 'マルーン' },
      { color: '#e2725b', name: 'テラコッタ' },
      { color: '#f0e68c', name: 'カーキ' },
    ],
    approxNote: true,
    caption: '外国語に由来する外来色名の例。',
  },
};
