import { useMemo, useState } from 'react'
import {
  catalogOffers,
  competitorProfiles,
  customerVoiceRecords,
  decisionQueue,
  ecosystemRoutes,
  needStates,
  type LifeStage,
  type NeedState,
} from '../data/v3'
import '../portfolio-v4.css'
import { appSnapshot } from '../data/appSnapshot'

type Workspace = 'performance' | 'voice' | 'competitor' | 'journey' | 'tracking' | 'decisions'

const workspaces: {id:Workspace;label:string}[] = [
  {id:'performance',label:'Performance'},
  {id:'voice',label:'Customer & Learner'},
  {id:'competitor',label:'Market & Competitors'},
  {id:'journey',label:'Journey & Outcomes'},
  {id:'tracking',label:'Product & Package Review'},
  {id:'decisions',label:'Decision Queue'},
]

function Readout({see,matters,decision,onDecision}:{see:string;matters:string;decision:string;onDecision?:()=>void}) {
  return <div className="p4-readout">
    <div><span>WHAT WE SEE</span><b>{see}</b></div>
    <div><span>WHY IT MATTERS</span><b>{matters}</b></div>
    <div className="p4-decision"><span>NEXT PORTFOLIO MOVE</span><b>{decision}</b>{onDecision&&<button className="p4-decision-action" onClick={onDecision}>Review in Decision Queue →</button>}</div>
  </div>
}


const CM_ASSUMPTIONS = {
  delivery: { Anywhere:0.12, Branch:0.30, Hybrid:0.21 },
  channel: { Website:0.03, Advisor:0.08, Branch:0.10, 'Campaign / Event':0.06 },
  support: { 'Free / Entry':0.02, Core:0.04, Plus:0.08, Premium:0.16 },
} as const

function estimateContributionMargin() {
  const revenue=appSnapshot.overall.revenue
  const deliveryCost=appSnapshot.deliveryStats.reduce((sum,x)=>{
    const rate=CM_ASSUMPTIONS.delivery[x.mode as keyof typeof CM_ASSUMPTIONS.delivery] ?? 0.20
    return sum+x.revenue*rate
  },0)
  const channelCost=appSnapshot.channelStats.reduce((sum,x)=>{
    const rate=CM_ASSUMPTIONS.channel[x.name as keyof typeof CM_ASSUMPTIONS.channel] ?? 0.06
    return sum+x.revenue*rate
  },0)
  const supportCost=appSnapshot.supportStats.reduce((sum,x)=>{
    const rate=CM_ASSUMPTIONS.support[x.name as keyof typeof CM_ASSUMPTIONS.support] ?? 0.08
    return sum+x.revenue*rate
  },0)
  const contribution=Math.max(0,revenue-deliveryCost-channelCost-supportCost)
  return {
    amount:Math.round(contribution),
    rate:revenue?Math.round(contribution/revenue*1000)/10:0,
    deliveryCost:Math.round(deliveryCost),
    channelCost:Math.round(channelCost),
    supportCost:Math.round(supportCost),
  }
}

