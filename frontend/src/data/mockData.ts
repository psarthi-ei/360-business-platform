// Centralized Mock Data for 360° Business Platform
// This file contains all sample data used across components to ensure consistency

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  location: string;
  contact: string;
  business: string;
  inquiry: string;
  budget: string;
  timeline: string;
  lastContact: string;
  priority: 'hot' | 'warm' | 'cold';
  notes: string;
}

export interface Quote {
  id: string;
  leadId: string;
  customerId: string;
  customerName: string;
  location: string;
  quoteDate: string;
  validUntil: string;
  items: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'expired';
  statusMessage: string;
}

export interface SalesOrder {
  id: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  location: string;
  orderDate: string;
  deliveryDate: string;
  items: string;
  totalAmount: number;
  status: 'pending' | 'production' | 'completed';
  statusMessage: string;
  paymentStatus: string;
  productionStatus: string;
}

export interface Customer {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  customerSince: string;
  totalBusiness: number;
  totalOrders: number;
  conversionRate: number;
  paymentStatus: 'good' | 'overdue' | 'pending';
  paymentStatusMessage: string;
  businessType: string;
  employeeCount: string;
  gstNumber: string;
  preferences: {
    paymentMethod: string;
    deliveryPreference: string;
    qualityRequirements: string;
    communication: string;
    specialNotes: string;
  };
  priority: 'hot' | 'warm' | 'cold';
  priorityLabel: string;
}

export interface Communication {
  date: string;
  time: string;
  type: string;
  message: string;
}

// Mock Data
export const mockLeads: Lead[] = [
  {
    id: 'rajesh-001',
    customerId: 'rajesh-textiles',
    customerName: 'Rajesh Textiles',
    location: 'Ahmedabad',
    contact: '+91 98765 43210 | rajesh@rateshtextiles.com',
    business: 'Cotton fabric manufacturing, 500+ employees',
    inquiry: 'High-grade cotton fabric for export - 10,000 yards',
    budget: '₹15-20 lakhs',
    timeline: '30 days',
    lastContact: 'Today 2:30 PM - "Very interested, wants samples by Friday"',
    priority: 'hot',
    notes: 'Premium client - has placed 3 orders worth ₹50L+ in past year. Prefers morning calls. Decision maker. Can close within 48 hours if quote is competitive.'
  },
  {
    id: 'gujarat-002',
    customerId: 'gujarat-garments',
    customerName: 'Gujarat Garments',
    location: 'Surat',
    contact: '+91 99887 65432 | info@gujaratgarments.com',
    business: 'Readymade garments, mid-scale operation',
    inquiry: 'Mixed fabric for casual wear - 5,000 yards',
    budget: '₹8-12 lakhs',
    timeline: '45 days',
    lastContact: 'Yesterday - "Comparing quotes, will decide next week"',
    priority: 'warm',
    notes: 'Price-sensitive buyer. Needs follow-up next Tuesday. Interested in long-term partnership if first order goes well.'
  },
  {
    id: 'baroda-003',
    customerId: 'baroda-fashion',
    customerName: 'Baroda Fashion House',
    location: 'Vadodara',
    contact: '+91 97654 32108 | contact@barodafashion.com',
    business: 'Fashion retail chain, 12 stores',
    inquiry: 'Seasonal fabric collection - 3,000 yards',
    budget: '₹5-8 lakhs',
    timeline: '60 days',
    lastContact: 'Last week - "Will get back after board meeting"',
    priority: 'cold',
    notes: 'New client - needs nurturing. Slow decision process. Send catalog and samples. Follow up in 2 weeks.'
  }
];

export const mockQuotes: Quote[] = [
  {
    id: 'QT-001',
    leadId: 'rajesh-001',
    customerId: 'rajesh-textiles',
    customerName: 'Rajesh Textiles',
    location: 'Ahmedabad',
    quoteDate: 'March 15, 2024',
    validUntil: 'March 30, 2024',
    items: 'High-grade cotton fabric - 10,000 yards @ ₹185/yard',
    totalAmount: 1850000,
    status: 'approved',
    statusMessage: 'Waiting for customer approval - Follow up scheduled for tomorrow'
  },
  {
    id: 'QT-001B',
    leadId: 'rajesh-001',
    customerId: 'rajesh-textiles',
    customerName: 'Rajesh Textiles',
    location: 'Ahmedabad',
    quoteDate: 'March 18, 2024',
    validUntil: 'April 5, 2024',
    items: 'Premium cotton fabric - 8,000 yards @ ₹210/yard (Alternative Quote)',
    totalAmount: 1680000,
    status: 'pending',
    statusMessage: 'Alternative quote with premium quality - Awaiting customer decision'
  },
  {
    id: 'QT-002',
    leadId: 'gujarat-002',
    customerId: 'gujarat-garments',
    customerName: 'Gujarat Garments',
    location: 'Surat',
    quoteDate: 'March 10, 2024',
    validUntil: 'March 25, 2024',
    items: 'Mixed fabric for casual wear - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'approved',
    statusMessage: 'Approved by customer - Ready to convert to sales order'
  },
  {
    id: 'QT-002B',
    leadId: 'gujarat-002',
    customerId: 'gujarat-garments',
    customerName: 'Gujarat Garments',
    location: 'Surat',
    quoteDate: 'March 12, 2024',
    validUntil: 'March 30, 2024',
    items: 'Budget fabric option - 6,000 yards @ ₹165/yard',
    totalAmount: 990000,
    status: 'pending',
    statusMessage: 'Budget-friendly alternative quote - Customer comparing options'
  },
  {
    id: 'QT-003',
    leadId: 'baroda-003',
    customerId: 'baroda-fashion',
    customerName: 'Baroda Fashion House',
    location: 'Vadodara',
    quoteDate: 'February 20, 2024',
    validUntil: 'March 5, 2024',
    items: 'Seasonal fabric collection - 3,000 yards @ ₹220/yard',
    totalAmount: 660000,
    status: 'expired',
    statusMessage: 'Quote expired - Customer requested extension, preparing new quote'
  }
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO-001',
    quoteId: 'QT-001',
    customerId: 'rajesh-textiles',
    customerName: 'Rajesh Textiles',
    location: 'Ahmedabad',
    orderDate: 'March 20, 2024',
    deliveryDate: 'April 15, 2024',
    items: 'High-grade cotton fabric - 10,000 yards @ ₹185/yard',
    totalAmount: 1850000,
    status: 'pending',
    statusMessage: 'Pending payment - 50% advance pending',
    paymentStatus: 'Advance payment required',
    productionStatus: 'Awaiting payment to start production'
  },
  {
    id: 'SO-002',
    quoteId: 'QT-002',
    customerId: 'gujarat-garments',
    customerName: 'Gujarat Garments',
    location: 'Surat',
    orderDate: 'March 15, 2024',
    deliveryDate: 'April 10, 2024',
    items: 'Mixed fabric for casual wear - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'production',
    statusMessage: 'Payment completed - Currently in production (60% done)',
    paymentStatus: 'Paid in full',
    productionStatus: 'In production - 60% completed'
  },
  {
    id: 'SO-003',
    quoteId: 'QT-003',
    customerId: 'baroda-fashion',
    customerName: 'Baroda Fashion House',
    location: 'Vadodara',
    orderDate: 'February 25, 2024',
    deliveryDate: 'March 20, 2024',
    items: 'Seasonal fabric collection - 3,000 yards @ ₹220/yard',
    totalAmount: 660000,
    status: 'completed',
    statusMessage: 'Order completed and delivered successfully',
    paymentStatus: 'Always on time',
    productionStatus: 'Completed and delivered'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'rajesh-textiles',
    name: 'Rajesh Textiles',
    location: 'Ahmedabad',
    contactPerson: 'Rajesh Shah',
    phone: '+91 98765 43210',
    email: 'rajesh@rateshtextiles.com',
    customerSince: 'March 15, 2024',
    totalBusiness: 1850000,
    totalOrders: 1,
    conversionRate: 100,
    paymentStatus: 'overdue',
    paymentStatusMessage: 'Advance Pending',
    businessType: 'Cotton fabric manufacturing',
    employeeCount: '500+ employees',
    gstNumber: '24ABCDE1234F2Z5',
    preferences: {
      paymentMethod: 'Bank transfer',
      deliveryPreference: 'Company pickup',
      qualityRequirements: 'Premium grade only',
      communication: 'WhatsApp preferred, calls 9 AM - 6 PM',
      specialNotes: 'Always requests samples before bulk orders'
    },
    priority: 'hot',
    priorityLabel: 'Hot Customer'
  },
  {
    id: 'gujarat-garments',
    name: 'Gujarat Garments',
    location: 'Surat',
    contactPerson: 'Suresh Patel',
    phone: '+91 99887 65432',
    email: 'info@gujaratgarments.com',
    customerSince: 'March 10, 2024',
    totalBusiness: 975000,
    totalOrders: 1,
    conversionRate: 100,
    paymentStatus: 'good',
    paymentStatusMessage: 'Paid in Full',
    businessType: 'Readymade garments',
    employeeCount: 'Mid-scale operation',
    gstNumber: '24FGHIJ5678K3L6',
    preferences: {
      paymentMethod: 'Bank transfer',
      deliveryPreference: 'Door delivery',
      qualityRequirements: 'Good quality, competitive pricing',
      communication: 'Phone calls preferred',
      specialNotes: 'Price-sensitive, bulk order potential'
    },
    priority: 'warm',
    priorityLabel: 'Warm Customer'
  },
  {
    id: 'baroda-fashion',
    name: 'Baroda Fashion House',
    location: 'Vadodara',
    contactPerson: 'Amit Sharma',
    phone: '+91 97654 32108',
    email: 'contact@barodafashion.com',
    customerSince: 'February 20, 2024',
    totalBusiness: 660000,
    totalOrders: 1,
    conversionRate: 50,
    paymentStatus: 'good',
    paymentStatusMessage: 'Always On Time',
    businessType: 'Fashion retail chain',
    employeeCount: '12 stores',
    gstNumber: '24MNOPQ9012R4S7',
    preferences: {
      paymentMethod: 'Bank transfer',
      deliveryPreference: 'Store delivery',
      qualityRequirements: 'Trendy designs, seasonal collections',
      communication: 'Email preferred for formal communication',
      specialNotes: 'Seasonal buyer, good for repeat business'
    },
    priority: 'cold',
    priorityLabel: 'Completed Customer'
  }
];

