import React from 'react';
import { mockAdvancePayments, mockFinalPayments, type AdvancePayment, type FinalPayment } from '../../data/salesMockData';
import styles from './CustomerPaymentsTab.module.css';

interface CustomerPaymentsTabProps {
  customerId: string;
}

type Payment = (AdvancePayment | FinalPayment) & {
  paymentType: 'advance' | 'final';
};

const CustomerPaymentsTab = ({ customerId }: CustomerPaymentsTabProps) => {
  // Get customer payments and combine them
  const customerAdvancePayments: Payment[] = mockAdvancePayments
    .filter(payment => payment.businessProfileId === customerId)
    .map(payment => ({ ...payment, paymentType: 'advance' as const }));
    
  const customerFinalPayments: Payment[] = mockFinalPayments
    .filter(payment => payment.businessProfileId === customerId)
    .map(payment => ({ ...payment, paymentType: 'final' as const }));

  const allPayments = [...customerAdvancePayments, ...customerFinalPayments]
    .sort((a, b) => {
      const dateA = a.paymentType === 'advance' ? 
        (a as AdvancePayment & { paymentType: 'advance' }).receivedDate || '2024-01-01' : 
        (a as FinalPayment & { paymentType: 'final' }).paymentDate || '2024-01-01';
      const dateB = b.paymentType === 'advance' ? 
        (b as AdvancePayment & { paymentType: 'advance' }).receivedDate || '2024-01-01' : 
        (b as FinalPayment & { paymentType: 'final' }).paymentDate || '2024-01-01';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get payment type display
  const getPaymentTypeDisplay = (paymentType: string) => {
    return paymentType === 'advance' ? 'Advance Payment' : 'Final Payment';
  };

  // Get payment status class
  const getPaymentStatusClass = (status: string) => {
    const statusClasses = {
      'completed': 'completed',
      'pending': 'pending',
      'failed': 'failed',
      'refunded': 'refunded'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'default';
  };

  // Action handlers
  const viewPaymentDetails = (paymentId: string) => {
    alert(`Payment details for ${paymentId} - coming soon!`);
  };

  const generateReceipt = (paymentId: string) => {
    alert(`Receipt generated for payment ${paymentId}`);
  };

  const requestPayment = () => {
    alert(`Payment request sent to customer`);
  };

  if (allPayments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <span className={styles.emptyIcon}>💳</span>
          <h3 className={styles.emptyTitle}>No payments found</h3>
          <p className={styles.emptyDescription}>
            This customer hasn't made any payments yet.
          </p>
          <button className={styles.emptyAction} onClick={requestPayment}>
            Request Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentsTabContainer}>
      <div className={styles.paymentsList}>
        {allPayments.map((payment) => (
          <div key={payment.id} className="ds-card-container">
            <div className="ds-card ds-card-with-actions">
              {/* Payment Header */}
              <div className="ds-card-header">
                <span className={styles.paymentType}>
                  {getPaymentTypeDisplay(payment.paymentType)}
                </span>
                <span className={`ds-badge ${styles.statusBadge} ${styles[getPaymentStatusClass(payment.status)]}`}>
                  {payment.status.toUpperCase()}
                </span>
              </div>
              
              {/* Payment Details */}
              <div className="ds-card-content">
                <div className={styles.paymentAmount}>
                  ₹{formatCurrency(payment.amount)}
                </div>
                <div className="ds-card-meta">
                  {payment.paymentMethod} | {formatDate(payment.paymentType === 'advance' ? 
                    (payment as AdvancePayment & { paymentType: 'advance' }).receivedDate || '2024-01-01' : 
                    (payment as FinalPayment & { paymentType: 'final' }).paymentDate || '2024-01-01')}
                  {(payment.paymentType === 'advance' ? 
                    (payment as AdvancePayment & { paymentType: 'advance' }).bankReference : 
                    (payment as FinalPayment & { paymentType: 'final' }).transactionReference) && (
                    <div className={styles.transactionId}>
                      Ref: {payment.paymentType === 'advance' ? 
                        (payment as AdvancePayment & { paymentType: 'advance' }).bankReference : 
                        (payment as FinalPayment & { paymentType: 'final' }).transactionReference}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Information */}
              <div className={styles.paymentInfo}>
                {payment.paymentType === 'advance' && (payment as AdvancePayment & { paymentType: 'advance' }).quoteId && (
                  <div className={styles.orderReference}>
                    Quote: {(payment as AdvancePayment & { paymentType: 'advance' }).quoteId}
                  </div>
                )}
                {payment.paymentType === 'final' && (payment as FinalPayment & { paymentType: 'final' }).notes && (
                  <div className={styles.paymentNotes}>
                    Note: {(payment as FinalPayment & { paymentType: 'final' }).notes}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="ds-card-actions">
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => viewPaymentDetails(payment.id)}
                >
                  👁️ View
                </button>
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => generateReceipt(payment.id)}
                >
                  📄 Receipt
                </button>
                {(payment.status === 'received' || payment.status === 'verified') && (
                  <button 
                    className="ds-btn ds-btn-primary"
                    onClick={() => generateReceipt(payment.id)}
                  >
                    📧 Send
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerPaymentsTab;