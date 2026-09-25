import { useMemo, useState } from 'react'
import { intensiveGateMessage, recommendPackages, type LearnerStage, type RecommendationInput } from '../data/recommendationEngine'

export type StudentPage = 'intro' | 'goal' | 'baseline' | 'gap' | 'path' | 'support' | 'outcome'

type Props = {
  page: StudentPage
  setPage: (page: StudentPage) => void
}

type Profile = {
  stage: LearnerStage
  need: string
  goal: string
  score: number
  time: string
  supportMode: string
  supportNeed: string
  budgetBand: string
  targetSchool: string
  targetFaculty: string
  completedPrerequisite: boolean
}

const defaults: Profile = {
  stage: 'Upper Secondary',
  need: 'TCAS / University',
  goal: 'วิศวะ',
  score: 58,
  time: '5–7 ชม./สัปดาห์',
  supportMode: 'Hybrid',
  supportNeed: 'High',
  budgetBand: '10,000-20,000',
  targetSchool: 'General M.4',
  targetFaculty: 'วิศวะ',
  completedPrerequisite: false,
}

const order: StudentPage[] = ['intro','goal','baseline','gap','path','support','outcome']

function Back({ page, setPage }: Props) {
  const index = order.indexOf(page)
  if (index <= 0) return null
  return <button className="back-btn" onClick={() => setPage(order[index - 1])}>← Back</button>
}

function Choice({title,value,options,onChange}:{title:string;value:string;options:string[];onChange:(v:string)=>void}) {
  return <div className="field-block">
    <div className="field-title">{title}</div>
    <div className="choice-row">
      {options.map(option=><button key={option} className={value===option?'selected':''} onClick={()=>onChange(option)}>{option}</button>)}
    </div>
  </div>
}

function Intro({ setPage }: Pick<Props,'setPage'>) {
  return <section className="page">
    <div className="section-head">
      <div>
        <div className="eyebrow">LEARNER JOURNEY</div>
        <h1 className="hero-title">รู้ก่อนว่าอยู่ตรงไหน<br/><span>แล้วค่อยเลือก package ที่เหมาะ</span></h1>
        <p className="lead">Compass เริ่มจาก learner need + baseline gap + constraints แล้วคัด package ที่มีอยู่ให้เหลือคำตอบที่ตัดสินใจง่าย</p>
        <div className="actions"><button className="primary" onClick={() => setPage('goal')}>เริ่มเช็กเป้าหมาย + พื้นฐาน</button></div>
      </div>
      <div className="section-number">01</div>
    </div>
    <div className="learner-explain-grid">
      {[
        ['01','Goal & Context','ช่วงชั้น เป้าหมาย โรงเรียน/คณะ เวลา งบ และรูปแบบ support'],
        ['02','Baseline Check','ประเมิน readiness และใช้เป็น prerequisite gate'],
        ['03','Gap Map','เห็นว่าต้องเติมอะไร ก่อนเข้าเส้นทางที่เข้มข้นขึ้น'],
        ['04','Top 3 Packages','Best Match · Best Value · More Support'],
        ['05','Outcome','ผลจริงกลับมา update learner path และ portfolio'],
      ].map(([n,t,c])=><article className="explain-card" key={n}><span>{n}</span><b>{t}</b><p>{c}</p></article>)}
    </div>
  </section>
}

