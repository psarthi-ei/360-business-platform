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
  onShowAdvancePaymentManagement: () => void;
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
  onShowAdvancePaymentManagement,
  onShowCustomerList,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated,
  userMode,
  translations
}: DashboardProps) {
  // Simplified translation approach - use existing translations where available, fallback to English
  const t = translations;
  
  // Calculate business metrics from mock data
  const totalLeads = mockLeads.length;
  const hotLeads = mockLeads.filter(lead => lead.priority === 'hot').length;
  const pendingQuotes = mockQuotes.filter(quote => quote.status === 'pending').length;
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

        {/* Business Owner's Daily View */}
        <div className={styles.ownerDashboard}>
          
          {/* Today's Business Snapshot */}
          <div className={styles.todaysSnapshot}>
            <div className={styles.snapshotHeader}>
              <h3>Today's Business</h3>
              <span className={styles.date}>Monday, Sep 9</span>
            </div>
            
            <div className={styles.keyNumbers}>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>₹2.4L</span>
                <span className={styles.label}>Payment Due Today</span>
                <span className={styles.action}>3 customers</span>
              </div>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>{hotLeads}</span>
                <span className={styles.label}>Hot Leads to Call</span>
                <span className={styles.action}>Follow up now</span>
              </div>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>2,500m</span>
                <span className={styles.label}>Fabric in Production</span>
                <span className={styles.action}>On schedule</span>
              </div>
            </div>
          </div>

          {/* This Month's Performance */}
          <div className={styles.monthlyPerformance}>
            <div className={styles.performanceHeader}>
              <h3>September Performance</h3>
              <span className={styles.trend}>↗️ Growing</span>
            </div>
            
            <div className={styles.performanceGrid}>
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{formatCurrency(totalRevenue / 100000)}L</div>
                <div className={styles.perfLabel}>Total Revenue</div>
                <div className={styles.perfChange}>+18% vs last month</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{totalLeads}</div>
                <div className={styles.perfLabel}>New Inquiries</div>
                <div className={styles.perfChange}>{hotLeads} very interested</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{conversionRate}%</div>
                <div className={styles.perfLabel}>Inquiry to Order</div>
                <div className={styles.perfChange}>Better than industry</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{totalCustomers}</div>
                <div className={styles.perfLabel}>Happy Customers</div>
                <div className={styles.perfChange}>5 repeat orders</div>
              </div>
            </div>
          </div>

          {/* Business Categories */}
          <div className={styles.businessCategories}>
            <h3>Manage Your Business</h3>
            
            {/* Categories Grid - 5 Business Categories */}
            <div className={styles.categoriesGrid}>
              
              {/* Category 1: Sales & Customer Management */}
              <div className={`${styles.businessCategory} ${styles.live}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>🎯</div>
                  <div className={styles.categoryTitle}>
                    <h4>{translations.salesCustomerCategory}</h4>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>4/4 {translations.liveBadge}</span>
                  </div>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>{totalLeads}</span>
                    <span className={styles.metricLabel}>{t.newLeads}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>{pendingQuotes}</span>
                    <span className={styles.metricLabel}>{t.pendingQuotes}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>{totalCustomers}</span>
                    <span className={styles.metricLabel}>{t.activeCustomers}</span>
                  </div>
                </div>
                
                <div className={styles.categoryModules}>
                  <button 
                    className={`${styles.moduleBtn} ${styles.live}`} 
                    onClick={onShowLeadManagement}
                    title={t.leadManagement}
                  >
                    📞 {t.leads}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.live}`} 
                    onClick={onShowQuotationOrders}
                    title={t.quotationOrders}
                  >
                    📋 {t.quotes}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.live}`} 
                    onClick={onShowSalesOrders}
                    title={t.salesOrder}
                  >
                    📦 {t.salesOrder}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.live}`} 
                    onClick={onShowCustomerList}
                    title={t.customers}
                  >
                    🤝 {t.customers}
                  </button>
                </div>
              </div>

              {/* Category 2: Financial Management */}
              <div className={`${styles.businessCategory} ${styles.partial}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>💰</div>
                  <div className={styles.categoryTitle}>
                    <h4>{t.financialCategory}</h4>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>1/3 {t.liveBadge}</span>
                  </div>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>
                      ₹{(mockSalesOrders.reduce((sum, o) => sum + (o.status === 'pending' ? o.totalAmount * 0.5 : 0), 0) / 100000).toFixed(1)}L
                    </span>
                    <span className={styles.metricLabel}>{t.pendingPayments}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>
                      ₹{(totalRevenue / 100000).toFixed(1)}L
                    </span>
                    <span className={styles.metricLabel}>{t.totalRevenue}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>
                      {mockSalesOrders.filter(o => o.paymentStatus.includes('overdue') || o.paymentStatus.includes('Pending')).length}
                    </span>
                    <span className={styles.metricLabel}>{t.overdue}</span>
                  </div>
                </div>
                
                <div className={styles.categoryModules}>
                  <button 
                    className={`${styles.moduleBtn} ${styles.live}`} 
                    onClick={onShowAdvancePaymentManagement}
                    title={t.payments}
                  >
                    💳 {t.payments}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.reports} - ${t.comingBadge}`}
                  >
                    📊 {t.reports}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.cashFlow} - ${t.comingBadge}`}
                  >
                    💵 {t.cashFlow}
                  </button>
                </div>
              </div>

              {/* Category 3: Production & Operations */}
              <div className={`${styles.businessCategory} ${styles.coming}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>🏭</div>
                  <div className={styles.categoryTitle}>
                    <h4>{t.productionCategory}</h4>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>0/4 {t.comingBadge}</span>
                  </div>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.workOrders}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.inProduction}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.qualityIssues}</span>
                  </div>
                </div>
                
                <div className={styles.categoryModules}>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.workOrders} - ${t.comingBadge}`}
                  >
                    🔧 {t.workOrders}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.procurement} - ${t.comingBadge}`}
                  >
                    📦 {t.procurement}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.inventory} - ${t.comingBadge}`}
                  >
                    📋 {t.inventory}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.production} - ${t.comingBadge}`}
                  >
                    ⚙️ {t.production}
                  </button>
                </div>
              </div>

              {/* Category 4: Fulfillment & Delivery */}
              <div className={`${styles.businessCategory} ${styles.coming}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>🚚</div>
                  <div className={styles.categoryTitle}>
                    <h4>{t.fulfillmentCategory}</h4>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>0/2 {t.comingBadge}</span>
                  </div>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.readyToShip}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.inTransit}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.delivered}</span>
                  </div>
                </div>
                
                <div className={styles.categoryModules}>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.dispatch} - ${t.comingBadge}`}
                  >
                    📤 {t.dispatch}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.delivery} - ${t.comingBadge}`}
                  >
                    📍 {t.delivery}
                  </button>
                </div>
              </div>

              {/* Category 5: Business Intelligence & Analytics */}
              <div className={`${styles.businessCategory} ${styles.coming}`}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>📊</div>
                  <div className={styles.categoryTitle}>
                    <h4>{t.analyticsCategory}</h4>
                  </div>
                  <div className={styles.categoryStatus}>
                    <span className={styles.statusBadge}>0/3 {t.comingBadge}</span>
                  </div>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.reports}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>{t.voiceAI}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricValue}>-</span>
                    <span className={styles.metricLabel}>AI Insights</span>
                  </div>
                </div>
                
                <div className={styles.categoryModules}>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.analytics} - ${t.comingBadge}`}
                  >
                    📈 {t.analytics}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.voiceAI} - ${t.comingBadge}`}
                  >
                    🎤 {t.voiceAI}
                  </button>
                  <button 
                    className={`${styles.moduleBtn} ${styles.coming}`} 
                    disabled
                    title={`${t.reports} - ${t.comingBadge}`}
                  >
                    📋 {t.reports}
                  </button>
                </div>
              </div>
              
            </div>
          </div>

          {/* Voice Assistant */}
          <div className={styles.voiceAssistant}>
            <div className={styles.voiceContent}>
              <span className={styles.voiceIcon}>🎤</span>
              <div className={styles.voiceText}>
                <h4>Ask anything about your business</h4>
                <p>"આજે કેટલા leads આવ્યા?" • "Payment કોની બાકી છે?" • "Production કેમ ચાલે છે?"</p>
              </div>
            </div>
            <button className={styles.voiceButton}>Start Voice</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;