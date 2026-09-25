import { useMemo, useState } from 'react'
import {
  competitorSignals,
  customerSignals,
  decisionSeeds,
  ecosystemCards,
  learnerDistribution,
  percent,
  productRows,
  syntheticLearners,
  type LifeStage,
  type NeedState,
  type ProductRow,
} from '../data/v3'

type Workspace = 'map' | 'performance' | 'voice' | 'competitor' | 'journey' | 'decisions' | 'ecosystem'

const workspaces: {id:Workspace;label:string}[] = [
  {id:'map',label:'Portfolio Map'},
  {id:'performance',label:'Product Performance'},
  {id:'voice',label:'Customer Voice'},
  {id:'competitor',label:'Competitor Intel'},
  {id:'journey',label:'Journey & Outcomes'},
  {id:'decisions',label:'Decision Queue'},
  {id:'ecosystem',label:'Growth & Ecosystem'},
]

const lifeStages: LifeStage[] = ['Primary','Lower Secondary','Upper Secondary']
const needs: NeedState[] = ['Foundation','Grade improvement','Entrance','Competition','TCAS / University','Ongoing support']

function Metric({label,value,definition}:{label:string;value:string;definition:string}) {
  return <article className="metric-card" title={definition}><span>{label}</span><b>{value}</b><small>{definition}</small></article>
}

function PortfolioMap() {
  const [selected, setSelected] = useState<{life:LifeStage;need:NeedState} | null>({life:'Upper Secondary',need:'TCAS / University'})
  const rows = selected ? productRows.filter(p=>p.lifeStage===selected.life && p.needState===selected.need) : []

  return (
    <div className="workspace-stack">
      <div className="workspace-intro">
        <div><div className="eyebrow">PORTFOLIO MAP</div><h2>Life stage × Need state</h2><p>ดูพอร์ตตามปัญหาของผู้เรียน ไม่ใช่ตามชื่อ SKU ภายใน</p></div>
        <div className="legend"><span className="dot low"/>1 offer<span className="dot mid"/>2 offers<span className="dot high"/>3+ offers / overlap risk</div>
      </div>

      <div className="portfolio-matrix-wrap">
        <div className="portfolio-matrix">
          <div className="matrix-empty">NEED ↓ / STAGE →</div>
          {lifeStages.map(l=><div className="matrix-head" key={l}>{l}</div>)}
          {needs.map(need=>[
            <div className="matrix-label" key={need+'label'}>{need}</div>,
            ...lifeStages.map(life=>{
              const cell = productRows.filter(p=>p.lifeStage===life && p.needState===need)
              const active = selected?.life===life && selected.need===need
              return <button
                key={life+need}
                className={'matrix-cell ' + (cell.length>=3?'crowded':cell.length===2?'medium':'') + (active?' active':'')}
                onClick={()=>setSelected({life,need})}
              >
                <b>{cell.length || '—'}</b><span>{cell.length ? 'offer(s)' : 'gap / no mapped offer'}</span>
              </button>
            })
          ])}
        </div>
      </div>

      <div className="selection-panel">
        <div className="board-title red">SELECTED CELL</div>
        {selected && <>
          <h3>{selected.life} · {selected.need}</h3>
          {rows.length ? rows.map(p=><div className="selected-product" key={p.id}><div><b>{p.product}</b><span>{p.role}</span></div><span className={'action-tag action-'+p.action.toLowerCase()}>{p.action}</span></div>) : <p className="empty-state">ยังไม่มี offer ที่ map ไว้ใน prototype — จุดนี้ควรถามว่าเป็น real gap หรือแค่ taxonomy ยังไม่ครบ?</p>}
        </>}
      </div>
    </div>
  )
}

function ProductPerformance() {
  const [stage,setStage] = useState<'ALL'|LifeStage>('ALL')
  const rows = stage==='ALL' ? productRows : productRows.filter(p=>p.lifeStage===stage)
  return (
    <div className="workspace-stack">
      <div className="workspace-intro">
        <div><div className="eyebrow">PORTFOLIO & ECONOMICS</div><h2>Product Performance</h2><p>ดู performance พร้อม journey role และ overlap ก่อนตัดสินใจว่าจะโต รวม หรือจัดแพ็กใหม่</p></div>
        <div className="filter-row">
          {(['ALL',...lifeStages] as const).map(x=><button className={stage===x?'active':''} key={x} onClick={()=>setStage(x)}>{x}</button>)}
        </div>
      </div>
      <div className="table-wrap">
        <table className="portfolio-table">
          <thead><tr><th>Product</th><th>Need state</th><th>Synthetic learners</th><th>Contribution index</th><th>Margin</th><th>Overlap</th><th>Action</th></tr></thead>
          <tbody>{rows.map((p:ProductRow)=><tr key={p.id}><td><b>{p.product}</b><small>{p.role}</small></td><td>{p.needState}</td><td>{p.learners}</td><td>{p.contribution}</td><td>{p.margin}%</td><td><span className={'risk '+p.overlap.toLowerCase()}>{p.overlap}</span></td><td><span className={'action-tag action-'+p.action.toLowerCase()}>{p.action}</span></td></tr>)}</tbody>
        </table>
      </div>
      <div className="data-note">Internal commercial metrics are synthetic prototype data. Public course / market mapping is illustrative and should be replaced with internal SKU data if available.</div>
    </div>
  )
}

