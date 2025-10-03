# 📘 Guided Tools Framework - Quick Reference

## 🚀 Quick Start

### 1. Import Components
```typescript
import { GuidedWizard } from '@/components/guided'
import { ToolConfiguration } from '@/types/guided-tools'
```

### 2. Create Configuration
```typescript
const myToolConfig: ToolConfiguration = {
  id: 'my-tool',
  name: 'My Tool Name',
  description: 'Brief description',
  category: 'continuous-improvement',
  difficulty: 'beginner',
  estimatedTime: '15-20 minutes',
  introduction: { /* ... */ },
  steps: [ /* ... */ ],
  nextSteps: [ /* ... */ ],
  relatedTools: ['tool-1', 'tool-2']
}
```

### 3. Use in Page
```typescript
export default function MyToolPage() {
  return (
    <GuidedWizard
      toolId="my-tool"
      config={myToolConfig}
      onComplete={(data) => console.log('Complete!', data)}
      onSave={(data) => console.log('Saved!', data)}
    />
  )
}
```

---

## 📦 Component Imports

```typescript
// All guided components
import {
  GuidedWizard,      // Main orchestrator
  ProgressMap,       // Step visualization
  GuidePanel,        // Contextual help sidebar
  QuestionCard,      // Smart question input
  ExampleModal,      // Example browser
  CompletionSummary  // Success screen
} from '@/components/guided'

// Types
import {
  ToolConfiguration,
  StepConfiguration,
  QuestionConfiguration,
  StepGuidance
} from '@/types/guided-tools'

// Utilities
import {
  validateQuestion,
  validateStep,
  saveToLocalStorage,
  trackStepViewed
} from '@/lib/guided-tools'
```

---

## 🎯 Question Types Reference

### Text Inputs
```typescript
{ type: 'short-text', /* ... */ }    // Single line
{ type: 'long-text', /* ... */ }     // Multi-line textarea
{ type: 'email', /* ... */ }         // Email validation
{ type: 'url', /* ... */ }           // URL validation
{ type: 'phone', /* ... */ }         // Phone number
```

### Numbers
```typescript
{ type: 'number', /* ... */ }        // Integer
{ type: 'decimal', /* ... */ }       // Float with decimals
{ type: 'percentage', /* ... */ }    // 0-100 with % suffix
{ type: 'currency', /* ... */ }      // Money with $ prefix
```

### Date/Time
```typescript
{ type: 'date', /* ... */ }          // Date picker
{ type: 'time', /* ... */ }          // Time picker
{ type: 'datetime', /* ... */ }      // Date + Time
```

### Selection
```typescript
{ type: 'single-select', /* ... */ } // Dropdown
{ type: 'multi-select', /* ... */ }  // Checkboxes
{ type: 'boolean', /* ... */ }       // Yes/No radio
{ type: 'rating', /* ... */ }        // Star rating
{ type: 'scale', /* ... */ }         // Slider (0-10)
```

### Advanced
```typescript
{ type: 'table', /* ... */ }         // Data grid
{ type: 'file-upload', /* ... */ }   // File input
{ type: 'color-picker', /* ... */ }  // Color selector
{ type: 'location', /* ... */ }      // Map picker
```

---

## 📝 Configuration Templates

### Minimal Question
```typescript
{
  id: 'my_question',
  text: 'What is your question?',
  type: 'short-text',
  required: true,
  inputConfig: {}
}
```

### Question with Validation
```typescript
{
  id: 'problem_statement',
  text: 'Describe the problem',
  type: 'long-text',
  required: true,
  helpText: 'Be specific and include measurable details',
  placeholder: 'Example: Production line stopped...',
  validation: {
    required: true,
    minLength: 20,
    maxLength: 500
  },
  inputConfig: {
    maxLength: 500,
    rows: 4
  }
}
```

### Question with Hints & Examples
```typescript
{
  id: 'root_cause',
  text: 'What is the root cause?',
  type: 'long-text',
  required: true,
  
  hints: [
    {
      id: 'hint-1',
      title: 'Go Deep',
      content: 'Ask "why" at least 5 times',
      triggerCondition: { showOnLoad: true }
    }
  ],
  
  examples: [
    {
      id: 'ex-1',
      title: 'Manufacturing Example',
      description: 'Quality issue',
      value: 'Inadequate training on new equipment',
      difficulty: 'beginner',
      industry: 'Manufacturing',
      useCase: 'Quality Control',
      isTemplate: false
    }
  ],
  
  inputConfig: { maxLength: 300 }
}
```

### Select Question with Options
```typescript
{
  id: 'impact_level',
  text: 'What is the impact level?',
  type: 'single-select',
  required: true,
  
  inputConfig: {
    options: [
      {
        value: 'critical',
        label: 'Critical',
        description: 'Immediate action required',
        icon: '🔴'
      },
      {
        value: 'high',
        label: 'High',
        description: 'Address within 24 hours',
        icon: '🟠'
      },
      {
        value: 'medium',
        label: 'Medium',
        description: 'Address within week',
        icon: '🟡'
      }
    ]
  }
}
```

---

## 🎨 Step Configuration

### Basic Step
```typescript
{
  id: 'step-1',
  stepNumber: 1,
  title: 'Define Problem',
  description: 'Clearly state the problem',
  optional: false,
  
  questions: [
    // Array of QuestionConfiguration
  ],
  
  guidance: {
    introduction: 'Let\'s start by defining the problem...',
    tips: [],
    warnings: [],
    bestPractices: []
  },
  
  validation: {
    requiredQuestions: ['question_id_1', 'question_id_2'],
    allowSkip: false
  }
}
```

### Step with Rich Guidance
```typescript
{
  id: 'step-2',
  stepNumber: 2,
  title: 'Analyze Root Cause',
  description: 'Dig deep to find the real cause',
  optional: false,
  
  questions: [ /* ... */ ],
  
  guidance: {
    introduction: 'Now we\'ll use the 5 Why technique...',
    
    tips: [
      {
        id: 'tip-1',
        title: 'Keep Asking Why',
        content: 'Don\'t stop at the first answer',
        importance: 'high'
      }
    ],
    
    warnings: [
      {
        id: 'warn-1',
        title: 'Avoid Blame',
        content: 'Focus on processes, not people',
        severity: 'medium'
      }
    ],
    
    bestPractices: [
      {
        id: 'bp-1',
        title: 'Cross-functional Team',
        description: 'Include diverse perspectives',
        example: 'Operations + Quality + Maintenance'
      }
    ],
    
    resources: [
      {
        id: 'res-1',
        title: '5 Why Guide',
        type: 'video',
        url: '/videos/five-why.mp4',
        duration: 5
      }
    ]
  },
  
  validation: {
    requiredQuestions: ['why_1', 'why_2', 'why_3'],
    customValidator: 'atLeastFiveWhys'
  }
}
```

---

## 🔧 Common Patterns

### Conditional Questions
```typescript
{
  id: 'follow_up',
  text: 'Please explain',
  type: 'long-text',
  required: false,
  conditionalLogic: {
    showIf: {
      questionId: 'previous_answer',
      operator: 'equals',
      value: 'yes'
    }
  }
}
```

### Number with Range
```typescript
{
  id: 'temperature',
  text: 'Operating temperature',
  type: 'number',
  required: true,
  inputConfig: {
    min: 0,
    max: 100,
    suffix: '°C',
    step: 0.1
  },
  validation: {
    min: 0,
    max: 100
  }
}
```

### Multi-Select with Checkboxes
```typescript
{
  id: 'affected_areas',
  text: 'Which areas are affected?',
  type: 'multi-select',
  required: true,
  inputConfig: {
    options: [
      { value: 'quality', label: 'Quality' },
      { value: 'delivery', label: 'Delivery' },
      { value: 'cost', label: 'Cost' },
      { value: 'safety', label: 'Safety' }
    ]
  }
}
```

---

## 💾 Data Persistence

### Auto-Save (Built-in)
```typescript
// Automatically saves every 2 seconds to LocalStorage
// No additional code needed
```

### Manual Save
```typescript
import { saveToLocalStorage } from '@/lib/guided-tools/storage'

const handleSave = (data: Record<string, unknown>) => {
  saveToLocalStorage('my-tool', data)
}
```

### Load Saved Data
```typescript
import { loadFromLocalStorage } from '@/lib/guided-tools/storage'

const savedData = loadFromLocalStorage('my-tool')
```

