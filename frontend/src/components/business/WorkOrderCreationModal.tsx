import React, { useState } from 'react';
import { ProductionOrder } from '../../data/productionMockData';
import { LotDefinition, createWorkOrdersFromLots, validateLotDefinitions } from '../../services/ProductionOrderService';
import ModalPortal from '../ui/ModalPortal';
import styles from './WorkOrderCreationModal.module.css';

interface WorkOrderCreationModalProps {
  productionOrder: ProductionOrder;
  isOpen: boolean;
  onClose: () => void;
  onWorkOrdersCreated: (workOrderIds: string[]) => void;
}

export const WorkOrderCreationModal: React.FC<WorkOrderCreationModalProps> = ({
  productionOrder: productionOrderData,
  isOpen,
  onClose,
  onWorkOrdersCreated
}) => {
  // Remove unused import and fix conflicts
  const [lots, setLots] = useState<LotDefinition[]>([
    {
      description: '',
      quantity: productionOrderData.fabricDetails.quantity,
      process: 'dyeing',
      priority: 'normal',
      notes: ''
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLot = () => {
    setLots([...lots, {
      description: '',
      quantity: 0,
      process: 'dyeing',
      priority: 'normal',
      notes: ''
    }]);
  };

  const removeLot = (index: number) => {
    if (lots.length > 1) {
      setLots(lots.filter((_, i) => i !== index));
    }
  };

  const updateLot = (index: number, field: keyof LotDefinition, value: string | number) => {
    const updatedLots = lots.map((lot, i) => 
      i === index ? { ...lot, [field]: value } : lot
    );
    setLots(updatedLots);
  };

  const getTotalQuantity = () => {
    return lots.reduce((sum, lot) => sum + (lot.quantity || 0), 0);
  };

  const handleCreate = async () => {
    setError(null);
    
    // Validate lots
    const validation = validateLotDefinitions(lots, productionOrderData.fabricDetails.quantity);
    if (!validation.isValid) {
      setError(validation.reason || 'Invalid lot definitions');
      return;
    }

    setIsCreating(true);
    try {
      const workOrders = await createWorkOrdersFromLots(productionOrderData.id, lots);
      onWorkOrdersCreated(workOrders.map(wo => wo.id));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create work orders');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create Work Orders</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.productionOrderInfo}>
          <h3>Production Order: {productionOrderData.id}</h3>
          <p><strong>Customer:</strong> {productionOrderData.customerName}</p>
          <p><strong>Fabric Type:</strong> {productionOrderData.fabricDetails.type}</p>
          <p><strong>Total Quantity:</strong> {productionOrderData.fabricDetails.quantity} {productionOrderData.fabricDetails.unit}</p>
        </div>

        <div className={styles.lotsSection}>
          <div className={styles.lotsHeader}>
            <h3>Define Work Orders</h3>
            <button className={styles.addLotButton} onClick={handleAddLot}>
              + Add Lot
            </button>
          </div>

          {lots.map((lot, index) => (
            <div key={index} className={styles.lotRow}>
              <div className={styles.lotNumber}>
                Lot {index + 1}
              </div>
              
              <div className={styles.lotFields}>
                <div className={styles.field}>
                  <label>Description</label>
                  <input
                    type="text"
                    value={lot.description}
                    onChange={(e) => updateLot(index, 'description', e.target.value)}
                    placeholder={`${productionOrderData.fabricDetails.type} - Lot ${index + 1}`}
                  />
                </div>

                <div className={styles.field}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={lot.quantity}
                    onChange={(e) => updateLot(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                  <span className={styles.unit}>{productionOrderData.fabricDetails.unit}</span>
                </div>

                <div className={styles.field}>
                  <label>Process</label>
                  <select
                    value={lot.process}
                    onChange={(e) => updateLot(index, 'process', e.target.value)}
                  >
                    <option value="dyeing">Dyeing</option>
                    <option value="finishing">Finishing</option>
                    <option value="printing">Printing</option>
                    <option value="weaving">Weaving</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Priority</label>
                  <select
                    value={lot.priority}
                    onChange={(e) => updateLot(index, 'priority', e.target.value as 'normal' | 'urgent' | 'high')}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Notes</label>
                  <input
                    type="text"
                    value={lot.notes}
                    onChange={(e) => updateLot(index, 'notes', e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>

                {lots.length > 1 && (
                  <button
                    className={styles.removeLotButton}
                    onClick={() => removeLot(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.quantitySummary}>
          <div className={`${styles.totalQuantity} ${getTotalQuantity() !== productionOrderData.fabricDetails.quantity ? styles.mismatch : styles.match}`}>
            <strong>
              Total Lot Quantity: {getTotalQuantity()} / {productionOrderData.fabricDetails.quantity} {productionOrderData.fabricDetails.unit}
            </strong>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button 
            className="ds-btn ds-btn-primary"
            onClick={handleCreate}
            disabled={isCreating || getTotalQuantity() !== productionOrderData.fabricDetails.quantity}
          >
            {isCreating ? 'Creating...' : 'Create Work Orders'}
          </button>
          <button className="ds-btn ds-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};