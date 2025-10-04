# 📐 DESIGN SYSTEM V2
## Complete Mobile-First Implementation Guide for ElevateBusiness 360°

**Document Version:** 2.2  
**Created:** October 3, 2025  
**Last Updated:** October 4, 2025  
**Project:** ElevateBusiness 360° by ElevateIdea Technologies  
**Based on:** LeadManagement Mobile UX V2 Success + Phase 4.1 Universal Business Color Standardization

---

## 📑 **TABLE OF CONTENTS**

1. [**Foundation Philosophy**](#🎯-foundation-philosophy) - Mobile-first principles and approach
2. [**Global Standards**](#🌍-global-standards) - Colors, typography, spacing, touch targets
3. [**Component Architecture**](#🏗️-component-architecture) - Standard patterns and structures
4. [**CSS Architecture Standardization**](#🏛️-css-architecture-standardization) - Phase 4.1 achievements and patterns
5. [**Implementation Templates**](#📝-implementation-templates) - Copy-paste code patterns
6. [**Quality Assurance**](#✅-quality-assurance) - Verification checklists and gates
7. [**Responsive Strategy**](#📱💻-responsive-strategy) - Mobile vs desktop adaptation

---

## 🎯 **FOUNDATION PHILOSOPHY**

### **Mobile-First Progressive Enhancement**
> "Design for the smallest screen first, enhance for larger screens"

**Core Principles:**
1. **Touch-First Interaction**: All components designed for mobile touch, enhanced for desktop
2. **Progressive Disclosure**: Essential information first, details on demand
3. **Universal Accessibility**: 48px minimum touch targets, WCAG 2.1 compliance
4. **Performance-Focused**: Minimal CSS, efficient responsive patterns
5. **Business Context**: Optimized for MSME textile manufacturing workflows

### **Design Philosophy Extracted from Successful LeadManagement**
- **Light Professional Theme**: Clean `#f7fafc` to `#edf2f7` gradient background
- **Contextual Actions**: Priority-based button hierarchy with business logic
- **Clamp-Based Responsive**: Fluid scaling using `clamp()` for all dimensions
- **Grid-First Layout**: CSS Grid for unified headers, flexible layouts for content

---

## 🌍 **GLOBAL STANDARDS**

### **Color System - Professional Light Theme**
**Global Color Variables** ✅ **STANDARDIZED IN PHASE 4.1**:
```css
:root {
  /* ⭐ PHASE 4.1: Global Color Primary (replaces component-specific hardcoded values) */
  --color-primary: #2d3748;  /* Dark gray for better readability on light backgrounds */
  
  /* Background System */
  --ds-bg-primary: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  --ds-bg-card: white;
  --ds-bg-expanded: #f8fafb;
  
  /* Text Colors */
  --ds-text-primary: #2d3748;
  --ds-text-secondary: #4a5568;
  --ds-text-muted: #718096;
  
  /* Border & Dividers */
  --ds-border-primary: #e1e8ed;
  --ds-border-secondary: #cbd5e0;
  
  /* Interactive States */
  --ds-shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --ds-shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**🎯 Global Color Standardization Status:**
- ✅ **Header Colors**: Both LeadManagement and QuotationOrders use `var(--color-primary)`
- ✅ **Global Variable**: Single source of truth in `index.css`
- ✅ **Readability Fix**: Replaced golden color with dark gray for light backgrounds
- 🔄 **Remaining Work**: ~61 hardcoded color values across components (see Phase 4.1 TODO)

**Button Color System** (proven hierarchy):
```css
:root {
  /* Primary Actions */
  --ds-btn-primary: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
  --ds-btn-primary-hover: linear-gradient(135deg, #3182ce 0%, #5a67d8 100%);
  
  /* Urgent Actions (Hot Leads) */
  --ds-btn-urgent: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  --ds-btn-urgent-hover: linear-gradient(135deg, #ff3742 0%, #ff2f3a 100%);
  
  /* Secondary Actions */
  --ds-btn-secondary: white;
  --ds-btn-secondary-border: #4299e1;
  --ds-btn-secondary-hover: #4299e1;
  
  /* Priority Badges */
  --ds-badge-hot: linear-gradient(135deg, #ff4757, #ff3742);
  --ds-badge-warm: linear-gradient(135deg, #ffa502, #ff9500);
  --ds-badge-cold: linear-gradient(135deg, #4299e1, #667eea);
}
```

### **Typography System**
**Using Existing Global Font Variables** (already established):
```css
/* Reference existing system in index.css */
--font-xs: clamp(12px, 2.5vw, 14px);    /* Small labels, badges */
--font-sm: clamp(14px, 3vw, 16px);      /* Body text, buttons */
--font-base: clamp(16px, 3.5vw, 18px);  /* Standard elements */
--font-lg: clamp(18px, 4vw, 20px);      /* Important headings */
--font-xl: clamp(20px, 4.5vw, 24px);    /* Page headers */
```

**Typography Rules** (from V2 mandate):
- ❌ **FORBIDDEN**: Any hardcoded font-size values (px, rem, em)
- ✅ **REQUIRED**: All text MUST use CSS variables
- ✅ **VERIFICATION**: Zero tolerance policy for compliance

### **Responsive Spacing System**
**Clamp-Based Spacing** (extracted from LeadManagement):
```css
:root {
  /* Spacing Scale */
  --ds-space-xs: clamp(4px, 1vw, 8px);
  --ds-space-sm: clamp(8px, 2vw, 12px);
  --ds-space-md: clamp(12px, 3vw, 16px);
  --ds-space-lg: clamp(16px, 4vw, 24px);
  --ds-space-xl: clamp(24px, 5vw, 32px);
  --ds-space-xxl: clamp(32px, 6vw, 48px);
  
  /* Component Spacing */
  --ds-padding-component: clamp(20px, 4vw, 30px) clamp(10px, 2vw, 20px);
  --ds-padding-header: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem);
  --ds-padding-button: clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem);
  
  /* Grid Gaps */
  --ds-gap-sm: clamp(0.25rem, 1.5vw, 0.75rem);
  --ds-gap-md: clamp(0.5rem, 2vw, 1rem);
  --ds-gap-lg: clamp(1rem, 3vw, 1.5rem);
}
```

### **🚨 CRITICAL SPACING RULES**
**MANDATORY GUIDELINES TO PREVENT MOBILE OVERRIDE ISSUES**

> **LESSON LEARNED**: QuotationOrders had 70px top padding + 25px extra side padding due to mobile CSS overrides that bypassed Design System V2 standards.

#### **Screen Padding Authority - SINGLE SOURCE OF TRUTH**
```css
/* ✅ CORRECT: Use ONLY this variable for screen-level padding */
.componentScreen {
  padding: var(--ds-padding-screen);
  /* This provides: top, right, bottom, left responsive padding */
  /* Resolves to: clamp(20px, 4vw, 30px) clamp(10px, 2vw, 20px) clamp(20px, 4vw, 40px) clamp(10px, 2vw, 20px) */
}

/* ❌ NEVER DO: Hardcoded mobile overrides */
@media (max-width: 768px) {
  .componentScreen {
    padding: 70px 10px 20px 10px; /* BREAKS DESIGN SYSTEM */
  }
}
```

#### **Container Spacing Prohibition**
```css
/* ❌ NEVER ADD: Extra margin/padding on containers inside components */
@media (max-width: 768px) {
  .itemsContainer,
  .cardsContainer {
    margin-left: 10px;    /* BREAKS CONSISTENCY */
    margin-right: 10px;   /* BREAKS CONSISTENCY */
    padding-left: 15px;   /* BREAKS CONSISTENCY */
    padding-right: 15px;  /* BREAKS CONSISTENCY */
  }
}

/* ✅ CORRECT: Let Design System handle all spacing */
.itemsContainer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px; /* Only for max-width constraint, not spacing */
}
```

#### **Separation of Concerns - WHO HANDLES WHAT SPACING**
| **Responsibility** | **CSS File** | **What It Does** | **What It NEVER Does** |
|-------------------|--------------|------------------|------------------------|
| **Global Screen Padding** | `index.css` | `--ds-padding-screen` variable | Component-specific overrides |
| **Desktop Shell** | `App.css` | Universal search clearance | Mobile spacing |
| **Mobile Shell** | `MobileAppShell.css` | Shell header spacing | Component content spacing |
| **Component Level** | `Component.module.css` | Uses `var(--ds-padding-screen)` | Hardcoded mobile overrides |

#### **QuotationOrders Case Study - WHAT WENT WRONG**
```css
/* ❌ THE PROBLEM: Multiple conflicting spacing sources */

/* 1. Component used correct Design System V2 */
.quotationOrdersScreen {
  padding: var(--ds-padding-screen); /* ✅ CORRECT: 20-30px top, 10-20px sides */
}

/* 2. BUT mobile override forced hardcoded values */
@media (max-width: 768px) {
  .quotationOrdersScreen {
    padding: 70px 10px 20px 10px; /* ❌ WRONG: 70px top override */
  }
  
  .itemsContainer {
    margin-left: 10px;     /* ❌ WRONG: +10px sides */
    margin-right: 10px;    /* ❌ WRONG: +10px sides */
    padding-left: 15px;    /* ❌ WRONG: +15px sides */
    padding-right: 15px;   /* ❌ WRONG: +15px sides */
  }
}

/* RESULT: 70px top + 25px extra on each side = BROKEN LAYOUT */
```

#### **THE FIX - TRUST THE DESIGN SYSTEM**
```css
/* ✅ SOLUTION: Remove ALL mobile overrides, use Design System V2 */
.quotationOrdersScreen {
  padding: var(--ds-padding-screen); /* Responsive 20-30px top, 10-20px sides */
}

@media (max-width: 768px) {
  /* Let Design System V2 handle screen padding consistently */
  /* NO hardcoded padding overrides allowed */
}
```

#### **COMPLIANCE VERIFICATION**
**Before every component merge:**
1. **Search for hardcoded padding in mobile media queries** - should find ZERO
2. **Verify only `var(--ds-padding-screen)` used for screen padding** 
3. **Check for container margin/padding overrides** - should find NONE
4. **Test spacing matches LeadManagement exactly**

### **Touch Target Standards**
**Mobile-First Touch Optimization** (proven requirements):
```css
:root {
  /* Touch Targets */
  --ds-touch-target-min: clamp(42px, 8vw, 44px);
  --ds-touch-target-preferred: clamp(44px, 9vw, 48px);
  --ds-touch-target-comfortable: clamp(48px, 10vw, 56px);
  
  /* Touch Optimization */
  --ds-touch-action: manipulation;
  --ds-tap-highlight: transparent;
}
```

**Touch Standards** (mandatory for all components):
- **Minimum Height**: 42px for all interactive elements
- **Preferred Height**: 44-48px for primary actions
- **Touch Action**: `touch-action: manipulation` on all buttons
- **Tap Highlight**: `-webkit-tap-highlight-color: transparent`

### **Border Radius System**
**Responsive Border Radius** (extracted pattern):
```css
:root {
  --ds-radius-sm: clamp(4px, 1vw, 6px);
  --ds-radius-md: clamp(6px, 1.2vw, 8px);
  --ds-radius-lg: clamp(8px, 1.5vw, 12px);
  --ds-radius-xl: clamp(12px, 2vw, 16px);
}
```

---

## 🎨 **UNIVERSAL BUSINESS COLOR SYSTEM** ✅ **PHASE 4.1 COMPLETE**

### **Business-Neutral Semantic Categories for ALL Components**

**Achievement**: Phase 4.1 successfully eliminated 61+ hardcoded color values across LeadManagement and QuotationOrders, replacing them with a universal business-neutral color system that works for any component.

#### **Priority System Colors**
**Universal across all business processes (leads, quotes, orders, customers):**
```css
:root {
  /* Business Priority - Universal Semantic Meaning */
  --ds-priority-high: #ff4757;         /* Hot leads, urgent orders, critical items */
  --ds-priority-medium: #ffa502;       /* Warm leads, pending quotes, scheduled items */
  --ds-priority-low: #4299e1;          /* Cold leads, draft quotes, routine items */
}
```

#### **Status System Colors**
**Universal process states across all business workflows:**
```css
:root {
  /* Business Status - Universal Process States */
  --ds-status-active: #2ed573;         /* Approved, completed, active customers */
  --ds-status-pending: #ffa502;        /* Pending approval, in-progress items */
  --ds-status-inactive: #6b7280;       /* Expired, cancelled, inactive items */
}
```

#### **Text Hierarchy Colors**
**Universal text categories for consistent communication:**
```css
:root {
  /* Text Hierarchy - Universal Semantic Purpose */
  --ds-text-link: #4299e1;             /* All clickable links across components */
  --ds-text-positive: #16a34a;         /* Success messages, confirmations */
  --ds-text-attention: #f59e0b;        /* Warnings, attention needed */
  --ds-text-critical: #dc2626;         /* Errors, critical issues */
  --ds-text-muted: #9ca3af;            /* Secondary info, placeholders */
}
```

#### **Interactive State Colors**
**Universal hover and active states:**
```css
:root {
  /* Interactive States - Universal Feedback */
  --ds-hover-priority-high: rgba(255, 71, 87, 0.3);
  --ds-hover-priority-medium: rgba(255, 165, 2, 0.3);
  --ds-hover-priority-low: rgba(66, 153, 225, 0.3);
  --ds-hover-status-active: rgba(46, 213, 115, 0.3);
}
```

### **🚀 Component Agnostic Benefits**

#### **Universal Application Examples**
- **`--ds-priority-high`** works for: Hot leads, urgent orders, critical customers, overdue payments
- **`--ds-status-active`** works for: Approved quotes, active customers, completed orders, successful payments
- **`--ds-text-link`** works for: Any clickable element across leads, quotes, orders, customers

#### **Future-Proof Design**
- ✅ **Component Names Can Change**: Button labels, icons, component structure - semantic colors remain valid
- ✅ **New Components**: Instantly inherit consistent color system (inventory, production, analytics)
- ✅ **Theme Changes**: Update one variable → changes entire platform
- ✅ **Zero Technical Debt**: No more hardcoded colors anywhere in the codebase

#### **Business Logic Integration**
- **Priority System**: Works universally for business urgency (leads, orders, customers, tasks)
- **Status System**: Works universally for business process states (quotes, payments, production, delivery)
- **Text Hierarchy**: Works universally for communication consistency (success, warnings, errors)

### **📊 Phase 4.1 Implementation Results**

**Before Standardization:**
- LeadManagement.module.css: ~50 hardcoded color values
- QuotationOrders.module.css: ~11 hardcoded color values
- Total: 61+ scattered hardcoded colors

**After Standardization:**
- LeadManagement.module.css: 0 hardcoded colors
- QuotationOrders.module.css: 0 hardcoded colors  
- Total: 100% business-neutral semantic variables

**Visual Consistency Verified:**
- Both components show identical computed styles
- Header consistency achieved using `--ds-text-primary`
- Clean compilation with zero TypeScript issues

---

## 🏗️ **COMPONENT ARCHITECTURE**

### **1. Unified Header Pattern**
**The Standard 3-Column Grid Layout** (proven in LeadManagement):

**CSS Implementation:**
```css
.unifiedHeader {
  display: grid;
  grid-template-columns: minmax(3.5rem, auto) 1fr minmax(5rem, auto);
  align-items: center;
  margin: var(--ds-gap-md) auto var(--ds-gap-lg) auto;
  padding: var(--ds-padding-header);
  max-width: 1400px;
  background: var(--ds-bg-card);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-card);
  border: 1px solid var(--ds-border-primary);
  gap: var(--ds-gap-sm);
}
```

**React Structure:**
```jsx
<div className={styles.unifiedHeader}>
  <button className={styles.addButton}>+ Add</button>
  <div className={styles.filterDropdownContainer}>
    <select className={styles.filterDropdown}>
      <option value="all">All Items</option>
    </select>
  </div>
  <div className={styles.itemCounter}>
    {filteredItems.length} items
  </div>
</div>
```

### **2. Progressive Disclosure Pattern**
**Three-Tier Information Architecture** (from V2 requirements):

**State Management:**
```jsx
// Standard state setup for any component
const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

const toggleDetails = (itemId: string) => {
  setExpandedDetails(prev => {
    const newSet = new Set(prev);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    return newSet;
  });
};
```

**CSS Structure (Updated - Universal System):**
```css
/* UPDATED: Use global classes - implemented in index.css */
.ds-expanded-details {
  margin: var(--ds-space-md) 0;
  padding: var(--ds-space-md);
  background: var(--ds-bg-expanded);
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border-primary);
  animation: expandIn 0.2s ease-out;
}

.ds-details-content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-xs); /* Tighter spacing for professional density */
}

.ds-details-content p {
  margin: 0;
  font-size: var(--font-sm);
  color: var(--ds-text-primary);
  line-height: 1.4; /* Improved information density */
}
```

### **3. Contextual Actions System**
**Priority-Based Button Hierarchy** (proven pattern):

**Button Classes:**
```css
.actionBtn {
  font-size: var(--font-sm);
  min-height: var(--ds-touch-target-min);
  padding: var(--ds-padding-button);
  border-radius: var(--ds-radius-md);
  touch-action: var(--ds-touch-action);
  -webkit-tap-highlight-color: var(--ds-tap-highlight);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-xs);
  font-weight: 600;
  border: none;
}

.urgentBtn {
  background: var(--ds-btn-urgent);
  color: white;
}

.urgentBtn:hover {
  background: var(--ds-btn-urgent-hover);
  transform: translateY(-1px);
}

.primaryBtn {
  background: var(--ds-btn-primary);
  color: white;
}

.primaryBtn:hover {
  background: var(--ds-btn-primary-hover);
  transform: translateY(-1px);
}

.secondaryBtn {
  background: var(--ds-btn-secondary);
  color: var(--ds-btn-secondary-border);
  border: 2px solid var(--ds-btn-secondary-border);
}

.secondaryBtn:hover {
  background: var(--ds-btn-secondary-hover);
  color: white;
}

.moreBtn {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
  border: 1px solid #4299e1;
}
```

### **4. Card Layout Standards**
**Professional Card System** (extracted from LeadManagement):

```css
.businessCard {
  background: var(--ds-bg-card);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  border: 1px solid var(--ds-border-primary);
  transition: all 0.3s ease;
  box-shadow: var(--ds-shadow-card);
  margin-bottom: var(--ds-space-lg);
}

.businessCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--ds-shadow-elevated);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--ds-space-md);
  flex-wrap: wrap;
  gap: var(--ds-space-sm);
}

.cardActions {
  display: flex;
  gap: var(--ds-space-sm);
  margin-top: var(--ds-space-md);
  flex-wrap: wrap;
}
```

### **4. Universal Expanded Details System** ⭐ **NEW**
**Global CSS Classes for All Progressive Disclosure Content**

**Problem Solved:** Eliminates duplicate expanded details CSS across components, ensures consistent spacing and animation platform-wide.

**Implementation Status:** ✅ **ACTIVE** - Implemented in `index.css`, used by LeadManagement and QuotationOrders

#### **When to Use:**
- "More..." button expansions in business cards
- Detailed information sections in any component  
- Progressive disclosure content (fabric requirements, history, etc.)
- Any expandable content areas across the platform

#### **Global CSS Classes (DO NOT RECREATE):**
```css
/* Global classes in /index.css - NEVER recreate in component CSS */
.ds-expanded-details {
  margin: var(--ds-space-md) 0;
  padding: var(--ds-space-md);
  background: var(--ds-bg-expanded);
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-border-primary);
  animation: expandIn 0.2s ease-out;
}

.ds-details-content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-xs); /* Professional 4-8px spacing */
}

.ds-details-content p {
  margin: 0;
  font-size: var(--font-sm);
  color: var(--ds-text-primary);
  line-height: 1.4; /* Optimized information density */
}

.ds-details-content strong {
  color: var(--ds-text-secondary);
  font-weight: 600;
}
```

#### **Standard Content Patterns:**
```jsx
// Pattern A: Simple Information (LeadManagement style)
<div className="ds-expanded-details">
  <div className="ds-details-content">
    <p><strong>Contact:</strong> {lead.contact}</p>
    <p><strong>Business:</strong> {lead.business}</p>
    <p><strong>Inquiry:</strong> {lead.inquiry}</p>
  </div>
</div>

// Pattern B: Complex Information (QuotationOrders style)
<div className="ds-expanded-details">
  <div className="ds-details-content">
    <p><strong>Company:</strong> {quote.companyName} - {quote.location}</p>
    <p><strong>Date:</strong> {quote.date} | <strong>Valid Until:</strong> {quote.validUntil}</p>
    <p><strong>Amount:</strong> {formatCurrency(quote.amount)} (incl. GST)</p>
  </div>
</div>

// Pattern C: Status/Reference Information  
<div className="ds-expanded-details">
  <div className="ds-details-content">
    <p><strong>📋 From Lead:</strong> <span className="link">{leadId}</span></p>
    <p><strong>📦 Order Status:</strong> {orderStatus}</p>
  </div>
</div>
```

#### **React Implementation Template:**
```jsx
// State management
const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

// Toggle function
const toggleDetails = (itemId: string) => {
  setExpandedDetails(prev => {
    const newSet = new Set(prev);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    return newSet;
  });
};

// UI Implementation
{expandedDetails.has(item.id) && (
  <div className="ds-expanded-details">
    <div className="ds-details-content">
      <p><strong>Label:</strong> {item.value}</p>
      {/* Add more content following standard patterns */}
    </div>
  </div>
)}
```

#### **🚨 CRITICAL DEVELOPER RULES:**
1. **NEVER** create `.expandedDetails` or `.detailsContent` in component CSS
2. **ALWAYS** use global `.ds-expanded-details` and `.ds-details-content` classes
3. **FOLLOW** standard content patterns for consistent information display
4. **USE** proper semantic markup with `<strong>` for labels
5. **INCLUDE** units and context (e.g., "incl. GST", emojis for visual clarity)

#### **Migration Checklist for Existing Components:**
- [ ] Replace component `.expandedDetails` with global `.ds-expanded-details`
- [ ] Replace component `.detailsContent` with global `.ds-details-content`  
- [ ] Remove duplicate CSS from component `.module.css` files
- [ ] Verify spacing matches Design System V2 standards
- [ ] Test expansion animation and responsive behavior

---

## 🏛️ **CSS ARCHITECTURE STANDARDIZATION**
### **Complete Implementation Guide for Global CSS Patterns**

### **1. Unified Header Responsive System**

**Problem Solved:** Desktop unified headers had poor spacing with filter dropdowns too wide, items pushed to extremes.

**Solution Implemented:**
- **Mobile-specific CSS**: `MobileAppShell.css` handles mobile-specific global patterns (≤768px)
- **Desktop-specific CSS**: `App.css` handles desktop headers (≥769px)  
- **Component CSS**: Components use global `className="unifiedHeader"` instead of module classes

#### **Mobile Header System (`MobileAppShell.css`)**
```css
@media (max-width: 768px) {
  .unifiedHeader {
    display: grid;
    grid-template-columns: minmax(3.5rem, auto) 1fr minmax(5rem, auto);
    align-items: center;
    margin: clamp(0.5rem, 2vw, 1.25rem) auto clamp(1rem, 3vw, 1.5rem) auto;
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem);
    /* Optimized for mobile touch interaction */
  }
}
```

#### **Desktop Header System (`App.css`)**
```css
@media (min-width: 769px) {
  .unifiedHeader {
    display: grid;
    grid-template-columns: auto minmax(200px, 300px) auto auto;
    align-items: center;
    justify-content: flex-start;
    gap: clamp(0.5rem, 1vw, 0.75rem);
    /* Better spacing distribution for desktop */
  }
}
```

#### **Component Migration Pattern**
```jsx
// Before: Module-specific classes
<div className={styles.unifiedHeader}>

// After: Global unified class  
<div className="unifiedHeader">
```

### **2. Global CSS Variable System**

**Problem Solved:** Component headers showing different colors despite same design intent.

**Root Cause:** Different CSS specificity and variable resolution chains

**Standard Solution Pattern:**
```css
/* Global Variable (index.css) */
--color-primary: #2d3748;  /* Single source of truth */

/* LeadManagement: Both rules now use global variable */
.leadHeader h3 { color: var(--color-primary) !important; }
.companyName { color: var(--color-primary); }

/* QuotationOrders: Uses global variable */
.quoteHeader h3 { color: var(--color-primary) !important; }
```

**Key Benefits:**
- Header colors standardized across all components
- Global variable as single source of truth
- CSS cascade and specificity conflicts resolved
- Scalable pattern for additional color standardization

### **3. CSS Architecture Clean Separation**

**Four-Layer CSS Architecture:**

| **CSS File** | **Responsibility** | **Screen Size** | **Content** |
|--------------|-------------------|-----------------|-------------|
| `index.css` | Global variables, universal classes | All | Colors, typography, .ds-btn, .ds-expanded-details |
| `App.css` | Common web + mobile application styles | All | Shared layouts, common patterns, universal search clearance |
| `MobileAppShell.css` | Mobile-specific global styles | ≤768px | Mobile shell, mobile navigation, mobile-only patterns |
| `Component.module.css` | Component-specific styles | All | Business logic, card layouts, component behavior (desktop + mobile) |

**🚨 Critical Separation Rules:**
- **NEVER mix responsibilities** - each file has single purpose
- **NO global styles in component CSS** - use index.css
- **NO hardcoded mobile overrides** - use proper layer
- **CONSISTENT class naming** - global classes without module prefixes

#### **📋 Complete 4-Layer CSS Architecture Guide**

**Layer 1: `index.css` - Global Foundation**
```css
/* Purpose: Pure global variables and universal classes */
:root {
  /* Design System V2 variables */
  --font-xs: clamp(12px, 2.5vw, 14px);
  --ds-btn-primary: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
  /* Universal button classes */
}
.ds-btn { /* Universal button foundation */ }
.ds-expanded-details { /* Universal progressive disclosure */ }
```

**Layer 2: `App.css` - Common Application Styles**
```css
/* Purpose: Shared patterns for both web and mobile */
.unified-header { /* Common header layout */ }
.search-clearance { /* Universal search spacing */ }
/* Shared layout components */
```

**Layer 3: `MobileAppShell.css` - Mobile-Specific Global**
```css
/* Purpose: Mobile shell and navigation patterns */
@media (max-width: 768px) {
  .mobile-navigation { /* Mobile nav patterns */ }
  .mobile-shell-layout { /* Mobile-specific layouts */ }
}
```

**Layer 4: `Component.module.css` - Component-Specific**
```css
/* Purpose: Component business logic and layouts */
.componentScreen { /* Desktop + mobile component styles */ }
.businessCard { /* Component-specific patterns */ }
/* Handles both desktop and mobile in single file */
```

**🎯 Loading Order & Responsibility:**
1. **index.css** → Global variables foundation (loaded first)
2. **App.css** → Common application patterns (shared between platforms)  
3. **MobileAppShell.css** → Mobile-specific additions (when applicable)
4. **Component.module.css** → Component-specific styling (on-demand)

**✅ Architecture Benefits:**
- **Clean Separation**: Each layer has single, well-defined responsibility
- **Flexible Common Layer**: App.css accommodates shared web + mobile patterns  
- **Pure Foundation**: index.css remains focused on variables and universal classes
- **Unified Components**: One CSS file per component handles both desktop and mobile
- **Scalable**: Easy to add new components following established patterns

### **4. Compilation and Cache Management**

**Problem:** CSS changes not reflecting due to browser/webpack cache issues

**Standard Solution Process:**
1. **Kill all npm processes**: `pkill -f "npm start"`
2. **Clear port 3000**: `lsof -ti:3000 | xargs kill -9`  
3. **Fresh compilation**: `npm start` 
4. **Verify success**: "Compiled successfully! No issues found."

**Cache Prevention Best Practices:**
- Always check `BashOutput` for compilation status
- Never declare "fixed" without verifying webpack compilation
- TypeScript cache can show false positives - verify actual build
- ESLint + TypeScript + Webpack run together - check combined result

### **5. Universal Button System Migration**

**Standard Button Migration Pattern:**
```jsx
// Before: Component-specific classes
<button className={`${styles.actionBtn} ${styles.primaryBtn}`}>

