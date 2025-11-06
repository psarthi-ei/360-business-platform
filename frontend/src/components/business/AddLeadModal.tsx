import React, { useState, useEffect } from 'react';
import { Lead, LeadRequestedItem, DeliveryRequirements } from '../../data/salesMockData';
import ModalPortal from '../ui/ModalPortal';
import CatalogItemSelector from './CatalogItemSelector';
import RequestedItemCard from './RequestedItemCard';
import styles from './AddLeadModal.module.css';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToOrderDate'>) => void;
  editingLead?: Lead | null;
}

function AddLeadModal({ isOpen, onClose, onAddLead, editingLead }: AddLeadModalProps) {

  const [formData, setFormData] = useState({
    contactPerson: '',
    phone: '',
    email: '',
    inquiry: '',
    budget: '',
    timeline: '',
    priority: 'warm' as 'hot' | 'warm' | 'cold',
    notes: '',
    contact: '', // Combined phone/email field
    designation: '',
    department: '',
    businessProfileId: '',
    // Catalog-driven lead management
    leadType: 'sales' as 'sales' | 'job_work',
    requestedItems: [] as LeadRequestedItem[],
    priorityLevel: 'must_have' as 'must_have' | 'preferred' | 'nice_to_have',
    deliveryRequirements: {
      preferredDate: '',
      isDateFlexible: true,
      deliveryLocation: '',
      qualityInspectionRequired: false,
      specialHandling: []
    } as DeliveryRequirements
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingLead) {
      setFormData({
        contactPerson: editingLead.contactPerson || '',
        phone: editingLead.phone || '',
        email: editingLead.email || '',
        inquiry: editingLead.inquiry || '',
        budget: editingLead.budget || '',
        timeline: editingLead.timeline || '',
        priority: editingLead.priority || 'warm',
        notes: editingLead.notes || '',
        contact: editingLead.contact || '',
        designation: editingLead.designation || '',
        department: editingLead.department || '',
        businessProfileId: editingLead.businessProfileId || '',
        leadType: editingLead.leadType || 'sales',
        requestedItems: editingLead.requestedItems || [],
        priorityLevel: editingLead.priorityLevel || 'must_have',
        deliveryRequirements: editingLead.deliveryRequirements || {
          preferredDate: '',
          isDateFlexible: true,
          deliveryLocation: '',
          qualityInspectionRequired: false,
          specialHandling: []
        }
      });
    } else {
      // Reset form for new lead
      setFormData({
        contactPerson: '',
        phone: '',
        email: '',
        inquiry: '',
        budget: '',
        timeline: '',
        priority: 'warm',
        notes: '',
        contact: '',
        designation: '',
        department: '',
        businessProfileId: '',
        leadType: 'sales',
        requestedItems: [],
        priorityLevel: 'must_have',
        deliveryRequirements: {
          preferredDate: '',
          isDateFlexible: true,
          deliveryLocation: '',
          qualityInspectionRequired: false,
          specialHandling: []
        }
      });
    }
  }, [editingLead]);


  // Company options are now handled in the dropdown

  // Budget ranges for textile orders
  const budgetRanges = [
    'Under ₹1 Lakh', '₹1-5 Lakh', '₹5-10 Lakh', '₹10-25 Lakh', 
    '₹25-50 Lakh', '₹50 Lakh - 1 Crore', 'Above ₹1 Crore', 'To be discussed'
  ];

  // Timeline options
  const timelineOptions = [
    'Immediate (Within 1 week)', 'Urgent (2-4 weeks)', 'Standard (1-2 months)', 
    'Planned (2-3 months)', 'Future (3-6 months)', 'Long-term (6+ months)'
  ];


  const handleLeadTypeChange = (leadType: 'sales' | 'job_work') => {
    handleInputChange('leadType', leadType);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-populate contact field with phone for compatibility
      contact: field === 'phone' ? String(value) : prev.contact
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle adding items from catalog
  const handleAddItem = (newItem: LeadRequestedItem) => {
    setFormData(prev => ({
      ...prev,
      requestedItems: [...prev.requestedItems, newItem]
    }));
  };

  // Handle removing items
  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requestedItems: prev.requestedItems.filter((_, i) => i !== index)
    }));
  };

  // Get already selected item IDs to avoid duplicates
  const getSelectedItemIds = () => {
    return formData.requestedItems.map(item => item.masterItemId);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.businessProfileId.trim()) {
      newErrors.businessProfileId = 'Company selection is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.inquiry.trim()) {
      newErrors.inquiry = 'Inquiry details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Prepare lead data
    const leadData = {
      ...formData,
      contact: formData.phone, // Use phone as primary contact
      businessProfileId: formData.businessProfileId || 'bp-new-prospect', // Default for new prospects
    };

    onAddLead(leadData);

    // Reset form and close modal
    setFormData({
      contactPerson: '',
      phone: '',
      email: '',
      inquiry: '',
      budget: '',
      timeline: '',
      priority: 'warm',
      notes: '',
      contact: '',
      designation: '',
      department: '',
      businessProfileId: '',
      leadType: 'sales',
      requestedItems: [],
      priorityLevel: 'must_have',
      deliveryRequirements: {
        preferredDate: '',
        isDateFlexible: true,
        deliveryLocation: '',
        qualityInspectionRequired: false,
        specialHandling: []
      }
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
      <div className={styles.modalContent} data-testid="modal-overlay" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editingLead ? '✏️ Edit Lead' : '📋 Add New Lead'}</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Lead Type Selection - First Thing in Modal */}
          <div className={styles.formGroup}>
            <label className={styles.leadTypeLabel}>Lead Type *</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="leadType"
                  value="sales"
                  checked={formData.leadType === 'sales'}
                  onChange={() => handleLeadTypeChange('sales')}
                />
                <span>Sales Order</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="leadType"
                  value="job_work"
                  checked={formData.leadType === 'job_work'}
                  onChange={() => handleLeadTypeChange('job_work')}
                />
                <span>Job Work</span>
              </label>
            </div>
          </div>

          {/* Spacing div for better visual separation */}
          <div style={{ marginBottom: 'var(--ds-space-lg)' }}></div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="contactPerson">Contact Person *</label>
              <input
                id="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="e.g., Rajesh Patel"
                className={errors.contactPerson ? styles.errorInput : ''}
                autoFocus
              />
              {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="businessProfileId">Company *</label>
              <select
                id="businessProfileId"
                value={formData.businessProfileId}
                onChange={(e) => handleInputChange('businessProfileId', e.target.value)}
                className={errors.businessProfileId ? styles.errorInput : ''}
              >
                <option value="">Select Existing Company or Create New</option>
                <option value="bp-new-prospect">Create New Company Profile</option>
                <option value="bp-mumbai-cotton-mills">Mumbai Cotton Mills</option>
                <option value="bp-surat-fashion-house">Surat Fashion House</option>
                <option value="bp-baroda-textiles">Baroda Textiles Co</option>
                <option value="bp-rajesh-textiles">Rajesh Textiles</option>
                <option value="bp-gujarat-garments">Gujarat Garments</option>
                <option value="bp-baroda-fashion">Baroda Fashion House</option>
              </select>
              {errors.businessProfileId && <span className={styles.errorText}>{errors.businessProfileId}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className={errors.phone ? styles.errorInput : ''}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="e.g., Purchase Manager, Production Head"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Procurement, Production"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="budget">Budget Range</label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="">Select Budget Range</option>
                {budgetRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeline">Timeline</label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              >
                <option value="">Select Timeline</option>
                {timelineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority Level</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as 'hot' | 'warm' | 'cold')}
              >
                <option value="hot">🔥 Hot - Urgent Order</option>
                <option value="warm">🔶 Warm - Planning Stage</option>
                <option value="cold">🔵 Cold - Initial Inquiry</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="inquiry">Inquiry Details *</label>
            <textarea
              id="inquiry"
              value={formData.inquiry}
              onChange={(e) => handleInputChange('inquiry', e.target.value)}
              placeholder="e.g., Need 500 meters cotton fabric, 150 GSM, plain weave for garment manufacturing..."
              rows={3}
              className={errors.inquiry ? styles.errorInput : ''}
            />
            {errors.inquiry && <span className={styles.errorText}>{errors.inquiry}</span>}
          </div>

          {/* Requested Items Section */}
          <div className={styles.formGroup}>
            <label className={styles.itemsSectionLabel}>
              Requested Items {formData.requestedItems.length > 0 && `(${formData.requestedItems.length})`}
            </label>
            <div className={styles.itemsSection}>
              {formData.requestedItems.length === 0 ? (
                <div className={styles.emptyItemsState}>
                  <p>No items added yet. Add items from our catalog to help generate accurate quotes.</p>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {formData.requestedItems.map((item, index) => (
                    <RequestedItemCard
                      key={index}
                      item={item}
                      businessModel={formData.leadType}
                      onRemove={() => handleRemoveItem(index)}
                      showActions={true}
                      index={index}
                    />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowItemSelector(true)}
                className={styles.addItemButton}
              >
                📦 Add Item from Catalog
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information or special requirements..."
              rows={2}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                (editingLead ? 'Updating Lead...' : 'Adding Lead...') : 
                (editingLead ? 'Update Lead' : 'Add Lead')
              }
            </button>
          </div>
        </form>

        {/* Catalog Item Selector Modal */}
        <CatalogItemSelector
          isOpen={showItemSelector}
          onClose={() => setShowItemSelector(false)}
          businessModel={formData.leadType}
          onItemSelected={handleAddItem}
          excludeItemIds={getSelectedItemIds()}
        />
      </div>
    </ModalPortal>
  );
}

export default AddLeadModal;