import React from 'react';
import { mockSalesOrders, getAdvancePaymentsByCustomerId, getFinalPaymentsByCustomerId } from '../../data/salesMockData';
import { mockBusinessProfiles, BusinessProfile } from '../../data/customerMockData';
import styles from './CustomerInsightsTab.module.css';

interface CustomerInsightsTabProps {
  customerId: string;
  customer?: BusinessProfile;
  loyaltyTier?: string;
  paymentScore?: number;
  creditStatus?: string;
}

const CustomerInsightsTab = ({ customerId, customer: customerProp, loyaltyTier, paymentScore, creditStatus }: CustomerInsightsTabProps) => {
  // Get customer data
  const customer = customerProp || mockBusinessProfiles.find(bp => bp.id === customerId);
  const customerOrders = mockSalesOrders.filter(order => order.businessProfileId === customerId);
  const customerAdvancePayments = getAdvancePaymentsByCustomerId(customerId);
  const customerFinalPayments = getFinalPaymentsByCustomerId(customerId);

  // Calculate insights
  const calculateInsights = () => {
    if (!customer) return null;

    const totalOrderValue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalAdvancePaid = customerAdvancePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalFinalPaid = customerFinalPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPaid = totalAdvancePaid + totalFinalPaid;
    const outstanding = totalOrderValue - totalPaid;

    const activeOrders = customerOrders.filter(order => 
      ['production_started', 'quality_check', 'production_completed'].includes(order.status)
    ).length;

    const completedOrders = customerOrders.filter(order => order.status === 'delivered').length;
    const averageOrderValue = customerOrders.length > 0 ? totalOrderValue / customerOrders.length : 0;

    // Calculate payment behavior
    const onTimePayments = customerAdvancePayments.filter(payment => payment.status === 'received').length + 
                          customerFinalPayments.filter(payment => payment.status === 'received' || payment.status === 'verified').length;
    const totalPayments = customerAdvancePayments.length + customerFinalPayments.length;
    const paymentReliability = totalPayments > 0 ? (onTimePayments / totalPayments) * 100 : 0;

    // Calculate growth trend (simplified)
    const currentYear = new Date().getFullYear();
    const thisYearOrders = customerOrders.filter(order => 
      new Date(order.orderDate).getFullYear() === currentYear
    );
    const lastYearOrders = customerOrders.filter(order => 
      new Date(order.orderDate).getFullYear() === currentYear - 1
    );
    
    const thisYearValue = thisYearOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastYearValue = lastYearOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const growthRate = lastYearValue > 0 ? ((thisYearValue - lastYearValue) / lastYearValue) * 100 : 0;

    // Order frequency
    const orderDates = customerOrders.map(order => new Date(order.orderDate)).sort((a, b) => a.getTime() - b.getTime());
    let averageDaysBetweenOrders = 0;
    if (orderDates.length > 1) {
      const intervals = [];
      for (let i = 1; i < orderDates.length; i++) {
        const diffTime = orderDates[i].getTime() - orderDates[i-1].getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        intervals.push(diffDays);
      }
      averageDaysBetweenOrders = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    }

    return {
      totalOrderValue,
      totalPaid,
      outstanding,
      activeOrders,
      completedOrders,
      averageOrderValue,
      paymentReliability,
      growthRate,
      averageDaysBetweenOrders,
      creditUtilization: customer.creditLimit ? (outstanding / customer.creditLimit) * 100 : 0,
      customerSince: customer.becameCustomerDate || '2023-01-01'
    };
  };

  const insights = calculateInsights();

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Get risk assessment
  const getRiskAssessment = () => {
    if (!insights) return { level: 'unknown', color: 'neutral' };
    
    const { paymentReliability, creditUtilization, outstanding } = insights;
    
    if (paymentReliability >= 90 && creditUtilization <= 50 && outstanding <= 100000) {
      return { level: 'Low Risk', color: 'success' };
    } else if (paymentReliability >= 70 && creditUtilization <= 80 && outstanding <= 500000) {
      return { level: 'Medium Risk', color: 'warning' };
    } else {
      return { level: 'High Risk', color: 'danger' };
    }
  };

  // Get growth trend assessment
  const getGrowthTrend = () => {
    if (!insights) return { trend: 'stable', color: 'neutral' };
    
    const { growthRate } = insights;
    
    if (growthRate > 20) {
      return { trend: 'High Growth', color: 'success' };
    } else if (growthRate > 0) {
      return { trend: 'Growing', color: 'info' };
    } else if (growthRate > -10) {
      return { trend: 'Stable', color: 'neutral' };
    } else {
      return { trend: 'Declining', color: 'danger' };
    }
  };

  const riskAssessment = getRiskAssessment();
  const growthTrend = getGrowthTrend();

  if (!insights || !customer) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <span className={styles.emptyIcon}>📊</span>
          <h3 className={styles.emptyTitle}>No insights available</h3>
          <p className={styles.emptyDescription}>
            Insufficient data to generate customer insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insightsTabContainer}>
      <div className={styles.insightsContent}>
        
        {/* Customer Status Bar - Now Scrollable */}
        <div className={styles.customerStatusBar}>
          <span className={styles.loyaltyBadge}>
            🏆 {loyaltyTier || 'STANDARD'}
          </span>
          <span className={styles.paymentScore}>
            Payment Score: {paymentScore || 85}/100
          </span>
          <span className={`${styles.creditStatus} ${styles[creditStatus || 'good']}`}>
            {(creditStatus || 'good').toUpperCase()}
          </span>
        </div>
        
        {/* Key Metrics Cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>₹{formatCurrency(insights.totalOrderValue)}</div>
            <div className={styles.metricLabel}>Total Business Value</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>₹{formatCurrency(insights.averageOrderValue)}</div>
            <div className={styles.metricLabel}>Average Order Value</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{insights.completedOrders}</div>
            <div className={styles.metricLabel}>Completed Orders</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{insights.paymentReliability.toFixed(0)}%</div>
            <div className={styles.metricLabel}>Payment Reliability</div>
          </div>
        </div>

        {/* Business Assessment */}
        <div className={styles.assessmentSection}>
          <h3 className={styles.sectionTitle}>Business Assessment</h3>
          <div className={styles.assessmentCards}>
            <div className={styles.assessmentCard}>
              <div className={styles.assessmentHeader}>
                <span className={styles.assessmentLabel}>Risk Level</span>
                <span className={`${styles.assessmentValue} ${styles[riskAssessment.color]}`}>
                  {riskAssessment.level}
                </span>
              </div>
              <div className={styles.assessmentDetails}>
                Credit Utilization: {insights.creditUtilization.toFixed(1)}%<br/>
                Outstanding: ₹{formatCurrency(insights.outstanding)}
              </div>
            </div>
            
            <div className={styles.assessmentCard}>
              <div className={styles.assessmentHeader}>
                <span className={styles.assessmentLabel}>Growth Trend</span>
                <span className={`${styles.assessmentValue} ${styles[growthTrend.color]}`}>
                  {growthTrend.trend}
                </span>
              </div>
              <div className={styles.assessmentDetails}>
                YoY Growth: {formatPercentage(insights.growthRate)}<br/>
                Order Frequency: {Math.round(insights.averageDaysBetweenOrders)} days avg
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>Financial Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Revenue Generated</span>
              <span className={styles.summaryValue}>₹{formatCurrency(insights.totalPaid)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Outstanding Amount</span>
              <span className={`${styles.summaryValue} ${insights.outstanding > 0 ? styles.warning : styles.success}`}>
                ₹{formatCurrency(insights.outstanding)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Active Orders</span>
              <span className={styles.summaryValue}>{insights.activeOrders} orders</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Customer Since</span>
              <span className={styles.summaryValue}>
                {new Date(insights.customerSince).toLocaleDateString('en-IN', {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={styles.recommendationsSection}>
          <h3 className={styles.sectionTitle}>Recommendations</h3>
          <div className={styles.recommendationsList}>
            {insights.outstanding > 200000 && (
              <div className={styles.recommendation}>
                <span className={styles.recommendationIcon}>💰</span>
                <span className={styles.recommendationText}>
                  High outstanding amount detected. Consider payment follow-up.
                </span>
              </div>
            )}
            {insights.growthRate > 20 && (
              <div className={styles.recommendation}>
                <span className={styles.recommendationIcon}>📈</span>
                <span className={styles.recommendationText}>
                  Strong growth customer. Consider offering volume discounts.
                </span>
              </div>
            )}
            {insights.paymentReliability < 70 && (
              <div className={styles.recommendation}>
                <span className={styles.recommendationIcon}>⚠️</span>
                <span className={styles.recommendationText}>
                  Payment reliability is low. Review credit terms.
                </span>
              </div>
            )}
            {insights.averageDaysBetweenOrders <= 30 && (
              <div className={styles.recommendation}>
                <span className={styles.recommendationIcon}>🔄</span>
                <span className={styles.recommendationText}>
                  Frequent orders detected. Consider subscription model.
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerInsightsTab;