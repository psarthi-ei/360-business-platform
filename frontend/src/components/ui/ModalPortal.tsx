import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

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
      
      // Get current scroll position before fixing
      const scrollY = window.scrollY;
      
      // Apply mobile-optimized scroll prevention
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // Add modal-open class for additional CSS control
      document.body.classList.add('modal-open');

      // Cleanup function to restore scroll
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.top = originalTop;
        document.body.classList.remove('modal-open');
        
        // Restore scroll position on mobile
        window.scrollTo(0, scrollY);
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