export type Segment =
  | 'ประถม'
  | 'ม.ต้น'
  | 'ม.ปลาย / TCAS'
  | 'International / Bilingual / GED'

export type StudentProfile = {
  segment: Segment
  cohort: string
  goal: string
  subjects: string[]
  level: string
  hours: string
  budget: string
  mode: string
}

export const defaultProfile: StudentProfile = {
  segment: 'ม.ปลาย / TCAS',
  cohort: 'Dek70',
  goal: 'วิศวะ',
  subjects: ['Physics'],
  level: 'Developing',
  hours: '5–7 ชั่วโมง',
  budget: '3,000–8,000',
  mode: 'Hybrid',
}

export const onboarding = [
  {
    key: 'segment',
    title: 'ตอนนี้อยู่ในช่วงไหน?',
    options: ['ประถม', 'ม.ต้น', 'ม.ปลาย / TCAS', 'International / Bilingual / GED'],
  },
  { key: 'cohort', title: 'คุณเป็นรุ่นไหน?', options: ['P5–P6', 'M1–M3', 'Dek70', 'Dek71', 'International / GED'] },
  { key: 'goal', title: 'ตอนนี้อยากไปทางไหนมากที่สุด?', options: ['พื้นฐานแน่นขึ้น', 'สอบเข้า', 'แพทย์', 'วิศวะ', 'บริหาร', 'สายศิลป์', 'International pathway', 'ยังไม่แน่ใจ'] },
  { key: 'subjects', title: 'วิชาไหนที่กังวล?', options: ['Math', 'Science', 'Physics', 'Chemistry', 'Biology', 'English'], multi: true },
  { key: 'level', title: 'ระดับปัจจุบันของคุณ?', options: ['Beginning', 'Developing', 'Confident'] },
  { key: 'hours', title: 'มีเวลาเรียนต่อสัปดาห์ประมาณเท่าไร?', options: ['2–4 ชั่วโมง', '5–7 ชั่วโมง', '8+ ชั่วโมง'] },
  { key: 'budget', title: 'งบประมาณที่วางไว้?', options: ['ต่ำกว่า 3,000', '3,000–8,000', '8,000+'] },
  { key: 'mode', title: 'รูปแบบไหนสะดวกที่สุด?', options: ['Online', 'Branch', 'Hybrid'] },
] as const

export const diagnosticQuestions = [
  {
    skill: 'Mechanics',
    question: 'แรงสองแรงขนาดเท่ากันทำมุม 180° ต่อกัน แรงลัพธ์เป็นเท่าไร?',
    answers: ['0', 'เท่ากับแรงหนึ่งแรง', 'สองเท่าของแรงหนึ่งแรง', 'ระบุไม่ได้'],
    correct: 0,
  },
  {
    skill: 'Mechanics',
    question: 'ถ้าวัตถุเคลื่อนที่ด้วยความเร็วคงที่บนเส้นตรง ข้อใดถูกต้อง?',
    answers: ['แรงลัพธ์เป็นศูนย์', 'ไม่มีแรงใดกระทำ', 'ความเร่งเพิ่มขึ้น', 'พลังงานจลน์เป็นศูนย์'],
    correct: 0,
  },
  {
    skill: 'Electricity',
    question: 'ถ้าความต้านทานคงที่และแรงดันเพิ่มเป็น 2 เท่า กระแสจะเป็นอย่างไร?',
    answers: ['ลดครึ่งหนึ่ง', 'เท่าเดิม', 'เพิ่ม 2 เท่า', 'เพิ่ม 4 เท่า'],
    correct: 2,
  },
  {
    skill: 'Electricity',
    question: 'ตัวต้านทานต่ออนุกรมกัน กระแสไฟฟ้าเป็นอย่างไร?',
    answers: ['เท่ากันทุกตัว', 'แบ่งตามค่า R', 'เป็นศูนย์', 'เพิ่มขึ้นเรื่อย ๆ'],
    correct: 0,
  },
  {
    skill: 'Waves',
    question: 'เมื่อความถี่เพิ่ม แต่ความเร็วคลื่นคงที่ ความยาวคลื่นจะ...',
    answers: ['เพิ่ม', 'ลด', 'เท่าเดิม', 'เป็นศูนย์'],
    correct: 1,
  },
  {
    skill: 'Problem solving',
    question: 'ข้อสอบ 60 นาที 30 ข้อ กลยุทธ์แรกที่เหมาะที่สุดคือ?',
    answers: ['ใช้เวลาเท่ากันเป๊ะทุกข้อ', 'เริ่มข้อยากสุด', 'แบ่งเวลาและ flag ข้อที่ติด', 'ทำแบบสุ่ม'],
    correct: 2,
  },
]

