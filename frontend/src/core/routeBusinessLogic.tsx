import React from 'react';
import { Route } from 'react-router-dom';

// Interface for render functions to ensure type safety
export interface RenderFunctions {
  renderHomePage: () => React.ReactElement;
  renderLeadership: () => React.ReactElement;
  renderDashboard: () => React.ReactElement;
  renderLeadManagement: () => React.ReactElement;
  renderSales: () => React.ReactElement;
  renderSalesOrders: () => React.ReactElement;
  renderInvoices: () => React.ReactElement;
  renderProduction: () => React.ReactElement;
  renderProcurement: () => React.ReactElement;
  renderCustomers: () => React.ReactElement;
  renderAuthentication: () => React.ReactElement;
  renderProfileCompletion: () => React.ReactElement;
  renderServicesHub: () => React.ReactElement;
  renderTurnaroundStories: () => React.ReactElement;
  renderBlogHome: () => React.ReactElement;
  renderBlogPost: () => React.ReactElement;
  renderBookHome: () => React.ReactElement;
  renderBookChapter: () => React.ReactElement;
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
    <Route key="quotes" path="quotes" element={renderFunctions.renderSales()} />,
    <Route key="orders" path="orders" element={renderFunctions.renderSalesOrders()} />,
    <Route key="invoices" path="invoices" element={renderFunctions.renderInvoices()} />,
    <Route key="customers" path="customers" element={renderFunctions.renderCustomers()} />,
    
    <Route key="sales" path="sales" element={renderFunctions.renderSales()} />,
    <Route key="production" path="production" element={renderFunctions.renderProduction()} />,
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
    <Route key="leadership" path="leadership" element={renderFunctions.renderLeadership()} />,
    <Route key="engineering-book" path="engineering-book" element={renderFunctions.renderBookHome()} />,
    <Route key="elevatebusiness-360" path="elevatebusiness-360" element={renderFunctions.renderLeadership()} />,
    <Route key="365-days-reflections" path="365-days-reflections" element={renderFunctions.renderBlogHome()} />,
    <Route key="login" path="login" element={renderFunctions.renderAuthentication()} />,
    <Route key="signup" path="signup" element={renderFunctions.renderAuthentication()} />,
    <Route key="profile-completion" path="profile-completion" element={renderFunctions.renderProfileCompletion()} />,
    <Route key="services" path="services" element={renderFunctions.renderServicesHub()} />,
    <Route key="services/:framework" path="services/:framework" element={renderFunctions.renderServicesHub()} />,
    <Route key="turnaround-stories" path="turnaround-stories" element={renderFunctions.renderTurnaroundStories()} />,
    <Route key="turnaround-stories/:story" path="turnaround-stories/:story" element={renderFunctions.renderTurnaroundStories()} />,
    <Route key="blog" path="blog" element={renderFunctions.renderBlogHome()} />,
    <Route key="blog/:slug" path="blog/:slug" element={renderFunctions.renderBlogPost()} />,
    <Route key="book" path="book" element={renderFunctions.renderBookHome()} />,
    <Route key="book/:slug" path="book/:slug" element={renderFunctions.renderBookChapter()} />,
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