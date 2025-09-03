import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface DashboardProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  translations: any;
  onShowLeadManagement: () => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerList: () => void;
}

function Dashboard(props: DashboardProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const t = props.translations;
  const onShowLeadManagement = props.onShowLeadManagement;
  const onShowQuotationOrders = props.onShowQuotationOrders;
  const onShowSalesOrders = props.onShowSalesOrders;
  const onShowCustomerList = props.onShowCustomerList;

  return (
    <div className="dashboard">
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      <h1>🏭 {t.welcome || 'Welcome to Your Business Hub'}</h1>
      <h2>{t.tagline || '360° Business Platform for Gujarat Textile Manufacturers'}</h2>
      <p className="founder-info">
        {t.businessPlatform || 'Complete end-to-end solution for textile manufacturing business'}
      </p>
      
      <div className="features-grid">
        <div className="feature-card clickable" onClick={onShowLeadManagement}>
          📋 {t.leadManagement || 'Lead Management'}
        </div>
        <div className="feature-card clickable" onClick={onShowQuotationOrders}>
          📑 {t.quotationOrders || 'Quotations & Orders'}
        </div>
        <div className="feature-card clickable" onClick={onShowSalesOrders}>💳 {t.salesOrder || 'Sales Orders'}</div>
        <div className="feature-card clickable" onClick={onShowCustomerList}>👥 {t.customers || 'Customers'}</div>
        <div className="feature-card">📋 {t.workOrders || 'Work Orders'}</div>
        <div className="feature-card">🛒 {t.production || 'Production'}</div>
        <div className="feature-card">📦 {t.inventory || 'Inventory'}</div>
        <div className="feature-card">🚚 {t.dispatch || 'Dispatch'}</div>
        <div className="feature-card">💰 {t.accounting || 'Accounting'}</div>
        <div className="feature-card">📊 {t.analytics || 'Analytics'}</div>
        <div className="feature-card">📈 {t.reports || 'Reports'}</div>
        <div className="feature-card">📱 {t.communication || 'Communication'}</div>
      </div>
      
      <div className="status">
        <p>🚧 MVP in Development - Coming Soon!</p>
      </div>
    </div>
  );
}

export default Dashboard;