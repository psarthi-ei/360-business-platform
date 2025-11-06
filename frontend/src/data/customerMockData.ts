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
  creditStatus: 'excellent' | 'good' | 'watch' | 'hold' | 'new';
  paymentBehavior: 'excellent' | 'good' | 'fair' | 'poor' | 'new';
  
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

// Support Tickets - Customer support and issue tracking
export interface SupportTicket {
  id: string;
  businessProfileId: string;
  title: string;
  description: string;
  category: 'quality_issue' | 'delivery_delay' | 'payment_query' | 'technical_support' | 'general_inquiry' | 'complaint';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdDate: string;
  updatedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
  resolution?: string;
  customerSatisfaction?: number; // 1-5 rating after resolution
  relatedOrderId?: string;
  relatedPaymentId?: string;
  attachments?: string[];
  internalNotes?: string[];
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
    becameCustomerDate: 'March 15, 2025',
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
    becameCustomerDate: 'April 02, 2025',
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
  },
  
  // Prospect Companies (have quotes/orders but no payments yet)
  {
    id: 'bp-surat-wholesale',
    companyName: 'Surat Wholesale Market',
    gstNumber: '24STUVW1234X5Y6',
    panNumber: 'STUVW1234X',
    registeredAddress: {
      street: 'Shop No. 45, Wholesale Complex',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '394210',
      country: 'India'
    },
    contactPerson: 'Kiran Shah',
    phone: '+91 98765 43203',
    email: 'kiran@suratmarket.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Wholesale Trading',
    specialization: 'Bulk fabric trading, wholesale distribution',
    employeeCount: '25+ employees',
    establishedYear: '2022',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 1500000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'NEFT - Bank of India',
      deliveryPreference: 'Wholesale market delivery',
      qualityRequirements: 'Commercial grade, bulk quantities',
      communication: 'WhatsApp for quick updates, phone for negotiations',
      specialNotes: 'New prospect - wholesale trader with good market presence.'
    },
    priority: 'warm',
    fabricPreferences: ['Bulk fabrics', 'Commercial grade', 'Wholesale quantities']
  },
  {
    id: 'bp-rajkot-mills',
    companyName: 'Rajkot Cotton Mills',
    gstNumber: '24DEFGH5678I9J0',
    panNumber: 'DEFGH5678I',
    registeredAddress: {
      street: 'Industrial Area Phase-2',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360003',
      country: 'India'
    },
    contactPerson: 'Suresh Jethwa',
    phone: '+91 98765 43204',
    email: 'suresh@rajkotmills.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'October 25, 2025',
    firstPaymentProjectId: 'SO-006',
    
    businessType: 'Cotton Processing & Manufacturing',
    specialization: 'Cotton yarn, cotton fabrics, processing',
    employeeCount: '150+ employees',
    establishedYear: '2019',
    
    totalOrders: 1,
    activeOrders: 1,
    totalRevenue: 1800000,
    averageOrderValue: 1800000,
    
    creditLimit: 3000000,
    paymentScore: 85,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    loyalty: {
      tier: 'Silver',
      points: 1800,
      annualVolume: 1800000,
      totalBusinessValue: 1800000,
      discountPercentage: 3,
      paymentTerms: 30,
      priorityLevel: 3,
      benefits: ['Quality assurance', 'Standard processing', 'Cotton expertise'],
      anniversaryDate: 'October 25',
      nextTierRequirement: '₹2.7L more for Gold'
    },
    
    preferences: {
      paymentMethod: 'RTGS - State Bank of India',
      deliveryPreference: 'Factory delivery with quality inspection',
      qualityRequirements: 'Cotton grade quality, consistent supply',
      communication: 'Email preferred for documentation, calls for urgent matters',
      specialNotes: 'Established cotton mill - potential for large volume orders.'
    },
    priority: 'hot',
    fabricPreferences: ['Cotton fabrics', 'Cotton yarn', 'Raw cotton materials']
  },
  {
    id: 'bp-mumbai-exports',
    companyName: 'Mumbai Export House',
    gstNumber: '27KLMNO3456P7Q8',
    panNumber: 'KLMNO3456P',
    registeredAddress: {
      street: 'Trade Center, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400021',
      country: 'India'
    },
    contactPerson: 'Priya Merchant',
    phone: '+91 98765 43205',
    email: 'priya@mumbaiexports.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'October 28, 2025',
    firstPaymentProjectId: 'SO-007',
    
    businessType: 'Export Trading House',
    specialization: 'International textile exports, global trade',
    employeeCount: '75+ employees',
    establishedYear: '2020',
    
    totalOrders: 1,
    activeOrders: 1,
    totalRevenue: 2250000,
    averageOrderValue: 2250000,
    
    creditLimit: 5000000,
    paymentScore: 92,
    creditStatus: 'excellent',
    paymentBehavior: 'excellent',
    
    loyalty: {
      tier: 'Gold',
      points: 2250,
      annualVolume: 2250000,
      totalBusinessValue: 2250000,
      discountPercentage: 5,
      paymentTerms: 45,
      priorityLevel: 2,
      benefits: ['Export documentation', 'International support', 'Priority processing', 'Priority banking'],
      anniversaryDate: 'October 28',
      nextTierRequirement: '₹2.25L more for Platinum'
    },
    
    preferences: {
      paymentMethod: 'RTGS - HDFC Bank',
      deliveryPreference: 'Port delivery with export documentation',
      qualityRequirements: 'Export grade, international standards, proper certification',
      communication: 'Email for all communications with documentation',
      specialNotes: 'Export house - requires documentation support, potential for large orders.'
    },
    priority: 'hot',
    fabricPreferences: ['Export quality fabrics', 'International standards', 'Certified materials']
  },
  
  // Additional Customers (Phase 3)
  {
    id: 'bp-ahmedabad-fashion',
    companyName: 'Ahmedabad Fashion Exports',
    gstNumber: '24AHMED9876Q1R2',
    panNumber: 'AHMED9876Q',
    registeredAddress: {
      street: 'Export House, C.G. Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
      country: 'India'
    },
    contactPerson: 'Nikita Sharma',
    phone: '+91 98765 43206',
    email: 'nikita@ahmedabadfashion.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'September 15, 2025',
    firstPaymentProjectId: 'SO-008',
    
    businessType: 'Fashion Export House',
    specialization: 'Premium export fabrics, international fashion',
    employeeCount: '100+ employees',
    establishedYear: '2017',
    
    totalOrders: 2,
    activeOrders: 1,
    totalRevenue: 3150000,
    averageOrderValue: 1575000,
    
    creditLimit: 4000000,
    paymentScore: 98,
    creditStatus: 'excellent',
    paymentBehavior: 'excellent',
    
    loyalty: {
      tier: 'Gold',
      points: 3150,
      annualVolume: 3150000,
      totalBusinessValue: 3150000,
      discountPercentage: 5,
      paymentTerms: 45,
      priorityLevel: 2,
      benefits: ['Export documentation', 'International support', 'Priority processing', 'Priority banking'],
      anniversaryDate: 'September 15',
      nextTierRequirement: '₹1.35L more for Platinum'
    },
    
    preferences: {
      paymentMethod: 'RTGS - ICICI Bank',
      deliveryPreference: 'Port delivery with full export documentation',
      qualityRequirements: 'Premium export grade, international certifications',
      communication: 'Email with documentation, WhatsApp for quick updates',
      specialNotes: 'Premium export customer - excellent payment history, high volume orders.'
    },
    priority: 'hot',
    fabricPreferences: ['Premium export fabrics', 'Designer quality', 'International fashion trends']
  },
  {
    id: 'bp-bhavnagar-marine',
    companyName: 'Bhavnagar Marine Textiles',
    gstNumber: '24BHAVN5432S3T4',
    panNumber: 'BHAVN5432S',
    registeredAddress: {
      street: 'Marine Drive, Port Area',
      city: 'Bhavnagar',
      state: 'Gujarat',
      pincode: '364001',
      country: 'India'
    },
    contactPerson: 'Captain Vikram Singh',
    phone: '+91 98765 43207',
    email: 'vikram@bhavnagarmarine.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'August 20, 2025',
    firstPaymentProjectId: 'SO-009',
    
    businessType: 'Marine & Industrial Textiles',
    specialization: 'Marine-grade fabrics, industrial applications',
    employeeCount: '80+ employees',
    establishedYear: '2021',
    
    totalOrders: 2,
    activeOrders: 0,
    totalRevenue: 1950000,
    averageOrderValue: 975000,
    
    creditLimit: 2500000,
    paymentScore: 88,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    loyalty: {
      tier: 'Silver',
      points: 1950,
      annualVolume: 1950000,
      totalBusinessValue: 1950000,
      discountPercentage: 3,
      paymentTerms: 30,
      priorityLevel: 3,
      benefits: ['Quality assurance', 'Marine expertise', 'Industrial support'],
      anniversaryDate: 'August 20',
      nextTierRequirement: '₹55K more for Gold'
    },
    
    preferences: {
      paymentMethod: 'RTGS - Canara Bank',
      deliveryPreference: 'Direct port delivery, marine packaging',
      qualityRequirements: 'Marine-grade quality, saltwater resistant',
      communication: 'Phone preferred, email for documentation',
      specialNotes: 'Specialized marine customer - unique requirements, consistent orders.'
    },
    priority: 'warm',
    fabricPreferences: ['Marine-grade fabrics', 'Industrial textiles', 'Weather-resistant materials']
  },
  {
    id: 'bp-vadodara-crafts',
    companyName: 'Vadodara Handloom Crafts',
    gstNumber: '24VADOD7654U5V6',
    panNumber: 'VADOD7654U',
    registeredAddress: {
      street: 'Handloom Market, Sayajigunj',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390005',
      country: 'India'
    },
    contactPerson: 'Meera Desai',
    phone: '+91 98765 43208',
    email: 'meera@vadodaracrafts.com',
    
    customerStatus: 'customer',
    becameCustomerDate: 'July 10, 2025',
    firstPaymentProjectId: 'SO-010',
    
    businessType: 'Handloom & Craft Textiles',
    specialization: 'Traditional handloom, ethnic wear fabrics',
    employeeCount: '60+ employees',
    establishedYear: '2016',
    
    totalOrders: 3,
    activeOrders: 1,
    totalRevenue: 1125000,
    averageOrderValue: 375000,
    
    creditLimit: 1800000,
    paymentScore: 82,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    loyalty: {
      tier: 'Silver',
      points: 1125,
      annualVolume: 1125000,
      totalBusinessValue: 1125000,
      discountPercentage: 3,
      paymentTerms: 30,
      priorityLevel: 3,
      benefits: ['Quality assurance', 'Traditional designs', 'Handloom expertise'],
      anniversaryDate: 'July 10',
      nextTierRequirement: '₹3.75L more for Gold'
    },
    
    preferences: {
      paymentMethod: 'NEFT - Bank of Baroda',
      deliveryPreference: 'Warehouse delivery with careful handling',
      qualityRequirements: 'Traditional handloom quality, authentic textures',
      communication: 'WhatsApp for orders, calls for complex requirements',
      specialNotes: 'Traditional handloom specialist - appreciates quality over speed.'
    },
    priority: 'warm',
    fabricPreferences: ['Handloom fabrics', 'Traditional textiles', 'Ethnic wear materials']
  },
  
  // Additional Prospects (Phase 3)
  {
    id: 'bp-morbi-ceramics',
    companyName: 'Morbi Ceramics & Textiles',
    gstNumber: '24MORBI1234W7X8',
    panNumber: 'MORBI1234W',
    registeredAddress: {
      street: 'Industrial Estate, Wankaner Road',
      city: 'Morbi',
      state: 'Gujarat',
      pincode: '363641',
      country: 'India'
    },
    contactPerson: 'Harsh Patel',
    phone: '+91 98765 43209',
    email: 'harsh@morbiceramics.com',
    
    customerStatus: 'prospect',
    originalLeadId: 'L-2025-015',
    
    businessType: 'Ceramics & Industrial Textiles',
    specialization: 'Industrial fabrics, ceramic industry applications',
    employeeCount: '120+ employees',
    establishedYear: '2019',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 2000000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'RTGS - HDFC Bank',
      deliveryPreference: 'Factory delivery, industrial packaging',
      qualityRequirements: 'Industrial grade, heat resistant',
      communication: 'Email preferred, WhatsApp for urgent matters',
      specialNotes: 'Industrial prospect - ceramic industry expertise, potential for large orders.'
    },
    priority: 'hot',
    fabricPreferences: ['Industrial fabrics', 'Heat-resistant materials', 'Ceramic industry applications']
  },
  {
    id: 'bp-anand-dairy',
    companyName: 'Anand Dairy Textiles',
    gstNumber: '24ANAND8765Y9Z0',
    panNumber: 'ANAND8765Y',
    registeredAddress: {
      street: 'Cooperative Society, Milk Road',
      city: 'Anand',
      state: 'Gujarat',
      pincode: '388001',
      country: 'India'
    },
    contactPerson: 'Ravi Thakkar',
    phone: '+91 98765 43210',
    email: 'ravi@ananddairy.com',
    
    customerStatus: 'prospect',
    originalLeadId: 'L-2025-016',
    
    businessType: 'Dairy & Food Industry Textiles',
    specialization: 'Food-grade fabrics, dairy industry applications',
    employeeCount: '90+ employees',
    establishedYear: '2020',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 1500000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'NEFT - State Bank of India',
      deliveryPreference: 'Dairy facility delivery, food-grade packaging',
      qualityRequirements: 'Food-grade, hygiene certified',
      communication: 'Phone preferred, email for documentation',
      specialNotes: 'Food industry prospect - requires certified materials, cooperative background.'
    },
    priority: 'warm',
    fabricPreferences: ['Food-grade fabrics', 'Hygiene materials', 'Dairy industry applications']
  },
  {
    id: 'bp-gandhinagar-coop',
    companyName: 'Gandhinagar Textile Cooperative Society',
    gstNumber: '24GANDH4321A1B2',
    panNumber: 'GANDH4321A',
    registeredAddress: {
      street: 'Cooperative Complex, Sector 11',
      city: 'Gandhinagar',
      state: 'Gujarat',
      pincode: '382011',
      country: 'India'
    },
    contactPerson: 'Ramesh Patel',
    phone: '+91 98765 43211',
    email: 'ramesh@gandhinagarcoop.org',
    
    customerStatus: 'prospect',
    originalLeadId: 'L-2025-017',
    
    businessType: 'Textile Cooperative Society',
    specialization: 'Khadi, handloom fabrics, cooperative distribution',
    employeeCount: '75+ cooperative members',
    establishedYear: '2015',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 2500000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'NEFT - State Bank of India',
      deliveryPreference: 'Cooperative warehouse, proper documentation',
      qualityRequirements: 'Handloom quality, traditional weaves',
      communication: 'WhatsApp for quick updates, email for formal documentation',
      specialNotes: 'Cooperative society - community-focused, potential for regular orders.'
    },
    priority: 'warm',
    fabricPreferences: ['Khadi fabrics', 'Handloom materials', 'Traditional weaves']
  },
  {
    id: 'bp-jamnagar-petrochemical',
    companyName: 'Jamnagar Petrochemical Textiles',
    gstNumber: '24JAMNA6543C3D4',
    panNumber: 'JAMNA6543C',
    registeredAddress: {
      street: 'Refinery Complex, GIDC Area',
      city: 'Jamnagar',
      state: 'Gujarat',
      pincode: '361004',
      country: 'India'
    },
    contactPerson: 'Arjun Rana',
    phone: '+91 98765 43212',
    email: 'arjun@jamnagarpetrochemical.com',
    
    customerStatus: 'prospect',
    originalLeadId: 'L-2025-018',
    
    businessType: 'Petrochemical & Industrial Textiles',
    specialization: 'Chemical-resistant fabrics, safety materials',
    employeeCount: '200+ employees',
    establishedYear: '2018',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 3000000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'RTGS - ICICI Bank',
      deliveryPreference: 'Refinery delivery, safety compliance',
      qualityRequirements: 'Chemical-resistant, safety certified',
      communication: 'Email for safety documentation, calls for urgent matters',
      specialNotes: 'Petrochemical prospect - requires safety compliance, potential for ongoing orders.'
    },
    priority: 'hot',
    fabricPreferences: ['Chemical-resistant fabrics', 'Safety materials', 'Industrial protective textiles']
  },
  
  // PROSPECT BUSINESS PROFILES - Linked to active leads
  {
    id: 'bp-mumbai-cotton-mills',
    companyName: 'Mumbai Cotton Mills',
    gstNumber: 'TBD', // To be collected when converting to customer
    registeredAddress: {
      street: 'TBD',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Pradeep Kumar',
    phone: '+91 98765 11111',
    email: 'pradeep@mumbaicomills.com',
    
    customerStatus: 'prospect', // This is the key field for single source of truth
    
    businessType: 'Cotton fabric manufacturing',
    specialization: '300+ employees, industrial cotton fabric',
    employeeCount: '300+ employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 0, // To be set after first order
    paymentScore: 0, // No payment history yet
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'TBD',
      deliveryPreference: 'TBD',
      qualityRequirements: 'Industrial grade cotton fabric',
      communication: 'Email and phone',
      specialNotes: 'New prospect - industrial cotton fabric manufacturer.'
    },
    priority: 'hot',
    fabricPreferences: ['Industrial cotton fabric', 'Heavy-duty materials']
  },
  
  {
    id: 'bp-surat-fashion-house',
    companyName: 'Surat Fashion House',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Surat',
      state: 'Gujarat',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Meera Patel',
    phone: '+91 99887 22222',
    email: 'meera@suratfashion.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Fashion garments',
    specialization: 'Mid-scale operation, seasonal wear',
    employeeCount: 'TBD',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 0,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'TBD',
      deliveryPreference: 'TBD',
      qualityRequirements: 'Fashion-grade fabric for seasonal wear',
      communication: 'Email and phone',
      specialNotes: 'New prospect - fashion garments, seasonal focus.'
    },
    priority: 'warm',
    fabricPreferences: ['Cotton blend', 'Fashion fabrics', 'Seasonal materials']
  },
  
  {
    id: 'bp-baroda-textiles',
    companyName: 'Baroda Textiles Co',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Ashok Shah',
    phone: '+91 97654 33333',
    email: 'ashok@barodatextiles.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Textile trading company',
    specialization: '50+ employees, cotton fabric retail',
    employeeCount: '50+ employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 0,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'TBD',
      deliveryPreference: 'TBD',
      qualityRequirements: 'Cotton fabric for retail distribution',
      communication: 'Email and phone',
      specialNotes: 'New prospect - textile trading, slow decision process.'
    },
    priority: 'cold',
    fabricPreferences: ['Cotton fabric', 'Retail-grade materials', 'Trading volumes']
  },
  {
    id: 'bp-rajesh-textiles',
    companyName: 'Rajesh Textiles',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'Textile Market, Industrial Estate',
      city: 'Ahmedabad',
      state: 'Gujarat', 
      pincode: '380001',
      country: 'India'
    },
    contactPerson: 'Rajesh Shah',
    phone: '+91 98765 43210',
    email: 'rajesh@rateshtextiles.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Cotton fabric manufacturing',
    specialization: '500+ employees, high-grade cotton fabrics for export',
    employeeCount: '500+ employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 0,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'TBD',
      deliveryPreference: 'TBD',
      qualityRequirements: 'Export quality cotton fabrics',
      communication: 'Email and phone',
      specialNotes: 'New prospect - large cotton fabric manufacturer focused on export quality.'
    },
    priority: 'hot',
    fabricPreferences: ['Export quality cotton', 'High-grade fabrics', 'Cotton manufacturing']
  },
  
  // Service Lead BusinessProfiles - Added to fix customer name display issue
  {
    id: 'bp-surat-processors',
    companyName: 'Surat Cotton Industries',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Surat',
      state: 'Gujarat',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    email: 'ramesh@suratcotton.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Cotton fabric manufacturing',
    specialization: 'Grey cotton fabric production and textile manufacturing',
    employeeCount: '50-100 employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 200000,
    paymentScore: 75,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    preferences: {
      paymentMethod: 'Net Banking',
      deliveryPreference: 'Factory pickup',
      qualityRequirements: 'Premium dyeing and finishing for export quality',
      communication: 'Email and phone',
      specialNotes: 'Cotton manufacturer - produces grey fabric, requires professional dyeing and finishing services'
    },
    
    priority: 'hot',
    fabricPreferences: ['Grey cotton dyeing', 'Export quality finishing', 'Reactive dyeing services']
  },
  
  {
    id: 'bp-ahmedabad-finishers',
    companyName: 'Ahmedabad Textile Manufacturing',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Kiran Shah',
    phone: '+91 97654 32108',
    email: 'kiran@ahmedabadtextiles.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Textile manufacturing',
    specialization: 'Woven fabric manufacturing and textile production',
    employeeCount: '30-50 employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 150000,
    paymentScore: 80,
    creditStatus: 'good',
    paymentBehavior: 'good',
    
    preferences: {
      paymentMethod: 'Cheque',
      deliveryPreference: 'Our facility pickup',
      qualityRequirements: 'Premium finishing for retail-ready textiles',
      communication: 'Phone and WhatsApp',
      specialNotes: 'Textile manufacturer - produces woven fabrics, requires professional finishing services'
    },
    
    priority: 'warm',
    fabricPreferences: ['Woven fabric finishing', 'Anti-wrinkle treatments', 'Retail-ready finishing']
  },

  {
    id: 'bp-rajkot-processors',
    companyName: 'Rajkot Cotton Mills',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Ravi Patel',
    phone: '+91 95123 67890',
    email: 'ravi@rajkotcotton.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Cotton textile manufacturing',
    specialization: 'Premium cotton fabric production and textile manufacturing',
    employeeCount: '75-100 employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 300000,
    paymentScore: 0,
    creditStatus: 'new',
    paymentBehavior: 'new',
    
    preferences: {
      paymentMethod: 'RTGS',
      deliveryPreference: 'Factory pickup and delivery',
      qualityRequirements: 'Export grade dyeing and finishing for premium cotton',
      communication: 'Email and phone',
      specialNotes: 'Cotton manufacturer - produces premium grey cotton, requires complete processing pipeline (dyeing + finishing)'
    },
    
    priority: 'hot',
    fabricPreferences: ['Premium cotton processing', 'Export quality dyeing', 'Complete finishing pipeline']
  },
  
  {
    id: 'bp-mumbai-printers',
    companyName: 'Mumbai Digital Printers',
    gstNumber: 'TBD',
    registeredAddress: {
      street: 'TBD',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: 'TBD',
      country: 'India'
    },
    contactPerson: 'Deepak Joshi',
    phone: '+91 96543 21087',
    email: 'deepak@mumbaiprints.com',
    
    customerStatus: 'prospect',
    
    businessType: 'Digital textile printing',
    specialization: 'Multi-color digital printing on polyester and cotton',
    employeeCount: '20-30 employees',
    
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    
    creditLimit: 250000,
    paymentScore: 85,
    creditStatus: 'excellent',
    paymentBehavior: 'excellent',
    
    preferences: {
      paymentMethod: 'RTGS',
      deliveryPreference: 'Express courier',
      qualityRequirements: 'High-resolution digital printing quality',
      communication: 'Email and video calls',
      specialNotes: 'Service prospect - premium digital printing specialist'
    },
    
    priority: 'hot',
    fabricPreferences: ['Digital printing', 'Polyester fabrics', 'Multi-color designs']
  }
];

