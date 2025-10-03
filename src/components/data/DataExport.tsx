'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, Check } from 'lucide-react'
import ExcelJS from 'exceljs'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf'
  filename: string
  title?: string
  description?: string
  includeMetadata: boolean
  includeCharts: boolean
  selectedColumns?: string[]
  dateRange?: { start: Date; end: Date }
}

interface DataExportProps {
  data: Record<string, unknown>[]
  headers: string[]
  metadata?: Record<string, unknown>
  charts?: Record<string, unknown>[]
  title?: string
  onExport?: (options: ExportOptions) => Promise<void>
  className?: string
}

export function DataExport({
  data,
  headers,
  metadata,
  charts = [],
  title = 'Analysis Results',
  onExport,
  className = ''
}: DataExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    filename: `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`,
    title,
    description: '',
    includeMetadata: true,
    includeCharts: false,
    selectedColumns: headers
  })
  const [exporting, setExporting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    
    try {
      if (onExport) {
        await onExport(exportOptions)
      } else {
        // Default export logic
        await performExport()
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
      setIsDialogOpen(false)
    }
  }

  const performExport = async () => {
    const { format, filename, selectedColumns = headers } = exportOptions
    
    // Filter data to selected columns
    const filteredData = data.map(row => {
      const filtered: Record<string, unknown> = {}
      selectedColumns.forEach(col => {
        if (col in row) {
          filtered[col] = row[col]
        }
      })
      return filtered
    })

    if (format === 'csv') {
      exportToCSV(filteredData, selectedColumns, filename)
    } else if (format === 'xlsx') {
      exportToExcel(filteredData, selectedColumns, filename)
    } else if (format === 'pdf') {
      exportToPDF(filteredData, selectedColumns)
    }
  }

  const exportToCSV = (data: Record<string, unknown>[], headers: string[], filename: string) => {
    // Create CSV content
    const csvContent = [
      // Headers
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma or quote
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        }).join(',')
      )
    ].join('\n')

    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, `${filename}.csv`)
  }

  const exportToExcel = async (data: Record<string, unknown>[], headers: string[], filename: string) => {
    // Create workbook
    const workbook = new ExcelJS.Workbook()
    
    // Main data sheet
    const worksheet = workbook.addWorksheet('Data')
    
    // Add headers
    worksheet.columns = headers.map(header => ({
      header,
      key: header,
      width: Math.min(Math.max(header.length + 2, 10), 50)
    }))
    
    // Auto-size columns based on content
    headers.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...data.map(row => String(row[header] || '').length)
      )
      worksheet.getColumn(index + 1).width = Math.min(maxLength + 2, 50)
    })
    
    // Add data rows
    data.forEach(row => {
      worksheet.addRow(row)
    })
    
    // Style headers
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Add metadata sheet if requested
    if (exportOptions.includeMetadata && metadata) {
      const metaWorksheet = workbook.addWorksheet('Metadata')
      metaWorksheet.columns = [
        { header: 'Property', key: 'Property', width: 30 },
        { header: 'Value', key: 'Value', width: 50 }
      ]
      
      Object.entries(metadata).forEach(([key, value]) => {
        metaWorksheet.addRow({ Property: key, Value: value })
      })
      
      metaWorksheet.getRow(1).font = { bold: true }
      metaWorksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      }
    }

    // Write and download
    const excelBuffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadBlob(blob, `${filename}.xlsx`)
  }

  const exportToPDF = async (data: Record<string, unknown>[], headers: string[]) => {
    // This is a simplified PDF export - in a real implementation, you'd use a library like jsPDF or Puppeteer
    // For now, we'll create a simple HTML report and use the browser's print functionality
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${exportOptions.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
          .metadata { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .export-info { font-size: 12px; color: #666; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${exportOptions.title}</h1>
        ${exportOptions.description ? `<p>${exportOptions.description}</p>` : ''}
        
        ${exportOptions.includeMetadata && metadata ? `
        <div class="metadata">
          <h3>Analysis Metadata</h3>
          ${Object.entries(metadata).map(([key, value]) => `
            <p><strong>${key}:</strong> ${value}</p>
          `).join('')}
        </div>
        ` : ''}
        
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.slice(0, 1000).map(row => `
              <tr>
                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        ${data.length > 1000 ? `<p><em>Note: Only first 1000 rows shown in PDF export</em></p>` : ''}
        
        <div class="export-info">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Total rows: ${data.length} | Columns: ${headers.length}</p>
        </div>
      </body>
      </html>
    `

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel workbook' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable document format' },
  ]

  return (
    <div className={className}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
            <DialogDescription>
              Configure how you want to export your data ({data.length} rows, {headers.length} columns)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-3">
                {formatOptions.map((format) => {
                  const IconComponent = format.icon
                  return (
                    <Card 
                      key={format.value}
                      className={`cursor-pointer transition-all ${
                        exportOptions.format === format.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as 'csv' | 'xlsx' | 'pdf' }))}
                    >
                      <CardContent className="p-4 text-center">
                        <IconComponent className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <h4 className="font-medium">{format.label}</h4>
                        <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                        {exportOptions.format === format.value && (
                          <Check className="h-4 w-4 text-blue-600 mx-auto mt-2" />
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* File Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={exportOptions.filename}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                  placeholder="export-filename"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={exportOptions.title}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Analysis Results"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={exportOptions.description}
                onChange={(e) => setExportOptions(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description for your export..."
                rows={2}
              />
            </div>

            {/* Column Selection */}
            <div className="space-y-3">
              <Label>Columns to Export</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {headers.map((header) => (
                    <label key={header} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.selectedColumns?.includes(header)}
                        onChange={(e) => {
                          const newColumns = e.target.checked
                            ? [...(exportOptions.selectedColumns || []), header]
                            : exportOptions.selectedColumns?.filter(col => col !== header) || []
                          setExportOptions(prev => ({ ...prev, selectedColumns: newColumns }))
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{header}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setExportOptions(prev => ({ ...prev, selectedColumns: headers }))}
                  className="text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setExportOptions(prev => ({ ...prev, selectedColumns: [] }))}
                  className="text-blue-600 hover:underline"
                >
                  Select None
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Export Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include metadata</span>
                  {metadata && <Badge variant="secondary" className="text-xs">Available</Badge>}
                </label>
                
                {charts.length > 0 && (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCharts}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include charts ({charts.length})</span>
                    <Badge variant="secondary" className="text-xs">PDF only</Badge>
                  </label>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Export Preview</h4>
              <div className="text-sm space-y-1">
                <p><strong>Format:</strong> {formatOptions.find(f => f.value === exportOptions.format)?.label}</p>
                <p><strong>Filename:</strong> {exportOptions.filename}.{exportOptions.format}</p>
                <p><strong>Rows:</strong> {data.length}</p>
                <p><strong>Columns:</strong> {exportOptions.selectedColumns?.length || 0} of {headers.length}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={exporting || !exportOptions.selectedColumns?.length}
            >
              {exporting ? 'Exporting...' : `Export ${formatOptions.find(f => f.value === exportOptions.format)?.label}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
