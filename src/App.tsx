import { useCallback, useState } from 'react'
import { Brand } from './components/Brand'
import PortfolioOS from './components/PortfolioOS'
import StudentExperience, { StudentPage } from './components/StudentExperience'
import { PROTOTYPE_DISCLOSURE } from './data/systemContract'

type Mode = 'home' | 'learner' | 'portfolio'

const studentNav: { id: StudentPage; label: string }[] = [
  { id: 'goal', label: 'Goal' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'gap', label: 'Gap' },
  { id: 'path', label: 'Path' },
  { id: 'support', label: 'Support' },
]

function Home({open}:{open:(mode:Mode)=>void}) {
  return (
    <section className="page home-page portfolio-home">
      <div className="home-hero portfolio-home-hero">
        <div>
          <div className="eyebrow">ONDEMAND PRODUCT PORTFOLIO</div>
          <h1>From Catalog<br/>to <span>Compass</span></h1>
          <p>จัด portfolio จาก learner need, performance และ market signal — ไม่ใช่เพิ่ม SKU ตามสิ่งที่มีอยู่แล้ว</p>
          <div className="actions">
            <button className="primary" onClick={()=>open('portfolio')}>Explore Portfolio</button>
            <button className="secondary" onClick={()=>open('learner')}>Try Learner Journey</button>
          </div>
        </div>
        <div className="home-number">01</div>
      </div>

      <div className="home-story">
        <div>
          <span>01</span>
          <b>Know the learner</b>
          <p>Goal → baseline → gap</p>
        </div>
        <i>→</i>
        <div>
          <span>02</span>
          <b>Route to the right product</b>
          <p>Less choice, clearer choice</p>
        </div>
        <i>→</i>
        <div>
          <span>03</span>
          <b>Learn from the outcome</b>
          <p>What works, what does not</p>
        </div>
        <i>→</i>
        <div>
          <span>04</span>
          <b>Shape the portfolio</b>
          <p>Keep · Change · Exit</p>
        </div>
      </div>

      <div className="home-two-up">
        <article>
          <span>PORTFOLIO</span>
          <h2>What should we change next?</h2>
          <p>ดู performance, customer need, market, product overlap และ growth opportunity แล้วค่อยตัดสินใจ</p>
          <button onClick={()=>open('portfolio')}>Open portfolio →</button>
        </article>
        <article className="quiet">
          <span>LEARNER JOURNEY · DEMO</span>
          <h2>What should this learner do next?</h2>
          <p>ลองดูว่า need + baseline + gap เปลี่ยน recommendation และ support ที่เหมาะสมอย่างไร</p>
          <button onClick={()=>open('learner')}>Try the journey →</button>
        </article>
      </div>
    </section>
  )
}

export default function App() {
  const [mode,setMode] = useState<Mode>('portfolio')
  const [page,setPageState] = useState<StudentPage>('intro')

  const setPage = useCallback((next:StudentPage)=>{
    setMode('learner')
    setPageState(next)
    window.scrollTo({top:0,behavior:'smooth'})
  },[])

  const open = (next:Mode) => {
    setMode(next)
    if(next==='learner') setPageState('intro')
    window.scrollTo({top:0,behavior:'smooth'})
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav">
          <button className="brand-button" onClick={()=>open('home')}><Brand/></button>
          <span className="brand-subtitle">Portfolio Intelligence</span>
          <div className="spacer"/>
          {mode==='learner' && <nav className="desktop-nav learner-steps">{studentNav.map(item=><button className={page===item.id?'active':''} key={item.id} onClick={()=>setPage(item.id)}>{item.label}</button>)}</nav>}
          <div className="mode-switch">
            <button className={mode==='portfolio'?'active':''} onClick={()=>open('portfolio')}>Portfolio</button>
            <button className={mode==='learner'?'active secondary-mode':''} onClick={()=>open('learner')}>Learner demo</button>
          </div>
        </div>
      </header>

      <main>
        {mode==='home' && <Home open={open}/>}
        {mode==='learner' && <StudentExperience page={page} setPage={setPage}/>}
        {mode==='portfolio' && <PortfolioOS/>}
      </main>

      <footer>{PROTOTYPE_DISCLOSURE}</footer>
    </div>
  )
}
