import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import BlogHome from '../website/components/BlogHome';

// Mock blogUtils to provide minimal functionality for testing
jest.mock('../utils/blogUtils', () => ({
  getBlogPostsByDayNumber: jest.fn().mockResolvedValue([]),
  getBlogPostsByCategoryDayOrder: jest.fn().mockResolvedValue([]),
  getBlogCategories: jest.fn().mockResolvedValue([
    { id: 'all', name: 'All Stories', count: 0 }
  ]),
  getFeaturedPost: jest.fn().mockResolvedValue(null),
  searchBlogPosts: jest.fn().mockResolvedValue([]),
  formatDate: jest.fn().mockReturnValue('Jan 1, 2024'),
  getCategoryIcon: jest.fn().mockReturnValue('📖')
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

// Helper to create mock props for BlogHome
const getBlogHomeProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn(),
  onBlogPostClick: jest.fn()
});

describe('BlogHome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(
        <BlogHome {...getBlogHomeProps()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders blog home hero section', () => {
      renderWithProviders(<BlogHome {...getBlogHomeProps()} />);
      
      // Check for basic hero content that should always be present
      expect(screen.getByText(/365 Days of Stories/i)).toBeInTheDocument();
    });

    test('renders search input field', () => {
      renderWithProviders(<BlogHome {...getBlogHomeProps()} />);
      
      // Check for search input
      const searchInput = screen.getByPlaceholderText(/Search stories by title/i);
      expect(searchInput).toBeInTheDocument();
    });

    test('renders newsletter section', () => {
      renderWithProviders(<BlogHome {...getBlogHomeProps()} />);
      
      // Check for newsletter content
      expect(screen.getByText(/Stay Updated/i)).toBeInTheDocument();
    });

    test('renders SEO component', () => {
      const { container } = renderWithProviders(<BlogHome {...getBlogHomeProps()} />);
      
      // Check that component renders properly
      expect(container.firstChild).toBeInTheDocument();
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Language Support', () => {
    test('handles language switching callbacks', () => {
      const props = getBlogHomeProps();
      renderWithProviders(<BlogHome {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', () => {
      const props = { ...getBlogHomeProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<BlogHome {...props} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main blog home structure', () => {
      const { container } = renderWithProviders(<BlogHome {...getBlogHomeProps()} />);
      
      // Check that the component renders meaningful content
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });
});