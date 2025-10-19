import React, { useMemo } from 'react';
import { mockMaterialRequirements, MaterialRequirement } from '../../data/procurementMockData';
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

interface GroupedMaterials {
  orderId: string;
  materials: MaterialRequirement[];
  hasShortages: boolean;
  allAvailable: boolean;
  orderStatus: 'shortage' | 'success' | 'mixed';
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
  
  // Filter materials based on filter state
  const filteredMaterials = useMemo(() => {
    if (filterState === 'all') return mockMaterialRequirements;
    return mockMaterialRequirements.filter(material => material.status === filterState);
  }, [filterState]);

  // Group materials by Sales Order (for UI display convenience)
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, GroupedMaterials> = {};
    
    filteredMaterials.forEach(material => {
      const orderId = material.orderId;
      
      if (!groups[orderId]) {
        groups[orderId] = {
          orderId,
          materials: [],
          hasShortages: false,
          allAvailable: true,
          orderStatus: 'success'
        };
      }
      
      groups[orderId].materials.push(material);
      
      // Update group status based on materials
      if (material.status === 'shortage') {
        groups[orderId].hasShortages = true;
        groups[orderId].allAvailable = false;
      }
      
      if (material.status !== 'available') {
        groups[orderId].allAvailable = false;
      }
    });
    
    // Determine order status
    Object.values(groups).forEach(group => {
      if (group.hasShortages) {
        group.orderStatus = group.allAvailable ? 'mixed' : 'shortage';
      } else {
        group.orderStatus = 'success';
      }
    });
    
    return Object.values(groups);
  }, [filteredMaterials]);

  // Calculate shortage alert
  const shortageAlert = useMemo(() => {
    const shortages = mockMaterialRequirements.filter(mr => mr.status === 'shortage');
    return {
      hasShortages: shortages.length > 0,
      count: shortages.length
    };
  }, []);

  // Use the hook's toggle function with our custom data attribute
  const toggleOrderExpansion = (orderId: string) => {
    toggleExpansion(orderId, 'data-order-id');
  };

  // Mock action handler for Purchase Request creation
  const handleCreatePR = (materialId: string, materialName: string) => {
    alert(`Creating Purchase Request for ${materialName} (${materialId}) - Mock functionality`);
  };

  // Mock action handler for bulk PR creation
  const handleCreateBulkPR = (orderId: string) => {
    alert(`Creating Bulk Purchase Request for Order ${orderId} - Mock functionality`);
  };

  // Get order title with customer context
  const getOrderTitle = (orderId: string) => {
    // Mock customer mapping - in real app this would come from sales data
    const customerMap: Record<string, string> = {
      'SO-002': 'Gujarat Garments',
      'SO-004': 'Seasonal Collection'
    };
    return `Order #${orderId} — ${customerMap[orderId] || 'Customer'}`;
  };

  // Get order summary text
  const getOrderSummary = (group: GroupedMaterials) => {
    const shortageCount = group.materials.filter(m => m.status === 'shortage').length;
    const totalMaterials = group.materials.length;
    
    if (group.orderStatus === 'success') {
      return {
        text: `${totalMaterials} materials available`,
        icon: '✅',
        className: 'success'
      };
    } else if (shortageCount > 0) {
      return {
        text: `${shortageCount} materials short`,
        icon: '⚠️',
        className: 'shortage'
      };
    } else {
      return {
        text: `${totalMaterials} materials mixed status`,
        icon: '🟡',
        className: 'mixed'
      };
    }
  };

  // Get key shortage materials for summary
  const getKeyShortages = (group: GroupedMaterials) => {
    const shortages = group.materials.filter(m => m.status === 'shortage');
    if (shortages.length === 0) return '';
    
    if (shortages.length === 1) {
      return `${shortages[0].materialName} (${shortages[0].shortfall}${shortages[0].unit})`;
    } else if (shortages.length === 2) {
      return `${shortages[0].materialName} (${shortages[0].shortfall}${shortages[0].unit}), ${shortages[1].materialName} (${shortages[1].shortfall}${shortages[1].unit})`;
    } else {
      return `${shortages[0].materialName} (${shortages[0].shortfall}${shortages[0].unit}) + ${shortages.length - 1} more`;
    }
  };

  return (
    <div className={styles.materialRequirements}>
      {/* Alert Header - Only show when shortages exist */}
      {shortageAlert.hasShortages && (
        <div className={styles.alertHeader}>
          ⚠️ {shortageAlert.count} MATERIAL SHORTAGES DETECTED
        </div>
      )}

      {/* Content Wrapper with Cards */}
      <div className={styles.contentWrapper}>
        {groupedMaterials.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📦</div>
            <div className={styles.emptyStateText}>No materials found</div>
            <div className={styles.emptyStateSubtext}>
              Adjust your filter to see material requirements
            </div>
          </div>
        ) : (
          <div className={styles.cardsContainer}>
            {groupedMaterials.map(group => {
              const isExpandedCard = isExpanded(group.orderId);
              const summary = getOrderSummary(group);
              const keyShortages = getKeyShortages(group);
              
              return (
                <div 
                  key={group.orderId} 
                  data-order-id={group.orderId}
                  className={`${styles.orderCard} ${styles[group.orderStatus]} ${isExpandedCard ? styles.expanded : ''}`}
                >
                  {/* Card Header (Always Visible) */}
                  <div 
                    className={`${styles.cardHeader} ${isExpandedCard ? styles.expanded : ''}`}
                    onClick={() => toggleOrderExpansion(group.orderId)}
                  >
                    {/* Order Title */}
                    <div className={styles.orderTitle}>
                      <div className={styles.orderTitleText}>
                        {getOrderTitle(group.orderId)}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.orderSummary}>
                      <div className={`${styles.summaryItem} ${styles[summary.className]}`}>
                        <span>{summary.icon}</span>
                        <span>{summary.text}</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span>📅</span>
                        <span>Due: Oct 25</span>
                      </div>
                    </div>

                    {/* Additional Information Row */}
                    <div className={styles.orderSummary}>
                      {keyShortages ? (
                        // Show key shortages for orders with problems
                        <div className={`${styles.summaryItem} ${styles.shortage}`}>
                          <span>🔥</span>
                          <span>{keyShortages}</span>
                        </div>
                      ) : group.orderStatus === 'success' ? (
                        // Show ready message for successful orders
                        <div className={`${styles.summaryItem} ${styles.success}`}>
                          <span>🚀</span>
                          <span>{group.materials.length} materials available, ready to start</span>
                        </div>
                      ) : (
                        // Show mixed status message
                        <div className={`${styles.summaryItem}`}>
                          <span>📋</span>
                          <span>Mixed material status - review required</span>
                        </div>
                      )}
                    </div>

                    {/* Expand Indicator - positioned like Lead Management */}
                    <div className={styles.expandIndicator}>
                      {isExpandedCard ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpandedCard && (
                    <div className={styles.expandedContent}>
                      <div className={styles.materialDetails}>
                        <div className={styles.materialDetailsHeader}>
                          📋 Material Details
                        </div>
                        
                        {/* Material Table in Expanded View */}
                        <div className={styles.expandedTableContainer}>
                          <table className={styles.materialTable}>
                            <thead>
                              <tr>
                                <th>Material</th>
                                <th>Req</th>
                                <th>Stock</th>
                                <th>Short</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.materials.map(material => (
                                <tr key={material.id} className={`${styles.materialRow} ${styles[material.status]}`}>
                                  <td>
                                    <div className={styles.materialName}>{material.materialName}</div>
                                    <div className={styles.materialUnit}>{material.unit}</div>
                                  </td>
                                  <td className={styles.quantityCell}>
                                    {material.requiredQuantity.toLocaleString()}
                                  </td>
                                  <td className={styles.quantityCell}>
                                    {material.currentStock.toLocaleString()}
                                  </td>
                                  <td className={`${styles.shortfallCell} ${material.shortfall > 0 ? styles.hasShortage : styles.noShortage}`}>
                                    {material.shortfall > 0 ? material.shortfall.toLocaleString() : '—'}
                                  </td>
                                  <td className={styles.actionCell}>
                                    {material.status === 'shortage' && (
                                      <button 
                                        className={styles.prButton}
                                        onClick={() => handleCreatePR(material.id, material.materialName)}
                                        title={`Create Purchase Request for ${material.materialName}`}
                                      >
                                        PR
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Action Buttons - Only visible in expanded view */}
                        <div className={styles.expandedActions}>
                          {group.hasShortages && (
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleCreateBulkPR(group.orderId)}
                            >
                              Create Bulk PR for All Shortages
                            </button>
                          )}
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
  );
};

export default MaterialRequirements;