function Goal({profile,setProfile,setPage}:{profile:Profile;setProfile:(x:Profile)=>void;setPage:Props['setPage']}) {
  const needs = profile.stage==='Primary'
    ? ['Foundation','School Exam','Competition']
    : profile.stage==='Lower Secondary'
      ? ['Foundation','School Exam','Entrance','Competition']
      : ['Foundation','School Exam','TCAS / University','Competition','Explore admission']
  const goals = profile.stage==='Primary'
    ? ['เพิ่มเกรด','ปูพื้นฐาน','แข่งขัน']
    : profile.stage==='Lower Secondary'
      ? ['เพิ่มเกรด','สอบเข้า ม.4','สอวน. / แข่งขัน']
      : ['เพิ่มเกรด','วิศวะ','แพทย์','บริหาร','วิทยาศาสตร์','ยังไม่แน่ใจ']

  return <section className="page">
    <Back page="goal" setPage={setPage}/>
    <div className="eyebrow">STEP 1 · GOAL & CONTEXT</div>
    <h1 className="section-title">ก่อนแนะนำ package<br/>เราต้องรู้ decision context ก่อน</h1>
    <div className="form-board">
      <Choice title="ช่วงชั้น" value={profile.stage} options={['Primary','Lower Secondary','Upper Secondary']} onChange={v=>setProfile({...profile,stage:v as LearnerStage})}/>
      <Choice title="ตอนนี้ต้องการอะไร" value={profile.need} options={needs} onChange={v=>setProfile({...profile,need:v})}/>
      <Choice title="เป้าหมาย" value={profile.goal} options={goals} onChange={v=>setProfile({...profile,goal:v,targetFaculty:profile.stage==='Upper Secondary'?v:profile.targetFaculty})}/>
      {profile.stage==='Lower Secondary' && <Choice title="โรงเรียน / โปรแกรมเป้าหมาย" value={profile.targetSchool} options={['General M.4','เตรียมอุดม','MWIT','KVIS']} onChange={v=>setProfile({...profile,targetSchool:v})}/>}
      {profile.stage==='Upper Secondary' && <Choice title="คณะ / track เป้าหมาย" value={profile.targetFaculty} options={['วิศวะ','แพทย์','บริหาร','วิทยาศาสตร์','สถาปัตย์','สายสุขภาพ','ศิลป์ / สังคม','ยังไม่แน่ใจ']} onChange={v=>setProfile({...profile,targetFaculty:v})}/>}
      <div className="field-block">
        <div className="field-title">Baseline / current score <b>{profile.score}</b></div>
        <input className="score-range" type="range" min="20" max="95" value={profile.score} onChange={e=>setProfile({...profile,score:Number(e.target.value)})}/>
      </div>
      <Choice title="เวลาที่มี" value={profile.time} options={['2–4 ชม./สัปดาห์','5–7 ชม./สัปดาห์','8+ ชม./สัปดาห์']} onChange={v=>setProfile({...profile,time:v})}/>
      <Choice title="รูปแบบการเรียน" value={profile.supportMode} options={['Anywhere','Branch','Hybrid']} onChange={v=>setProfile({...profile,supportMode:v})}/>
      <Choice title="ระดับ support ที่ต้องการ" value={profile.supportNeed} options={['Low','Medium','High']} onChange={v=>setProfile({...profile,supportNeed:v})}/>
      <Choice title="งบประมาณ" value={profile.budgetBand} options={['<5,000','5,000-10,000','10,000-20,000','20,000+']} onChange={v=>setProfile({...profile,budgetBand:v})}/>
      <Choice title="Prerequisite OnDemand" value={profile.completedPrerequisite?'เคยเรียนและผ่านแล้ว':'ยังไม่ผ่าน / ไม่เคยเรียน'} options={['ยังไม่ผ่าน / ไม่เคยเรียน','เคยเรียนและผ่านแล้ว']} onChange={v=>setProfile({...profile,completedPrerequisite:v==='เคยเรียนและผ่านแล้ว'})}/>
    </div>
    <div className="end"><button className="primary" onClick={()=>setPage('baseline')}>ต่อไป: เช็ก readiness →</button></div>
  </section>
}

function Baseline({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const readiness = profile.score>=70 ? 'ผ่าน baseline gate' : profile.score>=55 ? 'ใกล้พร้อม แต่ยังควรเติม foundation' : 'ควรปิด foundation gap ก่อน'
  return <section className="page narrow">
    <Back page="baseline" setPage={setPage}/>
    <div className="eyebrow">STEP 2 · BASELINE CHECK</div>
    <h1 className="section-title">Readiness ก่อนเลือกความเข้มข้น</h1>
    <div className="baseline-summary">
      <div><span>Current baseline</span><b>{profile.score}</b><i>{readiness}</i></div>
      <div><span>Goal context</span><b>{profile.stage==='Upper Secondary'?'TCAS':'Path'}</b><i>{profile.goal}</i></div>
      <div><span>Prerequisite</span><b>{profile.completedPrerequisite?'PASS':'—'}</b><i>{profile.completedPrerequisite?'OnDemand history clears gate':'baseline score can still clear gate'}</i></div>
    </div>
    <div className="end"><button className="primary" onClick={()=>setPage('gap')}>ดู Gap Map →</button></div>
  </section>
}

function Gap({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const gap=Math.max(0,70-profile.score)
  return <section className="page">
    <Back page="gap" setPage={setPage}/>
    <div className="eyebrow">STEP 3 · GAP MAP</div>
    <h1 className="section-title">Gap ที่มีผลต่อ<br/>package eligibility</h1>
    <div className="profile-strip"><span>{profile.stage}</span><span>{profile.need}</span><span>{profile.goal}</span><span>Baseline {profile.score}</span><span>{profile.budgetBand}</span></div>
    <div className="gap-grid">
      <article className={gap>15?'gap-card urgent':'gap-card medium'}><span>READINESS GAP</span><b>Baseline threshold</b><strong>{gap}</strong><p>คะแนนที่ยังห่างจาก threshold 70</p></article>
      <article className="gap-card medium"><span>CONSTRAINT</span><b>Support</b><strong>{profile.supportNeed}</strong><p>{profile.supportMode} · {profile.time}</p></article>
      <article className={profile.completedPrerequisite?'gap-card good':'gap-card medium'}><span>PREREQUISITE</span><b>Prior OnDemand</b><strong>{profile.completedPrerequisite?'PASS':'OPEN'}</strong><p>ใช้ร่วมกับ baseline เพื่อ unlock intensive route</p></article>
    </div>
    <div className="logic-callout"><b>Eligibility before intensity.</b><span>ถ้ายังไม่ผ่าน prerequisite gate ระบบจะไม่ยก intensive / advanced package เป็น Best Match</span></div>
    <div className="end"><button className="primary" onClick={()=>setPage('path')}>ดู Top 3 Packages →</button></div>
  </section>
}

function Path({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const input:RecommendationInput={
    stage:profile.stage,
    need:profile.need,
    goal:profile.goal,
    baselineScore:profile.score,
    budgetBand:profile.budgetBand,
    supportNeed:profile.supportNeed,
    targetSchool:profile.targetSchool,
    targetFaculty:profile.targetFaculty,
    completedPrerequisite:profile.completedPrerequisite,
  }
  const recs=recommendPackages(input)
  return <section className="page">
    <Back page="path" setPage={setPage}/>
    <div className="eyebrow">STEP 4 · PACKAGE RECOMMENDATION</div>
    <div className="section-head compact">
      <div><h1 className="section-title">Your Compass</h1><p className="lead">สามคำตอบที่ทำหน้าที่ต่างกัน — ไม่ใช่ catalog dump</p></div>
      <button className="edit-link" onClick={()=>setPage('goal')}>Edit context</button>
    </div>
    <div className="profile-strip"><span>{profile.goal}</span><span>Baseline {profile.score}</span><span>{profile.budgetBand}</span><span>{profile.supportNeed} support</span></div>
    <div className="path-line">
      {recs.map((r,i)=><article key={r.slot}>
        <span>0{i+1} · {r.slot.toUpperCase()}</span>
        <b>{r.name}</b>
        <strong>฿{r.price.toLocaleString()} · Fit {r.fit}%</strong>
        <p>{r.reason}</p>
      </article>)}
    </div>
    <div className="logic-callout"><b>Prerequisite gate</b><span>{intensiveGateMessage(input)}</span></div>
    <div className="end"><button className="primary" onClick={()=>setPage('support')}>ดู support context →</button></div>
  </section>
}

function Support({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  return <section className="page">
    <Back page="support" setPage={setPage}/>
    <div className="eyebrow">STEP 5 · SUPPORT CONTEXT</div>
    <h1 className="section-title">Package fit ต้องอ่านคู่กับ<br/>วิธีเรียนและ support</h1>
    <div className="support-grid">
      <article><small>DELIVERY</small><b>{profile.supportMode}</b><p>รูปแบบการเรียนที่ learner เลือก</p></article>
      <article className="featured"><small>SUPPORT NEED</small><b>{profile.supportNeed}</b><p>ใช้แยก Best Match กับ More Support</p></article>
      <article><small>TIME</small><b>{profile.time}</b><p>constraint ที่มีผลต่อ path</p></article>
      <article><small>BUDGET</small><b>{profile.budgetBand}</b><p>Best Value ต้องยัง fit ไม่ใช่แค่ถูกที่สุด</p></article>
    </div>
    <div className="end"><button className="primary" onClick={()=>setPage('outcome')}>ดู Outcome Loop →</button></div>
  </section>
}

function Outcome({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const latest=Math.min(100,profile.score+12)
  return <section className="page">
    <Back page="outcome" setPage={setPage}/>
    <div className="eyebrow">STEP 6 · OUTCOME FEEDBACK</div>
    <h1 className="section-title">ผลเปลี่ยน<br/>Recommendation ก็เปลี่ยน</h1>
    <div className="outcome-board">
      <div className="score-change"><span>Baseline</span><b>{profile.score}</b><i>→</i><span>Illustrative latest</span><b>{latest}</b></div>
      <div className="outcome-copy"><b>Outcome closes the loop</b><p>เมื่อ baseline / outcome เปลี่ยน ระบบจะประเมิน eligibility และ Top 3 ใหม่ แทนที่จะขาย package เดิมซ้ำโดยไม่ดู learner state</p><div className="mini-loop"><span>Outcome</span><i>→</i><span>Updated Gap</span><i>→</i><span>Updated Top 3</span><i>→</i><span>Portfolio evidence</span></div></div>
    </div>
    <div className="end"><button className="secondary" onClick={()=>setPage('goal')}>ลอง profile ใหม่</button></div>
  </section>
}

export default function StudentExperience({page,setPage}:Props) {
  const [profile,setProfile]=useState<Profile>(defaults)
  return useMemo(()=>{
    if(page==='intro') return <Intro setPage={setPage}/>
    if(page==='goal') return <Goal profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='baseline') return <Baseline profile={profile} setPage={setPage}/>
    if(page==='gap') return <Gap profile={profile} setPage={setPage}/>
    if(page==='path') return <Path profile={profile} setPage={setPage}/>
    if(page==='support') return <Support profile={profile} setPage={setPage}/>
    return <Outcome profile={profile} setPage={setPage}/>
  },[page,profile,setPage])
}