export const mockCommunications: Communication[] = [
  {
    date: 'March 22, 2024',
    time: '2:30 PM',
    type: '📱 WhatsApp Message',
    message: 'Payment reminder sent: "Dear Rajesh ji, your advance payment of ₹9,25,000 for order SO-001 is pending. Please complete payment to start production. Bank details: HDFC Bank A/c: 1234567890"'
  },
  {
    date: 'March 20, 2024',
    time: '11:00 AM',
    type: '📞 Phone Call',
    message: 'Order confirmation call: Discussed delivery timeline, payment terms, and quality specifications. Customer confirmed order and requested fabric sample for final approval.'
  },
  {
    date: 'March 15, 2024',
    time: '4:15 PM',
    type: '💬 WhatsApp Business',
    message: 'Quote sent and approved: "Thank you for the quick quote! The quality looks perfect. Please convert this to order. We\'ll arrange payment within 2 days."'
  }
];

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount).replace('₹', '₹');
};

export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id);
};

export const getSalesOrderById = (id: string): SalesOrder | undefined => {
  return mockSalesOrders.find(order => order.id === id);
};

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getQuotesByCustomerId = (customerId: string): Quote[] => {
  return mockQuotes.filter(quote => quote.customerId === customerId);
};

export const getSalesOrdersByCustomerId = (customerId: string): SalesOrder[] => {
  return mockSalesOrders.filter(order => order.customerId === customerId);
};

export const getLeadsByCustomerId = (customerId: string): Lead[] => {
  return mockLeads.filter(lead => lead.customerId === customerId);
};