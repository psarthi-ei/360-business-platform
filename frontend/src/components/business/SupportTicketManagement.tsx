import React, { useMemo } from 'react';
import { mockSupportTickets, mockBusinessProfiles, SupportTicket } from '../../data/customerMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './SupportTicketManagement.module.css';

interface SupportTicketManagementProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
  onOpenTicketModal: (ticket?: SupportTicket) => void;
}

const SupportTicketManagement = ({ filterState, onFilterChange, onOpenTicketModal }: SupportTicketManagementProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter tickets based on current filter state
  const filteredTickets = useMemo(() => {
    if (filterState === 'all') return mockSupportTickets;
    return mockSupportTickets.filter(ticket => ticket.status === filterState);
  }, [filterState]);
  
  // Get customer name for display
  const getCustomerName = (businessProfileId: string) => {
    const customer = mockBusinessProfiles.find(bp => bp.id === businessProfileId);
    return customer?.companyName || 'Unknown Customer';
  };
  
  // Toggle ticket details
  const toggleDetails = (ticketId: string) => {
    toggleExpansion(ticketId, 'data-ticket-id');
  };
  
  // Handle ticket actions
  const handleTicketAction = (action: string, ticketId: string) => {
    if (action === 'update') {
      const ticket = mockSupportTickets.find(t => t.id === ticketId);
      if (ticket) {
        onOpenTicketModal(ticket); // Edit mode
      }
    } else {
      alert(`${action} action for ticket ${ticketId} - Mock functionality`);
    }
  };
  
  // Get status info for display
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { icon: '🔴', label: 'Open' };
      case 'in_progress':
        return { icon: '🟡', label: 'In Progress' };
      case 'resolved':
        return { icon: '✅', label: 'Resolved' };
      case 'closed':
        return { icon: '⚫', label: 'Closed' };
      default:
        return { icon: '🎫', label: 'Unknown' };
    }
  };
  
  // Get priority info for display
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { icon: '🔥', label: 'Urgent' };
      case 'high':
        return { icon: '⚡', label: 'High' };
      case 'medium':
        return { icon: '📋', label: 'Medium' };
      case 'low':
        return { icon: '📝', label: 'Low' };
      default:
        return { icon: '📋', label: 'Medium' };
    }
  };
  
  // Get category info for display
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'quality_issue':
        return '🧵 Quality Issue';
      case 'delivery_delay':
        return '🚚 Delivery Delay';
      case 'payment_query':
        return '💰 Payment Query';
      case 'technical_support':
        return '🔧 Technical Support';
      case 'general_inquiry':
        return '❓ General Inquiry';
      case 'complaint':
        return '⚠️ Complaint';
      default:
        return '🎫 Support Request';
    }
  };
  
  // Status mapping for global DS card classes
  const getTicketStatusClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'ds-card-status-active';     // Green - completed
      case 'in_progress':
        return 'ds-card-status-pending';    // Amber - in progress
      case 'open':
        return 'ds-card-priority-high';     // Red - needs attention
      case 'closed':
        return 'ds-card-status-inactive';   // Gray - closed
      default:
        return 'ds-card-status-inactive';
    }
  };

  return (
    <div className={styles.supportTicketScreen}>
      <div className={styles.pageContent}>
        <div className={styles.ticketsContainer}>
          {filteredTickets.map(ticket => {
            const statusInfo = getStatusInfo(ticket.status);
            const priorityInfo = getPriorityInfo(ticket.priority);
            const categoryInfo = getCategoryInfo(ticket.category);
            const customerName = getCustomerName(ticket.businessProfileId);

            return (
              <div key={ticket.id} className="ds-card-container" data-ticket-id={ticket.id}>
                {/* Global DS Card with status mapping */}
                <div 
                  className={`ds-card ${getTicketStatusClass(ticket.status)} ${isExpanded(ticket.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(ticket.id)}
                >
                  {/* Global header class */}
                  <div className="ds-card-header" title={`${ticket.title} (Ticket ID: ${ticket.id})`}>
                    {ticket.id} — {ticket.title}
                  </div>
                  
                  {/* Global status class */}
                  <div className="ds-card-status">
                    <div className={styles.statusLine}>
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                    <div className={styles.statusLine}>
                      {priorityInfo.icon} {priorityInfo.label}
                    </div>
                  </div>
                  
                  {/* Global meta class */}
                  <div className="ds-card-meta" title={`${categoryInfo} • Customer: ${customerName}`}>
                    {categoryInfo}<br />
                    Customer: {customerName}
                    {ticket.assignedTo && ` • Assigned: ${ticket.assignedTo}`}
                  </div>

                  {/* Global expand indicator class */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(ticket.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Global expanded details class */}
                {isExpanded(ticket.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>🎫 Support Ticket Details</h4>
                      <p><strong>Description:</strong> {ticket.description}</p>
                      <p><strong>Created:</strong> {new Date(ticket.createdDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                      <p><strong>Last Updated:</strong> {new Date(ticket.updatedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                      {ticket.resolvedDate && (
                        <p><strong>Resolved:</strong> {new Date(ticket.resolvedDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}</p>
                      )}
                      {ticket.relatedOrderId && (
                        <p><strong>Related Order:</strong> {ticket.relatedOrderId}</p>
                      )}
                      {ticket.internalNotes && ticket.internalNotes.length > 0 && (
                        <div>
                          <strong>Internal Notes:</strong>
                          <ul className={styles.notesList}>
                            {ticket.internalNotes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Status-based action buttons */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {/* Always available actions */}
                        <button className="ds-btn ds-btn-primary" onClick={() => handleTicketAction('view-details', ticket.id)}>
                          👁️ View Details
                        </button>
                        <button className="ds-btn ds-btn-primary" onClick={() => handleTicketAction('call-customer', ticket.id)}>
                          📞 Call Customer
                        </button>
                        
                        {/* Status-specific actions */}
                        {ticket.status === 'open' && (
                          <>
                            <button className="ds-btn ds-btn-primary" onClick={() => handleTicketAction('assign', ticket.id)}>
                              👤 Assign
                            </button>
                            <button className="ds-btn ds-btn-secondary" onClick={() => handleTicketAction('update', ticket.id)}>
                              📝 Update
                            </button>
                          </>
                        )}
                        {ticket.status === 'in_progress' && (
                          <>
                            <button className="ds-btn ds-btn-primary" onClick={() => handleTicketAction('resolve', ticket.id)}>
                              ✅ Resolve
                            </button>
                            <button className="ds-btn ds-btn-secondary" onClick={() => handleTicketAction('update', ticket.id)}>
                              📝 Update
                            </button>
                          </>
                        )}
                        {ticket.status === 'resolved' && (
                          <button className="ds-btn ds-btn-secondary" onClick={() => handleTicketAction('reopen', ticket.id)}>
                            🔄 Reopen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketManagement;