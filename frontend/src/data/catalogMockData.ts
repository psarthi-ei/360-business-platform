/**
 * Master Item Catalog - Dual Business Model Support
 * 
 * This file contains all interfaces and mock data for the Master Item Catalog system
 * that enables catalog-driven architecture for both Sales Orders and Job Work business models.
 * 
 * Architecture Compliance:
 * - Zero code duplication (new catalog system)
 * - TypeScript compliance (no any types)
 * - Business logic separation (pure data structures)
 * - Configuration-driven design support
 */

// ===== CORE INTERFACES =====

/**
 * Master Item Entity - Central catalog item definition
 * Supports dual business model pricing and applicability
 */
export interface MasterItem {
  id: string;                              // Unique identifier
  code: string;                            // Business code (e.g., CTN-100-WHT)
  name: string;                            // Display name
  description: string;                     // Detailed description
  category: ItemCategory;                  // Item classification
  classification: ItemClassification;     // Material/Service type
  specifications: ItemSpecifications;     // Technical parameters
  businessRules: BusinessRules;           // Business constraints
  applicability: BusinessModelApplicability; // Sales/JobWork/Both
  pricing: DualPricingStructure;          // Dual pricing model
  metadata: ItemMetadata;                 // Additional info
}

/**
 * Item Categories - Textile Industry Specific
 */
export type ItemCategory = 
  | 'raw_material'      // Cotton, silk, synthetic fabrics
  | 'accessory'         // Buttons, zippers, threads
  | 'consumable'        // Dyes, chemicals, packaging
  | 'service'           // Processing services
  | 'equipment_time';   // Machine hours, setup time

/**
 * Item Classification - High-level grouping
 */
export type ItemClassification = 'material' | 'service' | 'equipment' | 'consumable';

/**
 * Business Model Applicability - Core dual business model support
 */
export type BusinessModelApplicability = 'sales_only' | 'job_work_only' | 'both';

/**
 * Dual Pricing Structure - Core innovation for business model differentiation
 * Enables different pricing strategies for Sales Orders vs Job Work
 */
export interface DualPricingStructure {
  salesOrderPricing: PricingTier[];       // Higher margins, material risk premiums
  jobWorkPricing: PricingTier[];          // Competitive service rates, volume incentives
  volumeDiscounts: VolumeDiscount[];      // Volume-based discounts
  seasonalAdjustments?: SeasonalPricing[]; // Market-driven pricing flexibility
}

/**
 * Pricing Tier - Quantity-based pricing structure
 */
export interface PricingTier {
  baseRate: number;                       // Base price per unit
  currency: 'INR';                        // Currency (Indian Rupees)
  unit: string;                           // Unit of measurement (per_meter, per_kg, per_hour, per_piece)
  minimumQuantity: number;                // Minimum quantity for this tier
  maximumQuantity?: number;               // Maximum quantity for this tier
  effectiveDate: string;                  // Price validity start date
  expiryDate?: string;                    // Price validity end date
}

/**
 * Volume Discount - Incentivizes larger orders
 */
export interface VolumeDiscount {
  thresholdQuantity: number;              // Quantity threshold for discount
  discountPercentage: number;             // Discount percentage
  businessModel: 'sales_order' | 'job_work' | 'both'; // Applicable business model
}

/**
 * Seasonal Pricing - Market flexibility
 */
export interface SeasonalPricing {
  seasonName: string;                     // Season identifier
  startDate: string;                      // Season start date
  endDate: string;                        // Season end date
  adjustmentPercentage: number;           // Price adjustment percentage
}

/**
 * Item Specifications - Technical parameters for textile items
 */
export interface ItemSpecifications {
  technicalParams: Record<string, string | number | boolean>; // GSM, width, color, composition, etc.
  qualityGrade: 'premium' | 'standard' | 'economy'; // Quality classification
  processingRequirements?: string[];      // Required processing steps
  compatibilityRules?: string[];         // Compatibility constraints
}

/**
 * Business Rules - Operational constraints and requirements
 */
export interface BusinessRules {
  minimumQuantity: number;                // Minimum order quantity
  maximumQuantity?: number;               // Maximum capacity constraint
  leadTimeDays: number;                   // Processing/delivery time
  supplierReferences?: string[];          // Linked supplier IDs
  seasonalAvailability?: boolean;         // Seasonal availability flag
  qualityCertifications?: string[];       // Quality standards and certifications
}

