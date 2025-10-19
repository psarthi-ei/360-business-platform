import React, { useState, useCallback, useEffect } from 'react';
import { ActionParams } from '../../services/nlp/types';
import { mockLeads, mockQuotes } from '../../data/mockData';
import styles from './Sales.module.css';
import LeadManagement from './LeadManagement';
import QuotationOrders from './QuotationOrders';
import SalesOrders from './SalesOrders';
import Invoices from './Invoices';

interface SalesProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type TabType = 'leads' | 'quotes' | 'orders' | 'invoices';

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

const Sales = ({ mobile, onShowCustomerProfile, onUniversalAction }: SalesProps) => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [leadFilterState, setLeadFilterState] = useState('all');
  const [quoteFilterState, setQuoteFilterState] = useState('all');
  const [orderFilterState, setOrderFilterState] = useState('all');
  const [invoiceFilterState, setInvoiceFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Intelligent scroll behavior state
  const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);
  
  // Modal trigger states for CTA button functionality
  const [triggerLeadModal, setTriggerLeadModal] = useState(false);
  
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
    ]
  };

  // Get current filter state based on active tab
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'leads': return leadFilterState;
      case 'quotes': return quoteFilterState;
      case 'orders': return orderFilterState;
      case 'invoices': return invoiceFilterState;
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
  }, [activeTab, leadFilterState, quoteFilterState, orderFilterState, invoiceFilterState, timelineFilter]);

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
    const currentStatusFilters = statusFilterConfigs[activeTab];
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
            {currentStatusFilters.map(filter => (
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
        // For now, show alert since no dedicated add modal exists
        alert('Add Quote functionality coming soon!');
        break;
      case 'orders':
        // For now, show alert since no dedicated add modal exists
        alert('Add Order functionality coming soon!');
        break;
      case 'invoices':
        // For now, show alert since no dedicated add modal exists
        alert('Add Invoice functionality coming soon!');
        break;
      default:
        // Unknown tab - no action needed
    }
  };

  // Handle when LeadManagement modal is handled
  const handleLeadModalHandled = () => {
    setTriggerLeadModal(false);
  };

  return (
    <div className={styles.salesModule}>
      {/* 48px Tab Navigation - Visual Design Spec */}
      <div className={styles.salesTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'leads' ? styles.active : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Leads
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'quotes' ? styles.active : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          Quotes
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'invoices' ? styles.active : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
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