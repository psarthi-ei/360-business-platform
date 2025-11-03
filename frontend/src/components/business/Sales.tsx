import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActionParams } from '../../services/nlp/types';
import { mockLeads, mockQuotes, mockReceivables, mockPayables } from '../../data/salesMockData';
import styles from './Sales.module.css';
import LeadManagement from './LeadManagement';
import QuotationOrders from './QuotationOrders';
import SalesOrders from './SalesOrders';
import Invoices from './Invoices';
import ReceivablesManagement from './ReceivablesManagement';
import PayablesManagement from './PayablesManagement';

interface SalesProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type TabType = 'leads' | 'quotes' | 'orders' | 'invoices' | 'receivables' | 'payables';

// Dynamic count calculator functions
const calculateLeadCounts = () => ({
  all: mockLeads.length,
  hot: mockLeads.filter(l => l.priority === 'hot').length,
  warm: mockLeads.filter(l => l.priority === 'warm').length,
  cold: mockLeads.filter(l => l.priority === 'cold').length
});

const calculateQuoteCounts = () => ({
  all: mockQuotes.length,
  pending: mockQuotes.filter(q => q.status === 'pending').length,
  approved: mockQuotes.filter(q => q.status === 'approved').length,
  expired: mockQuotes.filter(q => q.status === 'expired').length
});

const calculateReceivableCounts = () => ({
  all: mockReceivables.length,
  current: mockReceivables.filter(r => r.agingCategory === 'current').length,
  aging30: mockReceivables.filter(r => r.agingCategory === '31-60').length,
  aging60: mockReceivables.filter(r => r.agingCategory === '61-90').length,
  overdue: mockReceivables.filter(r => r.agingCategory === '90+').length,
  critical: mockReceivables.filter(r => r.customerRisk === 'critical').length
});

const calculatePayableCounts = () => ({
  all: mockPayables.length,
  dueToday: mockPayables.filter(p => p.daysToDue === 0).length,
  dueThisWeek: mockPayables.filter(p => p.daysToDue >= 0 && p.daysToDue <= 7).length,
  upcoming: mockPayables.filter(p => p.daysToDue > 7).length,
  overdue: mockPayables.filter(p => p.daysToDue < 0).length,
  critical: mockPayables.filter(p => p.criticalSupplier).length
});

