import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Global scroll recovery function for emergency cases
const forceScrollRecovery = () => {
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('width');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('touch-action');
  document.body.style.removeProperty('-webkit-overflow-scrolling');
  void document.body.offsetHeight; // Force reflow
};

// Expose recovery function globally for debugging
if (typeof window !== 'undefined') {
  (window as typeof window & { forceScrollRecovery?: () => void }).forceScrollRecovery = forceScrollRecovery;
}

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  preventScroll?: boolean;
  onBackdropClick?: () => void;
}

/**
 * Mobile-First Modal Portal Component
 * 
 * Renders modals at document.body level to escape CSS Grid constraints
 * and ensure proper mobile behavior across all devices.
 * 
 * Features:
 * - React Portal for container escape
 * - Mobile-optimized body scroll prevention  
 * - Touch-friendly backdrop handling
 * - Dynamic viewport height support
 * - Cross-device compatibility
 */
const ModalPortal: React.FC<ModalPortalProps> = ({ 
  children, 
  isOpen, 
  preventScroll = true,
  onBackdropClick 
}) => {
  
  // Mobile-First Body Scroll Management
  useEffect(() => {
    if (!isOpen) return;

    if (preventScroll) {
      // Store original values to restore later
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalTop = document.body.style.top;
      const originalTouchAction = document.body.style.touchAction;
      
      // Get current scroll position before fixing
      const scrollY = window.scrollY;
      
      // Use CSS class-based approach for better reliability
      document.body.classList.add('modal-open');
      
      // Apply inline styles only if CSS class doesn't work
      document.body.style.top = `-${scrollY}px`;

      // Safety timeout to auto-recover scroll if modal gets stuck
      const safetyTimeout = setTimeout(() => {
        if (document.body.classList.contains('modal-open')) {
          forceScrollRecovery();
        }
      }, 30000); // 30 second safety net

      // Cleanup function to restore scroll
      return () => {
        clearTimeout(safetyTimeout);
        
        // Force removal of modal-open class
        document.body.classList.remove('modal-open');
        
        // Clear all inline styles that might have been set
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.top = originalTop;
        document.body.style.touchAction = originalTouchAction;
        
        // Additional cleanup to ensure styles are fully removed
        if (!originalOverflow) document.body.style.removeProperty('overflow');
        if (!originalPosition) document.body.style.removeProperty('position');
        if (!originalWidth) document.body.style.removeProperty('width');
        if (!originalTop) document.body.style.removeProperty('top');
        if (!originalTouchAction) document.body.style.removeProperty('touch-action');
        
        // Restore scroll position with error handling
        try {
          window.scrollTo(0, scrollY);
        } catch {
          // Fallback scroll restoration
          document.documentElement.scrollTop = scrollY;
        }
        
        // Force a reflow to ensure styles are applied
        void document.body.offsetHeight;
        
        // Double-check that modal-open class is actually removed
        setTimeout(() => {
          if (document.body.classList.contains('modal-open')) {
            forceScrollRecovery();
          }
        }, 100);
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
        
        // Dynamic viewport height for mobile
        height: '100vh',
        minHeight: '100vh',
        
        // Z-index following Visual Design Spec hierarchy
        zIndex: 16000, // Layer 4: Modals & Critical UI
        
        // Mobile touch optimization
        WebkitOverflowScrolling: 'touch',
        touchAction: 'manipulation',
        
        // Backdrop styling
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
        // Center content
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        
        // Smooth animation
        animation: 'modalFadeIn 0.2s ease-out'
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalPortal;