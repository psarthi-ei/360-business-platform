import React, { useEffect, useState } from 'react';
import ProductHeader from './ProductHeader';
import { mockAdvancePayments, mockFinalPayments, formatCurrency, getBusinessProfileById, getProformaInvoiceById, getFinalInvoiceById } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/Payments.module.css';

interface PaymentsProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowSalesOrders?: () => void;
  onShowInvoices?: () => void;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

interface PaymentRecord {
  id: string;
  type: 'advance' | 'final';
  invoiceId: string;
  businessProfileId: string;
  quoteId?: string;
  salesOrderId?: string;
  customerName: string;
  location: string;
  invoiceAmount: number;
  paymentAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  paymentStatus: 'requested' | 'pending' | 'partial' | 'received' | 'overdue';
  dueDate: string;
  receivedDate?: string;
  contactInfo: string;
  paymentMethod: string;
  bankReference?: string;
}

function Payments({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowSalesOrders,
  onShowInvoices,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: PaymentsProps) {
  const { t } = useTranslation();
  
  // Payment type filter state
  const [paymentType, setPaymentType] = useState<'advance' | 'final' | 'all'>('all');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create combined payment records from both advance and final payments
  const createPaymentRecords = (): PaymentRecord[] => {
    const advanceRecords: PaymentRecord[] = mockAdvancePayments.map(payment => {
      const customer = getBusinessProfileById(payment.businessProfileId);
      const proformaInvoice = getProformaInvoiceById(payment.proformaInvoiceId);
      
      return {
        id: payment.id,
        type: 'advance' as const,
        invoiceId: payment.proformaInvoiceId,
        businessProfileId: payment.businessProfileId,
        quoteId: payment.quoteId,
        customerName: customer?.companyName || `Company (${payment.businessProfileId})`,
        location: customer ? `${customer.registeredAddress.city}, ${customer.registeredAddress.state}` : 'Location not available',
        invoiceAmount: proformaInvoice?.totalAmount || 0,
        paymentAmount: payment.amount,
        receivedAmount: payment.receivedAmount || 0,
        balanceAmount: payment.amount - (payment.receivedAmount || 0),
        paymentStatus: payment.status,
        dueDate: payment.dueDate,
        receivedDate: payment.receivedDate,
        contactInfo: customer?.phone || 'No contact available',
        paymentMethod: payment.paymentMethod,
        bankReference: payment.bankReference
      };
    });

    const finalRecords: PaymentRecord[] = mockFinalPayments.map(payment => {
      const customer = getBusinessProfileById(payment.customerId);
      const finalInvoice = getFinalInvoiceById(payment.finalInvoiceId);
      
      return {
        id: payment.id,
        type: 'final' as const,
        invoiceId: payment.finalInvoiceId,
        businessProfileId: payment.customerId,
        salesOrderId: finalInvoice?.salesOrderId,
        customerName: customer?.companyName || payment.customerName,
        location: customer ? `${customer.registeredAddress.city}, ${customer.registeredAddress.state}` : 'Location not available',
        invoiceAmount: finalInvoice?.totalAmount || 0,
        paymentAmount: payment.amount,
        receivedAmount: payment.amount, // Final payments are typically received
        balanceAmount: 0,
        paymentStatus: payment.status === 'received' ? 'received' : 'pending',
        dueDate: payment.paymentDate,
        receivedDate: payment.paymentDate,
        contactInfo: customer?.phone || 'No contact available',
        paymentMethod: payment.paymentMethod,
        bankReference: payment.transactionReference
      };
    });

    return [...advanceRecords, ...finalRecords];
  };

  const allPaymentRecords = createPaymentRecords();

  // Filter payment records based on both type and status
  const getFilteredPayments = () => {
    let filtered = allPaymentRecords;
    
    // Filter by payment type
    if (paymentType !== 'all') {
      filtered = filtered.filter(payment => payment.type === paymentType);
    }
    
    // Filter by status
    if (filterState !== 'all') {
      filtered = filtered.filter(payment => {
        if (filterState === 'overdue') return payment.paymentStatus === 'overdue';
        if (filterState === 'pending') return payment.paymentStatus === 'pending' || payment.paymentStatus === 'requested';
        if (filterState === 'received') return payment.paymentStatus === 'received';
        if (filterState === 'partial') return payment.paymentStatus === 'partial';
        return true;
      });
    }
    
    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  const handleRecordPayment = (paymentId: string, amount: number) => {
    console.log(`Recording payment: ${paymentId}, Amount: ₹${amount.toLocaleString()}`);
    
    // Find the payment record to get customer information
    const paymentRecord = allPaymentRecords.find(p => p.id === paymentId);
    if (!paymentRecord) {
      console.error('Payment record not found');
      return;
    }

    // Find associated business profile
    const businessProfile = getBusinessProfileById(paymentRecord.businessProfileId);
    if (!businessProfile) {
      console.error('Business profile not found for customer:', paymentRecord.customerName);
      return;
    }

    // Check if this will be a prospect-to-customer conversion
    const isProspectConversion = paymentRecord.type === 'advance' && businessProfile.customerStatus === 'prospect';

    // If this is an advance payment and customer is still a prospect, convert to customer
    if (isProspectConversion) {
      console.log('🎉 Converting prospect to customer:', businessProfile.companyName);
      
      // Update business profile to customer status
      businessProfile.customerStatus = 'customer';
      businessProfile.becameCustomerDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      businessProfile.firstPaymentProjectId = paymentRecord.quoteId || paymentRecord.salesOrderId || paymentRecord.invoiceId;
      
      console.log('✅ Customer conversion completed for:', businessProfile.companyName);
    }

    // Update payment status to received (in a real app, this would update the backend)
    console.log('💰 Payment recorded successfully - Status updated to received');
    alert(`Payment of ${formatCurrency(amount)} recorded successfully!${isProspectConversion ? '\n\n🎉 Customer has been converted from prospect to customer!' : ''}`);
    
    // In a real application, this would trigger:
    // - Database updates for payment status
    // - Customer status change in CRM
    // - Automatic notifications to customer
    // - Invoice generation triggers
  };

  const handleSendReminder = (paymentId: string, customerName: string, contactInfo: string) => {
    console.log(`Sending payment reminder to ${customerName} at ${contactInfo}`);
    // Implementation: Send WhatsApp reminder, update last reminder date
  };

  const handleWhatsAppPayment = (customerName: string, contactInfo: string, advanceAmount: number) => {
    const phone = contactInfo.replace(/[^\d]/g, '').slice(-10);
    console.log(`Opening WhatsApp to ${phone} for payment request of ₹${advanceAmount.toLocaleString()}`);
    // Implementation: Open WhatsApp with payment request message
  };

  const getPaymentStatusInfo = (status: PaymentRecord['paymentStatus']) => {
    switch (status) {
      case 'overdue':
        return { 
          icon: '🔴', 
          label: 'Overdue', 
          color: '#ff4757',
          bgColor: '#fff5f5'
        };
      case 'pending':
        return { 
          icon: '⏳', 
          label: 'Pending', 
          color: '#ffa502',
          bgColor: '#fff8e7'
        };
      case 'partial':
        return { 
          icon: '⚠️', 
          label: 'Partial', 
          color: '#ff6b6b',
          bgColor: '#fff5f5'
        };
      case 'received':
        return { 
          icon: '✅', 
          label: 'Received', 
          color: '#26de81',
          bgColor: '#f0fff4'
        };
      default:
        return { 
          icon: '📝', 
          label: 'Requested', 
          color: '#a55eea',
          bgColor: '#faf5ff'
        };
    }
  };

  return (
    <div className={styles.advancePaymentScreen}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onContextNavigation={onNavigateBack}
        contextNavigationText="Dashboard"
        contextNavigationIcon="📊"
        showContextNavigation={true}
        showThemeSelector={true}
      />
      
      <div className={styles.pageContent}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span onClick={onNavigateBack} className={styles.breadcrumbLink}>Dashboard</span>
          <span className={styles.breadcrumbSeparator}>→</span>
          <span className={styles.breadcrumbCurrent}>Payments & Invoices</span>
        </div>

        <h1 className={styles.centeredHeading}>💰 Payments</h1>

        {/* Payment Type Filter */}
        <div className={styles.filtersSection}>
          <div className={styles.filterLabel}>Payment Type:</div>
          <div className={styles.filterButtons}>
            <button 
              className={paymentType === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setPaymentType('all')}
            >
              All Payments
            </button>
            <button 
              className={paymentType === 'advance' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setPaymentType('advance')}
            >
              💳 Advance
            </button>
            <button 
              className={paymentType === 'final' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setPaymentType('final')}
            >
              💰 Final
            </button>
          </div>
        </div>

        {/* Status Filter Section */}
        <div className={styles.filtersSection}>
          <div className={styles.filterLabel}>Payment Status:</div>
          <div className={styles.filterButtons}>
            <button 
              className={filterState === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('all')}
            >
              Show All
            </button>
            <button 
              className={filterState === 'overdue' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('overdue')}
            >
              🔴 Overdue
            </button>
            <button 
              className={filterState === 'pending' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('pending')}
            >
              ⏳ Pending
            </button>
            <button 
              className={filterState === 'received' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('received')}
            >
              ✅ Received
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>💰</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {formatCurrency(allPaymentRecords.reduce((sum, p) => sum + p.balanceAmount, 0))}
              </div>
              <div className={styles.summaryLabel}>Total Outstanding</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>📊</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {allPaymentRecords.filter(p => p.paymentStatus === 'overdue').length}
              </div>
              <div className={styles.summaryLabel}>Overdue Payments</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>✅</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {formatCurrency(allPaymentRecords.reduce((sum, p) => sum + p.receivedAmount, 0))}
              </div>
              <div className={styles.summaryLabel}>Received This Month</div>
            </div>
          </div>
        </div>

        {/* Payment Records */}
        <div className={styles.paymentsContainer}>
          {filteredPayments.length === 0 ? (
            <div className={styles.noPayments}>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💳</div>
                <h3>No payments found</h3>
                <p>No advance payments match the selected filter criteria.</p>
              </div>
            </div>
          ) : (
            filteredPayments.map(payment => {
              const statusInfo = getPaymentStatusInfo(payment.paymentStatus);
              
              return (
                <div key={payment.id} className={styles.paymentCard}>
                  <div className={styles.paymentHeader}>
                    <div className={styles.customerInfo}>
                      <h3 
                        className={styles.customerLink}
                        onClick={() => onShowCustomerProfile && onShowCustomerProfile(payment.customerName.toLowerCase().replace(/\s/g, '-'))}
                      >
                        {payment.customerName} - {payment.location}
                      </h3>
                      <span 
                        className={styles.orderLink}
                        onClick={() => onShowInvoices && onShowInvoices()}
                        title={`View ${payment.type === 'advance' ? 'Proforma' : 'Final'} Invoice`}
                      >
                        📄 {payment.type === 'advance' ? 'Proforma' : 'Final'} Invoice: {payment.invoiceId} ({formatCurrency(payment.invoiceAmount)}) →
                      </span>
                      <div className={styles.paymentTypeBadge}>
                        {payment.type === 'advance' ? '💳 Advance Payment' : '💰 Final Payment'}
                      </div>
                    </div>
                    <div 
                      className={styles.paymentStatus}
                      style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color
                      }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                  </div>

                  <div className={styles.paymentDetails}>
                    <div className={styles.orderInfo}>
                      {payment.type === 'advance' ? (
                        <>
                          {payment.quoteId && (
                            <div className={styles.detailRow}>
                              <strong>Related Quote:</strong> {payment.quoteId}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {payment.salesOrderId && (
                            <div className={styles.detailRow}>
                              <strong>Sales Order:</strong> {payment.salesOrderId}
                            </div>
                          )}
                        </>
                      )}
                      <div className={styles.detailRow}>
                        <strong>Due Date:</strong> {payment.dueDate}
                      </div>
                      <div className={styles.detailRow}>
                        <strong>Payment Method:</strong> {payment.paymentMethod}
                      </div>
                      {payment.bankReference && (
                        <div className={styles.detailRow}>
                          <strong>Bank Reference:</strong> {payment.bankReference}
                        </div>
                      )}
                    </div>

                    <div className={styles.paymentBreakdown}>
                      <div className={styles.amountRow}>
                        <span>Total Invoice Amount:</span>
                        <strong>{formatCurrency(payment.invoiceAmount)}</strong>
                      </div>
                      <div className={styles.amountRow}>
                        <span>{payment.type === 'advance' ? 'Advance Amount (50%)' : 'Final Payment Amount'}:</span>
                        <strong>{formatCurrency(payment.paymentAmount)}</strong>
                      </div>
                      <div className={styles.amountRow}>
                        <span>Amount Received:</span>
                        <strong className={styles.receivedAmount}>
                          {formatCurrency(payment.receivedAmount)}
                        </strong>
                      </div>
                      <div className={`${styles.amountRow} ${styles.balanceRow}`}>
                        <span>Balance Pending:</span>
                        <strong className={styles.pendingAmount}>
                          {formatCurrency(payment.balanceAmount)}
                        </strong>
                      </div>
                    </div>

                    {payment.receivedDate && payment.paymentStatus === 'received' && (
                      <div className={styles.reminderInfo}>
                        <strong>Payment Received:</strong> {payment.receivedDate}
                      </div>
                    )}
                  </div>

                  {/* Customer Contact Section */}
                  <div className={styles.customerContact}>
                    <div className={styles.contactHeader}>
                      <strong>Contact: {payment.customerName.split(' ')[0]} - {payment.contactInfo}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.callBtn}
                      onClick={() => console.log(`Calling ${payment.customerName} at ${payment.contactInfo}`)}
                    >
                      📞 Call
                    </button>
                    <button 
                      className={styles.whatsappBtn}
                      onClick={() => handleWhatsAppPayment(payment.customerName, payment.contactInfo, payment.balanceAmount)}
                    >
                      📱 WhatsApp
                    </button>
                    {payment.paymentStatus !== 'received' && (
                      <button 
                        className={styles.reminderBtn}
                        onClick={() => handleSendReminder(payment.id, payment.customerName, payment.contactInfo)}
                      >
                        📢 Send Reminder
                      </button>
                    )}
                    {payment.balanceAmount > 0 && (
                      <button 
                        className={styles.recordBtn}
                        onClick={() => handleRecordPayment(payment.id, payment.balanceAmount)}
                      >
                        💰 Record Payment
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Voice Commands Section */}
        <div className={styles.voiceSection}>
          <h3>🎤 Voice Commands</h3>
          <div className={styles.voiceCommands}>
            <div className={styles.voiceCommand}>
              <strong>English:</strong> "Record advance payment from Rajesh Textiles"
            </div>
            <div className={styles.voiceCommand}>
              <strong>Gujarati:</strong> "રાજેશ ટેક્સટાઈલ્સનું એડવાન્સ પેમેન્ટ રેકોર્ડ કરો"
            </div>
            <div className={styles.voiceCommand}>
              <strong>Hindi:</strong> "राजेश टेक्सटाइल्स का एडवांस पेमेंट रिकॉर्ड करें"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;