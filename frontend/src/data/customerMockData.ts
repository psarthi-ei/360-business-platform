// Customer Mock Data for 360° Business Platform
// This file contains all customer-related data including BusinessProfile, loyalty, feedback, and customer management functions

// Type-only imports to avoid circular dependencies
import type { Quote, Lead } from './salesMockData';

// ===== SHARED INTERFACES (needed for cross-references) =====
export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  branch: string;
}

// ===== CUSTOMER-SPECIFIC INTERFACES =====
export interface CustomerLoyalty {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  annualVolume: number;
  totalBusinessValue: number;
  discountPercentage: number;
  paymentTerms: number; // days
  priorityLevel: number;
  benefits: string[];
  anniversaryDate: string;
  nextTierRequirement: string;
}

// Enhanced BusinessProfile replaces Customer entity
export interface BusinessProfile {
  id: string;
  companyName: string;
  gstNumber: string;
  panNumber?: string;
  registeredAddress: Address;
  deliveryAddresses?: Address[];
  contactPerson: string; // Primary contact
  phone: string;
  email: string;
  
  // Customer Status Evolution
  customerStatus: 'prospect' | 'customer' | 'inactive';
  becameCustomerDate?: string;
  firstPaymentProjectId?: string;
  originalLeadId?: string; // Link back to original lead that created this profile
  
  // Business Information
  businessType: string;
  specialization: string;
  employeeCount: string;
  establishedYear?: string;
  
  // Business Metrics
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  
  // Credit & Payment Management
  creditLimit: number;
  paymentScore: number; // 1-100 rating based on payment history
  creditStatus: 'excellent' | 'good' | 'watch' | 'hold';
  paymentBehavior: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Preferences and Relationships
  preferences: {
    paymentMethod: string;
    deliveryPreference: string;
    qualityRequirements: string;
    communication: string;
    specialNotes: string;
  };
  priority: 'hot' | 'warm' | 'cold';
  loyalty?: CustomerLoyalty;
  fabricPreferences?: string[];
}

// Customer Feedback - Module 11: Post-delivery experience tracking
export interface CustomerFeedback {
  id: string;
  businessProfileId: string; // Updated to use unified businessProfileId
  salesOrderId: string;
  feedbackDate: string;
  overallRating: number; // 1-5 stars
  qualityRating: number;
  deliveryRating: number;
  serviceRating: number;
  comments: string;
  loyaltyPointsEarned: number;
  wouldRecommend: boolean;
  improvements: string;
}

// Loyalty Point Transactions - Module 11: Customer loyalty program tracking
export interface LoyaltyTransaction {
  id: string;
  businessProfileId: string; // Updated to use unified businessProfileId
  transactionDate: string;
  type: 'earned' | 'redeemed';
  points: number;
  source: 'order_completion' | 'feedback' | 'referral' | 'anniversary' | 'discount_redemption';
  description: string;
  relatedOrderId?: string;
  relatedFeedbackId?: string;
}

// ===== CUSTOMER DATA =====
export const mockBusinessProfiles: BusinessProfile[] = [
  // Customer Companies (have made advance payments)
  {
    id: 'bp-gujarat-garments',
    companyName: 'Gujarat Garments',
    gstNumber: '24GUJARAT5566P9Q',
    panNumber: 'ABCDE1234F',
    registeredAddress: {
      street: '123 Textile Hub, Ring Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      country: 'India'
    },
    contactPerson: 'Kiran Patel',
    phone: '+91 99884 55667',
    email: 'kiran@gujaratgarments.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'March 15, 2024',
    firstPaymentProjectId: 'SO-002',
    
    businessType: 'Garment Manufacturing & Trading',
    specialization: 'Casual wear fabrics, export quality, bulk orders',
    employeeCount: '200+ employees',
    establishedYear: '2018',
    
    totalOrders: 1,
    activeOrders: 1,
    totalRevenue: 975000,
    averageOrderValue: 975000,
    
    creditLimit: 2000000,
    paymentScore: 85,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    preferences: {
      paymentMethod: 'RTGS/NEFT - HDFC Bank',
      deliveryPreference: 'Factory pickup with quality inspection',
      qualityRequirements: 'Export quality, consistent dyeing, GSM 140-180',
      communication: 'WhatsApp preferred for order updates, calls 9 AM - 6 PM',
      specialNotes: 'First-time customer - reliable and fast decision maker.'
    },
    priority: 'hot',
    fabricPreferences: ['Mixed casual wear fabrics', 'Cotton blends', 'Export quality materials']
  },
  {
    id: 'bp-baroda-fashion',
    companyName: 'Baroda Fashion House',
    gstNumber: '24BARODA7788Q1W',
    panNumber: 'FGHIJ5678K',
    registeredAddress: {
      street: '456 Fashion Street, Alkapuri',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390007',
      country: 'India'
    },
    contactPerson: 'Rajesh Mehta',
    phone: '+91 98765 43210',
    email: 'rajesh@barodafashion.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'April 02, 2024',
    firstPaymentProjectId: 'SO-004',
    
    businessType: 'Fashion House & Seasonal Collections',
    specialization: 'Seasonal fabrics, fashion trends, premium collections',
    employeeCount: '150+ employees',
    establishedYear: '2015',
    
    totalOrders: 1,
    activeOrders: 0,
    totalRevenue: 735000,
    averageOrderValue: 735000,
    
    creditLimit: 1500000,
    paymentScore: 95,
    creditStatus: 'excellent',
    paymentBehavior: 'excellent',
    
    preferences: {
      paymentMethod: 'RTGS - SBI Bank',
      deliveryPreference: 'Direct delivery to warehouse',
      qualityRequirements: 'Premium quality, color fastness, trendy designs',
      communication: 'Email preferred, calls for urgent matters only',
      specialNotes: 'Excellent payment behavior - completed first order successfully.'
    },
    priority: 'warm',
    fabricPreferences: ['Seasonal fashion fabrics', 'Trendy designs', 'Premium quality materials']
  }
];

