import React from 'react';
import { SupportTicket } from '../../data/customerMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import CustomerDetailsModal from './CustomerDetailsModal';
import styles from './SupportTicketModal.module.css';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
}

const SupportTicketModal = ({ isOpen, onClose, ticket }: SupportTicketModalProps) => {
  if (!ticket) return null;

  const customer = getBusinessProfileById(ticket.businessProfileId);


  // Format date with time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors = {
      'open': 'danger',
      'in_progress': 'warning',
      'resolved': 'success',
      'closed': 'neutral'
    };
    return statusColors[status as keyof typeof statusColors] || 'neutral';
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const priorityColors = {
      'low': 'neutral',
      'medium': 'info',
      'high': 'warning',
      'urgent': 'danger'
    };
    return priorityColors[priority as keyof typeof priorityColors] || 'neutral';
  };

  // Get category display
  const getCategoryDisplay = (category: string) => {
    const categoryMap = {
      'quality_issue': 'Quality Issue',
      'delivery_delay': 'Delivery Delay',
      'payment_query': 'Payment Query',
      'technical_support': 'Technical Support',
      'general_inquiry': 'General Inquiry',
      'complaint': 'Complaint'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  return (
    <CustomerDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket ${ticket.id}`}
    >
      <div className={styles.ticketDetailsContent}>
        
        {/* Ticket Header Information */}
        <div className={styles.ticketHeader}>
          <div className={styles.ticketInfo}>
            <h3 className={styles.ticketTitle}>{ticket.title}</h3>
            <p className={styles.customerName}>{customer?.companyName || 'Unknown Customer'}</p>
          </div>
          <div className={styles.ticketBadges}>
            <span className={`${styles.statusBadge} ${styles[getStatusColor(ticket.status)]}`}>
              {ticket.status.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className={`${styles.priorityBadge} ${styles[getPriorityColor(ticket.priority)]}`}>
              {ticket.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Ticket Information</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Ticket ID</span>
              <span className={styles.detailValue}>{ticket.id}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Category</span>
              <span className={styles.detailValue}>{getCategoryDisplay(ticket.category)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Priority</span>
              <span className={`${styles.priorityValue} ${styles[getPriorityColor(ticket.priority)]}`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={`${styles.statusValue} ${styles[getStatusColor(ticket.status)]}`}>
                {ticket.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Issue Description</h4>
          <div className={styles.descriptionContent}>
            <p className={styles.descriptionText}>{ticket.description}</p>
          </div>
        </div>

        {/* Timeline Information */}
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Timeline</h4>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Created Date</span>
              <span className={styles.detailValue}>{formatDateTime(ticket.createdDate)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Last Updated</span>
              <span className={styles.detailValue}>{formatDateTime(ticket.updatedDate)}</span>
            </div>
            {ticket.resolvedDate && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Resolved Date</span>
                <span className={styles.detailValue}>{formatDateTime(ticket.resolvedDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Information */}
        {ticket.assignedTo && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Assignment</h4>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Assigned To</span>
                <span className={styles.detailValue}>{ticket.assignedTo}</span>
              </div>
            </div>
          </div>
        )}

        {/* Related Information */}
        {(ticket.relatedOrderId || ticket.relatedPaymentId) && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Related Information</h4>
            <div className={styles.detailGrid}>
              {ticket.relatedOrderId && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Related Order</span>
                  <span className={styles.detailValue}>{ticket.relatedOrderId}</span>
                </div>
              )}
              {ticket.relatedPaymentId && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Related Payment</span>
                  <span className={styles.detailValue}>{ticket.relatedPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resolution */}
        {ticket.resolution && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Resolution</h4>
            <div className={styles.resolutionContent}>
              <p className={styles.resolutionText}>{ticket.resolution}</p>
            </div>
          </div>
        )}

        {/* Customer Satisfaction */}
        {ticket.customerSatisfaction && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Customer Satisfaction</h4>
            <div className={styles.satisfactionContent}>
              <div className={styles.satisfactionRating}>
                <span className={styles.detailLabel}>Rating</span>
                <div className={styles.ratingDisplay}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`${styles.star} ${star <= ticket.customerSatisfaction! ? styles.filled : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className={styles.ratingValue}>({ticket.customerSatisfaction}/5)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Attachments</h4>
            <div className={styles.attachmentsList}>
              {ticket.attachments.map((attachment, index) => (
                <div key={index} className={styles.attachmentItem}>
                  <span className={styles.attachmentIcon}>📎</span>
                  <span className={styles.attachmentName}>{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        {ticket.internalNotes && ticket.internalNotes.length > 0 && (
          <div className={styles.detailSection}>
            <h4 className={styles.sectionTitle}>Internal Notes</h4>
            <div className={styles.notesList}>
              {ticket.internalNotes.map((note, index) => (
                <div key={index} className={styles.noteItem}>
                  <span className={styles.noteText}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </CustomerDetailsModal>
  );
};

export default SupportTicketModal;