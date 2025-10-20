import React, { useMemo } from 'react';
import { mockPurchaseRequests } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './PurchaseRequests.module.css';

interface PurchaseRequestsProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PurchaseRequests = ({ 
  filterState, 
  onFilterChange 
}: PurchaseRequestsProps) => {
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter PRs based on filter state
  const filteredPRs = useMemo(() => {
    if (filterState === 'all') return mockPurchaseRequests;
    return mockPurchaseRequests.filter(pr => pr.status === filterState);
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (prId: string) => {
    toggleExpansion(prId, 'data-pr-id');
  };
  
  // Mock action handlers
  const handlePRAction = (action: string, prId: string) => {
    alert(`${action} action for PR ${prId} - Mock functionality`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get priority level from justification
  const getPriority = (justification: string) => {
    return justification.toLowerCase().includes('critical') || justification.toLowerCase().includes('urgent') 
      ? 'urgent' : 'normal';
  };
  
  // Get status icon and styling
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', label: 'Pending', className: 'pending' };
      case 'approved':
        return { icon: '✅', label: 'Approved', className: 'approved' };
      case 'rejected':
        return { icon: '❌', label: 'Rejected', className: 'rejected' };
      default:
        return { icon: '📋', label: 'Unknown', className: 'default' };
    }
  };

  // Calculate pending approvals for alert header
  const pendingCount = filteredPRs.filter(pr => pr.status === 'pending').length;

  return (
    <div className={styles.purchaseRequestsScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when pending approvals exist */}
        {pendingCount > 0 && (
          <div className={styles.alertHeader}>
            ⚠️ {pendingCount} PENDING APPROVALS
          </div>
        )}

        <div className={styles.prContainer}>
          {filteredPRs.map(pr => {
            const statusInfo = getStatusInfo(pr.status);
            const priority = getPriority(pr.justification);

            return (
              <div key={pr.id} className={styles.prCardContainer} data-pr-id={pr.id}>
                {/* Clickable Card Summary - 140px Template */}
                <div 
                  className={`${styles.prCard} ${styles[statusInfo.className]} ${isExpanded(pr.id) ? styles.expanded : ''}`}
                  onClick={() => toggleDetails(pr.id)}
                >
                  {/* Template Header - Optimized PR# Format */}
                  <div 
                    className={styles.cardHeader}
                    title={`${pr.materialName} (PR ID: ${pr.id})`}
                  >
                    PR#{pr.id.replace('PR-', '').replace('2024-', '')}
                  </div>
                  
                  {/* Template Status - Following established pattern */}
                  <div className={styles.cardStatus}>
                    {statusInfo.icon} {statusInfo.label} • {priority === 'urgent' ? '🔥 Urgent' : '📅 Normal'}
                  </div>
                  
                  {/* Template Meta - 2 lines with material name first */}
                  <div 
                    className={styles.cardMeta}
                    title={`${pr.materialName} (${pr.quantity} ${pr.unit}) • Est. Value: ₹${pr.estimatedCost.toLocaleString()}`}
                  >
                    {pr.materialName} ({pr.quantity} {pr.unit})<br />
                    Est. Value: ₹{pr.estimatedCost.toLocaleString()}
                  </div>

                  {/* Expand Indicator */}
                  <div className={styles.expandIndicator}>
                    {isExpanded(pr.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Detailed Information */}
                {isExpanded(pr.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <p><strong>Department:</strong> {pr.department} - {pr.requestedBy}</p>
                      <p><strong>Request Date:</strong> {formatDate(pr.requestDate)} | <strong>Priority:</strong> {priority === 'urgent' ? '🔥 Urgent' : '📅 Normal'}</p>
                      <p><strong>Material:</strong> {pr.materialName} ({pr.quantity} {pr.unit})</p>
                      <p><strong>Estimated Cost:</strong> ₹{pr.estimatedCost.toLocaleString()}</p>
                      <p><strong>Justification:</strong> {pr.justification}</p>
                      {pr.reviewedBy && <p><strong>Reviewed By:</strong> {pr.reviewedBy} on {formatDate(pr.reviewDate!)}</p>}
                    </div>
                    
                    {/* Internal Workflow Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {pr.status === 'pending' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handlePRAction('approve', pr.id)}
                            >
                              ✅ Approve
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handlePRAction('reject', pr.id)}
                            >
                              ❌ Reject
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handlePRAction('edit', pr.id)}
                            >
                              📝 Edit
                            </button>
                          </>
                        )}
                        {pr.status === 'approved' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handlePRAction('create-po', pr.id)}
                          >
                            📋 Create PO
                          </button>
                        )}
                        {pr.status === 'rejected' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handlePRAction('revise', pr.id)}
                            >
                              🔄 Revise
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handlePRAction('resubmit', pr.id)}
                            >
                              📤 Resubmit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;