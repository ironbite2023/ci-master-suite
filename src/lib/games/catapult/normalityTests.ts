/**
 * Normality Tests for Catapult Validation Mode
 * Implements Anderson-Darling, Shapiro-Wilk, and Kolmogorov-Smirnov tests
 */

// ============================================================================
// TYPES
// ============================================================================

export interface NormalityTestResult {
  testName: string
  statistic: number
  criticalValue: number
  pValue: number
  passed: boolean
  interpretation: string
  confidenceLevel: number // e.g., 0.95 for 95%
}

export interface DescriptiveStats {
  mean: number
  median: number
  stdDev: number
  variance: number
  min: number
  max: number
  range: number
  q1: number
  q3: number
  iqr: number
  skewness: number
  kurtosis: number
  n: number
}

export interface QQPlotData {
  theoretical: number[]
  actual: number[]
  lowerBound: number[]
  upperBound: number[]
}

export interface NormalityAnalysis {
  descriptiveStats: DescriptiveStats
  andersonDarling: NormalityTestResult
  shapiroWilk: NormalityTestResult
  kolmogorovSmirnov: NormalityTestResult
  qqPlot: QQPlotData
  overallPassed: boolean
  recommendation: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate mean
 */
function mean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length
}

/**
 * Calculate median
 */
function median(data: number[]): number {
  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

/**
 * Calculate standard deviation
 */
function stdDev(data: number[]): number {
  const avg = mean(data)
  const squareDiffs = data.map(value => Math.pow(value - avg, 2))
  const avgSquareDiff = mean(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

/**
 * Calculate quantile
 */
function quantile(data: number[], q: number): number {
  const sorted = [...data].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

/**
 * Calculate skewness
 */
function skewness(data: number[]): number {
  const avg = mean(data)
  const sd = stdDev(data)
  const n = data.length
  const sum = data.reduce((acc, val) => acc + Math.pow((val - avg) / sd, 3), 0)
  return (n / ((n - 1) * (n - 2))) * sum
}

/**
 * Calculate kurtosis (excess kurtosis)
 */
function kurtosis(data: number[]): number {
  const avg = mean(data)
  const sd = stdDev(data)
  const n = data.length
  const sum = data.reduce((acc, val) => acc + Math.pow((val - avg) / sd, 4), 0)
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
         (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
}

/**
 * Standard normal CDF approximation
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp(-x * x / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - prob : prob
}

/**
 * Inverse standard normal CDF (quantile function)
 */
function normalQuantile(p: number): number {
  // Beasley-Springer-Moro algorithm
  const a = [
    -3.969683028665376e1, 2.209460984245205e2,
    -2.759285104469687e2, 1.383577518672690e2,
    -3.066479806614716e1, 2.506628277459239
  ]
  const b = [
    -5.447609879822406e1, 1.615858368580409e2,
    -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1
  ]
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1,
    -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783
  ]
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1,
    2.445134137142996, 3.754408661907416
  ]

  const pLow = 0.02425
  const pHigh = 1 - pLow

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p))
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }

  if (p <= pHigh) {
    const q = p - 0.5
    const r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  }

  const q = Math.sqrt(-2 * Math.log(1 - p))
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
}

// ============================================================================
// DESCRIPTIVE STATISTICS
// ============================================================================

export function calculateDescriptiveStats(data: number[]): DescriptiveStats {
  const sorted = [...data].sort((a, b) => a - b)
  const avg = mean(data)
  const sd = stdDev(data)
  
  return {
    mean: Math.round(avg * 100) / 100,
    median: Math.round(median(data) * 100) / 100,
    stdDev: Math.round(sd * 100) / 100,
    variance: Math.round(Math.pow(sd, 2) * 100) / 100,
    min: Math.round(sorted[0] * 100) / 100,
    max: Math.round(sorted[sorted.length - 1] * 100) / 100,
    range: Math.round((sorted[sorted.length - 1] - sorted[0]) * 100) / 100,
    q1: Math.round(quantile(data, 0.25) * 100) / 100,
    q3: Math.round(quantile(data, 0.75) * 100) / 100,
    iqr: Math.round((quantile(data, 0.75) - quantile(data, 0.25)) * 100) / 100,
    skewness: Math.round(skewness(data) * 1000) / 1000,
    kurtosis: Math.round(kurtosis(data) * 1000) / 1000,
    n: data.length
  }
}

