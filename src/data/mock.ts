export type StudentProfile = {
  cohort: string
  goal: string
  subjects: string[]
  level: string
  hours: string
  budget: string
  mode: string
}

export const defaultProfile: StudentProfile = {
  cohort: 'Dek70',
  goal: 'วิศวะ',
  subjects: ['Physics'],
  level: 'Developing',
  hours: '5–7 ชั่วโมง',
  budget: '3,000–8,000',
  mode: 'Hybrid',
}

export const onboarding = [
  { key: 'cohort', title: 'คุณเป็นรุ่นไหน?', options: ['Dek70', 'Dek71'] },
  { key: 'goal', title: 'ตอนนี้อยากไปทางไหนมากที่สุด?', options: ['แพทย์', 'วิศวะ', 'บริหาร', 'สายศิลป์', 'ยังไม่แน่ใจ'] },
  { key: 'subjects', title: 'วิชาไหนที่กังวล?', options: ['Physics', 'Chemistry', 'Biology', 'Math', 'English'], multi: true },
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

export const portfolioSignals = [
  ['Physics Foundation', '432', '46%', '73%', '+11 pts', 'Low', 'GROW'],
  ['Mechanics Intensive', '210', '39%', '69%', '+8 pts', 'High overlap', 'MERGE'],
  ['Legacy Full Physics', '61', '18%', '41%', '+3 pts', 'High', 'HARVEST'],
  ['Old Exam Pack', '22', '8%', '30%', '+1 pt', 'Duplicate', 'EXIT'],
]
