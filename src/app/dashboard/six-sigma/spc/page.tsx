'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SPCChart } from '@/components/charts/SPCChart'
import { Download, FileSpreadsheet, Plus, Trash2, BarChart3, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface DataPoint {
  sample: number
  value: number
}

export default function SPCControlChartPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/six-sigma');
  };

  const [data, setData] = useState<DataPoint[]>([
    { sample: 1, value: 10.2 },
    { sample: 2, value: 10.5 },
    { sample: 3, value: 9.8 },
    { sample: 4, value: 10.1 },
    { sample: 5, value: 10.3 },
    { sample: 6, value: 9.9 },
    { sample: 7, value: 10.4 },
    { sample: 8, value: 10.0 },
    { sample: 9, value: 10.2 },
    { sample: 10, value: 10.1 },
    { sample: 11, value: 10.6 },
    { sample: 12, value: 10.3 },
    { sample: 13, value: 9.7 },
    { sample: 14, value: 10.2 },
    { sample: 15, value: 10.4 },
    { sample: 16, value: 10.1 },
    { sample: 17, value: 10.5 },
    { sample: 18, value: 10.2 },
    { sample: 19, value: 10.0 },
    { sample: 20, value: 10.3 },
    { sample: 21, value: 12.5 }, // Outlier
    { sample: 22, value: 10.1 },
    { sample: 23, value: 10.2 },
    { sample: 24, value: 10.4 },
    { sample: 25, value: 10.3 }
  ])

  const [chartTitle, setChartTitle] = useState('Control Chart - Process Measurement')
  const [yAxisLabel, setYAxisLabel] = useState('Measurement Value')
  const [showViolations, setShowViolations] = useState(true)
  const [showRules, setShowRules] = useState(true)
  const [showZones, setShowZones] = useState(false)
  const [sigmaLevel, setSigmaLevel] = useState(3)

  const handleAddRow = useCallback(() => {
    const nextSample = data.length > 0 ? Math.max(...data.map(d => d.sample)) + 1 : 1
    setData([...data, { sample: nextSample, value: 10.0 }])
  }, [data])

  const handleDeleteRow = useCallback((index: number) => {
    const newData = data.filter((_, i) => i !== index)
    setData(newData)
  }, [data])

  const handleValueChange = useCallback((index: number, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const newData = [...data]
      newData[index].value = numValue
      setData(newData)
    }
  }, [data])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        // Skip header if present
        const startIndex = lines[0].toLowerCase().includes('sample') ? 1 : 0
        
        const parsedData: DataPoint[] = lines
          .slice(startIndex)
          .map((line, index) => {
            const parts = line.split(',').map(p => p.trim())
            return {
              sample: parseInt(parts[0]) || index + 1,
              value: parseFloat(parts[1]) || 0
            }
          })
          .filter(d => !isNaN(d.value))

        if (parsedData.length > 0) {
          setData(parsedData)
          toast.success(`Imported ${parsedData.length} data points`)
        } else {
          toast.error('No valid data found in file')
        }
      } catch {
        toast.error('Error parsing CSV file')
      }
    }
    reader.readAsText(file)
  }, [])

  const handleExportCSV = useCallback(() => {
    const csv = ['Sample,Value', ...data.map(d => `${d.sample},${d.value}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spc-data.csv'
    a.click()
    toast.success('Data exported successfully')
  }, [data])

  const handleBulkInput = useCallback((text: string) => {
    try {
      const values = text
        .split(/[\n,\s]+/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v))

      if (values.length > 0) {
        const newData = values.map((value, index) => ({
          sample: index + 1,
          value
        }))
        setData(newData)
        toast.success(`Imported ${values.length} data points`)
      } else {
        toast.error('No valid numbers found')
      }
    } catch {
      toast.error('Error parsing bulk input')
    }
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Six Sigma Tools
            </Button>
          </div>
          <h1 className="text-3xl font-bold">SPC Control Chart</h1>
          <p className="text-muted-foreground mt-1">
            Statistical Process Control - Monitor process stability and detect special causes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Data Input */}
        <div className="lg:col-span-1 space-y-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="bulk">Bulk</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>

            {/* Manual Entry */}
            <TabsContent value="manual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Entry</CardTitle>
                  <CardDescription>Add and edit data points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Button onClick={handleAddRow} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Row
                    </Button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {data.map((point, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={point.sample}
                          disabled
                          className="w-20"
                        />
                        <Input
                          type="number"
                          step="0.001"
                          value={point.value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bulk Entry */}
            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bulk Input</CardTitle>
                  <CardDescription>
                    Paste values separated by commas, spaces, or new lines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="10.2, 10.5, 9.8, 10.1, ..."
                    className="min-h-[300px] font-mono text-sm"
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        handleBulkInput(e.target.value)
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const textarea = (e.currentTarget.previousElementSibling as HTMLTextAreaElement)
                      if (textarea.value.trim()) {
                        handleBulkInput(textarea.value)
                      }
                    }}
                    className="w-full"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Load Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Import */}
            <TabsContent value="import">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Data</CardTitle>
                  <CardDescription>Upload CSV file with your measurements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Choose CSV file
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      CSV format: Sample, Value
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Expected CSV format:</p>
                    <pre className="text-xs font-mono">
                      Sample,Value{'\n'}
                      1,10.2{'\n'}
                      2,10.5{'\n'}
                      3,9.8
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Chart Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chart Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chart Title</Label>
                <Input
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Enter chart title"
                />
              </div>

              <div>
                <Label>Y-Axis Label</Label>
                <Input
                  value={yAxisLabel}
                  onChange={(e) => setYAxisLabel(e.target.value)}
                  placeholder="Enter Y-axis label"
                />
              </div>

              <div>
                <Label>Sigma Level</Label>
                <Select value={sigmaLevel.toString()} onValueChange={(v) => setSigmaLevel(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Sigma (95.4%)</SelectItem>
                    <SelectItem value="3">3 Sigma (99.7%)</SelectItem>
                    <SelectItem value="4">4 Sigma (99.99%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="violations"
                    checked={showViolations}
                    onCheckedChange={(checked) => setShowViolations(checked as boolean)}
                  />
                  <Label htmlFor="violations" className="cursor-pointer">
                    Show violations
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rules"
                    checked={showRules}
                    onCheckedChange={(checked) => setShowRules(checked as boolean)}
                  />
                  <Label htmlFor="rules" className="cursor-pointer">
                    Check Nelson rules
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="zones"
                    checked={showZones}
                    onCheckedChange={(checked) => setShowZones(checked as boolean)}
                  />
                  <Label htmlFor="zones" className="cursor-pointer">
                    Show sigma zones
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Chart */}
        <div className="lg:col-span-2">
          <SPCChart
            data={data}
            title={chartTitle}
            yLabel={yAxisLabel}
            showViolations={showViolations}
            showRules={showRules}
            showZones={showZones}
            sigmaLevel={sigmaLevel}
          />
        </div>
      </div>
    </div>
  )
}
