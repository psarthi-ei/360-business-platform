import React, { useState, useEffect, useRef } from 'react';
import { LeadRequestedItem } from '../../data/salesMockData';
import { getItemById, calculateItemPrice, getSpecificationType } from '../../data/catalogMockData';
import { formatUnit } from '../../utils/unitFormatting';
import styles from './QuoteItemEditor.module.css';

// Extended interface for quote editing with additional fields
interface QuoteEditableItem extends LeadRequestedItem {
  customPrice?: number;
  discountPercentage?: number;
  calculatedTotal?: number;
}

interface QuoteItemEditorProps {
  item: LeadRequestedItem;
  businessModel: 'sales' | 'job_work';
  onUpdate: (updatedItem: QuoteEditableItem) => void;
  onRemove: () => void;
  index?: number; // For visual styling
}

interface QuoteItemEditData {
  quantity: number;
  customPrice?: number; // Override catalog price
  discountPercentage: number;
  notes: string;
  customSpecifications: Record<string, string>;
}

function QuoteItemEditor({
  item,
  businessModel,
  onUpdate,
  onRemove,
  index = 0
}: QuoteItemEditorProps) {
  // Get catalog item details
  const catalogItem = getItemById(item.masterItemId);
  
  // Collapse state - all items start collapsed for clean overview
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Local state for editing
  const [editData, setEditData] = useState<QuoteItemEditData>({
    quantity: item.requestedQuantity,
    customPrice: undefined,
    discountPercentage: 0,
    notes: item.notes || '',
    customSpecifications: item.customSpecifications || {}
  });

  // Specification form state
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [newSpecType, setNewSpecType] = useState<string>('');
  const [newSpecValue, setNewSpecValue] = useState<string>('');
  const [customSpecKey, setCustomSpecKey] = useState<string>(''); // For custom specification type

  // Pricing calculations
  const [pricing, setPricing] = useState<{
    basePrice: number;
    finalPrice: number;
    totalAmount: number;
    discountAmount: number;
    volumeDiscount: number;
    volumeDiscountAmount: number;
    effectiveRate: number;
  }>({
    basePrice: 0,
    finalPrice: 0,
    totalAmount: 0,
    discountAmount: 0,
    volumeDiscount: 0,
    volumeDiscountAmount: 0,
    effectiveRate: 0
  });

  // Calculate pricing when editData changes
  useEffect(() => {
    if (!catalogItem) return;

    let basePrice = 0;
    let effectiveRate = 0;
    let volumeDiscount = 0;
    let volumeDiscountAmount = 0;
    
    if (editData.customPrice) {
      // Use custom price override
      basePrice = editData.customPrice;
      effectiveRate = editData.customPrice;
      volumeDiscount = 0;
      volumeDiscountAmount = 0;
    } else {
      // Use catalog pricing
      const priceCalculation = calculateItemPrice(
        catalogItem.id, 
        editData.quantity, 
        businessModel
      );
      
      basePrice = priceCalculation.basePrice / editData.quantity; // Per unit base price
      effectiveRate = priceCalculation.finalPrice / editData.quantity; // Per unit after volume discounts
      volumeDiscount = priceCalculation.volumeDiscount; // Volume discount percentage
      volumeDiscountAmount = basePrice - effectiveRate; // Per unit volume discount amount
    }

    // Apply additional manual discount
    const manualDiscountAmount = (effectiveRate * editData.discountPercentage) / 100;
    const finalPrice = effectiveRate - manualDiscountAmount;
    const totalAmount = finalPrice * editData.quantity;

    setPricing({
      basePrice,
      finalPrice,
      totalAmount,
      discountAmount: manualDiscountAmount * editData.quantity,
      volumeDiscount,
      volumeDiscountAmount: volumeDiscountAmount * editData.quantity,
      effectiveRate
    });
  }, [catalogItem, editData, businessModel]);

  // Track previous values to prevent unnecessary updates
  const prevValuesRef = useRef<{
    quantity: number;
    customPrice?: number;
    discountPercentage: number;
    notes: string;
    calculatedTotal: number;
  } | null>(null);

  // Update parent when pricing changes - only when actual changes occur
  useEffect(() => {
    const currentValues = {
      quantity: editData.quantity,
      customPrice: editData.customPrice,
      discountPercentage: editData.discountPercentage,
      notes: editData.notes,
      calculatedTotal: pricing.totalAmount
    };

    // Check if values actually changed
    const hasChanged = !prevValuesRef.current || 
      prevValuesRef.current.quantity !== currentValues.quantity ||
      prevValuesRef.current.customPrice !== currentValues.customPrice ||
      prevValuesRef.current.discountPercentage !== currentValues.discountPercentage ||
      prevValuesRef.current.notes !== currentValues.notes ||
      Math.abs((prevValuesRef.current.calculatedTotal || 0) - currentValues.calculatedTotal) > 0.01;

    if (hasChanged) {
      prevValuesRef.current = currentValues;
      
      const updatedItem: QuoteEditableItem = {
        ...item,
        requestedQuantity: editData.quantity,
        budgetExpectation: pricing.finalPrice,
        notes: editData.notes,
        customSpecifications: editData.customSpecifications,
        // Add custom fields for quote tracking
        customPrice: editData.customPrice,
        discountPercentage: editData.discountPercentage,
        calculatedTotal: pricing.totalAmount
      };
      
      onUpdate(updatedItem);
    }
  }, [editData.quantity, editData.customPrice, editData.discountPercentage, editData.notes, pricing.totalAmount, pricing.finalPrice, item, editData.customSpecifications, onUpdate]);

  if (!catalogItem) {
    return (
      <div className={styles.errorCard}>
        <p>⚠️ Catalog item not found: {item.masterItemId}</p>
        <button className="ds-btn ds-btn-danger" onClick={onRemove}>
          Remove Item
        </button>
      </div>
    );
  }

  const handleQuantityChange = (value: number) => {
    if (value > 0 && value <= 999999) {
      setEditData(prev => ({ ...prev, quantity: value }));
    }
  };

  const handleDiscountChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      setEditData(prev => ({ ...prev, discountPercentage: value }));
    }
  };

  const handleCustomPriceChange = (value: number | undefined) => {
    setEditData(prev => ({ ...prev, customPrice: value }));
  };

  const handleNotesChange = (value: string) => {
    setEditData(prev => ({ ...prev, notes: value }));
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
    setEditData(prev => ({
      ...prev,
      customSpecifications: {
        ...prev.customSpecifications,
        [specificationKey]: specificationValue
      }
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
    setEditData(prev => {
      const { [key]: removed, ...remaining } = prev.customSpecifications;
      return { ...prev, customSpecifications: remaining };
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


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUnitForItem = (itemId: string): string => {
    if (itemId.includes('fabric') || itemId.includes('cotton') || itemId.includes('silk')) return 'meter';
    if (itemId.includes('button')) return 'piece';
    if (itemId.includes('dye') || itemId.includes('dyeing') || itemId.includes('service')) return 'meter';
    return 'unit';
  };

  return (
    <div className={`${styles.itemEditor} ${index % 2 === 0 ? styles.even : styles.odd} ${!isExpanded ? styles.collapsed : ''}`}>
      {/* Item Header */}
      <div className={styles.itemHeader}>
        <div 
          className={styles.headerClickable}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={styles.itemInfo}>
            <span className={styles.itemCode}>{catalogItem.code}</span>
            <span className={styles.itemName}>{catalogItem.name}</span>
            {businessModel === 'job_work' && catalogItem.classification === 'material' && (
              <span className={styles.jobWorkNote}>
                ⚠️ Material not included in job work pricing
              </span>
            )}
          </div>
          <div className={styles.headerRight}>
            <div className={styles.totalPreview}>
              {formatCurrency(pricing.totalAmount)}
            </div>
            <span className={styles.collapseIcon}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>
        <button 
          className={styles.removeButton}
          onClick={onRemove}
          title="Remove item"
        >
          ×
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Main Editor Row */}
          <div className={styles.editorRow}>
            {/* Quantity Editor */}
            <div className={styles.editorField}>
          <label>Quantity</label>
          <div className={styles.quantityEditor}>
            <button 
              className={styles.quantityBtn}
              onClick={() => handleQuantityChange(editData.quantity - 1)}
              disabled={editData.quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              className={styles.quantityInput}
              min="1"
              max="999999"
            />
            <button 
              className={styles.quantityBtn}
              onClick={() => handleQuantityChange(editData.quantity + 1)}
            >
              +
            </button>
          </div>
          <div className={styles.fieldNote}>
            {catalogItem.businessRules.minimumQuantity} min • {catalogItem.businessRules.maximumQuantity || '∞'} max
          </div>
        </div>

        {/* Pricing Editor */}
        <div className={styles.editorField}>
          <label>Unit Price</label>
          <div className={styles.priceEditor}>
            {!editData.customPrice ? (
              <div className={styles.pricingBreakdown}>
                <div className={styles.pricingRow}>
                  <span className={styles.pricingLabel}>Base Catalog Rate:</span>
                  <span className={styles.pricingValue}>{formatCurrency(pricing.basePrice)} per {getUnitForItem(item.masterItemId)}</span>
                </div>
                {pricing.volumeDiscount > 0 && (
                  <div className={styles.pricingRow}>
                    <span className={styles.pricingLabel}>Volume Discount ({pricing.volumeDiscount}%):</span>
                    <span className={styles.pricingValue}>-{formatCurrency(pricing.basePrice - pricing.effectiveRate)} per {getUnitForItem(item.masterItemId)}</span>
                  </div>
                )}
                <div className={styles.pricingRow}>
                  <span className={styles.pricingLabel}>Effective Rate:</span>
                  <span className={styles.pricingValue}>{formatCurrency(pricing.effectiveRate)} per {getUnitForItem(item.masterItemId)}</span>
                </div>
              </div>
            ) : (
              <div className={styles.catalogPrice}>
                Custom Price: {formatCurrency(pricing.basePrice)}
              </div>
            )}
            <label className={styles.customPriceToggle}>
              <input
                type="checkbox"
                checked={!!editData.customPrice}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleCustomPriceChange(pricing.basePrice);
                  } else {
                    handleCustomPriceChange(undefined);
                  }
                }}
              />
              Custom Price
            </label>
            {editData.customPrice && (
              <input
                type="number"
                value={editData.customPrice}
                onChange={(e) => handleCustomPriceChange(parseFloat(e.target.value) || 0)}
                className={styles.customPriceInput}
                min="0"
                step="0.01"
                placeholder="Enter custom price"
              />
            )}
          </div>
        </div>

        {/* Discount Editor */}
        <div className={styles.editorField}>
          <label>Discount %</label>
          <div className={styles.discountEditor}>
            <input
              type="range"
              min="0"
              max="100"
              value={editData.discountPercentage}
              onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
              className={styles.discountSlider}
            />
            <input
              type="number"
              value={editData.discountPercentage}
              onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
              className={styles.discountInput}
              min="0"
              max="100"
              step="0.1"
            />
            {pricing.discountAmount > 0 && (
              <div className={styles.discountAmount}>
                -{formatCurrency(pricing.discountAmount)}
              </div>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className={styles.editorField}>
          <label>Total Amount</label>
          <div className={styles.totalAmount}>
            {formatCurrency(pricing.totalAmount)}
          </div>
          <div className={styles.calculationBreakdown}>
            <div className={styles.unitBreakdown}>
              {formatCurrency(pricing.finalPrice)} × {editData.quantity} {getUnitForItem(item.masterItemId)}s
            </div>
            {(pricing.volumeDiscount > 0 || editData.discountPercentage > 0) && (
              <div className={styles.savingsBreakdown}>
                {pricing.volumeDiscount > 0 && (
                  <div className={styles.savingsItem}>
                    Volume Savings: {formatCurrency(pricing.volumeDiscountAmount)}
                  </div>
                )}
                {editData.discountPercentage > 0 && (
                  <div className={styles.savingsItem}>
                    Manual Discount: {formatCurrency(pricing.discountAmount)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className={styles.expandableSection}>
        {/* Notes Editor */}
        <div className={styles.notesEditor}>
          <label htmlFor={`notes-${item.masterItemId}`}>Notes & Requirements</label>
          <textarea
            id={`notes-${item.masterItemId}`}
            value={editData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any special requirements, notes, or instructions for this item..."
            className={styles.notesTextarea}
            rows={2}
          />
        </div>

        {/* Custom Specifications */}
        <div className={styles.specificationsEditor}>
          <div className={styles.specificationsHeader}>
            <label>Custom Specifications</label>
          </div>

          {/* Existing Specifications List */}
          {Object.keys(editData.customSpecifications).length > 0 && (
            <div className={styles.specificationsList}>
              {Object.entries(editData.customSpecifications).map(([key, value]) => (
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
          {Object.keys(editData.customSpecifications).length === 0 && !isAddingSpec && (
            <div className={styles.emptySpecifications}>
              No custom specifications added
            </div>
          )}

          {/* Add Specification Button at Bottom */}
          <button 
            className={styles.addSpecButton}
            onClick={() => setIsAddingSpec(true)}
            disabled={isAddingSpec}
          >
            + Add Specification
          </button>
        </div>
      </div>

      {/* Item Details Summary */}
      <div className={styles.itemSummary}>
        <div className={styles.summaryRow}>
          <span>Category:</span>
          <span>{catalogItem.category.replace('_', ' ')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Unit:</span>
          <span>{formatUnit.getDisplayUnit(catalogItem.pricing.salesOrderPricing[0]?.unit || 'per_unit', 'rate')}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Quality:</span>
          <span>{catalogItem.specifications.qualityGrade}</span>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

export default QuoteItemEditor;