/**
 * Item Metadata - Additional tracking information
 */
export interface ItemMetadata {
  createdDate: string;                    // Creation timestamp
  lastUpdated: string;                    // Last update timestamp
  createdBy: string;                      // Creator reference
  tags: string[];                         // Search and categorization tags
}

// ===== SUPPORTING TYPES =====

/**
 * Price Calculation Result - Output of pricing engine
 */
export interface PriceCalculation {
  basePrice: number;                      // Base price before discounts
  volumeDiscount: number;                 // Applied volume discount percentage
  finalPrice: number;                     // Final price after discounts
  appliedTier: PricingTier;              // Pricing tier that was applied
  discountDetails?: VolumeDiscount;       // Details of applied volume discount
}

/**
 * Item Filters - Search and filtering criteria
 */
export interface ItemFilters {
  category?: ItemCategory;                // Filter by category
  classification?: ItemClassification;   // Filter by classification
  qualityGrade?: 'premium' | 'standard' | 'economy'; // Filter by quality
  priceRange?: { min: number; max: number }; // Filter by price range
  businessModel?: 'sales' | 'job_work';  // Filter by business model applicability
}

/**
 * Validation Result - Item selection validation output
 */
export interface ValidationResult {
  isValid: boolean;                       // Overall validation status
  errors: string[];                       // Validation errors
  warnings: string[];                     // Validation warnings
}

/**
 * Selected Item - Item selection with quantity
 */
export interface SelectedItem {
  itemId: string;                         // Reference to master item
  quantity: number;                       // Selected quantity
  customSpecifications?: Record<string, string>; // Custom specifications
}

// ===== MOCK DATA =====

/**
 * Master Catalog Items - Comprehensive textile industry catalog
 * Includes raw materials, processing services, equipment time, and accessories
 * with dual pricing structures for both Sales Orders and Job Work business models
 */
export const masterCatalogItems: MasterItem[] = [
  // ===== PROCESSING SERVICES (Both Business Models) =====

  {
    id: 'dyeing-001',
    code: 'DYE-REACTIVE-STD',
    name: 'Reactive Dyeing Service - Standard Colors',
    description: 'Professional reactive dyeing service for cotton and cotton blends using standard color palette',
    category: 'service',
    classification: 'service',
    applicability: 'both',
    specifications: {
      technicalParams: {
        colorFastness: 'Grade 4-5',
        washFastness: 'Grade 4',
        processTime: '8-12 hours',
        temperatureRange: '60-80°C',
        dyeTypes: 'Reactive dyes'
      },
      qualityGrade: 'standard',
      processingRequirements: ['fabric_inspection', 'color_matching', 'post_wash'],
      compatibilityRules: ['cotton_fabrics', 'cotton_blends', 'cellulose_fibers']
    },
    businessRules: {
      minimumQuantity: 50,
      maximumQuantity: 2000,
      leadTimeDays: 2,
      supplierReferences: [],
      seasonalAvailability: true,
      qualityCertifications: ['ISO-9001', 'OEKO-TEX-Standard-100']
    },
    pricing: {
      salesOrderPricing: [
        { baseRate: 85, unit: 'per_meter', minimumQuantity: 50, maximumQuantity: 499, currency: 'INR', effectiveDate: '2024-01-01' },
        { baseRate: 78, unit: 'per_meter', minimumQuantity: 500, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      jobWorkPricing: [
        { baseRate: 65, unit: 'per_meter', minimumQuantity: 50, maximumQuantity: 499, currency: 'INR', effectiveDate: '2024-01-01' },
        { baseRate: 58, unit: 'per_meter', minimumQuantity: 500, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      volumeDiscounts: [
        { thresholdQuantity: 500, discountPercentage: 8, businessModel: 'both' },
        { thresholdQuantity: 1000, discountPercentage: 12, businessModel: 'job_work' },
        { thresholdQuantity: 1500, discountPercentage: 10, businessModel: 'sales_order' }
      ]
    },
    metadata: {
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-12',
      createdBy: 'system',
      tags: ['dyeing', 'reactive', 'standard', 'service', 'cotton', 'color']
    }
  },

  {
    id: 'dyeing-002',
    code: 'DYE-REACTIVE-PRM',
    name: 'Reactive Dyeing Service - Premium Colors',
    description: 'Premium reactive dyeing service with custom color matching and superior fastness properties',
    category: 'service',
    classification: 'service',
    applicability: 'both',
    specifications: {
      technicalParams: {
        colorFastness: 'Grade 5',
        washFastness: 'Grade 4-5',
        processTime: '10-14 hours',
        temperatureRange: '70-85°C',
        dyeTypes: 'Premium reactive dyes'
      },
      qualityGrade: 'premium',
      processingRequirements: ['fabric_inspection', 'custom_color_matching', 'multiple_wash_cycles', 'color_consistency_check'],
      compatibilityRules: ['cotton_fabrics', 'cotton_blends', 'linen', 'viscose']
    },
    businessRules: {
      minimumQuantity: 100,
      maximumQuantity: 1500,
      leadTimeDays: 3,
      supplierReferences: [],
      seasonalAvailability: true,
      qualityCertifications: ['ISO-9001', 'OEKO-TEX-Standard-100', 'GOTS-Processing']
    },
    pricing: {
      salesOrderPricing: [
        { baseRate: 145, unit: 'per_meter', minimumQuantity: 100, maximumQuantity: 499, currency: 'INR', effectiveDate: '2024-01-01' },
        { baseRate: 135, unit: 'per_meter', minimumQuantity: 500, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      jobWorkPricing: [
        { baseRate: 120, unit: 'per_meter', minimumQuantity: 100, maximumQuantity: 499, currency: 'INR', effectiveDate: '2024-01-01' },
        { baseRate: 110, unit: 'per_meter', minimumQuantity: 500, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      volumeDiscounts: [
        { thresholdQuantity: 750, discountPercentage: 6, businessModel: 'both' },
        { thresholdQuantity: 1200, discountPercentage: 10, businessModel: 'job_work' }
      ]
    },
    metadata: {
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-12',
      createdBy: 'system',
      tags: ['dyeing', 'reactive', 'premium', 'service', 'custom', 'high-fastness']
    }
  },

  {
    id: 'finishing-001',
    code: 'FIN-CAL-STD',
    name: 'Calendering Service - Standard',
    description: 'Standard calendering service for smooth finish and improved luster',
    category: 'service',
    classification: 'service',
    applicability: 'both',
    specifications: {
      technicalParams: {
        pressure: '200-300 kg/cm',
        temperature: '160-180°C',
        speed: '15-20 m/min',
        finish: 'Smooth, lustrous'
      },
      qualityGrade: 'standard',
      processingRequirements: ['moisture_conditioning', 'temperature_control'],
      compatibilityRules: ['cotton_fabrics', 'cotton_polyester_blends']
    },
    businessRules: {
      minimumQuantity: 100,
      maximumQuantity: 3000,
      leadTimeDays: 1,
      supplierReferences: [],
      seasonalAvailability: true,
      qualityCertifications: ['ISO-9001']
    },
    pricing: {
      salesOrderPricing: [
        { baseRate: 35, unit: 'per_meter', minimumQuantity: 100, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      jobWorkPricing: [
        { baseRate: 28, unit: 'per_meter', minimumQuantity: 100, currency: 'INR', effectiveDate: '2024-01-01' }
      ],
      volumeDiscounts: [
        { thresholdQuantity: 1000, discountPercentage: 8, businessModel: 'both' },
        { thresholdQuantity: 2000, discountPercentage: 12, businessModel: 'job_work' }
      ]
    },
    metadata: {
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-10',
      createdBy: 'system',
      tags: ['finishing', 'calendering', 'standard', 'service', 'luster', 'smooth']
    }
  }
];

// ===== MOCK BUSINESS LOGIC FUNCTIONS =====
// Note: These functions simulate backend service logic for UI development
// In production, these will be replaced by actual backend API calls

/**
 * Get items applicable to specific business model
 * Simulates backend filtering by business model context
 */
export const getApplicableItems = (businessModel: 'sales' | 'job_work'): MasterItem[] => {
  const targetApplicability = businessModel === 'sales' ? 'sales_only' : 'job_work_only';
  return masterCatalogItems.filter(item => 
    item.applicability === targetApplicability || item.applicability === 'both'
  );
};

/**
 * Get specific item by ID
 * Simulates backend item lookup
 */
export const getItemById = (itemId: string): MasterItem | undefined => {
  return masterCatalogItems.find(item => item.id === itemId);
};

/**
 * Dual Pricing Calculation Engine (MOCK)
 * Core innovation: Different pricing based on business model context
 * In production: This logic will be in backend pricing service
 */
export const calculateItemPrice = (
  itemId: string, 
  quantity: number, 
  businessModel: 'sales' | 'job_work'
): PriceCalculation => {
  const item = getItemById(itemId);
  if (!item) {
    throw new Error(`Item ${itemId} not found in catalog`);
  }

  // Get applicable pricing tiers based on business model
  const pricingTiers = businessModel === 'sales' 
    ? item.pricing.salesOrderPricing 
    : item.pricing.jobWorkPricing;

  if (pricingTiers.length === 0) {
    throw new Error(`No pricing available for ${businessModel} business model for item ${item.name}`);
  }

  // Find applicable tier based on quantity (highest qualifying tier)
  const applicableTiers = pricingTiers.filter(tier => quantity >= tier.minimumQuantity);
  if (applicableTiers.length === 0) {
    throw new Error(`Quantity ${quantity} below minimum order quantity for ${item.name}`);
  }

  // Sort by minimum quantity descending to get the highest qualifying tier
  const tier = applicableTiers.sort((a, b) => b.minimumQuantity - a.minimumQuantity)[0];

  // Calculate base price
  const basePrice = tier.baseRate * quantity;

  // Apply volume discounts
  const applicableDiscounts = item.pricing.volumeDiscounts
    .filter(discount => 
      quantity >= discount.thresholdQuantity && 
      (discount.businessModel === businessModel || discount.businessModel === 'both')
    )
    .sort((a, b) => b.thresholdQuantity - a.thresholdQuantity); // Highest qualifying discount

  const volumeDiscount = applicableDiscounts.length > 0 ? applicableDiscounts[0] : undefined;
  const discountAmount = volumeDiscount 
    ? basePrice * volumeDiscount.discountPercentage / 100 
    : 0;

  return {
    basePrice,
    volumeDiscount: volumeDiscount?.discountPercentage || 0,
    finalPrice: basePrice - discountAmount,
    appliedTier: tier,
    discountDetails: volumeDiscount
  };
};

/**
 * Advanced Search and Filtering (MOCK)
 * Simulates backend search service with full-text and filter capabilities
 */
export const searchCatalogItems = (
  query: string = '', 
  filters: ItemFilters = {}, 
  businessModel?: 'sales' | 'job_work'
): MasterItem[] => {
  // Start with business model filtered items if specified
  let items = businessModel 
    ? getApplicableItems(businessModel)
    : [...masterCatalogItems];

  // Apply text search across multiple fields
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    items = items.filter(item => {
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        // Search in technical parameters
        Object.values(item.specifications.technicalParams).some(param => 
          String(param).toLowerCase().includes(searchTerm)
        )
      );
    });
  }

  // Apply category filter
  if (filters.category) {
    items = items.filter(item => item.category === filters.category);
  }

  // Apply classification filter
  if (filters.classification) {
    items = items.filter(item => item.classification === filters.classification);
  }

  // Apply quality grade filter
  if (filters.qualityGrade) {
    items = items.filter(item => item.specifications.qualityGrade === filters.qualityGrade);
  }

  // Apply price range filter (based on base rate of first pricing tier)
  if (filters.priceRange) {
    items = items.filter(item => {
      const pricingTiers = filters.businessModel === 'job_work' 
        ? item.pricing.jobWorkPricing 
        : item.pricing.salesOrderPricing;
      
      if (pricingTiers.length === 0) return false;
      
      const baseRate = pricingTiers[0].baseRate;
      return baseRate >= filters.priceRange!.min && baseRate <= filters.priceRange!.max;
    });
  }

  return items;
};

/**
 * Item Selection Validation (MOCK)
 * Simulates backend business rule validation
 */
export const validateItemSelection = (
  selectedItems: SelectedItem[],
  businessModel: 'sales' | 'job_work'
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  selectedItems.forEach(({ itemId, quantity, customSpecifications }) => {
    const item = getItemById(itemId);
    if (!item) {
      errors.push(`Item ${itemId} not found in catalog`);
      return;
    }

    // Check business model applicability
    if (item.applicability !== 'both' && item.applicability !== businessModel + '_only') {
      errors.push(`${item.name} is not available for ${businessModel} business model`);
    }

    // Check quantity constraints
    if (quantity < item.businessRules.minimumQuantity) {
      errors.push(`${item.name}: Minimum quantity is ${item.businessRules.minimumQuantity} ${item.pricing.salesOrderPricing[0]?.unit || 'units'}`);
    }

    if (item.businessRules.maximumQuantity && quantity > item.businessRules.maximumQuantity) {
      errors.push(`${item.name}: Maximum quantity is ${item.businessRules.maximumQuantity} ${item.pricing.salesOrderPricing[0]?.unit || 'units'}`);
    }

    // Lead time warnings
    if (item.businessRules.leadTimeDays > 7) {
      warnings.push(`${item.name}: Extended lead time of ${item.businessRules.leadTimeDays} days`);
    }

    // Seasonal availability warnings
    if (item.businessRules.seasonalAvailability === false) {
      warnings.push(`${item.name}: Limited seasonal availability - confirm stock before ordering`);
    }

    // Special processing requirements
    if (item.specifications.processingRequirements && item.specifications.processingRequirements.length > 0) {
      warnings.push(`${item.name}: Requires special processing: ${item.specifications.processingRequirements.join(', ')}`);
    }
  });

  // Cross-item compatibility validation
  const materials = selectedItems
    .map(si => getItemById(si.itemId))
    .filter((item): item is MasterItem => item !== undefined)
    .filter(item => item.classification === 'material');

  const services = selectedItems
    .map(si => getItemById(si.itemId))
    .filter((item): item is MasterItem => item !== undefined)
    .filter(item => item.classification === 'service');

  // Check material-service compatibility
  materials.forEach(material => {
    services.forEach(service => {
      if (service.specifications.compatibilityRules && material.specifications.compatibilityRules) {
        const materialRules = material.specifications.compatibilityRules;
        const serviceRules = service.specifications.compatibilityRules;
        
        // Simple compatibility check - in production this would be more sophisticated
        const hasCompatibility = materialRules.some(rule => serviceRules.includes(rule));
        if (!hasCompatibility) {
          warnings.push(`Potential compatibility issue between ${material.name} and ${service.name} - please verify technical requirements`);
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Get items by category (MOCK)
 * Simulates backend category-based filtering
 */
export const getItemsByCategory = (category: ItemCategory, businessModel?: 'sales' | 'job_work'): MasterItem[] => {
  const items = businessModel ? getApplicableItems(businessModel) : masterCatalogItems;
  return items.filter(item => item.category === category);
};

/**
 * Get items by classification (MOCK)
 * Simulates backend classification-based filtering
 */
export const getItemsByClassification = (classification: ItemClassification, businessModel?: 'sales' | 'job_work'): MasterItem[] => {
  const items = businessModel ? getApplicableItems(businessModel) : masterCatalogItems;
  return items.filter(item => item.classification === classification);
};

/**
 * Batch price calculation for multiple items (MOCK)
 * Simulates backend bulk pricing service
 */
export const calculateBatchPricing = (
  items: { itemId: string; quantity: number }[],
  businessModel: 'sales' | 'job_work'
): { itemId: string; calculation: PriceCalculation; error?: string }[] => {
  return items.map(({ itemId, quantity }) => {
    try {
      const calculation = calculateItemPrice(itemId, quantity, businessModel);
      return { itemId, calculation };
    } catch (error) {
      return { 
        itemId, 
        calculation: { basePrice: 0, volumeDiscount: 0, finalPrice: 0 } as PriceCalculation,
        error: error instanceof Error ? error.message : 'Unknown pricing error'
      };
    }
  });
};

/**
 * Get catalog metrics for dashboard (MOCK)
 * Simulates backend analytics service
 */
export const getCatalogMetrics = () => {
  const metrics = {
    totalItems: masterCatalogItems.length,
    byCategory: {} as Record<ItemCategory, number>,
    byApplicability: {
      sales_only: 0,
      job_work_only: 0,
      both: 0
    },
    byClassification: {} as Record<ItemClassification, number>
  };

  masterCatalogItems.forEach(item => {
    // Count by category
    metrics.byCategory[item.category] = (metrics.byCategory[item.category] || 0) + 1;
    
    // Count by applicability
    metrics.byApplicability[item.applicability]++;
    
    // Count by classification
    metrics.byClassification[item.classification] = (metrics.byClassification[item.classification] || 0) + 1;
  });

  return metrics;
};

/**
 * Get recommended items (MOCK)
 * Simulates backend recommendation engine
 */
export const getRecommendedItems = (
  baseItemId: string, 
  businessModel: 'sales' | 'job_work',
  limit: number = 5
): MasterItem[] => {
  const baseItem = getItemById(baseItemId);
  if (!baseItem) return [];

  // Simple recommendation logic based on category and tags
  const candidates = getApplicableItems(businessModel)
    .filter(item => item.id !== baseItemId)
    .filter(item => 
      item.category === baseItem.category || 
      item.metadata.tags.some(tag => baseItem.metadata.tags.includes(tag))
    )
    .slice(0, limit);

  return candidates;
};

// ===== CUSTOM SPECIFICATIONS SYSTEM =====

/**
 * Specification Type Definition for Dynamic Specification Entry
 * Supports structured specification types with smart input methods
 */
export interface SpecificationType {
  id: string;
  label: string;
  inputType: 'dropdown' | 'number' | 'text';
  options?: string[];
  unit?: string;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Predefined Specification Types for Textile Industry
 * Provides structured options for common textile specifications
 */
export const SPECIFICATION_TYPES: SpecificationType[] = [
  {
    id: 'color',
    label: 'Color',
    inputType: 'text',
    placeholder: 'e.g., Red, Blue, Pantone 186C'
  },
  {
    id: 'finish',
    label: 'Finish',
    inputType: 'dropdown',
    options: ['Matte', 'Glossy', 'Anti-wrinkle', 'Water-resistant', 'Brushed', 'Calendered', 'Mercerized', 'Other']
  },
  {
    id: 'gsm',
    label: 'GSM (Weight)',
    inputType: 'number',
    unit: 'g/m²',
    placeholder: 'e.g., 120, 150, 180',
    validation: {
      min: 50,
      max: 1000
    }
  },
  {
    id: 'width',
    label: 'Width',
    inputType: 'dropdown',
    options: ['36"', '44"', '58"', '60"', '72"', '108"', 'Custom']
  },
  {
    id: 'quality_grade',
    label: 'Quality Grade',
    inputType: 'dropdown',
    options: ['A-Grade', 'B-Grade', 'Export Grade', 'Industrial', 'Premium', 'Commercial']
  },
  {
    id: 'thread_count',
    label: 'Thread Count',
    inputType: 'number',
    unit: 'TPI',
    placeholder: 'e.g., 200, 300, 400',
    validation: {
      min: 50,
      max: 1000
    }
  },
  {
    id: 'weave_type',
    label: 'Weave Type',
    inputType: 'dropdown',
    options: ['Plain', 'Twill', 'Satin', 'Oxford', 'Jacquard', 'Dobby', 'Other']
  },
  {
    id: 'shrinkage',
    label: 'Shrinkage %',
    inputType: 'number',
    unit: '%',
    placeholder: 'e.g., 2, 3, 5',
    validation: {
      min: 0,
      max: 20
    }
  },
  {
    id: 'opacity',
    label: 'Opacity',
    inputType: 'dropdown',
    options: ['Opaque', 'Semi-transparent', 'Transparent', 'Sheer']
  },
  {
    id: 'custom',
    label: 'Custom Specification',
    inputType: 'text',
    placeholder: 'Enter custom specification name and value'
  }
];

/**
 * Get Specification Type by ID
 */
export const getSpecificationType = (id: string): SpecificationType | undefined => {
  return SPECIFICATION_TYPES.find(type => type.id === id);
};

/**
 * Get All Specification Types
 */
export const getAllSpecificationTypes = (): SpecificationType[] => {
  return [...SPECIFICATION_TYPES];
};