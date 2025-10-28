import React, { useState } from 'react';
import { mockBusinessProfiles, mockSupportTickets, type SupportTicket } from '../../data/customerMockData';
import SupportTicketModal from './SupportTicketModal';
import styles from './CustomerSupportTab.module.css';

interface CustomerSupportTabProps {
  customerId: string;
}

const CustomerSupportTab = ({ customerId }: CustomerSupportTabProps) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customer = mockBusinessProfiles.find(bp => bp.id === customerId);
  const customerTickets = mockSupportTickets.filter(ticket => ticket.businessProfileId === customerId);

  // Modal handlers
  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };


  if (!customer) {
    return (
      <div className={styles.supportTabContainer}>
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
    <div className={styles.supportTabContainer}>
      <div className={styles.supportContent}>
        

        {/* Support Tickets */}
        <div className={styles.ticketsSection}>
          
          {customerTickets.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <span className={styles.emptyIcon}>🎧</span>
                <h3 className={styles.emptyTitle}>No support tickets</h3>
                <p className={styles.emptyDescription}>
                  No support tickets found for this customer.
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.ticketsList}>
              {customerTickets.map((ticket) => (
                <div key={ticket.id} className="ds-card-container">
                  <div className="ds-card">
                    
                    {/* Header - Ticket Title & ID */}
                    <div className="ds-card-header">
                      <span>{ticket.id} — {ticket.title}</span>
                    </div>
                    
                    {/* Status - Priority & Status */}
                    <div className="ds-card-status">
                      <div className={styles.statusLine}>
                        🔥 {ticket.priority.toUpperCase()}
                      </div>
                      <div className={styles.statusLine}>
                        📋 {ticket.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Meta - Category & Created Date */}
                    <div className="ds-card-meta">
                      {ticket.category.replace('_', ' ').toUpperCase()}<br />
                      Created: {new Date(ticket.createdDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {ticket.assignedTo && ` • Assigned: ${ticket.assignedTo}`}
                    </div>

                    {/* Action - View Details Button */}
                    <div className="ds-card-actions">
                      <button 
                        className="ds-btn ds-btn-sm ds-btn-secondary"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View Details
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* Support Ticket Modal */}
      <SupportTicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default CustomerSupportTab;