const Sales = ({ mobile, onShowCustomerProfile, onUniversalAction }: SalesProps) => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [leadFilterState, setLeadFilterState] = useState('all');
  const [quoteFilterState, setQuoteFilterState] = useState('all');
  const [orderFilterState, setOrderFilterState] = useState('all');
  const [invoiceFilterState, setInvoiceFilterState] = useState('all');
  const [receivablesFilterState, setReceivablesFilterState] = useState('all');
  const [payablesFilterState, setPayablesFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Intelligent scroll behavior state
  const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);
  
  
  // Modal trigger states for CTA button functionality
  const [triggerLeadModal, setTriggerLeadModal] = useState(false);
  
  // Refs for tab scrolling behavior
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key in TabType]: HTMLButtonElement | null }>({
    leads: null,
    quotes: null,
    orders: null,
    invoices: null,
    receivables: null,
    payables: null
  });
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All Time' },
    { value: 'today', label: '📅 Today' },
    { value: 'thisweek', label: '📅 This Week' },
    { value: 'thismonth', label: '📅 This Month' }
  ];
  
  // Dynamic count calculations
  const leadCounts = calculateLeadCounts();
  const quoteCounts = calculateQuoteCounts();
  const receivableCounts = calculateReceivableCounts();
  const payableCounts = calculatePayableCounts();
  

  // Function to scroll active tab into center view on mobile
  const scrollToActiveTab = useCallback((tabType: TabType) => {
    if (window.innerWidth <= 768 && tabsRef.current && tabRefs.current[tabType]) {
      const tabsContainer = tabsRef.current;
      const activeTabElement = tabRefs.current[tabType];
      
      if (activeTabElement) {
        const containerWidth = tabsContainer.offsetWidth;
        const tabOffsetLeft = activeTabElement.offsetLeft;
        const tabWidth = activeTabElement.offsetWidth;
        
        // Calculate scroll position to center the active tab
        const scrollPosition = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);
        
        tabsContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Enhanced tab change handler with scroll behavior
  const handleTabChange = useCallback((tabType: TabType) => {
    setActiveTab(tabType);
    // Scroll to center the newly active tab on mobile
    setTimeout(() => {
      scrollToActiveTab(tabType);
    }, 100);
  }, [scrollToActiveTab]);
  
  // Status filter configurations for each tab (Filter 1) - Dynamic counts
  const statusFilterConfigs = {
    leads: [
      { value: 'all', label: 'All Leads', count: leadCounts.all },
      { value: 'hot', label: '🔥 Hot Leads', count: leadCounts.hot },
      { value: 'warm', label: '🔶 Warm Leads', count: leadCounts.warm },
      { value: 'cold', label: '🔵 Cold Leads', count: leadCounts.cold }
    ],
    quotes: [
      { value: 'all', label: 'All Quotes', count: quoteCounts.all },
      { value: 'pending', label: '⏳ Pending', count: quoteCounts.pending },
      { value: 'approved', label: '✅ Approved', count: quoteCounts.approved },
      { value: 'expired', label: '❌ Expired', count: quoteCounts.expired }
    ],
    orders: [
      { value: 'all', label: 'All Orders', count: 5 },
      { value: 'production', label: '🟡 Production', count: 2 },
      { value: 'blocked', label: '⚠️ Blocked', count: 1 },
      { value: 'delivered', label: '✅ Delivered', count: 2 }
    ],
    invoices: [
      { value: 'all', label: 'All Invoices', count: 15 },
      { value: 'paid', label: '💰 Paid', count: 8 },
      { value: 'pending', label: '🟡 Pending', count: 5 },
      { value: 'overdue', label: '🔴 Overdue', count: 2 }
    ],
    receivables: [
      { value: 'all', label: 'All Receivables', count: receivableCounts.all },
      { value: 'current', label: '💚 Current (0-30)', count: receivableCounts.current },
      { value: 'aging_30', label: '🟡 31-60 Days', count: receivableCounts.aging30 },
      { value: 'aging_60', label: '🟠 61-90 Days', count: receivableCounts.aging60 },
      { value: 'overdue', label: '🔴 90+ Days', count: receivableCounts.overdue },
      { value: 'critical', label: '⚠️ Critical Risk', count: receivableCounts.critical }
    ],
    payables: [
      { value: 'all', label: 'All Payables', count: payableCounts.all },
      { value: 'due_today', label: '🟡 Due Today', count: payableCounts.dueToday },
      { value: 'due_week', label: '📅 Due This Week', count: payableCounts.dueThisWeek },
      { value: 'upcoming', label: '💚 Upcoming', count: payableCounts.upcoming },
      { value: 'overdue', label: '🔴 Overdue', count: payableCounts.overdue },
      { value: 'critical', label: '⚠️ Critical Suppliers', count: payableCounts.critical }
    ]
  };

  // Get current filter state based on active tab
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'leads': return leadFilterState;
      case 'quotes': return quoteFilterState;
      case 'orders': return orderFilterState;
      case 'invoices': return invoiceFilterState;
      case 'receivables': return receivablesFilterState;
      case 'payables': return payablesFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'leads': setLeadFilterState(filter); break;
      case 'quotes': setQuoteFilterState(filter); break;
      case 'orders': setOrderFilterState(filter); break;
      case 'invoices': setInvoiceFilterState(filter); break;
      case 'receivables': setReceivablesFilterState(filter); break;
      case 'payables': setPayablesFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'leads': return leadFilterState;
        case 'quotes': return quoteFilterState;
        case 'orders': return orderFilterState;
        case 'invoices': return invoiceFilterState;
        case 'receivables': return receivablesFilterState;
        case 'payables': return payablesFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations to avoid external dependency
    const getStatusFilters = () => {
      switch(activeTab) {
        case 'leads': {
          const leadCounts = {
            all: mockLeads.length,
            hot: mockLeads.filter(l => l.priority === 'hot').length,
            warm: mockLeads.filter(l => l.priority === 'warm').length,
            cold: mockLeads.filter(l => l.priority === 'cold').length
          };
          return [
            { value: 'all', label: 'All Leads', count: leadCounts.all },
            { value: 'hot', label: '🔥 Hot Leads', count: leadCounts.hot },
            { value: 'warm', label: '🔶 Warm Leads', count: leadCounts.warm },
            { value: 'cold', label: '🔵 Cold Leads', count: leadCounts.cold }
          ];
        }
        case 'quotes': {
          const quoteCounts = {
            all: mockQuotes.length,
            pending: mockQuotes.filter(q => q.status === 'pending').length,
            approved: mockQuotes.filter(q => q.status === 'approved').length,
            expired: mockQuotes.filter(q => q.status === 'expired').length
          };
          return [
            { value: 'all', label: 'All Quotes', count: quoteCounts.all },
            { value: 'pending', label: '⏳ Pending', count: quoteCounts.pending },
            { value: 'approved', label: '✅ Approved', count: quoteCounts.approved },
            { value: 'expired', label: '❌ Expired', count: quoteCounts.expired }
          ];
        }
        case 'orders':
          return [
            { value: 'all', label: 'All Orders', count: 5 },
            { value: 'production', label: '🟡 Production', count: 2 },
            { value: 'blocked', label: '⚠️ Blocked', count: 1 },
            { value: 'delivered', label: '✅ Delivered', count: 2 }
          ];
        case 'invoices':
          return [
            { value: 'all', label: 'All Invoices', count: 15 },
            { value: 'paid', label: '💰 Paid', count: 8 },
            { value: 'pending', label: '🟡 Pending', count: 5 },
            { value: 'overdue', label: '🔴 Overdue', count: 2 }
          ];
        case 'receivables': {
          const receivableCounts = {
            all: mockReceivables.length,
            current: mockReceivables.filter(r => r.agingCategory === 'current').length,
            aging30: mockReceivables.filter(r => r.agingCategory === '31-60').length,
            aging60: mockReceivables.filter(r => r.agingCategory === '61-90').length,
            overdue: mockReceivables.filter(r => r.agingCategory === '90+').length,
            critical: mockReceivables.filter(r => r.customerRisk === 'critical').length
          };
          return [
            { value: 'all', label: 'All Receivables', count: receivableCounts.all },
            { value: 'current', label: '💚 Current (0-30)', count: receivableCounts.current },
            { value: 'aging_30', label: '🟡 31-60 Days', count: receivableCounts.aging30 },
            { value: 'aging_60', label: '🟠 61-90 Days', count: receivableCounts.aging60 },
            { value: 'overdue', label: '🔴 90+ Days', count: receivableCounts.overdue },
            { value: 'critical', label: '⚠️ Critical Risk', count: receivableCounts.critical }
          ];
        }
        case 'payables': {
          const payableCounts = {
            all: mockPayables.length,
            dueToday: mockPayables.filter(p => p.daysToDue === 0).length,
            dueThisWeek: mockPayables.filter(p => p.daysToDue >= 0 && p.daysToDue <= 7).length,
            upcoming: mockPayables.filter(p => p.daysToDue > 7).length,
            overdue: mockPayables.filter(p => p.daysToDue < 0).length,
            critical: mockPayables.filter(p => p.criticalSupplier).length
          };
          return [
            { value: 'all', label: 'All Payables', count: payableCounts.all },
            { value: 'due_today', label: '🟡 Due Today', count: payableCounts.dueToday },
            { value: 'due_week', label: '📅 Due This Week', count: payableCounts.dueThisWeek },
            { value: 'upcoming', label: '💚 Upcoming', count: payableCounts.upcoming },
            { value: 'overdue', label: '🔴 Overdue', count: payableCounts.overdue },
            { value: 'critical', label: '⚠️ Critical Suppliers', count: payableCounts.critical }
          ];
        }
        default:
          return [];
      }
    };
    
    const currentStatusFilters = getStatusFilters();
    
    // Find the selected status filter's count
    const statusFilter = currentStatusFilters.find(filter => filter.value === currentStatusFilter);
    const baseCount = statusFilter ? statusFilter.count : 0;
    
    // Apply timeline filter modifier (simplified calculation)
    let timelineModifier = 1;
    switch(timelineFilter) {
      case 'today': timelineModifier = 0.1; break;
      case 'thisweek': timelineModifier = 0.3; break;
      case 'thismonth': timelineModifier = 0.7; break;
      case 'all': 
      default: timelineModifier = 1; break;
    }
    
    return Math.round(baseCount * timelineModifier);
  }, [activeTab, leadFilterState, quoteFilterState, orderFilterState, invoiceFilterState, receivablesFilterState, payablesFilterState, timelineFilter]);

  // Intelligent scroll calculation
  const calculateScrollBehavior = useCallback(() => {
    const filteredCount = getFilteredCount();
    
    // Card template specifications (140px template)
    const cardHeight = 140;
    const cardSpacing = 16; // Gap between cards
    const containerPadding = 32; // Top/bottom padding in container
    
    // Calculate total content height needed
    const totalContentHeight = filteredCount > 0 
      ? (filteredCount * cardHeight) + ((filteredCount - 1) * cardSpacing) + containerPadding
      : 200; // Minimum height for empty state
    
    // Calculate available height (viewport minus fixed elements)
    const tabHeight = 48;
    const filterHeight = 44;  
    const ctaHeight = 56;
    const availableHeight = window.innerHeight - tabHeight - filterHeight - ctaHeight;
    
    // Show scrollbar if content exceeds available space
    const needsScroll = totalContentHeight > availableHeight;
    setShouldShowScrollbar(needsScroll);
  }, [getFilteredCount]);

  // Update scroll behavior when filters or tab changes
  useEffect(() => {
    calculateScrollBehavior();
    
    // Also recalculate on window resize
    const handleResize = () => calculateScrollBehavior();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateScrollBehavior]);


  // Render business filters for current tab
  const renderTabFilters = () => {
    const currentStatusFilters = statusFilterConfigs[activeTab as keyof typeof statusFilterConfigs];
    const currentStatusFilter = getCurrentFilterState();
    const filteredCount = getFilteredCount();

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterDropdowns}>
          {/* Status/Priority Dropdown */}
          <select 
            className={styles.filterDropdown}
            value={currentStatusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {currentStatusFilters.map((filter: { value: string; label: string; count: number }) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          
          {/* Timeline Filter Dropdown */}
          <select 
            className={styles.filterDropdown} 
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value)}
          >
            {timelineFilterConfig.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Count Indicator - Dynamic */}
        <div className={styles.countIndicator}>
          📊 {filteredCount}
        </div>
      </div>
    );
  };

  // Clean render function using configuration - TypeScript-safe approach
  const renderTabContent = () => {
    switch(activeTab) {
      case 'leads':
        return (
          <LeadManagement
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            onShowQuoteFromLead={() => setActiveTab('quotes')}
            onShowQuotationOrders={() => setActiveTab('quotes')}
            onShowSalesOrders={() => setActiveTab('orders')}
            filterState={leadFilterState}
            onFilterChange={setLeadFilterState}
            openAddModal={triggerLeadModal}
            onAddModalHandled={handleLeadModalHandled}
          />
        );
      case 'quotes':
        return (
          <QuotationOrders
            onShowSalesOrders={() => setActiveTab('orders')}
            onShowCustomerProfile={onShowCustomerProfile || (() => {})}
            onShowLeadManagement={() => setActiveTab('leads')}
            filterState={quoteFilterState}
            onFilterChange={setQuoteFilterState}
          />
        );
      case 'orders':
        return (
          <SalesOrders
            onShowLeadManagement={() => setActiveTab('leads')}
            onShowQuotationOrders={() => setActiveTab('quotes')}
            onShowPayments={() => setActiveTab('invoices')}
            filterState={orderFilterState}
            onFilterChange={setOrderFilterState}
          />
        );
      case 'invoices':
        return (
          <Invoices
            onShowQuotationOrders={() => setActiveTab('quotes')}
            onShowSalesOrders={() => setActiveTab('orders')}
            onShowCustomerProfile={onShowCustomerProfile}
            filterState={invoiceFilterState}
            onFilterChange={setInvoiceFilterState}
          />
        );
      case 'receivables':
        return (
          <ReceivablesManagement
            filterState={receivablesFilterState}
            onFilterChange={setReceivablesFilterState}
            onShowCustomerProfile={onShowCustomerProfile}
          />
        );
      case 'payables':
        return (
          <PayablesManagement
            filterState={payablesFilterState}
            onFilterChange={setPayablesFilterState}
          />
        );
      default:
        return null;
    }
  };

  // Get contextual CTA text for current tab
  const getContextualCTA = (tab: TabType): string => {
    switch(tab) {
      case 'leads': return '+ Add Lead';
      case 'quotes': return '+ Add Quote';
      case 'orders': return '+ New Order';
      case 'invoices': return '+ New Invoice';
      case 'receivables': return '+ Record Payment';
      case 'payables': return '+ New Bill';
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'leads':
        setTriggerLeadModal(true);
        break;
      case 'quotes':
        alert('Add Quote functionality coming soon!');
        break;
      case 'orders':
        alert('Add Order functionality coming soon!');
        break;
      case 'invoices':
        alert('Add Invoice functionality coming soon!');
        break;
      case 'receivables':
        alert('Record Payment functionality coming soon!');
        break;
      case 'payables':
        alert('Add Bill functionality coming soon!');
        break;
      default:
        break;
    }
  };

  // Handle when LeadManagement modal is handled
  const handleLeadModalHandled = () => {
    setTriggerLeadModal(false);
  };

  return (
    <div className={styles.salesModule}>
      {/* 48px Tab Navigation - Visual Design Spec */}
      <div className={styles.salesTabs} ref={tabsRef}>
        <button 
          ref={(el) => { tabRefs.current.leads = el; }}
          className={`${styles.tabButton} ${activeTab === 'leads' ? styles.active : ''}`}
          onClick={() => handleTabChange('leads')}
        >
          Leads
        </button>
        <button 
          ref={(el) => { tabRefs.current.quotes = el; }}
          className={`${styles.tabButton} ${activeTab === 'quotes' ? styles.active : ''}`}
          onClick={() => handleTabChange('quotes')}
        >
          Quotes
        </button>
        <button 
          ref={(el) => { tabRefs.current.orders = el; }}
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          Orders
        </button>
        <button 
          ref={(el) => { tabRefs.current.invoices = el; }}
          className={`${styles.tabButton} ${activeTab === 'invoices' ? styles.active : ''}`}
          onClick={() => handleTabChange('invoices')}
        >
          Invoices
        </button>
        <button 
          ref={(el) => { tabRefs.current.receivables = el; }}
          className={`${styles.tabButton} ${activeTab === 'receivables' ? styles.active : ''}`}
          onClick={() => handleTabChange('receivables')}
        >
          Receivables
        </button>
        <button 
          ref={(el) => { tabRefs.current.payables = el; }}
          className={`${styles.tabButton} ${activeTab === 'payables' ? styles.active : ''}`}
          onClick={() => handleTabChange('payables')}
        >
          Payables
        </button>
      </div>
      
      {/* 44px Business Filters */}
      <div className={styles.salesFilters}>
        {renderTabFilters()}
      </div>
      
      {/* Content Area */}
      <div className={`${styles.salesContent} ${shouldShowScrollbar ? styles.scrollable : ''}`}>
        {renderTabContent()}
      </div>
      
      {/* 56px Bottom CTA */}
      <div className={styles.salesCTA}>
        <button className={styles.salesCTAButton} onClick={handleCTAClick}>
          {getContextualCTA(activeTab)}
        </button>
      </div>
    </div>
  );
};

export default Sales;