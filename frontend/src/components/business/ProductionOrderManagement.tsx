import React, { useMemo } from 'react';
import { mockSalesOrders, SalesOrder } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
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
  quantity: string; // Add quantity field for display
}

// Material availability checking logic
const getMaterialStatus = (order: SalesOrder): MaterialStatus => {
  // Simulate material availability based on order characteristics
  const hasShortage = order.id === 'SO-002' || order.totalAmount > 500000; // High-value orders may have material complexity
  
  if (hasShortage) {
    return {
      status: 'shortage',
      icon: '⚠️',
      display: 'Shortage (Yarn, Dye)',
      details: ['Cotton Yarn 30s: 300kg short', 'Blue Dye: 50L short']
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
  // Material shortage blocks production
  if (materialStatus.status === 'shortage') {
    return {
      status: 'material_pending',
      icon: '🔴',
      label: 'Material Pending'
    };
  }
  
  // Production workflow states
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
  
  if (order.status === 'production_completed' || order.status === 'ready_to_ship') {
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
  
  // Transform Sales Orders for production context
  const productionOrders = useMemo((): ProductionOrderEnhanced[] => {
    return mockSalesOrders
      .filter(order => ['order_confirmed', 'production_started', 'production_completed'].includes(order.status))
      .map(order => {
        const materialStatus = getMaterialStatus(order);
        const productionWorkflowStatus = getProductionStatus(order, materialStatus);
        
        return {
          ...order,
          materialStatus,
          productionWorkflowStatus,
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
  
  const handleViewWorkOrders = (orderId: string) => {
    alert(`📋 Viewing Work Orders for ${orderId}\n\n🔍 Work Orders:\n• WO#${orderId}-A: Loom A1, 400m\n• WO#${orderId}-B: Loom A2, 600m\n\n(Mock functionality - will show WO details or navigate to W.O. tab)`);
  };
  
  const handleViewDetails = (orderId: string, customerId?: string) => {
    if (customerId && onShowCustomerProfile) {
      onShowCustomerProfile(customerId);
    } else {
      alert(`📄 Sales Order Details for ${orderId}\n\n(Mock functionality - will show complete order details)`);
    }
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
                      {order.id} — {companyName}
                    </div>
                    
                    {/* Product Details Line */}
                    <div className="ds-card-status">
                      Product: {order.items} | Qty: {order.quantity || '1000m'}
                    </div>
                    
                    {/* Material Status + Production Status */}
                    <div 
                      className="ds-card-meta"
                      title={`${order.materialStatus.display} | ${order.productionWorkflowStatus.label} | Due: ${order.deliveryDate}`}
                    >
                      Material: {order.materialStatus.icon} {order.materialStatus.display} | Due: {order.deliveryDate}<br />
                      Status: {order.productionWorkflowStatus.icon} {order.productionWorkflowStatus.label}
                    </div>

                    {/* Expand Indicator */}
                    <div className="ds-card-expand-indicator">
                      {isExpanded(order.id) ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Progressive Disclosure - Detailed Information */}
                  {isExpanded(order.id) && (
                    <div className="ds-expanded-details">
                      <div className="ds-details-content">
                        <h4>🏭 Production Order Details</h4>
                        <p><strong>Customer:</strong> {companyName} ({businessProfile?.registeredAddress.city || 'Unknown'})</p>
                        <p><strong>Product Details:</strong> {order.items}</p>
                        <p><strong>Order Value:</strong> {formatCurrency(order.totalAmount)} • Delivery: {order.deliveryDate}</p>
                        <p><strong>Material Status:</strong> {order.materialStatus.icon} {order.materialStatus.display}</p>
                        <p><strong>Production Status:</strong> {order.productionWorkflowStatus.icon} {order.productionWorkflowStatus.label}</p>
                        
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
                          
                          {/* View Work Orders - For orders in production */}
                          {order.productionWorkflowStatus.status === 'in_production' && (
                            <button 
                              className="ds-btn ds-btn-secondary" 
                              onClick={(e) => { e.stopPropagation(); handleViewWorkOrders(order.id); }}
                            >
                              📋 View Work Orders ▾
                            </button>
                          )}
                          
                          {/* View Details - Always available */}
                          <button 
                            className="ds-btn ds-btn-secondary" 
                            onClick={(e) => { e.stopPropagation(); handleViewDetails(order.id, order.businessProfileId); }}
                          >
                            📄 View Details
                          </button>
                        </div>
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