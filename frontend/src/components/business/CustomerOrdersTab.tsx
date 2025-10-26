import React from 'react';
import { mockSalesOrders, type SalesOrder } from '../../data/salesMockData';
import styles from './CustomerOrdersTab.module.css';

interface CustomerOrdersTabProps {
  customerId: string;
}

const CustomerOrdersTab = ({ customerId }: CustomerOrdersTabProps) => {
  // Get customer orders
  const customerOrders = mockSalesOrders.filter(order => order.businessProfileId === customerId);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get order progress percentage
  const getOrderProgress = (order: SalesOrder) => {
    const statusProgress = {
      'pending': 0,
      'confirmed': 20,
      'production_started': 40,
      'quality_check': 70,
      'production_completed': 90,
      'delivered': 100,
      'cancelled': 0
    };
    return statusProgress[order.status as keyof typeof statusProgress] || 0;
  };

  // Get order progress text
  const getOrderProgressText = (order: SalesOrder) => {
    const progressTexts = {
      'pending': 'Order Pending',
      'confirmed': 'Order Confirmed',
      'production_started': 'In Production',
      'quality_check': 'Quality Check',
      'production_completed': 'Ready for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return progressTexts[order.status as keyof typeof progressTexts] || order.status;
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    const statusClasses = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'production_started': 'production',
      'quality_check': 'quality',
      'production_completed': 'ready',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'default';
  };

  // Action handlers
  const viewOrderDetails = (orderId: string) => {
    // View order details functionality
    alert(`Order details for ${orderId} - coming soon!`);
  };

  const initiateCall = (contactPerson: string) => {
    // Call contact person functionality
    alert(`Calling ${contactPerson}...`);
  };

  const trackOrder = (orderId: string) => {
    // Track order functionality
    alert(`Order tracking for ${orderId} - coming soon!`);
  };

  // Sort orders by date (newest first)
  const sortedOrders = customerOrders.sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  if (customerOrders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <span className={styles.emptyIcon}>📦</span>
          <h3 className={styles.emptyTitle}>No orders found</h3>
          <p className={styles.emptyDescription}>
            This customer hasn't placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersTabContainer}>
      <div className={styles.ordersList}>
        {sortedOrders.map((order) => (
          <div key={order.id} className="ds-card-container">
            <div className="ds-card ds-card-with-actions">
              {/* Order Header */}
              <div className="ds-card-header">
                <span className={styles.orderNumber}>ORDER #{order.id}</span>
                <span className={`ds-badge ${styles.statusBadge} ${styles[getStatusClass(order.status)]}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              {/* Order Details */}
              <div className="ds-card-content">
                <p className={styles.productDescription}>
                  {order.items} - Details available
                </p>
                <div className="ds-card-meta">
                  Value: ₹{formatCurrency(order.totalAmount)} | Due: {formatDate(order.deliveryDate)}
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className={styles.orderProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${getOrderProgress(order)}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  {getOrderProgressText(order)}
                </span>
              </div>
              
              {/* Contextual Actions - 44px touch targets */}
              <div className="ds-card-actions">
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => viewOrderDetails(order.id)}
                >
                  👁️ View
                </button>
                <button 
                  className="ds-btn ds-btn-secondary"
                  onClick={() => initiateCall('Customer Representative')}
                >
                  📞 Discuss
                </button>
                <button 
                  className="ds-btn ds-btn-primary"
                  onClick={() => trackOrder(order.id)}
                >
                  📊 Track
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrdersTab;