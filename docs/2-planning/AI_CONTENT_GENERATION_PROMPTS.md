# 🤖 AI CONTENT GENERATION PROMPTS

## 📋 HOW TO USE THESE PROMPTS

**Purpose:** Copy-paste these prompts to ChatGPT, Claude, or any AI agent to generate all your written content automatically.

**Recommended Approach:**
1. **Use Section-by-Section Prompts** (more reliable, better quality)
2. Generate one section at a time
3. Review and refine each section
4. Paste completed content into `WRITTEN_CONTENT_TASKS.md`

---

## 🎯 MASTER PROMPT (Generate Everything at Once)

**⚠️ Warning:** This prompt generates a LOT of content. May hit token limits. Better to use section-by-section prompts below.

```
I'm creating a world-class online training academy for Continuous Improvement, Lean, and Six Sigma. I need you to act as an expert instructional designer and CI/Lean Six Sigma Master Black Belt to help me create all the written content for the Foundation Belt (White Belt) curriculum.

**CONTEXT:**
- Target Audience: Beginners with no prior CI/Lean/Six Sigma experience
- Goal: Take students from zero to confident CI practitioners
- Certification: Foundation Belt (White Belt) upon completion
- Total Content: 5 courses, 21 lessons, 105 quiz questions, 5 exercises, 5 case studies, 10 templates

**YOUR EXPERTISE:**
You have:
- 15+ years of Lean Six Sigma experience
- Master Black Belt certification (ASQ)
- Experience teaching at Fortune 500 companies
- Created 50+ online courses
- Published author on CI topics

**TASK:**
I've attached a detailed task file (`WRITTEN_CONTENT_TASKS.md`) that outlines EVERYTHING I need. Please read it carefully and generate ALL the content specified, including:

1. Course descriptions (short & full) for 5 courses
2. Learning objectives for all modules (~80 objectives)
3. Lesson descriptions for 21 lessons
4. Quiz questions (105 questions in JSON format)
5. Practical exercise instructions (5 exercises)
6. Case studies (5 comprehensive case studies)
7. Template designs (10 templates)
8. Video scripts/transcripts (21 scripts)

**QUALITY STANDARDS:**
- Professional, engaging, conversational tone
- Practical, real-world examples
- Based on industry best practices (Toyota, GE, Motorola)
- Reference actual methodologies (not generic advice)
- Include statistics and data where relevant
- Make it actionable and immediately useful

**FORMAT:**
Follow the exact format specified in the task file. Use [WRITE HERE] placeholders as guides for what content to create.

Please start with Course 1 and work through systematically. Generate complete, production-ready content that I can immediately use in my Learning Management System.

Are you ready? Let's begin with Course 1: Introduction to Process Improvement.
```

---

## 📚 SECTION-BY-SECTION PROMPTS (RECOMMENDED)

### **PROMPT 1: Course Descriptions**

```
I'm creating a Continuous Improvement online academy and need compelling course descriptions for the Foundation Belt (White Belt) curriculum.

**YOUR ROLE:**
You are an expert instructional designer and Lean Six Sigma Master Black Belt with 15+ years of experience and a talent for writing engaging, benefit-focused course descriptions.

**TASK:**
Write course descriptions for the following 5 courses:

1. **Introduction to Process Improvement**
2. **Basic Statistics for CI**
3. **Lean Fundamentals**
4. **Lean Fundamentals**
5. **Six Sigma DMAIC Overview**
6. **Core CI Tools & Techniques**

For EACH course, provide:

**A) Short Description (1-2 sentences, ~30-50 words)**
- Compelling hook that grabs attention
- Clear benefit statement
- What they'll be able to DO after completion

**B) Full Description (3-5 paragraphs, ~200-300 words)**
Include:
- What the course covers (topics/modules)
- Who it's for (target audience)
- What students will achieve (outcomes)
- Prerequisites (if any)
- Time commitment
- Why this matters in their career

**C) Instructor Bio (2-3 sentences)**
[Customize this for yourself, but provide a template]

**TONE:**
- Professional but conversational
- Benefit-focused (not feature-focused)
- Inspiring and motivating
- Real-world focused

**EXAMPLE FORMAT:**

### Course 1: Introduction to Process Improvement

**Short Description:**
"Discover the fundamentals of Continuous Improvement, Lean, and Six Sigma. Learn why process improvement drives business success and how you can become a change agent in your organization."

**Full Description:**
[3-5 compelling paragraphs]

Now, please create all 5 course descriptions following this format.
```

