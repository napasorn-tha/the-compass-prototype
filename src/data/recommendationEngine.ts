import { appSnapshot } from './appSnapshot'

export type LearnerStage = 'Primary' | 'Lower Secondary' | 'Upper Secondary'

export type RecommendationInput = {
  stage: LearnerStage
  need: string
  goal: string
  baselineScore: number
  budgetBand: string
  supportNeed: string
  targetSchool?: string
  targetFaculty?: string
  completedPrerequisite?: boolean
}

export type PackageRecommendation = {
  slot: 'Best Match' | 'Best Value' | 'More Support'
  packageId: string
  name: string
  price: number
  fit: number
  reason: string
  intensiveEligible: boolean
}

const facultyTrack: Record<string,string> = {
  'แพทย์':'Medicine', 'Medicine':'Medicine',
  'วิศวะ':'Engineering', 'Engineering':'Engineering',
  'บริหาร':'Business', 'Business':'Business',
  'วิทยาศาสตร์':'Science', 'Science':'Science',
  'สถาปัตย์':'Architecture', 'Architecture':'Architecture',
  'Health Allied':'Health Allied', 'สายสุขภาพ':'Health Allied',
  'Arts / Social':'Arts / Social', 'ศิลป์ / สังคม':'Arts / Social',
}

function desiredTrack(input: RecommendationInput) {
  const need = input.need.toLowerCase()
  const goal = input.goal.toLowerCase()
  const school = (input.targetSchool || '').toLowerCase()

  if (input.stage === 'Primary') {
    if (need.includes('competitive') || goal.includes('แข่ง')) return 'Competitive'
    if (need.includes('school') || goal.includes('เกรด')) return 'School Exam'
    return 'Foundation'
  }

  if (input.stage === 'Lower Secondary') {
    if (school.includes('เตรียมอุดม') || school.includes('triam')) return 'Triam Udom'
    if (school.includes('มหิดลวิทย') || school.includes('mwit')) return 'MWIT'
    if (school.includes('กำเนิดวิทย์') || school.includes('kvis')) return 'KVIS'
    if (need.includes('entrance') || goal.includes('สอบเข้า')) return 'School Entrance'
    if (need.includes('competitive') || goal.includes('สอวน') || goal.includes('แข่ง')) return 'Competitive'
    if (need.includes('school') || goal.includes('เกรด')) return 'School Exam'
    return 'Foundation'
  }

  const faculty = facultyTrack[input.targetFaculty || '']
  if (faculty) return faculty
  if (need.includes('explore') || goal.includes('ยังไม่แน่')) return 'Explore Admission'
  if (need.includes('early')) return 'TCAS Early Prep'
  if (need.includes('competitive')) return 'Competitive'
  if (need.includes('school') || goal.includes('เกรด')) return 'School Exam'
  if (need.includes('foundation')) return 'Foundation'
  return 'Explore Admission'
}

function matchScore(track: string, desired: string) {
  if (track === desired) return 100
  if (desired === 'Triam Udom' && track === 'School Entrance') return 96
  if (desired === 'MWIT' && track === 'School Entrance') return 96
  if (desired === 'KVIS' && track === 'School Entrance') return 96
  if (desired === 'Medicine' && track === 'Health Allied') return 72
  if (desired === 'Health Allied' && track === 'Medicine') return 66
  if (['Engineering','Science','Architecture'].includes(desired) && ['Engineering','Science','Architecture'].includes(track)) return 68
  if (desired === 'School Exam' && track === 'Foundation') return 62
  if (desired === 'Foundation' && track === 'School Exam') return 55
  if (desired === 'Explore Admission' && track === 'TCAS Early Prep') return 60
  return 25
}

export function intensiveGate(input: RecommendationInput) {
  return Boolean(input.completedPrerequisite) || input.baselineScore >= 70
}

export function recommendPackages(input: RecommendationInput): PackageRecommendation[] {
  const stagePackages = appSnapshot.packages.filter(p => p.lifeStage === input.stage)
  const desired = desiredTrack(input)
  const eligible = intensiveGate(input)

  const ranked = stagePackages
    .map(p => {
      let score = matchScore(p.track, desired)
      if (input.supportNeed === 'High') score += Math.min(8, p.componentCount)
      if (input.baselineScore < 55 && p.track === 'Foundation') score += 12
      return {p, score}
    })
    .sort((a,b)=>b.score-a.score || a.p.price-b.p.price)

  const best = ranked[0]?.p
  const aligned = ranked.filter(x => x.score >= Math.max(55, (ranked[0]?.score || 0) - 35))
  const value = [...aligned].sort((a,b)=>a.p.price-b.p.price)[0]?.p || best
  const support = [...aligned].sort((a,b)=>b.p.componentCount-a.p.componentCount || b.p.price-a.p.price)[0]?.p || best

  const rows = [
    {slot:'Best Match' as const,p:best,reason:`Best fit for ${desired} + current level`},
    {slot:'Best Value' as const,p:value,reason:'Lowest-priced package that still clears the fit threshold'},
    {slot:'More Support' as const,p:support,reason:'Broader pathway / more components for higher support needs'},
  ]

  return rows.filter(x=>x.p).map((x,index)=>({
    slot:x.slot,
    packageId:x.p!.packageId,
    name:x.p!.name,
    price:x.p!.price,
    fit:Math.max(55, Math.round((ranked.find(r=>r.p.packageId===x.p!.packageId)?.score || 60) - index*2)),
    reason:x.reason,
    intensiveEligible:eligible,
  }))
}

export function intensiveGateMessage(input: RecommendationInput) {
  if (intensiveGate(input)) {
    return input.completedPrerequisite
      ? 'Advanced / intensive route unlocked by prior OnDemand prerequisite completion.'
      : 'Advanced / intensive route unlocked by baseline assessment.'
  }
  return 'Advanced / intensive route is locked: complete the prerequisite OnDemand course or pass the baseline threshold first.'
}
