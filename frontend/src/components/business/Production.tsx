import React, { useState, useCallback, useEffect } from 'react';
import { ActionParams } from '../../services/nlp/types';
import styles from './Production.module.css';
import ProductionOrderManagement from './ProductionOrderManagement';
import WorkOrderPlanning from './WorkOrderPlanning';
import QualityControlManagement from './QualityControlManagement';
import DeliveryFulfillment from './DeliveryFulfillment';

interface ProductionProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type ProductionTabType = 'orders' | 'wo' | 'qc' | 'ready';

// CTA visibility configuration - easy to modify for any tab
const CTA_CONFIG = {
  orders: { showCTA: false },      // Hide CTA for Orders tab
  wo: { showCTA: false },          // Hide CTA for Work Orders (exception case usage)
  qc: { showCTA: false },          // Hide CTA for QC (card-driven workflow)
  ready: { showCTA: false }        // Hide CTA for Ready (card-driven workflow)
} as const;

// Mock data counts for dynamic filtering
const calculateOrdersCounts = () => ({
  all: 8,
  not_started: 3,
  in_production: 4,
  material_pending: 1
});

const calculateWOCounts = () => ({
  all: 15,
  pending: 5,
  running: 7,
  completed: 3
});

const calculateQCCounts = () => ({
  all: 15,
  pending_inspection: 4,
  approved: 8,
  rejected: 3
});

const calculateReadyCounts = () => ({
  all: 10,
  ready_dispatch: 6,
  dispatched: 3,
  delivered: 1
});

