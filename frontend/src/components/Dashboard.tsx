import React from 'react';
import ProductHeader from './ProductHeader';
import { mockLeads, mockQuotes, mockSalesOrders, mockCustomers, formatCurrency } from '../data/mockData';
import styles from '../styles/Dashboard.module.css';

interface DashboardProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  onShowLeadManagement: () => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerList: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
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
  currentTheme,
  onThemeChange,
  onNavigateHome,
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowSalesOrders,
  onShowCustomerList,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated,
  userMode,
  translations: t 
}: DashboardProps) {
  // Calculate business metrics from mock data
  const totalLeads = mockLeads.length;
  const hotLeads = mockLeads.filter(lead => lead.priority === 'hot').length;
  const pendingQuotes = mockQuotes.filter(quote => quote.status === 'pending').length;
  const activeOrders = mockSalesOrders.filter(order => order.status === 'production').length;
  const totalRevenue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = mockCustomers.length;
  
  // Quick metrics
  const conversionRate = Math.round((mockSalesOrders.length / totalLeads) * 100);

  return (
    <div className={styles.dashboard}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onContextNavigation={onNavigateHome}
        contextNavigationText="Home"
        contextNavigationIcon="🏠"
        showContextNavigation={true}
        showThemeSelector={true}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onGuestMode={onGuestMode}
        onDemoMode={onDemoMode}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        userMode={userMode}
      />
      
      <div className={styles.dashboardContainer}>
        {/* Header Section */}
        <div className={styles.dashboardHeader}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.mainTitle}>{t.title}</h1>
            <h2 className={styles.companyName}>{t.company}</h2>
            <p className={styles.subtitle}>Complete 360° Business Visibility & Control</p>
          </div>
          
          {/* Business Metrics Cards */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📋</div>
              <div className={styles.metricValue}>{totalLeads}</div>
              <div className={styles.metricLabel}>Total Leads</div>
              <div className={styles.metricSubtext}>{hotLeads} Hot Leads</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📄</div>
              <div className={styles.metricValue}>{pendingQuotes}</div>
              <div className={styles.metricLabel}>Pending Quotes</div>
              <div className={styles.metricSubtext}>Need Action</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>⚙️</div>
              <div className={styles.metricValue}>{activeOrders}</div>
              <div className={styles.metricLabel}>Active Orders</div>
              <div className={styles.metricSubtext}>In Production</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>₹</div>
              <div className={styles.metricValue}>{formatCurrency(totalRevenue / 100000)}L</div>
              <div className={styles.metricLabel}>Total Revenue</div>
              <div className={styles.metricSubtext}>{conversionRate}% Conversion</div>
            </div>
          </div>
        </div>

        {/* Voice Command Section */}
        <div className={styles.voiceSection}>
          <div className={styles.voiceCard}>
            <div className={styles.voiceIcon}>🎤</div>
            <div className={styles.voiceContent}>
              <h3>Voice Commands Ready</h3>
              <p>"આજના લીડ્સ બતાવો" • "नया ऑर्डर बनाएं" • "Payment status check करो"</p>
            </div>
            <button className={styles.voiceButton}>Start Voice</button>
          </div>
        </div>

        {/* Business Process Modules */}
        <div className={styles.modulesSection}>
          <h3 className={styles.sectionTitle}>Business Process Modules</h3>
          
          {/* Sales Process */}
          <div className={styles.processGroup}>
            <h4 className={styles.processTitle}>💼 Sales Process</h4>
            <div className={styles.moduleGrid}>
              <div className={`${styles.moduleCard} ${styles.clickable} ${styles.implemented}`} onClick={onShowLeadManagement}>
                <div className={styles.moduleIcon}>📋</div>
                <div className={styles.moduleContent}>
                  <h5>{t.leadManagement}</h5>
                  <p>{hotLeads} hot leads need attention</p>
                </div>
                <div className={styles.moduleStatus}>✅ Live</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.clickable} ${styles.implemented}`} onClick={onShowQuotationOrders}>
                <div className={styles.moduleIcon}>📑</div>
                <div className={styles.moduleContent}>
                  <h5>{t.quotationOrders}</h5>
                  <p>{pendingQuotes} quotes pending approval</p>
                </div>
                <div className={styles.moduleStatus}>✅ Live</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.clickable} ${styles.implemented}`} onClick={onShowSalesOrders}>
                <div className={styles.moduleIcon}>💳</div>
                <div className={styles.moduleContent}>
                  <h5>{t.salesOrder}</h5>
                  <p>{activeOrders} orders in production</p>
                </div>
                <div className={styles.moduleStatus}>✅ Live</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.clickable} ${styles.implemented}`} onClick={onShowCustomerList}>
                <div className={styles.moduleIcon}>👥</div>
                <div className={styles.moduleContent}>
                  <h5>{t.customers}</h5>
                  <p>{totalCustomers} active customers</p>
                </div>
                <div className={styles.moduleStatus}>✅ Live</div>
              </div>
            </div>
          </div>

          {/* Production Process */}
          <div className={styles.processGroup}>
            <h4 className={styles.processTitle}>🏭 Production Process</h4>
            <div className={styles.moduleGrid}>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>📋</div>
                <div className={styles.moduleContent}>
                  <h5>{t.workOrders}</h5>
                  <p>Manage production scheduling</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>🛒</div>
                <div className={styles.moduleContent}>
                  <h5>{t.smartProcurement}</h5>
                  <p>Auto purchase material</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>📦</div>
                <div className={styles.moduleContent}>
                  <h5>{t.inventory}</h5>
                  <p>Track raw materials & finished goods</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>⚙️</div>
                <div className={styles.moduleContent}>
                  <h5>{t.productionTracking}</h5>
                  <p>Monitor machine efficiency</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Operations Process */}
          <div className={styles.processGroup}>
            <h4 className={styles.processTitle}>🚚 Operations Process</h4>
            <div className={styles.moduleGrid}>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>🚚</div>
                <div className={styles.moduleContent}>
                  <h5>{t.dispatchDelivery}</h5>
                  <p>Track shipments & delivery</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>🧾</div>
                <div className={styles.moduleContent}>
                  <h5>{t.invoiceFinance}</h5>
                  <p>GST invoicing & payment tracking</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>⭐</div>
                <div className={styles.moduleContent}>
                  <h5>{t.customerFeedback}</h5>
                  <p>Collect & analyze feedback</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
              <div className={`${styles.moduleCard} ${styles.comingSoon}`}>
                <div className={styles.moduleIcon}>📊</div>
                <div className={styles.moduleContent}>
                  <h5>{t.analyticsDashboard}</h5>
                  <p>Business intelligence & reports</p>
                </div>
                <div className={styles.moduleStatus}>🚧 Coming Soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* MVP Status */}
        <div className={styles.mvpStatus}>
          <div className={styles.statusCard}>
            <h4>🚀 MVP Development Status</h4>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width: '30%'}}></div>
            </div>
            <p><strong>4 of 13 modules live</strong> • Sales process complete • Production modules coming next</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;