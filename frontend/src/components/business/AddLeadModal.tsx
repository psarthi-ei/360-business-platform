import React, { useState, useEffect } from 'react';
import { Lead, FabricRequirements } from '../../data/mockData';
import styles from './AddLeadModal.module.css';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToCustomerDate'>) => void;
  editingLead?: Lead | null;
}

function AddLeadModal({ isOpen, onClose, onAddLead, editingLead }: AddLeadModalProps) {

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: '',
    business: '',
    inquiry: '',
    budget: '',
    timeline: '',
    priority: 'warm' as 'hot' | 'warm' | 'cold',
    notes: '',
    contact: '', // Combined phone/email field
    designation: '',
    department: '',
    // Fabric Requirements
    fabricRequirements: {
      fabricType: '',
      gsm: undefined,
      width: '',
      weaveType: '',
      quantity: undefined,
      unit: 'meters',
      colors: '',
      qualityGrade: undefined,
      specialProcessing: '',
      deliveryTimeline: ''
    } as FabricRequirements
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFabricRequirements, setShowFabricRequirements] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingLead) {
      setFormData({
        companyName: editingLead.companyName || '',
        contactPerson: editingLead.contactPerson || '',
        phone: editingLead.phone || '',
        email: editingLead.email || '',
        location: editingLead.location || '',
        business: editingLead.business || '',
        inquiry: editingLead.inquiry || '',
        budget: editingLead.budget || '',
        timeline: editingLead.timeline || '',
        priority: editingLead.priority || 'warm',
        notes: editingLead.notes || '',
        contact: editingLead.contact || '',
        designation: editingLead.designation || '',
        department: editingLead.department || '',
        fabricRequirements: editingLead.fabricRequirements || {
          fabricType: '',
          gsm: undefined,
          width: '',
          weaveType: '',
          quantity: undefined,
          unit: 'meters',
          colors: '',
          qualityGrade: undefined,
          specialProcessing: '',
          deliveryTimeline: ''
        } as FabricRequirements
      });
      
      // Auto-expand fabric requirements if editing and there are existing requirements
      const hasExistingRequirements = editingLead.fabricRequirements && (
        editingLead.fabricRequirements.fabricType ||
        editingLead.fabricRequirements.gsm ||
        editingLead.fabricRequirements.quantity
      );
      setShowFabricRequirements(!!hasExistingRequirements);
    } else {
      // Reset form for new lead
      setFormData({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        location: '',
        business: '',
        inquiry: '',
        budget: '',
        timeline: '',
        priority: 'warm',
        notes: '',
        contact: '',
        designation: '',
        department: '',
        fabricRequirements: {
          fabricType: '',
          gsm: undefined,
          width: '',
          weaveType: '',
          quantity: undefined,
          unit: 'meters',
          colors: '',
          qualityGrade: undefined,
          specialProcessing: '',
          deliveryTimeline: ''
        } as FabricRequirements
      });
      setShowFabricRequirements(false);
    }
  }, [editingLead]);

  // Gujarat textile cities for location dropdown
  const gujaratCities = [
    'Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 
    'Gandhinagar', 'Anand', 'Bharuch', 'Vapi', 'Other'
  ];

  // Textile business types
  const businessTypes = [
    'Cotton Textile Manufacturing', 'Silk Textile Manufacturing', 'Synthetic Textile Manufacturing',
    'Fabric Dyeing & Printing', 'Garment Manufacturing', 'Home Textile Manufacturing',
    'Technical Textiles', 'Yarn Manufacturing', 'Fabric Trading', 'Other'
  ];

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

  // Fabric specification options
  const fabricTypes = [
    'Cotton', 'Silk', 'Polyester', 'Cotton Blend', 'Silk Blend', 'Viscose', 
    'Linen', 'Georgette', 'Chiffon', 'Canvas', 'Denim', 'Other'
  ];

  const widthOptions = [
    '36 inches', '44 inches', '58 inches', '60 inches', '72 inches'
  ];

  const weaveTypes = [
    'Plain', 'Twill', 'Satin', 'Jacquard', 'Dobby', 'Herringbone', 'Other'
  ];

  const qualityGrades = [
    'A-Grade', 'B-Grade', 'Export-Grade', 'Industrial'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    // Handle fabric requirements fields
    if (field.startsWith('fabric.')) {
      const fabricField = field.replace('fabric.', '');
      setFormData(prev => ({
        ...prev,
        fabricRequirements: {
          ...prev.fabricRequirements,
          [fabricField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        // Auto-populate contact field with phone for compatibility
        contact: field === 'phone' ? String(value) : prev.contact
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
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
      businessProfileId: undefined, // Will be set when converted to customer
    };

    onAddLead(leadData);

    // Reset form and close modal
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      location: '',
      business: '',
      inquiry: '',
      budget: '',
      timeline: '',
      priority: 'warm',
      notes: '',
      contact: '',
      designation: '',
      department: '',
      fabricRequirements: {
        fabricType: '',
        gsm: undefined,
        width: '',
        weaveType: '',
        quantity: undefined,
        unit: 'meters',
        colors: '',
        qualityGrade: undefined,
        specialProcessing: '',
        deliveryTimeline: ''
      } as FabricRequirements
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} data-testid="modal-overlay" onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editingLead ? '✏️ Edit Lead' : '📋 Add New Lead'}</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Company Name *</label>
              <input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g., Surat Textiles Ltd."
                className={errors.companyName ? styles.errorInput : ''}
                autoFocus
              />
              {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactPerson">Contact Person *</label>
              <input
                id="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="e.g., Rajesh Patel"
                className={errors.contactPerson ? styles.errorInput : ''}
              />
              {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
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
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              >
                <option value="">Select City</option>
                {gujaratCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="business">Business Type</label>
              <select
                id="business"
                value={formData.business}
                onChange={(e) => handleInputChange('business', e.target.value)}
              >
                <option value="">Select Business Type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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

          {/* Fabric Requirements Section - UC-L04 */}
          <div className={styles.fabricRequirementsSection}>
            <div className={styles.sectionHeader} onClick={() => setShowFabricRequirements(!showFabricRequirements)}>
              <h3>🧵 Fabric Requirements (Optional)</h3>
              <span className={styles.toggleIcon}>{showFabricRequirements ? '▼' : '▶'}</span>
            </div>
            
            {showFabricRequirements && (
              <div className={styles.fabricFields}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fabricType">Fabric Type</label>
                    <select
                      id="fabricType"
                      value={formData.fabricRequirements.fabricType}
                      onChange={(e) => handleInputChange('fabric.fabricType', e.target.value)}
                    >
                      <option value="">Select Fabric Type</option>
                      {fabricTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="gsm">GSM (Weight)</label>
                    <input
                      id="gsm"
                      type="number"
                      value={formData.fabricRequirements.gsm || ''}
                      onChange={(e) => handleInputChange('fabric.gsm', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="e.g., 150"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="width">Fabric Width</label>
                    <select
                      id="width"
                      value={formData.fabricRequirements.width}
                      onChange={(e) => handleInputChange('fabric.width', e.target.value)}
                    >
                      <option value="">Select Width</option>
                      {widthOptions.map(width => (
                        <option key={width} value={width}>{width}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="weaveType">Weave Type</label>
                    <select
                      id="weaveType"
                      value={formData.fabricRequirements.weaveType}
                      onChange={(e) => handleInputChange('fabric.weaveType', e.target.value)}
                    >
                      <option value="">Select Weave</option>
                      {weaveTypes.map(weave => (
                        <option key={weave} value={weave}>{weave}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      value={formData.fabricRequirements.quantity || ''}
                      onChange={(e) => handleInputChange('fabric.quantity', e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="e.g., 5000"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="unit">Unit</label>
                    <select
                      id="unit"
                      value={formData.fabricRequirements.unit}
                      onChange={(e) => handleInputChange('fabric.unit', e.target.value)}
                    >
                      <option value="meters">Meters</option>
                      <option value="yards">Yards</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="colors">Colors</label>
                    <input
                      id="colors"
                      type="text"
                      value={formData.fabricRequirements.colors}
                      onChange={(e) => handleInputChange('fabric.colors', e.target.value)}
                      placeholder="e.g., Navy blue, White, Red"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="qualityGrade">Quality Grade</label>
                    <select
                      id="qualityGrade"
                      value={formData.fabricRequirements.qualityGrade || ''}
                      onChange={(e) => handleInputChange('fabric.qualityGrade', e.target.value)}
                    >
                      <option value="">Select Quality</option>
                      {qualityGrades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="specialProcessing">Special Processing</label>
                  <input
                    id="specialProcessing"
                    type="text"
                    value={formData.fabricRequirements.specialProcessing}
                    onChange={(e) => handleInputChange('fabric.specialProcessing', e.target.value)}
                    placeholder="e.g., Pre-shrunk, mercerized, dye-ready"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="deliveryTimeline">Fabric Delivery Timeline</label>
                  <input
                    id="deliveryTimeline"
                    type="text"
                    value={formData.fabricRequirements.deliveryTimeline}
                    onChange={(e) => handleInputChange('fabric.deliveryTimeline', e.target.value)}
                    placeholder="e.g., Within 30 days"
                  />
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
}

export default AddLeadModal;