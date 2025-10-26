# ElevateBusiness 360° - Customer Module Implementation Plan

*This file contains the complete implementation plan for Phase 7: Customer Module with all visual specifications and technical details.*

## Session Status: ✅ SUB-PHASE 7.1 COMPLETED

**Latest Achievement**: Customer Module 360° View Navigation Overhaul Complete
- ✅ Eliminated CustomerQuickPreview component (direct Card → 360° navigation)
- ✅ Implemented configuration-driven CTA hiding pattern
- ✅ Added space optimization by reclaiming filter area in 360° view
- ✅ Reordered tabs to Insights → Orders → Payments sequence
- ✅ Fixed design system compliance issues (CTA button colors, tokens)
- ✅ Added comprehensive Lead Management documentation

**Current Major Milestone**: Phase 7 - Customer Module Implementation (Core Navigation Complete)

## ⚠️ KNOWN ISSUES - POST-7.1 RESOLUTION REQUIRED

### **Tickets Tab Spacing Persistence Issue**

**Problem**: Customer 360° tickets tab displays inconsistent spacing compared to orders/payments tabs
- **Status**: Temporarily removed from Customer 360° view
- **Priority**: P1 (affects customer support workflow)
- **Impact**: Customer 360° now has 3 tabs (Insights, Orders, Payments) instead of planned 4

**Investigation Summary**:
- ✅ **Root Cause Analysis**: Completed systematic comparison across all tab components
- ✅ **Structural Fixes Attempted**: Multiple attempts to match working orders tab structure exactly
- ✅ **CSS Compliance**: Verified design system token compliance across all components
- ✅ **From-Scratch Rebuild**: Completely recreated tickets tab using working orders pattern
- ❌ **Issue Persistence**: Spacing problems persist despite identical structure/CSS

**Technical Details**:
- Global `ds-card-content` CSS affects only tickets tab differently
- Same JSX structure, same CSS classes, same design system tokens as working tabs
- Issue manifests on both desktop and mobile layouts
- Problem appears to be deeper architectural/CSS inheritance issue

**Next Steps for Resolution**:
1. **Phase 7.2 Priority**: Investigate global CSS cascade patterns
2. **Alternative Approach**: Consider component-level CSS isolation strategy
3. **Architecture Review**: Evaluate if tickets functionality needs different approach
4. **Workaround**: Current 3-tab Customer 360° remains fully functional

**Temporary Solution**: Clean 3-tab Customer 360° experience maintained (Insights → Orders → Payments)

---

# 🎯 **PHASE 7: CUSTOMER MODULE - COMPLETE IMPLEMENTATION PLAN**

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