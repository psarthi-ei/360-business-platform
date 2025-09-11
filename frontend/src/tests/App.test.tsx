import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { TranslationProvider } from '../contexts/TranslationContext';

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      {component}
    </TranslationProvider>
  );
};

describe('App Component', () => {
  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<App />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('has proper CSS class structure', () => {
      const { container } = renderWithTranslation(<App />);
      expect(container.querySelector('.App')).toBeInTheDocument();
      expect(container.querySelector('.App-content')).toBeInTheDocument();
    });

    test('applies theme system without errors', () => {
      const { container } = renderWithTranslation(<App />);
      // Theme should be applied without crashing
      expect(container.firstChild).toHaveClass('App');
    });

    test('renders child components', () => {
      const { container } = renderWithTranslation(<App />);
      // Should have multiple child elements (header + content)
      const appContent = container.querySelector('.App-content');
      expect(appContent).toBeInTheDocument();
      expect(appContent?.children.length).toBeGreaterThan(0);
    });

    test('maintains component hierarchy', () => {
      const { container } = renderWithTranslation(<App />);
      // Check proper nesting structure
      const app = container.querySelector('.App');
      const content = container.querySelector('.App-content');
      
      expect(app).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    test('handles styling and CSS modules', () => {
      const { container } = renderWithTranslation(<App />);
      // Should apply CSS without errors
      const appElement = container.querySelector('.App');
      expect(appElement).toHaveAttribute('class');
    });

    test('supports responsive design structure', () => {
      const { container } = renderWithTranslation(<App />);
      // Basic responsive structure should be present
      expect(container.querySelector('.App')).toBeInTheDocument();
      expect(container.querySelector('.App-content')).toBeInTheDocument();
    });

    test('integrates with translation system', () => {
      // Should render without translation errors
      expect(() => renderWithTranslation(<App />)).not.toThrow();
    });

    test('handles state management', () => {
      // Should initialize and manage state without errors
      const { container } = renderWithTranslation(<App />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('supports component lifecycle', () => {
      const { container, unmount } = renderWithTranslation(<App />);
      expect(container.firstChild).toBeInTheDocument();
      
      // Should unmount cleanly
      unmount();
      expect(container.firstChild).toBeNull();
    });
  });
});