/**
 * Scroll utility functions for consistent scroll-to-top behavior across the application
 */

export interface ScrollOptions {
  behavior?: 'smooth' | 'auto';
  top?: number;
  left?: number;
}

/**
 * Smoothly scrolls to the top of the page
 */
export function scrollToTop(options: ScrollOptions = {}): void {
  const {
    behavior = 'smooth',
    top = 0,
    left = 0
  } = options;

  // Force immediate scroll first
  try {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch (error) {
    // ignore
  }

  // Then try smooth scroll
  requestAnimationFrame(() => {
    try {
      window.scrollTo({
        top,
        left,
        behavior
      });
    } catch (error) {
      // Fallback for older browsers that don't support smooth scrolling
      window.scrollTo(left, top);
    }
  });
}

/**
 * Instantly scrolls to the top of the page (no animation)
 */
export function scrollToTopInstant(): void {
  scrollToTop({ behavior: 'auto' });
}

/**
 * Scrolls to top with a small delay to ensure content has loaded
 */
export function scrollToTopDelayed(delay: number = 100): void {
  setTimeout(() => {
    scrollToTop();
  }, delay);
}

/**
 * Scrolls to a specific element by ID
 */
export function scrollToElement(elementId: string, options: ScrollOptions = {}): void {
  const element = document.getElementById(elementId);
  if (element) {
    const {
      behavior = 'smooth'
    } = options;

    try {
      element.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest'
      });
    } catch (error) {
      // Fallback for older browsers
      element.scrollIntoView(true);
    }
  }
}

/**
 * Checks if the page is currently scrolled from the top
 */
export function isPageScrolled(): boolean {
  return window.pageYOffset > 0 || document.documentElement.scrollTop > 0;
}

/**
 * Gets the current scroll position
 */
export function getCurrentScrollPosition(): { top: number; left: number } {
  return {
    top: window.pageYOffset || document.documentElement.scrollTop,
    left: window.pageXOffset || document.documentElement.scrollLeft
  };
}