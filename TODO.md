# ElevateBusiness 360° - Customer Module Implementation Plan

*This file contains the complete implementation plan for Phase 7: Customer Module with all visual specifications and technical details.*

## Session Status: 🔄 STRATEGIC PIVOT - SUB-PHASE 7.2 PLANNING

**Strategic Decision**: Customer 360° View = Information Only
- ❌ Previous: Action-oriented with CTA configuration system
- ✅ New: Pure information display with 5-tab structure  
- 🎯 Rationale: Real business workflow analysis (calls > digital buttons)

**Major Architectural Change**: 5-Tab Customer 360° Structure
- Tab 1: **Insights** - Business intelligence & KPIs
- Tab 2: **Info** - Company details, multiple contacts (NEW - most important)
- Tab 3: **Orders** - Order history & tracking  
- Tab 4: **Account Statement** - Complete financial transaction history (replaces simple payments tab)
- Tab 5: **Support** - Support ticket history

**Previous Achievements (Sub-Phase 7.1)**:
- ✅ Design system token compliance fixes (hardcoded pixels → tokens)
- ✅ Architecture compliance review (95% → 100% compliant)
- ✅ Direct Card → 360° navigation implementation
- ✅ Configuration-driven CTA patterns established

**Current Major Milestone**: Phase 7.2 - 5-Tab Information-Only Customer 360° Implementation

---

## ⚠️ STRATEGIC ARCHITECTURE DECISION - ACCOUNT STATEMENT IMPLEMENTATION

**Decision**: Replace simple payments tab with comprehensive Account Statement

**Strategic Rationale**:
- ✅ **Standard Manufacturing Practice**: Account statements over isolated payment views
- ✅ **Business Context**: Show WHY transactions occurred (SO, Invoice, Proforma references)  
- ✅ **Financial Clarity**: Running balance with proper debit/credit categorization
- ✅ **Mobile Optimization**: Card-based layout for factory environment usage
- ✅ **Desktop Efficiency**: Professional table format for detailed financial analysis
- ✅ **Information-Only Approach**: View/share functionality (no transaction creation)

**Account Statement Core Features**:

1. **Transaction Categorization**:
   - 🧾 **Invoice** (Sales Order creation) → Debit entry (customer owes money)
   - 💰 **Payment** (Customer payments) → Credit entry (customer pays money)  
   - 🧮 **Credit Note** (Returns/adjustments) → Credit entry (reduces customer debt)
   - 📝 **Debit Note** (Additional charges) → Debit entry (increases customer debt)

2. **Mobile Layout** (Card-based):
   ```
   ┌─────────────────────────────────────┐
   │ 📅 15 Nov 2024                     │
   │ 🧾 Invoice #INV-2024-1247         │
   │ SO: #SO-2024-1247                  │
   │ ₹5,00,000                    Total │
   │ Outstanding: ₹2,50,000             │
   │ [View Details]                     │
   └─────────────────────────────────────┘
   ```

3. **Desktop Layout** (Professional Table):
   ```
   | Date       | Type    | Reference | Description | Debit   | Credit  | Balance |
   |------------|---------|-----------|-------------|---------|---------|---------|
   | 15 Nov     | Invoice | INV-1247  | SO-1247    | 5,00,000|         | 2,50,000|
   | 18 Nov     | Payment | PAY-1156  | Advance    |         | 2,50,000|         0|
   ```

4. **View Details Modal**:
   - Transaction-specific information display
   - Related document links (SO, Invoice, Payment receipt)
   - Business context and transaction notes
   - Document reference numbers and dates

5. **Share Functionality** (WhatsApp Only):
   - WhatsApp integration: Send statement summary
   - Read-only approach: Information viewing only (no transaction creation)
   - Simple sharing for customer communication

**Technical Implementation Plan**:
- ✅ **Component**: Replace `CustomerPaymentsTab.tsx` → `CustomerAccountStatementTab.tsx`
- ✅ **Design**: Responsive (Mobile cards + Desktop table)
- ✅ **Modal**: `AccountStatementModal.tsx` for transaction details
- ✅ **Data**: Invoice-based payment architecture integration
- ✅ **Share**: WhatsApp integration only
- ✅ **Architecture**: Information-only with modal details pattern

**Business Value**:
- ✅ **Professional Format**: Industry-standard account statement display
- ✅ **Transaction Context**: Clear business references (SO/Invoice connections)
- ✅ **Mobile-First**: Factory environment optimized interface
- ✅ **Financial Clarity**: Running balance with proper accounting logic
- ✅ **Communication Ready**: WhatsApp sharing for customer discussions

---

## 🚨 CRITICAL: POST-CUSTOMER-MODULE DATA STRUCTURE REFACTOR

**Priority**: HIGH - Implement after Customer 360° module completion

### **Industry Standard Data Structure Gaps Identified**

