'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, AlertCircle, Check, X } from 'lucide-react'
import ExcelJS from 'exceljs'
import Papa from 'papaparse'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface DataImportProps {
  onDataImported: (data: Record<string, unknown>[], headers: string[], metadata: Record<string, unknown>) => void
  acceptedFormats?: string[]
  maxFileSize?: number
  maxRows?: number
  validationSchema?: Record<string, unknown>
  className?: string
}

interface ImportedData {
  headers: string[]
  data: Record<string, unknown>[]
  preview: Record<string, unknown>[]
  metadata: {
    filename: string
    fileSize: number
    rowCount: number
    columnCount: number
    fileType: string
  }
}

export function DataImport({
  onDataImported,
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  maxRows = 1000000,
  validationSchema,
  className = ''
}: DataImportProps) {
  const [importedData, setImportedData] = useState<ImportedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const processFile = useCallback(async (file: File) => {
    setProcessing(true)
    setProgress(0)
    setError(null)
    setValidationErrors([])

    try {
      // File size validation
      if (file.size > maxFileSize) {
        throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${maxFileSize / 1024 / 1024}MB)`)
      }

      setProgress(20)

      const extension = file.name.split('.').pop()?.toLowerCase()
      let data: Record<string, unknown>[] = []
      let headers: string[] = []

      if (extension === 'csv') {
        // Process CSV
        const text = await file.text()
        setProgress(40)
        
        const results = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => {
            // Try to parse numbers
            if (value && !isNaN(Number(value))) {
              return Number(value)
            }
            return value
          }
        })

        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors)
        }

        data = results.data as Record<string, unknown>[]
        headers = results.meta.fields || []
      } else if (['xlsx', 'xls'].includes(extension || '')) {
        // Process Excel
        const buffer = await file.arrayBuffer()
        setProgress(40)
        
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)
        
        const worksheet = workbook.worksheets[0]
        
        // Convert to JSON with header row
        const jsonData: unknown[][] = []
        worksheet.eachRow((row) => {
          const values = row.values as unknown[]
          // ExcelJS row.values includes undefined at index 0, so we slice it
          jsonData.push(values.slice(1))
        })

        if (jsonData.length > 0) {
          headers = (jsonData[0] as string[]).map(header => String(header || ''))
          data = jsonData.slice(1).map((rowArray: unknown[]) => {
            const obj: Record<string, unknown> = {}
            headers.forEach((header, index) => {
              obj[header] = rowArray[index] || null
            })
            return obj
          }).filter(row => Object.values(row).some(value => value !== null && value !== ''))
        }
      } else {
        throw new Error(`Unsupported file format: .${extension}`)
      }

      setProgress(60)

      // Row count validation
      if (data.length > maxRows) {
        throw new Error(`File contains ${data.length} rows, which exceeds the maximum allowed ${maxRows} rows`)
      }

      setProgress(80)

      // Data validation if schema provided
      const errors: string[] = []
      if (validationSchema && data.length > 0) {
        data.forEach((row, index) => {
          try {
            if ('parse' in validationSchema && typeof validationSchema.parse === 'function') {
              validationSchema.parse(row)
            }
          } catch (err) {
            errors.push(`Row ${index + 1}: ${err instanceof Error ? err.message : 'Validation error'}`)
          }
        })
        
        if (errors.length > 0) {
          setValidationErrors(errors.slice(0, 10)) // Show first 10 errors
          if (errors.length > data.length * 0.1) { // More than 10% errors
            throw new Error(`Too many validation errors (${errors.length}). Please check your data format.`)
          }
        }
      }

      setProgress(90)

      const processedData: ImportedData = {
        headers,
        data,
        preview: data.slice(0, 10), // First 10 rows for preview
        metadata: {
          filename: file.name,
          fileSize: file.size,
          rowCount: data.length,
          columnCount: headers.length,
          fileType: extension || 'unknown'
        }
      }

      setImportedData(processedData)
      setProgress(100)

      // Auto-confirm if no validation errors
      if (errors.length === 0) {
        setTimeout(() => {
          onDataImported(data, headers, processedData.metadata)
        }, 500)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setProcessing(false)
    }
  }, [maxFileSize, maxRows, validationSchema, onDataImported])

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
    multiple: false,
    maxSize: maxFileSize
  })

  const handleConfirmImport = () => {
    if (importedData) {
      onDataImported(importedData.data, importedData.headers, importedData.metadata)
    }
  }

  const handleClearData = () => {
    setImportedData(null)
    setError(null)
    setValidationErrors([])
    setProgress(0)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!importedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Import Data
            </CardTitle>
            <CardDescription>
              Upload your data from spreadsheets (CSV, Excel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${processing ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              
              {processing ? (
                <div className="space-y-3">
                  <p className="text-lg font-medium">Processing file...</p>
                  <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-gray-600">{progress}% complete</p>
                </div>
              ) : isDragActive ? (
                <p className="text-lg">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
                  <p className="text-sm text-gray-600">
                    Supports: {acceptedFormats.join(', ')} (max {Math.round(maxFileSize / 1024 / 1024)}MB)
                  </p>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {importedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-600" />
                  Data Preview
                </CardTitle>
                <CardDescription>
                  {importedData.metadata.filename} • {importedData.metadata.rowCount} rows • {importedData.metadata.columnCount} columns
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearData}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* File metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {(importedData.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
              </Badge>
              <Badge variant="secondary">
                .{importedData.metadata.fileType}
              </Badge>
              {validationErrors.length > 0 && (
                <Badge variant="destructive">
                  {validationErrors.length} validation errors
                </Badge>
              )}
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validation Issues Found:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {validationErrors.slice(0, 3).map((error, index) => (
                      <li key={index}>
                        {error}
                      </li>
                    ))}
                    {validationErrors.length > 3 && (
                      <li>... and {validationErrors.length - 3} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Data preview table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      {importedData.headers.map((header, index) => (
                        <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {header || `Column ${index + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importedData.preview.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500 font-medium">{rowIndex + 1}</td>
                        {importedData.headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-3 py-2">
                            {row[header] !== null && row[header] !== undefined 
                              ? String(row[header]) 
                              : <span className="text-gray-400">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {importedData.data.length > 10 && (
                <div className="px-3 py-2 bg-gray-50 border-t text-sm text-gray-600">
                  Showing first 10 of {importedData.data.length} rows
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                {validationErrors.length > 0 
                  ? 'You can still import the data, but some rows may have issues.'
                  : 'Data looks good! Ready to import.'
                }
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClearData}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmImport}>
                  {validationErrors.length > 0 ? 'Import Anyway' : 'Confirm Import'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
