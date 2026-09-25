export type LifeStage = 'Primary' | 'Lower Secondary' | 'Upper Secondary'
export type NeedState =
  | 'Foundation'
  | 'Grade improvement'
  | 'Entrance'
  | 'Competition'
  | 'TCAS / University'
  | 'Ongoing support'

export type SyntheticLearner = {
  id: string
  lifeStage: LifeStage
  needState: NeedState
  school: string
  score: number
  recommended: boolean
  paid14d: boolean
  nextTerm: boolean
  secondSubject: boolean
  outcomeImproved: boolean
}

const schools = [
  'เตรียมอุดมศึกษา',
  'สวนกุหลาบวิทยาลัย',
  'สาธิตปทุมวัน',
  'อัสสัมชัญ',
  'เซนต์โยเซฟคอนเวนต์',
  'โรงเรียนสาธิต',
  'โรงเรียนเอกชน กทม.',
  'โรงเรียนรัฐบาล กทม.',
]

function pseudo(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildGroup(
  start: number,
  count: number,
  lifeStage: LifeStage,
  needState: NeedState,
  scoreMean: number,
  recommendRate: number,
  paidRate: number,
  retentionRate: number,
  secondSubjectRate: number,
  outcomeRate: number,
): SyntheticLearner[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = start + index + 1
    const noise = (pseudo(seed) - 0.5) * 38
    const score = Math.max(10, Math.min(95, Math.round(scoreMean + noise)))
    return {
      id: 'SYN-' + String(seed).padStart(4, '0'),
      lifeStage,
      needState,
      school: schools[Math.floor(pseudo(seed + 7) * schools.length)],
      score,
      recommended: pseudo(seed + 11) < recommendRate,
      paid14d: pseudo(seed + 19) < paidRate,
      nextTerm: pseudo(seed + 23) < retentionRate,
      secondSubject: pseudo(seed + 29) < secondSubjectRate,
      outcomeImproved: pseudo(seed + 31) < outcomeRate,
    }
  })
}

export const syntheticLearners: SyntheticLearner[] = [
  ...buildGroup(0, 18, 'Primary', 'Foundation', 58, .94, .62, .58, .31, .72),
  ...buildGroup(18, 16, 'Primary', 'Grade improvement', 62, .92, .58, .61, .36, .69),
  ...buildGroup(34, 6, 'Primary', 'Entrance', 67, .96, .70, .49, .24, .74),

  ...buildGroup(40, 20, 'Lower Secondary', 'Foundation', 46, .93, .55, .52, .30, .67),
  ...buildGroup(60, 22, 'Lower Secondary', 'Grade improvement', 51, .91, .57, .54, .35, .70),
  ...buildGroup(82, 18, 'Lower Secondary', 'Entrance', 59, .95, .68, .43, .27, .73),
  ...buildGroup(100, 10, 'Lower Secondary', 'Competition', 71, .98, .76, .32, .20, .77),

  ...buildGroup(110, 120, 'Upper Secondary', 'Ongoing support', 52, .90, .51, .46, .33, .65),
  ...buildGroup(230, 150, 'Upper Secondary', 'TCAS / University', 63, .97, .73, .19, .23, .71),
  ...buildGroup(380, 30, 'Upper Secondary', 'Competition', 76, .99, .79, .16, .18, .78),
  ...buildGroup(410, 20, 'Upper Secondary', 'Foundation', 42, .92, .49, .44, .29, .64),
]

export const learnerDistribution = [
  { label: 'Primary', detail: 'Foundation / grade / entrance', count: 40 },
  { label: 'Lower Secondary', detail: 'Foundation / grade / entrance / competition', count: 70 },
  { label: 'Upper Secondary', detail: 'Ongoing learning', count: 120 },
  { label: 'Upper Secondary', detail: 'TCAS-focused', count: 200 },
] as const

export type ProductRow = {
  id: string
  lifeStage: LifeStage
  needState: NeedState
  product: string
  role: string
  learners: number
  contribution: number
  margin: number
  overlap: 'Low' | 'Medium' | 'High'
  action: 'GROW' | 'MERGE' | 'REPACKAGE' | 'PROMOTE' | 'HARVEST' | 'EXIT'
}

