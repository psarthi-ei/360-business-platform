import React from 'react';
import { Route } from 'react-router-dom';

// Interface for render functions to ensure type safety
export interface RenderFunctions {
  renderHomePage: () => React.ReactElement;
  renderDashboard: () => React.ReactElement;
  renderLeadManagement: () => React.ReactElement;
  renderSales: () => React.ReactElement;
  renderQuotationOrders: () => React.ReactElement;
  renderSalesOrders: () => React.ReactElement;
  renderPayments: () => React.ReactElement;
  renderInvoices: () => React.ReactElement;
  renderCustomerList: () => React.ReactElement;
  renderCustomerProfile: () => React.ReactElement;
  renderInventoryManagement: () => React.ReactElement;
  renderFulfillmentManagement: () => React.ReactElement;
  renderAnalyticsManagement: () => React.ReactElement;
  renderProcurement: () => React.ReactElement;
  renderAuthentication: () => React.ReactElement;
  renderProfileCompletion: () => React.ReactElement;
  renderServicesHub: () => React.ReactElement;
  renderTurnaroundStories: () => React.ReactElement;
  renderBlogHome: () => React.ReactElement;
  renderBlogPost: () => React.ReactElement;
  renderAbout: () => React.ReactElement;
  renderContact: () => React.ReactElement;
  renderExternalProfileForm: () => React.ReactElement;
}

// Platform routes (shared between mobile & desktop)
// These are the business application routes that require authentication/platform access
// Updated for nested routing under /platform/* - using relative paths
export function createPlatformRoutes(renderFunctions: RenderFunctions): React.ReactElement[] {
  return [
    <Route key="dashboard" path="dashboard" element={renderFunctions.renderDashboard()} />,
    <Route key="home" path="home" element={renderFunctions.renderDashboard()} />,
    <Route key="leads" path="leads" element={renderFunctions.renderLeadManagement()} />,
    <Route key="quotes" path="quotes" element={renderFunctions.renderQuotationOrders()} />,
    <Route key="orders" path="orders" element={renderFunctions.renderSalesOrders()} />,
    <Route key="payments" path="payments" element={renderFunctions.renderPayments()} />,
    <Route key="invoices" path="invoices" element={renderFunctions.renderInvoices()} />,
    <Route key="customers" path="customers" element={renderFunctions.renderCustomerList()} />,
    <Route key="customers/:customerId" path="customers/:customerId" element={renderFunctions.renderCustomerProfile()} />,
    <Route key="inventory" path="inventory" element={renderFunctions.renderInventoryManagement()} />,
    <Route key="fulfillment" path="fulfillment" element={renderFunctions.renderFulfillmentManagement()} />,
    <Route key="analytics" path="analytics" element={renderFunctions.renderAnalyticsManagement()} />,
    
    <Route key="sales" path="sales" element={renderFunctions.renderSales()} />,
    <Route key="production" path="production" element={renderFunctions.renderInventoryManagement()} />,
    <Route key="procurement" path="procurement" element={renderFunctions.renderProcurement()} />,
    
    // Default platform route - redirect to dashboard
    <Route key="platform-index" index element={renderFunctions.renderDashboard()} />
  ];
}

// Website routes (marketing/public pages)
// These are accessible to all users and needed for HeaderDropdown navigation on mobile
// Updated for nested routing under /* - using relative paths and index route
export function createWebsiteRoutes(renderFunctions: RenderFunctions): React.ReactElement[] {
  return [
    <Route key="index" index element={renderFunctions.renderHomePage()} />,
    <Route key="login" path="login" element={renderFunctions.renderAuthentication()} />,
    <Route key="signup" path="signup" element={renderFunctions.renderAuthentication()} />,
    <Route key="profile-completion" path="profile-completion" element={renderFunctions.renderProfileCompletion()} />,
    <Route key="services" path="services" element={renderFunctions.renderServicesHub()} />,
    <Route key="services/:framework" path="services/:framework" element={renderFunctions.renderServicesHub()} />,
    <Route key="turnaround-stories" path="turnaround-stories" element={renderFunctions.renderTurnaroundStories()} />,
    <Route key="turnaround-stories/:story" path="turnaround-stories/:story" element={renderFunctions.renderTurnaroundStories()} />,
    <Route key="blog" path="blog" element={renderFunctions.renderBlogHome()} />,
    <Route key="blog/:slug" path="blog/:slug" element={renderFunctions.renderBlogPost()} />,
    <Route key="about" path="about" element={renderFunctions.renderAbout()} />,
    <Route key="contact" path="contact" element={renderFunctions.renderContact()} />,
    <Route key="external-profile-form" path="external-profile-form" element={renderFunctions.renderExternalProfileForm()} />
  ];
}

// Combined routes for easy usage
export function createAllRoutes(renderFunctions: RenderFunctions): React.ReactElement[] {
  return [
    ...createWebsiteRoutes(renderFunctions),
    ...createPlatformRoutes(renderFunctions)
  ];
}