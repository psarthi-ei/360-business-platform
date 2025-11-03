import React, { useState, useCallback } from 'react';
import { ActionParams } from '../../services/nlp/types';
import { 
  mockConsolidatedPurchaseRequests, 
  mockPurchaseOrders
} from '../../data/procurementMockData';
import {
  getInventorySummary,
  getExpiringChemicals
} from '../../data/inventoryMockData';
import { SalesOrder } from '../../data/salesMockData';
import styles from './Procurement.module.css';
import MaterialRequirements from './MaterialRequirements';
import PurchaseRequests from './PurchaseRequests';
import PurchaseOrders from './PurchaseOrders';
import GoodsReceiptNotes from './GoodsReceiptNotes';
import InventoryManagement from './InventoryManagement';

interface ProcurementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type ProcurementTabType = 'mr' | 'prs' | 'pos' | 'grns' | 'inventory';

// Material status count calculator for all sales orders
const calculateMaterialStatusCounts = () => {
  // Import mock sales orders and helper functions to calculate status counts
  const { mockSalesOrders } = require('../../data/salesMockData');
  const { checkOrderMaterialAvailability } = require('../../data/materialHelpers');
  
  interface OrderWithMaterialStatus {
    orderId: string;
    materialStatus: {
      overallStatus: 'available' | 'partial' | 'shortage';
    };
    deliveryDate: string;
  }
  
  const allOrders: OrderWithMaterialStatus[] = mockSalesOrders.map((order: SalesOrder) => ({
    orderId: order.id,
    materialStatus: checkOrderMaterialAvailability(order.id),
    deliveryDate: order.deliveryDate
  }));
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return {
    all: allOrders.length,
    available: allOrders.filter((order: OrderWithMaterialStatus) => order.materialStatus.overallStatus === 'available').length,
    partial: allOrders.filter((order: OrderWithMaterialStatus) => order.materialStatus.overallStatus === 'partial').length,
    shortage: allOrders.filter((order: OrderWithMaterialStatus) => order.materialStatus.overallStatus === 'shortage').length,
    urgent: allOrders.filter((order: OrderWithMaterialStatus) => new Date(order.deliveryDate) <= nextWeek).length
  };
};

const calculatePRCounts = () => ({
  all: mockConsolidatedPurchaseRequests.length,
  pending: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'pending').length,
  approved: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'approved').length,
  rejected: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'rejected').length
});

const calculatePOCounts = () => {
  return {
    all: mockPurchaseOrders.length,
    open: mockPurchaseOrders.filter(po => po.status === 'open').length,
    delivered: mockPurchaseOrders.filter(po => po.status === 'delivered').length,
    cancelled: mockPurchaseOrders.filter(po => po.status === 'cancelled').length
  };
};

const Procurement = ({ mobile, onShowCustomerProfile, onUniversalAction }: ProcurementProps) => {
  // State Management
  const [activeTab, setActiveTab] = useState<ProcurementTabType>('mr');
  const [mrFilterState, setMrFilterState] = useState('all');
  const [prFilterState, setPrFilterState] = useState('all');
  const [poFilterState, setPoFilterState] = useState('all');
  const [grnFilterState, setGrnFilterState] = useState('all');
  const [inventoryFilterState, setInventoryFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Universal scroll behavior - always enabled for business modules (CSS handles it)
  
  // Modal trigger states for CTA button functionality
  const [triggerMRModal, setTriggerMRModal] = useState(false);
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All Time' },
    { value: 'today', label: '📅 Today' },
    { value: 'thisweek', label: '📅 This Week' },
    { value: 'thismonth', label: '📅 This Month' }
  ];
  
  // Dynamic count calculations
  const mrCounts = calculateMaterialStatusCounts();
  const prCounts = calculatePRCounts();
  const poCounts = calculatePOCounts();
  
  // Calculate inventory counts
  const inventorySummary = getInventorySummary();
  const inventoryCounts = {
    all: inventorySummary.totalItems,
    company: inventorySummary.companyItemsCount,
    client: inventorySummary.clientItemsCount,
    lowstock: inventorySummary.lowStockItems,
    expiring: getExpiringChemicals().length
  };
  
  // Status filter configurations for each tab (Filter 1) - Dynamic counts
  const statusFilterConfigs = {
    mr: [
      { value: 'all', label: 'All Orders', count: mrCounts.all },
      { value: 'available', label: '✅ Available', count: mrCounts.available },
      { value: 'partial', label: '⚠️ Partial', count: mrCounts.partial },
      { value: 'shortage', label: '🚫 Shortage', count: mrCounts.shortage },
      { value: 'urgent', label: '🔥 Urgent', count: mrCounts.urgent }
    ],
    prs: [
      { value: 'all', label: 'All Requests', count: prCounts.all },
      { value: 'pending', label: '⏳ Pending', count: prCounts.pending },
      { value: 'approved', label: '✅ Approved', count: prCounts.approved },
      { value: 'rejected', label: '❌ Rejected', count: prCounts.rejected }
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
    ],
    inventory: [
      { value: 'all', label: 'All Materials', count: inventoryCounts.all },
      { value: 'company', label: '🏢 Company Materials', count: inventoryCounts.company },
      { value: 'client', label: '👤 Client Materials', count: inventoryCounts.client },
      { value: 'lowstock', label: '⚠️ Low Stock', count: inventoryCounts.lowstock },
      { value: 'expiring', label: '⏰ Expiring Soon', count: inventoryCounts.expiring }
    ]
  };

  // Get current filter state based on active tab
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'mr': return mrFilterState;
      case 'prs': return prFilterState;
      case 'pos': return poFilterState;
      case 'grns': return grnFilterState;
      case 'inventory': return inventoryFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'mr': setMrFilterState(filter); break;
      case 'prs': setPrFilterState(filter); break;
      case 'pos': setPoFilterState(filter); break;
      case 'grns': setGrnFilterState(filter); break;
      case 'inventory': setInventoryFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'mr': return mrFilterState;
        case 'prs': return prFilterState;
        case 'pos': return poFilterState;
        case 'grns': return grnFilterState;
        case 'inventory': return inventoryFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations to avoid external dependency
    const getStatusFilters = () => {
      switch(activeTab) {
        case 'mr': {
          const mrCounts = calculateMaterialStatusCounts();
          return [
            { value: 'all', label: 'All Orders', count: mrCounts.all },
            { value: 'available', label: '✅ Available', count: mrCounts.available },
            { value: 'partial', label: '⚠️ Partial', count: mrCounts.partial },
            { value: 'shortage', label: '🚫 Shortage', count: mrCounts.shortage },
            { value: 'urgent', label: '🔥 Urgent', count: mrCounts.urgent }
          ];
        }
        case 'prs': {
          const prCounts = {
            all: mockConsolidatedPurchaseRequests.length,
            pending: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'pending').length,
            approved: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'approved').length,
            rejected: mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'rejected').length
          };
          return [
            { value: 'all', label: 'All Requests', count: prCounts.all },
            { value: 'pending', label: '⏳ Pending', count: prCounts.pending },
            { value: 'approved', label: '✅ Approved', count: prCounts.approved },
            { value: 'rejected', label: '❌ Rejected', count: prCounts.rejected }
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
        case 'inventory': {
          const invSummary = getInventorySummary();
          return [
            { value: 'all', label: 'All Materials', count: invSummary.totalItems },
            { value: 'company', label: '🏢 Company Materials', count: invSummary.companyItemsCount },
            { value: 'client', label: '👤 Client Materials', count: invSummary.clientItemsCount },
            { value: 'lowstock', label: '⚠️ Low Stock', count: invSummary.lowStockItems },
            { value: 'expiring', label: '⏰ Expiring Soon', count: getExpiringChemicals().length }
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
  }, [activeTab, mrFilterState, prFilterState, poFilterState, grnFilterState, inventoryFilterState, timelineFilter]);

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

  // Clean render function using configuration - TypeScript-safe approach
  const renderTabContent = () => {
    switch(activeTab) {
      case 'mr':
        return (
          <MaterialRequirements
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            filterState={mrFilterState}
            onFilterChange={setMrFilterState}
            openAddModal={triggerMRModal}
            onAddModalHandled={handleMRModalHandled}
          />
        );
      case 'prs':
        return (
          <PurchaseRequests
            filterState={prFilterState}
            onFilterChange={setPrFilterState}
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
          <GoodsReceiptNotes
            filterState={grnFilterState}
            onFilterChange={setGrnFilterState}
          />
        );
      case 'inventory':
        return (
          <InventoryManagement
            filterState={inventoryFilterState}
            onFilterChange={setInventoryFilterState}
          />
        );
      default:
        return null;
    }
  };

  // Get contextual CTA text for current tab
  const getContextualCTA = (tab: ProcurementTabType): string => {
    switch(tab) {
      case 'mr': return '+ Check Materials';
      case 'prs': return '+ New Request';
      case 'pos': return '+ New PO';
      case 'grns': return '+ Record Receipt';
      case 'inventory': return '+ Update Stock';
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'mr':
        setTriggerMRModal(true);
        break;
      case 'prs':
        alert('Add Purchase Request functionality coming soon!');
        break;
      case 'pos':
        alert('Add Purchase Order functionality coming soon!');
        break;
      case 'grns':
        alert('Record Goods Receipt functionality coming soon!');
        break;
      case 'inventory':
        alert('Update Stock functionality coming soon!');
        break;
      default:
        // Unknown tab - no action needed
    }
  };

  // Handle when MaterialRequirements modal is handled
  const handleMRModalHandled = () => {
    setTriggerMRModal(false);
  };

  return (
    <div className={styles.procurementModule}>
      {/* 48px Tab Navigation - Visual Design Spec */}
      <div className={styles.procurementTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'mr' ? styles.active : ''}`}
          onClick={() => setActiveTab('mr')}
        >
          MR
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'prs' ? styles.active : ''}`}
          onClick={() => setActiveTab('prs')}
        >
          PRs
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'pos' ? styles.active : ''}`}
          onClick={() => setActiveTab('pos')}
        >
          POs
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'grns' ? styles.active : ''}`}
          onClick={() => setActiveTab('grns')}
        >
          GRNs
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'inventory' ? styles.active : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
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