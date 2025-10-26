# Architecture Decisions Index
**Master Index for All Architectural Decisions - The Complete Architecture Bible**

> **Purpose**: Single source of truth for ALL architectural decisions across the platform  
> **Usage**: MANDATORY review before any new component, feature, or major change  
> **Status**: Must be read during every session initialization per CLAUDE.md protocol

---

## Part 1: Architecture Decisions Bible (MANDATORY REVIEW)

**CRITICAL**: ALL decisions below MUST be considered before implementing any new component or feature. This is the comprehensive "bible" of architectural decisions across the entire platform.

| **Category** | **Decision** | **Core Rule** | **Details Location** |
|---|---|---|---|
| **Navigation** | Modal vs Full Page Framework | Task-focused <2min → Modal; 3+ tabs → Full Page; Max 2 modal levels | [Visual Design Spec](#modal-vs-full-page-navigation-framework) |
| **Navigation** | FAB vs Bottom CTA | Non-tech users need explicit CTAs, not abstract symbols | [Visual Design Spec](#fab-vs-bottom-cta-for-non-tech-users) |
| **Navigation** | Universal Search Architecture | Global search bar in header for cross-module discovery | [Visual Design Spec](#universal-search-architecture) |
| **Layout** | CSS Grid Architecture | Single PlatformShell container for all platform pages using CSS Grid | [Unified Architecture](#unified-platformshell-architecture) |
| **Layout** | Fixed Layout Architecture | Fixed headers/navigation for factory environment stability | [Visual Design Spec](#fixed-layout-architecture) |
| **Layout** | No Auto-Hide Header (MVP) | Headers remain visible for production environment reliability | [Visual Design Spec](#no-auto-hide-header-mvp) |
| **Modals** | Global Modal Design System | 500px max width, mobile-first responsive, consistent Portal pattern | [Visual Design Spec](#modal-design-system-standard) |
| **Modals** | Parent-Child Modal System | Clean state management for modal hierarchies with context preservation | [Visual Design Spec](#parent-child-modal-system) |
| **Modals** | Z-index Hierarchy Standard | Systematic layering: Base(1) → Fixed(10) → Modals(1000) → Alerts(9999) | [Visual Design Spec](#z-index-hierarchy-standard) |
| **Interaction** | Hybrid Modal + Expanded View | Quick preview modal → Full details page for complex workflows | [Visual Design Spec](#hybrid-modal-expanded-view-pattern) |
| **Components** | Zero Code Duplication | Single instances: voice, search, navigation. No infrastructure in business components | [Unified Architecture](#zero-code-duplication-architecture) |
| **Components** | Configuration-Driven Architecture | platformConfig.ts controls all behavior. Single source of truth | [Unified Architecture](#configuration-driven-architecture) |
| **Components** | Component Structure Standards | Clean separation: Business components contain ONLY business logic | [Unified Architecture](#component-structure-standards) |
| **Components** | 140px Card Template Standard | Consistent card height with structured information hierarchy | [Visual Design Spec](#card-standards-140px-template) |
| **Design System** | Design System Token Compliance | ZERO hardcoded values: use var(--ds-*) tokens exclusively | [Visual Design Spec](#design-system-tokens-mandatory) |
| **Design System** | 4-Layer CSS Architecture | Global → Component → Module → Utility layer separation | [Unified Architecture](#4-layer-css-architecture-system) |
| **Design System** | Business-Neutral Color System | Universal color system works across all business domains | [Unified Architecture](#business-neutral-color-system-architecture) |
| **Mobile** | 44px Touch Target Standard | Factory-optimized touch targets for industrial environment | [Visual Design Spec](#mobile-design-architecture) |
| **Voice/Search** | Single Instance Pattern | One FloatingVoiceAssistant, one GlobalSearch serves entire platform | [Unified Architecture](#voice-search-integration-rules) |
| **Routing** | Professional Routing Pattern | URL-based actions, service architecture, proper navigation | [Unified Architecture](#service-architecture-pattern) |
| **Grid** | Grid Layout Architecture | Responsive single container system replaces multi-shell approach | [Unified Architecture](#grid-layout-architecture) |
| **Module** | Machine Tab MVP Exclusion | Machine management deferred to post-MVP for complexity reasons | [Visual Design Spec](#machine-tab-mvp-exclusion) |

---

## Part 2: Architecture Compliance Rules (MANDATORY)

### **🏗️ MANDATORY ARCHITECTURE PATTERNS**

#### **1. PlatformShell CSS Grid Architecture (MANDATORY)**
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

#### **2. Zero Code Duplication Rules (MANDATORY)**
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

#### **3. Configuration-Driven Architecture (MANDATORY)**
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

#### **4. Component Structure Standards (MANDATORY)**
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

#### **5. CSS Architecture Standards (MANDATORY)**
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

#### **6. Voice/Search Integration Rules (MANDATORY)**
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

## Part 3: Implementation Standards

### **🎯 IMPLEMENTATION CHECKLIST**

#### **For Every New Business Module:**
- [ ] Integrates into PlatformShell CSS Grid (no separate containers)
- [ ] Contains ONLY business logic (no voice/search/navigation code)
- [ ] Follows Visual Design Spec (48px tabs, 44px filters, 56px CTA)
- [ ] Uses design system tokens (--ds-btn-primary, etc.)
- [ ] Follows COMPONENT_DESIGN_PATTERNS.md for card templates and CSS variables
- [ ] Adds data types to platformConfig GLOBAL_SCOPE
- [ ] Extends GlobalSearch scope for new data
- [ ] Adds voice commands to VoiceCommandRouter
- [ ] No TypeScript `any` types (causes Vercel deployment failures)

#### **For Every Session:**
- [ ] Read ARCHITECTURE_GUIDELINES.md (this document) - Architecture Decisions Bible
- [ ] Read COMPONENT_DESIGN_PATTERNS.md for implementation templates
- [ ] Verify platformConfig compliance
- [ ] Check zero code duplication
- [ ] Validate Visual Design Spec compliance
- [ ] Test TypeScript compilation (zero errors)

---

### **🚨 CRITICAL MISTAKES TO AVOID**

#### **Architecture Violations:**
❌ Creating separate mobile app shells  
❌ Duplicating voice/search infrastructure  
❌ Hardcoding behavior instead of using platformConfig  
❌ Breaking Visual Design Spec measurements  
❌ Using TypeScript `any` types  

#### **Component Anti-Patterns:**
❌ Business components with infrastructure code  
❌ Multiple instances of voice/search systems  
❌ Component-specific navigation implementations  
❌ Bypassing unified architecture patterns  

---

### **✅ SUCCESS INDICATORS**

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

**🎯 This Architecture Decisions Bible ensures every development session maintains architectural excellence and unified platform consistency across all modules and features.**