function CustomerVoice() {
  const [selected,setSelected] = useState(customerSignals[0])
  return (
    <div className="workspace-stack">
      <div className="workspace-intro"><div><div className="eyebrow">MARKET & DATA INTELLIGENCE</div><h2>Customer Voice by Aspect</h2><p>ไม่ใช้ sentiment รวมอย่างเดียว — แยกว่า foundation, pace, practice, support และ value กำลังบอกอะไร</p></div></div>
      <div className="voice-layout">
        <div className="signal-list">
          {customerSignals.map(s=><button key={s.aspect} className={selected.aspect===s.aspect?'active':''} onClick={()=>setSelected(s)}><span>{s.status}</span><b>{s.aspect}</b><small>{s.source}</small></button>)}
        </div>
        <article className="signal-detail">
          <span className="hypothesis-badge">{selected.status}</span>
          <h3>{selected.aspect}</h3>
          <p>{selected.signal}</p>
          <div className="implication"><span>PORTFOLIO QUESTION</span><b>{selected.implication}</b></div>
          <p className="data-note">Signal text is a prototype classification pattern. Validate with a reproducible public-comment sample before presenting as a market finding.</p>
        </article>
      </div>
    </div>
  )
}

function CompetitorIntel() {
  const dimensions = [
    ['Foundation clarity','foundation'],
    ['Practice volume','practice'],
    ['Exam alignment','exam'],
    ['Price / value','value'],
    ['Support layer','support'],
  ] as const
  return (
    <div className="workspace-stack">
      <div className="workspace-intro"><div><div className="eyebrow">COMPETITOR INTELLIGENCE</div><h2>What are customers comparing?</h2><p>ใช้ public discussion เพื่อหา decision criteria ไม่ใช่ทำ ranking ใคร “ดีที่สุด”</p></div></div>
      <div className="competitor-grid">
        {competitorSignals.map(item=><article className="competitor-card" key={item.brand}><h3>{item.brand}</h3>{dimensions.map(([label,key])=><div className="intel-row" key={key}><span>{label}</span><div><i style={{width:item[key]+'%'}}/></div><b>{item[key]}</b></div>)}<p>{item.note}</p></article>)}
      </div>
      <div className="logic-callout"><b>Use this to ask where OnDemand should reposition, repackage or protect a strength.</b><span>Not a public ranking; all comparative perception signals require validation.</span></div>
    </div>
  )
}

function JourneyOutcomes() {
  const [segment,setSegment] = useState<'ALL'|LifeStage>('ALL')
  const cohort = segment==='ALL' ? syntheticLearners : syntheticLearners.filter(x=>x.lifeStage===segment)
  const recommended = cohort.filter(x=>x.recommended)
  const paid = recommended.filter(x=>x.paid14d)
  const next = cohort.filter(x=>x.nextTerm)
  const cross = cohort.filter(x=>x.secondSubject)
  const improved = cohort.filter(x=>x.outcomeImproved)

  return (
    <div className="workspace-stack">
      <div className="workspace-intro">
        <div><div className="eyebrow">CUSTOMER & JOURNEY</div><h2>Journey & Outcomes</h2><p>metric ทุกตัวมี denominator และ window ชัด ไม่โชว์ “conversion 48%” ลอย ๆ</p></div>
        <div className="filter-row">{(['ALL',...lifeStages] as const).map(x=><button className={segment===x?'active':''} key={x} onClick={()=>setSegment(x)}>{x}</button>)}</div>
      </div>
      <div className="metric-grid">
        <Metric label="Learners" value={String(cohort.length)} definition="Synthetic learners in selected cohort"/>
        <Metric label="Rec → Paid" value={percent(paid.length,recommended.length)+'%'} definition="Paid within 14 days ÷ learners receiving a recommended path"/>
        <Metric label="Next-term" value={percent(next.length,cohort.length)+'%'} definition="Learners purchasing next term ÷ eligible active learners"/>
        <Metric label="Cross-subject" value={percent(cross.length,cohort.length)+'%'} definition="Learners purchasing a second subject ÷ active learners"/>
        <Metric label="Outcome improved" value={percent(improved.length,cohort.length)+'%'} definition="Learners whose selected learning outcome improved in the prototype cohort"/>
      </div>

      <div className="distribution-board">
        <div><div className="board-title black">SYNTHETIC COHORT</div><h3>430 learners for interaction testing</h3></div>
        <div className="distribution-list">{learnerDistribution.map(d=><div key={d.label+d.detail}><span><b>{d.label}</b><small>{d.detail}</small></span><div className="dist-bar"><i style={{width:(d.count/2.2)+'%'}}/></div><strong>{d.count}</strong></div>)}</div>
      </div>
      <div className="data-note">Prototype note: learner and commercial data are synthetic. Score distributions are calibrated conceptually using historical public education benchmarks such as national O-NET / A-Level statistics where applicable; they are not school-level performance claims.</div>
    </div>
  )
}

