import { useCallback, useState } from 'react'
import { Brand } from './components/Brand'
import AdvisorConsole from './components/AdvisorConsole'
import PortfolioOS from './components/PortfolioOS'
import StudentExperience, { StudentPage } from './components/StudentExperience'
import { PROTOTYPE_DISCLOSURE } from './data/systemContract'

type Mode = 'home' | 'learner' | 'advisor' | 'portfolio'

const studentNav: { id: StudentPage; label: string }[] = [
  { id: 'intro', label: 'Overview' },
  { id: 'goal', label: 'Goal & Context' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'gap', label: 'Gap Map' },
  { id: 'path', label: 'Recommended Path' },
  { id: 'support', label: 'Support' },
  { id: 'outcome', label: 'Outcome' },
]

function Home({open}:{open:(mode:Mode)=>void}) {
  return (
    <section className="page home-page">
      <div className="home-hero">
        <div>
          <div className="eyebrow">ONDEMAND PRODUCT PORTFOLIO PROTOTYPE</div>
          <h1>From Catalog<br/>to <span>Compass</span></h1>
          <p>One learner intelligence loop.<br/>Three interfaces into the same system.</p>
          <div className="actions">
            <button className="primary" onClick={()=>open('learner')}>Explore Learner Journey</button>
            <button className="secondary" onClick={()=>open('portfolio')}>Open Portfolio OS</button>
          </div>
        </div>
        <div className="home-number">00</div>
      </div>

      <div className="home-system-title">
        <span>ONE COMPASS</span>
        <b>THREE USER LENSES</b>
        <p>Learner, Advisor และ Product Lead ไม่ได้ต่อคิวกันเป็น workflow — ทุกคนกำลังอ่านและเขียนกลับเข้า learner intelligence loop เดียวกัน</p>
      </div>

      <div className="three-layer">
        <button onClick={()=>open('learner')}>
          <span>01 · LEARNER</span>
          <b>What should I do next?</b>
          <p>Goal → Baseline → Gap → Path → Support → Outcome</p>
        </button>
        <button onClick={()=>open('advisor')}>
          <span>02 · ADVISOR</span>
          <b>Where does this learner need human support?</b>
          <p>Same learner context + shared reasoning + next best action</p>
        </button>
        <button onClick={()=>open('portfolio')}>
          <span>03 · PORTFOLIO OS</span>
          <b>What should the business change next?</b>
          <p>Aggregate learner, commercial and market signals → portfolio decisions</p>
        </button>
      </div>

      <div className="shared-loop">
        <div><span>01</span><b>Need</b></div>
        <i>→</i>
        <div><span>02</span><b>Compass</b></div>
        <i>→</i>
        <div><span>03</span><b>Path</b></div>
        <i>→</i>
        <div><span>04</span><b>Learn</b></div>
        <i>→</i>
        <div><span>05</span><b>Outcome</b></div>
        <i>→</i>
        <div><span>06</span><b>Portfolio Learning</b></div>
        <i>→</i>
        <div><span>07</span><b>Better Compass</b></div>
      </div>

      <div className="home-principle">
        <b>CATALOG</b><span>เรามีอะไรขาย?</span><i>→</i>
        <b>COMPASS</b><span>นักเรียนคนนี้ควรไปทางไหน?</span><i>→</i>
        <b>PORTFOLIO OS</b><span>เราควรเปลี่ยนอะไร เพื่อให้ recommendation รอบถัดไปดีขึ้น?</span>
      </div>
    </section>
  )
}

export default function App() {
  const [mode,setMode] = useState<Mode>('home')
  const [page,setPageState] = useState<StudentPage>('intro')

  const setPage = useCallback((next:StudentPage)=>{
    setMode('learner');setPageState(next);window.scrollTo({top:0,behavior:'smooth'})
  },[])

  const open = (next:Mode) => { setMode(next); window.scrollTo({top:0,behavior:'smooth'}) }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav">
          <button className="brand-button" onClick={()=>open('home')}><Brand/></button>
          <span className="prototype-badge">INTERVIEW PROTOTYPE</span>
          <div className="spacer"/>
          {mode==='learner' && <nav className="desktop-nav">{studentNav.map(item=><button className={page===item.id?'active':''} key={item.id} onClick={()=>setPage(item.id)}>{item.label}</button>)}</nav>}
          <div className="mode-switch">
            <button className={mode==='learner'?'active':''} onClick={()=>open('learner')}>Learner</button>
            <button className={mode==='advisor'?'active':''} onClick={()=>open('advisor')}>Advisor</button>
            <button className={mode==='portfolio'?'active':''} onClick={()=>open('portfolio')}>Portfolio OS</button>
          </div>
        </div>
      </header>
      <main>
        {mode==='home' && <Home open={open}/>}
        {mode==='learner' && <StudentExperience page={page} setPage={setPage}/>}
        {mode==='advisor' && <AdvisorConsole/>}
        {mode==='portfolio' && <PortfolioOS/>}
      </main>
      <footer>{PROTOTYPE_DISCLOSURE}</footer>
    </div>
  )
}
