import React, { useMemo } from 'react';
import { mockConsolidatedPurchaseRequests } from '../../data/procurementMockData';
import { 
  getImpactLevelDisplay, 
  getVendorBreakdown, 
  getInvestmentPercentage,
  approveConsolidatedPR,
  rejectConsolidatedPR 
} from '../../data/materialHelpers';
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
  
  // Filter consolidated PRs based on filter state  
  const filteredPRs = useMemo(() => {
    if (filterState === 'all') return mockConsolidatedPurchaseRequests;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    switch (filterState) {
      case 'pending_approval':
        return mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'pending');
      case 'high_impact':
        return mockConsolidatedPurchaseRequests.filter(pr => {
          const percentage = (pr.totalEstimatedCost / pr.orderValue) * 100;
          return percentage > 60 || pr.totalEstimatedCost > 400000;
        });
      case 'urgent_delivery':
        return mockConsolidatedPurchaseRequests.filter(pr => 
          new Date(pr.requiredDate) <= nextWeek
        );
      case 'approved':
        return mockConsolidatedPurchaseRequests.filter(pr => pr.status === 'approved');
      default:
        return mockConsolidatedPurchaseRequests.filter(pr => pr.status === filterState);
    }
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (prId: string) => {
    toggleExpansion(prId, 'data-pr-id');
  };
  
  // Consolidated PR action handlers
  const handleApproval = (prId: string) => {
    const result = approveConsolidatedPR(prId, 'Production Manager', 'Materials approved for customer delivery timeline');
    if (result) {
      alert(`✅ Approved ${result.customerName} materials investment of ₹${result.totalEstimatedCost.toLocaleString()}`);
    }
  };

  const handleRejection = (prId: string) => {
    const reason = prompt('Please provide rejection reason:');
    if (reason) {
      const result = rejectConsolidatedPR(prId, 'Production Manager', reason);
      if (result) {
        alert(`❌ Rejected ${result.customerName} materials request: ${reason}`);
      }
    }
  };

  const handleQuoteRequest = (prId: string) => {
    const pr = filteredPRs.find(p => p.id === prId);
    if (pr) {
      alert(`📝 Requesting vendor quotes for ${pr.customerName} materials (₹${pr.totalEstimatedCost.toLocaleString()})`);
    }
  };

  const handlePOGeneration = (prId: string) => {
    const pr = filteredPRs.find(p => p.id === prId);
    if (pr) {
      alert(`📋 Generating Purchase Orders for ${pr.customerName} - will create vendor-specific POs`);
    }
  };

  const handleViewRelatedPOs = (prId: string) => {
    alert(`🔍 Navigating to Purchase Orders for Consolidated PR: ${prId}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
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
  const totalPendingInvestment = filteredPRs
    .filter(pr => pr.status === 'pending')
    .reduce((sum, pr) => sum + pr.totalEstimatedCost, 0);

  return (
    <div className={styles.purchaseRequestsScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when pending approvals exist */}
        {pendingCount > 0 && (
          <div className={styles.alertHeader}>
            ⚠️ {pendingCount} CUSTOMER ORDERS NEED REVIEW
            <small>Total Investment Pending: {formatCurrency(totalPendingInvestment)}</small>
          </div>
        )}

        <div className={styles.prContainer}>
          {filteredPRs.map(pr => {
            const statusInfo = getStatusInfo(pr.status);
            const impactLevel = getImpactLevelDisplay(pr.totalEstimatedCost, pr.orderValue);

            return (
              <div key={pr.id} className="ds-card-container" data-pr-id={pr.id}>
                {/* Clickable Card Summary - Customer-Centric Format */}
                <div 
                  className={`ds-card ${pr.status === 'approved' ? 'ds-card-status-active' : pr.status === 'pending' ? 'ds-card-status-pending' : 'ds-card-status-inactive'} ${isExpanded(pr.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(pr.id)}
                >
                  {/* Header - Customer & Order Value Priority */}
                  <div 
                    className="ds-card-header"
                    title={`${pr.customerName} Order ${pr.salesOrderId} - ${formatCurrency(pr.orderValue)} total value`}
                  >
                    {pr.customerName} — {formatCurrency(pr.orderValue)} Order
                  </div>
                  
                  {/* Status - Business Impact Level */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label} • {impactLevel}
                  </div>
                  
                  {/* Meta - Business Value & Urgency */}
                  <div 
                    className="ds-card-meta"
                    title={`${pr.materials.length} materials • ${formatCurrency(pr.totalEstimatedCost)} investment • Due: ${formatDate(pr.requiredDate)}`}
                  >
                    {pr.materials.length} materials • {formatCurrency(pr.totalEstimatedCost)}<br />
                    Due: {formatDate(pr.requiredDate)} • {getInvestmentPercentage(pr.totalEstimatedCost, pr.orderValue)}% of order
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(pr.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Organized Approval Context */}
                {isExpanded(pr.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📋 Purchase Request Analysis</h4>
                      
                      {/* Section 1: Key Business Metrics */}
                      <div className={styles.businessMetrics}>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Order Value</span>
                          <span className={styles.metricValue}>{formatCurrency(pr.orderValue)}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Material Investment</span>
                          <span className={styles.metricValue}>{formatCurrency(pr.totalEstimatedCost)}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Investment %</span>
                          <span className={styles.metricValue}>{getInvestmentPercentage(pr.totalEstimatedCost, pr.orderValue)}%</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Materials Count</span>
                          <span className={styles.metricValue}>{pr.materials.length} items</span>
                        </div>
                      </div>
                      
                      {/* Section 2: Materials Breakdown */}
                      <div className={styles.materialsSection}>
                        <h5>📦 Materials Required ({pr.materials.length} items)</h5>
                        
                        {/* Desktop Table View */}
                        <div className={styles.materialsTable}>
                          <div className={styles.tableHeader}>
                            <div>Material</div>
                            <div>Quantity</div>
                            <div>Unit Cost</div>
                            <div>Total Cost</div>
                            <div>Priority</div>
                            <div>Vendor</div>
                          </div>
                          {pr.materials.map((material, index) => (
                            <div key={index} className={styles.tableRow}>
                              <div className={styles.materialName}>{material.materialName}</div>
                              <div>{material.requiredQuantity} {material.unit}</div>
                              <div>{formatCurrency(material.estimatedUnitCost)}</div>
                              <div>{formatCurrency(material.estimatedTotalCost)}</div>
                              <div className={`${styles.priority} ${styles[material.urgency]}`}>
                                {material.urgency}
                              </div>
                              <div>{material.preferredVendor || 'TBD'}</div>
                            </div>
                          ))}
                        </div>

                        {/* Mobile Card View */}
                        <div className={styles.materialsMobile}>
                          {pr.materials.map((material, index) => (
                            <div key={index} className={styles.materialCard}>
                              <div className={styles.materialCardHeader}>
                                <div className={styles.materialCardName}>{material.materialName}</div>
                                <div className={`${styles.priority} ${styles[material.urgency]}`}>
                                  {material.urgency}
                                </div>
                              </div>
                              <div className={styles.materialCardBody}>
                                <div className={styles.materialCardRow}>
                                  <span className={styles.materialLabel}>Quantity:</span>
                                  <span className={styles.materialValue}>{material.requiredQuantity} {material.unit}</span>
                                </div>
                                <div className={styles.materialCardRow}>
                                  <span className={styles.materialLabel}>Unit Cost:</span>
                                  <span className={styles.materialValue}>{formatCurrency(material.estimatedUnitCost)}</span>
                                </div>
                                <div className={styles.materialCardRow}>
                                  <span className={styles.materialLabel}>Total Cost:</span>
                                  <span className={styles.materialValue}>{formatCurrency(material.estimatedTotalCost)}</span>
                                </div>
                                <div className={styles.materialCardRow}>
                                  <span className={styles.materialLabel}>Vendor:</span>
                                  <span className={styles.materialValue}>{material.preferredVendor || 'TBD'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Section 3: Timeline & Context */}
                      <div className={styles.contextSection}>
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>⏰ Timeline</div>
                          <div className={styles.contextContent}>
                            <div>Requested: {formatDate(pr.requestDate)} by {pr.requestedBy}</div>
                            <div>Required: {formatDate(pr.requiredDate)} for delivery</div>
                            {pr.reviewedBy && <div>Reviewed: {formatDate(pr.reviewDate!)} by {pr.reviewedBy}</div>}
                          </div>
                        </div>
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>💼 Business Justification</div>
                          <div className={styles.contextContent}>
                            {pr.businessJustification}
                          </div>
                        </div>
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>🏭 Vendor Distribution</div>
                          <div className={styles.contextContent}>
                            {getVendorBreakdown(pr.materials)}
                          </div>
                        </div>
                      </div>
                      
                      {pr.notes && (
                        <div className={styles.notesSection}>
                          <strong>📝 Notes:</strong> {pr.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Consolidated PR Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {pr.status === 'pending' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleApproval(pr.id)}
                            >
                              ✅ Approve {formatCurrency(pr.totalEstimatedCost)} Investment
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleQuoteRequest(pr.id)}
                            >
                              📝 Request Vendor Quotes
                            </button>
                            <button 
                              className="ds-btn ds-btn-danger"
                              onClick={() => handleRejection(pr.id)}
                            >
                              ❌ Reject Request
                            </button>
                          </>
                        )}
                        {pr.status === 'approved' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handlePOGeneration(pr.id)}
                            >
                              📋 Generate Purchase Orders
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleViewRelatedPOs(pr.id)}
                            >
                              👁️ View Related POs
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