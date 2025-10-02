import React from 'react';

interface QuickActionsProps {
  // Navigation handlers for quick actions
  onShowLeadManagement: (autoAction?: string, actionParams?: Record<string, unknown>) => void;
  onShowPayments: () => void;
  onShowAnalytics?: () => void;
  
  // Business data for intelligent action suggestions
  hotLeads: number;
  overduePayments: number;
  totalRevenue: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onShowLeadManagement,
  onShowPayments,
  onShowAnalytics,
  hotLeads,
  overduePayments,
  totalRevenue
}) => {
  
  // Intelligent action suggestions based on business state
  const getPriorityAction = () => {
    if (overduePayments > 0) {
      return {
        primary: true,
        icon: '💰',
        label: 'Record Payment',
        description: `${overduePayments} overdue`,
        handler: () => onShowPayments()
      };
    }
    
    if (hotLeads > 0) {
      return {
        primary: true,
        icon: '🎯',
        label: 'Priority Call',
        description: `${hotLeads} hot leads`,
        handler: () => onShowLeadManagement('priority-call')
      };
    }
    
    return {
      primary: true,
      icon: '🆕',
      label: 'Add Lead',
      description: 'Grow pipeline',
      handler: () => onShowLeadManagement('add-lead')
    };
  };
  
  const priorityAction = getPriorityAction();
  
  return (
    <div className="quick-actions">
      <h3>⚡ Quick Actions</h3>
      <div className="actions-grid">
        
        {/* Priority Action (Dynamic) */}
        <button 
          className={`quick-action-btn ${priorityAction.primary ? 'primary' : ''}`}
          onClick={priorityAction.handler}
        >
          <div className="action-icon">{priorityAction.icon}</div>
          <div className="action-content">
            <div className="action-label">{priorityAction.label}</div>
            <div className="action-description">{priorityAction.description}</div>
          </div>
        </button>
        
        {/* Add Lead (Always available) */}
        {!priorityAction.label.includes('Add Lead') && (
          <button 
            className="quick-action-btn"
            onClick={() => onShowLeadManagement('add-lead')}
          >
            <div className="action-icon">🆕</div>
            <div className="action-content">
              <div className="action-label">Add Lead</div>
              <div className="action-description">New inquiry</div>
            </div>
          </button>
        )}
        
        {/* Record Payment (Always available) */}
        {!priorityAction.label.includes('Record Payment') && (
          <button 
            className="quick-action-btn"
            onClick={() => onShowPayments()}
          >
            <div className="action-icon">💰</div>
            <div className="action-content">
              <div className="action-label">Record Payment</div>
              <div className="action-description">Update cash</div>
            </div>
          </button>
        )}
        
        {/* Priority Call (If not primary action) */}
        {!priorityAction.label.includes('Priority Call') && hotLeads > 0 && (
          <button 
            className="quick-action-btn"
            onClick={() => onShowLeadManagement('priority-call')}
          >
            <div className="action-icon">📞</div>
            <div className="action-content">
              <div className="action-label">Priority Call</div>
              <div className="action-description">{hotLeads} hot leads</div>
            </div>
          </button>
        )}
        
        {/* Today's Report */}
        <button 
          className="quick-action-btn"
          onClick={() => onShowAnalytics && onShowAnalytics()}
        >
          <div className="action-icon">📊</div>
          <div className="action-content">
            <div className="action-label">Today's Report</div>
            <div className="action-description">₹{(totalRevenue/100000).toFixed(1)}L total</div>
          </div>
        </button>
        
      </div>
    </div>
  );
};

export default QuickActions;