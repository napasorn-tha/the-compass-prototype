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
  sku: string
  lifeStage: LifeStage
  needState: NeedState
  subject: string
  product: string
  role: string
  learners: number
  contribution: number
  margin: number
  overlap: 'Low' | 'Medium' | 'High'
  action: 'GROW' | 'MERGE' | 'REPACKAGE' | 'PROMOTE' | 'HARVEST' | 'EXIT'
}

export const productRows: ProductRow[] = [
  { id:'P01', sku:'4881', lifeStage:'Primary', needState:'Foundation', subject:'Science + Math', product:'Pack วิทย์ + คณิต ป.4 เทอม 1 (4015,4814)', role:'School foundation', learners:18, contribution:8, margin:54, overlap:'Low', action:'GROW' },
  { id:'P02', sku:'P4002', lifeStage:'Primary', needState:'Entrance', subject:'English', product:'Pack Essential ปูพื้นฐานภาษาอังกฤษ ประถมปลาย 2 (P1008, P1009)', role:'Foundation + M.1 / EP entrance', learners:9, contribution:5, margin:51, overlap:'Low', action:'PROMOTE' },

  { id:'P03', sku:'8186', lifeStage:'Lower Secondary', needState:'Foundation', subject:'Math', product:'Pack 1 คณิตศาสตร์ ม.ต้น (8101-8102)', role:'Foundation / school content', learners:20, contribution:9, margin:51, overlap:'Medium', action:'GROW' },
  { id:'P04', sku:'3186', lifeStage:'Lower Secondary', needState:'Foundation', subject:'Chemistry', product:'Pack พื้นฐาน รวมครบ เคมี ม.ต้น (3121, 3122, 3123)', role:'Foundation / competition prep', learners:17, contribution:8, margin:53, overlap:'Low', action:'GROW' },
  { id:'P05', sku:'2183', lifeStage:'Lower Secondary', needState:'Grade improvement', subject:'Biology', product:'Pack 1 ชีววิทยา ม.ต้น : กลุ่มพื้นฐานชีววิทยา อาหาร', role:'School content', learners:16, contribution:7, margin:55, overlap:'Low', action:'PROMOTE' },
  { id:'P06', sku:'3124', lifeStage:'Lower Secondary', needState:'Competition', subject:'Chemistry', product:'เคมี ม.ต้น เข้มข้น สำหรับนักเรียนโรงเรียนแข่งขันสูง', role:'Competition', learners:10, contribution:6, margin:58, overlap:'Low', action:'PROMOTE' },

  { id:'P07', sku:'8281', lifeStage:'Upper Secondary', needState:'Grade improvement', subject:'Math', product:'Pack 1 คณิตศาสตร์ ม.ปลาย (8201-8204)', role:'School content / grade support', learners:54, contribution:13, margin:55, overlap:'Medium', action:'GROW' },
  { id:'P08', sku:'0281', lifeStage:'Upper Secondary', needState:'Foundation', subject:'Physics', product:'Pack กลศาสตร์ 1 (0201-0204)', role:'Physics foundation', learners:44, contribution:11, margin:56, overlap:'Medium', action:'PROMOTE' },
  { id:'P09', sku:'P3005', lifeStage:'Upper Secondary', needState:'Foundation', subject:'English', product:'Pack Essential ปูพื้นฐานภาษาอังกฤษ ม.ปลาย (P2011, P2012)', role:'English foundation', learners:33, contribution:9, margin:52, overlap:'Low', action:'PROMOTE' },

  { id:'P10', sku:'8399', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Math', product:'PACK MATH ADMISSIONS TCAS (เลข สำหรับ DEK\'70)', role:'TCAS core', learners:72, contribution:19, margin:63, overlap:'High', action:'GROW' },
  { id:'P11', sku:'9685', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Math', product:'Pack Math Admission TCAS + UpSkill คณิต A-Level V.71', role:'TCAS core + practice bundle', learners:47, contribution:15, margin:59, overlap:'High', action:'REPACKAGE' },
  { id:'P12', sku:'1399', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Physics', product:'Pack V-Series Physics TCAS (ฟิสิกส์ สำหรับ DEK\'70)', role:'TCAS core', learners:68, contribution:18, margin:64, overlap:'High', action:'GROW' },
  { id:'P13', sku:'9684', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Physics', product:'Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level V.71', role:'TCAS core + practice bundle', learners:42, contribution:14, margin:58, overlap:'High', action:'REPACKAGE' },
  { id:'P14', sku:'3399', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Chemistry', product:'Pack เคมี TCAS (เคมี สำหรับ DEK\'70)', role:'TCAS core', learners:51, contribution:14, margin:61, overlap:'Medium', action:'GROW' },
  { id:'P15', sku:'2399', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'Biology', product:'Pack Biology TCAS (ชีววิทยา สำหรับ DEK\'70)', role:'TCAS core', learners:49, contribution:13, margin:61, overlap:'Medium', action:'GROW' },
  { id:'P16', sku:'P3009-V06', lifeStage:'Upper Secondary', needState:'TCAS / University', subject:'English', product:'English TCAS Success (อังกฤษ สำหรับ DEK\'70)', role:'TCAS core', learners:38, contribution:10, margin:57, overlap:'Low', action:'PROMOTE' },
]

export const voiceData = [
  {
    level:'Upper Secondary', subject:'Physics', pack:'Pack กลศาสตร์ 1 (0201-0204)',
    sample:38,
    takeaway:'ผู้เรียนที่เข้ามาด้วย need “ปูพื้นฐาน” ต้องการให้เห็น prerequisite และลำดับเรียนชัดก่อนเข้าโจทย์หนัก',
    implication:'แยก messaging ของ Foundation ออกจาก TCAS Intensive ให้ชัด และใช้ Gap Map route ให้ถูก entry point.',
    themes:[
      ['ปูพื้นฐาน',15,'ต้องการรู้ว่าคอร์สเริ่มจากศูนย์แค่ไหน'],
      ['โจทย์ / Practice',11,'มองปริมาณและระดับโจทย์เป็นเหตุผลสำคัญในการเลือก'],
      ['Pace',7,'ผู้เรียนพื้นฐานต่างกันรับ pace ไม่เท่ากัน'],
      ['ราคา / Value',5,'เปรียบเทียบชั่วโมง เนื้อหา และรูปแบบ support'],
    ]
  },
  {
    level:'Upper Secondary', subject:'Math', pack:'Pack 1 คณิตศาสตร์ ม.ปลาย (8201-8204)',
    sample:44,
    takeaway:'Need หลักไม่ได้มีแค่ TCAS — มีทั้ง “เรียนตามโรงเรียนให้ทัน” และ “เตรียมสอบ” ในวิชาเดียวกัน',
    implication:'ทำ entry choice ให้ชัดว่า School Support vs Admission Prep เพื่อไม่ให้ผู้เรียนเลือก pack จากชื่ออย่างเดียว.',
    themes:[
      ['อธิบายเข้าใจง่าย',14,'ถามเรื่องความเหมาะกับคนพื้นฐานต่างระดับ'],
      ['เพิ่มเกรด',13,'ต้องการ alignment กับเนื้อหาโรงเรียน'],
      ['โจทย์ / Practice',10,'ต้องการโจทย์ต่อยอดหลังเข้า concept'],
      ['ราคา / Value',7,'เทียบแพ็กกับคอร์ส specialist'],
    ]
  },
  {
    level:'Upper Secondary', subject:'Biology', pack:'Pack Biology TCAS (ชีววิทยา สำหรับ DEK\'70)',
    sample:31,
    takeaway:'การเลือกคอร์สชีวะถูกขับด้วย coverage + exam alignment มากกว่าชื่อ package อย่างเดียว',
    implication:'สื่อ coverage / readiness level ให้ชัด และเทียบ role กับ specialist biology brands ใน competitor view.',
    themes:[
      ['ตรงข้อสอบ',12,'สนใจความครอบคลุม A-Level / TCAS'],
      ['Content coverage',9,'ต้องการรู้ว่าเก็บครบแค่ไหน'],
      ['Teacher style',6,'รูปแบบอธิบายมีผลต่อการเลือก'],
      ['Pace',4,'ผู้เรียนบางกลุ่มต้องการทบทวนก่อน intensive'],
    ]
  },
  {
    level:'Lower Secondary', subject:'Chemistry', pack:'Pack พื้นฐาน รวมครบ เคมี ม.ต้น (3121, 3122, 3123)',
    sample:27,
    takeaway:'ม.ต้นมีทั้งเรียนเพื่อพื้นฐานและเรียนล่วงหน้าเพื่อแข่งขัน — package เดียวอาจถูกมองคนละ job-to-be-done',
    implication:'แยก recommendation ตาม need state แม้อยู่ pack เดียวกัน และทดสอบ copy สำหรับ Foundation vs Competition.',
    themes:[
      ['ปูพื้นฐาน',11,'อยากให้เข้าใจ concept ก่อน'],
      ['เตรียมแข่งขัน',7,'มองการต่อยอดสู่สนามแข่งขัน'],
      ['Pace',5,'ระดับเริ่มต้นต่างกัน'],
      ['Support',4,'ผู้ปกครองสนใจว่าจะมีคนช่วยเมื่อเรียนไม่ทันหรือไม่'],
    ]
  },
]

export type CompetitorProfile = {
  subject: 'Math' | 'Physics' | 'Chemistry' | 'Biology' | 'English'
  level: 'Lower Secondary' | 'Upper Secondary / TCAS'
  brand: string
  type: 'OnDemand' | 'Specialist' | 'Multi-subject'
  visibleOffer: string
  positioning: string[]
  portfolioQuestion: string
}

export const competitorProfiles: CompetitorProfile[] = [
  { subject:'Math', level:'Upper Secondary / TCAS', brand:'OnDemand', type:'OnDemand', visibleOffer:'Pack 1 คณิตศาสตร์ ม.ปลาย / MATH ADMISSIONS TCAS', positioning:['School content','TCAS','Pack breadth'], portfolioQuestion:'ทำให้ School Support vs TCAS path แยกชัดพอหรือยัง?' },
  { subject:'Math', level:'Upper Secondary / TCAS', brand:'SmartMathPro (พี่ปั้น)', type:'Specialist', visibleOffer:'Math specialist: high-school / A-Level pathways', positioning:['Math specialist','Foundation','Exam prep'], portfolioQuestion:'Specialist positioning ทำให้ value proposition เข้าใจง่ายกว่า broad portfolio หรือไม่?' },
  { subject:'Math', level:'Upper Secondary / TCAS', brand:'WE BY THE BRAIN', type:'Multi-subject', visibleOffer:'Math high-school / A-Level + multi-subject exam prep', positioning:['Multi-subject','School content','Exam prep'], portfolioQuestion:'เทียบ breadth, package clarity และ cross-subject journey.' },
  { subject:'Math', level:'Upper Secondary / TCAS', brand:'Applied Math', type:'Specialist', visibleOffer:'Math TCAS / ตะลุยโจทย์ / school packs', positioning:['Math','TCAS','Practice'], portfolioQuestion:'Practice proposition ซ้อนกับ OnDemand Upskill แค่ไหน?' },

  { subject:'Physics', level:'Upper Secondary / TCAS', brand:'OnDemand', type:'OnDemand', visibleOffer:'Pack กลศาสตร์ / V-Series Physics TCAS / +Upskill', positioning:['Foundation','School content','TCAS','Upskill'], portfolioQuestion:'Base TCAS vs TCAS+Upskill ต่างกันชัดพอหรือมี cannibalization risk?' },
  { subject:'Physics', level:'Upper Secondary / TCAS', brand:'Applied Physics', type:'Specialist', visibleOffer:'Pre-Entrance / Entrance TCAS / ตะลุยโจทย์ / PACK SUPER', positioning:['Physics specialist','Foundation','TCAS','Practice'], portfolioQuestion:'Competitor journey แบ่ง Foundation → Entrance → Practice ชัดกว่าหรือไม่?' },
  { subject:'Physics', level:'Upper Secondary / TCAS', brand:'WE BY THE BRAIN', type:'Multi-subject', visibleOffer:'Physics school content + exam preparation', positioning:['Multi-subject','School content','Exam prep'], portfolioQuestion:'OnDemand ควรชนะด้วย journey integration หรือ course breadth?' },

  { subject:'Biology', level:'Upper Secondary / TCAS', brand:'OnDemand', type:'OnDemand', visibleOffer:'Pack Biology TCAS / UpSkill ชีววิทยา A-Level', positioning:['TCAS','Coverage','Upskill'], portfolioQuestion:'Coverage และ prerequisite ถูกสื่อชัดพอเมื่อเทียบ specialist หรือไม่?' },
  { subject:'Biology', level:'Upper Secondary / TCAS', brand:'Bio BEAM', type:'Specialist', visibleOffer:'ICU ชีววิทยา TCAS / COMA ตะลุยโจทย์ / ม.4–ม.6', positioning:['Biology specialist','TCAS','Practice'], portfolioQuestion:'Specialist authority มีผลต่อ choice ในกลุ่ม TCAS มากแค่ไหน?' },
  { subject:'Biology', level:'Upper Secondary / TCAS', brand:'WE BY THE BRAIN', type:'Multi-subject', visibleOffer:'Biology school content + entrance prep', positioning:['Multi-subject','School content','Exam prep'], portfolioQuestion:'Cross-subject convenience เป็น decision driver หรือไม่?' },

  { subject:'Chemistry', level:'Upper Secondary / TCAS', brand:'OnDemand', type:'OnDemand', visibleOffer:'Pack เคมี TCAS / +UpSkill เคมี A-Level', positioning:['TCAS','Pack','Upskill'], portfolioQuestion:'Base + Upskill proposition ควร merge, bundle หรือแยกตาม readiness?' },
  { subject:'Chemistry', level:'Upper Secondary / TCAS', brand:'เคมี อ.อุ๊', type:'Specialist', visibleOffer:'Pre-Entrance / Entrance / ตะลุยโจทย์', positioning:['Chemistry specialist','Foundation','Entrance','Practice'], portfolioQuestion:'ผู้เรียนอ่าน journey ของ specialist ได้ง่ายกว่าแพ็กหลายชั้นหรือไม่?' },
  { subject:'Chemistry', level:'Upper Secondary / TCAS', brand:'WE BY THE BRAIN', type:'Multi-subject', visibleOffer:'Chemistry school content + exam prep', positioning:['Multi-subject','School content','Exam prep'], portfolioQuestion:'ควรเน้น integrated journey มากกว่าจำนวนคอร์สหรือไม่?' },

  { subject:'English', level:'Upper Secondary / TCAS', brand:'OnDemand', type:'OnDemand', visibleOffer:'Essential ม.ปลาย / English TCAS Success / Upskill', positioning:['Foundation','School content','TCAS'], portfolioQuestion:'Foundation → TCAS progression ถูก discover ง่ายพอหรือไม่?' },
  { subject:'English', level:'Upper Secondary / TCAS', brand:'Enconcept', type:'Specialist', visibleOffer:'English high-school / TGAT / A-Level / TCAS', positioning:['English specialist','Exam prep','Language system'], portfolioQuestion:'Specialist brand signal ชัดกว่า OnDemand English proposition แค่ไหน?' },

  { subject:'Physics', level:'Lower Secondary', brand:'OnDemand', type:'OnDemand', visibleOffer:'ม.ต้น physics content / competition pathways', positioning:['Foundation','School content','Competition'], portfolioQuestion:'Need-state navigation ชัดพอหรือยัง?' },
  { subject:'Physics', level:'Lower Secondary', brand:'Applied Physics', type:'Specialist', visibleOffer:'AP01 ฟิสิกส์ ม.ต้น / AP02 ตะลุยโจทย์', positioning:['Physics specialist','Foundation','Practice'], portfolioQuestion:'Simple two-step journey เป็น benchmark ด้าน clarity ได้หรือไม่?' },
  { subject:'Physics', level:'Lower Secondary', brand:'WE BY THE BRAIN', type:'Multi-subject', visibleOffer:'ฟิสิกส์ ม.ต้น รวมทุกบท', positioning:['Multi-subject','School content'], portfolioQuestion:'ลูกค้าเลือก convenience vs specialist depth อย่างไร?' },
]

export const ecosystemCards = [
  {
    brand:'Ignite',
    capability:'International admission: IELTS · SAT · IGCSE + consult',
    bridge:'เชื่อมเมื่อ learner ต้องใช้ international-admission capability.',
    status:'PILOT OPPORTUNITY',
  },
  {
    brand:'TCASter',
    capability:'Admission information / navigation',
    bridge:'เชื่อม academic preparation กับ admission planning.',
    status:'PILOT OPPORTUNITY',
  },
  {
    brand:'Premier Prep',
    capability:'English learning from primary to upper secondary',
    bridge:'เชื่อมเมื่อ English เป็น gap หลักใน journey.',
    status:'PILOT OPPORTUNITY',
  },
]

export const decisionSeeds = [
  {
    id:'D-01',
    product:'Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level V.71',
    signal:'Base pack และ +Upskill อยู่ใน need state เดียวกัน',
    evidence:'Physics TCAS มีทั้ง base + bundled practice offer; synthetic overlap = HIGH',
    suggestion:'REPACKAGE',
  },
  {
    id:'D-02',
    product:'Pack Essential ปูพื้นฐานภาษาอังกฤษ ม.ปลาย',
    signal:'Foundation offer มี role ชัด แต่ volume ต่ำกว่า TCAS cluster',
    evidence:'Distinct foundation need + synthetic cohort shows lower immediate purchase',
    suggestion:'PROMOTE',
  },
  {
    id:'D-03',
    product:'Upper-secondary School Support journey',
    signal:'Ongoing-learning cohort ใหญ่ แต่ discovery แยกจาก TCAS ยังไม่ชัด',
    evidence:'120 synthetic learners in ongoing support vs 150 TCAS-focused in core cohort',
    suggestion:'REPACKAGE',
  },
] as const

export function percent(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}
