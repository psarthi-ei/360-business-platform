import React, { useState, useEffect } from 'react';
import { Lead } from '../../data/salesMockData';
import ModalPortal from '../ui/ModalPortal';
import styles from './AddNotesModal.module.css';

interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  lead: Lead | null;
}

function AddNotesModal({ isOpen, onClose, onSave, lead }: AddNotesModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear notes when modal opens/closes - always start fresh
  useEffect(() => {
    if (isOpen) {
      setNotes('');
    }
  }, [isOpen]);

  if (!lead) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      onSave(notes);
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (notes.trim() !== '') {
      const confirmed = window.confirm('You have an unsaved note. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>📝 Add Note</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.notesTextarea}
                placeholder="Add conversation note..."
                rows={3}
                autoFocus
              />
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions}>
              <button 
                type="button"
                className="ds-btn ds-btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="ds-btn ds-btn-primary"
                disabled={isSubmitting || !notes.trim()}
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}

export default AddNotesModal;