export const weeklyPulse = [
  ['Active learners', '18.4K', '+6.2% WoW'],
  ['New enrollments', '2,486', '+9.1% WoW'],
  ['Diagnostic completion', '81%', '+3.4 pp'],
  ['Repeat purchase', '27%', '+1.8 pp'],
  ['Branch-assisted conversion', '38%', '+4.0 pp'],
  ['Course completion', '64%', '-0.7 pp'],
]

export const segmentMix = [
  ['ประถม', 18],
  ['ม.ต้น', 24],
  ['ม.ปลาย / TCAS', 46],
  ['International / Bilingual / GED', 12],
] as const

export const topPacks = [
  { segment: 'ประถม', name: 'Math Foundation P5–P6', enrollments: 482, conversion: 44, completion: 76, repeat: 31, margin: 58, action: 'GROW' },
  { segment: 'ประถม', name: 'Science Explorer', enrollments: 328, conversion: 39, completion: 72, repeat: 28, margin: 54, action: 'PROMOTE' },
  { segment: 'ม.ต้น', name: 'M2 Math Core', enrollments: 615, conversion: 48, completion: 69, repeat: 34, margin: 61, action: 'GROW' },
  { segment: 'ม.ต้น', name: 'M3 Science Exam Pack', enrollments: 492, conversion: 43, completion: 66, repeat: 29, margin: 57, action: 'REPACKAGE' },
  { segment: 'ม.ปลาย / TCAS', name: 'Physics Foundation', enrollments: 932, conversion: 51, completion: 73, repeat: 37, margin: 63, action: 'GROW' },
  { segment: 'ม.ปลาย / TCAS', name: 'Mechanics Intensive', enrollments: 514, conversion: 42, completion: 68, repeat: 26, margin: 49, action: 'MERGE' },
  { segment: 'ม.ปลาย / TCAS', name: 'Legacy Full Physics', enrollments: 183, conversion: 18, completion: 41, repeat: 11, margin: 36, action: 'HARVEST' },
  { segment: 'International / Bilingual / GED', name: 'Thai Academic Bridge', enrollments: 246, conversion: 36, completion: 71, repeat: 24, margin: 56, action: 'TEST' },
  { segment: 'International / Bilingual / GED', name: 'TCAS Navigation for GED', enrollments: 168, conversion: 32, completion: 74, repeat: 22, margin: 52, action: 'PROMOTE' },
] as const

export const advisorCases = [
  {
    name: 'Pim · Dek70',
    segment: 'ม.ปลาย / TCAS',
    goal: 'วิศวะ',
    signal: 'Mechanics gap · Hybrid preference',
    path: 'Physics Foundation → Core → Mock',
    next: 'โทรอธิบาย path + เปรียบเทียบ CORE vs PLUS',
    priority: 'HIGH',
  },
  {
    name: 'Nene · P6',
    segment: 'ประถม',
    goal: 'พื้นฐานแน่นขึ้น',
    signal: 'Math confidence ต่ำ · Parent-led',
    path: 'Math Foundation → Weekly practice',
    next: 'ส่ง parent summary + นัด diagnostic review',
    priority: 'MED',
  },
  {
    name: 'Beam · M3',
    segment: 'ม.ต้น',
    goal: 'สอบเข้า',
    signal: 'Science strong / Math weak',
    path: 'Math Core → Exam Pack',
    next: 'Branch consult: เลือกเวลาเรียนและ mock slot',
    priority: 'HIGH',
  },
  {
    name: 'Mika · GED',
    segment: 'International / Bilingual / GED',
    goal: 'Thai university',
    signal: 'Needs Thai academic terminology',
    path: 'Thai Academic Bridge → TCAS navigation',
    next: 'Advisor explains bridge scope + admission route',
    priority: 'MED',
  },
]
