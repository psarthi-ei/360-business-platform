# Architecture Guidelines - Session Reference
**Quick Architecture Compliance Rules for Development Sessions**

> **Purpose**: Essential architecture patterns that MUST be followed in every development session  
> **Usage**: Read during session initialization to ensure compliance with unified architecture

---

## **🏗️ MANDATORY ARCHITECTURE PATTERNS**

### **1. PlatformShell CSS Grid Architecture (MANDATORY)**
**Single Container for All Platform Pages**

```
🌐 UNIFIED PLATFORM LAYOUT
└── PlatformShell.tsx (UNIFIED Container - CSS Grid)
    ├── Grid Area: Sidebar (Desktop: 280px, Mobile: hidden)
    ├── Grid Area: Header (PlatformHeader - responsive)
    ├── Grid Area: Search (GlobalSearch + GlobalVoice 🎙 integration)
    ├── Grid Area: Content (Routes/Business Components)
    └── Grid Area: Navigation (BottomNavigation - mobile only)
```

**✅ MUST DO:**
- All business modules integrate into PlatformShell CSS Grid
- Use provided grid areas: `header`, `sidebar`, `content`, `navigation`
- No separate mobile/desktop shells - single responsive container

**❌ NEVER DO:**
- Create separate mobile app shells
- Duplicate layout containers
- Override PlatformShell grid areas

---

### **2. Zero Code Duplication Rules (MANDATORY)**
**No Duplicate Infrastructure Code**

**✅ SHARED INFRASTRUCTURE:**
- `FloatingVoiceAssistant` - Single instance serves entire platform
- `GlobalSearch` - Single instance with configurable scope
- `PlatformHeader` - Single header component
- `BottomNavigation` - Single navigation component

**✅ BUSINESS COMPONENTS:**
- Sales.tsx, Procurement.tsx, Production.tsx, Customers.tsx
- Each contains ONLY business logic - no infrastructure code
- Import and use shared infrastructure via props/context

**❌ FORBIDDEN PATTERNS:**
- Copying voice/search code into business components
- Creating duplicate navigation components
- Recreating header/footer in business modules

---

### **3. Configuration-Driven Architecture (MANDATORY)**
**Single Source of Truth: platformConfig.ts**

```typescript
// platformConfig.ts - Controls entire platform behavior
export const platformConfig = {
  search: 'global' as SearchBehavior,    // Global search from anywhere
  voice: 'global' as VoiceBehavior       // Global voice commands
};

export const GLOBAL_SCOPE = [
  'leads', 'quotes', 'orders', 'customers', 
  'inventory', 'analytics', 'payments', 'invoices',
  // ADD NEW DOMAINS HERE ↓
  'materials', 'purchase_requests', 'purchase_orders', 'grns'
] as const;
```

**✅ REQUIRED INTEGRATION:**
- Add new business domains to `GLOBAL_SCOPE`
- Update `GlobalSearch` to include new data types
- Extend `VoiceCommandRouter` for new voice commands
- Single config change affects entire platform

**❌ FORBIDDEN:**
- Hardcoded behavior in components
- Component-specific search/voice implementations
- Bypassing platformConfig system

---

### **4. Component Structure Standards (MANDATORY)**
**Clean Separation: Business vs Infrastructure**

**✅ BUSINESS COMPONENT PATTERN:**
```typescript
// Sales.tsx, Procurement.tsx, etc.
interface BusinessModuleProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

// ONLY business logic - NO voice/search/navigation infrastructure
const BusinessModule = ({ mobile, onShowCustomerProfile, onUniversalAction }: BusinessModuleProps) => {
  // Business state management
  // Business filter logic  
  // Business data rendering
  // Business action handlers
  
  return (
    <div className={styles.businessModule}>
      {/* Pure business UI - no infrastructure */}
    </div>
  );
};
```

**✅ INFRASTRUCTURE COMPONENTS:**
- `PlatformShell.tsx` - Layout and infrastructure coordination
- `GlobalSearch.tsx` - Universal search functionality
- `FloatingVoiceAssistant.tsx` - Universal voice commands
- `PlatformHeader.tsx` - Universal header and navigation

---

