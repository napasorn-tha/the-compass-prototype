import { useCallback, useState } from 'react'
import { Brand } from './components/Brand'
import AdvisorConsole from './components/AdvisorConsole'
import PortfolioControlTower from './components/PortfolioControlTower'
import StudentExperience, { StudentPage } from './components/StudentExperience'

type Mode = 'learner' | 'advisor' | 'portfolio'

const studentNav: { id: StudentPage; label: string }[] = [
  { id: 'home', label: 'Overview' },
  { id: 'about', label: 'Profile' },
  { id: 'diagnostic', label: 'Diagnostic' },
  { id: 'compass', label: 'Compass' },
  { id: 'support', label: 'Support' },
  { id: 'progress', label: 'Outcome' },
]

export default function App() {
  const [mode, setMode] = useState<Mode>('learner')
  const [page, setPageState] = useState<StudentPage>('home')

  const setPage = useCallback((next: StudentPage) => {
    setMode('learner')
    setPageState(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const changeMode = (next: Mode) => {
    setMode(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav">
          <button className="brand-button" onClick={() => setPage('home')}><Brand /></button>
          <span className="prototype-badge">INTERVIEW PROTOTYPE</span>
          <div className="spacer" />

          {mode === 'learner' && (
            <nav className="desktop-nav">
              {studentNav.map((item) => (
                <button className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)} key={item.id}>
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          <div className="mode-switch">
            <button className={mode === 'learner' ? 'active' : ''} onClick={() => changeMode('learner')}>Learner</button>
            <button className={mode === 'advisor' ? 'active' : ''} onClick={() => changeMode('advisor')}>Advisor</button>
            <button className={mode === 'portfolio' ? 'active' : ''} onClick={() => changeMode('portfolio')}>Portfolio</button>
          </div>
        </div>
      </header>

      <main>
        {mode === 'learner' && <StudentExperience page={page} setPage={setPage} />}
        {mode === 'advisor' && <AdvisorConsole />}
        {mode === 'portfolio' && <PortfolioControlTower />}
      </main>

      <footer>
        Prototype for interview discussion · Mock data only · Not an official OnDemand / LEARN product
      </footer>
    </div>
  )
}
