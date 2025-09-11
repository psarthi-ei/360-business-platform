import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import { useTranslation } from '../contexts/TranslationContext';

interface AuthenticationProps {
  onAuthSuccess: () => void;
  onGuestMode: () => void;
  onDemoMode: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function Authentication(props: AuthenticationProps) {
  // Extract props for Java-style clarity
  const onAuthSuccess = props.onAuthSuccess;
  const onGuestMode = props.onGuestMode;
  const onDemoMode = props.onDemoMode;
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  
  // State to track which form to show
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Handle switching to signup form
  function handleSwitchToSignup() {
    setAuthMode('signup');
  }

  // Handle switching to login form
  function handleSwitchToLogin() {
    setAuthMode('login');
  }

  // Handle successful authentication (login or signup)
  function handleAuthSuccess() {
    // Call parent's success handler
    onAuthSuccess();
  }

  // Render the appropriate authentication form
  if (authMode === 'signup') {
    return (
      <SignUp 
        onSwitchToLogin={handleSwitchToLogin}
        onSignUpSuccess={handleAuthSuccess}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
    );
  }

  return (
    <Login 
      onSwitchToSignup={handleSwitchToSignup}
      onLoginSuccess={handleAuthSuccess}
      onGuestMode={onGuestMode}
      onDemoMode={onDemoMode}
      currentLanguage={currentLanguage}
      onLanguageChange={onLanguageChange}
    />
  );
}

export default Authentication;