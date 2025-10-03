'use client'

import { GuidedWizard } from '@/components/guided'
import { fiveWhyConfig } from '@/config/tools/five-why-config'
import { toast } from 'sonner'

/**
 * 5 Why Analysis - Guided Experience
 * Using the new Guided Tools Framework
 */

export default function FiveWhyAnalysisPage() {
  const handleComplete = (data: Record<string, unknown>) => {
    // Save to database (to be implemented)
    console.log('5 Why Analysis Complete:', data)
    
    // Show success message
    toast.success('5 Why Analysis completed successfully!')
    
    // Optional: Navigate to results page or dashboard
    // router.push('/dashboard/continuous-improvement')
  }

  const handleSave = (data: Record<string, unknown>) => {
    // Optional: Sync to server for backup
    console.log('Auto-saved:', data)
  }

  return (
    <div className="container mx-auto py-8">
      <GuidedWizard
        toolId="five-why-analysis"
        config={fiveWhyConfig}
        onComplete={handleComplete}
        onSave={handleSave}
      />
    </div>
  )
}
