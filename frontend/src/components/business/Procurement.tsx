import React, { useState, useCallback } from 'react';
import { ActionParams } from '../../services/nlp/types';
import { mockPurchaseOrders } from '../../data/procurementMockData';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import {
  getInventorySummary,
  getExpiringChemicals
} from '../../data/inventoryMockData';
import styles from './Procurement.module.css';
import PurchaseOrders from './PurchaseOrders';
import InwardManagement from './InwardManagement';
import InventoryManagement from './InventoryManagement';

interface ProcurementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type ProcurementTabType = 'inventory' | 'pos' | 'grns';

// Removed complex count calculations for MR and PR tabs
// as per MVP simplification plan

const calculatePOCounts = () => {
  return {
    all: mockPurchaseOrders.length,
    open: mockPurchaseOrders.filter(po => po.status === 'open').length,
    delivered: mockPurchaseOrders.filter(po => po.status === 'delivered').length,
    cancelled: mockPurchaseOrders.filter(po => po.status === 'cancelled').length
  };
};

const Procurement = ({ mobile, onShowCustomerProfile, onUniversalAction }: ProcurementProps) => {
  // State Management - MVP simplified
  const [activeTab, setActiveTab] = useState<ProcurementTabType>('inventory');
  const [poFilterState, setPoFilterState] = useState('all');
  const [grnFilterState, setGrnFilterState] = useState('all');
  const [inventoryFilterState, setInventoryFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Get terminology for UI labels
  const { goodsReceiptNote, inventory, customer: party } = useTerminologyTerms();
  
  // Universal scroll behavior - always enabled for business modules (CSS handles it)
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All Time' },
    { value: 'today', label: '📅 Today' },
    { value: 'thisweek', label: '📅 This Week' },
    { value: 'thismonth', label: '📅 This Month' }
  ];
  
  // Dynamic count calculations - MVP simplified
  const poCounts = calculatePOCounts();
  // Removed MR and PR counts per MVP simplification
  
  // Calculate inventory counts
  const inventorySummary = getInventorySummary();
  const inventoryCounts = {
    all: inventorySummary.totalItems,
    company: inventorySummary.companyItemsCount,
    party: inventorySummary.clientItemsCount, // Using 'party' instead of 'client'
    lowstock: inventorySummary.lowStockItems,
    expiring: getExpiringChemicals().length
  };
  
  // Status filter configurations for each tab (Filter 1) - MVP simplified
  const statusFilterConfigs = {
    inventory: [
      { value: 'all', label: `All ${inventory}`, count: inventoryCounts.all },
      { value: 'company', label: '🏢 Company Materials', count: inventoryCounts.company },
      { value: 'party', label: `👤 ${party} Materials`, count: inventoryCounts.party },
      { value: 'lowstock', label: '⚠️ Low Stock', count: inventoryCounts.lowstock },
      { value: 'expiring', label: '⏰ Expiring Soon', count: inventoryCounts.expiring }
    ],
    pos: [
      { value: 'all', label: 'All Orders', count: poCounts.all },
      { value: 'open', label: '⏳ Open', count: poCounts.open },
      { value: 'delivered', label: '✅ Delivered', count: poCounts.delivered },
      { value: 'cancelled', label: '❌ Cancelled', count: poCounts.cancelled }
    ],
    grns: [
      { value: 'all', label: 'All Receipts', count: 18 },
      { value: 'pending', label: '⏳ Pending QC', count: 6 },
      { value: 'approved', label: '✅ Approved', count: 10 },
      { value: 'rejected', label: '❌ Rejected', count: 2 }
    ]
  };

  // Get current filter state based on active tab - MVP simplified
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'inventory': return inventoryFilterState;
      case 'pos': return poFilterState;
      case 'grns': return grnFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab - MVP simplified
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'inventory': setInventoryFilterState(filter); break;
      case 'pos': setPoFilterState(filter); break;
      case 'grns': setGrnFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency - MVP simplified
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'inventory': return inventoryFilterState;
        case 'pos': return poFilterState;
        case 'grns': return grnFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations - MVP simplified
    const getStatusFilters = () => {
      switch(activeTab) {
        case 'inventory': {
          const invSummary = getInventorySummary();
          return [
            { value: 'all', label: `All ${inventory}`, count: invSummary.totalItems },
            { value: 'company', label: '🏢 Company Materials', count: invSummary.companyItemsCount },
            { value: 'party', label: `👤 ${party} Materials`, count: invSummary.clientItemsCount },
            { value: 'lowstock', label: '⚠️ Low Stock', count: invSummary.lowStockItems },
            { value: 'expiring', label: '⏰ Expiring Soon', count: getExpiringChemicals().length }
          ];
        }
        case 'pos': {
          const poCounts = calculatePOCounts();
          return [
            { value: 'all', label: 'All Orders', count: poCounts.all },
            { value: 'open', label: '⏳ Open', count: poCounts.open },
            { value: 'delivered', label: '✅ Delivered', count: poCounts.delivered },
            { value: 'cancelled', label: '❌ Cancelled', count: poCounts.cancelled }
          ];
        }
        case 'grns':
          return [
            { value: 'all', label: 'All Receipts', count: 18 },
            { value: 'pending', label: '⏳ Pending QC', count: 6 },
            { value: 'approved', label: '✅ Approved', count: 10 },
            { value: 'rejected', label: '❌ Rejected', count: 2 }
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
  }, [activeTab, inventoryFilterState, poFilterState, grnFilterState, timelineFilter, inventory, party]);

  // Universal scroll - no complex calculations needed, browser handles overflow automatically

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
          📦 {filteredCount}
        </div>
      </div>
    );
  };

  // Clean render function using configuration - MVP simplified
  const renderTabContent = () => {
    switch(activeTab) {
      case 'inventory':
        return (
          <InventoryManagement
            filterState={inventoryFilterState}
            onFilterChange={setInventoryFilterState}
          />
        );
      case 'pos':
        return (
          <PurchaseOrders
            filterState={poFilterState}
            onFilterChange={setPoFilterState}
          />
        );
      case 'grns':
        return (
          <InwardManagement
            filterState={grnFilterState}
            onFilterChange={setGrnFilterState}
          />
        );
      default:
        return null;
    }
  };

  // Get contextual CTA text for current tab with terminology
  const getContextualCTA = (tab: ProcurementTabType): string => {
    switch(tab) {
      case 'inventory': return '+ Update Stock';
      case 'pos': return '+ New PO';
      case 'grns': return `+ Record ${goodsReceiptNote}`; // "+ Record Inward"
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab - MVP simplified
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'inventory':
        alert('Update Stock functionality coming soon!');
        break;
      case 'pos':
        alert('Add Purchase Order functionality coming soon!');
        break;
      case 'grns':
        alert(`Record ${goodsReceiptNote} functionality coming soon!`); // "Record Inward functionality"
        break;
      default:
        // Unknown tab - no action needed
    }
  };

  return (
    <div className={styles.procurementModule}>
      {/* 48px Tab Navigation - Visual Design Spec - MVP Simplified */}
      <div className={styles.procurementTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'inventory' ? styles.active : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          {inventory}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'grns' ? styles.active : ''}`}
          onClick={() => setActiveTab('grns')}
        >
          {goodsReceiptNote}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'pos' ? styles.active : ''}`}
          onClick={() => setActiveTab('pos')}
        >
          Purchase Orders
        </button>
      </div>
      
      {/* 44px Business Filters */}
      <div className={styles.procurementFilters}>
        {renderTabFilters()}
      </div>
      
      {/* Content Area */}
      <div className={styles.procurementContent}>
        {renderTabContent()}
      </div>
      
      {/* 56px Bottom CTA */}
      <div className={styles.procurementCTA}>
        <button className={styles.procurementCTAButton} onClick={handleCTAClick}>
          {getContextualCTA(activeTab)}
        </button>
      </div>
    </div>
  );
};

export default Procurement;