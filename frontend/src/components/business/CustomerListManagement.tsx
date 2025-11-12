import React, { useState, useEffect } from 'react';
// import { useTerminologyTerms } from '../../contexts/TerminologyContext'; // TODO: implement terminology display
import styles from './CustomerListManagement.module.css';
import { mockBusinessProfiles, type BusinessProfile } from '../../data/customerMockData';
import { mockSalesOrders, type SalesOrder, mockLeads, mockJobOrders } from '../../data/salesMockData';
import { getAdvancePaymentsByCustomerId, getFinalPaymentsByCustomerId, type AdvancePayment, type FinalPayment } from '../../data/salesMockData';

interface CustomerListManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  onShow360View?: (customer: BusinessProfile) => void;
}

interface CustomerMetrics {
  outstanding: number;
  ltv: number;
  lastOrderDays: number;
  paymentScore: number;
  activeOrders: number;
}

// Helper function to check if a business profile has any business activity
const hasBusinessActivity = (businessProfileId: string): boolean => {
  // Check if profile has leads (quotes are generated from leads, so leads cover quotes)
  const hasLeads = mockLeads.some(lead => lead.businessProfileId === businessProfileId);
  
  // Check if profile has job orders (can exist independently without leads)
  const hasJobOrders = mockJobOrders.some(order => order.businessProfileId === businessProfileId);
  
  // Check if profile has sales orders (currently empty but included for completeness)
  const hasSalesOrders = mockSalesOrders.some(order => order.businessProfileId === businessProfileId);
  
  return hasLeads || hasJobOrders || hasSalesOrders;
};

// Unified helper to get all customer orders (sales + job orders)
const getAllCustomerOrders = (customerId: string): SalesOrder[] => {
  const salesOrders = mockSalesOrders.filter(order => order.businessProfileId === customerId);
  const jobOrders = mockJobOrders.filter(order => order.businessProfileId === customerId);
  return [...salesOrders, ...jobOrders] as SalesOrder[];
};

