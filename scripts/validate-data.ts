// scripts/validate-data.ts — データ整合性チェック（tsx で実データを import）
// 実行: npx tsx scripts/validate-data.ts（npm run validate）
import { modules } from '../src/data/modules';
import { glossary } from '../src/data/glossary';
import { chapterNames } from '../src/data/chapters';
import { scanContentForRawTags } from '../src/lib/inline';

const errors: string[] = [];
const warnings: string[] = [];

// 1. モジュールID・クイズIDの一意性
const moduleIds = new Set<string>();
const quizIds = new Set<string>();
for (const m of modules) {
  if (moduleIds.has(m.id)) errors.push(`重複モジュールID: ${m.id}`);
  moduleIds.add(m.id);

  // 2. クイズは必ず10問
  if (m.quiz.length !== 10) errors.push(`[${m.id}] クイズが${m.quiz.length}問（10問必須）`);

  // 3. chapter が chapters.ts に存在するか
  if (!chapterNames[m.chapter]) errors.push(`[${m.id}] 未定義のchapter: ${m.chapter}`);

  // 4. 各設問の整合性
  for (const q of m.quiz) {
    if (quizIds.has(q.id)) errors.push(`重複クイズID: ${q.id}`);
    quizIds.add(q.id);
    if (q.options.length !== 4) warnings.push(`[${q.id}] 選択肢が${q.options.length}個（標準は4択）`);
    if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      errors.push(`[${q.id}] correctAnswer(${q.correctAnswer})が選択肢範囲外`);
    }
    if (!q.explanation || q.explanation.trim() === '') errors.push(`[${q.id}] 解説が空`);
  }
}

// 5. カスタムタグの検査（[[term:X]] / [[huecircle]] / [[tonemap]] のみ許可）
const termLead: Record<string, true> = {};
for (const key of Object.keys(glossary)) {
  const lead = glossary[key].term.split('（')[0].trim();
  termLead[lead] = true;
  termLead[glossary[key].term.trim()] = true;
  if (lead.includes('・')) {
    for (const part of lead.split('・')) {
      const p = part.trim();
      if (p) termLead[p] = true;
    }
  }
}
const tagRe = /\[\[([^\]]+)\]\]/g;
for (const m of modules) {
  let mt: RegExpExecArray | null;
  while ((mt = tagRe.exec(m.content)) !== null) {
    const tag = mt[1];
    if (tag === 'huecircle' || tag === 'tonemap') continue;
    if (tag.startsWith('term:')) {
      const name = tag.slice('term:'.length);
      if (!termLead[name]) warnings.push(`[${m.id}] 用語集に無い用語リンク: [[term:${name}]]`);
      continue;
    }
    errors.push(`[${m.id}] 未知のカスタムタグ: [[${tag}]]`);
  }
}

// 5b. 生タグ残り検出（App.tsx と同じトークナイザで、画面に [[...]] や ** が露出しないか確認）
//     太字に入れ子の用語タグ等を取りこぼすと本番で生タグが出るため、ここで未然に止める。
for (const m of modules) {
  const arts = scanContentForRawTags(m.content);
  for (const a of arts) errors.push(`[${m.id}] 描画で露出する恐れ: ${a}`);
  if (m.keyPoints) {
    for (const kp of m.keyPoints) {
      for (const a of scanContentForRawTags(kp)) errors.push(`[${m.id}] keyPoints露出: ${a}`);
    }
  }
}

// 6. glossary の relatedTerms 参照先が存在するか
for (const key of Object.keys(glossary)) {
  const rel = glossary[key].relatedTerms || [];
  for (const r of rel) {
    if (!glossary[r]) warnings.push(`[glossary:${key}] relatedTerms の参照先が無い: ${r}`);
  }
}

// ── 結果出力 ──
console.log(`モジュール数: ${modules.length} / クイズ総数: ${quizIds.size} / 用語数: ${Object.keys(glossary).length}`);
if (warnings.length) {
  console.log(`\n警告 (${warnings.length}):`);
  warnings.forEach((w) => console.log('  - ' + w));
}
if (errors.length) {
  console.error(`\nエラー (${errors.length}):`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('\n✓ データ検証OK');
