import { mockBusinessProfiles } from '../data/customerMockData';
import { mockLeads, mockSalesOrders } from '../data/salesMockData';

// Single source of truth for business calculations
export function getBusinessData() {
  return {
    hotLeads: mockLeads.filter(lead => lead.priority === 'hot').length,
    overduePayments: 0, // TODO: Calculate from actual payment data
    readyToShip: mockSalesOrders.filter(order => order.status === 'ready_to_ship').length,
    totalCustomers: mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length
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