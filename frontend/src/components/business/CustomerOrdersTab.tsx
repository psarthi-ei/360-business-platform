import React, { useState } from 'react';
import { mockSalesOrders, type SalesOrder, OrderItem } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import OrderDetailsModal from './OrderDetailsModal';
import styles from './CustomerOrdersTab.module.css';

interface CustomerOrdersTabProps {
  customerId: string;
}

// Helper function to format order items for display
const getOrderItemsHeader = (order: { items: OrderItem[] }): string => {
  if (!order.items || order.items.length === 0) {
    return 'No items';
  }
  
  if (order.items.length === 1) {
    return `${order.items[0].description} (${order.items[0].quantity} ${order.items[0].unit})`;
  } else {
    const firstItem = order.items[0];
    const remainingCount = order.items.length - 1;
    return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
  }
};

const CustomerOrdersTab = ({ customerId }: CustomerOrdersTabProps) => {
  // State for modal
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get customer orders
  const customerOrders = mockSalesOrders.filter(order => order.businessProfileId === customerId);

  // Modal handlers
  const handleViewDetails = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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

  // Get status information matching Production order cards
  const getOrderStatusInfo = (order: SalesOrder) => {
    const statusInfo = {
      'pending': { icon: '🟡', label: 'Order Pending', cardClass: 'ds-card-status-pending' },
      'confirmed': { icon: '🟢', label: 'Order Confirmed', cardClass: 'ds-card-status-active' },
      'production_started': { icon: '🔵', label: 'In Production', cardClass: 'ds-card-status-pending' },
      'quality_check': { icon: '🟠', label: 'Quality Check', cardClass: 'ds-card-status-pending' },
      'production_completed': { icon: '✅', label: 'Ready for Delivery', cardClass: 'ds-card-status-active' },
      'delivered': { icon: '🎉', label: 'Delivered', cardClass: 'ds-card-status-completed' },
      'cancelled': { icon: '❌', label: 'Cancelled', cardClass: 'ds-card-status-cancelled' }
    };
    return statusInfo[order.status as keyof typeof statusInfo] || statusInfo['pending'];
  };

  // Get payment status info  
  const getPaymentStatus = (order: SalesOrder) => {
    // Use existing payment status from order
    const paymentStatus = order.paymentStatus;
    
    if (paymentStatus === 'fully_paid' || paymentStatus === 'completed') {
      return { icon: '✅', label: 'Paid' };
    } else if (paymentStatus === 'advance_received' || paymentStatus === 'partial') {
      const outstanding = order.balancePaymentDue || 0;
      return { icon: '🟡', label: `₹${formatCurrency(outstanding)} Due` };
    } else {
      return { icon: '🔴', label: 'Payment Pending' };
    }
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
        {sortedOrders.map((order) => {
          const businessProfile = getBusinessProfileById(order.businessProfileId);
          const companyName = businessProfile?.companyName || 'Unknown Company';
          const statusInfo = getOrderStatusInfo(order);
          const paymentStatus = getPaymentStatus(order);
          
          return (
            <div key={order.id} className="ds-card-container" data-order-id={order.id}>
              {/* Global Card System - 140px Template - Matches Production Cards */}
              <div className={`ds-card ${statusInfo.cardClass}`}>
                {/* Order Header - Order ID + Company */}
                <div 
                  className="ds-card-header"
                  title={`${order.id} - ${companyName} - ${getOrderItemsHeader(order)}`}
                >
                  <span>{order.id} — </span>
                  <span className={styles.truncateText}>{companyName}</span>
                </div>
                
                {/* Status Information - Order Status & Payment Status */}
                <div className="ds-card-status">
                  <div className={styles.statusLine}>
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                  <div className={styles.statusLine}>
                    {paymentStatus.icon} {paymentStatus.label}
                  </div>
                </div>
                
                {/* Meta Information - Product Details & Value */}
                <div 
                  className="ds-card-meta"
                  title={`${getOrderItemsHeader(order)} | Value: ₹${formatCurrency(order.totalAmount)} | Due: ${formatDate(order.deliveryDate)}`}
                >
                  {getOrderItemsHeader(order)}<br />
                  Value: ₹{formatCurrency(order.totalAmount)} • Due: {formatDate(order.deliveryDate)}
                </div>

                {/* Action Button - View Details */}
                <div className="ds-card-actions">
                  <button 
                    className="ds-btn ds-btn-sm ds-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(order);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default CustomerOrdersTab;