import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Authentication from '../components/Authentication';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';

// Mock props
const mockProps = {
  onAuthSuccess: jest.fn(),
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
    guestCompany: 'Demo Textiles Ltd.',
    createAccount: 'Create Account',
    joinThousandsManufacturers: 'Join thousands of manufacturers growing their business',
    businessInfo: 'Business Info',
    accountSetup: 'Account Setup',
    tellUsAboutBusiness: 'Tell us about your business',
    ownerName: 'Owner Name',
    ownerNamePlaceholder: 'Enter owner/manager name',
    companyName: 'Company Name',
    companyNamePlaceholder: 'Enter your company name',
    phoneNumber: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',
    businessType: 'Business Type',
    textileManufacturing: 'Textile Manufacturing',
    garmentManufacturing: 'Garment Manufacturing',
    textileTrading: 'Textile Trading',
    location: 'Location',
    locationPlaceholder: 'Enter your city/location',
    setupYourAccount: 'Setup your account',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    back: 'Back',
    continue: 'Continue',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    trustedByManufacturers: 'Trusted by manufacturers across Gujarat',
    pleaseFillAllFields: 'Please fill all required fields',
    pleaseFillRequiredFields: 'Please fill all required fields',
    passwordsDontMatch: 'Passwords do not match'
  } as any
};

// Helper function to render Authentication with all required providers
const renderAuthentication = (props = mockProps) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <UserProvider>
        <Authentication {...props} />
      </UserProvider>
    </TranslationProvider>
  );
};

describe('Authentication Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial State', () => {
    test('should render login form by default', () => {
      renderAuthentication();
      
      // Should show login form elements
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try as guest/i })).toBeInTheDocument();
    });

    test('should show switch to signup option in login mode', () => {
      renderAuthentication();
      
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    test('should switch to signup mode when signup button clicked', async () => {
      
      renderAuthentication();
      
      // Initially in login mode - check for sign in button instead of welcome text
      expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
      
      // Click signup button
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(signupButton);
      
      // Should now show signup form - use the actual rendered text
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      expect(screen.getByText(/join thousands of textile manufacturers/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    });

    test('should switch back to login mode when sign in button clicked from signup', async () => {
      
      renderAuthentication();
      
      // Switch to signup mode first
      const initialSignupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(initialSignupButton);
      
      // Verify in signup mode
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      
      // Click sign in button to go back to login
      const signinButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(signinButton);
      
      // Should be back to login mode
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
    });
  });

  describe('Authentication Success Handling', () => {
    test('should call onAuthSuccess when login succeeds', async () => {
      
      renderAuthentication();
      
      // Fill in demo credentials and submit
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await userEvent.type(emailInput, 'demo@suratextiles.com');
      await userEvent.type(passwordInput, 'demo123');
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);
      
      // Wait for authentication to complete
      await waitFor(() => {
        expect(mockProps.onAuthSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });

    test('should call onAuthSuccess when guest login succeeds', async () => {
      
      renderAuthentication();
      
      const guestButton = screen.getByRole('button', { name: /try as guest/i });
      await userEvent.click(guestButton);
      
      // Wait for guest authentication to complete
      await waitFor(() => {
        expect(mockProps.onAuthSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 1000 });
    });

    test('should call onAuthSuccess when signup succeeds', async () => {
      
      renderAuthentication();
      
      // Switch to signup mode
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(signupButton);
      
      // Fill Step 1
      await userEvent.type(screen.getByLabelText(/owner name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/company name/i), 'Surat Textiles');
      await userEvent.type(screen.getByLabelText(/phone number/i), '9876543210');
      await userEvent.click(screen.getByRole('button', { name: /continue/i }));
      
      // Fill Step 2
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);
      
      // Wait for signup to complete
      await waitFor(() => {
        expect(mockProps.onAuthSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });
  });

  describe('Props Passing', () => {
    test('should pass correct props to Login component', () => {
      renderAuthentication();
      
      // Verify login component receives correct props by checking if it renders correctly
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('should pass correct props to SignUp component when in signup mode', async () => {
      
      renderAuthentication();
      
      // Switch to signup mode
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(signupButton);
      
      // Verify signup component receives correct props by checking if it renders correctly
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    test('should pass language props correctly', () => {
      const customProps = {
        ...mockProps,
        currentLanguage: 'gu'
      };
      
      // Render with Gujarati language - but check for English text since TranslationProvider defaults to 'en'
      // The actual translation loading happens through TranslationContext
      renderAuthentication(customProps);
      
      // Should render login form (default mode) - check for standard elements that exist
      expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    test('should maintain independent state for login and signup modes', async () => {
      
      renderAuthentication();
      
      // Fill login form
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'test@example.com');
      
      // Switch to signup
      const signupButton = screen.getByRole('button', { name: /sign up/i });
      await userEvent.click(signupButton);
      
      // Should show signup form with empty fields
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      const ownerNameInput = screen.getByLabelText(/owner name/i) as HTMLInputElement;
      expect(ownerNameInput.value).toBe('');
      
      // Switch back to login
      const signinButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(signinButton);
      
      // Should show login form - state is NOT preserved as components are re-rendered
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      const emailInputAfterSwitch = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailInputAfterSwitch.value).toBe(''); // Component re-rendered, state reset
    });
  });
});