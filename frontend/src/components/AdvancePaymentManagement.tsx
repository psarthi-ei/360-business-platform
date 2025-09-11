import React, { useEffect } from 'react';
import ProductHeader from './ProductHeader';
import { mockSalesOrders, formatCurrency, getCustomerById } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/AdvancePaymentManagement.module.css';

interface AdvancePaymentManagementProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowSalesOrders?: () => void;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  location: string;
  orderAmount: number;
  advancePercentage: number;
  advanceAmount: number;
  advanceReceived: number;
  balanceAdvance: number;
  paymentStatus: 'requested' | 'pending' | 'partial' | 'received' | 'overdue';
  dueDate: string;
  orderDate: string;
  items: string;
  contactInfo: string;
  lastReminderSent: string;
  paymentMethod: string;
  bankDetails: string;
}

function AdvancePaymentManagement({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowSalesOrders,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: AdvancePaymentManagementProps) {
  const { t } = useTranslation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create mock payment records based on sales orders
  const mockPaymentRecords: PaymentRecord[] = mockSalesOrders.map(order => {
    const customer = getCustomerById(order.customerId);
    const advancePercentage = 50; // Standard 50% advance
    const advanceAmount = Math.round(order.totalAmount * (advancePercentage / 100));
    
    // Simulate different payment states
    let paymentStatus: PaymentRecord['paymentStatus'] = 'pending';
    let advanceReceived = 0;
    let lastReminderSent = '';
    
    if (order.id === 'SO-001') {
      paymentStatus = 'overdue';
      advanceReceived = 0;
      lastReminderSent = 'March 22, 2024';
    } else if (order.id === 'SO-002') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
      lastReminderSent = 'N/A - Payment completed';
    } else if (order.id === 'SO-003') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
      lastReminderSent = 'N/A - Payment completed';
    }

    return {
      id: `PAY-${order.id}`,
      orderId: order.id,
      customerName: order.customerName,
      location: order.location,
      orderAmount: order.totalAmount,
      advancePercentage,
      advanceAmount,
      advanceReceived,
      balanceAdvance: advanceAmount - advanceReceived,
      paymentStatus,
      dueDate: order.orderDate, // Due immediately after order
      orderDate: order.orderDate,
      items: order.items,
      contactInfo: customer?.phone || '+91 98765 43210',
      lastReminderSent,
      paymentMethod: customer?.preferences.paymentMethod || 'Bank transfer',
      bankDetails: 'HDFC Bank A/c: 50200012345678'
    };
  });

  // Filter payment records based on status
  const getFilteredPayments = () => {
    return mockPaymentRecords.filter(payment => {
      if (filterState === 'all') return true;
      if (filterState === 'overdue') return payment.paymentStatus === 'overdue';
      if (filterState === 'pending') return payment.paymentStatus === 'pending' || payment.paymentStatus === 'requested';
      if (filterState === 'received') return payment.paymentStatus === 'received';
      if (filterState === 'partial') return payment.paymentStatus === 'partial';
      return true;
    });
  };

  const filteredPayments = getFilteredPayments();

  const handleRecordPayment = (paymentId: string, amount: number) => {
    console.log(`Recording payment: ${paymentId}, Amount: ₹${amount.toLocaleString()}`);
    // Implementation: Update payment record, adjust balance, notify customer
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

        <h1 className={styles.centeredHeading}>💰 Payments & Invoices</h1>

        {/* Filter Section */}
        <div className={styles.filtersSection}>
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
                {formatCurrency(mockPaymentRecords.reduce((sum, p) => sum + p.balanceAdvance, 0))}
              </div>
              <div className={styles.summaryLabel}>Total Outstanding</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>📊</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {mockPaymentRecords.filter(p => p.paymentStatus === 'overdue').length}
              </div>
              <div className={styles.summaryLabel}>Overdue Payments</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>✅</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {formatCurrency(mockPaymentRecords.reduce((sum, p) => sum + p.advanceReceived, 0))}
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
                        onClick={() => onShowSalesOrders && onShowSalesOrders()}
                        title="View in Sales Orders"
                      >
                        📦 Order: {payment.orderId} ({formatCurrency(payment.orderAmount)}) →
                      </span>
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
                      <div className={styles.detailRow}>
                        <strong>Items:</strong> {payment.items}
                      </div>
                      <div className={styles.detailRow}>
                        <strong>Order Date:</strong> {payment.orderDate}
                      </div>
                      <div className={styles.detailRow}>
                        <strong>Payment Method:</strong> {payment.paymentMethod}
                      </div>
                    </div>

                    <div className={styles.paymentBreakdown}>
                      <div className={styles.amountRow}>
                        <span>Total Order Amount:</span>
                        <strong>{formatCurrency(payment.orderAmount)}</strong>
                      </div>
                      <div className={styles.amountRow}>
                        <span>Advance Required ({payment.advancePercentage}%):</span>
                        <strong>{formatCurrency(payment.advanceAmount)}</strong>
                      </div>
                      <div className={styles.amountRow}>
                        <span>Amount Received:</span>
                        <strong className={styles.receivedAmount}>
                          {formatCurrency(payment.advanceReceived)}
                        </strong>
                      </div>
                      <div className={`${styles.amountRow} ${styles.balanceRow}`}>
                        <span>Balance Pending:</span>
                        <strong className={styles.pendingAmount}>
                          {formatCurrency(payment.balanceAdvance)}
                        </strong>
                      </div>
                    </div>

                    {payment.lastReminderSent && payment.paymentStatus !== 'received' && (
                      <div className={styles.reminderInfo}>
                        <strong>Last Reminder:</strong> {payment.lastReminderSent}
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
                      onClick={() => handleWhatsAppPayment(payment.customerName, payment.contactInfo, payment.balanceAdvance)}
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
                    {payment.balanceAdvance > 0 && (
                      <button 
                        className={styles.recordBtn}
                        onClick={() => handleRecordPayment(payment.id, payment.balanceAdvance)}
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

export default AdvancePaymentManagement;