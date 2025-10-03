# 🎨 CAPABILITY UI COMPONENTS - DESIGN SPECIFICATION

**Document Version:** 1.0
**Status:** Design Complete - Ready for Implementation
**Target:** Week 2, Day 9 - Capability Analysis Mode
**Location:** `src/components/games/catapult/`

---

## 📋 **OVERVIEW**

This document specifies the design and implementation requirements for 4 capability UI components that display Six Sigma process capability analysis results.

**Components:**
1. **CapabilityResults** - Display all 8 capability indices
2. **ProcessCapabilityChart** - Visual histogram with spec limits
3. **SigmaLevelCard** - Sigma scale visualization
4. **CapabilityInterpretation** - Recommendations display

**Total Estimated LOC:** ~750 lines

---

## 1️⃣ **CAPABILITY RESULTS COMPONENT**

### **File:** `CapabilityResults.tsx` (~200 lines)

### **Purpose**
Display all 8 capability indices (Cp, Cpk, Pp, Ppk, Cpm, CPL, CPU, CR) with color-coded ratings and benchmarks.

### **Props Interface**
```typescript
interface CapabilityResultsProps {
  indices: CapabilityIndices
  rating: CapabilityRating
  interpretation: string
}

// From capabilityCalculations.ts
interface CapabilityIndices {
  cp: number | null
  cpk: number | null
  pp: number | null
  ppk: number | null
  cpm: number | null
  cpl: number | null
  cpu: number | null
  cr: number | null
}

interface CapabilityRating {
  rating: string         // "Excellent", "Good", etc.
  color: string          // "green", "blue", "yellow", etc.
  description: string
  recommendation: string
  icon: string          // "Trophy", "CheckCircle2", etc.
}
```

### **Component Structure**

```typescript
export function CapabilityResults({
  indices,
  rating,
  interpretation
}: CapabilityResultsProps) {
  return (
    <div className="space-y-4">
      {/* Overall Rating Card */}
      <Card className={`border p-6 border-${rating.color}-500/30 bg-${rating.color}-500/10`}>
        <div className="flex items-center gap-4">
          <Icon name={rating.icon} size="large" color={rating.color} />
          <div>
            <h3>{rating.rating} Capability</h3>
            <p>Cpk: {indices.cpk}</p>
            <p className="text-sm">{rating.description}</p>
          </div>
        </div>
      </Card>

      {/* Primary Indices Grid (Cp, Cpk, Pp, Ppk) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IndexCard name="Cp" value={indices.cp} />
        <IndexCard name="Cpk" value={indices.cpk} primary />
        <IndexCard name="Pp" value={indices.pp} />
        <IndexCard name="Ppk" value={indices.ppk} />
      </div>

      {/* Secondary Indices Grid (Cpm, CPL, CPU, CR) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IndexCard name="Cpm" value={indices.cpm} />
        <IndexCard name="CPL" value={indices.cpl} />
        <IndexCard name="CPU" value={indices.cpu} />
        <IndexCard name="CR" value={indices.cr} />
      </div>

      {/* Interpretation */}
      <Card>
        <p>{interpretation}</p>
      </Card>
    </div>
  )
}
```

### **IndexCard Component**

```typescript
interface IndexCardProps {
  name: string
  value: number | null
  primary?: boolean
}

function IndexCard({ name, value, primary }: IndexCardProps) {
  const colorClass = getIndexColorClass(value)
  const benchmark = getIndexBenchmark(value)
  
  return (
    <Card className={primary ? 'ring-2 ring-blue-500' : ''}>
      <div className="text-xs text-gray-400">{name}</div>
      <div className={`text-3xl font-bold ${colorClass}`}>
        {value !== null ? value.toFixed(2) : 'N/A'}
      </div>
      <div className="text-xs">{benchmark}</div>
      <CapabilityBar value={value} />
    </Card>
  )
}
```

### **Helper Functions**

```typescript
function getIndexColorClass(value: number | null): string {
  if (value === null) return 'text-gray-400'
  if (value >= 2.0) return 'text-green-400'
  if (value >= 1.67) return 'text-green-300'
  if (value >= 1.33) return 'text-blue-400'
  if (value >= 1.0) return 'text-yellow-400'
  if (value >= 0.67) return 'text-orange-400'
  return 'text-red-400'
}

function getIndexBenchmark(value: number | null): string {
  if (value === null) return 'Not calculated'
  if (value >= 2.0) return 'World Class'
  if (value >= 1.67) return 'Excellent'
  if (value >= 1.33) return 'Six Sigma Min'
  if (value >= 1.0) return 'Adequate'
  if (value >= 0.67) return 'Poor'
  return 'Unacceptable'
}
```

### **CapabilityBar Component**

Visual progress bar showing capability level:

```typescript
function CapabilityBar({ value }: { value: number | null }) {
  if (value === null) return null
  
  // Show bar from 0 to 2.5, with markers at 1.0, 1.33, 1.67, 2.0
  const percentage = Math.min((value / 2.5) * 100, 100)
  
  return (
    <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
```

### **Compact Variant**

```typescript
export function CompactCapabilityResults({ indices, rating }: CapabilityResultsProps) {
  return (
    <Card>
      <Badge color={rating.color}>{rating.rating}</Badge>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>Cpk: {indices.cpk?.toFixed(2)}</div>
        <div>Cp: {indices.cp?.toFixed(2)}</div>
      </div>
    </Card>
  )
}
```

---

## 2️⃣ **PROCESS CAPABILITY CHART COMPONENT**

### **File:** `ProcessCapabilityChart.tsx` (~250 lines)

### **Purpose**
Visual histogram showing distribution with specification limits overlay and capability zones.

### **Props Interface**

```typescript
interface ProcessCapabilityChartProps {
  data: number[]
  specs: SpecificationLimits
  stats: DescriptiveStats
  indices: CapabilityIndices
  rating: CapabilityRating
}
```

### **Component Structure**

```typescript
export function ProcessCapabilityChart({
  data,
  specs,
  stats,
  indices,
  rating
}: ProcessCapabilityChartProps) {
  // Calculate histogram bins
  const bins = calculateHistogramBins(data, 12, stats)
  
  // Calculate zone counts
  const belowLSL = data.filter(v => specs.lsl && v < specs.lsl).length
  const aboveUSL = data.filter(v => specs.usl && v > specs.usl).length
  const inSpec = data.length - belowLSL - aboveUSL
  
  return (
    <Card>
      <h3>Process Capability Chart</h3>
      
      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <LegendItem color="red" label={`Below LSL: ${belowLSL}`} />
        <LegendItem color="green" label={`In Spec: ${inSpec}`} />
        <LegendItem color="red" label={`Above USL: ${aboveUSL}`} />
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={bins}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="binCenter" label="Distance (m)" />
          <YAxis label="Frequency" />
          
          {/* Histogram Bars with Zone Colors */}
          <Bar dataKey="frequency" fill="url(#zoneGradient)" />
          
          {/* LSL Line */}
          {specs.lsl && (
            <ReferenceLine 
              x={specs.lsl} 
              stroke="red" 
              strokeDasharray="5 5"
              label="LSL"
            />
          )}
          
          {/* USL Line */}
          {specs.usl && (
            <ReferenceLine 
              x={specs.usl} 
              stroke="red" 
              strokeDasharray="5 5"
              label="USL"
            />
          )}
          
          {/* Target Line */}
          {specs.target && (
            <ReferenceLine 
              x={specs.target} 
              stroke="blue" 
              strokeDasharray="3 3"
              label="Target"
            />
          )}
          
          {/* Mean Line */}
          <ReferenceLine 
            x={stats.mean} 
            stroke="purple" 
            strokeWidth={2}
            label="μ"
          />
          
          {/* Gradient Definition for Zone Colors */}
          <defs>
            <linearGradient id="zoneGradient">
              {/* Red zone (below LSL) */}
              {/* Green zone (in spec) */}
              {/* Red zone (above USL) */}
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Process Spread Indicator */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div>Process Spread (6σ): {(6 * stats.stdDev).toFixed(2)}m</div>
        {specs.lsl && specs.usl && (
          <div>Spec Width: {(specs.usl - specs.lsl).toFixed(2)}m</div>
        )}
      </div>
    </Card>
  )
}
```

### **Zone Coloring Logic**

```typescript
function getBarColor(binCenter: number, specs: SpecificationLimits): string {
  if (specs.lsl && binCenter < specs.lsl) return '#ef4444' // red
  if (specs.usl && binCenter > specs.usl) return '#ef4444' // red
  return '#10b981' // green
}
```

### **Advanced: Shaded Zones**

```typescript
// Add Rectangle components for shaded zones
{specs.lsl && (
  <ReferenceArea
    x1={stats.min}
    x2={specs.lsl}
    fill="red"
    fillOpacity={0.1}
    label="Defect Zone"
  />
)}

{specs.lsl && specs.usl && (
  <ReferenceArea
    x1={specs.lsl}
    x2={specs.usl}
    fill="green"
    fillOpacity={0.1}
    label="In Specification"
  />
)}

{specs.usl && (
  <ReferenceArea
    x1={specs.usl}
    x2={stats.max}
    fill="red"
    fillOpacity={0.1}
    label="Defect Zone"
  />
)}
```

---

## 3️⃣ **SIGMA LEVEL CARD COMPONENT**

### **File:** `SigmaLevelCard.tsx` (~150 lines)

### **Purpose**
Visualize sigma level, DPMO, PPM, and yield with an intuitive sigma scale gauge.

### **Props Interface**

```typescript
interface SigmaLevelCardProps {
  sigmaMetrics: SigmaMetrics
  rating: CapabilityRating
}

interface SigmaMetrics {
  sigmaLevel: number
  dpmo: number
  ppm: number
  yield: number
  defectRate: number
}
```

### **Component Structure**

```typescript
export function SigmaLevelCard({ sigmaMetrics, rating }: SigmaLevelCardProps) {
  return (
    <Card>
      {/* Header */}
      <h3>Process Sigma Level</h3>
      
      {/* Sigma Gauge */}
      <SigmaGauge level={sigmaMetrics.sigmaLevel} />
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <MetricCard
          label="Sigma Level"
          value={`${sigmaMetrics.sigmaLevel.toFixed(2)}σ`}
          icon={<Zap />}
          color={getSigmaColor(sigmaMetrics.sigmaLevel)}
        />
        
        <MetricCard
          label="DPMO"
          value={sigmaMetrics.dpmo.toLocaleString()}
          icon={<AlertTriangle />}
          subtext="Defects per million"
        />
        
        <MetricCard
          label="Yield"
          value={`${sigmaMetrics.yield.toFixed(3)}%`}
          icon={<TrendingUp />}
          color="green"
        />
        
        <MetricCard
          label="Defect Rate"
          value={`${(sigmaMetrics.defectRate * 100).toFixed(3)}%`}
          icon={<XCircle />}
          color="red"
        />
      </div>
      
      {/* Sigma Interpretation */}
      <div className="mt-4 p-4 rounded-lg bg-slate-700/30">
        <div className="text-sm font-medium mb-2">Sigma Level Interpretation</div>
        <div className="text-sm text-gray-400">
          {getSigmaInterpretation(sigmaMetrics.sigmaLevel)}
        </div>
      </div>
    </Card>
  )
}
```

### **SigmaGauge Component**

Visual sigma scale from 0-7σ:

```typescript
function SigmaGauge({ level }: { level: number }) {
  const percentage = (level / 7) * 100
  
  return (
    <div className="relative">
      {/* Sigma Scale Bar */}
      <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500 rounded-full">
        {/* Current Level Indicator */}
        <div 
          className="absolute top-0 h-8 w-1 bg-white"
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      {/* Sigma Markers */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>0σ</span>
        <span>1σ</span>
        <span>2σ</span>
        <span className="text-yellow-400">3σ</span>
        <span className="text-blue-400">4σ</span>
        <span>5σ</span>
        <span className="text-green-400">6σ</span>
        <span>7σ</span>
      </div>
      
      {/* Current Level Display */}
      <div className="text-center mt-4">
        <div className="text-3xl font-bold text-white">
          {level.toFixed(2)}σ
        </div>
        <div className="text-sm text-gray-400">
          {getSigmaRating(level)}
        </div>
      </div>
    </div>
  )
}
```

### **Helper Functions**

```typescript
function getSigmaColor(level: number): string {
  if (level >= 6.0) return 'text-green-400'
  if (level >= 4.5) return 'text-blue-400'
  if (level >= 3.0) return 'text-yellow-400'
  if (level >= 2.0) return 'text-orange-400'
  return 'text-red-400'
}

function getSigmaRating(level: number): string {
  if (level >= 6.0) return 'Six Sigma (World Class)'
  if (level >= 5.0) return 'Five Sigma (Excellent)'
  if (level >= 4.0) return 'Four Sigma (Good)'
  if (level >= 3.0) return 'Three Sigma (Industry Average)'
  if (level >= 2.0) return 'Two Sigma (Poor)'
  return 'Below Two Sigma (Critical)'
}

function getSigmaInterpretation(level: number): string {
  if (level >= 6.0) {
    return 'Your process operates at Six Sigma level with only 3.4 defects per million. This is world-class performance.'
  } else if (level >= 4.0) {
    return 'Your process is performing well but has room for improvement to reach Six Sigma standards.'
  } else if (level >= 3.0) {
    return 'Your process is at industry average. Significant improvement is possible through DMAIC methodology.'
  } else {
    return 'Your process needs immediate attention. A DMAIC project should be initiated to reduce defects.'
  }
}
```

### **MetricCard Component**

```typescript
interface MetricCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color?: string
  subtext?: string
}

function MetricCard({ label, value, icon, color = 'blue', subtext }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-slate-700/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-${color}-400`}>{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  )
}
```

---

## 4️⃣ **CAPABILITY INTERPRETATION COMPONENT**

### **File:** `CapabilityInterpretation.tsx` (~150 lines)

### **Purpose**
Display overall interpretation and actionable recommendations based on capability analysis.

### **Props Interface**

```typescript
interface CapabilityInterpretationProps {
  interpretation: string
  recommendations: string[]
  rating: CapabilityRating
  indices: CapabilityIndices
}
```

### **Component Structure**

```typescript
export function CapabilityInterpretation({
  interpretation,
  recommendations,
  rating,
  indices
}: CapabilityInterpretationProps) {
  return (
    <div className="space-y-4">
      {/* Overall Interpretation */}
      <Card className="border-white/10 bg-slate-800/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
          <h3 className="text-lg font-bold text-white">Analysis Interpretation</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">{interpretation}</p>
      </Card>

      {/* Recommendations */}
      <Card className="border-white/10 bg-slate-800/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5" />
          <h3 className="text-lg font-bold text-white">Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <RecommendationCard 
              key={index}
              number={index + 1}
              text={rec}
              priority={getRecommendationPriority(rec, index)}
            />
          ))}
        </div>
      </Card>

      {/* Action Summary */}
      <ActionSummaryCard rating={rating} indices={indices} />
    </div>
  )
}
```

### **RecommendationCard Component**

```typescript
interface RecommendationCardProps {
  number: number
  text: string
  priority: 'high' | 'medium' | 'low'
}