// ============================================================================
// ANDERSON-DARLING TEST
// ============================================================================

/**
 * Anderson-Darling test for normality
 * Tests if data comes from a normal distribution
 */
export function andersonDarlingTest(data: number[], alpha = 0.05): NormalityTestResult {
  const n = data.length
  const avg = mean(data)
  const sd = stdDev(data)
  
  // Standardize data
  const standardized = data.map(x => (x - avg) / sd)
  
  // Sort standardized data
  const sorted = [...standardized].sort((a, b) => a - b)
  
  // Calculate test statistic
  let sum = 0
  for (let i = 0; i < n; i++) {
    const Fi = normalCDF(sorted[i])
    const F_ni = normalCDF(sorted[n - 1 - i])
    sum += (2 * (i + 1) - 1) * (Math.log(Fi) + Math.log(1 - F_ni))
  }
  
  let A2 = -n - sum / n
  
  // Adjust for small samples
  A2 = A2 * (1 + 0.75 / n + 2.25 / (n * n))
  
  // Critical values for different alpha levels
  const criticalValues: Record<number, number> = {
    0.10: 0.631,
    0.05: 0.752,
    0.025: 0.873,
    0.01: 1.035
  }
  
  const criticalValue = criticalValues[alpha] || 0.752
  const passed = A2 < criticalValue
  
  // Approximate p-value
  let pValue = 0.05
  if (A2 < 0.631) pValue = 0.15
  else if (A2 < 0.752) pValue = 0.10
  else if (A2 < 0.873) pValue = 0.05
  else if (A2 < 1.035) pValue = 0.025
  else pValue = 0.01
  
  return {
    testName: 'Anderson-Darling',
    statistic: Math.round(A2 * 1000) / 1000,
    criticalValue: Math.round(criticalValue * 1000) / 1000,
    pValue,
    passed,
    interpretation: passed
      ? 'Data appears to follow a normal distribution'
      : 'Data does not appear to follow a normal distribution',
    confidenceLevel: 1 - alpha
  }
}

// ============================================================================
// SHAPIRO-WILK TEST
// ============================================================================

/**
 * Shapiro-Wilk test for normality (simplified implementation)
 */
export function shapiroWilkTest(data: number[], alpha = 0.05): NormalityTestResult {
  const n = data.length
  const sorted = [...data].sort((a, b) => a - b)
  const avg = mean(data)
  
  // Calculate b (sum of products)
  let b = 0
  const halfN = Math.floor(n / 2)
  
  for (let i = 0; i < halfN; i++) {
    b += (sorted[n - 1 - i] - sorted[i])
  }
  
  // Calculate SS (sum of squares)
  const ss = data.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0)
  
  // W statistic (simplified)
  const W = Math.pow(b, 2) / ((n - 1) * ss)
  
  // Critical values (approximate for n > 30)
  const criticalValue = n > 30 ? 0.95 : 0.90
  const passed = W > criticalValue
  
  // Approximate p-value
  const pValue = passed ? 0.10 : 0.03
  
  return {
    testName: 'Shapiro-Wilk',
    statistic: Math.round(W * 1000) / 1000,
    criticalValue: Math.round(criticalValue * 1000) / 1000,
    pValue,
    passed,
    interpretation: passed
      ? 'Data appears to follow a normal distribution'
      : 'Data may not follow a normal distribution',
    confidenceLevel: 1 - alpha
  }
}

// ============================================================================
// KOLMOGOROV-SMIRNOV TEST
// ============================================================================

/**
 * Kolmogorov-Smirnov test for normality
 */