function DecisionQueue() {
  const [decisions,setDecisions] = useState<Record<string,string>>({})
  const choose = (id:string, action:string) => setDecisions({...decisions,[id]:action})

  return (
    <div className="workspace-stack">
      <div className="workspace-intro"><div><div className="eyebrow">PORTFOLIO DECISION</div><h2>Evidence → Decision</h2><p>ระบบเสนอ signal ได้ แต่ Product Port Lead เป็นคนตัดสินใจและ assign owner</p></div></div>
      <div className="decision-stack">
        {decisionSeeds.map(item=><article className="decision-card" key={item.id}>
          <div className="decision-head"><span>{item.id}</span><div><h3>{item.product}</h3><p>{item.signal}</p></div><span className="system-signal">SYSTEM SIGNAL · {item.suggestion}</span></div>
          <div className="evidence-line"><span>EVIDENCE</span><b>{item.evidence}</b></div>
          <div className="decision-actions">
            {['GROW','MERGE','REPACKAGE','PROMOTE','HARVEST','EXIT'].map(a=><button className={decisions[item.id]===a?'active':''} key={a} onClick={()=>choose(item.id,a)}>{a}</button>)}
          </div>
          {decisions[item.id] && <div className="decision-confirmed">Decision: <b>{decisions[item.id]}</b> · Owner: PM workstream · Next review: Monthly Portfolio Review</div>}
        </article>)}
      </div>
    </div>
  )
}

function Ecosystem() {
  const [proposed,setProposed] = useState<string[]>([])
  const toggle = (brand:string) => setProposed(proposed.includes(brand)?proposed.filter(x=>x!==brand):[...proposed,brand])
  return (
    <div className="workspace-stack">
      <div className="workspace-intro"><div><div className="eyebrow">GROWTH & ECOSYSTEM</div><h2>Orchestrate first. Build second.</h2><p>OnDemand Portfolio Lead ถือ OnDemand portfolio — Ignite, TCASter และ Premier Prep แสดงเป็น partner BU / collaboration opportunity เท่านั้น</p></div></div>
      <div className="ecosystem-flow">
        <article className="learner-need-card"><span>LEARNER NEED</span><b>International-school learner → Thai university</b><p>Needs Thai STEM + admission navigation + possible standardized-test / English support</p></article>
        <div className="ecosystem-arrow">↓</div>
        <div className="ecosystem-grid">
          <article className="ecosystem-card owner"><small>PORTFOLIO OWNER</small><h3>OnDemand</h3><p>Thai Math / Science · A-Level / TCAS preparation</p><b>Owned scope</b></article>
          {ecosystemCards.map(card=><article className="ecosystem-card" key={card.brand}><small>{card.scope}</small><h3>{card.brand}</h3><p>{card.capability}</p><div className="bridge-copy">{card.bridge}</div><button className={proposed.includes(card.brand)?'proposed':''} onClick={()=>toggle(card.brand)}>{proposed.includes(card.brand)?'Pilot proposed ✓':'Propose collaboration pilot'}</button></article>)}
        </div>
        <div className="ecosystem-arrow">↓</div>
        <article className="build-gap-card"><span>BUILD ONLY TRUE GAPS</span><div><b>Thai terminology module</b><b>Exam-format bridge</b><b>Private tutoring layer</b></div></article>
      </div>
      <div className="data-note">Cross-BU path is a proposed pilot. It does not imply management authority over partner BU portfolios.</div>
    </div>
  )
}

export default function PortfolioOS() {
  const [workspace,setWorkspace] = useState<Workspace>('map')
  const content = useMemo(()=>{
    if(workspace==='map') return <PortfolioMap/>
    if(workspace==='performance') return <ProductPerformance/>
    if(workspace==='voice') return <CustomerVoice/>
    if(workspace==='competitor') return <CompetitorIntel/>
    if(workspace==='journey') return <JourneyOutcomes/>
    if(workspace==='decisions') return <DecisionQueue/>
    return <Ecosystem/>
  },[workspace])

  return (
    <section className="page portfolio-page">
      <div className="section-head">
        <div><div className="eyebrow">PRODUCT PORT LEAD · DEPUTY DEPARTMENT MANAGER</div><h1 className="section-title">Portfolio Operating System</h1><p className="lead">Insight → Priority → PM ownership → Cross-functional execution → Outcome → Portfolio decision</p></div>
        <div className="section-number">03</div>
      </div>
      <div className="workspace-tabs">{workspaces.map(w=><button className={workspace===w.id?'active':''} key={w.id} onClick={()=>setWorkspace(w.id)}>{w.label}</button>)}</div>
      <div className="workspace-shell">{content}</div>
    </section>
  )
}