**Current vs Industry Standard Analysis:**

| Document | Current Structure | Industry Standard | Gap Status |
|----------|------------------|-------------------|------------|
| **Quote** | `items: string` | `items: QuoteItem[]` + GST breakdown | ❌ **MAJOR GAP** |
| **ProformaInvoice** | Financial fields only | `items: ProformaItem[]` + copy from Quote | ❌ **MISSING ITEMS** |
| **SalesOrder** | `items: string` + pricing | `items: OrderItem[]` (NO pricing) | ❌ **WRONG STRUCTURE** |
| **FinalInvoice** | `items: InvoiceItem[]` | Same | ✅ **CORRECT** |

### **Required Interface Changes**

**1. Quote Interface Enhancement:**
```typescript
interface Quote {
  // REMOVE: items: string
  // ADD: items: QuoteItem[]
  items: QuoteItem[];           // ❌ MISSING: Detailed item array
  subtotal: number;             // ❌ MISSING: Financial breakdown  
  gstRate: number;              // ❌ MISSING: Tax rate
  gstAmount: number;            // ❌ MISSING: Tax amount
  totalAmount: number;          // ✅ EXISTS
  paymentTerms: string;         // ❌ MISSING: Commercial terms
  deliveryTerms: string;        // ❌ MISSING: Delivery terms
  validityDays: number;         // ❌ MISSING: Quote validity
}

interface QuoteItem {
  description: string;
  fabricType: string;
  gsm: number;
  width: string;
  quantity: number;
  rate: number;
  amount: number;
}
```

**2. ProformaInvoice Interface Enhancement:**
```typescript
interface ProformaInvoice {
  // ADD: Copy of approved Quote items
  items: ProformaItem[];        // ❌ MISSING: Item details array
  // KEEP: All existing financial fields ✅
  subtotal: number;             // ✅ EXISTS
  gstAmount: number;            // ✅ EXISTS
  totalAmount: number;          // ✅ EXISTS
  advanceAmount: number;        // ✅ EXISTS
}
```

**3. SalesOrder Interface Cleanup:**
```typescript
interface SalesOrder {
  // REMOVE: items: string, totalAmount, balancePaymentDue, orderValue
  // REMOVE: quantity, fabricType, productDescription (duplicates)
  // ADD: Item specs without pricing
  items: OrderItem[];          // ❌ MISSING: Item specs for production
  // KEEP: Production-specific fields ✅
  progressPercentage: number;   // ✅ EXISTS
  deliveryDate: string;         // ✅ EXISTS
  productionStatus: string;     // ✅ EXISTS
}

interface OrderItem {
  description: string;
  fabricType: string;
  quantity: number;
  specifications: string;
  // NO PRICING FIELDS
}
```

### **Implementation Strategy - Work Preservation**

**✅ Customer 360° Work Preserved (90%):**
- All modal components (`CustomerDetailsModal`, `OrderDetailsModal`, `PaymentDetailsModal`)
- All navigation and tab architecture
- All responsive design and styling
- All business logic patterns
- Account Statement design specifications

**🔧 Minor Updates Required (10%):**
- Helper functions to extract from item arrays instead of strings
- Display logic to show detailed product specifications  
- Enhanced modal content with richer item data

### **Progressive Enhancement Approach**

**Phase 1: Interface Enhancement**
- Add new item array interfaces alongside existing string fields
- Maintain backward compatibility during transition
- Update mock data to include both formats

**Phase 2: Component Enhancement**  
- Update helper functions to use detailed item arrays
- Enhance modal components to display richer product details
- Keep all UI/navigation/styling unchanged

**Phase 3: Data Migration**
- Convert all mock data to use new detailed item arrays
- Remove old string-based fields after verification
- Update production data structures

**Phase 4: Cleanup**
- Remove backward compatibility code
- Optimize performance with new data structure
- Add validation for industry-standard compliance

### **Business Impact**

**✅ Benefits After Refactor:**
- Industry-standard document flow (Quote → ProformaInvoice → SalesOrder → FinalInvoice)
- Detailed product specifications in all documents
- Proper pricing distribution (Quote/Proforma/Final only, NOT in SalesOrder)
- Enhanced Customer 360° modals with complete item details
- Professional business document generation capability

**📋 Implementation Timeline:**
- **Priority**: Implement after Customer 360° module completion
- **Duration**: ~2-3 hours for interface updates + component enhancements
- **Risk**: LOW - 90% of Customer 360° work preserved
- **Testing**: Comprehensive verification of all document relationships

---

## ⚠️ KNOWN ISSUES - POST-7.1 RESOLUTION REQUIRED

### **Previous Tickets Tab Issue - RESOLVED VIA STRATEGIC PIVOT**

**Previous Problem**: Customer 360° tickets tab had spacing inconsistencies
- **Status**: ✅ RESOLVED via strategic architectural change
- **Solution**: Information-only approach eliminates complex styling conflicts
- **New Approach**: Support tab will display ticket history (no creation/actions)

**Strategic Resolution**:
- **Root Cause**: Action buttons and CTA systems created CSS complexity
- **Solution**: Pure information display eliminates styling conflicts
- **Benefits**: Simpler architecture, clearer user experience, better performance
- **Implementation**: Support tab as 5th tab in new information-only structure

---

# 🎯 **PHASE 7.2: 5-TAB CUSTOMER 360° IMPLEMENTATION PLAN**

## **📋 DETAILED IMPLEMENTATION STRATEGY**

### **Core Strategic Changes**
1. **Remove CTA System**: Eliminate all action buttons and CTA configuration from Customer360View
2. **5-Tab Structure**: Insights | Info | Orders | Payments | Support
3. **Information-Only**: Pure information display with communication access only
4. **Grid Simplification**: 4-row layout (header | tabs | status | content)

### **Business Requirements**
- **Info Tab**: Most important - company details, GST, multiple contacts with Call/WhatsApp
- **Contact Management**: Individual communication buttons for each contact person
- **Gujarat Context**: Owner, Manager, Accounts, Procurement contacts per company
- **Communication Focus**: Phone calls and WhatsApp as primary business actions

### **Implementation Sequence**

#### **Sub-Phase 7.2.1: Remove CTA System (10 minutes)**
- ✅ Remove `TAB_CTA_CONFIG` configuration
- ✅ Remove `getContextualCTA()` function  
- ✅ Remove `handleCTAClick()` function
- ✅ Remove `shouldHideCTA` logic
- ✅ Update CSS grid to remove CTA row

#### **Sub-Phase 7.2.2: Implement 5-Tab Navigation (5 minutes)**
- ✅ Update tab type: `'insights' | 'info' | 'orders' | 'payments' | 'support'`
- ✅ Update tab navigation array
- ✅ Set default tab to 'info' (most important for business)
- ✅ Update CSS for 5-tab responsive layout

#### **Sub-Phase 7.2.3: Create CustomerInfoTab Component (15 minutes)**
- 📋 Create new component with company information
- 📋 Implement contact management with Call/WhatsApp buttons
- 📋 Add business details (GST, addresses, credit terms)
- 📋 Design system token compliance

#### **Sub-Phase 7.2.4: Restore CustomerSupportTab (10 minutes)**
- 📋 Create support ticket history display
- 📋 Information-only approach (no ticket creation)
- 📋 Follow existing tab patterns for consistency

#### **Sub-Phase 7.2.5: Update Customer List Cards (10 minutes)**
- 📋 Change button text to "360° View"
- 📋 Add Call and WhatsApp buttons to cards
- 📋 Implement communication handlers

#### **Sub-Phase 7.2.6: Remove Actions from Existing Tabs (5 minutes)**
- 📋 CustomerInsightsTab: Remove any action buttons
- 📋 CustomerOrdersTab: Remove any action buttons
- 📋 CustomerPaymentsTab: Remove any action buttons

### **Technical Specifications**

#### **CSS Grid Updates**
```css
.customer360Container {
  grid-template-rows: var(--ds-touch-target-preferred) var(--ds-touch-target-preferred) auto 1fr;
  /* Header | Tabs | Status | Content - NO CTA ROW */
}

.tabButton {
  flex: 1; /* 5 tabs = 20% width each */
}
```

#### **Contact Management Interface**
```jsx
// Primary Contact with communication
<div className="contact-primary">
  <span>Ramesh Patel - Owner</span>
  <button onClick={() => call(contact.phone)}>📞 Call</button>
  <button onClick={() => whatsapp(contact.phone)}>💬 WhatsApp</button>
</div>

// Additional Contacts
{additionalContacts.map(contact => (
  <div key={contact.id} className="contact-card">
    <span>{contact.name} - {contact.role}</span>
    <button onClick={() => call(contact.phone)}>📞</button>
    <button onClick={() => whatsapp(contact.phone)}>💬</button>
  </div>
))}
```

### **Files to Create/Modify**

#### **New Components**
1. `CustomerInfoTab.tsx` - Most important tab with contact management
2. `CustomerSupportTab.tsx` - Support ticket history display
3. `CustomerInfoTab.module.css` - Info tab styling
4. `CustomerSupportTab.module.css` - Support tab styling

#### **Modified Components**
1. `Customer360View.tsx` - Remove CTA system, add 5-tab navigation
2. `Customer360View.module.css` - Remove CTA styles, update grid
3. `CustomerListManagement.tsx` - Update button text and add communication
4. `CustomerInsightsTab.tsx` - Remove action buttons
5. `CustomerOrdersTab.tsx` - Remove action buttons  
6. `CustomerPaymentsTab.tsx` - Remove action buttons

