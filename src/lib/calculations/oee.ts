/**
 * Overall Equipment Effectiveness (OEE) Calculations
 * OEE = Availability × Performance × Quality
 */

export interface OEEInput {
  // Shift Information
  plannedProductionTime: number // minutes
  breaks: number // minutes
  
  // Performance Data
  idealCycleTime: number // seconds per unit
  totalCount: number // total units produced
  goodCount: number // good quality units
  
  // Downtime Events
  downtimeMinutes: number
  changeoverMinutes: number
}

export interface OEEResults {
  // Core Metrics
  availability: number // percentage
  performance: number // percentage
  quality: number // percentage
  oee: number // percentage
  
  // Time Breakdown
  plannedProductionTime: number // minutes
  operatingTime: number // minutes
  
  // Detailed Analysis
  availabilityLoss: number // minutes
  performanceLoss: number // minutes
  qualityLoss: number // units
  
  // Performance
  actualCycleTime: number // seconds
  speedLoss: number // percentage
  
  // Classification
  worldClass: boolean
  grade: string
  
  // Recommendations
  recommendations: string[]
}

export interface DowntimeEvent {
  type: 'breakdown' | 'changeover' | 'small-stop' | 'reduced-speed' | 'startup-reject' | 'production-reject'
  duration: number // minutes
  reason: string
}

export type SixBigLoss = 
  | 'breakdowns'
  | 'setup-adjustments'
  | 'small-stops'
  | 'reduced-speed'
  | 'startup-rejects'
  | 'production-rejects'

/**
 * Calculate OEE and all component metrics
 */
export function calculateOEE(input: OEEInput): OEEResults {
  const {
    plannedProductionTime,
    breaks,
    idealCycleTime,
    totalCount,
    goodCount,
    downtimeMinutes,
    changeoverMinutes
  } = input
  
  // Calculate Available Time (planned time - breaks)
  const availableTime = plannedProductionTime - breaks
  
  // Calculate Operating Time (available time - downtime - changeover)
  const totalDowntime = downtimeMinutes + changeoverMinutes
  const operatingTime = availableTime - totalDowntime
  
  // AVAILABILITY = Operating Time / Available Time × 100
  const availability = availableTime > 0 ? (operatingTime / availableTime) * 100 : 0
  
  // Calculate Ideal Production Time
  const idealProductionTimeMinutes = (totalCount * idealCycleTime) / 60
  
  // PERFORMANCE = (Ideal Cycle Time × Total Count) / Operating Time × 100
  const performance = operatingTime > 0 
    ? (idealProductionTimeMinutes / operatingTime) * 100 
    : 0
  
  // QUALITY = Good Count / Total Count × 100
  const quality = totalCount > 0 ? (goodCount / totalCount) * 100 : 0
  
  // OEE = Availability × Performance × Quality
  const oee = (availability * performance * quality) / 10000
  
  // Losses
  const availabilityLoss = totalDowntime
  const performanceLoss = operatingTime - idealProductionTimeMinutes
  const qualityLoss = totalCount - goodCount
  
  // Actual Cycle Time
  const actualCycleTime = totalCount > 0 
    ? (operatingTime * 60) / totalCount 
    : 0
  
  // Speed Loss
  const speedLoss = idealCycleTime > 0
    ? ((actualCycleTime - idealCycleTime) / idealCycleTime) * 100
    : 0
  
  // Classification
  const worldClass = oee >= 85
  const grade = getOEEGrade(oee)
  
  // Generate recommendations
  const recommendations = generateOEERecommendations({
    oee,
    availability,
    performance,
    quality
  })
  
  return {
    availability,
    performance,
    quality,
    oee,
    plannedProductionTime,
    operatingTime,
    availabilityLoss,
    performanceLoss,
    qualityLoss,
    actualCycleTime,
    speedLoss,
    worldClass,
    grade,
    recommendations
  }
}

/**
 * Get OEE grade classification
 */
function getOEEGrade(oee: number): string {
  if (oee >= 85) return 'World Class'
  if (oee >= 70) return 'Good'
  if (oee >= 60) return 'Fair'
  if (oee >= 40) return 'Poor'
  return 'Unacceptable'
}

/**
 * Generate recommendations based on OEE metrics
 */
