# 📐 DESIGN SYSTEM V2
## Complete Mobile-First Implementation Guide for ElevateBusiness 360°

**Document Version:** 2.0  
**Created:** October 3, 2025  
**Last Updated:** October 3, 2025  
**Project:** ElevateBusiness 360° by ElevateIdea Technologies  
**Based on:** LeadManagement Mobile UX V2 Success + Mobile V2 Implementation Insights

---

## 📑 **TABLE OF CONTENTS**

1. [**Foundation Philosophy**](#🎯-foundation-philosophy) - Mobile-first principles and approach
2. [**Global Standards**](#🌍-global-standards) - Colors, typography, spacing, touch targets
3. [**Component Architecture**](#🏗️-component-architecture) - Standard patterns and structures
4. [**Implementation Templates**](#📝-implementation-templates) - Copy-paste code patterns
5. [**Quality Assurance**](#✅-quality-assurance) - Verification checklists and gates
6. [**Responsive Strategy**](#📱💻-responsive-strategy) - Mobile vs desktop adaptation

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
**Primary Color Palette** (extracted from LeadManagement success):
```css
:root {
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

**CSS Structure:**
```css
.expandedDetails {
  background: var(--ds-bg-expanded);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  margin-bottom: var(--ds-space-lg);
  border: 1px solid var(--ds-border-primary);
  box-shadow: var(--ds-shadow-card);
}

.detailsContent p {
  margin: var(--ds-space-sm) 0;
  font-size: var(--font-sm);
  line-height: 1.4;
  color: var(--ds-text-primary);
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

### **Benefits**
✅ **Single Source of Truth**: All button styling in `/index.css`  
✅ **Zero Duplication**: Remove duplicate button definitions across components  
✅ **Global Consistency**: Change button colors/spacing everywhere at once  
✅ **Mobile Responsive**: Works perfectly on all devices using existing Design System V2  
✅ **Performance**: Smaller CSS bundle, better caching

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
**Next Steps:** Apply to QuotationOrders and remaining components  
**Reference Implementation:** LeadManagement Mobile UX V2