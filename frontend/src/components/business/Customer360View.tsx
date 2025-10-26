import React, { useState } from 'react';
import { BusinessProfile } from '../../data/customerMockData';
import CustomerOrdersTab from './CustomerOrdersTab';
import CustomerPaymentsTab from './CustomerPaymentsTab';
import CustomerInsightsTab from './CustomerInsightsTab';
import styles from './Customer360View.module.css';

interface Customer360ViewProps {
  customer: BusinessProfile;
  onClose: () => void;
}

type Customer360Tab = 'orders' | 'payments' | 'insights';

// CTA visibility configuration - following Customers module pattern
const TAB_CTA_CONFIG = {
  insights: { showCTA: true },     // "New Enquiry" - primary business action
  orders: { showCTA: false },      // Historical data only
  payments: { showCTA: false }     // Historical data only
} as const;

const Customer360View = ({ customer, onClose }: Customer360ViewProps) => {
  const [activeTab, setActiveTab] = useState<Customer360Tab>('insights');

  // Get contextual CTA based on active tab
  const getContextualCTA = (tab: Customer360Tab): string => {
    switch (tab) {
      case 'insights': return 'New Enquiry';
      case 'orders': return 'New Enquiry';
      case 'payments': return 'Request Payment';
      default: return 'Take Action';
    }
  };

  // Handle CTA click based on active tab
  const handleCTAClick = () => {
    switch (activeTab) {
      case 'insights':
        alert(`New enquiry for ${customer.companyName} coming soon!`);
        break;
      case 'orders':
        alert(`New enquiry for ${customer.companyName} coming soon!`);
        break;
      case 'payments':
        alert(`Payment request sent to ${customer.companyName}`);
        break;
      default:
        alert('Unknown action');
    }
  };

  // Get customer loyalty tier for display
  const getLoyaltyTier = () => {
    return customer.loyalty?.tier || 'STANDARD';
  };

  // Get payment score for display
  const getPaymentScore = () => {
    return customer.paymentScore || 85;
  };

  // Get credit status for display
  const getCreditStatus = () => {
    return customer.creditStatus || 'good';
  };

  // CTA visibility control - following Customers module pattern
  const shouldHideCTA = !TAB_CTA_CONFIG[activeTab]?.showCTA;

  return (
    <div className={`${styles.customer360Container} ${shouldHideCTA ? styles.noCTA : ''}`}>
      {/* Customer Header - 48px */}
      <div className={styles.customer360Header}>
        <h1 className={styles.customerName}>{customer.companyName}</h1>
      </div>

      {/* Tab Navigation - 48px */}
      <div className={styles.tabNavigation}>
        {(['insights', 'orders', 'payments'] as Customer360Tab[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Customer Status Bar - Only show on insights tab */}
      {activeTab === 'insights' && (
        <div className={styles.customerStatusBar}>
          <span className={styles.loyaltyBadge}>
            🏆 {getLoyaltyTier()}
          </span>
          <span className={styles.paymentScore}>
            Payment Score: {getPaymentScore()}/100
          </span>
          <span className={`${styles.creditStatus} ${styles[getCreditStatus()]}`}>
            {getCreditStatus().toUpperCase()}
          </span>
        </div>
      )}

      {/* Dynamic Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'insights' && <CustomerInsightsTab customerId={customer.id} />}
        {activeTab === 'orders' && <CustomerOrdersTab customerId={customer.id} />}
        {activeTab === 'payments' && <CustomerPaymentsTab customerId={customer.id} />}
      </div>

      {/* Context-Aware CTA - 56px - Configuration-driven visibility */}
      {!shouldHideCTA && (
        <div className={styles.customer360CTA}>
          <button className={styles.customer360CTAButton} onClick={handleCTAClick}>
            {getContextualCTA(activeTab)}
          </button>
        </div>
      )}
    </div>
  );
};

export default Customer360View;