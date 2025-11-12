import React from 'react';
import ModalPortal from './ModalPortal';
import styles from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'danger' | 'info';
}

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning'
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={handleCancel}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.dialogHeader}>
          <h3 className={styles.dialogTitle}>{title}</h3>
        </div>

        {/* Message */}
        <div className={styles.dialogBody}>
          <p className={styles.dialogMessage}>{message}</p>
        </div>

        {/* Actions */}
        <div className={styles.dialogActions}>
          <button 
            className="ds-btn ds-btn-secondary"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`ds-btn ${variant === 'danger' ? 'ds-btn-danger' : 'ds-btn-primary'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

export default ConfirmationDialog;