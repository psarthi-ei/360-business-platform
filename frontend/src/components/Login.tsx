import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import CompactLanguageSelector from './CompactLanguageSelector';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
  onGuestMode: () => void;
  onDemoMode: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function Login(props: LoginProps) {
  // Extract props for Java-style clarity
  const onSwitchToSignup = props.onSwitchToSignup;
  const onLoginSuccess = props.onLoginSuccess;
  const onDemoMode = props.onDemoMode;
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const { t: translations } = useTranslation();
  const { login } = useUser();
  
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input field changes
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
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
    setIsLoading(true);
    setErrorMessage('');

    // Simple validation
    if (!formData.email || !formData.password) {
      setErrorMessage(translations('pleaseEnterBothFields'));
      setIsLoading(false);
      return;
    }

    // Use UserContext login function
    setTimeout(() => {
      const success = login(formData.email, formData.password);
      if (success) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setErrorMessage(translations('invalidCredentials'));
        setIsLoading(false);
      }
    }, 1000);
  }

  // Handle demo login button
  function handleDemoLogin() {
    setFormData({
      email: 'demo@suratextiles.com',
      password: 'demo123'
    });
  }


  return (
    <div className={styles.loginContainer}>
      {/* Language Selector */}
      <div className={styles.languageSelector}>
        {onLanguageChange && (
          <CompactLanguageSelector 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        )}
      </div>

      {/* Login Card */}
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {translations('welcomeBack')}
          </h1>
          <p className={styles.subtitle}>
            {translations('signInToContinue')}
          </p>
        </div>

        {/* Demo Info Banner */}
        <div className={styles.demoInfo}>
          <h3>{translations('demoAccount')}</h3>
          <p>{translations('demoInstructions')}</p>
          <button 
            type="button"
            className={styles.demoButton}
            onClick={handleDemoLogin}
          >
            {translations('fillDemoCredentials')}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              {translations('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder={translations('emailPlaceholder')}
              required
            />
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              {translations('password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder={translations('passwordPlaceholder')}
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? translations('signingIn') : translations('signIn')}
          </button>
        </form>

        {/* Guest Mode Button */}
        <button
          type="button"
          className={styles.guestButton}
          onClick={onDemoMode}
          disabled={isLoading}
        >
          {translations('tryAsGuest')} 🚀
        </button>

        {/* Switch to Signup */}
        <div className={styles.switchAuth}>
          <span className={styles.switchText}>
            {translations('dontHaveAccount')}
          </span>
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToSignup}
          >
            {translations('signUp')}
          </button>
        </div>

        {/* Business Context */}
        <div className={styles.businessContext}>
          <p className={styles.contextText}>
            {translations('textileManufacturers')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;