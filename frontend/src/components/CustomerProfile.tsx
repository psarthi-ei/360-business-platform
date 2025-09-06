import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { getCustomerById, getQuotesByCustomerId, getSalesOrdersByCustomerId, mockCommunications, formatCurrency } from '../data/mockData';
import styles from '../styles/CustomerProfile.module.css';

interface CustomerProfileProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  customerId: string;
  translations: {
    backToDashboard: string;
    customerProfile: string;
    createNewQuote: string;
    customerSince: string;
    totalBusiness: string;
    totalOrders: string;
    conversionRate: string;
    paymentScore: string;
    call: string;
    whatsapp: string;
    quoteHistory: string;
    orderHistory: string;
    transactionHistory: string;
    businessInsights: string;
    [key: string]: string;
  };
}

function CustomerProfile({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
  customerId,
  translations: t
}: CustomerProfileProps) {
  const customer = getCustomerById(customerId);
  const customerQuotes = getQuotesByCustomerId(customerId);
  const customerOrders = getSalesOrdersByCustomerId(customerId);

  if (!customer) {
    return (
      <div className={styles.leadManagementScreen}>
        <LanguageSwitcher 
          currentLanguage={currentLanguage} 
          onLanguageChange={onLanguageChange} 
        />
        <div className={styles.screenHeader}>
          <button className={styles.backButton} onClick={onNavigateBack}>
            {t.backToDashboard}
          </button>
          <h1>👤 {t.customerProfile}</h1>
        </div>
        <div className={styles.customerHeader}>
          <h2>Customer not found</h2>
        </div>
      </div>
    );
  }

  const priorityIcons = {
    hot: '🔥',
    warm: '🔶',
    cold: '✅'
  };

  const paymentStatusIcon = {
    good: '✅',
    overdue: '⚠️',
    pending: '⚠️'
  };
  return (
    <div className={styles.leadManagementScreen}>
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className={styles.screenHeader}>
        <button className={styles.backButton} onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>👤 {t.customerProfile}</h1>
        <button className={styles.addButton}>{t.createNewQuote}</button>
      </div>

      <div className={styles.customerHeader}>
        <div className={styles.customerMainInfo}>
          <h2>🏭 {customer.name} - {customer.location}</h2>
          <p className={styles.customerSince}>🎉 {t.customerSince}: {customer.customerSince}</p>
          <p className={styles.customerType}>{priorityIcons[customer.priority]} <strong>{customer.priorityLabel}</strong> - {customer.paymentStatusMessage}</p>
        </div>
        <div className={styles.customerContactHeader}>
          <p><strong>Primary Contact:</strong> {customer.contactPerson} - {customer.phone}</p>
          <div className={styles.headerActions}>
            <button className={`${styles.actionBtn} ${styles.call}`}>{t.call}</button>
            <button className={`${styles.actionBtn} ${styles.whatsapp}`}>{t.whatsapp}</button>
          </div>
        </div>
      </div>

      <div className={styles.customerStats}>
        <div className={styles.statCard}>
          <h3>💰 {t.totalBusiness}</h3>
          <p className={styles.statValue}>{formatCurrency(customer.totalBusiness)}</p>
          <p className={styles.statDetail}>({customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''} placed)</p>
        </div>
        <div className={styles.statCard}>
          <h3>📋 {t.totalOrders}</h3>
          <p className={styles.statValue}>{customer.totalOrders}</p>
          <p className={styles.statDetail}>{customerOrders.filter(order => order.status !== 'completed').length} active orders</p>
        </div>
        <div className={styles.statCard}>
          <h3>🎯 {t.conversionRate}</h3>
          <p className={styles.statValue}>{customer.conversionRate}%</p>
          <p className={styles.statDetail}>({customer.totalOrders}/{customerQuotes.length} quotes)</p>
        </div>
        <div className={styles.statCard}>
          <h3>💳 {t.paymentScore}</h3>
          <p className={`${styles.statValue} ${styles[`payment${customer.paymentStatus.charAt(0).toUpperCase() + customer.paymentStatus.slice(1)}`]}`}>
            {paymentStatusIcon[customer.paymentStatus]} {customer.paymentStatusMessage}
          </p>
          <p className={styles.statDetail}>{customer.paymentStatus === 'good' ? 'Reliable payments' : 'Follow-up required'}</p>
        </div>
      </div>

      <div className={styles.transactionHistory}>
        <div className={styles.historySection}>
          <h4>📋 {t.quoteHistory}</h4>
          {customerQuotes.length > 0 ? customerQuotes.map(quote => {
            const statusIcons = {
              pending: '⏳',
              approved: '✅',
              expired: '❌'
            };
            
            return (
              <div key={quote.id} className={styles.historyItem}>
                <div className={styles.historyHeader}>
                  <span className={styles.quoteNumber}>{quote.id}</span>
                  <div className={styles.quoteMeta}>
                    <span className={styles.quoteDate}>{quote.quoteDate}</span>
                    <span className={`${styles.quoteStatus} ${styles[quote.status]}`}>
                      {statusIcons[quote.status]} {quote.status === 'approved' ? 'Converted' : quote.status}
                    </span>
                  </div>
                </div>
                <div className={styles.historyDetails}>
                  <p><strong>Amount:</strong> {formatCurrency(quote.totalAmount)} (incl. GST)</p>
                  <p><strong>Items:</strong> {quote.items}</p>
                  <p><strong>Valid Until:</strong> {quote.validUntil}</p>
                  <p><strong>Status:</strong> {quote.statusMessage}</p>
                </div>
              </div>
            );
          }) : <p>No quotes found for this customer.</p>}
        </div>

        <div className={styles.historySection}>
          <h4>📦 {t.orderHistory}</h4>
          {customerOrders.length > 0 ? customerOrders.map(order => {
            const statusIcons = {
              pending: '⏳',
              production: '🏭',
              completed: '✅'
            };
            
            return (
              <div key={order.id} className={styles.historyItem}>
                <div className={styles.historyHeader}>
                  <span className={styles.orderNumber}>{order.id}</span>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderDate}>{order.orderDate}</span>
                    <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                      {statusIcons[order.status]} {order.status === 'production' ? 'In Production' : order.status}
                    </span>
                  </div>
                </div>
                <div className={styles.historyDetails}>
                  <p><strong>Total Amount:</strong> {formatCurrency(order.totalAmount)} (incl. GST)</p>
                  <p><strong>Items:</strong> {order.items}</p>
                  <p><strong>Expected Delivery:</strong> {order.deliveryDate}</p>
                  <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                  <p><strong>Production Status:</strong> {order.productionStatus}</p>
                </div>
              </div>
            );
          }) : <p>No orders found for this customer.</p>}
        </div>

        <div className={styles.historySection}>
          <h4>💳 Payment History</h4>
          {customerOrders.length > 0 ? customerOrders.map(order => (
            <div key={order.id} className="history-item">
              <div className="history-header">
                <span className="order-number">Payment - {order.id}</span>
                <div className="order-meta">
                  <span className="order-date">{order.orderDate}</span>
                  <span className={`order-status ${order.status}`}>
                    {order.status === 'pending' ? '⚠️ Pending' : order.status === 'production' ? '💰 In Progress' : '✅ Completed'}
                  </span>
                </div>
              </div>
              <div className="history-details">
                <p><strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                <p><strong>Payment Method:</strong> {customer.preferences.paymentMethod}</p>
                {order.status === 'pending' && (
                  <p><strong>Action Required:</strong> Follow up for advance payment</p>
                )}
              </div>
            </div>
          )) : <p>No payment history available.</p>}
        </div>

        <div className={styles.historySection}>
          <h4>💬 Communication History</h4>
          {mockCommunications.map((comm, index) => (
            <div key={index} className={styles.commEntry}>
              <div className={styles.commDate}>{comm.date} - {comm.time}</div>
              <div className={styles.commType}>{comm.type}</div>
              <p className={styles.commNote}>{comm.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.businessInfo}>
        <h4>🏢 Business Information & Insights</h4>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h4>Company Details</h4>
            <p><strong>Business Name:</strong> {customer.name}</p>
            <p><strong>Contact Person:</strong> {customer.contactPerson}</p>
            <p><strong>Business Type:</strong> {customer.businessType}</p>
            <p><strong>Employee Count:</strong> {customer.employeeCount}</p>
            <p><strong>GST Number:</strong> {customer.gstNumber}</p>
          </div>
          
          <div className={styles.infoItem}>
            <h4>Preferences & Notes</h4>
            <p><strong>Preferred Payment:</strong> {customer.preferences.paymentMethod}</p>
            <p><strong>Delivery Preference:</strong> {customer.preferences.deliveryPreference}</p>
            <p><strong>Quality Requirements:</strong> {customer.preferences.qualityRequirements}</p>
            <p><strong>Communication:</strong> {customer.preferences.communication}</p>
            <p><strong>Special Notes:</strong> {customer.preferences.specialNotes}</p>
          </div>
          
          <div className={styles.infoItem}>
            <h4>Business Insights</h4>
            <p><strong>Customer Since:</strong> {customer.customerSince}</p>
            <p><strong>Order Frequency:</strong> {customer.totalOrders === 0 ? 'No orders yet' : customer.totalOrders === 1 ? 'First-time buyer' : 'Regular customer'}</p>
            <p><strong>Average Order Value:</strong> {formatCurrency(customer.totalBusiness / (customer.totalOrders || 1))}</p>
            <p><strong>Payment Behavior:</strong> {customer.paymentStatusMessage}</p>
            <p><strong>Growth Potential:</strong> {customer.priority === 'hot' ? 'High' : customer.priority === 'warm' ? 'Medium' : 'Stable'}</p>
          </div>
        </div>
      </div>

      <div className={styles.customerQuickActions}>
        <h4>⚡ Quick Actions</h4>
        <div className={styles.actionButtons}>
          <button className={`${styles.quickActionBtn} ${styles.primary}`}>{t.createNewQuote}</button>
          <button className={styles.quickActionBtn}>📞 Call Customer</button>
          <button className={styles.quickActionBtn}>💬 Send WhatsApp</button>
          <button className={`${styles.quickActionBtn} ${styles.warning}`}>💳 Payment Reminder</button>
          <button className={styles.quickActionBtn}>📄 Download Invoice</button>
          <button className={styles.quickActionBtn}>📧 Send Email</button>
        </div>
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>Try saying:</strong> 
          "Create new quote for {customer.name}" • "Show payment history" • "Call customer"
        </p>
      </div>
    </div>
  );
}

export default CustomerProfile;