import { useState } from 'react'
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

const overrideReasons=[
  'Affordability',
  'Learner confidence',
  'Parent concern',
  'Delivery constraint',
  'Timing / goal stakes',
  'Prerequisite risk',
] as const

function advisorContext(item:(typeof appSnapshot.learnerCases)[number]) {
  const reason=item.advisorNeeded
    ? item.supportNeed==='High'
      ? 'High support need'
      : item.decisionMaker==='Parent'
        ? 'Parent involvement'
        : 'Goal / decision complexity'
    : 'Learner-requested support'

  const constraint=[
    item.budgetBand && `Budget ${item.budgetBand}`,
    item.preferredMode && `Preferred mode: ${item.preferredMode}`,
  ].filter(Boolean).join(' · ')

  const parent=item.decisionMaker==='Parent' || item.decisionMaker==='Joint'
    ? 'Parent / joint decision context'
    : 'Learner-led decision'

  const support=item.supportNeed==='High'
    ? 'Start with human advisor; escalate to 1-on-1 learning support if the gap persists.'
    : item.supportNeed==='Medium'
      ? 'Keep human support available; use CLEAR / tutor escalation only if the learner stays stuck.'
      : 'Default to self-serve support; human help remains available on request.'

  return {reason,constraint,parent,support}
}

