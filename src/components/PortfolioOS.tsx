import { useMemo, useState } from 'react'
import { appSnapshot } from '../data/appSnapshot'
import { competitorProfiles, customerVoiceRecords, decisionQueue } from '../data/v3'
import '../portfolio-v4.css'

type Workspace='performance'|'voice'|'competitor'|'journey'|'tracking'|'decisions'
const workspaces:{id:Workspace;label:string}[]=[
  {id:'performance',label:'Portfolio Performance'},
  {id:'voice',label:'Customer Voice'},
  {id:'competitor',label:'Competitor Intel'},
  {id:'journey',label:'Journey & Outcomes'},
  {id:'tracking',label:'Package Tracking'},
  {id:'decisions',label:'Decision Queue'},
]

function money(n:number){return '฿'+(n/1000000>=1?(n/1000000).toFixed(2)+'M':Math.round(n/1000)+'K')}
function Readout({see,matters,decision}:{see:string;matters:string;decision:string}){return <div className="p4-readout"><div><span>WHAT WE SEE</span><b>{see}</b></div><div><span>WHY IT MATTERS</span><b>{matters}</b></div><div className="p4-decision"><span>NEXT PORTFOLIO MOVE</span><b>{decision}</b></div></div>}

function PortfolioPerformance(){
  const [lens,setLens]=useState<'Overview'|'Segment'|'Geography'|'Delivery'|'Package'>('Overview')
  const o=appSnapshot.overall
  const top=appSnapshot.packageStats[0]
  const provincial=appSnapshot.geographyStats.find(x=>x.cluster==='Provincial')!
  const bangkok=appSnapshot.geographyStats.find(x=>x.cluster==='Bangkok')!
  return <div className="p4-stack">
    <Readout see={`Portfolio generated ${money(o.revenue)} across ${o.enrollments} enrollments; TCAS-focused contributes the largest revenue pool.`} matters={`Provincial learners are the largest demand base (${provincial.learners}) with ${provincial.anywhereShare}% Anywhere usage — branch and digital should be read together.`} decision="Open the lens with the biggest movement, then send only evidence-backed cases to Decision Queue."/>
    <div className="p4-intro"><div><div className="eyebrow">PORTFOLIO PERFORMANCE</div><h2>Current portfolio health — one meeting view</h2><p>Business performance + learner outcome + geography / delivery signals from the same shared snapshot.</p></div><div className="p4-kpi"><span>LEARNERS</span><b>{o.learners}</b><small>{appSnapshot.datasetMeta.packageCount} journey packages · {appSnapshot.datasetMeta.branchMasterCount} public branches</small></div></div>
    <div className="p4-metrics">
      <article><span>Revenue</span><b>{money(o.revenue)}</b><small>purchase revenue</small></article>
      <article><span>Enrollments</span><b>{o.enrollments}</b><small>paid enrollment events</small></article>
      <article><span>Rec → Paid</span><b>{o.recToPaid}%</b><small>within 14 days</small></article>
      <article><span>Avg. Order Value</span><b>฿{o.aov.toLocaleString()}</b><small>purchase revenue ÷ enrollment</small></article>
      <article><span>Goal achieved</span><b>{o.goalAchieved}%</b><small>outcomes with achieved goal</small></article>
    </div>
    <div className="p4-lensbar"><span>VIEW BY</span>{(['Overview','Segment','Geography','Delivery','Package'] as const).map(x=><button key={x} className={lens===x?'active':''} onClick={()=>setLens(x)}>{x}</button>)}</div>

    {lens==='Overview'&&<div className="p4-performance-split">
      <article><span>TOP REVENUE PACKAGE</span><h3>{top.packageName}</h3><b>{money(top.revenue)}</b><p>{top.enrollments} enrollments · {top.completion}% completion · {top.goalAchieved}% goal achieved</p></article>
      <article><span>GEOGRAPHY SIGNAL</span><h3>Bangkok vs Provincial</h3><b>{money(bangkok.revenue)} vs {money(provincial.revenue)}</b><p>Provincial: {provincial.learners} learners · {provincial.anywhereShare}% Anywhere · {provincial.branchPurchaseShare}% branch-purchase share</p></article>
    </div>}

    {lens==='Segment'&&<MetricTable headers={['Segment','Learners','Revenue','Enrollments','Rec→Paid','Completion','Goal achieved']} rows={appSnapshot.segmentStats.map(x=>[x.segment,x.learners,money(x.revenue),x.enrollments,x.recToPaid+'%',x.completion+'%',x.goalAchieved+'%'])}/>}
    {lens==='Geography'&&<MetricTable headers={['Market','Learners','Revenue','Rec→Paid','AOV','Anywhere share','Branch purchase']} rows={appSnapshot.geographyStats.map(x=>[x.cluster,x.learners,money(x.revenue),x.recToPaid+'%','฿'+x.aov.toLocaleString(),x.anywhereShare+'%',x.branchPurchaseShare+'%'])}/>}
    {lens==='Delivery'&&<MetricTable headers={['Mode','Enrollments','Revenue','AOV','Completion','Goal achieved']} rows={appSnapshot.deliveryStats.map(x=>[x.mode,x.enrollments,money(x.revenue),'฿'+x.aov.toLocaleString(),x.completion+'%',x.goalAchieved+'%'])}/>}
    {lens==='Package'&&<MetricTable headers={['Package','Track','Revenue','Enrollments','Acceptance','Completion','Goal achieved']} rows={appSnapshot.packageStats.map(x=>[x.packageName,x.track,money(x.revenue),x.enrollments,x.acceptanceRate+'%',x.completion+'%',(x.goalAchieved??0)+'%'])}/>}
  </div>
}

