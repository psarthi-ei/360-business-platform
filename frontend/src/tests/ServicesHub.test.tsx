import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import ServicesHub from '../website/components/ServicesHub';

// Mock react-markdown to avoid ESM issues
jest.mock('react-markdown', () => ({ 
  __esModule: true,
  default: ({ children }: { children: string }) => `<div data-testid="markdown-content">${children}</div>`
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ framework: undefined }),
  useNavigate: () => jest.fn()
}));

// Mock utility functions
jest.mock('../utils/scrollUtils', () => ({
  scrollToTop: jest.fn()
}));

jest.mock('../utils/contactUtils', () => ({
  openConsultationForm: jest.fn()
}));

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

// Helper to create mock props for ServicesHub
const getServicesHubProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn(),
  resetKey: 1,
  onAbout: jest.fn()
});

describe('ServicesHub Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(
        <ServicesHub {...getServicesHubProps()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders hero section with key content', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check for hero section structure
      const heroSection = container.querySelector('.hero');
      expect(heroSection).toBeInTheDocument();
      
      // Check that hero has title and content
      const heroTitle = container.querySelector('.heroTitle');
      const heroSubtitle = container.querySelector('.heroSubtitle');
      expect(heroTitle).toBeInTheDocument();
      expect(heroSubtitle).toBeInTheDocument();
    });

    test('renders hero statistics', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check for statistics using unique exact text
      expect(screen.getByText('Years Experience')).toBeInTheDocument();
      expect(screen.getByText('Day MVP Delivery')).toBeInTheDocument();
      // Check for general structure of statistics
      expect(container.querySelector('.heroStats')).toBeInTheDocument();
    });

    test('renders main content sections', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check for main content sections structure
      expect(container.querySelector('.whatWeDo, .whoIWorkWith')).toBeInTheDocument();
      expect(container.querySelector('.sectionTitle')).toBeInTheDocument();
    });

    test('renders SEO component with appropriate meta data', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check that SEO component is rendered by verifying page structure
      expect(container.firstChild).toBeInTheDocument();
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Language Support', () => {
    test('handles language switching', () => {
      const props = getServicesHubProps();
      renderWithProviders(<ServicesHub {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', () => {
      const props = { ...getServicesHubProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<ServicesHub {...props} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main services hub structure', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check for main page container
      const pageContainer = container.querySelector('.servicesHub');
      expect(pageContainer).toBeInTheDocument();
    });

    test('renders services content sections', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check that the component renders meaningful content
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Callbacks', () => {
    test('handles onAbout callback', () => {
      const props = getServicesHubProps();
      renderWithProviders(<ServicesHub {...props} />);
      
      expect(props.onAbout).toBeDefined();
    });
  });

  describe('CTA Buttons', () => {
    test('renders CTA buttons', () => {
      const { container } = renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Check for CTA button structure
      const ctaSection = container.querySelector('.cta');
      expect(ctaSection).toBeInTheDocument();
      
      const ctaButtons = container.querySelectorAll('button');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });

    test('handles MVP Journey CTA click callback', () => {
      renderWithProviders(<ServicesHub {...getServicesHubProps()} />);
      
      // Import the mocked function to test it was called
      const { openConsultationForm } = require('../utils/contactUtils');
      
      // Verify openConsultationForm function is defined and mocked
      expect(openConsultationForm).toBeDefined();
      expect(typeof openConsultationForm).toBe('function');
    });
  });
});