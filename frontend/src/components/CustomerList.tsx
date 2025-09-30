import React from 'react';
import { mockBusinessProfiles, mockSalesOrders, formatCurrency } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/CustomerList.module.css';

interface CustomerListProps {
  onShowCustomerProfile: (customerId: string) => void;
  customerSearch: string;
  onCustomerSearchChange: (search: string) => void;
}

function CustomerList({
  onShowCustomerProfile,
  customerSearch,
  onCustomerSearchChange
}: CustomerListProps) {
  const { t } = useTranslation();


  return (
    <div className={styles.leadManagementScreen}>
      <div className={styles.pageContent}>

      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterBtn} ${styles.active}`}>{t('showAll')}</button>
          <button className={styles.filterBtn}>🏆 Premium</button>
          <button className={styles.filterBtn}>🎉 New Customers</button>
          <button className={styles.filterBtn}>⚡ Active</button>
          <button className={styles.filterBtn}>⚠️ Payment Issues</button>
        </div>
      </div>

      <div className={styles.leadsContainer}>
        {mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer')
          .filter(profile => 
            customerSearch === '' || 
            profile.companyName.toLowerCase().includes(customerSearch.toLowerCase()) ||
            profile.registeredAddress.city.toLowerCase().includes(customerSearch.toLowerCase())
          )
          .map(profile => {
            const priorityIcons = {
              hot: '🔥',
              warm: '🔶',
              cold: '✅'
            };

            const priorityLabels = {
              hot: 'Hot Customer',
              warm: 'Warm Customer',
              cold: 'Completed Customer'
            };

            const paymentStatusIcon = {
              excellent: '🌟',
              good: '✅',
              watch: '👀',
              hold: '🛑'
            };

            const lastOrder = mockSalesOrders.find(order => order.businessProfileId === profile.id);

            return (
              <div key={profile.id} className={`${styles.leadCard} ${styles[profile.priority + 'Lead']}`}>
                <div className={styles.leadHeader}>
                  <h3>
                    <span 
                      onClick={() => onShowCustomerProfile(profile.id)}
                      style={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                      🏭 {profile.companyName} - {profile.registeredAddress.city}
                    </span>
                  </h3>
                  <span className={`${styles.priorityBadge} ${styles[profile.priority]}`}>
                    {priorityIcons[profile.priority]} {priorityLabels[profile.priority]}
                  </span>
                </div>
                <div className={styles.leadDetails}>
                  <p><strong>Customer Since:</strong> {profile.becameCustomerDate}</p>
                  <p><strong>Total Business:</strong> {formatCurrency(profile.totalRevenue)} ({profile.totalOrders} order{profile.totalOrders > 1 ? 's' : ''})</p>
                  <p><strong>Active Orders:</strong> {profile.activeOrders} | <strong>Average Order Value:</strong> {formatCurrency(profile.averageOrderValue)}</p>
                  <p><strong>Last Order:</strong> {lastOrder ? `${lastOrder.orderDate} - ${lastOrder.statusMessage}` : 'No orders yet'}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={styles[`payment${profile.creditStatus.charAt(0).toUpperCase() + profile.creditStatus.slice(1)}`]}>
                      {paymentStatusIcon[profile.creditStatus] || '✅'} {profile.creditStatus} payment history
                    </span>
                  </p>
                </div>
                <div className={styles.leadActions}>
                  <button className={`${styles.actionBtn} ${styles.callBtn}`}>{t('call')}</button>
                  <button className={`${styles.actionBtn} ${styles.whatsappBtn}`}>{t('whatsapp')}</button>
                  <button className={`${styles.actionBtn} ${styles.quoteBtn}`}>📄 View Profile</button>
                  <button className={`${styles.actionBtn} ${styles.quoteBtn}`}>📋 New Quote</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>{t('voiceCommandsHint')}:</strong> 
          "Show premium customers" • "Call customer" • "Create new quote" • "View customer profile"
        </p>
      </div>

    </div>
  );
}

export default CustomerList;