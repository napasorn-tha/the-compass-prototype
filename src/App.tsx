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
    <section className="page home-page portfolio-home">
      <div className="home-hero portfolio-home-hero">
        <div>
          <div className="eyebrow">ONDEMAND PRODUCT PORTFOLIO · INTERVIEW PROTOTYPE</div>
          <h1>From Catalog<br/>to <span>Customer-Led Portfolio</span></h1>
          <p>Start with learner needs. Read performance and market signals. Make portfolio decisions with clear ownership.</p>
          <div className="actions">
            <button className="primary" onClick={()=>open('portfolio')}>Open Portfolio Overview</button>
            <button className="secondary" onClick={()=>open('learner')}>Explore Learner Journey</button>
          </div>
        </div>
        <div className="home-number">PORTFOLIO</div>
      </div>

      <div className="portfolio-home-section">
        <div className="portfolio-home-heading">
          <span>HOW THE PORTFOLIO IS MANAGED</span>
          <h2>Customer need is the starting point — not the catalog.</h2>
          <p>Use customer, commercial, outcome and market evidence together before changing the product portfolio.</p>
        </div>
        <div className="portfolio-home-steps">
          <article><span>01</span><b>Understand learner need</b><p>Goal, baseline, gap, constraints and willingness to pay.</p></article>
          <article><span>02</span><b>Read performance</b><p>Revenue, conversion, margin direction, outcome and delivery mix.</p></article>
          <article><span>03</span><b>Compare the market</b><p>Know where we are strong, where competitors are clearer, and where demand is moving.</p></article>
          <article><span>04</span><b>Decide the portfolio</b><p>Keep, grow, reposition, route better, merge, replace or retire with impact in view.</p></article>
          <article><span>05</span><b>Assign and review</b><p>Give the right Product Manager a clear direction, then review the effect of the decision.</p></article>
        </div>
      </div>

      <div className="supporting-demo-section">
        <div className="supporting-demo-copy">
          <span>SUPPORTING WALKTHROUGHS</span>
          <h2>See the customer-oriented logic behind the portfolio.</h2>
          <p>These interactive views visualize how learner needs could translate into recommendations and where an advisor may intervene. They support the portfolio story; they are not proposed replacements for existing learner systems.</p>
        </div>
        <div className="supporting-demo-cards">
          <button onClick={()=>open('learner')}>
            <span>LEARNER JOURNEY · DEMO</span>
            <b>Need → Gap → Recommended Path → Outcome</b>
            <p>Walk through one learner and see how three product options are recommended from context and readiness.</p>
            <strong>Explore learner journey →</strong>
          </button>
          <button onClick={()=>open('advisor')}>
            <span>ADVISOR VIEW · DEMO</span>
            <b>Human judgment when context matters</b>
            <p>See what an advisor would need to review, override and feed back as a portfolio signal.</p>
            <strong>View advisor intervention →</strong>
          </button>
        </div>
      </div>

      <div className="home-principle">
        <b>LEARNER NEED</b><span>What problem are we solving?</span><i>→</i>
        <b>PRODUCT CHOICE</b><span>Which existing path fits best?</span><i>→</i>
        <b>PORTFOLIO DECISION</b><span>What should change, who owns it, and what is the impact?</span>
      </div>
    </section>
  )
}

export default function App() {
  const [mode,setMode] = useState<Mode>('portfolio')
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
            <button className={mode==='portfolio'?'active':''} onClick={()=>open('portfolio')}>Portfolio</button>
            <button className={mode==='learner'?'active':''} onClick={()=>open('learner')}>Learner demo</button>
            <button className={mode==='advisor'?'active':''} onClick={()=>open('advisor')}>Advisor demo</button>
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