const Production = ({ mobile, onShowCustomerProfile, onUniversalAction }: ProductionProps) => {
  // State Management
  const [activeTab, setActiveTab] = useState<ProductionTabType>('orders');
  const [ordersFilterState, setOrdersFilterState] = useState('all');
  const [woFilterState, setWoFilterState] = useState('all');
  const [qcFilterState, setQcFilterState] = useState('all');
  const [readyFilterState, setReadyFilterState] = useState('all');
  const [machineFilter, setMachineFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Intelligent scroll behavior state
  const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);
  
  // Modal trigger states for CTA button functionality
  const [triggerOrdersModal, setTriggerOrdersModal] = useState(false);
  
  // Dynamic count calculations
  const ordersCounts = calculateOrdersCounts();
  const woCounts = calculateWOCounts();
  const qcCounts = calculateQCCounts();
  const readyCounts = calculateReadyCounts();
  
  // Machine filter configuration for WO tab
  const machineFilterConfig = [
    { value: 'all', label: '🏭 All Machines' },
    { value: 'LOOM-A1', label: 'LOOM-A1' },
    { value: 'LOOM-B1', label: 'LOOM-B1' },
    { value: 'DYE-D1', label: 'DYE-D1' },
    { value: 'FINISH-F1', label: 'FINISH-F1' }
  ];
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All Time' },
    { value: 'today', label: '📅 Today' },
    { value: 'thisweek', label: '📅 This Week' },
    { value: 'thismonth', label: '📅 This Month' }
  ];
  
  // Status filter configurations for each tab (Filter 1) - Dynamic counts
  const statusFilterConfigs = {
    orders: [
      { value: 'all', label: 'All Orders', count: ordersCounts.all },
      { value: 'not_started', label: '🟡 Not Started', count: ordersCounts.not_started },
      { value: 'in_production', label: '🔵 In Production', count: ordersCounts.in_production },
      { value: 'material_pending', label: '🔴 Material Pending', count: ordersCounts.material_pending }
    ],
    wo: [
      { value: 'all', label: 'All Work Orders', count: woCounts.all },
      { value: 'pending', label: '🔴 Not Started', count: woCounts.pending },
      { value: 'running', label: '🟡 Running', count: woCounts.running },
      { value: 'completed', label: '✅ Completed', count: woCounts.completed },
      { value: 'unassigned', label: '⚪ Unassigned', count: 0 }
    ],
    qc: [
      { value: 'all', label: 'All Items', count: qcCounts.all },
      { value: 'pending_inspection', label: '🔍 Pending Inspection', count: qcCounts.pending_inspection },
      { value: 'approved', label: '✅ Approved', count: qcCounts.approved },
      { value: 'rejected', label: '❌ Rejected', count: qcCounts.rejected }
    ],
    ready: [
      { value: 'all', label: 'All Ready Items', count: readyCounts.all },
      { value: 'ready_dispatch', label: '📦 Ready for Dispatch', count: readyCounts.ready_dispatch },
      { value: 'dispatched', label: '🚚 Dispatched', count: readyCounts.dispatched },
      { value: 'delivered', label: '✅ Delivered', count: readyCounts.delivered }
    ]
  };

  // Get current filter state based on active tab
  const getCurrentFilterState = () => {
    switch(activeTab) {
      case 'orders': return ordersFilterState;
      case 'wo': return woFilterState;
      case 'qc': return qcFilterState;
      case 'ready': return readyFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'orders': setOrdersFilterState(filter); break;
      case 'wo': setWoFilterState(filter); break;
      case 'qc': setQcFilterState(filter); break;
      case 'ready': setReadyFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'orders': return ordersFilterState;
        case 'wo': return woFilterState;
        case 'qc': return qcFilterState;
        case 'ready': return readyFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations to avoid external dependency
    const getStatusFilters = () => {
      switch(activeTab) {
        case 'orders': {
          const ordersCounts = { all: 8, not_started: 3, in_production: 4, material_pending: 1 };
          return [
            { value: 'all', label: 'All Orders', count: ordersCounts.all },
            { value: 'not_started', label: '🟡 Not Started', count: ordersCounts.not_started },
            { value: 'in_production', label: '🔵 In Production', count: ordersCounts.in_production },
            { value: 'material_pending', label: '🔴 Material Pending', count: ordersCounts.material_pending }
          ];
        }
        case 'wo': {
          const woCounts = { all: 15, pending: 5, running: 7, completed: 3, unassigned: 0 };
          return [
            { value: 'all', label: 'All Work Orders', count: woCounts.all },
            { value: 'pending', label: '🔴 Not Started', count: woCounts.pending },
            { value: 'running', label: '🟡 Running', count: woCounts.running },
            { value: 'completed', label: '✅ Completed', count: woCounts.completed },
            { value: 'unassigned', label: '⚪ Unassigned', count: woCounts.unassigned }
          ];
        }
        case 'qc': {
          const qcCounts = { all: 15, pending_inspection: 4, approved: 8, rejected: 3 };
          return [
            { value: 'all', label: 'All Items', count: qcCounts.all },
            { value: 'pending_inspection', label: '🔍 Pending Inspection', count: qcCounts.pending_inspection },
            { value: 'approved', label: '✅ Approved', count: qcCounts.approved },
            { value: 'rejected', label: '❌ Rejected', count: qcCounts.rejected }
          ];
        }
        case 'ready': {
          const readyCounts = { all: 10, ready_dispatch: 6, dispatched: 3, delivered: 1 };
          return [
            { value: 'all', label: 'All Ready Items', count: readyCounts.all },
            { value: 'ready_dispatch', label: '📦 Ready for Dispatch', count: readyCounts.ready_dispatch },
            { value: 'dispatched', label: '🚚 Dispatched', count: readyCounts.dispatched },
            { value: 'delivered', label: '✅ Delivered', count: readyCounts.delivered }
          ];
        }
        default: return [];
      }
    };
    
    const currentStatusFilters = getStatusFilters();
    
    // Find the selected status filter's count
    const statusFilter = currentStatusFilters.find(filter => filter.value === currentStatusFilter);
    const baseCount = statusFilter ? statusFilter.count : 0;
    
    // Apply machine filter modifier for WO tab
    let machineModifier = 1;
    if (activeTab === 'wo' && machineFilter !== 'all') {
      // Each machine handles roughly 25% of work orders
      machineModifier = 0.25;
    }
    
    // Apply timeline filter modifier (simplified calculation)
    let timelineModifier = 1;
    switch(timelineFilter) {
      case 'today': timelineModifier = 0.1; break;
      case 'thisweek': timelineModifier = 0.3; break;
      case 'thismonth': timelineModifier = 0.7; break;
      case 'all': 
      default: timelineModifier = 1; break;
    }
    
    return Math.round(baseCount * machineModifier * timelineModifier);
  }, [activeTab, ordersFilterState, woFilterState, qcFilterState, readyFilterState, machineFilter, timelineFilter]);

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
          
          {/* Machine Filter Dropdown - Only for WO tab */}
          {activeTab === 'wo' ? (
            <select 
              className={styles.filterDropdown} 
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
            >
              {machineFilterConfig.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          ) : (
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
          )}
        </div>
        
        {/* Count Indicator - Dynamic */}
        <div className={styles.countIndicator}>
          🏭 {filteredCount}
        </div>
      </div>
    );
  };

  // Clean render function using configuration - TypeScript-safe approach
  const renderTabContent = () => {
    switch(activeTab) {
      case 'orders':
        return (
          <ProductionOrderManagement
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            filterState={ordersFilterState}
            onFilterChange={setOrdersFilterState}
            openAddModal={triggerOrdersModal}
            onAddModalHandled={handleOrdersModalHandled}
          />
        );
      case 'wo':
        return (
          <WorkOrderPlanning
            mobile={mobile}
            filterState={woFilterState}
            onFilterChange={setWoFilterState}
            machineFilter={machineFilter}
          />
        );
      case 'qc':
        return (
          <QualityControlManagement
            filterState={qcFilterState}
            onFilterChange={setQcFilterState}
          />
        );
      case 'ready':
        return (
          <DeliveryFulfillment
            filterState={readyFilterState}
            onFilterChange={setReadyFilterState}
          />
        );
      default:
        return null;
    }
  };

  // Get contextual CTA text for current tab
  const getContextualCTA = (tab: ProductionTabType): string => {
    switch(tab) {
      case 'orders': return '+ Start Production';
      case 'wo': return '+ Create Work Order';
      case 'qc': return '+ Quality Check';
      case 'ready': return '+ Pack & Dispatch';
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'orders':
        setTriggerOrdersModal(true);
        break;
      case 'wo':
        alert('Create Work Order functionality coming soon!');
        break;
      case 'qc':
        alert('Quality Check functionality coming soon!');
        break;
      case 'ready':
        alert('Pack & Dispatch functionality coming soon!');
        break;
      default:
        // Unknown tab - no action needed
    }
  };

  // Handle when ProductionOrders modal is handled
  const handleOrdersModalHandled = () => {
    setTriggerOrdersModal(false);
  };

  // Dynamic CTA visibility control
  const shouldHideCTA = !CTA_CONFIG[activeTab]?.showCTA;

  return (
    <div className={`${styles.productionModule} ${shouldHideCTA ? styles.noCTA : ''}`}>
      {/* 48px Tab Navigation - Visual Design Spec */}
      <div className={styles.productionTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'wo' ? styles.active : ''}`}
          onClick={() => setActiveTab('wo')}
        >
          WO
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'qc' ? styles.active : ''}`}
          onClick={() => setActiveTab('qc')}
        >
          QC
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'ready' ? styles.active : ''}`}
          onClick={() => setActiveTab('ready')}
        >
          Ready
        </button>
      </div>
      
      {/* 44px Business Filters */}
      <div className={styles.productionFilters}>
        {renderTabFilters()}
      </div>
      
      {/* Content Area */}
      <div className={`${styles.productionContent} ${shouldShowScrollbar ? styles.scrollable : ''}`}>
        {renderTabContent()}
      </div>
      
      {/* 56px Bottom CTA - Configuration-driven visibility */}
      {!shouldHideCTA && (
        <div className={styles.productionCTA}>
          <button className={styles.productionCTAButton} onClick={handleCTAClick}>
            {getContextualCTA(activeTab)}
          </button>
        </div>
      )}
    </div>
  );
};

export default Production;