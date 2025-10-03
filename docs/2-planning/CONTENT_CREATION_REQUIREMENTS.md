# 📚 CI MASTER ACADEMY - CONTENT CREATION REQUIREMENTS
## Complete Production Guide for Subject Matter Experts

**Document Purpose:** This file lists EVERYTHING you need to create (videos, quizzes, exercises, etc.) before I can integrate it into the platform.

**Your Role:** Create the content listed below  
**My Role:** Build the technical platform and integrate your content

**Status:** Content Creation Phase  
**Target Completion:** When all items below are ✅ checked off

---

## 📋 TABLE OF CONTENTS

1. [Overview & Production Standards](#overview--production-standards)
2. [Foundation Belt Content (Phase 2)](#foundation-belt-white-belt)
3. [Practitioner Belt Content (Phase 3)](#practitioner-belt-yellow-belt)
4. [Assets & Resources](#assets--resources)
5. [Delivery Format](#delivery-format)
6. [Content Checklist](#content-checklist)

---

## 🎯 OVERVIEW & PRODUCTION STANDARDS

### **Total Content Requirements:**

| Category | Quantity | Estimated Time |
|----------|----------|----------------|
| **Videos** | 50-60 lessons | 40-50 hours |
| **Quiz Questions** | 500+ questions | 50-60 hours |
| **Practical Exercises** | 15-20 exercises | 30-40 hours |
| **Case Studies** | 10-15 studies | 20-30 hours |
| **Written Materials** | 25-30 docs | 20-30 hours |
| **TOTAL** | - | **160-210 hours** |

### **Video Specifications:**

- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (1080p HD minimum)
- **Frame Rate:** 30fps
- **Audio:** 48kHz, stereo, clear voice (no background noise)
- **Length:** 10-25 minutes per video (shorter is better)
- **Slides:** Use templates provided (clean, professional)
- **Captions:** Auto-generated OK (I'll clean up)
- **File Naming:** `ModuleX_LessonY_TopicName.mp4`

### **Quiz Question Format:**

```json
{
  "question": "What does Cpk measure?",
  "type": "multiple_choice",
  "options": [
    "Process capability accounting for centering",
    "Process control limits",
    "Sample size requirements",
    "Standard deviation only"
  ],
  "correct_answer": 0,
  "explanation": "Cpk measures process capability while considering how centered the process is between specification limits. Unlike Cp, Cpk accounts for process mean deviation from the target.",
  "difficulty": "intermediate",
  "learning_objective": "LO-2.3",
  "estimated_time_seconds": 45
}
```

---

## 📘 FOUNDATION BELT (WHITE BELT)

**Target Audience:** Complete beginners  
**Total Duration:** 30-35 hours of content  
**Certification Requirement:** Pass final exam (70%+) and complete 5 practical exercises

---

### **MODULE 1: INTRODUCTION TO PROCESS IMPROVEMENT**

**Estimated Hours:** 5 hours of video content

#### **Lesson 1.1: History & Evolution (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Origins of Continuous Improvement (30 min)**
  - Toyota Production System history
  - Deming's influence on quality
  - Evolution of Lean thinking
  - Key pioneers: Ohno, Shingo, Womack
  - Timeline: 1950s → Today

- [ ] **Part 2: Six Sigma Development (30 min)**
  - Motorola's creation of Six Sigma
  - GE's adoption and popularization
  - DMAIC methodology introduction
  - Statistical foundations
  - Modern Six Sigma

- [ ] **Part 3: Integration of Methodologies (30 min)**
  - Lean + Six Sigma = Lean Six Sigma
  - Continuous Improvement culture
  - When to use which approach
  - Real-world success stories
  - Future of CI

**QUIZ QUESTIONS NEEDED:** 10 questions

Example questions to create:
```
1. Who is considered the father of the Toyota Production System?
   a) W. Edwards Deming
   b) Taiichi Ohno ✓
   c) Shigeo Shingo
   d) Henry Ford

2. What does DMAIC stand for?
   [Multiple choice - you create]

3. In which decade was Six Sigma first developed?
   [Multiple choice - you create]

4. True/False: Lean focuses on speed, Six Sigma focuses on variation
   [True/False - you create explanation]

... 6 more questions
```

**DOWNLOADABLE RESOURCES:**
- [ ] PDF: Timeline infographic (1950-2025)
- [ ] PDF: Quick reference guide - Lean vs Six Sigma
- [ ] PDF: Key pioneers biography sheet

---

#### **Lesson 1.2: When to Use Which Methodology (60 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Decision Framework (60 min)**
  - Problem types that fit Lean
  - Problem types that fit Six Sigma
  - Problem types that need both
  - Decision matrix/flowchart
  - 5 detailed case examples

**INTERACTIVE TOOL DATA:**
- [ ] Create 10 scenario descriptions
- [ ] Classify each as Lean/Six Sigma/Both
- [ ] Provide reasoning for each

Example:
```
Scenario 1: "Customer complaints about late deliveries. Analysis shows 
14-day lead time with 9 days of waiting between steps."
→ LEAN (waste elimination)

Scenario 2: "Product defect rate is 4%. Defects appear randomly across 
all batches with no pattern."
→ SIX SIGMA (variation reduction)

[Create 8 more scenarios]
```

**QUIZ QUESTIONS NEEDED:** 8 questions (scenario-based)

**RESOURCES:**
- [ ] PDF: Decision flowchart
- [ ] Excel: Scenario selector worksheet

---

#### **Lesson 1.3: Business Case for Process Improvement (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Financial Impact (45 min)**
  - Cost of Poor Quality (COPQ)
  - ROI calculation methods
  - Hard savings vs soft savings
  - Project prioritization criteria
  - Real financial examples

- [ ] **Part 2: Building the Business Case (45 min)**
  - How to present to executives
  - Metrics that matter
  - Risk assessment
  - Implementation timelines
  - Success measurement

**EXCEL TOOLS TO CREATE:**
- [ ] ROI Calculator template
- [ ] COPQ Calculator
- [ ] Project Prioritization Matrix

**QUIZ QUESTIONS NEEDED:** 12 questions (include calculations)

Example calculation question:
```
A process produces 10,000 units/month. Current defect rate is 3%. 
Each defect costs $50 to rework. If Six Sigma reduces defects to 0.5%, 
what is the monthly savings?

Show your work: [Calculation question with step-by-step answer]
```

**RESOURCES:**
- [ ] PDF: Business case template
- [ ] Excel: Complete ROI calculator (with formulas)

---

#### **Lesson 1.4: Industry Applications (60 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Manufacturing Examples (20 min)**
  - Assembly line optimization
  - Setup reduction case
  - Before/after photos
  - Metrics achieved

- [ ] **Healthcare Examples (20 min)**
  - Patient flow improvement
  - Medication error reduction
  - Surgery prep optimization
  - Results

- [ ] **Service Industry Examples (20 min)**
  - Call center efficiency
  - Order processing
  - Customer satisfaction
  - Metrics

**CASE STUDY MATERIALS:**
For each industry, provide:
- [ ] Problem statement (1 page)
- [ ] Data sets (Excel)
- [ ] Solution approach (2 pages)
- [ ] Results with metrics (1 page)
- [ ] Photos/diagrams

**QUIZ QUESTIONS NEEDED:** 8 questions

**RESOURCES:**
- [ ] 3 complete case study PDFs (one per industry)

---

#### **PRACTICAL EXERCISE 1: A3 Problem Statement**

**WHAT YOU NEED TO CREATE:**

- [ ] **Video Tutorial (15 min):** How to complete an A3
- [ ] **Example A3:** Completed A3 for students to review
- [ ] **Template:** Blank A3 template (PowerPoint or PDF)
- [ ] **Practice Scenario:** Problem description for students
- [ ] **Grading Rubric:** Point breakdown (see below)

**Grading Rubric Template:**
```
Total Points: 100

1. Problem Statement Clarity (20 pts)
   - Is the problem specific and measurable? (10 pts)
   - Is the business impact clear? (10 pts)

2. Current State Description (20 pts)
   - Are facts/data provided? (10 pts)
   - Is the scope defined? (10 pts)

3. Goal Setting (20 pts)
   - Is the goal SMART? (10 pts)
   - Is it realistic? (10 pts)

4. Root Cause Analysis (20 pts)
   - Are causes identified? (10 pts)
   - Is analysis logical? (10 pts)

5. Proposed Solution (20 pts)
   - Is solution tied to root causes? (10 pts)
   - Is implementation plan clear? (10 pts)
```

---

### **MODULE 2: BASIC STATISTICS**

**Estimated Hours:** 6 hours of video content

#### **Lesson 2.1: Descriptive Statistics (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Measures of Central Tendency (30 min)**
  - Mean, median, mode explained
  - When to use each
  - Excel demonstrations
  - 5 worked examples

- [ ] **Part 2: Measures of Spread (30 min)**
  - Range, variance, standard deviation
  - Why variation matters
  - Excel formulas
  - 5 worked examples

- [ ] **Part 3: Practice Problems (30 min)**
  - Work through 10 problems on screen
  - Show calculations
  - Explain interpretation

**INTERACTIVE CALCULATOR DATA:**
- [ ] 15 sample data sets (small, 10-20 points each)
- [ ] Pre-calculated answers for validation

**QUIZ QUESTIONS NEEDED:** 15 questions (10 calculation, 5 conceptual)

Example calculation question:
```
Data set: 23, 25, 22, 28, 24, 26, 23, 25, 24, 27

Calculate:
a) Mean
b) Median
c) Standard deviation
d) Range

[Provide step-by-step solutions]
```

**RESOURCES:**
- [ ] Excel: Practice data sets (15 tabs)
- [ ] PDF: Formula reference sheet
- [ ] PDF: Worked examples

---

#### **Lesson 2.2: Data Visualization Basics (75 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Chart Types (75 min)**
  - Histogram creation and interpretation
  - Box plots explained
  - Scatter plots for correlation
  - When to use each chart type
  - Excel/CI Master tool demonstrations
  - Common mistakes to avoid

**PRACTICE DATA:**
- [ ] 10 different data sets
- [ ] Pre-created charts for 5 of them (examples)
- [ ] Instructions for students to create 5 charts

**QUIZ QUESTIONS NEEDED:** 12 questions

Example question:
```
[Show histogram image]

Question: This histogram shows a process that is:
a) Normal and centered
b) Skewed right
c) Bimodal ✓
d) Uniform

Explanation: The two peaks indicate two different populations...
```

**RESOURCES:**
- [ ] 10 sample data sets (Excel)
- [ ] 5 example chart images
- [ ] Chart selection flowchart (PDF)

---

#### **Lesson 2.3: Normal Distribution (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Understanding the Bell Curve (90 min)**
  - Normal distribution explained
  - Empirical rule (68-95-99.7)
  - Standard normal distribution (Z-scores)
  - Probability calculations
  - Real-world examples
  - 10 practice problems worked through

**INTERACTIVE TOOL DATA:**
- [ ] Normal curve simulator parameters
- [ ] 20 probability calculation problems with answers

**QUIZ QUESTIONS NEEDED:** 15 questions

**RESOURCES:**
- [ ] Z-table (PDF)
- [ ] Practice problems (PDF, 20 questions)

---

#### **Lesson 2.4: Introduction to Hypothesis Testing (120 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Hypothesis Testing Concepts (40 min)**
  - Null vs alternative hypothesis
  - Type I and Type II errors
  - p-values explained
  - Significance levels (α = 0.05)
  - Decision making

- [ ] **Part 2: t-Tests (40 min)**
  - One-sample t-test
  - Two-sample t-test
  - Paired t-test
  - When to use each
  - Excel and CI Master tool demo

- [ ] **Part 3: Worked Examples (40 min)**
  - Work through 5 complete hypothesis tests
  - Show calculations
  - Interpret results
  - State conclusions

**QUIZ QUESTIONS NEEDED:** 18 questions (mix conceptual and calculation)

**RESOURCES:**
- [ ] 5 practice data sets for t-tests
- [ ] Hypothesis testing flowchart
- [ ] t-table (PDF)

---

#### **PRACTICAL EXERCISE 2: SPC Chart Analysis**

**WHAT YOU NEED TO CREATE:**

- [ ] **Dataset:** 100 data points (realistic process data)
- [ ] **Video Tutorial (20 min):** How to use SPC Chart tool
- [ ] **Instructions:** Step-by-step exercise guide
- [ ] **Control chart rules:** PDF with Western Electric rules
- [ ] **Sample solution:** Completed analysis to compare against

**Exercise Requirements:**
```
Student must:
1. Enter data into SPC Chart tool
2. Identify control limits
3. Identify any violations of control rules
4. Write 1-page analysis explaining:
   - Process stability
   - Any special causes detected
   - Recommended actions

Submission: Screenshot + analysis document
```

**GRADING RUBRIC:**
- [ ] Create rubric (similar structure to A3 rubric)

---

### **MODULE 3: LEAN FUNDAMENTALS**

**Estimated Hours:** 7.5 hours of video content

#### **Lesson 3.1: The 8 Wastes - DOWNTIME (120 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Each Waste Explained (120 min total, ~15 min each)**
  - **D**efects: Examples, impact, identification
  - **O**verproduction: Examples, impact, identification
  - **W**aiting: Examples, impact, identification
  - **N**on-utilized talent: Examples, impact, identification
  - **T**ransportation: Examples, impact, identification
  - **I**nventory: Examples, impact, identification
  - **M**otion: Examples, impact, identification
  - **E**xtra processing: Examples, impact, identification

For each waste, include:
- Definition
- 3-5 real-world examples (photos/video)
- How to identify it
- How to measure it
- How to reduce it

**INTERACTIVE GAME DATA:**
- [ ] Create 30 waste scenarios
- [ ] Classify each by waste type
- [ ] Provide explanations

Example:
```
Scenario: "Workers walk 200 feet to get tools from storage room 
multiple times per day."
→ MOTION waste
Explanation: Excessive movement that doesn't add value. 
Solution: Implement 5S and bring tools closer to workstation.
```

**QUIZ QUESTIONS NEEDED:** 20 questions

**RESOURCES:**
- [ ] DOWNTIME memory aid poster (PDF)
- [ ] Waste identification worksheet (Excel)
- [ ] 20 photos showing different wastes (labeled)

---

#### **Lesson 3.2: 5S Methodology (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **5S Explained (90 min)**
  - Sort: What to keep/remove
  - Set in Order: Organization strategies
  - Shine: Cleaning and inspection
  - Standardize: Visual management
  - Sustain: Auditing and culture
  - Before/after transformations (show 5 examples)
  - Common implementation challenges

**BEFORE/AFTER MATERIALS:**
- [ ] 5 sets of before/after photos
- [ ] Metrics for each (search time, safety incidents, etc.)
- [ ] Description of what was done

**VIRTUAL AUDIT MATERIALS:**
- [ ] 10 photos of workspaces (various conditions)
- [ ] 5S scoring criteria for each
- [ ] Correct scores and feedback

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] 5S audit checklist (Excel template)
- [ ] Visual management examples (PDF, 20 images)
- [ ] Implementation guide (PDF, 5 pages)

---

#### **Lesson 3.3: Value Stream Mapping Basics (150 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: VSM Symbols and Icons (30 min)**
  - All standard VSM symbols
  - When to use each
  - Data boxes explained
  - Material vs information flow

- [ ] **Part 2: Creating Current State Maps (60 min)**
  - Step-by-step process
  - Walking the process
  - Data collection requirements
  - Drawing the map
  - Complete example walkthrough

- [ ] **Part 3: Analyzing and Improving (60 min)**
  - Calculating process cycle efficiency
  - Identifying waste on the map
  - Creating future state
  - Implementation planning
  - 2 full examples

**PRACTICE MATERIALS:**
- [ ] 3 process descriptions (detailed)
- [ ] Data for each process
- [ ] Example VSMs (current state)
- [ ] Example VSMs (future state)

**QUIZ QUESTIONS NEEDED:** 15 questions

**RESOURCES:**
- [ ] VSM symbols reference (PDF)
- [ ] VSM template (PowerPoint or Excel)
- [ ] Calculation formulas (PDF)

---

#### **Lesson 3.4: Introduction to Kanban (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Kanban Explained (90 min)**
  - Pull systems vs push systems
  - Kanban card systems
  - WIP (Work in Progress) limits
  - Visual boards
  - CI Master Kanban tool demo
  - Implementation examples (3 companies)

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] Kanban implementation guide (PDF)
- [ ] WIP limit calculation worksheet
- [ ] Sample Kanban board images

---

#### **PRACTICAL EXERCISE 3: 5S Audit + VSM**

**WHAT YOU NEED TO CREATE:**

**Part A: 5S Audit**
- [ ] 10 photos of a messy workspace (same workspace, multiple angles)
- [ ] 5S audit template (Excel)
- [ ] Instructions for students
- [ ] Sample completed audit for reference

**Part B: Simple VSM**
- [ ] Process description (3-step process)
- [ ] Process data (times, defect rates, etc.)
- [ ] Instructions to create current state map
- [ ] Expected current state map (for grading)

**GRADING RUBRIC:**
- [ ] Part A rubric (5S audit)
- [ ] Part B rubric (VSM accuracy)

---

### **MODULE 4: SIX SIGMA DMAIC OVERVIEW**

**Estimated Hours:** 6.5 hours of video content

#### **Lesson 4.1: Define Phase Essentials (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Project Charter (45 min)**
  - Charter components explained
  - Business case section
  - Problem statement
  - Goal statement
  - Scope definition
  - Team roles
  - Timeline
  - 2 complete examples

- [ ] **Part 2: SIPOC Diagrams (45 min)**
  - What is SIPOC
  - When to use it
  - How to create one
  - Common mistakes
  - 3 complete examples

**TEMPLATES TO CREATE:**
- [ ] Project charter template (Word/PDF)
- [ ] SIPOC template (PowerPoint or Excel)
- [ ] 2 filled example charters
- [ ] 3 filled example SIPOCs

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] Charter checklist (PDF)
- [ ] SIPOC instructions (PDF)

---

#### **Lesson 4.2: Measure Phase Tools (120 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Data Collection Planning (40 min)**
  - Operational definitions
  - Sampling strategies
  - Data collection forms
  - Measurement system analysis intro

- [ ] **Part 2: Process Capability (40 min)**
  - Cp calculation and interpretation
  - Cpk calculation and interpretation
  - Pp and Ppk
  - Capability benchmarks
  - CI Master tool demo

- [ ] **Part 3: Worked Examples (40 min)**
  - 5 complete capability studies
  - Show all calculations
  - Interpret results
  - Make recommendations

**PRACTICE DATA:**
- [ ] 10 data sets with specifications
- [ ] Pre-calculated capability indices for validation

**QUIZ QUESTIONS NEEDED:** 15 questions (include calculations)

Example:
```
Process data: USL = 100, LSL = 80, Mean = 92, Std Dev = 2.5

Calculate:
a) Cp
b) Cpk
c) Is the process capable? (Cpk ≥ 1.33)
d) What % of parts fall outside specifications?

[Provide step-by-step solutions]
```

**RESOURCES:**
- [ ] Capability calculation worksheet
- [ ] 10 practice data sets

---

#### **Lesson 4.3: Analyze Phase Introduction (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Root Cause Analysis Techniques (90 min)**
  - 5 Whys methodology
  - Fishbone (Ishikawa) diagrams
  - Pareto charts
  - Correlation analysis intro
  - 4 detailed examples

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] Fishbone template
- [ ] 5 Whys template
- [ ] Example Pareto chart data

---

#### **Lesson 4.4: Improve & Control Overview (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: Solution Generation (45 min)**
  - Brainstorming techniques
  - Pugh matrix
  - Pilot testing
  - Implementation planning

- [ ] **Part 2: Control Plans (45 min)**
  - Control plan components
  - Reaction plans
  - Documentation
  - Sustaining improvements
  - 2 examples

**TEMPLATES TO CREATE:**
- [ ] Control plan template (Excel)
- [ ] 2 completed control plan examples

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] Solution selection matrix
- [ ] Control plan guide

---

#### **PRACTICAL EXERCISE 4: Process Capability Analysis**

**WHAT YOU NEED TO CREATE:**

- [ ] **Dataset:** 100 data points with specifications
- [ ] **Video Tutorial (15 min):** Using Capability Analysis tool
- [ ] **Instructions:** What to calculate and submit
- [ ] **Sample solution:** Complete analysis with interpretation

**Exercise Requirements:**
```
Given: Process data and specification limits

Student must:
1. Create histogram
2. Check for normality
3. Calculate Cp, Cpk, Pp, Ppk
4. Calculate % defects
5. Write 1-page interpretation
6. Make recommendations

Submission: Tool screenshots + analysis document
```

**GRADING RUBRIC:**
- [ ] Create detailed rubric

---

### **MODULE 5: CI TOOLS & TECHNIQUES**

**Estimated Hours:** 6.25 hours of video content

#### **Lesson 5.1: PDCA Cycle Deep Dive (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **PDCA Explained (90 min)**
  - Plan: Problem definition and planning
  - Do: Implementing on small scale
  - Check: Analyzing results
  - Act: Standardizing or adjusting
  - CI Master PDCA tool demo
  - 3 complete case examples

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] PDCA template
- [ ] 3 case study examples

---

#### **Lesson 5.2: Kaizen Events (90 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Kaizen Event Planning (90 min)**
  - What is a Kaizen event
  - When to use this approach
  - Pre-event preparation
  - 5-day event structure
  - Facilitation tips
  - Post-event follow-up
  - Real event documentation (photos/video)

**QUIZ QUESTIONS NEEDED:** 12 questions

**RESOURCES:**
- [ ] Kaizen event checklist
- [ ] Day-by-day agenda template
- [ ] Real event case study

---

#### **Lesson 5.3: Root Cause Analysis - 5 Whys (75 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **5 Whys Methodology (75 min)**
  - How to conduct 5 Whys
  - Asking good questions
  - Avoiding solutions in disguise
  - When you've reached root cause
  - 8 worked examples

**INTERACTIVE TOOL DATA:**
- [ ] 15 problem statements
- [ ] 5 Whys progression for each
- [ ] Root causes identified

**QUIZ QUESTIONS NEEDED:** 10 questions

**RESOURCES:**
- [ ] 5 Whys template
- [ ] Tips and tricks guide

---

#### **Lesson 5.4: A3 Problem Solving (120 minutes)**

**VIDEO REQUIREMENTS:**

- [ ] **Part 1: A3 Format (30 min)**
  - A3 sections explained
  - Left side (understand the problem)
  - Right side (solve the problem)
  - PDCA relationship

- [ ] **Part 2: Completing an A3 (60 min)**
  - Step-by-step walkthrough
  - Complete example creation on screen
  - Common mistakes

- [ ] **Part 3: A3 Reviews (30 min)**
  - Review 5 A3s on screen
  - Good vs bad examples
  - How to give feedback

**QUIZ QUESTIONS NEEDED:** 15 questions

**RESOURCES:**
- [ ] A3 template (advanced version)
- [ ] 5 A3 examples (various quality levels)
- [ ] A3 review checklist

---

#### **PRACTICAL EXERCISE 5: Complete PDCA Cycle**

**WHAT YOU NEED TO CREATE:**

- [ ] **Scenario:** Quality improvement project description
- [ ] **Data:** Before and after data
- [ ] **Video Tutorial (20 min):** Using PDCA Cycle Manager tool
- [ ] **Instructions:** Requirements for each PDCA phase
- [ ] **Sample solution:** Completed PDCA cycle

**Exercise Requirements:**
```
Given: Problem scenario with data

Student must:
1. Plan: Define problem, set goal, plan solution
2. Do: Document implementation (simulated)
3. Check: Analyze results
4. Act: Make recommendations

Submission: Exported PDCA cycle from tool
```

**GRADING RUBRIC:**
- [ ] Create rubric for each PDCA phase

---

### **FOUNDATION BELT FINAL ASSESSMENT**

#### **Written Examination (120 minutes, 50 questions)**

**QUIZ QUESTIONS TO CREATE:**

- [ ] **Module 1 Questions (10 questions)**
  - 3 on history and evolution
  - 3 on methodology selection
  - 2 on business case/ROI
  - 2 on industry applications

- [ ] **Module 2 Questions (10 questions)**
  - 3 on descriptive statistics (include calculations)
  - 3 on data visualization (show charts, ask interpretation)
  - 2 on normal distribution (include probability calculations)
  - 2 on hypothesis testing concepts

- [ ] **Module 3 Questions (10 questions)**
  - 3 on waste identification (show scenarios)
  - 2 on 5S (show images)
  - 3 on VSM (show maps, ask calculations)
  - 2 on Kanban concepts

- [ ] **Module 4 Questions (10 questions)**
  - 2 on Define phase (charter, SIPOC)
  - 3 on Measure phase (include Cp/Cpk calculations)
  - 3 on Analyze phase
  - 2 on Improve & Control

- [ ] **Module 5 Questions (10 questions)**
  - 3 on PDCA cycle
  - 2 on Kaizen events
  - 2 on 5 Whys
  - 3 on A3 problem solving

**EXAM SPECIFICATIONS:**
- Mix of multiple choice (35), true/false (10), calculation (5)
- Passing score: 70% (35/50)
- Time limit: 120 minutes
- Can use calculator and formula sheets

---

#### **Practical Assessment: Multi-Tool Project (4 hours)**

**WHAT YOU NEED TO CREATE:**

- [ ] **Scenario:** Complete process improvement case
  - Company background
  - Process description (detailed)
  - Current problems documented
  - Historical data (6 months)
  - Customer complaints
  - Financial impact

- [ ] **Dataset Package:**
  - Process time data (100+ points)
  - Quality data (defect rates, types)
  - Production volumes
  - Cost information

- [ ] **Requirements Document:**
  - Exactly what students must submit
  - Which tools to use (VSM, 5S, SPC, Capability, A3)
  - Format requirements
  - Word/page limits

- [ ] **Grading Rubric (100 points total):**
  ```
  Current State VSM (15 points)
  - Accuracy of map (8 pts)
  - Calculations correct (7 pts)

  5S Audit (10 points)
  - Audit completeness (5 pts)
  - Recommendations (5 pts)

  SPC Chart Analysis (15 points)
  - Chart setup (5 pts)
  - Rule violations identified (5 pts)
  - Interpretation (5 pts)

  Process Capability (20 points)
  - Cp/Cpk calculations (10 pts)
  - Interpretation and conclusions (10 pts)

  A3 Problem Solving (30 points)
  - Problem statement (5 pts)
  - Analysis quality (10 pts)
  - Solutions proposed (10 pts)
  - Implementation plan (5 pts)

  Overall Quality (10 points)
  - Professional presentation (5 pts)
  - Clarity of communication (5 pts)
  ```

- [ ] **Sample Solution:**
  - Complete all requirements yourself
  - This becomes the answer key for grading

---

### **FOUNDATION BELT CERTIFICATE**

**DESIGN REQUIREMENTS:**

- [ ] **Certificate Template (PDF/PowerPoint)**
  - Landscape orientation (11" x 8.5")
  - CI Master Academy branding/logo
  - Border design (professional, not overly decorative)
  - "Foundation Belt" or "White Belt" prominently displayed
  - Space for student name
  - Space for issue date
  - Space for verification code
  - Signature line (your signature or digital signature)
  - QR code area (I'll generate dynamically)

- [ ] **Badge Design (PNG, 500x500px)**
  - White Belt badge
  - Can be used on LinkedIn
  - Transparent background
  - CI Master Academy logo/branding

---

## 📕 PRACTITIONER BELT (YELLOW BELT)

**Target Audience:** Foundation Belt graduates  
**Total Duration:** 60-80 hours per specialization track  
**Certification Requirement:** Pass track exam + complete major capstone project

**NOTE:** You have 3 TRACKS. Choose ONE to create first, test it, then create the others.

---

### **TRACK 1: LEAN SPECIALIZATION**

#### **Course 1: Advanced Value Stream Mapping (10 hours)**

**VIDEOS TO CREATE:**

- [ ] **Lesson 1: Current State Mapping in Depth (150 min = 2.5 hours)**
  - Detailed VSM walkthrough (7-step process example)
  - Data collection methods
  - Interview techniques
  - Documentation best practices
  - Advanced symbols and notations
  - Complex branching/convergence
  - 3 complete industry examples

- [ ] **Lesson 2: Calculating Key Metrics (120 min = 2 hours)**
  - Lead time vs cycle time (deep dive)
  - Process Cycle Efficiency calculation
  - Takt time and pitch
  - Value-added ratio
  - Rolled throughput yield
  - Work through 10 different processes

- [ ] **Lesson 3: Future State Design (180 min = 3 hours)**
  - Improvement principles (8 principles)
  - Flow concepts
  - Pull system design
  - Leveling (heijunka)
  - Pacemaker process selection
  - Create future state for 3 examples

- [ ] **Lesson 4: Implementation Planning (90 min = 1.5 hours)**
  - Kaizen burst identification and prioritization
  - Creating action plans
  - Resistance management
  - Measuring progress
  - 2 complete implementation plans

**QUIZ QUESTIONS:** 52 questions total (13 per lesson)

**CAPSTONE PROJECT MATERIALS:**

- [ ] **Project Instructions (5 pages)**
  - Select real process from workplace (or use provided scenario)
  - Requirements for current state VSM
  - Metrics to calculate
  - Future state design requirements
  - Implementation plan requirements

- [ ] **Alternative Scenario** (for students without workplace access)
  - Complete process description (manufacturing line)
  - All data needed
  - Floor plan
  - Equipment specifications

- [ ] **Grading Rubric (100 points)**
  - Current state accuracy (25 pts)
  - Metrics calculations (20 pts)
  - Future state design (25 pts)
  - Implementation plan (20 pts)
  - Professional quality (10 pts)

- [ ] **Peer Review Guidelines**
  - What to look for
  - How to give constructive feedback
  - Review rubric

---

#### **Course 2: Kanban Systems Design (7 hours)**

**VIDEOS TO CREATE:**

- [ ] **Lesson 1: Kanban Calculations (120 min = 2 hours)**
  - Kanban card quantity formula explained
  - Variables: demand rate, lead time, safety stock
  - Container sizing
  - Work through 15 calculation examples
  - Sensitivity analysis

- [ ] **Lesson 2: WIP Limit Optimization (90 min = 1.5 hours)**
  - Theory of constraints review
  - Setting initial WIP limits
  - Tuning based on performance
  - Simulation demonstrations
  - 5 case examples

- [ ] **Lesson 3: Pull System Design (120 min = 2 hours)**
  - Push vs pull system comparison
  - Supermarket design and sizing
  - Replenishment strategies
  - Two-bin systems
  - Electronic Kanban
  - 3 complete system designs

- [ ] **Lesson 4: Performance Metrics (90 min = 1.5 hours)**
  - Lead time tracking
  - Throughput measurement
  - Flow efficiency
  - Cumulative flow diagrams
  - Cycle time distribution
  - CI Master Kanban metrics demo

**QUIZ QUESTIONS:** 44 questions total

**CAPSTONE PROJECT MATERIALS:**

- [ ] **Project Instructions**
  - Design complete Kanban system for scenario
  - Calculate card quantities
  - Set and justify WIP limits
  - Create visual board design
  - Document rules and procedures

- [ ] **Sample Calculations:**
  - Work through full system design yourself
  - Show all math
  - This is the answer key

- [ ] **Grading Rubric**

---

#### **Course 3: OEE Optimization (7 hours)**

**VIDEOS TO CREATE:**

- [ ] **Lesson 1: Understanding the Six Big Losses (120 min)**
  - Availability losses: breakdowns, setup/adjustments
  - Performance losses: small stops, slow cycles
  - Quality losses: startup rejects, production defects
  - Real examples with data for each
  - Loss categorization practice (20 scenarios)

- [ ] **Lesson 2: TPM Fundamentals (90 min)**
  - Total Productive Maintenance overview
  - 8 pillars of TPM
  - Autonomous maintenance steps
  - Planned maintenance systems
  - Implementation roadmap

- [ ] **Lesson 3: SMED Quick Changeover (120 min)**
  - Single-Minute Exchange of Die explained
  - Internal vs external setup activities
  - Conversion strategies
  - Parallel operations
  - Video analysis of actual changeover (before/after)
  - 3 detailed SMED case studies

- [ ] **Lesson 4: Advanced OEE Analysis (90 min)**
  - World Class OEE benchmarks (85%+)
  - Hidden losses
  - Time bucket analysis
  - Pareto of losses
  - Improvement prioritization
  - Compare 5 different machines/lines

**QUIZ QUESTIONS:** 47 questions total

**CAPSTONE PROJECT MATERIALS:**

- [ ] **OEE Dataset (1 month of data)**
  - Production logs (daily)
  - Downtime events (classified)
  - Quality data
  - Speed/cycle time data
  - Raw and clean versions

- [ ] **Project Instructions**
  - Calculate OEE, A, P, Q for each day
  - Create trend charts
  - Categorize all losses
  - Pareto analysis
  - Identify top 3 improvement areas
  - Develop action plan with ROI

- [ ] **Sample Solution**

- [ ] **Grading Rubric**

---

### **TRACK 2: SIX SIGMA SPECIALIZATION**

#### **Course 1: Advanced SPC (8 hours)**

**VIDEOS TO CREATE:**

- [ ] **Lesson 1: Control Chart Selection (90 min)**
  - Variables charts: X̄-R, X̄-S, I-MR
  - Attributes charts: p, np, c, u
  - Decision tree for selection
  - 20 scenarios - which chart to use?

- [ ] **Lesson 2: Subgroup Strategy (120 min)**
  - Rational subgrouping principles
  - Subgroup size determination
  - Sampling frequency
  - Common mistakes (bad subgrouping examples)
  - 5 case studies comparing approaches

- [ ] **Lesson 3: Advanced Control Rules (150 min)**
  - Western Electric Rules (all 4)
  - Nelson Rules (all 8)
  - Run test rules
  - Zone tests
  - Practice: identify violations in 20 charts

- [ ] **Lesson 4: Process Stability vs Capability (120 min)**
  - Stability first principle
  - What to do with unstable process
  - Special cause investigation
  - When to calculate capability
  - Full workflow demonstration
  - 5 complete analyses

**QUIZ QUESTIONS:** 49 questions total

**CAPSTONE PROJECT MATERIALS:**

- [ ] **Complete SPC Study Package**
  - Process description
  - 30 days of data (3 measurements/day)
  - Sampling plan details
  - Specification limits
  
- [ ] **Project Requirements**
  - Select appropriate control chart(s)
  - Create chart(s)
  - Analyze for stability
  - Identify any violations
  - Calculate capability (if stable)
  - Recommendations document
  
- [ ] **Grading Rubric**

---

#### **Course 2: DOE Basics (8 hours)**

**VIDEOS TO CREATE:**

- [ ] **Lesson 1: Experimental Design Principles (120 min)**
  - Factors, levels, responses
  - Randomization and why it matters
  - Replication
  - Blocking
  - Confounding
  - DOE terminology glossary
  - 10 example experiments analyzed

- [ ] **Lesson 2: Full Factorial Designs (150 min)**
  - 2^k designs explained
  - 2^2, 2^3, 2^4 examples
  - Calculating required runs
  - Designing the experiment
  - Run order randomization
  - Data collection forms
  - 5 complete designs

- [ ] **Lesson 3: Analyzing Main Effects (120 min)**
  - Main effects plots
  - Interaction effects plots
  - Significant vs insignificant effects
  - Using statistical software/CI Master tool
  - Analyze 5 different experiments

- [ ] **Lesson 4: Optimization Strategies (90 min)**
  - Finding optimal factor settings
  - Confirmation runs
  - Response surface methods (intro)
  - Multiple response optimization
  - 3 case studies with optimization

**QUIZ QUESTIONS:** 49 questions total

**CAPSTONE PROJECT MATERIALS:**

- [ ] **DOE Project Package**
  - Problem scenario (process to optimize)
  - 2-3 factors to study
  - Response variable(s)
  - Experimental results data

- [ ] **Project Requirements**
  - Design the experiment (factor matrix)
  - Create run sheet
  - Analyze provided results
  - Determine optimal settings
  - Predict performance at optimal
  - Plan confirmation runs

- [ ] **Sample Solution with Analysis**

- [ ] **Grading Rubric**

---

### **TRACK 3: CI INTEGRATION SPECIALIZATION**

#### **Course 1: Project Management Fundamentals (8 hours)**

**VIDEOS TO CREATE:**

- [ ] **Module: DMAIC Project Management (8 hours total)**
  - Project selection and prioritization (90 min)
  - Team formation and roles (60 min)
  - Project charter deep dive (90 min)
  - Stakeholder analysis and management (90 min)
  - Communication plans (60 min)
  - Risk management in CI projects (90 min)
  - Change management strategies (90 min)
  - Project tracking and reporting (60 min)

**QUIZ QUESTIONS:** 80 questions

**CAPSTONE:** Manage a mock project from start to finish

---

#### **Course 2: Data-Driven Decision Making (8 hours)**

**VIDEOS TO CREATE:**

- [ ] **Module: Multi-Methodology Analysis (8 hours total)**
  - When to combine Lean + Six Sigma (90 min)
  - Tool selection decision matrix (60 min)
  - Sequential tool application (120 min)
  - Data integration across tools (90 min)
  - Complex problem-solving workflows (120 min)
  - 5 detailed case studies (120 min)

**QUIZ QUESTIONS:** 70 questions

**CAPSTONE:** Solve complex problem using multiple methodologies

---

#### **Course 3: Team Leadership in CI (8 hours)**

**VIDEOS TO CREATE:**

- [ ] **Module: Leadership Skills (8 hours total)**
  - Facilitating improvement teams (90 min)
  - Meeting facilitation techniques (60 min)
  - Overcoming resistance to change (120 min)
  - Building continuous improvement culture (90 min)
  - Coaching and mentoring (90 min)
  - Expert interviews (3 x 30 min)
  - Conflict resolution (60 min)

**ASSIGNMENT:** Leadership reflection paper + peer coaching exercise

---

### **PRACTITIONER BELT FINAL ASSESSMENT**

#### **Written Exam**

- [ ] **40 questions** (track-specific)
- [ ] Passing score: 75%
- [ ] Time limit: 90 minutes

**Question Distribution:**
- 15 questions on advanced concepts from track
- 15 questions on application/scenarios
- 10 calculation/analysis questions

---

#### **Major Capstone Project**

**REQUIREMENTS DOCUMENT TO CREATE:**

- [ ] **Project Scope (5 pages)**
  - Student must solve real workplace problem
  - OR use complex provided scenario
  - Must use minimum 5 different CI Master tools
  - Must apply full methodology (DMAIC or Lean)
  - Must document complete journey
  - Must create executive presentation

- [ ] **Alternative Scenario** (for students without workplace)
  - Complete case study (10 pages)
  - All data needed
  - Background information
  - Financial impact details

- [ ] **Deliverables List**
  - Written report (15-20 pages)
  - Executive presentation (10-15 slides)
  - Tool outputs (exported files)
  - Implementation plan
  - Financial analysis

- [ ] **Grading Rubric (100 points)**
  ```
  Problem Definition (10 pts)
  Baseline Analysis (15 pts)
  Root Cause Analysis (15 pts)
  Solution Development (15 pts)
  Implementation Plan (15 pts)
  Tool Proficiency (15 pts)
  Communication Quality (10 pts)
  Overall Impact (5 pts)
  ```

- [ ] **Peer Review Requirements**
  - Each student reviews 3 peer projects
  - Detailed feedback form
  - Scoring guide

---

### **PRACTITIONER BELT CERTIFICATE & BADGE**

- [ ] **Certificate Template** (similar to Foundation, but "Practitioner Belt" or "Yellow Belt")
- [ ] **Specialization Badge** (3 versions: Lean, Six Sigma, CI Integration)
- [ ] **LinkedIn Badge Graphics** (500x500px PNG)

---

## 📦 ASSETS & RESOURCES

### **General Resources to Create**

- [ ] **CI Master Academy Intro Video (5 min)**
  - Welcome message
  - How the academy works
  - Navigation guide
  - Support resources

- [ ] **Tool Integration Videos (10 videos, 5-10 min each)**
  - A3 Problem Solver tool walkthrough
  - PDCA Cycle Manager walkthrough
  - 5S Audit Tool walkthrough
  - VSM Tool walkthrough
  - Kanban Board walkthrough
  - OEE Calculator walkthrough
  - SPC Chart tool walkthrough
  - Process Capability tool walkthrough
  - Hypothesis Testing tool walkthrough
  - DOE Designer walkthrough

- [ ] **Formula Reference Sheets (PDFs)**
  - All statistics formulas
  - All capability formulas
  - All VSM calculations
  - All OEE calculations
  - All DOE formulas

- [ ] **Industry Case Study Library (15 case studies)**
  - 5 manufacturing cases
  - 5 healthcare cases
  - 5 service industry cases
  
  For each case, provide:
  - Background (2 pages)
  - Problem description (1 page)
  - Data (Excel file)
  - Solution approach (3 pages)
  - Results with metrics (1 page)
  - Photos/diagrams (5-10 images)

- [ ] **Photo/Video Library**
  - 50+ photos of waste examples
  - 30+ before/after 5S photos
  - 20+ process photos
  - 10+ facility tour videos (2-3 min each)
  - 5+ problem-solving session recordings

---

## 📤 DELIVERY FORMAT

### **How to Organize and Send Content to Me**

**Create this folder structure:**

```
CI_Master_Academy_Content/
│
├── Foundation_Belt/
│   ├── Module_1_Process_Improvement/
│   │   ├── Videos/
│   │   │   ├── 1.1_History_Part1.mp4
│   │   │   ├── 1.1_History_Part2.mp4
│   │   │   └── ...
│   │   ├── Quizzes/
│   │   │   ├── 1.1_Quiz.json
│   │   │   └── ...
│   │   ├── Resources/
│   │   │   ├── Timeline_Infographic.pdf
│   │   │   └── ...
│   │   └── README.md (notes about this module)
│   │
│   ├── Module_2_Statistics/
│   ├── Module_3_Lean/
│   ├── Module_4_Six_Sigma/
│   ├── Module_5_CI_Tools/
│   └── Final_Assessment/
│
├── Practitioner_Belt/
│   ├── Lean_Track/
│   ├── Six_Sigma_Track/
│   └── CI_Integration_Track/
│
├── Templates/
│   ├── A3_Template.pptx
│   ├── SIPOC_Template.xlsx
│   └── ...
│
├── Case_Studies/
│   ├── Manufacturing/
│   ├── Healthcare/
│   └── Service/
│
├── Media_Library/
│   ├── Photos/
│   └── Videos/
│
└── CONTENT_INDEX.xlsx (master tracking spreadsheet)
```

### **Content Index Spreadsheet**

Create Excel file with these tabs:

**Tab 1: Videos**
| ID | Module | Lesson | Title | Duration | Status | File Name | Notes |
|----|--------|--------|-------|----------|--------|-----------|-------|
| V001 | 1.1 | 1 | History Part 1 | 30:00 | Done | 1.1_History_Part1.mp4 | |

**Tab 2: Quizzes**
| ID | Module | Lesson | Questions | Status | File Name | Notes |
|----|--------|--------|-----------|--------|-----------|-------|
| Q001 | 1.1 | 1 | 10 | Done | 1.1_Quiz.json | |

**Tab 3: Exercises**
| ID | Module | Exercise | Status | Files | Notes |
|----|--------|----------|--------|-------|-------|
| E001 | 1 | A3 Problem Statement | Done | Instructions.pdf, Template.pptx, Example.pdf, Rubric.pdf | |

**Tab 4: Resources**
| ID | Type | Title | Status | File Name |
|----|------|-------|--------|-----------|
| R001 | PDF | Timeline Infographic | Done | Timeline.pdf |

---

## ✅ CONTENT CHECKLIST

### **Foundation Belt - Module 1**
- [ ] Lesson 1.1 - 3 videos (90 min total)
- [ ] Lesson 1.1 - 10 quiz questions
- [ ] Lesson 1.1 - 2 PDF resources
- [ ] Lesson 1.2 - 1 video (60 min)
- [ ] Lesson 1.2 - 10 scenarios for interactive tool
- [ ] Lesson 1.2 - 8 quiz questions
- [ ] Lesson 1.2 - 2 PDF resources
- [ ] Lesson 1.3 - 2 videos (90 min total)
- [ ] Lesson 1.3 - 3 Excel tools
- [ ] Lesson 1.3 - 12 quiz questions
- [ ] Lesson 1.3 - 2 resources
- [ ] Lesson 1.4 - 3 videos (60 min total)
- [ ] Lesson 1.4 - 3 case studies
- [ ] Lesson 1.4 - 8 quiz questions
- [ ] Exercise 1 - A3 Problem Statement (all materials)

### **Foundation Belt - Module 2**
- [ ] Lesson 2.1 - 3 videos (90 min)
- [ ] Lesson 2.1 - 15 sample datasets
- [ ] Lesson 2.1 - 15 quiz questions
- [ ] Lesson 2.1 - 3 PDF resources
- [ ] Lesson 2.2 - 1 video (75 min)
- [ ] Lesson 2.2 - 10 datasets for charting
- [ ] Lesson 2.2 - 12 quiz questions
- [ ] Lesson 2.2 - 1 flowchart PDF
- [ ] Lesson 2.3 - 1 video (90 min)
- [ ] Lesson 2.3 - 20 probability problems
- [ ] Lesson 2.3 - 15 quiz questions
- [ ] Lesson 2.3 - Z-table PDF
- [ ] Lesson 2.4 - 3 videos (120 min)
- [ ] Lesson 2.4 - 5 datasets for t-tests
- [ ] Lesson 2.4 - 18 quiz questions
- [ ] Lesson 2.4 - 2 PDF resources
- [ ] Exercise 2 - SPC Chart Analysis (all materials)

### **Foundation Belt - Module 3**
- [ ] Lesson 3.1 - 1 video covering all 8 wastes (120 min)
- [ ] Lesson 3.1 - 30 waste scenarios
- [ ] Lesson 3.1 - 20 quiz questions
- [ ] Lesson 3.1 - 20+ waste photos
- [ ] Lesson 3.1 - 3 PDF resources
- [ ] Lesson 3.2 - 1 video (90 min)
- [ ] Lesson 3.2 - 5 before/after photo sets
- [ ] Lesson 3.2 - 10 audit photos
- [ ] Lesson 3.2 - 12 quiz questions
- [ ] Lesson 3.2 - Audit template
- [ ] Lesson 3.3 - 3 videos (150 min)
- [ ] Lesson 3.3 - 3 practice VSMs
- [ ] Lesson 3.3 - 15 quiz questions
- [ ] Lesson 3.3 - 3 PDF resources
- [ ] Lesson 3.4 - 1 video (90 min)
- [ ] Lesson 3.4 - 12 quiz questions
- [ ] Lesson 3.4 - 3 PDF resources
- [ ] Exercise 3 - 5S Audit + VSM (all materials)

### **Foundation Belt - Module 4**
- [ ] Lesson 4.1 - 2 videos (90 min)
- [ ] Lesson 4.1 - 4 templates with examples
- [ ] Lesson 4.1 - 12 quiz questions
- [ ] Lesson 4.2 - 3 videos (120 min)
- [ ] Lesson 4.2 - 10 practice datasets
- [ ] Lesson 4.2 - 15 quiz questions
- [ ] Lesson 4.2 - 2 worksheets
- [ ] Lesson 4.3 - 1 video (90 min)
- [ ] Lesson 4.3 - 12 quiz questions
- [ ] Lesson 4.3 - 3 templates
- [ ] Lesson 4.4 - 2 videos (90 min)
- [ ] Lesson 4.4 - 12 quiz questions
- [ ] Lesson 4.4 - 2 templates
- [ ] Exercise 4 - Capability Analysis (all materials)

### **Foundation Belt - Module 5**
- [ ] Lesson 5.1 - 1 video (90 min)
- [ ] Lesson 5.1 - 12 quiz questions
- [ ] Lesson 5.1 - 3 case studies
- [ ] Lesson 5.2 - 1 video (90 min)
- [ ] Lesson 5.2 - 12 quiz questions
- [ ] Lesson 5.2 - 2 templates
- [ ] Lesson 5.3 - 1 video (75 min)
- [ ] Lesson 5.3 - 15 problem scenarios
- [ ] Lesson 5.3 - 10 quiz questions
- [ ] Lesson 5.3 - 1 template
- [ ] Lesson 5.4 - 3 videos (120 min)
- [ ] Lesson 5.4 - 5 A3 examples
- [ ] Lesson 5.4 - 15 quiz questions
- [ ] Lesson 5.4 - 2 templates
- [ ] Exercise 5 - PDCA Cycle (all materials)

### **Foundation Belt - Final Assessment**
- [ ] Written exam - 50 questions (distributed as specified)
- [ ] Practical assessment - complete scenario package
- [ ] Practical assessment - dataset package
- [ ] Practical assessment - requirements document
- [ ] Practical assessment - grading rubric (100 pts)
- [ ] Practical assessment - sample solution
- [ ] Certificate template
- [ ] Badge design

### **Practitioner Belt - Lean Track**
- [ ] Course 1 - 4 videos (10 hours)
- [ ] Course 1 - 52 quiz questions
- [ ] Course 1 - Capstone materials
- [ ] Course 2 - 4 videos (7 hours)
- [ ] Course 2 - 44 quiz questions
- [ ] Course 2 - Capstone materials
- [ ] Course 3 - 4 videos (7 hours)
- [ ] Course 3 - 47 quiz questions
- [ ] Course 3 - Capstone materials

### **Practitioner Belt - Six Sigma Track**
- [ ] Course 1 - 4 videos (8 hours)
- [ ] Course 1 - 49 quiz questions
- [ ] Course 1 - Capstone materials
- [ ] Course 2 - 4 videos (8 hours)
- [ ] Course 2 - 49 quiz questions
- [ ] Course 2 - Capstone materials

### **Practitioner Belt - CI Integration Track**
- [ ] Course 1 - Videos (8 hours)
- [ ] Course 1 - 80 quiz questions
- [ ] Course 1 - Capstone materials
- [ ] Course 2 - Videos (8 hours)
- [ ] Course 2 - 70 quiz questions
- [ ] Course 2 - Capstone materials
- [ ] Course 3 - Videos (8 hours)
- [ ] Course 3 - Assignments

### **Practitioner Belt - Final Assessment**
- [ ] Track-specific exam - 40 questions
- [ ] Major capstone - complete requirements package
- [ ] Major capstone - alternative scenario
- [ ] Major capstone - grading rubric
- [ ] Major capstone - peer review guidelines
- [ ] Certificate template (with specialization)
- [ ] 3 specialization badge designs

### **General Assets**
- [ ] Academy intro video (5 min)
- [ ] 10 tool walkthrough videos
- [ ] 5 formula reference sheets
- [ ] 15 industry case studies
- [ ] 50+ waste photos
- [ ] 30+ before/after photos
- [ ] 20+ process photos
- [ ] 10+ facility videos

---

## 🎬 PRODUCTION TIPS

### **For Videos:**
1. **Script first** - Write out what you'll say
2. **Keep it concise** - Aim for 15-20 min per video max
3. **Use visuals** - Show examples, diagrams, photos
4. **Demonstrate tools** - Screen record the CI Master tools
5. **Test audio** - Record 30 seconds, listen before full recording
6. **Natural pace** - Speak clearly but conversationally
7. **Pause between sections** - Makes editing easier

### **For Quizzes:**
1. **Clear questions** - No ambiguity
2. **4 options** for multiple choice (one clearly correct, others plausible)
3. **Detailed explanations** - Teach in the feedback
4. **Mix difficulty** - Easy, medium, hard questions
5. **Realistic scenarios** - Use real-world examples
6. **Test yourself** - Make sure answers are definitely correct

### **For Exercises:**
1. **Clear instructions** - Step-by-step what to do
2. **Real data** - Use actual process data (anonymize if needed)
3. **Rubric first** - Know how you'll grade before creating
4. **Do it yourself** - Complete the exercise to create answer key
5. **Estimate time** - How long should it take?

---

## 📊 PROGRESS TRACKING

Use this table to track your progress:

| Phase | Items | Completed | Percentage | Status |
|-------|-------|-----------|------------|--------|
| Foundation Belt - Module 1 | 49 items | 0 | 0% | Not Started |
| Foundation Belt - Module 2 | 47 items | 0 | 0% | Not Started |
| Foundation Belt - Module 3 | 45 items | 0 | 0% | Not Started |
| Foundation Belt - Module 4 | 43 items | 0 | 0% | Not Started |
| Foundation Belt - Module 5 | 35 items | 0 | 0% | Not Started |
| Foundation Belt - Final | 7 items | 0 | 0% | Not Started |
| Practitioner - Lean | 9 items | 0 | 0% | Not Started |
| Practitioner - Six Sigma | 6 items | 0 | 0% | Not Started |
| Practitioner - CI Integration | 6 items | 0 | 0% | Not Started |
| Practitioner - Final | 6 items | 0 | 0% | Not Started |
| General Assets | 14 items | 0 | 0% | Not Started |
| **TOTAL** | **267 items** | **0** | **0%** | **Not Started** |

---

## 🚀 WHEN YOU'RE READY

**Send me:**
1. Folder structure with all files organized
2. Content index spreadsheet
3. Any notes or special instructions
4. Video hosting URLs (if videos uploaded to YouTube/Vimeo)

**I will:**
1. Integrate all content into the platform
2. Create video player with your URLs
3. Import all quiz questions
4. Set up all exercises with auto-grading
5. Configure the learning paths
6. Generate certificates dynamically
7. Test everything
8. Deploy to production

---

## ❓ QUESTIONS?

As you create content, if you have questions about:
- Technical specifications
- How something will work in the platform
- Best practices for e-learning
- Alternative approaches

**Document your questions** and send them with your content. I'll answer everything and make adjustments as needed.

---

**Good luck with content creation! This will be an amazing academy when complete! 🎓**