export function kolmogorovSmirnovTest(data: number[], alpha = 0.05): NormalityTestResult {
  const n = data.length
  const avg = mean(data)
  const sd = stdDev(data)
  
  // Sort data
  const sorted = [...data].sort((a, b) => a - b)
  
  // Calculate D statistic
  let maxD = 0
  for (let i = 0; i < n; i++) {
    const z = (sorted[i] - avg) / sd
    const empiricalCDF = (i + 1) / n
    const theoreticalCDF = normalCDF(z)
    const D = Math.abs(empiricalCDF - theoreticalCDF)
    maxD = Math.max(maxD, D)
  }
  
  // Critical values for different alpha levels (approximate)
  const criticalValues: Record<number, number> = {
    0.10: 1.22 / Math.sqrt(n),
    0.05: 1.36 / Math.sqrt(n),
    0.025: 1.48 / Math.sqrt(n),
    0.01: 1.63 / Math.sqrt(n)
  }
  
  const criticalValue = criticalValues[alpha] || 1.36 / Math.sqrt(n)
  const passed = maxD < criticalValue
  
  // Approximate p-value
  let pValue = 0.05
  if (maxD < 1.22 / Math.sqrt(n)) pValue = 0.15
  else if (maxD < 1.36 / Math.sqrt(n)) pValue = 0.10
  else if (maxD < 1.48 / Math.sqrt(n)) pValue = 0.05
  else if (maxD < 1.63 / Math.sqrt(n)) pValue = 0.025
  else pValue = 0.01
  
  return {
    testName: 'Kolmogorov-Smirnov',
    statistic: Math.round(maxD * 1000) / 1000,
    criticalValue: Math.round(criticalValue * 1000) / 1000,
    pValue,
    passed,
    interpretation: passed
      ? 'Data appears to follow a normal distribution'
      : 'Data does not appear to follow a normal distribution',
    confidenceLevel: 1 - alpha
  }
}

// ============================================================================
// Q-Q PLOT DATA GENERATION
// ============================================================================

/**
 * Generate Q-Q plot data for visualization
 */
export function generateQQPlotData(data: number[]): QQPlotData {
  const n = data.length
  const sorted = [...data].sort((a, b) => a - b)
  const avg = mean(data)
  const sd = stdDev(data)
  
  const theoretical: number[] = []
  const actual: number[] = []
  const lowerBound: number[] = []
  const upperBound: number[] = []
  
  for (let i = 0; i < n; i++) {
    // Theoretical quantile
    const p = (i + 0.5) / n
    const z = normalQuantile(p)
    theoretical.push(Math.round(z * 100) / 100)
    
    // Actual quantile (standardized)
    const actualZ = (sorted[i] - avg) / sd
    actual.push(Math.round(actualZ * 100) / 100)
    
    // Confidence bounds (approximate 95% CI)
    const se = 1.36 / Math.sqrt(n)
    lowerBound.push(Math.round((z - 1.96 * se) * 100) / 100)
    upperBound.push(Math.round((z + 1.96 * se) * 100) / 100)
  }
  
  return { theoretical, actual, lowerBound, upperBound }
}

// ============================================================================
// COMPLETE NORMALITY ANALYSIS
// ============================================================================

/**
 * Perform complete normality analysis with all tests
 */
export function performNormalityAnalysis(data: number[], alpha = 0.05): NormalityAnalysis {
  const descriptiveStats = calculateDescriptiveStats(data)
  const andersonDarling = andersonDarlingTest(data, alpha)
  const shapiroWilk = shapiroWilkTest(data, alpha)
  const kolmogorovSmirnov = kolmogorovSmirnovTest(data, alpha)
  const qqPlot = generateQQPlotData(data)
  
  // Overall assessment (pass if at least 2 out of 3 tests pass)
  const testsPassedCount = [andersonDarling, shapiroWilk, kolmogorovSmirnov]
    .filter(test => test.passed).length
  const overallPassed = testsPassedCount >= 2
  
  // Generate recommendation
  let recommendation = ''
  if (overallPassed) {
    recommendation = '✅ The data passes normality tests. You can proceed with capability analysis.'
  } else if (testsPassedCount === 1) {
    recommendation = '⚠️ Results are mixed. Consider collecting more data or transforming the data.'
  } else {
    recommendation = '❌ The data fails normality tests. Consider data transformation or using non-parametric methods.'
  }
  
  return {
    descriptiveStats,
    andersonDarling,
    shapiroWilk,
    kolmogorovSmirnov,
    qqPlot,
    overallPassed,
    recommendation
  }
}
