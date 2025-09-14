import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { mockLeads, mockQuotes, mockSalesOrders, mockBusinessProfiles } from '../data/mockData';
import styles from '../styles/ProcessMetrics.module.css';

interface ProcessMetricsProps {
  onStageClick?: (stage: string) => void;
}

interface StageMetrics {
  stage: string;
  icon: string;
  title: string;
  count: number;
  conversionRate: number;
  bottleneckScore: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'attention';
}

function ProcessMetrics({ onStageClick }: ProcessMetricsProps) {
  const { t } = useTranslation();

  // Calculate conversion metrics
  const calculateConversionMetrics = (): StageMetrics[] => {
    const totalLeads = mockLeads.length;
    const hotLeads = mockLeads.filter(lead => lead.priority === 'hot').length;
    const warmLeads = mockLeads.filter(lead => lead.priority === 'warm').length;
    const totalQuotes = mockQuotes.length;
    const approvedQuotes = mockQuotes.filter(quote => quote.status === 'approved').length;
    const totalOrders = mockSalesOrders.length;
    const activeOrders = mockSalesOrders.filter(order => order.status === 'production').length;
    const completedOrders = mockSalesOrders.filter(order => order.status === 'completed').length;
    const totalCustomers = mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length;

    // Stage conversion calculations
    const leadToQuoteRate = totalLeads > 0 ? (totalQuotes / totalLeads) * 100 : 0;
    const quoteToOrderRate = totalQuotes > 0 ? (totalOrders / totalQuotes) * 100 : 0;
    const orderCompletionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const leadToCustomerRate = totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0;

    // Bottleneck scoring (lower is better, indicates stages where conversion slows)
    const getBottleneckScore = (conversionRate: number) => {
      if (conversionRate >= 80) return 1; // Low bottleneck
      if (conversionRate >= 60) return 2; // Medium bottleneck
      if (conversionRate >= 40) return 3; // High bottleneck
      return 4; // Critical bottleneck
    };

    const getStatus = (conversionRate: number): 'excellent' | 'good' | 'attention' => {
      if (conversionRate >= 75) return 'excellent';
      if (conversionRate >= 50) return 'good';
      return 'attention';
    };

    const getTrend = (conversionRate: number): 'up' | 'down' | 'stable' => {
      // Simulated trend based on conversion rates for demo
      if (conversionRate >= 70) return 'up';
      if (conversionRate >= 40) return 'stable';
      return 'down';
    };

    return [
      {
        stage: 'leads',
        icon: '🔥',
        title: 'Lead Pipeline',
        count: totalLeads,
        conversionRate: leadToQuoteRate,
        bottleneckScore: getBottleneckScore(leadToQuoteRate),
        trend: getTrend(leadToQuoteRate),
        status: getStatus(leadToQuoteRate)
      },
      {
        stage: 'quotes',
        icon: '📋',
        title: 'Quotations',
        count: totalQuotes,
        conversionRate: quoteToOrderRate,
        bottleneckScore: getBottleneckScore(quoteToOrderRate),
        trend: getTrend(quoteToOrderRate),
        status: getStatus(quoteToOrderRate)
      },
      {
        stage: 'payments',
        icon: '💰',
        title: 'Payments',
        count: approvedQuotes,
        conversionRate: quoteToOrderRate, // Using same as quotes for payment conversion
        bottleneckScore: getBottleneckScore(quoteToOrderRate),
        trend: getTrend(quoteToOrderRate),
        status: getStatus(quoteToOrderRate)
      },
      {
        stage: 'production',
        icon: '🏭',
        title: 'Production',
        count: totalOrders,
        conversionRate: orderCompletionRate,
        bottleneckScore: getBottleneckScore(orderCompletionRate),
        trend: getTrend(orderCompletionRate),
        status: getStatus(orderCompletionRate)
      },
      {
        stage: 'inventory',
        icon: '📦',
        title: 'Inventory',
        count: activeOrders,
        conversionRate: 85, // Simulated inventory efficiency
        bottleneckScore: 1,
        trend: 'stable',
        status: 'excellent'
      },
      {
        stage: 'fulfillment',
        icon: '🚚',
        title: 'Fulfillment',
        count: completedOrders,
        conversionRate: 92, // Simulated fulfillment rate
        bottleneckScore: 1,
        trend: 'up',
        status: 'excellent'
      },
      {
        stage: 'customers',
        icon: '🤝',
        title: 'Customers',
        count: totalCustomers,
        conversionRate: leadToCustomerRate,
        bottleneckScore: getBottleneckScore(leadToCustomerRate),
        trend: getTrend(leadToCustomerRate),
        status: getStatus(leadToCustomerRate)
      }
    ];
  };

  const stageMetrics = calculateConversionMetrics();

  // Calculate overall workflow metrics
  const calculateWorkflowMetrics = () => {
    const totalLeads = mockLeads.length;
    const totalCustomers = mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length;
    const totalRevenue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const overallConversion = totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0;
    const averageOrderValue = mockSalesOrders.length > 0 ? totalRevenue / mockSalesOrders.length : 0;
    const customerLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      overallConversion,
      averageOrderValue,
      customerLifetimeValue,
      totalRevenue
    };
  };

  const workflowMetrics = calculateWorkflowMetrics();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'attention': return '🔴';
      default: return '⚪';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getBottleneckDescription = (score: number) => {
    switch (score) {
      case 1: return 'Smooth Flow';
      case 2: return 'Minor Delays';
      case 3: return 'Bottleneck';
      case 4: return 'Critical Block';
      default: return 'Unknown';
    }
  };

  return (
    <div className={styles.processMetrics}>
      <div className={styles.metricsHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>📊</span>
          <h2 className={styles.headerTitle}>{t('Business Process Intelligence')}</h2>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.overallScore}>
            <span className={styles.scoreLabel}>{t('Overall Conversion')}:</span>
            <span className={styles.scoreValue}>{workflowMetrics.overallConversion.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Process Flow Visualization */}
      <div className={styles.processFlow}>
        <div className={styles.flowTitle}>
          <span className={styles.flowIcon}>🔄</span>
          <span>{t('8-Stage Business Process Flow')}</span>
        </div>
        
        <div className={styles.stageMetricsGrid}>
          {stageMetrics.map((stage, index) => (
            <div key={stage.stage} className={styles.stageMetricCard}>
              <div 
                className={`${styles.stageCard} ${styles[`stage-${stage.status}`]}`}
                onClick={() => onStageClick?.(stage.stage)}
              >
                <div className={styles.stageHeader}>
                  <span className={styles.stageIcon}>{stage.icon}</span>
                  <div className={styles.stageInfo}>
                    <h4 className={styles.stageTitle}>{stage.title}</h4>
                    <span className={styles.stageCount}>{stage.count} {t('items')}</span>
                  </div>
                  <div className={styles.stageStatus}>
                    <span className={styles.statusIcon}>{getStatusIcon(stage.status)}</span>
                  </div>
                </div>

                <div className={styles.stageMetrics}>
                  <div className={styles.conversionRate}>
                    <span className={styles.metricLabel}>{t('Conversion')}:</span>
                    <span className={styles.metricValue}>{stage.conversionRate.toFixed(1)}%</span>
                    <span className={styles.trendIcon}>{getTrendIcon(stage.trend)}</span>
                  </div>
                  
                  <div className={styles.bottleneckInfo}>
                    <span className={styles.bottleneckLabel}>{t('Flow')}:</span>
                    <span className={`${styles.bottleneckValue} ${styles[`bottleneck-${stage.bottleneckScore}`]}`}>
                      {getBottleneckDescription(stage.bottleneckScore)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Process Flow Arrow */}
              {index < stageMetrics.length - 1 && (
                <div className={styles.processArrow}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className={styles.kpiSection}>
        <h3 className={styles.kpiTitle}>
          <span className={styles.kpiIcon}>🎯</span>
          {t('Key Performance Indicators')}
        </h3>
        
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiCardIcon}>💰</span>
              <span className={styles.kpiLabel}>{t('Total Revenue')}</span>
            </div>
            <div className={styles.kpiValue}>
              ₹{(workflowMetrics.totalRevenue / 100000).toFixed(1)}L
            </div>
            <div className={styles.kpiTrend}>📈 +12% vs last month</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiCardIcon}>🎯</span>
              <span className={styles.kpiLabel}>{t('Conversion Rate')}</span>
            </div>
            <div className={styles.kpiValue}>
              {workflowMetrics.overallConversion.toFixed(1)}%
            </div>
            <div className={styles.kpiTrend}>📈 +5% vs last month</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiCardIcon}>💳</span>
              <span className={styles.kpiLabel}>{t('Avg Order Value')}</span>
            </div>
            <div className={styles.kpiValue}>
              ₹{(workflowMetrics.averageOrderValue / 1000).toFixed(0)}K
            </div>
            <div className={styles.kpiTrend}>➡️ Stable</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiCardIcon}>🤝</span>
              <span className={styles.kpiLabel}>{t('Customer LTV')}</span>
            </div>
            <div className={styles.kpiValue}>
              ₹{(workflowMetrics.customerLifetimeValue / 100000).toFixed(1)}L
            </div>
            <div className={styles.kpiTrend}>📈 +8% vs last month</div>
          </div>
        </div>
      </div>

      {/* Process Bottleneck Analysis */}
      <div className={styles.bottleneckSection}>
        <h3 className={styles.bottleneckTitle}>
          <span className={styles.bottleneckIcon}>⚠️</span>
          {t('Bottleneck Analysis')}
        </h3>
        
        <div className={styles.bottleneckCards}>
          {stageMetrics
            .filter(stage => stage.bottleneckScore >= 3)
            .map(stage => (
              <div key={stage.stage} className={styles.bottleneckCard}>
                <div className={styles.bottleneckCardHeader}>
                  <span className={styles.bottleneckCardIcon}>{stage.icon}</span>
                  <span className={styles.bottleneckCardTitle}>{stage.title}</span>
                  <span className={styles.bottleneckSeverity}>
                    {stage.bottleneckScore === 4 ? 'Critical' : 'High'}
                  </span>
                </div>
                <div className={styles.bottleneckDetails}>
                  <div className={styles.bottleneckRate}>
                    {t('Conversion')}: {stage.conversionRate.toFixed(1)}%
                  </div>
                  <div className={styles.bottleneckRecommendation}>
                    💡 {t('Recommended')}: {stage.stage === 'leads' ? 'Improve lead qualification process' : 
                        stage.stage === 'quotes' ? 'Streamline quote approval workflow' : 
                        'Optimize process efficiency'}
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {stageMetrics.filter(stage => stage.bottleneckScore >= 3).length === 0 && (
          <div className={styles.noBottlenecks}>
            <span className={styles.noBottlenecksIcon}>✅</span>
            <span className={styles.noBottlenecksText}>
              {t('All processes are flowing smoothly! No critical bottlenecks detected.')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessMetrics;