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
                <div className={styles.perfNumber}>₹{formatCurrency(totalRevenue / 100000)}L</div>
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

          {/* Business Areas */}
          <div className={styles.businessAreas}>
            <h3>Manage Your Business</h3>
            
            <div className={styles.areasGrid}>
              <div className={`${styles.businessArea} ${styles.live}`} onClick={onShowLeadManagement}>
                <div className={styles.areaIcon}>📞</div>
                <div className={styles.areaInfo}>
                  <h4>Customer Inquiries</h4>
                  <p>{totalLeads} active leads • {hotLeads} need immediate attention</p>
                </div>
                <div className={styles.areaStatus}>Live</div>
              </div>
              
              <div className={`${styles.businessArea} ${styles.live}`} onClick={onShowQuotationOrders}>
                <div className={styles.areaIcon}>📋</div>
                <div className={styles.areaInfo}>
                  <h4>Quotes & Orders</h4>
                  <p>{pendingQuotes} quotes pending • Follow up for orders</p>
                </div>
                <div className={styles.areaStatus}>Live</div>
              </div>
              
              <div className={`${styles.businessArea} ${styles.live}`} onClick={onShowCustomerList}>
                <div className={styles.areaIcon}>🤝</div>
                <div className={styles.areaInfo}>
                  <h4>Customer Relations</h4>
                  <p>{totalCustomers} customers • Track orders & payments</p>
                </div>
                <div className={styles.areaStatus}>Live</div>
              </div>
              
              <div className={`${styles.businessArea} ${styles.coming}`}>
                <div className={styles.areaIcon}>💰</div>
                <div className={styles.areaInfo}>
                  <h4>Payments & Finance</h4>
                  <p>Track advance payments, collections, cash flow</p>
                </div>
                <div className={styles.areaStatus}>Soon</div>
              </div>
              
              <div className={`${styles.businessArea} ${styles.coming}`}>
                <div className={styles.areaIcon}>🏭</div>
                <div className={styles.areaInfo}>
                  <h4>Production Floor</h4>
                  <p>Work orders, inventory, quality tracking</p>
                </div>
                <div className={styles.areaStatus}>Soon</div>
              </div>
              
              <div className={`${styles.businessArea} ${styles.coming}`}>
                <div className={styles.areaIcon}>🚚</div>
                <div className={styles.areaInfo}>
                  <h4>Delivery & Dispatch</h4>
                  <p>Schedule deliveries, track shipments</p>
                </div>
                <div className={styles.areaStatus}>Soon</div>
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