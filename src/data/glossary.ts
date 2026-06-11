// src/data/glossary.ts — 色彩検定3級 用語集
//
// 各定義は、公式テキストの分野・標準的な色彩理論を「事実確認のうえ自分の言葉で」書き起こしたもの。
// 出典の定義文をそのまま転載していない（著作権・重複コンテンツ回避）。
// 色数・制定年など情報源で割れる/未確定の数値は断定せず、定性的に説明する方針。

export interface Term {
  id: string;
  term: string;        // 表示名（読み・英語を併記）
  explanation: string; // 初学者向けのやさしい定義（自分の言葉）
  level: '基礎' | '頻出' | '応用';
  relatedTerms?: string[];
}

export const glossary: Record<string, Term> = {
  // ── 色の三属性 ──────────────────────────────
  'hue': {
    id: 'hue',
    term: '色相（しきそう／Hue）',
    explanation: '赤・黄・緑・青といった「色味そのものの違い」のこと。色の三属性のひとつで、虹の帯のように連続して移り変わる。色相を環状に並べたものが色相環で、向かい合う位置にある色どうしが補色の関係になる。',
    level: '基礎',
    relatedTerms: ['three-attributes', 'hue-circle', 'complementary'],
  },
  'value': {
    id: 'value',
    term: '明度（めいど／Value・Lightness）',
    explanation: '色の「明るさ」の度合い。最も明るいのが白、最も暗いのが黒で、その間に灰色が並ぶ。明度だけを持つ色（白・灰・黒）が無彩色。明度と彩度を取り違えやすいので、明度は「明るい⇔暗い」、彩度は「あざやか⇔くすんでいる」と区別して覚えるとよい。',
    level: '基礎',
    relatedTerms: ['three-attributes', 'chroma', 'achromatic'],
  },
  'chroma': {
    id: 'chroma',
    term: '彩度（さいど／Chroma・Saturation）',
    explanation: '色の「あざやかさ」の度合い。彩度が高いほど純粋で鮮明な色になり、低いほど灰色みを帯びてくすんで見える。無彩色は彩度を持たない（彩度ゼロ）。各色相のなかで最も彩度が高い色を純色と呼ぶ。',
    level: '基礎',
    relatedTerms: ['three-attributes', 'value', 'pure-color'],
  },
  'three-attributes': {
    id: 'three-attributes',
    term: '色の三属性',
    explanation: '色相・明度・彩度という、色を表すための3つのものさし。この3つを指定すれば、見えているどんな色も位置づけられる。無彩色は明度だけを持ち、有彩色は三属性すべてを持つ。',
    level: '基礎',
    relatedTerms: ['hue', 'value', 'chroma', 'achromatic', 'chromatic'],
  },

  // ── 色の分類 ────────────────────────────────
  'achromatic': {
    id: 'achromatic',
    term: '無彩色（むさいしょく）',
    explanation: '白・灰色・黒のように、色味（色相）も鮮やかさ（彩度）も持たず、明るさ（明度）の違いだけで表せる色。配色では他の色を引き立てたり、間に挟んで調整したりする役割で使われる。',
    level: '基礎',
    relatedTerms: ['chromatic', 'value', 'separation'],
  },
  'chromatic': {
    id: 'chromatic',
    term: '有彩色（ゆうさいしょく）',
    explanation: '赤・黄・緑・青のように色味を持つ色。色相・明度・彩度の三属性すべてを備える。無彩色以外のすべての色が有彩色にあたる。',
    level: '基礎',
    relatedTerms: ['achromatic', 'three-attributes'],
  },
  'pure-color': {
    id: 'pure-color',
    term: '純色（じゅんしょく）',
    explanation: '各色相のなかで最も彩度が高い、混じりけのない色。純色に白を混ぜたものを明清色、黒を混ぜたものを暗清色、灰色を混ぜて濁らせたものを濁色（中間色）と呼ぶ。',
    level: '頻出',
    relatedTerms: ['chroma', 'clear-color', 'dull-color'],
  },
  'clear-color': {
    id: 'clear-color',
    term: '清色（せいしょく）',
    explanation: '純色に白だけ、または黒だけを混ぜた、濁りのない澄んだ色。白を混ぜた明るい清色が明清色、黒を混ぜた暗い清色が暗清色。灰色を混ぜた濁色と対になる考え方。',
    level: '頻出',
    relatedTerms: ['pure-color', 'dull-color'],
  },
  'dull-color': {
    id: 'dull-color',
    term: '濁色（だくしょく／中間色）',
    explanation: '純色に灰色を混ぜて、彩度を落とした濁りのある色。中間色とも呼ぶ。清色（白か黒だけを混ぜた澄んだ色）と区別して覚える。',
    level: '頻出',
    relatedTerms: ['pure-color', 'clear-color'],
  },

  // ── 表色系 ──────────────────────────────────
  'pccs': {
    id: 'pccs',
    term: 'PCCS（日本色研配色体系）',
    explanation: '配色を考えやすくすることを目的に、日本色彩研究所が開発した色の体系。色相（Hue）とトーン（Tone）の2つの手がかりで色を整理できる「ヒュートーンシステム」が特徴で、色彩検定3級の学習の土台になる。赤・黄・緑・青の心理四原色をもとに24色相環を組み立てる。',
    level: '基礎',
    relatedTerms: ['hue-circle', 'tone', 'psychological-primary', 'munsell'],
  },
  'hue-circle': {
    id: 'hue-circle',
    term: '色相環（しきそうかん）',
    explanation: '色相を順番に環状に並べたもの。PCCSでは24の色相に分け、各色相に番号と記号（例：2:R＝赤、8:Y＝黄）を付ける。環の向かい合う位置にある色どうしが補色で、近い位置どうしは似た色（類似色相）になる。試験では色相環を自分で描けるようにしておくと配色問題に強くなる。',
    level: '頻出',
    relatedTerms: ['pccs', 'hue', 'complementary', 'tone-map'],
  },
  'psychological-primary': {
    id: 'psychological-primary',
    term: '心理四原色',
    explanation: 'これ以上ほかの色みに分解して感じられない、心理的な原色とされる赤・黄・緑・青の4色。PCCSの色相環はこの4色を基準点として組み立てられている。',
    level: '応用',
    relatedTerms: ['pccs', 'hue-circle'],
  },
  'tone': {
    id: 'tone',
    term: 'トーン（色調）',
    explanation: '明度と彩度を合わせてひとまとめにとらえた「色の調子」。PCCSでは有彩色のトーンを12種類に分け、それぞれに「ペールトーン＝うすく優しい」「ビビッドトーン＝あざやかで強い」のような固有のイメージがある。同じ色相でもトーンが変われば印象が大きく変わる。',
    level: '基礎',
    relatedTerms: ['pccs', 'tone-map', 'value', 'chroma'],
  },
  'tone-map': {
    id: 'tone-map',
    term: 'トーンマップ',
    explanation: 'PCCSの12トーンを、横軸に彩度・縦軸に明度をとって配置した図。どのトーンが明るい/暗い、あざやか/くすんでいるかを一目で確認でき、トーンを手がかりにした配色を考えるときの地図になる。色相環とセットで描けるようにしておくとよい。',
    level: '頻出',
    relatedTerms: ['tone', 'hue-circle'],
  },
  'munsell': {
    id: 'munsell',
    term: 'マンセル表色系',
    explanation: 'アメリカの画家・美術教育者マンセルが考案した、色を客観的に表すしくみ。色相（H）・明度（V）・彩度（C）を「HV/C」の形（例：5R 4/14）で表記する。日本ではJISの色の表示方法にも取り入れられている。配色用のPCCSに対し、こちらは色を正確に指定・伝達するための体系という位置づけ。',
    level: '応用',
    relatedTerms: ['pccs', 'three-attributes'],
  },

  // ── 混色 ────────────────────────────────────
  'additive-mixing': {
    id: 'additive-mixing',
    term: '加法混色（かほうこんしょく）',
    explanation: '光を重ねるほど明るくなる混色。赤（R）・緑（G）・青（B）の光の三原色を重ねると白に近づく。テレビやスマホの画面、舞台照明などがこのしくみで色を作っている。',
    level: '頻出',
    relatedTerms: ['subtractive-mixing'],
  },
  'subtractive-mixing': {
    id: 'subtractive-mixing',
    term: '減法混色（げんぽうこんしょく）',
    explanation: '絵の具やインクのように、混ぜるほど暗くなる混色。シアン（C）・マゼンタ（M）・イエロー（Y）の色料の三原色を重ねると黒に近づく。カラー印刷はこのしくみを使っている。加法混色と対にして覚える。',
    level: '頻出',
    relatedTerms: ['additive-mixing'],
  },

  // ── 対比・同化 ──────────────────────────────
  'complementary': {
    id: 'complementary',
    term: '補色（ほしょく）',
    explanation: '色相環で正反対に位置する色どうしの関係。となり合わせに置くとお互いをあざやかに見せ合う（補色対比）。赤と青緑のような組み合わせが代表例で、強い対比をつくりたいときに使う。',
    level: '頻出',
    relatedTerms: ['hue-circle', 'contrast'],
  },
  'contrast': {
    id: 'contrast',
    term: '対比（たいひ）',
    explanation: '近くにある色どうしが影響し合い、違いが強調されて見える現象。色みの差が強まる色相対比、明るさの差が強まる明度対比、あざやかさの差が強まる彩度対比、補色どうしが鮮明になる補色対比、境目がちらつく縁辺対比などがある。',
    level: '頻出',
    relatedTerms: ['assimilation', 'complementary', 'area-effect'],
  },
  'assimilation': {
    id: 'assimilation',
    term: '同化（どうか）',
    explanation: '対比とは逆に、囲まれた色や挟まれた色が、まわりの色に近づいて見える現象。細かい模様やストライプなど、色の面積が小さく入り組んでいるときに起こりやすい。「差が強調される＝対比」「まわりに近づく＝同化」と対で覚える。',
    level: '頻出',
    relatedTerms: ['contrast'],
  },
  'area-effect': {
    id: 'area-effect',
    term: '面積効果',
    explanation: '同じ色でも、面積が大きいほど明るく・あざやかに見える現象。小さな色見本で選んだ壁紙やカーテンが、広い面に貼ると思ったより派手に感じるのはこのため。',
    level: '応用',
    relatedTerms: ['contrast'],
  },

  // ── 色の心理効果 ────────────────────────────
  'warm-cool': {
    id: 'warm-cool',
    term: '暖色・寒色・中性色',
    explanation: '赤やオレンジのように暖かさを感じる色が暖色、青や青緑のように冷たさを感じる色が寒色、緑や紫のようにどちらともいえない色が中性色。暖色は進出・膨張、寒色は後退・収縮の効果と結びつけて覚えるとよい。',
    level: '頻出',
    relatedTerms: ['advancing-receding', 'expansion-contraction'],
  },
  'advancing-receding': {
    id: 'advancing-receding',
    term: '進出色・後退色',
    explanation: '実際より手前に飛び出して見える色が進出色（暖色・高明度・高彩度に多い）、奥に引っ込んで見える色が後退色（寒色・低明度に多い）。距離感を演出したいときに利用する。',
    level: '応用',
    relatedTerms: ['warm-cool', 'expansion-contraction'],
  },
  'expansion-contraction': {
    id: 'expansion-contraction',
    term: '膨張色・収縮色',
    explanation: '実際より大きく見える色が膨張色（明るい色＝高明度に多い）、小さく引き締まって見える色が収縮色（暗い色＝低明度に多い）。大きさの印象には彩度より明度が強く影響する。',
    level: '応用',
    relatedTerms: ['advancing-receding', 'value'],
  },
  'excitement-calm': {
    id: 'excitement-calm',
    term: '興奮色・沈静色',
    explanation: '気持ちを高ぶらせる色が興奮色（あざやかな暖色）、落ち着かせる色が沈静色（青などの寒色）。空間や場面の気分づくりに使われる。',
    level: '応用',
    relatedTerms: ['warm-cool'],
  },

  // ── 配色技法 ────────────────────────────────
  'separation': {
    id: 'separation',
    term: 'セパレーション配色',
    explanation: '色と色の境目に別の色（多くは白・黒・灰色などの無彩色）を細く挟む技法。配色が強すぎてぶつかるときは和らげ、ぼやけて締まらないときはメリハリをつける、調整役の配色。',
    level: '頻出',
    relatedTerms: ['accent', 'achromatic'],
  },
  'accent': {
    id: 'accent',
    term: 'アクセントカラー配色',
    explanation: '全体をまとめた配色のなかに、小さな面積で対照的な色を効かせて引き締める技法。地味になりがちな配色に焦点をつくり、目を引くポイントを生む。',
    level: '頻出',
    relatedTerms: ['separation', 'dominant-color'],
  },
  'gradation': {
    id: 'gradation',
    term: 'グラデーション配色',
    explanation: '色相・明度・彩度のいずれかを少しずつ段階的に変化させて並べる配色。連続的に移り変わるため、リズムと秩序のある自然な流れが生まれる。',
    level: '頻出',
    relatedTerms: ['tone-on-tone'],
  },
  'dominant-color': {
    id: 'dominant-color',
    term: 'ドミナントカラー配色',
    explanation: 'ひとつの色相で全体を支配（ドミナント）し、トーンを変えて変化をつける多色配色。色相がそろっているので、まとまりがありながら単調になりにくい。',
    level: '応用',
    relatedTerms: ['dominant-tone', 'tone-on-tone'],
  },
  'dominant-tone': {
    id: 'dominant-tone',
    term: 'ドミナントトーン配色',
    explanation: 'トーンをそろえて全体を支配し、色相を変えて変化をつける多色配色。同じトーンが持つイメージ（やわらかい・あざやかなど）を全体に印象づけられる。ドミナントカラーと対で覚える。',
    level: '応用',
    relatedTerms: ['dominant-color', 'tone-in-tone'],
  },
  'tone-on-tone': {
    id: 'tone-on-tone',
    term: 'トーンオントーン配色',
    explanation: '色相をほぼそろえ、明度の差を大きくとった配色。「トーン・オン・トーン＝色調を重ねる」の名のとおり、同系色の濃淡でまとめる落ち着いた配色になる。',
    level: '応用',
    relatedTerms: ['tone-in-tone', 'dominant-color'],
  },
  'tone-in-tone': {
    id: 'tone-in-tone',
    term: 'トーンイントーン配色',
    explanation: 'トーンをそろえ、色相は自由に選ぶ配色。明度が近いので全体がやわらかくまとまり、トーンの持つイメージが共通の雰囲気をつくる。トーンオントーンと混同しやすいので、「オン＝色相そろえ明度差」「イン＝トーンそろえ」と区別する。',
    level: '応用',
    relatedTerms: ['tone-on-tone', 'dominant-tone'],
  },
  'camaieu': {
    id: 'camaieu',
    term: 'カマイユ配色・フォカマイユ配色',
    explanation: 'カマイユは色相もトーンもほとんど同じで、ひと目では一色に見えるほど微妙な差の配色。フォカマイユ（faux＝「にせの」）は、それよりわずかに色相やトーンに差をつけた配色。どちらもごく弱い対比のやわらかな配色で、セットで覚える。',
    level: '応用',
    relatedTerms: ['bicolor'],
  },
  'bicolor': {
    id: 'bicolor',
    term: 'ビコロール配色・トリコロール配色',
    explanation: 'ビコロール（bi＝2）は2色、トリコロール（tri＝3）は3色による、はっきりした対比の配色。国旗のように高彩度の色や明快なコントラストで構成されることが多い。',
    level: '応用',
    relatedTerms: ['camaieu'],
  },

  // ── 色名 ────────────────────────────────────
  'basic-color-name': {
    id: 'basic-color-name',
    term: '基本色名（きほんしきめい）',
    explanation: '赤・黄・緑・青・白・黒のように、色を大きく分類するための基本となる色名。系統色名や慣用色名の土台になる。',
    level: '頻出',
    relatedTerms: ['systematic-color-name', 'idiomatic-color-name'],
  },
  'systematic-color-name': {
    id: 'systematic-color-name',
    term: '系統色名（けいとうしきめい）',
    explanation: '基本色名に「明るい」「うすい」「こい」などの修飾語を付けて、色をある程度正確に言い表す色名（例：明るい赤、こい緑みの青）。だれが見てもおおよその色がわかるよう、ことばで体系立てられている。慣用色名と対にして覚える。',
    level: '頻出',
    relatedTerms: ['basic-color-name', 'idiomatic-color-name'],
  },
  'proper-color-name': {
    id: 'proper-color-name',
    term: '固有色名（こゆうしきめい）',
    explanation: '植物・動物・地名・染料など、具体的なものの名前に由来する色名。そのうち多くの人に色が伝わる定着したものが慣用色名として扱われる。',
    level: '応用',
    relatedTerms: ['idiomatic-color-name'],
  },
  'idiomatic-color-name': {
    id: 'idiomatic-color-name',
    term: '慣用色名（かんようしきめい）',
    explanation: '桜色・珊瑚色・紅梅色のように、昔から慣用的に使われ、多くの人が色を思い浮かべられる色名。風情を伝えるのは得意だが、正確に色を指定するには向かない。日本産業規格（JIS）が定めた慣用色名（JIS慣用色名）があり、3級では公式テキストに載っている和色名・外来色名が出題範囲になる。',
    level: '頻出',
    relatedTerms: ['systematic-color-name', 'proper-color-name'],
  },
};
