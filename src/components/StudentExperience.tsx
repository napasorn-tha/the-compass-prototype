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
  currentScore: number
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
  currentScore: 58,
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
        ['01','Goal & Context','ช่วงชั้น เป้าหมาย โรงเรียน/คณะ เวลา งบ และข้อจำกัด'],
        ['02','Baseline','ประเมิน readiness และใช้เป็น prerequisite gate'],
        ['03','Gap Map','สิ่งที่ต้องเติมก่อนพาไปถึงเป้า'],
        ['04','Recommended Path','ลำดับที่ควรทำ ไม่ใช่ลิสต์คอร์สทั้งหมดที่เรามี'],
        ['05','Support','เพิ่มความช่วยเหลือตามความซับซ้อน ความต่อเนื่อง และ stakes ของเป้าหมาย'],
        ['06','Outcome','ผลจริงกลับมา update gap, path และ portfolio learning'],
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
        <div className="field-title">คะแนนปัจจุบันโดยประมาณ <b>{profile.currentScore}</b></div>
        <input className="score-range" type="range" min="20" max="95" value={profile.currentScore} onChange={e=>setProfile({...profile,currentScore:Number(e.target.value)})}/>
      </div>
      <Choice title="เวลาที่มี" value={profile.time} options={['2–4 ชม./สัปดาห์','5–7 ชม./สัปดาห์','8+ ชม./สัปดาห์']} onChange={v=>setProfile({...profile,time:v})}/>
      <Choice title="รูปแบบการเรียน" value={profile.supportMode} options={['Anywhere','Branch','Hybrid']} onChange={v=>setProfile({...profile,supportMode:v})}/>
      <Choice title="ระดับ support ที่ต้องการ" value={profile.supportNeed} options={['Low','Medium','High']} onChange={v=>setProfile({...profile,supportNeed:v})}/>
      <Choice title="งบประมาณ" value={profile.budgetBand} options={['<5,000','5,000-10,000','10,000-20,000','20,000+']} onChange={v=>setProfile({...profile,budgetBand:v})}/>
      <Choice title="Prerequisite OnDemand" value={profile.completedPrerequisite?'เคยเรียนและผ่านแล้ว':'ยังไม่ผ่าน / ไม่เคยเรียน'} options={['ยังไม่ผ่าน / ไม่เคยเรียน','เคยเรียนและผ่านแล้ว']} onChange={v=>setProfile({...profile,completedPrerequisite:v==='เคยเรียนและผ่านแล้ว'})}/>
    </div>
    <div className="end"><button className="primary" onClick={()=>setPage('baseline')}>ต่อไป: Baseline Test →</button></div>
  </section>
}

function Baseline({profile,setProfile,setPage}:{profile:Profile;setProfile:(x:Profile)=>void;setPage:Props['setPage']}) {
  const questions=profile.stage==='Primary'?[
    ['Concept','ถ้า 3 × 4 = 12 แล้ว 12 ÷ 3 เท่ากับ?','3','4','6',1],
    ['Reasoning','ข้อใดมากที่สุด?','0.45','0.54','0.405',1],
    ['Problem solving','โจทย์ยากควรทำอย่างไร?','เดาสุ่ม','แยกข้อมูลที่โจทย์ให้ก่อน','ข้ามทุกครั้ง',1],
  ]:profile.stage==='Lower Secondary'?[
    ['Algebra','ถ้า 2x + 4 = 10, x เท่ากับ?','2','3','4',1],
    ['Science reasoning','ตัวแปรควบคุมมีไว้ทำอะไร?','ให้เปลี่ยนพร้อมกัน','ทำให้เปรียบเทียบผลได้','ทำให้ผลสูงขึ้น',1],
    ['Problem solving','ติดโจทย์นานควรทำอย่างไร?','แบ่งโจทย์เป็นขั้น','เดาต่อ','เลิกทำ',0],
  ]:[
    ['Concept','แรงลัพธ์เป็นศูนย์หมายถึงข้อใด','ไม่มีแรงใดกระทำ','ไม่มีความเร่ง','หยุดนิ่งเสมอ',1],
    ['Quantitative','ถ้า R คงที่และ V เพิ่ม 2 เท่า I จะ...','ลดครึ่งหนึ่ง','เท่าเดิม','เพิ่ม 2 เท่า',2],
    ['Exam strategy','60 นาที 30 ข้อ ควร...','เริ่มข้อยากสุด','แบ่งเวลาและ flag ข้อที่ติด','ทำแบบสุ่ม',1],
  ]

  const [index,setIndex]=useState(0)
  const [answer,setAnswer]=useState<number|null>(null)
  const [correct,setCorrect]=useState(0)
  const q=questions[index]

  if(!q){
    const score=30+correct*20
    const readiness=score>=70?'ผ่าน baseline gate':score>=55?'ใกล้พร้อม แต่ยังควรเติม foundation':'ควรปิด foundation gap ก่อน'
    return <section className="page narrow">
      <Back page="baseline" setPage={setPage}/>
      <div className="eyebrow">STEP 2 · BASELINE COMPLETE</div>
      <h1 className="section-title">Baseline result <span className="red-text">{score}</span></h1>
      <div className="baseline-summary">
        <div><span>Baseline test</span><b>{score}</b><i>{readiness}</i></div>
        <div><span>Current score</span><b>{profile.currentScore}</b><i>ใช้เป็น context ประกอบ</i></div>
        <div><span>Gate</span><b>{profile.completedPrerequisite||score>=70?'OPEN':'LOCKED'}</b><i>prerequisite OR baseline ≥ 70</i></div>
      </div>
      <div className="end"><button className="primary" onClick={()=>{setProfile({...profile,score});setPage('gap')}}>ดู Gap Map →</button></div>
    </section>
  }

  return <section className="page narrow">
    <Back page="baseline" setPage={setPage}/>
    <div className="eyebrow">STEP 2 · BASELINE TEST</div>
    <h1 className="section-title">ลองทำ 3 ข้อก่อน<br/>แล้วค่อยดู readiness</h1>
    <p className="lead">ผล baseline ใช้ช่วยจัดระดับและเช็ก prerequisite ก่อนแนะนำ path ที่เข้มขึ้น</p>
    <article className="quiz-panel">
      <div className="quiz-meta"><span>{String(q[0])}</span><b>{index+1} / {questions.length}</b></div>
      <h2>{String(q[1])}</h2>
      <div className="answer-stack">
        {q.slice(2,5).map((a,i)=><button key={String(a)} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{String(a)}</button>)}
      </div>
      <div className="end">
        <button className="primary" disabled={answer===null} onClick={()=>{
          setCorrect(correct+(answer===q[5]?1:0))
          setIndex(index+1)
          setAnswer(null)
        }}>ตอบและไปต่อ</button>
      </div>
    </article>
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
    <div className="end"><button className="primary" onClick={()=>setPage('path')}>ดู Recommended Path →</button></div>
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
  const primary=recs[0]
  const alternatives=recs.slice(1)
  return <section className="page">
    <Back page="path" setPage={setPage}/>
    <div className="eyebrow">STEP 4 · RECOMMENDED PATH</div>
    <div className="section-head compact">
      <div>
        <h1 className="section-title">Your Compass</h1>
        <p className="lead">ลำดับที่ควรทำ ไม่ใช่ลิสต์คอร์สทั้งหมดที่เรามี</p>
      </div>
      <button className="edit-link" onClick={()=>setPage('goal')}>Edit context</button>
    </div>
    <div className="profile-strip"><span>{profile.goal}</span><span>Baseline {profile.score}</span><span>{profile.budgetBand}</span><span>{profile.supportNeed} support</span></div>

    {primary && <article className="primary-path-card">
      <div className="primary-path-label">PRIMARY RECOMMENDED PATH · BEST MATCH</div>
      <div className="primary-path-body">
        <div>
          <span>01 · BEST MATCH</span>
          <h2>{primary.name}</h2>
          <strong>฿{primary.price.toLocaleString()} · Fit {primary.fit}%</strong>
        </div>
        <p>{primary.reason}</p>
      </div>
    </article>}

    <div className="path-alternatives">
      {alternatives.map((r,i)=><article key={r.slot}>
        <span>0{i+2} · ALTERNATIVE · {r.slot.toUpperCase()}</span>
        <b>{r.name}</b>
        <strong>฿{r.price.toLocaleString()} · Fit {r.fit}%</strong>
        <p>{r.reason}</p>
      </article>)}
    </div>

    <div className="logic-callout"><b>Prerequisite gate</b><span>{intensiveGateMessage(input)}</span></div>
    <div className="end"><button className="primary" onClick={()=>setPage('support')}>ต่อไป: Support →</button></div>
  </section>
}

function Support({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const humanRecommended = profile.supportNeed==='High' || profile.goal==='ยังไม่แน่ใจ' || profile.budgetBand==='<5,000'
  return <section className="page">
    <Back page="support" setPage={setPage}/>
    <div className="eyebrow">STEP 5 · SUPPORT</div>
    <h1 className="section-title">Support ที่เหมาะกับแต่ละคน</h1>
    <p className="lead">เริ่มจาก quick help และเพิ่ม personalized support เมื่อจำเป็น</p>

    <div className="support-ladder">
      <article>
        <span>01 · INSTANT SUPPORT</span>
        <b>Online Solution + AI Quick Help</b>
        <p>ตอบทันที อธิบาย concept และช่วย triage คำถามก่อนส่งต่อ</p>
        <small>AI layer = prototype concept only</small>
      </article>
      <article>
        <span>02 · ACADEMIC CLEAR</span>
        <b>Human academic escalation</b>
        <p>เมื่อคำถามยัง unresolved หรือ confidence ต่ำ ให้ทีมวิชาการรับช่วงต่อพร้อม context โดยใช้ CLEAR เป็น human fallback (current service expectation: response within 24 hours)</p>
      </article>
      <article className={profile.supportNeed==='High'?'support-watch':''}>
        <span>03 · PERSONAL LEARNING SUPPORT</span>
        <b>1-on-1 TA / Tutor</b>
        <p>สำหรับ gap ที่เกิดซ้ำ คะแนนไม่ขยับ หรือ learner ต้องการ feedback ต่อเนื่อง</p>
      </article>
      <article className={humanRecommended?'support-action':''}>
        <span>04 · STRATEGIC / FAMILY SUPPORT</span>
        <b>Advisor / Family Butler</b>
        <p>สำหรับเป้าหมาย stakes สูง ความไม่แน่ใจ ผู้ปกครอง หรือการวาง pathway ระยะยาว</p>
      </article>
    </div>

    <div className="support-context-line">
      <div><span>YOUR CONTEXT</span><b>{profile.supportNeed} support · {profile.supportMode} · {profile.time}</b></div>
      <div><span>HUMAN INTERVENTION</span><b>{humanRecommended?'Compass recommends human support':'Available on request'}</b></div>
    </div>

    <div className="logic-callout"><b>Same Compass, escalating support.</b><span>Compass สามารถ flag human support ได้ และ learner ก็ขอคุยกับคนได้เองเสมอ</span></div>
    <div className="end"><button className="primary" onClick={()=>setPage('outcome')}>ดู Outcome Loop →</button></div>
  </section>
}

function Outcome({profile,setPage}:{profile:Profile;setPage:Props['setPage']}) {
  const latest=Math.min(100,profile.score+12)
  return <section className="page">
    <Back page="outcome" setPage={setPage}/>
    <div className="eyebrow">STEP 6 · OUTCOME</div>
    <h1 className="section-title">ผลเปลี่ยน<br/>Recommendation ก็เปลี่ยน</h1>
    <div className="outcome-board">
      <div className="score-change"><span>Baseline</span><b>{profile.score}</b><i>→</i><span>Latest assessment</span><b>{latest}</b></div>
      <div className="outcome-copy"><b>Outcome closes the individual loop</b><p>เมื่อ baseline / outcome เปลี่ยน ระบบจะประเมิน eligibility และ path ใหม่ แทนที่จะขาย package เดิมซ้ำโดยไม่ดู learner state</p></div>
    </div>

    <div className="feedback-loops">
      <article>
        <span>INDIVIDUAL LOOP</span>
        <div className="mini-loop"><b>Outcome</b><i>→</i><b>Updated Gap</b><i>→</i><b>Updated Path</b></div>
        <p>ใช้ผลของ learner คนนี้ปรับเส้นทางรอบถัดไป</p>
      </article>
      <article>
        <span>PORTFOLIO LOOP</span>
        <div className="mini-loop"><b>Aggregated Outcomes</b><i>→</i><b>Portfolio Learning</b><i>→</i><b>Better Recommendations</b></div>
        <p>เมื่อรวม outcome หลายคน ธุรกิจเห็นว่า package / routing แบบไหนสร้างผลจริง แล้วใช้ evidence นั้นปรับ Compass</p>
      </article>
    </div>

    <div className="end"><button className="secondary" onClick={()=>setPage('goal')}>ลอง profile ใหม่</button></div>
  </section>
}

export default function StudentExperience({page,setPage}:Props) {
  const [profile,setProfile]=useState<Profile>(defaults)
  return useMemo(()=>{
    if(page==='intro') return <Intro setPage={setPage}/>
    if(page==='goal') return <Goal profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='baseline') return <Baseline profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='gap') return <Gap profile={profile} setPage={setPage}/>
    if(page==='path') return <Path profile={profile} setPage={setPage}/>
    if(page==='support') return <Support profile={profile} setPage={setPage}/>
    return <Outcome profile={profile} setPage={setPage}/>
  },[page,profile,setPage])
}
