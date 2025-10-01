import React from 'react';

interface MobilePresentationProps {
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
  onShowCustomerList: () => void;
  onShowInventory?: () => void;
  onShowFulfillment?: () => void;
  onShowAnalytics?: () => void;
}

const MobilePresentation: React.FC<MobilePresentationProps> = ({
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
  onShowAnalytics
}) => {
  return (
    <div className="mobile-dashboard">
      {/* Mobile Metrics Cards */}
      <div className="mobile-metrics">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-info">
            <div className="metric-value">{totalLeads}</div>
            <div className="metric-label">Total Leads</div>
          </div>
        </div>
        
        <div className="metric-card hot">
          <div className="metric-icon">🔥</div>
          <div className="metric-info">
            <div className="metric-value">{hotLeads}</div>
            <div className="metric-label">Hot Leads</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-info">
            <div className="metric-value">{approvedQuotes}</div>
            <div className="metric-label">Approved Quotes</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <div className="metric-value">₹{(totalRevenue/100000).toFixed(1)}L</div>
            <div className="metric-label">Revenue</div>
          </div>
        </div>
      </div>
      
      {/* Business Health Summary */}
      <div className="mobile-business-health">
        <h3>Business Health</h3>
        <div className="health-metrics">
          <div className="health-item">
            <span className="health-icon">🔥</span>
            <span className="health-text">Pipeline {hotLeads > 3 ? 'Strong' : hotLeads > 1 ? 'Good' : 'Needs Attention'}</span>
          </div>
          <div className="health-item">
            <span className="health-icon">💰</span>
            <span className="health-text">Cash Flow {overduePayments === 0 ? 'Healthy' : overduePayments < 3 ? 'Good' : 'Needs Attention'}</span>
          </div>
          <div className="health-item">
            <span className="health-icon">🏭</span>
            <span className="health-text">Production {activeOrders > 2 ? 'Active' : activeOrders > 0 ? 'Moderate' : 'Planning Phase'}</span>
          </div>
          <div className="health-item">
            <span className="health-icon">🤝</span>
            <span className="health-text">Customer Health {repeatCustomerOpportunities > 5 ? 'Excellent' : repeatCustomerOpportunities > 2 ? 'Good' : 'Building'}</span>
          </div>
        </div>
      </div>
      
      {/* Priority Actions */}
      <div className="mobile-priority-actions">
        <h3>Priority Actions</h3>
        <div className="priority-list">
          {warmLeads > 0 && (
            <div className="priority-item" onClick={() => onShowLeadManagement()}>
              <span className="priority-icon">📞</span>
              <span className="priority-text">Follow up with {warmLeads} warm leads</span>
              <span className="priority-arrow">→</span>
            </div>
          )}
          
          {overduePayments > 0 && (
            <div className="priority-item" onClick={() => onShowPayments()}>
              <span className="priority-icon">💰</span>
              <span className="priority-text">Chase {overduePayments} overdue payments</span>
              <span className="priority-arrow">→</span>
            </div>
          )}
          
          {pendingQuotes > 0 && (
            <div className="priority-item" onClick={() => onShowQuotationOrders()}>
              <span className="priority-icon">📋</span>
              <span className="priority-text">{pendingQuotes} quotes expiring soon</span>
              <span className="priority-arrow">→</span>
            </div>
          )}
          
          {readyToShip > 0 && (
            <div className="priority-item" onClick={() => onShowFulfillment && onShowFulfillment()}>
              <span className="priority-icon">🚚</span>
              <span className="priority-text">{readyToShip} orders ready to ship</span>
              <span className="priority-arrow">→</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Access Modules */}
      <div className="mobile-quick-modules">
        <h3>Business Modules</h3>
        <div className="modules-grid">
          <div className="module-card" onClick={() => onShowLeadManagement()}>
            <div className="module-icon">🎯</div>
            <div className="module-title">Leads</div>
            <div className="module-count">{totalLeads}</div>
          </div>
          
          <div className="module-card" onClick={() => onShowQuotationOrders()}>
            <div className="module-icon">📋</div>
            <div className="module-title">Quotes</div>
            <div className="module-count">{approvedQuotes}</div>
          </div>
          
          <div className="module-card" onClick={() => onShowSalesOrders()}>
            <div className="module-icon">📄</div>
            <div className="module-title">Orders</div>
            <div className="module-count">{activeOrders}</div>
          </div>
          
          <div className="module-card" onClick={() => onShowPayments()}>
            <div className="module-icon">💰</div>
            <div className="module-title">Payments</div>
            <div className="module-count">₹{(pendingAdvanceAmount/100000).toFixed(1)}L</div>
          </div>
          
          <div className="module-card" onClick={() => onShowCustomerList()}>
            <div className="module-icon">🤝</div>
            <div className="module-title">Customers</div>
            <div className="module-count">{totalCustomers}</div>
          </div>
          
          <div className="module-card" onClick={() => onShowInventory && onShowInventory()}>
            <div className="module-icon">📦</div>
            <div className="module-title">Inventory</div>
            <div className="module-count">Stock</div>
          </div>
          
          <div className="module-card" onClick={() => onShowFulfillment && onShowFulfillment()}>
            <div className="module-icon">🚚</div>
            <div className="module-title">Shipping</div>
            <div className="module-count">{readyToShip}</div>
          </div>
          
          <div className="module-card" onClick={() => onShowAnalytics && onShowAnalytics()}>
            <div className="module-icon">📊</div>
            <div className="module-title">Analytics</div>
            <div className="module-count">{conversionRate}%</div>
          </div>
        </div>
      </div>
      
      {/* Mobile Quick Actions */}
      <div className="mobile-quick-actions">
        <button className="quick-action" onClick={() => onShowLeadManagement('add-lead')}>
          ➕ Add Lead
        </button>
        <button className="quick-action" onClick={() => onShowQuotationOrders()}>
          📋 New Quote
        </button>
        <button className="quick-action" onClick={() => onShowLeadManagement()}>
          📞 Follow Up
        </button>
      </div>
    </div>
  );
};

export default MobilePresentation;