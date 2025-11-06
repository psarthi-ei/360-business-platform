import React, { useState, useEffect } from 'react';
import { 
  MasterItem, 
  getApplicableItems, 
  searchCatalogItems,
  calculateItemPrice 
} from '../../data/catalogMockData';
import { LeadRequestedItem } from '../../data/salesMockData';
import ModalPortal from '../ui/ModalPortal';
import styles from './CatalogItemSelector.module.css';

interface CatalogItemSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  businessModel: 'sales' | 'job_work';
  onItemSelected: (requestedItem: LeadRequestedItem) => void;
  excludeItemIds?: string[]; // Items already selected
}

function CatalogItemSelector({
  isOpen,
  onClose,
  businessModel,
  onItemSelected,
  excludeItemIds = []
}: CatalogItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<MasterItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);
  
  // Item details form - simplified
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');

  // Get available items based on business model
  useEffect(() => {
    if (!isOpen) return;
    
    const applicableItems = getApplicableItems(businessModel)
      .filter(item => !excludeItemIds.includes(item.id));
    
    let filtered = applicableItems;
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchCatalogItems(searchTerm, {}, businessModel)
        .filter(item => !excludeItemIds.includes(item.id));
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [isOpen, businessModel, searchTerm, selectedCategory, excludeItemIds]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedCategory('all');
      setSelectedItem(null);
      setQuantity(1);
      setNotes('');
    }
  }, [isOpen]);

  // Calculate estimated price and unit price when item or quantity changes
  const priceInfo = selectedItem && quantity > 0 ? (() => {
    try {
      const calculation = calculateItemPrice(selectedItem.id, quantity, businessModel);
      
      // Get base unit price from pricing tiers
      const pricingTiers = businessModel === 'sales' 
        ? selectedItem.pricing.salesOrderPricing 
        : selectedItem.pricing.jobWorkPricing;
      
      // Find applicable tier based on quantity with better fallback logic
      const applicableTiers = pricingTiers.filter(tier => quantity >= tier.minimumQuantity);
      let selectedTier;
      
      if (applicableTiers.length > 0) {
        // Use highest qualifying tier
        selectedTier = applicableTiers[applicableTiers.length - 1];
      } else if (pricingTiers.length > 0) {
        // Fallback to first tier if quantity is below minimum
        selectedTier = pricingTiers[0];
      } else {
        // No pricing tiers available
        throw new Error(`No pricing tiers available for ${businessModel}`);
      }
      
      return {
        totalPrice: calculation.finalPrice,
        unitPrice: selectedTier?.baseRate || 0,
        unit: selectedTier?.unit?.replace('per_', '') || 'units'
      };
    } catch {
      return { totalPrice: 0, unitPrice: 0, unit: 'units' };
    }
  })() : { totalPrice: 0, unitPrice: 0, unit: 'units' };

  const estimatedPrice = priceInfo.totalPrice;

  const handleItemSelect = (item: MasterItem) => {
    setSelectedItem(item);
    // Set quantity to item's minimum quantity to ensure pricing works
    const minQuantity = item.businessRules.minimumQuantity || 1;
    setQuantity(Math.max(quantity, minQuantity));
  };

  const handleAddItem = () => {
    if (!selectedItem) return;
    
    const requestedItem: LeadRequestedItem = {
      masterItemId: selectedItem.id,
      requestedQuantity: quantity,
      budgetExpectation: estimatedPrice,
      priority: 'must_have', // Default priority - simplified
      notes: notes.trim() || undefined
    };
    
    onItemSelected(requestedItem);
    onClose();
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'raw_material', label: 'Raw Materials' },
    { value: 'service', label: 'Processing Services' },
    { value: 'equipment_time', label: 'Equipment Time' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'consumable', label: 'Consumables' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>📦 Select Catalog Item</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {/* Search and Filter Section */}
          <div className={styles.searchSection}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputGroup}>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.categorySelect}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.businessModelTag}>
              {businessModel === 'sales' ? '🛒 Sales Order Items' : '⚙️ Job Work Services'}
            </div>
          </div>

          {/* Items List */}
          <div className={styles.itemsList}>
            {filteredItems.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No items found for {businessModel} business model</p>
                {searchTerm && <p>Try adjusting your search terms</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`${styles.itemCard} ${selectedItem?.id === item.id ? styles.selected : ''}`}
                  onClick={() => handleItemSelect(item)}
                >
                  <div className={styles.itemHeader}>
                    <h4>{item.name}</h4>
                    <span className={styles.itemCode}>{item.code}</span>
                  </div>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemDetails}>
                    <span className={styles.category}>{item.category.replace('_', ' ')}</span>
                    <span className={styles.quality}>{item.specifications.qualityGrade}</span>
                    {businessModel === 'sales' && item.pricing.salesOrderPricing.length > 0 && (
                      <span className={styles.price}>
                        From {formatCurrency(item.pricing.salesOrderPricing[0].baseRate)} / {item.pricing.salesOrderPricing[0].unit}
                      </span>
                    )}
                    {businessModel === 'job_work' && item.pricing.jobWorkPricing.length > 0 && (
                      <span className={styles.price}>
                        From {formatCurrency(item.pricing.jobWorkPricing[0].baseRate)} / {item.pricing.jobWorkPricing[0].unit}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Item Details Section */}
          {selectedItem && (
            <div className={styles.detailsSection}>
              <h3>Item Details</h3>
              <div className={styles.selectedItemInfo}>
                <h4>{selectedItem.name}</h4>
                <p>{selectedItem.description}</p>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.quantityInput}
                  />
                  <span className={styles.unit}>
                    {selectedItem.pricing.salesOrderPricing[0]?.unit?.replace('per_', '') || 
                     selectedItem.pricing.jobWorkPricing[0]?.unit?.replace('per_', '') || 'units'}
                  </span>
                </div>
                <div className={styles.formGroup}>
                  <label>Price Details</label>
                  {estimatedPrice > 0 || priceInfo.unitPrice > 0 ? (
                    <div className={styles.priceDetails}>
                      {priceInfo.unitPrice > 0 && (
                        <div className={styles.unitPriceDisplay}>
                          <span className={styles.unitPriceLabel}>Unit Price:</span>
                          <span className={styles.unitPriceValue}>
                            {formatCurrency(priceInfo.unitPrice)}/{priceInfo.unit}
                          </span>
                        </div>
                      )}
                      {estimatedPrice > 0 && (
                        <div className={styles.totalPriceDisplay}>
                          <span className={styles.totalPriceLabel}>Total ({quantity} {priceInfo.unit}s):</span>
                          <span className={styles.totalPriceValue}>{formatCurrency(estimatedPrice)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={selectedItem ? styles.priceDisplayWarning : styles.priceDisplay}>
                      {selectedItem 
                        ? `Minimum quantity: ${selectedItem.businessRules.minimumQuantity} ${priceInfo.unit}s`
                        : 'Select an item to see price'
                      }
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={2}
                  className={styles.notesInput}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddItem}
            disabled={!selectedItem || quantity <= 0}
          >
            Add Item to Lead
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

export default CatalogItemSelector;