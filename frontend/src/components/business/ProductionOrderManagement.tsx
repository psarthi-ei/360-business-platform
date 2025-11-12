import React, { useMemo, useState } from 'react';
import { ProductionOrder, getAllProductionOrders, getProductionOrdersByStatus } from '../../data/productionMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import { WorkOrderCreationModal } from './WorkOrderCreationModal';
import { getWorkOrdersByProductionOrder } from '../../services/ProductionOrderService';
import styles from './ProductionOrderManagement.module.css';

interface ProductionOrderManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const ProductionOrderManagement: React.FC<ProductionOrderManagementProps> = ({
  mobile,
  onShowCustomerProfile,
  filterState,
  onFilterChange,
  openAddModal,
  onAddModalHandled
}) => {
  // Removed terminology context
  const { toggleExpansion, isExpanded } = useCardExpansion();
  const [selectedProductionOrder, setSelectedProductionOrder] = useState<ProductionOrder | null>(null);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);

  // Get all production orders
  const allProductionOrders = getAllProductionOrders();

  // Filter production orders based on filter state
  const filteredProductionOrders = useMemo(() => {
    if (filterState === 'all') return allProductionOrders;
    return getProductionOrdersByStatus(filterState as ProductionOrder['status']);
  }, [allProductionOrders, filterState]);

  // Status display mapping
  const getStatusDisplay = (status: ProductionOrder['status']) => {
    const statusMap = {
      'awaiting_material': { icon: '⏳', label: 'Awaiting Material', color: '#f59e0b' },
      'material_received': { icon: '📦', label: 'Material Received', color: '#3b82f6' },
      'awaiting_work_order_creation': { icon: '📋', label: 'Awaiting Work Order Creation', color: '#8b5cf6' },
      'ready_for_production': { icon: '🔄', label: 'Ready for Production', color: '#10b981' },
      'in_progress': { icon: '🏭', label: 'In Progress', color: '#06b6d4' },
      'completed': { icon: '✅', label: 'Completed', color: '#22c55e' },
      'awaiting_qc': { icon: '🔍', label: 'Awaiting QC', color: '#f59e0b' },
      'quality_issues': { icon: '⚠️', label: 'Quality Issues', color: '#ef4444' },
      'ready_for_delivery': { icon: '🚚', label: 'Ready for Delivery', color: '#22c55e' },
      'partial_delivery': { icon: '📦', label: 'Partial Delivery', color: '#8b5cf6' }
    };
    return statusMap[status] || { icon: '❓', label: status, color: '#6b7280' };
  };

  const handleToggleDetails = (productionOrderId: string) => {
    toggleExpansion(productionOrderId, 'data-production-order-id');
  };

  const handleCreateWorkOrders = (productionOrder: ProductionOrder) => {
    setSelectedProductionOrder(productionOrder);
    setShowWorkOrderModal(true);
  };

  const handleWorkOrdersCreated = (workOrderIds: string[]) => {
    setShowWorkOrderModal(false);
    setSelectedProductionOrder(null);
    // In a real app, you would refresh the data or update state
    // Work orders created: workOrderIds
  };

  const handleViewCustomer = (customerId: string) => {
    if (onShowCustomerProfile) {
      onShowCustomerProfile(customerId);
    }
  };

  // Helper function to get status class for card styling
  const getProductionOrderStatusClass = (status: ProductionOrder['status']) => {
    const statusMap = {
      'completed': 'ds-card-status-active',
      'ready_for_delivery': 'ds-card-status-active',
      'in_progress': 'ds-card-status-pending',
      'awaiting_qc': 'ds-card-status-pending',
      'ready_for_production': 'ds-card-status-pending',
      'awaiting_work_order_creation': 'ds-card-status-pending',
      'material_received': 'ds-card-status-pending',
      'partial_delivery': 'ds-card-status-pending',
      'quality_issues': 'ds-card-status-inactive',
      'awaiting_material': 'ds-card-status-inactive'
    };
    return statusMap[status] || 'ds-card-status-inactive';
  };

  return (
    <div className={styles.productionOrderManagement}>
      {filteredProductionOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📋</div>
          <h3>No Production Orders Found</h3>
          <p>No production orders match the current filter criteria.</p>
        </div>
      ) : (
        <div className={styles.productionOrderList}>
          {filteredProductionOrders.map((productionOrder) => {
            const workOrders = getWorkOrdersByProductionOrder(productionOrder.id);
            const statusDisplay = getStatusDisplay(productionOrder.status);
            const expanded = isExpanded(productionOrder.id);

            return (
              <div key={productionOrder.id} className="ds-card-container" data-production-order-id={productionOrder.id}>
                {/* Clickable Card Summary - Global Design System 140px Template */}
                <div 
                  className={`ds-card ${getProductionOrderStatusClass(productionOrder.status)} ${expanded ? 'ds-card-expanded' : ''}`}
                  onClick={() => handleToggleDetails(productionOrder.id)}
                >
                  {/* Enhanced Header - Production Order ID + Customer + Fabric Type */}
                  <div 
                    className="ds-card-header"
                    title={`Production Order ${productionOrder.id} - ${productionOrder.customerName} - ${productionOrder.fabricDetails.type}`}
                  >
                    🏭 {productionOrder.customerName} — {productionOrder.fabricDetails.type} ({productionOrder.id})
                  </div>
                  
                  {/* Production Order Status */}
                  <div className="ds-card-status">
                    {statusDisplay.icon} {statusDisplay.label}
                  </div>
                  
                  {/* Production Meta - Quantity + Dates */}
                  <div 
                    className="ds-card-meta"
                    title={`${productionOrder.fabricDetails.quantity} ${productionOrder.fabricDetails.unit} • Created: ${new Date(productionOrder.createdDate).toLocaleDateString()}`}
                  >
                    {productionOrder.fabricDetails.quantity} {productionOrder.fabricDetails.unit}<br />
                    Created: {new Date(productionOrder.createdDate).toLocaleDateString()}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {expanded ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Detailed Information */}
                {expanded && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      {/* Enhanced Production Order Details */}
                      <p><strong>Customer:</strong> 👤 {productionOrder.customerName} • <strong>Order Type:</strong> 🏭 Production Order • <strong>Status:</strong> {statusDisplay.icon} {statusDisplay.label}</p>
                      {productionOrder.fabricDetails.challanReference && (
                        <p><strong>Challan Reference:</strong> 📋 {productionOrder.fabricDetails.challanReference}</p>
                      )}
                      
                      {/* Fabric Details Section */}
                      <div className={styles.detailsSection}>
                        <h4>📦 Fabric Specifications</h4>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.label}>Material Type:</span>
                            <span>{productionOrder.fabricDetails.type}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.label}>Quantity:</span>
                            <span>{productionOrder.fabricDetails.quantity} {productionOrder.fabricDetails.unit}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.label}>Quality Grade:</span>
                            <span>{productionOrder.fabricDetails.qualityGrade || 'Standard'}</span>
                          </div>
                          {productionOrder.fabricDetails.colors && (
                            <div className={styles.detailItem}>
                              <span className={styles.label}>Colors:</span>
                              <span>{productionOrder.fabricDetails.colors.join(', ')}</span>
                            </div>
                          )}
                          {productionOrder.fabricDetails.specialInstructions && (
                            <div className={styles.detailItem}>
                              <span className={styles.label}>Special Instructions:</span>
                              <span>{productionOrder.fabricDetails.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Work Orders Section */}
                      <div className={styles.detailsSection}>
                        <h4>🔧 Work Orders ({workOrders.length})</h4>
                        {workOrders.length > 0 ? (
                          <div className={styles.workOrdersList}>
                            {workOrders.map(wo => (
                              <div key={wo.id} className={styles.workOrderItem}>
                                <span className={styles.workOrderId}>{wo.id}</span>
                                <span className={styles.workOrderProduct}>{wo.product}</span>
                                <span className={styles.workOrderStatus}>{wo.status}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={styles.noWorkOrders}>
                            <p>No work orders created yet</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons using Global Design System */}
                      {productionOrder.status === 'awaiting_work_order_creation' && (
                        <div className="ds-card-actions">
                          <button
                            className="ds-btn ds-btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateWorkOrders(productionOrder);
                            }}
                          >
                            🔧 Create Work Orders
                          </button>
                          <button 
                            className="ds-btn ds-btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(productionOrder.customerId);
                            }}
                          >
                            👤 View Customer
                          </button>
                        </div>
                      )}
                      
                      {/* Timeline Information */}
                      <div className={styles.detailsSection}>
                        <h4>📅 Timeline</h4>
                        <div className={styles.timestamps}>
                          <div className={styles.timestamp}>
                            <span className={styles.label}>Created:</span>
                            <span>{new Date(productionOrder.createdDate).toLocaleDateString()}</span>
                          </div>
                          {productionOrder.receivedDate && (
                            <div className={styles.timestamp}>
                              <span className={styles.label}>Materials Received:</span>
                              <span>{new Date(productionOrder.receivedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {productionOrder.completedDate && (
                            <div className={styles.timestamp}>
                              <span className={styles.label}>Completed:</span>
                              <span>{new Date(productionOrder.completedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes Section */}
                      {productionOrder.notes && (
                        <div className={styles.detailsSection}>
                          <h4>📝 Notes</h4>
                          <p>{productionOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Work Order Creation Modal */}
      {selectedProductionOrder && (
        <WorkOrderCreationModal
          productionOrder={selectedProductionOrder}
          isOpen={showWorkOrderModal}
          onClose={() => setShowWorkOrderModal(false)}
          onWorkOrdersCreated={handleWorkOrdersCreated}
        />
      )}
    </div>
  );
};

export default ProductionOrderManagement;