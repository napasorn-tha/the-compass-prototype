import { useEffect, useMemo, useState } from 'react'
import {
  defaultProfile,
  diagnosticQuestions,
  onboarding,
  StudentProfile,
} from '../data/mock'

export type StudentPage = 'home' | 'about' | 'diagnostic' | 'compass' | 'support' | 'progress'

type Props = {
  page: StudentPage
  setPage: (page: StudentPage) => void
}

const stages = [
  ['Foundation', 'ปิด gap ใน Mechanics ก่อน', '4 สัปดาห์', 'ทำโจทย์พื้นฐานได้ ≥ 75%'],
  ['Core', 'เชื่อม Mechanics + Electricity กับโจทย์สอบ', '8 สัปดาห์', 'mock topic score ≥ 65%'],
  ['Practice', 'ทำโจทย์แบบจับเวลาและแก้ error pattern', '6 สัปดาห์', 'consistency 3 ชุดติด'],
  ['Mock', 'จำลองสอบเต็มชุดและอัปเดตเส้นทาง', 'ต่อเนื่อง', 'result feeds back to Compass'],
]

const tiers = [
  ['FREE / ENTRY', '฿0–990', 'อยากเริ่มรู้จุดอ่อนก่อน', ['Diagnostic', 'Starter plan', 'Sample practice']],
  ['CORE', '฿3,990', 'เรียนตาม path ได้ด้วยตัวเอง', ['Recommended learning path', 'Core modules', 'Practice + mock']],
  ['PLUS', '฿7,990', 'อยากมีครูช่วยตอนติด', ['Everything in Core', 'Teacher consultation', 'Focused remediation']],
  ['PREMIUM', '฿14,900', 'ครอบครัวที่ต้องการ advisor ดู journey', ['Family Butler', 'Parent consultation', 'Journey check-ins']],
] as const

function Home({ setPage }: Pick<Props, 'setPage'>) {
  return (
    <section className="page hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">From catalog to compass</div>
          <h1>วันนี้<br />อยากไปถึงไหน?</h1>
          <p className="lead">ไม่ต้องรู้ก่อนว่าควรซื้อคอร์สอะไร บอกเป้าหมายของคุณ แล้ว Compass จะช่วยจัดเส้นทางให้</p>
          <div className="actions">
            <button className="primary" onClick={() => setPage('about')}>เริ่มค้นหาเส้นทางของฉัน</button>
            <button className="secondary" onClick={() => setPage('compass')}>ดูตัวอย่างเส้นทาง</button>
          </div>
        </div>

        <div className="orbit-wrap">
          <div className="orbit">
            <div className="orbit-center">YOUR<br />COMPASS</div>
            <span className="orbit-chip chip-1">เป้าหมาย</span>
            <span className="orbit-chip chip-2">Diagnostic</span>
            <span className="orbit-chip chip-3">เวลา + งบ</span>
            <span className="orbit-chip chip-4">ผลลัพธ์ล่าสุด</span>
          </div>
        </div>
      </div>

      <div className="four-steps">
        {[
          ['01', 'Tell us about you', 'เริ่มจากเป้าหมาย ไม่ใช่ catalog'],
          ['02', 'Quick diagnostic', 'ดูจุดแข็งและ gap ที่ต้องจัดลำดับ'],
          ['03', 'Recommended path', 'เลือกเส้นทาง ไม่โยน SKU ทั้งหมดให้เลือกเอง'],
          ['04', 'Progress adapts', 'ผลเปลี่ยน เส้นทางก็เปลี่ยนตาม'],
        ].map(([n, title, copy]) => (
          <div key={n}>
            <span>{n}</span>
            <b>{title}</b>
            <p>{copy}</p>
          </div>
        ))}
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
      const current = profile.subjects
      const next = current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option]
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
      <div className="eyebrow">Step 1 / 4</div>
      <h1 className="section-title">บอกเรานิดเดียว<br />ว่าเป้าหมายของคุณคืออะไร</h1>
      <div className="step-progress">
        {[0, 1, 2, 3].map((item) => <i className={item <= Math.floor((step / onboarding.length) * 4) ? 'done' : ''} key={item} />)}
      </div>

      <div className="onboard-grid">
        <article className="card">
          <span className="muted">คำถาม {step + 1} / {onboarding.length}</span>
          <h2>{item.title}</h2>
          <div className="choice-grid">
            {item.options.map((option) => (
              <button
                className={'choice ' + (selected(option) ? 'selected' : '')}
                key={option}
                onClick={() => select(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="between">
            <button className="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>ย้อนกลับ</button>
            <button
              className="primary"
              onClick={() => step === onboarding.length - 1 ? setPage('diagnostic') : setStep((value) => value + 1)}
            >
              {step === onboarding.length - 1 ? 'ไปทำ Diagnostic' : 'ถัดไป'}
            </button>
          </div>
        </article>

        <aside className="card profile-card">
          <div className="eyebrow">Your profile</div>
          <h2>เส้นทางเริ่มชัดขึ้นแล้ว</h2>
          {[
            ['รุ่น', profile.cohort],
            ['เป้าหมาย', profile.goal],
            ['วิชาที่กังวล', profile.subjects.join(', ')],
            ['ระดับ', profile.level],
            ['เวลา', profile.hours],
            ['งบ', profile.budget],
            ['รูปแบบ', profile.mode],
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
    const skills = [
      ['Mechanics', 42, 'Needs attention', 'low'],
      ['Electricity', 56, 'Developing', 'mid'],
      ['Waves', 84, 'Strong', 'good'],
      ['Problem solving', 61, 'Developing', 'mid'],
    ]
    return (
      <section className="page narrow">
        <div className="eyebrow">Step 2 / 4</div>
        <h1 className="section-title">Diagnostic summary</h1>
        <div className="card result-grid">
          <div className="score-ring">68</div>
          <div>
            <p className="muted">คะแนนเป็นเพียง snapshot สำหรับจัดลำดับการเรียน</p>
            {skills.map(([label, score, status, tone]) => (
              <div className="skill-row" key={String(label)}>
                <span>{label}</span>
                <div className="bar"><i style={{ width: Number(score) + '%' }} /></div>
                <b className={String(tone)}>{status}</b>
              </div>
            ))}
            <button className="primary" onClick={() => setPage('compass')}>สร้างเส้นทางของฉัน</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page narrow">
      <div className="eyebrow">Step 2 / 4</div>
      <h1 className="section-title">Quick Diagnostic</h1>
      <p className="lead compact">ใช้ Physics เป็นตัวอย่างเพื่อดู competency ก่อนจัดเส้นทาง ไม่ใช่เพื่อจัดอันดับคุณ</p>
      <article className="card quiz-card">
        <div className="between">
          <span className="pill">{question.skill}</span>
          <span className="muted">{questionIndex + 1} / {diagnosticQuestions.length}</span>
        </div>
        <h2>{question.question}</h2>
        <div className="answers">
          {question.answers.map((answer) => (
            <button key={answer} onClick={() => setQuestionIndex((value) => value + 1)}>{answer}</button>
          ))}
        </div>
      </article>
    </section>
  )
}

function Compass({ profile, setPage }: { profile: StudentProfile; setPage: Props['setPage'] }) {
  return (
    <section className="page">
      <div className="eyebrow">Step 3 / 4</div>
      <h1 className="section-title">Your Compass</h1>
      <p className="lead">จากเป้าหมาย + diagnostic + เวลาที่มี เราจัดลำดับสิ่งที่ควรทำก่อน</p>

      <div className="chips">
        {[profile.cohort, profile.goal, profile.level, profile.hours, profile.mode].map((item) => <span key={item}>{item}</span>)}
      </div>

      <div className="path-grid">
        {stages.map(([title, copy, duration, success], index) => (
          <div className={'path-stage ' + (index === 0 ? 'active' : '')} key={title}>
            <div className="stage-number">{index + 1}</div>
            <article className="card stage-card">
              <b>{title}</b>
              <p>{copy}</p>
              <span>{duration}</span>
              <small>Success: {success}</small>
            </article>
          </div>
        ))}
      </div>

      <details className="card why">
        <summary>Why this path?</summary>
        <p>
          Recommendation ใช้ <b>เป้าหมาย</b>, diagnostic gaps, เวลาต่อสัปดาห์, รูปแบบการเรียน และ budget
          เพื่อจัดลำดับเส้นทาง — <b>Compass เลือกเส้นทาง ไม่ได้เลือกคอร์สที่แพงที่สุด</b>
        </p>
      </details>
      <div className="end"><button className="primary" onClick={() => setPage('support')}>เลือกระดับความช่วยเหลือ</button></div>
    </section>
  )
}

function Support({ setPage }: Pick<Props, 'setPage'>) {
  return (
    <section className="page">
      <div className="eyebrow">Step 4 / 4</div>
      <h1 className="section-title">คุณอยากได้ความช่วยเหลือ<br />ระดับไหน?</h1>
      <p className="lead">ให้ราคาอธิบาย “ระดับของ support” แทนการเปรียบเทียบ feature หลายสิบข้อ</p>

      <div className="tier-grid">
        {tiers.map(([name, price, fit, features]) => (
          <article className={'tier ' + (name === 'CORE' ? 'recommended' : '')} key={name}>
            {name === 'CORE' && <span className="recommend-badge">RECOMMENDED</span>}
            <b>{name}</b>
            <strong>{price}</strong>
            <p>เหมาะกับคนที่{fit}</p>
            <ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="muted">Prototype pricing — for demonstration only.</p>
      <div className="end"><button className="primary" onClick={() => setPage('progress')}>ดู My Compass</button></div>
    </section>
  )
}

function Progress() {
  return (
    <section className="page">
      <div className="eyebrow">Adaptive journey</div>
      <h1 className="section-title">ผลล่าสุดเปลี่ยนแล้ว<br />เส้นทางของคุณก็เปลี่ยนตาม</h1>

      <div className="progress-grid">
        <article className="card">
          <span className="muted">Physics Mock</span>
          <div className="score-delta">52 <i>→</i> 68</div>
          <div className="priority-callout">Mechanics ดีขึ้น<br />Priority ใหม่: Electricity</div>
          {[
            ['Mechanics', 64, 'Developing', 'mid'],
            ['Electricity', 50, 'Priority', 'low'],
            ['Waves', 84, 'Strong', 'good'],
          ].map(([label, score, status, tone]) => (
            <div className="skill-row" key={String(label)}>
              <span>{label}</span>
              <div className="bar"><i style={{ width: Number(score) + '%' }} /></div>
              <b className={String(tone)}>{status}</b>
            </div>
          ))}
        </article>

        <div>
          <h2>Updated recommended path</h2>
          <div className="updated-path">
            <article className="card"><span className="done-dot">✓</span><b>Foundation completed</b><p>Mechanics moved from Needs attention → Developing</p></article>
            <article className="card"><span className="next-dot">2</span><b>Core: Electricity first</b><p>Compass reorders practice from the latest mock outcome</p></article>
          </div>
          <div className="delivery-grid">
            <article><b>Bangkok / Metro</b><p>Learn Anywhere · modular short format · self-service recommendation · consult on demand</p></article>
            <article><b>Provincial delivery</b><p>Same Compass path, with branch-assisted journey · parent consultation · mock exam · community touchpoint</p></article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function StudentExperience({ page, setPage }: Props) {
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    const raw = window.localStorage.getItem('compass-profile')
    if (!raw) return defaultProfile
    try { return JSON.parse(raw) as StudentProfile } catch { return defaultProfile }
  })

  const setProfile = (next: StudentProfile) => setProfileState(next)

  useEffect(() => {
    window.localStorage.setItem('compass-profile', JSON.stringify(profile))
  }, [profile])

  const content = useMemo(() => {
    if (page === 'home') return <Home setPage={setPage} />
    if (page === 'about') return <About profile={profile} setProfile={setProfile} setPage={setPage} />
    if (page === 'diagnostic') return <Diagnostic setPage={setPage} />
    if (page === 'compass') return <Compass profile={profile} setPage={setPage} />
    if (page === 'support') return <Support setPage={setPage} />
    return <Progress />
  }, [page, profile, setPage])

  return content
}