### **Architecture Compliance Checklist**
- ✅ Design System Tokens: All styling uses `var(--ds-*)` tokens
- ✅ Touch Targets: 44px minimum for all interactive elements
- ✅ Component Structure: Business logic only, no infrastructure code
- ✅ Mobile-First: 5-tab responsive design
- ✅ Zero Code Duplication: Shared patterns across tabs

### **Success Criteria**
- ✅ Customer 360° = Pure information browsing
- ✅ Info tab = Complete contact management hub
- ✅ Communication = Easy Call/WhatsApp access
- ✅ Business Value = Complete customer context for conversations
- ✅ Technical Excellence = 100% architecture compliance

---

# 🎯 **PREVIOUS PHASE 7: CUSTOMER MODULE - COMPLETE IMPLEMENTATION PLAN**

## **📋 ARCHITECTURE COMPLIANCE CHECKLIST**

**MANDATORY: Review before implementation**
- ✅ **Modal vs Full Page Framework**: Customer List → Quick Preview Modal → Full 360° Page
- ✅ **Hybrid Modal + Expanded View**: Quick customer preview (modal) → Detailed view (full page)
- ✅ **140px Card Template Standard**: All customer cards use consistent height
- ✅ **Design System Token Compliance**: Zero hardcoded values, use var(--ds-*) exclusively
- ✅ **Component Structure Standards**: Business logic only, no infrastructure code
- ✅ **44px Touch Target Standard**: All interactive elements ≥44px
- ✅ **Zero Code Duplication**: Shared components and utilities
- ✅ **CSS Grid Architecture**: Integrates with unified PlatformShell

---

## **🗂️ COMPONENT ORGANIZATION - FLAT STRUCTURE**

### **Component Organization (Current Implementation Status)**
```
src/components/business/
├── Customers.tsx                     ← ✅ Updated (main container with 360° view integration)
├── CustomerListManagement.tsx        ← ✅ Updated (direct Card → 360° navigation)
├── CustomerQuickPreview.tsx          ← ❌ REMOVED (eliminated intermediate step)
├── Customer360View.tsx               ← ✅ IMPLEMENTED (3-tab navigation)
├── CustomerOrdersTab.tsx             ← ✅ IMPLEMENTED (working spacing/layout)
├── CustomerPaymentsTab.tsx           ← ✅ IMPLEMENTED (working spacing/layout)  
├── CustomerTicketsTab.tsx            ← ❌ REMOVED (spacing issue - see Known Issues)
├── CustomerInsightsTab.tsx           ← ✅ IMPLEMENTED (default tab, working layout)
├── CustomerCard.tsx                  ← 📋 PENDING (using inline cards currently)
├── SupportTicketManagement.tsx       ← ✅ Unchanged (existing support section)
└── CSS Modules (current implementation):
    ├── Customers.module.css              ← ✅ Updated (360° view integration styles)
    ├── CustomerListManagement.module.css ← ✅ Updated (removed quick preview styles)
    ├── CustomerQuickPreview.module.css   ← ❌ REMOVED (component eliminated)
    ├── Customer360View.module.css        ← ✅ IMPLEMENTED (3-tab layout)
    ├── CustomerOrdersTab.module.css      ← ✅ IMPLEMENTED (working design)
    ├── CustomerPaymentsTab.module.css    ← ✅ IMPLEMENTED (working design)
    ├── CustomerTicketsTab.module.css     ← ❌ REMOVED (see Known Issues)
    └── CustomerInsightsTab.module.css    ← ✅ IMPLEMENTED (working design)
```

### **✅ Benefits of Flat Structure**
- **Consistency**: Matches existing business component organization
- **Zero Import Complexity**: Simple relative imports like other modules
- **Faster Implementation**: No folder structure setup required
- **Easy Maintenance**: Follows established patterns in Sales, Production, Procurement
- **Post-MVP Flexibility**: Can refactor all modules together later

---

## **📱 VISUAL DESIGN SPECIFICATIONS**

### **Phase 7.1: Customer List View (Mobile Layout - 375px)**
```
┌─────────────────────────────────────┐
│ CUSTOMERS TAB - Header (48px)       │ ← Section navigation
├─────────────────────────────────────┤
│ 🏆 Premium (8)  📅 Month    👥 6    │ ← Filters (44px height)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏆 Gujarat Textile Mills       │ │ ← Customer Card (140px height)
│ │ Outstanding: ₹2.4L | LTV: ₹45L │ │   Following 140px template standard
│ │ Last Order: 15 days ago         │ │
│ │ ⚡ Active | Payment: Excellent  │ │
│ │ [📞 Call] [📱 WhatsApp] [👁️ View]│ │ ← Actions (44px touch targets)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🥈 Rajkot Fabrics Ltd          │ │ ← Customer Card (140px height)
│ │ Outstanding: ₹0 | LTV: ₹28L     │ │
│ │ Last Order: 3 days ago          │ │
│ │ ⚡ Active | Payment: Good       │ │
│ │ [📞 Call] [📱 WhatsApp] [👁️ View]│ │ ← Actions (44px touch targets)
│ └─────────────────────────────────┘ │
│ [Scrollable area continues...]      │ ← Dynamic scroll based on content
├─────────────────────────────────────┤
│ [+ Add Customer]                    │ ← CTA (56px height)
└─────────────────────────────────────┘
```

### **Phase 7.2: Quick Preview Modal (500px max width)**
```
┌─────────────────────────────────────┐
│ ← Gujarat Textile Mills        ✕   │ ← Header (48px) with back/close
├─────────────────────────────────────┤
│ 🏆 PREMIUM CUSTOMER                 │ ← Loyalty status banner
│ LTV: ₹45.2L | Outstanding: ₹2.4L   │ ← Key financial metrics
│ Payment Score: 95/100 ⭐            │ ← Credit score with visual indicator
├─────────────────────────────────────┤
│ 📊 QUICK STATS                      │ ← Section header
│ • Active Orders: 3                  │ ← Bullet list format
│ • Last Payment: 5 days ago          │   showing key business metrics
│ • Credit Limit: ₹10L (76% used)    │   with real-time calculations
│ • Avg Order Value: ₹3.2L            │
├─────────────────────────────────────┤
│ 📞 QUICK ACTIONS                    │ ← Action section
│ [📞 Call] [📱 WhatsApp] [💳 Payment]│ ← 6-button grid layout
│ [📧 Email] [🎫 Support] [📋 Notes]   │   44px × 44px touch targets
├─────────────────────────────────────┤
│ [View Full 360° Profile]            │ ← Primary CTA to full page
└─────────────────────────────────────┘   (modal → page transition)
```

### **Phase 7.3: Customer 360° Full Page View (Mobile)**
```
┌─────────────────────────────────────┐
│ ← Gujarat Textile Mills             │ ← Header with back navigation (48px)
├─────────────────────────────────────┤
│ Orders│Payments│Tickets│Insights     │ ← 4-tab navigation (48px)
├─────────────────────────────────────┤
│ 🏆 PREMIUM | Payment Score: 95/100  │ ← Customer status bar (compact)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ORDER #SO-2024-1247             │ │ ← Order Card (140px template)
│ │ Cotton Sarees - 500 pieces     │ │   Cross-navigation enabled
│ │ Value: ₹3.2L | Due: Nov 15     │ │   Click → Order Details
│ │ Status: In Production           │ │
│ │ [👁️ View] [📞 Discuss] [📊 Track]│ │ ← Contextual actions (44px)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ORDER #SO-2024-1198             │ │ ← Order Card (140px template)
│ │ Silk Blend - 200 pieces        │ │   Status-driven actions
│ │ Value: ₹1.8L | Delivered       │ │   Payment-focused for delivered
│ │ Status: Payment Pending         │ │
│ │ [💳 Payment] [📄 Invoice] [⭐]   │ │ ← Contextual actions (44px)
│ └─────────────────────────────────┘ │
│ [Scrollable area continues...]      │ ← Dynamic content based on tab
├─────────────────────────────────────┤
│ [Create New Order]                  │ ← Context-aware CTA (56px)
└─────────────────────────────────────┘   Changes per tab: Order/Payment/Ticket
```

### **Desktop Layout (1024px+) - 2-Column Grid**
```
┌───────────────────────────────────────────────────────────────────────────────┐
│ CUSTOMERS TAB - 🏆 Premium (8)    📅 Month    👥 6                            │
├─────────────────────────────────┬─────────────────────────────────────────────┤
│ 🏆 Gujarat Textile Mills        │ 🥈 Rajkot Fabrics Ltd                      │
│ Outstanding: ₹2.4L | LTV: ₹45L  │ Outstanding: ₹0 | LTV: ₹28L                │
│ Last Order: 15 days ago         │ Last Order: 3 days ago                     │
│ ⚡ Active | Payment: Excellent   │ ⚡ Active | Payment: Good                  │
│ [📞] [📱] [👁️]                    │ [📞] [📱] [👁️]                             │
├─────────────────────────────────┼─────────────────────────────────────────────┤
│ [Grid continues with 2-column layout for optimal desktop space usage...]     │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## **💻 TECHNICAL IMPLEMENTATION DETAILS**

### **Phase 7.1: Foundation Setup (5 minutes)**

#### **Task 7.1.1: Create Folder Structure**
```bash
# Create customer module structure
mkdir -p src/components/business/customer/tabs
mkdir -p src/components/business/customer/components  
mkdir -p src/components/business/customer/styles
```

#### **Task 7.1.2: Update Main Customers.tsx Import**
```typescript
// src/components/business/Customers.tsx - Line 4 update
import CustomerListManagement from './customer/CustomerListManagement';
```

### **Phase 7.2: Core Components Implementation (20 minutes)**

#### **Task 7.2.1: CustomerCard Component (8 minutes)**
```typescript
// src/components/business/customer/components/CustomerCard.tsx
interface CustomerCardProps {
  customer: BusinessProfile;
  onQuickPreview: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  mobile?: boolean;
}

const CustomerCard = ({ customer, onQuickPreview, onCall, onWhatsApp, mobile }) => {
  return (
    <div className={styles.customerCard}> {/* 140px height template */}
      {/* Header: Loyalty + Company Name */}
      <div className={styles.customerHeader}>
        <span className={styles.loyaltyBadge}>{customer.loyalty?.tier}</span>
        <h3 className={styles.companyName}>{customer.companyName}</h3>
      </div>
      
      {/* Financial Metrics Row */}
      <div className={styles.financialMetrics}>
        <span>Outstanding: ₹{formatCurrency(calculateOutstanding(customer.id))}</span>
        <span>LTV: ₹{formatCurrency(customer.totalRevenue)}</span>
      </div>
      
      {/* Business Status Row */}
      <div className={styles.businessStatus}>
        <span>Last Order: {getLastOrderDate(customer.id)}</span>
        <span className={styles[customer.paymentBehavior]}>
          Payment: {customer.paymentBehavior}
        </span>
      </div>
      
      {/* Action Buttons - 44px touch targets */}
      <div className={styles.actionButtons}>
        <button className={styles.actionButton} onClick={onCall}>
          📞 Call
        </button>
        <button className={styles.actionButton} onClick={onWhatsApp}>
          📱 WhatsApp
        </button>
        <button className={styles.actionButton} onClick={onQuickPreview}>
          👁️ View
        </button>
      </div>
    </div>
  );
};
```

#### **Task 7.2.2: CustomerQuickPreview Modal (12 minutes)**
```typescript
// src/components/business/customer/CustomerQuickPreview.tsx
import ModalPortal from '../../../shared/ModalPortal';

interface CustomerQuickPreviewProps {
  customer: BusinessProfile;
  onClose: () => void;
  onViewFull: () => void;
}

const CustomerQuickPreview = ({ customer, onClose, onViewFull }) => {
  return (
    <ModalPortal isOpen={true} onBackdropClick={onClose}>
      <div className={styles.quickPreviewModal}> {/* 500px max width */}
        {/* Modal Header - 48px */}
        <div className={styles.modalHeader}>
          <button className={styles.backButton} onClick={onClose}>←</button>
          <h2 className={styles.customerTitle}>{customer.companyName}</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        {/* Customer Status Section */}
        <div className={styles.statusSection}>
          <div className={styles.loyaltyHeader}>
            {customer.loyalty?.tier} CUSTOMER
          </div>
          <div className={styles.keyMetrics}>
            <span>LTV: ₹{formatCurrency(customer.totalRevenue)}</span>
            <span>Outstanding: ₹{calculateOutstanding(customer.id)}</span>
            <span>Payment Score: {customer.paymentScore}/100 ⭐</span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <h3>📊 QUICK STATS</h3>
          <ul className={styles.statsList}>
            <li>Active Orders: {customer.activeOrders}</li>
            <li>Last Payment: {getLastPaymentDate(customer.id)}</li>
            <li>Credit Used: {getCreditUtilization(customer)}%</li>
            <li>Avg Order: ₹{formatCurrency(customer.averageOrderValue)}</li>
          </ul>
        </div>
        
        {/* Quick Actions Grid - 44px touch targets */}
        <div className={styles.quickActions}>
          <h3>📞 QUICK ACTIONS</h3>
          <div className={styles.actionGrid}>
            <button onClick={() => initiateCall(customer.phone)}>📞 Call</button>
            <button onClick={() => openWhatsApp(customer.phone)}>📱 WhatsApp</button>
            <button onClick={() => requestPayment(customer.id)}>💳 Payment</button>
            <button onClick={() => sendEmail(customer.email)}>📧 Email</button>
            <button onClick={() => createTicket(customer.id)}>🎫 Support</button>
            <button onClick={() => addNotes(customer.id)}>📋 Notes</button>
          </div>
        </div>
        
        {/* Primary CTA */}
        <button className={styles.fullViewCTA} onClick={onViewFull}>
          View Full 360° Profile
        </button>
      </div>
    </ModalPortal>
  );
};
```

### **Phase 7.3: Customer 360° View Implementation (25 minutes)**

#### **Task 7.3.1: Customer360View Container (10 minutes)**
```typescript
// src/components/business/customer/Customer360View.tsx
type Customer360Tab = 'orders' | 'payments' | 'tickets' | 'insights';

