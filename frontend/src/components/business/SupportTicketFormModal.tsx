import React, { useState, useEffect } from 'react';
import { mockBusinessProfiles, type SupportTicket } from '../../data/customerMockData';
import ModalPortal from '../ui/ModalPortal';
import styles from './SupportTicketFormModal.module.css';

interface SupportTicketForm {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'quality_issue' | 'delivery_delay' | 'payment_query' | 'technical_support' | 'general_inquiry' | 'complaint';
  businessProfileId: string;
  assignedTo: string;
}

interface SupportTicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: SupportTicketForm) => void;
  editingTicket?: SupportTicket | null;
}

const SupportTicketFormModal = ({ isOpen, onClose, onSubmit, editingTicket }: SupportTicketFormModalProps) => {
  const [formData, setFormData] = useState<SupportTicketForm>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general_inquiry',
    businessProfileId: '',
    assignedTo: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SupportTicketForm, string>>>({});

  // Reset form when modal opens/closes or when editing ticket changes
  useEffect(() => {
    if (isOpen) {
      if (editingTicket) {
        // Populate form with existing ticket data for editing
        setFormData({
          title: editingTicket.title,
          description: editingTicket.description,
          priority: editingTicket.priority,
          category: editingTicket.category,
          businessProfileId: editingTicket.businessProfileId,
          assignedTo: editingTicket.assignedTo || ''
        });
      } else {
        // Reset form for new ticket
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          category: 'general_inquiry',
          businessProfileId: '',
          assignedTo: ''
        });
      }
      setFormErrors({});
    }
  }, [isOpen, editingTicket]);

  // Handle form field changes
  const handleInputChange = (field: keyof SupportTicketForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SupportTicketForm, string>> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.businessProfileId) {
      errors.businessProfileId = 'Customer selection is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general_inquiry',
      businessProfileId: '',
      assignedTo: ''
    });
    setFormErrors({});
    onClose();
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'quality_issue':
        return '🧵 Quality Issue';
      case 'delivery_delay':
        return '🚛 Delivery Delay';
      case 'payment_query':
        return '💰 Payment Query';
      case 'technical_support':
        return '🔧 Technical Support';
      case 'general_inquiry':
        return '❓ General Inquiry';
      case 'complaint':
        return '⚠️ Complaint';
      default:
        return category;
    }
  };

  // Get priority display name
  const getPriorityDisplayName = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔥 Urgent';
      case 'high':
        return '⚡ High';
      case 'medium':
        return '📋 Medium';
      case 'low':
        return '📝 Low';
      default:
        return priority;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {editingTicket ? '✏️ Edit Support Ticket' : '🎧 Create New Support Ticket'}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formBody}>
            {/* Ticket Title */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Ticket Title *
              </label>
              <input
                type="text"
                className={`${styles.formInput} ${formErrors.title ? styles.formInputError : ''}`}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue..."
                maxLength={100}
              />
              {formErrors.title && (
                <span className={styles.errorMessage}>{formErrors.title}</span>
              )}
            </div>

            {/* Customer Selection */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Customer *
              </label>
              <select
                className={`${styles.formSelect} ${formErrors.businessProfileId ? styles.formInputError : ''}`}
                value={formData.businessProfileId}
                onChange={(e) => handleInputChange('businessProfileId', e.target.value)}
              >
                <option value="">Select a customer...</option>
                {mockBusinessProfiles.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
              {formErrors.businessProfileId && (
                <span className={styles.errorMessage}>{formErrors.businessProfileId}</span>
              )}
            </div>

            {/* Priority and Category Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Priority
                </label>
                <select
                  className={styles.formSelect}
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as SupportTicketForm['priority'])}
                >
                  <option value="low">{getPriorityDisplayName('low')}</option>
                  <option value="medium">{getPriorityDisplayName('medium')}</option>
                  <option value="high">{getPriorityDisplayName('high')}</option>
                  <option value="urgent">{getPriorityDisplayName('urgent')}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Category
                </label>
                <select
                  className={styles.formSelect}
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as SupportTicketForm['category'])}
                >
                  <option value="general_inquiry">{getCategoryDisplayName('general_inquiry')}</option>
                  <option value="quality_issue">{getCategoryDisplayName('quality_issue')}</option>
                  <option value="delivery_delay">{getCategoryDisplayName('delivery_delay')}</option>
                  <option value="payment_query">{getCategoryDisplayName('payment_query')}</option>
                  <option value="technical_support">{getCategoryDisplayName('technical_support')}</option>
                  <option value="complaint">{getCategoryDisplayName('complaint')}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Description *
              </label>
              <textarea
                className={`${styles.formTextarea} ${formErrors.description ? styles.formInputError : ''}`}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the issue, including any relevant order numbers, dates, or specific problems encountered..."
                rows={4}
                maxLength={1000}
              />
              {formErrors.description && (
                <span className={styles.errorMessage}>{formErrors.description}</span>
              )}
              <div className={styles.characterCount}>
                {formData.description.length}/1000 characters
              </div>
            </div>

            {/* Assignment */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Assign To (Optional)
              </label>
              <input
                type="text"
                className={styles.formInput}
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Team member or department (e.g., Quality Control Team, Sales Manager)"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className="ds-btn ds-btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ds-btn ds-btn-primary"
            >
              {editingTicket ? '💾 Update Ticket' : '🎧 Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default SupportTicketFormModal;