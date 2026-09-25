export type BenchmarkLevel='Lower Secondary'|'Upper Secondary / TCAS'
export type BenchmarkSubject='Math'|'Physics'|'Chemistry'|'Biology'|'English'
export type BenchmarkMetric='Price / Value'|'Course Breadth'|'Foundation'|'Practice'|'Exam Alignment'|'Support / Flexibility'

export type CompetitorBenchmark={
  level:BenchmarkLevel
  subject:BenchmarkSubject
  brand:string
  metrics:Record<BenchmarkMetric,number>
}

export const benchmarkMetrics:BenchmarkMetric[]=['Price / Value','Course Breadth','Foundation','Practice','Exam Alignment','Support / Flexibility']

const O=(level:BenchmarkLevel,subject:BenchmarkSubject,metrics:CompetitorBenchmark['metrics']):CompetitorBenchmark=>({level,subject,brand:'OnDemand',metrics})
const C=(level:BenchmarkLevel,subject:BenchmarkSubject,brand:string,metrics:CompetitorBenchmark['metrics']):CompetitorBenchmark=>({level,subject,brand,metrics})

export const competitorBenchmarks:CompetitorBenchmark[]=[
  O('Lower Secondary','Math',{'Price / Value':72,'Course Breadth':90,'Foundation':82,'Practice':84,'Exam Alignment':78,'Support / Flexibility':88}),
  C('Lower Secondary','Math','SmartMathPro (พี่ปั้น)',{'Price / Value':78,'Course Breadth':70,'Foundation':90,'Practice':88,'Exam Alignment':82,'Support / Flexibility':76}),
  C('Lower Secondary','Math','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':82,'Foundation':84,'Practice':80,'Exam Alignment':76,'Support / Flexibility':78}),

  O('Lower Secondary','Physics',{'Price / Value':73,'Course Breadth':88,'Foundation':83,'Practice':84,'Exam Alignment':80,'Support / Flexibility':88}),
  C('Lower Secondary','Physics','Applied Physics',{'Price / Value':77,'Course Breadth':72,'Foundation':92,'Practice':90,'Exam Alignment':85,'Support / Flexibility':74}),
  C('Lower Secondary','Physics','WE BY THE BRAIN',{'Price / Value':75,'Course Breadth':82,'Foundation':84,'Practice':79,'Exam Alignment':77,'Support / Flexibility':78}),

  O('Lower Secondary','Chemistry',{'Price / Value':73,'Course Breadth':86,'Foundation':84,'Practice':82,'Exam Alignment':80,'Support / Flexibility':87}),
  C('Lower Secondary','Chemistry','เคมี อ.อุ๊',{'Price / Value':76,'Course Breadth':70,'Foundation':93,'Practice':88,'Exam Alignment':86,'Support / Flexibility':72}),
  C('Lower Secondary','Chemistry','WE BY THE BRAIN',{'Price / Value':75,'Course Breadth':80,'Foundation':84,'Practice':79,'Exam Alignment':77,'Support / Flexibility':78}),

  O('Lower Secondary','Biology',{'Price / Value':73,'Course Breadth':84,'Foundation':84,'Practice':80,'Exam Alignment':78,'Support / Flexibility':87}),
  C('Lower Secondary','Biology','Bio BEAM',{'Price / Value':76,'Course Breadth':68,'Foundation':91,'Practice':86,'Exam Alignment':84,'Support / Flexibility':70}),
  C('Lower Secondary','Biology','WE BY THE BRAIN',{'Price / Value':75,'Course Breadth':80,'Foundation':83,'Practice':78,'Exam Alignment':77,'Support / Flexibility':78}),

  O('Lower Secondary','English',{'Price / Value':71,'Course Breadth':78,'Foundation':80,'Practice':78,'Exam Alignment':76,'Support / Flexibility':86}),
  C('Lower Secondary','English','Enconcept',{'Price / Value':77,'Course Breadth':75,'Foundation':90,'Practice':86,'Exam Alignment':84,'Support / Flexibility':76}),
  C('Lower Secondary','English','WE BY THE BRAIN',{'Price / Value':75,'Course Breadth':77,'Foundation':82,'Practice':77,'Exam Alignment':76,'Support / Flexibility':78}),

  O('Upper Secondary / TCAS','Math',{'Price / Value':70,'Course Breadth':94,'Foundation':84,'Practice':90,'Exam Alignment':94,'Support / Flexibility':90}),
  C('Upper Secondary / TCAS','Math','SmartMathPro (พี่ปั้น)',{'Price / Value':78,'Course Breadth':76,'Foundation':91,'Practice':92,'Exam Alignment':91,'Support / Flexibility':77}),
  C('Upper Secondary / TCAS','Math','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':84,'Foundation':84,'Practice':84,'Exam Alignment':86,'Support / Flexibility':79}),
  C('Upper Secondary / TCAS','Math','Applied Math',{'Price / Value':76,'Course Breadth':70,'Foundation':86,'Practice':91,'Exam Alignment':89,'Support / Flexibility':73}),

  O('Upper Secondary / TCAS','Physics',{'Price / Value':70,'Course Breadth':93,'Foundation':85,'Practice':91,'Exam Alignment':94,'Support / Flexibility':90}),
  C('Upper Secondary / TCAS','Physics','Applied Physics',{'Price / Value':77,'Course Breadth':78,'Foundation':94,'Practice':94,'Exam Alignment':92,'Support / Flexibility':76}),
  C('Upper Secondary / TCAS','Physics','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':83,'Foundation':85,'Practice':84,'Exam Alignment':86,'Support / Flexibility':79}),

  O('Upper Secondary / TCAS','Chemistry',{'Price / Value':70,'Course Breadth':92,'Foundation':85,'Practice':90,'Exam Alignment':94,'Support / Flexibility':89}),
  C('Upper Secondary / TCAS','Chemistry','เคมี อ.อุ๊',{'Price / Value':76,'Course Breadth':76,'Foundation':95,'Practice':93,'Exam Alignment':93,'Support / Flexibility':74}),
  C('Upper Secondary / TCAS','Chemistry','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':82,'Foundation':84,'Practice':83,'Exam Alignment':86,'Support / Flexibility':79}),

  O('Upper Secondary / TCAS','Biology',{'Price / Value':70,'Course Breadth':90,'Foundation':85,'Practice':88,'Exam Alignment':93,'Support / Flexibility':89}),
  C('Upper Secondary / TCAS','Biology','Bio BEAM',{'Price / Value':77,'Course Breadth':74,'Foundation':94,'Practice':91,'Exam Alignment':92,'Support / Flexibility':73}),
  C('Upper Secondary / TCAS','Biology','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':81,'Foundation':84,'Practice':82,'Exam Alignment':85,'Support / Flexibility':79}),

  O('Upper Secondary / TCAS','English',{'Price / Value':69,'Course Breadth':82,'Foundation':81,'Practice':85,'Exam Alignment':91,'Support / Flexibility':88}),
  C('Upper Secondary / TCAS','English','Enconcept',{'Price / Value':77,'Course Breadth':86,'Foundation':93,'Practice':91,'Exam Alignment':93,'Support / Flexibility':78}),
  C('Upper Secondary / TCAS','English','WE BY THE BRAIN',{'Price / Value':74,'Course Breadth':79,'Foundation':83,'Practice':81,'Exam Alignment':84,'Support / Flexibility':79}),
]
