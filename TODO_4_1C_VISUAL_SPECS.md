# Sub-Phase 4.1C: Visual Design Specification Compliance

## 🎯 Cross-Verified with Visual Design Specification (Lines 466-497)
- ✅ **Tab Structure**: `[ Leads│Quotes│Orders│Inv ]` - MATCHES specification exactly
- ✅ **Card Height**: 120px template following Orders specification - CONFIRMED
- ✅ **Measurements**: 48px tabs, 44px filters, 56px CTA - CONFIRMED
- ✅ **Typography**: 20px header, 16px status, 14px meta - CONFIRMED

## 📱 Component-Contained Visual Design Implementation

### Card Layout Specification (Per Visual Design Spec):
```
┌─────────────────────────────────────┐ ←120px total height
│ Lead #L-001 — Suresh Textiles       │ ←20px header (font-size, 600 weight)
│ Status: 🔥 Hot Lead                 │ ←16px status (font-size, 500 weight)  
│ Cotton • ₹2.5L • 15 days            │ ←14px meta (font-size, normal weight)
│ [Call] [Quote] [WhatsApp]           │ ←32px actions (44px touch targets)
└─────────────────────────────────────┘ ←12px margin-bottom
```

### Visual Design Specification CSS Template:
```css
/* Component Self-Styling (LeadManagement.module.css, etc.) */
.leadCard, .quoteCard, .orderCard, .invoiceCard {
  height: 120px;                    /* Visual Design Spec exact */
  margin-bottom: 12px;              /* Visual Design Spec exact */
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Typography Hierarchy - Visual Design Spec Exact */
.cardHeader {
  font-size: 20px;                 /* Visual Design Spec exact */
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.cardStatus {
  font-size: 16px;                 /* Visual Design Spec exact */
  font-weight: 500;
  margin-bottom: 8px;
}

.cardMeta {
  font-size: 14px;                 /* Visual Design Spec exact */
  color: #6B7280;
  margin: 2px 0;
}

.cardActions {
  display: flex;
  gap: 8px;
  height: 32px;                    /* Visual Design Spec exact */
  margin-top: auto;
}
```

### Status Color Coding (Visual Design Spec):
```css
/* Lead Priority Colors */
.hotLead { border-left: 4px solid #EF4444; }     /* 🔥 Hot - Red */
.warmLead { border-left: 4px solid #F59E0B; }    /* 🔶 Warm - Amber */
.coldLead { border-left: 4px solid #3B82F6; }    /* 🔵 Cold - Blue */

/* Quote Status Colors */
.approved { border-left: 4px solid #10B981; }    /* ✅ Approved - Green */
.pending { border-left: 4px solid #F59E0B; }     /* ⏳ Pending - Amber */
.expired { border-left: 4px solid #EF4444; }     /* ❌ Expired - Red */

/* Order Status Colors */
.production { border-left: 4px solid #EAB308; }  /* 🟡 Production - Yellow */
.blocked { border-left: 4px solid #EF4444; }     /* ⚠️ Blocked - Red */
.delivered { border-left: 4px solid #10B981; }   /* ✅ Delivered - Green */

/* Invoice Status Colors */
.paid { border-left: 4px solid #10B981; }        /* 💰 Paid - Green */
.overdue { border-left: 4px solid #EF4444; }     /* 🔴 Overdue - Red */
```

## 🏗️ Implementation Plan:
1. **Remove Global Overrides** (2 min): Delete `:global()` CSS from Sales.module.css
2. **Component Self-Styling** (5 min): Apply 120px template to each component's .module.css
3. **Header Cleanup** (1 min): Remove duplicate headers since Sales.tsx provides navigation

## 📋 Tab-Specific Card Content:
- **Leads Tab**: Only LeadManagement.tsx cards with lead-specific actions
- **Quotes Tab**: Only QuotationOrders.tsx cards with quote-specific actions  
- **Orders Tab**: Only SalesOrders.tsx cards with order-specific actions
- **Invoices Tab**: Only Invoices.tsx cards with invoice-specific actions

## Architecture: Component Self-Contained Styling
Each component owns its complete visual appearance - no global CSS pollution.