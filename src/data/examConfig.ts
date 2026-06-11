// 色彩検定3級 試験情報の唯一のソース（SSOT）
// すべて公式サイト aft.or.jp（公益社団法人 色彩検定協会）の受検案内で確認した事実のみを記載する。
// 検定料・日程・合格点は年度／回で変動するため、掲載値は aft.or.jp で再確認してから更新すること。
// 最終確認日: 2026-06-11（出典: https://www.aft.or.jp/exam-orders ほか）

export const EXAM_CONFIG = {
  // 試験の実施団体
  organizer: '公益社団法人 色彩検定協会',
  patronage: '文部科学省後援',

  // 試験形式
  duration: 60, // 試験時間（分）
  format: 'マークシート方式', // 3級は記述・2次試験なし
  fullScore: 200, // 満点
  passingScoreLabel: '200点満点の140点前後（問題の難易度により多少変動）',
  fee: 7000, // 検定料（税込・円）2025年度時点
  feeLabel: '7,000円（税込）',

  // 受験資格
  eligibility: '制限なし。年齢・学歴を問わず、どなたでも何級からでも受検できる（併願も可能）。',

  // 実施回数・時期
  frequency: '年2回（夏期・冬期）',
  summerMonth: 6, // 夏期＝6月
  winterMonth: 11, // 冬期＝11月

  // 2026年度日程（aft.or.jp スケジュールで確認）
  schedule2026: {
    summerExamDate: '2026年6月28日（日）',
    summerApplication: '2026年4月1日（水）〜5月21日（木）',
    winterExamDate: '2026年11月8日（日）',
    winterApplication: '2026年8月10日（月）〜10月1日（木）',
  },
} as const;
