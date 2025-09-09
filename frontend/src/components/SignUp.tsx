import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css';
import CompactLanguageSelector from './CompactLanguageSelector';
import { TranslationStrings } from '../utils/translations';

interface SignUpProps {
  onSwitchToLogin: () => void;
  onSignUpSuccess: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  translations: TranslationStrings;
}

function SignUp(props: SignUpProps) {
  // Extract props for Java-style clarity
  const onSwitchToLogin = props.onSwitchToLogin;
  const onSignUpSuccess = props.onSignUpSuccess;
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const translations = props.translations;
  
  // Form state management
  const [formData, setFormData] = useState({
    ownerName: '',
    companyName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: 'textile',
    location: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Handle input field changes
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    
    setFormData(previousData => ({
      ...previousData,
      [fieldName]: fieldValue
    }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  // Handle form submission
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');

    // Validation
    if (!formData.email || !formData.password || !formData.ownerName || !formData.companyName) {
      setErrorMessage(translations.pleaseFillAllFields);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(translations.passwordsDontMatch);
      setIsLoading(false);
      return;
    }

    // For MVP: Simple demo registration
    // In production: This will call actual registration API
    setTimeout(() => {
      setIsLoading(false);
      // Store user data for demo purposes
      localStorage.setItem('userMode', 'registered');
      localStorage.setItem('userData', JSON.stringify({
        name: formData.ownerName,
        company: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        businessType: formData.businessType,
        location: formData.location,
        role: 'owner'
      }));
      onSignUpSuccess();
    }, 1500);
  }

  // Handle next step
  function handleNextStep() {
    // Validate first step
    if (!formData.ownerName || !formData.companyName || !formData.phone) {
      setErrorMessage(translations.pleaseFillRequiredFields);
      return;
    }
    
    setCurrentStep(2);
    setErrorMessage('');
  }

  // Handle previous step
  function handlePreviousStep() {
    setCurrentStep(1);
    setErrorMessage('');
  }

  return (
    <div className={styles.signUpContainer}>
      {/* Language Selector */}
      <div className={styles.languageSelector}>
        {onLanguageChange && (
          <CompactLanguageSelector 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        )}
      </div>

      {/* SignUp Card */}
      <div className={styles.signUpCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {translations.createAccount}
          </h1>
          <p className={styles.subtitle}>
            {translations.joinThousandsManufacturers}
          </p>
          
          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
              <span>1</span>
              <small>{translations.businessInfo}</small>
            </div>
            <div className={styles.stepLine}></div>
            <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
              <span>2</span>
              <small>{translations.accountSetup}</small>
            </div>
          </div>
        </div>

        {/* SignUp Form */}
        <form onSubmit={handleSubmit} className={styles.signUpForm}>
          {currentStep === 1 ? (
            <>
              {/* Step 1: Business Information */}
              <div className={styles.stepTitle}>
                {translations.tellUsAboutBusiness}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ownerName" className={styles.label}>
                  {translations.ownerName} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.ownerNamePlaceholder}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="companyName" className={styles.label}>
                  {translations.companyName} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.companyNamePlaceholder}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  {translations.phoneNumber} <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.phonePlaceholder}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="businessType" className={styles.label}>
                    {translations.businessType}
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="textile">{translations.textileManufacturing}</option>
                    <option value="garment">{translations.garmentManufacturing}</option>
                    <option value="trading">{translations.textileTrading}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location" className={styles.label}>
                    {translations.location}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder={translations.locationPlaceholder}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Account Setup */}
              <div className={styles.stepTitle}>
                {translations.setupYourAccount}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  {translations.email} <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.emailPlaceholder}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  {translations.password} <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.passwordPlaceholder}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  {translations.confirmPassword} <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder={translations.confirmPasswordPlaceholder}
                  required
                />
              </div>
            </>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          {/* Form Actions */}
          <div className={styles.formActions}>
            {currentStep === 2 && (
              <button
                type="button"
                className={styles.backButton}
                onClick={handlePreviousStep}
              >
                {translations.back}
              </button>
            )}
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading 
                ? translations.creatingAccount 
                : currentStep === 1 
                  ? translations.continue 
                  : translations.createAccount
              }
            </button>
          </div>
        </form>

        {/* Switch to Login */}
        <div className={styles.switchAuth}>
          <span className={styles.switchText}>
            {translations.alreadyHaveAccount}
          </span>
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToLogin}
          >
            {translations.signIn}
          </button>
        </div>

        {/* Business Context */}
        <div className={styles.businessContext}>
          <p className={styles.contextText}>
            {translations.trustedByManufacturers}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;