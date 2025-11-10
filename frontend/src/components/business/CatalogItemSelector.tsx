import React, { useState, useEffect } from 'react';
import { 
  MasterItem, 
  getApplicableItems, 
  searchCatalogItems,
  calculateItemPrice,
  getSpecificationType
} from '../../data/catalogMockData';
import { LeadRequestedItem } from '../../data/salesMockData';
import { formatUnit } from '../../utils/unitFormatting';
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
  
  // Custom specifications state
  const [customSpecifications, setCustomSpecifications] = useState<Record<string, string>>({});
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [newSpecType, setNewSpecType] = useState<string>('');
  const [newSpecValue, setNewSpecValue] = useState<string>('');
  const [customSpecKey, setCustomSpecKey] = useState<string>(''); // For custom specification type

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
      // Reset custom specifications state
      setCustomSpecifications({});
      setIsAddingSpec(false);
      setNewSpecType('');
      setNewSpecValue('');
      setCustomSpecKey('');
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
        unit: formatUnit.getDisplayUnit(selectedTier?.unit || 'units', 'rate')
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
    
    // Scroll to details section to ensure visibility
    setTimeout(() => {
      const detailsSection = document.querySelector('.catalog-item-details-section');
      const modalBody = document.querySelector(`.${styles.modalBody}`);
      
      if (detailsSection && modalBody) {
        // Calculate scroll position within modal body - ensure elements are HTMLElements
        if (detailsSection instanceof HTMLElement && modalBody instanceof HTMLElement) {
          const detailsSectionTop = detailsSection.offsetTop;
          const modalBodyScrollTop = modalBody.scrollTop;
          const modalBodyHeight = modalBody.clientHeight;
          const detailsSectionHeight = detailsSection.offsetHeight;
        
          // Check if details section is not fully visible
          if (detailsSectionTop < modalBodyScrollTop || 
              detailsSectionTop + detailsSectionHeight > modalBodyScrollTop + modalBodyHeight) {
            modalBody.scrollTo({
              top: detailsSectionTop - 20, // Small offset for better UX
              behavior: 'smooth'
            });
          }
        }
      }
    }, 150);
  };

  const handleAddItem = () => {
    if (!selectedItem) return;
    
    const requestedItem: LeadRequestedItem = {
      masterItemId: selectedItem.id,
      requestedQuantity: quantity,
      budgetExpectation: estimatedPrice,
      priority: 'must_have', // Default priority - simplified
      notes: notes.trim() || undefined,
      customSpecifications: Object.keys(customSpecifications).length > 0 
        ? customSpecifications 
        : undefined
    };
    
    onItemSelected(requestedItem);
    onClose();
  };

  // Custom specifications functions
  const handleAddSpecification = () => {
    if (!newSpecType) return;
    
    const specificationType = getSpecificationType(newSpecType);
    if (!specificationType) return;
    
    let specificationKey: string;
    let specificationValue: string;
    
    if (newSpecType === 'custom') {
      // For custom type, use the custom key as the specification name
      if (!customSpecKey.trim() || !newSpecValue.trim()) return;
      specificationKey = customSpecKey.trim();
      specificationValue = newSpecValue.trim();
    } else {
      // For predefined types, use the label as key
      if (!newSpecValue.trim()) return;
      specificationKey = specificationType.label;
      specificationValue = newSpecValue.trim();
    }
    
    // Add specification to the list
    setCustomSpecifications(prev => ({
      ...prev,
      [specificationKey]: specificationValue
    }));
    
    // Reset form
    setIsAddingSpec(false);
    setNewSpecType('');
    setNewSpecValue('');
    setCustomSpecKey('');
  };
  
  const handleCancelAddSpecification = () => {
    setIsAddingSpec(false);
    setNewSpecType('');
    setNewSpecValue('');
    setCustomSpecKey('');
  };
  
  const handleRemoveSpecification = (key: string) => {
    setCustomSpecifications(prev => {
      const { [key]: removed, ...remaining } = prev;
      return remaining;
    });
  };
  
  const renderSpecificationValueInput = () => {
    if (!newSpecType) return null;
    
    const specificationType = getSpecificationType(newSpecType);
    if (!specificationType) return null;
    
    if (newSpecType === 'custom') {
      return (
        <div className={styles.customSpecInputs}>
          <input
            type="text"
            value={customSpecKey}
            onChange={(e) => setCustomSpecKey(e.target.value)}
            placeholder="Specification name (e.g., Pattern, Texture)"
            className={styles.specInput}
          />
          <input
            type="text"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder="Specification value"
            className={styles.specInput}
          />
        </div>
      );
    }
    
    switch (specificationType.inputType) {
      case 'dropdown':
        return (
          <select
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            className={styles.specInput}
          >
            <option value="">Select {specificationType.label.toLowerCase()}</option>
            {specificationType.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <div className={styles.numberInputGroup}>
            <input
              type="number"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder={specificationType.placeholder}
              className={styles.specInput}
              min={specificationType.validation?.min}
              max={specificationType.validation?.max}
            />
            {specificationType.unit && (
              <span className={styles.unitLabel}>{specificationType.unit}</span>
            )}
          </div>
        );
      
      case 'text':
      default:
        return (
          <input
            type="text"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder={specificationType.placeholder}
            className={styles.specInput}
          />
        );
    }
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
                        From {formatCurrency(item.pricing.salesOrderPricing[0].baseRate)} / {formatUnit.getDisplayUnit(item.pricing.salesOrderPricing[0].unit, 'quantity')}
                      </span>
                    )}
                    {businessModel === 'job_work' && item.pricing.jobWorkPricing.length > 0 && (
                      <span className={styles.price}>
                        From {formatCurrency(item.pricing.jobWorkPricing[0].baseRate)} / {formatUnit.getDisplayUnit(item.pricing.jobWorkPricing[0].unit, 'quantity')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Item Details Section */}
          {selectedItem && (
            <div className={`${styles.detailsSection} catalog-item-details-section`}>
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
                    {formatUnit.getDisplayUnit(
                      selectedItem.pricing.salesOrderPricing[0]?.unit || 
                      selectedItem.pricing.jobWorkPricing[0]?.unit || 'units',
                      'quantity'
                    )}
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
                            {formatCurrency(priceInfo.unitPrice)} {priceInfo.unit}
                          </span>
                        </div>
                      )}
                      {estimatedPrice > 0 && (
                        <div className={styles.totalPriceDisplay}>
                          <span className={styles.totalPriceLabel}>Total ({quantity} {formatUnit.getDisplayUnit(selectedItem.pricing.salesOrderPricing[0]?.unit || selectedItem.pricing.jobWorkPricing[0]?.unit || 'units', 'quantity')}):</span>
                          <span className={styles.totalPriceValue}>{formatCurrency(estimatedPrice)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={selectedItem ? styles.priceDisplayWarning : styles.priceDisplay}>
                      {selectedItem 
                        ? `Minimum quantity: ${selectedItem.businessRules.minimumQuantity} ${formatUnit.getDisplayUnit(selectedItem.pricing.salesOrderPricing[0]?.unit || selectedItem.pricing.jobWorkPricing[0]?.unit || 'units', 'quantity')}`
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

              {/* Custom Specifications Section */}
              <div className={styles.specificationsSection}>
                <div className={styles.specificationsHeader}>
                  <label>Custom Specifications</label>
                </div>

                {/* Existing Specifications List */}
                {Object.keys(customSpecifications).length > 0 && (
                  <div className={styles.specificationsList}>
                    {Object.entries(customSpecifications).map(([key, value]) => (
                      <div key={key} className={styles.specificationItem}>
                        <span className={styles.specKey}>{key}:</span>
                        <span className={styles.specValue}>{value}</span>
                        <button
                          type="button"
                          className={styles.removeSpecButton}
                          onClick={() => handleRemoveSpecification(key)}
                          title="Remove specification"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Specification Form */}
                {isAddingSpec && (
                  <div className={styles.addSpecificationForm}>
                    <div className={styles.specTypeSelect}>
                      <label htmlFor="specType">Specification Type</label>
                      <select
                        id="specType"
                        value={newSpecType}
                        onChange={(e) => setNewSpecType(e.target.value)}
                        className={styles.specSelectInput}
                      >
                        <option value="">Select specification type...</option>
                        {Object.keys({
                          color: 'Color',
                          gsm: 'GSM (grams per square meter)',
                          width: 'Width',
                          quality_grade: 'Quality Grade',
                          finish: 'Finish',
                          weave_pattern: 'Weave Pattern',
                          thread_count: 'Thread Count',
                          custom: 'Custom Specification'
                        }).map(type => {
                          const specificationType = getSpecificationType(type);
                          return specificationType ? (
                            <option key={type} value={type}>
                              {specificationType.label}
                            </option>
                          ) : null;
                        })}
                      </select>
                    </div>

                    {/* Dynamic Value Input */}
                    {newSpecType && (
                      <div className={styles.specValueInput}>
                        <label htmlFor="specValue">Value</label>
                        {renderSpecificationValueInput()}
                      </div>
                    )}

                    <div className={styles.specFormActions}>
                      <button
                        type="button"
                        className={styles.cancelSpecButton}
                        onClick={handleCancelAddSpecification}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.saveSpecButton}
                        onClick={handleAddSpecification}
                        disabled={!newSpecType || !newSpecValue || (newSpecType === 'custom' && !customSpecKey)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {Object.keys(customSpecifications).length === 0 && !isAddingSpec && (
                  <div className={styles.emptySpecifications}>
                    No custom specifications added
                  </div>
                )}

                {/* Add Specification Button at Bottom */}
                <button
                  type="button"
                  className={styles.addSpecButton}
                  onClick={() => setIsAddingSpec(true)}
                  disabled={isAddingSpec}
                >
                  + Add Specification
                </button>
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