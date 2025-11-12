import React from 'react';
import { mockLeads, mockQuotes, mockJobOrders, mockFinalInvoices } from '../../data/salesMockData';
import { mockWorkOrders, mockMachines } from '../../data/productionMockData';
import { mockBusinessProfiles } from '../../data/customerMockData';
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
  
  // Regional terminology integration available for future enhancement
  
  // ===== JOB WORK BUSINESS METRICS CALCULATION =====
  // Answering the 5 core questions: Kitna maal aaya, kitna process mein hai, kitna ready hai, kitna bill bana, kitna paisa pending hai
  
  // 1. Service Pipeline Metrics (Inquiry → Rate → Job Order flow)
  const activeInquiries = mockLeads.filter(lead => !lead.conversionStatus?.includes('converted')).length;
  const hotInquiries = mockLeads.filter(lead => lead.priority === 'hot' && !lead.conversionStatus?.includes('converted')).length;
  const pendingRates = mockQuotes.filter(quote => quote.status === 'pending').length;
  const ratesToRevenue = mockQuotes.reduce((sum, quote) => sum + (quote.totalAmount || 0), 0);
  
  // 2. Financial Health Metrics - Service Revenue Focus
  const jobOrderRevenue = mockJobOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const invoiceRevenue = mockFinalInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalServiceRevenue = jobOrderRevenue + invoiceRevenue;
  
  const totalOutstanding = mockJobOrders
    .filter(order => order.paymentStatus?.includes('pending') || order.paymentStatus?.includes('partial'))
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  // 3. Processing Operations Metrics (Service-based, not manufacturing)
  const totalProcessingUnits = mockMachines.length;
  const activeProcessingUnits = mockMachines.filter(machine => machine.status === 'busy').length;
  const processCapacityUtilization = Math.round((activeProcessingUnits / totalProcessingUnits) * 100);
  const activeLots = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const delayedLots = mockWorkOrders.filter(wo => 
    wo.status === 'in_progress' && 
    wo.estimatedCompletion && 
    new Date(wo.estimatedCompletion) < new Date()
  ).length;
  
  // 4. Service Type Distribution (Core job work services)
  const dyeingLots = mockJobOrders.filter(job => job.serviceType === 'dyeing').length;
  const printingLots = mockJobOrders.filter(job => job.serviceType === 'printing').length;
  const finishingLots = mockJobOrders.filter(job => job.serviceType === 'finishing').length;
  const totalActiveLots = dyeingLots + printingLots + finishingLots;
  
  // 5. Party Portfolio Metrics (Business relationships)
  const activeParties = mockBusinessProfiles.filter(bp => bp.customerStatus === 'customer').length;
  const topParties = mockBusinessProfiles
    .filter(bp => bp.customerStatus === 'customer')
    .sort((a, b) => (b.loyalty?.totalBusinessValue || 0) - (a.loyalty?.totalBusinessValue || 0))
    .slice(0, 3);
  
  // 6. Client Material Flow (Job work specific alerts)
  const awaitingClientMaterials = mockJobOrders.filter(job => job.status === 'awaiting_client_materials').length;
  const readyForPickup = mockJobOrders.filter(job => job.status === 'ready_to_ship' || job.status === 'service_completed').length;
  
  // 7. Monthly Business Volume Metrics
  const currentMonth = new Date().getMonth();
  const ordersThisMonth = mockJobOrders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate.getMonth() === currentMonth;
  }).length;

  return (
    <div className={styles.dashboard} data-testid="dashboard-container">
      
      {/* KPI Strip - 4 cards with horizontal scroll */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{activeParties}</div>
          <div className={styles.kpiLabel}>Active Parties</div>
          <div className={styles.kpiTrend}>↑3</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{ordersThisMonth}</div>
          <div className={styles.kpiLabel}>Orders This Month</div>
          <div className={styles.kpiTrend}>↑5</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{totalActiveLots}</div>
          <div className={styles.kpiLabel}>Lots in Process</div>
          <div className={styles.kpiTrend}>↓2</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>₹{(totalOutstanding/100000).toFixed(1)}L</div>
          <div className={styles.kpiLabel}>Pending Collections</div>
          <div className={styles.kpiTrend}>↓₹0.8L</div>
        </div>
      </div>


      {/* Alert Card - 2-Column Layout: Content | Action */}
      <div className={styles.alertCard}>
        <div className={styles.alertContent}>
          <span className={styles.alertIcon}>📦</span>
          <div className={styles.alertText}>
            <div className={styles.alertTitle}>{awaitingClientMaterials} lots awaiting client materials</div>
            <div className={styles.alertSubtitle}>({readyForPickup} ready for pickup)</div>
          </div>
        </div>
        <button className={styles.alertAction} onClick={() => onShowInventory?.()}>
          Check Materials →
        </button>
      </div>

      {/* Enhanced Business Module Snapshots - Real Data Integration */}
      
      {/* Inquiry Pipeline Intelligence */}
      <div className={styles.snapshotCard} onClick={() => onShowSales()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>📈</span>
          <span className={styles.snapshotTitle}>INQUIRY PIPELINE</span>
        </div>
        <div className={styles.snapshotContent}>
          Pipeline: {activeInquiries} Inquiries→{pendingRates} Rates→₹{(ratesToRevenue/100000).toFixed(1)}L
        </div>
        <div className={styles.snapshotMeta}>
          Hot inquiries: {hotInquiries} | Conversion rate: {activeInquiries > 0 ? Math.round((pendingRates/activeInquiries)*100) : 0}%
        </div>
        <div className={styles.snapshotAction}>Manage Pipeline →</div>
      </div>

      {/* Processing Operations Status */}
      <div className={styles.snapshotCard} onClick={() => onShowProduction?.()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>⚙️</span>
          <span className={styles.snapshotTitle}>PROCESSING STATUS</span>
        </div>
        <div className={styles.snapshotContent}>
          Active lots: {activeLots} | Units: {activeProcessingUnits}/{totalProcessingUnits} busy
        </div>
        <div className={styles.snapshotMeta}>
          Capacity: {processCapacityUtilization}% | Delays: {delayedLots} lots
        </div>
        <div className={styles.snapshotAction}>View Work Orders →</div>
      </div>

      {/* Service Mix Distribution */}
      <div className={styles.snapshotCard} onClick={() => onShowProduction?.()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>🎨</span>
          <span className={styles.snapshotTitle}>SERVICE MIX</span>
        </div>
        <div className={styles.snapshotContent}>
          Dyeing: {dyeingLots} | Printing: {printingLots} | Finishing: {finishingLots}
        </div>
        <div className={styles.snapshotMeta}>
          Total active services: {totalActiveLots} lots | Avg processing: 5 days
        </div>
        <div className={styles.snapshotAction}>View Production Orders →</div>
      </div>

      {/* Party Portfolio Intelligence */}
      <div className={styles.snapshotCard} onClick={() => onShowCustomerList()}>
        <div className={styles.snapshotHeader}>
          <span className={styles.snapshotIcon}>👥</span>
          <span className={styles.snapshotTitle}>PARTY PORTFOLIO</span>
        </div>
        <div className={styles.snapshotContent}>
          Active: {activeParties} parties | Revenue: ₹{(totalServiceRevenue/100000).toFixed(1)}L
        </div>
        <div className={styles.snapshotMeta}>
          Top: {topParties.map(party => party.companyName.split(' ')[0]).slice(0, 2).join(', ')} | Outstanding: ₹{(totalOutstanding/100000).toFixed(1)}L
        </div>
        <div className={styles.snapshotAction}>View Parties →</div>
      </div>

      {/* Smart Activity Timeline - Real Business Events */}
      <div className={styles.activityTimeline}>
        <div className={styles.activityHeader}>📋 TODAY'S ACTIVITY</div>
        
        {/* Job work activity from recent orders */}
        {mockJobOrders
          .filter(order => order.orderDate && new Date(order.orderDate) > new Date(Date.now() - 7*24*60*60*1000))
          .slice(0, 2)
          .map((order, index) => {
            const partyProfile = mockBusinessProfiles.find(bp => bp.id === order.businessProfileId);
            return (
              <div key={order.id} className={styles.activityItem}>
                <span className={styles.activityTime}>{new Date().getHours() - index}:{new Date().getMinutes().toString().padStart(2, '0')}</span>
                <span className={styles.activityText}>
                  Lot {order.serviceType} ₹{(order.totalAmount/1000).toFixed(0)}K ({partyProfile?.companyName.split(' ')[0] || 'Party'})
                </span>
              </div>
            );
          })
        }
        
        {/* Client material receipts */}
        {mockJobOrders
          .filter(order => order.status === 'materials_acknowledged')
          .slice(0, 1)
          .map((order, index) => {
            const partyProfile = mockBusinessProfiles.find(bp => bp.id === order.businessProfileId);
            return (
              <div key={order.id + '-material'} className={styles.activityItem}>
                <span className={styles.activityTime}>{new Date().getHours() - 2}:{(new Date().getMinutes() - 15).toString().padStart(2, '0')}</span>
                <span className={styles.activityText}>
                  Client material received: {order.serviceRequirements?.quantity || 0}m ({partyProfile?.companyName.split(' ')[0] || 'Party'})
                </span>
              </div>
            );
          })
        }
        
        {/* Processing updates */}
        {mockWorkOrders
          .filter(wo => wo.status === 'in_progress')
          .slice(0, 1)
          .map((wo, index) => (
            <div key={wo.id} className={styles.activityItem}>
              <span className={styles.activityTime}>{new Date().getHours() - 3}:{(new Date().getMinutes() - 30).toString().padStart(2, '0')}</span>
              <span className={styles.activityText}>
                Lot #{wo.id.split('-')[1]} processing started ({wo.assignedMachine})
              </span>
            </div>
          ))
        }
      </div>

      {/* Business Intelligence Footer */}
      <div className={styles.businessFooter}>
        <div className={styles.syncStatus}>
          Last updated: {new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})} • {awaitingClientMaterials + readyForPickup} pending actions
        </div>
        <div className={styles.businessMetrics}>
          Total service value: ₹{(totalServiceRevenue/100000).toFixed(1)}L | Active processes: {activeLots + pendingRates + activeInquiries}
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;