---

### **PROMPT 2: Learning Objectives**

```
I need you to write comprehensive learning objectives for my CI Master Academy Foundation Belt curriculum.

**YOUR ROLE:**
Expert instructional designer specializing in learning objectives that follow Bloom's Taxonomy and are measurable, specific, and action-oriented.

**CONTEXT:**
I have 5 courses in the Foundation Belt:

**Course 1: Introduction to Process Improvement**
- Module 1.1: History & Evolution of CI
- Module 1.2: Business Case for CI
- Module 1.3: CI Culture & Leadership
- Module 1.4: Overview of Lean Principles
- Module 1.5: Overview of Six Sigma Principles

**Course 2: Basic Statistics for CI**
- Module 2.1: Types of Data
- Module 2.2: Descriptive Statistics
- Module 2.3: Data Visualization
- Module 2.4: Normal Distribution & Probability

**Course 3: Lean Fundamentals**
- Module 3.1: The 8 Wastes (DOWNTIME)
- Module 3.2: 5S Methodology
- Module 3.3: Value Stream Mapping Basics
- Module 3.4: Kanban & Pull Systems

**Course 4: Six Sigma DMAIC Overview**
- Module 4.1: Define Phase
- Module 4.2: Measure Phase
- Module 4.3: Analyze Phase
- Module 4.4: Improve & Control Phases

**Course 5: Core CI Tools & Techniques**
- Module 5.1: PDCA Cycle
- Module 5.2: Kaizen Events
- Module 5.3: 5 Whys & Root Cause Analysis
- Module 5.4: A3 Problem Solving

**TASK:**
For EACH module above, write 3-5 learning objectives.

**FORMAT:**
Each objective must:
- Start with an action verb (Apply, Analyze, Calculate, Create, Evaluate, Identify, Explain, etc.)
- Be specific and measurable
- Focus on what students will BE ABLE TO DO (not "understand" or "learn about")
- Be realistic for a beginner-level course

**EXAMPLE:**
Module 1.1: History & Evolution of CI
1. "Trace the evolution of process improvement from Frederick Taylor's Scientific Management to modern Lean Six Sigma"
2. "Identify the key contributions of Deming, Juran, and Ohno to modern CI methodologies"
3. "Explain how Toyota Production System influenced global manufacturing practices"
4. "Compare and contrast the historical development of Lean vs Six Sigma approaches"

Now, please create 3-5 learning objectives for ALL modules listed above.
```

---

### **PROMPT 3: Quiz Questions**

```
I need you to create high-quality quiz questions for my CI Master Academy.

**YOUR ROLE:**
Expert assessment designer with deep knowledge of Continuous Improvement, Lean, and Six Sigma. You create quiz questions that test understanding (not memorization) and provide teachable explanations.

**TASK:**
Create quiz questions for Course 1, Module 1.1: "History & Evolution of CI"

I need **5 multiple-choice questions** in this exact JSON format:

```json
{
  "question": "Your question text here?",
  "type": "multiple_choice",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correct_answer": 0,
  "explanation": "Detailed explanation of why the correct answer is correct and why other options are wrong. This should TEACH, not just confirm.",
  "difficulty": "beginner",
  "learning_objective": "LO-1.1",
  "estimated_time_seconds": 45
}
```

**QUALITY CRITERIA:**
- Avoid trick questions
- All distractors (wrong answers) should be plausible
- Explanation should provide additional learning (200-300 words)
- Use real-world scenarios when possible
- Test understanding and application, not memorization
- Beginner-friendly language

**TOPICS TO COVER:**
1. Frederick Taylor & Scientific Management
2. W. Edwards Deming & Total Quality Management
3. Toyota Production System & Taiichi Ohno
4. Motorola & Six Sigma origins
5. Evolution of Lean Six Sigma

Please create 5 quiz questions now.

[AFTER RECEIVING THESE 5, REPEAT FOR EACH MODULE]
```

---

### **PROMPT 4: Practical Exercises**

```
I need detailed practical exercise instructions for my CI Master Academy.

**YOUR ROLE:**
Expert instructional designer and Lean Six Sigma practitioner who creates hands-on, real-world exercises that solidify learning.

**TASK:**
Create a comprehensive practical exercise for Course 3, Module 3.1: "The 8 Wastes (DOWNTIME)"

**EXERCISE TITLE:** "Identify Wastes in Your Workplace"

**WHAT TO CREATE:**

**1. Instructions (300-500 words)**
Write detailed, step-by-step instructions that guide students through:
- What they need to do
- How to approach the exercise
- What to observe/document
- How to submit their work

**2. Deliverable Description**
Clearly specify what students will submit (e.g., "A completed Waste Identification Template (Excel) with 8 examples")

**3. Grading Criteria**
Provide clear rubric with percentages:
- Accuracy of waste identification (40%)
- Quality of explanation (30%)
- Practicality of improvement suggestions (30%)

**4. Template Outline**
Describe what the Excel template should include (columns, dropdowns, etc.)

**5. Example Scenario**
Provide 1-2 example wastes with complete documentation as a model

**CONTEXT:**
The 8 Wastes (DOWNTIME) are:
- Defects
- Overproduction
- Waiting
- Non-utilized talent
- Transportation
- Inventory
- Motion
- Extra-processing

Students have just learned about these in the video lesson. Now they need to apply this to their own workplace or a familiar process.

Please create the complete exercise now.
```

---

### **PROMPT 5: Case Studies**

```
I need compelling, real-world case studies for my CI Master Academy.

**YOUR ROLE:**
Expert business writer and Lean Six Sigma practitioner with access to real-world case studies from Toyota, GE, Motorola, and other industry leaders.

**TASK:**
Write a comprehensive case study on "Toyota's Lean Journey"

**FORMAT:**

**Case Study Title:** Toyota's Lean Journey: From Post-War Japan to Global Manufacturing Leader

**Structure (800-1200 words total):**

1. **Background/Context (150-200 words)**
   - Toyota's situation post-WWII
   - Resource constraints in Japan
   - Competition with American automakers

2. **Problem Statement (100-150 words)**
   - Specific challenges Toyota faced
   - Why traditional mass production wouldn't work

3. **What They Did - Methodology (400-500 words)**
   - Taiichi Ohno's innovations
   - Just-In-Time manufacturing
   - Jidoka (automation with human touch)
   - Kaizen culture
   - Respect for people
   - Specific tools/techniques implemented

4. **Results/Outcomes (150-200 words)**
   - Quantifiable improvements
   - Market share growth
   - Quality metrics (defects per vehicle)
   - Efficiency gains

5. **Key Learnings (100-150 words)**
   - What other companies can learn
   - Universal principles vs. Toyota-specific practices

**Discussion Questions (5 questions):**
Create 5 thought-provoking questions that prompt critical thinking

**QUALITY:**
- Use real data and statistics
- Cite specific years and figures
- Professional business writing style
- Engaging storytelling
- Balance detail with readability

Please write the complete case study now.
```

---

### **PROMPT 6: Template Design Specifications**

```
I need detailed specifications for creating Excel/PowerPoint templates for my CI Master Academy.

**YOUR ROLE:**
Expert process improvement practitioner who has created 100+ templates for Fortune 500 companies. You know what makes a template user-friendly, professional, and practical.

**TASK:**
Provide detailed design specifications for the "DMAIC Project Charter Template"

**FORMAT:**

**Template Name:** DMAIC Project Charter
**File Type:** Excel (.xlsx)
**Purpose:** Help students structure and document their Six Sigma improvement projects

**LAYOUT SPECIFICATIONS:**

**1. Tab Structure**
- Tab 1: "Instructions" (how to use the template)
- Tab 2: "Project Charter" (main template)
- Tab 3: "Example" (completed charter as reference)

**2. Project Charter Tab - Sections:**

For EACH section below, specify:
- Section title
- Cell range (e.g., A1:H5)
- Field type (text box, dropdown, date picker, etc.)
- Validation rules (if any)
- Help text/placeholder
- Formatting (bold, colors, borders)

**Sections:**
1. Project Title & ID
2. Problem Statement (SMART format)
3. Goal Statement (quantifiable)
4. Business Case (financial impact)
5. Scope (In-Scope / Out-of-Scope table)
6. Project Team (roles & names)
7. Timeline/Milestones (Gantt-style)
8. Expected Benefits (financial & non-financial)
9. Key Metrics (baseline, target, actual)
10. Stakeholder Matrix
11. Approval Section (signatures & dates)

**3. Design Guidelines:**
- Color scheme: Professional (blue/gray)
- Font: Calibri 11pt for body, 14pt for headers
- Print-friendly: Fits on 2-3 pages
- Cell protection: Lock formula cells
- Instructions visible via comments/notes

**4. Example Data:**
Provide sample data for the "Example" tab showing a completed charter for a realistic project

Please provide the complete specifications now.
```