export const productRows: ProductRow[] = [
  { id:'P01', lifeStage:'Primary', needState:'Foundation', product:'Primary Math Foundation', role:'Core foundation', learners:18, contribution:12, margin:56, overlap:'Low', action:'GROW' },
  { id:'P02', lifeStage:'Primary', needState:'Grade improvement', product:'Primary School Support Pack', role:'Ongoing learning', learners:16, contribution:9, margin:53, overlap:'Medium', action:'PROMOTE' },
  { id:'P03', lifeStage:'Lower Secondary', needState:'Foundation', product:'M1–M3 Math Foundation', role:'Gap recovery', learners:20, contribution:10, margin:51, overlap:'Medium', action:'REPACKAGE' },
  { id:'P04', lifeStage:'Lower Secondary', needState:'Grade improvement', product:'M1–M3 Science Core', role:'School support', learners:22, contribution:11, margin:57, overlap:'Low', action:'GROW' },
  { id:'P05', lifeStage:'Lower Secondary', needState:'Entrance', product:'M4 Entrance Prep', role:'Entrance', learners:18, contribution:13, margin:59, overlap:'Low', action:'GROW' },
  { id:'P06', lifeStage:'Lower Secondary', needState:'Competition', product:'Competition / Olympiad Track', role:'Advanced', learners:10, contribution:8, margin:61, overlap:'Low', action:'PROMOTE' },
  { id:'P07', lifeStage:'Upper Secondary', needState:'Ongoing support', product:'Upper Secondary School Support', role:'Ongoing learning', learners:120, contribution:18, margin:52, overlap:'High', action:'REPACKAGE' },
  { id:'P08', lifeStage:'Upper Secondary', needState:'TCAS / University', product:'TCAS Physics Core', role:'Admission core', learners:86, contribution:26, margin:64, overlap:'Medium', action:'GROW' },
  { id:'P09', lifeStage:'Upper Secondary', needState:'TCAS / University', product:'TCAS Intensive Practice', role:'Practice / mock', learners:64, contribution:19, margin:58, overlap:'High', action:'MERGE' },
  { id:'P10', lifeStage:'Upper Secondary', needState:'Competition', product:'Advanced Competition Track', role:'Advanced', learners:30, contribution:12, margin:63, overlap:'Low', action:'PROMOTE' },
  { id:'P11', lifeStage:'Upper Secondary', needState:'Foundation', product:'Upper Secondary Foundation Reset', role:'Foundation rescue', learners:20, contribution:5, margin:47, overlap:'Medium', action:'PROMOTE' },
]

export const customerSignals = [
  { aspect:'Foundation depth', source:'Public reviews / discussion', signal:'Learners often compare how much explanation is provided before problem practice.', implication:'Make entry-level path and prerequisite clearer.', status:'TO VALIDATE' },
  { aspect:'Question volume', source:'Public reviews / course discussion', signal:'Practice volume appears to be an important purchase criterion in exam-prep conversations.', implication:'Protect this strength while separating foundation vs intensive practice.', status:'TO VALIDATE' },
  { aspect:'Pace', source:'Inquiry / review pattern', signal:'Pace matters differently for catch-up learners and competitive learners.', implication:'Recommend by starting level, not grade alone.', status:'HYPOTHESIS' },
  { aspect:'Price / value', source:'Public storefront + comments', signal:'Customers can compare hours, packs and price more easily than before.', implication:'Explain support and outcome value, not only hours of content.', status:'OBSERVED' },
  { aspect:'Support need', source:'Branch / advisor feedback model', signal:'Parent-assisted journeys may value human reassurance more than self-service journeys.', implication:'Test channel-specific support bundles.', status:'HYPOTHESIS' },
]

export const competitorSignals = [
  { brand:'OnDemand', foundation:62, practice:88, exam:90, value:70, support:76, note:'Prototype perception profile — validate with public comment analysis.' },
  { brand:'SmartMathPro / specialist tutor', foundation:84, practice:76, exam:82, value:74, support:58, note:'Illustrative competitor signal — not a market ranking.' },
  { brand:'Self-study / low-cost online', foundation:54, practice:68, exam:60, value:88, support:28, note:'Illustrative alternative, included to test value proposition.' },
]

export const ecosystemCards = [
  {
    brand:'Ignite',
    scope:'Partner BU',
    capability:'International admission: IELTS · SAT · IGCSE + consult',
    bridge:'Refer / collaborate when an OnDemand learner needs international-admission capability.',
    status:'PILOT OPPORTUNITY',
  },
  {
    brand:'TCASter',
    scope:'Partner BU',
    capability:'Admission information / navigation',
    bridge:'Connect academic preparation with admission planning.',
    status:'PILOT OPPORTUNITY',
  },
  {
    brand:'Premier Prep',
    scope:'Partner BU',
    capability:'English learning from primary to upper secondary',
    bridge:'Use as a cross-BU support path when English is the true gap.',
    status:'PILOT OPPORTUNITY',
  },
]

export const decisionSeeds = [
  {
    id:'D-01',
    product:'TCAS Intensive Practice',
    signal:'High need-state overlap with TCAS Physics Core',
    evidence:'64 synthetic learners · overlap HIGH · similar journey role',
    suggestion:'MERGE',
  },
  {
    id:'D-02',
    product:'Upper Secondary Foundation Reset',
    signal:'Small volume but fills a distinct underserved need',
    evidence:'20 synthetic learners · foundation need · lower starting scores',
    suggestion:'PROMOTE',
  },
  {
    id:'D-03',
    product:'Upper Secondary School Support',
    signal:'Large cohort but proposition spans too many use cases',
    evidence:'120 synthetic learners · overlap HIGH · multiple need patterns',
    suggestion:'REPACKAGE',
  },
] as const

export function percent(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}
