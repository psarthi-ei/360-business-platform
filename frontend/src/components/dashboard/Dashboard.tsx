import React from 'react';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import { 
  calculateAllDashboardKPIs, 
  formatCurrency,
  ComprehensiveDashboardData 
} from '../../utils/dashboardKPICalculations';
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
  onShowProduction?: () => void;
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
  onShowProduction,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  userMode
}: DashboardProps) {
  
  // Use regional terminology for consistent user experience
  const { 
    customers, 
    orders,
    service,
    leads,
    materials,
    salesModule,
    workOrders
  } = useTerminologyTerms();
  
  // ===== COMPREHENSIVE DASHBOARD KPIs CALCULATION =====
  const dashboardData: ComprehensiveDashboardData = calculateAllDashboardKPIs();
  const { globalKPIs, salesKPIs, storeKPIs, processKPIs, customerKPIs } = dashboardData;
  
  // Legacy calculations for alerts and activity timeline
  const awaitingClientMaterials = globalKPIs.activeJobOrders; // Simplified for demo
  const readyForPickup = Math.floor(globalKPIs.activeJobOrders * 0.3); // Estimated 30%

  return (
    <div className={styles.dashboard} data-testid="dashboard-container">
      
      {/* GLOBAL BUSINESS PULSE - Top 4 KPIs */}
      <div className={styles.globalPulse}>
        <div className={styles.pulseHeader}>
          <span className={styles.pulseIcon}>📊</span>
          <span className={styles.pulseTitle}>BUSINESS PULSE</span>
        </div>
        <div className={styles.globalKpiStrip}>
          <div className={styles.globalKpiCard}>
            <div className={styles.globalKpiValue}>{globalKPIs.activeJobOrders}</div>
            <div className={styles.globalKpiLabel}>Active {orders}</div>
            <div className={styles.globalKpiTrend}>↑3</div>
          </div>
          <div className={styles.globalKpiCard}>
            <div className={styles.globalKpiValue}>{globalKPIs.lotsInProcess}</div>
            <div className={styles.globalKpiLabel}>WIP {workOrders}</div>
            <div className={styles.globalKpiTrend}>↓2</div>
          </div>
          <div className={styles.globalKpiCard}>
            <div className={styles.globalKpiValue}>{formatCurrency(globalKPIs.billedThisMonth)}</div>
            <div className={styles.globalKpiLabel}>Billed This Month</div>
            <div className={styles.globalKpiTrend}>↑₹1.2L</div>
          </div>
          <div className={styles.globalKpiCard}>
            <div className={styles.globalKpiValue}>{formatCurrency(globalKPIs.outstandingAmount)}</div>
            <div className={styles.globalKpiLabel}>Outstanding</div>
            <div className={styles.globalKpiTrend}>↓₹0.8L</div>
          </div>
        </div>
      </div>

      {/* MODULE KPI SECTIONS */}
      <div className={styles.moduleKpiSections}>
        
        {/* Inquiry Module KPIs */}
        <div className={styles.moduleKpiSection} onClick={() => onShowSales()}>
          <div className={styles.moduleHeader}>
            <span className={styles.moduleIcon}>📋</span>
            <span className={styles.moduleTitle}>{salesModule.toUpperCase()} KPIs</span>
          </div>
          <div className={styles.moduleKpiGrid}>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>{leads} This Month</span>
              <span className={styles.moduleKpiValue}>{salesKPIs.leadsThisMonth}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Conversion Rate</span>
              <span className={styles.moduleKpiValue}>{salesKPIs.conversionRate}%</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>New {orders} This Month</span>
              <span className={styles.moduleKpiValue}>{salesKPIs.ordersThisMonth}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Unbilled Work</span>
              <span className={styles.moduleKpiValue}>{formatCurrency(salesKPIs.unbilledWork)}</span>
            </div>
          </div>
          <div className={styles.moduleAction}>Manage {salesModule} →</div>
        </div>

        {/* Store/Procurement Module KPIs */}
        <div className={styles.moduleKpiSection} onClick={() => onShowInventory?.()}>
          <div className={styles.moduleHeader}>
            <span className={styles.moduleIcon}>📦</span>
            <span className={styles.moduleTitle}>{materials.toUpperCase()} KPIs</span>
          </div>
          <div className={styles.moduleKpiGrid}>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Low Stock</span>
              <span className={styles.moduleKpiValue}>{storeKPIs.lowStockItems}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Out of Stock</span>
              <span className={styles.moduleKpiValue}>{storeKPIs.outOfStockItems}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Material Inward</span>
              <span className={styles.moduleKpiValue}>{storeKPIs.materialInwardThisMonth}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>PO Raised</span>
              <span className={styles.moduleKpiValue}>{storeKPIs.purchaseOrdersRaised}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>PO Pending</span>
              <span className={styles.moduleKpiValue}>{storeKPIs.purchaseOrdersPending}</span>
            </div>
          </div>
          <div className={styles.moduleAction}>Check {materials} →</div>
        </div>

        {/* Process/Production Module KPIs */}
        <div className={styles.moduleKpiSection} onClick={() => onShowProduction?.()}>
          <div className={styles.moduleHeader}>
            <span className={styles.moduleIcon}>⚙️</span>
            <span className={styles.moduleTitle}>PROCESS KPIs</span>
          </div>
          <div className={styles.moduleKpiGrid}>
            <div className={styles.stagesContainer}>
              <span className={styles.stagesHeader}>Stages</span>
              <div className={styles.stagesVisual}>
                <div className={styles.stageItem}>
                  <div className={styles.stageIcon}>🎨</div>
                  <div className={styles.stageCount}>{processKPIs.lotsByStage.dyeing}</div>
                  <div className={styles.stageLabel}>Dye</div>
                </div>
                <div className={styles.stageItem}>
                  <div className={styles.stageIcon}>🖨️</div>
                  <div className={styles.stageCount}>{processKPIs.lotsByStage.printing}</div>
                  <div className={styles.stageLabel}>Print</div>
                </div>
                <div className={styles.stageItem}>
                  <div className={styles.stageIcon}>✨</div>
                  <div className={styles.stageCount}>{processKPIs.lotsByStage.finishing}</div>
                  <div className={styles.stageLabel}>Finish</div>
                </div>
                <div className={styles.stageItem}>
                  <div className={styles.stageIcon}>🔍</div>
                  <div className={styles.stageCount}>{processKPIs.lotsByStage.qc}</div>
                  <div className={styles.stageLabel}>QC</div>
                </div>
                <div className={styles.stageItem}>
                  <div className={styles.stageIcon}>✅</div>
                  <div className={styles.stageCount}>{processKPIs.lotsByStage.ready}</div>
                  <div className={styles.stageLabel}>Ready</div>
                </div>
              </div>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Avg Processing</span>
              <span className={styles.moduleKpiValue}>{processKPIs.avgProcessingTime} days</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Delayed Lots</span>
              <span className={styles.moduleKpiValue}>{processKPIs.delayedLots}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Ready Not Dispatched</span>
              <span className={styles.moduleKpiValue}>{processKPIs.readyNotDispatched}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Rework %</span>
              <span className={styles.moduleKpiValue}>{processKPIs.reworkPercentage}%</span>
            </div>
          </div>
          <div className={styles.moduleAction}>View Production →</div>
        </div>

        {/* Party Module KPIs */}
        <div className={styles.moduleKpiSection} onClick={() => onShowCustomerList()}>
          <div className={styles.moduleHeader}>
            <span className={styles.moduleIcon}>🤝</span>
            <span className={styles.moduleTitle}>{customers.toUpperCase()} KPIs</span>
          </div>
          <div className={styles.moduleKpiGrid}>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Active {customers}</span>
              <span className={styles.moduleKpiValue}>{customerKPIs.activeCustomers}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>New This Month</span>
              <span className={styles.moduleKpiValue}>{customerKPIs.newCustomersThisMonth}</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Repeat {customers.slice(0, -1)} %</span>
              <span className={styles.moduleKpiValue}>{customerKPIs.repeatCustomerPercentage}%</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Top Billing</span>
              <span className={styles.moduleKpiValue}>{customerKPIs.topCustomersByRevenue[0]?.name} ({formatCurrency(customerKPIs.topCustomersByRevenue[0]?.amount)})</span>
            </div>
            <div className={styles.moduleKpi}>
              <span className={styles.moduleKpiLabel}>Top Outstanding</span>
              <span className={styles.moduleKpiValue}>{customerKPIs.topCustomersByOutstanding[0]?.name} ({formatCurrency(customerKPIs.topCustomersByOutstanding[0]?.amount)})</span>
            </div>
          </div>
          <div className={styles.moduleAction}>View {customers} →</div>
        </div>
        
      </div>

      {/* QUICK ALERTS */}
      <div className={styles.quickAlerts}>
        <div className={styles.alertsHeader}>
          <span className={styles.alertsIcon}>⚠️</span>
          <span className={styles.alertsTitle}>QUICK ALERTS</span>
        </div>
        <div className={styles.alertsList}>
          <span className={styles.alertItem}>• {processKPIs.delayedLots} lots delayed</span>
          <span className={styles.alertItem}>• {Math.floor(globalKPIs.outstandingAmount / 80000)} overdue bills</span>
          <span className={styles.alertItem}>• {Math.floor(salesKPIs.leadsThisMonth * 0.3)} {leads.toLowerCase()} need rate</span>
          <span className={styles.alertItem}>• {processKPIs.readyNotDispatched} lots ready not dispatched</span>
        </div>
      </div>

      {/* Business Intelligence Footer */}
      <div className={styles.businessFooter}>
        <div className={styles.syncStatus}>
          Last updated: {new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})} • {awaitingClientMaterials + readyForPickup} pending actions
        </div>
        <div className={styles.businessMetrics}>
          Total {service.toLowerCase()} value: {formatCurrency(globalKPIs.billedThisMonth)} | Active processes: {globalKPIs.lotsInProcess + salesKPIs.leadsThisMonth}
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;