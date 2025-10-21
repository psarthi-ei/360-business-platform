import React, { useMemo } from 'react';
import { mockMaterialRequirements, MaterialRequirement } from '../../data/procurementMockData';
import { checkMaterialAvailability } from '../../data/materialHelpers';
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
  
  // Filter materials based on filter state using dynamic calculation
  const filteredMaterials = useMemo(() => {
    if (filterState === 'all') return mockMaterialRequirements;
    return mockMaterialRequirements.filter(material => {
      const availability = checkMaterialAvailability(material.materialName, material.requiredQuantity, material.unit);
      return availability.status === filterState;
    });
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
      
      // Update group status based on dynamic material availability
      const availability = checkMaterialAvailability(material.materialName, material.requiredQuantity, material.unit);
      if (availability.status === 'shortage' || availability.status === 'partial') {
        groups[orderId].hasShortages = true;
        groups[orderId].allAvailable = false;
      }
      
      if (availability.status !== 'available') {
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

  // Calculate shortage alert using dynamic calculation
  const shortageAlert = useMemo(() => {
    const shortages = mockMaterialRequirements.filter(mr => {
      const availability = checkMaterialAvailability(mr.materialName, mr.requiredQuantity, mr.unit);
      return availability.status === 'shortage' || availability.status === 'partial';
    });
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

  // Get order title with first material context - enhanced for 2-row display
  const getOrderTitle = (orderId: string, group: GroupedMaterials) => {
    // Get primary material context from the first material in the group
    const primaryMaterial = group.materials[0];
    const materialContext = primaryMaterial ? primaryMaterial.materialName : 'Materials';
    
    return `${orderId} — ${materialContext}`;
  };


  // Get material status using dynamic calculation
  const getMaterialStatus = (group: GroupedMaterials) => {
    const shortageCount = group.materials.filter(m => {
      const availability = checkMaterialAvailability(m.materialName, m.requiredQuantity, m.unit);
      return availability.status === 'shortage' || availability.status === 'partial';
    }).length;
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

  // Get order status without urgency (to avoid duplication)
  const getOrderStatus = (group: GroupedMaterials) => {
    if (group.orderStatus === 'success') {
      return '📊 All available';
    } else if (group.hasShortages) {
      return '📊 Mixed status';
    } else {
      return '📊 Pending';
    }
  };

  // Get aggregate meta content - financial impact focus
  const getOrderMeta = (group: GroupedMaterials) => {
    // Get earliest (most urgent) date only
    const dates = group.materials.map(m => new Date(m.requiredDate)).sort((a, b) => a.getTime() - b.getTime());
    const earliestDate = dates[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    
    // Calculate estimated cost impact using dynamic calculation
    const shortages = group.materials.filter(m => {
      const availability = checkMaterialAvailability(m.materialName, m.requiredQuantity, m.unit);
      return availability.status === 'shortage' || availability.status === 'partial';
    });
    let estimatedCost = 0;
    
    shortages.forEach(material => {
      const availability = checkMaterialAvailability(material.materialName, material.requiredQuantity, material.unit);
      // Rough cost estimation: Cotton Yarn ~75/kg, Dye ~200/kg, Fabric ~60/meter
      let unitCost = 75; // default
      if (material.materialName.toLowerCase().includes('dye')) unitCost = 200;
      if (material.materialName.toLowerCase().includes('fabric')) unitCost = 60;
      if (material.materialName.toLowerCase().includes('zipper')) unitCost = 15;
      
      estimatedCost += availability.shortage * unitCost;
    });
    
    // Create financial impact line
    let statusLine;
    if (shortages.length === 0) {
      statusLine = 'All materials available';
    } else {
      statusLine = `₹${estimatedCost.toLocaleString()} estimated cost`;
    }
    
    return `${statusLine}\nDue: ${earliestDate}`;
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
                const orderMeta = getOrderMeta(group);
                
                return (
                  <div key={group.orderId} className="ds-card-container" data-order-id={group.orderId}>
                  {/* 140px Fixed Height Card Template */}
                  <div 
                    className={`ds-card ${group.orderStatus === 'success' ? 'ds-card-status-active' : group.orderStatus === 'shortage' ? 'ds-card-priority-high' : 'ds-card-status-pending'} ${isExpandedCard ? 'ds-card-expanded' : ''}`}
                    onClick={() => toggleOrderExpansion(group.orderId)}
                  >
                    {/* Template Header - 20px font, dynamic 1-2 rows with material context */}
                    <div 
                      className="ds-card-header"
                      title={`Order ${group.orderId} - ${materialStatus.text}`}
                    >
                      {getOrderTitle(group.orderId, group)}
                    </div>
                    
                    {/* Template Status - 16px font, 21px height - Remove urgency duplicate */}
                    <div className="ds-card-status">
                      <span>{materialStatus.icon} {materialStatus.text}</span>
                      <span>•</span>
                      <span>{getOrderStatus(group)}</span>
                    </div>
                    
                    {/* Template Meta - 14px font, 34px max height, 2-line clamp - Real MR data */}
                    <div 
                      className="ds-card-meta"
                      title={orderMeta}
                    >
                      {orderMeta}
                    </div>

                    {/* Expand Indicator - Standard positioning */}
                    <div className="ds-card-expand-indicator">
                      {isExpandedCard ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Progressive Disclosure - Standard Pattern */}
                  {isExpandedCard && (
                    <div className="ds-expanded-details">
                      <div className="ds-details-content">
                        <h4>📋 Material Details</h4>
                        
                        {/* Order-level Strategic Overview */}
                        <div className={styles.mrInfoSection}>
                          <div className={styles.mrInfo}>
                            <span><strong>Timeline:</strong> {(() => {
                              const dates = group.materials.map(m => new Date(m.requiredDate)).sort((a, b) => a.getTime() - b.getTime());
                              const earliestDate = dates[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                              const latestDate = dates[dates.length - 1].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                              return dates.length > 1 ? `${earliestDate} - ${latestDate}` : earliestDate;
                            })()}</span>
                            <span><strong>Materials:</strong> {(() => {
                              const urgentCount = group.materials.filter(m => m.urgency === 'high').length;
                              const mediumCount = group.materials.filter(m => m.urgency === 'medium').length;
                              const lowCount = group.materials.filter(m => m.urgency === 'low').length;
                              const parts = [];
                              if (urgentCount > 0) parts.push(`${urgentCount} High`);
                              if (mediumCount > 0) parts.push(`${mediumCount} Medium`);
                              if (lowCount > 0) parts.push(`${lowCount} Low`);
                              return `${group.materials.length} items (${parts.join(', ')} urgency)`;
                            })()}</span>
                            <span><strong>Status:</strong> {group.hasShortages ? `Production ${group.materials.some(m => m.notes?.includes('blocked')) ? 'blocked' : 'impacted'} - multiple shortages` : 'All materials available'}</span>
                          </div>
                        </div>

                        {/* Material Table - Mobile optimized */}
                        <div className={styles.expandedTableContainer}>
                          <table className={styles.materialTable}>
                            <thead>
                              <tr>
                                <th>Material</th>
                                <th>Due Date</th>
                                <th>Urgency</th>
                                <th>Shortfall</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.materials.map(material => {
                                const availability = checkMaterialAvailability(material.materialName, material.requiredQuantity, material.unit);
                                return (
                                <tr key={material.id} className={`${styles.materialRow} ${styles[availability.status]}`}>
                                  <td>
                                    <div className={styles.materialName}>{material.materialName}</div>
                                    <div className={styles.materialUnit}>{material.unit}</div>
                                  </td>
                                  <td className={styles.dateCell}>
                                    {new Date(material.requiredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                  </td>
                                  <td className={styles.urgencyCell}>
                                    <span className={`${styles.urgencyBadge} ${styles[material.urgency]}`}>
                                      {material.urgency === 'high' ? '🔥 High' : material.urgency === 'medium' ? '⚡ Medium' : '📅 Low'}
                                    </span>
                                  </td>
                                  <td className={`${styles.shortfallCell} ${availability.shortage > 0 ? styles.hasShortage : styles.noShortage}`}>
                                    {availability.shortage > 0 ? `${availability.shortage.toLocaleString()}${material.unit}` : '—'}
                                  </td>
                                  <td className={styles.actionCell}>
                                    {(availability.status === 'shortage' || availability.status === 'partial') && (
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
                                );
                              })}
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