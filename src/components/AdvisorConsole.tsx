import { appSnapshot } from '../data/appSnapshot'
import { intensiveGateMessage, recommendPackages } from '../data/recommendationEngine'

export default function AdvisorConsole(){
  const cases=appSnapshot.learnerCases.filter(x=>x.advisorNeeded).slice(0,8)
  const assisted=appSnapshot.learnerCases.filter(x=>x.purchaseChannel==='Advisor')
  return <section className="page">
    <div className="section-head"><div><div className="eyebrow">02 · ADVISOR / HUMAN-IN-THE-LOOP</div><h1 className="section-title">Advisor Console</h1><p className="lead">Advisor ใช้ recommendation engine เดียวกับ learner — หน้าที่คือ explain, validate และ override อย่างมีเหตุผล ไม่ใช่สร้าง logic อีกชุด</p></div><div className="section-number">02</div></div>
    <div className="ops-grid">
      <article className="board-card"><div className="board-title red">SHARED DATA SNAPSHOT</div><div className="kpi-strip"><div><b>{cases.length}</b><span>advisor cases shown</span></div><div><b>{assisted.length}</b><span>advisor purchases in sample</span></div><div><b>{appSnapshot.overall.recToPaid}%</b><span>overall Rec→Paid</span></div></div></article>
      <article className="board-card"><div className="board-title black">ADVISOR RULE</div><div className="rule-copy"><b>Explain the recommendation, then override only with evidence.</b><p>Goal → baseline → prerequisite gate → package fit → learner constraint → advisor note</p></div></article>
    </div>
    <div className="case-board">{cases.map(item=>{
      const input={stage:item.lifeStage,need:item.needState,goal:item.goalType,baselineScore:item.assessmentAvg??item.baselineScore??50,budgetBand:item.budgetBand,supportNeed:item.supportNeed,targetSchool:item.targetInstitution??'',targetFaculty:item.targetProgram??'',completedPrerequisite:false}
      const top=recommendPackages(input)[0]
      return <article className="case-card" key={item.learnerId}>
        <div className="case-top"><div><span className="case-segment">{item.segment} · {item.region}</span><h2>{item.learnerId}</h2></div><span className={'priority '+(item.supportNeed==='High'?'high':'')}>{item.supportNeed} SUPPORT</span></div>
        <div className="case-grid">
          <div><span>Goal</span><b>{item.targetProgram||item.goalType}</b></div>
          <div><span>Baseline</span><b>{item.assessmentAvg??'—'} / 100</b></div>
          <div><span>Best Match</span><b>{top?.name||'Review required'}</b></div>
          <div className="next-action"><span>Why</span><b>{top?.reason||item.reason}</b></div>
        </div>
        <div className="advisor-gate"><span>PLACEMENT GATE</span><b>{intensiveGateMessage(input)}</b></div>
      </article>
    })}</div>
    <div className="split-board"><article className="board-card"><div className="board-title red">PARENT / LEARNER EXPLANATION</div><h2>สรุปให้เข้าใจใน 30 วินาที</h2><ol className="plain-list"><li><b>Goal:</b> ไปไหน</li><li><b>Baseline:</b> ตอนนี้พร้อมแค่ไหน</li><li><b>Package:</b> ทำไมตัวนี้ fit</li><li><b>Alternative:</b> Best Value / More Support</li><li><b>Gate:</b> ทำไม intensive เข้าได้หรือยังไม่ได้</li></ol></article><article className="board-card"><div className="board-title black">OVERRIDE GOVERNANCE</div><h2>Advisor override ต้องกลับไปเป็น data</h2><div className="mini-flow"><span>System Top 3</span><i>→</i><span>Advisor override?</span><i>→</i><span>Reason</span><i>→</i><span>Purchase</span><i>→</i><span>Outcome</span></div></article></div>
  </section>
}
