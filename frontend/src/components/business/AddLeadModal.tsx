import React, { useState, useEffect } from 'react';
import { Lead, FabricRequirements, ServiceRequirements } from '../../data/salesMockData';
import ModalPortal from '../ui/ModalPortal';
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
    // ✅ NEW: Lead type selection
    leadType: 'sales' as 'sales' | 'job_work',
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
    } as FabricRequirements,
    // ✅ NEW: Service Requirements for job work leads
    serviceRequirements: {
      serviceType: 'dyeing',
      materialType: '',
      quantity: 0,
      unit: 'meters',
      deliveryTimeline: '',
      customerSpecifications: {
        colors: [],
        finishType: [],
        printType: [],
        designComplexity: '',
        printQuality: '',
        specialRequirements: [],
        testingRequired: [],
        chemicalRequirements: []
      }
    } as ServiceRequirements
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFabricRequirements, setShowFabricRequirements] = useState(false);
  const [showServiceRequirements, setShowServiceRequirements] = useState(false);

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
        // ✅ NEW: Lead type (inferred from existing data or default to sales)
        leadType: 'sales' as 'sales' | 'job_work', // Can be enhanced to detect from existing data
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
        } as FabricRequirements,
        // ✅ NEW: Service requirements (empty for editing existing leads)
        serviceRequirements: {
          serviceType: 'dyeing',
          materialType: '',
          quantity: 0,
          unit: 'meters',
          deliveryTimeline: '',
          customerSpecifications: {
            colors: [],
            finishType: [],
            printType: [],
            designComplexity: '',
            printQuality: '',
            specialRequirements: [],
            testingRequired: [],
            chemicalRequirements: []
          }
        } as ServiceRequirements
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
        } as FabricRequirements,
        serviceRequirements: {
          serviceType: 'dyeing',
          materialType: '',
          quantity: 0,
          unit: 'meters',
          deliveryTimeline: '',
          customerSpecifications: {
            colors: [],
            finishType: [],
            printType: [],
            designComplexity: '',
            printQuality: '',
            specialRequirements: [],
            testingRequired: [],
            chemicalRequirements: []
          }
        } as ServiceRequirements
      });
      setShowFabricRequirements(false);
    }
  }, [editingLead]);

  // Keep requirements sections collapsed by default - user can expand if needed
  useEffect(() => {
    // Always keep both sections collapsed by default
    setShowServiceRequirements(false);
    setShowFabricRequirements(false);
  }, [formData.leadType]);

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

  const handleLeadTypeChange = (leadType: 'sales' | 'job_work') => {
    handleInputChange('leadType', leadType);
    // Keep sections collapsed by default - user can expand manually if needed
    setShowServiceRequirements(false);
    setShowFabricRequirements(false);
  };

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
      } as FabricRequirements,
      serviceRequirements: {
        serviceType: 'dyeing',
        materialType: '',
        quantity: 0,
        unit: 'meters',
        deliveryTimeline: '',
        customerSpecifications: {
          colors: [],
          finishType: [],
          printType: [],
          designComplexity: '',
          printQuality: '',
          specialRequirements: [],
          testingRequired: [],
          chemicalRequirements: []
        }
      } as ServiceRequirements
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

          {/* Fabric Requirements Section - Only for Sales Orders */}
          {formData.leadType === 'sales' && (
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
          )}

          {/* Service Requirements Section - Only for Job Work */}
          {formData.leadType === 'job_work' && (
            <div className={styles.fabricRequirementsSection}>
              <div className={styles.sectionHeader} onClick={() => setShowServiceRequirements(!showServiceRequirements)}>
                <h3>🔧 Service Requirements (Job Work)</h3>
                <span className={styles.toggleIcon}>{showServiceRequirements ? '▼' : '▶'}</span>
              </div>
              
              {showServiceRequirements && (
                <div className={styles.fabricFields}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="serviceType">Service Type</label>
                      <select
                        id="serviceType"
                        value={formData.serviceRequirements.serviceType}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceRequirements: {
                            ...prev.serviceRequirements,
                            serviceType: e.target.value as 'dyeing' | 'finishing' | 'printing' | 'weaving'
                          }
                        }))}
                      >
                        <option value="dyeing">🎨 Dyeing Services</option>
                        <option value="finishing">✨ Finishing Services</option>
                        <option value="printing">🖨️ Printing Services</option>
                        <option value="weaving">🧶 Weaving Services</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="materialType">Material Type</label>
                      <input
                        id="materialType"
                        type="text"
                        value={formData.serviceRequirements.materialType}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceRequirements: {
                            ...prev.serviceRequirements,
                            materialType: e.target.value
                          }
                        }))}
                        placeholder="e.g., Cotton Grey Fabric, Silk Yarn"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="serviceQuantity">Quantity</label>
                      <input
                        id="serviceQuantity"
                        type="number"
                        value={formData.serviceRequirements.quantity || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceRequirements: {
                            ...prev.serviceRequirements,
                            quantity: e.target.value ? parseInt(e.target.value) : 0
                          }
                        }))}
                        placeholder="1000"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="serviceUnit">Unit</label>
                      <select
                        id="serviceUnit"
                        value={formData.serviceRequirements.unit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          serviceRequirements: {
                            ...prev.serviceRequirements,
                            unit: e.target.value as 'meters' | 'yards'
                          }
                        }))}
                      >
                        <option value="meters">Meters</option>
                        <option value="yards">Yards</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="serviceDeliveryTimeline">Service Delivery Timeline</label>
                    <input
                      id="serviceDeliveryTimeline"
                      type="text"
                      value={formData.serviceRequirements.deliveryTimeline}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        serviceRequirements: {
                          ...prev.serviceRequirements,
                          deliveryTimeline: e.target.value
                        }
                      }))}
                      placeholder="e.g., Within 15 days of material receipt"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
    </ModalPortal>
  );
}

export default AddLeadModal;