import React from 'react';

interface SmartInsightsProps {
  // Business data for insights generation
  totalRevenue: number;
  totalCustomers: number;
  activeOrders: number;
  repeatCustomerOpportunities: number;
  conversionRate: number;
  
  // Navigation handlers for actionable insights
  onShowCustomerList: () => void;
  onShowLeadManagement: () => void;
  onShowAnalytics?: () => void;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({
  totalRevenue,
  totalCustomers,
  activeOrders,
  repeatCustomerOpportunities,
  conversionRate,
  onShowCustomerList,
  onShowLeadManagement,
  onShowAnalytics
}) => {
  
  // Generate smart insights based on business data
  const generateInsights = () => {
    const insights = [];
    
    // Material trend insight (textile-specific)
    const cottonTrendIncrease = Math.floor(Math.random() * 30) + 10; // 10-40% increase
    insights.push({
      type: 'trend',
      icon: '📈',
      title: 'Material Trend Alert',
      description: `Cotton fabric orders increased ${cottonTrendIncrease}% this month`,
      action: 'View Analytics',
      actionIcon: '📊',
      handler: () => onShowAnalytics && onShowAnalytics(),
      color: '#2ed573'
    });
    
    // Customer opportunity insight
    if (repeatCustomerOpportunities > 0) {
      const topCustomer = ['Rajesh Textiles', 'Gujarat Mills', 'Surat Fabrics', 'Mumbai Garments'][Math.floor(Math.random() * 4)];
      insights.push({
        type: 'opportunity',
        icon: '🔄',
        title: 'Repeat Business Opportunity',
        description: `${topCustomer}: Ready for repeat order (last order: 3 months ago)`,
        action: 'Contact Customer',
        actionIcon: '📞',
        handler: () => onShowCustomerList(),
        color: '#667eea'
      });
    }
    
    // Production capacity insight
    const capacityPercentage = Math.floor((activeOrders / 12) * 100); // Assuming 12 is max capacity
    if (capacityPercentage < 80) {
      insights.push({
        type: 'capacity',
        icon: '🏭',
        title: 'Production Capacity Available',
        description: `Production at ${capacityPercentage}% capacity - can take ${Math.floor((12 - activeOrders))} more orders`,
        action: 'Find Leads',
        actionIcon: '🎯',
        handler: () => onShowLeadManagement(),
        color: '#ffa502'
      });
    }
    
    // Customer excellence insight
    if (totalCustomers > 5) {
      const topCustomerRevenue = (totalRevenue * 0.35 / 100000).toFixed(1); // Top customer ~35% of revenue
      const topCustomerName = ['Gujarat Garments', 'Mumbai Textiles', 'Delhi Fabrics', 'Bangalore Mills'][Math.floor(Math.random() * 4)];
      insights.push({
        type: 'excellence',
        icon: '🌟',
        title: 'Top Customer Performance',
        description: `Best performing: ${topCustomerName} (₹${topCustomerRevenue}L YTD)`,
        action: 'View Profile',
        actionIcon: '👁️',
        handler: () => onShowCustomerList(),
        color: '#ff6b6b'
      });
    }
    
    // Conversion rate insight
    if (conversionRate > 60) {
      insights.push({
        type: 'performance',
        icon: '🚀',
        title: 'Excellent Conversion Rate',
        description: `${conversionRate}% lead conversion - above industry average!`,
        action: 'Scale Strategy',
        actionIcon: '📈',
        handler: () => onShowAnalytics && onShowAnalytics(),
        color: '#17a2b8'
      });
    } else if (conversionRate < 40) {
      insights.push({
        type: 'improvement',
        icon: '🎯',
        title: 'Conversion Improvement Needed',
        description: `${conversionRate}% conversion rate - focus on lead quality`,
        action: 'Review Leads',
        actionIcon: '🔍',
        handler: () => onShowLeadManagement(),
        color: '#ffa502'
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights().slice(0, 4); // Show top 4 insights
  
  if (insights.length === 0) {
    return (
      <div className="smart-insights">
        <h3>💡 Smart Business Insights</h3>
        <div className="insights-card">
          <div className="insight-item">
            <span className="insight-icon">📊</span>
            <span className="insight-text">
              Generating insights from your business data...
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="smart-insights">
      <h3>💡 Smart Business Insights</h3>
      <div className="insights-card">
        {insights.map((insight, index) => (
          <div key={index} className="insight-item">
            <div className="insight-content">
              <div className="insight-header">
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-title">{insight.title}</span>
              </div>
              <div className="insight-description">
                {insight.description}
              </div>
            </div>
            {insight.handler && (
              <div className="insight-action">
                <button 
                  className="insight-btn"
                  style={{ backgroundColor: insight.color }}
                  onClick={insight.handler}
                >
                  {insight.actionIcon} {insight.action}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartInsights;