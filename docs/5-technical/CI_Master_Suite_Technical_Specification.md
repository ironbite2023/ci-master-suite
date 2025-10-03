# CI Master Suite - Technical Specification Document

## 1. Executive Summary

The CI Master Suite is a comprehensive web application that consolidates Continuous Improvement (CI), Lean, and Six Sigma tools into a unified platform. Built with Next.js 15 and Supabase, it targets experienced Lean Six Sigma practitioners, offering 50+ analytical tools with advanced data visualization, secure cloud storage, and enterprise-grade security through Row Level Security (RLS).

## 2. Technology Stack

### 2.1 Frontend Technologies
- **Framework**: Next.js 15.4.0 (App Router)
- **Language**: TypeScript 5.x
- **UI Framework**: Tailwind CSS 3.4
- **Component Library**: Shadcn/ui
- **Data Visualization**: 
  - Recharts 2.x (primary charting)
  - Chart.js 4.x (statistical charts)
  - D3.js 7.x (advanced visualizations)
- **Form Management**: React Hook Form 7.x with Zod validation
- **State Management**: Zustand 4.x
- **Data Grid**: TanStack Table v8

### 2.2 Backend Technologies
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions
- **API**: Next.js API Routes + tRPC

### 2.3 Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 3. Project Structure

```
ci-master/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Main dashboard
│   │   ├── ci/                  # CI tools
│   │   │   ├── kaizen/
│   │   │   ├── pdca/
│   │   │   ├── a3/
│   │   │   └── ...
│   │   ├── lean/                # Lean tools
│   │   │   ├── vsm/
│   │   │   ├── takt-time/
│   │   │   ├── kanban/
│   │   │   └── ...
│   │   ├── six-sigma/           # Six Sigma tools
│   │   │   ├── spc/
│   │   │   ├── capability/
│   │   │   ├── msa/
│   │   │   └── ...
│   │   └── projects/            # Project management
│   ├── api/                     # API routes
│   │   └── trpc/
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Shadcn/ui components
│   ├── charts/                  # Chart components
│   ├── tools/                   # Tool-specific components
│   └── shared/                  # Shared components
├── lib/                         # Utility functions
│   ├── supabase/               # Supabase client
│   ├── calculations/           # Statistical calculations
│   ├── validators/             # Zod schemas
│   └── utils/                  # Helper functions
├── types/                       # TypeScript types
├── hooks/                       # Custom React hooks
├── styles/                      # Global styles
├── public/                      # Static assets
└── supabase/                    # Supabase config
    ├── migrations/             # Database migrations
    ├── functions/              # Edge functions
    └── seed.sql                # Seed data
```

## 4. Database Schema

### 4.1 Core Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company TEXT,
    role TEXT,
    certification_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('ci', 'lean', 'six_sigma', 'mixed')),
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tool_type TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data sets table
CREATE TABLE data_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    tool_type TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exports table
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    format TEXT CHECK (format IN ('pdf', 'csv', 'xlsx')),
    file_path TEXT,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool usage analytics
CREATE TABLE tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    tool_type TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    duration_seconds INTEGER,
    actions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Project policies
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Analysis policies (similar pattern for other tables)
CREATE POLICY "Users can manage own analyses" ON analyses
    FOR ALL USING (auth.uid() = user_id);

-- Template policies
CREATE POLICY "Users can view public templates" ON templates
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own templates" ON templates
    FOR ALL USING (auth.uid() = user_id);
```

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => {
  return createClientComponentClient<Database>()
}

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

// Authentication hook
// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
```

### 5.2 Protected Route Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## 6. Core Components Implementation

### 6.1 Tool Card Component

```typescript
// components/tools/ToolCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, BarChart } from 'lucide-react'
import Link from 'next/link'

interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    category: 'ci' | 'lean' | 'six_sigma'
    complexity: 'basic' | 'intermediate' | 'advanced'
    estimatedTime: string
    usageCount: number
    path: string
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const categoryColors = {
    ci: 'bg-blue-100 text-blue-800',
    lean: 'bg-green-100 text-green-800',
    six_sigma: 'bg-purple-100 text-purple-800'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          <Badge className={categoryColors[tool.category]}>
            {tool.category.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{tool.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{tool.usageCount} uses</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{tool.complexity}</span>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={tool.path}>Open Tool</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 6.2 Data Import Component

```typescript
// components/data/DataImport.tsx
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { z } from 'zod'

interface DataImportProps {
  onDataImported: (data: any[], headers: string[]) => void
  schema?: z.ZodSchema
}

export function DataImport({ onDataImported, schema }: DataImportProps) {
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)

  const processFile = useCallback(async (file: File) => {
    setError(null)
    const extension = file.name.split('.').pop()?.toLowerCase()

    try {
      let data: any[] = []
      let headers: string[] = []

      if (extension === 'csv') {
        // Process CSV
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            data = results.data
            headers = results.meta.fields || []
          },
          error: (error) => {
            throw new Error(`CSV parsing error: ${error.message}`)
          }
        })
      } else if (['xlsx', 'xls'].includes(extension || '')) {
        // Process Excel
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer)
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
        
        if (jsonData.length > 0) {
          headers = jsonData[0] as string[]
          data = jsonData.slice(1).map(row => {
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = (row as any[])[index]
            })
            return obj
          })
        }
      } else {
        throw new Error('Unsupported file format')
      }

      // Validate data if schema provided
      if (schema && data.length > 0) {
        data.forEach((row, index) => {
          try {
            schema.parse(row)
          } catch (e) {
            throw new Error(`Validation error at row ${index + 1}: ${e.message}`)
          }
        })
      }

      setPreview(data.slice(0, 5))
      onDataImported(data, headers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    }
  }, [onDataImported, schema])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
            <p className="text-sm text-muted-foreground">Supports CSV, XLS, XLSX</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <div className="space-y-2">
          <h3 className="font-semibold">Preview (first 5 rows):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 6.3 SPC Chart Component

```typescript
// components/charts/SPCChart.tsx
import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateControlLimits } from '@/lib/calculations/spc'

interface SPCChartProps {
  data: Array<{
    sample: number
    value: number
  }>
  title: string
  yLabel: string
  showViolations?: boolean
}

export function SPCChart({ data, title, yLabel, showViolations = true }: SPCChartProps) {
  const { mean, ucl, lcl, violations } = useMemo(() => {
    return calculateControlLimits(data.map(d => d.value))
  }, [data])

  const chartData = data.map((point, index) => ({
    ...point,
    isViolation: violations.includes(index)
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sample" label={{ value: 'Sample', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            
            {/* Control lines */}
            <ReferenceLine y={mean} stroke="#22c55e" strokeDasharray="5 5" label="CL" />
            <ReferenceLine y={ucl} stroke="#ef4444" strokeDasharray="5 5" label="UCL" />
            <ReferenceLine y={lcl} stroke="#ef4444" strokeDasharray="5 5" label="LCL" />
            
            {/* Data line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                const fill = payload.isViolation ? '#ef4444' : '#3b82f6'
                return <circle cx={cx} cy={cy} r={4} fill={fill} />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {showViolations && violations.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-semibold text-red-800">
              Control violations detected at samples: {violations.map(v => v + 1).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## 7. Statistical Calculations Library

### 7.1 SPC Calculations

```typescript
// lib/calculations/spc.ts
export interface ControlLimits {
  mean: number
  ucl: number
  lcl: number
  sigma: number
  violations: number[]
}

export function calculateControlLimits(data: number[], sigmaLevel: number = 3): ControlLimits {
  const n = data.length
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  
  // Calculate standard deviation
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const sigma = Math.sqrt(variance)
  
  // Control limits
  const ucl = mean + sigmaLevel * sigma
  const lcl = mean - sigmaLevel * sigma
  
  // Check for violations
  const violations: number[] = []
  data.forEach((value, index) => {
    if (value > ucl || value < lcl) {
      violations.push(index)
    }
  })
  
  // Check for runs rules
  const runsViolations = checkRunsRules(data, mean)
  violations.push(...runsViolations)
  
  return {
    mean,
    ucl,
    lcl,
    sigma,
    violations: [...new Set(violations)].sort((a, b) => a - b)
  }
}

function checkRunsRules(data: number[], mean: number): number[] {
  const violations: number[] = []
  
  // Rule 1: 8 points in a row on same side of centerline
  let consecutiveSameSide = 0
  let lastSide = 0
  
  for (let i = 0; i < data.length; i++) {
    const currentSide = data[i] > mean ? 1 : -1
    if (currentSide === lastSide) {
      consecutiveSameSide++
      if (consecutiveSameSide >= 8) {
        violations.push(i)
      }
    } else {
      consecutiveSameSide = 1
      lastSide = currentSide
    }
  }
  
  // Rule 2: 6 points in a row increasing or decreasing
  for (let i = 5; i < data.length; i++) {
    let increasing = true
    let decreasing = true
    
    for (let j = 1; j < 6; j++) {
      if (data[i - j + 1] <= data[i - j]) increasing = false
      if (data[i - j + 1] >= data[i - j]) decreasing = false
    }
    
    if (increasing || decreasing) {
      violations.push(i)
    }
  }
  
  return violations
}
```

### 7.2 Process Capability Calculations

```typescript
// lib/calculations/capability.ts
export interface ProcessCapability {
  cp: number
  cpk: number
  pp: number
  ppk: number
  mean: number
  sigma: number
  sigmaWithin: number
  sigmaBetween: number
}

export function calculateProcessCapability(
  data: number[],
  usl: number,
  lsl: number,
  subgroupSize: number = 1
): ProcessCapability {
  const n = data.length
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  
  // Overall sigma (for Pp, Ppk)
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
  const sigmaOverall = Math.sqrt(variance)
  
  // Within-subgroup sigma (for Cp, Cpk)
  let sigmaWithin = sigmaOverall // Default for subgroup size = 1
  
  if (subgroupSize > 1) {
    const subgroups = []
    for (let i = 0; i < data.length; i += subgroupSize) {
      subgroups.push(data.slice(i, i + subgroupSize))
    }
    
    const ranges = subgroups.map(group => Math.max(...group) - Math.min(...group))
    const avgRange = ranges.reduce((sum, r) => sum + r, 0) / ranges.length
    
    // d2 factor for subgroup size
    const d2 = getD2Factor(subgroupSize)
    sigmaWithin = avgRange / d2
  }
  
  // Calculate indices
  const cp = (usl - lsl) / (6 * sigmaWithin)
  const cpkUpper = (usl - mean) / (3 * sigmaWithin)
  const cpkLower = (mean - lsl) / (3 * sigmaWithin)
  const cpk = Math.min(cpkUpper, cpkLower)
  
  const pp = (usl - lsl) / (6 * sigmaOverall)
  const ppkUpper = (usl - mean) / (3 * sigmaOverall)
  const ppkLower = (mean - lsl) / (3 * sigmaOverall)
  const ppk = Math.min(ppkUpper, ppkLower)
  
  return {
    cp,
    cpk,
    pp,
    ppk,
    mean,
    sigma: sigmaOverall,
    sigmaWithin,
    sigmaBetween: Math.sqrt(Math.max(0, sigmaOverall ** 2 - sigmaWithin ** 2))
  }
}

function getD2Factor(n: number): number {
  const d2Table: { [key: number]: number } = {
    2: 1.128, 3: 1.693, 4: 2.059, 5: 2.326,
    6: 2.534, 7: 2.704, 8: 2.847, 9: 2.970,
    10: 3.078, 11: 3.173, 12: 3.258, 13: 3.336,
    14: 3.407, 15: 3.472, 16: 3.532, 17: 3.588,
    18: 3.640, 19: 3.689, 20: 3.735, 21: 3.778,
    22: 3.819, 23: 3.858, 24: 3.895, 25: 3.931
  }
  return d2Table[n] || 3.931
}
```

## 8. Tool Implementations

### 8.1 Value Stream Mapping Tool

```typescript
// app/(dashboard)/lean/vsm/page.tsx
'use client'

