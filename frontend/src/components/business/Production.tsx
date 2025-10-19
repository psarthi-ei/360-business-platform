import React, { useState, useCallback, useEffect } from 'react';
import { ActionParams } from '../../services/nlp/types';
import styles from './Production.module.css';
import WorkOrderPlanning from './WorkOrderPlanning';
import LiveProductionTracking from './LiveProductionTracking';
import QualityControlManagement from './QualityControlManagement';
import DeliveryFulfillment from './DeliveryFulfillment';

interface ProductionProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type ProductionTabType = 'plan' | 'active' | 'qc' | 'ready';

// Mock data counts for dynamic filtering
const calculatePlanCounts = () => ({
  all: 8,
  pending: 3,
  scheduled: 2,
  materials_short: 3
});

const calculateActiveCounts = () => ({
  all: 12,
  in_progress: 5,
  on_hold: 2,
  completed_today: 5
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
  const [activeTab, setActiveTab] = useState<ProductionTabType>('plan');
  const [planFilterState, setPlanFilterState] = useState('all');
  const [activeFilterState, setActiveFilterState] = useState('all');
  const [qcFilterState, setQcFilterState] = useState('all');
  const [readyFilterState, setReadyFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // Intelligent scroll behavior state
  const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);
  
  // Modal trigger states for CTA button functionality
  const [triggerPlanModal, setTriggerPlanModal] = useState(false);
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All Time' },
    { value: 'today', label: '📅 Today' },
    { value: 'thisweek', label: '📅 This Week' },
    { value: 'thismonth', label: '📅 This Month' }
  ];
  
  // Dynamic count calculations
  const planCounts = calculatePlanCounts();
  const activeCounts = calculateActiveCounts();
  const qcCounts = calculateQCCounts();
  const readyCounts = calculateReadyCounts();
  
  // Status filter configurations for each tab (Filter 1) - Dynamic counts
  const statusFilterConfigs = {
    plan: [
      { value: 'all', label: 'All Orders', count: planCounts.all },
      { value: 'pending', label: '⏳ Pending WO', count: planCounts.pending },
      { value: 'scheduled', label: '📅 Scheduled', count: planCounts.scheduled },
      { value: 'materials_short', label: '⚠️ Materials Short', count: planCounts.materials_short }
    ],
    active: [
      { value: 'all', label: 'All Work Orders', count: activeCounts.all },
      { value: 'in_progress', label: '🟡 In Progress', count: activeCounts.in_progress },
      { value: 'on_hold', label: '🔴 On Hold', count: activeCounts.on_hold },
      { value: 'completed_today', label: '✅ Completed Today', count: activeCounts.completed_today }
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
      case 'plan': return planFilterState;
      case 'active': return activeFilterState;
      case 'qc': return qcFilterState;
      case 'ready': return readyFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active tab
  const handleFilterChange = (filter: string) => {
    switch(activeTab) {
      case 'plan': setPlanFilterState(filter); break;
      case 'active': setActiveFilterState(filter); break;
      case 'qc': setQcFilterState(filter); break;
      case 'ready': setReadyFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency
    const currentStatusFilter = (() => {
      switch(activeTab) {
        case 'plan': return planFilterState;
        case 'active': return activeFilterState;
        case 'qc': return qcFilterState;
        case 'ready': return readyFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations to avoid external dependency
    const getStatusFilters = () => {
      switch(activeTab) {
        case 'plan': {
          const planCounts = { all: 8, pending: 3, scheduled: 2, materials_short: 3 };
          return [
            { value: 'all', label: 'All Orders', count: planCounts.all },
            { value: 'pending', label: '⏳ Pending WO', count: planCounts.pending },
            { value: 'scheduled', label: '📅 Scheduled', count: planCounts.scheduled },
            { value: 'materials_short', label: '⚠️ Materials Short', count: planCounts.materials_short }
          ];
        }
        case 'active': {
          const activeCounts = { all: 12, in_progress: 5, on_hold: 2, completed_today: 5 };
          return [
            { value: 'all', label: 'All Work Orders', count: activeCounts.all },
            { value: 'in_progress', label: '🟡 In Progress', count: activeCounts.in_progress },
            { value: 'on_hold', label: '🔴 On Hold', count: activeCounts.on_hold },
            { value: 'completed_today', label: '✅ Completed Today', count: activeCounts.completed_today }
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
  }, [activeTab, planFilterState, activeFilterState, qcFilterState, readyFilterState, timelineFilter]);

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
          🏭 {filteredCount}
        </div>
      </div>
    );
  };

  // Clean render function using configuration - TypeScript-safe approach
  const renderTabContent = () => {
    switch(activeTab) {
      case 'plan':
        return (
          <WorkOrderPlanning
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            filterState={planFilterState}
            onFilterChange={setPlanFilterState}
            openAddModal={triggerPlanModal}
            onAddModalHandled={handlePlanModalHandled}
          />
        );
      case 'active':
        return (
          <LiveProductionTracking
            filterState={activeFilterState}
            onFilterChange={setActiveFilterState}
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
      case 'plan': return '+ Create Work Order';
      case 'active': return '+ Start Production';
      case 'qc': return '+ Quality Check';
      case 'ready': return '+ Mark Ready';
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active tab
  const handleCTAClick = () => {
    switch(activeTab) {
      case 'plan':
        setTriggerPlanModal(true);
        break;
      case 'active':
        alert('Start Production functionality coming soon!');
        break;
      case 'qc':
        alert('Quality Check functionality coming soon!');
        break;
      case 'ready':
        alert('Mark Ready functionality coming soon!');
        break;
      default:
        // Unknown tab - no action needed
    }
  };

  // Handle when ProductionPlan modal is handled
  const handlePlanModalHandled = () => {
    setTriggerPlanModal(false);
  };

  return (
    <div className={styles.productionModule}>
      {/* 48px Tab Navigation - Visual Design Spec */}
      <div className={styles.productionTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'plan' ? styles.active : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          Plan
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
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
      
      {/* 56px Bottom CTA */}
      <div className={styles.productionCTA}>
        <button className={styles.productionCTAButton} onClick={handleCTAClick}>
          {getContextualCTA(activeTab)}
        </button>
      </div>
    </div>
  );
};

export default Production;