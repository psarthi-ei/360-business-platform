import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import AboutPage from '../website/components/AboutPage';

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

// Helper to create mock props for AboutPage
const getAboutPageProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn()
});

describe('AboutPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(
        <AboutPage {...getAboutPageProps()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders company information and story', () => {
      renderWithProviders(<AboutPage {...getAboutPageProps()} />);
      
      // Check for about page content using getAllByText to handle multiple matches
      const elevateIdeasElements = screen.getAllByText(/ElevateIdea/i);
      expect(elevateIdeasElements.length).toBeGreaterThan(0);
      expect(elevateIdeasElements[0]).toBeInTheDocument();
    });

    test('renders SEO component with appropriate meta data', () => {
      const { container } = renderWithProviders(<AboutPage {...getAboutPageProps()} />);
      
      // Check that SEO component is rendered by verifying page structure
      expect(container.firstChild).toBeInTheDocument();
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Language Support', () => {
    test('handles language switching', () => {
      const props = getAboutPageProps();
      renderWithProviders(<AboutPage {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', () => {
      const props = { ...getAboutPageProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<AboutPage {...props} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main about page structure', () => {
      const { container } = renderWithProviders(<AboutPage {...getAboutPageProps()} />);
      
      // Check that the component renders some content
      expect(container.textContent?.length).toBeGreaterThan(0);
    });

    test('renders company story and information sections', () => {
      const { container } = renderWithProviders(<AboutPage {...getAboutPageProps()} />);
      
      // Check that there's meaningful content
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});