function MetricTable({headers,rows}:{headers:string[];rows:(string|number)[][]}){return <div className="p4-simpletable"><div className="p4-simplehead">{headers.map(h=><b key={h}>{h}</b>)}</div>{rows.map((r,i)=><div className="p4-simplerow" key={i}>{r.map((v,j)=><span key={j}>{v}</span>)}</div>)}</div>}

function CustomerVoice(){
  const stages=['Lower Secondary','Upper Secondary']
  const [stage,setStage]=useState(stages[1])
  const rows=customerVoiceRecords.filter(x=>x.stage===stage)
  const subjects=Array.from(new Set(rows.map(x=>x.subject)))
  const [subject,setSubject]=useState(subjects[0]||'Math')
  const selected=customerVoiceRecords.find(x=>x.stage===stage&&x.subject===subject)||rows[0]||customerVoiceRecords[0]
  const packageCohort=appSnapshot.packageStats.filter(x=>x.lifeStage===stage).sort((a,b)=>b.revenue-a.revenue)[0]
  const chooseStage=(x:string)=>{setStage(x);const first=customerVoiceRecords.find(v=>v.stage===x);if(first)setSubject(first.subject)}
  return <div className="p4-stack">
    <Readout see={selected.takeaway} matters={packageCohort?`Same-stage package cohort: ${packageCohort.packageName} — ${packageCohort.acceptanceRate}% acceptance, ${packageCohort.completion}% completion.`:'Voice must be read with package cohort data.'} decision={selected.implication}/>
    <div className="p4-intro"><div><div className="eyebrow">CUSTOMER VOICE</div><h2>Package context first, comment theme second</h2><p>Voice is diagnostic evidence — not a standalone sentiment dashboard.</p></div></div>
    <div className="p4-filterbox"><div><span>LEVEL</span>{stages.map(x=><button key={x} className={stage===x?'active':''} onClick={()=>chooseStage(x)}>{x}</button>)}</div><div><span>SUBJECT</span>{Array.from(new Set(customerVoiceRecords.filter(v=>v.stage===stage).map(v=>v.subject))).map(x=><button key={x} className={subject===x?'active':''} onClick={()=>setSubject(x)}>{x}</button>)}</div></div>
    <div className="p4-packcontext"><span>COURSE / PACK CONTEXT</span><h3>{selected.pack}</h3><p>{selected.sample} coded mentions in the prototype voice layer</p></div>
    <div className="p4-themegrid">{selected.themes.map(([t,c,d])=><article key={String(t)}><span>{c} mentions</span><b>{t}</b><p>{d}</p><div><i style={{width:(Number(c)/selected.sample*100)+'%'}}/></div></article>)}</div>
  </div>
}