function PortfolioPerformance({openDecisions}:{openDecisions:()=>void}) {
  const [lens,setLens]=useState<'Segment'|'Package'|'Geography'|'Delivery'>('Segment')
  const o=appSnapshot.overall
  const thb=(n:number)=>'฿'+n.toLocaleString()
  const cm=estimateContributionMargin()

  const rows = lens==='Segment'
    ? appSnapshot.segmentStats.map(x=>({name:x.segment,detail:x.learners+' learners',revenue:x.revenue,enrollments:x.enrollments,aov:x.aov,completion:x.completion,outcome:x.goalAchieved}))
    : lens==='Package'
      ? appSnapshot.packageStats.slice(0,12).map(x=>({name:x.packageName,detail:x.track,revenue:x.revenue,enrollments:x.enrollments,aov:x.aov,completion:x.completion,outcome:x.goalAchieved}))
      : lens==='Geography'
        ? appSnapshot.geographyStats.map(x=>({name:x.cluster,detail:x.learners+' learners',revenue:x.revenue,enrollments:x.enrollments,aov:x.aov,completion:x.completion,outcome:x.goalAchieved}))
        : appSnapshot.deliveryStats.map(x=>({name:x.mode,detail:'delivery mode',revenue:x.revenue,enrollments:x.enrollments,aov:x.aov,completion:x.completion,outcome:x.goalAchieved}))

  const topPackage=[...appSnapshot.packageStats].sort((a,b)=>b.revenue-a.revenue)[0]
  const topGeo=[...appSnapshot.geographyStats].sort((a,b)=>b.revenue-a.revenue)[0]

  const salesChannels=appSnapshot.channelStats
  const demandRegions=appSnapshot.regionDemandStats
  const demandProvinces=appSnapshot.provinceDemandStats.slice(0,8)
  const topBranches=[...appSnapshot.branchStats].sort((a,b)=>b.revenue-a.revenue).slice(0,6)

  return <div className="p4-stack">
    <div className="p4-intro">
      <div><div className="eyebrow">PORTFOLIO PERFORMANCE</div><h2>Start with performance, then find the driver</h2><p>What happened → Where → Why → So what → Decision</p></div>
      <div className="p4-kpi"><span>CONNECTED SNAPSHOT</span><b>{o.learners}</b><small>learners in shared spine</small></div>
    </div>

    <div className="p4-story-label"><span>01 · WHAT HAPPENED?</span><b>Business performance first</b></div>
    <div className="p4-metrics">
      <article><span>Revenue</span><b>{thb(o.revenue)}</b><small>connected enrollment revenue</small></article>
      <article><span>Enrollments</span><b>{o.enrollments}</b><small>connected enrollment records</small></article>
      <article><span>Rec → Paid</span><b>{o.recToPaid}%</b><small>recommendation acceptance / paid proxy</small></article>
      <article className="p4-estimate"><span>Est. Contribution Margin</span><b>{cm.rate}%</b><small>{thb(cm.amount)} · directional estimate</small><em title="Directional estimate based on delivery mode, channel and support intensity. Not accounting actuals.">assumption-based ⓘ</em></article>
      <article><span>AOV</span><b>{thb(o.aov)}</b><small>average order value</small></article>
      <article><span>Learning Outcome</span><b>{o.goalAchieved}%</b><small>goal achieved among available outcomes</small></article>
    </div>

    <div className="p4-estimate-note">EST. CONTRIBUTION MARGIN · Directional estimate across the full 414-enrollment snapshot using explicit variable-cost assumptions by delivery mode, purchase channel and support tier. Not accounting actuals. Public company net margin is not used as contribution margin.</div>

    <div className="p4-attention">
      <div className="p4-attention-head">
        <div><span>WHAT NEEDS ATTENTION</span><b>{decisionQueue.length} portfolio questions are ready for review</b></div>
        <button onClick={openDecisions}>Open Decision Queue →</button>
      </div>
      <div className="p4-attention-grid">
        {decisionQueue.slice(0,3).map(item=><article key={item.id}>
          <span>{item.classification}</span>
          <b>{item.title}</b>
          <small>{item.recommendation}</small>
        </article>)}
      </div>
    </div>

    <div className="p4-story-label"><span>02 · WHERE?</span><b>Change the lens before interpreting the signal</b></div>
    <div className="p4-filterline">
      {(['Segment','Package','Geography','Delivery'] as const).map(x=><button className={lens===x?'active':''} onClick={()=>setLens(x)} key={x}>{x}</button>)}
    </div>

    <div className="p4-performance-table">
      <div className="p4-performance-head"><span>{lens.toUpperCase()}</span><span>REVENUE</span><span>ENROLLMENTS</span><span>AOV</span><span>COMPLETION</span><span>GOAL ACHIEVED</span><span>SIGNAL</span></div>
      {rows.map(row=><div className="p4-performance-row" key={row.name}>
        <div><b>{row.name}</b><small>{row.detail}</small></div>
        <span>{thb(row.revenue)}</span><span>{row.enrollments}</span><span>{thb(row.aov)}</span><span>{row.completion}%</span><span>{row.outcome}%</span>
        <strong className={row.outcome>=65?'signal-healthy':row.outcome<45?'signal-priority':'signal-watch'}>{row.outcome>=65?'HEALTHY / LEARN':row.outcome<45?'PRIORITY':'WATCH'}</strong>
      </div>)}
    </div>

    {lens==='Geography' && <div className="p4-geo-dual">
      <article>
        <div className="p4-geo-head"><span>WHERE DEMAND COMES FROM</span><b>Learner geography · full 430-learner snapshot</b></div>
        <div className="p4-geo-clusters">{demandRegions.map(x=><div key={x.name}><b>{x.name}</b><span>{x.count} learners</span><small>{x.share}% of learner base</small></div>)}</div>
        <div className="p4-geo-detail"><span>TOP PROVINCES</span>{demandProvinces.map(x=><b key={x.name}>{x.name} · {x.count}</b>)}</div>
      </article>
      <article>
        <div className="p4-geo-head"><span>WHERE SALES HAPPEN</span><b>Purchase channel + branch location · full 414-enrollment snapshot</b></div>
        <div className="p4-geo-clusters">{salesChannels.map(x=><div key={x.name}><b>{x.name}</b><span>{x.count} enrollments · {thb(x.revenue)}</span><small>{x.revenueShare}% of revenue · AOV {thb(x.aov)}</small></div>)}</div>
        <div className="p4-geo-detail"><span>TOP BRANCH-ATTRIBUTED SALES</span>{topBranches.map(x=><b key={x.branchId}>{x.branchName} · {thb(x.revenue)}</b>)}</div>
      </article>
    </div>}

    <div className="p4-story-label"><span>03–05 · WHY? → SO WHAT? → DECISION</span><b>Interpret only after the evidence is visible</b></div>
    <Readout
      see={`${o.enrollments} enrollments generate ${thb(o.revenue)}; ${topPackage?.packageName || 'top package'} is the largest package by revenue in the connected snapshot.`}
      matters={`${topGeo?.cluster || 'Top geography'} is the largest geography by revenue, while the delivery mix shows where demand and purchase behavior diverge.`}
      decision="Use the selected lens to isolate the driver, then move the evidence into Decision Queue for a human portfolio decision."
      onDecision={openDecisions}
    />
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
  </div>
}