---

### **PROMPT 7: Video Scripts**

```
I need engaging video scripts for my CI Master Academy lessons.

**YOUR ROLE:**
Expert video script writer and Lean Six Sigma Master Black Belt. You write conversational, engaging scripts that work perfectly for online learning videos. Your scripts are 80% what the instructor will say, 20% production notes.

**TASK:**
Write a video script for "Lesson 1.1: History & Evolution of CI"

**VIDEO SPECIFICATIONS:**
- Duration: 10-12 minutes
- Target: Complete beginners
- Style: Educational but conversational (like TED Talk, not lecture)
- Slides: Will show slides (indicate when)

**SCRIPT FORMAT:**

```
[INTRO - 1 minute]
[Production Note: Instructor on camera, friendly smile, academy backdrop]

Hey there! Welcome to CI Master Academy! I'm [Your Name], and I'm so excited to have you here for your very first lesson in our Foundation Belt program.

[Slide 1: "History & Evolution of CI" title slide]

Today, we're going to take a fascinating journey through time—over 100 years of process improvement history. And I promise, this won't be a boring history lesson. This is the story of how regular people revolutionized the way we work, and how those ideas can help YOU improve processes in your workplace TODAY.

[Slide 2: Timeline graphic from 1900-2020]

By the end of this lesson, you'll understand where Lean, Six Sigma, and Continuous Improvement came from, and more importantly, WHY they work so well.

Let's dive in!

---

[SECTION 1: Scientific Management - 3 minutes]
[Production Note: Show historical photo of Frederick Taylor]

Our story begins in 1911 with a man named Frederick Winslow Taylor...

[Continue script...]
```

**STRUCTURE:**
1. **Intro (1 min):** Hook, welcome, learning objectives
2. **Section 1 (3 min):** Frederick Taylor & Scientific Management
3. **Section 2 (3 min):** Deming, Juran & TQM in Post-War Japan
4. **Section 3 (3 min):** Toyota Production System & Lean
5. **Section 4 (2 min):** Six Sigma at Motorola & GE
6. **Conclusion (1 min):** Recap, next lesson preview, call-to-action

**WRITING STYLE:**
- Conversational ("you" and "I", not "one" or "students")
- Short sentences and paragraphs
- Include analogies and real-world examples
- Rhetorical questions to engage viewer
- Enthusiasm without being cheesy
- Production notes in [brackets]
- Slide cues: [Slide X: Description]

**CONTENT REQUIREMENTS:**
- Historically accurate dates and facts
- Include 3-5 "interesting facts" or stories
- Name drop key figures (Taylor, Deming, Juran, Ohno, etc.)
- Explain WHY each development mattered
- Connect past to present

Please write the complete 10-12 minute script now (approximately 1,200-1,500 words).
```

---

## 🔄 ITERATIVE PROMPTS (For Refinement)

### **After Receiving Generated Content:**

```
This is great! Can you refine [SECTION NAME] by:
1. Making it more specific/actionable
2. Adding 2-3 real-world examples
3. Simplifying the language for beginners
4. Adding more data/statistics
5. Making it more engaging/conversational
```

### **If Content is Too Generic:**

```
This content feels too generic. Please rewrite with:
- Specific examples from Toyota, GE, Motorola
- Actual data points and statistics
- Industry-specific terminology (Lean Six Sigma vocabulary)
- Reference to actual methodologies (DMAIC, VSM, 5S, etc.)
- Real case study numbers and outcomes
```

### **If Content is Too Technical:**

```
This is too advanced for beginners. Please rewrite for someone with:
- No prior CI/Lean/Six Sigma knowledge
- Basic business understanding
- Need for simple explanations and analogies
- Appreciation for "why this matters to me"
```

---

## 📋 BATCH GENERATION WORKFLOW

**Recommended approach to generate all content efficiently:**

### **Week 1: Descriptions & Objectives**
```
Day 1: Use Prompt 1 → Get all 5 course descriptions
Day 2: Use Prompt 2 → Get all 80 learning objectives
Day 3: Review and refine
```

### **Week 2: Quiz Questions**
```
Day 1: Use Prompt 3 → Generate Course 1 questions (25 questions)
Day 2: Course 2 questions (20 questions)
Day 3: Course 3 questions (20 questions)
Day 4: Course 4 questions (20 questions)
Day 5: Course 5 questions (20 questions)
```

### **Week 3: Exercises & Case Studies**
```
Day 1: Use Prompt 4 → Generate Exercise 1 & 2
Day 2: Generate Exercise 3 & 4
Day 3: Generate Exercise 5
Day 4: Use Prompt 5 → Generate Case Study 1 & 2
Day 5: Generate Case Study 3, 4, 5
```

### **Week 4: Templates & Scripts**
```
Day 1-2: Use Prompt 6 → Generate all 10 template specifications
Day 3-5: Use Prompt 7 → Generate video scripts (7 scripts per day)
```

---

## 💡 PRO TIPS

### **For ChatGPT:**
- Use GPT-4 for best quality (not GPT-3.5)
- Upload `WRITTEN_CONTENT_TASKS.md` as context
- Generate in batches (don't try to do everything at once)
- Save each response immediately

### **For Claude:**
- Claude handles long documents well
- Can attach files directly in conversation
- Good at maintaining context across messages
- Excels at structured, detailed content

### **For Any AI:**
1. **Always review and edit** - AI is 80% there, you provide the 20%
2. **Add your personal examples** - AI can't know YOUR experience
3. **Verify technical accuracy** - Double-check methodologies
4. **Customize for your voice** - Make it sound like YOU
5. **Test with real students** - See what works in practice

---

## ✅ QUALITY CHECKLIST

After generating content, verify:
- [ ] Technically accurate (correct CI/Lean/Six Sigma concepts)
- [ ] Appropriate difficulty (beginner-friendly)
- [ ] Engaging and conversational (not dry/academic)
- [ ] Includes real-world examples
- [ ] Has actionable takeaways
- [ ] Properly formatted (JSON, paragraphs, etc.)
- [ ] Free of typos and grammatical errors
- [ ] Matches your brand voice
- [ ] References real companies/case studies
- [ ] Includes data and statistics

---

## 🎯 USAGE INSTRUCTIONS

1. **Copy the appropriate prompt above**
2. **Paste into ChatGPT, Claude, or your AI tool**
3. **Attach `WRITTEN_CONTENT_TASKS.md` for context** (if supported)
4. **Generate the content**
5. **Review and refine**
6. **Paste completed content into your task file**
7. **Repeat for next section**

---

## 📊 EXPECTED RESULTS

Using these prompts, you should be able to generate:
- ✅ 5 complete course descriptions (2-3 hours)
- ✅ 80 learning objectives (3-4 hours)
- ✅ 21 lesson descriptions (2 hours)
- ✅ 105 quiz questions (6-8 hours)
- ✅ 5 practical exercises (3-4 hours)
- ✅ 5 case studies (4-5 hours)
- ✅ 10 template specs (4-5 hours)
- ✅ 21 video scripts (8-10 hours)

**Total AI-assisted time: ~30-40 hours** (instead of 100-120 hours manual writing)

**Your role:** Review, refine, add personal touches, verify accuracy

---

🎉 **You now have AI-powered content generation at your fingertips!**

**Start with Prompt 1 and work through systematically. Your academy content will be ready in weeks, not months! 💪**

---

*Pro Tip: Save your AI conversations! You can reference them later or regenerate if needed.*
