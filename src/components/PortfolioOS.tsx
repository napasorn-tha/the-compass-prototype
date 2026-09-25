import { useMemo, useState } from 'react'
import {
  catalogOffers,
  competitorProfiles,
  customerVoiceRecords,
  decisionQueue,
  ecosystemRoutes,
  learnerDistribution,
  needStates,
  percent,
  syntheticLearners,
  type LifeStage,
  type NeedState,
} from '../data/v3'
import '../portfolio-v4.css'

type Workspace = 'performance' | 'voice' | 'competitor' | 'journey' | 'tracking' | 'decisions'

const workspaces: {id:Workspace;label:string}[] = [
  {id:'performance',label:'Portfolio Performance'},
  {id:'voice',label:'Customer Voice'},
  {id:'competitor',label:'Competitor Intel'},
  {id:'journey',label:'Journey & Outcomes'},
  {id:'tracking',label:'Package Tracking'},
  {id:'decisions',label:'Decision Queue'},
]

function Readout({see,matters,decision}:{see:string;matters:string;decision:string}) {
  return <div className="p4-readout">
    <div><span>WHAT WE SEE</span><b>{see}</b></div>
    <div><span>WHY IT MATTERS</span><b>{matters}</b></div>
    <div className="p4-decision"><span>NEXT PORTFOLIO MOVE</span><b>{decision}</b></div>
  </div>
}


function PortfolioPerformance() {
  const overall = stats('ALL')
  const tcas = stats('TCAS / University')
  const ongoing = stats('Ongoing support')
  const reviewCount = decisionQueue.length

  const packageRows = [
    {name:"Pack V-Series Physics TCAS + Upskill ฟิสิกส์ A-Level (Dek70)",segment:'TCAS · Physics',revenue:'฿2.8M',trend:'+11%',conversion:'74%',margin:'61%',outcome:'73%',signal:'GROW / WATCH OVERLAP'},
    {name:"Pack Math Admission TCAS + UpSkill คณิต A-Level V.71",segment:'TCAS · Math',revenue:'฿2.5M',trend:'+8%',conversion:'71%',margin:'59%',outcome:'70%',signal:'WATCH NAMING'},
    {name:'Pack 1 คณิตศาสตร์ ม.ปลาย (8201-8204)',segment:'Upper Sec · Math',revenue:'฿1.9M',trend:'+4%',conversion:'55%',margin:'56%',outcome:'68%',signal:'GROW'},
    {name:'Pack Essential ปูพื้นฐานภาษาอังกฤษ ม.ปลาย',segment:'Upper Sec · English',revenue:'฿1.1M',trend:'-3%',conversion:'49%',margin:'52%',outcome:'66%',signal:'PROMOTE / ROUTE'},
    {name:'Pack 1 คณิตศาสตร์ ม.ต้น (8101-8102)',segment:'Lower Sec · Math',revenue:'฿0.9M',trend:'+2%',conversion:'56%',margin:'53%',outcome:'69%',signal:'KEEP / ROUTE'},
  ]

  return <div className="p4-stack">
    <Readout
      see={'TCAS drives the strongest immediate conversion ('+tcas.recPaid+'%), while ongoing learning shows stronger continuation ('+ongoing.next+'% next-term).'}
      matters="Portfolio value is coming from different engines: admission urgency now, continuity and cross-subject potential over time."
      decision={reviewCount+' package / pathway signals need review; protect growth while fixing routing and overlap before adding new packages.'}
    />

    <div className="p4-intro">
      <div><div className="eyebrow">PORTFOLIO PERFORMANCE</div><h2>Current portfolio health — one meeting view</h2><p>เปิดหน้าเดียวเพื่อเห็น <b>business performance, learner outcome และ package signals ที่ต้องสนใจตอนนี้</b></p></div>
      <div className="p4-kpi"><span>ACTIVE REVIEW SIGNALS</span><b>{reviewCount}</b><small>move to Decision Queue when action is required</small></div>
    </div>

    <div className="p4-metrics">
      <article><span>Paid learners*</span><b>{Math.round(overall.cohort.length*overall.recPaid/100)}</b><small>illustrative monthly snapshot</small></article>
      <article><span>Rec → Paid*</span><b>{overall.recPaid}%</b><small>paid within 14d ÷ recommended</small></article>
      <article><span>Next-term*</span><b>{overall.next}%</b><small>eligible learners continuing</small></article>
      <article><span>Cross-subject*</span><b>{overall.cross}%</b><small>second subject ÷ active learners</small></article>
      <article><span>Outcome improved*</span><b>{overall.improved}%</b><small>selected learning outcome improved</small></article>
    </div>

    <div className="p4-performance-split">
      <article>
        <span>ACHIEVEMENT ENGINE</span>
        <h3>TCAS / University</h3>
        <b>{tcas.recPaid}% Rec→Paid</b>
        <p>Fast conversion · exam outcome · brand halo</p>
      </article>
      <article>
        <span>RELATIONSHIP ENGINE</span>
        <h3>Ongoing Learning</h3>
        <b>{ongoing.next}% Next-term</b>
        <p>Continuation · cross-subject · longer learner relationship</p>
      </article>
    </div>

    <div className="p4-performance-table">
      <div className="p4-performance-head"><span>PACKAGE</span><span>REVENUE*</span><span>TREND*</span><span>REC→PAID*</span><span>MARGIN*</span><span>OUTCOME*</span><span>CURRENT SIGNAL</span></div>
      {packageRows.map(row=><div className="p4-performance-row" key={row.name}>
        <div><b>{row.name}</b><small>{row.segment}</small></div>
        <span>{row.revenue}</span><span>{row.trend}</span><span>{row.conversion}</span><span>{row.margin}</span><span>{row.outcome}</span><strong>{row.signal}</strong>
      </div>)}
    </div>

    <div className="data-note">*Synthetic internal performance data for prototype discussion. Package names are mapped from OnDemand public catalog / storefront.</div>
  </div>
}

function PackageTracking() {
  const [stage,setStage] = useState<LifeStage>('Upper Secondary')
  const subjectOptions = Array.from(new Set(catalogOffers.filter(x=>x.stage===stage).map(x=>x.subject)))
  const [subject,setSubject] = useState('Physics')
  const [need,setNeed] = useState<NeedState | 'ALL'>('ALL')

  const safeSubject = subjectOptions.includes(subject) ? subject : subjectOptions[0]
  const visible = catalogOffers.filter(x =>
    x.stage===stage &&
    x.subject===safeSubject &&
    (need==='ALL' || x.needTags.includes(need))
  )
  const families = Array.from(new Set(visible.map(x=>x.family)))
  const logics = Array.from(new Set(visible.flatMap(x=>x.decisionLogics)))
  const confusions = visible.filter(x=>x.issue==='DISCOVERY_CONFUSION').length
  const overlaps = visible.filter(x=>x.issue==='OVERLAP_REVIEW').length

  const switchStage = (next:LifeStage) => {
    setStage(next)
    const first = catalogOffers.find(x=>x.stage===next)
    if(first) setSubject(first.subject)
    setNeed('ALL')
  }

  const see = visible.length
    ? stage+' · '+safeSubject+' มี '+visible.length+' public offers ใน '+families.length+' product families'
    : 'ไม่มี public offer mapped ใน filter นี้'
  const matters = (confusions+overlaps)>0
    ? 'พบ '+confusions+' discovery-confusion item(s) และ '+overlaps+' overlap-review item(s) — ต้องแยกว่า “สินค้าซ้ำจริง” หรือ “ต่างแต่ลูกค้าแยกไม่ออก”'
    : 'โครงสร้างสินค้าดูมี role แยกชัดใน public snapshot นี้'
  const decision = overlaps>0
    ? 'ดู attach / substitution / outcome ก่อน MERGE; ถ้าต่างกันจริงให้ REPOSITION หรือ ROUTE BETTER'
    : confusions>0 ? 'รักษา modularity หลังบ้าน แต่ simplify entry point ที่หน้าบ้าน' : 'KEEP structure; monitor discovery and performance'

  return <div className="p4-stack">
    <Readout see={see} matters={matters} decision={decision}/>

    <div className="p4-intro">
      <div><div className="eyebrow">PACKAGE TRACKING</div><h2>Package reference, overlap & bridge opportunities</h2>
        <p>หน้าสนับสนุนก่อนตัดสินใจ: ดูว่า package ไหน <b>target ซ้ำ, content ใกล้กัน, มี routing constraint หรือควร bridge / top-up กับ capability อื่น</b></p>
      </div>
      <div className="p4-kpi"><span>TRACKING SNAPSHOT</span><b>{families.length}</b><small>product families in selected view</small></div>
    </div>

    <div className="p4-filterbox">
      <div><span>STAGE</span>{(['Primary','Lower Secondary','Upper Secondary'] as LifeStage[]).map(x=><button className={stage===x?'active':''} onClick={()=>switchStage(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{subjectOptions.map(x=><button className={safeSubject===x?'active':''} onClick={()=>{setSubject(x);setNeed('ALL')}} key={x}>{x}</button>)}</div>
      <div><span>NEED OVERLAY</span><button className={need==='ALL'?'active':''} onClick={()=>setNeed('ALL')}>ALL</button>{needStates.map(x=><button className={need===x?'active':''} onClick={()=>setNeed(x)} key={x}>{x}</button>)}</div>
    </div>

    <div className="p4-complexity">
      <div><span>DECISION LOGICS EXPOSED</span><b>{logics.length}</b><p>{logics.length ? logics.join(' · ') : '—'}</p></div>
      <div><span>DISCOVERY CONFUSION</span><b>{confusions}</b><p>different offers / labels may be valid, but entry point is not self-evident</p></div>
      <div><span>OVERLAP TO REVIEW</span><b>{overlaps}</b><p>requires attach / substitution / content-overlap evidence before merge</p></div>
    </div>

    <div className="p4-familygrid">
      {families.map(family=>{
        const rows = visible.filter(x=>x.family===family)
        return <article className="p4-family" key={family}>
          <div className="p4-familyhead"><div><span>PRODUCT FAMILY</span><h3>{family}</h3></div><b>{rows.length} offers</b></div>
          <div className="p4-layerlist">
            {rows.map(item=><div className={'p4-offer p4-'+item.issue.toLowerCase()} key={item.id}>
              <div className="p4-layer">{item.layer}</div>
              <div className="p4-offermain"><b>{item.name}</b><small>SKU {item.sku}{item.price ? ' · ฿'+item.price.toLocaleString() : ''}</small><div>{item.needTags.map(t=><span key={t}>{t}</span>)}</div></div>
              <div className="p4-issue">{item.issue==='CLEAR_ROLE'?'CLEAR ROLE':item.issue==='DISCOVERY_CONFUSION'?'DISCOVERY CONFUSION':'OVERLAP REVIEW'}</div>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">source ↗</a>
            </div>)}
          </div>
        </article>
      })}
      {!families.length && <div className="p4-empty">No mapped public offer for this filter. Validate whether this is a true gap or just an incomplete public snapshot.</div>}
    </div>

    <div className="p4-principle">
      <b>Tracking rule:</b>
      <span>Similar target ≠ cannibalization automatically.</span>
      <i>Different role + clear choice → KEEP</i>
      <i>Different role + customer confusion → REPOSITION / ROUTE BETTER</i>
      <i>Same job + real substitution → MERGE / REPACKAGE</i>
    </div>

    <div className="p4-bridge-tracking">
      <div className="p4-intro"><div><div className="eyebrow">BRIDGE / TOP-UP WATCH</div><h2>Potential sister-company connections</h2><p>เก็บเป็น supporting signal ของ package tracking — ไม่ใช่หน้าแยก</p></div></div>
      {ecosystemRoutes.map(route=><article key={route.id}>
        <div><span>TRIGGER</span><b>{route.trigger}</b><small>{route.learner}</small></div>
        <div><span>ONDEMAND PATH</span><b>{route.ownedPath}</b></div>
        <div><span>POTENTIAL BRIDGE / TOP-UP</span>{route.bridges.map(b=><strong key={b.brand}>{b.brand} — {b.role}</strong>)}</div>
        <div><span>GAP / CONSTRAINT</span><b>{route.buildOnlyIf}</b></div>
      </article>)}
    </div>
  </div>
}

function CustomerVoice() {
  const stages = Array.from(new Set(customerVoiceRecords.map(x=>x.stage)))
  const [stage,setStage] = useState(stages[0])
  const stageRows = customerVoiceRecords.filter(x=>x.stage===stage)
  const subjects = Array.from(new Set(stageRows.map(x=>x.subject)))
  const [subject,setSubject] = useState(subjects[0])
  const selected = customerVoiceRecords.find(x=>x.stage===stage && x.subject===subject) || stageRows[0]

  const chooseStage=(x:string)=>{
    setStage(x)
    const first = customerVoiceRecords.find(v=>v.stage===x)
    if(first)setSubject(first.subject)
  }

  return <div className="p4-stack">
    <Readout see={selected.takeaway} matters={'Insight ผูกกับ '+selected.stage+' · '+selected.subject+' · '+selected.pack+' ไม่ใช่สรุปทั้งแบรนด์รวมกัน'} decision={selected.implication}/>
    <div className="p4-intro"><div><div className="eyebrow">CUSTOMER VOICE</div><h2>Who said what — about which course?</h2><p>ระดับชั้น → วิชา → pack → comment theme → portfolio implication</p></div></div>
    <div className="p4-filterbox">
      <div><span>STAGE</span>{stages.map(x=><button className={stage===x?'active':''} onClick={()=>chooseStage(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{Array.from(new Set(customerVoiceRecords.filter(v=>v.stage===stage).map(v=>v.subject))).map(x=><button className={subject===x?'active':''} onClick={()=>setSubject(x)} key={x}>{x}</button>)}</div>
    </div>
    <div className="p4-packcontext"><span>COURSE / PACK</span><h3>{selected.pack}</h3><p>Coded sample n={selected.sample} · prototype structure</p></div>
    <div className="p4-themegrid">
      {selected.themes.map(([theme,count,detail])=><article key={String(theme)}><span>{count} mentions</span><b>{theme}</b><p>{detail}</p><div><i style={{width:(Number(count)/selected.sample*100)+'%'}}/></div></article>)}
    </div>
    <div className="data-note">Comment counts are synthetic placeholders for the interaction model. Replace with reproducible public-review / inquiry coding before treating prevalence as a business finding.</div>
  </div>
}

function CompetitorIntel() {
  const subjects = ['Math','Physics','Chemistry','Biology','English'] as const
  const [subject,setSubject] = useState<(typeof subjects)[number]>('Math')
  const levels = ['Upper Secondary / TCAS','Lower Secondary'] as const
  const [level,setLevel] = useState<(typeof levels)[number]>('Upper Secondary / TCAS')
  const rows = competitorProfiles.filter(x=>x.subject===subject && x.level===level)
  const others = rows.filter(x=>x.brand!=='OnDemand')

  return <div className="p4-stack">
    <Readout
      see={rows.length ? subject+' · '+level+' มี competitor set เฉพาะ use case: '+others.map(x=>x.brand).join(', ') : 'ยังไม่มี competitor set ใน filter นี้'}
      matters="คู่แข่งของคณิต ม.ปลาย ไม่ควรเป็นชุดเดียวกับชีวะ TCAS หรือฟิสิกส์ ม.ต้น"
      decision="Compare proposition / entry point / practice layer แบบ apples-to-apples แล้วค่อยตัดสิน reposition"
    />
    <div className="p4-intro"><div><div className="eyebrow">COMPETITOR INTELLIGENCE</div><h2>Subject × Stage × Need</h2><p>เทียบกับคู่แข่งที่ลูกค้ากำลังเลือกจริงในวิชาและช่วงชั้นนั้น</p></div></div>
    <div className="p4-filterbox">
      <div><span>LEVEL</span>{levels.map(x=><button className={level===x?'active':''} onClick={()=>setLevel(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{subjects.map(x=><button className={subject===x?'active':''} onClick={()=>setSubject(x)} key={x}>{x}</button>)}</div>
    </div>
    <div className="p4-competitors">
      {rows.map(item=><article className={item.brand==='OnDemand'?'owner':''} key={item.brand+item.subject}>
        <div className="p4-chead"><div><small>{item.type}</small><h3>{item.brand}</h3></div>{item.brand==='OnDemand'&&<span>ONDEMAND</span>}</div>
        <div className="p4-visible"><span>VISIBLE OFFER</span><b>{item.visibleOffer}</b></div>
        <div className="p4-pills">{item.positioning.map(p=><span key={p}>{p}</span>)}</div>
        <div className="p4-question"><span>PORTFOLIO QUESTION</span><b>{item.portfolioQuestion}</b></div>
      </article>)}
      {!rows.length&&<div className="p4-empty">No competitor mapping in this filter yet.</div>}
    </div>
    <div className="data-note">Descriptive public-offer mapping — not a brand ranking. Perception claims require review / inquiry evidence.</div>
  </div>
}

type JourneyKey = 'ALL' | NeedState
function stats(need:JourneyKey) {
  const cohort=need==='ALL'?syntheticLearners:syntheticLearners.filter(x=>x.needState===need)
  const rec=cohort.filter(x=>x.recommended)
  const paid=rec.filter(x=>x.paid14d)
  return {
    cohort,
    recPaid:percent(paid.length,rec.length),
    next:percent(cohort.filter(x=>x.nextTerm).length,cohort.length),
    cross:percent(cohort.filter(x=>x.secondSubject).length,cohort.length),
    improved:percent(cohort.filter(x=>x.outcomeImproved).length,cohort.length),
  }
}

function JourneyOutcomes() {
  const filters:JourneyKey[]=['ALL','Foundation','Grade improvement','Competition','TCAS / University','Ongoing support']
  const [need,setNeed]=useState<JourneyKey>('ALL')
  const s=stats(need), tcas=stats('TCAS / University'), ongoing=stats('Ongoing support')
  const see = need==='TCAS / University'
    ? 'TCAS: Rec→Paid '+s.recPaid+'% สูง แต่ Next-term '+s.next+'% ต่ำตามธรรมชาติของ exam lifecycle'
    : need==='Ongoing support'
      ? 'Ongoing learning: Rec→Paid '+s.recPaid+'% แต่ Next-term '+s.next+'% และ Cross-subject '+s.cross+'%'
      : 'แต่ละ need state สร้าง value คนละแบบ — acquisition, outcome และ continuation ต้องอ่านพร้อมกัน'
  const move = need==='TCAS / University'
    ? 'Protect fast-conversion / brand-halo value; do not penalize natural post-exam exit'
    : need==='Ongoing support'
      ? 'Test continuity as LTV engine; improve discovery / routing before creating more SKUs'
      : 'Use segment-specific success metrics; avoid one universal “repeat” KPI'

  return <div className="p4-stack">
    <Readout see={see} matters={'TCAS Next-term '+tcas.next+'% vs Ongoing '+ongoing.next+'% — lifecycle ต่างกัน'} decision={move}/>
    <div className="p4-intro"><div><div className="eyebrow">JOURNEY & OUTCOMES</div><h2>What value does each journey create?</h2><p>จาก learner metric ไปสู่ portfolio implication — ไม่จบที่ KPI</p></div>
      <div className="p4-filterline">{filters.map(x=><button className={need===x?'active':''} onClick={()=>setNeed(x)} key={x}>{x}</button>)}</div>
    </div>
    <div className="p4-metrics">
      {[['Learners',String(s.cohort.length),'selected synthetic cohort'],['Rec → Paid',s.recPaid+'%','paid within 14d ÷ recommended'],['Next-term',s.next+'%','purchase next term ÷ eligible'],['Cross-subject',s.cross+'%','second subject ÷ active'],['Outcome improved',s.improved+'%','selected outcome improved']].map(([l,v,d])=><article key={l}><span>{l}</span><b>{v}</b><small>{d}</small></article>)}
    </div>
    <div className="p4-valuecompare">
      <article><span>ACHIEVEMENT JOURNEY</span><h3>TCAS / University</h3><div><b>{tcas.recPaid}%</b><small>Rec→Paid</small></div><div><b>{tcas.next}%</b><small>Next-term</small></div><p>Urgency · conversion · exam outcome · brand halo</p></article>
      <article><span>ONGOING LEARNING</span><h3>School / continuous support</h3><div><b>{ongoing.recPaid}%</b><small>Rec→Paid</small></div><div><b>{ongoing.next}%</b><small>Next-term</small></div><p>Continuation · cross-subject · longer relationship potential</p></article>
    </div>
    <div className="p4-distribution">
      <div><b>430</b><span>synthetic learners</span><small>scenario testing only</small></div>
      {learnerDistribution.map(d=><div className="p4-distrow" key={d.label+d.detail}><span><b>{d.label}</b><small>{d.detail}</small></span><i><em style={{width:(d.count/2.2)+'%'}}/></i><strong>{d.count}</strong></div>)}
    </div>
    <div className="data-note">Synthetic learner / commercial data. Score priors are loosely calibrated to public historical national education benchmarks where applicable.</div>
  </div>
}

function Decisions() {
  const [chosen,setChosen]=useState<Record<string,string>>({})
  const actionSets=['KEEP','REPOSITION','ROUTE BETTER','REPACKAGE','MERGE','GROW','HARVEST','EXIT']
  return <div className="p4-stack">
    <Readout see={decisionQueue.length+' decision signals ready for portfolio review'} matters="แยก “ของซ้ำจริง” ออกจาก “ของต่างแต่หน้าร้านทำให้สับสน” ก่อนตัด SKU" decision="Prioritize decision-complexity fixes before building new products"/>
    <div className="p4-intro"><div><div className="eyebrow">DECISION QUEUE</div><h2>Structure → Evidence → Action</h2><p>Portfolio action ไม่ได้มีแค่ Grow / Merge / Exit — บางกรณีคำตอบคือ Reposition หรือ Route Better</p></div></div>
    <div className="p4-queue">
      {decisionQueue.map(item=><article key={item.id}>
        <div className="p4-qhead"><span>{item.classification}</span><h3>{item.title}</h3><b>{item.recommendation}</b></div>
        <div className="p4-evidence"><span>EVIDENCE</span><p>{item.evidence}</p></div>
        <div className="p4-why"><span>WHY</span><p>{item.why}</p></div>
        <div className="p4-actions">{actionSets.map(a=><button className={chosen[item.id]===a?'active':''} onClick={()=>setChosen({...chosen,[item.id]:a})} key={a}>{a}</button>)}</div>
        {chosen[item.id]&&<div className="p4-chosen">Decision: <b>{chosen[item.id]}</b> · PM owner · Monthly portfolio review</div>}
      </article>)}
    </div>
  </div>
}

export default function PortfolioOS(){
  const [workspace,setWorkspace]=useState<Workspace>('performance')
  const content=useMemo(()=>{
    if(workspace==='performance')return <PortfolioPerformance/>
    if(workspace==='voice')return <CustomerVoice/>
    if(workspace==='competitor')return <CompetitorIntel/>
    if(workspace==='journey')return <JourneyOutcomes/>
    if(workspace==='tracking')return <PackageTracking/>
    return <Decisions/>
  },[workspace])

  return <section className="page portfolio-page">
    <div className="section-head">
      <div><div className="eyebrow">PRODUCT PORT LEAD · DEPUTY DEPARTMENT MANAGER</div><h1 className="section-title">Portfolio Operating System</h1><p className="lead">Current performance → diagnose customer & market signals → validate outcomes → track package constraints / bridges → decide.</p></div>
      <div className="section-number">03</div>
    </div>
    <div className="workspace-tabs">{workspaces.map(w=><button className={workspace===w.id?'active':''} onClick={()=>setWorkspace(w.id)} key={w.id}>{w.label}</button>)}</div>
    <div className="workspace-shell">{content}</div>
  </section>
}