// Customer Feedback Data - Post-delivery experience tracking
export const mockCustomerFeedback: CustomerFeedback[] = [
  {
    id: 'CF-2025-001',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-004',
    feedbackDate: 'May 10, 2025',
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
    id: 'CF-2025-002',
    businessProfileId: 'bp-gujarat-garments',
    salesOrderId: 'SO-002',
    feedbackDate: 'April 30, 2025',
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
    id: 'CF-2025-003',
    businessProfileId: 'bp-gujarat-garments',
    salesOrderId: 'SO-001',
    feedbackDate: 'April 20, 2025',
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
    id: 'CF-2025-004',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-003',
    feedbackDate: 'April 25, 2025',
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
    id: 'CF-2025-005',
    businessProfileId: 'bp-baroda-fashion',
    salesOrderId: 'SO-001-PREV',
    feedbackDate: 'February 15, 2025',
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
    id: 'LT-2025-001',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'May 10, 2025',
    type: 'earned',
    points: 150,
    source: 'feedback',
    description: 'Points earned for 5-star feedback on SO-004',
    relatedOrderId: 'SO-004',
    relatedFeedbackId: 'CF-2025-001'
  },
  {
    id: 'LT-2025-002',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'April 26, 2025',
    type: 'earned',
    points: 75,
    source: 'order_completion',
    description: 'Points earned for completing order SO-004 (₹15.75L)',
    relatedOrderId: 'SO-004'
  },
  {
    id: 'LT-2025-003',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 30, 2025',
    type: 'earned',
    points: 110,
    source: 'feedback',
    description: 'Points earned for 4-star feedback on SO-002',
    relatedOrderId: 'SO-002',
    relatedFeedbackId: 'CF-2025-002'
  },
  {
    id: 'LT-2025-004',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 12, 2025',
    type: 'earned',
    points: 55,
    source: 'order_completion',
    description: 'Points earned for completing order SO-002 (₹11.55L)',
    relatedOrderId: 'SO-002'
  },
  {
    id: 'LT-2025-005',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'April 20, 2025',
    type: 'earned',
    points: 100,
    source: 'feedback',
    description: 'Points earned for feedback on SO-001 (export quality)',
    relatedOrderId: 'SO-001',
    relatedFeedbackId: 'CF-2025-003'
  },
  {
    id: 'LT-2025-006',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'April 25, 2025',
    type: 'earned',
    points: 85,
    source: 'feedback',
    description: 'Welcome bonus + feedback points for first order SO-003',
    relatedOrderId: 'SO-003',
    relatedFeedbackId: 'CF-2025-004'
  },
  {
    id: 'LT-2025-007',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'March 15, 2025',
    type: 'redeemed',
    points: 200,
    source: 'discount_redemption',
    description: 'Points redeemed for 2% discount on SO-004',
    relatedOrderId: 'SO-004'
  },
  {
    id: 'LT-2025-008',
    businessProfileId: 'bp-baroda-fashion',
    transactionDate: 'February 15, 2025',
    type: 'earned',
    points: 120,
    source: 'feedback',
    description: 'Points earned for previous order feedback',
    relatedFeedbackId: 'CF-2025-005'
  },
  {
    id: 'LT-2025-009',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'January 15, 2025',
    type: 'earned',
    points: 50,
    source: 'anniversary',
    description: 'Customer anniversary bonus - 2 years partnership',
  },
  {
    id: 'LT-2025-010',
    businessProfileId: 'bp-gujarat-garments',
    transactionDate: 'March 1, 2025',
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

// ===== SUPPORT TICKET DATA =====
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ST-001',
    businessProfileId: 'bp-gujarat-garments',
    title: 'Quality issue with fabric batch GJ-2025-03',
    description: 'Received fabric has inconsistent thread count in approximately 200 yards. Some sections are looser than specified standards.',
    category: 'quality_issue',
    priority: 'high',
    status: 'in_progress',
    createdDate: '2025-03-20',
    updatedDate: '2025-03-22',
    assignedTo: 'Quality Control Team',
    relatedOrderId: 'SO-001',
    internalNotes: [
      'Quality team has examined the batch',
      'Replacement fabric being prepared',
      'Customer wants expedited delivery for replacement'
    ]
  },
  {
    id: 'ST-002',
    businessProfileId: 'bp-gujarat-garments',
    title: 'Delivery delay notification needed',
    description: 'Order SO-002 delivery might be delayed by 3-4 days due to raw material shortage. Need to inform customer and get approval.',
    category: 'delivery_delay',
    priority: 'medium',
    status: 'resolved',
    createdDate: '2025-03-15',
    updatedDate: '2025-03-16',
    resolvedDate: '2025-03-16',
    assignedTo: 'Customer Relations',
    resolution: 'Customer contacted and agreed to revised timeline. Compensation offered in form of 2% discount on next order.',
    customerSatisfaction: 4,
    relatedOrderId: 'SO-002'
  },
  {
    id: 'ST-003',
    businessProfileId: 'bp-baroda-fashion',
    title: 'Payment verification required',
    description: 'Advance payment of ₹367,500 received but bank reference number not matching our records. Need verification.',
    category: 'payment_query',
    priority: 'urgent',
    status: 'resolved',
    createdDate: '2025-03-30',
    updatedDate: '2025-03-31',
    resolvedDate: '2025-03-31',
    assignedTo: 'Accounts Team',
    resolution: 'Bank reference verified. Payment was from different branch, hence the reference mismatch. Customer profile updated.',
    customerSatisfaction: 5,
    relatedPaymentId: 'AP-004'
  },
  {
    id: 'ST-004',
    businessProfileId: 'bp-ahmedabad-cotton',
    title: 'Request for product samples',
    description: 'Customer requesting fabric samples for new seasonal collection. Need to send sample catalog and arrange pickup.',
    category: 'general_inquiry',
    priority: 'low',
    status: 'open',
    createdDate: '2025-04-01',
    updatedDate: '2025-04-01',
    assignedTo: 'Sales Team'
  },
  {
    id: 'ST-005',
    businessProfileId: 'bp-gujarat-garments',
    title: 'Order customization request',
    description: 'Customer wants to modify fabric weight from 200 GSM to 220 GSM for order SO-003. Already in production.',
    category: 'technical_support',
    priority: 'medium',
    status: 'in_progress',
    createdDate: '2025-04-02',
    updatedDate: '2025-04-02',
    assignedTo: 'Production Team',
    relatedOrderId: 'SO-003',
    internalNotes: [
      'Production team consulted',
      'Change possible but will add 2 days to timeline',
      'Additional cost: ₹15,000 for weight upgrade'
    ]
  },
  {
    id: 'ST-006',
    businessProfileId: 'bp-baroda-fashion',
    title: 'Bulk discount inquiry',
    description: 'Customer planning large order for next quarter. Requesting volume pricing and terms for orders above ₹10L.',
    category: 'general_inquiry',
    priority: 'medium',
    status: 'open',
    createdDate: '2025-04-03',
    updatedDate: '2025-04-03',
    assignedTo: 'Sales Manager'
  }
];

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