export const SYSTEM_OBJECTIVE = {
  learner: 'Right learner → right existing package → expected learning success',
  portfolio: 'Observed performance + learner outcome + market evidence → better portfolio decision',
} as const

export const LEVEL_LABELS = ['Primary','Lower Secondary','Upper Secondary / TCAS'] as const

export const RECOMMENDATION_SLOTS = [
  {id:'best-match', label:'Best Match', rule:'Highest fit among eligible packages'},
  {id:'best-value', label:'Best Value', rule:'Lowest price among packages that still satisfy the learner need'},
  {id:'more-support', label:'More Support', rule:'Higher-support pathway for learners with larger gaps or support needs'},
] as const

export const INTENSIVE_GATE = {
  rule: 'Intensive / Upskill / advanced packages require either prerequisite OnDemand course completion or a passing baseline assessment.',
  fallback: 'If the learner does not pass the gate, recommend the prerequisite foundation/core package first.',
} as const

export const PORTFOLIO_WORKSPACE_ORDER = [
  'Portfolio Performance',
  'Customer Voice',
  'Competitor Intel',
  'Journey & Outcomes',
  'Package Tracking',
  'Decision Queue',
] as const

export const PROTOTYPE_DISCLOSURE =
  'Prototype note · Learner, commercial and performance data are synthetic/proxy. Public catalog, branch and market mappings use observable sources and may require internal validation.'
