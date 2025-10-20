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
  
  // Get request context for status (instead of priority duplicate)
  const getRequestContext = (justification: string) => {
    if (justification.toLowerCase().includes('critical') || justification.toLowerCase().includes('urgent')) {
      return '🔥 Critical shortage';
    } else if (justification.toLowerCase().includes('shortage') || justification.toLowerCase().includes('blocked')) {
      return '⚠️ Production impact';
    } else {
      return '📋 Standard request';
    }
  };
  
  // Extract order ID from justification text
  const extractOrderId = (justification: string) => {
    const match = justification.match(/Order ([\w-]+)/);
    return match ? match[1] : 'Production';
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
            const requestContext = getRequestContext(pr.justification);

            return (
              <div key={pr.id} className="ds-card-container" data-pr-id={pr.id}>
                {/* Clickable Card Summary - 140px Template */}
                <div 
                  className={`ds-card ${pr.status === 'approved' ? 'ds-card-status-active' : pr.status === 'pending' ? 'ds-card-status-pending' : 'ds-card-status-inactive'} ${isExpanded(pr.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(pr.id)}
                >
                  {/* Template Header - Optimized PR# Format */}
                  <div 
                    className="ds-card-header"
                    title={`${pr.materialName} (PR ID: ${pr.id})`}
                  >
                    PR#{pr.id.replace('PR-', '').replace('2024-', '')} — {pr.materialName}
                  </div>
                  
                  {/* Template Status - Remove priority duplicate */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label} • {requestContext}
                  </div>
                  
                  {/* Template Meta - Approval screening: cost + accountability (remove priority duplicate) */}
                  <div 
                    className="ds-card-meta"
                    title={`₹${pr.estimatedCost.toLocaleString()} request by ${pr.requestedBy} • ${pr.justification}`}
                  >
                    ₹{pr.estimatedCost.toLocaleString()} • {pr.requestedBy}<br />
                    For Order {extractOrderId(pr.justification)}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(pr.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Approval Decision Context */}
                {isExpanded(pr.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📋 Purchase Request Details</h4>
                      
                      <p><strong>Financial Impact:</strong> ₹{pr.estimatedCost.toLocaleString()} ({pr.quantity}{pr.unit} {pr.materialName})</p>
                      <p><strong>Business Context:</strong> {pr.justification}</p>
                      <p><strong>Request Timeline:</strong> {formatDate(pr.requestDate)} by {pr.requestedBy} ({pr.department})</p>
                      <p><strong>Approval Status:</strong> {statusInfo.label} • {priority === 'urgent' ? '🔥 High priority' : '📅 Normal priority'}</p>
                      <p><strong>Material Details:</strong> {pr.materialName} - {pr.quantity}{pr.unit} needed</p>
                      {pr.reviewedBy && <p><strong>Review Status:</strong> {pr.reviewedBy} on {formatDate(pr.reviewDate!)}</p>}
                      {pr.notes && <p><strong>Notes:</strong> {pr.notes}</p>}
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