import React from 'react';
import BusinessPriorities from './components/BusinessPriorities';
import BusinessHealth from './components/BusinessHealth';
import SmartInsights from './components/SmartInsights';
import QuickActions from './components/QuickActions';

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
    <div className="mobile-dashboard-v2">
      {/* Business Intelligence Dashboard V2 */}
      
      {/* Today's Business Priorities */}
      <BusinessPriorities
        hotLeads={hotLeads}
        warmLeads={warmLeads}
        overduePayments={overduePayments}
        pendingAdvanceAmount={pendingAdvanceAmount}
        readyToShip={readyToShip}
        pendingQuotes={pendingQuotes}
        onShowLeadManagement={onShowLeadManagement}
        onShowPayments={onShowPayments}
        onShowQuotationOrders={onShowQuotationOrders}
        onShowFulfillment={onShowFulfillment}
      />
      
      {/* Business Health Summary */}
      <BusinessHealth
        totalRevenue={totalRevenue}
        revenueTarget={1000000}
        totalLeads={totalLeads}
        conversionRate={conversionRate}
        overduePayments={overduePayments}
        pendingAdvanceAmount={pendingAdvanceAmount}
        activeOrders={activeOrders}
        onTimeDeliveryRate={85}
      />
      
      {/* Smart Business Insights */}
      <SmartInsights
        totalRevenue={totalRevenue}
        totalCustomers={totalCustomers}
        activeOrders={activeOrders}
        repeatCustomerOpportunities={repeatCustomerOpportunities}
        conversionRate={conversionRate}
        onShowCustomerList={onShowCustomerList}
        onShowLeadManagement={onShowLeadManagement}
        onShowAnalytics={onShowAnalytics}
      />
      
      {/* Quick Actions */}
      <QuickActions
        onShowLeadManagement={onShowLeadManagement}
        onShowPayments={onShowPayments}
        onShowAnalytics={onShowAnalytics}
        hotLeads={hotLeads}
        overduePayments={overduePayments}
        totalRevenue={totalRevenue}
      />
    </div>
  );
};

export default MobilePresentation;