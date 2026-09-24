import { advisorCases } from '../data/mock'

export default function AdvisorConsole() {
  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">02 · Advisor / Branch assisted journey</div>
          <h1 className="section-title">Advisor Console</h1>
          <p className="lead">
            ให้ advisor เห็นเหตุผลของ recommendation เดียวกับที่นักเรียนเห็น แล้วใช้เป็น shared language ในการ follow-up
          </p>
        </div>
        <div className="section-number">02</div>
      </div>

      <div className="ops-grid">
        <article className="board-card">
          <div className="board-title red">TODAY'S QUEUE</div>
          <div className="kpi-strip">
            <div><b>24</b><span>follow-ups</span></div>
            <div><b>7</b><span>high priority</span></div>
            <div><b>38%</b><span>assisted conversion</span></div>
          </div>
        </article>
        <article className="board-card">
          <div className="board-title black">ADVISOR RULE</div>
          <div className="rule-copy">
            <b>อย่าเริ่มจาก “อยากซื้อคอร์สไหน?”</b>
            <p>เริ่มจาก เป้าหมาย → gap → เวลา → delivery preference → support level</p>
          </div>
        </article>
      </div>

      <div className="case-board">
        {advisorCases.map((item) => (
          <article className="case-card" key={item.name}>
            <div className="case-top">
              <div>
                <span className="case-segment">{item.segment}</span>
                <h2>{item.name}</h2>
              </div>
              <span className={'priority ' + item.priority.toLowerCase()}>{item.priority}</span>
            </div>

            <div className="case-grid">
              <div><span>Goal</span><b>{item.goal}</b></div>
              <div><span>Signal</span><b>{item.signal}</b></div>
              <div><span>Recommended path</span><b>{item.path}</b></div>
              <div className="next-action"><span>Next best action</span><b>{item.next}</b></div>
            </div>
          </article>
        ))}
      </div>

      <div className="split-board">
        <article className="board-card">
          <div className="board-title red">PARENT VIEW</div>
          <h2>สรุปให้ผู้ปกครองเข้าใจใน 30 วินาที</h2>
          <ol className="plain-list">
            <li><b>เป้าหมาย:</b> ไปทางไหน</li>
            <li><b>Gap:</b> ตอนนี้อะไรขวางอยู่</li>
            <li><b>Path:</b> เรียนอะไรก่อน-หลัง</li>
            <li><b>Support:</b> ต้องการ self-service, teacher หรือ advisor มากแค่ไหน</li>
            <li><b>Outcome:</b> จะเช็กว่าดีขึ้นจากอะไร</li>
          </ol>
        </article>

        <article className="board-card">
          <div className="board-title black">ASSISTED JOURNEY DATA</div>
          <h2>ทุก follow-up ควรกลับไปเป็น data</h2>
          <div className="mini-flow">
            <span>Reason for contact</span><i>→</i><span>Objection</span><i>→</i><span>Support selected</span><i>→</i><span>Purchase / no purchase</span><i>→</i><span>Outcome</span>
          </div>
          <p className="note">Prototype logic: advisor interaction becomes another evidence layer for product and portfolio decisions.</p>
        </article>
      </div>
    </section>
  )
}
