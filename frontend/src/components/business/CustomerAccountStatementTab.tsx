import React, { useState } from 'react';
import { getAdvancePaymentsByCustomerId, getFinalPaymentsByCustomerId, getFinalInvoiceById, mockFinalInvoices } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import CustomerDetailsModal from './CustomerDetailsModal';
import styles from './CustomerAccountStatementTab.module.css';

interface CustomerAccountStatementTabProps {
  customerId: string;
}

// Transaction type for account statement
interface AccountTransaction {
  id: string;
  date: string;
  type: 'sales_invoice' | 'advance_payment' | 'payment' | 'credit_note' | 'debit_note';
  reference: string;
  description: string;
  debitAmount?: number;
  creditAmount?: number;
  runningBalance: number;
  relatedOrderId?: string;
  relatedInvoiceId?: string;
  documentNumber?: string; // For invoice numbers, payment references
  status?: string; // For transaction status
}

const CustomerAccountStatementTab = ({ customerId }: CustomerAccountStatementTabProps) => {
  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter state
  const [transactionFilter, setTransactionFilter] = useState<string>('all');

  const customer = getBusinessProfileById(customerId);
  const advancePayments = getAdvancePaymentsByCustomerId(customerId);
  const finalPayments = getFinalPaymentsByCustomerId(customerId);

  // Get complete financial transactions for the customer account statement
  const getAccountTransactions = (): AccountTransaction[] => {
    const transactions: AccountTransaction[] = [];

    // Add Sales Invoice transactions (DEBIT entries)
    const customerInvoices = mockFinalInvoices.filter(invoice => invoice.businessProfileId === customerId);
    customerInvoices.forEach(invoice => {
      const invoiceTransaction: AccountTransaction = {
        id: `invoice-${invoice.id}`,
        date: invoice.invoiceDate,
        type: 'sales_invoice',
        reference: invoice.invoiceNumber,
        description: `Sales Invoice - ${invoice.items[0]?.description || 'Product Invoice'}`,
        debitAmount: invoice.totalAmount,
        runningBalance: 0, // Will be calculated after sorting
        relatedInvoiceId: invoice.id,
        documentNumber: invoice.invoiceNumber,
        status: invoice.status
      };
      transactions.push(invoiceTransaction);
    });

    // Add Advance Payment transactions (CREDIT entries)
    advancePayments.forEach(payment => {
      // Only show received payments in account statement
      if (payment.status === 'received' && payment.receivedDate) {
        const paymentTransaction: AccountTransaction = {
          id: payment.id,
          date: payment.receivedDate,
          type: 'advance_payment',
          reference: payment.transactionReference || payment.id,
          description: `Advance Payment via ${payment.paymentMethod}${payment.transactionReference ? ` (Ref: ${payment.transactionReference})` : ''}`,
          creditAmount: payment.receivedAmount || payment.amount,
          runningBalance: 0, // Will be calculated after sorting
          documentNumber: payment.transactionReference,
          status: payment.status
        };
        transactions.push(paymentTransaction);
      }
    });

    // Add Payment transactions (CREDIT entries)
    finalPayments.forEach(payment => {
      // Only show verified/reconciled payments in account statement
      if (payment.status === 'received' || payment.status === 'verified' || payment.status === 'reconciled') {
        const salesInvoice = getFinalInvoiceById(payment.finalInvoiceId);
        const paymentTransaction: AccountTransaction = {
          id: payment.id,
          date: payment.paymentDate,
          type: 'payment',
          reference: payment.transactionReference,
          description: `Payment${salesInvoice ? ` against ${salesInvoice.invoiceNumber}` : ''} via ${payment.paymentMethod}`,
          creditAmount: payment.amount,
          runningBalance: 0, // Will be calculated after sorting
          relatedInvoiceId: payment.finalInvoiceId,
          documentNumber: payment.transactionReference,
          status: payment.status
        };
        transactions.push(paymentTransaction);
      }
    });

    // Sort by date chronologically (oldest first for proper running balance calculation)
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance chronologically
    let runningBalance = 0;
    transactions.forEach(transaction => {
      if (transaction.debitAmount) {
        runningBalance += transaction.debitAmount;
      }
      if (transaction.creditAmount) {
        runningBalance -= transaction.creditAmount;
      }
      transaction.runningBalance = runningBalance;
    });

    // Reverse for display (newest first)
    return transactions.reverse();
  };

  const allTransactions = getAccountTransactions();
  
  // Filter transactions based on selected filter
  const transactions = allTransactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'invoices') return transaction.type === 'sales_invoice';
    if (transactionFilter === 'payments') return transaction.type === 'advance_payment' || transaction.type === 'payment';
    return transaction.type === transactionFilter;
  });

  // Modal handlers
  const handleViewDetails = (transaction: AccountTransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

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

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    const icons = {
      'sales_invoice': '🧾',
      'advance_payment': '💰',
      'payment': '💳',
      'credit_note': '🧮',
      'debit_note': '📝'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  // Get transaction type display
  const getTransactionTypeDisplay = (type: string) => {
    const displays = {
      'sales_invoice': 'Sales Invoice',
      'advance_payment': 'Advance Payment',
      'payment': 'Payment',
      'credit_note': 'Credit Note',
      'debit_note': 'Debit Note'
    };
    return displays[type as keyof typeof displays] || type;
  };


  // Handle share (WhatsApp only)
  const handleShare = () => {
    const statementSummary = `Account Statement - ${customer?.companyName}\n\nCurrent Outstanding: ₹${formatCurrency(Math.abs(transactions[0]?.runningBalance || 0))}\nTotal Transactions: ${transactions.length}\n\n*Generated with ElevateBusiness 360°*`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Account Statement',
        text: statementSummary
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(statementSummary);
      alert('Statement summary copied to clipboard');
    }
  };

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <span className={styles.emptyIcon}>📊</span>
          <h3 className={styles.emptyTitle}>No transactions found</h3>
          <p className={styles.emptyDescription}>
            No financial transactions available for this customer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountStatementContainer}>
      
      {/* Statement Header */}
      <div className={styles.statementHeader}>
        <div className={styles.headerInfo}>
          <h3 className={styles.headerTitle}>Account Statement</h3>
          <p className={styles.customerName}>{customer?.companyName}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.filterContainer}>
            <select 
              className={styles.transactionFilter}
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="invoices">Sales Invoices</option>
              <option value="payments">Payments</option>
              <option value="advance_payment">Advance Payments</option>
            </select>
          </div>
          <div className={styles.outstandingAmount}>
            <span className={styles.outstandingLabel}>Outstanding</span>
            <span className={`${styles.outstandingValue} ${(allTransactions[0]?.runningBalance || 0) > 0 ? styles.debit : styles.credit}`}>
              ₹{formatCurrency(Math.abs(allTransactions[0]?.runningBalance || 0))}
            </span>
          </div>
          <button className={styles.shareButton} onClick={handleShare}>
            💬 Share
          </button>
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className={styles.desktopTableHeader}>
        <span className={styles.tableHeaderCell}>Date</span>
        <span className={styles.tableHeaderCell}>Type</span>
        <span className={styles.tableHeaderCell}>Ref No</span>
        <span className={styles.tableHeaderCell}>Debit</span>
        <span className={styles.tableHeaderCell}>Credit</span>
        <span className={styles.tableHeaderCell}>Action</span>
      </div>

      {/* Transactions List */}
      <div className={styles.transactionsList}>
        {transactions.map((transaction) => {
          // Determine transaction status class based on type and balance
          const getTransactionStatusClass = () => {
            if (transaction.type === 'sales_invoice') {
              return transaction.status === 'paid' ? 'ds-card-status-active' : 'ds-card-priority-medium';
            }
            if (transaction.type === 'advance_payment' || transaction.type === 'payment') {
              return 'ds-card-status-active';
            }
            return 'ds-card-status-pending';
          };

          return (
            <div key={transaction.id} className="ds-card-container" data-transaction-id={transaction.id}>
              <div 
                className={`ds-card ${getTransactionStatusClass()} ds-card-with-actions`}
                onClick={() => handleViewDetails(transaction)}
              >
                
                {/* Transaction Header */}
                <div className="ds-card-header" title={`${getTransactionTypeDisplay(transaction.type)} - ${transaction.reference}`}>
                  {getTransactionIcon(transaction.type)} {getTransactionTypeDisplay(transaction.type)}
                </div>

                {/* Transaction Status */}
                <div className="ds-card-status">
                  {transaction.documentNumber && (
                    <span className={styles.documentNumber}>
                      {transaction.documentNumber}
                    </span>
                  )}
                  {transaction.status && (
                    <span className={`${styles.transactionStatus} ${styles[`status-${transaction.status}`]}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  )}
                  <span className={styles.transactionTimestamp}>
                    {formatDate(transaction.date)}
                  </span>
                </div>

                {/* Transaction Description & Audit Trail */}
                <div className="ds-card-meta" title={transaction.description}>
                  <div className={styles.transactionDescription}>
                    {transaction.description}
                  </div>
                  {transaction.relatedInvoiceId && (
                    <div className={styles.auditTrail}>
                      Related: {transaction.relatedInvoiceId}
                    </div>
                  )}
                  {transaction.type === 'sales_invoice' && (
                    <div className={styles.auditTrail}>
                      Invoice Type: Sales Invoice
                    </div>
                  )}
                </div>

                {/* Transaction Actions/Details */}
                <div className="ds-card-actions" onClick={(e) => e.stopPropagation()}>
                  <div className={styles.transactionAmountInfo}>
                    {transaction.debitAmount && (
                      <span className={styles.debitAmount}>
                        Debit: ₹{formatCurrency(transaction.debitAmount)}
                      </span>
                    )}
                    {transaction.creditAmount && (
                      <span className={styles.creditAmount}>
                        Credit: ₹{formatCurrency(transaction.creditAmount)}
                      </span>
                    )}
                    <span className={styles.runningBalance}>
                      Balance: ₹{formatCurrency(Math.abs(transaction.runningBalance))} 
                      {transaction.runningBalance > 0 ? '(Due)' : '(Credit)'}
                    </span>
                  </div>
                  <button 
                    className="ds-btn ds-btn-sm ds-btn-secondary"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    View Details
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTransaction ? `Transaction Details - ${selectedTransaction.reference}` : 'Transaction Details'}
      >
        {selectedTransaction && (
          <div style={{ padding: 'var(--ds-space-md)' }}>
            <div style={{ marginBottom: 'var(--ds-space-md)' }}>
              <h4 style={{ margin: '0 0 var(--ds-space-sm) 0', fontFamily: 'var(--font-family)', fontSize: 'var(--font-base)', fontWeight: '600', color: 'var(--ds-text-primary)' }}>
                Transaction Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--ds-space-sm)', fontSize: 'var(--font-sm)' }}>
                <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Type:</span>
                <span style={{ color: 'var(--ds-text-primary)' }}>{getTransactionTypeDisplay(selectedTransaction.type)}</span>
                
                <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Reference:</span>
                <span style={{ color: 'var(--ds-text-primary)' }}>{selectedTransaction.reference}</span>
                
                <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Date:</span>
                <span style={{ color: 'var(--ds-text-primary)' }}>{formatDate(selectedTransaction.date)}</span>
                
                <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Description:</span>
                <span style={{ color: 'var(--ds-text-primary)' }}>{selectedTransaction.description}</span>
                
                {selectedTransaction.creditAmount && (
                  <>
                    <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Amount:</span>
                    <span style={{ color: 'var(--ds-color-success)', fontWeight: '600' }}>₹{formatCurrency(selectedTransaction.creditAmount)} (Credit)</span>
                  </>
                )}
                
                {selectedTransaction.debitAmount && (
                  <>
                    <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Amount:</span>
                    <span style={{ color: 'var(--ds-color-danger)', fontWeight: '600' }}>₹{formatCurrency(selectedTransaction.debitAmount)} (Debit)</span>
                  </>
                )}
                
                <span style={{ fontWeight: '500', color: 'var(--ds-text-secondary)' }}>Balance:</span>
                <span style={{ color: selectedTransaction.runningBalance > 0 ? 'var(--ds-color-danger)' : 'var(--ds-color-success)', fontWeight: '600' }}>
                  ₹{formatCurrency(Math.abs(selectedTransaction.runningBalance))} {selectedTransaction.runningBalance > 0 ? '(Outstanding)' : '(Credit)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CustomerDetailsModal>

    </div>
  );
};

export default CustomerAccountStatementTab;