function CompetitorIntel() {
  const subjects = ['Math','Physics','Chemistry','Biology','English'] as const
  const [subject,setSubject] = useState<(typeof subjects)[number]>('Math')
  const levels = ['Lower Secondary','Upper Secondary / TCAS'] as const
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
  </div>
}

function JourneyOutcomes() {
  const filters=['ALL',...appSnapshot.segmentStats.map(x=>x.segment)] as string[]
  const [segment,setSegment]=useState('ALL')
  const s=segment==='ALL'
    ? {learners:appSnapshot.overall.learners,enrollments:appSnapshot.overall.enrollments,recToPaid:appSnapshot.overall.recToPaid,completion:appSnapshot.overall.avgCompletion,goalAchieved:appSnapshot.overall.goalAchieved,scoreImprovement:appSnapshot.overall.avgScoreImprovement}
    : appSnapshot.segmentStats.find(x=>x.segment===segment)!

  const tcas=appSnapshot.segmentStats.find(x=>x.segment==='TCAS-focused')!
  const lower=appSnapshot.segmentStats.find(x=>x.segment==='Lower Secondary')!

  return <div className="p4-stack">
    <Readout
      see={segment==='ALL' ? `Across ${s.learners} learners, goal-achieved is ${s.goalAchieved}% with average score improvement ${s.scoreImprovement} points.` : `${segment}: Rec→Paid ${s.recToPaid}%, completion ${s.completion}%, goal-achieved ${s.goalAchieved}%.`}
      matters="Outcome is read with conversion and completion; one KPI alone should not decide a package or learner journey."
      decision="Use segment-specific evidence and feed weak or unusually strong patterns into package review."
    />
    <div className="p4-intro">
      <div><div className="eyebrow">JOURNEY & OUTCOMES</div><h2>What happens after recommendation?</h2><p>Goal → Assessment → Recommendation → Enrollment → Outcome จาก connected final mock</p></div>
      <div className="p4-filterline">{filters.map(x=><button className={segment===x?'active':''} onClick={()=>setSegment(x)} key={x}>{x}</button>)}</div>
    </div>
    <div className="p4-metrics">
      {[['Learners',String(s.learners),'connected learner records'],['Enrollments',String(s.enrollments),'paid enrollment records'],['Rec → Paid',s.recToPaid+'%','recommendation to paid proxy'],['Completion',s.completion+'%','average course completion'],['Goal achieved',s.goalAchieved+'%','available learner outcomes'],['Score improvement',s.scoreImprovement+' pts','average baseline → final change']].map(([l,v,d])=><article key={l}><span>{l}</span><b>{v}</b><small>{d}</small></article>)}
    </div>
    <div className="p4-valuecompare">
      <article><span>TCAS-FOCUSED</span><h3>{tcas.learners} learners</h3><div><b>{tcas.recToPaid}%</b><small>Rec→Paid</small></div><div><b>{tcas.goalAchieved}%</b><small>Goal achieved</small></div><p>{tcas.completion}% completion · {tcas.scoreImprovement} pts improvement</p></article>
      <article><span>LOWER SECONDARY</span><h3>{lower.learners} learners</h3><div><b>{lower.recToPaid}%</b><small>Rec→Paid</small></div><div><b>{lower.goalAchieved}%</b><small>Goal achieved</small></div><p>{lower.completion}% completion · {lower.scoreImprovement} pts improvement</p></article>
    </div>
    <div className="p4-distribution">
      <div><b>{appSnapshot.overall.outcomes}</b><span>available outcomes</span><small>from the same connected learner spine</small></div>
      {appSnapshot.segmentStats.map(d=><div className="p4-distrow" key={d.segment}><span><b>{d.segment}</b><small>{d.enrollments} enrollments</small></span><i><em style={{width:Math.min(100,d.learners/appSnapshot.overall.learners*250)+'%'}}/></i><strong>{d.learners}</strong></div>)}
    </div>
  </div>
}


