import React, { useState, useCallback, useEffect } from 'react';
import { ActionParams } from '../../services/nlp/types';
import { mockLeads } from '../../data/salesMockData';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './Sales.module.css';
import LeadManagement from './LeadManagement';
import SalesOrders from './SalesOrders';
import Invoices from './Invoices';

interface SalesProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type TabType = 'leads' | 'orders' | 'invoices';

// Dynamic count calculator functions - MVP simplified
const calculateLeadCounts = () => ({
  all: mockLeads.length,
  hot: mockLeads.filter(l => l.priority === 'hot').length,
  warm: mockLeads.filter(l => l.priority === 'warm').length,
  cold: mockLeads.filter(l => l.priority === 'cold').length
});

const Sales = ({ mobile, onShowCustomerProfile, onUniversalAction }: SalesProps) => {
  // State Management - MVP simplified
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [leadFilterState, setLeadFilterState] = useState('all');
  const [orderFilterState, setOrderFilterState] = useState('all');
  const [invoiceFilterState, setInvoiceFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Get terminology for UI labels
  const { lead, leads, invoice, invoices, order, orders } = useTerminologyTerms();
  
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
  
  // Dynamic count calculations - MVP simplified
  const leadCounts = calculateLeadCounts();


  // Simple tab change handler - MVP simplified
  const handleTabChange = useCallback((tabType: TabType) => {
    setActiveTab(tabType);
  }, []);
  
  // Status filter configurations for each tab (Filter 1) - MVP simplified
  const statusFilterConfigs = {
    leads: [
      { value: 'all', label: 'All Leads', count: leadCounts.all },
      { value: 'hot', label: '🔥 Hot Leads', count: leadCounts.hot },
      { value: 'warm', label: '🔶 Warm Leads', count: leadCounts.warm },
      { value: 'cold', label: '🔵 Cold Leads', count: leadCounts.cold }
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

  // Get current filter state based on active tab - MVP simplified
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'leads': return leadFilterState;
      case 'orders': return orderFilterState;
      case 'invoices': return invoiceFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab - MVP simplified
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'leads': setLeadFilterState(filter); break;
      case 'orders': setOrderFilterState(filter); break;
      case 'invoices': setInvoiceFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency - MVP simplified
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'leads': return leadFilterState;
        case 'orders': return orderFilterState;
        case 'invoices': return invoiceFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations - MVP simplified
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
  }, [activeTab, leadFilterState, orderFilterState, invoiceFilterState, timelineFilter]);

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

  // Clean render function using configuration - MVP simplified
  const renderTabContent = () => {
    switch(activeTab) {
      case 'leads':
        return (
          <LeadManagement
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            onShowQuoteFromLead={() => {}} // Quote functionality integrated into LeadManagement
            onShowSalesOrders={() => setActiveTab('orders')}
            filterState={leadFilterState}
            onFilterChange={setLeadFilterState}
            openAddModal={triggerLeadModal}
            onAddModalHandled={handleLeadModalHandled}
          />
        );
      case 'orders':
        return (
          <SalesOrders
            onShowLeadManagement={() => setActiveTab('leads')}
            onShowQuotationOrders={() => setActiveTab('leads')} // Quotes handled in leads tab
            onShowPayments={() => setActiveTab('invoices')}
            filterState={orderFilterState}
            onFilterChange={setOrderFilterState}
          />
        );
      case 'invoices':
        return (
          <Invoices
            onShowQuotationOrders={() => setActiveTab('leads')} // Quotes handled in leads tab
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

  // Get contextual CTA text for current tab with terminology
  const getContextualCTA = (tab: TabType): string => {
    switch(tab) {
      case 'leads': return `+ Add ${lead}`; // "+ Add Inquiry"
      case 'orders': return `+ New ${order}`; // "+ New Job Order" 
      case 'invoices': return `+ New ${invoice}`; // "+ New Job Bill"
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab - MVP simplified
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'leads':
        setTriggerLeadModal(true);
        break;
      case 'orders':
        alert(`Add ${order} functionality coming soon!`);
        break;
      case 'invoices':
        alert(`Add ${invoice} functionality coming soon!`); // "Add Job Bill functionality"
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
      {/* 48px Tab Navigation - Visual Design Spec - MVP Simplified */}
      <div className={styles.salesTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'leads' ? styles.active : ''}`}
          onClick={() => handleTabChange('leads')}
        >
          {leads}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          {orders}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'invoices' ? styles.active : ''}`}
          onClick={() => handleTabChange('invoices')}
        >
          {invoices}
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