const Customer360View = ({ customerId, onClose }) => {
  const [activeTab, setActiveTab] = useState<Customer360Tab>('orders');
  const customer = getCustomerById(customerId);

  return (
    <div className={styles.customer360Container}>
      {/* Header - 48px */}
      <div className={styles.customer360Header}>
        <button className={styles.backButton} onClick={onClose}>←</button>
        <h1 className={styles.customerName}>{customer.companyName}</h1>
      </div>

      {/* Tab Navigation - 48px */}
      <div className={styles.tabNavigation}>
        {(['orders', 'payments', 'tickets', 'insights'] as Customer360Tab[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Customer Status Bar */}
      <div className={styles.customerStatusBar}>
        <span className={styles.loyaltyBadge}>{customer.loyalty?.tier}</span>
        <span>Payment Score: {customer.paymentScore}/100</span>
        <span className={`${styles.creditStatus} ${styles[customer.creditStatus]}`}>
          {customer.creditStatus.toUpperCase()}
        </span>
      </div>

      {/* Dynamic Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'orders' && <CustomerOrdersTab customerId={customerId} />}
        {activeTab === 'payments' && <CustomerPaymentsTab customerId={customerId} />}
        {activeTab === 'tickets' && <CustomerTicketsTab customerId={customerId} />}
        {activeTab === 'insights' && <CustomerInsightsTab customerId={customerId} />}
      </div>

      {/* Context-Aware CTA - 56px */}
      <div className={styles.customer360CTA}>
        {getContextualCTA(activeTab)}
      </div>
    </div>
  );
};
```

#### **Task 7.3.2: CustomerOrdersTab Implementation (15 minutes)**
```typescript
// src/components/business/customer/tabs/CustomerOrdersTab.tsx
const CustomerOrdersTab = ({ customerId }) => {
  const customerOrders = getCustomerOrders(customerId);
  
  return (
    <div className={styles.ordersTabContainer}>
      {customerOrders.map(order => (
        <div key={order.id} className={styles.orderCard}> {/* 140px template */}
          {/* Order Header */}
          <div className={styles.orderHeader}>
            <h3 className={styles.orderNumber}>ORDER #{order.orderNumber}</h3>
            <span className={`${styles.statusBadge} ${styles[order.status]}`}>
              {order.status}
            </span>
          </div>
          
          {/* Order Details */}
          <div className={styles.orderDetails}>
            <p className={styles.productDescription}>
              {order.productDescription} - {order.quantity} pieces
            </p>
            <div className={styles.orderMetrics}>
              <span>Value: ₹{formatCurrency(order.totalValue)}</span>
              <span>Due: {formatDate(order.deliveryDate)}</span>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className={styles.orderProgress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${getOrderProgress(order)}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {getOrderProgressText(order)}
            </span>
          </div>
          
          {/* Contextual Actions - 44px touch targets */}
          <div className={styles.orderActions}>
            <button 
              className={styles.actionButton}
              onClick={() => viewOrderDetails(order.id)}
            >
              👁️ View
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => initiateCall(order.contactPerson)}
            >
              📞 Discuss
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => trackOrder(order.id)}
            >
              📊 Track
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### **Phase 7.4: CSS Implementation with Design System Tokens**

#### **Customer Card Styles (140px Template Compliance)**
```css
/* src/components/business/customer/styles/Customer.module.css */

.customerCard {
  height: 140px; /* Standard template height */
  background: var(--ds-bg-primary);
  border: 1px solid var(--ds-border-subtle);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-space-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: var(--ds-space-sm);
}

.customerHeader {
  display: flex;
  align-items: center;
  gap: var(--ds-space-xs);
}

.loyaltyBadge {
  font-size: var(--font-xs);
  padding: var(--ds-space-xs);
  border-radius: var(--ds-radius-sm);
  font-weight: 600;
}

.loyaltyBadge.premium {
  background: var(--ds-color-gold);
  color: var(--ds-text-inverse);
}

.loyaltyBadge.gold {
  background: var(--ds-color-accent);
  color: var(--ds-text-inverse);
}

.loyaltyBadge.silver {
  background: var(--ds-color-neutral);
  color: var(--ds-text-primary);
}

.actionButtons {
  display: flex;
  gap: var(--ds-space-xs);
}

.actionButton {
  height: var(--ds-touch-target-md); /* 44px minimum */
  padding: var(--ds-space-xs) var(--ds-space-sm);
  background: var(--ds-bg-secondary);
  border: 1px solid var(--ds-border-subtle);
  border-radius: var(--ds-radius-sm);
  font-size: var(--font-sm);
  cursor: pointer;
  flex: 1;
}

.actionButton:hover {
  background: var(--ds-bg-hover);
}
```

#### **Modal Styles (500px Max Width Compliance)**
```css
/* src/components/business/customer/styles/CustomerPreview.module.css */

.quickPreviewModal {
  max-width: 500px; /* Architecture decision compliance */
  width: 100%;
  background: var(--ds-bg-primary);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-lg);
  padding: var(--ds-space-md);
}

.modalHeader {
  height: 48px; /* Standard header height */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--ds-border-subtle);
  padding-bottom: var(--ds-space-sm);
  margin-bottom: var(--ds-space-md);
}

.backButton, .closeButton {
  width: var(--ds-touch-target-md); /* 44px */
  height: var(--ds-touch-target-md); /* 44px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: var(--font-lg);
  cursor: pointer;
  border-radius: var(--ds-radius-sm);
}

.actionGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ds-space-sm);
}

.actionGrid button {
  height: var(--ds-touch-target-md); /* 44px minimum */
  padding: var(--ds-space-sm);
  background: var(--ds-bg-secondary);
  border: 1px solid var(--ds-border-subtle);
  border-radius: var(--ds-radius-sm);
  cursor: pointer;
}
```

---

## **🔄 DATA INTEGRATION SPECIFICATIONS**

### **Mock Data Integration Points**
```typescript
// Business Profile Data Structure Usage
interface BusinessProfile {
  id: string;
  companyName: string;
  customerStatus: 'prospect' | 'customer' | 'inactive';
  totalRevenue: number;         // For LTV calculations
  paymentScore: number;         // Payment behavior (1-100)
  creditStatus: string;         // Credit status display
  loyalty: CustomerLoyalty;     // Tier and benefits
  activeOrders: number;         // Real-time order count
  averageOrderValue: number;    // Business metrics
}

// Cross-Module Data References
- Customer Orders → Sales Order data (cross-navigation)
- Customer Payments → Payment tracking data
- Customer Tickets → Support ticket system
- Customer Insights → Analytics aggregation
```

### **Filter Integration**
```typescript
// Filter State Management (from existing Customers.tsx)
const filterMapping = {
  'premium': (customer) => customer.loyalty?.tier === 'Platinum' || customer.loyalty?.tier === 'Gold',
  'new': (customer) => isNewCustomer(customer.becameCustomerDate),
  'active': (customer) => customer.activeOrders > 0,
  'payment_issues': (customer) => customer.creditStatus === 'watch' || customer.creditStatus === 'hold'
};
```

---

## **✅ IMPLEMENTATION COMPLETION CRITERIA**

### **Technical Requirements**
- [ ] All components compile without TypeScript errors
- [ ] Zero hardcoded values (only design system tokens)
- [ ] All touch targets ≥44px (mobile compliance)
- [ ] All cards follow 140px template standard
- [ ] Modal maximum width 500px
- [ ] Clean component separation (business logic only)
- [ ] Cross-navigation implemented (orders, payments)
- [ ] Responsive design (mobile-first approach)

### **Visual Requirements**
- [ ] Customer list displays with proper filtering
- [ ] Quick preview modal with key metrics and actions
- [ ] Full 360° view with 4-tab navigation
- [ ] Consistent styling with design system
- [ ] Proper status indicators and badges
- [ ] Loading states and empty states handled

### **Business Requirements**
- [ ] Customer 360° view shows complete business relationship
- [ ] Payment tracking with outstanding amounts
- [ ] Order history with cross-navigation to order details
- [ ] Support ticket integration
- [ ] Business intelligence insights display
- [ ] Contextual actions based on customer status

### **Architecture Requirements**
- [ ] Follows Architecture Decisions Index compliance
- [ ] Integrates with unified PlatformShell
- [ ] Uses ModalPortal for modal displays
- [ ] Implements proper parent-child modal management
- [ ] Maintains zero code duplication principles
- [ ] Professional routing patterns

---

## **📊 SUCCESS METRICS**

### **Development Velocity**
- **Phase 7.1**: 5 minutes (folder setup + imports)
- **Phase 7.2**: 20 minutes (core components)
- **Phase 7.3**: 25 minutes (360° view + tabs)
- **Phase 7.4**: 10 minutes (integration + polish)
- **Total Duration**: 60 minutes (1 hour as planned)

### **Business Value Delivered**
- **Customer Relationship Management**: Complete 360° customer view
- **Payment Management**: Outstanding tracking and payment requests
- **Order Management**: Historical order tracking with cross-navigation
- **Support Integration**: Unified customer service approach
- **Mobile Optimization**: Factory environment ready interface
- **Industry Standards**: CRM patterns following Salesforce/HubSpot UX

---

**📍 This plan follows ALL Architecture Decisions Index requirements and provides a complete customer management system optimized for textile manufacturing businesses.**

*For implementation updates, mark completed tasks with ✅ and note any architectural decisions or patterns discovered during development.*