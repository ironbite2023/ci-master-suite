# Complete Guided Tools Migration - Master Plan

**Created**: October 3, 2025  
**Status**: PLANNING PHASE  
**Scope**: Migrate 21 tools to Guided Framework + Centralized Guidance Library

---

## 🎯 Executive Summary

This plan outlines the complete migration of **21 tools** across Continuous Improvement, Lean Manufacturing, and Six Sigma to use:
1. **Guided Wizard Framework** - Step-by-step user experience
2. **Centralized Guidance Library** - Reusable tips, warnings, best practices

### Current Status
- ✅ **Guidance Library**: Complete (73 items, 1,113 lines)
- ✅ **Framework Components**: Complete (GuidedWizard, GuidePanel, etc.)
- ✅ **2 Tools Migrated**: Five Why & Fishbone
- ❌ **19 Tools Remaining**: Need conversion

---

## 📊 Tool Inventory & Prioritization

### Priority 1: High-Impact CI Tools (5 tools) ⭐⭐⭐
**Why First?** Most used, highest ROI, similar structure to completed tools

1. **A3 Problem Solving** - Complex, 8-step structured approach
2. **PDCA Cycle** - Core methodology, 4-step iterative process
3. **Pareto Analysis** - Data-driven, visual output
4. **Kaizen Events** - Team-based, event planning
5. **Gemba Walk** - Observation-based, checklist style

**Estimated Time**: 15-20 hours  
**Estimated Guidance Items Needed**: 20-30 new items

---

### Priority 2: Essential Lean Tools (4 tools) ⭐⭐
**Why Second?** Foundation for manufacturing operations, visual tools

6. **Value Stream Mapping (VSM)** - Process mapping, complex workflow
7. **5S Audit** - Checklist-based, scoring system
8. **OEE Calculator** - Calculation-heavy, data input focus
9. **Kanban Designer** - Board configuration, visual design

**Estimated Time**: 12-15 hours  
**Estimated Guidance Items Needed**: 15-20 new items

---

### Priority 3: Core Six Sigma Tools (4 tools) ⭐⭐
**Why Third?** Statistical foundation, technical users

10. **DMAIC** - 5-phase methodology, comprehensive
11. **Process Capability (Cp/Cpk)** - Statistical calculations
12. **SPC Charts** - Control chart configuration
13. **FMEA** - Risk assessment, matrix-based

**Estimated Time**: 15-18 hours  
**Estimated Guidance Items Needed**: 25-30 new items

---

### Priority 4: Advanced Six Sigma Tools (3 tools) ⭐
**Why Later?** Advanced users, complex statistical concepts

14. **Hypothesis Testing** - Statistical inference
15. **DOE (Design of Experiments)** - Experimental design
16. **MSA (Measurement System Analysis)** - Gage R&R studies

**Estimated Time**: 12-15 hours  
**Estimated Guidance Items Needed**: 20-25 new items

---

### Priority 5: Specialized Tools (5 tools) ⭐
**Why Last?** Lower usage, simpler scope, or already functional

17. **Takt Time Calculator** - Simple calculation
18. **Poka-Yoke Designer** - Error-proofing design
19. **Suggestions System** - Form-based submission
20. **Work Sampling** - Time study tool
21. **Spaghetti Diagram** - Movement tracking

**Estimated Time**: 8-10 hours  
**Estimated Guidance Items Needed**: 10-15 new items

---

## 🏗️ Implementation Strategy

### Phase 1: Expand Guidance Library (2-3 hours)
**Goal**: Add domain-specific guidance for Lean and Six Sigma tools

#### New Guidance Categories Needed

**Lean Manufacturing** (20 items)
```typescript
// Tips
LEAN_VISUALIZE_FLOW
LEAN_ELIMINATE_WASTE
LEAN_STANDARDIZE_WORK
LEAN_CONTINUOUS_FLOW

// Warnings
LEAN_DONT_OVER_AUTOMATE
LEAN_AVOID_BATCH_THINKING

// Best Practices
LEAN_VALUE_STREAM_FIRST
LEAN_PULL_NOT_PUSH
LEAN_LEVEL_WORKLOAD

// Common Mistakes
LEAN_IMPLEMENTING_LEAN_TOOLS_WITHOUT_CULTURE
LEAN_IGNORING_PEOPLE_SIDE
```

