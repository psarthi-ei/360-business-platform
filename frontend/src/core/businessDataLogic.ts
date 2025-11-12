import { mockBusinessProfiles } from '../data/customerMockData';
import { mockLeads, mockSalesOrders, mockJobOrders } from '../data/salesMockData';

// Helper function to check if a business profile has any business activity
const hasBusinessActivity = (businessProfileId: string): boolean => {
  // Check if profile has leads (quotes are generated from leads, so leads cover quotes)
  const hasLeads = mockLeads.some(lead => lead.businessProfileId === businessProfileId);
  
  // Check if profile has job orders (can exist independently without leads)
  const hasJobOrders = mockJobOrders.some(order => order.businessProfileId === businessProfileId);
  
  // Check if profile has sales orders (currently empty but included for completeness)
  const hasSalesOrders = mockSalesOrders.some(order => order.businessProfileId === businessProfileId);
  
  return hasLeads || hasJobOrders || hasSalesOrders;
};

// Single source of truth for business calculations
export function getBusinessData() {
  return {
    hotLeads: mockLeads.filter(lead => lead.priority === 'hot').length,
    overduePayments: 0, // TODO: Calculate from actual payment data
    readyToShip: mockSalesOrders.filter(order => order.status === 'ready_to_ship').length,
    totalCustomers: mockBusinessProfiles.filter(profile => 
      (profile.customerStatus === 'customer' || profile.customerStatus === 'prospect') &&
      hasBusinessActivity(profile.id)
    ).length
  };
}

// Helper for voice assistant current stage detection
export function getCurrentProcessStage(pathname: string): string {
  if (pathname.includes('/dashboard')) return 'dashboard';
  if (pathname.includes('/leads')) return 'leads';
  if (pathname.includes('/quotes')) return 'quotes';
  if (pathname.includes('/orders')) return 'orders';
  if (pathname.includes('/customers')) return 'customers';
  if (pathname.includes('/inventory')) return 'inventory';
  if (pathname.includes('/fulfillment')) return 'fulfillment';
  if (pathname.includes('/analytics')) return 'analytics';
  return 'dashboard';
}