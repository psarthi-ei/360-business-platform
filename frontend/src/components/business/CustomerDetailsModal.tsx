import React from 'react';
import ModalPortal from '../ui/ModalPortal';
import styles from './CustomerDetailsModal.module.css';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const CustomerDetailsModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true 
}: CustomerDetailsModalProps) => {
  if (!isOpen) return null;


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={onClose}>
      <div 
        className={styles.modalContainer}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {showCloseButton && (
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default CustomerDetailsModal;