**Six Sigma Statistics** (25 items)
```typescript
// Tips
STATS_CHECK_NORMALITY
STATS_VERIFY_INDEPENDENCE
STATS_UNDERSTAND_VARIATION

// Warnings
STATS_DONT_CONFUSE_CORRELATION_CAUSATION
STATS_AVOID_P_HACKING

// Best Practices
STATS_USE_CONTROL_CHARTS_BEFORE_CAPABILITY
STATS_DOCUMENT_ASSUMPTIONS

// Common Mistakes
STATS_USING_CAPABILITY_ON_UNSTABLE_PROCESS
STATS_IGNORING_SPECIAL_CAUSES
```

**Visual Tools** (15 items)
```typescript
// Tips
VISUAL_USE_COLOR_WISELY
VISUAL_LABEL_CLEARLY
VISUAL_SHOW_SCALE

// Best Practices
VISUAL_PARETO_FOR_PRIORITIZATION
VISUAL_VSM_CURRENT_STATE_FIRST
```

#### Files to Create
- `src/lib/guidance/lean.ts` (300+ lines)
- `src/lib/guidance/statistics.ts` (400+ lines)
- `src/lib/guidance/visual-tools.ts` (250+ lines)
- Update `src/lib/guidance/index.ts` to export new items

---

### Phase 2: Tool-by-Tool Conversion Process

#### Step 1: Analysis (30 min per tool)
Read existing tool implementation and document:
1. **Current functionality** - What does it do?
2. **User inputs** - What data is collected?
3. **Logical flow** - What's the sequence?
4. **Outputs** - What results are generated?
5. **Pain points** - What's confusing or difficult?

#### Step 2: Design Config Structure (1 hour per tool)
Create the step-by-step configuration:
1. **Break into logical steps** (3-8 steps ideal)
2. **Define questions per step** (2-6 questions per step)
3. **Map guidance to each step** (from centralized library)
4. **Design examples** (2-4 examples per key question)
5. **Define validation rules** (prevent errors early)

#### Step 3: Create Tool Config File (2-3 hours per tool)
Build the configuration file:
```typescript
// Example: src/config/tools/a3-problem-solving-config.ts
import { ToolConfiguration } from '@/types/guided-tools'
import { 
  PROBLEM_BE_SPECIFIC,
  DATA_COLLECT_BASELINE,
  // ... other guidance items
} from '@/lib/guidance'

export const a3Config: ToolConfiguration = {
  id: 'a3-problem-solving',
  name: 'A3 Problem Solving',
  description: 'Structured problem-solving on a single A3-sized page',
  category: 'continuous-improvement',
  difficulty: 'intermediate',
  estimatedTime: '30-45 minutes',
  version: '1.0.0',
  
  introduction: {
    title: 'Welcome to A3 Problem Solving',
    description: '...',
    whenToUse: [...],
    whenNotToUse: [...],
    prerequisites: [...],
    expectedOutcomes: [...]
  },
  
  steps: [
    {
      id: 'step-1-background',
      stepNumber: 1,
      title: 'Background',
      description: 'Set the context and business case',
      questions: [
        {
          id: 'background_context',
          text: 'What is the background of this problem?',
          type: 'long-text',
          required: true,
          helpText: '...',
          placeholder: '...',
          hints: [...],
          examples: [...],
          validation: [...]
        }
      ],
      guidance: {
        tips: [PROBLEM_BE_SPECIFIC, PROBLEM_USE_DATA],
        warnings: [PROBLEM_DONT_SKIP],
        bestPractices: [PROBLEM_USE_DATA_DRIVEN],
        commonMistakes: [PROBLEM_TOO_VAGUE],
        resources: [PROBLEM_SMART_GOALS]
      }
    },
    // ... more steps
  ]
}
```

#### Step 4: Update Tool Page (30 min per tool)
Replace page implementation:
```typescript
// Example: src/app/dashboard/continuous-improvement/a3/page.tsx
'use client'

import { GuidedWizard } from '@/components/guided'
import { a3Config } from '@/config/tools/a3-problem-solving-config'
import { toast } from 'sonner'

export default function A3ProblemSolvingPage() {
  const handleComplete = (data: Record<string, unknown>) => {
    console.log('A3 Complete:', data)
    toast.success('A3 Problem Solving completed successfully!')
    // TODO: Save to database
  }

  const handleSave = (data: Record<string, unknown>) => {
    console.log('Auto-saved:', data)
  }

  return (
    <div className="container mx-auto py-8">
      <GuidedWizard
        toolId="a3-problem-solving"
        config={a3Config}
        onComplete={handleComplete}
        onSave={handleSave}
      />
    </div>
  )
}
```

#### Step 5: Test & Refine (30 min per tool)
1. Load tool in browser
2. Complete full workflow
3. Test validation rules
4. Verify guidance displays correctly
5. Test save/restore functionality
6. Fix any issues

---

## 📁 File Structure for Each Tool

### Config File Location
```
src/config/tools/
├── continuous-improvement/
│   ├── a3-problem-solving-config.ts
│   ├── pdca-cycle-config.ts
│   ├── kaizen-event-config.ts
│   ├── gemba-walk-config.ts
│   ├── pareto-analysis-config.ts
│   └── suggestions-config.ts
├── lean/
│   ├── vsm-config.ts
│   ├── five-s-audit-config.ts
│   ├── oee-calculator-config.ts
│   ├── kanban-designer-config.ts
│   ├── poka-yoke-config.ts
│   └── takt-time-config.ts
├── six-sigma/
│   ├── dmaic-config.ts
│   ├── process-capability-config.ts
│   ├── spc-charts-config.ts
│   ├── fmea-config.ts
│   ├── hypothesis-testing-config.ts
│   ├── doe-config.ts
│   └── msa-config.ts
├── fishbone-config.ts (existing)
└── five-why-config.ts (existing)
```

### Page File Updates
Each tool's `page.tsx` gets simplified to ~40 lines using `GuidedWizard`

---

## 🎨 Tool Configuration Templates by Type

### Template 1: Analysis Tools (A3, Five Why, Fishbone)
**Structure**: Problem → Data → Analysis → Root Cause → Solutions → Plan
**Steps**: 6-8 steps
**Key Features**: 
- Heavy use of long-text questions
- Multiple examples per question
- Data collection emphasis
- Root cause verification

### Template 2: Calculation Tools (OEE, Capability, Takt Time)
**Structure**: Input Parameters → Calculate → Interpret Results
**Steps**: 3-5 steps
**Key Features**:
- Number inputs with validation
- Formula display
- Result interpretation guidance
- Threshold warnings

### Template 3: Checklist/Audit Tools (5S, Gemba, FMEA)
**Structure**: Setup → Evaluate Items → Score → Action Items
**Steps**: 4-6 steps
**Key Features**:
- Multi-select questions
- Scoring systems
- Rating scales
- Conditional questions

### Template 4: Design/Planning Tools (VSM, Kanban, Poka-Yoke)
**Structure**: Current State → Analysis → Future State → Implementation
**Steps**: 4-7 steps
**Key Features**:
- Visual component integration
- Drag-and-drop (where applicable)
- Multi-step design process
- Comparison views

### Template 5: Statistical Tools (Hypothesis Testing, DOE, MSA)
**Structure**: Assumptions → Data → Analysis → Interpretation
**Steps**: 5-8 steps
**Key Features**:
- Statistical validation
- Assumption checking
- Visual results (charts)
- Interpretation guidance

---

## 💡 Best Practices & Quality Standards

### Content Quality
1. **Be Specific**: Every question should have clear, measurable expectations
2. **Provide Examples**: Minimum 2 examples per critical question
3. **Progressive Disclosure**: Show hints/tips based on user progress
4. **Validate Early**: Catch errors immediately, not at submission
5. **Guide, Don't Lecture**: Tips should be 1-2 sentences max

