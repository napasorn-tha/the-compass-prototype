import { useEffect, useMemo, useState } from 'react'
import { defaultProfile, diagnosticQuestions, onboarding, StudentProfile } from '../data/mock'

export type StudentPage = 'home' | 'about' | 'diagnostic' | 'compass' | 'support' | 'progress'

type Props = {
  page: StudentPage
  setPage: (page: StudentPage) => void
}

const pathBySegment: Record<StudentProfile['segment'], [string, string, string, string][]> = {
  'ประถม': [
    ['Foundation', 'ปิด gap หลักให้พื้นฐานแน่น', '4–6 สัปดาห์', 'ทำโจทย์พื้นฐานได้สม่ำเสมอ'],
    ['Guided Practice', 'ฝึกสั้นแต่ต่อเนื่อง', '6 สัปดาห์', 'accuracy ดีขึ้นต่อเนื่อง'],
    ['Confidence Check', 'เช็กความเข้าใจแบบไม่กดดัน', 'ทุก 2 สัปดาห์', 'เห็น progress ที่อธิบายได้'],
    ['Next Module', 'ขยับระดับเมื่อพร้อม', 'adaptive', 'path เปลี่ยนตามผลล่าสุด'],
  ],
  'ม.ต้น': [
    ['Foundation', 'ปิด concept gap รายบท', '4 สัปดาห์', 'core concept ≥ 75%'],
    ['Core', 'เรียนตามชั้น + จุดอ่อน', '8 สัปดาห์', 'topic score ≥ 65%'],
    ['Exam Practice', 'ฝึกข้อสอบโรงเรียน / สอบเข้า', '6 สัปดาห์', 'timed consistency'],
    ['Bridge', 'เตรียมขึ้นระดับถัดไป', 'adaptive', 'พร้อมต่อยอด ม.ปลาย'],
  ],
  'ม.ปลาย / TCAS': [
    ['Foundation', 'ปิด gap ก่อน', '4 สัปดาห์', 'พื้นฐาน ≥ 75%'],
    ['Core', 'เชื่อม concept กับข้อสอบ', '8 สัปดาห์', 'topic mock ≥ 65%'],
    ['Practice', 'ทำโจทย์จับเวลา + error review', '6 สัปดาห์', 'consistency 3 ชุดติด'],
    ['Mock', 'จำลองสอบและอัปเดต path', 'ต่อเนื่อง', 'result feeds back to Compass'],
  ],
  'International / Bilingual / GED': [
    ['Bridge', 'เชื่อม curriculum เดิมกับภาษา / ระบบไทย', '4 สัปดาห์', 'เข้าใจ terminology + exam format'],
    ['Core', 'เติม subject gap ที่จำเป็น', '6–8 สัปดาห์', 'core competency stable'],
    ['Navigation', 'จัดเส้นทาง admission / equivalency', 'ต่อเนื่อง', 'รู้ requirement และ next step'],
    ['Practice', 'ซ้อม format ที่ต้องใช้จริง', 'adaptive', 'outcome feeds back to path'],
  ],
}

const tiers = [
  ['FREE / ENTRY', 'Diagnostic / Starter', 'อยากเริ่มรู้จุดอ่อนก่อน'],
  ['CORE', 'Recommended path', 'เรียนตาม path ได้ด้วยตัวเอง'],
  ['PLUS', 'Core + Consult', 'อยากมีครูช่วยตอนติด'],
  ['PREMIUM', 'Full support', 'ครอบครัวที่ต้องการ advisor ดู journey'],
] as const

function Home({ setPage }: Pick<Props, 'setPage'>) {
  return (
    <section className="page">
      <div className="section-head hero-head">
        <div>
          <div className="eyebrow">01 · Learner journey</div>
          <h1 className="hero-title">From Catalog<br />to <span>Compass</span></h1>
          <p className="lead">
            ไม่เริ่มจาก “มีคอร์สอะไรขาย?” แต่เริ่มจาก “นักเรียนคนนี้ควรไปทางไหน?”
          </p>
          <div className="actions">
            <button className="primary" onClick={() => setPage('about')}>เริ่มค้นหาเส้นทาง</button>
            <button className="secondary" onClick={() => setPage('compass')}>ดูตัวอย่าง Compass</button>
          </div>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="hero-board">
        <article className="board-card hero-red">
          <div className="board-title red">ONE ENGINE</div>
          <h2>Goal → Diagnostic → Path → Outcome → Better Match</h2>
          <div className="journey-flow">
            {['เป้าหมาย', 'Diagnostic', 'Recommended Path', 'Learn / Practice', 'Outcome', 'Better Match'].map((item, index) => (
              <div className="journey-node" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span><b>{item}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="board-card">
          <div className="board-title black">MULTIPLE SEGMENTS</div>
          <h2>Compass เดียว ไม่ได้แปลว่า journey เดียว</h2>
          <div className="segment-cards">
            <div><b>ประถม</b><span>Foundation + parent view</span></div>
            <div><b>ม.ต้น</b><span>Core + school / entrance exams</span></div>
            <div><b>ม.ปลาย / TCAS</b><span>Goal + diagnostic + mock</span></div>
            <div><b>International / GED</b><span>Bridge + navigation</span></div>
          </div>
        </article>
      </div>

      <div className="statement-banner">
        <b>LESS CHOICE → CLEARER CHOICE</b>
        <span>Student sees the path. Advisor sees the reason. Portfolio lead sees the signal.</span>
      </div>
    </section>
  )
}

function About({
  profile,
  setProfile,
  setPage,
}: {
  profile: StudentProfile
  setProfile: (profile: StudentProfile) => void
  setPage: Props['setPage']
}) {
  const [step, setStep] = useState(0)
  const item = onboarding[step]
  const key = item.key

  const select = (option: string) => {
    if (key === 'subjects') {
      const next = profile.subjects.includes(option)
        ? profile.subjects.filter((value) => value !== option)
        : [...profile.subjects, option]
      setProfile({ ...profile, subjects: next })
      return
    }
    setProfile({ ...profile, [key]: option } as StudentProfile)
  }

  const selected = (option: string) =>
    key === 'subjects'
      ? profile.subjects.includes(option)
      : String(profile[key as keyof StudentProfile]) === option

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 · Learner profile</div>
          <h1 className="section-title">รู้จัก journey ก่อน<br />ค่อยเลือก product</h1>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="step-progress">
        {[0,1,2,3].map((x) => <i className={x <= Math.floor(step / onboarding.length * 4) ? 'done' : ''} key={x} />)}
      </div>

      <div className="onboard-grid">
        <article className="board-card">
          <div className="board-title red">PROFILE BUILDER</div>
          <span className="note">คำถาม {step + 1} / {onboarding.length}</span>
          <h2>{item.title}</h2>
          <div className="choice-grid">
            {item.options.map((option) => (
              <button className={'choice ' + (selected(option) ? 'selected' : '')} key={option} onClick={() => select(option)}>
                {option}
              </button>
            ))}
          </div>
          <div className="between">
            <button className="secondary" disabled={step === 0} onClick={() => setStep((x) => Math.max(0, x - 1))}>ย้อนกลับ</button>
            <button className="primary" onClick={() => step === onboarding.length - 1 ? setPage('diagnostic') : setStep((x) => x + 1)}>
              {step === onboarding.length - 1 ? 'ไปทำ Diagnostic' : 'ถัดไป'}
            </button>
          </div>
        </article>

        <aside className="board-card profile-card">
          <div className="board-title black">YOUR PROFILE</div>
          {[
            ['Segment', profile.segment],
            ['รุ่น', profile.cohort],
            ['เป้าหมาย', profile.goal],
            ['วิชา', profile.subjects.join(', ')],
            ['ระดับ', profile.level],
            ['เวลา', profile.hours],
            ['งบ', profile.budget],
            ['Delivery', profile.mode],
          ].map(([label, value]) => (
            <div className="profile-row" key={label}><span>{label}</span><b>{value || '—'}</b></div>
          ))}
        </aside>
      </div>
    </section>
  )
}

function Diagnostic({ setPage }: Pick<Props, 'setPage'>) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = diagnosticQuestions[questionIndex]

  if (!question) {
    return (
      <section className="page narrow">
        <div className="eyebrow">01 · Diagnostic</div>
        <h1 className="section-title">จาก score → ไปหา gap</h1>
        <article className="board-card result-grid">
          <div className="score-box"><span>Diagnostic</span><b>68</b><small>prototype score</small></div>
          <div>
            {[
              ['Mechanics',42,'Needs attention','low'],
              ['Electricity',56,'Developing','mid'],
              ['Waves',84,'Strong','good'],
              ['Problem solving',61,'Developing','mid'],
            ].map(([label,score,status,tone]) => (
              <div className="skill-row" key={String(label)}>
                <span>{label}</span>
                <div className="bar"><i style={{ width: Number(score) + '%' }} /></div>
                <b className={String(tone)}>{status}</b>
              </div>
            ))}
            <button className="primary" onClick={() => setPage('compass')}>สร้าง Recommended Path</button>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="page narrow">
      <div className="eyebrow">01 · Quick diagnostic</div>
      <h1 className="section-title">วัดเพื่อจัดลำดับ<br />ไม่ใช่เพื่อจัดอันดับ</h1>
      <article className="board-card quiz-card">
        <div className="between no-margin">
          <span className="pill">{question.skill}</span>
          <span className="note">{questionIndex + 1} / {diagnosticQuestions.length}</span>
        </div>
        <h2>{question.question}</h2>
        <div className="answers">
          {question.answers.map((answer) => (
            <button key={answer} onClick={() => setQuestionIndex((x) => x + 1)}>{answer}</button>
          ))}
        </div>
      </article>
    </section>
  )
}

function Compass({ profile, setPage }: { profile: StudentProfile; setPage: Props['setPage'] }) {
  const path = pathBySegment[profile.segment]
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 · Recommended path</div>
          <h1 className="section-title">Your Compass</h1>
          <p className="lead">Compass เลือกลำดับที่ควรทำ ไม่ได้เลือกคอร์สที่แพงที่สุด</p>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="chips">
        {[profile.segment, profile.cohort, profile.goal, profile.level, profile.hours, profile.mode].map((x) => <span key={x}>{x}</span>)}
      </div>

      <div className="path-grid">
        {path.map(([title,copy,duration,success], index) => (
          <div className={'path-stage ' + (index === 0 ? 'active' : '')} key={title}>
            <div className="stage-number">{index + 1}</div>
            <article className="board-card stage-card">
              <b>{title}</b><p>{copy}</p><span>{duration}</span><small>Success: {success}</small>
            </article>
          </div>
        ))}
      </div>

      <details className="board-card why">
        <summary>WHY THIS PATH?</summary>
        <p>ใช้ segment, goal, diagnostic gap, available time, preferred delivery และ budget เพื่อจัดลำดับ journey แล้วปรับใหม่เมื่อ outcome เปลี่ยน</p>
      </details>
      <div className="end"><button className="primary" onClick={() => setPage('support')}>เลือกระดับ Support</button></div>
    </section>
  )
}

function Support({ setPage }: Pick<Props, 'setPage'>) {
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 · Price ladder</div>
          <h1 className="section-title">จ่ายเพิ่มแล้ว<br />ได้ Value เพิ่มอะไร?</h1>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="tier-grid">
        {tiers.map(([name, value, fit]) => (
          <article className={'tier ' + (name === 'CORE' ? 'recommended' : '')} key={name}>
            {name === 'CORE' && <span className="recommend-badge">RECOMMENDED</span>}
            <b>{name}</b>
            <strong>{value}</strong>
            <p>{fit}</p>
          </article>
        ))}
      </div>
      <p className="note">Prototype offer architecture only — not official pricing.</p>
      <div className="end"><button className="primary" onClick={() => setPage('progress')}>ดู Adaptive Journey</button></div>
    </section>
  )
}

function Progress() {
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 · Outcome feedback</div>
          <h1 className="section-title">ผลเปลี่ยน<br />Path ก็ต้องเปลี่ยน</h1>
        </div>
        <div className="section-number">01</div>
      </div>

      <div className="progress-grid">
        <article className="board-card">
          <div className="board-title red">LATEST OUTCOME</div>
          <div className="score-delta">52 <i>→</i> 68</div>
          <div className="priority-callout">Mechanics ดีขึ้น<br />Priority ใหม่: Electricity</div>
          {[
            ['Mechanics',64,'Developing','mid'],
            ['Electricity',50,'Priority','low'],
            ['Waves',84,'Strong','good'],
          ].map(([label,score,status,tone]) => (
            <div className="skill-row" key={String(label)}>
              <span>{label}</span><div className="bar"><i style={{ width: Number(score) + '%' }} /></div><b className={String(tone)}>{status}</b>
            </div>
          ))}
        </article>

        <article className="board-card">
          <div className="board-title black">UPDATED PATH</div>
          <div className="action-queue">
            <div><b>DONE</b><span>Foundation · Mechanics gap improved</span></div>
            <div><b>NEXT</b><span>Core · Prioritize Electricity practice</span></div>
            <div><b>THEN</b><span>Timed practice · error pattern review</span></div>
            <div><b>CHECK</b><span>Mock result returns to Compass</span></div>
          </div>
          <div className="mini-flow">
            <span>Diagnostic</span><i>→</i><span>Plan</span><i>→</i><span>Learn</span><i>→</i><span>Outcome</span><i>→</i><span>Better Match</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default function StudentExperience({ page, setPage }: Props) {
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    const raw = window.localStorage.getItem('compass-profile-v2')
    if (!raw) return defaultProfile
    try { return { ...defaultProfile, ...JSON.parse(raw) } as StudentProfile } catch { return defaultProfile }
  })

  useEffect(() => {
    window.localStorage.setItem('compass-profile-v2', JSON.stringify(profile))
  }, [profile])

  const content = useMemo(() => {
    if (page === 'home') return <Home setPage={setPage} />
    if (page === 'about') return <About profile={profile} setProfile={setProfileState} setPage={setPage} />
    if (page === 'diagnostic') return <Diagnostic setPage={setPage} />
    if (page === 'compass') return <Compass profile={profile} setPage={setPage} />
    if (page === 'support') return <Support setPage={setPage} />
    return <Progress />
  }, [page, profile, setPage])

  return content
}
