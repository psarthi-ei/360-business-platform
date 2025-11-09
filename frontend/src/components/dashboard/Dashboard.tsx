import React from 'react';
import { mockLeads, mockQuotes, mockSalesOrders } from '../../data/salesMockData';
import styles from './dashboard.module.css';

interface DashboardProps {
  // Clean interface - only essential 5-tab navigation handlers
  onShowLeadManagement: (autoAction?: string, actionParams?: Record<string, unknown>) => void;
  onShowSales: () => void;
  onShowSalesOrders: () => void;
  onShowPayments: () => void;
  onShowInvoices: () => void;
  onShowCustomerList: () => void;
  onShowInventory?: () => void;
  onShowFulfillment?: () => void;
  onShowAnalytics?: () => void;
  // Auth-related props from App.tsx
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  userMode?: string;
}

function Dashboard({ 
  onShowLeadManagement,
  onShowSales,
  onShowSalesOrders,
  onShowPayments,
  onShowInvoices,
  onShowCustomerList,
  onShowInventory,
  onShowFulfillment,
  onShowAnalytics,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  userMode
}: DashboardProps) {
  
  // Essential business metrics only
  const totalLeads = mockLeads.length;
  const pendingQuotes = mockQuotes.filter(quote => quote.status === 'pending').length;
  const totalRevenue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = mockSalesOrders.filter(order => order.status === 'production_started').length;
  const overduePayments = mockSalesOrders.filter(order => order.paymentStatus && order.paymentStatus.includes('overdue')).length;
  
  // NEW: Procurement metrics for complete 5-tab coverage
  const lowStockItems = 3;
  const pendingPRs = 2;

  return (
    <div className={styles.dashboard} data-testid="dashboard-container">
      
      {/* KPI Strip - 4 cards with horizontal scroll */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>₹{(totalRevenue/100000).toFixed(1)}L</div>
          <div className={styles.kpiLabel}>Revenue</div>
          <div className={styles.kpiTrend}>↑5%</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{pendingQuotes}</div>
          <div className={styles.kpiLabel}>Pending Invoices</div>
          <div className={styles.kpiTrend}>↑2</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{overduePayments}</div>
          <div className={styles.kpiLabel}>Orders at Risk</div>
          <div className={styles.kpiTrend}>↓1</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>85%</div>
          <div className={styles.kpiLabel}>Production Efficiency</div>
          <div className={styles.kpiTrend}>↑3%</div>
        </div>
      </div>


      {/* Alert Card - 2-Column Layout: Content | Action */}
      <div className={styles.alertCard}>
        <div className={styles.alertContent}>
          <span className={styles.alertIcon}>⚠️</span>
          <div className={styles.alertText}>
            <div className={styles.alertTitle}>2 orders blocked - Cotton shortage</div>
            <div className={styles.alertSubtitle}>(300 kg)</div>
          </div>
        </div>
        <button className={styles.alertAction} onClick={() => onShowInventory?.()}>
          Resolve →
        </button>
      </div>

      {/* Business Snapshot Cards - 4 cards for complete 5-tab coverage */}
      
      {/* Sales Snapshot */}
      <div className={styles.snapshotCard} onClick={() => onShowSales()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>📈</span>
          <span className={styles.snapshotTitle}>SALES SNAPSHOT</span>
        </div>
        <div className={styles.snapshotContent}>
          Pipeline: Leads {totalLeads}→Quotes {pendingQuotes}→Orders {activeOrders}
        </div>
        <div className={styles.snapshotAction}>View Pipeline →</div>
      </div>

      {/* Production Snapshot */}
      <div className={styles.snapshotCard} onClick={() => onShowAnalytics?.()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>🏭</span>
          <span className={styles.snapshotTitle}>PRODUCTION SNAPSHOT</span>
        </div>
        <div className={styles.snapshotContent}>
          WOs active: {activeOrders} | Delayed &gt;24h: 1
        </div>
        <div className={styles.snapshotAction}>Open Production →</div>
      </div>

      {/* Procurement Snapshot - NEW for complete business coverage */}
      <div className={styles.snapshotCard} onClick={() => onShowInventory?.()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>📦</span>
          <span className={styles.snapshotTitle}>PROCUREMENT SNAPSHOT</span>
        </div>
        <div className={styles.snapshotContent}>
          Materials: Low stock {lowStockItems} | PRs pending: {pendingPRs}
        </div>
        <div className={styles.snapshotAction}>View Procurement →</div>
      </div>

      {/* Customer Health */}
      <div className={styles.snapshotCard} onClick={() => onShowCustomerList()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>👥</span>
          <span className={styles.snapshotTitle}>CUSTOMER HEALTH</span>
        </div>
        <div className={styles.snapshotContent}>
          Top: Suresh(₹1.2L) Ramesh(₹0.5L) | Unhappy: 1
        </div>
        <div className={styles.snapshotAction}>View Customers →</div>
      </div>

      {/* Activity Timeline */}
      <div className={styles.activityTimeline}>
        <div className={styles.activityHeader}>📋 RECENT ACTIVITY</div>
        <div className={styles.activityItem}>
          <span className={styles.activityTime}>09:12</span>
          <span className={styles.activityText}>Advance ₹25K (Acme)</span>
        </div>
        <div className={styles.activityItem}>
          <span className={styles.activityTime}>08:55</span>
          <span className={styles.activityText}>GRN received (ABC)</span>
        </div>
        <div className={styles.activityItem}>
          <span className={styles.activityTime}>08:15</span>
          <span className={styles.activityText}>WO#451 started (Line 2)</span>
        </div>
      </div>

      {/* Sync Status */}
      <div className={styles.syncStatus}>
        Last synced: 10:42 AM • 2 pending
      </div>
      
    </div>
  );
}

export default Dashboard;