import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  preventScroll?: boolean;
  onBackdropClick?: () => void;
}

/**
 * Universal Modal Portal Component
 * 
 * Renders modals at document.body level to escape CSS Grid constraints
 * and ensure proper cross-browser behavior using modern CSS standards.
 * 
 * Features:
 * - React Portal for container escape
 * - Universal CSS-based viewport handling (100dvh)
 * - Cross-browser scroll lock management
 * - Safe area support via CSS custom properties
 * 
 * MODERN CSS APPROACH (November 2025):
 * - No browser detection needed
 * - CSS handles all viewport differences universally
 * - 100dvh for dynamic viewport height on all browsers
 * - env(safe-area-inset-*) for device-specific safe areas
 */
const ModalPortal: React.FC<ModalPortalProps> = ({ 
  children, 
  isOpen, 
  preventScroll = true,
  onBackdropClick 
}) => {
  
  // Universal Body Scroll Management - CSS handles cross-browser differences
  useEffect(() => {
    if (!isOpen) return;

    if (preventScroll) {
      // Store original values to restore later
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      
      // Get current scroll position before fixing
      const scrollY = window.scrollY;
      
      // Use CSS class-based approach - CSS handles browser differences
      document.body.classList.add('modal-open');
      
      // Universal scroll prevention - works across all browsers
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Cleanup function to restore scroll
      return () => {
        // Remove modal-open class
        document.body.classList.remove('modal-open');
        
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        
        // Clean up if no original values
        if (!originalOverflow) document.body.style.removeProperty('overflow');
        if (!originalTouchAction) document.body.style.removeProperty('touch-action');
        
        // Universal scroll restoration - works across all browsers
        setTimeout(() => {
          window.scrollTo(0, scrollY);
        }, 0);
      };
    }
  }, [isOpen, preventScroll]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Handle backdrop click if provided
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onBackdropClick) {
      onBackdropClick();
    }
  };

  // Render modal at body level using React Portal
  return createPortal(
    <div 
      className="modal-portal-container"
      onClick={handleBackdropClick}
      style={{
        // Mobile-First Positioning
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        
        // Universal viewport height using CSS custom property
        height: 'var(--modal-safe-height)',
        minHeight: 'var(--modal-safe-height)',
        
        // Z-index following Visual Design Spec hierarchy
        zIndex: 16000, // Layer 4: Modals & Critical UI
        
        // Universal touch optimization
        touchAction: 'manipulation',
        
        // Backdrop styling
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
        // Center content
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--modal-padding)',
        
        // Simple opacity transition
        opacity: 1
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalPortal;