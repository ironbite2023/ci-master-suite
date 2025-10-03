# Foundation Belt Template Specifications

## Overview

This document provides detailed specifications for creating 10 professional templates to support Foundation Belt learning and application. Each template includes layout instructions, formatting guidelines, formulas (where applicable), and usage instructions.

---

## Template 1: CI Culture Assessment Scorecard

**Course:** Course 1 - CI Foundations & Culture  
**Format:** Excel (.xlsx)  
**Purpose:** Assess organizational CI culture maturity across 8 principles  
**Estimated Build Time:** 2-3 hours

### Worksheet Structure

**Sheet 1: Assessment Dashboard**

#### Layout

**Row 1-3: Header Section**
- Merge A1:H1, Center align, Font: Arial 18pt Bold, Fill: Blue (#1E40AF)
- Text: "Continuous Improvement Culture Assessment"
- Merge A2:H2, Center align, Font: Arial 12pt
- Text: "8 Principles Scorecard"
- A3:H3 empty (spacing)

**Row 4-5: Instructions**
- Merge A4:H4, Font: Arial 10pt, Fill: Light Gray (#F3F4F6)
- Text: "Instructions: Rate your organization on each principle using a scale of 1-5, where 1 = Not Present, 2 = Rarely Evident, 3 = Sometimes Evident, 4 = Usually Evident, 5 = Consistently Demonstrated"
- Row 5 empty (spacing)

**Row 6: Column Headers**
- A6: "Principle" (Bold, 11pt, Fill: Gray #D1D5DB)
- B6: "Definition" (Bold, 11pt, Fill: Gray #D1D5DB)
- C6: "Score (1-5)" (Bold, 11pt, Fill: Gray #D1D5DB)
- D6: "Evidence/Examples" (Bold, 11pt, Fill: Gray #D1D5DB)
- E6: "Strengths" (Bold, 11pt, Fill: Gray #D1D5DB)
- F6: "Gaps" (Bold, 11pt, Fill: Gray #D1D5DB)
- G6: "Priority for Improvement" (Bold, 11pt, Fill: Gray #D1D5DB)
- H6: "Action Ideas" (Bold, 11pt, Fill: Gray #D1D5DB)

**Row 7-14: 8 Principles Assessment**

| Row | A - Principle | B - Definition | C - Score | D-H - Assessment Fields |
|-----|---------------|----------------|-----------|-------------------------|
| 7 | Customer Focus | All improvement efforts aim to increase customer value | Data validation dropdown (1-5) | Text fields for detailed assessment |
| 8 | Respect for People | People are valued, their ideas matter, psychological safety exists | Data validation dropdown (1-5) | Text fields |
| 9 | Process Thinking | Problems viewed as process issues, not personal failures | Data validation dropdown (1-5) | Text fields |
| 10 | Data-Driven Decisions | Decisions based on facts and analysis, not opinions | Data validation dropdown (1-5) | Text fields |
| 11 | Continuous Learning | Mistakes are learning opportunities, experimentation encouraged | Data validation dropdown (1-5) | Text fields |
| 12 | Leadership Commitment | Leaders visibly participate in and support improvement | Data validation dropdown (1-5) | Text fields |
| 13 | Teamwork & Collaboration | Cross-functional collaboration, shared problem-solving | Data validation dropdown (1-5) | Text fields |
| 14 | Persistence & Patience | Long-term commitment, understanding that culture change takes years | Data validation dropdown (1-5) | Text fields |

**Row 15: Empty (spacing)**

**Row 16-20: Summary Section**
- A16: "TOTAL SCORE" (Bold, 12pt)
- C16: Formula: `=SUM(C7:C14)` (Bold, 12pt, Fill: Light Blue #DBEAFE)
- A17: "AVERAGE SCORE" (Bold, 12pt)
- C17: Formula: `=AVERAGE(C7:C14)` (Bold, 12pt, Fill: Light Blue #DBEAFE, Number format: 0.0)
- A18: "MATURITY LEVEL" (Bold, 12pt)
- C18: Formula: `=IF(C17<1.5,"Pre-CI Stage",IF(C17<2.5,"Awareness Stage",IF(C17<3.5,"Developing Stage",IF(C17<4.5,"Practicing Stage","Sustaining Stage"))))` (Bold, 12pt, Fill: conditional formatting)

**Row 21-25: Maturity Level Guide**
- A21: "Maturity Level Guide:" (Bold, 11pt, Fill: Light Gray)
- A22: "1.0-1.9: Pre-CI Stage - No visible improvement culture"
- A23: "2.0-2.9: Awareness Stage - Beginning to discuss CI concepts"
- A24: "3.0-3.9: Developing Stage - Active CI initiatives, early results"
- A25: "4.0-4.9: Practicing Stage - CI embedded in daily work"
- A26: "5.0: Sustaining Stage - CI is 'how we do business'"

**Sheet 2: Radar Chart Visualization**

Create radar chart with:
- Data source: Sheet1, Columns A7:C14
- Chart title: "CI Culture Maturity Profile"
- Axes: Each principle name
- Data series: Score (1-5)
- Reference line at 3.0 (target minimum)
- Formatting: Clean, professional, brand colors

**Sheet 3: Action Plan Template**

| Column | Header | Description |
|--------|--------|-------------|
| A | Priority | High/Medium/Low dropdown |
| B | Principle | Linked to Sheet 1 |
| C | Current Score | Formula reference to Sheet 1 |
| D | Target Score | Data validation (1-5) |
| E | Gap | Formula: Target - Current |
| F | Action | Text field |
| G | Owner | Text field |
| H | Timeline | Date picker |
| I | Status | Dropdown: Not Started/In Progress/Complete |
| J | Notes | Text field |

### Formatting Guidelines

**Colors:**
- Primary Blue: #1E40AF (headers)
- Light Blue: #DBEAFE (score cells)
- Gray: #D1D5DB (column headers)
- Light Gray: #F3F4F6 (instructions)
- Green: #10B981 (scores 4-5)
- Yellow: #F59E0B (scores 3)
- Red: #EF4444 (scores 1-2)

**Fonts:**
- Headers: Arial 18pt Bold
- Subheaders: Arial 12pt Bold
- Body: Arial 10pt
- All left-aligned except scores (center-aligned)

**Column Widths:**
- A: 20 characters
- B: 40 characters
- C: 12 characters
- D-H: 25 characters each

**Conditional Formatting:**
- C7:C14 - Color scale: Red (1) to Green (5)
- C18 - IF score <2.5, Red; IF 2.5-3.5, Yellow; IF >3.5, Green

### Data Validation

**Score Cells (C7:C14, Sheet 3 Target scores):**
- Allow: List
- Source: 1,2,3,4,5
- Input Message: "Rate on scale of 1-5"
- Error Alert: "Please enter a value between 1 and 5"

**Priority Column (Sheet 3, Column A):**
- Allow: List
- Source: High,Medium,Low

**Status Column (Sheet 3, Column I):**
- Allow: List
- Source: Not Started,In Progress,Complete

### Usage Instructions (Include in Template)

Create a "How to Use" sheet with:

1. **Getting Started**
   - Gather input from 5-10 employees across different levels
   - Consider conducting mini-interviews or surveys
   - Review each principle definition before scoring

2. **Scoring Guidelines**
   - Be honest - this is a baseline, not a judgment
   - Provide specific examples in the Evidence column
   - Consider both formal systems and actual behaviors

3. **Interpreting Results**
   - Focus on lowest-scoring principles first
   - Look for patterns (all low? Need foundational work)
   - Celebrate strengths (high scores)

4. **Action Planning**
   - Prioritize top 3 gaps
   - Assign owners for each action
   - Set realistic timelines (culture change takes time)
   - Review monthly, re-assess quarterly

---

## Template 2: Statistical Process Control (SPC) Chart Generator

**Course:** Course 2 - Basic Statistics for CI  
**Format:** Excel (.xlsx)  
**Purpose:** Create control charts (X-bar and R charts) with automatic calculations  
**Estimated Build Time:** 3-4 hours

### Worksheet Structure

**Sheet 1: Data Input**

#### Layout

**Row 1-3: Header**
- Merge A1:M1: "Statistical Process Control Chart Generator" (Arial 18pt Bold, Blue #1E40AF)
- Merge A2:M2: "X-bar and R Chart with Automatic Calculations" (Arial 12pt)

**Row 4: Process Information**
- A4: "Process Name:" (Bold)
- B4: Text input field
- E4: "Specification Limits:" (Bold)
- F4: "LSL:" | G4: Number input
- H4: "USL:" | I4: Number input
- J4: "Target:" | K4: Number input

**Row 5: Data Collection Information**
- A5: "Sample Size (n):" (Bold)
- B5: Number input (default: 5)
- E5: "Number of Samples:" (Bold)
- F5: Formula: `=COUNTA(A8:A107)` (auto-count)

**Row 6: Empty (spacing)**

**Row 7: Column Headers**
- A7: "Sample #" (Bold, Fill: Gray)
- B7-F7: "Measurement 1" through "Measurement 5" (Bold, Fill: Gray)
- G7: "Average (X-bar)" (Bold, Fill: Light Blue)
- H7: "Range (R)" (Bold, Fill: Light Blue)
- I7: "UCL Check" (Bold, Fill: Light Gray)
- J7: "LCL Check" (Bold, Fill: Light Gray)
- K7: "Out of Control?" (Bold, Fill: Light Yellow)

**Row 8-107: Data Entry (100 samples capacity)**
- A8: 1, A9: 2, etc. (auto-fill series)
- B8:F107: Number input fields (Number format: 0.00)
- G8: Formula: `=AVERAGE(B8:F8)` (copy down)
- H8: Formula: `=MAX(B8:F8)-MIN(B8:F8)` (copy down)
- I8: Formula: `=IF(G8>$D$113,"ABOVE UCL","")` (copy down)
- J8: Formula: `=IF(G8<$D$115,"BELOW LCL","")` (copy down)
- K8: Formula: `=IF(OR(I8<>"",J8<>""),"YES","")` (copy down, conditional formatting: Red if "YES")

**Row 108: Empty (spacing)**

**Row 109-120: Control Limits Calculations**

| Row | A - Label | B - Formula/Value | C - Explanation |
|-----|-----------|-------------------|-----------------|
| 109 | **X-bar Chart Calculations** (Bold, Fill: Light Blue) | | |
| 110 | Grand Average (X-double-bar): | `=AVERAGE(G8:G107)` | Center Line (CL) |
| 111 | Average Range (R-bar): | `=AVERAGE(H8:H107)` | Used for UCL/LCL calculation |
| 112 | A2 Constant (n=5): | 0.577 | Lookup based on sample size |
| 113 | Upper Control Limit (UCL): | `=B110+(B112*B111)` | X-double-bar + (A2 × R-bar) |
| 114 | Center Line (CL): | `=B110` | Grand average |
| 115 | Lower Control Limit (LCL): | `=B110-(B112*B111)` | X-double-bar - (A2 × R-bar) |
| 116 | | | |
| 117 | **R Chart Calculations** (Bold, Fill: Light Blue) | | |
| 118 | Upper Control Limit (UCL_R): | `=2.114*B111` | D4 × R-bar (D4=2.114 for n=5) |
| 119 | Center Line (CL_R): | `=B111` | R-bar |
| 120 | Lower Control Limit (LCL_R): | 0 | D3 × R-bar (D3=0 for n=5) |

**Row 122-125: Process Capability (if spec limits provided)**
- A122: "Process Capability" (Bold, Fill: Light Green)
- A123: "Cp:" | B123: `=IF(G4>0,(I4-G4)/(6*STDEV(G8:G107)),"N/A")`
- A124: "Cpk:" | B124: `=IF(G4>0,MIN((I4-B110)/(3*STDEV(G8:G107)),(B110-G4)/(3*STDEV(G8:G107))),"N/A")`
- A125: "Interpretation:" | B125: `=IF(B124="N/A","Enter spec limits",IF(B124<1,"Incapable",IF(B124<1.33,"Marginal",IF(B124<2,"Capable","Excellent"))))`

**Sheet 2: X-bar Chart**

Create line chart:
- X-axis: Sample # (A8:A107)
- Y-axis: Average values (G8:G107)
- Additional series:
  - UCL (horizontal line at B113)
  - CL (horizontal line at B114)
  - LCL (horizontal line at B115)
- Chart formatting:
  - Title: "X-bar Control Chart - [Process Name]"
  - UCL/LCL lines: Red, dashed
  - CL line: Green, solid
  - Data points: Blue, with markers
  - Grid lines: Light gray
- Out-of-control points highlighted in red (conditional formatting)

**Sheet 3: R Chart**

Create line chart:
- X-axis: Sample # (A8:A107)
- Y-axis: Range values (H8:H107)
- Additional series:
  - UCL_R (horizontal line at B118)
  - CL_R (horizontal line at B119)
  - LCL_R (horizontal line at B120)
- Same formatting as X-bar chart

**Sheet 4: Control Chart Rules**

Create reference table for special cause patterns:

| Rule | Pattern | What it Indicates |
|------|---------|-------------------|
| 1 | Point beyond control limits | Special cause - investigate immediately |
| 2 | 8+ consecutive points on same side of CL | Process shift - systematic change occurred |
| 3 | 6+ consecutive points trending up or down | Process drift - gradual change over time |
| 4 | 14+ consecutive points alternating up/down | Over-control - stop adjusting process |
| 5 | 2 of 3 consecutive points beyond 2σ | Early warning - monitor closely |

### Constants Table (for different sample sizes)

Create lookup table on Sheet 1 (columns M-P, rows 109-115):

| n | A2 | D3 | D4 |
|---|----|----|-----|
| 2 | 1.880 | 0 | 3.267 |
| 3 | 1.023 | 0 | 2.575 |
| 4 | 0.729 | 0 | 2.282 |
| 5 | 0.577 | 0 | 2.114 |
| 6 | 0.483 | 0 | 2.004 |
| 7 | 0.419 | 0.076 | 1.924 |
| 8 | 0.373 | 0.136 | 1.864 |
| 9 | 0.337 | 0.184 | 1.816 |
| 10 | 0.308 | 0.223 | 1.777 |

Use VLOOKUP to automatically select constants based on sample size in B5.

### Conditional Formatting

**Out of Control Points (Sheet 1, Column K):**
- Formula: `=$K8="YES"`
- Format: Fill Red, Bold

**Data Points in Charts:**
- Use VBA or manual formatting to highlight out-of-control points in red on charts

### Usage Instructions

**Sheet 5: User Guide**

Include step-by-step instructions:

1. **Setup**
   - Enter process name (B4)
   - Enter sample size n (B5) - typically 3-5 measurements
   - Enter specification limits if known (G4, I4, K4)

2. **Data Collection**
   - Collect samples at regular intervals
   - Measure n items per sample (e.g., 5 parts every hour)
   - Enter measurements in columns B-F
   - Charts update automatically

3. **Interpreting Results**
   - Check "Out of Control?" column (K) for flagged points
   - Review X-bar chart for process average stability
   - Review R chart for variation stability
   - If out of control: Stop and investigate special cause

4. **Process Capability**
   - Cp shows potential capability (if perfectly centered)
   - Cpk shows actual capability (accounts for centering)
   - Target: Cpk ≥ 1.33 for capable process

5. **Taking Action**
   - Common cause variation (in control): Improve the process
   - Special cause variation (out of control): Find and eliminate the cause
   - Review Control Chart Rules (Sheet 4) for patterns

---

## Template 3: 5S Audit Checklist

**Course:** Course 3 - Lean Fundamentals  
**Format:** Excel (.xlsx) + PDF printable version  
**Purpose:** Conduct 5S workplace audits with scoring and tracking  
**Estimated Build Time:** 2 hours

### Worksheet Structure

**Sheet 1: 5S Audit Form**

#### Header Section (Rows 1-8)

- A1: "5S AUDIT CHECKLIST" (Arial 20pt Bold, Center, Fill: Blue #1E40AF, Font Color: White)
- Merge A1:H1

**Audit Information:**
- A3: "Area/Zone:" | B3-D3: Merged text input
- E3: "Auditor:" | F3-H3: Merged text input
- A4: "Date:" | B4: Date picker
- E4: "Time:" | F4: Time input
- A5: "Previous Score:" | B5: Number input
- E5: "Current Score:" | F5: Formula: `=SUM(D10:D59)/50` (auto-calculate)
- A6: "Score Change:" | B6: Formula: `=F5-B5` | Conditional formatting: Green if positive, Red if negative

**Scoring Guide (Row 8):**
- Merge A8:H8, Fill: Light Gray
- Text: "Scoring: 0 = Not Implemented | 1 = Partially Implemented | 2 = Fully Implemented"

#### Audit Checklist (Rows 10-59)

**Column Headers (Row 9):**
- A9: "#" (Bold, Center)
- B9: "5S Element" (Bold)
- C9: "Audit Item" (Bold)
- D9: "Score (0-2)" (Bold, Center)
- E9: "Evidence/Photo" (Bold)
- F9: "Action Required" (Bold)
- G9: "Owner" (Bold)
- H9: "Due Date" (Bold)

**Sort (Seiri) - Rows 10-19 (10 items)**

| # | 5S Element | Audit Item | Score |
|---|------------|------------|-------|
| 1 | SORT | All items in the area have a clear purpose and are needed for current work | Data validation: 0,1,2 |
| 2 | SORT | No unnecessary items, tools, materials, or equipment in the work area | Data validation: 0,1,2 |
| 3 | SORT | Obsolete/broken items have been removed or red-tagged for removal | Data validation: 0,1,2 |
| 4 | SORT | Personal items are minimal and stored appropriately | Data validation: 0,1,2 |
| 5 | SORT | Work surfaces are clear of items not in immediate use | Data validation: 0,1,2 |
| 6 | SORT | Storage areas contain only necessary items | Data validation: 0,1,2 |
| 7 | SORT | Red tag system is in place for questionable items | Data validation: 0,1,2 |
| 8 | SORT | Aisles and walkways are clear of obstructions | Data validation: 0,1,2 |
| 9 | SORT | Quantity of items matches actual need (no excess inventory) | Data validation: 0,1,2 |
| 10 | SORT | Area has been reviewed for unnecessary items in last 30 days | Data validation: 0,1,2 |

- A10: 1, A11: 2, etc.
- B10-B19: "SORT" (Fill: Light Red #FEE2E2)
- D10: Subtotal formula in row 19, Column D: `=SUM(D10:D19)`

**Set in Order (Seiton) - Rows 20-29 (10 items)**

| # | 5S Element | Audit Item | Score |
|---|------------|------------|-------|
| 11 | SET IN ORDER | Every item has a designated location | Data validation: 0,1,2 |
| 12 | SET IN ORDER | Locations are clearly marked/labeled | Data validation: 0,1,2 |
| 13 | SET IN ORDER | Items are stored in logical locations based on frequency of use | Data validation: 0,1,2 |
| 14 | SET IN ORDER | Most frequently used items are within easy reach | Data validation: 0,1,2 |
| 15 | SET IN ORDER | Visual controls are in place (color coding, shadow boards) | Data validation: 0,1,2 |
| 16 | SET IN ORDER | Storage locations minimize walking, reaching, and bending | Data validation: 0,1,2 |
| 17 | SET IN ORDER | "A place for everything, everything in its place" is evident | Data validation: 0,1,2 |
| 18 | SET IN ORDER | Anyone can find needed items quickly (< 30 seconds) | Data validation: 0,1,2 |
| 19 | SET IN ORDER | Aisles and work zones are clearly marked | Data validation: 0,1,2 |
| 20 | SET IN ORDER | Tools/equipment return to designated locations after use | Data validation: 0,1,2 |

- B20-B29: "SET IN ORDER" (Fill: Light Orange #FED7AA)

**Shine (Seiso) - Rows 30-39 (10 items)**

| # | 5S Element | Audit Item | Score |
|---|------------|------------|-------|
| 21 | SHINE | Work area and equipment are clean and free of dirt/debris | Data validation: 0,1,2 |
| 22 | SHINE | Floors are clean, dry, and free of slip hazards | Data validation: 0,1,2 |
| 23 | SHINE | Equipment is well-maintained and functioning properly | Data validation: 0,1,2 |
| 24 | SHINE | Cleaning supplies are readily available | Data validation: 0,1,2 |
| 25 | SHINE | Regular cleaning schedule is posted and followed | Data validation: 0,1,2 |
| 26 | SHINE | Spills and leaks are addressed immediately | Data validation: 0,1,2 |
| 27 | SHINE | Windows, lights, and fixtures are clean (good visibility) | Data validation: 0,1,2 |
| 28 | SHINE | Inspection and cleaning are part of daily routine | Data validation: 0,1,2 |
| 29 | SHINE | Problems discovered during cleaning are documented and fixed | Data validation: 0,1,2 |
| 30 | SHINE | Area looks professional and organized | Data validation: 0,1,2 |

- B30-B39: "SHINE" (Fill: Light Yellow #FEF3C7)

**Standardize (Seiketsu) - Rows 40-49 (10 items)**

| # | 5S Element | Audit Item | Score |
|---|------------|------------|-------|
| 31 | STANDARDIZE | Visual standards/photos of correct state are posted | Data validation: 0,1,2 |
| 32 | STANDARDIZE | Procedures and work instructions are documented | Data validation: 0,1,2 |
| 33 | STANDARDIZE | Labeling and color-coding are consistent | Data validation: 0,1,2 |
| 34 | STANDARDIZE | All team members know and follow the standards | Data validation: 0,1,2 |
| 35 | STANDARDIZE | Standards are clear, simple, and easy to understand | Data validation: 0,1,2 |
| 36 | STANDARDIZE | Best practices are documented and shared | Data validation: 0,1,2 |
| 37 | STANDARDIZE | Similar areas follow similar standards (consistency) | Data validation: 0,1,2 |
| 38 | STANDARDIZE | Standards are displayed at point of use | Data validation: 0,1,2 |
| 39 | STANDARDIZE | Training materials for new employees exist | Data validation: 0,1,2 |
| 40 | STANDARDIZE | Standards are reviewed and updated regularly | Data validation: 0,1,2 |

- B40-B49: "STANDARDIZE" (Fill: Light Green #D1FAE5)

**Sustain (Shitsuke) - Rows 50-59 (10 items)**

| # | 5S Element | Audit Item | Score |
|---|------------|------------|-------|
| 41 | SUSTAIN | 5S is part of daily routine (not special event) | Data validation: 0,1,2 |
| 42 | SUSTAIN | Team members take ownership of 5S in their areas | Data validation: 0,1,2 |
| 43 | SUSTAIN | Regular audits are conducted (at least monthly) | Data validation: 0,1,2 |
| 44 | SUSTAIN | Audit results are posted and reviewed | Data validation: 0,1,2 |
| 45 | SUSTAIN | Corrective actions from audits are completed on time | Data validation: 0,1,2 |
| 46 | SUSTAIN | Leadership participates in and supports 5S | Data validation: 0,1,2 |
| 47 | SUSTAIN | Good 5S practices are recognized and celebrated | Data validation: 0,1,2 |
| 48 | SUSTAIN | Performance metrics show sustained improvement | Data validation: 0,1,2 |
| 49 | SUSTAIN | New employees are trained in 5S from day one | Data validation: 0,1,2 |
| 50 | SUSTAIN | 5S principles extend beyond this area (culture) | Data validation: 0,1,2 |

- B50-B59: "SUSTAIN" (Fill: Light Blue #DBEAFE)

**Row 60: Totals Summary**
- A60: "ELEMENT TOTALS:" (Bold)
- B60: "Sort:" | C60: `=SUM(D10:D19)`
- D60: "Set:" | E60: `=SUM(D20:D29)`
- F60: "Shine:" | G60: `=SUM(D30:D39)`
- H60: "Standard:" | I60: `=SUM(D40:D49)`
- J60: "Sustain:" | K60: `=SUM(D50:D59)`

**Row 61: Percentage Scores**
- B61: Formula: `=C60/20*100&"%"`
- E61: Formula: `=E60/20*100&"%"`
- G61: Formula: `=G60/20*100&"%"`
- I61: Formula: `=I60/20*100&"%"`
- K61: Formula: `=K60/20*100&"%"`

**Row 63: Overall Score**
- A63: "OVERALL 5S SCORE:" (Bold, 14pt)
- B63: Formula: `=SUM(D10:D59)/100*100&"%"` (Bold, 14pt, Fill: Conditional formatting)

**Conditional Formatting for Overall Score:**
- If <50%: Red fill
- If 50-74%: Yellow fill
- If 75-89%: Light Green fill
- If ≥90%: Dark Green fill

**Sheet 2: Score Tracking Dashboard**

Create a tracking table:

| Audit Date | Auditor | Sort | Set | Shine | Standard | Sustain | Overall | Change |
|------------|---------|------|-----|-------|----------|---------|---------|--------|
| [Dates] | [Names] | [Scores] | [Scores] | [Scores] | [Scores] | [Scores] | [Scores] | [+/-] |

Include line chart showing score trends over time.

**Sheet 3: Action Item Tracker**

| Item # | Finding | Priority | Owner | Due Date | Status | Completion Date | Notes |
|--------|---------|----------|-------|----------|--------|-----------------|-------|
| Auto-populated from Sheet 1 Column F (Action Required) | | | | | | | |

### PDF Printable Version

Create a clean, single-page printable PDF version:
- Condensed layout for printing
- Checkboxes instead of dropdown cells
- Space for handwritten notes
- QR code linking to digital version (optional)

---

## Template 4: DMAIC Project Charter

**Course:** Course 4 - Six Sigma DMAIC Overview  
**Format:** PowerPoint (.pptx)  
**Purpose:** Document DMAIC project scope, goals, and plan  
**Estimated Build Time:** 1.5 hours

### Slide Structure (8 slides)

**Slide 1: Title Slide**

Layout:
- Title: "DMAIC Project Charter" (Arial 32pt Bold, Blue #1E40AF)
- Subtitle: "[Project Name]"
- Footer: Project start date, Project leader name

**Slide 2: Project Overview**

Layout (3-column):

**Left Column: Problem Statement**
- Box with light gray background
- Title: "Problem Statement" (Bold, 16pt)
- Template text (12pt):
  ```
  [What] problem has increased/decreased from [baseline] to [current state] over [timeframe], 
  resulting in [business impact: cost, customer satisfaction, quality, etc.].
  
  Example: Injection molding defects have increased from 3% to 15% over the past 3 months, 
  resulting in $500K annual scrap costs and 20% customer returns.
  ```

**Center Column: Goal Statement**
- Box with light blue background
- Title: "Goal Statement (SMART)" (Bold, 16pt)
- Template text (12pt):
  ```
  [Verb] [metric] from [current] to [target] by [date], 
  resulting in [expected benefit].
  
  Example: Reduce defect rate from 15% to 3% by June 30, 2025, 
  saving $400K annually and improving customer satisfaction to 95%+.
  ```

**Right Column: Business Case**
- Box with light green background
- Title: "Business Case" (Bold, 16pt)
- Bullet points (12pt):
  - Financial impact: $___
  - Customer impact: ___
  - Strategic alignment: ___
  - Risk if not addressed: ___

**Slide 3: Scope**

Two-column layout:

**Left Column: In Scope**
- Green box with checkmark icon
- Bulleted list:
  - What processes/areas are included
  - What products/services
  - What timeframe
  - What metrics

**Right Column: Out of Scope**
- Red box with X icon
- Bulleted list:
  - What is explicitly excluded
  - What will be addressed in future projects
  - Boundaries defined

**Bottom Section: Constraints**
- Box spanning full width
- Budget: | Timeline: | Resources: | Other:

**Slide 4: Team & Stakeholders**

Layout (Table format):

**Project Team:**
| Role | Name | Department | Commitment |
|------|------|------------|------------|
| Champion | [Name] | [Dept] | Approval authority, remove barriers |
| Project Leader | [Name] | [Dept] | Lead project, 50% time |
| Team Member | [Name] | [Dept] | Subject matter expert, 20% time |
| Team Member | [Name] | [Dept] | Data analyst, 20% time |
| Team Member | [Name] | [Dept] | Process owner, 20% time |

**Key Stakeholders:**
- List with involvement level (Inform / Consult / Collaborate / Approve)

**Slide 5: Timeline & Milestones**

Gantt chart showing:
- Define Phase: Weeks 1-2
- Measure Phase: Weeks 2-4
- Analyze Phase: Weeks 4-6
- Improve Phase: Weeks 6-10
- Control Phase: Weeks 10-12

Key milestones marked with diamond shapes:
- Charter approval
- Baseline data collected
- Root causes identified
- Solution piloted
- Control plan implemented

**Slide 6: SIPOC Diagram**

High-level process map:

| Suppliers | Inputs | Process (5-7 steps) | Outputs | Customers |
|-----------|--------|---------------------|---------|-----------|
| Who provides inputs | What goes in | Major process steps | What comes out | Who receives output |

Use arrows to show flow, keep at high level (5-7 process steps maximum)

**Slide 7: Success Metrics & Targets**

Table format:

| Metric | Baseline | Target | Measurement Method | Data Source | Frequency |
|--------|----------|--------|-------------------|-------------|-----------|
| Primary Y | [Current] | [Goal] | [How measured] | [Where] | [How often] |
| Secondary Y | [Current] | [Goal] | [How measured] | [Where] | [How often] |
| Financial | $[Current cost] | $[Target savings] | Cost accounting | Finance | Monthly |

**Bottom section:** "How will we know we're successful?"
- Specific, measurable criteria
- Expected timeline to see results

**Slide 8: Risks & Mitigation**

Table format:

| Risk | Probability (H/M/L) | Impact (H/M/L) | Priority | Mitigation Strategy | Owner |
|------|---------------------|----------------|----------|---------------------|-------|
| [Potential problem] | H/M/L | H/M/L | [Score] | [How to prevent/reduce] | [Name] |

Risk priority matrix (2x2):
- High probability + High impact = Top priority
- Color coding: Red (High), Yellow (Medium), Green (Low)

### Design Guidelines

**Color Scheme:**
- Primary Blue: #1E40AF (headers, accents)
- Light Blue: #DBEAFE (backgrounds)
- Gray: #6B7280 (body text)
- White: #FFFFFF (slide backgrounds)
- Green: #10B981 (positive/in-scope)
- Red: #EF4444 (negative/out-scope)

**Fonts:**
- Headers: Arial Bold, 20-24pt
- Subheaders: Arial Bold, 16pt
- Body: Arial, 12pt
- Annotations: Arial, 10pt

**Master Slide Layout:**
- Company logo (top right)
- Slide number (bottom right)
- Project name (footer, left)
- Consistent margins (0.5" all sides)

### Editable Elements

All text boxes should be:
- Easily editable (not locked)
- Properly formatted with bullet points
- Includes placeholder text in [brackets]
- Help text in light gray (delete when filling in)

### Usage Notes (Include as Slide 9: Instructions)

**How to Use This Template:**
1. Complete slides sequentially (Define phase first)
2. Work with team to fill in information (not solo effort)
3. Get champion approval before proceeding to Measure phase
4. Update as project evolves (living document)
5. Present to stakeholders at tollgates

**Tips for Success:**
- Be specific - avoid vague language
- Quantify everything possible
- Include dates and names (accountability)
- Review completed charters from past successful projects
- Challenge scope creep - keep project focused

---

## Template 5: A3 Problem-Solving Template

**Course:** Course 5 - Process Mapping & Problem-Solving Essentials  
**Format:** PowerPoint (.pptx) in A3 landscape format (11"x17")  
**Purpose:** One-page structured problem-solving story  
**Estimated Build Time:** 2 hours

### Layout (Single A3 slide - 17" wide x 11" high)

**Design as 8-box layout following PDCA cycle:**

#### Left Side (Plan - Do): Problem Understanding & Analysis

**Box 1: Background / Context (Top-left, 20% width)**
- Title: "BACKGROUND" (Bold, Blue)
- Content guidance:
  - Brief history of the problem
  - Why this matters (business impact)
  - How problem was discovered
  - 3-5 bullet points
  - Include key metrics if relevant

**Box 2: Current State (Left, 20% width, below Box 1)**
- Title: "CURRENT STATE" (Bold, Blue)
- Content guidance:
  - Visual: Process map or diagram
  - Performance metrics (current)
  - Problems identified
  - Waste/inefficiency visible

**Box 3: Target State (Left, 20% width, below Box 2)**
- Title: "TARGET / GOAL" (Bold, Blue)
- Content guidance:
  - What does success look like?
  - SMART goal statement
  - Key metrics with targets
  - Expected benefits

**Box 4: Root Cause Analysis (Center-left, 30% width)**
- Title: "ROOT CAUSE ANALYSIS" (Bold, Blue)
- Content guidance:
  - Fishbone diagram OR 5 Whys
  - Data analysis (charts/graphs)
  - Root causes identified (highlighted)
  - "Because..." statements

#### Right Side (Check - Act): Solutions & Results

**Box 5: Countermeasures / Solutions (Center-right, 30% width)**
- Title: "COUNTERMEASURES" (Bold, Blue)
- Content guidance:
  - List of solutions developed
  - Selection criteria applied
  - Chosen solution(s) highlighted
  - Implementation approach

**Box 6: Implementation Plan (Top-right, 20% width)**
- Title: "IMPLEMENTATION PLAN" (Bold, Blue)
- Content guidance:
  - Action | Owner | Due Date table
  - Gantt chart or timeline
  - Resources required
  - Quick wins identified

**Box 7: Confirmation / Results (Right, 20% width, below Box 6)**
- Title: "RESULTS" (Bold, Blue)
- Content guidance:
  - Before/after metrics comparison
  - Charts showing improvement
  - Success metrics achieved
  - Cost savings/benefits

**Box 8: Follow-up / Standardization (Right, 20% width, below Box 7)**
- Title: "FOLLOW-UP" (Bold, Blue)
- Content guidance:
  - How will gains be sustained?
  - Standard work created?
  - Audit/monitoring plan
  - Next steps / remaining issues

**Header (Across top of page):**
- Problem Title: [Descriptive title] (24pt Bold)
- Date: [Date]
- Owner: [Name]
- Status: [In Progress / Complete]

**Footer (Across bottom):**
- Left: Department/Area
- Center: Review Date
- Right: Page 1 of 1

### Design Elements

**Visual Guidelines:**
- Use boxes/sections with borders to separate 8 areas
- Color coding:
  - Blue headers (#1E40AF)
  - Light gray box backgrounds (#F3F4F6)
  - Green for positive results (#10B981)
  - Red for problems/gaps (#EF4444)

**Charts/Graphs:**
- Include in relevant boxes
- Keep simple and focused
- Before/after comparisons
- Pareto charts, run charts, process maps

**Icons:**
- Problem icon (Box 1)
- Magnifying glass (Root cause - Box 4)
- Light bulb (Solutions - Box 5)
- Action items checklist (Box 6)
- Success/checkmark (Box 7)

### Content Guidance (Built into template as help text)

Each box includes light gray placeholder text:

**Box 1 example:**
```
Describe the situation:
• What is the problem?
• When did it start?
• What is the business impact?
• Why are we working on this now?
```

**Box 4 example:**
```
Why does this problem occur?
• Use 5 Whys or Fishbone
• Verify causes with data
• Identify root causes (not symptoms)
• Show data analysis/charts
```

**Box 7 example:**
```
Did the countermeasures work?
• Show before/after data
• Compare to goal/target
• Quantify benefits ($, time, quality)
• Note any unintended consequences
```

### Alternative Format Option

**Digital Interactive Version:**
- Each box is a collapsible section
- Click to expand/view details
- Hyperlinks to supporting documents
- Embedded videos or detailed charts
- Version history tracking

### Print-Friendly Version

**For physical printing:**
- High resolution (300 DPI)
- Color and grayscale versions
- QR code to digital version
- Grid guides (can be hidden)
- Bleed margins for professional printing

---

## Templates 6-10: Summary Specifications

Due to length constraints, here are abbreviated specifications for the remaining templates. Full versions would follow the same detailed format as Templates 1-5.

---

## Template 6: Waste Identification Checklist

**Course:** Course 3 - Lean Fundamentals  
**Format:** Excel (.xlsx)  
**Purpose:** Systematically identify and quantify 8 wastes (DOWNTIME)

**Key Features:**
- 8 tabs (one per waste type)
- Each tab includes:
  - Definition and examples
  - Observation checklist (20+ items)
  - Quantification fields (time/cost)
  - Photo/evidence upload areas
- Summary dashboard showing:
  - Total waste by type (Pareto chart)
  - Cost impact calculation
  - Priority matrix (impact vs. ease)
- Automatic roll-up to executive summary

---

## Template 7: Process Mapping Worksheet

**Course:** Course 5 - Process Mapping & Problem-Solving Essentials  
**Format:** PowerPoint (.pptx) with Visio shapes  
**Purpose:** Create current-state and future-state process maps

**Key Features:**
- Pre-loaded with standard flowchart shapes
- Swimlane templates (3, 4, 5, 6 lanes)
- Value stream mapping symbols
- Color coding guide:
  - Green: Value-added
  - Yellow: Non-value-added but necessary
  - Red: Waste (eliminate)
- Metrics boxes:
  - Cycle time
  - Process time
  - Wait time
  - Value-added %
- Before/after comparison slide

---

## Template 8: Project Tracking Dashboard

**Course:** Course 4 - Six Sigma DMAIC Overview  
**Format:** Excel (.xlsx) with Power Query  
**Purpose:** Track multiple CI projects across organization

**Key Features:**
- Project list with status (Define/Measure/Analyze/Improve/Control)
- RAG status (Red/Amber/Green)
- Financial tracking:
  - Projected savings
  - Actual savings
  - ROI calculation
- Timeline Gantt chart
- Resource allocation view
- Executive dashboard with:
  - Projects by status
  - Total savings YTD
  - Projects completed
  - Pipeline view

---

## Template 9: Data Collection Plan

**Course:** Course 2 - Basic Statistics for CI  
**Format:** Excel (.xlsx)  
**Purpose:** Plan and execute systematic data collection

**Key Features:**
- Data collection strategy:
  - What to measure
  - How to measure
  - When/how often
  - Who will collect
  - Sample size calculator
- Operational definitions worksheet
- Data entry form with validation
- Automatic descriptive statistics:
  - Mean, median, mode
  - Standard deviation
  - Range, min, max
- Data quality checks:
  - Missing data flagged
  - Outliers identified
  - Duplicate detection
- Export to SPC chart template (Template 2)

---

## Template 10: Kaizen Event Planner

**Course:** Course 1 - CI Foundations & Culture  
**Format:** PowerPoint (.pptx) + Excel tracking  
**Purpose:** Plan and facilitate 3-5 day Kaizen events

**Key Features:**
- Pre-event planning:
  - Charter/scope definition
  - Team selection
  - Logistics checklist
  - Pre-work assignments
- Daily agenda templates (Days 1-5)
- Activity worksheets:
  - Waste walk
  - Current state mapping
  - Root cause analysis
  - Solution brainstorming
  - Implementation planning
- Results tracking:
  - Before/after metrics
  - Photos/evidence
  - Savings calculation
  - Team feedback
- Final report out presentation template

---

## Implementation Guidelines for All Templates

### File Naming Convention
Format: `Template##_[Name]_v[Version]_[Date].xlsx`
Example: `Template01_CICultureAssessment_v1.0_2025-01-15.xlsx`

### Version Control
- Include version number in header
- Change log worksheet in each file
- Date of last update visible
- "Master" designation for official version

### Branding
All templates should include:
- Organization logo placeholder (top right)
- Brand colors (customize Blue #1E40AF to match brand)
- Footer with: Template name | Version | Date
- Optional: QR code to template library

### Protection & Security
- Lock formula cells (protect with password)
- Allow data entry cells only
- Hide calculation/lookup sheets
- Macro security considerations

### Training Materials
Each template should include:
- "How to Use" worksheet/slide
- Video tutorial link (to be created)
- Example/sample data
- FAQ section
- Support contact information

### Accessibility
- High contrast colors
- Alt text for images/charts
- Screen reader compatible
- Keyboard navigation enabled
- Font size minimum 10pt

### Quality Assurance Checklist
Before finalizing each template:
- [ ] All formulas tested and working
- [ ] Data validation applied correctly
- [ ] Conditional formatting functions properly
- [ ] Charts update automatically
- [ ] Print layout optimized
- [ ] No hardcoded values (use references)
- [ ] Instructions are clear and complete
- [ ] Tested by end user (not creator)
- [ ] Spell check passed
- [ ] Professional appearance

---

## Template Distribution Package

### Folder Structure
```
Foundation_Belt_Templates/
├── Excel_Templates/
│   ├── Template01_CICultureAssessment.xlsx
│   ├── Template02_SPCChart.xlsx
│   ├── Template03_5SAudit.xlsx
│   ├── Template06_WasteChecklist.xlsx
│   ├── Template08_ProjectDashboard.xlsx
│   └── Template09_DataCollectionPlan.xlsx
├── PowerPoint_Templates/
│   ├── Template04_DMICCharter.pptx
│   ├── Template05_A3Template.pptx
│   ├── Template07_ProcessMapping.pptx
│   └── Template10_KaizenPlanner.pptx
├── PDF_Printables/
│   ├── 5S_Audit_Printable.pdf
│   ├── Waste_Walk_Form.pdf
│   └── Quick_Reference_Guides.pdf
├── Video_Tutorials/
│   └── [Links to tutorial videos for each template]
├── User_Guide.pdf
└── README.txt
```

### User Guide Contents
1. **Template Overview**: Purpose and use case for each
2. **Getting Started**: How to access and customize
3. **Best Practices**: Tips for effective use
4. **Troubleshooting**: Common issues and solutions
5. **Support**: How to get help
6. **Feedback**: How to suggest improvements

### Training Plan
- **Self-Paced**: Video tutorials + user guide
- **Live Training**: 2-hour workshop covering all templates
- **Office Hours**: Weekly Q&A sessions
- **Champions Network**: Power users to support others

---

**End of Foundation Belt Template Specifications**

*These templates are designed to be practical, professional, and user-friendly tools that support continuous improvement learning and application. Each template should be tested with actual users before final deployment and updated based on feedback.*
