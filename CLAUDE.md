# ElevateBusiness 360° - Session Guide

## 🚀 SESSION INITIALIZATION PROTOCOL

### **STEP 1: MANDATORY DATE VERIFICATION**
```bash
date  # ALWAYS run first - validates project timeline context
```

**Current Timeline:**
- **Project Start**: August 27, 2025
- **Implementation Strategy**: Core Views → Cross-Module → CRUD sequence
- **Phase Details**: Check Implementation Roadmap for current status

### **STEP 2: READ MANDATORY SESSION CONTEXT**
```bash
# MANDATORY SESSION CONTEXT (read in order):
/docs/DOCUMENTATION_INDEX.md          # FIRST: Master navigation hub - all documents and Quick Decision Matrix  
/docs/IMPLEMENTATION_ROADMAP.md       # SECOND: Primary implementation roadmap with streamlined phases

# Supporting references:
/docs/VISUAL_DESIGN_SPECIFICATION.md  # Complete visual designs and wireframes
```

### **STEP 3: CHECK TODO STATUS**
- Read `/TODO.md` for persistent cross-session todos
- Use `TodoWrite` tool for current session progress tracking

---

## 🚨 CRITICAL MISTAKES TO AVOID

### **1. COMPILATION VERIFICATION (MANDATORY)**
**❌ Common Mistake**: Declaring "fixed" without checking actual compilation

**✅ Required Protocol**:
```bash
# ALWAYS verify after ANY code change
BashOutput tool → Check npm start output → Verify "Compiled successfully!"
```

### **2. TYPESCRIPT `any` BAN (ZERO TOLERANCE)**
**❌ FORBIDDEN**: `any` types break deployment (Vercel treats warnings as errors)

**✅ REQUIRED PATTERNS**:
```typescript
// Business domain-specific types
interface SetPriorityParams { leadId: string; priority: 'hot' | 'warm' | 'cold'; }

// Union types with fallback
export type ActionParams = SetPriorityParams | Record<string, unknown>;

// Proper type guards
if (params && 'leadId' in params) {
  const priorityParams = params as SetPriorityParams;
}
```

### **3. IMPLEMENTATION ROADMAP COMPLIANCE (MANDATORY)**
**❌ Common Mistake**: Creating new files instead of updating existing systems

**✅ Required Standards**:
- ALL updates MUST follow existing architectural patterns per Implementation Roadmap
- ALL designs MUST reference Visual Design Spec via Implementation Roadmap
- ALL colors MUST use Visual Design Spec (#1D4ED8 primary, #F97316 secondary)
- ALL fonts MUST use Inter typography hierarchy
- ALL touch targets MUST meet 44px minimum
- Follow Implementation Roadmap in `/docs/IMPLEMENTATION_ROADMAP.md`

### **4. FILE EDITING PROTOCOL**
**❌ Common Mistake**: Using Edit tool without reading file first

**✅ Required Protocol**:
1. `Read` tool first (understand current content)
2. `Edit` tool with exact string matching
3. `BashOutput` verification after changes

### **5. DOCUMENTATION FORMATTING STANDARDS (MANDATORY)**
**❌ FORBIDDEN**: Emojis in document headers (breaks TOC navigation)

**✅ REQUIRED STANDARDS**:
- NO emojis in any header levels (`#`, `##`, `###`, `####`)
- Headers must use clean text for proper anchor link generation
- TOC links break when headers contain special characters/emojis
- Use emojis in content body only, never in navigation structure

**Example Violations Fixed**:
```markdown
❌ ### 🎯 Design Mission          → breaks TOC links
❌ ## 📱 Mobile Design           → navigation failure
❌ #### 🔥 Implementation        → anchor link issues

✅ ### Design Mission            → proper TOC navigation
✅ ## Mobile Design              → clean anchor links  
✅ #### Implementation           → working navigation
```

---

## 🎯 IMPLEMENTATION PRINCIPLES

### **Implementation Roadmap Reference**
- **Current Status**: Check `/docs/IMPLEMENTATION_ROADMAP.md` for live phase status
- **Todo Tracking**: Check `/TODO.md` for current priorities and session context

### **Core Implementation Standards**
1. UPDATE existing systems (NOT create new files)
2. EXTEND existing Design System classes following Visual Design Spec
3. PRESERVE all existing architectural patterns while applying Visual Design styling
4. FOLLOW Implementation Roadmap phase structure (Core Views → Cross-Module → CRUD)

---

## ⚡ SESSION TOOLS & REMINDERS

### **Performance Management**
```bash
# Use every 2-3 hours or at natural break points
/clear
/resume
```

### **Git Commit Standards - Sub-Phase Strategy**
```
MOBILE UX V2 - SUB-PHASE [X.Y]: [Component] - [Brief Description]

✅ [Primary change accomplished]
- [Specific detail 1]
- [Specific detail 2]
- [Specific detail 3]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

**MANDATORY**: Commit after every sub-phase for rollback safety

### **TodoWrite Usage**
- Start session: Create todos for current work
- During work: Mark in_progress → completed
- End session: Update persistent `/TODO.md`

### **Documentation System Navigation**
**Complete Context Available (from DOCUMENTATION_INDEX.md mandatory reading):**
- **Quick Decision Matrix**: Instant navigation to right document for any question
- **11 Focused Documents**: Business processes, architecture, design patterns, progress tracking
- **Document Hierarchy**: PRIMARY vs SUPPORTING document relationships established
- **Examples from Quick Decision Matrix**: 
  - Business workflow questions → BUSINESS_PROCESSES.md
  - Architecture questions → UNIFIED_ARCHITECTURE.md
  - Use case status → USE_CASES_MASTER.md
  - Visual design details → VISUAL_DESIGN_SPECIFICATION.md

---

## 🏭 BUSINESS CONTEXT ESSENTIALS

**Target Users**: MSME textile manufacturers (Gujarat focus)  
**Core Workflow**: Lead → Quote → 30% Payment → Production → Delivery  
**Key Principle**: Voice-first, mobile-optimized, factory environment ready

**Design Standards**: Professional B2B, enterprise gradients, textile industry terminology

---

**📍 For detailed implementation steps, refer to the Implementation Roadmap.**  
**🎯 This guide focuses on session protocol and mistake prevention only.**