import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';
import { TranslationProvider } from '../contexts/TranslationContext';

// Mock props
const mockProps = {
  onSwitchToSignup: jest.fn(),
  onLoginSuccess: jest.fn(),
  onGuestMode: jest.fn(),
  onDemoMode: jest.fn(),
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  translations: {
    welcomeBack: 'Welcome Back!',
    signInToContinue: 'Sign in to continue to your business management platform',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    tryAsGuest: 'Try as Guest',
    demoAccount: 'Demo Account Available',
    demoInstructions: 'Use demo credentials to explore all features',
    fillDemoCredentials: 'Fill Demo Credentials',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign Up',
    signingIn: 'Signing In...',
    textileManufacturers: 'Built for Gujarat textile manufacturers',
    pleaseEnterBothFields: 'Please enter both email and password',
    invalidCredentials: 'Invalid email or password',
    guestUser: 'Guest User',
    guestCompany: 'Demo Textiles Ltd.'
  } as any
};

// Helper function to render Login with TranslationProvider
const renderLogin = (props = mockProps) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <Login {...props} />
    </TranslationProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
  });

  describe('Component Rendering', () => {
    test('should render login form with all required elements', () => {
      renderLogin();
      
      // Check main elements are present
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try as guest/i })).toBeInTheDocument();
    });

    test('should render demo info banner', () => {
      renderLogin();
      
      expect(screen.getByText(/demo account available/i)).toBeInTheDocument();
      expect(screen.getByText(/use demo credentials/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fill demo credentials/i })).toBeInTheDocument();
    });

    test('should render switch to signup option', () => {
      renderLogin();
      
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('should render business context', () => {
      renderLogin();
      
      expect(screen.getByText(/built for gujarat textile manufacturers/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    test('should update email input value when typed', async () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      await userEvent.type(emailInput, 'test@example.com');
      
      expect(emailInput.value).toBe('test@example.com');
    });

    test('should update password input value when typed', async () => {
      renderLogin();
      
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      await userEvent.type(passwordInput, 'password123');
      
      expect(passwordInput.value).toBe('password123');
    });

    test('should clear error message when user starts typing', async () => {
      renderLogin();
      
      // First, trigger an error by submitting empty form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);
      
      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
      });
      
      // Now type in email field
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'test');
      
      // Error message should be cleared
      expect(screen.queryByText(/please enter both email and password/i)).not.toBeInTheDocument();
    });
  });

  describe('Demo Credentials Functionality', () => {
    test('should fill demo credentials when demo button clicked', async () => {
      
      renderLogin();
      
      const demoButton = screen.getByRole('button', { name: /fill demo credentials/i });
      await userEvent.click(demoButton);
      
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      expect(emailInput.value).toBe('demo@suratextiles.com');
      expect(passwordInput.value).toBe('demo123');
    });
  });

  describe('Form Validation', () => {
    test('should show error when submitting empty form', async () => {
      
      renderLogin();
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
      });
      
      // Should not call onLoginSuccess
      expect(mockProps.onLoginSuccess).not.toHaveBeenCalled();
    });

    test('should show error when submitting with only email', async () => {
      
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
      });
    });

    test('should show error when submitting with only password', async () => {
      
      renderLogin();
      
      const passwordInput = screen.getByLabelText(/password/i);
      await userEvent.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Logic', () => {
    test('should successfully login with demo credentials', async () => {
      
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'demo@suratextiles.com');
      await userEvent.type(passwordInput, 'demo123');
      await userEvent.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      
      // Wait for login success
      await waitFor(() => {
        expect(mockProps.onLoginSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });

    test('should show error with invalid credentials', async () => {
      
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Should not call onLoginSuccess
      expect(mockProps.onLoginSuccess).not.toHaveBeenCalled();
    });

    test('should disable submit button during loading', async () => {
      
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'demo@suratextiles.com');
      await userEvent.type(passwordInput, 'demo123');
      await userEvent.click(submitButton);
      
      // Button should be disabled during loading
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  describe('Guest Mode Functionality', () => {
    test('should login as guest when guest button clicked', async () => {
      
      renderLogin();
      
      const guestButton = screen.getByRole('button', { name: /try as guest/i });
      await userEvent.click(guestButton);
      
      // Wait for guest login to complete
      await waitFor(() => {
        expect(mockProps.onLoginSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });
      
      // Check localStorage was set correctly
      expect(localStorage.getItem('userMode')).toBe('guest');
      expect(localStorage.getItem('guestUser')).toBeTruthy();
      
      const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
      expect(guestUser.role).toBe('guest');
    });

    test('should disable guest button during loading', async () => {
      
      renderLogin();
      
      const guestButton = screen.getByRole('button', { name: /try as guest/i });
      await userEvent.click(guestButton);
      
      // Button should be disabled during guest login
      expect(guestButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    test('should call onSwitchToSignup when signup button clicked', async () => {
      
      renderLogin();
      
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(signupButton);
      
      expect(mockProps.onSwitchToSignup).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      renderLogin();
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('should have required attributes on inputs', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });

    test('should have proper input types', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});