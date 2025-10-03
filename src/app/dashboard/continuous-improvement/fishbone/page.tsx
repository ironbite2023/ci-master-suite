'use client'

import { GuidedWizard } from '@/components/guided'
import { fishboneConfig } from '@/config/tools/fishbone-config'
import { toast } from 'sonner'

/**
 * Fishbone Diagram - Guided Experience
 * Using the Guided Tools Framework with AI Coach integration
 */

export default function FishboneDiagramPage() {
  const handleComplete = (data: Record<string, unknown>) => {
    // Save to database (to be implemented)
    console.log('Fishbone Diagram Complete:', data)
    
    // Show completion message with summary
    const totalCauses = [
      'machine_causes',
      'method_causes',
      'material_causes',
      'people_causes',
      'measurement_causes',
      'environment_causes'
    ].reduce((sum, key) => {
      const causes = data[key]
      if (Array.isArray(causes)) {
        return sum + causes.length
      }
      return sum
    }, 0)
    
    toast.success(`Fishbone Diagram completed! ${totalCauses} causes identified across all 6M categories.`)
  }

  const handleSave = (data: Record<string, unknown>) => {
    // Optional: Sync to server for backup
    console.log('Auto-saved:', data)
  }

  return (
    <div className="container mx-auto py-8">
      <GuidedWizard
        toolId="fishbone-diagram"
        config={fishboneConfig}
        onComplete={handleComplete}
        onSave={handleSave}
      />
    </div>
  )
}
