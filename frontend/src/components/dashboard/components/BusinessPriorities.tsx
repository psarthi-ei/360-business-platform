import React from 'react';

interface BusinessPrioritiesProps {
  // Business metrics for priority calculation
  hotLeads: number;
  warmLeads: number;
  overduePayments: number;
  pendingAdvanceAmount: number;
  readyToShip: number;
  pendingQuotes: number;
  
  // Navigation handlers
  onShowLeadManagement: (autoAction?: string, actionParams?: Record<string, unknown>) => void;
  onShowPayments: () => void;
  onShowQuotationOrders: () => void;
  onShowFulfillment?: () => void;
}

const BusinessPriorities: React.FC<BusinessPrioritiesProps> = ({
  hotLeads,
  warmLeads,
  overduePayments,
  pendingAdvanceAmount,
  readyToShip,
  pendingQuotes,
  onShowLeadManagement,
  onShowPayments,
  onShowQuotationOrders,
  onShowFulfillment
}) => {
  
  // Priority calculation logic
  const priorities = [];
  
  // 🔥 URGENT: Overdue payments (highest priority)
  if (overduePayments > 0) {
    priorities.push({
      type: 'urgent',
      icon: '🔥',
      title: `URGENT (${overduePayments} items)`,
      description: `₹${(pendingAdvanceAmount/100000).toFixed(1)}L overdue payments - Priority calls needed`,
      action: 'Call Customers',
      actionIcon: '📞',
      handler: () => onShowPayments()
    });
  }
  
  // ⚡ HOT: Hot leads ready for quotes  
  if (hotLeads > 0) {
    priorities.push({
      type: 'hot',
      icon: '⚡',
      title: `HOT LEADS (${hotLeads} items)`,
      description: 'Cotton fabric inquiries ready for quotes',
      action: 'Create Quotes',
      actionIcon: '📋',
      handler: () => onShowLeadManagement('create-quotes')
    });
  }
  
  // 💰 CASH FLOW: Pending advance payments
  if (pendingAdvanceAmount > 0 && overduePayments === 0) {
    priorities.push({
      type: 'cashflow',
      icon: '💰',
      title: `CASH FLOW (₹${(pendingAdvanceAmount/100000).toFixed(1)}L pending)`,
      description: 'Advance payments awaiting collection',
      action: 'Follow Up',
      actionIcon: '📱',
      handler: () => onShowPayments()
    });
  }
  
  // 🏭 PRODUCTION: Orders ready to ship
  if (readyToShip > 0) {
    priorities.push({
      type: 'production',
      icon: '🏭',
      title: `PRODUCTION (${readyToShip} orders ready)`,
      description: 'Orders completed, ready for dispatch',
      action: 'Dispatch',
      actionIcon: '🚚',
      handler: () => onShowFulfillment && onShowFulfillment()
    });
  }
  
  // 📋 QUOTES: Pending quotes follow-up
  if (pendingQuotes > 0) {
    priorities.push({
      type: 'quotes',
      icon: '📋',
      title: `QUOTES (${pendingQuotes} pending)`,
      description: 'Quotes awaiting customer response',
      action: 'Follow Up',
      actionIcon: '📞',
      handler: () => onShowQuotationOrders()
    });
  }
  
  // 🎯 WARM LEADS: Follow-up required
  if (warmLeads > 0) {
    priorities.push({
      type: 'warm',
      icon: '🎯',
      title: `WARM LEADS (${warmLeads} items)`,
      description: 'Follow-up calls and relationship building',
      action: 'Follow Up',
      actionIcon: '📞',
      handler: () => onShowLeadManagement('follow-up')
    });
  }
  
  // If no priorities, show positive message
  if (priorities.length === 0) {
    return (
      <div className="business-priorities">
        <h3>📊 Today's Business Priorities</h3>
        <div className="priority-card priority-card-success">
          <div className="priority-header">
            <span className="priority-icon">✅</span>
            <span className="priority-title">EXCELLENT</span>
          </div>
          <div className="priority-description">
            All priorities handled! Business running smoothly.
          </div>
          <div className="priority-action">
            <button className="action-btn action-btn-success" onClick={() => onShowLeadManagement()}>
              🎯 Find New Opportunities
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="business-priorities">
      <h3>📊 Today's Business Priorities</h3>
      <div className="priorities-list">
        {priorities.slice(0, 4).map((priority, index) => (
          <div key={index} className={`priority-card priority-card-${priority.type}`}>
            <div className="priority-header">
              <span className="priority-icon">{priority.icon}</span>
              <span className="priority-title">{priority.title}</span>
            </div>
            <div className="priority-description">
              {priority.description}
            </div>
            <div className="priority-action">
              <button 
                className={`action-btn action-btn-${priority.type}`} 
                onClick={priority.handler}
              >
                {priority.actionIcon} {priority.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPriorities;