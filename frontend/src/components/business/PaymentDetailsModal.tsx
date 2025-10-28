import React from 'react';
import { AdvancePayment, FinalPayment } from '../../data/salesMockData';
import CustomerDetailsModal from './CustomerDetailsModal';
import styles from './PaymentDetailsModal.module.css';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: (AdvancePayment | FinalPayment) | null;
  paymentType: 'advance' | 'final';
}

const PaymentDetailsModal = ({ isOpen, onClose, payment, paymentType }: PaymentDetailsModalProps) => {
  if (!payment) return null;

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

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    const statusColors = {
      'pending': 'warning',
      'overdue': 'danger',
      'received': 'success',
      'partial': 'warning',
      'verified': 'success',
      'rejected': 'danger'
    };
    return statusColors[status as keyof typeof statusColors] || 'neutral';
  };

  // Get verification status color
  const getVerificationStatusColor = (status?: string) => {
    if (!status) return 'neutral';
    const verificationColors = {
      'pending': 'warning',
      'verified': 'success',
      'rejected': 'danger'
    };
    return verificationColors[status as keyof typeof verificationColors] || 'neutral';
  };

  // Get payment date based on type
  const getPaymentDate = () => {
    if (paymentType === 'advance') {
      return (payment as AdvancePayment).receivedDate || (payment as AdvancePayment).dueDate;
    }
    return (payment as FinalPayment).paymentDate;
  };

  // Get received amount for display
  const getReceivedAmount = () => {
    if (paymentType === 'advance') {
      return (payment as AdvancePayment).receivedAmount || payment.amount;
    }
    return payment.amount;
  };

  return (
    <CustomerDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${paymentType === 'advance' ? 'Advance' : 'Final'} Payment ${payment.id}`}
    >
      <div className={styles.paymentDetailsContent}>
        
        {/* Payment Header Information */}
        <div className={styles.paymentHeader}>
          <div className={styles.paymentInfo}>
            <h3 className={styles.paymentTitle}>
              {paymentType === 'advance' ? 'Advance Payment' : 'Final Payment'}
            </h3>
            <p className={styles.paymentId}>ID: {payment.id}</p>
          </div>
          <div className={styles.paymentBadges}>
            <span className={`${styles.statusBadge} ${styles[getPaymentStatusColor(payment.status)]}`}>
              {payment.status.toUpperCase()}
            </span>
            {payment.verificationStatus && (
              <span className={`${styles.verificationBadge} ${styles[getVerificationStatusColor(payment.verificationStatus)]}`}>
                {payment.verificationStatus.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Payment Amount Information */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Payment Details</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Amount</span>
              <span className={styles.detailValue}>₹{formatCurrency(payment.amount)}</span>
            </div>
            {paymentType === 'advance' && (payment as AdvancePayment).receivedAmount && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Received Amount</span>
                <span className={styles.detailValue}>₹{formatCurrency(getReceivedAmount())}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Method</span>
              <span className={styles.detailValue}>{payment.paymentMethod}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Date</span>
              <span className={styles.detailValue}>{formatDate(getPaymentDate())}</span>
            </div>
            {paymentType === 'advance' && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Due Date</span>
                <span className={styles.detailValue}>{formatDate((payment as AdvancePayment).dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Information */}
        {payment.transactionReference && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Transaction Details</h4>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Transaction Reference</span>
                <span className={styles.detailValue}>{payment.transactionReference}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details */}
        {payment.bankDetails && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Bank Details</h4>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Bank Name</span>
                <span className={styles.detailValue}>{payment.bankDetails.bankName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Account Number</span>
                <span className={styles.detailValue}>{payment.bankDetails.accountNumber}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>IFSC Code</span>
                <span className={styles.detailValue}>{payment.bankDetails.ifscCode}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Information */}
        {payment.verificationStatus && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Verification Status</h4>
            <div className={styles.verificationInfo}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Verification Status</span>
                <span className={`${styles.verificationStatus} ${styles[getVerificationStatusColor(payment.verificationStatus)]}`}>
                  {payment.verificationStatus.toUpperCase()}
                </span>
              </div>
              {payment.verificationNotes && (
                <div className={styles.notesContent}>
                  <span className={styles.detailLabel}>Verification Notes</span>
                  <p className={styles.notesText}>{payment.verificationNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Payment Notes */}
        {paymentType === 'final' && (payment as FinalPayment).notes && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Payment Notes</h4>
            <div className={styles.notesContent}>
              <p className={styles.notesText}>{(payment as FinalPayment).notes}</p>
            </div>
          </div>
        )}

      </div>
    </CustomerDetailsModal>
  );
};

export default PaymentDetailsModal;