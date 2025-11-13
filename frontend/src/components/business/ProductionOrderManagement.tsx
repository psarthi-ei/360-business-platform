import React, { useMemo, useState } from 'react';
import { ProductionOrder, WorkOrder, getAllProductionOrders, getProductionOrdersByStatus } from '../../data/productionMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import { WorkOrderCreationModal } from './WorkOrderCreationModal';
import { getWorkOrdersByProductionOrder } from '../../services/ProductionOrderService';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
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
  // Use regional terminology for consistent user experience
  const { 
    customer,
    order, orders,
    material, materials,
    workOrder, workOrders: workOrdersTerminology,
    delivery
  } = useTerminologyTerms();
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

  // Status display mapping with local terminology
  const getStatusDisplay = (status: ProductionOrder['status']) => {
    const statusMap = {
      'awaiting_material': { icon: '⏳', label: 'Awaiting Material', color: '#f59e0b' },
      'material_received': { icon: '📦', label: 'Material Received', color: '#3b82f6' },
      'awaiting_work_order_creation': { icon: '📋', label: `Awaiting ${workOrder} Creation`, color: '#8b5cf6' },
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

  // Helper functions for work order status display (updated for status variety)
  const getWorkOrderStatusClass = (status: WorkOrder['status']): string => {
    const statusMap: Partial<Record<WorkOrder['status'], string>> = {
      'completed': 'status-completed',
      'delivered': 'status-delivered',
      'dispatched': 'status-delivered',
      'qc_approved': 'status-completed',
      'ready_for_delivery': 'status-completed',
      'ready_qc': 'status-pending',
      'in_progress': 'status-active',
      'pending': 'status-pending',
      'qc_rejected': 'status-rejected',
      'rework_required': 'status-rejected',
      'on_hold': 'status-inactive'
    };
    return statusMap[status] || 'status-pending';
  };

  const getWorkOrderStatusIcon = (status: WorkOrder['status']): string => {
    const statusMap: Partial<Record<WorkOrder['status'], string>> = {
      'completed': '✅',
      'delivered': '🚚',
      'dispatched': '📤',
      'qc_approved': '🔍✅',
      'ready_for_delivery': '📦',
      'ready_qc': '🔍',
      'in_progress': '🔄',
      'pending': '⏳',
      'qc_rejected': '🔍❌',
      'rework_required': '🔧',
      'on_hold': '⏸️'
    };
    return statusMap[status] || '❓';
  };

  const getWorkOrderStatusText = (status: WorkOrder['status']): string => {
    const statusMap: Partial<Record<WorkOrder['status'], string>> = {
      'completed': 'Completed',
      'delivered': 'Delivered',
      'dispatched': 'Dispatched',
      'qc_approved': 'QC Approved',
      'ready_for_delivery': `Ready for ${delivery}`,
      'ready_qc': 'Ready for QC',
      'in_progress': 'In Progress',
      'pending': 'Pending',
      'qc_rejected': 'QC Rejected',
      'rework_required': 'Rework Required',
      'on_hold': 'On Hold'
    };
    return statusMap[status] || 'Unknown';
  };

  return (
    <div className={styles.productionOrderManagement}>
      {filteredProductionOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📋</div>
          <h3>No Production {orders} Found</h3>
          <p>No production {orders.toLowerCase()} match the current filter criteria.</p>
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
                    title={`Production ${order} ${productionOrder.id} - ${productionOrder.customerName} - ${productionOrder.fabricDetails.type}`}
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

                {/* Professional Expanded Details - Following Lead Management Pattern */}
                {expanded && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      {/* Professional Fabric Details Section */}
                      <div className={styles.expandedSection}>
                        <h4 className={styles.sectionHeader}>📦 Fabric Specifications</h4>
                        <div className={styles.professionalDetailsGrid}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Material Type:</span>
                            <span className={styles.detailValue}>{productionOrder.fabricDetails.type}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Quantity:</span>
                            <span className={styles.detailValue}>{productionOrder.fabricDetails.quantity} {productionOrder.fabricDetails.unit}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Quality Grade:</span>
                            <span className={styles.detailValue}>{productionOrder.fabricDetails.qualityGrade || 'Standard'}</span>
                          </div>
                          {productionOrder.fabricDetails.colors && (
                            <div className={styles.detailRow}>
                              <span className={styles.detailLabel}>Colors:</span>
                              <span className={styles.detailValue}>{productionOrder.fabricDetails.colors.join(', ')}</span>
                            </div>
                          )}
                          {productionOrder.fabricDetails.specialInstructions && (
                            <div className={styles.detailRowFull}>
                              <span className={styles.detailLabel}>Special Instructions:</span>
                              <span className={styles.detailValue}>{productionOrder.fabricDetails.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Work Orders Section */}
                      <div className={styles.expandedSection}>
                        <h4 className={styles.sectionHeader}>🔧 {workOrdersTerminology} ({workOrders.length})</h4>
                        {workOrders.length > 0 ? (
                          <div className={styles.professionalWorkOrdersList}>
                            {workOrders.map((wo, index) => (
                              <div key={wo.id} className={styles.professionalWorkOrderItem}>
                                <div className={styles.workOrderHeader}>
                                  <span className={styles.workOrderId}>{wo.id}</span>
                                  <span className={`${styles.workOrderStatus} ${getWorkOrderStatusClass(wo.status)}`}>
                                    {getWorkOrderStatusIcon(wo.status)} {getWorkOrderStatusText(wo.status)}
                                  </span>
                                </div>
                                <div className={styles.workOrderDetails}>
                                  <span className={styles.workOrderProduct}>{wo.product}</span>
                                  {wo.assignedMachine && (
                                    <span className={styles.workOrderMachine}>• Machine: {wo.assignedMachine}</span>
                                  )}
                                  {wo.assignedWorker && (
                                    <span className={styles.workOrderWorker}>• Worker: {wo.assignedWorker}</span>
                                  )}
                                </div>
                                <div className={styles.workOrderProgress}>
                                  <span className={styles.progressText}>
                                    Progress: {wo.producedQuantity}/{wo.targetQuantity} ({wo.progress}%)
                                  </span>
                                  <div className={styles.progressBarContainer}>
                                    <div 
                                      className={styles.progressBar} 
                                      style={{ width: `${wo.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={styles.emptyWorkOrders}>
                            <p>📋 No {workOrdersTerminology.toLowerCase()} created yet</p>
                            <p className={styles.emptySubtext}>{workOrdersTerminology} will be created once {material.toLowerCase()} processing begins</p>
                          </div>
                        )}
                      </div>

                      {/* Professional Timeline Section */}
                      <div className={styles.expandedSection}>
                        <h4 className={styles.sectionHeader}>📅 Production Timeline</h4>
                        <div className={styles.professionalTimeline}>
                          <div className={styles.timelineItem}>
                            <span className={styles.timelineLabel}>{order} Created:</span>
                            <span className={styles.timelineValue}>
                              {new Date(productionOrder.createdDate).toLocaleDateString('en-IN', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </span>
                          </div>
                          {productionOrder.receivedDate && (
                            <div className={styles.timelineItem}>
                              <span className={styles.timelineLabel}>{materials} Received:</span>
                              <span className={styles.timelineValue}>
                                {new Date(productionOrder.receivedDate).toLocaleDateString('en-IN', { 
                                  year: 'numeric', month: 'long', day: 'numeric' 
                                })}
                              </span>
                            </div>
                          )}
                          {productionOrder.completedDate && (
                            <div className={styles.timelineItem}>
                              <span className={styles.timelineLabel}>Production Completed:</span>
                              <span className={styles.timelineValue}>
                                {new Date(productionOrder.completedDate).toLocaleDateString('en-IN', { 
                                  year: 'numeric', month: 'long', day: 'numeric' 
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Notes Section */}
                      {productionOrder.notes && (
                        <div className={styles.expandedSection}>
                          <h4 className={styles.sectionHeader}>📝 Production Notes</h4>
                          <div className={styles.professionalNotes}>
                            <p className={styles.notesContent}>{productionOrder.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Professional Additional Context Section - Moved to bottom as supplementary info */}
                      <div className={styles.expandedSection}>
                        <h4 className={styles.sectionHeader}>📋 Reference Information</h4>
                        <div className={styles.professionalDetailsGrid}>
                          {/* Sales Order - Links to original customer order */}
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Sales {order} Reference:</span>
                            <span className={styles.detailValue}>{productionOrder.salesOrderId}</span>
                          </div>
                          
                          {/* Customer's fabric delivery document */}
                          {productionOrder.fabricDetails.challanReference && (
                            <div className={styles.detailRow}>
                              <span className={styles.detailLabel}>{customer} Challan Reference:</span>
                              <span className={styles.detailValue}>📋 {productionOrder.fabricDetails.challanReference}</span>
                            </div>
                          )}
                          
                          {/* Internal tracking - Inward entry for material receipt */}
                          {productionOrder.inwardEntryId && (
                            <div className={styles.detailRow}>
                              <span className={styles.detailLabel}>Inward Entry ID:</span>
                              <span className={styles.detailValue}>{productionOrder.inwardEntryId}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Action Buttons Section - Moved to end for better UX flow */}
                      {productionOrder.status === 'awaiting_work_order_creation' && (
                        <div className={styles.expandedSection}>
                          <h4 className={styles.sectionHeader}>⚡ Available Actions</h4>
                          <div className={styles.professionalActions}>
                            <button
                              className="ds-btn ds-btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateWorkOrders(productionOrder);
                              }}
                            >
                              🔧 Create {workOrdersTerminology}
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewCustomer(productionOrder.customerId);
                              }}
                            >
                              👤 View {customer} Profile
                            </button>
                          </div>
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