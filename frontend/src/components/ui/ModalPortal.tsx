import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Remove unnecessary global recovery functions - simpler approach

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  preventScroll?: boolean;
  onBackdropClick?: () => void;
}

/**
 * Safari-Optimized Modal Portal Component
 * 
 * Renders modals at document.body level to escape CSS Grid constraints
 * and ensure proper mobile behavior across all devices, with special
 * Safari compatibility fixes.
 * 
 * Features:
 * - React Portal for container escape
 * - Safari-specific viewport height calculations
 * - Safari scroll freeze prevention
 * - Safari browser UI compensation
 * - Cross-browser scroll lock management
 * 
 * SAFARI COMPATIBILITY (November 2025):
 * - Dynamic viewport height for Safari address bar
 * - Safari-specific scroll prevention
 * - WebKit scroll conflict resolution
 */
const ModalPortal: React.FC<ModalPortalProps> = ({ 
  children, 
  isOpen, 
  preventScroll = true,
  onBackdropClick 
}) => {
  
  // Safari Detection for Browser-Specific Fixes
  const isSafari = typeof navigator !== 'undefined' && 
    /Safari/.test(navigator.userAgent) && 
    !/Chrome/.test(navigator.userAgent);
  
  // Calculate actual viewport height for Safari
  const getViewportHeight = () => {
    if (typeof window === 'undefined') return '100vh';
    
    if (isSafari) {
      // Safari: Use actual window inner height to exclude browser UI
      return `${window.innerHeight}px`;
    }
    
    // Other browsers: Standard viewport units work fine
    return '100vh';
  };
  
  // Safari-Optimized Body Scroll Management
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
      
      // Safari-Specific Scroll Prevention (prevents freeze on subsequent opens)
      if (isSafari) {
        // Safari: Use overflow hidden only, never position fixed
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        // Force reflow to ensure styles are applied in Safari
        void document.body.offsetHeight;
      } else {
        // Non-Safari browsers: Use standard approach
        if (window.innerWidth <= 768) {
          // Mobile: Use overflow hidden only
          document.body.style.overflow = 'hidden';
          document.body.style.touchAction = 'none';
        } else {
          // Desktop: Use position fixed approach
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.width = '100%';
        }
      }

      // Cleanup function to restore scroll
      return () => {
        
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
        
        // Safari-Specific Scroll Restoration
        if (isSafari) {
          // Safari: Delayed scroll restoration to prevent freeze
          setTimeout(() => {
            window.scrollTo(0, scrollY);
            // Double-check in Safari - sometimes needs extra push
            setTimeout(() => {
              if (window.scrollY !== scrollY) {
                window.scrollTo(0, scrollY);
              }
            }, 50);
          }, 100);
        } else {
          // Standard browsers: Immediate or delayed restoration
          if (window.innerWidth <= 768) {
            // Mobile: Simple scroll restoration
            setTimeout(() => {
              window.scrollTo(0, scrollY);
            }, 0);
          } else {
            // Desktop: Immediate scroll restoration
            try {
              window.scrollTo(0, scrollY);
            } catch {
              // Fallback scroll restoration
              document.documentElement.scrollTop = scrollY;
            }
          }
        }
        
        // Force a reflow to ensure styles are applied
        void document.body.offsetHeight;
      };
    }
  }, [isOpen, preventScroll, isSafari]);

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
        
        // Safari-Compatible Dynamic Viewport Height
        height: getViewportHeight(),
        minHeight: getViewportHeight(),
        
        // Z-index following Visual Design Spec hierarchy
        zIndex: 16000, // Layer 4: Modals & Critical UI
        
        // Safari-Compatible Touch Optimization (no WebkitOverflowScrolling conflicts)
        touchAction: isSafari ? 'none' : 'manipulation',
        
        // Backdrop styling
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
        // Center content
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        
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