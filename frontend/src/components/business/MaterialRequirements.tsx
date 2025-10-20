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

  // Get order title - simple Order ID format
  const getOrderTitle = (orderId: string) => {
    return orderId; // Returns clean "SO-002", "SO-004", etc.
  };


  // Get material status (without urgency)
  const getMaterialStatus = (group: GroupedMaterials) => {
    const shortageCount = group.materials.filter(m => m.status === 'shortage').length;
    const totalMaterials = group.materials.length;
    
    if (group.orderStatus === 'success') {
      return {
        text: `${totalMaterials} materials ready`,
        icon: '✅',
        className: 'success'
      };
    } else if (shortageCount > 0) {
      return {
        text: `${shortageCount} materials needed`,
        icon: '⚠️',
        className: 'shortage'
      };
    } else {
      return {
        text: `${totalMaterials} materials pending`,
        icon: '🟡',
        className: 'mixed'
      };
    }
  };

  // Get urgency status with icons
  const getUrgencyStatus = (group: GroupedMaterials) => {
    const urgencies = group.materials.map(m => m.urgency);
    const hasHigh = urgencies.includes('high');
    const hasMedium = urgencies.includes('medium');
    
    if (hasHigh) {
      return {
        text: 'High',
        icon: '🔥',
        className: 'high-urgency'
      };
    } else if (hasMedium) {
      return {
        text: 'Medium',
        icon: '⚡',
        className: 'medium-urgency'
      };
    } else {
      return {
        text: 'Low',
        icon: '📅',
        className: 'low-urgency'
      };
    }
  };

  // Get meta content using actual MR data (timeline + materials)
  const getOrderMeta = (group: GroupedMaterials) => {
    // Get date range from actual MR data
    const dates = group.materials.map(m => new Date(m.requiredDate)).sort((a, b) => a.getTime() - b.getTime());
    const earliestDate = dates[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const latestDate = dates[dates.length - 1].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const timeline = dates.length > 1 ? `${earliestDate}-${latestDate}` : earliestDate;
    
    // Get material context
    const shortages = group.materials.filter(m => m.status === 'shortage');
    if (shortages.length > 0) {
      const materialNames = shortages.length === 1 
        ? shortages[0].materialName
        : shortages.length === 2
        ? `${shortages[0].materialName}, ${shortages[1].materialName}`
        : `${shortages[0].materialName} +${shortages.length - 1} more`;
      return `Due ${timeline} • ${materialNames} short`;
    } else {
      return `Due ${timeline} • Production ready`;
    }
  };

  return (
    <div className={styles.materialRequirementsScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when shortages exist */}
        {shortageAlert.hasShortages && (
          <div className={styles.alertHeader}>
            ⚠️ {shortageAlert.count} MATERIAL SHORTAGES DETECTED
          </div>
        )}

        {/* Content Container */}
        <div className={styles.materialRequirementsContainer}>
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
                const materialStatus = getMaterialStatus(group);
                const urgencyStatus = getUrgencyStatus(group);
                const orderMeta = getOrderMeta(group);
                
                return (
                  <div key={group.orderId} className={styles.cardContainer} data-item-id={group.orderId}>
                  {/* 140px Fixed Height Card Template */}
                  <div 
                    className={`${styles.card} ${styles[group.orderStatus]} ${isExpandedCard ? styles.expanded : ''}`}
                    onClick={() => toggleOrderExpansion(group.orderId)}
                  >
                    {/* Template Header - 20px font, 24px height */}
                    <div 
                      className={styles.cardHeader}
                      title={`Order ${group.orderId} - ${materialStatus.text} - ${urgencyStatus.text}`}
                    >
                      {getOrderTitle(group.orderId)}
                    </div>
                    
                    {/* Template Status - 16px font, 21px height - Dual status display */}
                    <div className={styles.cardStatus}>
                      <span>{materialStatus.icon} {materialStatus.text}</span>
                      <span>•</span>
                      <span>{urgencyStatus.icon} {urgencyStatus.text}</span>
                    </div>
                    
                    {/* Template Meta - 14px font, 34px max height, 2-line clamp - Real MR data */}
                    <div 
                      className={styles.cardMeta}
                      title={orderMeta}
                    >
                      {orderMeta}
                    </div>

                    {/* Expand Indicator - Standard positioning */}
                    <div className={styles.expandIndicator}>
                      {isExpandedCard ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Progressive Disclosure - Standard Pattern */}
                  {isExpandedCard && (
                    <div className="ds-expanded-details">
                      <div className="ds-details-content">
                        <h4>📋 Material Details</h4>
                        
                        {/* Order-level MR Information - 2 separate rows */}
                        <div className={styles.mrInfoSection}>
                          <div className={styles.mrInfo}>
                            <span><strong>Urgency:</strong> {urgencyStatus.icon} {urgencyStatus.text}</span>
                            <span><strong>Timeline:</strong> {orderMeta.split(' • ')[0].replace('Due ', '')}</span>
                          </div>
                        </div>

                        {/* Material Table - Mobile optimized */}
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

                        {/* Related Sales Order Link - Following Quote Pattern */}
                        <div className={styles.mrMapping}>
                          <div className={styles.mappingInfo}>
                            <p><strong>📦 Related Sales Order:</strong> 
                              <span className={styles.mappingLink} onClick={() => alert(`Navigate to Sales Order ${group.orderId}`)}>
                                {group.orderId}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons - Standard Pattern */}
                      <div className={styles.cardActions}>
                        <div className={styles.actionButtons}>
                          {group.hasShortages && (
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleCreateBulkPR(group.orderId)}
                            >
                              📋 Create Bulk PR for All Shortages
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
    </div>
  );
};

export default MaterialRequirements;