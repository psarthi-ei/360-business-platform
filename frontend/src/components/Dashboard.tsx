import React from 'react';

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
    <div className="dashboard">
      <div className="language-switcher">
        <button 
          className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
          onClick={() => onLanguageChange('en')}
        >
          English
        </button>
        <button 
          className={`lang-btn ${currentLanguage === 'gu' ? 'active' : ''}`}
          onClick={() => onLanguageChange('gu')}
        >
          ગુજરાતી
        </button>
        <button 
          className={`lang-btn ${currentLanguage === 'hi' ? 'active' : ''}`}
          onClick={() => onLanguageChange('hi')}
        >
          हिंदी
        </button>
      </div>

      <h1>🏭 {t.title}</h1>
      <h2>{t.company}</h2>
      <p className="founder-info">
        {t.founder}
      </p>
      
      <div className="features-grid">
        <div className="feature-card clickable" onClick={onShowLeadManagement}>
          📋 {t.leadManagement}
        </div>
        <div className="feature-card clickable" onClick={onShowQuotationOrders}>
          📑 {t.quotationOrders}
        </div>
        <div className="feature-card clickable" onClick={onShowSalesOrders}>💳 {t.salesOrder}</div>
        <div className="feature-card clickable" onClick={onShowCustomerList}>👥 {t.customers}</div>
        <div className="feature-card">📋 {t.workOrders}</div>
        <div className="feature-card">🛒 {t.smartProcurement}</div>
        <div className="feature-card">📦 {t.inventory}</div>
        <div className="feature-card">⚙️ {t.productionTracking}</div>
        <div className="feature-card">🚚 {t.dispatchDelivery}</div>
        <div className="feature-card">🧾 {t.invoiceFinance}</div>
        <div className="feature-card">⭐ {t.customerFeedback}</div>
        <div className="feature-card">🎤 {t.voiceCommands}</div>
        <div className="feature-card">📊 {t.analyticsDashboard}</div>
      </div>
      
      <div className="status">
        <p>🚧 MVP in Development - Coming Soon!</p>
      </div>
    </div>
  );
}

export default Dashboard;