const CustomerListManagement = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  onShow360View 
}: CustomerListManagementProps) => {
  // Use terminology hook for Surat processing terminology
  // const { customer, customers: customersTerminology } = useTerminologyTerms(); // "Party", "Parties" - TODO: implement display terminology
  
  const [customers] = useState(mockBusinessProfiles.filter((bp: BusinessProfile) => 
    (bp.customerStatus === 'customer' || bp.customerStatus === 'prospect') && 
    hasBusinessActivity(bp.id)
  ));
  const [customerMetrics, setCustomerMetrics] = useState<Record<string, CustomerMetrics>>({});
  

  // Calculate customer metrics
  useEffect(() => {
    const metricsMap: Record<string, CustomerMetrics> = {};
    
    customers.forEach((customer: BusinessProfile) => {
      const customerOrders = getAllCustomerOrders(customer.id); // Use unified helper for all orders
      const customerAdvancePayments = getAdvancePaymentsByCustomerId(customer.id);
      const customerFinalPayments = getFinalPaymentsByCustomerId(customer.id);
      
      const totalOrderValue = customerOrders.reduce((sum: number, order: SalesOrder) => sum + order.totalAmount, 0);
      const totalAdvancePaid = customerAdvancePayments.reduce((sum: number, payment: AdvancePayment) => sum + payment.amount, 0);
      const totalFinalPaid = customerFinalPayments.reduce((sum: number, payment: FinalPayment) => sum + payment.amount, 0);
      const totalPaid = totalAdvancePaid + totalFinalPaid;
      const outstanding = totalOrderValue - totalPaid;
      
      const lastOrder = customerOrders
        .sort((a: SalesOrder, b: SalesOrder) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0];
      
      const lastOrderDays = lastOrder 
        ? Math.floor((new Date().getTime() - new Date(lastOrder.orderDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const activeOrders = customerOrders.filter((order: SalesOrder) => 
        ['production_started', 'quality_check', 'production_completed', 'in_process', 'ready_to_ship', 'order_confirmed', 'pending_materials', 'materials_pending', 'awaiting_client_materials', 'materials_acknowledged'].includes(order.status)
      ).length;
      
      metricsMap[customer.id] = {
        outstanding,
        ltv: customer.totalRevenue || totalOrderValue,
        lastOrderDays,
        paymentScore: customer.paymentScore || 85,
        activeOrders
      };
    });
    
    setCustomerMetrics(metricsMap);
  }, [customers]);

  // Filter customers based on filterState
  const filteredCustomers = customers.filter((customer: BusinessProfile) => {
    const metrics = customerMetrics[customer.id];
    if (!metrics) return true;
    
    switch (filterState) {
      case 'premium':
        return customer.loyalty?.tier === 'Platinum' || customer.loyalty?.tier === 'Gold';
      case 'active':
        return metrics.activeOrders > 0;
      case 'new':
        return metrics.lastOrderDays <= 30;
      case 'payment_issues':
        return metrics.outstanding > 100000 || metrics.paymentScore < 70;
      default:
        return true;
    }
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  const formatLastOrder = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days <= 30) return `${days} days ago`;
    if (days <= 365) return `${Math.floor(days / 30)} months ago`;
    return 'Over a year ago';
  };


  const getPaymentBehavior = (score: number) => {
    if (score >= 90) return { text: 'Excellent', class: 'excellent' };
    if (score >= 75) return { text: 'Good', class: 'good' };
    if (score >= 60) return { text: 'Average', class: 'average' };
    return { text: 'Poor', class: 'poor' };
  };

  const getCustomerStatus = (customer: BusinessProfile, metrics: CustomerMetrics) => {
    if (metrics.activeOrders > 0) {
      return '⚡ Active Customer';
    }
    
    if (metrics.lastOrderDays <= 30) {
      return '✅ Recent Customer';
    }
    
    if (metrics.lastOrderDays <= 90) {
      return '📈 Regular Customer';
    }
    
    return '😴 Dormant Customer';
  };


  // Direct 360° view navigation
  const handleViewCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer && onShow360View) {
      onShow360View(customer);
    }
  };


  return (
    <div className={styles.customerListContainer}>
      {/* Customer Cards */}
      <div className={styles.customerGrid}>
        {filteredCustomers.map((customer: BusinessProfile) => {
          const metrics = customerMetrics[customer.id] || {};
          const paymentBehavior = getPaymentBehavior(metrics.paymentScore || 85);
          const customerStatus = getCustomerStatus(customer, metrics);
          
          return (
            <div key={customer.id} className="ds-card-container">
              <div className="ds-card ds-card-with-actions">
              {/* Header: Company Name */}
              <div className="ds-card-header" title={customer.companyName}>
                {customer.companyName}
              </div>
              
              {/* Status Row - Business intelligence */}
              <div className="ds-card-status">
                {customerStatus} | Payment: {paymentBehavior.text}
              </div>
              
              {/* Meta Row - Financial metrics */}
              <div className="ds-card-meta">
                Outstanding: ₹{formatCurrency(metrics.outstanding || 0)} | LTV: ₹{formatCurrency(metrics.ltv || 0)}<br />
                Last Order: {formatLastOrder(metrics.lastOrderDays || 999)} • {metrics.activeOrders || 0} active orders
              </div>
              
              {/* Action Buttons - 44px touch targets */}
              <div className="ds-card-actions">
                <button 
                  className="ds-btn ds-btn-primary"
                  onClick={() => handleViewCustomer(customer.id)}
                >
                  360° View
                </button>
              </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <span className={styles.emptyIcon}>👥</span>
            <h3 className={styles.emptyTitle}>No customers found</h3>
            <p className={styles.emptyDescription}>
              {filterState === 'all' 
                ? 'Start by adding your first customer'
                : `No customers match the current filter: ${filterState}`
              }
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerListManagement;