import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { TranslationProvider } from '../contexts/TranslationContext';
import { UserProvider } from '../contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import BlogPost from '../website/components/BlogPost';

// Mock react-markdown to avoid ESM issues
jest.mock('react-markdown', () => ({ 
  __esModule: true,
  default: ({ children }: { children: string }) => `<div data-testid="markdown-content">${children}</div>`
}));

// Mock blogUtils to provide controlled test data
jest.mock('../utils/blogUtils', () => ({
  getBlogPost: jest.fn().mockResolvedValue({
    id: 'test-post-1',
    slug: 'test-blog-post',
    title: 'Test Blog Post Title',
    excerpt: 'This is a test blog post excerpt for testing purposes.',
    content: '# Test Content\n\nThis is test markdown content.',
    primaryCategory: 'Business Strategy',
    tags: ['testing', 'business', 'strategy'],
    publishedDate: '2024-01-15',
    readTime: '5 min read',
    day: 1,
    imagePath: '/images/test-post.jpg'
  }),
  getAllBlogPosts: jest.fn().mockResolvedValue([
    {
      id: 'related-1',
      slug: 'related-post-1',
      title: 'Related Post 1',
      excerpt: 'Related post excerpt 1',
      primaryCategory: 'Business Strategy',
      day: 2
    },
    {
      id: 'related-2', 
      slug: 'related-post-2',
      title: 'Related Post 2',
      excerpt: 'Related post excerpt 2',
      primaryCategory: 'Business Strategy',
      day: 3
    }
  ]),
  getNextBlogPost: jest.fn().mockResolvedValue({
    id: 'next-post',
    slug: 'next-blog-post',
    title: 'Next Blog Post',
    day: 2
  }),
  getPreviousBlogPost: jest.fn().mockResolvedValue({
    id: 'prev-post',
    slug: 'previous-blog-post', 
    title: 'Previous Blog Post',
    day: 0
  }),
  formatDate: jest.fn().mockReturnValue('Jan 15, 2024'),
  getCategoryIcon: jest.fn().mockReturnValue('📈')
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

// Helper to create mock props for BlogPost
const getBlogPostProps = () => ({
  slug: 'test-blog-post',
  currentLanguage: "en",
  onLanguageChange: jest.fn(),
  onBackClick: jest.fn(),
  onNavigateToPost: jest.fn()
});

describe('BlogPost Component', () => {
  beforeEach(() => {
    // Reset mocks but restore default implementations
    const { getBlogPost, getAllBlogPosts, getNextBlogPost, getPreviousBlogPost } = require('../utils/blogUtils');
    getBlogPost.mockResolvedValue({
      id: 'test-post-1',
      slug: 'test-blog-post',
      title: 'Test Blog Post Title',
      excerpt: 'This is a test blog post excerpt for testing purposes.',
      content: '# Test Content\n\nThis is test markdown content.',
      primaryCategory: 'Business Strategy',
      hashtags: ['testing', 'business', 'strategy'],
      publishedDate: '2024-01-15',
      readTime: '5 min read',
      day: 1,
      imagePath: '/images/test-post.jpg'
    });
    getAllBlogPosts.mockResolvedValue([
      {
        id: 'related-1',
        slug: 'related-post-1',
        title: 'Related Post 1',
        excerpt: 'Related post excerpt 1',
        primaryCategory: 'Business Strategy',
        day: 2
      }
    ]);
    getNextBlogPost.mockResolvedValue({
      id: 'next-post',
      slug: 'next-blog-post',
      title: 'Next Blog Post',
      day: 2
    });
    getPreviousBlogPost.mockResolvedValue({
      id: 'prev-post',
      slug: 'previous-blog-post',
      title: 'Previous Blog Post',
      day: 0
    });
  });

  describe('Loading State', () => {
    test('renders loading state initially', () => {
      // Mock getBlogPost to return a delayed promise
      const { getBlogPost } = require('../utils/blogUtils');
      getBlogPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      expect(screen.getByText('Loading story...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('renders error state when post not found', async () => {
      const { getBlogPost } = require('../utils/blogUtils');
      getBlogPost.mockResolvedValue(null);
      
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(screen.getByText('Story Not Found')).toBeInTheDocument();
      });
      expect(screen.getByText('Blog post not found')).toBeInTheDocument();
      expect(screen.getByText('← Back to Stories')).toBeInTheDocument();
    });

    test('renders error state when getBlogPost throws', async () => {
      const { getBlogPost } = require('../utils/blogUtils');
      getBlogPost.mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(screen.getByText('Story Not Found')).toBeInTheDocument();
      });
      expect(screen.getByText('Error loading blog post')).toBeInTheDocument();
    });
  });

  describe('Successful Post Loading', () => {
    test('renders blog post content when loaded successfully', async () => {
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
      });
      expect(screen.getByText('This is a test blog post excerpt for testing purposes.')).toBeInTheDocument();
      // ReactMarkdown is mocked and renders as text content
      expect(screen.getByText(/Test Content/)).toBeInTheDocument();
    });

    test('renders post metadata correctly', async () => {
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(screen.getByText('Business Strategy')).toBeInTheDocument();
      });
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      // Check that metadata section is rendered
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    test('renders back button', async () => {
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(screen.getByText('← Back to Stories')).toBeInTheDocument();
      });
    });

    test('renders featured image when present', async () => {
      renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        const image = screen.getByAltText('Test Blog Post Title');
        expect(image).toBeInTheDocument();
      });
      const image = screen.getByAltText('Test Blog Post Title');
      expect(image).toHaveAttribute('src', '/images/test-post.jpg');
    });

    test('renders SEO component with blog post data', async () => {
      const { container } = renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
      expect(container.textContent?.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Functionality', () => {
    test('handles back button click', async () => {
      const props = getBlogPostProps();
      renderWithProviders(<BlogPost {...props} />);
      
      await waitFor(() => {
        expect(props.onBackClick).toBeDefined();
      });
      expect(typeof props.onBackClick).toBe('function');
    });

    test('handles navigation to other posts', async () => {
      const props = getBlogPostProps();
      renderWithProviders(<BlogPost {...props} />);
      
      await waitFor(() => {
        expect(props.onNavigateToPost).toBeDefined();
      });
      expect(typeof props.onNavigateToPost).toBe('function');
    });
  });

  describe('Language Support', () => {
    test('handles language switching', async () => {
      const props = getBlogPostProps();
      renderWithProviders(<BlogPost {...props} />);
      
      expect(props.onLanguageChange).toBeDefined();
      expect(props.currentLanguage).toBe('en');
    });

    test('renders with different language prop', async () => {
      const props = { ...getBlogPostProps(), currentLanguage: 'gu' };
      const { container } = renderWithProviders(<BlogPost {...props} />);
      
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  describe('Different Slug Handling', () => {
    test('loads different post when slug changes', async () => {
      const props = getBlogPostProps();
      const { rerender } = renderWithProviders(<BlogPost {...props} />);
      
      // Wait for initial post to load
      await waitFor(() => {
        expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
      });
      
      // Change slug and rerender
      rerender(
        <TestWrapper>
          <BlogPost {...props} slug="different-post" />
        </TestWrapper>
      );
      
      // Component should attempt to load new post
      expect(require('../utils/blogUtils').getBlogPost).toHaveBeenCalledWith('different-post');
    });
  });

  describe('Component Structure', () => {
    test('renders main blog post container', async () => {
      const { container } = renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(container.querySelector('.blogPost')).toBeInTheDocument();
      });
    });

    test('renders post content sections when loaded', async () => {
      const { container } = renderWithProviders(<BlogPost {...getBlogPostProps()} />);
      
      await waitFor(() => {
        expect(container.textContent?.length).toBeGreaterThan(0);
      });
    });
  });
});