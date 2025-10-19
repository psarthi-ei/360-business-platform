import React, { useState } from 'react';
import { mockBusinessProfiles } from '../../data/customerMockData';
import { mockQuotes } from '../../data/salesMockData';
import styles from './ExternalProfileForm.module.css';

interface ExternalProfileFormProps {
  quoteId: string;
  companyName: string;
  linkId?: string;
  onSubmit: (profileData: BusinessProfileFormData) => void;
  onCancel?: () => void;
  onSuccess?: (businessProfileId: string) => void;
}

export interface BusinessProfileFormData {
  companyName: string;
  gstNumber: string;
  panNumber: string;
  registeredAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contactPerson: string;
  phone: string;
  email: string;
  businessType: string;
  establishedYear: string;
}

function ExternalProfileForm({ quoteId, companyName, linkId, onSubmit, onCancel, onSuccess }: ExternalProfileFormProps) {
  // const { t } = useTranslation(); // Will be used for internationalization
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfileFormData>({
    companyName: companyName || '',
    gstNumber: '',
    panNumber: '',
    registeredAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    contactPerson: '',
    phone: '',
    email: '',
    businessType: '',
    establishedYear: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Component-based workflow method for profile submission
  function handleProfileSubmission(profileData: BusinessProfileFormData) {
    setIsSubmitting(true);
    setSubmitMessage('Creating your business profile...');

    try {
      // Create new BusinessProfile from form data
      const newBusinessProfile = createBusinessProfileFromFormData(profileData, quoteId);
      mockBusinessProfiles.push(newBusinessProfile);

      // Update quote to link to new BusinessProfile
      const quote = mockQuotes.find(q => q.id === quoteId);
      if (quote) {
        quote.businessProfileId = newBusinessProfile.id;
        quote.statusMessage = 'Business profile completed - Ready for proforma invoice';
      }

      // Mark as successful
      setSubmitSuccess(true);
      setSubmitMessage('✅ Profile created successfully! Redirecting...');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(newBusinessProfile.id);
      }
      
      // Call original onSubmit for backward compatibility
      onSubmit(profileData);

      // Auto-redirect after success
      setTimeout(() => {
        setSubmitMessage('🎉 Welcome! Your business profile is ready. Our team will contact you soon.');
      }, 2000);

    } catch (error) {
      setSubmitMessage('❌ Error creating profile. Please try again.');
      setIsSubmitting(false);
    }
  }

  // Helper function to create BusinessProfile from form data (component-based)
  function createBusinessProfileFromFormData(formData: BusinessProfileFormData, originalQuoteId: string) {
    const newId = 'BP-' + Date.now();
    
    return {
      id: newId,
      companyName: formData.companyName,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      registeredAddress: formData.registeredAddress,
      deliveryAddresses: [formData.registeredAddress],
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      
      // Customer Status Evolution
      customerStatus: 'prospect' as const,
      becameCustomerDate: undefined,
      firstPaymentProjectId: undefined,
      originalLeadId: originalQuoteId,
      
      // Business Information
      businessType: formData.businessType || 'textile_manufacturer',
      specialization: 'Textile Manufacturing',
      employeeCount: '10-50',
      establishedYear: formData.establishedYear,
      
      // Business Metrics (initial values)
      totalOrders: 0,
      activeOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      
      // Credit & Payment Management (initial safe values)
      creditLimit: 500000,
      paymentScore: 70,
      creditStatus: 'good' as const,
      paymentBehavior: 'good' as const,
      
      // Preferences and Relationships
      preferences: {
        paymentMethod: 'Bank Transfer',
        deliveryPreference: 'Standard',
        qualityRequirements: 'Standard',
        communication: 'Phone + WhatsApp',
        specialNotes: `Created via profile completion for quote ${originalQuoteId}`
      },
      priority: 'warm' as const,
      fabricPreferences: ['Cotton', 'Synthetic Blends']
    };
  }

  function validateGSTNumber(gst: string): boolean {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  }

  function validatePANNumber(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  function validateStep1(): boolean {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST number is required';
    } else if (!validateGSTNumber(formData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST number format';
    }
    
    if (formData.panNumber && !validatePANNumber(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.registeredAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!formData.registeredAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.registeredAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.registeredAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.registeredAddress.pincode)) {
      newErrors.pincode = 'Invalid pincode format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep3(): boolean {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }
    
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleProfileSubmission(formData);
      }
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function updateFormData(field: string, value: string) {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as unknown as Record<string, unknown>)[parent] as Record<string, unknown>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }

  return (
    <div className={styles.externalFormContainer}>
      <div className={styles.formHeader}>
        <h1>🏢 Business Profile Completion</h1>
        <p>Complete your business profile for Quote: <strong>{quoteId}</strong></p>
        <div className={styles.progressBar}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>1</div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>2</div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>3</div>
        </div>
      </div>

      <div className={styles.formContent}>
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <h2>📋 Company Legal Details</h2>
            
            <div className={styles.fieldGroup}>
              <label>Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className={errors.companyName ? styles.error : ''}
                placeholder="Enter company name"
              />
              {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>GST Number *</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => updateFormData('gstNumber', e.target.value.toUpperCase())}
                className={errors.gstNumber ? styles.error : ''}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
              {errors.gstNumber && <span className={styles.errorText}>{errors.gstNumber}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>PAN Number (Optional)</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                className={errors.panNumber ? styles.error : ''}
                placeholder="AAAAA0000A"
                maxLength={10}
              />
              {errors.panNumber && <span className={styles.errorText}>{errors.panNumber}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => updateFormData('businessType', e.target.value)}
              >
                <option value="">Select business type</option>
                <option value="textile_manufacturer">Textile Manufacturer</option>
                <option value="garment_manufacturer">Garment Manufacturer</option>
                <option value="fabric_trader">Fabric Trader</option>
                <option value="export_house">Export House</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Established Year</label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => updateFormData('establishedYear', e.target.value)}
                placeholder="2010"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <h2>📍 Registered Address</h2>
            
            <div className={styles.fieldGroup}>
              <label>Street Address *</label>
              <textarea
                value={formData.registeredAddress.street}
                onChange={(e) => updateFormData('registeredAddress.street', e.target.value)}
                className={errors.street ? styles.error : ''}
                placeholder="Enter complete street address"
                rows={3}
              />
              {errors.street && <span className={styles.errorText}>{errors.street}</span>}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label>City *</label>
                <input
                  type="text"
                  value={formData.registeredAddress.city}
                  onChange={(e) => updateFormData('registeredAddress.city', e.target.value)}
                  className={errors.city ? styles.error : ''}
                  placeholder="Surat"
                />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label>Pincode *</label>
                <input
                  type="text"
                  value={formData.registeredAddress.pincode}
                  onChange={(e) => updateFormData('registeredAddress.pincode', e.target.value)}
                  className={errors.pincode ? styles.error : ''}
                  placeholder="395007"
                  maxLength={6}
                />
                {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>State *</label>
              <select
                value={formData.registeredAddress.state}
                onChange={(e) => updateFormData('registeredAddress.state', e.target.value)}
                className={errors.state ? styles.error : ''}
              >
                <option value="">Select state</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Other">Other</option>
              </select>
              {errors.state && <span className={styles.errorText}>{errors.state}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Country</label>
              <input
                type="text"
                value={formData.registeredAddress.country}
                readOnly
                className={styles.readonly}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.stepContent}>
            <h2>👤 Contact Information</h2>
            
            <div className={styles.fieldGroup}>
              <label>Contact Person Name *</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => updateFormData('contactPerson', e.target.value)}
                className={errors.contactPerson ? styles.error : ''}
                placeholder="Enter contact person name"
              />
              {errors.contactPerson && <span className={styles.errorText}>{errors.contactPerson}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={errors.phone ? styles.error : ''}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={errors.email ? styles.error : ''}
                placeholder="contact@company.com"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.summaryBox}>
              <h3>📋 Review Your Information</h3>
              <p><strong>Company:</strong> {formData.companyName}</p>
              <p><strong>GST:</strong> {formData.gstNumber}</p>
              <p><strong>Address:</strong> {formData.registeredAddress.city}, {formData.registeredAddress.state}</p>
              <p><strong>Contact:</strong> {formData.contactPerson}</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        {currentStep > 1 && (
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back
          </button>
        )}
        
        {onCancel && (
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        
        <button 
          className={styles.nextBtn} 
          onClick={handleNext}
          disabled={isSubmitting || submitSuccess}
        >
          {isSubmitting ? '⏳ Creating Profile...' : 
           submitSuccess ? '✅ Success!' :
           (currentStep < 3 ? 'Next →' : '✅ Submit Profile')}
        </button>
      </div>

      {/* Submission Status Messages */}
      {submitMessage && (
        <div className={`${styles.submitMessage} ${
          submitSuccess ? styles.success : 
          isSubmitting ? styles.processing : styles.error
        }`}>
          {submitMessage}
        </div>
      )}

      <div className={styles.helpText}>
        <p>🔒 Your information is secure and will only be used for business purposes.</p>
        <p>📱 Need help? Call us at +91 98765 43210</p>
      </div>
    </div>
  );
}

export default ExternalProfileForm;