### Guidance Selection Criteria
1. **Relevance**: Only include guidance directly applicable to the step
2. **Diversity**: Mix tips (positive), warnings (negative), best practices (expert)
3. **Priority**: High-priority items first, low-priority last
4. **Consistency**: Same guidance across similar steps in different tools

### User Experience
1. **Estimated Time**: Be realistic (test with real users)
2. **When (Not) To Use**: Help users self-select appropriate tools
3. **Prerequisites**: List what they need before starting
4. **Auto-Save**: Every 30 seconds or on step change
5. **Progress Indication**: Clear visual progress through steps

### Technical Quality
1. **Type Safety**: 100% TypeScript, no `any` types
2. **Validation**: Use Zod schemas where complex validation needed
3. **Error Handling**: Graceful degradation, user-friendly messages
4. **Performance**: Lazy load examples, debounce auto-save
5. **Accessibility**: ARIA labels, keyboard navigation, screen reader support

---

## 📈 Success Metrics

### Quantitative
- **Code Reduction**: Target 85-95% reduction in page.tsx files
- **Guidance Reuse**: Target 70%+ of guidance from centralized library
- **Type Safety**: 100% TypeScript compliance
- **Test Coverage**: Each tool tested end-to-end
- **Performance**: < 2s initial load, < 500ms step transitions

### Qualitative
- **User Feedback**: "This guides me through the process clearly"
- **Consistency**: "All tools work the same way"
- **Learning**: "I learned something new from the tips"
- **Confidence**: "I trust I'm doing this correctly"
- **Efficiency**: "This is faster than the old way"

---

## 🚀 Execution Plan

### Sprint 1: Priority 1 Tools (Week 1-2)
- **Day 1-2**: Expand guidance library (Lean + Stats categories)
- **Day 3-4**: A3 Problem Solving + PDCA Cycle
- **Day 5-6**: Pareto Analysis + Kaizen Events
- **Day 7-8**: Gemba Walk + Testing/Refinement
- **Deliverable**: 5 high-impact CI tools complete

### Sprint 2: Priority 2 Tools (Week 3)
- **Day 1-2**: VSM + 5S Audit
- **Day 3-4**: OEE Calculator + Kanban Designer
- **Day 5**: Testing/Refinement
- **Deliverable**: 4 essential Lean tools complete

### Sprint 3: Priority 3 Tools (Week 4)
- **Day 1-2**: DMAIC + Process Capability
- **Day 3-4**: SPC Charts + FMEA
- **Day 5**: Testing/Refinement
- **Deliverable**: 4 core Six Sigma tools complete

### Sprint 4: Priority 4-5 Tools (Week 5)
- **Day 1-2**: Hypothesis Testing + DOE + MSA
- **Day 3-4**: Remaining 5 specialized tools
- **Day 5**: Final testing, documentation, deployment prep
- **Deliverable**: All 21 tools complete

---

## 📋 Detailed Task Checklist

### Pre-Work (Before Starting Each Tool)
- [ ] Review existing tool implementation
- [ ] Document current user flow
- [ ] Identify reusable guidance from library
- [ ] Identify new guidance needed
- [ ] Sketch step structure (on paper/whiteboard)

### During Development
- [ ] Create tool config file
- [ ] Write introduction section
- [ ] Define steps and questions
- [ ] Add validation rules
- [ ] Map guidance to each step
- [ ] Create examples (minimum 2 per key question)
- [ ] Update page.tsx to use GuidedWizard
- [ ] Test in browser
- [ ] Refine based on testing

### After Development
- [ ] Code review (if team)
- [ ] User testing (if possible)
- [ ] Update documentation
- [ ] Add to tool index
- [ ] Deploy to staging
- [ ] Final QA
- [ ] Deploy to production

---

## 🛠️ Technical Implementation Details

### Database Integration (Future)
Each tool will save to a unified schema:
```sql
CREATE TABLE tool_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tool_id VARCHAR(100), -- e.g., 'a3-problem-solving'
  session_data JSONB, -- All user inputs
  status VARCHAR(20), -- 'in-progress', 'completed'
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_tool_sessions_user_tool ON tool_sessions(user_id, tool_id);
CREATE INDEX idx_tool_sessions_status ON tool_sessions(status);
```

### Analytics Integration
Track key events:
- Tool started
- Step completed
- Question answered
- Guidance item viewed
- Hint triggered
- Example viewed
- Validation error
- Tool completed
- Tool abandoned

### Export Functionality
Each tool should support:
- **PDF Export**: Formatted report with all inputs and results
- **JSON Export**: Raw data for backup/import
- **CSV Export**: Data in tabular format (where applicable)

---

## 💰 Estimated Effort Summary

| Phase | Tools | Hours | Complexity |
|-------|-------|-------|------------|
| Guidance Library Expansion | - | 2-3h | Medium |
| Priority 1 (CI Tools) | 5 | 15-20h | Medium-High |
| Priority 2 (Lean Tools) | 4 | 12-15h | Medium |
| Priority 3 (Six Sigma Core) | 4 | 15-18h | High |
| Priority 4 (Six Sigma Advanced) | 3 | 12-15h | High |
| Priority 5 (Specialized) | 5 | 8-10h | Low-Medium |
| **TOTAL** | **21** | **64-81 hours** | - |

**Timeline**: 4-5 weeks (full-time) or 8-10 weeks (part-time)

---

## 🎯 Key Decisions to Make

### 1. Visual Components
**Question**: Do visual tools (VSM, Fishbone, Spaghetti) get custom visualization in guided wizard?
- **Option A**: Integrate visual editors into wizard steps
- **Option B**: Link to separate visual tool after data collection
- **Recommendation**: Option B for MVP, Option A for v2

### 2. Calculation Tools
**Question**: How do calculation-heavy tools (OEE, Capability, DOE) display results?
- **Option A**: Show live calculations as user types
- **Option B**: Calculate on step completion
- **Recommendation**: Option A for simple calcs, Option B for complex

### 3. Existing Data
**Question**: What happens to data from old tool implementations?
- **Option A**: Migration scripts to new format
- **Option B**: Keep old data, new sessions use new format
- **Recommendation**: Option B (less risk, faster)

### 4. Mobile Experience
**Question**: Should guided wizards be optimized for mobile?
- **Option A**: Full mobile optimization
- **Option B**: Desktop-first, mobile-friendly
- **Recommendation**: Option B (most users on desktop for CI tools)

---

## 📚 Documentation Deliverables

1. **User Guide**: How to use guided tools (per tool)
2. **Developer Guide**: How to create new guided tools
3. **Guidance Library Reference**: All available guidance items
4. **Migration Guide**: For users transitioning from old to new
5. **Video Tutorials**: Screen recordings of each tool (optional)

---

## ✅ Definition of Done (Per Tool)

A tool is considered "complete" when:
- [ ] Config file created with full structure
- [ ] All steps have guidance mapped from library
- [ ] Minimum 2 examples per critical question
- [ ] All validation rules implemented
- [ ] Page.tsx updated to use GuidedWizard
- [ ] Tool loads without errors
- [ ] Full workflow tested end-to-end
- [ ] Guidance panel displays correctly
- [ ] Auto-save functionality works
- [ ] Mobile-friendly (responsive)
- [ ] Documentation updated
- [ ] Peer review completed (if team)

---

## 🎉 Success Vision

**When Complete, Users Will:**
- Start any CI/Lean/Six Sigma tool and immediately understand what to do
- Feel guided and supported at every step
- Learn best practices naturally through embedded guidance
- Complete tools faster with higher quality outputs
- Experience consistency across all 21 tools
- Have confidence they're doing it "the right way"

**Developers Will:**
- Build new tools 10x faster using framework + library
- Maintain tools easily with centralized guidance
- Onboard new team members quickly
- Have full type safety and test coverage

---

## 📞 Next Steps

1. **Review & Approve This Plan**
2. **Prioritize Sprint 1 Tools** (if different from proposed)
3. **Allocate Resources** (developer time)
4. **Set Milestones** (weekly check-ins)
5. **Begin Execution** 🚀

---

*This is a living document. Update as priorities or requirements change.*