function generateOEERecommendations(metrics: {
  oee: number
  availability: number
  performance: number
  quality: number
}): string[] {
  const recommendations: string[] = []
  const { oee, availability, performance, quality } = metrics
  
  // Overall OEE recommendations
  if (oee < 40) {
    recommendations.push('CRITICAL: OEE is unacceptable (<40%). Immediate improvement actions required across all three metrics.')
  } else if (oee < 60) {
    recommendations.push('OEE is below industry average. Focus on systematic improvements.')
  } else if (oee >= 85) {
    recommendations.push('Excellent! You have achieved World Class OEE (≥85%). Focus on sustaining these levels.')
  }
  
  // Availability recommendations
  if (availability < 90) {
    recommendations.push(`Low Availability (${availability.toFixed(1)}%). Reduce unplanned downtime through TPM (Total Productive Maintenance).`)
    recommendations.push('Implement SMED (Single-Minute Exchange of Die) to reduce changeover times.')
  }
  
  // Performance recommendations
  if (performance < 95) {
    recommendations.push(`Performance below target (${performance.toFixed(1)}%). Eliminate small stops and reduce cycle time losses.`)
    recommendations.push('Analyze and eliminate bottlenecks in the production process.')
  }
  
  // Quality recommendations
  if (quality < 99) {
    recommendations.push(`Quality issues detected (${quality.toFixed(1)}%). Implement poka-yoke (error-proofing) mechanisms.`)
    recommendations.push('Conduct root cause analysis on defects and implement corrective actions.')
  }
  
  // Identify weakest metric
  const sortedMetrics = [
    { name: 'Availability', value: availability },
    { name: 'Performance', value: performance },
    { name: 'Quality', value: quality }
  ].sort((a, b) => a.value - b.value)
  
  recommendations.push(`Priority Focus: ${sortedMetrics[0].name} is the weakest metric. Start improvement efforts here for maximum impact.`)
  
  return recommendations
}

/**
 * Categorize downtime events into Six Big Losses
 */
export function categorizeDowntime(events: DowntimeEvent[]): Record<SixBigLoss, number> {
  const losses: Record<SixBigLoss, number> = {
    'breakdowns': 0,
    'setup-adjustments': 0,
    'small-stops': 0,
    'reduced-speed': 0,
    'startup-rejects': 0,
    'production-rejects': 0
  }
  
  events.forEach(event => {
    switch (event.type) {
      case 'breakdown':
        losses['breakdowns'] += event.duration
        break
      case 'changeover':
        losses['setup-adjustments'] += event.duration
        break
      case 'small-stop':
        losses['small-stops'] += event.duration
        break
      case 'reduced-speed':
        losses['reduced-speed'] += event.duration
        break
      case 'startup-reject':
        losses['startup-rejects'] += event.duration
        break
      case 'production-reject':
        losses['production-rejects'] += event.duration
        break
    }
  })
  
  return losses
}

/**
 * Calculate availability specifically
 */
export function calculateAvailability(
  plannedTime: number,
  breaks: number,
  downtime: number
): number {
  const availableTime = plannedTime - breaks
  const operatingTime = availableTime - downtime
  return availableTime > 0 ? (operatingTime / availableTime) * 100 : 0
}

/**
 * Calculate performance specifically
 */
export function calculatePerformance(
  idealCycleTime: number,
  totalCount: number,
  operatingTime: number
): number {
  const idealProductionTime = (idealCycleTime * totalCount) / 60 // convert to minutes
  return operatingTime > 0 ? (idealProductionTime / operatingTime) * 100 : 0
}

/**
 * Calculate quality specifically
 */
export function calculateQuality(
  goodCount: number,
  totalCount: number
): number {
  return totalCount > 0 ? (goodCount / totalCount) * 100 : 0
}

/**
 * Calculate TEEP (Total Effective Equipment Performance)
 * TEEP = OEE × Utilization
 */
export function calculateTEEP(
  oee: number,
  operatingTime: number,
  allAvailableTime: number
): number {
  const utilization = allAvailableTime > 0 
    ? (operatingTime / allAvailableTime) * 100 
    : 0
  return (oee * utilization) / 100
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Format time in minutes to hours:minutes
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  return `${hours}h ${mins}m`
}
