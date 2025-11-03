import React from 'react';
import { mockReceivables, ReceivableRecord } from '../../data/salesMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './ReceivablesManagement.module.css';

interface ReceivablesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
  onShowCustomerProfile?: (customerId: string) => void;
}

const ReceivablesManagement = ({ filterState, onFilterChange, onShowCustomerProfile }: ReceivablesProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();

  // Toggle expansion for receivable details with sequential behavior
  const toggleDetails = (receivableId: string) => {
    toggleExpansion(receivableId, 'data-receivable-id');
  };

  // Credit aging analysis with filtering
  const getFilteredReceivables = (): ReceivableRecord[] => {
    const receivables = mockReceivables.filter(rec => {
      if (filterState === 'current') return rec.agingCategory === 'current';
      if (filterState === 'aging_30') return rec.agingCategory === '31-60';
      if (filterState === 'aging_60') return rec.agingCategory === '61-90';
      if (filterState === 'overdue') return rec.agingCategory === '90+';
      if (filterState === 'critical') return rec.customerRisk === 'critical';
      return true;
    });
    
    return receivables.sort((a, b) => b.daysPastDue - a.daysPastDue);
  };

  // Get global priority class for aging category (matches Leads pattern)
  const getAgingPriorityClass = (agingCategory: string): string => {
    switch (agingCategory) {
      case 'current': return 'ds-card-status-active';     // Green border, white background
      case '31-60': return 'ds-card-priority-medium';    // Amber border, white background
      case '61-90': return 'ds-card-priority-high';      // Orange border, white background
      case '90+': return 'ds-card-status-inactive';      // Red border, white background
      default: return '';
    }
  };

  // Get aging icon
  const getAgingIcon = (agingCategory: string): string => {
    switch (agingCategory) {
      case 'current': return '💚';
      case '31-60': return '🟡';
      case '61-90': return '🟠';
      case '90+': return '🔴';
      default: return '📊';
    }
  };

  // Get risk icon
  const getRiskIcon = (customerRisk: string): string => {
    switch (customerRisk) {
      case 'low': return '💚';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '📊';
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

  // Render individual receivable card
  const renderReceivableCard = (receivable: ReceivableRecord) => (
    <div key={receivable.id} className="ds-card-container" data-receivable-id={receivable.id}>
      <div 
        className={`ds-card ${getAgingPriorityClass(receivable.agingCategory)} ${isExpanded(receivable.id) ? 'ds-card-expanded' : ''}`}
        onClick={() => toggleDetails(receivable.id)}
      >
      {/* Customer and amount header */}
      <div className="ds-card-header">
        {receivable.customerName} — ₹{formatCurrency(receivable.balanceAmount)}
      </div>
      
      {/* Aging and risk status */}
      <div className="ds-card-status">
        {getAgingIcon(receivable.agingCategory)} {receivable.agingCategory.toUpperCase()} • 
        {getRiskIcon(receivable.customerRisk)} {receivable.customerRisk.toUpperCase()} • 
        {receivable.orderType === 'job_order' ? '🔧 Job Work' : '📦 Sales'}
      </div>
      
      {/* Invoice and timing meta */}
      <div className="ds-card-meta">
        {receivable.invoiceNumber} • Due: {receivable.dueDate} • 
        {receivable.daysPastDue > 0 ? `${receivable.daysPastDue} days overdue` : 'Current'}
      </div>

      {/* Expand Indicator */}
      <div className="ds-card-expand-indicator">
        {isExpanded(receivable.id) ? 'Less' : 'More'}
      </div>
    </div>

    {/* Expanded details for collection management */}
    {isExpanded(receivable.id) && (
      <div className={styles.expandedSection}>
          {/* Payment and collection details */}
          <div className={styles.receivablesDetailsSection}>
            <h4>Payment Details</h4>
            <div className={styles.detailsGrid}>
              <p><strong>Original Amount:</strong> ₹{formatCurrency(receivable.originalAmount)}</p>
              <p><strong>Payments Received:</strong> ₹{formatCurrency(receivable.receivedAmount)}</p>
              <p><strong>Outstanding Balance:</strong> ₹{formatCurrency(receivable.balanceAmount)}</p>
              <p><strong>Days Past Due:</strong> {receivable.daysPastDue} days</p>
              <p><strong>Payment History:</strong> {receivable.paymentHistory}</p>
              <p><strong>Last Payment:</strong> {receivable.lastPaymentDate || 'No payments yet'}</p>
            </div>
          </div>
          
          {/* Customer information */}
          <div className={styles.receivablesCustomerSection}>
            <h4>Customer Information</h4>
            <div className={styles.detailsGrid}>
              <p><strong>Customer:</strong> {receivable.customerName}</p>
              <p><strong>Company:</strong> {receivable.companyName}</p>
              <p><strong>Risk Level:</strong> {receivable.customerRisk}</p>
              <p><strong>Order Type:</strong> {receivable.orderType === 'job_order' ? 'Job Work Service' : 'Sales Order'}</p>
              <p><strong>Credit Utilization:</strong> {receivable.creditUtilization}%</p>
              <p><strong>Credit Limit:</strong> ₹{formatCurrency(receivable.creditLimit)}</p>
              {receivable.assignedCollector && (
                <p><strong>Assigned Collector:</strong> {receivable.assignedCollector}</p>
              )}
            </div>
          </div>
          
          {/* Action buttons for collection activities */}
          <div className={styles.expandedActions}>
            <button className="ds-btn ds-btn-primary">📧 Send Payment Reminder</button>
            <button className="ds-btn ds-btn-secondary">📞 Schedule Collection Call</button>
            <button className="ds-btn ds-btn-secondary">💰 Record Payment</button>
            <button className="ds-btn ds-btn-secondary">👤 Customer Profile</button>
            {receivable.customerRisk === 'critical' && (
              <button className="ds-btn ds-btn-warning">🚨 Escalate Collection</button>
            )}
        </div>
      </div>
    )}
    </div>
  );

  const filteredReceivables = getFilteredReceivables();

  return (
    <div className={styles.receivablesManagement}>
      {/* Aging analysis summary */}
      {filteredReceivables.length > 0 && (
        <div className={`${styles.receivablesSummary} ds-summary-success`}>
          <div className={styles.agingSummaryHeader}>
            <h3>Receivables Aging Analysis</h3>
            <p>Total Outstanding: ₹{formatCurrency(
              filteredReceivables.reduce((sum, rec) => sum + rec.balanceAmount, 0)
            )}</p>
          </div>
        </div>
      )}
      
      {/* Receivables cards */}
      <div className={styles.receivablesCards}>
        {filteredReceivables.length > 0 ? (
          filteredReceivables.map(receivable => renderReceivableCard(receivable))
        ) : (
          <div className={styles.noReceivables}>
            <p>No receivables found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivablesManagement;