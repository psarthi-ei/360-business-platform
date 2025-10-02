import React from 'react';
import TabNavigation from '../ui/TabNavigation';
import styles from './dashboard.module.css';

interface DesktopPresentationProps {
  // Business metrics
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  pendingQuotes: number;
  approvedQuotes: number;
  totalRevenue: number;
  totalCustomers: number;
  activeOrders: number;
  readyToShip: number;
  overduePayments: number;
  pendingAdvanceAmount: number;
  conversionRate: number;
  leadsReadyForQuotes: number;
  quotesReadyForAdvance: number;
  repeatCustomerOpportunities: number;
  
  // Navigation handlers
  onShowLeadManagement: (autoAction?: string, actionParams?: Record<string, unknown>) => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowPayments: () => void;
  onShowInvoices: () => void;
  onShowCustomerList: () => void;
  onShowInventory?: () => void;
  onShowFulfillment?: () => void;
  onShowAnalytics?: () => void;
  
  // Tab navigation
  showTabNavigation: boolean;
  activeCardType: string | null;
  handleCardClick: (cardType: string) => void;
  closeTabNavigation: () => void;
  getTabConfiguration: (cardType: string) => {
    title: string;
    icon: string;
    tabs: Array<{
      id: string;
      label: string;
      icon: string;
      purpose: string;
      quickStats: string;
      actions?: Array<{ label: string; action: () => void; primary?: boolean }>;
      action?: () => void;
      disabled?: boolean;
    }>;
    quickStats: string;
    nextAction: string;
    voiceCommands: string[];
    smartLinks: Array<{ text: string; action: () => void }>;
  };
  
  // Theme and auth
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
}

const DesktopPresentation: React.FC<DesktopPresentationProps> = ({
  totalLeads,
  hotLeads,
  warmLeads,
  pendingQuotes,
  approvedQuotes,
  totalRevenue,
  totalCustomers,
  activeOrders,
  readyToShip,
  overduePayments,
  pendingAdvanceAmount,
  conversionRate,
  leadsReadyForQuotes,
  quotesReadyForAdvance,
  repeatCustomerOpportunities,
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowSalesOrders,
  onShowPayments,
  onShowCustomerList,
  onShowInventory,
  onShowFulfillment,
  onShowAnalytics,
  showTabNavigation,
  activeCardType,
  handleCardClick,
  closeTabNavigation,
  getTabConfiguration
}) => {
  return (
    <>
      <div className={styles.dashboard} data-testid="dashboard-container">
      
      <div className={styles.dashboardContainer}>

        {/* Compact Business Intelligence Metrics Bar */}
        <div className={styles.compactMetricsBar}>
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>💰</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L</div>
              <div className={styles.compactLabel}>Outstanding</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>🔥</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{hotLeads}</div>
              <div className={styles.compactLabel}>Hot Leads</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>🏭</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{activeOrders}</div>
              <div className={styles.compactLabel}>Active Orders</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>⚠️</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{overduePayments + hotLeads}</div>
              <div className={styles.compactLabel}>Priority Items</div>
            </div>
          </div>
        </div>

        {/* 8 Sequential Business Process Cards */}
        <div className={styles.businessProcesses}>
            <div className={styles.processHeader}>
              <h3>🔄 Textile Business Pipeline</h3>
            </div>
            
            {/* Sequential 8-Card Layout with Process Flow */}
            <div className={styles.smartCardsGrid}>
              
              {/* Process Flow Arrows */}
              <div className={`${styles.processFlowArrow} ${styles['arrow-1-2']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-2-3']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-3-4']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-4-5']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-5-6']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-6-7']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-7-8']}`}>→</div>
              
              {/* Card 1: Lead Pipeline (Business Entry Point) */}
              <div className={`${styles.smartCard} ${styles.cardSales} ${styles['card-1']}`} data-testid="lead-management-card">
                <div className={`${styles.stageIndicator} ${styles['stage-1']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🔥</span>
                  <h4>LEAD PIPELINE</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Pipeline {hotLeads > 3 ? 'Strong' : hotLeads > 1 ? 'Good' : 'Needs Attention'}</span>
                  <span className={styles.keyInsight}>{hotLeads} hot leads worth ₹{((hotLeads * 80000) / 100000).toFixed(1)}L ready for quotes</span>
                  <span className={styles.businessTrend}>↗ {Math.round((hotLeads / totalLeads) * 100)}% hot conversion this month</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Follow up with {Math.max(1, warmLeads)} overdue leads
                </div>
                {leadsReadyForQuotes > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('quotes')}>
                    <span className={styles.contextLinkIcon}>💡</span>
                    <span className={styles.contextLinkText}>{leadsReadyForQuotes} leads ready for quotes</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('leads')} className={styles.cardButton} data-testid="lead-management-button">
                  Manage Leads →
                </button>
              </div>

              {/* Card 2: Quotations & Orders (Conversion Stage) */}
              <div className={`${styles.smartCard} ${styles.cardQuotes} ${styles['card-2']}`} data-testid="quotation-orders-card">
                <div className={`${styles.stageIndicator} ${styles['stage-2']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📋</span>
                  <h4>QUOTATIONS & ORDERS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Quote Conversion: {Math.round((approvedQuotes / Math.max(1, pendingQuotes + approvedQuotes)) * 100)}%</span>
                  <span className={styles.keyInsight}>₹{((pendingQuotes * 60000 + approvedQuotes * 70000) / 100000).toFixed(1)}L in pending approvals</span>
                  <span className={styles.businessTrend}>↗ {approvedQuotes > pendingQuotes ? 'Faster' : 'Standard'} quote turnaround this week</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: {Math.max(1, pendingQuotes)} quotes expiring soon
                </div>
                {quotesReadyForAdvance > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('payments')}>
                    <span className={styles.contextLinkIcon}>💰</span>
                    <span className={styles.contextLinkText}>₹{((quotesReadyForAdvance * 50000) / 100000).toFixed(1)}L awaiting payment</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('quotes')} className={styles.cardButton} data-testid="quotation-orders-button">
                  Manage Quotes →
                </button>
              </div>

              {/* Card 3: Payments (Complete Financial Workflow Hub) */}
              <div className={`${styles.smartCard} ${styles.cardFinancials} ${styles['card-3']}`} data-testid="payments-card">
                <div className={`${styles.stageIndicator} ${styles['stage-3']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>💰</span>
                  <h4>PAYMENTS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Cash Flow: {overduePayments === 0 ? 'Healthy' : overduePayments < 3 ? 'Good' : 'Needs Attention'}</span>
                  <span className={styles.keyInsight}>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L advance payments overdue</span>
                  <span className={styles.businessTrend}>→ Collection rate stable at {Math.round((1 - overduePayments / Math.max(1, approvedQuotes)) * 100)}%</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Chase {Math.max(1, overduePayments)} overdue payments
                </div>
                {approvedQuotes > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('quotes')}>
                    <span className={styles.contextLinkIcon}>📋</span>
                    <span className={styles.contextLinkText}>{approvedQuotes} quotes ready for proforma invoices</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('payments')} className={styles.cardButton} data-testid="payments-button">
                  Manage Payments →
                </button>
              </div>

              {/* Card 4: Production (Manufacturing Stage) */}
              <div className={`${styles.smartCard} ${styles.cardProduction} ${styles['card-4']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-4']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🏭</span>
                  <h4>PRODUCTION</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Production: {activeOrders > 2 ? 'Active' : activeOrders > 0 ? 'Moderate' : 'Planning Phase'}</span>
                  <span className={styles.keyInsight}>₹{((activeOrders * 45000 + readyToShip * 50000) / 100000).toFixed(1)}L orders in manufacturing pipeline</span>
                  <span className={styles.businessTrend}>→ {Math.round((readyToShip / Math.max(1, activeOrders + readyToShip)) * 100)}% completion rate this cycle</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Production modules being developed
                </div>
                {activeOrders > 2 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('inventory')}>
                    <span className={styles.contextLinkIcon}>📦</span>
                    <span className={styles.contextLinkText}>Materials needed for production</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('production')} className={styles.cardButton}>
                  Manage Production →
                </button>
              </div>

              {/* Card 5: Inventory & Materials (Supply Chain) */}
              <div className={`${styles.smartCard} ${styles.cardInventory} ${styles['card-5']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-5']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📦</span>
                  <h4>INVENTORY</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Stock Health: 85% Good</span>
                  <span className={styles.keyInsight}>3 critical materials need immediate reorder attention</span>
                  <span className={styles.businessTrend}>→ ₹{((activeOrders * 15000) / 100000).toFixed(1)}L materials allocated to active orders</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Inventory management modules being developed
                </div>
                {readyToShip > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('fulfillment')}>
                    <span className={styles.contextLinkIcon}>🚚</span>
                    <span className={styles.contextLinkText}>{readyToShip} orders ready for dispatch</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('inventory')} className={styles.cardButton}>
                  Manage Stock →
                </button>
              </div>

              {/* Card 6: Fulfillment (Delivery & Completion) */}
              <div className={`${styles.smartCard} ${styles.cardFulfillment} ${styles['card-6']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-6']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🚚</span>
                  <h4>FULFILLMENT</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Delivery Performance: {readyToShip > 2 ? 'On Track' : readyToShip > 0 ? 'Good' : 'Planning Phase'}</span>
                  <span className={styles.keyInsight}>₹{((readyToShip * 50000) / 100000).toFixed(1)}L orders ready for customer delivery</span>
                  <span className={styles.businessTrend}>→ 95% on-time delivery rate maintained</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Fulfillment modules being developed
                </div>
                {totalCustomers > 5 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('customers')}>
                    <span className={styles.contextLinkIcon}>🤝</span>
                    <span className={styles.contextLinkText}>Feedback pending from customers</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('fulfillment')} className={styles.cardButton}>
                  Manage Delivery →
                </button>
              </div>

              {/* Card 7: Customers (Relationship Management) */}
              <div className={`${styles.smartCard} ${styles.cardCustomers} ${styles['card-7']}`} data-testid="customers-card">
                <div className={`${styles.stageIndicator} ${styles['stage-7']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🤝</span>
                  <h4>CUSTOMERS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Customer Health: {repeatCustomerOpportunities > 5 ? 'Excellent' : repeatCustomerOpportunities > 2 ? 'Good' : 'Building'}</span>
                  <span className={styles.keyInsight}>{repeatCustomerOpportunities} customers showing strong repeat business potential</span>
                  <span className={styles.businessTrend}>↗ {Math.round((repeatCustomerOpportunities / totalCustomers) * 100)}% loyalty rate growing</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Review customer list for business opportunities
                </div>
                {repeatCustomerOpportunities > 3 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('leads')}>
                    <span className={styles.contextLinkIcon}>🔥</span>
                    <span className={styles.contextLinkText}>{repeatCustomerOpportunities} repeat opportunities</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => { handleCardClick('customers'); onShowCustomerList(); }} className={styles.cardButton} data-testid="customers-button">
                  Manage Relations →
                </button>
              </div>

              {/* Card 8: Business Analytics (Intelligence & Optimization) */}
              <div className={`${styles.smartCard} ${styles.cardAnalytics} ${styles['card-8']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-8']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📊</span>
                  <h4>BUSINESS ANALYTICS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Business Health Score: {conversionRate > 20 ? 'Excellent' : conversionRate > 10 ? 'Good' : 'Improving'}</span>
                  <span className={styles.keyInsight}>{conversionRate}% lead to customer conversion with ₹{(totalRevenue/100000).toFixed(1)}L revenue pipeline</span>
                  <span className={styles.businessTrend}>↗ Cross-process efficiency gaining momentum</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Business analytics modules being developed
                </div>
                {(hotLeads < 2 || overduePayments > 2) ? (
                  <div className={styles.smartContextLink} onClick={() => {
                    if (hotLeads < 2) onShowLeadManagement();
                    else if (overduePayments > 2) onShowPayments();
                  }}>
                    <span className={styles.contextLinkIcon}>⚠️</span>
                    <span className={styles.contextLinkText}>
                      {hotLeads < 2 ? 'Low lead conversion needs attention' : 'Payment issues need focus'}
                    </span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('analytics')} className={styles.cardButton}>
                  View Analytics →
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>

      {/* Tab Navigation Overlay */}
      {showTabNavigation && activeCardType && (
        <TabNavigation
          {...getTabConfiguration(activeCardType)}
          onClose={closeTabNavigation}
          activeTabContent={activeCardType}
        />
      )}
    </>
  );
};

export default DesktopPresentation;