// After: Global unified classes
<button className="ds-btn ds-btn-primary">
```

### **6. Developer Troubleshooting Guide** 🛠️ **NEW**

#### **CSS Not Applying Checklist:**
1. **Check compilation status** - Use BashOutput to verify webpack success
2. **Clear browser cache** - Hard refresh (Cmd+Shift+R)
3. **Restart npm process** - Kill and restart for cache clearing
4. **Verify CSS specificity** - Use browser DevTools to check which rule wins
5. **Check CSS cascade order** - Ensure proper variable resolution chain

#### **Color Consistency Debugging:**
```css
/* Debug pattern - Check CSS specificity conflicts */
.componentHeader h3 { color: var(--color-primary) !important; }  /* Higher specificity */
.headerText { color: var(--color-primary); }                     /* Lower specificity */

/* Solution - Use !important on highest specificity rule */
```

#### **Common CSS Issues:**
- **"Variables not working"** → Check compilation success first
- **"Mobile broken"** → Verify proper CSS layer separation  
- **"Colors different"** → Check CSS specificity and cascade order
- **"Layout weird"** → Ensure no hardcoded mobile padding overrides

---

## 🔘 **UNIVERSAL BUTTON SYSTEM**
### **Global Button Foundation (Similar to Font System)**

**Problem Solved:** Eliminates duplicate button definitions across LeadManagement and QuotationOrders components

### **Global Button Classes in `/index.css`**
Add to existing Design System V2 variables:

```css
/* Universal Button Foundation - extends existing Design System V2 */
.ds-btn {
  /* Base structure using existing DS variables */
  padding: var(--ds-padding-button);
  border-radius: var(--ds-radius-md);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  /* Mobile optimization using existing standards */
  min-height: var(--ds-touch-target-min);
  touch-action: var(--ds-touch-action);
  -webkit-tap-highlight-color: var(--ds-tap-highlight);
  
  /* Responsive flex layout */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-xs);
}

