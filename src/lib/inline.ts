// src/lib/inline.ts — インライン記法の純粋トークナイザ（JSX非依存）
// App.tsx の描画と scripts/validate-data.ts の検証が同じロジックを共有することで、
// 「[[term:X]] が太字に入れ子で生タグのまま表示される」類のバグを再発させない。

export type InlineToken =
  | { t: 'text'; v: string }
  | { t: 'term'; name: string }
  | { t: 'link'; label: string; url: string }
  | { t: 'bold'; children: InlineToken[] }
  | { t: 'code'; v: string };

// 単独行の特殊タグ（ブロックレベルで処理されるもの）。インラインでは扱わない。
export const BLOCK_TAGS = ['huecircle', 'tonemap'];

export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  // 正規表現は呼び出しごとに新規生成する。グローバル(g)の lastIndex を再帰で共有すると壊れるため。
  const re = /\[\[term:([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1] !== undefined) {
      tokens.push({ t: 'term', name: m[1] });
    } else if (m[2] !== undefined && m[3] !== undefined) {
      tokens.push({ t: 'link', label: m[2], url: m[3] });
    } else if (m[4] !== undefined) {
      // 太字の中身も再帰的にトークン化（**[[term:X]]** に対応）
      tokens.push({ t: 'bold', children: tokenizeInline(m[4]) });
    } else if (m[5] !== undefined) {
      tokens.push({ t: 'code', v: m[5] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ t: 'text', v: text.slice(last) });
  return tokens;
}

// 検証用：トークン列の text ノードに、未処理の生タグ([[ ]])や未対応の太字記号(**)が
// 残っていないかを返す。ブロックタグ([[huecircle]]等)は事前に除去して渡すこと。
export function findRawArtifacts(tokens: InlineToken[]): string[] {
  const found: string[] = [];
  const walk = (ts: InlineToken[]) => {
    for (const tk of ts) {
      if (tk.t === 'text') {
        if (tk.v.includes('[[') || tk.v.includes(']]')) found.push(`未処理タグ: "${tk.v.trim().slice(0, 40)}"`);
        if (tk.v.includes('**')) found.push(`未対応の太字記号: "${tk.v.trim().slice(0, 40)}"`);
      } else if (tk.t === 'bold') {
        walk(tk.children);
      }
    }
  };
  walk(tokens);
  return found;
}

// 検証用：本文全体から生タグ残りを検出する。ブロックタグを除去してからトークン化する。
export function scanContentForRawTags(content: string): string[] {
  let s = content;
  for (const tag of BLOCK_TAGS) s = s.split(`[[${tag}]]`).join('');
  s = s.replace(/\[\[swatches:[a-z0-9-]+\]\]/g, ''); // [[swatches:KEY]] もブロックタグ
  return findRawArtifacts(tokenizeInline(s));
}
