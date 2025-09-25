import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import Footer from '../website/components/Footer';

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

// Helper to create mock props for Footer
const getFooterProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn(),
  onAbout: jest.fn(),
  onContact: jest.fn()
});

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(<Footer {...getFooterProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders footer content and links', () => {
      renderWithProviders(<Footer {...getFooterProps()} />);
      
      // Check for footer content using getAllByText to handle multiple matches
      const elevateIdeasElements = screen.getAllByText(/ElevateIdea/i);
      expect(elevateIdeasElements.length).toBeGreaterThan(0);
      expect(elevateIdeasElements[0]).toBeInTheDocument();
    });

    test('renders footer structure', () => {
      const { container } = renderWithProviders(<Footer {...getFooterProps()} />);
      
      // Check that footer has content
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });
});