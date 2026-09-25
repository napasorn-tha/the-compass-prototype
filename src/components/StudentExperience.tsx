import { useMemo, useState } from 'react'

export type StudentPage = 'intro' | 'goal' | 'baseline' | 'gap' | 'path' | 'support' | 'outcome'

type Props = {
  page: StudentPage
  setPage: (page: StudentPage) => void
}

type Profile = {
  stage: string
  need: string
  goal: string
  score: number
  time: string
  support: string
}

const defaults: Profile = {
  stage: 'Upper Secondary',
  need: 'TCAS / University',
  goal: 'วิศวะ',
  score: 58,
  time: '5–7 ชม./สัปดาห์',
  support: 'Hybrid',
}

const order: StudentPage[] = ['intro','goal','baseline','gap','path','support','outcome']

function Back({ page, setPage }: Props) {
  const index = order.indexOf(page)
  if (index <= 0) return null
  return <button className="back-btn" onClick={() => setPage(order[index - 1])}>← Back</button>
}

function Intro({ setPage }: Pick<Props,'setPage'>) {
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">LEARNER JOURNEY</div>
          <h1 className="hero-title">รู้ก่อนว่าอยู่ตรงไหน<br/><span>แล้วค่อยเลือกว่าจะไปทางไหน</span></h1>
          <p className="lead">
            Compass ไม่เริ่มจาก catalog แต่เริ่มจากเป้าหมาย คะแนนปัจจุบัน และพื้นฐานที่ยังขาด
          </p>
          <div className="actions">
            <button className="primary" onClick={() => setPage('goal')}>เริ่มเช็กเป้าหมาย + พื้นฐาน</button>
          </div>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="learner-explain-grid">
        {[
          ['01','Goal & Context','คุณอยู่ชั้นไหน อยากได้อะไร คะแนนตอนนี้ประมาณไหน'],
          ['02','Baseline Check','ทำแบบทดสอบสั้น ๆ เพื่อดู concept ที่รู้แล้วและยังไม่แน่น'],
          ['03','Gap Map','เห็นจุดที่ต้องเติมก่อน ไม่ใช่เห็นแค่คะแนนรวม'],
          ['04','Recommended Path','จัดลำดับว่าจะเรียน / ฝึก / mock อะไรก่อนหลัง'],
          ['05','Outcome','ผลเรียนหรือผลสอบกลับมา update path'],
        ].map(([n,t,c]) => (
          <article className="explain-card" key={n}>
            <span>{n}</span><b>{t}</b><p>{c}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Goal({ profile, setProfile, setPage }: {profile:Profile;setProfile:(x:Profile)=>void;setPage:Props['setPage']}) {
  const choices = {
    stage:['Primary','Lower Secondary','Upper Secondary'],
    need:['Foundation','Grade improvement','Entrance','Competition','TCAS / University','Ongoing support'],
    goal:['เพิ่มเกรด','สอบเข้า ม.4','สอวน. / แข่งขัน','วิศวะ','แพทย์','ยังไม่แน่ใจ'],
    time:['2–4 ชม./สัปดาห์','5–7 ชม./สัปดาห์','8+ ชม./สัปดาห์'],
    support:['Online','Branch','Hybrid'],
  }

  return (
    <section className="page">
      <Back page="goal" setPage={setPage}/>
      <div className="eyebrow">STEP 1 · GOAL & CONTEXT</div>
      <h1 className="section-title">ก่อนแนะนำคอร์ส<br/>เราต้องรู้ปัญหาก่อน</h1>
      <div className="form-board">
        <Choice title="ช่วงชั้น" value={profile.stage} options={choices.stage} onChange={(v)=>setProfile({...profile,stage:v})}/>
        <Choice title="ตอนนี้ต้องการอะไร" value={profile.need} options={choices.need} onChange={(v)=>setProfile({...profile,need:v})}/>
        <Choice title="เป้าหมาย" value={profile.goal} options={choices.goal} onChange={(v)=>setProfile({...profile,goal:v})}/>
        <div className="field-block">
          <div className="field-title">คะแนนปัจจุบันโดยประมาณ <b>{profile.score}</b></div>
          <input className="score-range" type="range" min="20" max="95" value={profile.score} onChange={(e)=>setProfile({...profile,score:Number(e.target.value)})}/>
        </div>
        <Choice title="เวลาที่มี" value={profile.time} options={choices.time} onChange={(v)=>setProfile({...profile,time:v})}/>
        <Choice title="รูปแบบ support" value={profile.support} options={choices.support} onChange={(v)=>setProfile({...profile,support:v})}/>
      </div>
      <div className="end"><button className="primary" onClick={()=>setPage('baseline')}>ต่อไป: เช็กพื้นฐาน →</button></div>
    </section>
  )
}

function Choice({title,value,options,onChange}:{title:string;value:string;options:string[];onChange:(v:string)=>void}) {
  return (
    <div className="field-block">
      <div className="field-title">{title}</div>
      <div className="choice-row">
        {options.map((option)=><button key={option} className={value===option?'selected':''} onClick={()=>onChange(option)}>{option}</button>)}
      </div>
    </div>
  )
}

function Baseline({ setPage }: Pick<Props,'setPage'>) {
  const [answer, setAnswer] = useState<number | null>(null)
  const questions = [
    ['Mechanics','แรงลัพธ์เป็นศูนย์หมายถึงข้อใด','วัตถุไม่มีแรงใดกระทำ','วัตถุไม่มีความเร่ง','วัตถุหยุดนิ่งเสมอ'],
    ['Electricity','ถ้า R คงที่และ V เพิ่ม 2 เท่า กระแส I จะ...','ลดครึ่งหนึ่ง','เท่าเดิม','เพิ่ม 2 เท่า'],
    ['Problem solving','ข้อสอบ 60 นาที 30 ข้อ กลยุทธ์ใดเหมาะที่สุด','เริ่มข้อยากสุด','แบ่งเวลาและ flag ข้อที่ติด','ทำแบบสุ่ม'],
  ]
  const [index,setIndex] = useState(0)
  const q = questions[index]

  if (!q) {
    return (
      <section className="page narrow">
        <Back page="baseline" setPage={setPage}/>
        <div className="eyebrow">STEP 2 · BASELINE COMPLETE</div>
        <h1 className="section-title">เราไม่ได้หาแค่คะแนน<br/>เราหาว่า gap อยู่ตรงไหน</h1>
        <div className="baseline-summary">
          <div><span>Mechanics</span><b>42</b><i>ต้องเติมก่อน</i></div>
          <div><span>Electricity</span><b>57</b><i>ยังไม่แน่น</i></div>
          <div><span>Waves</span><b>81</b><i>แข็งแรง</i></div>
        </div>
        <div className="end"><button className="primary" onClick={()=>setPage('gap')}>ดู Gap Map →</button></div>
      </section>
    )
  }

  return (
    <section className="page narrow">
      <Back page="baseline" setPage={setPage}/>
      <div className="eyebrow">STEP 2 · BASELINE CHECK</div>
      <h1 className="section-title">เช็กพื้นฐานสั้น ๆ</h1>
      <p className="lead">ผลจะถูกใช้ร่วมกับเป้าหมายและคะแนนปัจจุบัน เพื่อจัดลำดับสิ่งที่ต้องเติม</p>
      <article className="quiz-panel">
        <div className="quiz-meta"><span>{q[0]}</span><b>{index+1} / {questions.length}</b></div>
        <h2>{q[1]}</h2>
        <div className="answer-stack">
          {q.slice(2).map((a,i)=><button key={a} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{a}</button>)}
        </div>
        <div className="end"><button className="primary" disabled={answer===null} onClick={()=>{setIndex(index+1);setAnswer(null)}}>ตอบและไปต่อ</button></div>
      </article>
    </section>
  )
}

function Gap({ profile, setPage }: {profile:Profile;setPage:Props['setPage']}) {
  return (
    <section className="page">
      <Back page="gap" setPage={setPage}/>
      <div className="eyebrow">STEP 3 · GAP MAP</div>
      <h1 className="section-title">สิ่งที่ต้องเติม<br/>ก่อนพาไปถึงเป้า</h1>
      <div className="profile-strip">
        <span>{profile.stage}</span><span>{profile.need}</span><span>{profile.goal}</span><span>Current score {profile.score}</span>
      </div>
      <div className="gap-grid">
        <article className="gap-card urgent"><span>PRIORITY 01</span><b>Mechanics</b><strong>42</strong><p>พื้นฐานยังไม่พอสำหรับ intensive practice</p></article>
        <article className="gap-card medium"><span>PRIORITY 02</span><b>Electricity</b><strong>57</strong><p>เข้า concept บางส่วน แต่ error pattern ยังสูง</p></article>
        <article className="gap-card good"><span>KEEP</span><b>Waves</b><strong>81</strong><p>พร้อมเข้าสู่ timed practice</p></article>
      </div>
      <div className="logic-callout"><b>Fill the gap, not sell the catalog.</b><span>Recommendation จะจัดลำดับจาก gap + goal + time + support preference</span></div>
      <div className="end"><button className="primary" onClick={()=>setPage('path')}>สร้าง Recommended Path →</button></div>
    </section>
  )
}

function Path({ profile, setPage }: {profile:Profile;setPage:Props['setPage']}) {
  return (
    <section className="page">
      <Back page="path" setPage={setPage}/>
      <div className="eyebrow">STEP 4 · RECOMMENDED PATH</div>
      <div className="section-head compact">
        <div><h1 className="section-title">Your Compass</h1><p className="lead">ลำดับที่ควรทำ ไม่ใช่ลิสต์คอร์สทั้งหมดที่เรามี</p></div>
        <button className="edit-link" onClick={()=>setPage('goal')}>Edit goal / score</button>
      </div>
      <div className="profile-strip"><span>{profile.goal}</span><span>{profile.time}</span><span>{profile.support}</span></div>
      <div className="path-line">
        {[
          ['01','Foundation','Mechanics reset','ปิด prerequisite gap ก่อน'],
          ['02','Core','Physics concept path','เชื่อม concept กับโจทย์'],
          ['03','Practice','Timed practice','ฝึกตาม error pattern'],
          ['04','Mock','Outcome check','ผลกลับมา update path'],
        ].map(([n,t,c,d])=><article key={n}><span>{n}</span><b>{t}</b><strong>{c}</strong><p>{d}</p></article>)}
      </div>
      <div className="end"><button className="primary" onClick={()=>setPage('support')}>เลือกระดับ Support →</button></div>
    </section>
  )
}

function Support({setPage}:Pick<Props,'setPage'>) {
  return (
    <section className="page">
      <Back page="support" setPage={setPage}/>
      <div className="eyebrow">STEP 5 · SUPPORT LADDER</div>
      <h1 className="section-title">จ่ายเพิ่มแล้ว<br/>ได้ support เพิ่มอะไร?</h1>
      <div className="support-grid">
        <article><small>FREE / ENTRY</small><b>Starter</b><p>Goal check + baseline</p></article>
        <article className="featured"><small>CORE</small><b>Recommended Path</b><p>เรียนตาม path ด้วยตัวเอง</p></article>
        <article><small>PLUS</small><b>Teacher Support</b><p>มีคนช่วยเมื่อเจอจุดติด</p></article>
        <article><small>PREMIUM</small><b>Advisor + Family</b><p>ดู journey และ decision ร่วมกับครอบครัว</p></article>
      </div>
      <div className="end"><button className="primary" onClick={()=>setPage('outcome')}>ดู Outcome Loop →</button></div>
    </section>
  )
}

function Outcome({setPage}:Pick<Props,'setPage'>) {
  return (
    <section className="page">
      <Back page="outcome" setPage={setPage}/>
      <div className="eyebrow">STEP 6 · OUTCOME FEEDBACK</div>
      <h1 className="section-title">ผลเปลี่ยน<br/>Path ก็เปลี่ยน</h1>
      <div className="outcome-board">
        <div className="score-change"><span>Baseline</span><b>52</b><i>→</i><span>Latest</span><b>68</b></div>
        <div className="outcome-copy">
          <b>Mechanics ดีขึ้น</b>
          <p>Priority ใหม่ขยับไป Electricity ระบบจึงปรับลำดับ practice แทนที่จะขายแพ็กเดิมซ้ำ</p>
          <div className="mini-loop"><span>Outcome</span><i>→</i><span>Updated Gap</span><i>→</i><span>Updated Path</span></div>
        </div>
      </div>
      <div className="end"><button className="secondary" onClick={()=>setPage('goal')}>ลองเปลี่ยน profile ใหม่</button></div>
    </section>
  )
}

export default function StudentExperience({page,setPage}:Props) {
  const [profile,setProfile] = useState<Profile>(defaults)
  const content = useMemo(()=>{
    if(page==='intro') return <Intro setPage={setPage}/>
    if(page==='goal') return <Goal profile={profile} setProfile={setProfile} setPage={setPage}/>
    if(page==='baseline') return <Baseline setPage={setPage}/>
    if(page==='gap') return <Gap profile={profile} setPage={setPage}/>
    if(page==='path') return <Path profile={profile} setPage={setPage}/>
    if(page==='support') return <Support setPage={setPage}/>
    return <Outcome setPage={setPage}/>
  },[page,profile,setPage])
  return content
}
