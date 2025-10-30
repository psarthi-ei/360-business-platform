import React from 'react';
import { SalesOrder, OrderItem } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import CustomerDetailsModal from './CustomerDetailsModal';
import styles from './OrderDetailsModal.module.css';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
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

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  const customer = getBusinessProfileById(order.businessProfileId);

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

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors = {
      'order_confirmed': 'info',
      'production_planning': 'info', 
      'pending_materials': 'warning',
      'production_started': 'primary',
      'quality_check': 'primary',
      'production_completed': 'success',
      'ready_to_ship': 'success',
      'shipped': 'success',
      'in_transit': 'primary',
      'delivered': 'success',
      'completed': 'success'
    };
    return statusColors[status as keyof typeof statusColors] || 'neutral';
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    const paymentColors = {
      'pending': 'warning',
      'advance_received': 'info',
      'partial': 'warning', 
      'completed': 'success',
      'overdue': 'danger',
      'fully_paid': 'success'
    };
    return paymentColors[status as keyof typeof paymentColors] || 'neutral';
  };

  // Get urgency color
  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return 'neutral';
    const urgencyColors = {
      'normal': 'neutral',
      'urgent': 'warning',
      'critical': 'danger'
    };
    return urgencyColors[urgency as keyof typeof urgencyColors] || 'neutral';
  };

  return (
    <CustomerDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.id}`}
    >
      <div className={styles.orderDetailsContent}>
        
        {/* Order Header Information */}
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h3 className={styles.orderTitle}>Order {order.id}</h3>
            <p className={styles.customerName}>{customer?.companyName || 'Unknown Customer'}</p>
          </div>
          <div className={styles.orderBadges}>
            <span className={`${styles.statusBadge} ${styles[getStatusColor(order.status)]}`}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </span>
            {order.urgency && (
              <span className={`${styles.urgencyBadge} ${styles[getUrgencyColor(order.urgency)]}`}>
                {order.urgency.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Product Details</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Product</span>
              <span className={styles.detailValue}>{getOrderItemsHeader(order)}</span>
            </div>
            {order.productDescription && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Description</span>
                <span className={styles.detailValue}>{order.productDescription}</span>
              </div>
            )}
            {order.quantity && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Quantity</span>
                <span className={styles.detailValue}>{order.quantity}</span>
              </div>
            )}
            {order.fabricType && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fabric Type</span>
                <span className={styles.detailValue}>{order.fabricType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Financial Details</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Order Value</span>
              <span className={styles.detailValue}>₹{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Status</span>
              <span className={`${styles.paymentStatus} ${styles[getPaymentStatusColor(order.paymentStatus)]}`}>
                {order.paymentStatus.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            {order.balancePaymentDue && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Balance Due</span>
                <span className={styles.detailValue}>₹{formatCurrency(order.balancePaymentDue)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Information */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Timeline</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Order Date</span>
              <span className={styles.detailValue}>{formatDate(order.orderDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Delivery Date</span>
              <span className={styles.detailValue}>{formatDate(order.deliveryDate)}</span>
            </div>
            {order.expectedDeliveryDate && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Expected Delivery</span>
                <span className={styles.detailValue}>{formatDate(order.expectedDeliveryDate)}</span>
              </div>
            )}
            {order.actualDeliveryDate && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Actual Delivery</span>
                <span className={styles.detailValue}>{formatDate(order.actualDeliveryDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Production Status */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Production Status</h4>
          <div className={styles.productionInfo}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}>{order.productionStatus}</span>
            </div>
            {order.progressPercentage !== undefined && (
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.detailLabel}>Progress</span>
                  <span className={styles.progressValue}>{order.progressPercentage}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${order.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
            {order.statusMessage && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status Message</span>
                <span className={styles.detailValue}>{order.statusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Notes */}
        {order.customerNotes && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Customer Instructions</h4>
            <div className={styles.notesContent}>
              <p className={styles.notesText}>{order.customerNotes}</p>
            </div>
          </div>
        )}

      </div>
    </CustomerDetailsModal>
  );
};

export default OrderDetailsModal;