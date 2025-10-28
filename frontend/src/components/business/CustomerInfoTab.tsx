import React from 'react';
import { mockBusinessProfiles, type BusinessProfile } from '../../data/customerMockData';
import styles from './CustomerInfoTab.module.css';

interface CustomerInfoTabProps {
  customerId: string;
}

const CustomerInfoTab = ({ customerId }: CustomerInfoTabProps) => {
  const customer = mockBusinessProfiles.find(bp => bp.id === customerId);

  const formatAddress = (address: BusinessProfile['registeredAddress']) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.pincode}`;
  };

  const initiateCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const initiateWhatsApp = (phone: string, customerName: string) => {
    const message = `Hello ${customerName}, reaching out regarding your business requirements.`;
    const whatsappURL = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  if (!customer) {
    return (
      <div className={styles.infoTabContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <span className={styles.emptyIcon}>❓</span>
            <h3 className={styles.emptyTitle}>Customer not found</h3>
            <p className={styles.emptyDescription}>
              Unable to load customer information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.infoTabContainer}>
      <div className={styles.infoContent}>
        {/* Company Information */}
        <div className="ds-card-container">
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className={styles.sectionTitle}>Company Information</h3>
            </div>
            <div className="ds-card-content">
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Company Name</span>
                  <span className={styles.infoValue}>{customer.companyName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>GST Number</span>
                  <span className={styles.infoValue}>{customer.gstNumber}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Business Type</span>
                  <span className={styles.infoValue}>{customer.businessType}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Specialization</span>
                  <span className={styles.infoValue}>{customer.specialization}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Employee Count</span>
                  <span className={styles.infoValue}>{customer.employeeCount}</span>
                </div>
                {customer.establishedYear && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Established</span>
                    <span className={styles.infoValue}>{customer.establishedYear}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Future-ready for multiple contacts */}
        <div className="ds-card-container">
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className={styles.sectionTitle}>Contact Information</h3>
            </div>
            <div className="ds-card-content">
              <div className={styles.contactCard}>
                <div className={styles.contactInfo}>
                  <h4 className={styles.contactName}>{customer.contactPerson}</h4>
                  <p className={styles.contactRole}>Primary Contact</p>
                  <div className={styles.contactDetails}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📞</span>
                      <span className={styles.contactValue}>{customer.phone}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>✉️</span>
                      <span className={styles.contactValue}>{customer.email}</span>
                    </div>
                  </div>
                </div>
                <div className="ds-card-actions">
                  <button 
                    className="ds-btn ds-btn-call"
                    onClick={() => initiateCall(customer.phone)}
                  >
                    Call
                  </button>
                  <button 
                    className="ds-btn ds-btn-whatsapp"
                    onClick={() => initiateWhatsApp(customer.phone, customer.contactPerson)}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="ds-card-container">
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className={styles.sectionTitle}>Address Information</h3>
            </div>
            <div className="ds-card-content">
              <div className={styles.addressSection}>
                <h4 className={styles.addressTitle}>Registered Address</h4>
                <p className={styles.addressText}>{formatAddress(customer.registeredAddress)}</p>
              </div>
            </div>
          </div>
        </div>


        {/* Preferences */}
        <div className="ds-card-container">
          <div className="ds-card">
            <div className="ds-card-header">
              <h3 className={styles.sectionTitle}>Preferences & Notes</h3>
            </div>
            <div className="ds-card-content">
              <div className={styles.preferencesGrid}>
                <div className={styles.preferenceItem}>
                  <span className={styles.preferenceLabel}>Payment Method</span>
                  <span className={styles.preferenceValue}>{customer.preferences.paymentMethod}</span>
                </div>
                <div className={styles.preferenceItem}>
                  <span className={styles.preferenceLabel}>Delivery Preference</span>
                  <span className={styles.preferenceValue}>{customer.preferences.deliveryPreference}</span>
                </div>
                <div className={styles.preferenceItem}>
                  <span className={styles.preferenceLabel}>Quality Requirements</span>
                  <span className={styles.preferenceValue}>{customer.preferences.qualityRequirements}</span>
                </div>
                <div className={styles.preferenceItem}>
                  <span className={styles.preferenceLabel}>Communication</span>
                  <span className={styles.preferenceValue}>{customer.preferences.communication}</span>
                </div>
                {customer.preferences.specialNotes && (
                  <div className={styles.preferenceItem}>
                    <span className={styles.preferenceLabel}>Special Notes</span>
                    <span className={styles.preferenceValue}>{customer.preferences.specialNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoTab;