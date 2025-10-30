import React, { useMemo } from 'react';
import { mockSalesOrders } from '../../data/salesMockData';
import { 
  checkOrderMaterialAvailability, 
  OrderMaterialStatus,
  getShortageDetails,
  getPRStatus
} from '../../data/materialHelpers';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './MaterialRequirements.module.css';

interface MaterialRequirementsProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const MaterialRequirements = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled
}: MaterialRequirementsProps) => {
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Show all sales orders with their material status - complete material visibility
  const allOrdersWithMaterialStatus = useMemo(() => {
    return mockSalesOrders
      .map(order => {
        const materialStatus = checkOrderMaterialAvailability(order.id);
        const businessProfile = getBusinessProfileById(order.businessProfileId);
        
        return {
          orderId: order.id,
          customerName: businessProfile?.companyName || 'Unknown Company',
          deliveryDate: order.deliveryDate,
          orderValue: order.totalAmount,
          materialStatus,
          shortageDetails: getShortageDetails(order.id)
        };
      });
  }, []);

  // Calculate material shortage alert for high-priority orders
  const materialAlert = useMemo(() => {
    const urgentShortages = allOrdersWithMaterialStatus.filter(order => {
      // Check if delivery date is within next 7 days (urgent) AND has material issues
      const deliveryDate = new Date(order.deliveryDate);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const isUrgent = deliveryDate <= nextWeek;
      const hasMaterialIssues = order.materialStatus.overallStatus === 'shortage' || order.materialStatus.overallStatus === 'partial';
      return isUrgent && hasMaterialIssues;
    });
    return {
      hasUrgentMaterials: urgentShortages.length > 0,
      count: urgentShortages.length
    };
  }, [allOrdersWithMaterialStatus]);

  // Filter orders based on filter state
  const filteredOrders = useMemo(() => {
    if (filterState === 'all') return allOrdersWithMaterialStatus;
    
    return allOrdersWithMaterialStatus.filter(order => {
      const deliveryDate = new Date(order.deliveryDate);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const isUrgent = deliveryDate <= nextWeek;
      
      switch (filterState) {
        case 'available':
          return order.materialStatus.overallStatus === 'available';
        case 'partial':
          return order.materialStatus.overallStatus === 'partial';
        case 'shortage':
          return order.materialStatus.overallStatus === 'shortage';
        case 'urgent':
          return isUrgent;
        default:
          return true;
      }
    });
  }, [allOrdersWithMaterialStatus, filterState]);

  // Use the hook's toggle function with our custom data attribute
  const toggleCustomerOrderExpansion = (mrId: string) => {
    toggleExpansion(mrId, 'data-mr-id');
  };


  // Get status badge information based on material availability and delivery urgency
  const getStatusInfo = (order: { materialStatus: OrderMaterialStatus; deliveryDate: string }) => {
    const deliveryDate = new Date(order.deliveryDate);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const isUrgent = deliveryDate <= nextWeek;
    
    switch (order.materialStatus.overallStatus) {
      case 'available':
        return {
          icon: '✅',
          text: isUrgent ? 'Ready - Urgent' : 'Materials Available',
          className: 'ds-card-status-active'
        };
      case 'shortage':
        return {
          icon: '🚫',
          text: isUrgent ? 'Critical Shortage' : 'Material Shortage',
          className: 'ds-card-priority-high'
        };
      case 'partial':
      default:
        return {
          icon: '⚠️',
          text: isUrgent ? 'Urgent Partial' : 'Partial Shortage',
          className: 'ds-card-status-pending'
        };
    }
  };

  return (
    <div className={styles.materialRequirementsScreen}>
      <div className={styles.pageContent}>
        {/* Material Alert Header - Show when urgent materials needed */}
        {materialAlert.hasUrgentMaterials && (
          <div className={styles.alertHeader}>
            🔥 {materialAlert.count} URGENT MATERIAL REQUIREMENTS DETECTED
          </div>
        )}

        {/* Content Container */}
        <div className={styles.materialRequirementsContainer}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📋</div>
              <div className={styles.emptyStateText}>No orders match current filter</div>
              <div className={styles.emptyStateSubtext}>
                Try changing the filter to see more orders
              </div>
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {filteredOrders.map(order => {
                const isExpandedCard = isExpanded(order.orderId);
                const statusInfo = getStatusInfo(order);
                
                return (
                  <div key={order.orderId} className="ds-card-container" data-mr-id={order.orderId}>
                    {/* Material Status Card */}
                    <div 
                      className={`ds-card ${statusInfo.className} ${isExpandedCard ? 'ds-card-expanded' : ''}`}
                      onClick={() => toggleCustomerOrderExpansion(order.orderId)}
                    >
                      {/* Header: Customer Name + Material Status */}
                      <div 
                        className="ds-card-header"
                        title={`${order.customerName} - Material status for Order ${order.orderId}`}
                      >
                        {order.customerName} — Materials
                      </div>
                      
                      {/* Status: Material availability info */}
                      <div className="ds-card-status">
                        {statusInfo.icon} {statusInfo.text} • {order.materialStatus.materialChecks.length} materials
                      </div>
                      
                      {/* Meta: Order info + Delivery date */}
                      <div 
                        className="ds-card-meta"
                        title={`Order ${order.orderId} - Value: ${formatCurrency(order.orderValue)} - Delivery: ${order.deliveryDate}`}
                      >
                        Order {order.orderId} • {formatCurrency(order.orderValue)} • Due: {order.deliveryDate}
                      </div>
                      {/* Expand Indicator - Standard positioning */}
                      <div className="ds-card-expand-indicator">
                        {isExpandedCard ? 'Less' : 'More'}
                      </div>
                    </div>

                    {/* Material Details */}
                    {isExpandedCard && (
                      <div className="ds-expanded-details">
                        <div className="ds-details-content">
                          <h4>{statusInfo.icon} Material Status Breakdown</h4>

                          {/* Desktop Table View */}
                          <div className={styles.materialTableContainer}>
                            <table className={styles.materialItemsTable}>
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Required</th>
                                  <th>Available</th>
                                  <th>Shortage</th>
                                  <th>Status</th>
                                  <th>Impact</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.materialStatus.materialChecks.map((material, index) => (
                                  <tr key={index} className={styles.materialItemRow}>
                                    <td className={styles.materialNameCell}>
                                      <div className={styles.materialName}>{material.materialName}</div>
                                    </td>
                                    <td className={styles.quantityCell}>
                                      {material.required.toLocaleString()} {material.unit}
                                    </td>
                                    <td className={styles.availableCell}>
                                      {material.freeStock.toLocaleString()} {material.unit}
                                    </td>
                                    <td className={styles.shortageCell}>
                                      {material.shortage > 0 ? (
                                        <strong className={styles.shortageValue}>
                                          {material.shortage.toLocaleString()} {material.unit}
                                        </strong>
                                      ) : (
                                        <span className={styles.availableValue}>-</span>
                                      )}
                                    </td>
                                    <td className={styles.statusCell}>
                                      <span className={`${styles.statusBadge} ${styles[material.status]}`}>
                                        {material.status === 'available' ? '✅' : material.status === 'shortage' ? '🚫' : '⚠️'} {material.status}
                                      </span>
                                    </td>
                                    <td className={styles.impactCell}>
                                      {material.status === 'available' ? 'Ready' : 'Production Blocked'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards View */}
                          <div className={styles.materialMobileContainer}>
                            <div className={styles.materialsList}>
                              {order.materialStatus.materialChecks.map((material, index) => (
                                <div key={index} className={styles.materialCard}>
                                  <div className={styles.materialHeader}>
                                    <div className={styles.materialNameSection}>
                                      <div className={styles.materialName}>{material.materialName}</div>
                                      <div className={styles.materialCode}>
                                        <span className={`${styles.statusBadge} ${styles[material.status]}`}>
                                          {material.status === 'available' ? '✅' : material.status === 'shortage' ? '🚫' : '⚠️'} {material.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.materialDetails}>
                                    <div className={styles.materialDetailRow}>
                                      <span className={styles.detailLabel}>Required:</span>
                                      <span className={styles.detailValue}>{material.required.toLocaleString()} {material.unit}</span>
                                    </div>
                                    <div className={styles.materialDetailRow}>
                                      <span className={styles.detailLabel}>Available:</span>
                                      <span className={styles.detailValue}>{material.freeStock.toLocaleString()} {material.unit}</span>
                                    </div>
                                    {material.shortage > 0 && (
                                      <div className={styles.materialDetailRow}>
                                        <span className={styles.detailLabel}>Shortage:</span>
                                        <span className={`${styles.detailValue} ${styles.shortageValue}`}>
                                          <strong>{material.shortage.toLocaleString()} {material.unit}</strong>
                                        </span>
                                      </div>
                                    )}
                                    <div className={styles.materialDetailRow}>
                                      <span className={styles.detailLabel}>Impact:</span>
                                      <span className={styles.detailValue}>{material.status === 'available' ? 'Ready' : 'Production Blocked'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Material Resolution and Order Link */}
                          <div className={styles.mrMapping}>
                            <div className={styles.mappingInfo}>
                              <p><strong>📋 Sales Order:</strong> 
                                <span className={styles.mappingLink} onClick={() => alert(`Navigate to Sales Order ${order.orderId}`)}>
                                  {order.orderId}
                                </span>
                                - {order.customerName}
                              </p>
                              <p><strong>📅 Delivery Impact:</strong> 
                                {order.materialStatus.overallStatus === 'available' 
                                  ? `Ready for production - ${order.deliveryDate}`
                                  : `Delivery at risk - ${order.deliveryDate}`
                                }
                              </p>
                              {(() => {
                                const prStatus = getPRStatus(order.orderId);
                                if (prStatus.hasPR) {
                                  return (
                                    <p><strong>🔄 Purchase Request:</strong> 
                                      <span className={styles.prLink}>{prStatus.prId}</span> - {prStatus.status}
                                    </p>
                                  );
                                } else if (order.materialStatus.overallStatus !== 'available') {
                                  return (
                                    <p><strong>🔄 Resolution Status:</strong> 
                                      Purchase Request needed for shortage materials
                                    </p>
                                  );
                                } else {
                                  return (
                                    <p><strong>✅ Status:</strong> 
                                      All materials available - ready for production
                                    </p>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Material Status Actions */}
                        <div className={styles.cardActions}>
                          <div className={styles.actionButtons}>
                            {(() => {
                              const prStatus = getPRStatus(order.orderId);
                              
                              if (order.materialStatus.overallStatus === 'available') {
                                return (
                                  <>
                                    <button className="ds-btn ds-btn-primary">
                                      🚀 Start Production
                                    </button>
                                    <button className="ds-btn ds-btn-secondary">
                                      📦 Reserve Materials
                                    </button>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    {!prStatus.hasPR ? (
                                      <button 
                                        className="ds-btn ds-btn-primary"
                                        onClick={() => alert(`Create Purchase Request for shortage materials for ${order.customerName} Order ${order.orderId}`)}
                                      >
                                        🚨 Create Purchase Request
                                      </button>
                                    ) : (
                                      <button 
                                        className="ds-btn ds-btn-secondary"
                                        onClick={() => alert(`View Purchase Request ${prStatus.prId}`)}
                                      >
                                        📄 View Purchase Request
                                      </button>
                                    )}
                                    <button 
                                      className="ds-btn ds-btn-secondary"
                                      onClick={() => alert('Check stock allocation and priorities')}
                                    >
                                      📦 Check Inventory
                                    </button>
                                  </>
                                );
                              }
                            })()}
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => alert(`Navigate to Sales Order ${order.orderId}`)}
                            >
                              📄 View Order Details
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialRequirements;