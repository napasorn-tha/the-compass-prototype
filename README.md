# From Catalog to Compass — Product Portfolio Operating System

Interview prototype for **Product Port Lead – Deputy Department Manager, OnDemand**.

## Governing objective

**Learner side:** Right learner → right existing package → expected learning success.

**Portfolio side:** Observed performance + learner outcome + market evidence → better portfolio decision.

The prototype deliberately separates recommendation, diagnosis and portfolio decision-making so each workspace serves the same shared objective instead of becoming an isolated dashboard.

## Shared data backbone

The app now ships with a normalized, read-only prototype data backbone derived from the final learner mock workbook.

Relationship chain:

```
Learner
  → Goal
  → Assessment
  → Recommendation
  → Enrollment
  → Outcome
```

Shared dimensions:

- Course Catalog
- Package Catalog
- Package Components
- Branch Master

Runtime join keys:

- `learner_id`
- `goal_id`
- `recommendation_id`
- `product_id / course_id`
- `package_id`
- `branch_id`

The backbone loads once at app startup, builds reusable indexes, and exposes learner-, package- and branch-level context through `BackboneProvider`. Existing screens are migrated onto this shared store in later batches rather than each keeping separate mock arrays.

### Dataset acceptance checks

The runtime store checks expected row counts and referential links for:

- 430 learner profiles
- 617 goals
- 1,865 assessments
- 709 recommendations
- 414 enrollments
- 330 outcomes
- 161 courses
- 22 packages
- 103 package-course links
- 37 branches

It also checks branch attribution rules: branch-channel enrollments must resolve to a branch, while non-branch transactions should not carry a branch id.

## Recommendation contract

Future learner/advisor migration uses three slots:

1. **Best Match** — highest fit among eligible packages
2. **Best Value** — lowest price among packages that still satisfy the learner need
3. **More Support** — higher-support pathway for larger gaps / support needs

Intensive / Upskill / advanced options are gated: the learner must either complete the prerequisite OnDemand course or pass the required baseline threshold.

## Portfolio workspace order

1. Portfolio Performance
2. Customer Voice
3. Competitor Intel
4. Journey & Outcomes
5. Package Tracking
6. Decision Queue

## Prototype note

Learner, commercial and performance data are synthetic/proxy. Public catalog, branch and market mappings use observable sources and may require internal validation.
