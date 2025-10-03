/**
 * Hypothesis Testing Statistical Functions
 * Implements t-tests, ANOVA, chi-square, and normality tests
 */

// ===== T-TESTS =====

export interface TTestResult {
  statistic: number
  pValue: number
  degreesOfFreedom: number
  mean: number
  stdError: number
  confidenceInterval: [number, number]
  significant: boolean
  conclusion: string
}

/**
 * One-sample t-test
 * Tests if sample mean differs from hypothesized mean
 */
export function oneSampleTTest(
  data: number[],
  hypothesizedMean: number,
  alpha: number = 0.05
): TTestResult {
  const n = data.length
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const stdDev = Math.sqrt(variance)
  const stdError = stdDev / Math.sqrt(n)
  
  // t-statistic
  const tStat = (mean - hypothesizedMean) / stdError
  const df = n - 1
  
  // p-value (two-tailed)
  const pValue = 2 * (1 - studentTCDF(Math.abs(tStat), df))
  
  // Confidence interval
  const tCritical = studentTInverse(1 - alpha / 2, df)
  const marginOfError = tCritical * stdError
  const confidenceInterval: [number, number] = [
    mean - marginOfError,
    mean + marginOfError
  ]
  
  const significant = pValue < alpha
  const conclusion = significant
    ? `Reject null hypothesis: Sample mean (${mean.toFixed(4)}) differs significantly from ${hypothesizedMean} (p = ${pValue.toFixed(4)})`
    : `Fail to reject null hypothesis: Sample mean (${mean.toFixed(4)}) does not differ significantly from ${hypothesizedMean} (p = ${pValue.toFixed(4)})`
  
  return {
    statistic: tStat,
    pValue,
    degreesOfFreedom: df,
    mean,
    stdError,
    confidenceInterval,
    significant,
    conclusion
  }
}

/**
 * Two-sample t-test (independent samples)
 * Tests if two sample means differ significantly
 */
export function twoSampleTTest(
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05,
  assumeEqualVariance: boolean = true
): TTestResult {
  const n1 = sample1.length
  const n2 = sample2.length
  
  const mean1 = sample1.reduce((sum, val) => sum + val, 0) / n1
  const mean2 = sample2.reduce((sum, val) => sum + val, 0) / n2
  
  const var1 = sample1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1)
  const var2 = sample2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1)
  
  let tStat: number
  let df: number
  let stdError: number
  
  if (assumeEqualVariance) {
    // Pooled variance
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2)
    stdError = Math.sqrt(pooledVar * (1 / n1 + 1 / n2))
    tStat = (mean1 - mean2) / stdError
    df = n1 + n2 - 2
  } else {
    // Welch's t-test
    stdError = Math.sqrt(var1 / n1 + var2 / n2)
    tStat = (mean1 - mean2) / stdError
    
    // Welch-Satterthwaite degrees of freedom
    const numerator = Math.pow(var1 / n1 + var2 / n2, 2)
    const denominator = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1)
    df = numerator / denominator
  }
  
  const pValue = 2 * (1 - studentTCDF(Math.abs(tStat), df))
  
  const tCritical = studentTInverse(1 - alpha / 2, df)
  const marginOfError = tCritical * stdError
  const meanDiff = mean1 - mean2
  const confidenceInterval: [number, number] = [
    meanDiff - marginOfError,
    meanDiff + marginOfError
  ]
  
  const significant = pValue < alpha
  const conclusion = significant
    ? `Reject null hypothesis: Sample means differ significantly (mean1: ${mean1.toFixed(4)}, mean2: ${mean2.toFixed(4)}, p = ${pValue.toFixed(4)})`
    : `Fail to reject null hypothesis: Sample means do not differ significantly (mean1: ${mean1.toFixed(4)}, mean2: ${mean2.toFixed(4)}, p = ${pValue.toFixed(4)})`
  
  return {
    statistic: tStat,
    pValue,
    degreesOfFreedom: df,
    mean: meanDiff,
    stdError,
    confidenceInterval,
    significant,
    conclusion
  }
}

/**
 * Paired t-test
 * Tests if paired observations differ significantly
 */
export function pairedTTest(
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05
): TTestResult {
  if (sample1.length !== sample2.length) {
    throw new Error('Paired samples must have equal length')
  }
  
  const differences = sample1.map((val, i) => val - sample2[i])
  return oneSampleTTest(differences, 0, alpha)
}

// ===== ANOVA =====

export interface ANOVAResult {
  fStatistic: number
  pValue: number
  dfBetween: number
  dfWithin: number
  ssBetween: number
  ssWithin: number
  msBetween: number
  msWithin: number
  significant: boolean
  conclusion: string
  groupMeans: number[]
  grandMean: number
}

/**
 * One-way ANOVA
 * Tests if means of multiple groups differ significantly
 */
export function oneWayANOVA(
  groups: number[][],
  alpha: number = 0.05
): ANOVAResult {
  const k = groups.length // number of groups
  const n = groups.reduce((sum, group) => sum + group.length, 0) // total observations
  
  // Calculate group means
  const groupMeans = groups.map(group => 
    group.reduce((sum, val) => sum + val, 0) / group.length
  )
  
  // Calculate grand mean
  const allData = groups.flat()
  const grandMean = allData.reduce((sum, val) => sum + val, 0) / n
  
  // Sum of Squares Between Groups (SSB)
  let ssBetween = 0
  for (let i = 0; i < k; i++) {
    const ni = groups[i].length
    ssBetween += ni * Math.pow(groupMeans[i] - grandMean, 2)
  }
  
  // Sum of Squares Within Groups (SSW)
  let ssWithin = 0
  for (let i = 0; i < k; i++) {
    for (const value of groups[i]) {
      ssWithin += Math.pow(value - groupMeans[i], 2)
    }
  }
  
  // Degrees of freedom
  const dfBetween = k - 1
  const dfWithin = n - k
  
  // Mean Squares
  const msBetween = ssBetween / dfBetween
  const msWithin = ssWithin / dfWithin
  
  // F-statistic
  const fStatistic = msBetween / msWithin
  
  // p-value
  const pValue = 1 - fCDF(fStatistic, dfBetween, dfWithin)
  
  const significant = pValue < alpha
  const conclusion = significant
    ? `Reject null hypothesis: At least one group mean differs significantly (F = ${fStatistic.toFixed(4)}, p = ${pValue.toFixed(4)})`
    : `Fail to reject null hypothesis: No significant difference between group means (F = ${fStatistic.toFixed(4)}, p = ${pValue.toFixed(4)})`
  
  return {
    fStatistic,
    pValue,
    dfBetween,
    dfWithin,
    ssBetween,
    ssWithin,
    msBetween,
    msWithin,
    significant,
    conclusion,
    groupMeans,
    grandMean
  }
}

// ===== CHI-SQUARE TESTS =====

export interface ChiSquareResult {
  statistic: number
  pValue: number
  degreesOfFreedom: number
  expectedFrequencies: number[][]
  significant: boolean
  conclusion: string
}

/**
 * Chi-square test of independence
 * Tests if two categorical variables are independent
 */
export function chiSquareTest(
  observedFrequencies: number[][],
  alpha: number = 0.05
): ChiSquareResult {
  const rows = observedFrequencies.length
  const cols = observedFrequencies[0].length
  
  // Calculate row and column totals
  const rowTotals = observedFrequencies.map(row => 
    row.reduce((sum, val) => sum + val, 0)
  )
  
  const colTotals: number[] = []
  for (let j = 0; j < cols; j++) {
    colTotals[j] = 0
    for (let i = 0; i < rows; i++) {
      colTotals[j] += observedFrequencies[i][j]
    }
  }
  
  const grandTotal = rowTotals.reduce((sum, val) => sum + val, 0)
  
  // Calculate expected frequencies
  const expectedFrequencies: number[][] = []
  for (let i = 0; i < rows; i++) {
    expectedFrequencies[i] = []
    for (let j = 0; j < cols; j++) {
      expectedFrequencies[i][j] = (rowTotals[i] * colTotals[j]) / grandTotal
    }
  }
  
  // Calculate chi-square statistic
  let chiSquare = 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const observed = observedFrequencies[i][j]
      const expected = expectedFrequencies[i][j]
      chiSquare += Math.pow(observed - expected, 2) / expected
    }
  }
  
  const df = (rows - 1) * (cols - 1)
  const pValue = 1 - chiSquareCDF(chiSquare, df)
  
  const significant = pValue < alpha
  const conclusion = significant
    ? `Reject null hypothesis: Variables are dependent (χ² = ${chiSquare.toFixed(4)}, p = ${pValue.toFixed(4)})`
    : `Fail to reject null hypothesis: Variables are independent (χ² = ${chiSquare.toFixed(4)}, p = ${pValue.toFixed(4)})`
  
  return {
    statistic: chiSquare,
    pValue,
    degreesOfFreedom: df,
    expectedFrequencies,
    significant,
    conclusion
  }
}

// ===== NORMALITY TESTS =====

export interface NormalityTestResult {
  statistic: number
  pValue: number
  isNormal: boolean
  conclusion: string
}

/**
 * Anderson-Darling test for normality
 */