function Decisions() {
  const actionSets=['KEEP','REPOSITION','ROUTE BETTER','REPACKAGE','MERGE','GROW','HARVEST','EXIT']
  const ownerOptions=['PM — TCAS','PM — Lower Secondary','PM — Science','PM — Medical Pathway','PM — Ecosystem / Partnerships']
  const defaultOwners:Record<string,string>={
    Q01:'PM — TCAS',
    Q02:'PM — TCAS',
    Q03:'PM — Lower Secondary',
    Q04:'PM — Medical Pathway',
    Q05:'PM — Ecosystem / Partnerships',
  }
  const defaultDirections:Record<string,string>={
    Q01:'Clarify cohort vs content version at the entry point before changing the SKU structure.',
    Q02:'Do not merge until attach, substitution and outcome data confirm true cannibalization.',
    Q03:'Keep the modular course structure; simplify learner entry through gap-based routing.',
    Q04:'Simplify the front-end choice first. Preserve backend variants until migration impact is clear.',
    Q05:'Pilot the cross-company route before building a new standalone product; protect clear ownership and economics.',
  }

  const [chosen,setChosen]=useState<Record<string,string>>(
    Object.fromEntries(decisionQueue.map(item=>[item.id,item.recommendation.split(' / ')[0]]))
  )
  const [owners,setOwners]=useState<Record<string,string>>(defaultOwners)
  const [statuses,setStatuses]=useState<Record<string,string>>(
    Object.fromEntries(decisionQueue.map(item=>[item.id,'To review']))
  )
  const [directions,setDirections]=useState<Record<string,string>>(defaultDirections)

  return <div className="p4-stack">
    <Readout
      see={decisionQueue.length+' portfolio questions ready for review'}
      matters="A portfolio decision needs evidence, an explicit action, an owner and a clear direction — not only a dashboard signal."
      decision="Prioritize the highest-impact questions, assign the right Product Manager and review the effect before adding or removing products."
    />

    <div className="p4-intro">
      <div>
        <div className="eyebrow">DECISION QUEUE</div>
        <h2>Evidence → Decision → Owner → Review</h2>
        <p>Choose the portfolio action, assign ownership and leave a clear direction for what should change — including what must be protected.</p>
      </div>
      <div className="p4-kpi"><span>OPEN QUESTIONS</span><b>{decisionQueue.length}</b><small>prototype decision signals</small></div>
    </div>

    <div className="p4-queue">
      {decisionQueue.map(item=><article className="p4-decision-card" key={item.id}>
        <div className="p4-qhead"><span>{item.classification}</span><h3>{item.title}</h3><b>{item.recommendation}</b></div>

        <div className="p4-evidence"><span>EVIDENCE</span><p>{item.evidence}</p></div>
        <div className="p4-why"><span>WHY IT MATTERS</span><p>{item.why}</p></div>

        <div className="p4-decision-section">
          <span>PORTFOLIO ACTION</span>
          <div className="p4-actions">
            {actionSets.map(a=><button className={chosen[item.id]===a?'active':''} onClick={()=>setChosen({...chosen,[item.id]:a})} key={a}>{a}</button>)}
          </div>
        </div>

        <div className="p4-owner-row">
          <label>
            <span>OWNER</span>
            <select value={owners[item.id] || ownerOptions[0]} onChange={e=>setOwners({...owners,[item.id]:e.target.value})}>
              {ownerOptions.map(owner=><option value={owner} key={owner}>{owner}</option>)}
            </select>
          </label>
          <label>
            <span>STATUS</span>
            <select value={statuses[item.id] || 'To review'} onChange={e=>setStatuses({...statuses,[item.id]:e.target.value})}>
              {['To review','In analysis','Test / pilot','Approved','Monitor impact'].map(status=><option value={status} key={status}>{status}</option>)}
            </select>
          </label>
        </div>

        <label className="p4-direction">
          <span>DIRECTION / REMARK</span>
          <textarea
            value={directions[item.id] || ''}
            onChange={e=>setDirections({...directions,[item.id]:e.target.value})}
            rows={2}
          />
        </label>

        <div className="p4-chosen">
          <b>{chosen[item.id]}</b>
          <span>Owner: {owners[item.id]}</span>
          <span>Status: {statuses[item.id]}</span>
        </div>
      </article>)}
    </div>
  </div>
}