### Export to JSON
```typescript
import { exportSessionAsJson } from '@/lib/guided-tools/storage'

const handleExport = () => {
  exportSessionAsJson('my-tool', completedData, 'my-analysis.json')
}
```

---

## 📊 Analytics Tracking

### Built-in Tracking (Automatic)
- ✅ Step views
- ✅ Step completions
- ✅ Time spent per step
- ✅ Validation failures

### Manual Tracking
```typescript
import { trackEvent } from '@/lib/guided-tools/analytics'

trackEvent({
  userId: 'user-123',
  eventType: 'custom_action',
  timestamp: new Date(),
  metadata: { key: 'value' }
})
```

---

## 🎨 Styling & Customization

### Tailwind Classes
All components use standard Tailwind classes. Override by:

```typescript
// In your component
<GuidedWizard
  className="custom-wizard-styles"
  // ...
/>
```

### Custom Colors
Define in your Tailwind config:
```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'guided': {
        primary: '#1E40AF',
        success: '#10B981',
        warning: '#F59E0B'
      }
    }
  }
}
```

---

## ✅ Validation Patterns

### Required Field
```typescript
validation: {
  required: true
}
```

### Length Constraints
```typescript
validation: {
  minLength: 10,
  maxLength: 500
}
```

### Number Range
```typescript
validation: {
  min: 0,
  max: 100
}
```

### Regex Pattern
```typescript
validation: {
  pattern: /^[A-Z]{3}-\d{4}$/,
  errorMessage: 'Format: ABC-1234'
}
```

### Custom Validator
```typescript
validation: {
  customValidator: (value, allData) => {
    if (/* custom logic */) {
      return { isValid: true }
    }
    return {
      isValid: false,
      errors: ['Custom error message']
    }
  }
}
```

---

## 🚨 Error Handling

### Validation Errors
```typescript
// Automatically shown by QuestionCard
// Red alert below the input with error message
```

### Toast Notifications
```typescript
import { toast } from 'sonner'

toast.error('Please fix the errors')
toast.success('Step completed!')
toast.info('Auto-saved')
```

---

## 📱 Responsive Design

All components are mobile-responsive:
- Desktop: 3-column layout (content + guide panel)
- Tablet: 2-column layout
- Mobile: Single column, stacked

No additional configuration needed.

---

## 🔍 Testing Your Configuration

### 1. Type Check
```bash
npm run build
```

### 2. Visual Test
```typescript
// Create test page in development
export default function TestPage() {
  return <GuidedWizard toolId="test" config={myConfig} />
}
```

### 3. Validate Data Structure
```typescript
import { validateStep } from '@/lib/guided-tools/validation'

const result = validateStep(step, stepData, allData)
console.log(result.isValid, result.errors)
```

---

## 📚 Learning Resources

### Files to Reference
- `src/types/guided-tools.ts` - All interfaces
- `src/components/guided/GuidedWizard.tsx` - Main component
- `GUIDED_TOOLS_SESSION_2_COMPLETE.md` - Full documentation

### Example Configurations
- See Session 2 Complete doc for full 5 Why example
- Check existing tools in `src/app/dashboard/`

---

## 🆘 Common Issues

### "Type error in config"
✅ Check interface in `src/types/guided-tools.ts`
✅ Ensure all required fields are present

### "Question not rendering"
✅ Verify question type is in QuestionCard switch
✅ Check inputConfig matches question type

### "Validation not working"
✅ Ensure validation object is complete
✅ Check requiredQuestions array in step

### "Auto-save not triggering"
✅ Auto-save works automatically every 2 seconds
✅ Check browser console for errors

---

## 🎯 Next Steps

1. ✅ Read `GUIDED_TOOLS_SESSION_2_COMPLETE.md` for full details
2. ✅ Copy the 5 Why example configuration
3. ✅ Customize for your specific tool
4. ✅ Test in development
5. ✅ Deploy when ready

---

**Quick Help**: For detailed examples and full documentation, see:
- `GUIDED_TOOLS_SESSION_2_COMPLETE.md` (Comprehensive guide)
- `src/types/guided-tools.ts` (All TypeScript interfaces)
- `src/components/guided/` (Component implementations)

Happy building! 🚀