export function andersonDarlingTest(
  data: number[]
): NormalityTestResult {
  const n = data.length
  const sorted = [...data].sort((a, b) => a - b)
  
  // Calculate mean and standard deviation
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const stdDev = Math.sqrt(variance)
  
  // Calculate A² statistic
  let sum = 0
  for (let i = 0; i < n; i++) {
    const zi = (sorted[i] - mean) / stdDev
    const Fi = normalCDF(zi)
    const Fni = normalCDF((sorted[n - 1 - i] - mean) / stdDev)
    
    if (Fi > 0 && Fi < 1 && Fni > 0 && Fni < 1) {
      sum += (2 * i + 1) * (Math.log(Fi) + Math.log(1 - Fni))
    }
  }
  
  const A2 = -n - sum / n
  const A2Adjusted = A2 * (1 + 0.75 / n + 2.25 / (n * n))
  
  // Critical values for α = 0.05
  const criticalValue = 0.787
  const isNormal = A2Adjusted < criticalValue
  const pValue = isNormal ? 0.1 : 0.01 // Approximation
  
  const conclusion = isNormal
    ? `Data appears to be normally distributed (A² = ${A2Adjusted.toFixed(4)})`
    : `Data does not appear to be normally distributed (A² = ${A2Adjusted.toFixed(4)})`
  
  return {
    statistic: A2Adjusted,
    pValue,
    isNormal,
    conclusion
  }
}

// ===== HELPER FUNCTIONS: Statistical Distributions =====

/**
 * Student's t-distribution CDF
 */
function studentTCDF(t: number, df: number): number {
  if (t === 0) return 0.5
  
  const x = df / (df + t * t)
  const prob = 0.5 * betaRegularized(df / 2, 0.5, x)
  
  return t > 0 ? 1 - prob : prob
}

/**
 * Inverse of Student's t-distribution
 */
function studentTInverse(p: number, df: number): number {
  // Approximation using Newton's method
  let t = Math.sqrt(df) * (Math.pow(p, 0.135) - Math.pow(1 - p, 0.135)) / 0.1975
  
  for (let i = 0; i < 5; i++) {
    const cdf = studentTCDF(t, df)
    const pdf = Math.pow(1 + t * t / df, -(df + 1) / 2)
    t = t - (cdf - p) / (pdf / Math.sqrt(df * Math.PI) * gamma((df + 1) / 2) / gamma(df / 2))
  }
  
  return t
}

/**
 * F-distribution CDF
 */
function fCDF(f: number, df1: number, df2: number): number {
  if (f <= 0) return 0
  
  const x = df2 / (df2 + df1 * f)
  return 1 - betaRegularized(df2 / 2, df1 / 2, x)
}

/**
 * Chi-square distribution CDF
 */
function chiSquareCDF(x: number, df: number): number {
  if (x <= 0) return 0
  return gammaRegularized(df / 2, x / 2)
}

/**
 * Standard normal CDF
 */
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)))
}

/**
 * Error function
 */
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911
  
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
  return sign * y
}

/**
 * Gamma function approximation (Stirling's approximation)
 */
function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }
  
  z -= 1
  const coefficients = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ]
  
  let x = coefficients[0]
  for (let i = 1; i < 9; i++) {
    x += coefficients[i] / (z + i)
  }
  
  const t = z + 7.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

/**
 * Regularized incomplete beta function
 */
function betaRegularized(a: number, b: number, x: number): number {
  if (x === 0) return 0
  if (x === 1) return 1
  
  // Approximation using continued fraction
  const lbeta = logGamma(a) + logGamma(b) - logGamma(a + b)
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a
  
  let f = 1
  let c = 1
  let d = 0
  
  for (let i = 0; i <= 200; i++) {
    const m = i / 2
    
    let numerator
    if (i === 0) {
      numerator = 1
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m))
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1))
    }
    
    d = 1 + numerator * d
    if (Math.abs(d) < 1e-30) d = 1e-30
    d = 1 / d
    
    c = 1 + numerator / c
    if (Math.abs(c) < 1e-30) c = 1e-30
    
    const cd = c * d
    f *= cd
    
    if (Math.abs(1 - cd) < 1e-8) break
  }
  
  return front * (f - 1)
}

/**
 * Regularized incomplete gamma function
 */
function gammaRegularized(a: number, x: number): number {
  if (x < 0 || a <= 0) return 0
  if (x === 0) return 0
  
  // Series expansion
  let sum = 1 / a
  let term = 1 / a
  
  for (let n = 1; n <= 100; n++) {
    term *= x / (a + n)
    sum += term
    if (Math.abs(term) < 1e-8 * Math.abs(sum)) break
  }
  
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a))
}

/**
 * Log-gamma function
 */
function logGamma(z: number): number {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z)
  }
  
  z -= 1
  const coefficients = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ]
  
  let x = coefficients[0]
  for (let i = 1; i < 9; i++) {
    x += coefficients[i] / (z + i)
  }
  
  const t = z + 7.5
  return Math.log(2 * Math.PI) / 2 + (z + 0.5) * Math.log(t) - t + Math.log(x)
}
