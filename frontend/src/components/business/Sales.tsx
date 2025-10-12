import React, { useState } from 'react';
import { ActionParams } from '../../services/nlp/types';
import styles from './Sales.module.css';

interface SalesProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type TabType = 'leads' | 'quotes' | 'orders' | 'invoices';

const Sales = ({ mobile, onShowCustomerProfile, onUniversalAction }: SalesProps) => {
  // State Management
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [leadFilterState, setLeadFilterState] = useState('all');
  const [quoteFilterState, setQuoteFilterState] = useState('all');
  const [orderFilterState, setOrderFilterState] = useState('all');
  const [invoiceFilterState, setInvoiceFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('thismonth'); // Universal timeline filter

  // Status filter configurations for each tab (Filter 1)
  const statusFilterConfigs = {
    leads: [
      { value: 'all', label: 'All Leads', count: 12 },
      { value: 'hot', label: '🔥 Hot Leads', count: 3 },
      { value: 'warm', label: '🔶 Warm Leads', count: 5 },
      { value: 'cold', label: '🔵 Cold Leads', count: 4 }
    ],
    quotes: [
      { value: 'all', label: 'All Quotes', count: 8 },
      { value: 'pending', label: '⏳ Pending', count: 3 },
      { value: 'approved', label: '✅ Approved', count: 2 },
      { value: 'expired', label: '❌ Expired', count: 3 }
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

  // Timeline filter configuration (Filter 2) - Universal across all tabs
  const timelineFilterConfig = [
    { value: 'today', label: 'Today' },
    { value: 'thisweek', label: 'This Week' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'thisquarter', label: 'This Quarter' }
  ];

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
  const getFilteredCount = () => {
    const currentStatusFilters = statusFilterConfigs[activeTab];
    const currentStatusFilter = getCurrentFilterState();
    
    // Find the selected status filter's count
    const statusFilter = currentStatusFilters.find(filter => filter.value === currentStatusFilter);
    const baseCount = statusFilter ? statusFilter.count : 0;
    
    // Apply timeline filter modifier (simplified calculation)
    let timelineModifier = 1;
    switch(timelineFilter) {
      case 'today': timelineModifier = 0.1; break;
      case 'thisweek': timelineModifier = 0.3; break;
      case 'thismonth': timelineModifier = 0.7; break;
      case 'thisquarter': timelineModifier = 1; break;
    }
    
    return Math.round(baseCount * timelineModifier);
  };

  // Render business filters for current tab
  const renderTabFilters = () => {
    const currentStatusFilters = statusFilterConfigs[activeTab];
    const currentStatusFilter = getCurrentFilterState();
    const filteredCount = getFilteredCount();

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterDropdowns}>
          {/* Filter 1: Status/Priority Dropdown */}
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
          
          {/* Filter 2: Timeline Dropdown */}
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

  // SIMPLIFIED PLACEHOLDER CONTENT FOR TESTING
  const renderTabContent = () => {
    return (
      <div style={{padding: '20px'}}>
        <h2>Currently viewing: {activeTab.toUpperCase()} tab</h2>
        <div style={{height: '200px', background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
          <p>Placeholder content for {activeTab} tab</p>
          <p>This should scroll if there's overflow</p>
          <p>Filter state: {getCurrentFilterState()}</p>
          <p>Timeline filter: {timelineFilter}</p>
        </div>
        <div style={{height: '200px', background: '#e0e0e0', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
          <p>Second placeholder div to test scrolling</p>
          <p>Active tab: {activeTab}</p>
          <p>Filtered count: {getFilteredCount()}</p>
        </div>
        <div style={{height: '200px', background: '#d0d0d0', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
          <p>Third placeholder div</p>
          <p>This content should scroll while tabs and CTA stay fixed</p>
        </div>
        <div style={{height: '200px', background: '#c0c0c0', padding: '20px', borderRadius: '8px'}}>
          <p>Final placeholder div to test scroll behavior</p>
          <p>CTA should always be visible at bottom</p>
        </div>
      </div>
    );
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
    // TODO: Connect to existing component add functions when re-integrating
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
      <div className={styles.salesContent}>
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