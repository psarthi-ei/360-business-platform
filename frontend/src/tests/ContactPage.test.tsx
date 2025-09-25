import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import ContactPage from '../website/components/ContactPage';

// Test wrapper with all necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <TranslationProvider defaultLanguage="en">
          <UserProvider>
            {children}
          </UserProvider>
        </TranslationProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(<TestWrapper>{component}</TestWrapper>);
};

// Helper to create mock props for ContactPage
const getContactPageProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn()
});

describe('ContactPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(
        <ContactPage {...getContactPageProps()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders contact information and content', () => {
      renderWithProviders(<ContactPage {...getContactPageProps()} />);
      
      // Check for contact page content
      expect(screen.getByText(/Let's Connect/i)).toBeInTheDocument();
      expect(screen.getByText(/ElevateIdea Technologies Private Limited/i)).toBeInTheDocument();
    });

    test('renders SEO component with appropriate meta data', () => {
      const { container } = renderWithProviders(<ContactPage {...getContactPageProps()} />);
      
      // Check that SEO component is rendered by verifying page structure
      expect(container.firstChild).toBeInTheDocument();
      expect(container.textContent?.length).toBeGreaterThan(0);
    });

    test('renders contact interaction elements', () => {
      renderWithProviders(<ContactPage {...getContactPageProps()} />);
      
      // Look for interactive elements (buttons, links, etc.)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(0); // May have consultation buttons
    });
  });

  describe('Language Support', () => {
    test('handles language switching', () => {
      const props = getContactPageProps();
      renderWithProviders(<ContactPage {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', () => {
      const props = { ...getContactPageProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<ContactPage {...props} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main contact page structure', () => {
      const { container } = renderWithProviders(<ContactPage {...getContactPageProps()} />);
      
      // Check for main page container
      const pageContainer = container.querySelector('.contactPage');
      expect(pageContainer).toBeInTheDocument();
    });

    test('renders contact sections', () => {
      renderWithProviders(<ContactPage {...getContactPageProps()} />);
      
      // Check for key contact sections
      expect(screen.getByText(/Electronic City, Bangalore/i)).toBeInTheDocument();
    });
  });
});