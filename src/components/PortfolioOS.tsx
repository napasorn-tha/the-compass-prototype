import { useMemo, useState } from 'react'
import {
  competitorProfiles,
  decisionSeeds,
  ecosystemCards,
  learnerDistribution,
  percent,
  productRows,
  syntheticLearners,
  voiceData,
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

function ExecutiveReadout({see,matters,decision}:{see:string;matters:string;decision:string}) {
  return (
    <div className="exec-readout">
      <div><span>WHAT WE SEE</span><b>{see}</b></div>
      <div><span>WHY IT MATTERS</span><b>{matters}</b></div>
      <div className="decision"><span>DECISION / NEXT MOVE</span><b>{decision}</b></div>
    </div>
  )
}

function Metric({label,value,definition}:{label:string;value:string;definition:string}) {
  return <article className="metric-card" title={definition}><span>{label}</span><b>{value}</b><small>{definition}</small></article>
}

function PortfolioMap() {
  const [selected, setSelected] = useState<{life:LifeStage;need:NeedState}>({life:'Upper Secondary',need:'TCAS / University'})
  const rows = productRows.filter(p=>p.lifeStage===selected.life && p.needState===selected.need)
  const subjectCounts = rows.reduce<Record<string,number>>((acc,row)=>({...acc,[row.subject]:(acc[row.subject]||0)+1}),{})
  const duplicateSubjects = Object.entries(subjectCounts).filter(([,n])=>n>1).map(([s])=>s)
  const overlap = rows.filter(r=>r.overlap==='High').length

  const see = rows.length
    ? selected.life+' · '+selected.need+' มี '+rows.length+' public offers mapped' + (duplicateSubjects.length ? ' และมีหลาย offer ในวิชา '+duplicateSubjects.join(', ') : '')
    : selected.life+' · '+selected.need+' ยังไม่มี public offer mapped ใน prototype'
  const matters = overlap
    ? 'หลาย offer อยู่ใน learner need เดียวกัน จึงต้องเช็ก proposition overlap และ cannibalization ก่อนเพิ่ม SKU'
    : rows.length ? 'จำนวน offer ไม่ได้แปลว่าซ้ำเสมอ ต้องดูต่อในระดับวิชาและ role ของแต่ละ pack' : 'อาจเป็น true gap หรือ discovery / taxonomy gap — ต้อง validate demand ก่อนสร้างของใหม่'
  const decision = overlap
    ? 'Review '+overlap+' high-overlap offer(s): MERGE / REPACKAGE / clarify role'
    : rows.length ? 'Protect distinct roles; test discovery before adding more offers' : 'Validate demand + existing hidden capability before BUILD'

  return (
    <div className="workspace-stack">
      <ExecutiveReadout see={see} matters={matters} decision={decision}/>
      <div className="workspace-intro">
        <div>
          <div className="eyebrow">PORTFOLIO MAP</div>
          <h2>Spot Portfolio Gaps & Overlap</h2>
          <p>ดูว่าแต่ละช่วงชั้น × need state มี offer อะไรอยู่แล้ว เพื่อหา <b>ช่องว่าง, SKU ซ้ำ และความเสี่ยง cannibalization</b></p>
        </div>
        <div className="legend"><span className="dot low"/>1 offer<span className="dot mid"/>2 offers<span className="dot high"/>3+ offers</div>
      </div>

      <div className="portfolio-matrix-wrap">
        <div className="portfolio-matrix">
          <div className="matrix-empty">NEED ↓ / STAGE →</div>
          {lifeStages.map(l=><div className="matrix-head" key={l}>{l}</div>)}
          {needs.map(need=>[
            <div className="matrix-label" key={need+'label'}>{need}</div>,
            ...lifeStages.map(life=>{
              const cell = productRows.filter(p=>p.lifeStage===life && p.needState===need)
              const active = selected.life===life && selected.need===need
              return <button
                key={life+need}
                className={'matrix-cell ' + (cell.length>=3?'crowded':cell.length===2?'medium':'') + (active?' active':'')}
                onClick={()=>setSelected({life,need})}
              >
                <b>{cell.length || '—'}</b><span>{cell.length ? 'public offer(s) mapped' : 'no mapped offer'}</span>
              </button>
            })
          ])}
        </div>
      </div>

      <div className="selection-panel">
        <div className="board-title red">OFFERS IN THIS NEED STATE</div>
        <h3>{selected.life} · {selected.need}</h3>
        {rows.length ? rows.map(p=><div className="selected-product" key={p.id}><div><b>{p.product}</b><span>{p.subject} · SKU {p.sku} · {p.role}</span></div><span className={'action-tag action-'+p.action.toLowerCase()}>{p.action}</span></div>) : <p className="empty-state">No mapped public offer in this prototype.</p>}
      </div>
    </div>
  )
}

function ProductPerformance() {
  const [stage,setStage] = useState<'ALL'|LifeStage>('ALL')
  const rows = stage==='ALL' ? productRows : productRows.filter(p=>p.lifeStage===stage)
  const highOverlap = rows.filter(r=>r.overlap==='High').length
  const tcasContribution = rows.filter(r=>r.needState==='TCAS / University').reduce((a,b)=>a+b.contribution,0)

  return (
    <div className="workspace-stack">
      <ExecutiveReadout
        see={(stage==='ALL'?'Portfolio':stage)+' มี '+highOverlap+' offer(s) flagged high-overlap; TCAS cluster contribution index = '+tcasContribution}
        matters="High contribution ไม่ได้แปลว่าควรเพิ่ม SKU ต่อ — overlap สูงอาจทำให้ proposition ซ้ำและแบ่งยอดกันเอง"
        decision="Review high-overlap base vs bundle offers first; grow only rolesที่ชัดและไม่แย่ง need เดียวกัน"
      />
      <div className="workspace-intro">
        <div><div className="eyebrow">PORTFOLIO & ECONOMICS</div><h2>Product Performance</h2><p>ชื่อ pack / SKU ใช้ชื่อ public catalog จริง; performance ด้านในเป็น synthetic เพื่อทดสอบ decision logic</p></div>
        <div className="filter-row">
          {(['ALL',...lifeStages] as const).map(x=><button className={stage===x?'active':''} key={x} onClick={()=>setStage(x)}>{x}</button>)}
        </div>
      </div>
      <div className="table-wrap">
        <table className="portfolio-table">
          <thead><tr><th>Public product / SKU</th><th>Subject</th><th>Need state</th><th>Learners*</th><th>Contribution*</th><th>Margin*</th><th>Overlap</th><th>Action</th></tr></thead>
          <tbody>{rows.map((p:ProductRow)=><tr key={p.id}><td><b>{p.product}</b><small>SKU {p.sku} · {p.role}</small></td><td>{p.subject}</td><td>{p.needState}</td><td>{p.learners}</td><td>{p.contribution}</td><td>{p.margin}%</td><td><span className={'risk '+p.overlap.toLowerCase()}>{p.overlap}</span></td><td><span className={'action-tag action-'+p.action.toLowerCase()}>{p.action}</span></td></tr>)}</tbody>
        </table>
      </div>
      <div className="data-note">*Synthetic commercial metrics for prototype discussion. Product names / SKU labels are mapped from the public OnDemand storefront.</div>
    </div>
  )
}

function CustomerVoice() {
  const levels = Array.from(new Set(voiceData.map(v=>v.level)))
  const [level,setLevel] = useState(levels[0])
  const levelRows = voiceData.filter(v=>v.level===level)
  const subjects = Array.from(new Set(levelRows.map(v=>v.subject)))
  const [subject,setSubject] = useState(subjects[0])
  const candidates = levelRows.filter(v=>v.subject===subject)
  const selected = candidates[0] || levelRows[0]

  const chooseLevel = (next:string) => {
    setLevel(next)
    const first = voiceData.find(v=>v.level===next)
    if(first) setSubject(first.subject)
  }

  return (
    <div className="workspace-stack">
      <ExecutiveReadout
        see={selected.takeaway}
        matters={'ความคิดเห็นถูกอ่านในบริบท '+selected.level+' · '+selected.subject+' · '+selected.pack+' ไม่ปนทุกคอร์สเข้าด้วยกัน'}
        decision={selected.implication}
      />
      <div className="workspace-intro">
        <div><div className="eyebrow">CUSTOMER VOICE</div><h2>What are learners saying — about which course?</h2><p>กรอง <b>ระดับชั้น → วิชา → pack</b> แล้วค่อยสรุป comment theme เพื่อให้ insight กลับไปถึง product ที่แก้ได้จริง</p></div>
      </div>

      <div className="voice-filters">
        <div><span>LEVEL</span>{levels.map(x=><button className={level===x?'active':''} key={x} onClick={()=>chooseLevel(x)}>{x}</button>)}</div>
        <div><span>SUBJECT</span>{Array.from(new Set(voiceData.filter(v=>v.level===level).map(v=>v.subject))).map(x=><button className={subject===x?'active':''} key={x} onClick={()=>setSubject(x)}>{x}</button>)}</div>
      </div>

      <div className="course-context">
        <div><span>COURSE / PACK</span><h3>{selected.pack}</h3><p>{selected.level} · {selected.subject} · coded sample n={selected.sample}</p></div>
        <div className="course-summary"><span>EXECUTIVE SUMMARY</span><b>{selected.takeaway}</b></div>
      </div>

      <div className="theme-grid">
        {selected.themes.map(([theme,count,detail])=><article key={String(theme)}><span>{count} mentions</span><b>{theme}</b><p>{detail}</p><div className="theme-bar"><i style={{width:(Number(count)/selected.sample*100)+'%'}}/></div></article>)}
      </div>
      <div className="data-note">Prototype coding structure: replace with a reproducible public-comment sample / internal inquiry data before treating the counts as business findings.</div>
    </div>
  )
}

function CompetitorIntel() {
  const subjects = ['Math','Physics','Chemistry','Biology','English'] as const
  const [subject,setSubject] = useState<(typeof subjects)[number]>('Math')
  const levels = ['Upper Secondary / TCAS','Lower Secondary'] as const
  const [level,setLevel] = useState<(typeof levels)[number]>('Upper Secondary / TCAS')
  const rows = competitorProfiles.filter(x=>x.subject===subject && x.level===level)
  const onDemand = rows.find(x=>x.brand==='OnDemand')
  const others = rows.filter(x=>x.brand!=='OnDemand')

  const see = rows.length
    ? subject+' · '+level+': OnDemand is compared against '+others.length+' visible competitor type(s) — '+others.map(x=>x.brand).join(', ')
    : 'No competitor set mapped for this combination yet'

  return (
    <div className="workspace-stack">
      <ExecutiveReadout
        see={see}
        matters={onDemand ? 'การแข่งขันเกิดในระดับ “วิชา × ช่วงชั้น × learner need” ไม่ใช่คู่แข่งชุดเดียวทั้ง portfolio' : 'คู่แข่งต้อง map ตาม use case ก่อนสรุป positioning'}
        decision={onDemand ? onDemand.portfolioQuestion : 'Map public offers before making a portfolio decision'}
      />
      <div className="workspace-intro"><div><div className="eyebrow">COMPETITOR INTELLIGENCE</div><h2>Compare the right competitors for the right subject</h2><p>เลือกวิชาและระดับก่อน — specialist tutor, multi-subject school และ OnDemand แข่งกันคนละมุม</p></div></div>
      <div className="voice-filters">
        <div><span>LEVEL</span>{levels.map(x=><button className={level===x?'active':''} key={x} onClick={()=>setLevel(x)}>{x}</button>)}</div>
        <div><span>SUBJECT</span>{subjects.map(x=><button className={subject===x?'active':''} key={x} onClick={()=>setSubject(x)}>{x}</button>)}</div>
      </div>
      <div className="competitor-list">
        {rows.length ? rows.map(item=><article className={'competitor-profile '+(item.brand==='OnDemand'?'owner':'')} key={item.brand+item.subject}>
          <div className="competitor-head"><div><small>{item.type}</small><h3>{item.brand}</h3></div>{item.brand==='OnDemand' && <span>OWN PORTFOLIO</span>}</div>
          <div className="visible-offer"><span>VISIBLE PUBLIC OFFER</span><b>{item.visibleOffer}</b></div>
          <div className="positioning-pills">{item.positioning.map(p=><span key={p}>{p}</span>)}</div>
          <div className="portfolio-question"><span>PORTFOLIO QUESTION</span><b>{item.portfolioQuestion}</b></div>
        </article>) : <div className="empty-state big">No mapped competitor set for this filter yet.</div>}
      </div>
      <div className="data-note">Public-offer mapping is descriptive, not a “best brand” ranking. Customer perception should be validated from review / inquiry data.</div>
    </div>
  )
}

type JourneyKey = 'ALL' | NeedState

function cohortStats(need:JourneyKey) {
  const cohort = need==='ALL' ? syntheticLearners : syntheticLearners.filter(x=>x.needState===need)
  const recommended = cohort.filter(x=>x.recommended)
  const paid = recommended.filter(x=>x.paid14d)
  return {
    cohort,
    recPaid:percent(paid.length,recommended.length),
    next:percent(cohort.filter(x=>x.nextTerm).length,cohort.length),
    cross:percent(cohort.filter(x=>x.secondSubject).length,cohort.length),
    improved:percent(cohort.filter(x=>x.outcomeImproved).length,cohort.length),
  }
}

function JourneyOutcomes() {
  const filters: JourneyKey[] = ['ALL','Foundation','Grade improvement','Competition','TCAS / University','Ongoing support']
  const [need,setNeed] = useState<JourneyKey>('ALL')
  const s = cohortStats(need)
  const tcas = cohortStats('TCAS / University')
  const ongoing = cohortStats('Ongoing support')

  let readout = 'Portfolio contains different value patterns: acquisition, learning outcome and continuation should be read together.'
  let implication = 'Balance high-urgency admission journeys with longer-duration learning journeys; do not optimize one metric across every segment.'
  if(need==='TCAS / University') {
    readout = 'TCAS cohort shows stronger immediate Rec→Paid ('+s.recPaid+'%) but lower next-term continuation ('+s.next+'%).'
    implication = 'Protect fast-conversion / brand-halo value while planning for the natural end of the exam journey.'
  } else if(need==='Ongoing support') {
    readout = 'Ongoing-learning cohort converts more slowly ('+s.recPaid+'%) but continues next term at '+s.next+'% and expands cross-subject at '+s.cross+'%.'
    implication = 'Test this journey as a retention / LTV engine: improve discovery and continuity before adding more SKUs.'
  }

  return (
    <div className="workspace-stack">
      <ExecutiveReadout
        see={readout}
        matters={'TCAS: Rec→Paid '+tcas.recPaid+'% / Next-term '+tcas.next+'% · Ongoing: Rec→Paid '+ongoing.recPaid+'% / Next-term '+ongoing.next+'%'}
        decision={implication}
      />
      <div className="workspace-intro">
        <div><div className="eyebrow">JOURNEY & OUTCOMES</div><h2>Learner Value by Need State</h2><p>ดู acquisition + learning outcome + continuation พร้อมกัน เพื่อรู้ว่า journey ไหนสร้าง value แบบไหน</p></div>
        <div className="filter-row">{filters.map(x=><button className={need===x?'active':''} key={x} onClick={()=>setNeed(x)}>{x}</button>)}</div>
      </div>
      <div className="metric-grid">
        <Metric label="Learners" value={String(s.cohort.length)} definition="Synthetic learners in selected cohort"/>
        <Metric label="Rec → Paid" value={s.recPaid+'%'} definition="Paid within 14 days ÷ learners receiving a recommended path"/>
        <Metric label="Next-term" value={s.next+'%'} definition="Learners purchasing next term ÷ eligible active learners"/>
        <Metric label="Cross-subject" value={s.cross+'%'} definition="Learners purchasing a second subject ÷ active learners"/>
        <Metric label="Outcome improved" value={s.improved+'%'} definition="Learners whose selected learning outcome improved"/>
      </div>

      <div className="value-compare">
        <article><span>ACHIEVEMENT JOURNEY</span><h3>TCAS / University</h3><div><b>{tcas.recPaid}%</b><small>Rec→Paid</small></div><div><b>{tcas.next}%</b><small>Next-term</small></div><p>High urgency · fast conversion · exam outcome / brand halo</p></article>
        <article><span>ONGOING LEARNING</span><h3>School / continuous support</h3><div><b>{ongoing.recPaid}%</b><small>Rec→Paid</small></div><div><b>{ongoing.next}%</b><small>Next-term</small></div><p>Longer relationship · continuation · cross-subject potential</p></article>
      </div>

      <div className="distribution-board">
        <div><div className="board-title black">SYNTHETIC COHORT</div><h3>430 learners for scenario testing</h3></div>
        <div className="distribution-list">{learnerDistribution.map(d=><div key={d.label+d.detail}><span><b>{d.label}</b><small>{d.detail}</small></span><div className="dist-bar"><i style={{width:(d.count/2.2)+'%'}}/></div><strong>{d.count}</strong></div>)}</div>
      </div>
      <div className="data-note">Synthetic learner / commercial data. Score distributions are loosely calibrated to public historical national education benchmarks such as O-NET / A-Level where applicable.</div>
    </div>
  )
}

function DecisionQueue() {
  const [decisions,setDecisions] = useState<Record<string,string>>({})
  const choose = (id:string, action:string) => setDecisions({...decisions,[id]:action})
  const pending = decisionSeeds.filter(item=>!decisions[item.id]).length

  return (
    <div className="workspace-stack">
      <ExecutiveReadout
        see={pending+' portfolio signal(s) still need a decision'}
        matters="Insight only creates value when it becomes a portfolio action with an owner and review cadence"
        decision="Resolve highest-overlap / clearest-evidence signals first, then assign PM ownership"
      />
      <div className="workspace-intro"><div><div className="eyebrow">PORTFOLIO DECISION</div><h2>Evidence → Decision</h2><p>Convert signals into explicit portfolio actions</p></div></div>
      <div className="decision-stack">
        {decisionSeeds.map(item=><article className="decision-card" key={item.id}>
          <div className="decision-head"><span>{item.id}</span><div><h3>{item.product}</h3><p>{item.signal}</p></div><span className="system-signal">SIGNAL · {item.suggestion}</span></div>
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
      <ExecutiveReadout
        see="International-school → Thai-university journey spans capabilities that already exist across LEARN brands"
        matters="Building a new all-in-one SKU first would duplicate capability and increase portfolio complexity"
        decision="Pilot a cross-BU path first; build only the capability gaps that remain"
      />
      <div className="workspace-intro"><div><div className="eyebrow">GROWTH & ECOSYSTEM</div><h2>Cross-BU Growth Opportunities</h2><p>Connect existing LEARN capabilities before building new products</p></div></div>
      <div className="ecosystem-flow">
        <article className="learner-need-card"><span>LEARNER NEED</span><b>International-school learner → Thai university</b><p>Thai STEM + admission navigation + possible standardized-test / English support</p></article>
        <div className="ecosystem-arrow">↓</div>
        <div className="ecosystem-grid">
          <article className="ecosystem-card owner"><small>ONDEMAND</small><h3>OnDemand</h3><p>Thai Math / Science · A-Level / TCAS preparation</p><b>Academic core</b></article>
          {ecosystemCards.map(card=><article className="ecosystem-card" key={card.brand}><small>{card.status}</small><h3>{card.brand}</h3><p>{card.capability}</p><div className="bridge-copy">{card.bridge}</div><button className={proposed.includes(card.brand)?'proposed':''} onClick={()=>toggle(card.brand)}>{proposed.includes(card.brand)?'Pilot proposed ✓':'Propose collaboration pilot'}</button></article>)}
        </div>
        <div className="ecosystem-arrow">↓</div>
        <article className="build-gap-card"><span>BUILD ONLY TRUE GAPS</span><div><b>Thai terminology module</b><b>Exam-format bridge</b><b>Private tutoring layer</b></div></article>
      </div>
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
        <div><div className="eyebrow">PRODUCT PORT LEAD · DEPUTY DEPARTMENT MANAGER</div><h1 className="section-title">Portfolio Operating System</h1><p className="lead">See the signal. Understand the implication. Make the portfolio decision.</p></div>
        <div className="section-number">03</div>
      </div>
      <div className="workspace-tabs">{workspaces.map(w=><button className={workspace===w.id?'active':''} key={w.id} onClick={()=>setWorkspace(w.id)}>{w.label}</button>)}</div>
      <div className="workspace-shell">{content}</div>
    </section>
  )
}