/* Primary Button Variant */
.ds-btn-primary {
  background: var(--ds-btn-primary);
  color: white;
}
.ds-btn-primary:hover {
  background: var(--ds-btn-primary-hover);
  transform: translateY(-1px);
}

/* Secondary Button Variant (proven in Lead/Quote components) */
.ds-btn-secondary {
  background: var(--ds-btn-secondary);
  color: var(--ds-text-primary);
  border: 1px solid var(--ds-btn-secondary-border);
}
.ds-btn-secondary:hover {
  background: var(--ds-btn-secondary-hover);
  color: white;
  transform: translateY(-1px);
}

/* Urgent/Hot Priority Actions */
.ds-btn-urgent {
  background: var(--ds-btn-urgent);
  color: white;
}
.ds-btn-urgent:hover {
  background: var(--ds-btn-urgent-hover);
  transform: translateY(-1px);
}

/* Action-Specific Variants (from Lead/Quote success) */
.ds-btn-call { 
  background: #2ed573; 
  color: white;
}
.ds-btn-call:hover { 
  background: #7bed9f; 
}

.ds-btn-whatsapp { 
  background: #25d366; 
  color: white;
}
.ds-btn-whatsapp:hover { 
  background: #128c7e; 
}

/* Filter Buttons (QuotationOrders pattern) */
.ds-btn-filter {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
  border: 1px solid #4299e1;
}
.ds-btn-filter:hover {
  background: #4299e1;
  color: white;
}

/* More/Toggle Buttons */
.ds-btn-more {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
  border: 1px solid #4299e1;
  min-width: 80px;
}
.ds-btn-more:hover {
  background: #4299e1;
  color: white;
}
```

### **Usage Pattern Examples**
```jsx
// Replace component-specific classes:
// Before: className={`${styles.actionBtn} ${styles.primaryBtn}`}
// After:  className="ds-btn ds-btn-primary"

<button className="ds-btn ds-btn-call">📞 Call</button>
<button className="ds-btn ds-btn-secondary">✏️ Edit Lead</button>
<button className="ds-btn ds-btn-more" onClick={() => toggleDetails(id)}>
  {expanded ? 'Less...' : 'More...'}
</button>
```

### **Single-Row Button Layout Pattern** ⭐ **NEW**

All components now use consistent single-row button layouts with natural wrapping for better mobile efficiency:

```css
/* Single-row layout with natural wrapping - in component CSS */
.actionButtons {
  display: flex;
  gap: var(--ds-space-sm);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--ds-space-md);
}
```

**Implementation Example:**
```jsx
{/* BEFORE: Forced two-row layout */}
<div className={styles.primaryActions}>
  <button className="ds-btn ds-btn-primary">📞 Call</button>
  <button className="ds-btn ds-btn-primary">📱 WhatsApp</button>
</div>
<div className={styles.secondaryActions}>
  <button className="ds-btn ds-btn-secondary">📄 View</button>
  <button className="ds-btn ds-btn-more">More...</button>
</div>

{/* AFTER: Single row with natural wrapping */}
<div className={styles.actionButtons}>
  <button className="ds-btn ds-btn-primary">📞 Call</button>
  <button className="ds-btn ds-btn-primary">📱 WhatsApp</button>
  <button className="ds-btn ds-btn-secondary">📄 View</button>
  <button className="ds-btn ds-btn-more">More...</button>
</div>
```

**Benefits:**
- **Space Efficient**: Uses available horizontal space better on both mobile and desktop
- **Natural Flow**: Buttons wrap only when screen space insufficient
- **Consistent Layout**: Same pattern across all components (LeadManagement, QuotationOrders, etc.)
- **Responsive**: Works seamlessly across all device sizes

### **Benefits**
✅ **Single Source of Truth**: All button styling in `/index.css`  
✅ **Zero Duplication**: Remove duplicate button definitions across components  
✅ **Global Consistency**: Change button colors/spacing everywhere at once  
✅ **Mobile Responsive**: Works perfectly on all devices using existing Design System V2  
✅ **Performance**: Smaller CSS bundle, better caching
✅ **Efficient Layouts**: Single-row patterns maximize screen space usage

---

---

## 🛠️ **IMPLEMENTATION GUIDELINES & DEVELOPER RULES**

### **🚨 CRITICAL DEVELOPER RULES - PREVENT REWORK**

#### **Universal Systems Usage (MANDATORY)**
1. **NEVER recreate `.ds-expanded-details` or `.ds-details-content` in component CSS**
   - These classes exist globally in `index.css`
   - Always use global classes for expanded content areas
   - Remove any duplicate CSS after migration

2. **ALWAYS use `.ds-btn` global button classes**
   - Replace all component-specific button styles with global classes
   - Use `.actionButtons` for single-row layouts with natural wrapping
   - Remove duplicate button CSS from component modules

3. **FOLLOW single-row button layout pattern**
   - Use `.actionButtons` container for all button groups
   - Let buttons wrap naturally when screen space insufficient
   - Avoid forced two-row layouts (`.primaryActions` + `.secondaryActions`)

#### **Design System V2 Compliance (NON-NEGOTIABLE)**
1. **Typography**: Zero hardcoded font-size values - always use CSS variables
2. **Spacing**: Only use `var(--ds-padding-screen)` for screen-level padding
3. **Touch Targets**: Minimum 42px height for all interactive elements
4. **Responsive**: Use clamp() functions for all spacing and sizing

#### **Component Development Workflow**
1. **Start with global systems** - check what exists in `index.css` first
2. **Migrate existing components** - replace duplicates with global classes
3. **Follow standard patterns** - use established React/CSS structures
4. **Test responsiveness** - verify mobile and desktop behavior
5. **Document changes** - update Design System V2 when adding new patterns

#### **Quality Gates Before Merge**
- [ ] Zero compilation errors with current npm start
- [ ] All buttons use global `.ds-btn` classes
- [ ] All expanded details use global `.ds-expanded-details` classes
- [ ] Single-row button layouts implemented (`.actionButtons`)
- [ ] No hardcoded font sizes or spacing values
- [ ] Mobile responsiveness tested and verified
- [ ] Global color variables implemented (`var(--color-primary)`)
- [ ] CSS architecture properly separated (4-layer system)
- [ ] All hardcoded colors migrated to global variables

---

## 📝 **IMPLEMENTATION TEMPLATES**

### **Standard Component Structure**
**Copy-Paste React Component Template:**

```jsx
import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import styles from './ComponentName.module.css';

