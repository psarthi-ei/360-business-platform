import React, { useMemo, useState } from 'react';
import { mockSalesOrders, SalesOrder } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import ProgressBar from '../ui/ProgressBar';
import { getWorkOrdersBySalesOrder } from '../../data/productionMockData';
import styles from './ProductionOrderManagement.module.css';

interface ProductionOrderManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

// Material status interface
interface MaterialStatus {
  status: 'available' | 'shortage';
  icon: string;
  display: string;
  details: string | string[];
}

// Production status interface
interface ProductionStatus {
  status: 'not_started' | 'in_production' | 'completed' | 'material_pending';
  icon: string;
  label: string;
}

// Enhanced order interface with production context
interface ProductionOrderEnhanced extends SalesOrder {
  materialStatus: MaterialStatus;
  productionWorkflowStatus: ProductionStatus; // Renamed to avoid conflict
  productionProgress: number; // Progress percentage for in-production orders
  quantity: string; // Add quantity field for display
}

// Material availability checking logic
const getMaterialStatus = (order: SalesOrder): MaterialStatus => {
  // Handle explicit material pending status from sales order
  if (order.status === 'pending_materials') {
    return {
      status: 'shortage',
      icon: '⚠️',
      display: 'Shortage (Yarn, Dye)',
      details: ['Cotton Yarn 30s: 300kg short', 'Blue Dye: 50L short']
    };
  }
  
  // SO-002 has pending_materials status, so it will be handled above
  // Simulate material availability for other orders
  const hasShortage = order.totalAmount > 500000; // Very high-value orders may have complexity
  
  if (hasShortage) {
    return {
      status: 'shortage',
      icon: '⚠️',
      display: 'Shortage (Dye)',
      details: ['Special Dye: 25L short']
    };
  }
  
  return {
    status: 'available',
    icon: '✅',
    display: 'Available',
    details: 'All materials in stock'
  };
};

// Production status workflow mapping
const getProductionStatus = (order: SalesOrder, materialStatus: MaterialStatus): ProductionStatus => {
  // Handle pending_materials status (explicit material shortage)
  if (order.status === 'pending_materials') {
    return {
      status: 'material_pending',
      icon: '🔴',
      label: 'Material Pending'
    };
  }
  
  // Material shortage blocks production (for other statuses that haven't been handled above)
  if (materialStatus.status === 'shortage') {
    return {
      status: 'material_pending',
      icon: '🔴',
      label: 'Material Pending'
    };
  }
  
  // Production workflow states based on sales order status
  if (order.status === 'order_confirmed') {
    return {
      status: 'not_started',
      icon: '🟡',
      label: 'Not Started'
    };
  }
  
  if (order.status === 'production_started') {
    return {
      status: 'in_production',
      icon: '🔵',
      label: 'In Production'
    };
  }
  
  if (order.status === 'completed') {
    return {
      status: 'completed',
      icon: '🟢',
      label: 'Production Complete'
    };
  }
  
  return {
    status: 'not_started',
    icon: '🟡',
    label: 'Not Started'
  };
};

const ProductionOrderManagement: React.FC<ProductionOrderManagementProps> = ({
  mobile,
  onShowCustomerProfile,
  filterState,
  onFilterChange,
  openAddModal,
  onAddModalHandled
}) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // State for tab-based information display
  const [activeTab, setActiveTab] = useState<Map<string, 'work_orders' | 'details' | null>>(new Map());
  
  // Calculate production progress percentage
  const calculateProductionProgress = (order: SalesOrder): number => {
    // Completed orders show 100%
    if (order.status === 'completed') return 100;
    
    // Production started orders show realistic progress
    if (order.status === 'production_started') {
      // SO-003: Matches "60% completed" from mock data statusMessage
      if (order.id === 'SO-003') return 60; // "Production in progress - 60% completed"
      return 80; // Default progress for other production_started orders
    }
    
    return 0; // Not started or material pending
  };
  
  // Transform Sales Orders for production context
  const productionOrders = useMemo((): ProductionOrderEnhanced[] => {
    return mockSalesOrders
      .filter(order => ['order_confirmed', 'pending_materials', 'production_started', 'completed'].includes(order.status))
      .map(order => {
        const materialStatus = getMaterialStatus(order);
        const productionWorkflowStatus = getProductionStatus(order, materialStatus);
        const productionProgress = calculateProductionProgress(order);
        
        return {
          ...order,
          materialStatus,
          productionWorkflowStatus,
          productionProgress,
          quantity: '1000m' // Add default quantity for display
        };
      });
  }, []);
  
  // Apply filter state from parent Production component
  const filteredOrders = useMemo(() => {
    if (filterState === 'all') return productionOrders;
    
    return productionOrders.filter(order => {
      switch (filterState) {
        case 'not_started':
          return order.productionWorkflowStatus.status === 'not_started';
        case 'in_production':
          return order.productionWorkflowStatus.status === 'in_production';
        case 'material_pending':
          return order.productionWorkflowStatus.status === 'material_pending';
        default:
          return true;
      }
    });
  }, [productionOrders, filterState]);
  
  // Toggle card details
  const toggleDetails = (orderId: string) => {
    toggleExpansion(orderId, 'data-order-id');
  };
  
  // Production workflow actions
  const handleStartProduction = (orderId: string) => {
    alert(`🏭 Starting production for ${orderId}\n\n✅ Work Orders created\n📋 Materials reserved\n🔄 Status updated to "In Production"\n\n(Mock functionality - will integrate with Work Order system)`);
  };
  
  const handleGoToProcurement = (orderId: string) => {
    alert(`📦 Navigating to Procurement module for ${orderId}\n\n🔍 Material shortage details:\n• Cotton Yarn 30s: 300kg needed\n• Blue Dye: 50L needed\n\n(Mock functionality - will navigate to Procurement MR tab)`);
  };
  
  // Tab management functions
  const handleTabChange = (orderId: string, tab: 'work_orders' | 'details') => {
    setActiveTab(prev => {
      const newMap = new Map(prev);
      const currentTab = newMap.get(orderId);
      
      // Toggle off if clicking the same tab, otherwise switch to new tab
      if (currentTab === tab) {
        newMap.set(orderId, null);
      } else {
        newMap.set(orderId, tab);
      }
      
      return newMap;
    });
  };
  
  const getActiveTab = (orderId: string) => {
    return activeTab.get(orderId) || null;
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className={styles.productionOrdersScreen}>
      <div className={styles.pageContent}>
        <div className={styles.ordersContainer}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>📋 No orders found for current filter</p>
              <p>Switch to "All Orders" to see available orders</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const businessProfile = getBusinessProfileById(order.businessProfileId);
              const companyName = businessProfile?.companyName || 'Unknown Company';
              
              // Status mapping for global card classes
              const getCardStatusClass = () => {
                if (order.productionWorkflowStatus.status === 'completed') return 'ds-card-status-active';
                if (order.productionWorkflowStatus.status === 'in_production') return 'ds-card-status-pending';
                if (order.productionWorkflowStatus.status === 'material_pending') return 'ds-card-priority-high';
                return 'ds-card-status-pending'; // not_started
              };

              return (
                <div key={order.id} className="ds-card-container" data-order-id={order.id}>
                  {/* Global Card System - 140px Template */}
                  <div 
                    className={`ds-card ${getCardStatusClass()} ${isExpanded(order.id) ? 'ds-card-expanded' : ''}`}
                    onClick={() => toggleDetails(order.id)}
                  >
                    {/* Order Header - Company + Product */}
                    <div 
                      className="ds-card-header"
                      title={`${order.id} - ${companyName} - ${order.items}`}
                    >
                      <span>{order.id} — </span>
                      <span className={styles.truncateText}>{companyName}</span>
                    </div>
                    
                    {/* Status Information - Material & Production Status */}
                    <div className="ds-card-status">
                      <div className={styles.statusLine}>
                        {order.materialStatus.icon} {order.materialStatus.display}
                      </div>
                      <div className={styles.statusLine}>
                        {order.productionWorkflowStatus.icon} {order.productionWorkflowStatus.label}
                      </div>
                    </div>
                    
                    {/* Meta Information - Product Details & Due Date */}
                    <div 
                      className="ds-card-meta"
                      title={`${order.items} | Qty: ${order.quantity} | Due: ${order.deliveryDate}`}
                    >
                      {order.items} • {order.quantity}<br />
                      Due: {order.deliveryDate}
                    </div>

                    {/* Expand Indicator */}
                    <div className="ds-card-expand-indicator">
                      {isExpanded(order.id) ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Expanded Content - Basic Information + Action Buttons */}
                  {isExpanded(order.id) && (
                    <div className="ds-expanded-details">
                      <div className="ds-details-content">
                        <h4>🏭 Production Order Details</h4>
                        <p><strong>Customer:</strong> {companyName} ({businessProfile?.registeredAddress.city || 'Unknown'})</p>
                        <p><strong>Product Details:</strong> {order.items}</p>
                        <p><strong>Order Value:</strong> {formatCurrency(order.totalAmount)} • Delivery: {order.deliveryDate}</p>
                        <p><strong>Material Status:</strong> {order.materialStatus.icon} {order.materialStatus.display}</p>
                        <p><strong>Production Status:</strong> {order.productionWorkflowStatus.icon} {order.productionWorkflowStatus.label}</p>
                        <p><strong>Order Date:</strong> {order.orderDate}</p>
                        <p><strong>Payment Status:</strong> {order.paymentStatus === 'advance_received' ? '✅ Advance Received' : 
                           order.paymentStatus === 'completed' ? '✅ Fully Paid' : 
                           '🔴 Payment Pending'}</p>
                        {(order.balancePaymentDue !== undefined || order.paymentStatus === 'completed') && (
                          <p><strong>Balance Due:</strong> {formatCurrency(order.balancePaymentDue || 0)}</p>
                        )}
                        
                        {/* Progress Bar for In-Production Orders */}
                        {order.productionWorkflowStatus.status === 'in_production' && order.productionProgress > 0 && (
                          <div className={styles.progressBarContainer}>
                            <strong>Production Progress:</strong> <ProgressBar percentage={order.productionProgress} size="sm" />
                            <span className={styles.progressText}>({order.productionProgress}% completed)</span>
                          </div>
                        )}
                        
                        {/* Material Details for Shortage */}
                        {order.materialStatus.status === 'shortage' && (
                          <div className={styles.materialShortageDetails}>
                            <p><strong>⚠️ Material Shortage Details:</strong></p>
                            <ul>
                              {Array.isArray(order.materialStatus.details) 
                                ? order.materialStatus.details.map((detail: string, index: number) => (
                                    <li key={index}>{detail}</li>
                                  ))
                                : <li>{order.materialStatus.details}</li>
                              }
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons - Status-based Conditional Rendering */}
                      <div className={styles.cardActions}>
                        <div className={styles.actionButtons}>
                          {/* Start Production - Available for orders with materials ready */}
                          {order.productionWorkflowStatus.status === 'not_started' && order.materialStatus.status === 'available' && (
                            <button 
                              className="ds-btn ds-btn-primary" 
                              onClick={(e) => { e.stopPropagation(); handleStartProduction(order.id); }}
                            >
                              🏭 Start Production
                            </button>
                          )}
                          
                          {/* Go to Procurement - For material shortage issues */}
                          {order.materialStatus.status === 'shortage' && (
                            <button 
                              className="ds-btn ds-btn-secondary" 
                              onClick={(e) => { e.stopPropagation(); handleGoToProcurement(order.id); }}
                            >
                              📦 Go to Procurement
                            </button>
                          )}
                          
                          {/* No more duplicate buttons - replaced by tab system below */}
                        </div>
                      </div>
                      
                      {/* Tab System for Information Display */}
                      <div className={styles.tabSystem}>
                        <div className={styles.tabButtons}>
                          {/* Work Orders Tab - Only show for in_production orders */}
                          {order.productionWorkflowStatus.status === 'in_production' && (
                            <button
                              className={`ds-btn ${getActiveTab(order.id) === 'work_orders' || getActiveTab(order.id) === null ? 'ds-btn-primary' : 'ds-btn-secondary'}`}
                              onClick={(e) => { e.stopPropagation(); handleTabChange(order.id, 'work_orders'); }}
                            >
                              📋 Work Orders
                            </button>
                          )}
                        </div>
                        
                        {/* Tab Content - Simple Work Orders Status */}
                        {getActiveTab(order.id) === 'work_orders' && order.productionWorkflowStatus.status === 'in_production' && (
                          <div className={styles.tabContent}>
                            <div className={styles.workOrdersSimple}>
                              {getWorkOrdersBySalesOrder(order.id).map(workOrder => (
                                <div key={workOrder.id} className={styles.workOrderSimpleItem}>
                                  <span className={styles.workOrderId}>- {workOrder.id}</span>
                                  <span className={styles.workOrderStatus}>
                                    {workOrder.progress === 100 ? '✅ Done' : 
                                     workOrder.progress > 0 ? `🟡 Running (${workOrder.progress}%)` : '🔴 Not Started'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionOrderManagement;