import React, { useState, useEffect } from 'react';
import styles from './CustomerListManagement.module.css';
import { mockBusinessProfiles, type BusinessProfile } from '../../data/customerMockData';
import { mockSalesOrders, type SalesOrder } from '../../data/salesMockData';
import { mockAdvancePayments, mockFinalPayments, type AdvancePayment, type FinalPayment } from '../../data/salesMockData';

interface CustomerListManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal: boolean;
  onAddModalHandled: () => void;
}

interface CustomerMetrics {
  outstanding: number;
  ltv: number;
  lastOrderDays: number;
  paymentScore: number;
  activeOrders: number;
}

const CustomerListManagement = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange, 
  openAddModal, 
  onAddModalHandled 
}: CustomerListManagementProps) => {
  const [customers] = useState(mockBusinessProfiles.filter((bp: BusinessProfile) => bp.customerStatus === 'customer'));
  const [customerMetrics, setCustomerMetrics] = useState<Record<string, CustomerMetrics>>({});

  // Calculate customer metrics
  useEffect(() => {
    const metricsMap: Record<string, CustomerMetrics> = {};
    
    customers.forEach((customer: BusinessProfile) => {
      const customerOrders = mockSalesOrders.filter((order: SalesOrder) => order.businessProfileId === customer.id);
      const customerAdvancePayments = mockAdvancePayments.filter((payment: AdvancePayment) => payment.businessProfileId === customer.id);
      const customerFinalPayments = mockFinalPayments.filter((payment: FinalPayment) => payment.businessProfileId === customer.id);
      
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
        ['production_started', 'quality_check', 'production_completed'].includes(order.status)
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

  const handleCall = (customer: BusinessProfile) => {
    // eslint-disable-next-line no-console
    console.log(`Calling ${customer.companyName}:`, customer.phone);
  };

  const handleWhatsApp = (customer: BusinessProfile) => {
    const phone = customer.phone || '9876543210';
    window.open(`https://wa.me/91${phone}`, '_blank');
  };

  const handleQuickPreview = (customerId: string) => {
    // Future: Open quick preview modal
    onShowCustomerProfile?.(customerId);
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
                  className="ds-btn ds-btn-secondary"
                  onClick={() => handleCall(customer)}
                >
                  📞 Call
                </button>
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => handleWhatsApp(customer)}
                >
                  📱 WhatsApp
                </button>
                <button 
                  className="ds-btn ds-btn-primary"
                  onClick={() => handleQuickPreview(customer.id)}
                >
                  👁️ View
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