# Phase 1: AI Assistant Testing Checklist

**Status:** 🔄 In Progress  
**Start Date:** 2025-10-03  
**Target Completion:** 2025-10-10  
**Tester:** Development Team

---

## ✅ Pre-Testing Setup

- [x] AI Assistant component created (`AIAssistant.tsx`)
- [x] API route created (`/api/ai/chat/route.ts`)
- [x] Claude Sonnet 4 model configured
- [x] GuidedWizard integration complete
- [ ] `.env.local` file created with API key
- [ ] Dev server running successfully
- [ ] No blocking build errors

**Prerequisites to complete before testing:**
```bash
# 1. Create .env.local with:
ANTHROPIC_API_KEY=your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 2. Start dev server:
npm run dev

# 3. Navigate to:
http://localhost:3000/dashboard/continuous-improvement/five-why
```

---

## 1. Functional Testing

### 1.1 Basic Functionality
- [ ] **Navigate to Five Whys tool**
  - URL: `/dashboard/continuous-improvement/five-why`
  - Page loads without errors
  - Tool UI renders correctly

- [ ] **AI Coach Button**
  - Button is visible in header
  - Button shows "AI Coach" text with icons
  - Button has purple/blue styling
  - Button is clickable

- [ ] **Panel Toggle**
  - Clicking button opens AI panel
  - Panel slides in from right side
  - Panel width is 384px (w-96)
  - Clicking X closes panel
  - Clicking button again toggles panel

- [ ] **Chat Interface**
  - Welcome message appears on open
  - Message includes tool name ("5 Why Analysis")
  - Bot avatar displays correctly
  - Input textarea is functional
  - Send button is present and clickable

### 1.2 Message Flow
- [ ] **Send Message**
  - Type a test message: "How do I identify a root cause?"
  - Press Enter to send
  - Message appears in chat as user message (blue)
  - Input clears after sending
  - Loading indicator appears

- [ ] **Receive Response**
  - AI response appears within 3 seconds
  - Response is relevant to question
  - Response has assistant styling (gray)
  - Bot avatar shows next to response
  - Chat auto-scrolls to new message

- [ ] **Multi-turn Conversation**
  - Send follow-up: "Can you give me an example?"
  - AI maintains conversation context
  - Previous messages stay visible
  - Chat history builds correctly

### 1.3 Keyboard Shortcuts
- [ ] **Enter Key**
  - Enter sends message
  - Message sends immediately
  - No line break added

- [ ] **Shift+Enter**
  - Creates new line in textarea
  - Does not send message
  - Cursor moves to new line

- [ ] **Input Disabled During Loading**
  - Cannot type while AI responds
  - Send button disabled during loading
  - Input re-enables after response

### 1.4 Error Handling
- [ ] **Network Error Test**
  - Disconnect internet/WiFi
  - Send a message
  - Error message displays gracefully
  - "I apologize, but I'm having trouble..." message shows
  - Chat remains functional after error

- [ ] **Invalid API Key**
  - Test with wrong API key (temporarily)
  - Error handled gracefully
  - User sees helpful error message
  - Can recover after fixing key

- [ ] **Timeout Test**
  - Send message that might take long
  - Verify timeout handling
  - No infinite loading states

---

## 2. Context Validation

### 2.1 Tool Context
- [ ] **Tool Name in Greeting**
  - Welcome message mentions "5 Why Analysis"
  - OR mentions "Five Whys" tool
  - Tool name is accurate

- [ ] **Tool Description**
  - Backend receives tool description
  - Description passed to Claude API
  - Check Chrome DevTools Network tab

### 2.2 Step Context
- [ ] **Current Step Detection**
  - Start Five Whys analysis
  - Progress through steps
  - AI references current step in responses
  - Step title visible in context

- [ ] **Step Changes**
  - Move to next step in wizard
  - Ask AI about current step
  - AI recognizes new step
  - Context updates correctly

### 2.3 User Input Context
- [ ] **Previous Answers**
  - Fill in first question in Five Whys
  - Ask AI about what you entered
  - AI references your specific input
  - Can discuss your entries

- [ ] **Multi-question Context**
  - Fill in multiple questions
  - Ask AI to review all answers
  - AI shows awareness of full context
  - Provides holistic feedback

### 2.4 Conversation Continuity
- [ ] **Session Persistence**
  - Have a conversation
  - Navigate to different step
  - Return to previous step
  - Conversation history maintained

---

## 3. User Experience Testing

### 3.1 Desktop Testing

**Resolution: 1920x1080**
- [ ] Panel width appropriate (doesn't dominate)
- [ ] Content not obscured by panel
- [ ] Both panel and wizard visible simultaneously
- [ ] No horizontal scrolling
- [ ] Smooth animations

**Resolution: 1366x768**
- [ ] Panel still functional
- [ ] May need to close panel to see wizard
  - [ ] But this is acceptable
- [ ] No layout breaks
- [ ] Text readable

### 3.2 Tablet Testing

**iPad (768px - 1024px)**
- [ ] Panel overlays full screen OR
- [ ] Panel width adjusts responsively
- [ ] Close button accessible
- [ ] Touch interactions work
- [ ] Virtual keyboard doesn't break layout

### 3.3 Mobile Testing

**iPhone SE (375x667)**
- [ ] Panel takes full width
- [ ] Content scrolls properly
- [ ] Input visible above keyboard
- [ ] Send button accessible
- [ ] Close button reachable
- [ ] No tiny text

### 3.4 Interaction Quality
- [ ] **Animation Smoothness**
  - Panel slides in smoothly (300ms)
  - No jank or stuttering
  - Feels polished

- [ ] **Scrolling Behavior**
  - Chat scrolls to bottom on new message
  - Smooth scroll animation
  - Can manually scroll up to see history
  - Auto-scrolls back on new message

- [ ] **Loading States**
  - Loading spinner animates
  - "Thinking..." message shows
  - Not jarring or distracting

- [ ] **Focus Management**
  - Input autofocuses when panel opens
  - Can tab through interactive elements
  - Focus visible and logical

### 3.5 Accessibility Testing

- [ ] **Keyboard Navigation**
  - Can Tab to all interactive elements
  - Enter key works on buttons
  - Escape closes panel (bonus feature)
  - No keyboard traps

- [ ] **Screen Reader**
  - Panel announces when opened
  - Messages are read in order
  - Role/ARIA labels present
  - Loading states announced

- [ ] **Visual**
  - Text contrast ratio meets WCAG AA
  - Focus indicators visible
  - Color not only indicator of state
  - Text resizable to 200%

---

## 4. Performance Testing

### 4.1 Response Times
- [ ] **API Response Time**
  - Measure time from send to response
  - Target: < 2 seconds average
  - Document actual times:
    - Test 1: _____ seconds
    - Test 2: _____ seconds
    - Test 3: _____ seconds
    - Average: _____ seconds

- [ ] **UI Rendering**
  - Panel opens instantly (< 100ms)
  - Messages render without delay
  - No lag when typing

### 4.2 Network Conditions
- [ ] **Fast 3G Test**
  - Chrome DevTools > Network > Fast 3G
  - Send message
  - Still functions acceptably
  - Loading indicator helps UX

- [ ] **Slow Connection**
  - Test with throttled connection
  - Verify timeout handling
  - No infinite loading

### 4.3 Memory & Performance
- [ ] **Long Conversation**
  - Send 20+ messages back and forth
  - Monitor Chrome Task Manager
  - Memory usage reasonable (< 100MB growth)
  - No memory leaks

- [ ] **Multiple Rapid Messages**
  - Send 5 messages quickly
  - All get queued properly
  - All get responses
  - No lost messages

### 4.4 Auto-Save Conflict
- [ ] **Concurrent Operations**
  - Fill out wizard while chatting
  - Verify auto-save still works
  - No conflicts between features
  - Both function independently

---

## 5. Claude AI Quality Testing

### 5.1 Response Relevance
- [ ] **On-Topic Responses**
  - Ask about root cause analysis
  - Response addresses question directly
  - Not generic or off-topic

- [ ] **Tool-Specific Knowledge**
  - Ask "What makes a good 5 Why?"
  - Response shows CI methodology knowledge
  - Mentions avoiding people blame
  - References system thinking

### 5.2 Coaching Tone
- [ ] **Friendly & Encouraging**
  - Tone is warm, not cold
  - Uses "you" language
  - Encouraging statements present

- [ ] **Not Lecturing**
  - Doesn't just info-dump
  - Asks probing questions back
  - Guides vs tells

- [ ] **Conversational**
  - Feels like talking to person
  - Natural language, not robotic
  - Appropriate length (2-4 paragraphs)

### 5.3 Guidance Quality
- [ ] **Asks Probing Questions**
  - Ask "Is this a good root cause: person made mistake?"
  - AI should redirect to system thinking
  - Asks "why did person make mistake?"

- [ ] **Provides Examples When Helpful**
  - Ask for example
  - Gets concrete, relevant example
  - Example fits current context

- [ ] **Detects Vagueness**
  - Give vague answer
  - AI asks for specifics
  - Helps you think deeper

### 5.4 Context Awareness
- [ ] **References User Input**
  - Enter specific problem
  - AI mentions your specific problem
  - Not generic response

- [ ] **Step-Aware**
  - Move to different step
  - Ask general question
  - AI frames answer for current step

### 5.5 Edge Cases
- [ ] **Handles Unclear Questions**
  - Ask ambiguous question
  - AI asks for clarification
  - Doesn't guess wildly

- [ ] **Off-Topic Handling**
  - Ask completely unrelated question
  - AI redirects back to tool
  - Politely but firmly

- [ ] **Very Long Messages**
  - Send paragraph of text
  - AI reads and responds to all
  - Doesn't truncate unfairly

---

## 6. Documentation Tasks

### 6.1 User Documentation
- [ ] **Create User Guide**
  - How to access AI Coach
  - What it can help with
  - Example questions to ask
  - Keyboard shortcuts

- [ ] **Add Tooltips**
  - AI Coach button hover text
  - Input field placeholder helpful
  - First-time user hints

- [ ] **Troubleshooting Guide**
  - What if AI doesn't respond?
  - What if I get an error?
  - How to report issues

### 6.2 Developer Documentation
- [ ] **API Cost Documentation**
  - Estimate tokens per message
  - Calculate cost per session
  - Document in README

- [ ] **Integration Guide**
  - How to add AI to new tool
  - What context to pass
  - Configuration options

---

## 7. Final Validation

### 7.1 Smoke Tests (Run Before Sign-off)
- [ ] Fresh browser, clear cache
- [ ] Navigate to Five Whys
- [ ] Open AI Coach
- [ ] Send 3 messages
- [ ] Get 3 responses
- [ ] Close panel
- [ ] Re-open panel
- [ ] Conversation persists
- [ ] Complete a Five Why analysis with AI help
- [ ] No errors in console

### 7.2 User Acceptance
- [ ] Get feedback from 3+ test users
- [ ] Document feedback:
  - User 1: _________________________
  - User 2: _________________________
  - User 3: _________________________
- [ ] Address critical feedback
- [ ] Log nice-to-have improvements for Phase 3

### 7.3 Success Criteria Check
- [ ] 95%+ uptime on API calls (no errors in testing)
- [ ] < 2 second average response time
- [ ] Zero critical bugs
- [ ] Positive feedback from test users
- [ ] All functional tests passing

---

## 📊 Test Results Summary

**Date Completed:** _____________  
**Total Tests:** 150+  
**Passed:** _____  
**Failed:** _____  
**Blocked:** _____

**Critical Issues Found:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**Minor Issues Found:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**Recommended Actions:**
- [ ] Fix critical issues before Phase 2
- [ ] Log minor issues for Phase 3
- [ ] Proceed to Phase 2: Tool Expansion

---

## 📝 Notes & Observations

Use this space for any additional observations during testing:

```
Date: ___________
Tester: ___________
Notes:


```

---

**Testing Status:** 🔄 In Progress → ⏸️ Paused → ✅ Complete  
**Sign-off:** _________________ (Name)  
**Date:** _________________ 

---

## 🔗 Related Documents
- [AI_ASSISTANT_ROADMAP.md](./AI_ASSISTANT_ROADMAP.md)
- [AI_ASSISTANT_MODE_ANALYSIS.md](./AI_ASSISTANT_MODE_ANALYSIS.md)
- [API_ERROR_ANTHROPIC_DEPRECATED_MODEL_2025-10-03.md](../../7-debugging/api-errors/API_ERROR_ANTHROPIC_DEPRECATED_MODEL_2025-10-03.md)

