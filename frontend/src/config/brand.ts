/**
 * Brand Configuration
 * Centralized brand identity constants for the application
 */

export const BRAND_CONFIG = {
  // Company name displayed in headers and branding
  companyName: 'ElevateIdea',
  
  // Tagline displayed below company name
  tagline: 'Scaling Business with Technology',
  
  // Full company name for formal contexts
  fullCompanyName: 'ElevateIdea Technologies',
  
  // Platform product name
  platformName: 'ElevateBusiness 360°',
  
  // Platform description
  platformDescription: 'Complete Business Management',
  
  // Logo alt text
  logoAlt: 'ElevateIdea',
  
  // For website/marketing contexts
  websiteTitle: 'ElevateIdea Technologies - Complete 360° Business Platform for India\'s Textile Manufacturers'
} as const;

// Export individual constants for convenience
export const {
  companyName,
  tagline,
  fullCompanyName,
  platformName,
  platformDescription,
  logoAlt,
  websiteTitle
} = BRAND_CONFIG;