function RecommendationCard({ number, text, priority }: RecommendationCardProps) {
  const priorityConfig = {
    high: { color: 'red', icon: AlertTriangle, bg: 'bg-red-500/10' },
    medium: { color: 'yellow', icon: AlertCircle, bg: 'bg-yellow-500/10' },
    low: { color: 'blue', icon: Info, bg: 'bg-blue-500/10' }
  }
  
  const config = priorityConfig[priority]
  const Icon = config.icon
  
  return (
    <div className={`${config.bg} border border-${config.color}-500/20 rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-${config.color}-500/20 text-${config.color}-400 text-sm font-bold`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-4 w-4 text-${config.color}-400`} />
            <Badge className={`bg-${config.color}-500/20 text-${config.color}-400 text-xs`}>
              {priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-300">{text}</p>
        </div>
      </div>
    </div>
  )
}
```

### **ActionSummaryCard Component**

```typescript
function ActionSummaryCard({ rating, indices }: { rating: CapabilityRating, indices: CapabilityIndices }) {
  const actions = generateActions(rating, indices)
  
  return (
    <Card className="border-white/10 bg-slate-800/50 p-6">
      <div className="flex items-start gap-3 mb-4">
        <CheckSquare className="h-5 w-5 text-green-400 mt-0.5" />
        <h3 className="text-lg font-bold text-white">Next Steps</h3>
      </div>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
            <span className="text-sm text-gray-300">{action}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

### **Helper Functions**

```typescript
function getRecommendationPriority(rec: string, index: number): 'high' | 'medium' | 'low' {
  // First recommendation is always from rating - high priority
  if (index === 0) return 'high'
  
  // Keywords for priority classification
  if (rec.includes('Urgent') || rec.includes('Immediate') || rec.includes('Critical')) {
    return 'high'
  }
  if (rec.includes('Consider') || rec.includes('Focus')) {
    return 'medium'
  }
  return 'low'
}

function generateActions(rating: CapabilityRating, indices: CapabilityIndices): string[] {
  const actions: string[] = []
  
  if (indices.cpk && indices.cpk < 1.33) {
    actions.push('Initiate a DMAIC project to improve process capability')
    actions.push('Conduct root cause analysis for variation sources')
    actions.push('Implement process controls and monitoring')
  }
  
  if (indices.cpl && indices.cpu && Math.abs(indices.cpl - indices.cpu) > 0.2) {
    actions.push('Adjust process settings to center on target')
  }
  
  if (rating.rating === 'Excellent') {
    actions.push('Document best practices for this process')
    actions.push('Consider reducing inspection frequency')
    actions.push('Share learnings with other processes')
  }
  
  actions.push('Continue monitoring with control charts')
  
  return actions
}
```

---

## 🎨 **SHARED STYLING & THEMES**

### **Color Palette**

```typescript
const capabilityColors = {
  excellent: 'green-400',
  good: 'blue-400',
  marginal: 'yellow-400',
  poor: 'orange-400',
  unacceptable: 'red-400'
}

const sigmaColors = {
  worldClass: 'green-500',    // 6σ+
  excellent: 'green-400',     // 5σ-6σ
  good: 'blue-400',           // 4σ-5σ
  average: 'yellow-400',      // 3σ-4σ
  poor: 'orange-400',         // 2σ-3σ
  critical: 'red-400'         // <2σ
}
```

### **Common Components**

All components should use:
- **Card** wrapper with `border-white/10 bg-slate-800/50`
- **Icons** from `lucide-react`
- **Recharts** for data visualization
- **Responsive** grid layouts (`md:grid-cols-X`)
- **Dark theme** optimized colors

---

## 📊 **INTEGRATION EXAMPLE**

### **Complete Capability Mode UI**

```typescript
'use client'

import { useState } from 'react'
import { CapabilityControls } from './CapabilityControls'
import { CapabilityResults } from './CapabilityResults'
import { ProcessCapabilityChart } from './ProcessCapabilityChart'
import { SigmaLevelCard } from './SigmaLevelCard'
import { CapabilityInterpretation } from './CapabilityInterpretation'
import { performCapabilityAnalysis } from '@/lib/games/catapult/capabilityCalculations'

export function CapabilityMode({ validationData, stats }) {
  const [specs, setSpecs] = useState({ lsl: null, usl: null, target: null })
  const [analysis, setAnalysis] = useState(null)
  
  const handleAnalyze = () => {
    const result = performCapabilityAnalysis(
      validationData,
      stats.mean,
      stats.stdDev,
      specs
    )
    setAnalysis(result)
  }
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <CapabilityControls
        specs={specs}
        onSpecsChange={setSpecs}
        onAnalyze={handleAnalyze}
        canAnalyze={validationData.length >= 30}
      />
      
      {analysis && (
        <>
          {/* Results Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <CapabilityResults
              indices={analysis.indices}
              rating={analysis.rating}
              interpretation={analysis.interpretation}
            />
            
            <SigmaLevelCard
              sigmaMetrics={analysis.sigmaMetrics}
              rating={analysis.rating}
            />
          </div>
          
          {/* Chart */}
          <ProcessCapabilityChart
            data={validationData}
            specs={analysis.specs}
            stats={stats}
            indices={analysis.indices}
            rating={analysis.rating}
          />
          
          {/* Interpretation */}
          <CapabilityInterpretation
            interpretation={analysis.interpretation}
            recommendations={analysis.recommendations}
            rating={analysis.rating}
            indices={analysis.indices}
          />
        </>
      )}
    </div>
  )
}
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **CapabilityResults.tsx**
- [ ] Create component file
- [ ] Implement IndexCard component
- [ ] Add capability bar visualization
- [ ] Implement color coding logic
- [ ] Add benchmark indicators
- [ ] Create compact variant
- [ ] Test with sample data

### **ProcessCapabilityChart.tsx**
- [ ] Create component file
- [ ] Implement histogram with Recharts
- [ ] Add spec limit reference lines
- [ ] Implement zone coloring
- [ ] Add defect count legend
- [ ] Test responsiveness
- [ ] Verify axis scaling

### **SigmaLevelCard.tsx**
- [ ] Create component file
- [ ] Implement sigma gauge component
- [ ] Add DPMO/PPM display
- [ ] Create metric cards
- [ ] Add interpretation text
- [ ] Test with various sigma levels
- [ ] Verify color coding

### **CapabilityInterpretation.tsx**
- [ ] Create component file
- [ ] Implement recommendation cards
- [ ] Add priority badges
- [ ] Create action summary
- [ ] Test with various ratings
- [ ] Verify responsive layout

---

## 🎯 **SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ All 8 capability indices displayed correctly
- ✅ Color coding matches capability ratings
- ✅ Histogram shows distribution with spec limits
- ✅ Sigma gauge accurately represents level
- ✅ Recommendations are actionable and clear

### **Visual Requirements**
- ✅ Dark theme consistent with app design
- ✅ Responsive on mobile/tablet/desktop
- ✅ Clear hierarchy and information flow
- ✅ Interactive charts with tooltips
- ✅ Accessibility (WCAG 2.1 AA)

### **Educational Requirements**
- ✅ Users understand Cp vs Cpk difference
- ✅ Sigma level interpretation is clear
- ✅ Benchmarks (1.33, 1.67, 2.0) are visible
- ✅ Recommendations explain "why" and "what"

---

## 📝 **NOTES**

### **Design Decisions**
1. **Primary focus on Cpk** - Most important index, highlighted
2. **Color-coded zones** - Red/yellow/green for quick assessment
3. **Benchmarks visible** - Industry standards at 1.33, 1.67, 2.0
4. **Educational tooltips** - Help users learn Six Sigma concepts

### **Future Enhancements**
- Export capability report to PDF
- Historical capability trending
- Comparison with industry benchmarks
- Monte Carlo simulation for capability prediction

---

**Document Status:** ✅ Complete - Ready for Implementation
**Estimated Implementation Time:** 4-6 hours for all 4 components
**Dependencies:** Day 8 capability calculations engine
