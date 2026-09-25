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
  'แพทย์':'Medicine','Medicine':'Medicine',
  'วิศวะ':'Engineering','Engineering':'Engineering',
  'บริหาร':'Business','Business':'Business',
  'วิทยาศาสตร์':'Science','Science':'Science',
  'สถาปัตย์':'Architecture','Architecture':'Architecture',
  'สายสุขภาพ':'Health Allied','Health Allied':'Health Allied',
  'ศิลป์ / สังคม':'Arts / Social','Arts / Social':'Arts / Social',
}

function desiredTrack(input: RecommendationInput) {
  const need=input.need.toLowerCase()
  const goal=input.goal.toLowerCase()
  const school=(input.targetSchool||'').toLowerCase()

  if(input.stage==='Primary'){
    if(need.includes('competitive')||goal.includes('แข่ง')) return 'Competitive'
    if(need.includes('school')||goal.includes('เกรด')) return 'School Exam'
    return 'Foundation'
  }

  if(input.stage==='Lower Secondary'){
    if(school.includes('เตรียมอุดม')||school.includes('triam')) return 'Triam Udom'
    if(school.includes('มหิดลวิทย')||school.includes('mwit')) return 'MWIT'
    if(school.includes('กำเนิดวิทย์')||school.includes('kvis')) return 'KVIS'
    if(need.includes('entrance')||goal.includes('สอบเข้า')) return 'School Entrance'
    if(need.includes('competitive')||goal.includes('สอวน')||goal.includes('แข่ง')) return 'Competitive'
    if(need.includes('school')||goal.includes('เกรด')) return 'School Exam'
    return 'Foundation'
  }

  const faculty=facultyTrack[input.targetFaculty||'']
  if(faculty) return faculty
  if(need.includes('explore')||goal.includes('ยังไม่แน่')) return 'Explore Admission'
  if(need.includes('early')) return 'TCAS Early Prep'
  if(need.includes('competitive')) return 'Competitive'
  if(need.includes('school')||goal.includes('เกรด')) return 'School Exam'
  if(need.includes('foundation')) return 'Foundation'
  return 'Explore Admission'
}

function packageFit(name:string,track:string,desired:string){
  if(desired==='Triam Udom') return name.includes('Triam Udom')?110:track==='School Entrance'?70:20
  if(desired==='MWIT') return name.includes('MWIT')?110:track==='School Entrance'?70:20
  if(desired==='KVIS') return name.includes('KVIS')?110:track==='School Entrance'?70:20
  if(track===desired) return 100
  if(desired==='Medicine'&&track==='Health Allied') return 72
  if(desired==='Health Allied'&&track==='Medicine') return 66
  if(['Engineering','Science','Architecture'].includes(desired)&&['Engineering','Science','Architecture'].includes(track)) return 68
  if(desired==='School Exam'&&track==='Foundation') return 62
  if(desired==='Foundation'&&track==='School Exam') return 55
  if(desired==='Explore Admission'&&track==='TCAS Early Prep') return 60
  return 25
}

export function intensiveGate(input: RecommendationInput){
  return Boolean(input.completedPrerequisite)||input.baselineScore>=70
}

function isAdvancedTrack(stage:LearnerStage, track:string){
  if(stage==='Primary') return track==='Competitive'
  if(stage==='Lower Secondary') return track==='Competitive'||track==='School Entrance'
  return !['Foundation','School Exam','TCAS Early Prep','Explore Admission'].includes(track)
}

function eligibleForGate(input:RecommendationInput, track:string){
  return intensiveGate(input)||!isAdvancedTrack(input.stage,track)
}

export function recommendPackages(input: RecommendationInput):PackageRecommendation[]{
  const desired=desiredTrack(input)
  const gate=intensiveGate(input)
  const ranked=appSnapshot.packages
    .filter(p=>p.lifeStage===input.stage)
    .map(p=>{
      let score=packageFit(p.name,p.track,desired)
      if(input.supportNeed==='High') score+=Math.min(8,p.componentCount)
      if(input.baselineScore<55&&p.track==='Foundation') score+=12
      if(!eligibleForGate(input,p.track)) score-=80
      return {p,score,eligible:eligibleForGate(input,p.track)}
    })
    .filter(x=>x.eligible)
    .sort((a,b)=>b.score-a.score||a.p.price-b.p.price)

  const best=ranked[0]
  const threshold=Math.max(45,(best?.score||0)-35)
  const aligned=ranked.filter(x=>x.score>=threshold)
  const value=[...aligned]
    .filter(x=>x.p.packageId!==best?.p.packageId)
    .sort((a,b)=>a.p.price-b.p.price)[0]||best
  const used=new Set([best?.p.packageId,value?.p.packageId])
  const support=[...aligned]
    .filter(x=>!used.has(x.p.packageId))
    .sort((a,b)=>b.p.componentCount-a.p.componentCount||b.p.price-a.p.price)[0]||
    [...ranked].filter(x=>!used.has(x.p.packageId))
      .sort((a,b)=>b.p.componentCount-a.p.componentCount)[0]||best

  const gateReason = gate
    ? ''
    : ' Prerequisite gate is not yet cleared, so advanced/intensive routes are excluded.'

  const rows=[
    {slot:'Best Match' as const,row:best,reason:`Highest eligible fit for ${desired}, current baseline and goal.${gateReason}`},
    {slot:'Best Value' as const,row:value,reason:'Lowest-priced eligible alternative that still clears the fit threshold.'},
    {slot:'More Support' as const,row:support,reason:'Broader eligible package structure for learners needing more support.'},
  ]

  return rows.filter(x=>x.row).map((x,index)=>({
    slot:x.slot,
    packageId:x.row!.p.packageId,
    name:x.row!.p.name,
    price:x.row!.p.price,
    fit:Math.max(50,Math.min(99,Math.round(x.row!.score-index))),
    reason:x.reason,
    intensiveEligible:gate,
  }))
}

export function intensiveGateMessage(input:RecommendationInput){
  if(intensiveGate(input)){
    return input.completedPrerequisite
      ? 'Intensive / Upskill route unlocked by prior OnDemand prerequisite completion.'
      : 'Intensive / Upskill route unlocked by baseline assessment.'
  }
  return 'Intensive / Upskill route locked: complete the prerequisite OnDemand course or pass the baseline threshold first.'
}
