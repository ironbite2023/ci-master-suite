/**
 * Value Stream Mapping (VSM) Calculations
 * Implements lead time, cycle efficiency, takt time, and waste identification
 */

// ===== DATA STRUCTURES =====

export interface ProcessStep {
  id: string
  name: string
  cycleTime: number // seconds
  changeoverTime: number // seconds
  uptime: number // percentage (0-100)
  operators: number
  shifts: number
  batchSize: number
  isValueAdded: boolean
}

export interface InventoryBuffer {
  id: string
  quantity: number
  location: string // before/after which process
}

export interface InformationFlow {
  id: string
  type: 'manual' | 'electronic' | 'visual'
  frequency: string
  method: string
}

export interface VSMMetrics {
  totalLeadTime: number // days
  valueAddedTime: number // seconds
  nonValueAddedTime: number // seconds
  processCycleEfficiency: number // percentage
  taktTime: number // seconds
  inventoryDays: number
  distance: number // meters (for transportation waste)
  processSteps: number
  touchPoints: number
}

export interface WasteIdentification {
  type: WasteType
  location: string
  description: string
  impact: 'low' | 'medium' | 'high'
  recommendation: string
}

export type WasteType =
  | 'defects'
  | 'overproduction'
  | 'waiting'
  | 'non-utilized-talent'
  | 'transportation'
  | 'inventory'
  | 'motion'
  | 'extra-processing'

// ===== CALCULATIONS =====

/**
 * Calculate total lead time across all process steps and inventory
 */
export function calculateLeadTime(
  processSteps: ProcessStep[],
  inventories: InventoryBuffer[],
  taktTime: number
): number {
  // Process time (convert to days)
  const totalProcessTime = processSteps.reduce((sum, step) => {
    const effectiveTime = (step.cycleTime * step.batchSize) / step.uptime * 100
    return sum + effectiveTime
  }, 0)
  
  // Inventory time (days)
  const inventoryTime = inventories.reduce((sum, inv) => {
    const daysOfInventory = (inv.quantity * taktTime) / (8 * 3600) // assuming 8-hour days
    return sum + daysOfInventory
  }, 0)
  
  const processTimeDays = totalProcessTime / (8 * 3600)
  
  return processTimeDays + inventoryTime
}

/**
 * Calculate Process Cycle Efficiency (PCE)
 * PCE = Value-Added Time / Total Lead Time × 100
 */
export function calculateProcessCycleEfficiency(
  processSteps: ProcessStep[],
  totalLeadTime: number
): number {
  const valueAddedTime = processSteps
    .filter(step => step.isValueAdded)
    .reduce((sum, step) => sum + step.cycleTime, 0)
  
  const totalLeadTimeSeconds = totalLeadTime * 24 * 3600
  
  if (totalLeadTimeSeconds === 0) return 0
  
  return (valueAddedTime / totalLeadTimeSeconds) * 100
}

/**
 * Calculate Takt Time
 * Takt Time = Available Time / Customer Demand
 */
export function calculateTaktTime(
  availableTimePerDay: number, // seconds
  customerDemandPerDay: number
): number {
  if (customerDemandPerDay === 0) return 0
  return availableTimePerDay / customerDemandPerDay
}

/**
 * Calculate available production time
 */
export function calculateAvailableTime(
  shiftsPerDay: number,
  hoursPerShift: number,
  breaksMinutes: number
): number {
  const totalMinutes = shiftsPerDay * hoursPerShift * 60
  return (totalMinutes - breaksMinutes) * 60 // convert to seconds
}

/**
 * Calculate inventory days for a buffer
 */
export function calculateInventoryDays(
  quantity: number,
  taktTime: number,
  hoursPerDay: number = 8
): number {
  const totalTimeSeconds = quantity * taktTime
  return totalTimeSeconds / (hoursPerDay * 3600)
}

/**
 * Identify waste in the value stream
 */
export function identifyWaste(
  processSteps: ProcessStep[],
  inventories: InventoryBuffer[],
  totalLeadTime: number,
  valueAddedTime: number
): WasteIdentification[] {
  const wastes: WasteIdentification[] = []
  
  // Check for excessive inventory
  inventories.forEach((inv, index) => {
    if (inv.quantity > 100) { // threshold for "excessive"
      wastes.push({
        type: 'inventory',
        location: `Inventory Buffer ${index + 1}`,
        description: `${inv.quantity} units in inventory`,
        impact: inv.quantity > 500 ? 'high' : inv.quantity > 200 ? 'medium' : 'low',
        recommendation: 'Implement pull system, reduce batch sizes, improve flow'
      })
    }
  })
  
  // Check for waiting time (non-value-added time)
  const waitingTime = (totalLeadTime * 24 * 3600) - valueAddedTime
  if (waitingTime > valueAddedTime * 10) {
    wastes.push({
      type: 'waiting',
      location: 'Overall process',
      description: `${(waitingTime / 3600).toFixed(1)} hours of waiting time`,
      impact: 'high',
      recommendation: 'Implement continuous flow, reduce batch sizes, balance workload'
    })
  }
  
  // Check for overprocessing (multiple non-value-added steps)
  const nonVASteps = processSteps.filter(step => !step.isValueAdded)
  if (nonVASteps.length > processSteps.length * 0.3) {
    wastes.push({
      type: 'extra-processing',
      location: 'Multiple process steps',
      description: `${nonVASteps.length} non-value-added steps identified`,
      impact: 'medium',
      recommendation: 'Eliminate unnecessary steps, combine operations, standardize work'
    })
  }
  
  // Check for changeover time waste
  processSteps.forEach((step, index) => {
    if (step.changeoverTime > step.cycleTime * 2) {
      wastes.push({
        type: 'waiting',
        location: `${step.name} (Step ${index + 1})`,
        description: `High changeover time: ${step.changeoverTime}s vs cycle time ${step.cycleTime}s`,
        impact: 'medium',
        recommendation: 'Apply SMED (Single-Minute Exchange of Die), reduce setup time'
      })
    }
  })
  
  // Check for low uptime (potential defects/breakdowns)
  processSteps.forEach((step, index) => {
    if (step.uptime < 85) {
      wastes.push({
        type: 'defects',
        location: `${step.name} (Step ${index + 1})`,
        description: `Low uptime: ${step.uptime}%`,
        impact: step.uptime < 70 ? 'high' : 'medium',
        recommendation: 'Implement TPM (Total Productive Maintenance), root cause analysis'
      })
    }
  })
  
  return wastes
}

/**
 * Calculate comprehensive VSM metrics
 */
export function calculateVSMMetrics(
  processSteps: ProcessStep[],
  inventories: InventoryBuffer[],
  customerDemandPerDay: number,
  shiftsPerDay: number = 2,
  hoursPerShift: number = 8,
  breaksMinutes: number = 60
): VSMMetrics {
  // Calculate takt time
  const availableTime = calculateAvailableTime(shiftsPerDay, hoursPerShift, breaksMinutes)
  const taktTime = calculateTaktTime(availableTime, customerDemandPerDay)
  
  // Calculate lead time
  const totalLeadTime = calculateLeadTime(processSteps, inventories, taktTime)
  
  // Calculate value-added vs non-value-added time
  const valueAddedTime = processSteps
    .filter(step => step.isValueAdded)
    .reduce((sum, step) => sum + step.cycleTime, 0)
  
  const totalProcessTime = processSteps.reduce((sum, step) => sum + step.cycleTime, 0)
  const nonValueAddedTime = totalProcessTime - valueAddedTime
  
  // Calculate PCE
  const processCycleEfficiency = calculateProcessCycleEfficiency(processSteps, totalLeadTime)
  
  // Calculate inventory days
  const inventoryDays = inventories.reduce((sum, inv) => {
    return sum + calculateInventoryDays(inv.quantity, taktTime)
  }, 0)
  
  // Calculate touch points (number of handoffs)
  const touchPoints = processSteps.length - 1
  
  return {
    totalLeadTime,
    valueAddedTime,
    nonValueAddedTime,
    processCycleEfficiency,
    taktTime,
    inventoryDays,
    distance: 0, // To be calculated based on layout
    processSteps: processSteps.length,
    touchPoints
  }
}

/**
 * Generate improvement recommendations based on metrics
 */
export function generateRecommendations(metrics: VSMMetrics, wastes: WasteIdentification[]): string[] {
  const recommendations: string[] = []
  
  // PCE recommendations
  if (metrics.processCycleEfficiency < 10) {
    recommendations.push('CRITICAL: Process Cycle Efficiency is very low (<10%). Focus on eliminating waiting time and improving flow.')
  } else if (metrics.processCycleEfficiency < 25) {
    recommendations.push('Process Cycle Efficiency is below target. Implement continuous flow and reduce batch sizes.')
  }
  
  // Inventory recommendations
  if (metrics.inventoryDays > 5) {
    recommendations.push(`High inventory levels (${metrics.inventoryDays.toFixed(1)} days). Implement pull system and reduce batch sizes.`)
  }
  
  // Touch points recommendations
  if (metrics.touchPoints > 10) {
    recommendations.push(`High number of handoffs (${metrics.touchPoints}). Consider cellular manufacturing or process consolidation.`)
  }
  
  // Takt time vs cycle time
  if (metrics.valueAddedTime > metrics.taktTime) {
    recommendations.push('Process is not meeting takt time. Need to add capacity or reduce cycle time.')
  }
  
  // Waste-specific recommendations
  const highImpactWastes = wastes.filter(w => w.impact === 'high')
  if (highImpactWastes.length > 0) {
    recommendations.push(`${highImpactWastes.length} high-impact waste(s) identified. Prioritize these for immediate action.`)
  }
  
  return recommendations
}

/**
 * Calculate future state improvements
 */
export function calculateFutureStateImprovements(
  currentMetrics: VSMMetrics,
  targetPCE: number = 40, // target 40% PCE
  targetInventoryReduction: number = 50 // 50% reduction
): {
  targetLeadTime: number
  targetInventoryDays: number
  potentialImprovements: string[]
} {
  const targetLeadTime = (currentMetrics.valueAddedTime / (targetPCE / 100)) / (24 * 3600)
  const targetInventoryDays = currentMetrics.inventoryDays * (1 - targetInventoryReduction / 100)
  
  const improvements: string[] = []
  
  const leadTimeReduction = ((currentMetrics.totalLeadTime - targetLeadTime) / currentMetrics.totalLeadTime) * 100
  improvements.push(`Lead time reduction: ${leadTimeReduction.toFixed(0)}%`)
  
  const inventoryReduction = ((currentMetrics.inventoryDays - targetInventoryDays) / currentMetrics.inventoryDays) * 100
  improvements.push(`Inventory reduction: ${inventoryReduction.toFixed(0)}%`)
  
  improvements.push(`Target PCE: ${targetPCE}%`)
  improvements.push('Implement pull system')
  improvements.push('Create continuous flow cells')
  improvements.push('Balance workload to takt time')
  
  return {
    targetLeadTime,
    targetInventoryDays,
    potentialImprovements: improvements
  }
}

/**
 * Format time for display
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)}m`
  } else if (seconds < 86400) {
    return `${(seconds / 3600).toFixed(1)}h`
  } else {
    return `${(seconds / 86400).toFixed(1)}d`
  }
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
