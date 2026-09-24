import { useMemo, useState } from 'react'
import { segmentMix, topPacks, weeklyPulse } from '../data/mock'

const filters = ['ทั้งหมด', 'ประถม', 'ม.ต้น', 'ม.ปลาย / TCAS', 'International / Bilingual / GED'] as const

export default function PortfolioControlTower() {
  const [segment, setSegment] = useState<(typeof filters)[number]>('ทั้งหมด')

  const filtered = useMemo(
    () => segment === 'ทั้งหมด' ? topPacks : topPacks.filter((item) => item.segment === segment),
    [segment],
  )

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <div className="eyebrow">03 · Portfolio operating system</div>
          <h1 className="section-title">Portfolio Control Tower</h1>
          <p className="lead">
            Weekly pulse สำหรับรู้ว่าอะไรโต อะไรเริ่มซ้ำ อะไรควรทดสอบใหม่ และตรงไหนต้องตัดสินใจ ไม่ใช่รอปลายไตรมาสค่อยเปิด Excel
          </p>
        </div>
        <div className="section-number">03</div>
      </div>

      <div className="cadence-bar">
        <div><b>WEEKLY PORTFOLIO PULSE</b><span>Prototype cadence · refresh every Monday</span></div>
        <div className="cadence-items">
          <span>Weekly: demand + funnel</span>
          <span>Monthly: portfolio review</span>
          <span>Quarterly: path + price review</span>
        </div>
      </div>

      <div className="pulse-grid">
        {weeklyPulse.map(([label, value, delta]) => (
          <article className="pulse-card" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <i className={delta.startsWith('-') ? 'down' : 'up'}>{delta}</i>
          </article>
        ))}
      </div>

      <div className="analytics-grid">
        <article className="board-card">
          <div className="board-title red">SEGMENT MIX</div>
          <h2>Portfolio ไม่ได้มีแค่ TCAS</h2>
          <div className="segment-bars">
            {segmentMix.map(([label, value]) => (
              <div className="segment-row" key={label}>
                <span>{label}</span>
                <div className="segment-track"><i style={{ width: value * 1.8 + '%' }} /></div>
                <b>{value}%</b>
              </div>
            ))}
          </div>
          <p className="note">Mock mix for prototype only. Purpose: force portfolio decisions to be segment-aware.</p>
        </article>

        <article className="board-card">
          <div className="board-title black">DECISION QUESTIONS</div>
          <div className="decision-questions">
            <p>01 · Pack ไหน enrolment โต แต่ completion แย่?</p>
            <p>02 · Pack ไหน margin ดีแต่ discovery ต่ำ?</p>
            <p>03 · SKU ไหน cannibalize กันเอง?</p>
            <p>04 · Segment ไหน repeat purchase สูง?</p>
            <p>05 · Branch / online / hybrid ต่างกันตรงไหน?</p>
            <p>06 · Recommendation ไหนส่งผลถึง outcome จริง?</p>
          </div>
        </article>
      </div>

      <article className="board-card table-board">
        <div className="table-head">
          <div>
            <div className="board-title red inline-title">WEEKLY DATA PACK</div>
            <h2>Pack & SKU performance</h2>
          </div>
          <div className="filter-row">
            {filters.map((item) => (
              <button
                className={segment === item ? 'active' : ''}
                onClick={() => setSegment(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Pack / SKU</th>
                <th>Enrollments</th>
                <th>Conversion</th>
                <th>Completion</th>
                <th>Repeat</th>
                <th>Margin</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.name}>
                  <td><span className="segment-label">{item.segment}</span></td>
                  <td><b>{item.name}</b></td>
                  <td>{item.enrollments}</td>
                  <td>{item.conversion}%</td>
                  <td>{item.completion}%</td>
                  <td>{item.repeat}%</td>
                  <td>{item.margin}%</td>
                  <td><span className={'action-tag action-' + item.action.toLowerCase()}>{item.action}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="analytics-grid bottom-grid">
        <article className="board-card">
          <div className="board-title red">ACTION QUEUE</div>
          <h2>Decision ≠ dashboard</h2>
          <div className="action-queue">
            <div><b>GROW</b><span>Physics Foundation · M2 Math Core</span></div>
            <div><b>MERGE</b><span>Mechanics Intensive → Core Physics path</span></div>
            <div><b>REPACKAGE</b><span>M3 Science Exam Pack · simplify offer</span></div>
            <div><b>PROMOTE</b><span>Science Explorer · TCAS Navigation for GED</span></div>
            <div><b>HARVEST</b><span>Legacy Full Physics</span></div>
            <div><b>TEST</b><span>Thai Academic Bridge · validate PMF</span></div>
          </div>
        </article>

        <article className="board-card">
          <div className="board-title black">GOVERNANCE RHYTHM</div>
          <h2>ให้ insight มีเจ้าของและวันตัดสินใจ</h2>
          <div className="governance">
            <div><span>MON</span><b>Weekly pulse</b><p>Demand · funnel · top packs · issue flags</p></div>
            <div><span>M1</span><b>Monthly portfolio review</b><p>Grow / Merge / Repackage / Promote / Harvest / Exit</p></div>
            <div><span>Q</span><b>Quarterly path & price review</b><p>Segment strategy · price ladder · channel economics</p></div>
          </div>
        </article>
      </div>

      <div className="prototype-warning">
        <b>Prototype data only.</b> ตัวเลขทั้งหมดใน Control Tower เป็น mock data เพื่อสาธิต operating model ไม่ใช่ข้อมูลจริงของ OnDemand / LEARN.
      </div>
    </section>
  )
}