export default function AdvisorConsole() {
  const assisted=appSnapshot.learnerCases.filter(x=>x.advisorNeeded)
  const cases=assisted.slice(0,4)
  const purchased=assisted.filter(x=>x.accepted)
  const conversion=assisted.length?Math.round(purchased.length/assisted.length*100):0
  const [overrideReason,setOverrideReason]=useState<Record<string,string>>({})

  return <section className="page">
    <div className="section-head">
      <div>
        <div className="eyebrow">02 · ADVISOR / HUMAN LAYER</div>
        <h1 className="section-title">Advisor Console</h1>
        <p className="lead">Same Compass. Human support when needed.</p>
        <p className="advisor-sublead">Advisor ใช้ learner context, recommendation และ rationale ชุดเดียวกับหน้าของนักเรียน แล้วเพิ่ม human judgement เฉพาะจุดที่ uncertainty, support need, parent involvement หรือ constraints สูงขึ้น</p>
      </div>
      <div className="section-number">02</div>
    </div>

    <div className="advisor-system-flow">
      <div><span>01</span><b>LEARNER CONTEXT</b><small>goal · baseline · gap · constraints</small></div>
      <i>→</i>
      <div><span>02</span><b>COMPASS RECOMMENDATION</b><small>same shared engine</small></div>
      <i>→</i>
      <div><span>03</span><b>ADVISOR INTERVENTION</b><small>human judgement when needed</small></div>
      <i>→</i>
      <div><span>04</span><b>FEEDBACK SIGNAL</b><small>reason · override · next best action</small></div>
    </div>

    <div className="ops-grid">
      <article className="board-card">
        <div className="board-title black">CONNECTED SNAPSHOT</div>
        <div className="kpi-strip">
          <div><b>{assisted.length}</b><span>advisor-needed learners</span></div>
          <div><b>{conversion}%</b><span>accepted among assisted</span></div>
          <div><b>{appSnapshot.overall.recToPaid}%</b><span>overall Rec→Paid</span></div>
        </div>
      </article>
      <article className="board-card">
        <div className="board-title red">ADVISOR RULE</div>
        <div className="rule-copy"><b>Explain or override — never silently replace the engine.</b><p>Compass recommendation → human validation → override reason if needed → feedback signal</p></div>
      </article>
    </div>

    <div className="case-board">
      {cases.map(item=>{
        const input=toInput(item)
        const recs=recommendPackages(input)
        const best=recs[0]
        const ctx=advisorContext(item)
        const selectedReason=overrideReason[item.learnerId] || ''
        return <article className="case-card advisor-case" key={item.learnerId}>
          <div className="case-top">
            <div><span className="case-segment">{item.segment} · {item.learnerId}</span><h2>{item.targetSubject || item.goalType}</h2></div>
            <span className={'priority '+(item.advisorNeeded?'high':'medium')}>{item.advisorNeeded?'HUMAN SUPPORT':'AVAILABLE ON REQUEST'}</span>
          </div>

          <div className="advisor-case-flow">
            <section>
              <span>LEARNER CONTEXT</span>
              <div><small>Goal</small><b>{item.goalType}{item.targetInstitution ? ' · '+item.targetInstitution : ''}</b></div>
              <div><small>Baseline / gap</small><b>{input.baselineScore} · {item.reason}</b></div>
              <div><small>Support need</small><b>{item.supportNeed} · {ctx.parent}</b></div>
            </section>

            <section>
              <span>COMPASS RECOMMENDATION</span>
              <div><small>Primary path</small><b>{best?.name || '—'}</b></div>
              <div><small>Why</small><b>{best?.reason || '—'}</b></div>
              <div><small>Prerequisite</small><b>{intensiveGateMessage(input)}</b></div>
            </section>

            <section>
              <span>ADVISOR INTERVENTION</span>
              <div><small>Reason for contact</small><b>{ctx.reason}</b></div>
              <div><small>Constraint / objection</small><b>{ctx.constraint}</b></div>
              <div><small>Next best action</small><b>{ctx.support}</b></div>
            </section>

            <section className={selectedReason?'feedback-ready':''}>
              <span>FEEDBACK SIGNAL</span>
              <div><small>Override status</small><b>{selectedReason?'Override reason captured':'Compass path retained unless advisor overrides'}</b></div>
              <div><small>Portfolio evidence</small><b>{selectedReason || 'Awaiting advisor judgement'}</b></div>
            </section>
          </div>

          <div className="advisor-alternatives">
            {recs.map((r,i)=><span key={r.slot}>{i===0?'PRIMARY':'ALTERNATIVE'} · {r.slot}: {r.name}</span>)}
          </div>

          <div className="override-panel">
            <div>
              <span>ADVISOR OVERRIDE</span>
              <b>เปลี่ยน path ได้ แต่ต้องบอกว่าเพราะอะไร</b>
            </div>
            <div className="override-reasons">
              {overrideReasons.map(reason=><button
                key={reason}
                className={selectedReason===reason?'selected':''}
                onClick={()=>setOverrideReason(prev=>({...prev,[item.learnerId]:prev[item.learnerId]===reason?'':reason}))}
              >{reason}</button>)}
            </div>
          </div>
        </article>
      })}
    </div>

    <div className="split-board">
      <article className="board-card">
        <div className="board-title black">PARENT / LEARNER EXPLANATION</div>
        <h2>สรุปใน 30 วินาที</h2>
        <ol className="plain-list">
          <li><b>Goal:</b> learner พยายามไปไหน</li>
          <li><b>Readiness:</b> baseline, gap และ prerequisite พร้อมแค่ไหน</li>
          <li><b>Primary path:</b> Compass แนะนำอะไรและเพราะอะไร</li>
          <li><b>Support:</b> ต้องเพิ่ม human support ตรงไหน</li>
          <li><b>Feedback:</b> ถ้า override เกิดขึ้น เหตุผลนั้นกลับไปเป็น portfolio evidence</li>
        </ol>
      </article>
      <article className="board-card">
        <div className="board-title red">HUMAN-IN-THE-LOOP</div>
        <h2>Human judgement becomes evidence</h2>
        <div className="mini-flow"><span>Compass path</span><i>→</i><span>Advisor intervention</span><i>→</i><span>Override reason</span><i>→</i><span>Outcome</span><i>→</i><span>Portfolio learning</span></div>
        <p className="note">Prototype baseline: override choice is local UI only. Production persistence / CRM integration is intentionally out of scope.</p>
      </article>
    </div>
  </section>
}