import { useState } from 'react'
import { ReactFlow, Node, Edge, Controls, Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Save, Download } from 'lucide-react'

const nodeTypes = {
  process: ProcessNode,
  inventory: InventoryNode,
  customer: CustomerNode,
  supplier: SupplierNode
}

export default function VSMTool() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 250, y: 250 },
      data: {
        label: `New ${type}`,
        cycleTime: 0,
        leadTime: 0,
        firstPassYield: 100,
        inventory: 0
      }
    }
    setNodes((nds) => [...nds, newNode])
  }

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    )
  }

  const calculateMetrics = () => {
    const totalCycleTime = nodes
      .filter(n => n.type === 'process')
      .reduce((sum, node) => sum + (node.data.cycleTime || 0), 0)
    
    const totalLeadTime = nodes
      .filter(n => n.type === 'process')
      .reduce((sum, node) => sum + (node.data.leadTime || 0), 0)
    
    const totalInventory = nodes
      .filter(n => n.type === 'inventory')
      .reduce((sum, node) => sum + (node.data.inventory || 0), 0)
    
    return {
      totalCycleTime,
      totalLeadTime,
      processEfficiency: totalLeadTime > 0 ? (totalCycleTime / totalLeadTime) * 100 : 0,
      totalInventory
    }
  }

  const metrics = calculateMetrics()

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Value Stream Mapping</h2>
        
        {/* Add nodes */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Add Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => addNode('process')} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Process
            </Button>
            <Button onClick={() => addNode('inventory')} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Inventory
            </Button>
            <Button onClick={() => addNode('customer')} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Customer
            </Button>
            <Button onClick={() => addNode('supplier')} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Supplier
            </Button>
          </div>
        </div>

        {/* Node properties */}
        {selectedNode && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Properties</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={selectedNode.data.label}
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                />
              </div>
              
              {selectedNode.type === 'process' && (
                <>
                  <div>
                    <Label htmlFor="cycleTime">Cycle Time (min)</Label>
                    <Input
                      id="cycleTime"
                      type="number"
                      value={selectedNode.data.cycleTime}
                      onChange={(e) => updateNodeData(selectedNode.id, { cycleTime: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leadTime">Lead Time (min)</Label>
                    <Input
                      id="leadTime"
                      type="number"
                      value={selectedNode.data.leadTime}
                      onChange={(e) => updateNodeData(selectedNode.id, { leadTime: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fpy">First Pass Yield (%)</Label>
                    <Input
                      id="fpy"
                      type="number"
                      value={selectedNode.data.firstPassYield}
                      onChange={(e) => updateNodeData(selectedNode.id, { firstPassYield: Number(e.target.value) })}
                    />
                  </div>
                </>
              )}
              
              {selectedNode.type === 'inventory' && (
                <div>
                  <Label htmlFor="inventory">Inventory (units)</Label>
                  <Input
                    id="inventory"
                    type="number"
                    value={selectedNode.data.inventory}
                    onChange={(e) => updateNodeData(selectedNode.id, { inventory: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Metrics */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">VSM Metrics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Cycle Time:</span>
              <span className="font-medium">{metrics.totalCycleTime} min</span>
            </div>
            <div className="flex justify-between">
              <span>Total Lead Time:</span>
              <span className="font-medium">{metrics.totalLeadTime} min</span>
            </div>
            <div className="flex justify-between">
              <span>Process Efficiency:</span>
              <span className="font-medium">{metrics.processEfficiency.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Inventory:</span>
              <span className="font-medium">{metrics.totalInventory} units</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-6 space-y-2">
          <Button className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save VSM
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Flow diagram */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            // Handle node changes
          }}
          onEdgesChange={(changes) => {
            // Handle edge changes
          }}
          onNodeClick={(event, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}

// Custom node components
function ProcessNode({ data }: any) {
  return (
    <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 min-w-[150px]">
      <div className="font-semibold text-center">{data.label}</div>
      <div className="text-xs mt-2 space-y-1">
        <div>CT: {data.cycleTime}min</div>
        <div>LT: {data.leadTime}min</div>
        <div>FPY: {data.firstPassYield}%</div>
      </div>
    </div>
  )
}

function InventoryNode({ data }: any) {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 min-w-[120px]">
      <div className="font-semibold text-center">{data.label}</div>
      <div className="text-xs mt-2 text-center">
        {data.inventory} units
      </div>
    </div>
  )
}

function CustomerNode({ data }: any) {
  return (
    <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 min-w-[120px]">
      <div className="font-semibold text-center">🏭 {data.label}</div>
    </div>
  )
}

function SupplierNode({ data }: any) {
  return (
    <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-4 min-w-[120px]">
      <div className="font-semibold text-center">📦 {data.label}</div>
    </div>
  )
}
```

### 8.2 DMAIC Project Manager

```typescript
// app/(dashboard)/six-sigma/dmaic/page.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle } from 'lucide-react'

interface DMAICPhase {
  id: string
  name: string
  description: string
  tasks: Task[]
  tools: string[]
  deliverables: string[]
}

interface Task {
  id: string
  name: string
  completed: boolean
  notes: string
}

const dmaicPhases: DMAICPhase[] = [
  {
    id: 'define',
    name: 'Define',
    description: 'Define the problem and project goals',
    tasks: [
      { id: 'd1', name: 'Create Project Charter', completed: false, notes: '' },
      { id: 'd2', name: 'Identify Stakeholders', completed: false, notes: '' },
      { id: 'd3', name: 'Define CTQs', completed: false, notes: '' },
      { id: 'd4', name: 'Create SIPOC', completed: false, notes: '' }
    ],
    tools: ['Project Charter', 'SIPOC', 'Voice of Customer', 'CTQ Tree'],
    deliverables: ['Project Charter', 'SIPOC Diagram', 'CTQ Definitions']
  },
  {
    id: 'measure',
    name: 'Measure',
    description: 'Measure current process performance',
    tasks: [
      { id: 'm1', name: 'Create Data Collection Plan', completed: false, notes: '' },
      { id: 'm2', name: 'Perform MSA', completed: false, notes: '' },
      { id: 'm3', name: 'Collect Baseline Data', completed: false, notes: '' },
      { id: 'm4', name: 'Calculate Process Capability', completed: false, notes: '' }
    ],
    tools: ['MSA', 'Control Charts', 'Process Capability', 'Data Collection Plan'],
    deliverables: ['MSA Results', 'Baseline Metrics', 'Process Capability Study']
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Analyze data to find root causes',
    tasks: [
      { id: 'a1', name: 'Perform Root Cause Analysis', completed: false, notes: '' },
      { id: 'a2', name: 'Create Fishbone Diagram', completed: false, notes: '' },
      { id: 'a3', name: 'Conduct Hypothesis Testing', completed: false, notes: '' },
      { id: 'a4', name: 'Identify Critical X\'s', completed: false, notes: '' }
    ],
    tools: ['Fishbone Diagram', 'Hypothesis Testing', 'Regression Analysis', 'FMEA'],
    deliverables: ['Root Cause Analysis', 'Statistical Analysis Results', 'Critical X\'s']
  },
  {
    id: 'improve',
    name: 'Improve',
    description: 'Implement and verify improvements',
    tasks: [
      { id: 'i1', name: 'Generate Improvement Ideas', completed: false, notes: '' },
      { id: 'i2', name: 'Design Experiments (DOE)', completed: false, notes: '' },
      { id: 'i3', name: 'Pilot Improvements', completed: false, notes: '' },
      { id: 'i4', name: 'Verify Improvements', completed: false, notes: '' }
    ],
    tools: ['DOE', 'Pilot Testing', 'Solution Selection Matrix', 'Cost-Benefit Analysis'],
    deliverables: ['DOE Results', 'Pilot Results', 'Implementation Plan']
  },
  {
    id: 'control',
    name: 'Control',
    description: 'Sustain improvements over time',
    tasks: [
      { id: 'c1', name: 'Create Control Plan', completed: false, notes: '' },
      { id: 'c2', name: 'Implement SPC', completed: false, notes: '' },
      { id: 'c3', name: 'Train Process Owners', completed: false, notes: '' },
      { id: 'c4', name: 'Document Lessons Learned', completed: false, notes: '' }
    ],
    tools: ['Control Plan', 'SPC Charts', 'Standard Work', 'Training Materials'],
    deliverables: ['Control Plan', 'SPC Implementation', 'Training Documentation']
  }
]

export default function DMAICProject() {
  const [phases, setPhases] = useState(dmaicPhases)
  const [activePhase, setActivePhase] = useState('define')

  const toggleTask = (phaseId: string, taskId: string) => {
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed }
            }
            return task
          })
        }
      }
      return phase
    }))
  }

  const getPhaseProgress = (phase: DMAICPhase) => {
    const completed = phase.tasks.filter(t => t.completed).length
    return (completed / phase.tasks.length) * 100
  }

  const getOverallProgress = () => {
    const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0)
    const completedTasks = phases.reduce((sum, phase) => 
      sum + phase.tasks.filter(t => t.completed).length, 0
    )
    return (completedTasks / totalTasks) * 100
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">DMAIC Project Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage your Six Sigma project through the DMAIC phases
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Overall completion across all phases</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={getOverallProgress()} className="h-4" />
          <p className="text-sm text-muted-foreground mt-2">
            {getOverallProgress().toFixed(0)}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Phase Progress Overview */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {phases.map((phase) => (
          <Card 
            key={phase.id} 
            className={`cursor-pointer transition-all ${
              activePhase === phase.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setActivePhase(phase.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{phase.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getPhaseProgress(phase)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {phase.tasks.filter(t => t.completed).length}/{phase.tasks.length} tasks
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phase Details */}
      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-5">
          {phases.map((phase) => (
            <TabsTrigger key={phase.id} value={phase.id}>
              {phase.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map((phase) => (
          <TabsContent key={phase.id} value={phase.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{phase.name} Phase</CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tasks */}
                  <div>
                    <h3 className="font-semibold mb-3">Tasks</h3>
                    <div className="space-y-2">
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleTask(phase.id, task.id)}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={task.completed ? 'line-through text-gray-500' : ''}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools and Deliverables */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Recommended Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {phase.tools.map((tool) => (
                          <Button key={tool} variant="outline" size="sm">
                            {tool}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Key Deliverables</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {phase.deliverables.map((deliverable) => (
                          <li key={deliverable}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
```

## 9. API Routes and tRPC Setup

### 9.1 tRPC Configuration

```typescript
// lib/trpc/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superjson from 'superjson'
import { ZodError } from 'zod'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
```

### 9.2 Project Router

```typescript
// lib/trpc/routers/project.ts
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const projectRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db
      .from('projects')
      .select('*')
      .eq('user_id', ctx.session.user.id)
      .order('created_at', { ascending: false })

    return projects.data || []
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data: project } = await ctx.db
        .from('projects')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.session.user.id)
        .single()

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        })
      }

      return project
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        type: z.enum(['ci', 'lean', 'six_sigma', 'mixed']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: project, error } = await ctx.db
        .from('projects')
        .insert({
          ...input,
          user_id: ctx.session.user.id,
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return project
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const { data: project, error } = await ctx.db
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', ctx.session.user.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return project
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.db
        .from('projects')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.session.user.id)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      return { success: true }
    }),
})
```

## 10. Deployment Configuration

### 10.1 Environment Variables

```bash
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 10.2 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

### 10.3 Package.json

```json
{
  "name": "ci-master-suite",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-table": "^8.10.0",
    "@trpc/client": "^10.43.0",
    "@trpc/next": "^10.43.0",
    "@trpc/react-query": "^10.43.0",
    "@trpc/server": "^10.43.0",
    "chart.js": "^4.4.0",
    "d3": "^7.8.0",
    "lucide-react": "^0.290.0",
    "next": "^14.0.3",
    "papaparse": "^5.4.0",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.0",
    "react-hook-form": "^7.47.0",
    "reactflow": "^11.10.0",
    "recharts": "^2.9.0",
    "superjson": "^2.2.0",
    "tailwindcss": "^3.3.0",
    "xlsx": "^0.18.5",
    "zod": "^3.22.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/papaparse": "^5.3.0",
    "@types/react": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.3",
    "prettier": "^3.1.0",
    "typescript": "^5.2.0",
    "vitest": "^0.34.0"
  }
}
```

## 11. Security Best Practices

### 11.1 API Security

```typescript
// lib/security/rateLimit.ts
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        if (isRateLimited) {
          reject()
        } else {
          resolve()
        }
      }),
  }
}
```

### 11.2 Input Validation

```typescript
// lib/validators/common.ts
import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
})

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export const fileUploadSchema = z.object({
  name: z.string().min(1).max(255),
  size: z.number().max(10 * 1024 * 1024), // 10MB limit
  type: z.enum(['text/csv', 'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
})
```

## 12. Performance Optimization

### 12.1 Data Caching Strategy

```typescript
// hooks/useAnalysisData.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useAnalysisData(analysisId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select(`
          *,
          data_sets (*)
        `)
        .eq('id', analysisId)
        .single()

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

### 12.2 Image Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-url.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

## 13. Testing Strategy

### 13.1 Unit Test Example

```typescript
// __tests__/calculations/spc.test.ts
import { describe, it, expect } from 'vitest'
import { calculateControlLimits } from '@/lib/calculations/spc'

describe('SPC Calculations', () => {
  it('should calculate control limits correctly', () => {
    const data = [10, 12, 11, 13, 12, 11, 10, 12, 13, 11]
    const result = calculateControlLimits(data)

    expect(result.mean).toBeCloseTo(11.5, 1)
    expect(result.ucl).toBeGreaterThan(result.mean)
    expect(result.lcl).toBeLessThan(result.mean)
    expect(result.violations).toHaveLength(0)
  })

  it('should detect violations correctly', () => {
    const data = [10, 12, 11, 20, 12, 11, 10, 12, 13, 11] // 20 is an outlier
    const result = calculateControlLimits(data)

    expect(result.violations).toContain(3) // Index 3 has value 20
  })
})
```

### 13.2 E2E Test Example

```typescript
// e2e/spc-chart.spec.ts
import { test, expect } from '@playwright/test'

test('SPC Chart tool flow', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')

  // Navigate to SPC tool
  await page.goto('/dashboard/six-sigma/spc')
  
  // Import data
  const fileInput = await page.$('input[type="file"]')
  await fileInput?.setInputFiles('test-data/spc-sample.csv')
  
  // Wait for chart to render
  await page.waitForSelector('canvas')
  
  // Verify chart elements
  await expect(page.locator('text=Control Chart')).toBeVisible()
  await expect(page.locator('text=UCL')).toBeVisible()
  await expect(page.locator('text=LCL')).toBeVisible()
  
  // Export PDF
  await page.click('button:has-text("Export PDF")')
  const download = await page.waitForEvent('download')
  expect(download.suggestedFilename()).toContain('spc-chart')
})
```

## 14. Maintenance and Monitoring

### 14.1 Error Tracking

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
  })
}

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
}
```

### 14.2 Analytics Tracking

```typescript
// lib/analytics/posthog.ts
import posthog from 'posthog-js'

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  posthog.capture(event, properties)
}

export function trackToolUsage(toolName: string, duration: number) {
  trackEvent('tool_used', {
    tool_name: toolName,
    duration_seconds: duration,
  })
}
```

---

This technical specification provides a comprehensive foundation for building the CI Master Suite. The modular architecture, type-safe implementation, and focus on user experience will ensure a high-quality application that meets the needs of Lean Six Sigma practitioners.
