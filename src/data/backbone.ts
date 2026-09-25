import { BACKBONE_GZIP_BASE64 } from './backbonePayload'

type Cell = string | number | boolean | null
type Row = Record<string, Cell>
type ColumnarTable = { columns: string[]; rows: Cell[][] }

type RawBackbone = {
  Learner_Profile: ColumnarTable
  Learner_Goal: ColumnarTable
  Learner_Assessment: ColumnarTable
  Learner_Recommendation: ColumnarTable
  Learner_Enrollment: ColumnarTable
  Learner_Outcome: ColumnarTable
  Course_Catalog: ColumnarTable
  Package_Catalog: ColumnarTable
  Package_Component: ColumnarTable
  Branch_Master: ColumnarTable
}

export type LearnerProfile = Row & {
  learner_id: string
  segment: string
  life_stage: string
  current_grade: string
  region: string
  province: string
  preferred_learning_mode: string
}

export type LearnerGoal = Row & {
  goal_id: string
  learner_id: string
  need_state: string
  goal_type: string
  target_exam: string
  target_subject: string
  target_institution: string
  target_program: string
  admission_round: string
  cohort_year: string | number
  target_score: number
}

export type LearnerAssessment = Row & {
  assessment_id: string
  learner_id: string
  goal_id: string
  assessment_type: string
  exam_type: string
  subject: string
  topic_focus: string
  normalized_score: number
  subject_confidence_1to5: number
}

export type LearnerRecommendation = Row & {
  recommendation_id: string
  learner_id: string
  goal_id: string
  product_id: string
  recommendation_rank: number
  course_stage: string
  support_tier: string
  recommendation_source: string
  recommendation_reason: string
  accepted: boolean | string | number
  package_id: string
}

export type LearnerEnrollment = Row & {
  enrollment_id: string
  learner_id: string
  goal_id: string
  recommendation_id: string
  product_id: string
  learning_mode: string
  purchase_channel: string
  list_price_thb: number
  discount_rate: number
  purchase_price_thb: number
  enrollment_status: string
  completion_pct: number
  watch_hours: number
  practice_count: number
  mock_count: number
  package_id: string
  branch_id: string
}

export type LearnerOutcome = Row & {
  outcome_id: string
  learner_id: string
  goal_id: string
  baseline_score: number
  final_score: number
  target_score: number
  score_improvement: number
  goal_achieved: boolean | string | number
  admission_result: string
  admitted_institution: string
  admitted_program: string
  admission_round: string
}

export type CourseCatalogItem = Row & {
  course_id: string
  course_name: string
  life_stage: string
  need_state: string
  exam_type: string
  subject: string
  course_stage: string
  default_delivery_mode: string
  list_price_thb: number
  content_hours: number
}

export type PackageCatalogItem = Row & {
  package_id: string
  package_name: string
  life_stage: string
  target_track: string
  bundle_discount_rate: number
  component_count: number
  component_list_value_thb: number
  package_price_thb: number
  positioning: string
}

export type PackageComponent = Row & {
  package_id: string
  course_id: string
  component_role: string
  subject: string
  exam_type: string
  course_stage: string
  component_list_price_thb: number
}

export type Branch = Row & {
  branch_id: string
  branch_name: string
  branch_province: string
  branch_region: string
  market_cluster: string
}

export type BackboneData = {
  profiles: LearnerProfile[]
  goals: LearnerGoal[]
  assessments: LearnerAssessment[]
  recommendations: LearnerRecommendation[]
  enrollments: LearnerEnrollment[]
  outcomes: LearnerOutcome[]
  courses: CourseCatalogItem[]
  packages: PackageCatalogItem[]
  packageComponents: PackageComponent[]
  branches: Branch[]
}

export type DataQualityReport = {
  healthy: boolean
  expectedCounts: Record<keyof BackboneData, number>
  actualCounts: Record<keyof BackboneData, number>
  brokenLinks: Record<string, number>
}

function inflate<T extends Row>(table: ColumnarTable): T[] {
  return table.rows.map((values) => {
    const row: Row = {}
    table.columns.forEach((column, index) => {
      row[column] = values[index] ?? null
    })
    return row as T
  })
}

function groupBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const value = key(item)
    if (!value) continue
    const current = map.get(value)
    if (current) current.push(item)
    else map.set(value, [item])
  }
  return map
}

function mapBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const map = new Map<string, T>()
  for (const item of items) {
    const value = key(item)
    if (value) map.set(value, item)
  }
  return map
}

async function decodePayload(): Promise<RawBackbone> {
  const binary = atob(BACKBONE_GZIP_BASE64)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const Decompressor = (globalThis as unknown as {
    DecompressionStream: new (format: string) => TransformStream<Uint8Array, Uint8Array>
  }).DecompressionStream

  if (!Decompressor) {
    throw new Error('This browser does not support the compressed prototype data payload.')
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new Decompressor('gzip'))
  const json = await new Response(stream).text()
  return JSON.parse(json) as RawBackbone
}

const EXPECTED_COUNTS: Record<keyof BackboneData, number> = {
  profiles: 430,
  goals: 617,
  assessments: 1865,
  recommendations: 709,
  enrollments: 414,
  outcomes: 330,
  courses: 161,
  packages: 22,
  packageComponents: 103,
  branches: 37,
}

export class BackboneStore {
  readonly data: BackboneData

  readonly profileByLearner: Map<string, LearnerProfile>
  readonly goalsByLearner: Map<string, LearnerGoal[]>
  readonly assessmentsByLearner: Map<string, LearnerAssessment[]>
  readonly assessmentsByGoal: Map<string, LearnerAssessment[]>
  readonly recommendationsByLearner: Map<string, LearnerRecommendation[]>
  readonly recommendationsByGoal: Map<string, LearnerRecommendation[]>
  readonly enrollmentsByLearner: Map<string, LearnerEnrollment[]>
  readonly enrollmentsByRecommendation: Map<string, LearnerEnrollment[]>
  readonly outcomesByLearner: Map<string, LearnerOutcome[]>
  readonly outcomesByGoal: Map<string, LearnerOutcome[]>
  readonly courseById: Map<string, CourseCatalogItem>
  readonly packageById: Map<string, PackageCatalogItem>
  readonly componentsByPackage: Map<string, PackageComponent[]>
  readonly branchById: Map<string, Branch>
  readonly quality: DataQualityReport

  constructor(data: BackboneData) {
    this.data = data
    this.profileByLearner = mapBy(data.profiles, (x) => x.learner_id)
    this.goalsByLearner = groupBy(data.goals, (x) => x.learner_id)
    this.assessmentsByLearner = groupBy(data.assessments, (x) => x.learner_id)
    this.assessmentsByGoal = groupBy(data.assessments, (x) => x.goal_id)
    this.recommendationsByLearner = groupBy(data.recommendations, (x) => x.learner_id)
    this.recommendationsByGoal = groupBy(data.recommendations, (x) => x.goal_id)
    this.enrollmentsByLearner = groupBy(data.enrollments, (x) => x.learner_id)
    this.enrollmentsByRecommendation = groupBy(data.enrollments, (x) => x.recommendation_id)
    this.outcomesByLearner = groupBy(data.outcomes, (x) => x.learner_id)
    this.outcomesByGoal = groupBy(data.outcomes, (x) => x.goal_id)
    this.courseById = mapBy(data.courses, (x) => x.course_id)
    this.packageById = mapBy(data.packages, (x) => x.package_id)
    this.componentsByPackage = groupBy(data.packageComponents, (x) => x.package_id)
    this.branchById = mapBy(data.branches, (x) => x.branch_id)
    this.quality = this.buildQualityReport()
  }

