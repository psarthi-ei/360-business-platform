# COMPONENT DESIGN PATTERNS
## Comprehensive Implementation Guide for Business Components

**Last Updated:** October 20, 2025  
**Version:** 1.0 - Complete Implementation Reference  
**Project:** ElevateBusiness 360° by ElevateIdea Technologies  

---

## 📑 **TABLE OF CONTENTS**

1. [**Document Purpose & Usage**](#📋-document-purpose--usage)
2. [**Card Component Template System**](#🃏-card-component-template-system)
3. [**Design System Token Reference**](#🎨-design-system-token-reference)
4. [**Parent Container Integration Patterns**](#🔗-parent-container-integration-patterns)
5. [**Action Button Patterns**](#🔘-action-button-patterns)
6. [**Common Pitfalls & Solutions**](#⚠️-common-pitfalls--solutions)
7. [**Validation Checklist**](#✅-validation-checklist)
8. [**Complete Implementation Examples**](#💡-complete-implementation-examples)

---

## 📋 **DOCUMENT PURPOSE & USAGE**

### **Purpose**
This document provides **complete implementation details** for building consistent business components in the ElevateBusiness 360° platform. Every pattern, CSS variable, and code structure documented here has been tested and validated through real component development.

### **When to Use This Document**
- **Before starting any new business component**
- **When encountering styling inconsistencies**
- **During component review and validation**
- **For troubleshooting common integration issues**

### **What This Document Prevents**
- Undefined CSS variable usage (like `--ds-primary`)
- Inconsistent More/Less button implementations
- Scroll behavior integration failures
- Action button placement variations
- Design system token misuse

---

## 🃏 **CARD COMPONENT TEMPLATE SYSTEM**

### **140px Fixed Height Card Template**

**MANDATORY Pattern:** All business component cards MUST use this exact structure.

#### **Complete JSX Structure**
```tsx
// ✅ CORRECT: Card container with data attribute
<div key={item.id} className={styles.cardContainer} data-item-id={item.id}>
  {/* Clickable Card Summary - 140px Template */}
  <div 
    className={`${styles.card} ${styles[statusInfo.className]} ${isExpanded(item.id) ? styles.expanded : ''}`}
    onClick={() => toggleDetails(item.id)}
  >
    {/* Template Header */}
    <div 
      className={styles.cardHeader}
      title={`${item.title} (ID: ${item.id})`}
    >
      {item.displayTitle}
    </div>
    
    {/* Template Status */}
    <div className={styles.cardStatus}>
      {statusInfo.icon} {statusInfo.label} • {item.priority}
    </div>
    
    {/* Template Meta - 2 lines maximum */}
    <div 
      className={styles.cardMeta}
      title={`${item.description} • ${item.value}`}
    >
      {item.line1}<br />
      {item.line2}
    </div>

    {/* Expand Indicator */}
    <div className={styles.expandIndicator}>
      {isExpanded(item.id) ? 'Less' : 'More'}
    </div>
  </div>

  {/* Progressive Disclosure - Detailed Information */}
  {isExpanded(item.id) && (
    <div className="ds-expanded-details">
      <div className="ds-details-content">
        {/* Detailed content here */}
      </div>
      
      {/* Action Buttons - Only visible when expanded */}
      <div className={styles.cardActions}>
        <div className={styles.actionButtons}>
          {/* Status-based conditional buttons */}
        </div>
      </div>
    </div>
  )}
</div>
```

#### **Complete CSS Module Structure**
```css
/* ===== CARD CONTAINER SYSTEM ===== */
.cardContainer {
  margin-bottom: 12px;              /* Visual Design Spec exact */
}

/* ===== 140px FIXED HEIGHT CARD ===== */
.card {
  height: 140px;                    /* Template fixed height - NEVER change */
  padding: 16px;                    /* Symmetric padding for professional look */
  background: white;
  border-radius: var(--ds-radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--ds-border-primary);
  border-left: 4px solid;           /* Status color applied by status classes */
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card.expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  z-index: 1;                       /* Ensure card stays above others */
}

/* ===== TEMPLATE CONTENT CLASSES ===== */
.cardHeader {
  font-size: 20px;                 /* Visual Design Spec exact */
  font-weight: 600;
  color: var(--ds-text-primary);   /* CORRECT variable usage */
  margin: 0 0 6px 0;               /* Optimized margin to prevent overlap */
  line-height: 1.2;                /* Tighter line height for single line */
  overflow: hidden;
  white-space: nowrap;              /* Force single line */
  text-overflow: ellipsis;          /* Clean truncation with ... */
  flex-shrink: 0;                  /* Prevent header compression */
  height: 24px;                    /* Fixed height for consistency */
}

.cardStatus {
  font-size: 16px;                 /* Visual Design Spec exact */
  font-weight: 500;
  margin: 0 0 6px 0;               /* Optimized margin to prevent overlap */
  color: var(--ds-text-secondary);
  line-height: 1.3;
  flex-shrink: 0;                  /* Prevent status compression */
  height: 21px;                    /* Fixed height for consistency */
  display: flex;
  gap: 8px;
  align-items: center;
}

.cardMeta {
  font-size: 14px;                 /* Visual Design Spec exact */
  color: var(--ds-text-tertiary);  /* CORRECT variable usage */
  margin: 2px 0 8px 0;             /* Reduced margins to prevent header overlap */
  line-height: 1.2;                /* Tighter line height for 2-line content */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;           /* Exactly 2 lines with ellipsis */
  -webkit-box-orient: vertical;
  flex-shrink: 0;                  /* Prevent compression affecting header */
  max-height: 34px;                /* Enforce exact height for 2 lines */
}

.expandIndicator {
  font-size: 12px;
  color: var(--color-primary);     /* ✅ CORRECT: Use --color-primary NOT --ds-primary */
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.2s ease;
  position: absolute;
  bottom: 8px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.card:hover .expandIndicator {
  opacity: 1;
  background: rgba(29, 78, 216, 0.15);
  color: var(--color-primary);     /* ✅ CORRECT: Use --color-primary NOT --ds-primary */
}

/* ===== STATUS COLOR SYSTEM ===== */
.card.pending {
  border-left-color: var(--ds-status-pending);    /* Amber - #FBBF24 */
}

.card.approved {
  border-left-color: var(--ds-status-active);     /* Green - #16A34A */
}

.card.rejected {
  border-left-color: var(--ds-status-inactive);   /* Gray - #6B7280 */
}

/* ===== ACTION BUTTONS SYSTEM ===== */
.cardActions {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
  margin-top: clamp(12px, 3vw, 16px);
}

.actionButtons {
  display: flex;
  gap: var(--ds-space-sm);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--ds-space-md);
}
```

---

## 🎨 **DESIGN SYSTEM TOKEN REFERENCE**

### **CSS Variable Mappings - CRITICAL CORRECTIONS**

#### **❌ WRONG Variables (Cause Black/Default Colors)**
```css
/* ❌ THESE DON'T EXIST - WILL SHOW BLACK */
color: var(--ds-primary);           /* UNDEFINED - causes black color */
border: var(--primary-color);       /* UNDEFINED - causes black border */
background: var(--ds-bg);           /* UNDEFINED - causes default background */
```

#### **✅ CORRECT Variables (Proper Design System)**
```css
/* ✅ PRIMARY COLORS */
color: var(--color-primary);        /* #1D4ED8 - Primary blue */
background: var(--ds-btn-primary);  /* #1D4ED8 - Button primary */

/* ✅ TEXT COLORS */
color: var(--ds-text-primary);      /* #2d3748 - Primary text */
color: var(--ds-text-secondary);    /* Secondary text */
color: var(--ds-text-tertiary);     /* Tertiary text */
color: var(--ds-text-critical);     /* Critical/error text */

/* ✅ STATUS COLORS */
border-left-color: var(--ds-status-pending);    /* #FBBF24 - Amber */
border-left-color: var(--ds-status-active);     /* #16A34A - Green */
border-left-color: var(--ds-status-inactive);   /* #6B7280 - Gray */

/* ✅ BACKGROUND COLORS */
background: var(--ds-bg-primary);   /* Primary background gradient */
background: var(--ds-bg-secondary); /* Secondary background */

/* ✅ BORDER COLORS */
border: 1px solid var(--ds-border-primary);     /* Primary border */
border: 1px solid var(--ds-border-secondary);   /* Secondary border */

/* ✅ SPACING SYSTEM */
padding: var(--ds-padding-screen);  /* Screen-level padding (responsive) */
margin: var(--ds-space-xs);         /* Extra small space */
margin: var(--ds-space-sm);         /* Small space */
margin: var(--ds-space-md);         /* Medium space */
margin: var(--ds-space-lg);         /* Large space */
margin: var(--ds-space-xl);         /* Extra large space */

/* ✅ TYPOGRAPHY SYSTEM */
font-size: var(--font-xs);          /* Extra small font */
font-size: var(--font-sm);          /* Small font */
font-size: var(--font-base);        /* Base font */
font-size: var(--font-lg);          /* Large font */
font-size: var(--font-xl);          /* Extra large font */
```

### **Complete Token Reference Table**

| **Category** | **Correct Variable** | **Value** | **Usage** |
|--------------|---------------------|-----------|-----------|
| **Primary** | `--color-primary` | `#1D4ED8` | Main brand color, links, expand buttons |
| **Button Primary** | `--ds-btn-primary` | `#1D4ED8` | Primary action buttons |
| **Button Hover** | `--ds-btn-primary-hover` | `#1E40AF` | Primary button hover state |
| **Status Pending** | `--ds-status-pending` | `#FBBF24` | Pending/in-progress items |
| **Status Active** | `--ds-status-active` | `#16A34A` | Approved/active items |
| **Status Inactive** | `--ds-status-inactive` | `#6B7280` | Rejected/cancelled items |
| **Text Primary** | `--ds-text-primary` | `#2d3748` | Main text content |
| **Text Secondary** | `--ds-text-secondary` | Lighter | Secondary text |
| **Text Critical** | `--ds-text-critical` | Red | Error/critical messages |
| **Screen Padding** | `--ds-padding-screen` | Responsive | Main screen padding |

---

## 🔗 **PARENT CONTAINER INTEGRATION PATTERNS**

### **Tab-Based Container Scroll Behavior**

**PATTERN:** Business components (Sales, Procurement) use intelligent scroll detection.

#### **Parent Container Implementation**
```tsx
// In parent container (Sales.tsx, Procurement.tsx)
const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);

// Intelligent scroll calculation
const calculateScrollBehavior = useCallback(() => {
  // For PR and MR tabs, force scroll to be enabled since they have content
  if (activeTab === 'prs' || activeTab === 'mr') {
    setShouldShowScrollbar(true);
    return;
  }
  
  // For other tabs, calculate based on content
  const filteredCount = getFilteredCount();
  const cardHeight = 140;
  const cardSpacing = 16;
  const containerPadding = 32;
  
  const totalContentHeight = filteredCount > 0 
    ? (filteredCount * cardHeight) + ((filteredCount - 1) * cardSpacing) + containerPadding
    : 200;
  
  const tabHeight = 48;
  const filterHeight = 44;  
  const ctaHeight = 56;
  const availableHeight = window.innerHeight - tabHeight - filterHeight - ctaHeight;
  
  const needsScroll = totalContentHeight > availableHeight;
  setShouldShowScrollbar(needsScroll);
}, [activeTab, getFilteredCount]);

// Apply scroll behavior to content area
<div className={`${styles.contentArea} ${shouldShowScrollbar ? styles.scrollable : ''}`}>
  {renderTabContent()}
</div>
```

#### **Parent Container CSS**
```css
/* Content Area - Intelligent Scroll Behavior */
.contentArea {
  overflow: hidden; /* Default: no scrollbars for minimal content */
  background: var(--ds-bg-primary);
  grid-row: 3;
  transition: all 0.2s ease; /* Smooth transition when scroll behavior changes */
}

/* Applied dynamically when scrolling is needed */
.contentArea.scrollable {
  overflow-y: auto;
}
```

### **Child Component Integration Requirements**

#### **Child Component Screen Wrapper**
```css
/* ✅ CORRECT: Child component screen styling */
.componentScreen {
  /* Remove min-height to work with platform scrolling */
  padding: var(--ds-padding-screen);
  text-align: left !important;
  background: var(--ds-bg-primary);
  color: var(--ds-text-primary);
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0;
}

/* ✅ CORRECT: Page content wrapper */
.pageContent {
  /* Let content determine height for scrolling */
  padding: 0;
}

/* ✅ CORRECT: Items container */
.itemsContainer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}
```

#### **❌ WRONG: What NOT to Do**
```css
/* ❌ BREAKS PLATFORM SCROLLING */
.componentScreen {
  min-height: 100vh;    /* Prevents overflow detection */
  height: 100%;         /* Conflicts with parent scroll */
  overflow-y: auto;     /* Duplicate scroll handling */
}
```

### **Filter State Integration**

#### **Filter Props Pattern**
```tsx
interface ComponentProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

// Usage in child component
const filteredItems = useMemo(() => {
  if (filterState === 'all') return mockItems;
  return mockItems.filter(item => item.status === filterState);
}, [filterState]);
```

---

## 🔘 **ACTION BUTTON PATTERNS**

### **Status-Based Conditional Rendering**

#### **Internal Workflow Actions (Purchase Requests Pattern)**
```tsx
{/* Internal Workflow Actions - Only visible when expanded */}
<div className={styles.cardActions}>
  <div className={styles.actionButtons}>
    {item.status === 'pending' && (
      <>
        <button className="ds-btn ds-btn-primary" onClick={() => handleAction('approve', item.id)}>
          ✅ Approve
        </button>
        <button className="ds-btn ds-btn-secondary" onClick={() => handleAction('reject', item.id)}>
          ❌ Reject
        </button>
        <button className="ds-btn ds-btn-secondary" onClick={() => handleAction('edit', item.id)}>
          📝 Edit
        </button>
      </>
    )}
    {item.status === 'approved' && (
      <button className="ds-btn ds-btn-primary" onClick={() => handleAction('create-po', item.id)}>
        📋 Create PO
      </button>
    )}
    {item.status === 'rejected' && (
      <>
        <button className="ds-btn ds-btn-primary" onClick={() => handleAction('revise', item.id)}>
          🔄 Revise
        </button>
        <button className="ds-btn ds-btn-secondary" onClick={() => handleAction('resubmit', item.id)}>
          📤 Resubmit
        </button>
      </>
    )}
  </div>
</div>
```

#### **External Customer Actions (Sales Orders Pattern)**
```tsx
{/* External Customer Actions */}
<div className={styles.actionButtons}>
  <button className="ds-btn ds-btn-primary">📞 Call</button>
  <button className="ds-btn ds-btn-primary">📱 WhatsApp</button>
  <button className="ds-btn ds-btn-secondary">📄 View PDF</button>
  
  {/* Status-specific actions */}
  {order.status === 'order_confirmed' && (
    <button className="ds-btn ds-btn-secondary">🏭 Ready for Production</button>
  )}
</div>
```

### **Action Button Guidelines**

#### **✅ DO: Proper Action Patterns**
- **Pending Status**: Essential workflow actions (Approve, Reject, Edit)
- **Approved Status**: Next step actions (Create PO, Generate Invoice)
- **Rejected Status**: Recovery actions (Revise, Resubmit)
- **Completed Status**: Final actions (View Details, Download)

#### **❌ DON'T: Redundant Actions**
- **"View Details"** when expanded view shows all details
- **"Review"** when all information is already visible
- **Duplicate actions** across different statuses
- **Too many buttons** - keep to 2-4 maximum per status

---

## ⚠️ **COMMON PITFALLS & SOLUTIONS**

### **Issue 1: Undefined CSS Variables**

#### **Problem**
```css
/* ❌ CAUSES BLACK COLOR */
.expandIndicator {
  color: var(--ds-primary);  /* This variable doesn't exist */
}
```

#### **Symptoms**
- "More" buttons appear black instead of blue
- Hover effects don't work properly
- Inconsistent colors across components

#### **Solution**
```css
/* ✅ CORRECT VARIABLE */
.expandIndicator {
  color: var(--color-primary);  /* This exists and equals #1D4ED8 */
}
```

#### **How to Verify**
```bash
# Search for undefined variable usage
grep -r "var(--ds-primary)" src/components/
# Should return no results after fix
```

### **Issue 2: Scroll Bar Not Appearing**

#### **Problem**
```css
/* ❌ BREAKS SCROLL DETECTION */
.componentScreen {
  min-height: 100vh;  /* Prevents overflow */
  height: 100%;       /* Conflicts with parent */
}
```

#### **Symptoms**
- No scroll bar when content exceeds viewport
- Content gets cut off
- Platform scroll system doesn't activate

#### **Solution**
```css
/* ✅ PROPER INTEGRATION */
.componentScreen {
  /* Remove height constraints */
  padding: var(--ds-padding-screen);
  /* Let parent handle scrolling */
}
```

#### **Parent Container Fix**
```tsx
// ✅ FORCE SCROLL FOR CONTENT-HEAVY TABS
const calculateScrollBehavior = useCallback(() => {
  if (activeTab === 'prs' || activeTab === 'mr') {
    setShouldShowScrollbar(true);  // Always enable scroll
    return;
  }
  // ... rest of calculation
}, [activeTab]);
```

### **Issue 3: Inconsistent More/Less Button Styling**

#### **Problem**
Mixed usage of design system buttons vs custom CSS.

#### **Symptoms**
- Different button styles across components
- Inconsistent hover effects
- Non-standard positioning

#### **Solution - Use Consistent Custom CSS (NOT Design System Buttons)**
```css
/* ✅ STANDARD EXPAND INDICATOR PATTERN */
.expandIndicator {
  font-size: 12px;
  color: var(--color-primary);     /* Correct variable */
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.2s ease;
  position: absolute;
  bottom: 8px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.card:hover .expandIndicator {
  opacity: 1;
  background: rgba(29, 78, 216, 0.15);
  color: var(--color-primary);
}
```

#### **JSX Structure**
```tsx
{/* ✅ CORRECT: Div with CSS styling */}
<div className={styles.expandIndicator}>
  {isExpanded(item.id) ? 'Less' : 'More'}
</div>

{/* ❌ WRONG: Design system button */}
<button className="ds-btn ds-btn-more">
  {isExpanded(item.id) ? 'Less' : 'More'}
</button>
```

### **Issue 4: Action Button Redundancy**

#### **Problem**
Including "View Details" or "Review" buttons when expanded view shows all information.

#### **Solution**
```tsx
{/* ✅ ONLY ACTIONABLE BUTTONS */}
{item.status === 'approved' && (
  <button className="ds-btn ds-btn-primary">📋 Create PO</button>
  // No "View Details" - everything is already visible
)}
```

### **Issue 5: Wrong Status Colors**

#### **Problem**
Using wrong variables or colors for status indication.

#### **Solution - Status Color Reference**
```css
/* ✅ CORRECT STATUS MAPPING */
.card.pending {
  border-left-color: var(--ds-status-pending);    /* #FBBF24 - Amber */
}
.card.approved {
  border-left-color: var(--ds-status-active);     /* #16A34A - Green */
}
.card.rejected {
  border-left-color: var(--ds-status-inactive);   /* #6B7280 - Gray */
}
```

---

## ✅ **VALIDATION CHECKLIST**

### **Pre-Development Checklist**
- [ ] Read this document completely
- [ ] Understand parent container integration requirements
- [ ] Review existing similar components for patterns
- [ ] Plan action button requirements by status

### **During Development Checklist**

#### **CSS Variables**
- [ ] No usage of undefined variables (especially `--ds-primary`)
- [ ] Using `--color-primary` for primary color needs
- [ ] Using correct `--ds-status-*` for status colors
- [ ] Using `--ds-text-*` for text colors
- [ ] Using `--ds-space-*` for spacing

#### **Card Structure**
- [ ] 140px fixed height maintained
- [ ] cardHeader, cardStatus, cardMeta structure followed
- [ ] expandIndicator positioned correctly
- [ ] Progressive disclosure implemented properly

#### **Parent Integration**
- [ ] No `min-height: 100vh` on component screen
- [ ] No `height: 100%` on page content wrapper
- [ ] Proper integration with parent scroll system
- [ ] Filter state props implemented correctly

#### **Action Buttons**
- [ ] Only actionable buttons included
- [ ] No redundant "View Details" buttons
- [ ] Status-based conditional rendering
- [ ] Proper design system button classes

### **Post-Development Validation**

#### **Visual Tests**
- [ ] More/Less button shows in blue, not black
- [ ] Hover effects work on expand indicator
- [ ] Status colors match specification (amber/green/gray)
- [ ] Cards maintain 140px height consistently

#### **Functional Tests**
- [ ] Scroll bar appears when content exceeds viewport
- [ ] Card expansion/collapse works smoothly
- [ ] Action buttons appear only when expanded
- [ ] Filter changes update content correctly

#### **Browser Tests**
- [ ] Chrome: All features work
- [ ] Safari: All features work
- [ ] Mobile: Touch interactions work
- [ ] Responsive: Layout adapts properly

#### **Code Quality Checks**
```bash
# Verify no undefined CSS variables
grep -r "var(--ds-primary)" src/components/
# Should return: no results

# Verify proper variable usage
grep -r "var(--color-primary)" src/components/
# Should return: multiple correct usages

# Check compilation
npm run build
# Should complete without errors
```

---

## 💡 **COMPLETE IMPLEMENTATION EXAMPLES**

### **Purchase Requests - Complete Working Example**

#### **PurchaseRequests.tsx (Essential Parts)**
```tsx
import React, { useMemo } from 'react';
import { mockPurchaseRequests } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './PurchaseRequests.module.css';

interface PurchaseRequestsProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PurchaseRequests = ({ filterState, onFilterChange }: PurchaseRequestsProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  const filteredPRs = useMemo(() => {
    if (filterState === 'all') return mockPurchaseRequests;
    return mockPurchaseRequests.filter(pr => pr.status === filterState);
  }, [filterState]);
  
  const toggleDetails = (prId: string) => {
    toggleExpansion(prId, 'data-pr-id');
  };
  
  const handlePRAction = (action: string, prId: string) => {
    alert(`${action} action for PR ${prId} - Mock functionality`);
  };
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', label: 'Pending', className: 'pending' };
      case 'approved':
        return { icon: '✅', label: 'Approved', className: 'approved' };
      case 'rejected':
        return { icon: '❌', label: 'Rejected', className: 'rejected' };
      default:
        return { icon: '📋', label: 'Unknown', className: 'default' };
    }
  };

  const pendingCount = filteredPRs.filter(pr => pr.status === 'pending').length;

  return (
    <div className={styles.purchaseRequestsScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when pending approvals exist */}
        {pendingCount > 0 && (
          <div className={styles.alertHeader}>
            ⚠️ {pendingCount} PENDING APPROVALS
          </div>
        )}

        <div className={styles.prContainer}>
          {filteredPRs.map(pr => {
            const statusInfo = getStatusInfo(pr.status);
            const priority = pr.justification.toLowerCase().includes('critical') ? 'urgent' : 'normal';

            return (
              <div key={pr.id} className={styles.prCardContainer} data-pr-id={pr.id}>
                <div 
                  className={`${styles.prCard} ${styles[statusInfo.className]} ${isExpanded(pr.id) ? styles.expanded : ''}`}
                  onClick={() => toggleDetails(pr.id)}
                >
                  <div className={styles.cardHeader} title={`${pr.materialName} (PR ID: ${pr.id})`}>
                    PR#{pr.id.replace('PR-', '').replace('2024-', '')}
                  </div>
                  
                  <div className={styles.cardStatus}>
                    {statusInfo.icon} {statusInfo.label} • {priority === 'urgent' ? '🔥 Urgent' : '📅 Normal'}
                  </div>
                  
                  <div className={styles.cardMeta} title={`${pr.materialName} (${pr.quantity} ${pr.unit}) • Est. Value: ₹${pr.estimatedCost.toLocaleString()}`}>
                    {pr.materialName} ({pr.quantity} {pr.unit})<br />
                    Est. Value: ₹{pr.estimatedCost.toLocaleString()}
                  </div>

                  <div className={styles.expandIndicator}>
                    {isExpanded(pr.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {isExpanded(pr.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <p><strong>Department:</strong> {pr.department} - {pr.requestedBy}</p>
                      <p><strong>Request Date:</strong> {pr.requestDate} | <strong>Priority:</strong> {priority === 'urgent' ? '🔥 Urgent' : '📅 Normal'}</p>
                      <p><strong>Material:</strong> {pr.materialName} ({pr.quantity} {pr.unit})</p>
                      <p><strong>Estimated Cost:</strong> ₹{pr.estimatedCost.toLocaleString()}</p>
                      <p><strong>Justification:</strong> {pr.justification}</p>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {pr.status === 'pending' && (
                          <>
                            <button className="ds-btn ds-btn-primary" onClick={() => handlePRAction('approve', pr.id)}>✅ Approve</button>
                            <button className="ds-btn ds-btn-secondary" onClick={() => handlePRAction('reject', pr.id)}>❌ Reject</button>
                            <button className="ds-btn ds-btn-secondary" onClick={() => handlePRAction('edit', pr.id)}>📝 Edit</button>
                          </>
                        )}
                        {pr.status === 'approved' && (
                          <button className="ds-btn ds-btn-primary" onClick={() => handlePRAction('create-po', pr.id)}>📋 Create PO</button>
                        )}
                        {pr.status === 'rejected' && (
                          <>
                            <button className="ds-btn ds-btn-primary" onClick={() => handlePRAction('revise', pr.id)}>🔄 Revise</button>
                            <button className="ds-btn ds-btn-secondary" onClick={() => handlePRAction('resubmit', pr.id)}>📤 Resubmit</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;
```

#### **PurchaseRequests.module.css (Complete)**
```css
/* Purchase Requests Screen Styles - Platform Scroll Compatible */
.purchaseRequestsScreen {
  /* Remove min-height to work with platform scrolling */
  padding: var(--ds-padding-screen);
  text-align: left !important;
  background: var(--ds-bg-primary);
  color: var(--ds-text-primary);
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0;
}

/* pageContent wrapper - let content determine height for scrolling */
.pageContent {
  padding: 0;
}

.prContainer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 10px;
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

/* Alert Header System - 48px height */
.alertHeader {
  height: var(--ds-touch-target-comfortable);
  background: var(--ds-text-critical);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 var(--ds-space-md);
  font-family: var(--font-family);
  font-size: var(--font-base);
  font-weight: 500;
  letter-spacing: 0.02em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: var(--ds-space-md);
}

/* ===== TEMPLATE CARD SYSTEM - 140px Fixed Height ===== */
.prCardContainer {
  margin-bottom: 12px;              /* Visual Design Spec exact */
}

.prCard {
  height: 140px;                    /* Template fixed height */
  padding: 16px;                    /* Symmetric padding for professional look */
  background: white;
  border-radius: var(--ds-radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--ds-border-primary);
  border-left: 4px solid;           /* Status color applied by PR status classes */
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.prCard:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.prCard.expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  z-index: 1;                           /* Ensure card stays above others */
}

/* ===== TEMPLATE CONTENT CLASSES ===== */
.cardHeader {
  font-size: 20px;                 /* Visual Design Spec exact */
  font-weight: 600;
  color: var(--ds-text-primary);   /* Visual Design Spec exact */
  margin: 0 0 6px 0;               /* Optimized margin to prevent overlap */
  line-height: 1.2;                /* Tighter line height for single line */
  overflow: hidden;
  white-space: nowrap;              /* Force single line */
  text-overflow: ellipsis;          /* Clean truncation with ... */
  flex-shrink: 0;                  /* Prevent header compression */
  height: 24px;                    /* Fixed height for consistency */
}

.cardStatus {
  font-size: 16px;                 /* Visual Design Spec exact */
  font-weight: 500;
  margin: 0 0 6px 0;               /* Optimized margin to prevent overlap */
  color: var(--ds-text-secondary);
  line-height: 1.3;
  flex-shrink: 0;                  /* Prevent status compression */
  height: 21px;                    /* Fixed height for consistency */
  display: flex;
  gap: 8px;
  align-items: center;
}

.cardMeta {
  font-size: 14px;                 /* Visual Design Spec exact */
  color: var(--ds-text-tertiary);  /* Visual Design Spec exact */
  margin: 2px 0 8px 0;             /* Reduced margins to prevent header overlap */
  line-height: 1.2;                /* Tighter line height for 2-line content */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;           /* Exactly 2 lines with ellipsis */
  -webkit-box-orient: vertical;
  flex-shrink: 0;                  /* Prevent compression affecting header */
  max-height: 34px;                /* Enforce exact height for 2 lines */
}

.expandIndicator {
  font-size: 12px;
  color: var(--color-primary);     /* ✅ CORRECT: Use --color-primary NOT --ds-primary */
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.2s ease;
  position: absolute;
  bottom: 8px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.prCard:hover .expandIndicator {
  opacity: 1;
  background: rgba(29, 78, 216, 0.15);
  color: var(--color-primary);     /* ✅ CORRECT: Use --color-primary NOT --ds-primary */
}

/* PR Status Color System */
.prCard.pending {
  border-left-color: var(--ds-status-pending);
}

.prCard.approved {
  border-left-color: var(--ds-status-active);
}

.prCard.rejected {
  border-left-color: var(--ds-status-inactive);
}

/* Design System Contextual Actions */
.cardActions {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
  margin-top: clamp(12px, 3vw, 16px);
}

/* Single-row button layout with natural wrapping */
.actionButtons {
  display: flex;
  gap: var(--ds-space-sm);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--ds-space-md);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .purchaseRequestsScreen {
    /* Let Design System handle padding consistently */
  }
  
  .prContainer {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;     /* Remove padding on mobile */
    padding-right: 0;    /* Remove padding on mobile */
  }
}
```

### **Parent Container Integration Example**

#### **Procurement.tsx - Scroll Integration**
```tsx
// In Procurement.tsx (parent container)
const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);

const calculateScrollBehavior = useCallback(() => {
  // For PR and MR tabs, force scroll to be enabled since they have content
  if (activeTab === 'prs' || activeTab === 'mr') {
    setShouldShowScrollbar(true);
    return;
  }
  
  // For other tabs, use existing calculation...
}, [activeTab, getFilteredCount]);

useEffect(() => {
  calculateScrollBehavior();
  const handleResize = () => calculateScrollBehavior();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [calculateScrollBehavior]);

// Render content with scroll class
<div className={`${styles.procurementContent} ${shouldShowScrollbar ? styles.scrollable : ''}`}>
  {activeTab === 'prs' && (
    <PurchaseRequests
      filterState={prFilterState}
      onFilterChange={setPrFilterState}
    />
  )}
</div>
```

---

## 🎯 **SUMMARY**

This document provides **complete implementation details** for building consistent business components. Every pattern has been tested through real development and validated in production.

### **Key Takeaways**
1. **Always use correct CSS variables** - `--color-primary` NOT `--ds-primary`
2. **Follow 140px card template exactly** - maintains visual consistency
3. **Integrate properly with parent scroll systems** - avoid height conflicts
4. **Use status-based action buttons** - avoid redundant buttons
5. **Validate against checklist** - prevents common issues

### **Before Every Component Development**
1. Read this document completely
2. Review validation checklist
3. Study complete implementation examples
4. Test integration with parent containers

This document should prevent all the issues we encountered during Purchase Requests development and ensure consistent, high-quality components across the platform.