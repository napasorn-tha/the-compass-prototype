import { useCallback, useState } from 'react'
import { Brand } from './components/Brand'
import PMInsights from './components/PMInsights'
import StudentExperience, { StudentPage } from './components/StudentExperience'

const nav: { id: StudentPage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About You' },
  { id: 'diagnostic', label: 'Diagnostic' },
  { id: 'compass', label: 'Your Compass' },
  { id: 'support', label: 'Support' },
  { id: 'progress', label: 'My Compass' },
]

export default function App() {
  const [page, setPageState] = useState<StudentPage>('home')
  const [pmMode, setPmMode] = useState(false)

  const setPage = useCallback((next: StudentPage) => {
    setPmMode(false)
    setPageState(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav">
          <button className="brand-button" onClick={() => setPage('home')}><Brand /></button>
          <span className="prototype-badge">PROTOTYPE</span>
          <div className="spacer" />
          <nav className="desktop-nav" aria-label="Student journey">
            {nav.map((item) => (
              <button
                className={!pmMode && page === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => setPage(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            className={'pm-toggle ' + (pmMode ? 'active' : '')}
            onClick={() => {
              setPmMode((value) => !value)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            {pmMode ? 'Student View' : 'PM View'}
          </button>
        </div>
      </header>

      <main>
        {pmMode ? <PMInsights /> : <StudentExperience page={page} setPage={setPage} />}
      </main>

      <footer>
        Prototype concept for interview discussion. Mock data only. This is not an official OnDemand product.
      </footer>
    </div>
  )
}