### **5. CSS Architecture Standards (MANDATORY)**
**4-Layer Standardized System**

**✅ REQUIRED CSS STRUCTURE:**
```css
/* 1. GLOBAL LAYER - Design system variables */
:root {
  --ds-btn-primary: #1D4ED8;
  --ds-bg-subtle: #F8FAFC;
  --font-family: 'Inter', sans-serif;
}

/* 2. COMPONENT LAYER - Business module styles */
.businessModule {
  display: grid;
  grid-template-rows: 48px 44px 1fr 56px; /* Visual Design Spec */
  height: 100%;
}

/* 3. MODULE LAYER - Tab navigation */
.businessTabs {
  display: flex;
  height: 48px; /* Visual Design Spec compliance */
}

/* 4. UTILITY LAYER - Helper classes */
.scrollable { overflow-y: auto; }
```

**✅ VISUAL DESIGN COMPLIANCE:**
- 48px tab navigation height
- 44px filter row height  
- 56px bottom CTA height
- #1D4ED8 primary blue, #F97316 secondary orange
- Inter font typography hierarchy
- 44px minimum touch targets

---

### **6. Voice/Search Integration Rules (MANDATORY)**
**Single Instance Patterns**

**✅ GLOBAL VOICE INTEGRATION:**
```typescript
// VoiceCommandRouter.tsx - Single routing instance
export const handleVoiceCommand = (command: string, context: string) => {
  // Route voice commands to appropriate business modules
  // Single source of truth for all voice behavior
};

// Business components receive voice actions via props
onUniversalAction?.(actionType, params);
```

**✅ GLOBAL SEARCH INTEGRATION:**
```typescript
// GlobalSearch.tsx - Single search instance
const searchResults = searchAcrossDataTypes(query, GLOBAL_SCOPE);
// Searches leads, quotes, orders, customers, materials, etc.
```

**❌ FORBIDDEN:**
- Local voice command handling in business components
- Component-specific search implementations
- Multiple voice/search instances

---

## **🎯 IMPLEMENTATION CHECKLIST**

### **For Every New Business Module:**
- [ ] Integrates into PlatformShell CSS Grid (no separate containers)
- [ ] Contains ONLY business logic (no voice/search/navigation code)
- [ ] Follows Visual Design Spec (48px tabs, 44px filters, 56px CTA)
- [ ] Uses design system tokens (--ds-btn-primary, etc.)
- [ ] Adds data types to platformConfig GLOBAL_SCOPE
- [ ] Extends GlobalSearch scope for new data
- [ ] Adds voice commands to VoiceCommandRouter
- [ ] No TypeScript `any` types (causes Vercel deployment failures)

### **For Every Session:**
- [ ] Read ARCHITECTURE_GUIDELINES.md (this document)
- [ ] Verify platformConfig compliance
- [ ] Check zero code duplication
- [ ] Validate Visual Design Spec compliance
- [ ] Test TypeScript compilation (zero errors)

---

## **🚨 CRITICAL MISTAKES TO AVOID**

### **Architecture Violations:**
❌ Creating separate mobile app shells  
❌ Duplicating voice/search infrastructure  
❌ Hardcoding behavior instead of using platformConfig  
❌ Breaking Visual Design Spec measurements  
❌ Using TypeScript `any` types  

### **Component Anti-Patterns:**
❌ Business components with infrastructure code  
❌ Multiple instances of voice/search systems  
❌ Component-specific navigation implementations  
❌ Bypassing unified architecture patterns  

---

## **✅ SUCCESS INDICATORS**

**Architecture Compliance:**
- Single PlatformShell serves all platform pages
- No duplicate infrastructure code across components
- platformConfig controls all behavior centrally
- Business components contain pure business logic
- Voice/search works globally from single instances

**Visual Design Compliance:**
- 48px tab navigation, 44px filters, 56px CTA maintained
- Professional B2B appearance with design system colors
- Mobile-first responsive design patterns
- Factory environment optimized (44px touch targets)

**Development Quality:**
- TypeScript compiles without errors
- No `any` types used anywhere
- Clean domain separation in mock data
- Cross-referential data integrity maintained

---

**🎯 This document ensures every development session maintains architectural excellence and unified platform consistency.**