import React, { useState } from 'react';
import { getAdvancePaymentsByCustomerId, getFinalPaymentsByCustomerId, getFinalInvoiceById, getProformaInvoiceById, mockFinalInvoices, getQuoteById } from '../../data/salesMockData';
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
  paymentMethod?: string; // For payment transactions (RTGS, NEFT, UPI, etc.)
  bankName?: string; // For payment meta display
  shortReference?: string; // For payment meta display
}

// Helper function to extract bank information from transaction reference
const extractBankInfo = (transactionRef: string, paymentMethod: string) => {
  if (!transactionRef) return { bankName: '', shortReference: '' };
  
  // Extract bank name from transaction reference patterns
  let bankName = '';
  if (transactionRef.includes('HDFC')) bankName = 'HDFC Bank';
  else if (transactionRef.includes('SBI')) bankName = 'State Bank of India';
  else if (transactionRef.includes('ICICI')) bankName = 'ICICI Bank';
  else if (transactionRef.includes('BOB')) bankName = 'Bank of Baroda';
  else if (transactionRef.includes('AXIS')) bankName = 'Axis Bank';
  else bankName = 'Bank';
  
  // Extract short reference (last part after bank code and date)
  const shortReference = transactionRef.slice(-6); // Last 6 characters
  
  return { bankName, shortReference };
};

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
      // Extract meaningful business context from invoice items
      const primaryItem = invoice.items[0];
      const itemDescription = primaryItem ? 
        `${primaryItem.description} - ${primaryItem.quantity} ${primaryItem.unit}` : 
        'Product Invoice';
      
      const invoiceTransaction: AccountTransaction = {
        id: `invoice-${invoice.id}`,
        date: invoice.invoiceDate,
        type: 'sales_invoice',
        reference: invoice.invoiceNumber,
        description: itemDescription,
        debitAmount: invoice.totalAmount,
        runningBalance: 0, // Will be calculated after sorting
        relatedInvoiceId: invoice.id,
        documentNumber: invoice.invoiceNumber
      };
      transactions.push(invoiceTransaction);
    });

    // Add Advance Payment transactions (CREDIT entries)
    advancePayments.forEach(payment => {
      // Show all payments with proper allocation and received date
      if (payment.receivedDate) {
        // Get the proforma invoice for this payment
        const proformaInvoice = getProformaInvoiceById(payment.proformaInvoiceId);
        // Get the quote to access items description
        const quote = proformaInvoice ? getQuoteById(proformaInvoice.quoteId) : null;
        
        // Extract bank information for meta display
        const { bankName, shortReference } = extractBankInfo(payment.transactionReference || '', payment.paymentMethod);
        
        const paymentTransaction: AccountTransaction = {
          id: payment.id,
          date: payment.receivedDate,
          type: 'advance_payment',
          reference: payment.transactionReference || payment.id,
          description: quote ? quote.items : 'Advance Payment',
          creditAmount: payment.receivedAmount || payment.amount,
          runningBalance: 0, // Will be calculated after sorting
          documentNumber: proformaInvoice ? proformaInvoice.id : payment.transactionReference,
          relatedInvoiceId: payment.proformaInvoiceId,
          paymentMethod: payment.paymentMethod,
          bankName: bankName,
          shortReference: shortReference
        };
        transactions.push(paymentTransaction);
      }
    });

    // Add Payment transactions (CREDIT entries)
    finalPayments.forEach(payment => {
      // Show all payments with proper invoice allocation
      if (payment.finalInvoiceId) {
        const salesInvoice = getFinalInvoiceById(payment.finalInvoiceId);
        
        // Extract bank information for meta display
        const { bankName, shortReference } = extractBankInfo(payment.transactionReference || '', payment.paymentMethod);
        
        const paymentTransaction: AccountTransaction = {
          id: payment.id,
          date: payment.paymentDate,
          type: 'payment',
          reference: salesInvoice ? salesInvoice.invoiceNumber : payment.transactionReference,
          description: salesInvoice && salesInvoice.items.length > 0 ? 
            `${salesInvoice.items[0].description} - ${salesInvoice.items[0].quantity} ${salesInvoice.items[0].unit}` : 
            'Final Payment',
          creditAmount: payment.amount,
          runningBalance: 0, // Will be calculated after sorting
          relatedInvoiceId: payment.finalInvoiceId,
          documentNumber: salesInvoice ? salesInvoice.invoiceNumber : payment.transactionReference,
          paymentMethod: payment.paymentMethod,
          bankName: bankName,
          shortReference: shortReference
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

  // Format currency - Full amounts with 2 decimal places and comma separation
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
      
      {/* Statement Controls - Single Row Layout */}
      <div className={styles.statementHeader}>
        <div className={styles.headerRow}>
          <div className={styles.filterDropdowns}>
            <select 
              className={styles.filterDropdown}
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="invoices">📄 Invoices</option>
              <option value="payments">💳 Payments</option>
              <option value="advance_payment">💰 Advance</option>
            </select>
          </div>
          
          <div className={styles.outstandingAmount}>
            <span className={styles.outstandingLabel}>Outstanding</span>
            <span className={`${styles.outstandingValue} ${(allTransactions[0]?.runningBalance || 0) > 0 ? styles.debit : styles.credit}`}>
              ₹{formatCurrency(Math.abs(allTransactions[0]?.runningBalance || 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className={styles.transactionsList}>
        {transactions.map((transaction) => {
          // Determine transaction status class based on type 
          const getTransactionStatusClass = () => {
            if (transaction.type === 'sales_invoice') {
              return 'ds-card-priority-medium'; // Invoice = amount due
            }
            if (transaction.type === 'advance_payment' || transaction.type === 'payment') {
              return 'ds-card-status-active'; // Payment = money received
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
                  {transaction.type === 'sales_invoice' && transaction.paymentMethod && (
                    <span className={styles.paymentMethod}>
                      {transaction.paymentMethod}
                    </span>
                  )}
                  <span className={styles.transactionTimestamp}>
                    {formatDate(transaction.date)}
                  </span>
                </div>

                {/* Transaction Description & Business Context */}
                <div className="ds-card-meta" title={transaction.description}>
                  <div className={styles.transactionDescription}>
                    {transaction.description}
                  </div>
                  {transaction.type === 'sales_invoice' && customer && (
                    <div className={styles.auditTrail}>
                      Customer: {customer.companyName}
                    </div>
                  )}
                  {(transaction.type === 'advance_payment' || transaction.type === 'payment') && transaction.bankName && (
                    <div className={styles.auditTrail}>
                      {transaction.paymentMethod} via {transaction.bankName} • Ref: {transaction.shortReference}
                    </div>
                  )}
                </div>

                {/* Transaction Amount Information */}
                <div className="ds-card-content" onClick={(e) => e.stopPropagation()}>
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
                </div>

                {/* Transaction Actions */}
                <div className="ds-card-actions" onClick={(e) => e.stopPropagation()}>
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