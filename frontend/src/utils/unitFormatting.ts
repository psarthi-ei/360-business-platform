/**
 * Centralized Unit Formatting Utility
 * 
 * Handles consistent transformation of catalog unit data (e.g., "per_meter") 
 * into appropriate display formats based on context.
 * 
 * Source data uses underscore format for API/database consistency:
 * - per_meter, per_kg, per_hour, per_piece
 * 
 * Display contexts require different formats:
 * - Quantity: "3000 meter" (base unit only)
 * - Rate: "₹85 per meter" (rate indication)
 */

export type UnitContext = 'quantity' | 'rate';

export const formatUnit = {
  /**
   * Format unit for quantity display (base unit only)
   * @param unit Raw unit from catalog data (e.g., "per_meter")
   * @returns Base unit (e.g., "meter")
   * @example formatUnit.forQuantity("per_meter") → "meter"
   */
  forQuantity: (unit: string): string => {
    return unit.replace('per_', '');
  },

  /**
   * Format unit for rate/price display (with "per" prefix)
   * @param unit Raw unit from catalog data (e.g., "per_meter")
   * @returns Rate unit (e.g., "per meter")
   * @example formatUnit.forRate("per_meter") → "per meter"
   */
  forRate: (unit: string): string => {
    return unit.replace('per_', 'per ');
  },

  /**
   * Get appropriately formatted unit based on context
   * @param unit Raw unit from catalog data
   * @param context Display context (quantity vs rate)
   * @returns Formatted unit for display
   * @example 
   * formatUnit.getDisplayUnit("per_meter", "quantity") → "meter"
   * formatUnit.getDisplayUnit("per_meter", "rate") → "per meter"
   */
  getDisplayUnit: (unit: string, context: UnitContext): string => {
    switch (context) {
      case 'quantity':
        return formatUnit.forQuantity(unit);
      case 'rate':
        return formatUnit.forRate(unit);
      default:
        return unit; // Fallback to original
    }
  },

  /**
   * Check if unit is a rate unit (has "per_" prefix)
   * @param unit Unit string to check
   * @returns True if unit is a rate unit
   */
  isRateUnit: (unit: string): boolean => {
    return unit.startsWith('per_');
  },

  /**
   * Get base unit without any prefixes
   * @param unit Raw unit from catalog data
   * @returns Clean base unit
   * @example formatUnit.getBaseUnit("per_meter") → "meter"
   */
  getBaseUnit: (unit: string): string => {
    return unit.replace('per_', '');
  }
};

/**
 * Legacy support - matches existing component logic
 * @deprecated Use formatUnit.getDisplayUnit() instead
 */
export const formatUnitLegacy = (unit: string): string => {
  return unit.replace('per_', 'per ');
};