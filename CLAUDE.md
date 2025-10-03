# ElevateBusiness 360° - Session Guide

## 🚀 SESSION INITIALIZATION PROTOCOL

### **STEP 1: MANDATORY DATE VERIFICATION**
```bash
date  # ALWAYS run first - validates project timeline context
```

**Current Timeline:**
- **Project Start**: August 27, 2025
- **Current Phase**: Mobile UX V2 Component Transformation  
- **Current Work**: Phase 4.1 (Universal Button System)
- **Next**: Backend Integration (Nov-Dec 2025)

### **STEP 2: READ 5 KEY DOCUMENTS**
```bash
# Essential context documents (read in order):
/docs/PRODUCT_REQUIREMENTS.md      # What we're building
/docs/BUSINESS_PROCESSES.md        # 8-stage textile workflow
/docs/UNIFIED_ARCHITECTURE.md      # Zero duplication architecture
/docs/MOBILE_UX_V2_IMPLEMENTATION.md  # Current phase details
/docs/USE_CASES_MASTER.md          # Implementation progress
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

### **3. DESIGN SYSTEM V2 COMPLIANCE (MANDATORY)**
**❌ Common Mistake**: Hardcoded font sizes in new components

**✅ Required Standards**:
- ALL font sizes MUST use CSS variables (`--font-xs` through `--font-xl`)
- ALL interactive elements MUST meet 42-44px touch targets
- Follow patterns in `/docs/DESIGN_SYSTEM_V2.md`

### **4. FILE EDITING PROTOCOL**
**❌ Common Mistake**: Using Edit tool without reading file first

**✅ Required Protocol**:
1. `Read` tool first (understand current content)
2. `Edit` tool with exact string matching
3. `BashOutput` verification after changes

---

## 🎯 CURRENT PHASE: MOBILE UX V2

### **Phase Status (Check `/docs/MOBILE_UX_V2_IMPLEMENTATION.md` for details)**
- ✅ **Foundation**: Dashboard intelligence, workflow navigation
- ✅ **Phase 3**: LeadManagement Mobile UX V2 
- ✅ **Phase 3.1**: Design System V2 standardization
- ✅ **Phase 4**: QuotationOrders Mobile UX V2
- 🎯 **Phase 4.1**: Universal Button System (CURRENT - 15-20 mins)
- ⏳ **Phase 5**: Supporting Components (20-25 mins)
- ⏳ **Phase 6**: Compliance Audit (10-15 mins)

### **Current Priority Actions**
1. Replace duplicate button classes in LeadManagement and QuotationOrders
2. Apply global `.ds-btn` system from Design System V2
3. Verify visual consistency and touch targets

---

## ⚡ SESSION TOOLS & REMINDERS

### **Performance Management**
```bash
# Use every 2-3 hours or at natural break points
/clear
/resume
```

### **Git Commit Standards**
```
MOBILE UX V2 - PHASE [X]: [Component] - [Brief Description]

[Detailed changes]
- ✅ [Specific change 1]
- ✅ [Specific change 2]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### **TodoWrite Usage**
- Start session: Create todos for current work
- During work: Mark in_progress → completed
- End session: Update persistent `/TODO.md`

---

## 🏭 BUSINESS CONTEXT ESSENTIALS

**Target Users**: MSME textile manufacturers (Gujarat focus)  
**Core Workflow**: Lead → Quote → 30% Payment → Production → Delivery  
**Key Principle**: Voice-first, mobile-optimized, factory environment ready

**Design Standards**: Professional B2B, enterprise gradients, textile industry terminology

---

**📍 For detailed information, refer to the 5 key documents above.**  
**🎯 This guide focuses on session protocol and mistake prevention only.**