import React from 'react';
import { mockPayables, PayableRecord } from '../../data/salesMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './PayablesManagement.module.css';

interface PayablesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PayablesManagement = ({ filterState, onFilterChange }: PayablesProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();

  // Toggle expansion for payable details with sequential behavior
  const toggleDetails = (payableId: string) => {
    toggleExpansion(payableId, 'data-payable-id');
  };

  // Get filtered payables based on current filter state
  const getFilteredPayables = (): PayableRecord[] => {
    return mockPayables.filter(payable => {
      if (filterState === 'due_today') return payable.daysToDue === 0;
      if (filterState === 'due_week') return payable.daysToDue >= 0 && payable.daysToDue <= 7;
      if (filterState === 'upcoming') return payable.daysToDue > 7;
      if (filterState === 'overdue') return payable.daysToDue < 0;
      if (filterState === 'critical') return payable.criticalSupplier;
      return true;
    }).sort((a, b) => a.daysToDue - b.daysToDue);
  };

  // Get global priority class for payment status (matches mock data status values)
  const getPaymentPriorityClass = (status: string): string => {
    switch (status) {
      case 'upcoming': return 'ds-card-priority-low';       // Blue border - upcoming payments
      case 'due_today': return 'ds-card-priority-medium';   // Amber border - due today
      case 'due_soon': return 'ds-card-priority-high';      // Orange border - due soon  
      case 'overdue': return 'ds-card-status-inactive';     // Red border - overdue payments
      default: return '';
    }
  };

  // Get payable status icon (matches mock data status values)
  const getPayableStatusIcon = (status: string): string => {
    switch (status) {
      case 'upcoming': return '💙';      // Blue circle for upcoming
      case 'due_today': return '🟡';     // Amber circle for due today
      case 'due_soon': return '🟠';      // Orange circle for due soon
      case 'overdue': return '🔴';       // Red circle for overdue
      default: return '📋';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'materials': return '📦';
      case 'chemicals': return '🧪';
      case 'services': return '🔧';
      case 'utilities': return '⚡';
      case 'equipment': return '🏭';
      default: return '📋';
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '');
  };

  // Render individual payable card
  const renderPayableCard = (payable: PayableRecord) => (
    <div key={payable.id} className="ds-card-container" data-payable-id={payable.id}>
      <div 
        className={`ds-card ${getPaymentPriorityClass(payable.status)} ${isExpanded(payable.id) ? 'ds-card-expanded' : ''}`}
        onClick={() => toggleDetails(payable.id)}
      >
      {/* Vendor and amount header */}
      <div className="ds-card-header">
        {payable.vendorName} — ₹{formatCurrency(payable.balanceAmount)}
      </div>
      
      {/* Status and category */}
      <div className="ds-card-status">
        {getPayableStatusIcon(payable.status)} {payable.status.replace('_', ' ').toUpperCase()} • 
        {getCategoryIcon(payable.category)} {payable.category.replace('_', ' ')} • 
        {payable.criticalSupplier ? '⚠️ Critical' : '📋 Standard'}
      </div>
      
      {/* Due date and timing meta */}
      <div className="ds-card-meta">
        {payable.billNumber} • Due: {payable.dueDate} • 
        {payable.daysToDue >= 0 ? `${payable.daysToDue} days remaining` : `${Math.abs(payable.daysToDue)} days overdue`}
      </div>

      {/* Expand Indicator */}
      <div className="ds-card-expand-indicator">
        {isExpanded(payable.id) ? 'Less' : 'More'}
      </div>
    </div>

    {/* Expanded details for payment planning */}
    {isExpanded(payable.id) && (
      <div className={styles.expandedSection}>
          {/* Payment details */}
          <div className={styles.payablesDetailsSection}>
            <h4>Payment Details</h4>
            <div className={styles.detailsGrid}>
              <p><strong>Bill Amount:</strong> ₹{formatCurrency(payable.totalAmount)}</p>
              <p><strong>Payments Made:</strong> ₹{formatCurrency(payable.paidAmount)}</p>
              <p><strong>Outstanding Balance:</strong> ₹{formatCurrency(payable.balanceAmount)}</p>
              <p><strong>Payment Method:</strong> {payable.paymentMethod}</p>
              <p><strong>Payment Terms:</strong> {payable.paymentTerms}</p>
              <p><strong>Due Date:</strong> {payable.dueDate}</p>
              {payable.earlyPaymentDiscount && (
                <p><strong>Early Payment Discount:</strong> {payable.earlyPaymentDiscount}% (Save ₹{formatCurrency(payable.balanceAmount * payable.earlyPaymentDiscount / 100)})</p>
              )}
            </div>
          </div>
          
          {/* Vendor relationship */}
          <div className={styles.payablesVendorSection}>
            <h4>Vendor Information</h4>
            <div className={styles.detailsGrid}>
              <p><strong>Vendor Rating:</strong> {payable.vendorRating}/5 ⭐</p>
              <p><strong>Vendor Type:</strong> {payable.vendorType.replace('_', ' ')}</p>
              <p><strong>Priority Level:</strong> {payable.priority}</p>
              <p><strong>Relationship:</strong> {payable.criticalSupplier ? 'Critical Supplier' : 'Standard Vendor'}</p>
              <p><strong>Category:</strong> {payable.category.replace('_', ' ')}</p>
              <p><strong>Sub Category:</strong> {payable.subCategory || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Action buttons for payment management */}
          <div className={styles.expandedActions}>
            <button className="ds-btn ds-btn-primary">💰 Schedule Payment</button>
            <button className="ds-btn ds-btn-secondary">✅ Request Approval</button>
            <button className="ds-btn ds-btn-secondary">🏢 Vendor Details</button>
            <button className="ds-btn ds-btn-secondary">📋 Payment History</button>
            {payable.earlyPaymentDiscount && (
              <button className="ds-btn ds-btn-success">⚡ Pay Early & Save</button>
            )}
            {payable.daysToDue < 0 && (
              <button className="ds-btn ds-btn-warning">⚠️ Overdue Alert</button>
            )}
        </div>
      </div>
    )}
    </div>
  );

  const filteredPayables = getFilteredPayables();

  return (
    <div className={styles.payablesManagement}>
      {/* Payment summary */}
      {filteredPayables.length > 0 && (
        <div className={`${styles.payablesSummary} ds-summary-primary`}>
          <div className={styles.paymentSummaryHeader}>
            <h3>Payment Management Dashboard</h3>
            <p>Total Payables: ₹{formatCurrency(
              filteredPayables.reduce((sum, payable) => sum + payable.balanceAmount, 0)
            )}</p>
            {filteredPayables.some(p => p.earlyPaymentDiscount) && (
              <p className={styles.potentialSavings}>
                Potential Early Payment Savings: ₹{formatCurrency(
                  filteredPayables
                    .filter(p => p.earlyPaymentDiscount)
                    .reduce((sum, p) => sum + (p.balanceAmount * (p.earlyPaymentDiscount || 0) / 100), 0)
                )}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Payables cards */}
      <div className={styles.payablesCards}>
        {filteredPayables.length > 0 ? (
          filteredPayables.map(payable => renderPayableCard(payable))
        ) : (
          <div className={styles.noPayables}>
            <p>No payables found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayablesManagement;