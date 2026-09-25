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
  'เตรียมอุดมศึกษา','สวนกุหลาบวิทยาลัย','สาธิตปทุมวัน','อัสสัมชัญ',
  'เซนต์โยเซฟคอนเวนต์','โรงเรียนสาธิต','โรงเรียนเอกชน กทม.','โรงเรียนรัฐบาล กทม.'
]

function pseudo(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildGroup(
  start: number,count: number,lifeStage: LifeStage,needState: NeedState,scoreMean: number,
  recommendRate: number,paidRate: number,retentionRate: number,secondSubjectRate: number,outcomeRate: number
): SyntheticLearner[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = start + index + 1
    const noise = (pseudo(seed) - 0.5) * 38
    return {
      id: 'SYN-' + String(seed).padStart(4, '0'),
      lifeStage, needState,
      school: schools[Math.floor(pseudo(seed + 7) * schools.length)],
      score: Math.max(10, Math.min(95, Math.round(scoreMean + noise))),
      recommended: pseudo(seed + 11) < recommendRate,
      paid14d: pseudo(seed + 19) < paidRate,
      nextTerm: pseudo(seed + 23) < retentionRate,
      secondSubject: pseudo(seed + 29) < secondSubjectRate,
      outcomeImproved: pseudo(seed + 31) < outcomeRate,
    }
  })
}

export const syntheticLearners: SyntheticLearner[] = [
  ...buildGroup(0,18,'Primary','Foundation',58,.94,.62,.58,.31,.72),
  ...buildGroup(18,16,'Primary','Grade improvement',62,.92,.58,.61,.36,.69),
  ...buildGroup(34,6,'Primary','Entrance',67,.96,.70,.49,.24,.74),
  ...buildGroup(40,20,'Lower Secondary','Foundation',46,.93,.55,.52,.30,.67),
  ...buildGroup(60,22,'Lower Secondary','Grade improvement',51,.91,.57,.54,.35,.70),
  ...buildGroup(82,18,'Lower Secondary','Entrance',59,.95,.68,.43,.27,.73),
  ...buildGroup(100,10,'Lower Secondary','Competition',71,.98,.76,.32,.20,.77),
  ...buildGroup(110,120,'Upper Secondary','Ongoing support',52,.90,.51,.46,.33,.65),
  ...buildGroup(230,150,'Upper Secondary','TCAS / University',63,.97,.73,.19,.23,.71),
  ...buildGroup(380,30,'Upper Secondary','Competition',76,.99,.79,.16,.18,.78),
  ...buildGroup(410,20,'Upper Secondary','Foundation',42,.92,.49,.44,.29,.64),
]

export const learnerDistribution = [
  { label:'Primary', detail:'Foundation / grade / entrance', count:40 },
  { label:'Lower Secondary', detail:'Foundation / grade / entrance / competition', count:70 },
  { label:'Upper Secondary', detail:'Ongoing learning', count:120 },
  { label:'Upper Secondary', detail:'TCAS-focused', count:200 },
] as const

export type OfferLayer = 'Core pack' | 'Topic module' | 'Upskill / Practice' | 'Exam bundle' | 'School-specific' | 'Entry / Trial'
export type IssueType = 'CLEAR_ROLE' | 'DISCOVERY_CONFUSION' | 'OVERLAP_REVIEW'

export type CatalogOffer = {
  id: string
  sku: string
  stage: LifeStage
  subject: string
  family: string
  layer: OfferLayer
  name: string
  price?: number
  needTags: NeedState[]
  decisionLogics: string[]
  issue: IssueType
  sourceUrl: string
}

const shop = 'https://shoponline.ondemand.in.th/'
const monthly = 'https://shoponline.ondemand.in.th/normpromotion_2/'
const mathCampaign = 'https://shoponline.ondemand.in.th/math-campaign'
const highSchool = 'https://shoponline.ondemand.in.th/high-school-recommend-course'
const highAll = 'https://shoponline.ondemand.in.th/highschoolcourses'
const tgat = 'https://shoponline.ondemand.in.th/tgat-tpat1-campaign'
const ijso = 'https://shoponline.ondemand.in.th/pack-ijso.html'

export const catalogOffers: CatalogOffer[] = [
  {id:'pri-01',sku:'4881',stage:'Primary',subject:'Science + Math',family:'Primary school content',layer:'Core pack',name:'Pack วิทย์ + คณิต ป.4 เทอม 1 (4015,4814)',price:4300,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['grade','subject','term'],issue:'CLEAR_ROLE',sourceUrl:shop},

  {id:'jr-m1',sku:'8186',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 1 คณิตศาสตร์ ม.ต้น (8101-8102)',price:3300,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-m2',sku:'8187',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 2 คณิตศาสตร์ ม.ต้น (8103-8104)',price:3600,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-m3',sku:'8188',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 3 คณิตศาสตร์ ม.ต้น (8105-8106)',price:4600,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-m4',sku:'8189',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 4 คณิตศาสตร์ ม.ต้น',price:3800,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-m5',sku:'8190',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 5 คณิตศาสตร์ ม.ต้น (8109-8110)',price:3800,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-m6',sku:'8191',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Core pack',name:'Pack 6 คณิตศาสตร์ ม.ต้น (8111-8112)',price:3800,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:mathCampaign},
  {id:'jr-mt1',sku:'8101',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Topic module',name:'จำนวนและตัวเลข',price:2400,needTags:['Foundation','Grade improvement'],decisionLogics:['topic','subject'],issue:'CLEAR_ROLE',sourceUrl:mathCampaign},
  {id:'jr-mt2',sku:'8102',stage:'Lower Secondary',subject:'Math',family:'Math M.1–M.3 content',layer:'Topic module',name:'เลขยกกำลัง และโจทย์ประยุกต์',price:1600,needTags:['Foundation','Grade improvement'],decisionLogics:['topic','subject'],issue:'CLEAR_ROLE',sourceUrl:mathCampaign},
  {id:'jr-ph1',sku:'1183',stage:'Lower Secondary',subject:'Physics',family:'Junior science content',layer:'Core pack',name:'Pack กลุ่มกลศาสตร์ 1, 2 และกลุ่มสมบัติสารและอุตุนิยมวิทยา',price:4200,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['subject','content-group'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'jr-ch1',sku:'3186',stage:'Lower Secondary',subject:'Chemistry',family:'Junior science content',layer:'Core pack',name:'Pack พื้นฐาน รวมครบ เคมี ม.ต้น (3121,3122,3123)',price:4000,needTags:['Foundation','Grade improvement','Competition'],decisionLogics:['subject','readiness'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'jr-bi1',sku:'2183',stage:'Lower Secondary',subject:'Biology',family:'Junior science content',layer:'Core pack',name:'Pack 1 ชีววิทยา ม.ต้น : กลุ่มพื้นฐานชีววิทยา อาหาร',price:4200,needTags:['Foundation','Grade improvement'],decisionLogics:['pack-number','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'jr-bi2',sku:'2184',stage:'Lower Secondary',subject:'Biology',family:'Junior science content',layer:'Core pack',name:'Pack 2 ชีววิทยา ม.ต้น : กลุ่มกลไกมนุษย์ พันธุศาสตร์',price:4200,needTags:['Foundation','Grade improvement'],decisionLogics:['pack-number','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'jr-comp1',sku:'9288',stage:'Lower Secondary',subject:'Math + Physics',family:'M.4 competitive school entrance',layer:'Exam bundle',name:'Pack ติวเข้มเข้าเตรียมอุดมฯ คณิต & ฟิสิกส์',price:9300,needTags:['Entrance','Competition'],decisionLogics:['exam-goal','school','bundle-size'],issue:'CLEAR_ROLE',sourceUrl:shop},
  {id:'jr-comp2',sku:'9289',stage:'Lower Secondary',subject:'Biology + Chemistry',family:'M.4 competitive school entrance',layer:'Exam bundle',name:'Pack ติวเข้มเข้าเตรียมอุดมฯ มหิดลฯ กำเนิดวิทย์ และโรงเรียนแข่งขันสูง ชีวะ & เคมี',price:8200,needTags:['Entrance','Competition'],decisionLogics:['exam-goal','school','bundle-size'],issue:'CLEAR_ROLE',sourceUrl:shop},
  {id:'jr-up1',sku:'9291',stage:'Lower Secondary',subject:'Multi-subject',family:'M.4 competitive school entrance',layer:'Upskill / Practice',name:'Pack Upskill เตรียมอุดมฯ (คณิต,ฟิสิกส์,เคมี,ชีวะ)',price:12000,needTags:['Entrance','Competition'],decisionLogics:['exam-goal','practice','bundle-size'],issue:'CLEAR_ROLE',sourceUrl:shop},
  {id:'jr-olym1',sku:'1189',stage:'Lower Secondary',subject:'Physics',family:'Olympiad / IJSO',layer:'Exam bundle',name:'Pack สุดคุ้ม ม.ต้น ติวเข้มฟิสิกส์สอบเข้า ม.4 เตรียมอุดมฯ + สอวน. + IJSO',price:10400,needTags:['Entrance','Competition'],decisionLogics:['exam-goal','school','competition'],issue:'DISCOVERY_CONFUSION',sourceUrl:ijso},

  {id:'sr-m1',sku:'8281',stage:'Upper Secondary',subject:'Math',family:'High-school Math content',layer:'Core pack',name:'Pack 1 คณิตศาสตร์ ม.ปลาย (8201-8204)',price:4300,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-m2',sku:'8282',stage:'Upper Secondary',subject:'Math',family:'High-school Math content',layer:'Core pack',name:'Pack 2 คณิตศาสตร์ ม.ปลาย (8205-8207)',price:4900,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-m3',sku:'8283',stage:'Upper Secondary',subject:'Math',family:'High-school Math content',layer:'Core pack',name:'Pack 3 คณิตศาสตร์ ม.ปลาย (8209-8211)',price:5500,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-m4',sku:'8284',stage:'Upper Secondary',subject:'Math',family:'High-school Math content',layer:'Core pack',name:'Pack 4 คณิตศาสตร์ ม.ปลาย (8212-8214)',price:4900,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-m5',sku:'8285',stage:'Upper Secondary',subject:'Math',family:'High-school Math content',layer:'Core pack',name:'Pack 5 คณิตศาสตร์ ม.ปลาย (8215-8216)',price:4900,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['pack-number','subject'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-mtu1',sku:'8286',stage:'Upper Secondary',subject:'Math',family:'School-specific Math',layer:'School-specific',name:'PACK คณิตศาสตร์ ม.4 เทอม 1 รร. เตรียมอุดมฯ (8201,8202,8203,8207)',price:4500,needTags:['Grade improvement','Ongoing support'],decisionLogics:['school','grade','term'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},
  {id:'sr-mtu2',sku:'8287',stage:'Upper Secondary',subject:'Math',family:'School-specific Math',layer:'School-specific',name:'PACK คณิตศาสตร์ ม.4 เทอม 2 รร. เตรียมอุดมฯ (8205,8206)',price:4200,needTags:['Grade improvement','Ongoing support'],decisionLogics:['school','grade','term'],issue:'DISCOVERY_CONFUSION',sourceUrl:highSchool},

  {id:'sr-ph1',sku:'0281',stage:'Upper Secondary',subject:'Physics',family:'High-school Physics content',layer:'Core pack',name:'Pack กลศาสตร์ 1 (0201-0204)',price:4500,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-ph2',sku:'0282',stage:'Upper Secondary',subject:'Physics',family:'High-school Physics content',layer:'Core pack',name:'Pack กลศาสตร์ 2 (0205-0208)',price:4600,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-ph3',sku:'0284',stage:'Upper Secondary',subject:'Physics',family:'High-school Physics content',layer:'Core pack',name:'Pack การเคลื่อนที่แบบฮาร์มอนิกและกลุ่มคลื่น (0209,0211,0212,0213)',price:5500,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-ph4',sku:'0285',stage:'Upper Secondary',subject:'Physics',family:'High-school Physics content',layer:'Core pack',name:'Pack สมบัติสาร (0214-0215)',price:3200,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-ph5',sku:'0286',stage:'Upper Secondary',subject:'Physics',family:'High-school Physics content',layer:'Core pack',name:'Pack ไฟฟ้า (0216-0219)',price:4800,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},

  {id:'sr-ch1',sku:'3291',stage:'Upper Secondary',subject:'Chemistry',family:'High-school Chemistry content',layer:'Core pack',name:'Pack กลุ่มอะตอม ตารางธาตุ และพันธะเคมี',price:4300,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highSchool},
  {id:'sr-ch2',sku:'3293',stage:'Upper Secondary',subject:'Chemistry',family:'High-school Chemistry content',layer:'Core pack',name:'Pack กลุ่มแก๊ส อัตรา และสมดุลเคมี',price:3800,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highSchool},
  {id:'sr-ch3',sku:'3294',stage:'Upper Secondary',subject:'Chemistry',family:'High-school Chemistry content',layer:'Core pack',name:'PACK กลุ่มกรด-เบสและเคมีไฟฟ้า',price:4800,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-ch4',sku:'3295',stage:'Upper Secondary',subject:'Chemistry',family:'High-school Chemistry content',layer:'Core pack',name:'Pack กลุ่มเคมีอินทรีย์และพอลิเมอร์',price:4600,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highSchool},

  {id:'sr-bi1',sku:'2291',stage:'Upper Secondary',subject:'Biology',family:'High-school Biology content',layer:'Core pack',name:'Pack กลุ่มพื้นฐานชีววิทยา',price:4500,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-bi2',sku:'2292',stage:'Upper Secondary',subject:'Biology',family:'High-school Biology content',layer:'Core pack',name:'Pack กลุ่มกลไกในร่างกายมนุษย์ 1',price:4600,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-bi3',sku:'2293',stage:'Upper Secondary',subject:'Biology',family:'High-school Biology content',layer:'Core pack',name:'Pack กลุ่มกลไกในร่างกายมนุษย์ 2',price:4300,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-bi4',sku:'2294',stage:'Upper Secondary',subject:'Biology',family:'High-school Biology content',layer:'Core pack',name:'Pack กลุ่มพืช',price:3800,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},
  {id:'sr-bi5',sku:'2296',stage:'Upper Secondary',subject:'Biology',family:'High-school Biology content',layer:'Core pack',name:'Pack กลุ่มความหลากหลายทางชีวภาพ และระบบนิเวศ',price:4200,needTags:['Grade improvement','Ongoing support'],decisionLogics:['content-group','subject'],issue:'CLEAR_ROLE',sourceUrl:highAll},

  {id:'sr-en1',sku:'P3005',stage:'Upper Secondary',subject:'English',family:'High-school English foundation',layer:'Core pack',name:'Pack Essential ปูพื้นฐานภาษาอังกฤษ ม.ปลาย (P2011,P2012)',price:8800,needTags:['Foundation','Grade improvement','Ongoing support'],decisionLogics:['readiness','subject'],issue:'CLEAR_ROLE',sourceUrl:highSchool},

  {id:'tcas-math-base',sku:'8399',stage:'Upper Secondary',subject:'Math',family:'TCAS subject core',layer:'Exam bundle',name:"PACK MATH ADMISSIONS TCAS (เลข สำหรับ DEK'70)",price:9500,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject'],issue:'OVERLAP_REVIEW',sourceUrl:shop},
  {id:'tcas-ph-base',sku:'1399',stage:'Upper Secondary',subject:'Physics',family:'TCAS subject core',layer:'Exam bundle',name:"Pack V-Series Physics TCAS (ฟิสิกส์ สำหรับ DEK'70)",price:9500,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject'],issue:'OVERLAP_REVIEW',sourceUrl:shop},
  {id:'tcas-ch-base',sku:'3399',stage:'Upper Secondary',subject:'Chemistry',family:'TCAS subject core',layer:'Exam bundle',name:"Pack เคมี TCAS (เคมี สำหรับ DEK'70)",price:9500,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject'],issue:'OVERLAP_REVIEW',sourceUrl:shop},
  {id:'tcas-bi-base',sku:'2399',stage:'Upper Secondary',subject:'Biology',family:'TCAS subject core',layer:'Exam bundle',name:"Pack Biology TCAS (ชีววิทยา สำหรับ DEK'70)",price:9500,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject'],issue:'OVERLAP_REVIEW',sourceUrl:shop},
  {id:'tcas-en-base',sku:'P3009-V06',stage:'Upper Secondary',subject:'English',family:'TCAS subject core',layer:'Exam bundle',name:"English TCAS Success (อังกฤษ สำหรับ DEK'70)",price:8500,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject'],issue:'CLEAR_ROLE',sourceUrl:shop},

  {id:'tcas-math70',sku:'9385-S08',stage:'Upper Secondary',subject:'Math',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack TCAS + UpSkill คณิต A-Level Dek 70',price:11900,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject','readiness'],issue:'OVERLAP_REVIEW',sourceUrl:monthly},
  {id:'tcas-ph70',sku:'9384-S08',stage:'Upper Secondary',subject:'Physics',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level (Dek70)',price:11900,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject','readiness'],issue:'OVERLAP_REVIEW',sourceUrl:monthly},
  {id:'tcas-ch70',sku:'9383-S08',stage:'Upper Secondary',subject:'Chemistry',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack เคมี TCAS + Upskill เคมี A-Level (Dek 70)',price:11900,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject','readiness'],issue:'OVERLAP_REVIEW',sourceUrl:monthly},
  {id:'tcas-bi70',sku:'9382-S07',stage:'Upper Secondary',subject:'Biology',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack Biology TCAS + UpSkill ชีววิทยา A-Level (Dek 70)',price:11900,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject','readiness'],issue:'OVERLAP_REVIEW',sourceUrl:monthly},
  {id:'tcas-en70',sku:'P3013-S06',stage:'Upper Secondary',subject:'English',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack English TCAS + Upskill (P3009,P2033) Dek 70',price:11000,needTags:['TCAS / University'],decisionLogics:['cohort','exam','subject','readiness'],issue:'OVERLAP_REVIEW',sourceUrl:monthly},

  {id:'tcas-math71',sku:'9685',stage:'Upper Secondary',subject:'Math',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack Math Admission TCAS + UpSkill คณิต A-Level V.71',price:11900,needTags:['TCAS / University'],decisionLogics:['version','exam','subject','readiness'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'tcas-ph71',sku:'9684',stage:'Upper Secondary',subject:'Physics',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level V.71',price:11900,needTags:['TCAS / University'],decisionLogics:['version','exam','subject','readiness'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'tcas-ch71',sku:'9683',stage:'Upper Secondary',subject:'Chemistry',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack เคมี TCAS + UpSkill เคมี A-Level V.71',price:11900,needTags:['TCAS / University'],decisionLogics:['version','exam','subject','readiness'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'tcas-bi71',sku:'9688',stage:'Upper Secondary',subject:'Biology',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack Biology TCAS + UpSkill ชีววิทยา A-Level V.71',price:11900,needTags:['TCAS / University'],decisionLogics:['version','exam','subject','readiness'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'tcas-en71',sku:'P6184',stage:'Upper Secondary',subject:'English',family:'TCAS + Upskill',layer:'Exam bundle',name:'Pack English TCAS + Upskill V.71',price:11000,needTags:['TCAS / University'],decisionLogics:['version','exam','subject','readiness'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},

  {id:'up-ph',sku:'1316',stage:'Upper Secondary',subject:'Physics',family:'TCAS practice',layer:'Upskill / Practice',name:'UpSkill ฟิสิกส์ A-Level',price:4000,needTags:['TCAS / University'],decisionLogics:['practice','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'up-ma',sku:'8309',stage:'Upper Secondary',subject:'Math',family:'TCAS practice',layer:'Upskill / Practice',name:'Upskill คณิตศาสตร์ประยุกต์ 1 A-Level (พื้นฐาน+เพิ่มเติม)',price:4000,needTags:['TCAS / University'],decisionLogics:['practice','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'up-ch',sku:'3307',stage:'Upper Secondary',subject:'Chemistry',family:'TCAS practice',layer:'Upskill / Practice',name:'Upskill เคมี A-Level',price:4000,needTags:['TCAS / University'],decisionLogics:['practice','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'up-bi',sku:'2307',stage:'Upper Secondary',subject:'Biology',family:'TCAS practice',layer:'Upskill / Practice',name:'UpSkill ชีววิทยา A-Level',price:4000,needTags:['TCAS / University'],decisionLogics:['practice','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'up-en',sku:'P2033',stage:'Upper Secondary',subject:'English',family:'TCAS practice',layer:'Upskill / Practice',name:'Upskill A-Level English',price:4900,needTags:['TCAS / University'],decisionLogics:['practice','subject'],issue:'CLEAR_ROLE',sourceUrl:monthly},

  {id:'med-3a',sku:'9301',stage:'Upper Secondary',subject:'Multi-subject',family:'Medical pathway bundles',layer:'Exam bundle',name:'Pack พิชิต TCAS 3 วิชาขายดี (ฟิสิกส์-คณิต-ชีวะ) + เปิดใจ TPAT1',price:24400,needTags:['TCAS / University'],decisionLogics:['faculty','round','bundle-size','exam'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'med-3b',sku:'9302-S07L',stage:'Upper Secondary',subject:'Multi-subject',family:'Medical pathway bundles',layer:'Exam bundle',name:'Pack พิชิต TCAS 3 วิชา เตรียมพร้อมรอบ 1 ถึง 3',price:38200,needTags:['TCAS / University'],decisionLogics:['faculty','round','bundle-size','exam'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'med-5',sku:'9366',stage:'Upper Secondary',subject:'Multi-subject',family:'Medical pathway bundles',layer:'Exam bundle',name:'PACK 5 วิชา เตรียมหมอรอบ 3 + Upskill 5 วิชา V.71 + เปิดใจ TPAT1',price:50000,needTags:['TCAS / University'],decisionLogics:['faculty','round','bundle-size','version','exam'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'med-7',sku:'9365-S03L',stage:'Upper Secondary',subject:'Multi-subject',family:'Medical pathway bundles',layer:'Exam bundle',name:'PACK 7 วิชา เตรียมหมอรอบ 3',price:62000,needTags:['TCAS / University'],decisionLogics:['faculty','round','bundle-size','exam'],issue:'DISCOVERY_CONFUSION',sourceUrl:monthly},
  {id:'tcas-4up',sku:'9381',stage:'Upper Secondary',subject:'Multi-subject',family:'TCAS practice bundles',layer:'Upskill / Practice',name:'Pack UpSkill TCAS 4 วิชา (ฟิสิกส์,เคมี,ชีวะ,คณิต)',price:11900,needTags:['TCAS / University'],decisionLogics:['practice','bundle-size','exam'],issue:'CLEAR_ROLE',sourceUrl:monthly},
  {id:'tcas-5up',sku:'9395',stage:'Upper Secondary',subject:'Multi-subject',family:'TCAS practice bundles',layer:'Upskill / Practice',name:'Pack UpSkill TCAS 5 วิชา (คณิต ฟิสิกส์ เคมี ชีวะ อังกฤษ)',price:15900,needTags:['TCAS / University'],decisionLogics:['practice','bundle-size','exam'],issue:'CLEAR_ROLE',sourceUrl:monthly},
]

export const needStates: NeedState[] = ['Foundation','Grade improvement','Entrance','Competition','TCAS / University','Ongoing support']

export const customerVoiceRecords = [
  {stage:'Lower Secondary',subject:'Math',pack:'Pack 1 คณิตศาสตร์ ม.ต้น (8101-8102)',sample:32,takeaway:'คำถามหลักคือ “ควรเริ่ม Pack ไหน” มากกว่า “OnDemand มีคอร์สคณิตไหม”',implication:'ใช้ baseline / topic gap route ไป Pack 1–6 แทนการให้ลูกค้า decode pack number เอง',themes:[['จุดเริ่มต้น',12,'ไม่แน่ใจว่าควรเริ่มจาก pack ไหน'],['พื้นฐาน',9,'ถามว่าต้องมีพื้นฐานแค่ไหน'],['โจทย์',7,'สนใจโจทย์เสริมหลังเรียน concept'],['ราคา / bundle',4,'เปรียบเทียบซื้อเดี่ยวกับซื้อ pack']]},
  {stage:'Upper Secondary',subject:'Math',pack:'Pack 1 คณิตศาสตร์ ม.ปลาย (8201-8204)',sample:44,takeaway:'School-support และ admission-prep อยู่ในวิชาเดียวกัน แต่ customer job-to-be-done ต่างกัน',implication:'หน้าเลือกคอร์สควรให้เลือก “เพิ่มเกรด / เรียนตามโรงเรียน” หรือ “เตรียม A-Level” ก่อนเลือก pack',themes:[['เพิ่มเกรด',13,'ต้องการ alignment กับเนื้อหาโรงเรียน'],['พื้นฐาน',12,'ถามความเหมาะกับคนพื้นฐานต่างระดับ'],['โจทย์',11,'ต้องการ practice หลังเข้า concept'],['ราคา / value',8,'เทียบ pack กับ specialist']]},
  {stage:'Upper Secondary',subject:'Physics',pack:"Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level (Dek70)",sample:38,takeaway:'คำว่า DEK70, TCAS, Upskill และ V.71 อยู่ใกล้กันใน storefront จึงเสี่ยงให้ลูกค้าไม่รู้ว่า variant ไหนเหมาะกับตัวเอง',implication:'เปลี่ยนจาก naming-first เป็น readiness-first: Core only / Core + Practice / Practice only',themes:[['ชื่อรุ่น / version',13,'สับสน DEK70 vs V.71'],['ความพร้อม',10,'ไม่แน่ใจว่าควรซื้อ core หรือ upskill'],['โจทย์ / practice',9,'ต้องการรู้ว่าต่างจาก core ตรงไหน'],['ราคา',6,'ราคาใกล้กันทำให้ต้องเทียบรายละเอียด']]},
  {stage:'Upper Secondary',subject:'Biology',pack:"Pack Biology TCAS (ชีววิทยา สำหรับ DEK'70)",sample:31,takeaway:'การเลือกชีวะ driven by coverage + exam alignment + teacher fit มากกว่าชื่อแพ็กอย่างเดียว',implication:'สื่อ prerequisite, coverage และ role เทียบ TCAS core vs UpSkill ให้ชัด',themes:[['ตรงข้อสอบ',12,'สนใจ A-Level / TCAS alignment'],['coverage',9,'ต้องการรู้ว่าเก็บครบแค่ไหน'],['teacher style',6,'รูปแบบอธิบายมีผล'],['pace',4,'บางคนต้องทบทวนก่อน intensive']]},
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
  {subject:'Math',level:'Upper Secondary / TCAS',brand:'OnDemand',type:'OnDemand',visibleOffer:'Pack 1–5 Math content / MATH ADMISSIONS TCAS / +Upskill',positioning:['School content','TCAS','Pack breadth'],portfolioQuestion:'School-support vs TCAS vs practice ถูก route ชัดพอหรือยัง?'},
  {subject:'Math',level:'Upper Secondary / TCAS',brand:'SmartMathPro (พี่ปั้น)',type:'Specialist',visibleOffer:'Math specialist: high-school / A-Level pathways',positioning:['Math specialist','Foundation','Exam prep'],portfolioQuestion:'Specialist positioning ทำให้ entry point เข้าใจง่ายกว่าหรือไม่?'},
  {subject:'Math',level:'Upper Secondary / TCAS',brand:'WE BY THE BRAIN',type:'Multi-subject',visibleOffer:'Math high-school / A-Level + multi-subject exam prep',positioning:['Multi-subject','School content','Exam prep'],portfolioQuestion:'เทียบ breadth, package clarity และ cross-subject journey'},
  {subject:'Math',level:'Upper Secondary / TCAS',brand:'Applied Math',type:'Specialist',visibleOffer:'Math TCAS / ตะลุยโจทย์ / school packs',positioning:['Math','TCAS','Practice'],portfolioQuestion:'Practice proposition ซ้อนกับ OnDemand UpSkill ตรงไหน?'},

  {subject:'Physics',level:'Upper Secondary / TCAS',brand:'OnDemand',type:'OnDemand',visibleOffer:'กลศาสตร์ / เนื้อหา / V-Series TCAS / +Upskill',positioning:['Foundation','School content','TCAS','Upskill'],portfolioQuestion:'Core → TCAS → practice ถูกมองเป็น journey เดียวหรือเป็น catalog หลายก้อน?'},
  {subject:'Physics',level:'Upper Secondary / TCAS',brand:'Applied Physics',type:'Specialist',visibleOffer:'Pre-Entrance / Entrance TCAS / ตะลุยโจทย์ / PACK SUPER',positioning:['Physics specialist','Foundation','TCAS','Practice'],portfolioQuestion:'Competitor journey แบ่ง Foundation → Entrance → Practice ชัดกว่าไหม?'},
  {subject:'Physics',level:'Upper Secondary / TCAS',brand:'WE BY THE BRAIN',type:'Multi-subject',visibleOffer:'Physics school content + exam preparation',positioning:['Multi-subject','School content','Exam prep'],portfolioQuestion:'OnDemand ควรชนะด้วย integrated journey หรือ breadth?'},

  {subject:'Biology',level:'Upper Secondary / TCAS',brand:'OnDemand',type:'OnDemand',visibleOffer:'Biology content groups / Biology TCAS / UpSkill',positioning:['Content groups','TCAS','Upskill'],portfolioQuestion:'Coverage และ prerequisite ถูกสื่อชัดพอเมื่อเทียบ specialist หรือไม่?'},
  {subject:'Biology',level:'Upper Secondary / TCAS',brand:'Bio BEAM',type:'Specialist',visibleOffer:'ชีวะ ม.4–6 / TCAS / ตะลุยโจทย์',positioning:['Biology specialist','TCAS','Practice'],portfolioQuestion:'Specialist authority มีผลต่อ choice ใน TCAS มากแค่ไหน?'},
  {subject:'Biology',level:'Upper Secondary / TCAS',brand:'WE BY THE BRAIN',type:'Multi-subject',visibleOffer:'Biology school content + entrance prep',positioning:['Multi-subject','School content','Exam prep'],portfolioQuestion:'Cross-subject convenience เป็น driver หรือไม่?'},

  {subject:'Chemistry',level:'Upper Secondary / TCAS',brand:'OnDemand',type:'OnDemand',visibleOffer:'Chem content groups / Chem TCAS / +UpSkill',positioning:['School content','TCAS','Upskill'],portfolioQuestion:'Core + UpSkill ควร bundle หรือ route ตาม readiness?'},
  {subject:'Chemistry',level:'Upper Secondary / TCAS',brand:'เคมี อ.อุ๊',type:'Specialist',visibleOffer:'Pre-Entrance / Entrance / ตะลุยโจทย์',positioning:['Chemistry specialist','Foundation','Entrance','Practice'],portfolioQuestion:'ผู้เรียนอ่าน journey ของ specialist ได้ง่ายกว่าแพ็กหลายชั้นหรือไม่?'},
  {subject:'Chemistry',level:'Upper Secondary / TCAS',brand:'WE BY THE BRAIN',type:'Multi-subject',visibleOffer:'Chemistry school content + exam prep',positioning:['Multi-subject','School content','Exam prep'],portfolioQuestion:'ควรเน้น integrated journey มากกว่าจำนวนคอร์สหรือไม่?'},

  {subject:'English',level:'Upper Secondary / TCAS',brand:'OnDemand',type:'OnDemand',visibleOffer:'Essential ม.ปลาย / English TCAS / UpSkill',positioning:['Foundation','School content','TCAS'],portfolioQuestion:'Foundation → TCAS progression discover ง่ายพอไหม?'},
  {subject:'English',level:'Upper Secondary / TCAS',brand:'Enconcept',type:'Specialist',visibleOffer:'English high-school / TGAT / A-Level / TCAS',positioning:['English specialist','Exam prep','Language system'],portfolioQuestion:'Specialist brand signal ชัดกว่า OnDemand English proposition แค่ไหน?'},

  {subject:'Physics',level:'Lower Secondary',brand:'OnDemand',type:'OnDemand',visibleOffer:'Junior content / school entrance / สอวน. / Upskill',positioning:['Foundation','School content','Competition'],portfolioQuestion:'Need-state navigation ชัดพอหรือยัง?'},
  {subject:'Physics',level:'Lower Secondary',brand:'Applied Physics',type:'Specialist',visibleOffer:'ฟิสิกส์ ม.ต้น / ตะลุยโจทย์',positioning:['Physics specialist','Foundation','Practice'],portfolioQuestion:'Simple two-step journey เป็น benchmark ด้าน clarity ได้หรือไม่?'},
  {subject:'Physics',level:'Lower Secondary',brand:'WE BY THE BRAIN',type:'Multi-subject',visibleOffer:'ฟิสิกส์ ม.ต้น รวมทุกบท',positioning:['Multi-subject','School content'],portfolioQuestion:'ลูกค้าเลือก convenience vs specialist depth อย่างไร?'},
]

export type EcosystemRoute = {
  id: string
  trigger: string
  learner: string
  ownedPath: string
  bridges: {brand:string;when:string;role:string}[]
  buildOnlyIf: string
}

export const ecosystemRoutes: EcosystemRoute[] = [
  {id:'route-intl',trigger:'International / bilingual background + Thai university goal',learner:'เด็ก international school อยากเข้ามหาวิทยาลัยไทย',ownedPath:'OnDemand → Thai Math / Science / A-Level readiness',bridges:[
    {brand:'Ignite',when:'ต้องใช้ IELTS / SAT / IGCSE / international-admission consult',role:'International admission capability'},
    {brand:'TCASter',when:'ต้องการข้อมูลรอบ / เกณฑ์ / admission navigation',role:'Admission planning'},
  ],buildOnlyIf:'Thai academic terminology / exam-format bridge ยังไม่มี owner ใน ecosystem'},
  {id:'route-eng',trigger:'English gap is the primary blocker',learner:'เด็ก OnDemand ที่ academic วิชาอื่นพร้อม แต่ English ยังเป็น gap',ownedPath:'OnDemand → keep subject-learning path',bridges:[
    {brand:'Premier Prep',when:'ต้องการ English learning path ต่อเนื่องตามช่วงชั้น',role:'English learning support'},
  ],buildOnlyIf:'Need เป็น exam-specific English ที่ product ปัจจุบันตอบไม่ได้'},
  {id:'route-admission',trigger:'Academic readiness is okay but admission path is unclear',learner:'เด็ก TCAS ที่คะแนนพร้อม แต่เลือกคณะ / รอบ / requirement ไม่ชัด',ownedPath:'OnDemand → academic preparation continues',bridges:[
    {brand:'TCASter',when:'ต้องเทียบเกณฑ์ รอบ และ admission choices',role:'Admission navigation'},
  ],buildOnlyIf:'มี advisory gap ที่ยังไม่มี capability ในเครือ'},
]

export const decisionQueue = [
  {id:'Q01',classification:'DISCOVERY CONFUSION',title:'DEK70 vs V.71 อยู่ใน storefront ใกล้กัน',evidence:'TCAS + Upskill subject packs มีทั้งชื่อ cohort DEK70 และ version V.71 พร้อมราคาใกล้เคียง/เท่ากัน',recommendation:'REPOSITION / ROUTE BETTER',why:'สอง SKU อาจไม่ได้ซ้ำจริง แต่ customer ต้อง decode cohort vs content version เอง'},
  {id:'Q02',classification:'OVERLAP REVIEW',title:'TCAS core vs TCAS + Upskill',evidence:'ทุกวิชาหลักมี base TCAS, +Upskill bundle และ Upskill standalone',recommendation:'TEST ATTACH / SUBSTITUTE',why:'ดู attach rate, substitution และ outcome ก่อนตัดสิน MERGE'},
  {id:'Q03',classification:'DISCOVERY CONFUSION',title:'Math ม.ต้น Pack 1–6 + topic modules',evidence:'โครงสินค้ามีเหตุผลเชิงวิชาการ แต่ชื่อ pack number ไม่บอก learner ว่าควรเริ่มตรงไหน',recommendation:'ROUTE BETTER',why:'รักษา modularity หลังบ้าน แต่ให้ Compass เลือก entry point จาก gap'},
  {id:'Q04',classification:'PORTFOLIO ARCHITECTURE',title:'Medical pathway 1 / 3 / 5 / 7 subjects + rounds',evidence:'ลูกค้าต้องเลือกทั้งจำนวนวิชา รอบสอบ และ readiness พร้อมกัน',recommendation:'SIMPLIFY FRONT-END PATH',why:'ไม่จำเป็นต้องลด SKU ทุกตัว แต่ควรลด decision load ที่หน้าบ้าน'},
  {id:'Q05',classification:'ECOSYSTEM ROUTE',title:'International → Thai university bridge',evidence:'Need เดียวอาจใช้ OnDemand academic + Ignite international capability + TCASter admission',recommendation:'CROSS-BU PILOT',why:'Orchestrate capability ก่อนสร้าง all-in-one SKU ใหม่'},
] as const

export function percent(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}