export default function PortfolioOS(){
  const [workspace,setWorkspace]=useState<Workspace>('performance')
  const content=useMemo(()=>{
    if(workspace==='performance')return <PortfolioPerformance openDecisions={()=>setWorkspace('decisions')}/>
    if(workspace==='voice')return <CustomerVoice/>
    if(workspace==='competitor')return <CompetitorIntel/>
    if(workspace==='journey')return <JourneyOutcomes/>
    if(workspace==='tracking')return <PackageTracking/>
    return <Decisions/>
  },[workspace])

  return <section className="page portfolio-page">
    <div className="section-head portfolio-main-head">
      <div>
        <div className="eyebrow">PRODUCT PORTFOLIO MANAGEMENT</div>
        <h1 className="section-title">Portfolio Overview</h1>
        <p className="lead">Use learner needs, performance, outcomes, competitor signals and product constraints to decide what to grow, reposition, merge, replace or retire.</p>
      </div>
      <div className="section-number">01</div>
    </div>

    <div className="portfolio-progression">
      <span>PERFORMANCE</span><i>→</i><span>CUSTOMER NEED</span><i>→</i><span>MARKET & COMPETITORS</span><i>→</i><span>PRODUCT DIAGNOSIS</span><i>→</i><span>DECISION</span><i>→</i><span>OWNER & REVIEW</span>
    </div>

    <div className="workspace-tabs">{workspaces.map(w=><button className={workspace===w.id?'active':''} onClick={()=>setWorkspace(w.id)} key={w.id}>{w.label}</button>)}</div>
    <div className="workspace-shell">{content}</div>
  </section>
}