interface ComponentProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
  // Add other props as needed
}

function ComponentName({ filterState, onFilterChange }: ComponentProps) {
  const { t } = useTranslation();
  
  // Standard progressive disclosure state
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Standard toggle function
  const toggleDetails = (itemId: string) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  
  return (
    <div className={styles.componentScreen}>
      <div className={styles.pageContent}>
        {/* Standard Unified Header */}
        <div className={styles.unifiedHeader}>
          <button className={styles.addButton}>+ {t('add')}</button>
          <div className={styles.filterDropdownContainer}>
            <select 
              className={styles.filterDropdown}
              value={filterState}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="all">{t('showAll')}</option>
              {/* Add filter options */}
            </select>
          </div>
          <div className={styles.itemCounter}>
            {/* Count filtered items */} items
          </div>
        </div>

        {/* Standard Card Container */}
        <div className={styles.itemsContainer}>
          {/* Map through items */}
          <div className={styles.businessCard}>
            <div className={styles.cardHeader}>
              <h3>{/* Item title */}</h3>
              <div className={styles.badgeContainer}>
                {/* Status badges */}
              </div>
            </div>
            
            {/* Essential preview info */}
            <div className={styles.essentialPreview}>
              {/* Key information visible by default */}
            </div>
            
            {/* Contextual actions */}
            <div className={styles.contextualActions}>
              <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                Primary Action
              </button>
              <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                Secondary Action
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.secondaryBtn} ${styles.moreBtn}`}
                onClick={() => toggleDetails(itemId)}
              >
                {expandedDetails.has(itemId) ? 'Less...' : 'More...'}
              </button>
            </div>
            
            {/* Progressive disclosure content */}
            {expandedDetails.has(itemId) && (
              <div className={styles.expandedDetails}>
                <div className={styles.detailsContent}>
                  {/* Detailed information */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentName;
```

### **Standard CSS Module Template**
**Copy-Paste CSS Pattern:**

```css
/* Component Screen Styles - Design System V2 */
.componentScreen {
  min-height: 100vh;
  padding: var(--ds-padding-component);
  text-align: left !important;
  background: var(--ds-bg-primary);
  color: var(--ds-text-primary);
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0;
}

/* Page Content Container */
.pageContent {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Unified Header Pattern - Standard Implementation */
.unifiedHeader {
  display: grid;
  grid-template-columns: minmax(3.5rem, auto) 1fr minmax(5rem, auto);
  align-items: center;
  margin: var(--ds-gap-md) auto var(--ds-gap-lg) auto;
  padding: var(--ds-padding-header);
  max-width: 1400px;
  background: var(--ds-bg-card);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-card);
  border: 1px solid var(--ds-border-primary);
  gap: var(--ds-gap-sm);
}

/* Standard Button Components */
.addButton {
  padding: var(--ds-padding-button);
  border: none;
  border-radius: var(--ds-radius-md);
  font-size: var(--font-sm);
  font-weight: 600;
  background: var(--ds-btn-primary);
  color: white;
  cursor: pointer;
  min-height: var(--ds-touch-target-min);
  min-width: clamp(3.5rem, 15vw, 5rem);
  touch-action: var(--ds-touch-action);
  -webkit-tap-highlight-color: var(--ds-tap-highlight);
  transition: all 0.2s ease;
}

.addButton:hover {
  background: var(--ds-btn-primary-hover);
  transform: translateY(-1px);
}

/* Standard Filter Dropdown */
.filterDropdownContainer {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.filterDropdown {
  font-size: var(--font-base);
  min-height: var(--ds-touch-target-min);
  width: 100%;
  touch-action: var(--ds-touch-action);
  padding: var(--ds-padding-button);
  border: 1px solid var(--ds-border-secondary);
  border-radius: var(--ds-radius-md);
  background: var(--ds-bg-card);
  color: var(--ds-text-secondary);
  cursor: pointer;
  outline: none;
}

/* Standard Item Counter */
.itemCounter {
  font-size: var(--font-sm);
  min-width: clamp(4rem, 20vw, 6rem);
  min-height: var(--ds-touch-target-min);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--ds-text-secondary);
  font-weight: 600;
  background: rgba(66, 153, 225, 0.1);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-padding-button);
}

/* Standard Items Container */
.itemsContainer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
  display: grid;
  gap: var(--ds-space-lg);
  margin-bottom: var(--ds-space-xl);
}

/* Standard Business Card */
.businessCard {
  background: var(--ds-bg-card);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  border: 1px solid var(--ds-border-primary);
  transition: all 0.3s ease;
  box-shadow: var(--ds-shadow-card);
}

.businessCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--ds-shadow-elevated);
}

/* Standard Card Header */
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--ds-space-md);
  flex-wrap: wrap;
  gap: var(--ds-space-sm);
}

.cardHeader h3 {
  margin: 0;
  font-size: var(--font-lg);
  color: var(--ds-text-primary);
  font-weight: 600;
  flex: 1;
}

/* Standard Action Buttons */
.contextualActions {
  display: flex;
  gap: var(--ds-space-sm);
  margin-top: var(--ds-space-md);
  flex-wrap: wrap;
}

.actionBtn {
  font-size: var(--font-sm);
  min-height: var(--ds-touch-target-min);
  padding: var(--ds-padding-button);
  border-radius: var(--ds-radius-md);
  touch-action: var(--ds-touch-action);
  -webkit-tap-highlight-color: var(--ds-tap-highlight);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-xs);
  font-weight: 600;
  border: none;
  flex: 1;
  min-width: clamp(60px, 20vw, 80px);
}

.primaryBtn {
  background: var(--ds-btn-primary);
  color: white;
}

.primaryBtn:hover {
  background: var(--ds-btn-primary-hover);
  transform: translateY(-1px);
}

.secondaryBtn {
  background: var(--ds-btn-secondary);
  color: var(--ds-btn-secondary-border);
  border: 1px solid var(--ds-btn-secondary-border);
}

.secondaryBtn:hover {
  background: var(--ds-btn-secondary-hover);
  color: white;
  transform: translateY(-1px);
}

.moreBtn {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
  border: 1px solid #4299e1;
}

/* Standard Progressive Disclosure */
.expandedDetails {
  background: var(--ds-bg-expanded);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  margin-top: var(--ds-space-md);
  border: 1px solid var(--ds-border-primary);
  box-shadow: var(--ds-shadow-card);
}

.detailsContent p {
  margin: var(--ds-space-sm) 0;
  font-size: var(--font-sm);
  line-height: 1.4;
  color: var(--ds-text-primary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .unifiedHeader {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--ds-gap-md);
    padding: var(--ds-space-lg);
  }
  
  .cardHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ds-space-sm);
  }
  
  .contextualActions {
    gap: var(--ds-space-xs);
  }
  
  .actionBtn {
    min-height: 42px;
    font-size: var(--font-xs);
    padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem);
  }
}
```

---

## ✅ **QUALITY ASSURANCE**

### **Component Compliance Checklist**
**Mandatory verification for every component:**

#### **Typography Compliance (NON-NEGOTIABLE)**
- [ ] Zero hardcoded font-size values (px, rem, em)
- [ ] All text uses CSS variables (--font-xs through --font-xl)
- [ ] Responsive scaling verified across screen sizes

#### **Touch Optimization (UNIVERSAL REQUIREMENT)**
- [ ] All interactive elements minimum 42px height
- [ ] `touch-action: manipulation` on all buttons/links
- [ ] `-webkit-tap-highlight-color: transparent` for clean mobile experience
- [ ] Comfortable spacing between touch targets

#### **Unified Header Pattern (WHERE APPLICABLE)**
- [ ] CSS Grid layout with 3-column structure
- [ ] Responsive spacing using clamp() functions
- [ ] Professional styling matching Design System standards
- [ ] Touch targets minimum 42-44px height

#### **Progressive Disclosure (FOR COMPLEX COMPONENTS)**
- [ ] Three-tier information architecture implemented
- [ ] Mobile-first approach to information hierarchy
- [ ] Touch-friendly toggle controls with proper state management
- [ ] "More..." button functionality working correctly

#### **🚨 SPACING COMPLIANCE (CRITICAL - PREVENTS LAYOUT BREAKS)**
- [ ] **Screen padding ONLY uses `var(--ds-padding-screen)`** - zero hardcoded values
- [ ] **NO mobile padding overrides** - search for hardcoded padding in `@media (max-width: 768px)` blocks
- [ ] **NO container margin/padding overrides** - verify containers don't add extra spacing
- [ ] **Visual spacing matches LeadManagement exactly** - side-by-side comparison test
- [ ] **Zero 70px top padding or 25px extra side spacing** - specific QuotationOrders mistake prevention

#### **Color System Compliance**
- [ ] Background uses light gradient: `var(--ds-bg-primary)`
- [ ] Text uses dark colors: `var(--ds-text-primary)`
- [ ] Cards use white background: `var(--ds-bg-card)`
- [ ] Borders use standard colors: `var(--ds-border-primary)`

### **Compilation Verification**
**Pre-merge requirements:**
1. **Zero compilation errors** with current implementation
2. **ESLint compliance** with no warnings
3. **TypeScript strict mode** compliance
4. **Responsive behavior** tested across device sizes

### **Quality Gates**
- **No Phase Complete** until Design System compliance verified
- **No Merge** without font standardization confirmation  
- **No Deployment** with remaining hardcoded font sizes
- **Mobile Testing** required on actual device or Chrome DevTools

---

## 📱💻 **RESPONSIVE STRATEGY**

### **Mobile vs Desktop Philosophy**
**"Mobile-First with Desktop Enhancement"**

#### **Mobile (< 768px) - Primary Target**
- **Ultra-compact layouts**: Reduced padding, optimized spacing
- **Single-column layouts**: Cards stack vertically
- **Touch-optimized**: 48px minimum touch targets everywhere
- **Progressive disclosure**: "More..." buttons essential for screen space
- **Simplified headers**: Single-row layouts preferred

#### **Desktop (> 768px) - Enhanced Experience**  
- **Generous spacing**: Full padding and margins using clamp() max values
- **Multi-column layouts**: Grid layouts where beneficial
- **Mouse-optimized**: Hover effects, additional interactive elements
- **More visible content**: Less reliance on progressive disclosure
- **Enhanced navigation**: Additional context and shortcuts

### **Responsive Implementation Pattern**
**Standard Media Query Structure:**

```css
/* Base styles - Mobile first */
.component {
  /* Mobile-optimized default styles */
  padding: var(--ds-space-md);
  font-size: var(--font-sm);
}

/* Desktop enhancements */
@media (min-width: 768px) {
  .component {
    /* Desktop enhancements only */
    padding: var(--ds-space-lg);
    /* Additional features for larger screens */
  }
}
```

### **Breakpoint Standards**
**Consistent across all components:**
- **Mobile**: up to 768px (primary target)
- **Desktop**: 768px and above (enhanced experience)
- **Max Container Width**: 1400px for all content

---

## 🎯 **SUCCESS METRICS**

### **Development Efficiency**
- **50% reduction** in component implementation time
- **Zero rework** required for Design System compliance
- **Copy-paste implementation** for standard patterns

### **User Experience**
- **Consistent mobile experience** across all components
- **Professional appearance** matching LeadManagement quality
- **Touch-friendly interactions** for textile manufacturing context

### **Code Quality**
- **Zero hardcoded font sizes** in any component
- **100% responsive behavior** using clamp() patterns
- **Standardized component architecture** across codebase

---

**Document Status:** Complete Implementation Guide  
**Latest Updates:** CSS Architecture Standardization patterns and global variable systems  
**Reference Implementation:** LeadManagement + QuotationOrders Mobile UX V2 with unified CSS architecture