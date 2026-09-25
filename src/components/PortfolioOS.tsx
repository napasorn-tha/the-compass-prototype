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

type Workspace = 'performance' | 'voice' | 'competitor' | 'tracking' | 'growth' | 'decisions'

const workspaces: {id:Workspace;label:string}[] = [
  {id:'performance',label:'Overview'},
  {id:'voice',label:'Customer'},
  {id:'competitor',label:'Market'},
  {id:'tracking',label:'Products'},
  {id:'growth',label:'Growth'},
  {id:'decisions',label:'Decisions'},
]

const thb=(n:number)=>'฿'+n.toLocaleString()
const geoLabel=(name:string)=>name==='Metro'?'Greater Bangkok':name

function PortfolioPerformance({openDecisions}:{openDecisions:()=>void}) {
  const [lens,setLens]=useState<'Segment'|'Package'|'Geography'|'Delivery'>('Segment')
  const o=appSnapshot.overall

  const rows = lens==='Segment'
    ? appSnapshot.segmentStats.map(x=>({name:x.segment,detail:x.learners+' learners',revenue:x.revenue,enrollments:x.enrollments,completion:x.completion,outcome:x.goalAchieved}))
    : lens==='Package'
      ? appSnapshot.packageStats.slice(0,10).map(x=>({name:x.packageName,detail:x.track,revenue:x.revenue,enrollments:x.enrollments,completion:x.completion,outcome:x.goalAchieved}))
      : lens==='Geography'
        ? appSnapshot.geographyStats.map(x=>({name:geoLabel(x.cluster),detail:x.learners+' learners',revenue:x.revenue,enrollments:x.enrollments,completion:x.completion,outcome:x.goalAchieved}))
        : appSnapshot.deliveryStats.map(x=>({name:x.mode,detail:'delivery mode',revenue:x.revenue,enrollments:x.enrollments,completion:x.completion,outcome:x.goalAchieved}))

  const topPackages=[...appSnapshot.packageStats].sort((a,b)=>b.revenue-a.revenue).slice(0,5)
  const maxPackageRevenue=Math.max(...topPackages.map(x=>x.revenue),1)
  const salesChannels=appSnapshot.channelStats
  const demandRegions=appSnapshot.regionDemandStats
  const demandProvinces=appSnapshot.provinceDemandStats.slice(0,6)
  const topBranches=[...appSnapshot.branchStats].sort((a,b)=>b.revenue-a.revenue).slice(0,5)

  return <div className="p4-stack p4-overview">
    <div className="p4-page-title">
      <div><span>PORTFOLIO OVERVIEW</span><h2>What is happening in the portfolio?</h2></div>
      <button onClick={openDecisions}>Open decisions →</button>
    </div>

    <div className="p4-metrics p4-metrics-main">
      <article><span>Revenue</span><b>{thb(o.revenue)}</b></article>
      <article><span>Enrollments</span><b>{o.enrollments}</b></article>
      <article><span>Rec → Paid</span><b>{o.recToPaid}%</b><small>within 14 days</small></article>
      <article><span>Outcome</span><b>{o.goalAchieved}%</b><small>goal achieved</small></article>
    </div>

    <div className="p4-visual-grid">
      <section className="p4-visual-panel">
        <div className="p4-panel-head"><span>PORTFOLIO MIX</span><b>Top packages by revenue</b></div>
        <div className="p4-bar-list">
          {topPackages.map((x,i)=><div className="p4-bar-row" key={x.packageId}>
            <span>{String(i+1).padStart(2,'0')}</span>
            <div><b>{x.packageName}</b><small>{x.track}</small></div>
            <i><em style={{width:(x.revenue/maxPackageRevenue*100)+'%'}}/></i>
            <strong>{thb(x.revenue)}</strong>
          </div>)}
        </div>
      </section>

      <section className="p4-visual-panel attention-panel">
        <div className="p4-panel-head"><span>NEEDS ATTENTION</span><b>Questions worth a portfolio decision</b></div>
        <div className="p4-attention-list">
          {decisionQueue.slice(0,3).map(item=><button key={item.id} onClick={openDecisions}>
            <span>{item.classification}</span>
            <b>{item.title}</b>
            <small>{item.recommendation}</small>
          </button>)}
        </div>
      </section>
    </div>

    <div className="p4-section-row">
      <div><span>VIEW BY</span><b>Change the lens</b></div>
      <div className="p4-filterline">
        {(['Segment','Package','Geography','Delivery'] as const).map(x=><button className={lens===x?'active':''} onClick={()=>setLens(x)} key={x}>{x}</button>)}
      </div>
    </div>

    <div className="p4-performance-table">
      <div className="p4-performance-head compact"><span>{lens.toUpperCase()}</span><span>REVENUE</span><span>ENROLLMENTS</span><span>COMPLETION</span><span>OUTCOME</span><span>STATUS</span></div>
      {rows.map(row=><div className="p4-performance-row compact" key={row.name}>
        <div><b>{row.name}</b><small>{row.detail}</small></div>
        <span>{thb(row.revenue)}</span>
        <span>{row.enrollments}</span>
        <span>{row.completion}%</span>
        <span>{row.outcome}%</span>
        <strong className={row.outcome>=65?'signal-healthy':row.outcome<45?'signal-priority':'signal-watch'}>{row.outcome>=65?'OK':row.outcome<45?'REVIEW':'WATCH'}</strong>
      </div>)}
    </div>

    {lens==='Geography' && <div className="p4-geo-dual">
      <article>
        <div className="p4-geo-head"><span>DEMAND</span><b>Where learners come from</b></div>
        <div className="p4-geo-clusters">{demandRegions.map(x=><div key={x.name}><b>{geoLabel(x.name)}</b><span>{x.count}</span><small>{x.share}%</small></div>)}</div>
        <div className="p4-geo-detail"><span>TOP PROVINCES</span>{demandProvinces.map(x=><b key={x.name}>{x.name} · {x.count}</b>)}</div>
      </article>
      <article>
        <div className="p4-geo-head"><span>SALES</span><b>Where purchases happen</b></div>
        <div className="p4-geo-clusters">{salesChannels.map(x=><div key={x.name}><b>{x.name}</b><span>{x.count}</span><small>{x.revenueShare}% revenue</small></div>)}</div>
        <div className="p4-geo-detail"><span>TOP BRANCH SALES</span>{topBranches.map(x=><b key={x.branchId}>{x.branchName} · {thb(x.revenue)}</b>)}</div>
      </article>
    </div>}
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
    <div className="p4-page-title">
      <div><span>CUSTOMER</span><h2>What is getting in the learner's way?</h2><p>ดู feedback ตาม stage + subject + package ไม่เหมารวมทั้งแบรนด์</p></div>
    </div>

    <div className="p4-filterbox minimal">
      <div><span>STAGE</span>{stages.map(x=><button className={stage===x?'active':''} onClick={()=>chooseStage(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{Array.from(new Set(customerVoiceRecords.filter(v=>v.stage===stage).map(v=>v.subject))).map(x=><button className={subject===x?'active':''} onClick={()=>setSubject(x)} key={x}>{x}</button>)}</div>
    </div>

    <div className="p4-customer-hero">
      <div><span>COURSE / PACK</span><h3>{selected.pack}</h3><p>{selected.takeaway}</p></div>
      <div><span>SO WHAT?</span><b>{selected.implication}</b></div>
    </div>

    <div className="p4-themegrid">
      {selected.themes.map(([theme,count,detail])=><article key={String(theme)}>
        <span>{count} mentions</span>
        <b>{theme}</b>
        <p>{detail}</p>
        <div><i style={{width:(Number(count)/selected.sample*100)+'%'}}/></div>
      </article>)}
    </div>

    <div className="p4-journey-strip">
      <span>Need</span><i>→</i><span>Baseline</span><i>→</i><span>Gap</span><i>→</i><span>Path</span><i>→</i><span>Outcome</span>
    </div>
  </div>
}

function CompetitorIntel() {
  const subjects = ['Math','Physics','Chemistry','Biology','English'] as const
  const [subject,setSubject] = useState<(typeof subjects)[number]>('Physics')
  const levels = ['Lower Secondary','Upper Secondary / TCAS'] as const
  const [level,setLevel] = useState<(typeof levels)[number]>('Upper Secondary / TCAS')
  const rows = competitorProfiles.filter(x=>x.subject===subject && x.level===level)

  const points=rows.map((item,index)=>{
    if(item.brand==='OnDemand') return {...item,x:66,y:78}
    if(item.type==='Specialist') return {...item,x:48+(index%2)*8,y:68+(index%3)*4}
    return {...item,x:34+(index%2)*6,y:58+(index%3)*5}
  })

  return <div className="p4-stack">
    <div className="p4-page-title">
      <div><span>MARKET</span><h2>Keep the exam strength. Close the foundation gap.</h2><p>OnDemand ชนะได้ด้วย one-stop journey + question bank + mock technology แล้วใช้ Compass ช่วย route เด็กให้เริ่มถูกระดับ</p></div>
    </div>

    <div className="p4-filterbox minimal">
      <div><span>LEVEL</span>{levels.map(x=><button className={level===x?'active':''} onClick={()=>setLevel(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{subjects.map(x=><button className={subject===x?'active':''} onClick={()=>setSubject(x)} key={x}>{x}</button>)}</div>
    </div>

    <div className="p4-market-grid">
      <section className="p4-position-map">
        <div className="axis-y">Exam depth & one-stop ↑</div>
        <div className="axis-x">Foundation & personalization →</div>
        <div className="grid-v"/>
        <div className="grid-h"/>
        {points.map(item=><div
          className={'market-dot '+(item.brand==='OnDemand'?'owner':'')}
          key={item.brand+item.subject}
          style={{left:item.x+'%',bottom:item.y+'%'}}
        ><b>{item.brand}</b></div>)}
        <div className="market-target" style={{left:'83%',bottom:'86%'}}><span>COMPASS</span><b>Personalized one-stop journey</b></div>
        <div className="market-arrow">↗</div>
      </section>

      <section className="p4-market-story">
        <div className="strength">
          <span>ADVANTAGE</span>
          <b>One-stop exam preparation</b>
          <p>หลายวิชา หลายช่วงชั้น และต่อ journey ได้ใน ecosystem เดียว</p>
        </div>
        <div className="strength">
          <span>ADVANTAGE</span>
          <b>Question bank + realistic mock</b>
          <p>practice depth และ technology เป็นจุดแข็งที่ต่อยอดได้</p>
        </div>
        <div className="gap">
          <span>GAP TO CLOSE</span>
          <b>Foundation & pace fit</b>
          <p>วัดก่อน → ปิดพื้นฐาน → ค่อยส่งเข้า core / intensive</p>
        </div>
      </section>
    </div>

    <div className="p4-competitor-lines">
      {rows.map(item=><article className={item.brand==='OnDemand'?'owner':''} key={item.brand+item.subject}>
        <div><small>{item.type}</small><b>{item.brand}</b></div>
        <p>{item.visibleOffer}</p>
        <strong>{item.portfolioQuestion}</strong>
      </article>)}
    </div>
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
  const confusions = visible.filter(x=>x.issue==='DISCOVERY_CONFUSION').length
  const overlaps = visible.filter(x=>x.issue==='OVERLAP_REVIEW').length

  const switchStage = (next:LifeStage) => {
    setStage(next)
    const first = catalogOffers.find(x=>x.stage===next)
    if(first) setSubject(first.subject)
    setNeed('ALL')
  }

  return <div className="p4-stack">
    <div className="p4-page-title">
      <div><span>PRODUCTS</span><h2>Less choice. Clearer choice.</h2><p>แยกให้ออกว่าอะไรซ้ำจริง อะไรแค่หน้าร้านทำให้เลือกยาก</p></div>
    </div>

    <div className="p4-filterbox minimal">
      <div><span>STAGE</span>{(['Primary','Lower Secondary','Upper Secondary'] as LifeStage[]).map(x=><button className={stage===x?'active':''} onClick={()=>switchStage(x)} key={x}>{x}</button>)}</div>
      <div><span>SUBJECT</span>{subjectOptions.map(x=><button className={safeSubject===x?'active':''} onClick={()=>{setSubject(x);setNeed('ALL')}} key={x}>{x}</button>)}</div>
      <div><span>NEED</span><button className={need==='ALL'?'active':''} onClick={()=>setNeed('ALL')}>ALL</button>{needStates.map(x=><button className={need===x?'active':''} onClick={()=>setNeed(x)} key={x}>{x}</button>)}</div>
    </div>

    <div className="p4-product-summary">
      <div><span>FAMILIES</span><b>{families.length}</b></div>
      <div><span>CHOICE CONFUSION</span><b>{confusions}</b></div>
      <div><span>OVERLAP TO REVIEW</span><b>{overlaps}</b></div>
    </div>

    <div className="p4-familygrid">
      {families.map(family=>{
        const familyRows=visible.filter(x=>x.family===family)
        return <article className="p4-family clean" key={family}>
          <div className="p4-familyhead"><div><span>PRODUCT FAMILY</span><h3>{family}</h3></div><b>{familyRows.length} offers</b></div>
          <div className="p4-layerlist">
            {familyRows.map(item=><div className={'p4-offer p4-'+item.issue.toLowerCase()} key={item.id}>
              <div className="p4-layer">{item.layer}</div>
              <div className="p4-offermain"><b>{item.name}</b><small>{item.price ? '฿'+item.price.toLocaleString() : ''}</small></div>
              <div className="p4-issue">{item.issue==='CLEAR_ROLE'?'CLEAR':item.issue==='DISCOVERY_CONFUSION'?'CLARIFY':'REVIEW'}</div>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">↗</a>
            </div>)}
          </div>
        </article>
      })}
      {!families.length && <div className="p4-empty">No mapped offer in this view.</div>}
    </div>

    <div className="p4-product-rule">
      <div><b>KEEP</b><span>role ชัด + customer เข้าใจ</span></div>
      <div><b>CHANGE</b><span>role ต่างแต่ discovery สับสน / overlap ต้องจัดใหม่</span></div>
      <div><b>EXIT</b><span>ถูกแทนแล้ว หรือไม่มี strategic role เหลือ</span></div>
    </div>
  </div>
}

function GrowthAndSynergy() {
  const intl=ecosystemRoutes.find(x=>x.id==='route-intl') || ecosystemRoutes[0]

  return <div className="p4-stack">
    <div className="p4-page-title">
      <div><span>GROWTH & SYNERGY</span><h2>Orchestrate first. Build second.</h2><p>ก่อนสร้าง product ใหม่ ให้เช็กของในพอร์ต ของในเครือ และสิ่งที่ขายคู่กันได้ก่อน</p></div>
    </div>

    <div className="p4-growth-questions">
      <article><span>01</span><b>Own portfolio</b><p>มี product เดิมตอบ need นี้อยู่แล้วหรือยัง?</p></article>
      <article><span>02</span><b>Sister companies</b><p>capability นี้มีคนในเครือทำได้ดีกว่าอยู่แล้วไหม?</p></article>
      <article><span>03</span><b>Sell together</b><p>อะไรควร bundle / refer เพื่อให้ customer เห็น path เดียว?</p></article>
    </div>

    <section className="p4-growth-hero">
      <div className="growth-need">
        <span>NEW ADDRESSABLE MARKET</span>
        <h3>{intl.learner}</h3>
        <p>International · GED · bilingual · Thai students returning from abroad</p>
      </div>
      <div className="growth-path">
        <div><span>1</span><b>Ignite</b><small>consult + international readiness</small></div>
        <i>→</i>
        <div className="owner"><span>2</span><b>OnDemand</b><small>Thai STEM / A-Level preparation</small></div>
        <i>→</i>
        <div><span>3</span><b>TCASter</b><small>admission planning</small></div>
      </div>
      <div className="growth-gap">
        <span>BUILD ONLY THE GAP</span>
        <b>Thai technical terminology + Thai exam-format bridge</b>
      </div>
    </section>

    <div className="p4-route-list">
      {ecosystemRoutes.map(route=><article key={route.id}>
        <div><span>LEARNER NEED</span><b>{route.learner}</b></div>
        <div><span>KEEP WITH ONDEMAND</span><b>{route.ownedPath}</b></div>
        <div><span>SELL / ROUTE WITH</span>{route.bridges.map(x=><b key={x.brand}>{x.brand} · {x.role}</b>)}</div>
        <div><span>BUILD ONLY IF</span><b>{route.buildOnlyIf}</b></div>
      </article>)}
    </div>
  </div>
}

function Decisions() {
  const ownerOptions=['PM — Portfolio','PM — Journey','PM — Market & Data','PM — Growth & Ecosystem','PM — TCAS','PM — Lower Secondary']
  const defaultOwners:Record<string,string>={
    Q01:'PM — Portfolio',
    Q02:'PM — Portfolio',
    Q03:'PM — Journey',
    Q04:'PM — Portfolio',
    Q05:'PM — Growth & Ecosystem',
  }
  const defaultDirections:Record<string,string>={
    Q01:'Clarify cohort vs content version before changing the SKU structure.',
    Q02:'Do not merge until substitution and outcome show true cannibalization.',
    Q03:'Keep modular content. Simplify the learner entry point.',
    Q04:'Simplify the choice first; protect useful backend variants.',
    Q05:'Pilot the cross-company path before building a standalone SKU.',
  }
  const subActions={
    KEEP:['Protect','Grow','Cross-sell'],
    CHANGE:['Reposition','Simplify','Merge','Repackage','Bundle','Pilot'],
    EXIT:['Retire','Replace','Migrate'],
  } as const

  const [direction,setDirection]=useState<Record<string,'KEEP'|'CHANGE'|'EXIT'>>(
    Object.fromEntries(decisionQueue.map(x=>[x.id,'CHANGE'])) as Record<string,'KEEP'|'CHANGE'|'EXIT'>
  )
  const [subAction,setSubAction]=useState<Record<string,string>>({})
  const [owners,setOwners]=useState<Record<string,string>>(defaultOwners)
  const [remarks,setRemarks]=useState<Record<string,string>>(defaultDirections)

  return <div className="p4-stack">
    <div className="p4-page-title">
      <div><span>DECISIONS</span><h2>Keep. Change. Exit.</h2><p>จาก insight ไปสู่ direction ที่ Product Manager เอาไปทำต่อได้</p></div>
      <div className="p4-kpi quiet"><span>OPEN</span><b>{decisionQueue.length}</b></div>
    </div>

    <div className="p4-queue">
      {decisionQueue.map(item=>{
        const d=direction[item.id]
        return <article className="p4-decision-card clean" key={item.id}>
          <div className="p4-qhead">
            <span>{item.classification}</span>
            <h3>{item.title}</h3>
          </div>

          <div className="p4-decision-evidence">
            <p>{item.evidence}</p>
            <small>{item.why}</small>
          </div>

          <div className="p4-big-actions">
            {(['KEEP','CHANGE','EXIT'] as const).map(a=><button className={d===a?'active':''} onClick={()=>{setDirection({...direction,[item.id]:a});setSubAction({...subAction,[item.id]:''})}} key={a}>{a}</button>)}
          </div>

          <div className="p4-sub-actions">
            {subActions[d].map(a=><button className={subAction[item.id]===a?'active':''} onClick={()=>setSubAction({...subAction,[item.id]:a})} key={a}>{a}</button>)}
          </div>

          <div className="p4-decision-bottom">
            <label><span>OWNER</span><select value={owners[item.id]} onChange={e=>setOwners({...owners,[item.id]:e.target.value})}>{ownerOptions.map(x=><option value={x} key={x}>{x}</option>)}</select></label>
            <label><span>DIRECTION</span><textarea rows={2} value={remarks[item.id]} onChange={e=>setRemarks({...remarks,[item.id]:e.target.value})}/></label>
          </div>
        </article>
      })}
    </div>
  </div>
}

export default function PortfolioOS(){
  const [workspace,setWorkspace]=useState<Workspace>('performance')

  const content=useMemo(()=>{
    if(workspace==='performance') return <PortfolioPerformance openDecisions={()=>setWorkspace('decisions')}/>
    if(workspace==='voice') return <CustomerVoice/>
    if(workspace==='competitor') return <CompetitorIntel/>
    if(workspace==='tracking') return <PackageTracking/>
    if(workspace==='growth') return <GrowthAndSynergy/>
    return <Decisions/>
  },[workspace])

  return <section className="page portfolio-page">
    <div className="section-head portfolio-main-head">
      <div>
        <div className="eyebrow">PRODUCT PORTFOLIO</div>
        <h1 className="section-title">Portfolio Intelligence</h1>
        <p className="lead">เห็นภาพพอร์ต → เข้าใจ customer → รู้ตำแหน่งในตลาด → ตัดสินใจว่าอะไรควรอยู่ เปลี่ยน หรือออก</p>
      </div>
      <div className="section-number">01</div>
    </div>

    <div className="workspace-tabs">{workspaces.map(w=><button className={workspace===w.id?'active':''} onClick={()=>setWorkspace(w.id)} key={w.id}>{w.label}</button>)}</div>
    <div className="workspace-shell">{content}</div>
  </section>
}
