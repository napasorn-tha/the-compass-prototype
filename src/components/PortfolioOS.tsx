import { useMemo, useState } from 'react'
import { appSnapshot } from '../data/appSnapshot'
import { customerVoiceRecords } from '../data/v3'
import { benchmarkMetrics, competitorBenchmarks, type BenchmarkLevel, type BenchmarkSubject } from '../data/competitorBenchmark'
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
  const levels:BenchmarkLevel[]=['Lower Secondary','Upper Secondary / TCAS']
  const subjects:BenchmarkSubject[]=['Math','Physics','Chemistry','Biology','English']
  const [level,setLevel]=useState<BenchmarkLevel>('Lower Secondary')
  const [subject,setSubject]=useState<BenchmarkSubject>('Math')
  const rows=competitorBenchmarks.filter(x=>x.level===level&&x.subject===subject)
  const ondemand=rows.find(x=>x.brand==='OnDemand')
  const peers=rows.filter(x=>x.brand!=='OnDemand')
  const deltas=benchmarkMetrics.map(metric=>{
    const peerAvg=peers.length?peers.reduce((s,x)=>s+x.metrics[metric],0)/peers.length:0
    return {metric,delta:(ondemand?.metrics[metric]||0)-peerAvg}
  }).sort((a,b)=>b.delta-a.delta)
  const advantage=deltas[0]
  const gap=deltas[deltas.length-1]
  return <div className="p4-stack">
    <Readout
      see={ondemand?`OnDemand strongest relative signal: ${advantage.metric} (${advantage.delta>=0?'+':''}${advantage.delta.toFixed(0)} vs peer avg). Biggest gap: ${gap.metric} (${gap.delta>=0?'+':''}${gap.delta.toFixed(0)}).`:'No benchmark set mapped.'}
      matters="The comparison answers one question only: where does OnDemand have an advantage, and where is the competitive gap?"
      decision={gap.delta<0?`Validate whether the ${gap.metric} gap affects package choice before building more products.`:'Protect the current advantage and keep monitoring the same learner job.'}
    />
    <div className="p4-intro"><div><div className="eyebrow">COMPETITOR INTELLIGENCE</div><h2>OnDemand vs relevant alternatives</h2><p>Horizontal benchmark by the same level + subject. OnDemand remains the reference point.</p></div></div>
    <div className="p4-filterbox">
      <div><span>LEVEL</span>{levels.map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{subjects.map(x=><button key={x} className={subject===x?'active':''} onClick={()=>setSubject(x)}>{x}</button>)}</div>
    </div>
    <div className="benchmark-board">
      {rows.map(row=><article className={row.brand==='OnDemand'?'benchmark-brand focus':'benchmark-brand'} key={row.brand}>
        <div className="benchmark-title"><div><span>{row.brand==='OnDemand'?'ONDEMAND · FOCUS':'COMPETITOR'}</span><h3>{row.brand}</h3></div><b>{Math.round(benchmarkMetrics.reduce((s,m)=>s+row.metrics[m],0)/benchmarkMetrics.length)}</b></div>
        <div className="benchmark-bars">{benchmarkMetrics.map(metric=><div className="benchmark-row" key={metric}><span>{metric}</span><i><em style={{width:row.metrics[metric]+'%'}}/></i><b>{row.metrics[metric]}</b></div>)}</div>
      </article>)}
    </div>
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
  const [selected,setSelected]=useState<string|null>(null)
  const packages=appSnapshot.packages.filter(x=>stage==='ALL'||x.lifeStage===stage)
  const item=appSnapshot.packages.find(x=>x.packageId===selected)||packages[0]
  const stat=item?appSnapshot.packageStats.find(x=>x.packageId===item.packageId):undefined
  const sameRole=item?appSnapshot.packages.filter(x=>x.lifeStage===item.lifeStage&&x.track===item.track):[]
  return <div className="p4-stack">
    <Readout
      see={item?`${item.name}: ${sameRole.length} package(s) share the same stage + track label.`:`${packages.length} packages in tracking.`}
      matters={sameRole.length>1?'Same track label does not automatically mean cannibalization — target school, learner readiness and proposition can still separate the role.':'This package has a relatively clear role in the current package taxonomy.'}
      decision={sameRole.length>1?'Check substitution / content overlap / recommendation collision before MERGE. If roles differ but choice is confusing, ROUTE BETTER.':'KEEP tracking; escalate only when performance or learner evidence creates an active issue.'}
    />
    <div className="p4-intro"><div><div className="eyebrow">PACKAGE TRACKING</div><h2>Reference layer before a decision</h2><p>All packages + constraints + possible overlap + cross-BU routing triggers.</p></div></div>
    <div className="p4-filterbox"><div><span>LEVEL</span>{(['ALL','Primary','Lower Secondary','Upper Secondary'] as const).map(x=><button key={x} className={stage===x?'active':''} onClick={()=>{setStage(x);setSelected(null)}}>{x}</button>)}</div></div>
    <div className="tracking-layout">
      <div className="tracking-list">{packages.map(x=>{const s=appSnapshot.packageStats.find(v=>v.packageId===x.packageId);return <button className={(item?.packageId===x.packageId?'active ':'')+'tracking-row'} key={x.packageId} onClick={()=>setSelected(x.packageId)}><span><b>{x.name}</b><small>{x.track} · {x.lifeStage}</small></span><strong>{s?money(s.revenue):'—'}</strong></button>})}</div>
      {item&&<article className="tracking-detail">
        <div className="tracking-head"><div><span>SELECTED PACKAGE</span><h3>{item.name}</h3></div><b>฿{item.price.toLocaleString()}</b></div>
        <p>{item.positioning}</p>
        <div className="tracking-kpis"><div><span>Enrollments</span><b>{stat?.enrollments??0}</b></div><div><span>Acceptance</span><b>{stat?.acceptanceRate??0}%</b></div><div><span>Completion</span><b>{stat?.completion??0}%</b></div><div><span>Goal achieved</span><b>{stat?.goalAchieved??'—'}%</b></div></div>
        <div className="tracking-block"><span>OVERLAP / ROLE CHECK</span><b>{sameRole.length>1?`${sameRole.length} packages share “${item.track}”`:'Clear single package role in this track'}</b>{sameRole.length>1&&<div>{sameRole.map(x=><i key={x.packageId}>{x.name}</i>)}</div>}</div>
        <div className="tracking-block"><span>CROSS-BU ROUTING TRIGGERS</span><div className="bridge-tags">
          {item.lifeStage==='Upper Secondary'&&<i>Admission navigation → TCASter</i>}
          {item.lifeStage==='Upper Secondary'&&<i>International background → Ignite</i>}
          {(item.track==='Foundation'||item.track==='School Exam')&&<i>English gap → Premier Prep</i>}
          {!['Foundation','School Exam'].includes(item.track)&&item.lifeStage!=='Upper Secondary'&&<i>No default bridge — route only when learner need requires it</i>}
        </div></div>
      </article>}
    </div>
  </div>
}
function Decisions(){
  const [chosen,setChosen]=useState<Record<string,string>>({})
  const actions=['KEEP','GROW','REPOSITION','ROUTE BETTER','REPACKAGE','MERGE','BRIDGE','HARVEST','EXIT']
  const weakPackages=appSnapshot.packageStats.filter(x=>x.enrollments>=7&&(x.goalAchieved??100)<45).slice(0,3)
  const provincial=appSnapshot.geographyStats.find(x=>x.cluster==='Provincial')!
  const overlap=appSnapshot.packages.filter(x=>x.lifeStage==='Lower Secondary'&&x.track==='School Entrance')
  const cases=[
    ...weakPackages.map(x=>({id:x.packageId,type:'PACKAGE PERFORMANCE',title:x.packageName,evidence:`${x.enrollments} enrollments · ${x.completion}% completion · ${x.goalAchieved}% goal achieved`,why:'Outcome signal is weak enough to require diagnosis before growth.',system:'REVIEW / REPOSITION'})),
    {id:'GEO-PROV',type:'GEOGRAPHY / DELIVERY',title:'Provincial demand is digitally heavy',evidence:`${provincial.learners} learners · ${provincial.anywhereShare}% Anywhere · ${provincial.branchPurchaseShare}% branch-purchase share`,why:'Expansion should not assume branch-first behavior outside Bangkok.',system:'ROUTE / CHANNEL TEST'},
    {id:'LSEC-ENTRANCE',type:'OVERLAP REVIEW',title:'Lower-secondary school entrance paths',evidence:`${overlap.length} packages share School Entrance but target different schools / propositions.`,why:'Do not merge based on count alone; check recommendation collision and customer confusion.',system:'ROUTE BETTER FIRST'},
  ]
  return <div className="p4-stack">
    <Readout see={cases.length+' active cases meet a review trigger in the current snapshot.'} matters="Decision Queue contains only issues with an observable trigger; Package Tracking still contains the full portfolio." decision="Choose an action, owner and review window only after the evidence is sufficient."/>
    <div className="p4-intro"><div><div className="eyebrow">DECISION QUEUE</div><h2>Active cases only</h2><p>Performance / geography / overlap signals that need a Product Port Lead decision.</p></div></div>
    <div className="p4-queue">{cases.map(q=><article key={q.id}><div className="p4-qhead"><span>{q.type}</span><h3>{q.title}</h3><b>{q.system}</b></div><div className="p4-evidence"><span>EVIDENCE</span><p>{q.evidence}</p></div><div className="p4-why"><span>WHY</span><p>{q.why}</p></div><div className="p4-actions">{actions.map(a=><button key={a} className={chosen[q.id]===a?'active':''} onClick={()=>setChosen({...chosen,[q.id]:a})}>{a}</button>)}</div>{chosen[q.id]&&<div className="p4-chosen">Decision: <b>{chosen[q.id]}</b> · assign owner + review date</div>}</article>)}</div>
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
