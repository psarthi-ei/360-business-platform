import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../components/SignUp';
import { TranslationProvider } from '../contexts/TranslationContext';

// Mock props
const mockProps = {
  onSwitchToLogin: jest.fn(),
  onSignUpSuccess: jest.fn(),
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  translations: {
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
    email: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    back: 'Back',
    continue: 'Continue',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    trustedByManufacturers: 'Trusted by manufacturers across Gujarat',
    pleaseFillAllFields: 'Please fill all required fields',
    pleaseFillRequiredFields: 'Please fill all required fields',
    passwordsDontMatch: 'Passwords do not match'
  } as any
};

// Helper function to render SignUp with TranslationProvider
const renderSignUp = (props = mockProps) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <SignUp {...props} />
    </TranslationProvider>
  );
};

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Component Rendering', () => {
    test('should render signup form with all required elements - Step 1', () => {
      renderSignUp();
      
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      expect(screen.getByText(/join thousands of textile manufacturers/i)).toBeInTheDocument();
      expect(screen.getByText(/tell us about your business/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    });

    test('should render step indicator', () => {
      renderSignUp();
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/business info/i)).toBeInTheDocument();
      expect(screen.getByText(/account setup/i)).toBeInTheDocument();
    });

    test('should render switch to login option', () => {
      renderSignUp();
      
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('should render business context', () => {
      renderSignUp();
      
      expect(screen.getByText(/trusted by textile manufacturers across gujarat/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling - Step 1', () => {
    test('should update owner name input value when typed', async () => {
      
      renderSignUp();
      
      const ownerNameInput = screen.getByLabelText(/owner name/i) as HTMLInputElement;
      await userEvent.type(ownerNameInput, 'John Doe');
      
      expect(ownerNameInput.value).toBe('John Doe');
    });

    test('should update company name input value when typed', async () => {
      
      renderSignUp();
      
      const companyNameInput = screen.getByLabelText(/company name/i) as HTMLInputElement;
      await userEvent.type(companyNameInput, 'Surat Textiles');
      
      expect(companyNameInput.value).toBe('Surat Textiles');
    });

    test('should update phone input value when typed', async () => {
      
      renderSignUp();
      
      const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
      await userEvent.type(phoneInput, '9876543210');
      
      expect(phoneInput.value).toBe('9876543210');
    });

    test('should update business type when selected', async () => {
      
      renderSignUp();
      
      const businessTypeSelect = screen.getByLabelText(/business type/i) as HTMLSelectElement;
      await userEvent.selectOptions(businessTypeSelect, 'garment');
      
      expect(businessTypeSelect.value).toBe('garment');
    });

    test('should update location input value when typed', async () => {
      
      renderSignUp();
      
      const locationInput = screen.getByLabelText(/location/i) as HTMLInputElement;
      await userEvent.type(locationInput, 'Surat');
      
      expect(locationInput.value).toBe('Surat');
    });
  });

  describe('Step Navigation', () => {
    test('should show error when trying to proceed from Step 1 without required fields', async () => {
      
      renderSignUp();
      
      const continueButton = screen.getByRole('button', { name: /continue/i });
      await userEvent.click(continueButton);
      
      expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
    });

    test('should proceed to Step 2 when Step 1 is filled correctly', async () => {
      
      renderSignUp();
      
      // Fill Step 1 required fields
      await userEvent.type(screen.getByLabelText(/owner name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/company name/i), 'Surat Textiles');
      await userEvent.type(screen.getByLabelText(/phone number/i), '9876543210');
      
      const continueButton = screen.getByRole('button', { name: /continue/i });
      await userEvent.click(continueButton);
      
      // Should now show Step 2
      expect(screen.getByText(/setup your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    test('should go back to Step 1 when back button is clicked', async () => {
      
      renderSignUp();
      
      // Fill Step 1 and proceed to Step 2
      await userEvent.type(screen.getByLabelText(/owner name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/company name/i), 'Surat Textiles');
      await userEvent.type(screen.getByLabelText(/phone number/i), '9876543210');
      await userEvent.click(screen.getByRole('button', { name: /continue/i }));
      
      // Now in Step 2, click back
      const backButton = screen.getByRole('button', { name: /back/i });
      await userEvent.click(backButton);
      
      // Should be back to Step 1
      expect(screen.getByText(/tell us about your business/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation - Step 2', () => {
    async function goToStep2() {
      await userEvent.type(screen.getByLabelText(/owner name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/company name/i), 'Surat Textiles');
      await userEvent.type(screen.getByLabelText(/phone number/i), '9876543210');
      await userEvent.click(screen.getByRole('button', { name: /continue/i }));
    }

    test('should show error when submitting Step 2 without required fields', async () => {
      
      renderSignUp();
      
      await goToStep2();
      
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);
      
      expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
    });

    test('should show error when passwords do not match', async () => {
      
      renderSignUp();
      
      await goToStep2();
      
      await userEvent.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'differentpassword');
      
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);
      
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });

    test('should successfully create account with valid data', async () => {
      
      renderSignUp();
      
      await goToStep2();
      
      await userEvent.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);
      
      // Should show loading state
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      
      // Wait for signup success
      await waitFor(() => {
        expect(mockProps.onSignUpSuccess).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
      
      // Check localStorage was set correctly
      expect(localStorage.getItem('userMode')).toBe('registered');
      expect(localStorage.getItem('userData')).toBeTruthy();
    });

    test('should disable form during account creation', async () => {
      
      renderSignUp();
      
      await goToStep2();
      
      await userEvent.type(screen.getByLabelText(/^email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      
      const createButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createButton);
      
      // Button should be disabled during loading
      expect(createButton).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    test('should call onSwitchToLogin when sign in button clicked', async () => {
      
      renderSignUp();
      
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await userEvent.click(signInButton);
      
      expect(mockProps.onSwitchToLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      renderSignUp();
      
      expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    });

    test('should have required attributes on required inputs', () => {
      renderSignUp();
      
      const ownerNameInput = screen.getByLabelText(/owner name/i);
      const companyNameInput = screen.getByLabelText(/company name/i);
      const phoneInput = screen.getByLabelText(/phone number/i);
      
      expect(ownerNameInput).toHaveAttribute('required');
      expect(companyNameInput).toHaveAttribute('required');
      expect(phoneInput).toHaveAttribute('required');
    });

    test('should have proper input types', () => {
      renderSignUp();
      
      const phoneInput = screen.getByLabelText(/phone number/i);
      expect(phoneInput).toHaveAttribute('type', 'tel');
    });
  });
});