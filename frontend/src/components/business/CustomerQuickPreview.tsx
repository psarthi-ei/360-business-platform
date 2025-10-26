import React from 'react';
import { BusinessProfile, formatCurrency } from '../../data/customerMockData';
import ModalPortal from '../ui/ModalPortal';
import styles from './CustomerQuickPreview.module.css';

interface CustomerQuickPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  customer: BusinessProfile | null;
  onViewFullProfile?: (customerId: string) => void;
}

function CustomerQuickPreview({ 
  isOpen, 
  onClose, 
  customer, 
  onViewFullProfile 
}: CustomerQuickPreviewProps) {

  if (!customer) return null;

  // Status badges and indicators
  const getStatusIndicator = (status: string) => {
    const indicators = {
      prospect: '🆕 Prospect',
      customer: '✅ Customer',
      inactive: '💤 Inactive'
    };
    return indicators[status as keyof typeof indicators] || status;
  };

  const getCreditStatusColor = (status: string) => {
    const colors = {
      excellent: 'var(--ds-color-success)',
      good: 'var(--ds-color-info)', 
      watch: 'var(--ds-color-warning)',
      hold: 'var(--ds-color-danger)',
      new: 'var(--ds-color-neutral)'
    };
    return colors[status as keyof typeof colors] || 'var(--ds-color-neutral)';
  };

  const getPaymentBehaviorIcon = (behavior: string) => {
    const icons = {
      excellent: '⭐',
      good: '✅',
      fair: '⚠️',
      poor: '❌',
      new: '❓'
    };
    return icons[behavior as keyof typeof icons] || '❓';
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={onClose}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>
              {customer.companyName}
            </h2>
            <div className={styles.statusBadge}>
              {getStatusIndicator(customer.customerStatus)}
            </div>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Company Overview Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Company Overview</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Business Type:</span>
                <span className={styles.value}>{customer.businessType}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Specialization:</span>
                <span className={styles.value}>{customer.specialization}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Employees:</span>
                <span className={styles.value}>{customer.employeeCount}</span>
              </div>
              {customer.establishedYear && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Established:</span>
                  <span className={styles.value}>{customer.establishedYear}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Contact Person:</span>
                <span className={styles.value}>{customer.contactPerson}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{customer.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{customer.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Location:</span>
                <span className={styles.value}>
                  {customer.registeredAddress.city}, {customer.registeredAddress.state}
                </span>
              </div>
            </div>
          </div>

          {/* Business Metrics Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Business Metrics</h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{customer.totalOrders}</div>
                <div className={styles.metricLabel}>Total Orders</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{customer.activeOrders}</div>
                <div className={styles.metricLabel}>Active Orders</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{formatCurrency(customer.totalRevenue)}</div>
                <div className={styles.metricLabel}>Total Revenue</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>{formatCurrency(customer.averageOrderValue)}</div>
                <div className={styles.metricLabel}>Avg Order Value</div>
              </div>
            </div>
          </div>

          {/* Credit & Payment Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Credit & Payment</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Credit Limit:</span>
                <span className={styles.value}>{formatCurrency(customer.creditLimit)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Payment Score:</span>
                <span className={styles.value}>{customer.paymentScore}/100</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Credit Status:</span>
                <span 
                  className={styles.statusValue}
                  style={{ color: getCreditStatusColor(customer.creditStatus) }}
                >
                  {customer.creditStatus.charAt(0).toUpperCase() + customer.creditStatus.slice(1)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Payment Behavior:</span>
                <span className={styles.value}>
                  {getPaymentBehaviorIcon(customer.paymentBehavior)} {customer.paymentBehavior.charAt(0).toUpperCase() + customer.paymentBehavior.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* GST & Legal Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Legal Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>GST Number:</span>
                <span className={styles.value}>{customer.gstNumber}</span>
              </div>
              {customer.panNumber && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>PAN Number:</span>
                  <span className={styles.value}>{customer.panNumber}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.label}>Registered Address:</span>
                <span className={styles.value}>
                  {customer.registeredAddress.street}, {customer.registeredAddress.city}, {customer.registeredAddress.state} - {customer.registeredAddress.pincode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.actionButtons}>
            <button className="ds-btn ds-btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="ds-btn ds-btn-primary">
              📞 Call
            </button>
            <button className="ds-btn ds-btn-primary">
              📱 WhatsApp
            </button>
            {onViewFullProfile && (
              <button 
                className="ds-btn ds-btn-secondary"
                onClick={() => onViewFullProfile(customer.id)}
              >
                📋 Full Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

export default CustomerQuickPreview;