import { portfolioSignals } from '../data/mock'

const FunnelRow = ({ label, value, width }: { label: string; value: string; width: number }) => (
  <div className="funnel-row">
    <span>{label}</span>
    <div className="bar"><i style={{ width: width + '%' }} /></div>
    <b>{value}</b>
  </div>
)

export default function PMInsights() {
  return (
    <section className="page pm-page">
      <div className="eyebrow">Internal product view</div>
      <h1 className="section-title">Compass Insights</h1>
      <p className="lead">
        ทุก interaction ไม่ได้แค่ช่วยนักเรียนเลือกทาง แต่สร้าง evidence สำหรับ portfolio decision ครั้งถัดไป
      </p>

      <div className="pm-shell">
        <div className="pm-grid">
          <article className="dark-card">
            <span className="muted">Prototype cohort funnel</span>
            <h2>Journey funnel</h2>
            <div className="funnel">
              <FunnelRow label="Diagnostic started" value="1,000" width={100} />
              <FunnelRow label="Completed" value="810" width={81} />
              <FunnelRow label="Path generated" value="760" width={76} />
              <FunnelRow label="Tier selected" value="520" width={52} />
              <FunnelRow label="Purchase intent" value="340" width={34} />
            </div>
          </article>

          <article className="dark-card">
            <span className="muted">Goal / path demand</span>
            <h2>What students ask for</h2>
            {[
              ['Engineering', 78, '31%'],
              ['Medicine', 66, '27%'],
              ['Business', 44, '18%'],
              ['Undecided', 28, '11%'],
            ].map(([label, width, value]) => (
              <div className="metric-row" key={String(label)}>
                <span>{label}</span>
                <div className="bar"><i style={{ width: Number(width) + '%' }} /></div>
                <b>{value}</b>
              </div>
            ))}
          </article>
        </div>

        <article className="dark-card table-card">
          <span className="muted">Mock prototype data</span>
          <h2>Portfolio signal</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module / SKU</th>
                  <th>Recommended</th>
                  <th>Conversion</th>
                  <th>Completion</th>
                  <th>Outcome lift</th>
                  <th>Cannibalization</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolioSignals.map((row) => (
                  <tr key={row[0]}>
                    {row.slice(0, 6).map((cell) => <td key={cell}>{cell}</td>)}
                    <td><span className="action-tag">{row[6]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="pm-grid">
          <article className="dark-card">
            <span className="muted">Regional behavior — mock data</span>
            <h2>Same engine, different delivery</h2>
            {[
              ['Metro self-service', 78],
              ['Provincial advisor', 64],
              ['Branch-assisted conversion', 58],
            ].map(([label, width]) => (
              <div className="metric-row" key={String(label)}>
                <span>{label}</span>
                <div className="bar"><i style={{ width: Number(width) + '%' }} /></div>
                <b>{width}</b>
              </div>
            ))}
            <p className="muted">These are prototype signals, not causal claims about regional behavior.</p>
          </article>

          <article className="dark-card">
            <span className="muted">Outcome feedback loop</span>
            <h2>One engine learns twice</h2>
            <div className="feedback-loop">
              {['Diagnostic', 'Recommendation', 'Learn', 'Mock result', 'Path update', 'Portfolio insight'].map((item, index, items) => (
                <div className="loop-item" key={item}>
                  <span>{item}</span>{index < items.length - 1 && <i>→</i>}
                </div>
              ))}
            </div>
            <p className="loop-copy">
              Every student interaction improves both the next recommendation and the next portfolio decision.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
