import React from 'react';
import styles from '../dashboard.module.css';

interface BusinessHealthProps {
  // Revenue metrics
  totalRevenue: number;
  revenueTarget?: number;
  
  // Pipeline metrics  
  totalLeads: number;
  conversionRate: number;
  
  // Cash flow metrics
  overduePayments: number;
  pendingAdvanceAmount: number;
  
  // Production metrics
  activeOrders: number;
  onTimeDeliveryRate?: number;
}

const BusinessHealth: React.FC<BusinessHealthProps> = ({
  totalRevenue,
  revenueTarget = 1000000, // Default 10L target
  totalLeads,
  conversionRate,
  overduePayments,
  pendingAdvanceAmount,
  activeOrders,
  onTimeDeliveryRate = 85
}) => {
  
  // Calculate health metrics
  const revenueProgress = (totalRevenue / revenueTarget) * 100;
  const avgOutstandingDays = overduePayments > 0 ? Math.floor(Math.random() * 20) + 10 : 0; // Mock calculation
  
  // Health status calculation
  const getHealthStatus = (value: number, good: number, excellent: number) => {
    if (value >= excellent) return 'excellent';
    if (value >= good) return 'good';
    return 'needs-attention';
  };
  
  const revenueStatus = getHealthStatus(revenueProgress, 70, 90);
  const conversionStatus = getHealthStatus(conversionRate, 50, 70);
  const cashFlowStatus = overduePayments === 0 ? 'excellent' : overduePayments < 3 ? 'good' : 'needs-attention';
  const productionStatus = activeOrders > 2 ? 'excellent' : activeOrders > 0 ? 'good' : 'needs-attention';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#2ed573';
      case 'good': return '#ffa502';
      case 'needs-attention': return '#ff4757';
      default: return '#666';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'needs-attention': return 'Needs Attention';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className={styles['business-health']}>
      <h3>📊 Business Health - This Month</h3>
      <div className={styles['business-health-card']}>
        
        {/* Revenue Progress */}
        <div className={styles['health-metric']}>
          <div className={styles['metric-header']}>
            <span className={styles['metric-icon']}>💰</span>
            <span className={styles['metric-label']}>Revenue Progress</span>
            <span 
              className={styles['metric-status']}
              style={{ color: getStatusColor(revenueStatus) }}
            >
              {getStatusText(revenueStatus)}
            </span>
          </div>
          <div className={styles['metric-value']}>
            ₹{(totalRevenue/100000).toFixed(1)}L / ₹{(revenueTarget/100000).toFixed(0)}L ({revenueProgress.toFixed(0)}%)
          </div>
          <div className={styles['metric-progress']}>
            <div 
              className={styles['progress-bar']}
              style={{ 
                width: `${Math.min(revenueProgress, 100)}%`,
                backgroundColor: getStatusColor(revenueStatus)
              }}
            ></div>
          </div>
        </div>
        
        {/* Pipeline Strength */}
        <div className={styles['health-metric']}>
          <div className={styles['metric-header']}>
            <span className={styles['metric-icon']}>🎯</span>
            <span className={styles['metric-label']}>Pipeline Strength</span>
            <span 
              className={styles['metric-status']}
              style={{ color: getStatusColor(conversionStatus) }}
            >
              {getStatusText(conversionStatus)}
            </span>
          </div>
          <div className={styles['metric-value']}>
            {totalLeads} active leads, {conversionRate}% conversion rate
          </div>
        </div>
        
        {/* Cash Flow Status */}
        <div className={styles['health-metric']}>
          <div className={styles['metric-header']}>
            <span className={styles['metric-icon']}>💳</span>
            <span className={styles['metric-label']}>Cash Flow Status</span>
            <span 
              className={styles['metric-status']}
              style={{ color: getStatusColor(cashFlowStatus) }}
            >
              {getStatusText(cashFlowStatus)}
            </span>
          </div>
          <div className={styles['metric-value']}>
            {overduePayments === 0 
              ? 'All payments current' 
              : `₹${(pendingAdvanceAmount/100000).toFixed(1)}L outstanding, avg ${avgOutstandingDays} days`
            }
          </div>
        </div>
        
        {/* Production Efficiency */}
        <div className={styles['health-metric']}>
          <div className={styles['metric-header']}>
            <span className={styles['metric-icon']}>🏭</span>
            <span className={styles['metric-label']}>Production Efficiency</span>
            <span 
              className={styles['metric-status']}
              style={{ color: getStatusColor(productionStatus) }}
            >
              {getStatusText(productionStatus)}
            </span>
          </div>
          <div className={styles['metric-value']}>
            {activeOrders} active orders, {onTimeDeliveryRate}% on-time delivery
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BusinessHealth;