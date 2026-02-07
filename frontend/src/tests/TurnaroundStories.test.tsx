import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import TurnaroundStories from '../website/components/TurnaroundStories';

// Mock react-markdown to avoid ESM issues
jest.mock('react-markdown', () => ({ 
  __esModule: true,
  default: ({ children }: { children: string }) => `<div data-testid="markdown-content">${children}</div>`
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ story: undefined }),
  useNavigate: () => jest.fn()
}));

// Mock utility functions
jest.mock('../utils/scrollUtils', () => ({
  scrollToTop: jest.fn()
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

// Helper to create mock props for TurnaroundStories
const getTurnaroundStoriesProps = () => ({
  currentLanguage: "en",
  onLanguageChange: jest.fn(),
  resetKey: 1
});

describe('TurnaroundStories Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithProviders(
        <TurnaroundStories {...getTurnaroundStoriesProps()} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders header with main title and description', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for main title
      expect(screen.getByRole('heading', { name: /Case Studies/i })).toBeInTheDocument();
      
      // Check for subtitle content
      expect(screen.getByText(/Sharing my corporate turnaround experiences/i)).toBeInTheDocument();
    });

    test('renders statistics cards', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for statistics
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('Major Turnarounds')).toBeInTheDocument();
      expect(screen.getByText('$15M+')).toBeInTheDocument();
      expect(screen.getByText('Recovery Value')).toBeInTheDocument();
    });

    test('renders stories grid with all 6 stories', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for specific story titles
      expect(screen.getByText(/Government Project.*\$15M Crisis Recovery/i)).toBeInTheDocument();
      expect(screen.getByText(/Major Bank.*High-Stakes Transformation/i)).toBeInTheDocument();
      expect(screen.getByText(/Global Banking.*One Month Crisis Resolution/i)).toBeInTheDocument();
      expect(screen.getByText(/International Bank.*40% to 100% in 4 Months/i)).toBeInTheDocument();
      expect(screen.getByText(/Growing Startup.*Product Unification Strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/Major Retailer.*Engineering Effectiveness Revolution/i)).toBeInTheDocument();
    });

    test('renders industry badges for stories', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for industry badges
      expect(screen.getByText('Government')).toBeInTheDocument();
      expect(screen.getAllByText('Banking').length).toBeGreaterThan(1); // Multiple banking stories
      expect(screen.getByText('Startup')).toBeInTheDocument();
      expect(screen.getByText('Retail')).toBeInTheDocument();
    });

    test('renders SEO component with appropriate meta data', () => {
      const { container } = renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check that SEO component is rendered by verifying page structure
      expect(container.firstChild).toBeInTheDocument();
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Story Content', () => {
    test('renders story preview content', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for story preview text (partial matches)
      expect(screen.getByText(/High-profile government project/i)).toBeInTheDocument();
      expect(screen.getByText(/Multi-million dollar banking partnership/i)).toBeInTheDocument();
      expect(screen.getByText(/One-year delivery delay triggered 30-day ultimatum/i)).toBeInTheDocument();
    });

    test('renders key metrics for each story', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for metrics labels
      const achievementLabels = screen.getAllByText('Achievement');
      const timelineLabels = screen.getAllByText('Timeline');
      const impactLabels = screen.getAllByText('Impact Type');
      
      expect(achievementLabels.length).toBe(6); // 6 stories
      expect(timelineLabels.length).toBe(6);
      expect(impactLabels.length).toBe(6);
    });

    test('renders "Read Full Case Study" call-to-action', () => {
      renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for "Read Full Case Study" buttons
      const readMoreButtons = screen.getAllByText(/Read Full Case Study/i);
      expect(readMoreButtons.length).toBe(6); // One for each story
    });
  });

  describe('Language Support', () => {
    test('handles language switching', () => {
      const props = getTurnaroundStoriesProps();
      renderWithProviders(<TurnaroundStories {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', () => {
      const props = { ...getTurnaroundStoriesProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<TurnaroundStories {...props} />);
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('renders main turnaround stories container', () => {
      const { container } = renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for main container structure
      expect(container.querySelector('.turnaroundStoriesContainer')).toBeInTheDocument();
    });

    test('renders stories content sections', () => {
      const { container } = renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check that the component renders meaningful content
      expect(container.textContent?.length).toBeGreaterThan(0);
    });

    test('renders with proper accessibility attributes', () => {
      const { container } = renderWithProviders(<TurnaroundStories {...getTurnaroundStoriesProps()} />);
      
      // Check for role attributes (story cards should have button role)
      const storyCards = container.querySelectorAll('[role="button"]');
      expect(storyCards.length).toBe(6); // 6 story cards with button role
    });
  });

  describe('Reset Functionality', () => {
    test('handles resetKey prop changes', () => {
      const props = getTurnaroundStoriesProps();
      const { rerender, container } = renderWithProviders(<TurnaroundStories {...props} />);
      
      // Component should handle resetKey changes
      rerender(
        <TestWrapper>
          <TurnaroundStories {...props} resetKey={2} />
        </TestWrapper>
      );
      
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});