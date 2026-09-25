import { useMemo, useState } from 'react'
import { appSnapshot } from '../data/appSnapshot'
import { intensiveGateMessage, recommendPackages, type LearnerStage } from '../data/recommendationEngine'

export type StudentPage='intro'|'goal'|'baseline'|'gap'|'path'|'support'|'outcome'
type Props={page:StudentPage;setPage:(page:StudentPage)=>void}
type Profile={
  stage:LearnerStage;need:string;goal:string;currentScore:number;baselineScore:number;
  targetSchool:string;targetFaculty:string;time:string;support:string;budgetBand:string;completedPrerequisite:boolean
}

const defaults:Profile={stage:'Upper Secondary',need:'TCAS / University',goal:'วิศวะ',currentScore:58,baselineScore:58,targetSchool:'',targetFaculty:'Engineering',time:'5–7 ชม./สัปดาห์',support:'Hybrid',budgetBand:'10,001-20,000',completedPrerequisite:false}
const order:StudentPage[]=['intro','goal','baseline','gap','path','support','outcome']

function Back({page,setPage}:Props){const i=order.indexOf(page);return i<=0?null:<button className="back-btn" onClick={()=>setPage(order[i-1])}>← Back</button>}
function Choice({title,value,options,onChange}:{title:string;value:string;options:string[];onChange:(v:string)=>void}){return <div className="field-block"><div className="field-title">{title}</div><div className="choice-row">{options.map(o=><button key={o} className={value===o?'selected':''} onClick={()=>onChange(o)}>{o}</button>)}</div></div>}

function Intro({setPage}:Pick<Props,'setPage'>){return <section className="page">
  <div className="section-head"><div><div className="eyebrow">LEARNER JOURNEY</div><h1 className="hero-title">ไม่ต้องเลือกจาก catalog<br/><span>ให้ระบบหา package ที่เหมาะ</span></h1><p className="lead">Goal + context + baseline test ถูกใช้เพื่อคัด package ที่มีอยู่จริง และป้องกันการข้าม prerequisite ไป intensive เร็วเกินไป</p><div className="actions"><button className="primary" onClick={()=>setPage('goal')}>เริ่มหา Package</button></div></div><div className="section-number">01</div></div>
  <div className="learner-explain-grid">{[
    ['01','Goal & Context','ระดับชั้น เป้าหมาย โรงเรียน/คณะ เวลา งบ และ support'],
    ['02','Baseline Test','ใช้ผล test เป็น placement gate ไม่ใช่แค่คะแนนสวย ๆ'],
    ['03','Gap Map','รู้ว่าต้องปิด prerequisite อะไรก่อน'],
    ['04','Top 3 Packages','Best Match · Best Value · More Support'],
    ['05','Outcome Loop','ผลจริงย้อนกลับไปปรับ recommendation และ portfolio'],
  ].map(([n,t,c])=><article className="explain-card" key={n}><span>{n}</span><b>{t}</b><p>{c}</p></article>)}</div>
</section>}

function Goal({profile,setProfile,setPage}:{profile:Profile;setProfile:(p:Profile)=>void;setPage:Props['setPage']}){
  const needs=profile.stage==='Primary'?['Foundation','Grade improvement','Competition']:profile.stage==='Lower Secondary'?['Foundation','Grade improvement','Entrance','Competition']:['Foundation','Grade improvement','TCAS / University','Competition','Explore Admission']
  const goals=profile.stage==='Primary'?['เพิ่มเกรด','แข่งวิชาการ']:profile.stage==='Lower Secondary'?['เพิ่มเกรด','สอบเข้า ม.4','สอวน. / แข่งขัน']:['เพิ่มเกรด','วิศวะ','แพทย์','บริหาร','วิทยาศาสตร์','สถาปัตย์','สายสุขภาพ','ยังไม่แน่ใจ']
  return <section className="page"><Back page="goal" setPage={setPage}/><div className="eyebrow">STEP 1 · GOAL & CONTEXT</div><h1 className="section-title">ถามเท่าที่มีผลต่อ<br/>การเลือก package</h1>
    <div className="form-board">
      <Choice title="ช่วงชั้น" value={profile.stage} options={['Primary','Lower Secondary','Upper Secondary']} onChange={v=>setProfile({...profile,stage:v as LearnerStage,targetSchool:'',targetFaculty:''})}/>
      <Choice title="Need" value={profile.need} options={needs} onChange={v=>setProfile({...profile,need:v})}/>
      <Choice title="เป้าหมาย" value={profile.goal} options={goals} onChange={v=>setProfile({...profile,goal:v,targetFaculty:profile.stage==='Upper Secondary'?({วิศวะ:'Engineering',แพทย์:'Medicine',บริหาร:'Business',วิทยาศาสตร์:'Science',สถาปัตย์:'Architecture','สายสุขภาพ':'Health Allied'} as Record<string,string>)[v]||profile.targetFaculty:profile.targetFaculty})}/>
      {profile.stage!=='Upper Secondary'&&<Choice title="Target school / program" value={profile.targetSchool||'ยังไม่ระบุ'} options={profile.stage==='Lower Secondary'?['ยังไม่ระบุ','เตรียมอุดม','มหิดลวิทยานุสรณ์ (MWIT)','กำเนิดวิทย์ (KVIS)','โรงเรียนแข่งขันสูงอื่น ๆ']:['ยังไม่ระบุ','Current School','Competitive Program']} onChange={v=>setProfile({...profile,targetSchool:v==='ยังไม่ระบุ'?'':v})}/>}
      {profile.stage==='Upper Secondary'&&<Choice title="Target faculty" value={profile.targetFaculty||'Undecided'} options={['Engineering','Medicine','Business','Science','Architecture','Health Allied','Arts / Social','Undecided']} onChange={v=>setProfile({...profile,targetFaculty:v})}/>}
      <div className="field-block"><div className="field-title">คะแนนปัจจุบันโดยประมาณ <b>{profile.currentScore}</b></div><input className="score-range" type="range" min="20" max="95" value={profile.currentScore} onChange={e=>setProfile({...profile,currentScore:Number(e.target.value)})}/></div>
      <Choice title="งบประมาณ" value={profile.budgetBand} options={['<5,000','5,000-10,000','10,001-20,000','>20,000']} onChange={v=>setProfile({...profile,budgetBand:v})}/>
      <Choice title="เวลาที่มี" value={profile.time} options={['2–4 ชม./สัปดาห์','5–7 ชม./สัปดาห์','8+ ชม./สัปดาห์']} onChange={v=>setProfile({...profile,time:v})}/>
      <Choice title="รูปแบบการเรียน" value={profile.support} options={['Anywhere','Branch','Hybrid']} onChange={v=>setProfile({...profile,support:v})}/>
      <div className="field-block"><label className="check-line"><input type="checkbox" checked={profile.completedPrerequisite} onChange={e=>setProfile({...profile,completedPrerequisite:e.target.checked})}/><span>เคยผ่าน prerequisite OnDemand course ที่เกี่ยวข้องแล้ว</span></label></div>
    </div>
    <div className="end"><button className="primary" onClick={()=>setPage('baseline')}>ต่อไป: Baseline Test →</button></div>
  </section>
}

function Baseline({profile,setProfile,setPage}:{profile:Profile;setProfile:(p:Profile)=>void;setPage:Props['setPage']}){
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
  const [index,setIndex]=useState(0);const [answer,setAnswer]=useState<number|null>(null);const [correct,setCorrect]=useState(0)
  const q=questions[index]
  if(!q){const score=30+correct*20;return <section className="page narrow"><Back page="baseline" setPage={setPage}/><div className="eyebrow">STEP 2 · BASELINE COMPLETE</div><h1 className="section-title">Placement score <span className="red-text">{score}</span></h1><div className="baseline-summary"><div><span>Baseline</span><b>{score}</b><i>{score>=70?'ผ่าน intensive gate':'ยังต้องปิด prerequisite'}</i></div><div><span>Reported score</span><b>{profile.currentScore}</b><i>ใช้เป็น context</i></div><div><span>Gate</span><b>{profile.completedPrerequisite||score>=70?'OPEN':'LOCKED'}</b><i>prerequisite OR test ≥ 70</i></div></div><div className="end"><button className="primary" onClick={()=>{setProfile({...profile,baselineScore:score});setPage('gap')}}>ดู Gap Map →</button></div></section>}
  return <section className="page narrow"><Back page="baseline" setPage={setPage}/><div className="eyebrow">STEP 2 · BASELINE / PLACEMENT</div><h1 className="section-title">Test ก่อนข้ามไป intensive</h1><p className="lead">ถ้าไม่เคยผ่าน prerequisite course ผล test นี้จะเป็น gate สำหรับ intensive / Upskill</p><article className="quiz-panel"><div className="quiz-meta"><span>{String(q[0])}</span><b>{index+1} / {questions.length}</b></div><h2>{String(q[1])}</h2><div className="answer-stack">{q.slice(2,5).map((a,i)=><button key={String(a)} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{String(a)}</button>)}</div><div className="end"><button className="primary" disabled={answer===null} onClick={()=>{setCorrect(correct+(answer===q[5]?1:0));setIndex(index+1);setAnswer(null)}}>ตอบและไปต่อ</button></div></article></section>
}

function Gap({profile,setPage}:{profile:Profile;setPage:Props['setPage']}){
  const gap=Math.max(0,80-profile.baselineScore);const state=profile.baselineScore<55?'Foundation first':profile.baselineScore<70?'Core before intensive':'Ready for intensive review'
  return <section className="page"><Back page="gap" setPage={setPage}/><div className="eyebrow">STEP 3 · GAP MAP</div><h1 className="section-title">Placement ก่อน Package</h1><div className="profile-strip"><span>{profile.stage}</span><span>{profile.need}</span><span>{profile.goal}</span><span>Baseline {profile.baselineScore}</span></div><div className="gap-grid"><article className="gap-card urgent"><span>PLACEMENT</span><b>{state}</b><strong>{profile.baselineScore}</strong><p>baseline score</p></article><article className="gap-card medium"><span>GAP TO READY</span><b>Readiness gap</b><strong>{gap}</strong><p>ใช้กำหนด depth ของ path</p></article><article className="gap-card good"><span>HARD RULE</span><b>Intensive gate</b><strong>{profile.completedPrerequisite||profile.baselineScore>=70?'OPEN':'LOCKED'}</strong><p>prerequisite course OR baseline ≥ 70</p></article></div><div className="logic-callout"><b>Package recommendation follows eligibility.</b><span>ระบบไม่ควรขาย intensive ให้เด็กเพียงเพราะใกล้สอบ ถ้าพื้นฐานยังไม่ผ่าน gate</span></div><div className="end"><button className="primary" onClick={()=>setPage('path')}>ดู Top 3 Packages →</button></div></section>
}

function Path({profile,setPage}:{profile:Profile;setPage:Props['setPage']}){
  const input={stage:profile.stage,need:profile.need,goal:profile.goal,baselineScore:profile.baselineScore,budgetBand:profile.budgetBand,supportNeed:profile.support==='Hybrid'?'High':'Medium',targetSchool:profile.targetSchool,targetFaculty:profile.targetFaculty,completedPrerequisite:profile.completedPrerequisite}
  const recs=recommendPackages(input)
  return <section className="page"><Back page="path" setPage={setPage}/><div className="eyebrow">STEP 4 · TOP 3 PACKAGE RECOMMENDATION</div><div className="section-head compact"><div><h1 className="section-title">Your Compass</h1><p className="lead">ไม่โยน catalog ทั้งหมดให้เลือก — เหลือสามทางเลือกที่มี role ชัด</p></div><button className="edit-link" onClick={()=>setPage('goal')}>Edit profile</button></div><div className="profile-strip"><span>{profile.stage}</span><span>{profile.goal}</span><span>{profile.budgetBand}</span><span>Baseline {profile.baselineScore}</span></div><div className={'gate-banner '+(profile.completedPrerequisite||profile.baselineScore>=70?'open':'locked')}><b>{profile.completedPrerequisite||profile.baselineScore>=70?'INTENSIVE GATE OPEN':'INTENSIVE GATE LOCKED'}</b><span>{intensiveGateMessage(input)}</span></div><div className="recommend-grid">{recs.map((r,i)=><article className={i===0?'featured':''} key={r.slot}><span>{r.slot.toUpperCase()}</span><h2>{r.name}</h2><div className="recommend-price">฿{r.price.toLocaleString()}</div><div className="fit-row"><b>{r.fit}% fit</b><i><em style={{width:r.fit+'%'}}/></i></div><p>{r.reason}</p><small>{r.packageId}</small></article>)}</div><div className="end"><button className="primary" onClick={()=>setPage('support')}>ดู Support Logic →</button></div></section>
}

function Support({profile,setPage}:{profile:Profile;setPage:Props['setPage']}){return <section className="page"><Back page="support" setPage={setPage}/><div className="eyebrow">STEP 5 · SUPPORT</div><h1 className="section-title">Package เดียวกัน<br/>support อาจไม่เท่ากัน</h1><div className="support-grid"><article><small>CORE</small><b>Self-directed</b><p>เหมาะกับ gap ต่ำและ learner autonomy สูง</p></article><article className={profile.support==='Hybrid'?'featured':''}><small>PLUS</small><b>Teacher / Hybrid</b><p>มี support เมื่อเจอจุดติด</p></article><article className="featured"><small>MORE SUPPORT</small><b>Advisor-assisted</b><p>เหมาะกับ gap สูง เป้าหมายซับซ้อน หรือ family decision</p></article><article><small>CHANNEL</small><b>{profile.support}</b><p>Anywhere / Branch / Hybrid เป็น delivery preference ไม่ใช่ need state</p></article></div><div className="end"><button className="primary" onClick={()=>setPage('outcome')}>ดู Outcome Loop →</button></div></section>}

function Outcome({profile,setPage}:{profile:Profile;setPage:Props['setPage']}){
  const sample=appSnapshot.learnerCases.find(x=>x.lifeStage===profile.stage&&x.finalScore!==null)||appSnapshot.learnerCases[0]
  return <section className="page"><Back page="outcome" setPage={setPage}/><div className="eyebrow">STEP 6 · OUTCOME FEEDBACK</div><h1 className="section-title">ผลจริงย้อนกลับมา<br/>ปรับ recommendation</h1><div className="outcome-board"><div className="score-change"><span>Baseline</span><b>{sample.baselineScore??'—'}</b><i>→</i><span>Latest</span><b>{sample.finalScore??'—'}</b></div><div className="outcome-copy"><b>{sample.goalAchieved?'Goal achieved':'Needs another iteration'}</b><p>ตัวอย่างจาก shared learner snapshot: {sample.learnerId} · {sample.segment} · {sample.region}. Outcome ไม่ได้จบอยู่หน้า learner แต่ย้อนกลับไปเป็น evidence ของ package และ portfolio.</p><div className="mini-loop"><span>Outcome</span><i>→</i><span>Updated Gap</span><i>→</i><span>Updated Package Fit</span><i>→</i><span>Portfolio Signal</span></div></div></div><div className="end"><button className="secondary" onClick={()=>setPage('goal')}>ลอง profile ใหม่</button></div></section>
}

export default function StudentExperience({page,setPage}:Props){
  const [profile,setProfile]=useState<Profile>(defaults)
  const content=useMemo(()=>{
    if(page==='intro')return <Intro setPage={setPage}/>
    if(page==='goal')return <Goal profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='baseline')return <Baseline profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='gap')return <Gap profile={profile} setPage={setPage}/>
    if(page==='path')return <Path profile={profile} setPage={setPage}/>
    if(page==='support')return <Support profile={profile} setPage={setPage}/>
    return <Outcome profile={profile} setPage={setPage}/>
  },[page,profile,setPage])
  return content
}
