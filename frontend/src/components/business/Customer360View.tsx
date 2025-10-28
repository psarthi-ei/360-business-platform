import React, { useState } from 'react';
import { BusinessProfile } from '../../data/customerMockData';
import CustomerOrdersTab from './CustomerOrdersTab';
import CustomerAccountStatementTab from './CustomerAccountStatementTab';
import CustomerInsightsTab from './CustomerInsightsTab';
import CustomerInfoTab from './CustomerInfoTab';
import CustomerSupportTab from './CustomerSupportTab';
import styles from './Customer360View.module.css';

interface Customer360ViewProps {
  customer: BusinessProfile;
  onClose: () => void;
}

type Customer360Tab = 'insights' | 'info' | 'orders' | 'statement' | 'support';

const Customer360View = ({ customer, onClose }: Customer360ViewProps) => {
  const [activeTab, setActiveTab] = useState<Customer360Tab>('insights');

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


  return (
    <div className={styles.customer360Container}>
      {/* Customer Header - 48px */}
      <div className={styles.customer360Header}>
        <h1 className={styles.customerName}>{customer.companyName}</h1>
      </div>

      {/* Tab Navigation - 48px */}
      <div className={styles.tabNavigation}>
        {(['insights', 'info', 'orders', 'statement', 'support'] as Customer360Tab[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'insights' && (
          <CustomerInsightsTab 
            customerId={customer.id}
            customer={customer}
            loyaltyTier={getLoyaltyTier()}
            paymentScore={getPaymentScore()}
            creditStatus={getCreditStatus()}
          />
        )}
        {activeTab === 'info' && <CustomerInfoTab customerId={customer.id} />}
        {activeTab === 'orders' && <CustomerOrdersTab customerId={customer.id} />}
        {activeTab === 'statement' && <CustomerAccountStatementTab customerId={customer.id} />}
        {activeTab === 'support' && <CustomerSupportTab customerId={customer.id} />}
      </div>
    </div>
  );
};

export default Customer360View;