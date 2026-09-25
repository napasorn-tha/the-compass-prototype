import { useCallback, useState } from 'react'
import { Brand } from './components/Brand'
import AdvisorConsole from './components/AdvisorConsole'
import PortfolioOS from './components/PortfolioOS'
import StudentExperience, { StudentPage } from './components/StudentExperience'

type Mode = 'home' | 'learner' | 'advisor' | 'portfolio'

const studentNav: { id: StudentPage; label: string }[] = [
  { id: 'intro', label: 'Overview' },
  { id: 'goal', label: 'Goal & Context' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'gap', label: 'Gap Map' },
  { id: 'path', label: 'Path' },
  { id: 'outcome', label: 'Outcome' },
]

function Home({open}:{open:(mode:Mode)=>void}) {
  return (
    <section className="page home-page">
      <div className="home-hero">
        <div>
          <div className="eyebrow">ONDEMAND PRODUCT PORTFOLIO PROTOTYPE</div>
          <h1>From Catalog<br/>to <span>Compass</span></h1>
          <p>One portfolio. Different learner needs.<br/>One decision engine. Multiple journeys.</p>
          <div className="actions"><button className="primary" onClick={()=>open('learner')}>Explore Learner Journey</button><button className="secondary" onClick={()=>open('portfolio')}>Open Portfolio OS</button></div>
        </div>
        <div className="home-number">00</div>
      </div>
      <div className="three-layer">
        <button onClick={()=>open('learner')}><span>01 · LEARNER</span><b>Where should I start?</b><p>Goal + context → baseline → gap → recommended path → outcome</p></button>
        <button onClick={()=>open('advisor')}><span>02 · ADVISOR</span><b>How should I support this learner?</b><p>Shared reasoning + assisted journey + feedback signal</p></button>
        <button onClick={()=>open('portfolio')}><span>03 · PRODUCT PORT LEAD</span><b>What should OnDemand invest in next?</b><p>Portfolio + market intelligence + outcomes + decision governance</p></button>
      </div>
      <div className="home-principle"><b>CATALOG</b><span>เรามีอะไรขาย?</span><i>→</i><b>COMPASS</b><span>นักเรียนคนนี้ควรไปทางไหน?</span><i>→</i><b>PORTFOLIO OS</b><span>ควรลงทุนอะไรต่อ เพื่อพานักเรียนถึงเป้า?</span></div>
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
      <footer>Prototype for interview discussion · Internal learner/commercial data are synthetic · Public-market signals require validation before business use</footer>
    </div>
  )
}
