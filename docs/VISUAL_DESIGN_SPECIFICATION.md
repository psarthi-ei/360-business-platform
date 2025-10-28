# ElevateBusiness 360° - Complete Visual Design Specification

> **Complete Visual Design for Mobile-First MSME Textile Manufacturing Platform**  
> **Version**: 1.0  
> **Last Updated**: October 2025  
> **Focus**: Pure Visual Design - All Screens, Layouts, User Flows (Mobile + Web)


## Table of Contents

### **Quick Navigation**
- [Jump to Implementation Checklist](#visual-design-implementation-checklist)
- [Jump to Demo Script](#boss-i-need-this-demo-script)
- [Jump to Document Statistics](#document-statistics)

---

### **1. Design Vision & Context**
- [Design Mission](#design-mission)
- [Design Promise](#design-promise)
- [Design Success Criteria](#design-success-criteria)

### **2. Design Philosophy & Principles**
- [Visual Design Philosophy](#visual-design-philosophy)
  - [Clarity Over Complexity](#clarity-over-complexity)
  - [Professional Trust-Building](#professional-trust-building)
  - [Factory-Optimized Visibility](#factory-optimized-visibility)
  - [Progress-Driven Interface](#progress-driven-interface)
  - [Role-Based Visual Hierarchy](#role-based-visual-hierarchy)
  - [Multilingual Design Consideration](#multilingual-design-consideration)

### **3. User Roles & Design Context**
- [Design Personas & Interface Needs](#design-personas--interface-needs)
  - [Owner/Manager (Primary Design Focus)](#ownermanager-primary-design-focus)
  - [Production Supervisor](#production-supervisor)
  - [Operator/Worker](#operatorworker)
  - [Storekeeper](#storekeeper)
- [Design Environment Context](#design-environment-context)
  - [Physical Design Constraints](#physical-design-constraints)
  - [Cultural Design Context](#cultural-design-context)

### **4. Visual Design System**
- [Color Palette](#color-palette)
  - [Primary Colors](#primary-colors)
  - [Accent Colors](#accent-colors)
  - [Status Colors](#status-colors)
  - [Neutral Colors](#neutral-colors)
  - [Color Usage Rules](#color-usage-rules)
- [Typography System](#typography-system)
  - [Font Hierarchy](#font-hierarchy)
  - [Typography Rules](#typography-rules)
- [Spacing & Layout System](#spacing--layout-system)
  - [Spacing Scale (8px baseline)](#spacing-scale-8px-baseline)
  - [Layout Grid](#layout-grid)
- [Component Design System](#component-design-system)
  - [Button Styles](#button-styles)
  - [Card Styles](#card-styles)
  - [Navigation Styles](#navigation-styles)
  - [Modal Design System Standard](#modal-design-system-standard)
  - [Z-index Hierarchy Standard](#z-index-hierarchy-standard)
- [DESIGN DECISION: FAB vs Bottom CTA for Non-Tech Users](#design-decision-fab-vs-bottom-cta-for-non-tech-users)

### **5. Mobile Design Architecture**
- [Core Mobile Navigation Structure](#core-mobile-navigation-structure)
  - [5-Tab Bottom Navigation System](#5-tab-bottom-navigation-system)
  - [Shared Mobile UI Elements](#shared-mobile-ui-elements)
- [Tab Content Structure](#tab-content-structure)
  - [HOME Tab - Business Intelligence Dashboard](#home-tab---business-intelligence-dashboard)
  - [SALES Tab - Revenue Pipeline Management (ENHANCED)](#sales-tab---revenue-pipeline-management-enhanced)
  - [PRODUCTION Tab - Manufacturing](#production-tab---manufacturing)
  - [PROCUREMENT Tab - Supply Chain](#procurement-tab---supply-chain)
  - [CUSTOMERS Tab - Relationship Management](#customers-tab---relationship-management)
- [ANIMATION SYSTEM: Sequential Card Expansion](#animation-system-sequential-card-expansion)
- [CARD TEMPLATE SPECIFICATION: 140px Standard](#card-template-specification-140px-standard)
- [DESIGN DECISION: Universal Search Architecture](#design-decision-universal-search-architecture)
- [DESIGN DECISION: Fixed Layout Architecture](#design-decision-fixed-layout-architecture)

### **6. Complete Mobile Screen Specifications**
- [HOME DASHBOARD - Central Command Center](#home-dashboard---central-command-center)
- [SALES TAB - Revenue Pipeline Management](#sales-tab---revenue-pipeline-management)
  - [Sales Module Overview](#sales-module-overview)
  - [Leads Tab - Lead Management](#leads-tab---lead-management)
  - [Quotes Tab - Quotation Management](#quotes-tab---quotation-management)
  - [Orders Tab - Sales Order Management](#orders-tab---sales-order-management)
  - [Invoices Tab - Invoice Management](#invoices-tab---invoice-management)
  - [Sales Navigation Flows & Integration](#sales-navigation-flows--integration)
- [PRODUCTION TAB - Manufacturing Execution](#production-tab---manufacturing-execution)
  - [Production Module Overview](#production-module-overview)
  - [Plan Tab - Work Order Planning & Creation](#plan-tab---work-order-planning--creation)
  - [Active Tab - Live Production Tracking](#active-tab---live-production-tracking)
  - [QC Tab - Quality Control Management](#qc-tab---quality-control-management)
  - [Ready Tab - Delivery & Fulfillment Management](#ready-tab---delivery--fulfillment-management)
- [Production Module Cross-Integration Workflows](#production-module-cross-integration-workflows)
- [PROCUREMENT TAB - Supply Chain Management](#procurement-tab---supply-chain-management)
  - [Procurement Module Overview](#procurement-module-overview)
  - [MR Tab - Material Requirements](#mr-tab---material-requirements)
  - [PRs Tab - Purchase Requests](#prs-tab---purchase-requests)
  - [POs Tab - Purchase Orders](#pos-tab---purchase-orders)
  - [GRNs Tab - Goods Receipt Notes](#grns-tab---goods-receipt-notes)
  - [Inventory Management (Connected Screens)](#inventory-management-connected-screens)
- [CUSTOMERS TAB - Relationship Management](#customers-tab---relationship-management)
  - [Customer CRM Module Overview](#customer-crm-module-overview)
  - [Customer List View](#customer-list-view)
  - [Customer 360° View (Most Important Screen)](#customer-360-view-most-important-screen)
  - [Customer Orders Tab](#customer-orders-tab)
  - [Customer Payments Tab](#customer-payments-tab)
  - [Customer Tickets Tab](#customer-tickets-tab)
  - [Customer Insights Tab](#customer-insights-tab)
- [Customer CRM Integration Workflows](#customer-crm-integration-workflows)

### **7. Web Desktop Design Specifications**
- [Desktop Layout Architecture](#desktop-layout-architecture)
  - [Sidebar Navigation System](#sidebar-navigation-system)
- [Desktop Home Dashboard](#desktop-home-dashboard)
- [Desktop Sales Module](#desktop-sales-module)
- [Desktop Customer 360° View](#desktop-customer-360-view)
- [Desktop Reports & Analytics](#desktop-reports--analytics)

### **8. User Flow Diagrams**
- [Primary Business Flows](#primary-business-flows)
  - [Lead to Customer Conversion Flow](#lead-to-customer-conversion-flow)
  - [Order to Delivery Flow](#order-to-delivery-flow)
- [Mobile Navigation Flow](#mobile-navigation-flow)
  - [Tab-Based Navigation Structure](#tab-based-navigation-structure)
- [Cross-Module Integration Points](#cross-module-integration-points)
  - [Automated Workflow Triggers](#automated-workflow-triggers)
  - [Manual Override Points](#manual-override-points)

### **9. Interactive Design Patterns**
- [Touch Interaction Design](#touch-interaction-design)
  - [Button Interaction States](#button-interaction-states)
  - [Card Interaction Patterns](#card-interaction-patterns)
- [Interface Control Patterns](#interface-control-patterns)
  - [Configuration-Driven CTA Control](#configuration-driven-cta-control)
- [Voice Interaction Design](#voice-interaction-design)
  - [Voice Input Visual Patterns](#voice-input-visual-patterns)
  - [Voice Command Categories](#voice-command-categories)
- [Photo Capture Patterns](#photo-capture-patterns)
  - [Photo Capture UI Flow](#photo-capture-ui-flow)
- [Sync Status Indicators](#sync-status-indicators)
  - [Offline/Online State Design](#offlineonline-state-design)
- [Progress Visualization](#progress-visualization)
  - [Progress Indicator Patterns](#progress-indicator-patterns)

### **10. Design Validation & Demo Guidelines**
- [Design Validation Framework](#design-validation-framework)
  - [Usability Testing Checklist](#usability-testing-checklist)
  - [Visual Design Validation](#visual-design-validation)
- [Live Demo Execution Guide](#live-demo-execution-guide)
  - [Demo Environment Setup](#demo-environment-setup)
  - ["Boss, I Need This!" Demo Script](#boss-i-need-this-demo-script)
  - [Expected Positive Reactions](#expected-positive-reactions)
- [Success Metrics & KPIs](#success-metrics--kpis)
  - [Demo Success Indicators](#demo-success-indicators)
  - [Design Iteration Framework](#design-iteration-framework)

### **Implementation Resources**
- [Visual Design Implementation Checklist](#visual-design-implementation-checklist)
  - [Design System Implementation](#design-system-implementation)
  - [MOBILE UX PRINCIPLES FOR NON-TECH USERS](#mobile-ux-principles-for-non-tech-users)
  - [Mobile Design Implementation](#mobile-design-implementation)
  - [Desktop Design Implementation](#desktop-design-implementation)
  - [Interaction Design](#interaction-design)
  - [Visual Feedback Systems](#visual-feedback-systems)

### **Document Summary**
- [Conclusion](#conclusion)
  - [Design Achievements](#design-achievements)
  - [Ready for Implementation](#ready-for-implementation)
  - [Next Steps](#next-steps)

---

## 1. Design Vision & Context

### Design Mission
Create a **mobile-first visual experience** that transforms MSME textile manufacturing operations through intuitive, voice-enabled, multilingual interface design that provides complete 360° business visibility.

### Design Promise
- **WhatsApp-level simplicity** with professional appearance
- **Voice-enabled interface** optimized for factory environments
- **Complete business overview** in single-glance dashboard design
- **Offline-capable visual indicators** for unreliable connectivity

### Design Success Criteria
When MSME owners see the interface, they should immediately think: **"This looks simple but professional - I can use this!"**

**Visual Success Metrics:**
- Users can complete key tasks in ≤2 taps
- 80%+ task completion without instruction
- Professional appearance that builds trust
- Clear visual hierarchy that guides attention

---

## 2. Design Philosophy & Principles

### Visual Design Philosophy

#### **Clarity Over Complexity**
- **Principle**: One dominant action per screen
- **Visual Application**: Large, clear buttons; minimal visual noise
- **Layout Rule**: Maximum 3 primary elements visible at once

#### **Professional Trust-Building**
- **Color Strategy**: Industrial blues + professional grays
- **Typography**: Clean, readable fonts (Inter/Roboto)
- **Visual Tone**: Serious business tool, not consumer app

#### **Factory-Optimized Visibility**
- **Size Requirements**: Minimum 44px touch targets
- **Contrast**: High contrast for various lighting conditions
- **Visual Feedback**: Clear states (active, disabled, processing)

#### **Progress-Driven Interface**
- **Visual Pattern**: Always show "where we are" in workflows
- **Progress Indicators**: Steps, percentages, status badges
- **Completion Signals**: Strong visual confirmation of actions

#### **Role-Based Visual Hierarchy**
- **Owner View**: Dashboard + overview focus
- **Operator View**: Simple, task-focused layouts
- **Manager View**: Balanced detail + overview

#### **Multilingual Design Consideration**
- **Text Space**: Allow 30% extra space for Hindi/Gujarati
- **Icon Support**: Universal icons for key actions
- **RTL Consideration**: Flexible layouts for future expansion

---

## 3. User Roles & Design Context

### Design Personas & Interface Needs

#### **Owner/Manager** (Primary Design Focus)
- **Visual Needs**: Business overview, financial clarity, decision support
- **Screen Priority**: Dashboard, Sales, Customers, Reports
- **Design Approach**: Information-dense but organized, professional aesthetics

#### **Production Supervisor**
- **Visual Needs**: Clear production status, quality indicators, worker assignments
- **Screen Priority**: Production, Work Orders, Quality Control
- **Design Approach**: Status-focused, progress-heavy, action-oriented

#### **Operator/Worker**
- **Visual Needs**: Simple job instructions, clear start/stop actions
- **Screen Priority**: Simplified Production view, Job cards
- **Design Approach**: Minimal, large buttons, visual guidance

#### **Storekeeper**
- **Visual Needs**: Stock levels, material identification, receiving workflows
- **Screen Priority**: Procurement, Material Requirements, GRN
- **Design Approach**: List-heavy, photo-focused, quantity-emphasized

### Design Environment Context

#### **Physical Design Constraints**
- **Device**: Mid-range Android phones (5-6 inch screens)
- **Lighting**: Variable factory lighting (bright to dim)
- **Usage**: Often single-handed, potentially gloved hands
- **Noise**: High noise environments requiring visual confirmation

#### **Cultural Design Context**
- **Business Pride**: Professional appearance validates business success
- **Simplicity Preference**: WhatsApp-level ease of use expected
- **Language**: Gujarati primary, Hindi secondary, English technical terms
- **Trust Building**: Transparent data handling, clear sync status

---

## 4. Visual Design System

### Color Palette

#### **Primary Colors**
```
Primary Blue:    #1D4ED8  █ (Deep Industrial Blue)
Usage: Headers, primary CTAs, active states

Primary Dark:    #1E40AF  █ (Darker blue for hover states)
Usage: Button hover, emphasis

Primary Light:   #3B82F6  █ (Lighter blue for secondary elements)
Usage: Links, secondary actions
```

#### **Accent Colors**
```
Accent Orange:   #F97316  █ (Call-to-action highlights)
Usage: Urgent actions, FAB, important alerts

Accent Amber:    #FBBF24  █ (Warning states)
Usage: Pending items, caution indicators
```

#### **Status Colors**
```
Success Green:   #16A34A  █ (Completed actions)
Usage: ✅ Success states, completed items, sync success

Warning Yellow:  #EAB308  █ (Pending states)
Usage: ⚠️ Pending items, delays, requires attention

Error Red:       #DC2626  █ (Errors, urgent issues)
Usage: ❌ Failed actions, urgent problems, critical alerts
```

#### **Neutral Colors**
```
Background:      #F3F4F6  █ (Light gray - screen backgrounds)
Card Background: #FFFFFF  █ (White - card surfaces)
Border Gray:     #E5E7EB  █ (Subtle borders, dividers)
Text Primary:    #111827  █ (Almost black - main text)
Text Secondary:  #4B5563  █ (Dark gray - secondary text)
Text Muted:      #9CA3AF  █ (Light gray - disabled text)
```

#### **Color Usage Rules**
1. **Maximum 2 vibrant colors per screen** (maintain focus)
2. **High contrast ratios** (WCAG AA minimum - 4.5:1)
3. **Consistent status colors** across all modules
4. **Professional color relationships** (avoid consumer app aesthetics)

### Typography System

#### **Font Hierarchy**
```
Font Family: Inter (Primary), Roboto (Android fallback)

Display XL:    24px / Bold     (Page titles)
Display L:     20px / Semibold (Section headers)
Display M:     18px / Medium   (Card titles)

Body L:        16px / Regular  (Primary body text)
Body M:        14px / Regular  (Secondary text, labels)
Body S:        12px / Regular  (Captions, meta info)

Button:        16px / Medium   (All button text)
Label:         14px / Medium   (Form labels, chips)
```

#### **Typography Rules**
- **Readable at arm's length** (important for factory use)
- **Maximum 2 text hierarchy levels** per screen
- **No italic text** (difficult on mobile)
- **ALL CAPS only for buttons** and critical alerts

### Spacing & Layout System

#### **Spacing Scale (8px baseline)**
```
XXS: 4px   (Icon-text gaps)
XS:  8px   (Small element spacing)
S:   12px  (Related element groups)
M:   16px  (Default card padding)
L:   24px  (Section separation)
XL:  32px  (Screen margins)
XXL: 48px  (Major section breaks)
```

#### **Layout Grid**
```
Mobile:  4-column grid (360-480px width)
Tablet:  8-column grid (768-1024px width)  
Desktop: 12-column grid (1024px+ width)

Margins: 16px mobile, 24px tablet, 32px desktop
Gutters: 12px mobile, 16px tablet, 24px desktop
```

#### **Multi-Level Scroll Architecture**

**DESIGN DECISION: Single Scroll Container Pattern**

When implementing components with multiple hierarchical levels (parent → child → sub-child), use the **Single Scroll Container Pattern** to prevent height conflicts and ensure content accessibility.

**Architecture Patterns:**

**Pattern A: Single Container Scroll** (Recommended for most modules)
```
Module Container (overflow-y: auto)
├── Tab Navigation (fixed)
└── Tab Content (natural flow)
    └── Individual Components (natural flow)
```
*Used by: Sales, Production, Procurement modules*

**Pattern B: Dedicated Tab Container Scroll** (For complex hierarchies)
```
Module Container (overflow: hidden in special modes)
├── Fixed Headers
└── Tab Content Container (overflow-y: auto, flex: 1)
    └── Individual Tabs (natural flow, no height constraints)
```
*Used by: Customer360View*

**Pattern C: Nested Individual Scroll** (Special cases only)
```
Container
└── Multiple Cards
    └── Individual Tab Content (overflow-y: local)
```
*Used by: ProductionOrderManagement*

**Implementation Rules:**
1. **Single Scroll Handler**: Only ONE container per hierarchy should handle scrolling
2. **Height Management**: Use `height: 100%` for nested containers, not `height: 100vh`
3. **Flex Growth**: Scroll containers use `flex: 1` + `min-height: 0` + `overflow-y: auto`
4. **No Height Constraints**: Individual content components should flow naturally
5. **Touch Optimization**: Include `-webkit-overflow-scrolling: touch` for mobile

**CSS Implementation:**
```css
/* Scroll Container */
.scrollContainer {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  overscroll-behavior: contain;
}

/* Content Components */
.contentComponent {
  /* NO height: 100% or overflow: hidden */
  display: flex;
  flex-direction: column;
}

/* Competing Container Prevention */
.parentContainer.specialMode .parentContent {
  overflow: hidden; /* Disable parent scroll when child takes over */
}
```

**Case Study: Customer Module Fix**

**Background:**
The Customer module has a unique 4-level hierarchy that differs from other business modules:

```
Level 1: Customers.tsx (Main Module Container)
├── CSS: .customersModule (height: 100%, CSS Grid)
├── Content: .customersContent (grid-row: 3, overflow-y: auto)
└── State: Normal mode vs 360° view mode

Level 2: CustomerListManagement.tsx (List View)
├── Purpose: Shows customer list when NOT in 360° view
└── Scroll: Inherits from parent container

Level 3: Customer360View.tsx (360° Container)
├── CSS: .customer360Container (height: 100vh → PROBLEM)
├── Content: .tabContent (overflow-y: auto → CONFLICT)
└── Navigation: Fixed headers + tab navigation

Level 4: Individual Tabs (Content Components)
├── CustomerInsightsTab.tsx
├── CustomerInfoTab.tsx  
├── CustomerAccountStatementTab.tsx
├── CustomerOrdersTab.tsx
└── CustomerSupportTab.tsx
```

**Problem Identified:**
1. **Height Conflict**: Level 3 claimed `100vh` while sitting inside Level 1's grid
2. **Competing Scrollers**: Both Level 1 and Level 3 had `overflow-y: auto`
3. **Content Truncation**: Level 4 tabs had height constraints preventing full content access

**Solution Applied:**
```css
/* Step 1: Disable Level 1 scroll in 360° mode */
.customersModule.view360Mode .customersContent {
  overflow: hidden; /* Prevent competing scroll containers */
}

/* Step 2: Fix Level 3 height constraint */
.customer360Container {
  height: 100%; /* Fill available parent space instead of claiming full viewport */
}

/* Step 3: Remove Level 4 height constraints */
.ordersTabContainer, .supportTabContainer {
  /* Removed: height: 100%; overflow: hidden; */
  display: flex;
  flex-direction: column;
}

.infoTabContainer {
  /* Removed mobile: height: 100%; min-height: 0; */
}
```

**Architecture Comparison:**

*Before (Broken):*
```
Customers (overflow-y: auto) ← Scroll Handler 1
└── Customer360View (height: 100vh, overflow-y: auto) ← Scroll Handler 2 (CONFLICT)
    └── Individual Tabs (height: 100%, overflow: hidden) ← Content Blocked
```

*After (Fixed):*
```
Customers (overflow: hidden in 360° mode) ← Disabled in special mode
└── Customer360View (height: 100%, overflow-y: auto) ← Single Scroll Handler
    └── Individual Tabs (natural flow) ← Content Accessible
```

**Results:**
- ✅ Single scroll container architecture implemented
- ✅ All tab content fully accessible with scrolling
- ✅ No height truncation issues
- ✅ Proper mobile touch scrolling maintained
- ✅ Clean state transitions between normal and 360° modes

**Prevention Guidelines:**
1. **Never mix `height: 100vh` with grid-constrained parents**
2. **Only ONE container per hierarchy should handle scrolling**
3. **Use `height: 100%` for nested containers, not `height: 100vh`**
4. **Individual content components should never have height constraints**
5. **Test all tabs for full content accessibility**

### Component Design System

#### **Button Styles**
```
PRIMARY BUTTON
┌─────────────────────────────────┐
│        Create New Order         │ 44px height
│  #1D4ED8 bg, white text, 8px   │ Full width on mobile
│         border-radius           │ 16px padding
└─────────────────────────────────┘

SECONDARY BUTTON  
┌─────────────────────────────────┐
│         View Details            │ 44px height
│  Transparent bg, #1D4ED8 text  │ 2px border
│      #1D4ED8 border, 8px       │ 16px padding
│         border-radius           │
└─────────────────────────────────┘

FLOATING ACTION BUTTON (FAB)
    ┌─────┐
    │  +  │ 56px diameter
    │     │ #F97316 background
    └─────┘ Fixed bottom-right
```

#### **Modal Design System Standard**

**ESSENTIAL**: Global modal system ensuring consistent user experience across all modal interactions in the platform.

##### **IMPLEMENTED: Global Modal Design System** (October 2025)

**Solution Achieved**: React Portal-based modal system with global sizing standards and mobile-first optimization.

**Architecture Overview**: Single ModalPortal component + global CSS standards provide consistent modal behavior across entire platform.

##### **Global Modal Sizing Standard** ✅

**Universal Modal Dimensions**:
```css
/* Global Design System Standard - index.css */
.modal-portal-container .modalContent {
  max-width: 500px;  /* Consistent maximum width for all modals */
  width: 100%;       /* Full width on mobile, natural width on desktop */
}
```

**Modal Behavior Specifications**:
- **Desktop**: Content-responsive width up to 500px maximum
- **Mobile**: Full width with appropriate padding (16px)
- **Small Content**: Naturally sizes smaller (e.g., 350px for confirmations)
- **Large Content**: Caps at 500px for consistency and mobile usability

##### **Mobile-First Modal Architecture** ✅

**React Portal Implementation**:
```tsx
// Standard Modal Pattern - All Modals Use This
<ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
  <div className={styles.modalContent}>
    {/* Modal content automatically gets global sizing */}
  </div>
</ModalPortal>
```

**Mobile Optimization Features**:
- **Body Scroll Prevention**: Automatic background scroll lock
- **Touch Optimization**: Clean scroll lock without complex recovery logic
- **Container Escape**: React Portal renders at document.body level, escaping CSS Grid constraints

**Z-Index Simplification**: React Portal architecture eliminates complex z-index management - modals naturally appear above all page content without z-index conflicts.

##### **Parent-Child Modal System** ✅ (October 2025)

**IMPLEMENTED**: Simplified parent-child modal pattern for complex workflows without navigation confusion.

**Architecture Overview**: Clean state management approach for modal hierarchies (e.g., Delivery → Invoice Edit/View).

**Modal Navigation Philosophy**:
- **Multiple Exit Options**: X button, Cancel button, backdrop click
- **Context Awareness**: Breadcrumb navigation shows hierarchy
- **No Back Buttons**: Eliminates redundant navigation confusion
- **Automatic Restoration**: Parent modal restored when child closes

**Implementation Pattern**:
```tsx
// State Management - Simple & Clean
const [parentModal, setParentModal] = useState<string | null>(null);
const [childModal, setChildModal] = useState<string | null>(null);
const [parentState, setParentState] = useState<string | null>(null);

// Opening Child Modal - Save Parent Context
const openChildModal = (childId: string) => {
  if (parentModal) {
    setParentState(parentModal); // Save parent for restoration
  }
  setChildModal(childId);
};

// Closing Child Modal - Restore Parent
const closeChildModal = () => {
  setChildModal(null);
  if (parentState) {
    setParentModal(parentState); // Restore parent modal
    setParentState(null);
  }
};
```

**Modal Rendering Logic**:
```tsx
{/* Parent Modal - Hidden when child is open */}
{parentModal && !childModal && (
  <ModalPortal><ParentContent /></ModalPortal>
)}

{/* Child Modal - Independent rendering */}
{childModal && (
  <ModalPortal><ChildContent /></ModalPortal>
)}
```

**User Experience Benefits**:
- **Clear Hierarchy**: Breadcrumbs show "Parent → Child" context
- **Multiple Exits**: X (top-right), Cancel (bottom), backdrop click
- **No Confusion**: Single navigation purpose per button
- **Smooth Transitions**: Parent automatically restored when child closes

##### **Modal Content Guidelines** ✅

**Content-Responsive Sizing Examples**:
- **Simple Confirmations**: ~300-350px natural width
- **Business Forms**: ~400-450px natural width  
- **Complex Forms**: 500px maximum (capped for mobile usability)
- **All Modals**: Consistent visual footprint and backdrop visibility

**Visual Consistency Rules**:
- ✅ **Identical backdrop behavior** across all modals
- ✅ **Consistent centering and positioning** on all devices
- ✅ **Same animation and interaction patterns** platform-wide
- ✅ **Professional appearance** with standardized spacing and shadows

##### **Implementation Examples** ✅

**Current Working Modals**:
- **AddLeadModal**: Business form using global 500px standard
- **QC Inspection Modal**: Quality control form using global 500px standard  
- **Delivery Management Modals**: Parent-child modal pattern with invoice editing (October 2025)
- **Future Modals**: Automatically inherit consistent sizing and behavior

**Migration Pattern for Existing Modals**:
1. Wrap with `<ModalPortal>` component
2. Remove individual `max-width` CSS rules
3. **SIMPLIFIED**: Remove complex timeout/recovery logic, use basic scroll lock
4. **CLEAN NAVIGATION**: Use X button + Cancel, remove redundant Back buttons
5. Test on mobile devices for consistent behavior

#### **Z-index Hierarchy Standard**

**CRITICAL**: Universal z-index hierarchy to prevent modal and overlay conflicts across the platform.

##### **RESOLVED: Modal Visibility Architecture** (October 2025)
**Problem Solved**: CSS Grid stacking context isolation was preventing proper overlay layering.

**Root Cause**: Grid areas with `position: relative` + `z-index` created isolated stacking contexts.

**Solution Applied**: **React Portal Modal System** - Modals now render at document.body level, eliminating z-index complexity entirely.

**Current Implementation**:
- **All Modals**: React Portal system (no z-index conflicts)
- **Search Results**: `z-index: 10000` ✅ (still needed for dropdown positioning)  
- **Header Dropdown**: `z-index: 15000` ✅ (still needed for layering)
- **Grid Areas**: **NO z-index** ✅ (enables clean architecture)

##### **WORKING Z-index Hierarchy** ✅

**Architecture Foundation**: CSS Grid areas have **NO z-index** to enable global competition.

```
📋 PROVEN Z-INDEX SYSTEM (Global Competition)
┌─────────────────────────────────────┐
│ **Layer 4: React Portal Modals**   │ Portal (no z-index needed)
│ All Modals via ModalPortal         │ ✅ ABOVE ALL CONTENT
├─────────────────────────────────────┤
│ **Layer 3: System Dropdowns**      │ 15,000 - 15,999  
│ Header dropdowns, context menus     │ ✅ ABOVE CONTENT
├─────────────────────────────────────┤
│ **Layer 2: Search & Voice UI**     │ 10,000 - 14,999
│ Global search, voice assistant      │ ✅ FUNCTIONAL LAYER
├─────────────────────────────────────┤
│ **Layer 1: Navigation & UI**       │ 1,000 - 9,999
│ Bottom nav, tab nav, fixed elements │ ✅ STANDARD UI
├─────────────────────────────────────┤
│ **Layer 0: Content**               │ 1 - 999
│ Cards, buttons, regular components  │ ✅ BASE LAYER
└─────────────────────────────────────┘
```

**Key Architecture Principle**: **No CSS Grid Area Z-Index** enables clean global hierarchy.

##### **WORKING Z-index Assignments** ✅

**Layer 4: Modals & Critical UI (React Portal - No Z-Index Needed)**
```css
/* ✅ SIMPLIFIED: React Portal modals render at document.body */
/* ModalPortal component automatically appears above all content */
/* No z-index management needed - React Portal handles layering */

.legacy-modal-overlay     { z-index: 16000; }  /* Only for non-ModalPortal modals */
.confirmation-dialog      { z-index: 17000; }  /* System confirmations */
.emergency-alert          { z-index: 18000; }  /* Critical system alerts */
```

**Layer 3: System Dropdowns (15,000 - 15,999)**
```css
.header-dropdown          { z-index: 15000; }  /* Header profile menu ✅ */
.context-menu             { z-index: 15500; }
.tooltip-overlay          { z-index: 15800; }
```

**Layer 2: Search & Voice UI (10,000 - 14,999)**
```css
.global-search-results    { z-index: 10000; }  /* Search overlay ✅ */
.voice-assistant-overlay  { z-index: 10000; }  /* Voice interface ✅ */
.floating-action-button   { z-index: 12000; }
```

**Layer 1: Navigation & UI (1,000 - 9,999)**
```css
.bottom-navigation        { z-index: 1000; }   /* Mobile nav ✅ */
.tab-navigation           { z-index: 1000; }   /* Tab system ✅ */
.sticky-filters           { z-index: 2000; }
```

**Layer 0: Content (1 - 999)**
```css
.ds-card-expanded         { z-index: 100; }    /* Expanded cards */
.ds-card                  { z-index: 1; }      /* Base cards ✅ */
.page-content             { z-index: auto; }   /* Default content */
```

**CRITICAL**: CSS Grid areas (headerArea, searchArea, contentArea) have **NO z-index** values.

##### **Implementation Rules** ✅

**✅ REQUIRED**:
- **NEVER add z-index to CSS Grid areas** (headerArea, searchArea, contentArea)
- Use exact values from the WORKING hierarchy above
- Always test modal visibility across all overlay types
- Reference this proven hierarchy for new components

**❌ FORBIDDEN**:
- `z-index` on CSS Grid areas (breaks global competition)
- `z-index: 999999` or arbitrary extreme values  
- Overlapping ranges between layers
- Using `!important` for z-index conflicts

##### **Modal Implementation Standard** ✅

**Standard Modal Z-index**: `16000` (proven working value)
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 16000;  /* Layer 4: Modals ✅ WORKING VALUE */
  background: rgba(0, 0, 0, 0.5);
}
```

**Usage Example**:
```css
/* ✅ CORRECT - QC Modal */
.qc-modal-overlay { z-index: 80000; }

/* ❌ WRONG - Arbitrary high value */
.qc-modal-overlay { z-index: 999999; }
```

##### **Conflict Resolution Protocol**

1. **Identify Layer**: Determine which layer the element belongs to
2. **Check Range**: Ensure z-index is within correct layer range
3. **Update Documentation**: Add new assignments to this specification
4. **Test Stacking**: Verify no conflicts with existing elements

---

### **DESIGN DECISION: FAB vs Bottom CTA for Non-Tech Users**

#### **Original Specification:**
- Floating Action Button (FAB) with contextual meaning per tab
- Abstract "+" symbol changes function based on active tab

#### **Revised Specification (Based on User Research):**
**Target Users**: Non-technical Gujarat textile manufacturers (35-55 years)
**Context**: Factory environment, often wearing gloves, WhatsApp-level familiarity expected

**DECISION: Replace FAB with Clear Bottom CTA**

**Rationale:**
- ✅ **Clear Language**: "Add Lead" vs abstract "+" symbol  
- ✅ **Predictable Behavior**: Same action expected every time
- ✅ **Touch-Friendly**: 56px height, easy to tap with gloves
- ✅ **Business Context**: Immediately clear what action will happen
- ✅ **Reduced Cognitive Load**: No need to remember tab context

**Implementation:**
```
├─────────────────────────────────────┤
│         [+ Add Lead]                │ 56px contextual CTA
├─────────────────────────────────────┤
│ 🏠   💼•  🏭   📦   👥              │ Bottom nav (NO FAB)
└─────────────────────────────────────┘
```

**CTA Text by Tab:**
- Leads: [+ Add Lead]
- Quotes: [+ Add Quote]  
- Orders: [+ New Order]
- Invoices: [+ New Invoice]

---

### **DESIGN DECISION: Modal vs Expanded View for Actions and Information**

#### **Original Challenge:**
Need consistent patterns for when users interact with cards to either:
- **Perform Actions** (QC inspection, edit lead, complete work order)
- **View Information** (detailed specs, history, documentation)

#### **Target Users Analysis:**
**Context**: Gujarat textile manufacturers in factory environments
**Device Usage**: Primarily mobile, often wearing gloves, need clear focus

#### **DECISION: Hybrid Modal + Expanded View Pattern**

**ACTIONS → MODAL INTERFACE**
- **Use Case**: QC inspection, lead editing, order creation, invoice generation
- **Rationale**: Actions require focus and completion
- **UX Benefits**: 
  - ✅ **Eliminate Distractions**: Modal overlay blocks other interface elements
  - ✅ **Completion Focus**: Clear start/finish workflow with explicit save/cancel
  - ✅ **Error Prevention**: Modal prevents accidental navigation away from incomplete actions
  - ✅ **Mobile Optimized**: Full-screen on mobile provides maximum touch targets

**INFORMATION → EXPANDED VIEW**
- **Use Case**: QC specifications, batch details, order history, customer information
- **Rationale**: Information viewing benefits from context preservation
- **UX Benefits**:
  - ✅ **Context Preservation**: Users can still see related cards and list context
  - ✅ **Quick Scanning**: Easy to close and open multiple items for comparison
  - ✅ **Progressive Disclosure**: Show summary first, expand for details when needed
  - ✅ **Spatial Memory**: Information stays in its logical card position

#### **Implementation Pattern:**

**MODAL WORKFLOW - QC Inspection Example:**
```
User taps [Start QC] → Modal overlays entire screen
┌─────────────────────────────────────┐
│ QC Inspection — WO#451          [×] │ Modal header + close
│ Gujarat Garments | Mixed fabric     │ Context details  
├─────────────────────────────────────┤
│ ✅ QUALITY CHECKLIST                │ Section 1: Interactive checkboxes
│ 📷 PHOTO EVIDENCE                   │ Section 2: Photo capture
│ 📝 QC REMARKS                       │ Section 3: Notes textarea
│ 🎯 QC RESULT                        │ Section 4: Grade selection
│ [    ✅ Pass    ] [  ⚠️ Rework   ] │ Final action buttons
└─────────────────────────────────────┘
Modal closes → Returns to QC queue → Card shows updated status
```

**EXPANDED VIEW - QC Specifications Example:**
```
User taps [More] → Card expands in place
┌─────────────────────────────────────┐
│ WO#451 — Gujarat Garments | Loom A1 │ ← Header (unchanged)
│ ⏳ Pending QC • High Priority       │ ← Status (unchanged)
│ 1000m • Mixed fabric                │ ← Meta (unchanged)
│ [Start QC]                  [Less]  │ ← Actions (Less replaces More)
├─────────────────────────────────────┤ ← Expansion begins
│ 🎯 Quality Specifications           │ ← QC-focused information
│ Target Grade: A Grade               │
│ Color: Blue (Pantone 19-4052)       │
│ GSM Target: 180 ± 5                 │
│ 📋 QC Checklist Preview             │
│ □ Color match verification          │
│ □ GSM weight check                  │
│ ⚠️ Special Instructions             │
│ • Customer requires strict color match│
│ • Photo documentation mandatory     │
└─────────────────────────────────────┘
```

#### **Cross-Platform Application:**
**SYSTEM-WIDE STANDARD**: This pattern applies to ALL modules across the entire platform:

**SALES MODULE:**
- **Actions**: Create quote, Update lead status, Send proposal, Generate invoice → **Modal**
- **Information**: Lead history, Customer details, Quote specifications, Payment history → **Expanded View**

**PRODUCTION MODULE:**
- **Actions**: Start WO, Assign machine, QC inspection, Complete production → **Modal**  
- **Information**: Production details, Material specs, Machine status, QC specifications → **Expanded View**

**PROCUREMENT MODULE:**
- **Actions**: Create PO, Adjust stock, Transfer material, Approve supplier → **Modal**
- **Information**: Stock history, Supplier details, Material specifications, Audit trail → **Expanded View**

**CUSTOMER MODULE:**
- **Actions**: Update customer status, Send communication, Create support ticket → **Modal**
- **Information**: Order history, Contact details, Communication timeline, Account summary → **Expanded View**

**HOME DASHBOARD:**
- **Actions**: Quick actions (Add lead, Create order, Generate report) → **Modal**
- **Information**: Metrics details, Chart drill-downs, Activity timelines → **Expanded View**

**UNIVERSAL RULE**: If user needs to INPUT/CHANGE data → Modal | If user needs to VIEW/ANALYZE data → Expanded View

#### **Design System Integration:**
- **Modal CSS Classes**: `.ds-modal-overlay`, `.ds-modal-content`, `.ds-modal-header`
- **Expanded View CSS Classes**: `.ds-card-expanded`, `.ds-expansion-content`, `.ds-expansion-section`
- **Button States**: `[Start QC]` → `[View Progress]` → `[View Report]` (action button evolution)
- **Consistent Heights**: Modal sections follow Visual Design Spec measurements (32px/44px/56px/60px)

#### **Success Metrics:**
- ✅ **Action Completion Rate**: Higher completion for modal-based workflows
- ✅ **Information Scanning**: Faster access to details via expanded views  
- ✅ **User Satisfaction**: Clear expectations for action vs information patterns
- ✅ **Mobile Performance**: Optimal touch targets and focus management

---

### **DESIGN DECISION: Modal vs Full Page Navigation Framework**

#### **Critical UX Decision Framework**

**Context**: Based on analysis of Ready Tab success (task-focused 2-level modals) vs Customer 360° complexity (information-browsing requirements), establish definitive guidelines for when to use modals vs full page navigation.

#### **Industry Research & Best Practices**

**Leading CRM Mobile UX Patterns**:
- **Salesforce Mobile**: List → Full page records, tabs within pages, modals only for focused tasks
- **HubSpot Mobile**: Contact list → Full page contact view, minimal modal stacking
- **Pipedrive Mobile**: Person list → Full page detail, dedicated pages for complex workflows
- **Microsoft Dynamics**: Account list → Full page account view, bottom sheets for quick actions

**Key Industry Insight**: **Complex multi-tab interfaces always use full pages on mobile**

#### **Decision Matrix: Modal vs Full Page**

##### **✅ USE MODALS WHEN**

**1. Task-Focused Workflows (1-2 Levels Maximum)**
```
Examples:
- Edit Invoice → Save/Cancel
- QC Inspection → Pass/Reject
- Send Payment Reminder → Confirm/Cancel
- Record Payment → Amount/Method/Save
```

**2. Quick Actions (Single Purpose)**
```
Examples:
- Call customer
- Send WhatsApp message
- Update status
- Add note
```

**3. Simple Forms (1-3 Fields Maximum)**
```
Examples:
- Add lead (name, phone, product)
- Schedule delivery (date, time)
- Record expense (amount, category)
```

**4. Confirmation Dialogs**
```
Examples:
- Delete confirmation
- Submit for approval
- Mark as complete
```

##### **❌ USE FULL PAGES WHEN**

**1. Multi-Tab Information Interfaces (3+ Tabs)**
```
Examples:
- Customer 360° (Summary|Orders|Payments|Tickets|Insights)
- Product Catalog Management
- Comprehensive Reports Dashboard
- Inventory Management System
```

**2. Complex Data Relationships**
```
Examples:
- Order management with production tracking
- Customer relationship with full history
- Financial dashboard with multiple charts
- Supplier management with performance metrics
```

**3. Extended User Sessions**
```
Examples:
- Data analysis workflows
- Report generation and editing
- Multi-step configuration processes
- Comprehensive form wizards (5+ steps)
```

**4. Information Exploration & Analysis**
```
Examples:
- Business intelligence dashboards
- Historical trend analysis
- Cross-module data correlation
- Documentation and help systems
```

#### **Modal Depth Guidelines**

##### **Safe Pattern (Ready Tab Model) ✅**
```
Page → Task Modal → Edit Modal → STOP
```
**Example**: Ready Tab → Plan Delivery → Edit Invoice → Save & Close
**Why it works**: Clear hierarchy, single purpose per level, obvious exit paths

##### **Dangerous Pattern (Avoid) ❌**
```
Page → Info Modal → Tab Content → Action Modal → Sub-Action
```
**Example**: Customer List → Customer Modal → Orders Tab → Create Order → Add Items
**Why it fails**: Too many contexts, lost navigation, cognitive overload

#### **Implementation Patterns**

##### **Pattern 1: Quick Preview → Full Details**
```
Customer List → [Quick View] → Summary Modal (Level 1)
                               ↓ [Full Details]
                               Customer 360° Page (Full Navigation)
```

##### **Pattern 2: Task-Focused Modal Chain**
```
Production List → [QC Inspect] → QC Modal (Level 1)
                                 ↓ [Add Photo]
                                 Photo Capture Modal (Level 2)
                                 ↓ [Save]
                                 Return to QC Modal → Save QC → Done
```

##### **Pattern 3: Direct Page Navigation**
```
Sales List → [View Customer] → Customer 360° Page
                              ↓ Tab Navigation (Orders|Payments|etc)
                              All content within page
```

#### **Mobile UX Optimization**

##### **Modal on Mobile**
- **Maximum 2 levels**: Beyond this, users lose context
- **Full screen**: 500px max width, full width on mobile
- **Touch-friendly**: 44px minimum touch targets
- **Clear exits**: X button + Cancel + backdrop tap

##### **Full Page on Mobile**
- **Sticky headers**: Context always visible (customer name + key metric)
- **Tab navigation**: Horizontal scrolling tabs within page
- **Breadcrumbs**: Clear navigation path
- **Bottom sheets**: For quick actions within pages

#### **Content Complexity Thresholds**

##### **Modal Appropriate**
- **Text**: Under 200 words per screen
- **Form fields**: 1-5 fields maximum
- **Actions**: 1-3 primary actions
- **Time**: 30 seconds to 2 minutes task duration

##### **Full Page Required**
- **Text**: Over 200 words, multiple sections
- **Form fields**: 5+ fields, multiple sections
- **Actions**: Multiple workflows, complex interactions
- **Time**: 2+ minutes, exploratory sessions

#### **Ready Tab Analysis: Why Modals Work**

**Current Ready Tab Pattern** ✅:
```
Ready Tab → [Plan Delivery] → Delivery Planning Modal
                             ↓ [Edit Invoice]
                             Invoice Edit Modal
                             ↓ [Save]
                             Back to Delivery Modal → Complete
```

**Success Factors**:
- ✅ **Linear workflow**: Each step has clear next action
- ✅ **Task completion**: User accomplishes specific goal
- ✅ **Context restoration**: Parent modal restored after child closes
- ✅ **Single purpose**: Each modal serves one clear function

#### **Customer 360° Analysis: Why Full Page Needed**

**ARCHITECTURAL DECISION: Information-Only Customer 360° View**

**Business Analysis Results** (Gujarat Textile Manufacturing):
- **Real workflow**: Business decisions made via phone calls, not digital buttons
- **Information need**: Complete customer context during conversations
- **Mobile optimization**: Screen space better used for information vs actions
- **Non-tech users**: Prefer dedicated action locations vs contextual buttons

**Final Customer 360° Pattern** ✅:
```
Customer List → [360° View] → Customer 360° Page (INFORMATION ONLY)
                           ├── Insights Tab (KPIs, business intelligence)
                           ├── Info Tab (company details, contacts - MOST IMPORTANT)
                           ├── Orders Tab (order history, tracking)  
                           ├── Payments Tab (financial overview)
                           └── Support Tab (ticket history)
```

**Information-Only Requirements**:
- ✅ **Pure information display**: Zero action buttons within 360° view
- ✅ **Communication access**: Call/WhatsApp buttons for contacts in Info tab
- ✅ **Extended browsing**: 5+ minutes analyzing complete customer relationship
- ✅ **Business context**: Everything needed for customer conversations
- ✅ **Mobile optimized**: Maximum information density, no wasted space on actions

**Action Separation Principle**:
- **Customer 360° View**: "जानकारी देखना" (View Information)
- **Module Tabs**: "नया काम करना" (Do New Work) 
- **Clear workflow**: Information viewing ≠ Action taking

#### **Implementation Guidelines**

##### **For New Components:**

**Step 1: Classify the Use Case**
```
Ask: "Is this task-focused or information-browsing?"
Task-focused → Consider modal
Information-browsing → Use full page
```

**Step 2: Count the Complexity**
```
Ask: "How many tabs/sections/workflows are involved?"
1-2 focused tasks → Modal appropriate
3+ tabs or complex workflows → Full page required
```

**Step 3: Estimate User Session**
```
Ask: "How long will users spend in this interface?"
Under 2 minutes → Modal acceptable
Over 2 minutes → Full page better UX
```

**Step 4: Consider Mobile Context**
```
Ask: "Does this work well on a 375px screen?"
Simple, focused content → Modal works
Complex, multi-section content → Full page needed
```

##### **Code Implementation Standards**

**Modal Implementation**:
```tsx
// Task-focused modal pattern
<ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
  <div className={styles.modalContent}>
    <div className={styles.modalHeader}>
      <h3>Task Title</h3>
      <button onClick={handleClose}>×</button>
    </div>
    <div className={styles.modalBody}>
      {/* Focused task content */}
    </div>
    <div className={styles.modalFooter}>
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </div>
  </div>
</ModalPortal>
```

**Full Page Implementation**:
```tsx
// Information-browsing page pattern
<div className={styles.fullPageContainer}>
  <div className={styles.stickyHeader}>
    <h1>Entity Name</h1>
    <div className={styles.keyMetrics}>Key KPIs</div>
  </div>
  <div className={styles.tabNavigation}>
    {tabs.map(tab => <TabButton key={tab.id} />)}
  </div>
  <div className={styles.pageContent}>
    {/* Tab content rendered inline */}
  </div>
</div>
```

#### **Success Metrics & Validation**

##### **Modal Success Indicators**
- ✅ **High completion rates**: Users finish the intended task
- ✅ **Quick task completion**: Under 2 minutes average
- ✅ **Low abandonment**: Minimal modal exits without completion
- ✅ **Clear user intent**: Users understand what they're doing

##### **Full Page Success Indicators**
- ✅ **Extended engagement**: Users spend 2+ minutes exploring
- ✅ **Tab utilization**: Users navigate between multiple tabs
- ✅ **Return visits**: Users come back to continue analysis
- ✅ **Mobile usability**: Smooth navigation on small screens

#### **Migration Strategy for Existing Components**

**Phase 1: Audit Current Patterns**
- Identify all current modal usage
- Classify as task-focused vs information-browsing
- Measure user session durations and completion rates

**Phase 2: Apply Decision Framework**
- Task-focused with clear completion → Keep as modal
- Information-browsing or complex navigation → Migrate to full page
- Multi-tab interfaces → Always migrate to full page

**Phase 3: Implementation & Testing**
- Implement new patterns following guidelines
- A/B test modal vs full page for borderline cases
- Measure user satisfaction and task completion

**Phase 4: Platform Standardization**
- Update all components to follow framework
- Document patterns in component library
- Train team on decision criteria

#### **Framework Summary**

**Golden Rules**:
1. **2-level maximum** for modals
2. **Task-focused** → Modal | **Information-browsing** → Full page  
3. **3+ tabs** → Always full page
4. **Mobile-first** decision making
5. **Industry patterns** as validation

**Ready Tab proves modals work for focused tasks. Customer 360° requires full page for complex workflows. This framework ensures consistent, user-friendly navigation patterns across the entire platform.**

---

#### **Card Styles**
```
STANDARD CARD
┌─────────────────────────────────┐
│ Card Title                      │ 16px padding
│ Secondary information           │ White background
│ Primary action area             │ 12px border-radius
│                                 │ Subtle shadow
└─────────────────────────────────┘

KPI CARD
┌───────────────┐
│   Revenue     │ 20px padding
│   ₹4.2L       │ Center aligned
│   ↑5%         │ Accent color for metrics
└───────────────┘

ALERT CARD
┌─────────────────────────────────┐
│ ⚠️ 2 orders blocked - Material │ #FEF3C7 background
│ shortage (300kg)                │ #EAB308 border
│                [Resolve] ──────→│ Action button right
└─────────────────────────────────┘
```

#### **DS Card Actions Extension (NEW)**

**Standard Card Actions Pattern**: Optional action buttons that can be added to any DS card for immediate operator access to key functions.

```
STANDARD CARD (Base)
┌─────────────────────────────────┐
│ Card Title                      │ Header: 24px
│ Status indicators               │ Status: 21px  
│ Meta information                │ Meta: 34px
│                           More  │ Expand: 16px
└─────────────────────────────────┘ Total: 140px

ENHANCED CARD (With Actions)
┌─────────────────────────────────┐
│ Card Title                      │ Header: 24px
│ Status indicators               │ Status: 21px
│ Meta information                │ Meta: 34px
│ [Action] [Action] [Action]      │ Actions: 44px ← NEW
│                           More  │ Expand: 16px
└─────────────────────────────────┘ Total: 184px ← CONDITIONAL HEIGHT
```

**Conditional Height System**:
- **Base Cards (No Actions)**: 140px - maintains DS standard
- **Enhanced Cards (With Actions)**: 184px - conditional increase only
- **Implementation**: `.ds-card-with-actions` modifier class
- **Mixed Grids**: Cards adapt height based on action presence

**Action Button Guidelines**:
- **Maximum 3-4 buttons** per card (mobile constraint: 343px width)
- **Button priority**: Primary actions only (80% use case)
- **Touch targets**: 44px minimum height for factory environment
- **Flexible placement**: Actions can be moved between surface and expanded view

**Button Capacity by Screen**:
```
Mobile (375px):  [80px] [80px] [80px]     = 3 buttons optimal
Desktop (wider): [100px] [100px] [100px] [100px] = 4 buttons max
```

**Usage Examples**:
- **Work Orders**: `[📊 Update] [✅ Done] [⏸️ Pause]`
- **Sales Orders**: `[📞 Call] [📱 WhatsApp] [📄 Invoice]`  
- **Purchase Orders**: `[✅ Approve] [❌ Reject] [📝 Edit]`
- **Quality Control**: `[✅ Pass] [❌ Reject] [📸 Photo]`

**Visual Update Interface**: Toggle mode for quantity updates
```
Normal Mode:    45m / 100m (45%)
Update Mode:    [-] [65] [+] m / 100m (65%)
```

**Flexibility Benefits**:
- **Action Migration**: Easy to move buttons between surface and expanded views
- **Usage-Driven**: Surface the most frequent actions per user feedback
- **Consistent Pattern**: Same implementation across all modules
- **Factory Optimized**: Large touch targets, clear visual hierarchy

#### **Navigation Styles**
```
BOTTOM NAVIGATION (Mobile)
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 💼  │ 🏭  │ 📦  │ 👥  │ 64px height
│Home │Sales│Prod │Proc │Cust │ White background
└─────┴─────┴─────┴─────┴─────┘ Border top

Active state: #1D4ED8 color + underline
Inactive state: #6B7280 color

SIDEBAR NAVIGATION (Desktop)
┌─────────────────┐
│ 🏠 Home         │ 240px width
│ 💼 Sales        │ #F9FAFB background
│ 🏭 Production   │ Fixed left side
│ 📦 Procurement  │ Full height
│ 👥 Customers    │
│                 │
│ ⚙️ Settings     │
│ 👤 Profile      │
└─────────────────┘
```

---

## 5. Mobile Design Architecture

### Core Mobile Navigation Structure

#### **5-Tab Bottom Navigation System**
```
┌─────────────────────────────────────┐
│                                     │ Screen content area
│                                     │
│               Content               │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 🏠   💼   🏭   📦   👥         [+] │ 64px bottom nav
│Home Sales Prod Proc Cust       FAB │ Always visible
└─────────────────────────────────────┘
```

**Navigation Rationale:**
- **5 tabs = optimal mobile accessibility** (thumb reach)
- **Workflow-based grouping** matches business processes
- **Persistent visibility** enables 1-tap access anywhere
- **FAB context changes** per active tab

#### **Shared Mobile UI Elements**

**Global Header Pattern:**
```
┌─────────────────────────────────────┐
│ [←]  Good morning, Ramesh 👋   [🔔][⋯]│ 56px height
│ [🔍 Search orders, customers...(🎙)]│ 48px height
├─────────────────────────────────────┤
│                                     │
│           Screen Content            │
│                                     │
```

**Bottom CTA Pattern:**
```
│                                     │
│           Screen Content            │
│                                     │
├─────────────────────────────────────┤
│         [Primary Action]            │ 56px height
├─────────────────────────────────────┤ Sticky bottom
│ 🏠   💼   🏭   📦   👥         [+] │ 64px nav
└─────────────────────────────────────┘
```

### Tab Content Structure

#### **HOME Tab - Business Intelligence Dashboard**
```
Purpose: Single-glance business health + priority actions
Layout: Vertical scroll with card sections
Key Visual Elements:
- KPI strip (horizontal scroll)
- Action button row  
- Insight cards with CTAs
- Activity timeline
```

#### **SALES Tab - Revenue Pipeline Management (ENHANCED)**

**Purpose**: Complete Lead → Quote → Order → Invoice workflow
**Architecture**: Unified 4-tab interface with existing component integration
**Target Users**: Non-technical Gujarat textile manufacturers

**Tab Structure**: `[ Leads│Quotes│Orders│Inv ]`
**Layout**: 140px card template (optimized from Orders specification for content clarity)
**Integration**: Leverages existing LeadManagement, QuotationOrders, SalesOrders, Invoices components

**Key Visual Elements:**
- **48px Tab Navigation**: Visual Design primary colors (#1D4ED8)
- **44px Business Filters**: Tab-specific dropdown filters with counts
- **140px Card Height**: Optimized for content clarity with no element overlapping
- **Typography Hierarchy**: 20px header, 16px status, 14px meta (exact spec)
- **56px Bottom CTA**: Clear contextual text (no FAB)
- **Touch Targets**: 44px minimum for factory environment

**Visual Layout:**
```
┌─────────────────────────────────────┐ PlatformHeader (unchanged)
│ [🔍 Search everything... (🎙)]      │ Universal search
├─────────────────────────────────────┤
│ [ Leads│Quotes│Orders│Inv ]         │ 48px tab navigation
│ [All▼] [Hot▼] [This Month▼] [📊12] │ 44px business filters
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Suresh Textiles Pvt Ltd         │ │ 140px card template
│ │ Status: 🔥 Hot Lead             │ │ (optimized for clarity)
│ │ Cotton • ₹2.5L • 15 days        │ │
│ │ [Call] [Quote] [WhatsApp]       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         [+ Add Lead]                │ 56px contextual CTA
├─────────────────────────────────────┤
│ 🏠   💼•  🏭   📦   👥              │ Bottom nav (no FAB)
└─────────────────────────────────────┘
```

**2-Filter Dropdown Architecture (Standardized Across All Modules):**

**Filter Structure**: `[Status/Priority Filter ▼] [📅 Timeline Filter ▼] 📦{count}`

**Filter 1 - Status/Priority** (Module-specific):
- **Sales-Leads**: All Leads | 🔥 Hot | 🔶 Warm | 🔵 Cold
- **Sales-Quotes**: All Quotes | ⏳ Pending | ✅ Approved | ❌ Expired
- **Sales-Orders**: All Orders | 🟡 Production | ⚠️ Blocked | ✅ Delivered
- **Sales-Invoices**: All Invoices | 💰 Paid | 🟡 Pending | 🔴 Overdue
- **Production**: All Orders | 🟡 Planned | 🟠 Active | ✅ Complete
- **Procurement-MR**: All Materials | ⚠️ Shortages | ✅ Available | 🟡 Ordered
- **Procurement-PRs**: All Requests | ⏳ Pending | ✅ Approved | ❌ Rejected
- **Procurement-POs**: All Orders | 🟡 Open | ✅ Delivered | ❌ Cancelled
- **Customers**: All Customers | 🟢 Good | ⚠️ Late | ⭐ Excellent

**Filter 2 - Timeline** (Standardized across all modules):
- 📅 All Time
- 📅 Today
- 📅 This Week
- 📅 This Month

**Count Indicator**: Shows filtered results count (📦{number})

**Status Color System:**
- **Lead Priority**: Hot (Red), Warm (Orange), Cold (Blue)  
- **Quote Status**: Pending (Orange), Approved (Green), Expired (Red)
- **Order Status**: Production (Orange), Blocked (Red), Delivered (Green)
- **Invoice Status**: Paid (Green), Pending (Orange), Overdue (Red)

**Cross-Component Navigation:**
- Lead → Quote: Click [Quote] button switches to Quotes tab
- Quote → Order: Click [Proforma] button switches to Orders tab
- Order → Invoice: Click [Invoice] button switches to Invoices tab
- Unified workflow progression maintained

**Technical Implementation:**
- Container Pattern: Sales.tsx wrapper with existing components
- Business Logic Preservation: All existing functionality maintained
- Component Integration: LeadManagement → Leads, QuotationOrders → Quotes, etc.
- Visual Compliance: 140px card template applied to all tabs

### **ANIMATION SYSTEM: Sequential Card Expansion**

#### **Animation Design Philosophy:**
**Problem**: When expanding Card B while Card A is open, users lose visual connection between action and result.

**Solution**: Sequential animation with clear visual flow:
1. **Collapse Phase**: Card A closes (200ms animation)
2. **Brief Pause**: 200ms delay allows user to process collapse
3. **Expand Phase**: Card B opens from its bottom edge (250ms animation)
4. **Auto-Scroll**: Smooth scroll ensures expanded content is visible

#### **Animation Specifications:**
```css
/* Expand Animation */
@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);        /* Start above natural position */
  }
  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);            /* Slide to natural position */
  }
}

.expandedSection {
  animation: expandDown 0.25s ease-out;
  border-top: 2px solid #1D4ED8;        /* Visual connection to card */
  margin-top: -1px;                     /* Seamless connection */
}

/* Expanded Card Highlight */
.leadCard.expanded {
  box-shadow: 0 0 0 1px #1D4ED8;        /* Blue border highlight */
  border-bottom-radius: 0;               /* Connect to expanded section */
}
```

#### **TypeScript Implementation:**
```typescript
const toggleDetails = async (itemId: string) => {
  if (expandedDetails.has(itemId)) {
    // Simple collapse
    setExpandedDetails(new Set());
  } else {
    // Sequential expansion
    if (expandedDetails.size > 0) {
      setExpandedDetails(new Set());                    // Collapse existing
      await new Promise(resolve => setTimeout(resolve, 200)); // Wait
    }
    setExpandedDetails(new Set([itemId]));              // Expand new
    
    // Auto-scroll to ensure visibility
    setTimeout(() => {
      document.querySelector(`[data-lead-id="${itemId}"]`)?.scrollIntoView({
        behavior: 'smooth', block: 'start'
      });
    }, 100);
  }
};
```

#### **UX Benefits:**
- ✅ **Clear Visual Flow**: Users see old content close, then new content open
- ✅ **No Layout Jumps**: Sequential timing prevents simultaneous animations
- ✅ **Always Visible**: Auto-scroll ensures expanded content stays in view
- ✅ **Professional Feel**: Smooth, intentional animations build trust
- ✅ **Accessible**: Screen readers can follow logical progression

### **CARD TEMPLATE SPECIFICATION: 140px Standard**

#### **Master Card Architecture (Lead Management Template):**

**Physical Dimensions:**
```
┌─────────────────────────────────┐
│ Suresh Textiles Pvt Ltd         │ ← Header: 24px (20px font + 4px)
│ Status: 🔥 Hot Lead             │ ← Status: 21px (16px font + 5px) 
│ Cotton fabric • ₹2.5L •         │ ← Meta Line 1: 17px
│ 15 days delivery               │ ← Meta Line 2: 17px
│                           More  │ ← Indicator: 16px + auto margin
└─────────────────────────────────┘
Total Height: 140px (with 16px padding = 108px content)
```

#### **Element Specifications:**

**1. Card Container:**
```css
.cardContainer {
  height: 140px;                    /* Optimized for content clarity */
  padding: 16px;                    /* Symmetric professional padding */
  background: white;
  border-radius: 8px;
  border-left: 4px solid;           /* Priority color stripe */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
```

**2. Header Element:**
```css
.cardHeader {
  font-size: 20px;                 /* Visual Design Spec exact */
  font-weight: 600;
  color: #111827;
  height: 24px;                    /* Fixed to prevent compression */
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;                  /* Prevents compression */
  margin-bottom: 6px;
}
```

**3. Status Element:**
```css
.cardStatus {
  font-size: 16px;                 /* Visual Design Spec exact */
  font-weight: 500;
  color: #374151;
  height: 21px;                    /* Fixed to prevent compression */
  line-height: 1.3;
  flex-shrink: 0;                  /* Prevents compression */
  margin-bottom: 6px;
}
```

**4. Meta Content (2-Line):**
```css
.cardMeta {
  font-size: 14px;                 /* Visual Design Spec exact */
  color: #6B7280;
  max-height: 34px;                /* Exactly 2 lines: 14px × 1.2 × 2 + 4px */
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-shrink: 0;                  /* Prevents compression */
  margin-bottom: 8px;
}
```

**5. Expand Indicator:**
```css
.expandIndicator {
  font-size: 12px;
  color: #1D4ED8;
  margin-top: auto;                /* Push to bottom with flexbox */
  text-align: right;
  padding: 4px 6px;
  background: rgba(29, 78, 216, 0.1);
  border-radius: 4px;
  width: fit-content;
  align-self: flex-end;
}
```

#### **Content Guidelines:**

**Header Content:**
- **Lead Cards**: Company name only (e.g., "Suresh Textiles Pvt Ltd")
- **Quote Cards**: Company name + quote context
- **Order Cards**: Order number + company name
- **Invoice Cards**: Invoice number + company name

**Status Content:**
- **Format**: "Status: [Icon] [Label]"
- **Icons**: 🔥 Hot, 🔶 Warm, 🔵 Cold, ⏳ Pending, ✅ Approved, etc.

**Meta Content (2 Lines):**
- **Line 1**: Primary business info (fabric type, amount, priority)
- **Line 2**: Secondary info (timeline, delivery, payment status)
- **Separator**: " • " for inline items

#### **Template Replication Checklist:**
- ✅ 140px height with 16px padding
- ✅ Fixed element heights (24px, 21px, 34px)
- ✅ flex-shrink: 0 on all major elements
- ✅ Company/business-first headers with ellipsis
- ✅ 2-line meta with webkit-line-clamp
- ✅ Sequential animation toggle logic
- ✅ Blue border highlight when expanded
- ✅ Data attributes for scroll targeting

### **DESIGN DECISION: Universal Search Architecture**

#### **Original Specification:**
- Contextual search per tab: "Search orders...", "Search leads...", etc.
- Tab-specific search functionality

#### **Revised Specification (Based on UX Analysis):**
**DECISION: Universal Search Only**

**Rationale:**
- ✅ **Consistent Behavior**: Search works the same everywhere
- ✅ **Reduced Confusion**: No duplicate search systems
- ✅ **Cross-Tab Discovery**: Can find relationships across leads/quotes/orders
- ✅ **Simplified Mental Model**: One search for everything
- ✅ **Voice Integration**: Single voice search system

**Implementation:**
```
┌─────────────────────────────────────┐ PlatformHeader
│ [🔍 Search everything... (🎙)]      │ Universal search ONLY
├─────────────────────────────────────┤
│ [ Leads│Quotes│Orders│Inv ]         │ Tab navigation
│ [All▼] [Hot▼] [This Month▼] [📊12] │ Business filters (NOT search)
├─────────────────────────────────────┤
```

**Business Filters Replace Contextual Search:**
- Leads: All/Hot/Warm/Cold filters
- Quotes: All/Pending/Approved/Expired filters  
- Orders: All/Production/Blocked/Delivered filters
- Invoices: All/Paid/Pending/Overdue filters

---

### **DESIGN DECISION: Fixed Layout Architecture**

#### **UX Analysis for Non-Technical Users:**
**Target**: Gujarat textile manufacturers (35-55 years) in factory environments

#### **Layout Architecture Decision:**
**FIXED ELEMENTS (Always Visible):**
- ✅ **Tab Navigation** (48px) - Frequent Lead/Quote/Order switching
- ✅ **Business Filters** (44px) - Critical for quick filtering  
- ✅ **Bottom CTA** (56px) - Primary business actions must be accessible

**SCROLLABLE CONTENT:**
- ✅ **Card Content Area** - Natural scrolling for variable data

#### **Business Rationale:**
- **Quick Navigation**: Tabs always accessible for workflow switching
- **Instant Filtering**: Filter controls never hidden during scrolling
- **Action Accessibility**: Add buttons always visible for business efficiency
- **Content Flexibility**: Cards scroll naturally for large datasets

#### **Layout Structure:**
```
┌─────────────────────────────────────┐ ← PlatformHeader (FIXED)
├─────────────────────────────────────┤
│ [ Leads│Quotes│Orders│Inv ]    FIXED│ ← Tab Navigation (48px)
├─────────────────────────────────────┤  
│ [Status▼] [Timeline▼] [📊12]   FIXED│ ← Business Filters (44px)
├─────────────────────────────────────┤
│ ↕ SCROLLABLE CONTENT AREA ↕         │ ← Cards scroll here
│ [120px card] [120px card] ...       │
├─────────────────────────────────────┤
│         [+ Add Lead]           FIXED│ ← Bottom CTA (56px)
├─────────────────────────────────────┤
│ 🏠   💼•  🏭   📦   👥         FIXED│ ← Bottom Navigation
└─────────────────────────────────────┘
```

**Implementation Requirements:**
- **CSS Grid Layout**: Fixed row heights for nav/filters/CTA, flexible content area
- **Viewport Management**: Proper height calculations for mobile and desktop
- **Z-Index Management**: Ensure fixed elements layer correctly
- **Touch Targets**: Maintain 44px minimum for factory environment use

### **DESIGN DECISION: No Auto-Hide Header (MVP)**

#### **Decision Rationale:**
**ALWAYS-VISIBLE HEADER/SEARCH ARCHITECTURE FOR SIMPLICITY**

During MVP development, auto-hide header functionality was considered but **deliberately excluded** due to:

**Technical Complexity:**
- **Nested Scroll Containers**: Different modules (Sales, Production) use varying content architectures
- **CSS Grid Constraints**: Height management across responsive breakpoints becomes complex
- **Cross-Module Consistency**: Ensuring uniform behavior across all tabs requires significant architecture changes

**Business Priority:**
- **MVP Focus**: Core business functionality takes precedence over advanced UX features
- **User Feedback Driven**: Feature can be added in future iterations based on actual user behavior
- **Consistent Experience**: Always-visible navigation ensures predictable interface behavior

**Implementation Status:**
- ✅ **Fixed Header**: Always accessible for navigation and search
- ✅ **Fixed Filters**: Business controls remain visible during scrolling
- ✅ **Scrollable Content**: Cards area provides natural scrolling for data
- 🔄 **Future Consideration**: Auto-hide can be revisited post-MVP with user testing data

This decision maintains the **mobile-first, factory-optimized design principles** while keeping implementation focused on core business value delivery.

#### **DETAILED TECHNICAL ANALYSIS: Nested Scroll Container Issue**

**Root Cause Discovery:**
Auto-hide header functionality failed due to **architectural inconsistency** between tab components:

**Working Architecture (Dashboard Tab):**
```typescript
// Dashboard.tsx - Direct Content Rendering
<main className={styles.contentArea}>
  <div className={styles.dashboardCards}>
    {/* Direct card content - scrolls in main content area */}
    <Card />
    <Card />
  </div>
</main>
```

**Problematic Architecture (Sales/Production Tabs):**
```typescript
// Sales.tsx - Nested Scroll Container
<main className={styles.contentArea}>
  <div className={styles.salesModule}>
    <div className={styles.salesTabs}>...</div>
    <div className={styles.salesFilters}>...</div>
    <div className={`${styles.salesContent} ${styles.scrollable}`}>
      {/* NESTED SCROLL CONTAINER - scroll events don't bubble to main */}
      <Card />
      <Card />
    </div>
  </div>
</main>
```

**CSS Implementation Difference:**
```css
/* Dashboard - Direct scrolling */
.contentArea {
  overflow-y: auto; /* ✅ Scroll events fire on main container */
}

/* Sales/Production - Nested scrolling */
.salesContent {
  overflow-y: auto; /* ❌ Scroll events trapped in nested container */
  height: calc(100vh - 200px); /* Internal scroll area */
}
```

**Scroll Event Detection Failure:**
```typescript
// Auto-hide logic expects scroll events on main content area
useEffect(() => {
  const contentArea = document.querySelector('.contentArea');
  contentArea?.addEventListener('scroll', handleScroll);
  // ❌ FAILS: Sales/Production scroll events fire on nested .salesContent
}, []);
```

**Architecture Solutions Required:**
1. **Standardize Scroll Architecture**: All tabs must use main content area scrolling
2. **Refactor Nested Components**: Remove internal scroll containers from Sales/Production
3. **CSS Grid Redesign**: Ensure consistent height management across all modules
4. **Event Delegation**: Implement scroll detection for multiple container patterns

**Time Investment Analysis:**
- **Investigation**: 2+ hours debugging scroll detection across tabs
- **Root Cause**: 1 hour identifying nested container differences
- **Solution Design**: 2-3 hours architectural redesign required
- **Implementation**: 4-6 hours refactoring all tab components
- **Testing**: 2 hours cross-module validation

**Business Impact vs Development Cost:**
- **Feature Value**: Nice-to-have UX enhancement
- **Development Cost**: 10+ hours for comprehensive solution
- **Maintenance Risk**: Ongoing complexity for future tab additions
- **MVP Priority**: Core business functionality takes precedence

**Future Implementation Guidance:**
When revisiting auto-hide functionality post-MVP:
1. **Standardize Architecture**: Ensure all tabs use main content area scrolling
2. **Scroll Detection**: Implement robust event handling for nested containers
3. **Performance Testing**: Validate smooth animations across all modules
4. **User Testing**: Confirm actual user benefit before investment

#### **PRODUCTION Tab - Manufacturing**
```
Purpose: Work order execution and quality control
Sub-tabs: Today | In Progress | Completed
Layout: Card-based with progress visualization
Key Visual Elements:
- Progress bars
- Status indicators
- Large start/stop buttons
- Photo capture areas
```

#### **PROCUREMENT Tab - Supply Chain**
```
Purpose: Material requirements and purchasing
Sub-tabs: Material Req | PRs | POs | GRNs
Layout: Table-style lists with action buttons
Key Visual Elements:
- Quantity comparisons
- Status flags
- Photo attachment areas
- Vendor information
```

#### **CUSTOMERS Tab - Relationship Management**
```
Purpose: Customer 360° view and communication
Layout: List → Detail drill-down
Key Visual Elements:
- Customer cards with metrics
- Communication history
- Action buttons (Call, WhatsApp)
- Order/payment summaries
```

---

## 6. Complete Mobile Screen Specifications

### **HOME DASHBOARD** - Central Command Center

```
┌─────────────────────────────────────┐
│ [←]  Good morning, Ramesh 👋   [🔔][⋯]│ Header: 56px
│ [🔍 Search orders, customers...(🎙)]│ Search: 48px
├─────────────────────────────────────┤
│     KPI STRIP (swipe horizontal)    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │ 120px height
│ │Revenue  │ │Pending  │ │Orders   │ │ Cards: 104px
│ │₹4.2L ↑5%│ │Inv: 3   │ │Risk: 2  │ │ 8px gaps
│ └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│    PRIMARY ACTIONS (4 buttons)     │ 56px height
│ [+Order] [Payment] [PR] [Job]       │ 4px gaps
├─────────────────────────────────────┤
│ ⚠️ TOP INSIGHT CARD                 │
│ 2 orders blocked - Cotton shortage  │ Alert background
│ (300 kg)              [Resolve] ──→ │ 72px height
├─────────────────────────────────────┤
│ 📈 SALES SNAPSHOT                  │
│ Pipeline: Leads 12→Quotes 6→Orders 2│ 64px height
│                   [View Pipeline] ─→│
├─────────────────────────────────────┤
│ 🏭 OPERATIONS SNAPSHOT             │
│ WOs active: 5 | Delayed >24h: 1    │ 64px height
│                  [Open Production]─→│
├─────────────────────────────────────┤
│ 👥 CUSTOMER HEALTH                 │
│ Top: Suresh(₹1.2L) Ramesh(₹0.5L)   │ 64px height
│ Unhappy: 1           [View Customers]│
├─────────────────────────────────────┤
│ 📋 RECENT ACTIVITY                 │
│ • 09:12 Advance ₹25K (Acme)        │ Variable height
│ • 08:55 GRN received (ABC)         │ List items: 40px
│ • 08:15 WO#451 started (Line 2)    │ each
├─────────────────────────────────────┤
│ Last synced: 10:42 AM • 2 pending  │ 32px status
├─────────────────────────────────────┤
│ 🏠   💼   🏭   📦   👥         [+] │ 64px nav
│Home •Sales Prod Proc Cust       FAB │
└─────────────────────────────────────┘
```

**Visual Design Notes:**
- **KPI Cards**: White background, colored accents, large numbers
- **Alert Card**: Yellow background (#FEF3C7), orange border
- **Snapshot Cards**: Light gray background, blue accent headers
- **Activity Items**: Icons + timestamp + description
- **Sync Status**: Small text, color-coded (green/yellow/red)

### **SALES TAB** - Revenue Pipeline Management

#### **Sales Module Overview**

The Sales module manages the complete Lead-to-Invoice business workflow through 4 integrated main tabs (Leads│Quotes│Orders│Invoices). Each tab uses 2-filter dropdowns for status and timeline filtering. It serves as the primary revenue pipeline management system for textile manufacturers.

**Business Context**: Addresses the daily owner question: "કોણ call કર્યો? કયા leads hot છે? આજે કોને quotes મોકલવા?" (Who called? Which leads are hot? Who should I send quotes to today?)

**Module Structure:**
```
💼 SALES (Main Tab)
├── Leads - Lead capture and qualification (Default landing)
├── Quotes - Quotation creation and tracking
├── Orders - Sales order management (after payment)
└── Invoices - Invoice generation and payment tracking
```

**Complete Business Flow:**
```
📞 Lead Capture → 📋 Quote Creation → 💰 Advance Payment → 
📦 Sales Order → 🏭 Production → 🚚 Delivery → 💳 Final Invoice
```

**Cross-Module Integration:**
- **From Leads**: Hot leads → Customer creation (automated)
- **From Orders**: Paid orders → Production work orders (automated)
- **To Procurement**: Order materials → Material requirements (automated)
- **To Customers**: Order completion → Customer 360° profiles (automated)

---

#### **Leads Tab - Lead Management**

**Purpose**: Capture, qualify, and prioritize leads for quote conversion

**Access Flow**: `💼 Sales → Leads Tab` (Default landing)

##### **Leads List View**
```
┌─────────────────────────────────────┐
│ Sales    [ Leads│Quotes│Orders│Inv ]│ Sub-tabs: 48px
│ [All▼] [Hot▼] [Warm▼] [Cold▼] [📊12]│ Priority filters: 44px
├─────────────────────────────────────┤
│ 🔥 3 HOT LEADS NEED FOLLOW-UP       │ Alert header: 48px
│                                     │ Red background
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Suresh Textiles Pvt Ltd         │ │ Company name: 20px
│ │ Status: 🔥 Hot Lead             │ │ Priority status: 16px
│ │ Cotton fabric • ₹2.5L           │ │ Requirements: 14px
│ │ 15 days delivery | Follow: Today│ │ Timeline: 14px
│ │ [Call] [Quote] [WhatsApp]       │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ Ramesh Mills & Co               │ │
│ │ Status: 🔶 Warm Lead            │ │ Orange priority
│ │ Silk blend • Budget ₹1.8L      │ │
│ │ Follow-up: Tomorrow | Called 2d │ │
│ │ [Call] [Send Samples] [Details] │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│          [+ Add Lead]               │ 56px CTA
└─────────────────────────────────────┘
```

**Lead Priority System:**
- **🔥 Hot**: Immediate quote needed, high value, short timeline
- **🔶 Warm**: Interested, needs follow-up, medium priority
- **🔵 Cold**: Long-term prospect, periodic follow-up

##### **Lead Creation Flow**
```
┌─────────────────────────────────────┐
│ Add New Lead                    [×] │ Modal header
│ Lead Source: Phone Inquiry          │ Context: 32px
├─────────────────────────────────────┤
│ 🏢 Company Information              │ Section header
│ Company Name: [                   ] │ Required field: 44px
│ Contact Person: [                 ] │ Name input: 44px
│ Phone: [+91                      ] │ Phone input: 44px
│ WhatsApp: [Same as phone ☑      ] │ Checkbox option
├─────────────────────────────────────┤
│ 📋 Requirements                     │
│ Product Type:                       │
│ ● Cotton ○ Silk ○ Polyester ○ Blend│ Radio options: 40px
│ Quantity: [        ] meters         │ Quantity input: 44px
│ Budget Range: [₹       ] per meter  │ Budget input: 44px
├─────────────────────────────────────┤
│ ⚡ Priority & Timeline              │
│ Priority: ● Hot ○ Warm ○ Cold      │ Priority radio: 40px
│ Required By: [DD/MM/YYYY]          │ Date picker: 48px
│ Follow-up: [Today ▼]               │ Schedule dropdown
├─────────────────────────────────────┤
│ 📝 Notes                            │
│ ┌─────────────────────────────────┐ │
│ │ [Customer mentioned they need   │ │ Notes area: 60px
│ │  premium quality for exports]   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         [Save Lead] [Save & Quote]  │ Action buttons: 56px
└─────────────────────────────────────┘
```

---

#### **Quotes Tab - Quotation Management**

**Purpose**: Create, send, and track quotations for leads

**Access Flow**: `💼 Sales → Quotes Tab` or `Leads Tab → [Quote] button`

##### **Quotes List View**
```
┌─────────────────────────────────────┐
│ Sales    [ Leads│Quotes│Orders│Inv ]│ Tab bar: 48px
│ [All▼] [Pending▼] [Approved▼] [📊6]│ Status filters: 44px
├─────────────────────────────────────┤
│ ⏳ 4 QUOTES AWAITING RESPONSE       │ Alert header: 48px
│                                     │ Orange background
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Q#2024-105 — Suresh Textiles    │ │ Quote ID + Company: 20px
│ │ Status: ⏳ Pending Response      │ │ Status: 16px
│ │ ₹2,50,000 | Cotton 1000m       │ │ Value + Product: 14px
│ │ Sent: 2 days ago | Valid: 5d   │ │ Timeline: 14px
│ │ [Follow-up] [Revise] [Approve]  │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ Q#2024-104 — Ramesh Mills       │ │
│ │ Status: ✅ Approved             │ │ Green approved
│ │ ₹1,80,000 | Silk blend 800m    │ │
│ │ Approved: Today | Payment Due   │ │ Ready for order
│ │ [Create Order] [Send Proforma]  │ │ Conversion actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         [+ Create Quote]            │ 56px CTA
└─────────────────────────────────────┘
```

**Quote Status Flow:**
- **⏳ Pending**: Sent, awaiting customer response
- **🔄 Under Discussion**: Customer questions, revisions needed
- **✅ Approved**: Customer accepted, ready for payment
- **❌ Rejected**: Customer declined or expired
- **🔄 Revised**: New version created with updates

##### **Quote Creation Flow**
```
┌─────────────────────────────────────┐
│ Create Quote                    [×] │ Modal header
│ From Lead: Suresh Textiles          │ Context: 32px
│ Step 1 of 3 ●●○                     │ Progress indicator
├─────────────────────────────────────┤
│ 📋 Product Specifications           │ Section header
│ Product Type: Cotton Fabric         │ Pre-filled from lead
│ Width: [150] cm                     │ Input: 44px
│ GSM: [200] g/m²                     │ Quality specification
│ Quantity: [1000] meters             │ From lead requirements
│ Color: [Natural White ▼]           │ Color selection
├─────────────────────────────────────┤
│ 💰 Pricing                          │
│ Base Price: [₹250] per meter        │ Cost calculation
│ Treatment: [₹30] per meter          │ Additional processing
│ Total: ₹2,80,000                    │ Auto-calculated
│ Margin: 20% | Profit: ₹56,000      │ Business metrics
├─────────────────────────────────────┤
│ 📅 Terms & Conditions               │
│ Delivery: [25] days from advance    │ Timeline: 44px
│ Advance: [50%] = ₹1,40,000         │ Payment terms
│ Validity: [15] days                 │ Quote validity
├─────────────────────────────────────┤
│     [Save Draft] [Preview & Send]   │ Action buttons: 56px
└─────────────────────────────────────┘
```

---

#### **Orders Tab - Sales Order Management**

**Purpose**: Manage confirmed orders after advance payment received

**Access Flow**: `💼 Sales → Orders Tab` or `Quotes Tab → [Create Order] button`

##### **Orders List View**
```
┌─────────────────────────────────────┐
│ Sales    [ Leads│Quotes│Orders│Inv ]│ Tab bar: 48px
│ [All▼] [Production▼] [Blocked▼] [📊5]│ Business filters: 44px
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2345 — Suresh Textiles │ │ Card header: 20px
│ │ Status: 🟡 Production in progress│ │ Status: 16px
│ │ ₹1,20,000 | Delivery: 12 Oct   │ │ Meta: 14px
│ │ [View] [Call] [WhatsApp]        │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Total: 140px card
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ Order #O-2344 — Ramesh Mills    │ │
│ │ Status: ⚠️ Materials Short (PR)  │ │ Color coding:
│ │ ₹85,000 | Delivery: 10 Oct     │ │ 🟡 In progress
│ │ [View] [Create PR] [Call]       │ │ ⚠️ Blocked
│ └─────────────────────────────────┘ │ ✅ Complete
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2340 — Gujarat Fabrics │ │
│ │ Status: ✅ Delivered            │ │
│ │ ₹95,000 | Delivered: 05 Oct    │ │
│ │ [View] [Feedback] [Reorder]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│          [+ New Order]              │ 56px CTA
├─────────────────────────────────────┤
│ 🏠   💼•  🏭   📦   👥             │ Active: Sales
└─────────────────────────────────────┘
```

#### **Create New Order Flow** (3-Step Process)

**Step 1: Customer & Items Selection**
```
┌─────────────────────────────────────┐
│ Create Order                    [×] │ Modal header
│ Step 1 of 3 ●●○                     │ Progress dots
├─────────────────────────────────────┤
│ Customer Selection                   │ Section: 24px
│ ┌─────────────────────────────────┐ │
│ │ [Suresh Textiles          ▼]   │ │ Dropdown: 48px
│ └─────────────────────────────────┘ │
│ [+ Add New Customer]                │ Link: 32px
├─────────────────────────────────────┤
│ Order Items                         │ 16px spacing
│ ┌─────────────────────────────────┐ │
│ │ 1. Cotton 40s                   │ │ Item card: 80px
│ │    500m @ ₹90/m = ₹45,000      │ │ Product: 16px
│ │                    [Edit] [×]   │ │ Details: 14px
│ └─────────────────────────────────┘ │ Actions: 12px
│ ┌─────────────────────────────────┐ │ 8px gap
│ │ 2. Dyed Fabric                  │ │
│ │    200m @ ₹120/m = ₹24,000     │ │
│ │                    [Edit] [×]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Add Item]                        │ 44px button
├─────────────────────────────────────┤
│ Order Total: ₹69,000               │ 48px summary
│ GST (10%): ₹6,900                  │ Background: #F9FAFB
│ Final Total: ₹75,900               │ Bold final amount
├─────────────────────────────────────┤
│            [Continue]               │ 56px CTA
└─────────────────────────────────────┘
```

**Step 2: Delivery & Payment Terms**
```
┌─────────────────────────────────────┐
│ Create Order                    [×] │
│ Step 2 of 3 ●●●                     │
├─────────────────────────────────────┤
│ Delivery Information                │
│ ┌─────────────────────────────────┐ │
│ │ Delivery Date: [15 Oct 2024 ▼] │ │ Date picker: 48px
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Special Instructions:           │ │ Text area: 80px
│ │ [Previous quality approved]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Payment Terms                       │
│ ○ 30% Advance (₹22,770)            │ Radio: 40px each
│ ● 50% Advance (₹37,950) ←recommended│ Selected: blue
│ ○ Full Payment (₹75,900)           │
├─────────────────────────────────────┤
│ Order Summary                       │ 80px summary
│ Total: ₹75,900                     │ Highlight key info
│ Required Advance: ₹37,950          │ Blue background
│ Balance: ₹37,950                   │ 
├─────────────────────────────────────┤
│      [← Back]    [Create Order]     │ 56px actions
└─────────────────────────────────────┘
```

**Step 3: Order Created + Material Check**
```
┌─────────────────────────────────────┐
│ ✅ Order Created Successfully!      │ Success header
├─────────────────────────────────────┤
│ Order #O-2346 — Suresh Textiles     │ Order info: 48px
│ Total: ₹75,900 | Due: 15 Oct        │
├─────────────────────────────────────┤
│ ⚠️ Material Availability Check       │ Alert section
│ ┌─────────────────────────────────┐ │
│ │ Cotton Yarn 30s: Short 300kg    │ │ Shortage alert
│ │ Dye Chemical: Available ✅       │ │ Red text for short
│ └─────────────────────────────────┘ │ Green for available
├─────────────────────────────────────┤
│ Next Steps:                         │ Action guidance
│ 1. Record advance payment           │ Numbered list
│ 2. Create PR for Cotton Yarn        │ Link to actions
│ 3. Start production when ready      │
├─────────────────────────────────────┤
│ [Record Payment] [Create PR]        │ Action buttons
├─────────────────────────────────────┤
│            [View Order]             │ Primary CTA
└─────────────────────────────────────┘
```

#### **Payment Recording** (Critical Business Gate)

```
┌─────────────────────────────────────┐
│ Record Payment              [×]     │ Modal header
│ Order #O-2346 — Suresh Textiles     │ Context: 40px
├─────────────────────────────────────┤
│ Payment Details                     │ Section header
│ Total Amount: ₹75,900               │ Large text: 18px
│ Required Advance (50%): ₹37,950     │ Highlight: blue bg
├─────────────────────────────────────┤
│ Payment Method                      │ 24px spacing
│ ○ UPI/Digital  ● Bank Transfer      │ Radio buttons
│ ○ Cash  ○ Cheque                   │ 40px each
├─────────────────────────────────────┤
│ Payment Amount                      │
│ ┌─────────────────────────────────┐ │
│ │ ₹ [37,950              ]       │ │ Amount input: 48px
│ └─────────────────────────────────┘ │ Large, clear text
├─────────────────────────────────────┤
│ Payment Proof                       │
│ ┌─────────────────────────────────┐ │
│ │     [📷 Take Photo]            │ │ Photo area: 120px
│ │   or [📁 Choose File]          │ │ Dashed border
│ └─────────────────────────────────┘ │ Tap to activate
├─────────────────────────────────────┤
│ Notes (Optional)                    │
│ ┌─────────────────────────────────┐ │
│ │ [UPI transfer via HDFC Bank]   │ │ Text area: 60px
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ℹ️ Recording advance will:          │ Info box: #E0F2FE
│ • Auto-create customer profile     │ Light blue background
│ • Generate sales order             │ Bullet points
│ • Calculate material requirements  │
├─────────────────────────────────────┤
│         [Record Payment]            │ 56px primary CTA
└─────────────────────────────────────┘
```

**Post-Payment Success + Automation**
```
┌─────────────────────────────────────┐
│ 🎉 Payment Recorded Successfully!   │ Celebration header
├─────────────────────────────────────┤
│ Payment: ₹37,950 received           │ Confirmation: 32px
│ Balance: ₹37,950 remaining          │ Blue background
├─────────────────────────────────────┤
│ 🤖 Automatic Actions Completed:     │ Automation section
│ ✅ Customer "Suresh Textiles" created│ Green checkmarks
│ ✅ Sales Order #SO-2346 generated   │ 24px line height
│ ✅ Material requirements calculated  │ Success color
├─────────────────────────────────────┤
│ ⚠️ Materials Status:                │ Alert section
│ Cotton Yarn: 300kg shortage         │ Warning background
│ Action required: Create PR          │ Call to action
├─────────────────────────────────────┤
│ Next Steps:                         │ Guidance section
│ [Create PR Now] [View Sales Order]  │ Action buttons
├─────────────────────────────────────┤
│         [Continue to Customer]      │ Primary CTA
└─────────────────────────────────────┘
```

---

#### **Invoices Tab - Invoice Management**

**Purpose**: Generate, send, and track invoices for completed orders

**Access Flow**: `💼 Sales → Invoices Tab` or `Orders Tab → [Invoice] button`

##### **Invoices List View**
```
┌─────────────────────────────────────┐
│ Sales    [ Leads│Quotes│Orders│Inv ]│ Tab bar: 48px
│ [All▼] [Paid▼] [Pending▼] [Due▼] [📊8]│ Payment filters: 44px
├─────────────────────────────────────┤
│ 💰 3 INVOICES OVERDUE > 15 DAYS     │ Alert header: 48px
│                                     │ Red background
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ INV#2024-089 — Suresh Textiles  │ │ Invoice ID + Company: 20px
│ │ Status: 💰 Paid                 │ │ Payment status: 16px
│ │ ₹1,20,000 | Due: 15 Oct        │ │ Amount + Due date: 14px
│ │ Paid: 12 Oct | On time ✅      │ │ Payment history: 14px
│ │ [View] [Receipt] [WhatsApp]     │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ INV#2024-088 — Ramesh Mills     │ │
│ │ Status: 🔴 Overdue              │ │ Red overdue
│ │ ₹85,000 | Due: 5 Oct           │ │
│ │ Overdue: 10 days | Interest Due │ │ Warning info
│ │ [Send Reminder] [Call] [Details]│ │ Collection actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│        [+ Generate Invoice]         │ 56px CTA
└─────────────────────────────────────┘
```

**Invoice Status Flow:**
- **🟡 Pending**: Generated, not yet sent to customer
- **📤 Sent**: Delivered to customer, payment pending
- **💰 Paid**: Payment received, transaction complete
- **🔴 Overdue**: Past due date, collection required
- **❌ Cancelled**: Invoice cancelled or credited

##### **Invoice Generation Flow**
```
┌─────────────────────────────────────┐
│ Generate Invoice                [×] │ Modal header
│ From Order: #O-2345                 │ Context: 32px
├─────────────────────────────────────┤
│ 📋 Order Summary                    │ Section header
│ Customer: Suresh Textiles           │ Pre-filled data
│ Product: Cotton Fabric (1000m)      │ Order details
│ Total Amount: ₹2,50,000             │ Order value
│ Advance Paid: ₹1,25,000 ✅         │ Payment status
│ Balance Due: ₹1,25,000              │ Outstanding amount
├─────────────────────────────────────┤
│ 📅 Invoice Details                  │
│ Invoice Date: [Today ▼]             │ Date picker: 44px
│ Due Date: [15 days ▼]              │ Terms dropdown
│ GSTIN: [Auto-filled]                │ Tax details
│ Place of Supply: [Gujarat]          │ State for GST
├─────────────────────────────────────┤
│ 💰 Amount Breakdown                 │
│ Taxable Amount: ₹1,06,000           │ Pre-tax amount
│ CGST (9%): ₹9,540                  │ Central GST
│ SGST (9%): ₹9,540                  │ State GST
│ Total Amount: ₹1,25,080             │ Final amount
├─────────────────────────────────────┤
│ 📝 Payment Instructions             │
│ Bank: [HDFC Bank ▼]                │ Account dropdown
│ Account: [Auto-filled]              │ Bank details
│ UPI ID: [business@paytm]            │ Digital payment
├─────────────────────────────────────┤
│     [Preview] [Generate & Send]     │ Action buttons: 56px
└─────────────────────────────────────┘
```

---

#### **Sales Navigation Flows & Integration**

**Complete Sales Workflow:**
```
1. 📞 Leads Tab: Capture lead → [Create Quote]
2. 📋 Quotes Tab: Send quote → [Approve] → [Create Order]
3. 💰 Payment: Record advance → Auto-create customer & sales order
4. 📦 Orders Tab: Track production → [Generate Invoice]
5. 💳 Invoices Tab: Send invoice → Track payment → Complete cycle
```

**Cross-Tab Navigation:**
```
Leads Tab → [Quote] → Auto-switch to Quotes Tab
Quotes Tab → [Create Order] → Auto-switch to Orders Tab  
Orders Tab → [Invoice] → Auto-switch to Invoices Tab
Any Tab → [Call/WhatsApp] → Customer communication
```

**Integration Points:**
- **Lead → Customer**: Hot leads auto-create customer profiles
- **Order → Production**: Paid orders auto-create work orders
- **Order → Procurement**: Material requirements auto-generated
- **Invoice → Accounts**: Payments auto-update financial records

**Status Transitions:**
```
Lead Priority: Cold → Warm → Hot → Quote Created
Quote Status: Draft → Sent → Approved → Order Created
Order Status: Payment Pending → Confirmed → Production → Delivered
Invoice Status: Generated → Sent → Paid → Completed
```

### **PRODUCTION TAB** - Manufacturing Execution

#### **Production Module Overview**

The Production module manages the complete manufacturing workflow from Sales Order breakdown through delivery confirmation. It operates through 5 main tabs (Orders│WO│Machines│QC│Ready) with role-based navigation and integrated cross-module functionality.

**Business Context**: Addresses the daily production questions: "કયા orders production માં છે? આજે શું બનાવવું? Quality કેમ છે?" (Which orders are in production? What to make today? How is quality?)

**Module Structure:**
```
🏭 PRODUCTION (Main Tab)
├── Orders - Sales Order management and production initiation (Supervisor view)
├── WO - Work Order planning, assignment and monitoring (Planner/Supervisor view)
├── Machines - Live production execution and operator interface (Operator view)
├── QC - Quality control processes and pass/rework decisions (QC Inspector view)
└── Ready - Packing, dispatch and delivery management (Store/Dispatch view)
```

**Role-Based Navigation:**
- **Supervisor/Planner**: Default = Orders | Access: Orders, WO, Machines, QC, Ready
- **Operator**: Default = Machines | Access: Machines only
- **QC Inspector**: Default = QC | Access: QC, Ready
- **Store/Dispatch**: Default = Ready | Access: Ready only
- **Owner**: Default = Orders | Access: All tabs

**Cross-Module Integration:**
- **From Sales**: Sales Orders automatically appear in Orders tab for production initiation
- **To Customer**: Delivery notifications and tracking updates from Ready tab
- **To Procurement**: Material requirements calculated and shortage alerts from WO tab
- **To Inventory**: Automatic stock updates on QC completion

---

#### **Orders Tab - Sales Order Management & Production Initiation**

**Purpose**: Supervisor view of confirmed Sales Orders requiring Work Order creation and production planning. Central hub for starting production and monitoring material availability.

```
┌─────────────────────────────────────┐
│ Production [ Orders│WO│Machines│QC│Ready ] │ Sub-tabs: 48px
│ [🔍 Search Order or Customer (🎙)]  │ Search: 44px
├─────────────────────────────────────┤
│ 📋 CONFIRMED SALES ORDERS           │ Section header
│ ┌─────────────────────────────────┐ │
│ │ #SO-2345  Ajay Textiles         │ │ Order header
│ │ Product: Cotton Fabric | Qty: 1000m │ │ Product details
│ │ Material: ✅ Available | Due: 25 Dec │ │ Material status
│ │ Status: 🟡 Not Started          │ │ Production status
│ │ [Start Production] [View Details] │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ #SO-2346  Bharat Mills          │ │ Another order
│ │ Product: Linen Fabric | Qty: 500m │ │ Different product
│ │ Material: ⚠️ Shortage (Yarn, Dye) │ │ Material issue
│ │ Status: 🔴 Material Pending     │ │ Blocked status
│ │ [Go to Procurement]             │ │ Material action
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ #SO-2347  Ramesh Exports        │ │ Active order
│ │ Product: Grey Fabric | Qty: 1200m │ │ Large order
│ │ Material: ✅ Available          │ │ Ready for production
│ │ Status: 🔵 In Production        │ │ Active status
│ │ Progress: [██████░░░░] 60%      │ │ Progress bar
│ │ [View Work Orders ▾]            │ │ WO management
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ▼ Expand WOs (#SO-2347) - Optional  │ Expandable section
│ ┌─────────────────────────────────┐ │
│ │ - WO#2347-A  Loom A1 | 400m | Done ✅ │ │ Completed WO
│ │ - WO#2347-B  Loom A2 | 300m | Running 🟡 │ │ Active WO
│ │ - WO#2347-C  Loom A3 | 500m | Not Started 🔴 │ │ Pending WO
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠   💼   🏭•  📦   👥         [+] │ Active: Production
└─────────────────────────────────────┘
```

**Orders Tab Actions:**
- **Start Production**: Creates Work Orders (auto-breakdown), reserves stock, moves to WO tab
- **Go to Procurement**: Direct navigation to procurement module for material shortage resolution
- **View Work Orders**: Expand inline WO details or navigate to WO tab for detailed management
- **View Details**: Full Sales Order details including customer requirements and delivery terms

**Material Status Indicators:**
- **✅ Available**: All required materials in stock, production can start immediately
- **⚠️ Shortage**: Specific materials missing (displayed in brackets), procurement required
- **🔴 Material Pending**: Production blocked until materials are available

**Production Status Flow:**
- **🟡 Not Started**: Sales Order confirmed, ready for Work Order creation
- **🔵 In Production**: Work Orders created and active production in progress
- **🟢 Production Complete**: All Work Orders completed, ready for QC
- **🔴 Material Pending**: Blocked due to material shortage, requires procurement action

#### **WO Tab - Work Order Management & Planning**

**Purpose**: Planner/Supervisor view for managing all work orders across machines. Central hub for work order assignment, progress monitoring, and resource allocation.

```
┌─────────────────────────────────────┐
│ Production [ Orders│WO│Machines│QC│Ready ] │ Sub-tabs: 48px
│ [🗂 WORK ORDERS] [Filter: All ▾]    │ Search + filter: 44px
├─────────────────────────────────────┤
│ 📋 ALL WORK ORDERS                  │ Section header
│ ┌─────────────────────────────────┐ │
│ │ WO#2345-A  SO#2345 Ajay Textiles│ │ WO with SO context
│ │ Machine: Loom A1 | Worker: Vikram │ │ Assignment details
│ │ Planned: 400m | Done: 400m ✅ Completed │ │ Status: complete
│ │ [View WO] [History]             │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ WO#2345-B  SO#2345 Ajay Textiles│ │ Same order, another WO
│ │ Machine: Loom A2 | Worker: Priya │ │ Different assignment
│ │ Planned: 600m | Done: 300m 🟡 Running │ │ Status: active
│ │ [+ Update Qty] [Reassign Machine] [View WO] │ │ Management actions
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ WO#2346-A  SO#2346 Bharat Mills │ │ Different order
│ │ Machine: Loom B1 | Worker: —    │ │ No worker assigned
│ │ Planned: 500m | Done: 0m 🔴 Not Started │ │ Status: pending
│ │ [Assign Machine]                │ │ Assignment needed
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🏠   💼   🏭•  📦   👥         [+] │ Active: Production
└─────────────────────────────────────┘
```

**WO Tab Actions:**
- **+ Update Qty**: Enter progress popup for recording daily/shift production
- **Reassign Machine**: Pick from available machines for work order reassignment
- **Assign Machine**: Assign work order to a machine and worker
- **View WO**: Open detailed Work Order screen with full production history

#### **Work Order Detail Interface** (WO Tab Drill-down)

```
┌─────────────────────────────────────┐
│ WO#2345-B — Ajay Textiles (SO#2345) [←] │ WO header with context
├─────────────────────────────────────┤
│ 🎯 Work Order Details               │ Section header
│ Machine: Loom A2    [Change ▾]      │ Machine assignment
│ Worker:  Priya      [Change ▾]      │ Worker assignment
│ Planned: 600m | Produced: 300m | Remaining: 300m │ Progress metrics
│ Material Allocated: Yarn ✅  Dye ✅ │ Material status
│ Status: 🟡 Running                  │ Current status
├─────────────────────────────────────┤
│ [+ Update Quantity] [Pause] [Mark Complete] │ Primary actions: 44px
├─────────────────────────────────────┤
│ 📊 Production History ▼             │ Expandable history
│ - 22 Dec 10:00 Started by Priya     │ Historical entries
│ - 22 Dec 12:30 +150m                │ Progress updates
│ - 22 Dec 4:00 +150m                 │ Daily tracking
└─────────────────────────────────────┘
```

**Update Quantity Modal:**
```
┌─────────────────────────────────────┐
│ Update Production Progress      [×] │ Modal header
├─────────────────────────────────────┤
│ Produced today: [ 250 ] m           │ Input field: 44px
│ Scrap: [ 5 ] m                      │ Waste tracking
│ Notes: [Optional]                   │ Comments area: 60px
├─────────────────────────────────────┤
│         [Save Progress]             │ Primary action: 44px
└─────────────────────────────────────┘
```

#### **Machines Tab - Operator Production Interface**

**Purpose**: Operator view for machine-level execution. Shows current work orders, enables progress updates, and manages job queue for assigned machines.

```
┌─────────────────────────────────────┐
│ Production [ Orders│WO│Machines│QC│Ready ] │ Sub-tabs: 48px
├─────────────────────────────────────┤
│ 🏭 MACHINES                         │ Section header
├─────────────────────────────────────┤
│ Loom A2 (Priya) | Status: 🟡 Running │ Machine operator header
├─────────────────────────────────────┤
│ 🎯 CURRENT WORK ORDER               │ Active job section
│ ┌─────────────────────────────────┐ │
│ │ Current WO: WO#2345-B — Ajay Textiles │ │ Active assignment
│ │ Qty: 600m | Produced: 300m | Remaining: 300m │ │ Progress metrics
│ │ [Start WO] [+ Update Qty] [Pause] [Mark Complete] │ │ Operator actions
│ └─────────────────────────────────┘ │ Current job card: 120px
├─────────────────────────────────────┤
│ 📋 NEXT IN QUEUE                    │ Queue section
│ ┌─────────────────────────────────┐ │
│ │ - WO#2348-A | Ajay Textiles | 0/400 🔴 │ │ Upcoming job
│ │ - WO#2349-A | Bharat Mills  | 0/300 🔴 │ │ Queue item
│ └─────────────────────────────────┘ │ Queue card: 80px
├─────────────────────────────────────┤
│ 🏠   💼   🏭•  📦   👥         [+] │ Active: Production
└─────────────────────────────────────┘
```

**Machines Tab Operator Flow:**
- **Start WO**: Tap when beginning a work order → WO status changes to Running
- **+ Update Qty**: Record daily/shift progress with quantity produced and any scrap
- **Pause**: Temporary stop due to issue (material shortage, machine problem, break)
- **Mark Complete**: Finish work order → triggers automatic QC entry in QC tab

**Operator Interface Notes:**
- **Operators see only their assigned machine(s)** and work orders in their queue
- **Supervisors see all machines** with operator names and current assignments
- **Touch-optimized controls** for factory floor use with large, easy-to-tap buttons
- **Voice input support** for hands-free quantity updates during production

#### **QC Tab - Quality Control & Inspection Management**

**Purpose**: QC Inspector/Supervisor view for inspecting completed Work Orders and recording quality status with pass/rework decisions.

```
┌─────────────────────────────────────┐
│ Production [ Orders│WO│Machines│QC│Ready ] │ Sub-tabs: 48px
├─────────────────────────────────────┤
│ 🔎 QC QUEUE                         │ Section header
│ ┌─────────────────────────────────┐ │
│ │ WO#2345-B — Ajay Textiles | Loom A2 │ │ Work order context
│ │ Qty: 600m | Completed: 22 Dec | Pending QC │ │ Completion details
│ │ [Start QC]                      │ │ Primary action: 32px
│ └─────────────────────────────────┘ │ Card: 120px
├─────────────────────────────────────┤
│ 🏠   💼   🏭•  📦   👥         [+] │ Active: Production
└─────────────────────────────────────┘
```

#### **QC Form Interface** (QC Tab Action)

```
┌─────────────────────────────────────┐
│ QC Inspection — WO#2345-B       [←] │ QC header
│ Ajay Textiles | Cotton Fabric       │ Context details
├─────────────────────────────────────┤
│ ✅ QUALITY CHECKLIST                │ Inspection section
│ Color match: [✓]                    │ Checkbox items: 32px
│ GSM: [✓]                            │ Weight specification
│ Defects: [0]                        │ Defect count input
├─────────────────────────────────────┤
│ 📷 PHOTO EVIDENCE                   │ Documentation section
│ [📷 Capture]                        │ Photo button: 44px
├─────────────────────────────────────┤
│ 📝 QC REMARKS                       │ Notes section
│ ┌─────────────────────────────────┐ │
│ │ ________________________        │ │ Text area: 60px
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🎯 QC RESULT                        │ Decision section
│ [ ✅ Pass ]      [ ⚠️ Rework ]      │ Primary actions: 56px
└─────────────────────────────────────┘
```

**QC Tab Actions:**
- **✅ Pass**: WO status = Completed (QC passed), moves to Ready tab when all SO work orders pass
- **⚠️ Rework**: System creates new rework Work Order (WO#2345-B-R1), sends back to WO tab for reassignment

**QC Process Flow:**
1. **Completed Work Orders** automatically appear in QC Queue when operators mark them complete
2. **QC Inspector** performs physical inspection using standard checklist
3. **Photo Evidence** required for quality documentation and traceability
4. **Pass/Rework Decision** determines next step in production workflow
5. **Sales Order Completion**: When all Work Orders under a Sales Order pass QC → SO moves to Ready tab

**QC Status Indicators:**
- **⏳ Pending QC**: Work order completed, awaiting quality inspection
- **✅ QC Passed**: Quality approved, ready for delivery preparation
- **⚠️ Rework Required**: Quality issues found, new rework work order created
- **🔴 QC Overdue**: Inspection delayed beyond standard timeframe

#### **Ready Tab - Packing, Dispatch & Delivery Management**

**Purpose**: Store/Dispatch view for managing packing, dispatch, and invoicing for Sales Orders ready for shipment after QC completion.

```
┌─────────────────────────────────────┐
│ Production [ Orders│WO│Machines│QC│Ready ] │ Sub-tabs: 48px
├─────────────────────────────────────┤
│ 📦 READY FOR DISPATCH               │ Section header
│ ┌─────────────────────────────────┐ │
│ │ SO#2345 Ajay Textiles           │ │ Sales Order header
│ │ Product: Cotton Fabric | Qty: 1000m │ │ Product details
│ │ All Work Orders QC Passed ✅    │ │ QC confirmation
│ │ Ready Since: 23 Dec 10:00 AM    │ │ Completion timestamp
│ │ [Pack & Dispatch]               │ │ Primary action: 32px
│ └─────────────────────────────────┘ │ Card: 140px
├─────────────────────────────────────┤
│ 🏠   💼   🏭•  📦   👥         [+] │ Active: Production
└─────────────────────────────────────┘
```

#### **Pack & Dispatch Form** (Ready Tab Action)

```
┌─────────────────────────────────────┐
│ Pack & Dispatch — SO#2345       [←] │ Form header
│ Ajay Textiles | Cotton Fabric       │ Context details
├─────────────────────────────────────┤
│ 🚚 DISPATCH DETAILS                 │ Section header
│ Vehicle: [ GJ-01-AB-1123 ▾ ]        │ Vehicle selection: 44px
│ Driver:  [ Suresh Patel ▾ ]         │ Driver selection: 44px
│ Invoice: Auto-generated (INV-00123) │ Invoice reference
├─────────────────────────────────────┤
│ 📞 CUSTOMER NOTIFICATION            │ Communication section
│ Notify Customer: [WhatsApp ✓] [SMS ✓] │ Multi-channel notification
├─────────────────────────────────────┤
│         [Confirm Dispatch]          │ Primary action: 56px
└─────────────────────────────────────┘
```

**Ready Tab Actions:**
- **Pack & Dispatch**: Creates Delivery Challan + Invoice, marks SO as Dispatched
- **Customer Notifications**: Automatic WhatsApp + SMS alerts with tracking details
- **Invoice Generation**: Auto-generated invoice linked to Sales Order and dispatch
- **Cross-Module Integration**: Dispatch details flow to Sales/Invoice/Payments modules

**Ready Tab Process Flow:**
1. **QC Completion**: Sales Orders appear in Ready tab when all Work Orders pass QC
2. **Packing Preparation**: Store team prepares goods for dispatch with quality documentation
3. **Dispatch Assignment**: Vehicle and driver assignment with delivery route planning
4. **Invoice Creation**: Automatic invoice generation based on completed work and quality grades
5. **Customer Communication**: Multi-channel notifications with tracking and delivery details
6. **Integration**: Dispatch completion triggers updates in Sales, Customer, and Accounts modules

**Ready Tab Status Indicators:**
- **📦 Ready for Dispatch**: All QC passed, awaiting packing and vehicle assignment
- **🚚 Dispatch Assigned**: Vehicle and driver assigned, preparing for departure
- **✅ Dispatched**: Goods shipped, customer notified, invoice generated
- **🎯 Delivered**: Final delivery confirmed with proof of delivery documentation


#### **Quality Control Detail Interface** (QC Tab Drill-down)

```
┌─────────────────────────────────────┐
│ Quality Check — WO#451         [←] │ QC header
│ Cotton Fabric | Batch: B2024-045    │ Product context
├─────────────────────────────────────┤
│ ✅ Quality Checklist                │ Checklist section
│ ☑️ Color match within tolerance     │ Completed items
│ ☑️ Width specifications met         │ Green checkmarks
│ ☑️ Weight/GSM correct               │
│ ⬜ Shrinkage test pending           │ Pending item
│ ☑️ No visible defects               │ Clean layout
├─────────────────────────────────────┤
│ 🎯 Quality Grade Assessment         │
│ ● A Grade (Premium)                │ Radio options
│ ○ B Grade (Standard)               │ 40px each
│ ○ Reject (Rework needed)           │ Clear hierarchy
├─────────────────────────────────────┤
│ 📝 Quality Notes                    │
│ ┌─────────────────────────────────┐ │
│ │ [Slight edge variation but      │ │ Notes area: 80px
│ │  within acceptable limits]      │ │ Pre-filled example
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📷 Quality Evidence (Required)      │
│ ┌─────────────────────────────────┐ │
│ │     [📷 Take QC Photo]         │ │ Photo requirement
│ │                                 │ │ Visual guidance
│ └─────────────────────────────────┘ │ 100px area
├─────────────────────────────────────┤
│ 👤 QC Inspector: [Ravi Sharma ▼]    │ Inspector selection
├─────────────────────────────────────┤
│                                     │ Primary actions
│ [Mark QC Pass] [QC Fail - Rework]   │ Clear outcomes
│                                     │ 56px height
└─────────────────────────────────────┘
```

#### **Delivery Assignment Wizard** (Ready Tab Action)

```
┌─────────────────────────────────────┐
│ Assign Delivery — Order #O-2345 [←] │ Wizard header
│ Cotton Fabric | 1000m | Ajay Textiles │ Order context
├─────────────────────────────────────┤
│ 🚚 Vehicle Selection                │ Section header
│ ┌─────────────────────────────────┐ │
│ │ ● GJ-01-AB-1234 (Available)     │ │ Radio selection
│ │   Capacity: 5000m | Load: 2000m │ │ Vehicle details
│ │   Driver: Suresh Patel          │ │ Driver info
│ └─────────────────────────────────┘ │ Option card
│ ┌─────────────────────────────────┐ │
│ │ ○ GJ-02-CD-5678 (Returning 3PM) │ │ Alternative option
│ │   Capacity: 3000m | Load: 0m    │ │ Different capacity
│ │   Driver: Ramesh Kumar          │ │ Different driver
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📍 Route & Schedule                 │ Section header
│ From: Surat Factory                │ Fixed origin
│ To: [Ajay Textiles, Ahmedabad]     │ Customer location
│ Distance: 264 km | ETA: 4.5 hours  │ Route calculation
│ Departure: [Today 2:00 PM ▼]       │ Time selection
├─────────────────────────────────────┤
│ 📞 Customer Notification            │ Section header
│ ☑️ SMS: Order dispatched            │ Auto-notifications
│ ☑️ Call: Delivery confirmation      │ Manual follow-up
│ ☑️ WhatsApp: Live tracking link     │ Modern communication
├─────────────────────────────────────┤
│                                     │ Action area
│   [Cancel]        [Assign Delivery] │ Primary actions
│                                     │ 56px height
└─────────────────────────────────────┘
```

#### **Delivery Tracking Interface** (Ready Tab Live Tracking)

```
┌─────────────────────────────────────┐
│ Track Delivery — Order #O-2345  [←] │ Tracking header
│ Vehicle: GJ-01-AB-1234 | Suresh Patel │ Vehicle context
├─────────────────────────────────────┤
│ 📍 Live Location                    │ Section header
│ Current: NH-8, Bharuch              │ Live GPS location
│ Distance from destination: 120 km   │ Remaining distance
│ ETA: 2 hours 15 minutes            │ Updated ETA
│ Last updated: 2 minutes ago         │ Data freshness
├─────────────────────────────────────┤
│ 🛣️ Delivery Progress                │ Timeline section
│ ✅ 2:00 PM — Departed Surat        │ Completed milestone
│ ✅ 3:15 PM — Crossed Bharuch       │ Current location
│ 🚚 5:30 PM — Est. Ahmedabad arrival │ Upcoming milestone
│ ⏳ TBD — Customer delivery          │ Final step
├─────────────────────────────────────┤
│ 📞 Communication                    │ Action section
│ [📱 Call Driver] [📍 Share Location] │ Contact options
│ [💬 WhatsApp] [📩 Notify Customer]  │ Communication tools
├─────────────────────────────────────┤
│ 🔔 Delivery Alerts                 │ Status section
│ ☑️ Customer notified of dispatch    │ Confirmation sent
│ ⏳ Driver will call before delivery │ Pending action
│ ⏳ Proof of delivery required       │ Required evidence
└─────────────────────────────────────┘
```

#### **Proof of Delivery Capture** (Ready Tab Final Step)

```
┌─────────────────────────────────────┐
│ Delivery Proof — Order #O-2345  [←] │ Proof header
│ Customer: Ajay Textiles | 1000m      │ Delivery context
├─────────────────────────────────────┤
│ 📷 Photo Evidence (Required)        │ Section header
│ ┌─────────────────────────────────┐ │
│ │     [📷 Take Delivery Photo]    │ │ Camera button
│ │                                 │ │ Photo capture area
│ └─────────────────────────────────┘ │ 120px area
│ [Delivered_Cotton_Fabric_Dec20.jpg] │ Captured photo
├─────────────────────────────────────┤
│ ✍️ Customer Signature              │ Section header
│ ┌─────────────────────────────────┐ │
│ │                                 │ │ Signature canvas
│ │    [Customer signs here]        │ │ Touch signature
│ │                                 │ │ area
│ └─────────────────────────────────┘ │ 100px area
│ [Clear Signature] [Retake]          │ Signature controls
├─────────────────────────────────────┤
│ 📝 Delivery Notes                   │ Section header
│ ┌─────────────────────────────────┐ │
│ │ [Material delivered in good     │ │ Notes area: 60px
│ │  condition. Customer satisfied] │ │ Optional details
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 👤 Received By                      │ Customer details
│ Name: [Ajay Patel]                  │ Person receiving
│ Designation: [Purchase Manager]     │ Role confirmation
│ Time: Dec 20, 2024 — 5:45 PM       │ Delivery timestamp
├─────────────────────────────────────┤
│                                     │ Final actions
│     [Complete Delivery]             │ Primary action
│                                     │ 56px height
└─────────────────────────────────────┘
```

---

### **Production Module Cross-Integration Workflows**

#### **Sales → Production Integration**
- **Sales Orders automatically appear in Orders tab** when payment confirmation received
- **Material availability checking**: Orders tab displays real-time material status for production planning
- **Production initiation**: "Start Production" creates Work Orders and moves workflow to WO tab
- **Order status updates**: Orders → WO → Machines → QC → Ready workflow progression
- **Customer notifications** sent automatically at key production milestones (started, QC passed, ready)

#### **Production → Customer Integration**  
- **Dispatch notifications**: Ready tab triggers SMS + WhatsApp alerts when goods are packed and dispatched
- **Invoice generation**: Automatic invoice creation upon dispatch confirmation from Ready tab
- **Quality documentation**: QC pass certificates attached to customer records for quality assurance
- **Delivery tracking**: Multi-channel communication with real-time updates throughout production flow

#### **Production → Procurement Integration**
- **Material shortage alerts**: Orders tab displays material availability and triggers procurement alerts
- **Automatic purchase requests**: Material shortages in Orders tab create immediate purchase requests
- **WO tab material allocation**: Work Order creation reserves materials and updates availability
- **Real-time stock integration**: All tabs display current material status for informed decision-making

#### **Production → Inventory Integration**
- **Raw material consumption**: Work Orders in Machines tab auto-deduct materials when production starts
- **Finished goods creation**: QC tab completion automatically adds finished products to inventory
- **Quality-based inventory**: QC pass/rework decisions determine inventory quality grades
- **Ready tab integration**: Dispatch from Ready tab updates inventory locations and availability

#### **Production → Accounts Integration**
- **Work Order costing**: WO and Machines tabs track labor and material costs per work order
- **Quality-based pricing**: QC tab results affect final invoice amounts and quality premiums
- **Dispatch-triggered invoicing**: Ready tab dispatch automatically generates invoices and delivery challans
- **Cross-module cost tracking**: Production costs flow through to Sales, Customer, and Accounts modules

---

### **PROCUREMENT TAB** - Supply Chain Management

#### **Procurement Module Overview**

The Procurement module manages the complete supply chain workflow from material shortage detection through inventory updates. It operates through 4 main tabs (MR│PRs│POs│GRNs) with 2-filter dropdowns and integrated inventory management.

**Business Context**: Addresses the daily owner question: "કેટલો stock છે? શું material ઓર્ડર કરવું?" (How much stock? What materials to order?)

**Module Structure:**
```
📦 PROCUREMENT (Main Tab)
├── MR (Material Requirements) - Default landing tab
├── PRs (Purchase Requests) - Internal procurement requests  
├── POs (Purchase Orders) - Supplier orders and tracking
└── GRNs (Goods Receipt Notes) - Delivery recording and stock updates
```

**Cross-Module Integration:**
- **From Production**: Work orders generate material requirements
- **To Inventory**: GRNs automatically update stock levels
- **To Accounts**: Purchase orders create payable records

---

#### **MR Tab - Material Requirements**

```
┌─────────────────────────────────────┐
│ Procurement [ MR│PRs│POs│GRNs ]     │ Main tabs: 48px
│ [All Materials ▼] [📅 All Time ▼] 📦8│ 2 filters: 44px
├─────────────────────────────────────┤
│ ⚠️ MATERIAL SHORTAGES DETECTED      │ Alert header: 48px
│                                     │ Red background
├─────────────────────────────────────┤
│ Order #O-2345 — Cotton Yarn Short   │ Order grouping
│ ┌─────────────────────────────────┐ │
│ │Material   │Req│Stock│Short│    │ │ Table header
│ │Cotton Yarn│500│200 │300 │[PR]│ │ Shortage in red
│ │30s Count  │kg │kg  │kg  │   │ │ Action button
│ └─────────────────────────────────┘ │ Compact table
├─────────────────────────────────────┤
│ Order #O-2344 — All Materials OK ✅ │ Success state
│ ┌─────────────────────────────────┐ │ Green indicator
│ │All required materials available │ │ Confirmation message
│ │Production can start immediately │ │ Action guidance
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Order #O-2340 — Dye Shortage        │ Another shortage
│ ┌─────────────────────────────────┐ │
│ │Red Dye    │50 │10  │40  │[PR]│ │ Different material
│ │Chemical   │kg │kg  │kg  │   │ │ Same table format
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│      [Create Bulk PR for All]       │ 56px bulk action
│                                     │ Handles all shortages
├─────────────────────────────────────┤
│ 🏠   💼   🏭   📦•  👥         [+] │ Active: Procurement
└─────────────────────────────────────┘
```

#### **Create Purchase Request**

```
┌─────────────────────────────────────┐
│ Create Purchase Request        [×] │ Modal header
│ Auto-generated from Order #O-2345   │ Context: 32px
├─────────────────────────────────────┤
│ 📋 Items Required                   │ Section header
│ ┌─────────────────────────────────┐ │
│ │ Cotton Yarn 30s Count           │ │ Item card: 80px
│ │ Quantity: [300] kg              │ │ Editable quantity
│ │ Quality: Premium Grade          │ │ Quality note
│ │ [Edit Specs] [Remove]           │ │ Item actions
│ └─────────────────────────────────┘ │
│                                     │
│ [+ Add Item]                        │ 44px add button
├─────────────────────────────────────┤
│ ⚡ Priority & Timeline              │
│ ● Urgent  ○ Normal                 │ Priority radio: 40px
│ Required By: [12 Oct 2024]         │ Date picker: 48px
├─────────────────────────────────────┤
│ 🏪 Vendor Selection                 │
│ ┌─────────────────────────────────┐ │
│ │ [ABC Suppliers          ▼]     │ │ Vendor dropdown
│ └─────────────────────────────────┘ │ 48px height
│ Last price: ₹85/kg | Rating: ⭐⭐⭐⭐  │ Vendor info: 24px
├─────────────────────────────────────┤
│ 📝 Special Instructions             │
│ ┌─────────────────────────────────┐ │
│ │ [Previous quality approved -    │ │ Instructions: 60px
│ │  same specification required]   │ │ Pre-filled help
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│                                     │ Action buttons
│ [Send via WhatsApp] [Save Draft]    │ Primary/secondary
│                                     │ 56px height
└─────────────────────────────────────┘
```

---

#### **PRs Tab - Purchase Requests**

**Purpose**: Manage all internal purchase requests from creation to approval

**Access Flow**: `📦 Procurement → PRs Tab`

##### **PR List View**
```
┌─────────────────────────────────────┐
│ PRs (Purchase Requests)             │ Tab header
│ [All Requests ▼] [📅 All Time ▼] 📦4│ 2 filters: 44px
├─────────────────────────────────────┤
│ ⚠️ 2 PENDING APPROVALS              │ Alert header: 48px
│                                     │ Orange background
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ PR#2024-089 — Cotton Yarn       │ │ PR header
│ │ 📅 Created: 15 Oct | Urgent     │ │ Timeline + priority
│ │ Items: Cotton Yarn 30s (300kg)  │ │ Item summary
│ │ Est. Value: ₹22,500             │ │ Financial estimate
│ │ [Review] [Approve] [Edit]       │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ PR#2024-088 — Reactive Dyes     │ │
│ │ 📅 Created: 14 Oct | Normal     │ │
│ │ Items: Blue Dye (50kg)          │ │
│ │ Status: ✅ Approved → PO Created │ │ Success state
│ │ [View PO] [Details]             │ │ Follow-up actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│          [+ Create New PR]          │ 56px CTA
└─────────────────────────────────────┘
```

**PR Status Flow:**
- **Draft**: Being created, can be edited
- **Sent**: Submitted for approval  
- **Approved**: Ready to convert to PO
- **Rejected**: Requires revision
- **Converted**: PO created from this PR

---

#### **POs Tab - Purchase Orders**

**Purpose**: Track official purchase orders sent to suppliers

**Access Flow**: `📦 Procurement → POs Tab`

##### **PO List View**
```
┌─────────────────────────────────────┐
│ POs (Purchase Orders)               │ Tab header
│ [All Orders ▼] [📅 All Time ▼] 📦12│ 2 filters: 44px
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ PO#2401 — Gujarat Spinning      │ │ PO header
│ │ 📅 Sent: 12 Oct | Due: 20 Oct   │ │ Timeline info
│ │ Items: Cotton Yarn (500kg)      │ │ Order summary
│ │ Value: ₹22,500 | Status: ⏳ Sent │ │ Financial & status
│ │ [Track] [Contact] [Cancel]      │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ PO#2400 — Chemical Industries   │ │
│ │ 📅 Sent: 10 Oct | Due: 18 Oct   │ │
│ │ Items: Reactive Dyes (100kg)    │ │
│ │ Value: ₹12,000 | Status: 🚚 Ship│ │ In transit
│ │ [Track] [Receive] [Details]     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**PO Status Flow:**
- **Pending**: Created but not sent to supplier
- **Sent**: Delivered to supplier, awaiting confirmation
- **Confirmed**: Supplier accepted, in production
- **Shipped**: Material in transit
- **Received**: Material delivered (triggers GRN creation)

---

#### **GRNs Tab - Goods Receipt Notes**

**Purpose**: Record material deliveries and update inventory

**Access Flow**: `📦 Procurement → GRNs Tab`

##### **GRN List View**
```
┌─────────────────────────────────────┐
│ Goods Receipt [ Today│Week│Month ]  │ Sub-tabs: 48px
│ [🔍 Search GRNs... (🎙)]            │ Search: 44px
├─────────────────────────────────────┤
│ 📦 2 DELIVERIES PENDING             │ Alert header: 48px
│                                     │ Blue background
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🚚 Delivery from Gujarat Spinning │ │ Pending delivery
│ │ PO#2401 | Cotton Yarn (500kg)    │ │ PO reference
│ │ Expected: Today 2:00 PM          │ │ Timeline info
│ │ Truck: GJ-01-AB-1234             │ │ Vehicle details
│ │ [📋 Create GRN] [📱 Call Supplier] │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ ✅ GRN#2024-045 — Chemicals      │ │ Completed GRN
│ │ PO#2400 | Reactive Dyes (100kg)  │ │ PO reference
│ │ Received: 15 Oct | Quality: Good │ │ Completion info
│ │ Batch: RD-2024-089               │ │ Batch tracking
│ │ [View Details] [Print]           │ │ Review actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📊 MONTHLY SUMMARY                  │ Section header
│ ┌─────────────────────────────────┐ │
│ │ GRNs Processed: 24               │ │ Monthly stats
│ │ Total Value: ₹4.5L | Avg: ₹18.8K │ │ Financial summary
│ │ Quality Issues: 2 (8.3%)         │ │ Quality metrics
│ │ [View Report] [Export Data]      │ │ Analytics actions
│ └─────────────────────────────────┘ │ Card: 100px
└─────────────────────────────────────┘
```

**GRN Status Flow:**
- **Pending**: Delivery expected, GRN not created
- **In Progress**: Material being inspected and recorded
- **Completed**: Material received, quality approved, stock updated
- **Rejected**: Quality issues, material returned to supplier

##### **GRN Detail/Create Screen**
```
┌─────────────────────────────────────┐
│ GRN — PO#56 ABC Suppliers      [←] │ GRN header
│ Delivery Date: 15 Oct 2024          │ Context info: 32px
├─────────────────────────────────────┤
│ 📦 Material Received                │ Section header
│ Material: Cotton Yarn 30s Count     │ Material name: 16px
│ Ordered Qty: [300] kg               │ Reference qty
│ Received Qty: [300] kg              │ Actual received
│ ┌─────────────────────────────────┐ │ Quantity input: 48px
│ │ [300] kg              [+] [-]   │ │ With adjustment
│ └─────────────────────────────────┘ │ buttons
├─────────────────────────────────────┤
│ ✅ Quality Assessment               │
│ ● Good Quality                      │ Quality radio: 40px
│ ○ Minor Issues (specify below)      │ Conditional input
│ ○ Major Issues (reject)             │ Clear hierarchy
├─────────────────────────────────────┤
│ 🏷️ Batch Information                │
│ Batch Number: [CY-2024-089]         │ Batch input: 44px
│ Expiry Date: [Not Applicable]       │ Optional field
├─────────────────────────────────────┤
│ 📝 Issues/Defects (if any)          │
│ ┌─────────────────────────────────┐ │
│ │ [None - quality as expected]    │ │ Issues area: 60px
│ └─────────────────────────────────┘ │ Default text
├─────────────────────────────────────┤
│ 📷 Evidence Photos                  │
│ [📷 Delivery Challan] (Required)    │ Required photo
│ [📷 Material Sample] (Optional)     │ Optional photo
│                                     │
│ [challan_photo.jpg] ✅              │ Uploaded indicator
│ [sample_photo.jpg] ✅               │ Visual confirmation
├─────────────────────────────────────┤
│ 👤 Received By: [Ramesh-Storekeeper]│ Receiver info: 32px
├─────────────────────────────────────┤
│         [Mark as Received]          │ 56px primary CTA
│                                     │
│ ✅ Will update stock & unblock orders│ Action consequence
└─────────────────────────────────────┘
```

---

#### **Inventory Management (Connected Screens)**

**Purpose**: Full inventory visibility and management across all materials

**Access Flow**: Multiple entry points from main tabs

##### **Materials Inventory List View**
```
┌─────────────────────────────────────┐
│ Inventory [ Materials│Stock│Alerts ] │ Sub-tabs: 48px
│ [🔍 Search materials... (🎙)]       │ Search: 44px
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🧵 Cotton Yarn 30s Count       │ │ Material icon
│ │ Stock: 1,200 kg | Min: 500 kg  │ │ Current vs minimum
│ │ Supplier: Gujarat Spinning     │ │ Primary supplier
│ │ Last Order: 15 Oct | ₹45/kg    │ │ Recent info
│ │ [View Details] [Reorder]       │ │ Actions: 32px
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ ⚠️ Reactive Dyes - Blue         │ │ Low stock warning
│ │ Stock: 25 kg | Min: 50 kg       │ │ Red indicator
│ │ Supplier: Chemical Industries   │ │
│ │ Last Order: 08 Oct | ₹120/kg    │ │
│ │ [🚨 Urgent Reorder] [Details]   │ │ Urgent action
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### **Stock Level Dashboard**
```
┌─────────────────────────────────────┐
│ Stock Dashboard                     │ Header: 56px
│ [🔍 Search stock... (🎙)]           │ Search: 44px
├─────────────────────────────────────┤
│ 🎯 STOCK OVERVIEW                   │ Section header
│ ┌─────────────────────────────────┐ │
│ │ Materials: 85% | Finished: 60%  │ │ Quick metrics
│ │ Low Stock: 3 items | Alerts: 2  │ │ Warning indicators
│ └─────────────────────────────────┘ │ 48px summary card
├─────────────────────────────────────┤
│ 📦 MATERIAL ALLOCATION              │ Section header
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2345: 80% allocated    │ │ Order progress
│ │ Cotton Yarn: ✅ Available       │ │ Material status
│ │ Dyes: ⚠️ Partial (Blue missing) │ │ Issue highlight
│ │ [View Details] [Allocate More]  │ │ Actions
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2344: 100% allocated   │ │
│ │ All Materials: ✅ Ready         │ │ Complete status
│ │ Production: Ready to start      │ │ Next step
│ │ [Start Production] [Details]    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

##### **Navigation Flow Documentation**

**From MR Tab to Inventory:**
```
📦 Procurement → MR Tab → [Click Material Name] → Materials Inventory List View
📦 Procurement → MR Tab → [View All Materials] → Materials Inventory List View
```

**From POs Tab to GRN:**
```
📦 Procurement → POs Tab → [Receive] → GRN Detail/Create Screen
📦 Procurement → POs Tab → [Track] → PO Detail → [Create GRN]
```

**Complete Procurement Workflow:**
```
1. 📦 MR Tab: Detect shortage → [Create PR]
2. 📦 PRs Tab: Review PR → [Approve] → [Convert to PO]  
3. 📦 POs Tab: Track PO → [Receive] → [Create GRN]
4. 📦 GRNs Tab: Process delivery → [Mark Received] → Stock Updated
5. Inventory: Updated automatically, visible in Materials Inventory List View
```

**Cross-Module Integration:**
- **Production Work Orders** → **MR Tab** (automatic material requirements)
- **GRN Completion** → **Inventory Update** (automatic stock increase)
- **Stock Alerts** → **PR Creation** (manual procurement trigger)

---

### **CUSTOMERS TAB** - Relationship Management

#### **Customer CRM Module Overview**

The Customer tab functions as a complete CRM system with two main sections:

**Module Structure:**
```
👥 CUSTOMER CRM (Main Tab)
├── Customers - Customer list and 360° management
└── Support - Support ticket management and resolution
```

**Business Context**: Addresses customer relationship management needs: "Customer કેવો છે? Payment કેમ છે? Support issues કયા છે?" (How is the customer? How are payments? What support issues exist?)

**Cross-Module Integration:**
- **From Sales**: Lead conversion creates customer profiles automatically
- **From Production**: Order status updates reflected in customer 360° view
- **To Accounts**: Payment behavior feeds into customer credit management
- **To Support**: Seamless ticket creation with customer context

---

#### **Customer List View** (Default Landing)

```
┌─────────────────────────────────────┐
│ Customers  [ Customers│Support ]     │ Two-section toggle: 56px
│ [🔍 Search customers... (🎙)]       │ Search: 44px
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Suresh Textiles              │ │ Company icon
│ │ 💰 Outstanding: ₹12,000         │ │ Financial highlight
│ │ 📅 Last Order: 04 Oct           │ │ Recency info
│ │ 💎 LTV: ₹2.5L | Status: 🟢 Good │ │ Value & status
│ │ [View 360°] [📞] [WhatsApp]     │ │ Quick actions
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 12px gap
│ │ 🏢 Ramesh Mills                 │ │
│ │ 💰 Outstanding: ₹0              │ │ Zero balance: green
│ │ 📅 Last Order: 28 Sep           │ │
│ │ 💎 LTV: ₹1.8L | Status: ⭐ Exc  │ │ Excellent rating
│ │ [View 360°] [📞] [WhatsApp]     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Gujarat Fabrics              │ │
│ │ 💰 Outstanding: ₹45,000         │ │ High balance: red
│ │ 📅 Last Order: 20 Sep           │ │
│ │ 💎 LTV: ₹800K | Status: ⚠️ Late │ │ Warning status
│ │ [View 360°] [📞] [Reminder]     │ │ Different action
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Sort: [Recent ▼] Filter: [All ▼]   │ 40px controls
├─────────────────────────────────────┤
│ 🏠   💼   🏭   📦   👥•         [+] │ Active: Customers
└─────────────────────────────────────┘
```

#### **Customer 360° View** (Most Important Screen)

```
┌─────────────────────────────────────┐
│ Suresh Textiles               [←]   │ Customer header
│ [📞 Call] [WhatsApp] [New Order]    │ Quick actions: 44px
├─────────────────────────────────────┤
│ 💰 Outstanding: ₹12,000             │ Financial KPIs
│ 📅 Last Order: 04 Oct 2024          │ Key metrics: 48px
│ 💎 Relationship: 🟢 Good Customer   │ Relationship status
│ 📈 Lifetime Value: ₹2,50,000        │ Large LTV display
├─────────────────────────────────────┤
│ [Summary│Orders│Payments│Tickets│📊] │ Sub-tabs: 48px
├─────────────────────────────────────┤
│ 📋 SUMMARY TAB                      │ Active tab content
│                                     │
│ Recent Orders (Last 3):             │ Section: 20px
│ • #O-2345 ₹1,20,000 🟡 In progress │ Order list: 32px each
│ • #O-2341 ₹90,000 ✅ Delivered     │ Status colors
│ • #O-2338 ₹75,000 ✅ Delivered     │ Clear hierarchy
│                                     │
│ [🔄 Reorder Last Order]             │ 44px reorder button
├─────────────────────────────────────┤
│ Communication History:              │ Interaction log
│ • 04 Oct — Order confirmed          │ Timeline format
│ • 02 Oct — Quote sent via WhatsApp  │ 28px each entry
│ • 28 Sep — Payment reminder sent    │ Chronological
├─────────────────────────────────────┤
│ Quick Actions:                      │ Action section
│ [Send Payment Reminder]             │ 40px buttons
│ [Share Product Catalog]             │ Relevant actions
│ [Schedule Follow-up]                │ Business context
├─────────────────────────────────────┤
│ [Create New Order] [Record Payment] │ 56px primary CTAs
│                                     │ Split layout
└─────────────────────────────────────┘
```

#### **Customer Orders Tab**

```
┌─────────────────────────────────────┐
│ Suresh Textiles — Orders       [←] │ Sub-page header
├─────────────────────────────────────┤
│ [Summary│Orders│Payments│Tickets│📊] │ Tab navigation
├─────────────────────────────────────┤
│ 📋 ORDERS HISTORY (12 total)        │ Section header
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2345 | 04 Oct 2024     │ │ Order card: 100px
│ │ 💰 ₹1,20,000 | 🟡 Production    │ │ Amount + status
│ │ 📦 Cotton 40s, Dyed Fabric      │ │ Items summary
│ │ [View Details] [Track Status]   │ │ Order actions
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ 8px gap
│ │ Order #O-2341 | 28 Sep 2024     │ │
│ │ 💰 ₹90,000 | ✅ Delivered       │ │ Completed order
│ │ 📦 Cotton 30s, Polyester        │ │ Different items
│ │ [View Details] [Reorder]        │ │ Reorder option
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Order #O-2338 | 15 Sep 2024     │ │
│ │ 💰 ₹75,000 | ✅ Delivered       │ │ Older order
│ │ 📦 Dyed Cotton, Silk Blend      │ │ Premium items
│ │ [View Details] [Reorder]        │ │ Consistent actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Order Patterns:                     │ Insights section
│ • Avg order: ₹95,000               │ Pattern analysis
│ • Peak month: October              │ Business intelligence
│ • Prefers: Cotton products (70%)   │ Product preferences
├─────────────────────────────────────┤
│    [Reorder Frequently Bought]     │ 56px smart action
└─────────────────────────────────────┘
```

#### **Customer Payments Tab**

```
┌─────────────────────────────────────┐
│ Suresh Textiles — Payments     [←] │ Sub-page header
├─────────────────────────────────────┤
│ [Summary│Orders│Payments│Tickets│📊] │ Tab navigation
├─────────────────────────────────────┤
│ 💳 PAYMENTS & OUTSTANDING           │ Section header
│                                     │
│ Outstanding Summary:                │ Financial overview
│ • Current Outstanding: ₹12,000      │ Total due amount
│ • Overdue Amount: ₹5,000 (2 invoices)│ Aging breakdown
│ • Credit Limit: ₹50,000             │ Credit facility
│ • Available Credit: ₹38,000         │ Remaining limit
├─────────────────────────────────────┤
│ 📋 PAYMENT HISTORY                  │ Transaction section
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Invoice #2024-089 | ₹1,20,000   │ │ Payment record
│ │ Status: 💰 Paid | 12 Oct 2024   │ │ Paid status: green
│ │ Method: Bank Transfer            │ │ Payment method
│ │ Due: 10 Oct | Paid: On-time ✅  │ │ Timing performance
│ │ [View Invoice] [Receipt]        │ │ Document access
│ └─────────────────────────────────┘ │ Card: 120px
│                                     │
│ ┌─────────────────────────────────┐ │ 8px gap
│ │ Invoice #2024-088 | ₹85,000     │ │ Overdue payment
│ │ Status: 🔴 Overdue (10 days)    │ │ Red overdue status
│ │ Method: Bank Transfer           │ │ Payment preference
│ │ Due: 5 Oct | Late by 10 days   │ │ Delay tracking
│ │ [Send Reminder] [Call Customer] │ │ Collection actions
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Invoice #2024-087 | ₹90,000     │ │ Completed payment
│ │ Status: 💰 Paid | 28 Sep 2024   │ │ Historical record
│ │ Method: UPI Payment             │ │ Digital payment
│ │ Due: 25 Sep | Paid: 3 days late│ │ Performance tracking
│ │ [View Invoice] [Receipt]        │ │ Documentation
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📊 Payment Analytics                │ Insights section
│ • Average payment time: 12 days     │ Behavior metric
│ • Payment reliability: 85%          │ Performance score
│ • Preferred method: Bank Transfer   │ Method preference
│ • On-time payments: 8/12 invoices   │ Reliability ratio
│ • Credit utilization: 24%           │ Credit usage
├─────────────────────────────────────┤
│ 🔔 Payment Alerts                   │ Action section
│ • 2 invoices overdue (₹5,000)      │ Priority alert
│ • Credit limit usage: Normal        │ Risk assessment
│ • Next payment due: 25 Oct (₹8,000) │ Upcoming payment
├─────────────────────────────────────┤
│ [Send Payment Reminder] [Update Credit]│ 56px action buttons
└─────────────────────────────────────┘
```

#### **Customer Tickets Tab**

```
┌─────────────────────────────────────┐
│ Suresh Textiles — Tickets      [←] │ Sub-page header
├─────────────────────────────────────┤
│ [Summary│Orders│Payments│Tickets│📊] │ Tab navigation
├─────────────────────────────────────┤
│ 🎫 SUPPORT TICKETS                  │ Section header
│                                     │
│ Active Tickets (2):                 │ Current issues
│ ┌─────────────────────────────────┐ │
│ │ Ticket #T-001 | Quality Issue   │ │ Active ticket
│ │ Priority: 🔴 High               │ │ Priority indicator
│ │ Status: 🟡 In Progress          │ │ Current status
│ │ Created: 2 hours ago            │ │ Timing info
│ │ Order: #O-2345 | Assigned: QC   │ │ Context & assignment
│ │ [View Details] [Update Status]  │ │ Management actions
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 8px gap
│ │ Ticket #T-003 | Delivery Delay  │ │ Another active ticket
│ │ Priority: 🟡 Medium             │ │ Lower priority
│ │ Status: 🟢 Investigating        │ │ Progress status
│ │ Created: 1 day ago              │ │ Older ticket
│ │ Order: #O-2341 | Assigned: Ops  │ │ Operations team
│ │ [View Details] [Update Status]  │ │ Same actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Recently Resolved (3):              │ Historical section
│ ┌─────────────────────────────────┐ │
│ │ Ticket #T-002 | Color Mismatch  │ │ Resolved ticket
│ │ Resolved: 1 week ago ✅         │ │ Resolution status
│ │ Resolution: ₹2,000 credit given │ │ Outcome details
│ │ Resolution time: 4 hours        │ │ Efficiency metric
│ │ [View Details] [Customer Rating]│ │ Review options
│ └─────────────────────────────────┘ │ Card: 120px
├─────────────────────────────────────┤
│ 📊 Support Summary                  │ Analytics section
│ • Total tickets: 8                 │ Volume metric
│ • Average resolution: 6 hours      │ Efficiency score
│ • Customer satisfaction: 95%       │ Quality metric
│ • Most common: Quality issues (50%)│ Pattern analysis
├─────────────────────────────────────┤
│ [Create New Ticket] [View All Support]│ 56px action buttons
└─────────────────────────────────────┘
```

#### **Customer Insights Tab**

```
┌─────────────────────────────────────┐
│ Suresh Textiles — Insights     [←] │ Sub-page header
├─────────────────────────────────────┤
│ [Summary│Orders│Payments│Tickets│📊] │ Tab navigation
├─────────────────────────────────────┤
│ 📊 BUSINESS INTELLIGENCE            │ Section header
│                                     │
│ 🎯 Customer Profile Analysis:       │ Analysis section
│ • Peak ordering: Sept-Dec (festival)│ Seasonal insights
│ • Preferred items: Cotton 40s (70%) │ Product preferences
│ • Avg order value: ₹95,000          │ Value metrics
│ • Payment behavior: Usually on-time │ Financial behavior
│ • Order frequency: Every 2-3 weeks  │ Timing patterns
├─────────────────────────────────────┤
│ 💡 Business Opportunities:          │ Opportunity section
│ • 30% higher orders during monsoon  │ Seasonal opportunity
│ • Shows interest in premium grades  │ Upsell potential
│ • Always negotiates bulk discounts  │ Pricing insight
│ • Potential for long-term contract  │ Relationship opportunity
├─────────────────────────────────────┤
│ 🎁 Recommended Actions:             │ Action recommendations
│ [Send Festival Catalog]             │ 40px action buttons
│ [Offer Volume Discount]             │ Contextual suggestions
│ [Share Premium Samples]             │ Business-driven
│ [Propose Annual Contract]           │ Relationship building
├─────────────────────────────────────┤
│ 📈 Performance Metrics:             │ Score section
│ Customer Score: 85/100 🟢           │ Overall rating
│ • Payment reliability: 95/100       │ Sub-scores
│ • Order consistency: 80/100         │ Component metrics
│ • Growth potential: 90/100          │ Future value
│ Risk Assessment: Low Risk 🟢        │ Risk indicator
├─────────────────────────────────────┤
│        [Create Targeted Offer]      │ 56px primary CTA
└─────────────────────────────────────┘
```

---

### **Customer CRM Support Management Section**

#### **Support Tickets Dashboard** (Customer Tab Main View)

```
┌─────────────────────────────────────┐
│ Customers  [ Customers│Support ]     │ Two-section toggle
│ [🔍 Search tickets... (🎙)]         │ Search: 44px
├─────────────────────────────────────┤
│ [Open] [In Progress] [Resolved]     │ Status filter tabs
├─────────────────────────────────────┤
│ 🎫 ACTIVE SUPPORT TICKETS           │ Section header
│ ┌─────────────────────────────────┐ │
│ │ Ticket #T-001 | Quality Issue   │ │ High priority ticket
│ │ Customer: Suresh Textiles       │ │ Customer context
│ │ Priority: 🔴 High | 2 hours ago │ │ Priority & timing
│ │ Order: #O-2345 | Assigned: QC   │ │ Order link & team
│ │ Status: 🟡 In Progress          │ │ Current status
│ │ [View Details] [Update] [Call]  │ │ Quick actions
│ └─────────────────────────────────┘ │ Card: 140px
│                                     │
│ ┌─────────────────────────────────┐ │ 8px gap
│ │ Ticket #T-003 | Delivery Issue  │ │ Medium priority
│ │ Customer: Ramesh Mills          │ │ Different customer
│ │ Priority: 🟡 Medium | 1 day ago │ │ Lower priority
│ │ Order: #O-2341 | Assigned: Ops  │ │ Operations team
│ │ Status: 🔄 Investigating        │ │ Progress status
│ │ [View Details] [Update] [Call]  │ │ Consistent actions
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📊 Support Overview                 │ Quick stats
│ • Open tickets: 5 | Average: 6 hrs │ Performance metrics
│ • High priority: 2 | Overdue: 1    │ Priority tracking
│ • Most common: Quality (40%)       │ Issue categories
├─────────────────────────────────────┤
│        [+ Create New Ticket]        │ 56px CTA
├─────────────────────────────────────┤
│ 🏠   💼   🏭   📦   👥•         [+] │ Active: Customers
└─────────────────────────────────────┘
```

#### **Ticket Creation Workflow**

```
┌─────────────────────────────────────┐
│ Create Support Ticket           [×] │ Modal header
├─────────────────────────────────────┤
│ 👤 Customer Selection               │ Step 1
│ Customer: [Suresh Textiles ▼]       │ Customer dropdown
│ Phone: +91 9876543210              │ Auto-filled contact
│ Email: suresh@textiles.com         │ Customer details
├─────────────────────────────────────┤
│ 🎫 Ticket Details                   │ Step 2
│ Subject: [Quality issue with fabric]│ Issue title: 44px
│ Category: [Quality Issue ▼]        │ Category dropdown
│ Priority: ● High ○ Medium ○ Low    │ Priority selection
│ Related Order: [#O-2345 ▼]         │ Order association
├─────────────────────────────────────┤
│ 📝 Issue Description                │ Step 3
│ ┌─────────────────────────────────┐ │
│ │ [Customer reports color         │ │ Description area
│ │  variation in latest fabric     │ │ 80px text area
│ │  delivery. Blue shade is off.]  │ │ Detailed description
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 👥 Assignment                       │ Step 4
│ Assign to: [Quality Control Team ▼]│ Team assignment
│ Due date: [Today + 4 hours ▼]      │ SLA compliance
│ Notify customer: ☑️ Yes via WhatsApp│ Communication
├─────────────────────────────────────┤
│     [Cancel]     [Create Ticket]    │ Action buttons
└─────────────────────────────────────┘
```

#### **Ticket Detail View with Conversation Thread**

```
┌─────────────────────────────────────┐
│ Ticket #T-001 — Quality Issue   [←] │ Header with back
│ Customer: Suresh Textiles | High Priority │ Context bar
├─────────────────────────────────────┤
│ 📋 Ticket Information               │ Details section
│ Created: 04 Oct, 2:30 PM            │ Timestamp
│ Category: Quality Issue             │ Type classification
│ Order: #O-2345 | Cotton Fabric     │ Order context
│ Assigned: Quality Control Team     │ Current assignment
│ Status: 🟡 In Progress | Due: 6:30 PM │ Status & deadline
├─────────────────────────────────────┤
│ 💬 Conversation Thread              │ Communication log
│ ┌─────────────────────────────────┐ │
│ │ 👤 Customer (2:30 PM):          │ │ Customer message
│ │ "The blue shade is not matching │ │ Issue description
│ │  the sample. Please check."     │ │ Original complaint
│ └─────────────────────────────────┘ │ Message card: 60px
│ ┌─────────────────────────────────┐ │
│ │ 🎧 Support (2:45 PM):           │ │ Support response
│ │ "Thank you for reporting. Our   │ │ Acknowledgment
│ │  QC team will investigate."     │ │ Action commitment
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🔧 QC Team (3:15 PM):           │ │ Team update
│ │ "Inspecting batch B2024-045.    │ │ Progress update
│ │  Will report findings in 2h."   │ │ Timeline commitment
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 📷 Evidence & Attachments           │ Documentation
│ [fabric_sample_issue.jpg] 📎        │ Customer photo
│ [batch_inspection_report.pdf] 📄    │ Internal document
│ [+ Add Attachment]                  │ Upload option
├─────────────────────────────────────┤
│ ✍️ Add Update                       │ Response section
│ ┌─────────────────────────────────┐ │
│ │ [Batch inspection complete.     │ │ Update text area
│ │  Found minor color variation.   │ │ 60px height
│ │  Offering replacement/credit.]  │ │ Resolution details
│ └─────────────────────────────────┘ │
│ Notify: ☑️ Customer ☑️ Internal Team │ Notification options
├─────────────────────────────────────┤
│ 🎯 Resolution Actions               │ Action section
│ [Mark Resolved] [Escalate] [Update] │ Primary actions: 44px
│ [Call Customer] [Schedule Follow-up] │ Communication options
├─────────────────────────────────────┤
│ 📊 Ticket Metrics                   │ Performance tracking
│ • Response time: 15 minutes         │ Efficiency metrics
│ • Total time: 3 hours 45 minutes   │ Duration tracking
│ • Customer satisfaction: Pending   │ Feedback status
└─────────────────────────────────────┘
```

#### **Support Analytics Dashboard**

```
┌─────────────────────────────────────┐
│ Support Analytics               [←] │ Analytics header
├─────────────────────────────────────┤
│ 📊 Performance Overview             │ KPI section
│ Today: 8 tickets | Resolved: 5     │ Daily metrics
│ Avg Response: 12 minutes           │ Response time
│ Avg Resolution: 4.2 hours          │ Resolution time
│ Customer Satisfaction: 94%         │ Quality score
├─────────────────────────────────────┤
│ 🎯 Ticket Categories (This Month)   │ Category breakdown
│ • Quality Issues: 15 (40%)         │ Most common
│ • Delivery Problems: 10 (27%)      │ Operations related
│ • Payment Queries: 8 (21%)         │ Financial issues
│ • Product Information: 4 (12%)     │ Information requests
├─────────────────────────────────────┤
│ 👥 Team Performance                 │ Team metrics
│ • QC Team: 6 tickets | 3.5h avg    │ Quality team
│ • Operations: 4 tickets | 5.2h avg │ Ops team performance
│ • Support: 2 tickets | 1.8h avg    │ General support
├─────────────────────────────────────┤
│ ⚠️ Priority Management              │ Priority tracking
│ • High Priority: 2 open            │ Urgent issues
│ • Medium Priority: 3 open          │ Standard issues
│ • Overdue Tickets: 1               │ Escalation needed
├─────────────────────────────────────┤
│ [Export Report] [Team Assignment]   │ Management actions
└─────────────────────────────────────┘
```

---

### **Customer CRM Integration Workflows**

#### **Sales → Customer Integration**
- **Lead conversion**: Hot leads automatically create customer profiles with relationship score
- **Order confirmation**: Sales orders appear in customer order history with real-time status
- **Payment updates**: Payment confirmations update customer payment analytics instantly

#### **Production → Customer Integration**
- **Production milestones**: Customers receive automated WhatsApp updates on key milestones
- **Quality updates**: QC completion triggers customer notifications with quality grade
- **Delivery ready**: Production completion creates delivery notifications with tracking

#### **Support → Customer Integration**
- **Ticket creation**: Support tickets automatically link to customer 360° view
- **Resolution updates**: Ticket resolutions update customer satisfaction scores
- **Issue patterns**: Support data feeds into customer insights for proactive service

#### **Accounts → Customer Integration**
- **Invoice generation**: New invoices appear in customer payment history instantly
- **Payment processing**: Payment confirmations update customer financial status
- **Credit management**: Credit limit utilization monitored in customer 360° view

---

## 7. Web Desktop Design Specifications

### Desktop Layout Architecture

#### **Sidebar Navigation System**
```
┌─────────────────┬─────────────────────────────────────────────┐
│ ElevateBusiness │                                             │
│ 360°            │                                             │
├─────────────────┤            Main Content Area               │
│ 🏠 Home         │                                             │
│ 💼 Sales        │                                             │
│ 🏭 Production   │                                             │
│ 📦 Procurement  │                                             │
│ 👥 Customers    │                                             │
├─────────────────┤                                             │
│ 📊 Reports      │                                             │
│ ⚙️ Settings     │                                             │
│ 👤 Profile      │                                             │
└─────────────────┴─────────────────────────────────────────────┘
240px sidebar      Remaining width (min 800px)
```

**Desktop Navigation Principles:**
- **Persistent sidebar** replaces mobile bottom navigation
- **Additional modules** (Reports, Settings) available on desktop
- **Breadcrumb navigation** in header for context
- **Multi-column layouts** utilize larger screen space

### **Desktop Home Dashboard**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ElevateBusiness 360°          Search...                    🔔 Notifications     │
│ Home > Dashboard                                           👤 Ramesh Kumar     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│ │  Revenue    │ │   Pending   │ │ Orders at   │ │ Production  │              │
│ │   ₹4.2L     │ │ Invoices 3  │ │   Risk 2    │ │ Eff. 78%    │              │
│ │   ↑5%       │ │  ₹45,000    │ │             │ │             │              │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                                 │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐│
│ │ 🚨 TOP BUSINESS ALERTS              │ │ 📈 SALES PIPELINE OVERVIEW         ││
│ │                                     │ │                                     ││
│ │ ⚠️ 2 orders blocked - Material     │ │ Leads: 12 → Quotes: 6              ││
│ │ shortage (Cotton Yarn 300kg)        │ │ Quotes: 6 → Orders: 2              ││
│ │                      [Resolve] ────→│ │ Orders: 2 → Delivered: 8           ││
│ │                                     │ │                                     ││
│ │ 💰 ₹45,000 overdue payments        │ │ Conversion Rate: 33%                ││
│ │ 3 invoices pending >15 days         │ │ Avg Order Value: ₹95,000           ││
│ │                  [Send Reminders]──→│ │                                     ││
│ └─────────────────────────────────────┘ └─────────────────────────────────────┘│
│                                                                                 │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐│
│ │ 🏭 OPERATIONS STATUS                │ │ 👥 CUSTOMER HEALTH                  ││
│ │                                     │ │                                     ││
│ │ Work Orders Active: 5               │ │ Active Customers: 32                ││
│ │ • In Progress: 3                    │ │ • Excellent: 12                     ││
│ │ • QC Pending: 1                     │ │ • Good: 18                          ││
│ │ • Delayed >24h: 1                   │ │ • At Risk: 2                        ││
│ │                                     │ │                                     ││
│ │ Active Work Orders: 8               │ │ Recent Feedback:                    ││
│ │ Completed Today: 3 | Pending: 5   │ │ • 4.2/5.0 average rating           ││
│ │               [View Production] ────→│ │ • 1 complaint pending               ││
│ └─────────────────────────────────────┘ └─────────────────────────────────────┘│
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │ 📋 RECENT ACTIVITY                                                          ││
│ │ Time    │ Activity                                │ User      │ Module     ││
│ │ 09:15   │ Payment ₹25,000 recorded               │ Ramesh    │ Sales      ││
│ │ 09:02   │ Work Order WO#451 started              │ Vikram    │ Production ││
│ │ 08:55   │ GRN received for PO#56                 │ Suresh    │ Procurement││
│ │ 08:40   │ Customer "Gujarat Fabrics" created     │ System    │ CRM        ││
│ │ 08:15   │ Quote Q#105 sent via WhatsApp          │ Priya     │ Sales      ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Desktop Sales Module**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Sales > Orders                                  Export Data    Create New Order  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Filters: [All Status ▼] [Last 30 days ▼] [All Customers ▼]    Search: [     ] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Order #    │ Customer        │ Amount     │ Status         │ Delivery   │ Actions │
├─────────────────────────────────────────────────────────────────────────────────┤
│ O-2345     │ Suresh Textiles │ ₹1,20,000  │ 🟡 Production  │ 12 Oct     │ [View]  │
│            │ +91 98765 43210 │            │                │            │ [Call]  │
│            │                 │            │                │            │ [WhatsApp]│
├─────────────────────────────────────────────────────────────────────────────────┤
│ O-2344     │ Ramesh Mills    │ ₹85,000    │ ⚠️ Materials   │ 10 Oct     │ [View]  │
│            │ +91 98765 43211 │            │ Short          │            │ [Create PR]│
│            │                 │            │                │            │ [Call]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│ O-2340     │ Gujarat Fabrics │ ₹95,000    │ ✅ Delivered   │ 05 Oct     │ [View]  │
│            │ +91 98765 43212 │            │                │            │ [Feedback]│
│            │                 │            │                │            │ [Reorder]│
├─────────────────────────────────────────────────────────────────────────────────┤
│ Showing 3 of 24 orders                                       [1] [2] [3] [Next] │
└─────────────────────────────────────────────────────────────────────────────────┘

Order Detail Drawer (slides in from right):
┌─────────────────────────────────────────┐
│ Order #O-2345 — Suresh Textiles    [×] │
├─────────────────────────────────────────┤
│ Customer Info:                          │
│ Company: Suresh Textiles                │
│ Contact: Ramesh Patel                   │
│ Phone: +91 98765 43210                  │
│ [📞 Call] [WhatsApp] [Email]            │
├─────────────────────────────────────────┤
│ Order Details:                          │
│ • Cotton 40s: 500m @ ₹90/m = ₹45,000   │
│ • Dyed Fabric: 200m @ ₹120/m = ₹24,000 │
│ Subtotal: ₹69,000                       │
│ GST: ₹6,900                             │
│ Total: ₹75,900                          │
├─────────────────────────────────────────┤
│ Status Timeline:                        │
│ ✅ Order Created (04 Oct)               │
│ ✅ Payment Received (04 Oct)            │
│ ✅ Production Started (05 Oct)          │
│ 🟡 In Production (Current)              │
│ ⏳ QC Pending                           │
│ ⏳ Ready for Dispatch                   │
├─────────────────────────────────────────┤
│ Actions:                                │
│ [View Work Orders]                      │
│ [Record Additional Payment]             │
│ [Add Order Notes]                       │
│ [Generate Invoice]                      │
└─────────────────────────────────────────┘
```

### **Desktop Customer 360° View**

```
┌─────────────────┬─────────────────────────────────────────────────────────────────┐
│ Customer List   │ Customer Details: Suresh Textiles                              │
├─────────────────┼─────────────────────────────────────────────────────────────────┤
│ 🔍 Search...    │ [📞 Call] [WhatsApp] [Email] [New Order] [Record Payment]      │
│                 ├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ │ 📊 Key Metrics                                                 │
│ │Suresh       │ │ Outstanding: ₹12,000 | LTV: ₹2,50,000 | Status: 🟢 Good     │
│ │Textiles     │ │ Last Order: 04 Oct | Payment Terms: Net 30                   │
│ │₹12K pending │ │ Relationship Score: 85/100 | Risk Level: Low                 │
│ │LTV: ₹2.5L   │ ├─────────────────────────────────────────────────────────────────┤
│ └─────────────┘ │ Tabs: [Summary] [Orders] [Payments] [Communications] [Insights] │
│                 ├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ │ ORDERS TAB                                                     │
│ │Ramesh Mills │ │ ┌─────────────────────────────────────────────────────────────┐│
│ │₹0 pending   │ │ │Order #  │Date     │Amount    │Status      │Items            ││
│ │LTV: ₹1.8L   │ │ ├─────────────────────────────────────────────────────────────┤│
│ └─────────────┘ │ │O-2345   │04 Oct   │₹1,20,000 │Production  │Cotton 40s, Dyed ││
│                 │ │O-2341   │28 Sep   │₹90,000   │Delivered   │Cotton 30s       ││
│ ┌─────────────┐ │ │O-2338   │15 Sep   │₹75,000   │Delivered   │Silk Blend       ││
│ │Gujarat      │ │ └─────────────────────────────────────────────────────────────┘│
│ │Fabrics      │ │                                                                 │
│ │₹45K pending │ │ Order Patterns & Insights:                                      │
│ │LTV: ₹800K   │ │ • Average order value: ₹95,000                                 │
│ └─────────────┘ │ • Peak ordering months: September, October, November           │
│                 │ • Product preferences: Cotton products (70%), Premium grades   │
│ [+ Add Customer]│ • Payment behavior: Usually pays within terms                  │
│                 │                                                                 │
│                 │ Recommended Actions:                                            │
│                 │ [Send Festival Catalog] [Offer Volume Discount] [Annual Contract]│
└─────────────────┴─────────────────────────────────────────────────────────────────┘
240px list width   Remaining space for details
```

### **Desktop Reports & Analytics**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Reports & Analytics                                        Date Range: [Oct 2024]│
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐        │
│ │ 📈 Sales Performance│ │ 🏭 Production Metrics│ │ 💰 Financial Summary│        │
│ │                     │ │                     │ │                     │        │
│ │ Revenue: ₹12.4L     │ │ Active WOs: 5       │ │ Profit: ₹2.1L       │        │
│ │ Growth: +15%        │ │ Completed: 18       │ │ Margin: 17%         │        │
│ │ Orders: 24          │ │ Pending QC: 2       │ │ Outstanding: ₹45K   │        │
│ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘        │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐│
│ │ 📊 Revenue Trend (Last 6 Months)                                           ││
│ │     ₹                                                                       ││
│ │ 15L ┤                                                   ●                   ││
│ │ 12L ┤                                               ●   │                   ││
│ │  9L ┤                                           ●       │                   ││
│ │  6L ┤                                       ●           │                   ││
│ │  3L ┤                               ●                   │                   ││
│ │  0L └─────┬─────┬─────┬─────┬─────┬─────────────────────┘                   ││
│ │         May   Jun   Jul   Aug   Sep   Oct                                   ││
│ └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
│ ┌───────────────────────────────┐ ┌───────────────────────────────────────────┐│
│ │ 🏆 Top Customers              │ │ ⚠️ Business Alerts                        ││
│ │                               │ │                                           ││
│ │ 1. Suresh Textiles: ₹2.5L     │ │ • 2 orders blocked by material shortage  ││
│ │ 2. Gujarat Fabrics: ₹800K     │ │ • ₹45K overdue payments (>15 days)       ││
│ │ 3. Ramesh Mills: ₹1.8L        │ │ • Production efficiency below target     ││
│ │ 4. Ahmedabad Textiles: ₹650K  │ │ • 1 customer complaint pending           ││
│ │ 5. Patel Industries: ₹500K    │ │                                           ││
│ │                               │ │ [Resolve All Issues]                      ││
│ └───────────────────────────────┘ └───────────────────────────────────────────┘│
│                                                                                 │
│ Export Options: [📄 PDF Report] [📊 Excel Data] [📧 Email Summary]             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. User Flow Diagrams

### Primary Business Flows

#### **Lead to Customer Conversion Flow**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   📞 Lead   │───→│   📋 Quote  │───→│ 💰 Payment │───→│ 👤 Customer │
│   Capture   │    │  Creation   │    │  Recording  │    │  Creation   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│• Company    │    │• Product    │    │• Amount     │    │• Profile    │
│• Contact    │    │• Quantity   │    │• Method     │    │• History    │
│• Requirements│    │• Price      │    │• Proof      │    │• Orders     │
│• Priority   │    │• Delivery   │    │• Notes      │    │• Analytics  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

#### **Order to Delivery Flow**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 📦 Order    │───→│ 📋 Material │───→│ 🏭 Work     │───→│ ✅ Quality  │───→│ 🚚 Dispatch │
│ Creation    │    │ Planning    │    │ Orders      │    │ Control     │    │ & Delivery  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                   │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│• Items      │    │• Requirements│    │• Assignments│    │• Inspection │    │• Packaging  │
│• Quantities │    │• Shortages  │    │• Progress   │    │• Grading    │    │• Shipping   │
│• Delivery   │    │• Purchase   │    │• Issues     │    │• Evidence   │    │• Proof of   │
│• Terms      │    │ Requests    │    │• Completion │    │• Approval   │    │  Delivery   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Mobile Navigation Flow

#### **Tab-Based Navigation Structure**
```
                              🏠 HOME
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                💼 SALES    🏭 PRODUCTION  📦 PROCUREMENT    👥 CUSTOMERS
                    │            │            │                 │
            ┌───────┼───────┐    │    ┌───────┼───────┐        │
            │       │       │    │    │       │       │        │
         Leads   Quotes  Orders  │   MRs     PRs     GRNs      │
            │       │       │    │    │       │       │        │
            │       │       │    │    │       │       │        │
         Create  Create  Record  │  Create  Create  Record     │
         Lead    Quote  Payment  │   PR     PO     GRN        │
                         │       │                            │
                         │   ┌───────┼───────┐                │
                         │   │       │       │                │
                    Auto-Create Work Quality                   │
                    Customer   Orders Control                  │
                         │       │       │                    │
                         └───────┼───────┘                    │
                                 │                            │
                             Production                    Customer
                             Progress                        360°
```

### Cross-Module Integration Points

#### **Automated Workflow Triggers**
```
Payment Recorded ──→ Auto-Create Customer ──→ Generate Sales Order
      │                        │                       │
      ▼                        ▼                       ▼
Material Check         Customer Profile         Work Order Creation
      │                        │                       │
      ▼                        ▼                       ▼
Create PR if short    360° View Available    Production Planning
```

#### **Manual Override Points**
```
Each Automation Has Manual Alternative:

Auto-Customer Creation  ←──→  Manual Customer Creation
Auto-Work Order        ←──→  Manual Work Order
Auto-Material Req     ←──→  Manual PR Creation
Auto-QC Workflow      ←──→  Manual Quality Check
```

---

## 9. Interactive Design Patterns

### Touch Interaction Design

#### **Button Interaction States**
```
Primary Button States:

NORMAL STATE                    PRESSED STATE                  DISABLED STATE
┌─────────────────────┐         ┌─────────────────────┐        ┌─────────────────────┐
│    Create Order     │   ──→   │    Create Order     │        │    Create Order     │
│   #1D4ED8 bg       │         │   #1E40AF bg       │        │   #D1D5DB bg       │
│   White text       │         │   Slightly darker   │        │   #9CA3AF text     │
└─────────────────────┘         └─────────────────────┘        └─────────────────────┘
44px min height                 Visual feedback              Non-interactive

Secondary Button States:

NORMAL STATE                    HOVER/PRESSED                  DISABLED STATE
┌─────────────────────┐         ┌─────────────────────┐        ┌─────────────────────┐
│    View Details     │   ──→   │    View Details     │        │    View Details     │
│ #1D4ED8 border      │         │ #1D4ED8 bg          │        │ #E5E7EB border      │
│ #1D4ED8 text        │         │ White text          │        │ #9CA3AF text        │
└─────────────────────┘         └─────────────────────┘        └─────────────────────┘
```

#### **Card Interaction Patterns**
```
Card Tap Zones:

┌─────────────────────────────────────┐
│ Order #O-2345 — Suresh Textiles     │ ← Header area: Tap to expand/details
├─────────────────────────────────────┤
│ Status: Production in progress       │ ← Content area: Tap for overview
│ ₹1,20,000 | Delivery: 12 Oct       │
├─────────────────────────────────────┤
│ [View] [Call] [WhatsApp]            │ ← Action area: Individual button taps
└─────────────────────────────────────┘

Interaction Feedback:
• Tap highlight: Light blue overlay (200ms)
• Button press: Color change + haptic (if available)
• Loading state: Spinner + disabled appearance
• Success: Green checkmark + toast message
```

### Interface Control Patterns

#### **Configuration-Driven CTA Control**

**Purpose**: Flexible system for hiding/showing CTA buttons on specific tabs within business modules without layout disruption.

**Problem Solved**: 
- Tabs with individual card-level actions don't need ambiguous bottom CTAs
- Need to maintain clean layout without blank spaces when CTA is hidden
- Future-ready for any tab requiring CTA control across business modules

**Implementation Pattern**:
```typescript
// CTA visibility configuration - easy to modify for any tab
const CTA_CONFIG = {
  orders: { showCTA: false },      // Hide CTA for Orders tab
  wo: { showCTA: true },           // Show CTA for Work Orders
  machines: { showCTA: true },     // Show CTA for Machines
  qc: { showCTA: true },           // Show CTA for QC
  ready: { showCTA: true }         // Show CTA for Ready
} as const;

// Dynamic CTA visibility control
const shouldHideCTA = !CTA_CONFIG[activeTab]?.showCTA;

// Dynamic layout adaptation with conditional CSS classes
<div className={`${styles.businessModule} ${shouldHideCTA ? styles.noCTA : ''}`}>
  {/* Standard tab and filter structure */}
  <div className={styles.tabNavigation}>...</div>
  <div className={styles.filterSection}>...</div>
  <div className={styles.contentArea}>...</div>
  
  {/* Configuration-driven CTA rendering */}
  {!shouldHideCTA && (
    <div className={styles.ctaSection}>
      <button className={styles.ctaButton} onClick={handleCTAClick}>
        {getContextualCTA(activeTab)}
      </button>
    </div>
  )}
</div>
```

**CSS Grid Layout Adaptation**:
```css
/* Standard 4-row layout with CTA */
.businessModule {
  display: grid;
  grid-template-rows: 48px 44px 1fr 56px; /* Tab | Filter | Content | CTA */
  height: 100%;
}

/* Adaptive 3-row layout when CTA is hidden */
.businessModule.noCTA {
  grid-template-rows: 48px 44px 1fr; /* Tab | Filter | Content (no blank space) */
}
```

**Visual Design Results**:
```
With CTA (Standard Tabs):           Without CTA (Orders Tab):
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ Orders | WO | Machines | QC     │   │ Orders•| WO | Machines | QC     │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│ All Orders ▼ | This Week ▼     │   │ All Orders ▼ | This Week ▼     │
├─────────────────────────────────┤   ├─────────────────────────────────┤
│                                 │   │                                 │
│        Sales Order Cards        │   │        Sales Order Cards        │
│     (individual actions)        │   │     (individual actions)        │
│                                 │   │                                 │
├─────────────────────────────────┤   └─────────────────────────────────┘
│      [+ Create Work Order]      │   ← Clean, no blank space
└─────────────────────────────────┘   ← No ambiguous bottom CTA
```

**Usage Guidelines**:
- **Use When**: Tabs have individual card-level actions (Start Production, View Details, etc.)
- **Avoid When**: Bottom CTA provides clear, unambiguous primary action
- **Pattern Benefits**: 
  - ✅ Eliminates action ambiguity (which order to start production?)
  - ✅ Maintains visual hierarchy and clean layout
  - ✅ Easy configuration for future tabs
  - ✅ Consistent across business modules

**Business Context Examples**:
- **Production Orders Tab**: Individual "Start Production" buttons per Sales Order
- **Procurement GRNs Tab**: Individual "Mark Received" buttons per GRN
- **Quality Control Tab**: Individual "Pass/Reject" buttons per inspection

**Implementation Notes**:
- Configuration object acts as single source of truth
- CSS Grid automatically adapts layout for optimal space usage
- TypeScript safety with `as const` assertion
- Easy to extend to new tabs or business modules

#### **DESIGN DECISION: Machine Tab MVP Exclusion**

**Decision**: Machine Tab is **NOT REQUIRED** for MVP in Production module.

**Problem Context**: 
Initial designs included a Machine Tab for live production tracking and operator interface, similar to large-scale manufacturing systems.

**MSME Operational Reality Assessment**:
- **Scale**: 3-4 machines maximum per MSME textile unit
- **Operators**: 1 dedicated operator per machine (personal ownership model)
- **Supervision**: Direct visual supervision in compact factory space
- **Work Assignment**: Machine assignments are implicit and rarely change

**Value vs. Complexity Analysis**:
```
Digital Machine View Benefits:        MSME Reality:
• Machine status dashboard          → Operator sees machine directly
• Real-time production metrics      → Simple output counting suffices  
• Machine assignment management     → Assignments rarely change
• Performance analytics             → Visual inspection & experience
• Multi-machine coordination        → 3-4 machines manageable manually
```

**Alternative Solution Implemented**:
- **Machine-based filtering in WO Tab**: Provides machine-level visibility when needed
- **Individual WO cards show**: Current machine assignment and operator
- **Supervisor access**: Can filter by any machine through WO Tab
- **Operator workflow**: Uses WO Tab filtered to their specific machine

**Decision Rationale**:
1. **Operational Fit**: Digital overhead doesn't justify business value at MSME scale
2. **User Experience**: Simpler interface reduces training burden
3. **Development Efficiency**: Focus resources on higher-impact features
4. **Customer Demand Strategy**: Add if customers specifically request after MVP usage

**Future Consideration Trigger**:
- Customer requests for machine analytics
- Scaling to larger operations (10+ machines)
- Integration with IoT sensors for automatic data collection

**MVP Scope**: Focus on Sales Order → Work Order workflow optimization, not machine-level digitization.

### Voice Interaction Design

#### **Voice Input Visual Patterns**
```
Voice Trigger Button:
┌─────────────────────────────────────┐
│ [🔍 Search orders, customers... 🎙] │ ← Mic icon in search bar
└─────────────────────────────────────┘

Voice Active State:
┌─────────────────────────────────────┐
│ [🎤 Listening... "Create new..."  ] │ ← Live transcription
└─────────────────────────────────────┘

Voice Confirmation:
┌─────────────────────────────────────┐
│ Did you mean: "Create new order     │
│ for Ramesh Traders"?                │
│                                     │
│        [✓ Yes] [✗ No] [Try Again]   │
└─────────────────────────────────────┘
```

#### **Voice Command Categories**
```
Navigation Commands:
• "Show [module name]" → Navigate to module
• "Go to [customer name]" → Open customer 360°
• "Open [order number]" → View order details

Action Commands:
• "Create new [entity]" → Open creation form
• "Record payment" → Open payment form
• "Start work order [number]" → Begin production

Query Commands:
• "Show pending orders" → Filter view
• "How many hot leads?" → Display count
• "What's overdue?" → Show overdue items
```

### Photo Capture Patterns

#### **Photo Capture UI Flow**
```
Photo Capture Trigger:
┌─────────────────────────────────────┐
│     [📷 Take Photo of Challan]      │ ← Clear instruction
└─────────────────────────────────────┘

Camera Interface:
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │ ← Camera viewfinder
│ │        Camera Preview           │ │   Full width
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Purpose: GRN Documentation          │ ← Context reminder
│                                     │
│ [📷 Capture]  [🔄 Retake]  [❌ Cancel] │ ← Action buttons
└─────────────────────────────────────┘

Photo Review:
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │ ← Captured image
│ │     [Captured Image]            │ │   preview
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Quality: Good  📊                   │ ← Auto-quality check
│                                     │
│ [✓ Use Photo]  [🔄 Retake]          │ ← Final actions
└─────────────────────────────────────┘
```

### Sync Status Indicators

#### **Offline/Online State Design**
```
Online & Synced:
┌─────────────────────────────────────┐
│ Last synced: 10:42 AM ✅            │ ← Green indicator
└─────────────────────────────────────┘

Offline - Pending Sync:
┌─────────────────────────────────────┐
│ 2 items pending sync 🔄 [Sync Now]  │ ← Yellow with action
└─────────────────────────────────────┘

Sync in Progress:
┌─────────────────────────────────────┐
│ Syncing... ⏳ (Don't close app)     │ ← Blue with spinner
└─────────────────────────────────────┘

Sync Failed:
┌─────────────────────────────────────┐
│ Sync failed ❌ [Retry] [Details]    │ ← Red with options
└─────────────────────────────────────┘
```

### Progress Visualization

#### **Progress Indicator Patterns**
```
Linear Progress (Work Orders):
Progress: [████████░░] 80%
Target: 1000m | Done: 800m | Remaining: 200m

Circular Progress (Dashboard KPIs):
    ╭─────╮
   ╱  8   ╲  Active
  ╱ ##### ╲ Work Orders
  ╲ ##### ╱ Today: 3/8 done
   ╲_____╱

Step Progress (Multi-step flows):
Step 2 of 3: ●●○
[Customer Selected] → [Items Added] → [Payment Terms]

Status Progress (Order lifecycle):
✅ Created → ✅ Paid → 🟡 Production → ⏳ QC → ⏳ Delivery
```

---

## 10. Design Validation & Demo Guidelines

### Design Validation Framework

#### **Usability Testing Checklist**
```
Core Task Completion (Must achieve 80%+ success rate):

✅ Navigation Tasks:
• Find customer information in <30 seconds
• Navigate between modules without confusion
• Return to home dashboard from any screen

✅ Data Entry Tasks:
• Create new lead in <2 minutes
• Record payment with photo in <3 minutes
• Start work order in <1 minute

✅ Information Retrieval:
• Find order status in <20 seconds
• Identify material shortages in <15 seconds
• Access customer contact info in <10 seconds

✅ Error Recovery:
• Recover from incorrect data entry
• Handle offline/sync issues gracefully
• Understand error messages and next steps
```

#### **Visual Design Validation**
```
Professional Appearance Assessment:
• Does it look like a serious business tool?
• Would an MSME owner feel proud to use this?
• Is the visual hierarchy clear and logical?
• Are colors appropriate for business context?

Accessibility Validation:
• Text readable at arm's length (factory use)
• High enough contrast (4.5:1 minimum)
• Touch targets ≥44px (gloved hands)
• Clear visual feedback for all actions

Cultural Appropriateness:
• Appropriate for Indian business context
• Respectful of MSME business culture
• Language/terminology familiar to users
• Visual metaphors culturally relevant
```

### Live Demo Execution Guide

#### **Demo Environment Setup**
```
Device Preparation:
• Android tablet (8-10 inch) for visibility
• Fully charged battery (100%)
• Stable WiFi connection
• Demo data pre-loaded
• WhatsApp installed and logged in
• Camera permissions enabled

Demo Data Scenarios:
• Realistic company names (Suresh Textiles, etc.)
• Believable financial amounts (₹50K-₹2L range)
• Current dates and logical timeline
• Material shortages that make sense
• Photos ready for upload simulation
```

#### **"Boss, I Need This!" Demo Script**
```
🎬 OPENING (30 seconds):
"This is your complete business in one view. Everything you need to run 
your textile business - from customer inquiry to final delivery."

[Show Home Dashboard]
"See your revenue, pending payments, production status - all in 10 seconds."

🚀 PROBLEM SOLVING (60 seconds):
[Point to alert] "Your system knows exactly what's blocking your orders."
[Tap alert] "2 orders stopped because of cotton yarn shortage."
[Tap Create PR] "One tap creates purchase request with your vendor details."
[Show WhatsApp share] "Send it to supplier directly through WhatsApp."

"Problem identified and solved in 30 seconds. No phone calls, no confusion."

💰 PAYMENT MAGIC (90 seconds):
[Go to Sales → Proforma] "Customer sends payment screenshot."
[Record payment] "Upload the photo, enter amount."
[Show automation] "Watch the magic - customer profile created automatically!"

"This normally takes 30 minutes of data entry. Now it's done in 1 minute."

🏭 PRODUCTION CONTROL (60 seconds):
[Go to Production] "Your workers see exactly what to do today."
[Show work order] "Simple start/stop buttons. No confusion."
[Update progress] "Real-time updates. You always know what's happening."

👥 CUSTOMER INTELLIGENCE (30 seconds):
[Go to Customers] "Complete view of every customer relationship."
[Show 360° view] "Order history, payment behavior, business insights."
[Show reorder] "One tap to repeat previous orders."

🎯 CLOSING (30 seconds):
"Your business coach in your pocket. Every problem has a solution. 
Every customer becomes repeat business. What do you think?"
```

#### **Expected Positive Reactions**
```
Immediate Interest Indicators:
• "How much does this cost?"
• "When can I start using it?"
• "Does it work with my type of products?"
• "Can my workers learn this easily?"
• "Do you provide training?"

Business Value Recognition:
• "This will save me so much time!"
• "I always forget to follow up - this will help"
• "My customers will think I'm very professional"
• "I can finally see my complete business"

Technical Comfort:
• "This looks like WhatsApp - easy!"
• "The voice feature will help my workers"
• "Taking photos for proof is smart"
• "Works offline - good for my factory"
```

### Success Metrics & KPIs

#### **Demo Success Indicators**
```
Engagement Metrics:
• Attention span: >3 minutes focused viewing
• Questions asked: >3 relevant questions
• Feature requests: Specific needs mentioned
• Timeline interest: Asks about implementation

Conversion Indicators:
• Price discussion initiated
• Trial signup interest expressed
• Contact information willingly shared
• Follow-up meeting scheduled

Feedback Quality:
• Specific feature appreciation
• Business problem connection made
• Competitive advantage recognized
• User role assignment discussed
```

#### **Design Iteration Framework**
```
Post-Demo Analysis:
• Which features generated most interest?
• What caused confusion or hesitation?
• Which parts of demo dragged attention?
• What questions came up repeatedly?

Design Refinement Priorities:
1. Address common confusion points
2. Enhance most-appreciated features
3. Simplify complex interactions
4. Add missing expected functionality

Validation Criteria for Next Version:
• 90%+ task completion rate
• <5 seconds average task start time
• Zero critical errors in user testing
• "Professional and trustworthy" rating >4/5
```

---

## Visual Design Implementation Checklist

### Design System Implementation
- [ ] **Color Palette**
  - [ ] Primary colors defined and implemented
  - [ ] Status colors consistent across all modules
  - [ ] Accessibility compliance (WCAG AA)
  - [ ] Dark/light mode considerations

- [ ] **Typography**
  - [ ] Font hierarchy implemented
  - [ ] Readable sizes for factory environments
  - [ ] Consistent weight and spacing
  - [ ] Multi-language support ready

- [ ] **Component Library**
  - [ ] Button variants and states
  - [ ] Card designs and interactions
  - [ ] Form input styles
  - [ ] Navigation components
  - [ ] Modal and overlay patterns

### **MOBILE UX PRINCIPLES FOR NON-TECH USERS**

**Target Demographics**: Gujarat textile manufacturers, 35-55 years, basic smartphone usage

**Core Principles:**
1. **Explicit > Clever**: Clear text labels instead of abstract symbols
2. **Consistent > Contextual**: Same behavior patterns throughout app  
3. **Large > Small**: 44px minimum touch targets for factory environment
4. **Simple > Feature-Rich**: Essential functionality prominently displayed
5. **Predictable > Surprising**: No hidden functionality or changing contexts

**Applied Decisions:**
- ✅ Bottom CTA with clear text instead of contextual FAB
- ✅ Universal search instead of multiple search systems
- ✅ Business filters instead of complex search interfaces  
- ✅ 140px card height for optimal content display and touch interaction
- ✅ Professional B2B design building trust with MSME manufacturers

**Voice Integration:**
- Single universal voice search system
- Voice commands maintain same simplicity principles
- Clear feedback and confirmation for voice actions

**Design Philosophy:**
- **WhatsApp-Level Simplicity**: Interface familiarity for existing smartphone users
- **Factory-Ready**: Glove-friendly buttons, high contrast, large text
- **Business Context**: Actions match real textile manufacturing workflows
- **Trust Building**: Professional appearance appropriate for B2B transactions

---

### Mobile Design Implementation
- [ ] **Core Navigation**
  - [ ] 5-tab bottom navigation
  - [ ] Contextual CTA implementation (Bottom CTA with clear text)
  - [ ] Universal search with voice (single system)
  - [ ] Breadcrumb navigation

- [ ] **Screen Implementations**
  - [ ] Home dashboard with all sections
  - [ ] Sales module (4 main tabs with 2-filter dropdowns)
  - [ ] Production module with operator view
  - [ ] Procurement workflow screens
  - [ ] Customer 360° implementation

### Desktop Design Implementation
- [ ] **Layout Adaptation**
  - [ ] Sidebar navigation system
  - [ ] Multi-column layouts
  - [ ] Table views for list data
  - [ ] Split-view customer 360°
  - [ ] Dashboard grid layout

- [ ] **Enhanced Features**
  - [ ] Bulk operations interface
  - [ ] Advanced filtering options
  - [ ] Export functionality
  - [ ] Detailed reporting views

### Interaction Design
- [ ] **Touch Interactions**
  - [ ] 44px minimum touch targets
  - [ ] Clear button states and feedback
  - [ ] Gesture support where appropriate
  - [ ] Haptic feedback integration

- [ ] **Voice Interface**
  - [ ] Voice trigger implementation
  - [ ] Live transcription display
  - [ ] Command confirmation flow
  - [ ] Multi-language support

- [ ] **Photo Capture**
  - [ ] Camera interface design
  - [ ] Photo review and confirmation
  - [ ] Quality validation feedback
  - [ ] Batch photo handling

### Visual Feedback Systems
- [ ] **Status Indicators**
  - [ ] Sync status visualization
  - [ ] Progress bars and completion states
  - [ ] Loading and processing indicators
  - [ ] Error and success messaging

- [ ] **Business Intelligence**
  - [ ] KPI visualization design
  - [ ] Alert and notification systems
  - [ ] Trend visualization
  - [ ] Actionable insight presentation

---

## Conclusion

This **Complete Visual Design Specification** provides a comprehensive blueprint for creating ElevateBusiness 360° - a mobile-first platform that transforms MSME textile manufacturing through intuitive, professional, and culturally-appropriate interface design.

### Design Achievements

**User Experience Excellence:**
- **2-tap rule compliance** for all primary tasks
- **WhatsApp-level simplicity** with professional appearance  
- **Factory-optimized visibility** with high contrast and large touch targets
- **Voice-first accessibility** for multilingual factory environments

**Business Value Integration:**
- **360° business visibility** through intelligent dashboard design
- **Automated workflow visualization** that guides users naturally
- **Professional trust-building** through consistent visual hierarchy
- **Cultural sensitivity** appropriate for Gujarat MSME context

**Technical Design Foundation:**
- **Responsive design system** spanning mobile to desktop
- **Component-based architecture** for consistent implementation
- **Accessibility compliance** meeting WCAG AA standards
- **Scalable visual patterns** ready for future expansion

### Ready for Implementation

This specification provides:
- **Complete screen layouts** with precise measurements
- **Interaction patterns** with detailed state definitions
- **Visual design system** with exact color codes and typography
- **User flow documentation** covering all business processes
- **Demo guidelines** for market validation

### Next Steps

1. **Design System Setup**: Implement the color palette, typography, and component library
2. **Mobile Screens Development**: Build each screen following the ASCII wireframe specifications
3. **Desktop Adaptation**: Create responsive layouts using the desktop design patterns
4. **User Testing**: Validate designs with real MSME owners using the demo script
5. **Iteration**: Refine based on feedback using the validation framework

This design specification ensures that ElevateBusiness 360° will truly make MSME owners say **"Boss, I need this!"** - delivering professional business management tools through an interface that respects their culture, workflow, and aspirations.

---

*End of Complete Visual Design Specification*

**Document Version**: 1.0  
**Total Screens Documented**: 45+ mobile screens, 15+ desktop layouts  
**Design Components**: 25+ reusable components  
**Status**: Implementation Ready ✅