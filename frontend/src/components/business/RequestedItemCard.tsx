import React from 'react';
import { LeadRequestedItem } from '../../data/salesMockData';
import { getItemById, calculateItemPrice } from '../../data/catalogMockData';
import styles from './RequestedItemCard.module.css';

interface RequestedItemCardProps {
  item: LeadRequestedItem;
  businessModel: 'sales' | 'job_work';
  onEdit?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  index?: number; // For alternating colors
}

function RequestedItemCard({
  item,
  businessModel,
  onEdit,
  onRemove,
  showActions = true,
  index = 0
}: RequestedItemCardProps) {
  // Get catalog item details
  const catalogItem = getItemById(item.masterItemId);
  
  if (!catalogItem) {
    return (
      <div className={styles.errorCard}>
        <p>⚠️ Catalog item not found: {item.masterItemId}</p>
        {showActions && onRemove && (
          <button onClick={onRemove} className={styles.removeButton}>
            Remove
          </button>
        )}
      </div>
    );
  }

  // Calculate estimated price and get actual unit price from pricing tiers
  let estimatedPrice = 0;
  let unitPrice = 0;
  let priceError = false;
  try {
    const calculation = calculateItemPrice(catalogItem.id, item.requestedQuantity, businessModel);
    estimatedPrice = calculation.finalPrice;
    
    // Get actual base unit price from pricing tiers (not calculated average)
    const pricingTiers = businessModel === 'sales' 
      ? catalogItem.pricing.salesOrderPricing 
      : catalogItem.pricing.jobWorkPricing;
    
    // Find applicable tier based on quantity
    const applicableTiers = pricingTiers.filter(tier => item.requestedQuantity >= tier.minimumQuantity);
    const selectedTier = applicableTiers.length > 0 
      ? applicableTiers[applicableTiers.length - 1] // Highest qualifying tier
      : pricingTiers[0]; // Fallback to first tier
    
    unitPrice = selectedTier?.baseRate || 0;
  } catch {
    priceError = true;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get unit display - proper formatting for "per_meter" -> "per meter"
  const rawUnit = catalogItem.pricing.salesOrderPricing[0]?.unit || 
                  catalogItem.pricing.jobWorkPricing[0]?.unit || 'units';
  const unit = rawUnit.replace('per_', 'per ');

  return (
    <div className={`${styles.itemCard} ${index % 2 === 1 ? styles.alternateCard : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <h4 className={styles.itemName}>{catalogItem.name}</h4>
          <span className={styles.itemCode}>{catalogItem.code}</span>
        </div>
        {showActions && onRemove && (
          <button 
            onClick={onRemove}
            className={styles.removeButton}
            title="Remove item"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.itemSummary}>
        <div className={styles.quantityDisplay}>
          <span className={styles.quantity}>{item.requestedQuantity.toLocaleString()}</span>
          <span className={styles.unit}>{unit}</span>
        </div>
        
        {!priceError && estimatedPrice > 0 && (
          <div className={styles.priceDisplay}>
            <div className={styles.unitPriceInfo}>
              <span className={styles.unitPrice}>{formatCurrency(unitPrice)}/{unit}</span>
              <span className={styles.multiplySymbol}>×</span>
              <span className={styles.quantityInfo}>{item.requestedQuantity.toLocaleString()}</span>
            </div>
            <div className={styles.totalPriceInfo}>
              <span className={styles.totalPrice}>{formatCurrency(estimatedPrice)}</span>
              <span className={styles.priceLabel}>Total</span>
            </div>
          </div>
        )}
      </div>

      {item.notes && (
        <div className={styles.notesDisplay}>
          <span className={styles.notesText}>{item.notes}</span>
        </div>
      )}
    </div>
  );
}

export default RequestedItemCard;