function CompetitorIntel(){
  const levels=['Lower Secondary','Upper Secondary / TCAS'] as const
  const subjects=['Math','Physics','Chemistry','Biology','English'] as const
  const [level,setLevel]=useState<(typeof levels)[number]>('Lower Secondary')
  const [subject,setSubject]=useState<(typeof subjects)[number]>('Physics')
  const rows=competitorProfiles.filter(x=>x.level===level&&x.subject===subject)
  return <div className="p4-stack">
    <Readout see={rows.length?`${subject} · ${level}: ${rows.length-1} relevant competitor references mapped alongside OnDemand.`:'No mapped competitor set for this filter yet.'} matters="Competitor view should compare the same learner job, not whole brands." decision="Round 2 will convert this into the horizontal benchmark view: OnDemand vs peers on price, breadth, foundation, practice, exam alignment and support."/>
    <div className="p4-intro"><div><div className="eyebrow">COMPETITOR INTELLIGENCE</div><h2>Same job-to-be-done, same comparison set</h2></div></div>
    <div className="p4-filterbox"><div><span>LEVEL</span>{levels.map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div><div><span>SUBJECT</span>{subjects.map(x=><button key={x} className={subject===x?'active':''} onClick={()=>setSubject(x)}>{x}</button>)}</div></div>
    <div className="p4-competitors">{rows.map(x=><article className={x.brand==='OnDemand'?'owner':''} key={x.brand}><div className="p4-chead"><div><small>{x.type}</small><h3>{x.brand}</h3></div>{x.brand==='OnDemand'&&<span>FOCUS</span>}</div><div className="p4-visible"><span>VISIBLE OFFER</span><b>{x.visibleOffer}</b></div><div className="p4-pills">{x.positioning.map(p=><span key={p}>{p}</span>)}</div></article>)}</div>
  </div>
}

function JourneyOutcomes(){
  const [segment,setSegment]=useState('ALL')
  const rows=segment==='ALL'?appSnapshot.segmentStats:appSnapshot.segmentStats.filter(x=>x.segment===segment)
  const summary=segment==='ALL'?appSnapshot.overall:rows[0]
  return <div className="p4-stack">
    <Readout see={segment==='ALL'?`Across the shared journey snapshot, ${appSnapshot.overall.recToPaid}% convert within 14 days and ${appSnapshot.overall.goalAchieved}% of recorded outcomes achieve the stated goal.`:`${segment}: ${(summary as any).recToPaid}% Rec→Paid, ${(summary as any).completion}% completion, ${(summary as any).goalAchieved}% goal achieved.`} matters="Acquisition, completion and outcome are different stages of the same learner chain." decision="Use segment-specific lifecycle expectations; do not punish TCAS for natural post-exam exit or ongoing learning for slower conversion."/>
    <div className="p4-intro"><div><div className="eyebrow">JOURNEY & OUTCOMES</div><h2>Recommendation → Enrollment → Learning → Outcome</h2></div><div className="p4-filterline"><button className={segment==='ALL'?'active':''} onClick={()=>setSegment('ALL')}>ALL</button>{appSnapshot.segmentStats.map(x=><button key={x.segment} className={segment===x.segment?'active':''} onClick={()=>setSegment(x.segment)}>{x.segment}</button>)}</div></div>
    {segment==='ALL'?<div className="p4-metrics"><article><span>Learners</span><b>{appSnapshot.overall.learners}</b><small>profiles</small></article><article><span>Recommendations</span><b>{appSnapshot.overall.recommendations}</b><small>recommendation events</small></article><article><span>Enrollments</span><b>{appSnapshot.overall.enrollments}</b><small>paid events</small></article><article><span>Outcomes</span><b>{appSnapshot.overall.outcomes}</b><small>recorded outcomes</small></article><article><span>Avg score improvement</span><b>+{appSnapshot.overall.avgScoreImprovement}</b><small>points</small></article></div>:<MetricTable headers={['Segment','Learners','Revenue','Rec→Paid','Completion','Goal achieved','Score improvement']} rows={rows.map(x=>[x.segment,x.learners,money(x.revenue),x.recToPaid+'%',x.completion+'%',x.goalAchieved+'%','+'+x.scoreImprovement])}/>}
  </div>
}

function PackageTracking(){
  const [stage,setStage]=useState<'ALL'|'Primary'|'Lower Secondary'|'Upper Secondary'>('ALL')
  const packages=appSnapshot.packages.filter(x=>stage==='ALL'||x.lifeStage===stage)
  return <div className="p4-stack">
    <Readout see={`${packages.length} packages in the selected tracking view.`} matters="Tracking is reference intelligence: target, price, package role, overlap / bridge context — not the meeting homepage." decision="Use Tracking to assemble constraints and evidence; only active issues move to Decision Queue."/>
    <div className="p4-intro"><div><div className="eyebrow">PACKAGE TRACKING</div><h2>All packages, supporting evidence</h2></div></div>
    <div className="p4-filterbox"><div><span>LEVEL</span>{(['ALL','Primary','Lower Secondary','Upper Secondary'] as const).map(x=><button key={x} className={stage===x?'active':''} onClick={()=>setStage(x)}>{x}</button>)}</div></div>
    <div className="p4-trackinggrid">{packages.map(p=>{const s=appSnapshot.packageStats.find(x=>x.packageId===p.packageId);return <article key={p.packageId}><span>{p.track}</span><h3>{p.name}</h3><p>{p.positioning}</p><div><b>฿{p.price.toLocaleString()}</b><small>{p.componentCount} components</small></div>{s&&<footer><span>{s.enrollments} enrollments</span><span>{s.acceptanceRate}% acceptance</span><span>{s.completion}% completion</span></footer>}</article>})}</div>
  </div>
}

function Decisions(){
  const [chosen,setChosen]=useState<Record<string,string>>({})
  const actions=['KEEP','GROW','REPOSITION','ROUTE BETTER','REPACKAGE','MERGE','BRIDGE','HARVEST','EXIT']
  return <div className="p4-stack">
    <Readout see={decisionQueue.length+' active prototype signals are waiting for a portfolio decision.'} matters="Decision Queue is intentionally smaller than Package Tracking." decision="Decide only when performance + learner + market evidence is sufficient."/>
    <div className="p4-intro"><div><div className="eyebrow">DECISION QUEUE</div><h2>Only cases that need a decision</h2></div></div>
    <div className="p4-queue">{decisionQueue.map(q=><article key={q.id}><div className="p4-qhead"><span>{q.classification}</span><h3>{q.title}</h3><b>{q.recommendation}</b></div><div className="p4-evidence"><span>EVIDENCE</span><p>{q.evidence}</p></div><div className="p4-why"><span>WHY</span><p>{q.why}</p></div><div className="p4-actions">{actions.map(a=><button key={a} className={chosen[q.id]===a?'active':''} onClick={()=>setChosen({...chosen,[q.id]:a})}>{a}</button>)}</div></article>)}</div>
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
  return <section className="page portfolio-page"><div className="section-head"><div><div className="eyebrow">PRODUCT PORT LEAD · DEPUTY DEPARTMENT MANAGER</div><h1 className="section-title">Portfolio Operating System</h1><p className="lead">Current performance → diagnose learner / market signals → validate outcomes → track package constraints → decide.</p></div><div className="section-number">03</div></div><div className="workspace-tabs">{workspaces.map(w=><button key={w.id} className={workspace===w.id?'active':''} onClick={()=>setWorkspace(w.id)}>{w.label}</button>)}</div><div className="workspace-shell">{content}</div></section>
}
