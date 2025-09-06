import React from 'react';
import styles from './Dashboard.module.css';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onShowLeadManagement: () => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerList: () => void;
  translations: {
    title: string;
    company: string;
    founder: string;
    leadManagement: string;
    quotationOrders: string;
    salesOrder: string;
    customers: string;
    workOrders: string;
    smartProcurement: string;
    inventory: string;
    productionTracking: string;
    dispatchDelivery: string;
    invoiceFinance: string;
    customerFeedback: string;
    voiceCommands: string;
    analyticsDashboard: string;
    [key: string]: string;
  };
}

function Dashboard({ 
  currentLanguage, 
  onLanguageChange, 
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowSalesOrders,
  onShowCustomerList,
  translations: t 
}: DashboardProps) {
  return (
    <div className={styles.dashboard}>
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      <h1>🏭 {t.title}</h1>
      <h2>{t.company}</h2>
      <p className={styles.founderInfo}>
        {t.founder}
      </p>
      
      <div className={styles.featuresGrid}>
        <div className={`${styles.featureCard} ${styles.clickable}`} onClick={onShowLeadManagement}>
          📋 {t.leadManagement}
        </div>
        <div className={`${styles.featureCard} ${styles.clickable}`} onClick={onShowQuotationOrders}>
          📑 {t.quotationOrders}
        </div>
        <div className={`${styles.featureCard} ${styles.clickable}`} onClick={onShowSalesOrders}>💳 {t.salesOrder}</div>
        <div className={`${styles.featureCard} ${styles.clickable}`} onClick={onShowCustomerList}>👥 {t.customers}</div>
        <div className={styles.featureCard}>📋 {t.workOrders}</div>
        <div className={styles.featureCard}>🛒 {t.smartProcurement}</div>
        <div className={styles.featureCard}>📦 {t.inventory}</div>
        <div className={styles.featureCard}>⚙️ {t.productionTracking}</div>
        <div className={styles.featureCard}>🚚 {t.dispatchDelivery}</div>
        <div className={styles.featureCard}>🧾 {t.invoiceFinance}</div>
        <div className={styles.featureCard}>⭐ {t.customerFeedback}</div>
        <div className={styles.featureCard}>🎤 {t.voiceCommands}</div>
        <div className={styles.featureCard}>📊 {t.analyticsDashboard}</div>
      </div>
      
      <div className={styles.status}>
        <p>🚧 MVP in Development - Coming Soon!</p>
      </div>
    </div>
  );
}

export default Dashboard;