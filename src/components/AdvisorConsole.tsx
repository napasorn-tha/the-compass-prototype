import { appSnapshot } from '../data/appSnapshot'
import { intensiveGateMessage, recommendPackages, type RecommendationInput } from '../data/recommendationEngine'

function toInput(item:(typeof appSnapshot.learnerCases)[number]):RecommendationInput {
  return {
    stage:item.lifeStage as RecommendationInput['stage'],
    need:item.needState,
    goal:item.goalType,
    baselineScore:item.baselineScore ?? item.assessmentAvg,
    budgetBand:item.budgetBand,
    supportNeed:item.supportNeed,
    targetSchool:item.lifeStage==='Lower Secondary' ? item.targetInstitution || undefined : undefined,
    targetFaculty:item.lifeStage==='Upper Secondary' ? item.targetProgram || item.goalType : undefined,
    completedPrerequisite:false,
  }
}

export default function AdvisorConsole() {
  const cases=appSnapshot.learnerCases.slice(0,4)
  const assisted=appSnapshot.learnerCases.filter(x=>x.advisorNeeded)
  const purchased=assisted.filter(x=>x.accepted)
  const conversion=assisted.length?Math.round(purchased.length/assisted.length*100):0

  return <section className="page">
    <div className="section-head">
      <div>
        <div className="eyebrow">02 · ADVISOR / SHARED RECOMMENDATION</div>
        <h1 className="section-title">Advisor Console</h1>
        <p className="lead">Advisor ใช้ learner context และ recommendation engine ชุดเดียวกับหน้าของนักเรียน แล้วค่อยใช้ human judgement เพิ่มเติม</p>
      </div>
      <div className="section-number">02</div>
    </div>

    <div className="ops-grid">
      <article className="board-card">
        <div className="board-title red">CONNECTED SNAPSHOT</div>
        <div className="kpi-strip">
          <div><b>{assisted.length}</b><span>advisor-needed learners</span></div>
          <div><b>{conversion}%</b><span>accepted among assisted</span></div>
          <div><b>{appSnapshot.overall.recToPaid}%</b><span>overall Rec→Paid</span></div>
        </div>
      </article>
      <article className="board-card">
        <div className="board-title black">ADVISOR RULE</div>
        <div className="rule-copy"><b>Explain or override — never silently replace the engine.</b><p>Goal → baseline / prerequisite → Top 3 → rationale → advisor note / override reason</p></div>
      </article>
    </div>

    <div className="case-board">
      {cases.map(item=>{
        const input=toInput(item)
        const recs=recommendPackages(input)
        const best=recs[0]
        return <article className="case-card" key={item.learnerId}>
          <div className="case-top">
            <div><span className="case-segment">{item.segment} · {item.learnerId}</span><h2>{item.targetSubject || item.goalType}</h2></div>
            <span className={'priority '+(item.advisorNeeded?'high':'medium')}>{item.advisorNeeded?'ADVISOR':'SELF-SERVE'}</span>
          </div>
          <div className="case-grid">
            <div><span>Goal / target</span><b>{item.goalType}{item.targetInstitution ? ' · '+item.targetInstitution : ''}</b></div>
            <div><span>Baseline / gap</span><b>{input.baselineScore} · {item.reason}</b></div>
            <div><span>Best Match</span><b>{best?.name || '—'}</b></div>
            <div className="next-action"><span>Why / gate</span><b>{best?.reason || '—'} {intensiveGateMessage(input)}</b></div>
          </div>
          <div className="profile-strip">
            {recs.map(r=><span key={r.slot}>{r.slot}: {r.name}</span>)}
          </div>
        </article>
      })}
    </div>

    <div className="split-board">
      <article className="board-card">
        <div className="board-title red">PARENT / LEARNER EXPLANATION</div>
        <h2>สรุปใน 30 วินาที</h2>
        <ol className="plain-list">
          <li><b>เป้าหมาย:</b> learner พยายามไปไหน</li>
          <li><b>Readiness:</b> baseline และ prerequisite พร้อมแค่ไหน</li>
          <li><b>Top 3:</b> Best Match / Best Value / More Support</li>
          <li><b>Reason:</b> ทำไม package นี้จึงเหมาะกับ constraints นี้</li>
          <li><b>Outcome:</b> จะใช้ผลอะไรกลับมาปรับ recommendation</li>
        </ol>
      </article>
      <article className="board-card">
        <div className="board-title black">HUMAN-IN-THE-LOOP</div>
        <h2>Override ได้ แต่ต้องมีเหตุผล</h2>
        <div className="mini-flow"><span>Engine recommendation</span><i>→</i><span>Advisor validation</span><i>→</i><span>Override reason if needed</span><i>→</i><span>Purchase / no purchase</span><i>→</i><span>Outcome</span></div>
        <p className="note">Prototype baseline: recommendation logic is shared. Persisting advisor overrides is a production capability, not required for this interview build.</p>
      </article>
    </div>
  </section>
}