  private buildQualityReport(): DataQualityReport {
    const actualCounts = Object.fromEntries(
      (Object.keys(EXPECTED_COUNTS) as (keyof BackboneData)[]).map((key) => [key, this.data[key].length]),
    ) as Record<keyof BackboneData, number>

    const goalById = mapBy(this.data.goals, (x) => x.goal_id)
    const recommendationById = mapBy(this.data.recommendations, (x) => x.recommendation_id)

    const brokenLinks = {
      goalToLearner: this.data.goals.filter((x) => !this.profileByLearner.has(x.learner_id)).length,
      assessmentToLearner: this.data.assessments.filter((x) => !this.profileByLearner.has(x.learner_id)).length,
      assessmentToGoal: this.data.assessments.filter((x) => !goalById.has(x.goal_id)).length,
      recommendationToLearner: this.data.recommendations.filter((x) => !this.profileByLearner.has(x.learner_id)).length,
      recommendationToGoal: this.data.recommendations.filter((x) => !goalById.has(x.goal_id)).length,
      recommendationToCourse: this.data.recommendations.filter((x) => x.product_id && !this.courseById.has(x.product_id)).length,
      recommendationToPackage: this.data.recommendations.filter((x) => x.package_id && !this.packageById.has(x.package_id)).length,
      enrollmentToLearner: this.data.enrollments.filter((x) => !this.profileByLearner.has(x.learner_id)).length,
      enrollmentToGoal: this.data.enrollments.filter((x) => !goalById.has(x.goal_id)).length,
      enrollmentToRecommendation: this.data.enrollments.filter((x) => x.recommendation_id && !recommendationById.has(x.recommendation_id)).length,
      enrollmentToCourse: this.data.enrollments.filter((x) => x.product_id && !this.courseById.has(x.product_id)).length,
      enrollmentToPackage: this.data.enrollments.filter((x) => x.package_id && !this.packageById.has(x.package_id)).length,
      branchChannelWithoutValidBranch: this.data.enrollments.filter(
        (x) => x.purchase_channel === 'Branch' && (!x.branch_id || !this.branchById.has(x.branch_id)),
      ).length,
      nonBranchWithBranch: this.data.enrollments.filter(
        (x) => x.purchase_channel !== 'Branch' && Boolean(x.branch_id),
      ).length,
      packageComponentToPackage: this.data.packageComponents.filter((x) => !this.packageById.has(x.package_id)).length,
      packageComponentToCourse: this.data.packageComponents.filter((x) => !this.courseById.has(x.course_id)).length,
    }

    const countsMatch = (Object.keys(EXPECTED_COUNTS) as (keyof BackboneData)[]).every(
      (key) => actualCounts[key] === EXPECTED_COUNTS[key],
    )
    const linksMatch = Object.values(brokenLinks).every((count) => count === 0)

    return { healthy: countsMatch && linksMatch, expectedCounts: EXPECTED_COUNTS, actualCounts, brokenLinks }
  }

  getLearnerJourney(learnerId: string) {
    const goals = this.goalsByLearner.get(learnerId) ?? []
    const goalIds = new Set(goals.map((x) => x.goal_id))

    return {
      profile: this.profileByLearner.get(learnerId) ?? null,
      goals,
      assessments: (this.assessmentsByLearner.get(learnerId) ?? []).filter((x) => goalIds.has(x.goal_id)),
      recommendations: (this.recommendationsByLearner.get(learnerId) ?? []).filter((x) => goalIds.has(x.goal_id)),
      enrollments: this.enrollmentsByLearner.get(learnerId) ?? [],
      outcomes: this.outcomesByLearner.get(learnerId) ?? [],
    }
  }

  getPackageContext(packageId: string) {
    const components = this.componentsByPackage.get(packageId) ?? []
    return {
      package: this.packageById.get(packageId) ?? null,
      components: components.map((component) => ({
        ...component,
        course: this.courseById.get(component.course_id) ?? null,
      })),
      recommendations: this.data.recommendations.filter((x) => x.package_id === packageId),
      enrollments: this.data.enrollments.filter((x) => x.package_id === packageId),
    }
  }

  getBranchContext(branchId: string) {
    return {
      branch: this.branchById.get(branchId) ?? null,
      enrollments: this.data.enrollments.filter((x) => x.branch_id === branchId),
    }
  }
}

let cached: Promise<BackboneStore> | null = null

export function loadBackbone() {
  if (!cached) {
    cached = decodePayload().then((raw) => new BackboneStore({
      profiles: inflate<LearnerProfile>(raw.Learner_Profile),
      goals: inflate<LearnerGoal>(raw.Learner_Goal),
      assessments: inflate<LearnerAssessment>(raw.Learner_Assessment),
      recommendations: inflate<LearnerRecommendation>(raw.Learner_Recommendation),
      enrollments: inflate<LearnerEnrollment>(raw.Learner_Enrollment),
      outcomes: inflate<LearnerOutcome>(raw.Learner_Outcome),
      courses: inflate<CourseCatalogItem>(raw.Course_Catalog),
      packages: inflate<PackageCatalogItem>(raw.Package_Catalog),
      packageComponents: inflate<PackageComponent>(raw.Package_Component),
      branches: inflate<Branch>(raw.Branch_Master),
    }))
  }
  return cached
}