// Customer Feedback Data - Post-delivery experience tracking
export const mockCustomerFeedback: CustomerFeedback[] = [
  {
    id: 'CF-2024-001',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-004',
    feedbackDate: 'May 10, 2024',
    overallRating: 5,
    qualityRating: 5,
    deliveryRating: 5,
    serviceRating: 5,
    comments: 'Outstanding quality and service! The fabric quality exceeded our expectations. Delivery was on time and packaging was perfect.',
    loyaltyPointsEarned: 150,
    wouldRecommend: true,
    improvements: 'Keep up the excellent work. Maybe offer more color variations.'
  },
  {
    id: 'CF-2024-002',
    businessProfileId: 'bp-gujarat-garments',
    salesOrderId: 'SO-002',
    feedbackDate: 'April 30, 2024',
    overallRating: 4,
    qualityRating: 4,
    deliveryRating: 4,
    serviceRating: 4,
    comments: 'Good quality fabric as always. Standard domestic grade met our requirements. Happy with the consistent service.',
    loyaltyPointsEarned: 110,
    wouldRecommend: true,
    improvements: 'Could improve packaging to prevent minor dust accumulation.'
  },
  {
    id: 'CF-2024-003',
    businessProfileId: 'bp-gujarat-garments',
    salesOrderId: 'SO-001',
    feedbackDate: 'April 20, 2024',
    overallRating: 4,
    qualityRating: 5,
    deliveryRating: 3,
    serviceRating: 4,
    comments: 'Excellent fabric quality perfect for export. However, delivery was delayed by 3 days which affected our export schedule.',
    loyaltyPointsEarned: 100,
    wouldRecommend: true,
    improvements: 'Please improve delivery timeline accuracy. Quality is excellent, maintain it.'
  },
  {
    id: 'CF-2024-004',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-003',
    feedbackDate: 'April 25, 2024',
    overallRating: 4,
    qualityRating: 4,
    deliveryRating: 4,
    serviceRating: 5,
    comments: 'First order experience was good. Industrial canvas quality is suitable for our applications. Service team was very helpful.',
    loyaltyPointsEarned: 85,
    wouldRecommend: true,
    improvements: 'As a new customer, appreciate the guidance. Looking forward to long-term partnership.'
  },
  {
    id: 'CF-2024-005',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-001-PREV',
    feedbackDate: 'February 15, 2024',
    overallRating: 4,
    qualityRating: 4,
    deliveryRating: 5,
    serviceRating: 4,
    comments: 'Previous order was also good. Consistent quality and timely delivery. This is why we keep coming back.',
    loyaltyPointsEarned: 120,
    wouldRecommend: true,
    improvements: 'Continue the good work. Maybe offer bulk order discounts.'
  }
];

// Loyalty Point Transactions Data - Customer loyalty program tracking
export const mockLoyaltyTransactions: LoyaltyTransaction[] = [
  {
    id: 'LT-2024-001',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'May 10, 2024',
    type: 'earned',
    points: 150,
    source: 'feedback',
    description: 'Points earned for 5-star feedback on SO-004',
    relatedOrderId: 'SO-004',
    relatedFeedbackId: 'CF-2024-001'
  },
  {
    id: 'LT-2024-002',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'April 26, 2024',
    type: 'earned',
    points: 75,
    source: 'order_completion',
    description: 'Points earned for completing order SO-004 (₹15.75L)',
    relatedOrderId: 'SO-004'
  },
  {
    id: 'LT-2024-003',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 30, 2024',
    type: 'earned',
    points: 110,
    source: 'feedback',
    description: 'Points earned for 4-star feedback on SO-002',
    relatedOrderId: 'SO-002',
    relatedFeedbackId: 'CF-2024-002'
  },
  {
    id: 'LT-2024-004',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 12, 2024',
    type: 'earned',
    points: 55,
    source: 'order_completion',
    description: 'Points earned for completing order SO-002 (₹11.55L)',
    relatedOrderId: 'SO-002'
  },
  {
    id: 'LT-2024-005',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 20, 2024',
    type: 'earned',
    points: 100,
    source: 'feedback',
    description: 'Points earned for feedback on SO-001 (export quality)',
    relatedOrderId: 'SO-001',
    relatedFeedbackId: 'CF-2024-003'
  },
  {
    id: 'LT-2024-006',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'April 25, 2024',
    type: 'earned',
    points: 85,
    source: 'feedback',
    description: 'Welcome bonus + feedback points for first order SO-003',
    relatedOrderId: 'SO-003',
    relatedFeedbackId: 'CF-2024-004'
  },
  {
    id: 'LT-2024-007',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'March 15, 2024',
    type: 'redeemed',
    points: 200,
    source: 'discount_redemption',
    description: 'Points redeemed for 2% discount on SO-004',
    relatedOrderId: 'SO-004'
  },
  {
    id: 'LT-2024-008',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'February 15, 2024',
    type: 'earned',
    points: 120,
    source: 'feedback',
    description: 'Points earned for previous order feedback',
    relatedFeedbackId: 'CF-2024-005'
  },
  {
    id: 'LT-2024-009',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'January 15, 2024',
    type: 'earned',
    points: 50,
    source: 'anniversary',
    description: 'Customer anniversary bonus - 2 years partnership',
  },
  {
    id: 'LT-2024-010',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'March 1, 2024',
    type: 'earned',
    points: 300,
    source: 'referral',
    description: 'Referral bonus for bringing Morbi Cotton Mills as new customer'
  }
];

// ===== UTILITY FUNCTIONS =====
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount).replace('₹', '₹');
};

// ===== CUSTOMER MANAGEMENT FUNCTIONS =====
export const getBusinessProfileById = (id: string): BusinessProfile | undefined => {
  return mockBusinessProfiles.find(profile => profile.id === id);
};

// Legacy compatibility function
export const getCustomerById = (id: string): BusinessProfile | undefined => {
  return getBusinessProfileById(id);
};

// Customer Loyalty Functions
export const getCustomerLoyaltyTier = (customerId: string): string => {
  const customer = getCustomerById(customerId);
  return customer?.loyalty?.tier || 'Bronze';
};

export const getCustomerDiscount = (customerId: string): number => {
  const customer = getCustomerById(customerId);
  return customer?.loyalty?.discountPercentage || 0;
};

export const getCustomersbyLoyaltyTier = (tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'): BusinessProfile[] => {
  return mockBusinessProfiles.filter(customer => customer.loyalty?.tier === tier);
};

// Business Analytics Functions
export const calculateTotalBusiness = (): number => {
  return mockBusinessProfiles.reduce((total, customer) => total + customer.totalRevenue, 0);
};

export const getTopCustomersByBusiness = (limit: number = 5): BusinessProfile[] => {
  return [...mockBusinessProfiles]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
};

export const getCustomersByPaymentStatus = (status: 'good' | 'overdue' | 'pending'): BusinessProfile[] => {
  return mockBusinessProfiles.filter(customer => customer.creditStatus === status);
};

export const getAverageOrderValue = (): number => {
  const totalOrders = mockBusinessProfiles.reduce((total, customer) => total + customer.totalOrders, 0);
  const totalBusiness = calculateTotalBusiness();
  return totalOrders > 0 ? totalBusiness / totalOrders : 0;
};

// Gujarat-Specific Business Logic
export const getCustomersByLocation = (location: string): BusinessProfile[] => {
  return mockBusinessProfiles.filter(customer => 
    customer.registeredAddress.city.toLowerCase().includes(location.toLowerCase())
  );
};

export const getCustomersBySpecialization = (specialization: string): BusinessProfile[] => {
  return mockBusinessProfiles.filter(customer => 
    customer.specialization.toLowerCase().includes(specialization.toLowerCase())
  );
};

export const getSeasonalCustomers = (): BusinessProfile[] => {
  return mockBusinessProfiles.filter(customer => 
    customer.preferences.specialNotes.toLowerCase().includes('seasonal') ||
    customer.specialization.toLowerCase().includes('wedding') ||
    customer.specialization.toLowerCase().includes('festival')
  );
};

// Loyalty Tier Calculation
export const calculateLoyaltyTier = (annualBusiness: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (annualBusiness >= 2500000) return 'Platinum';
  if (annualBusiness >= 1500000) return 'Gold';
  if (annualBusiness >= 700000) return 'Silver';
  return 'Bronze';
};

export const getNextTierRequirement = (currentTier: string, currentBusiness: number): string => {
  switch (currentTier) {
    case 'Bronze':
      return `Reach ₹${formatCurrency(700000)} annual business for Silver tier`;
    case 'Silver':
      return `Reach ₹${formatCurrency(1500000)} annual business for Gold tier`;
    case 'Gold':
      return `Reach ₹${formatCurrency(2500000)} annual business for Platinum tier`;
    case 'Platinum':
      return 'Maintain excellent payment record and business volume';
    default:
      return 'Complete first order successfully';
  }
};

// Customer Experience Functions
export const getCustomerFeedbackByOrderId = (salesOrderId: string): CustomerFeedback | undefined => {
  return mockCustomerFeedback.find(cf => cf.salesOrderId === salesOrderId);
};

export const getCustomerFeedbackByBusinessProfileId = (businessProfileId: string): CustomerFeedback[] => {
  return mockCustomerFeedback.filter(cf => cf.businessProfileId === businessProfileId);
};

// Legacy compatibility function
export const getCustomerFeedbackByCustomerId = (customerId: string): CustomerFeedback[] => {
  return getCustomerFeedbackByBusinessProfileId(customerId);
};

export const getAverageCustomerRating = (customerId: string): number => {
  const feedback = getCustomerFeedbackByCustomerId(customerId);
  if (feedback.length === 0) return 0;
  const totalRating = feedback.reduce((sum, cf) => sum + cf.overallRating, 0);
  return Math.round((totalRating / feedback.length) * 10) / 10;
};

// Loyalty Program Functions
export const getLoyaltyTransactionsByBusinessProfileId = (businessProfileId: string): LoyaltyTransaction[] => {
  return mockLoyaltyTransactions.filter(lt => lt.businessProfileId === businessProfileId);
};

// Legacy compatibility function
export const getLoyaltyTransactionsByCustomerId = (customerId: string): LoyaltyTransaction[] => {
  return getLoyaltyTransactionsByBusinessProfileId(customerId);
};

export const getCustomerLoyaltyPoints = (customerId: string): number => {
  const transactions = getLoyaltyTransactionsByCustomerId(customerId);
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'earned' ? total + transaction.points : total - transaction.points;
  }, 0);
};

export const getLoyaltyPointsEarned = (customerId: string): number => {
  const transactions = getLoyaltyTransactionsByCustomerId(customerId);
  return transactions
    .filter(t => t.type === 'earned')
    .reduce((total, t) => total + t.points, 0);
};

export const getLoyaltyPointsRedeemed = (customerId: string): number => {
  const transactions = getLoyaltyTransactionsByCustomerId(customerId);
  return transactions
    .filter(t => t.type === 'redeemed')
    .reduce((total, t) => total + t.points, 0);
};

export const getCustomerSatisfactionScore = (): number => {
  if (mockCustomerFeedback.length === 0) return 0;
  const totalRating = mockCustomerFeedback.reduce((sum, feedback) => sum + feedback.overallRating, 0);
  return Math.round((totalRating / mockCustomerFeedback.length) * 10) / 10;
};

export const getTopPerformingCustomers = (limit: number = 5): BusinessProfile[] => {
  return [...mockBusinessProfiles]
    .sort((a, b) => {
      const aRating = getAverageCustomerRating(a.id);
      const bRating = getAverageCustomerRating(b.id);
      return bRating - aRating;
    })
    .slice(0, limit);
};

// Customer-Sales Relationship Functions
// Simplified approach - return empty arrays for now to avoid circular dependencies
// These functions can be implemented properly later with a different architecture
export const getQuotesByCustomerId = (customerId: string): Quote[] => {
  // TODO: Implement without circular dependency
  // For now return empty to avoid import issues
  return [];
};

export const getLeadsByCustomerId = (customerId: string): Lead[] => {
  // TODO: Implement without circular dependency
  // For now return empty to avoid import issues
  return [];
};