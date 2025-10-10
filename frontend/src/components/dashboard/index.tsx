import React, { useState } from 'react';
import { mockLeads, mockQuotes, mockSalesOrders, mockBusinessProfiles } from '../../data/mockData';
import DesktopPresentation from './DesktopPresentation';
import MobilePresentation from './MobilePresentation';

interface DashboardProps {
  mobile?: boolean;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onShowLeadManagement: (autoAction?: string, actionParams?: Record<string, unknown>) => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowPayments: () => void;
  onShowInvoices: () => void;
  onShowCustomerList: () => void;
  onShowInventory?: () => void;
  onShowFulfillment?: () => void;
  onShowAnalytics?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
}

function Dashboard({ 
  mobile = false,
  currentTheme,
  onThemeChange,
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowSalesOrders,
  onShowPayments,
  onShowInvoices,
  onShowCustomerList,
  onShowInventory,
  onShowFulfillment,
  onShowAnalytics,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated,
  userMode
}: DashboardProps) {
  
  // Tab navigation state
  const [showTabNavigation, setShowTabNavigation] = useState(false);
  const [activeCardType, setActiveCardType] = useState<string | null>(null);
  
  // Calculate business metrics from mock data
  const totalLeads = mockLeads.length;
  const hotLeads = mockLeads.filter(lead => lead.priority === 'hot').length;
  const warmLeads = mockLeads.filter(lead => lead.priority === 'warm').length;
  const pendingQuotes = mockQuotes.filter(quote => quote.status === 'pending').length;
  const approvedQuotes = mockQuotes.filter(quote => quote.status === 'approved').length;
  const totalRevenue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length;
  const activeOrders = mockSalesOrders.filter(order => order.status === 'production_started').length;
  const readyToShip = mockSalesOrders.filter(order => order.status === 'ready_to_ship').length;
  const overduePayments = mockSalesOrders.filter(order => order.paymentStatus && order.paymentStatus.includes('overdue')).length;
  const pendingAdvanceAmount = mockSalesOrders.reduce((sum, order) => {
    // Simple calculation: 50% advance for orders not yet started
    if (order.status === 'order_confirmed') {
      return sum + (order.totalAmount * 0.5);
    }
    return sum;
  }, 0);
  
  // Quick metrics
  const conversionRate = Math.round((mockSalesOrders.length / totalLeads) * 100);
  
  // Smart contextual intelligence calculations
  const leadsReadyForQuotes = warmLeads + Math.floor(hotLeads * 0.7);
  const quotesReadyForAdvance = approvedQuotes;
  const repeatCustomerOpportunities = Math.floor(totalCustomers * 0.4);
  
  // Tab navigation handlers
  const handleCardClick = (cardType: string) => {
    setActiveCardType(cardType);
    setShowTabNavigation(true);
  };

  const closeTabNavigation = () => {
    setShowTabNavigation(false);
    setActiveCardType(null);
  };
  
  // Get tab configuration for each card type
  const getTabConfiguration = (cardType: string) => {
    const configurations = {
      'leads': {
        title: 'LEAD PIPELINE',
        icon: '🔥',
        tabs: [
          { 
            id: 'leadManagement', 
            label: 'Lead Management', 
            icon: '👥',
            purpose: 'Manage leads',
            quickStats: `${totalLeads} active leads • ${hotLeads} high priority • ${warmLeads} warm follow-ups • ${totalLeads - hotLeads - warmLeads} cold leads`,
            actions: [
              { label: 'View All Leads', action: onShowLeadManagement, primary: true },
              { label: 'Add New Lead', action: () => onShowLeadManagement('add-lead') },
              { label: 'Export Leads', action: () => {} },
              { label: 'Lead Analytics', action: () => {} }
            ]
          },
          { 
            id: 'crmView', 
            label: 'CRM - Prospect View', 
            icon: '🤝',
            purpose: 'Customer relationships',
            quickStats: `${totalCustomers} active customers • ${Math.floor(totalCustomers * 0.6)} returning clients • ${Math.floor(totalCustomers * 1.3)} total contacts • Average order ₹${Math.floor(totalRevenue/totalCustomers/1000)}K`,
            actions: [
              { label: 'View Customer List', action: onShowCustomerList, primary: true },
              { label: 'Add New Customer', action: () => {} },
              { label: 'Customer Insights', action: () => {} },
              { label: 'Relationship Mapping', action: () => {} }
            ]
          },
          { 
            id: 'leadAnalytics', 
            label: 'Lead Analytics', 
            icon: '📊',
            purpose: 'Lead insights',
            quickStats: 'Conversion insights and performance metrics',
            disabled: true
          }
        ],
        quickStats: `Lead Management Status: ${totalLeads} active leads • ${hotLeads} hot priority • ${warmLeads} need follow-up`,
        nextAction: 'Choose Lead Management for daily operations or CRM View for relationship management',
        voiceCommands: ['Lead Management', 'CRM View', 'Lead Analytics'],
        smartLinks: [
          { text: `Convert ${leadsReadyForQuotes} hot leads → Quotations`, action: () => handleCardClick('quotes') },
          { text: `CRM insights from ${Math.floor(totalCustomers * 0.3)} existing customers`, action: () => handleCardClick('customers') }
        ]
      },
      'quotes': {
        title: 'QUOTATIONS & ORDERS',
        icon: '📋',
        tabs: [
          { 
            id: 'quotationManagement', 
            label: 'Quotation Management', 
            icon: '📋',
            purpose: 'Create quotes',
            quickStats: `${mockQuotes.length} total quotes • ${pendingQuotes} awaiting approval • ${approvedQuotes} approved • ${Math.round((approvedQuotes/mockQuotes.length)*100)}% approval rate`,
            action: onShowQuotationOrders
          },
          { 
            id: 'salesOrderManagement', 
            label: 'Sales Order Management', 
            icon: '📄',
            purpose: 'Track orders',
            quickStats: `${mockSalesOrders.length} active orders • ₹${(totalRevenue/100000).toFixed(1)}L total value • ${activeOrders} in production • ${readyToShip} ready to ship`,
            action: onShowSalesOrders
          },
          { 
            id: 'commercialAnalytics', 
            label: 'Commercial Analytics', 
            icon: '📊',
            purpose: 'Sales insights',
            quickStats: 'Quote success rates and pricing insights',
            disabled: true
          },
          { 
            id: 'futureModule', 
            label: '[Future Module]', 
            icon: '⭐',
            purpose: 'Advanced features',
            quickStats: 'Enhanced capabilities coming soon',
            disabled: true
          }
        ],
        quickStats: `Quotation Status: ${mockQuotes.length} total quotes • ${pendingQuotes} pending approval • ${approvedQuotes} approved`,
        nextAction: 'Choose Quotation Management for quotes or Sales Order Management for order tracking',
        voiceCommands: ['Quotation Management', 'Sales Orders', 'Commercial Analytics'],
        smartLinks: [
          { text: `₹${((approvedQuotes * 70000) / 100000).toFixed(1)}L awaiting payment → Payments`, action: () => handleCardClick('payments') },
          { text: `${mockSalesOrders.length} orders in production pipeline`, action: () => handleCardClick('production') }
        ]
      },
      'payments': {
        title: 'PAYMENTS',
        icon: '💰',
        tabs: [
          { 
            id: 'advancePaymentManagement', 
            label: 'Advance Payment Management', 
            icon: '💰',
            purpose: 'Collect payments',
            quickStats: `${approvedQuotes} advance payments • ₹${(pendingAdvanceAmount/100000).toFixed(1)}L overdue • ${Math.round((1 - overduePayments / Math.max(1, approvedQuotes)) * 100)}% collection rate`,
            action: onShowPayments
          },
          { 
            id: 'proformaInvoiceManagement', 
            label: 'Proforma Invoice Management', 
            icon: '📋',
            purpose: 'Generate invoices',
            quickStats: 'Invoice creation from approved quotes',
            disabled: true
          },
          { 
            id: 'paymentAnalytics', 
            label: 'Payment Analytics', 
            icon: '📊',
            purpose: 'Payment insights',
            quickStats: 'Collection trends and customer payment behavior',
            disabled: true
          },
          { 
            id: 'futureModule', 
            label: '[Future Module]', 
            icon: '⭐',
            purpose: 'Advanced features',
            quickStats: 'Enhanced capabilities coming soon',
            disabled: true
          }
        ],
        quickStats: `Payment Status: ${approvedQuotes} advance payments due • ₹${(pendingAdvanceAmount/100000).toFixed(1)}L outstanding • ${Math.round((1 - overduePayments / Math.max(1, approvedQuotes)) * 100)}% collection rate`,
        nextAction: 'Use Advance Payment Management for tracking and collection',
        voiceCommands: ['Advance Payments', 'Proforma Invoices', 'Payment Analytics'],
        smartLinks: [
          { text: `Payment received → Production`, action: () => handleCardClick('production') },
          { text: `Generate invoices for ${approvedQuotes} quotes`, action: () => handleCardClick('quotes') }
        ]
      },
      'production': {
        title: 'PRODUCTION MANAGEMENT',
        icon: '🏭',
        tabs: [
          { 
            id: 'workOrderManagement', 
            label: 'Work Order Management', 
            icon: '📋',
            purpose: 'Production tasks',
            quickStats: 'Production workflow and task management',
            actions: [
              { label: 'View All Orders', action: onShowSalesOrders, primary: true },
              { label: 'Start Production', action: () => {} },
              { label: 'Production Status', action: () => {} },
              { label: 'Work Order Reports', action: () => {} }
            ]
          },
          { 
            id: 'manufacturingExecution', 
            label: 'Manufacturing Execution', 
            icon: '⚙️',
            purpose: 'Track production',
            quickStats: 'Shop floor management and quality control',
            disabled: true
          },
          { 
            id: 'productionPlanning', 
            label: 'Production Planning', 
            icon: '📅',
            purpose: 'Plan resources',
            quickStats: 'Production optimization and planning tools',
            disabled: true
          },
          { 
            id: 'productionAnalytics', 
            label: 'Production Analytics', 
            icon: '📊',
            purpose: 'Production insights',
            quickStats: 'Efficiency metrics and performance tracking',
            disabled: true
          }
        ],
        quickStats: `Production Pipeline: ${activeOrders} active orders • ${readyToShip} ready to ship • Production workflow coming soon`,
        nextAction: 'Production modules will provide complete manufacturing workflow management',
        voiceCommands: ['Work Orders', 'Manufacturing', 'Production Planning'],
        smartLinks: [
          { text: `Materials needed for production → Inventory`, action: () => handleCardClick('inventory') },
          { text: `Completed orders → Fulfillment`, action: () => handleCardClick('fulfillment') }
        ]
      },
      'inventory': {
        title: 'INVENTORY & MATERIALS',
        icon: '📦',
        tabs: [
          { 
            id: 'stockManagement', 
            label: 'Stock Management', 
            icon: '📦',
            purpose: 'Track stock',
            quickStats: 'Stock levels, allocation, and reorder management',
            actions: [
              { label: 'View All Inventory', action: onShowInventory ? onShowInventory : () => {}, primary: true },
              { label: 'Add New Stock', action: () => {} },
              { label: 'Check Stock Levels', action: () => {} },
              { label: 'Stock Reports', action: () => {} }
            ]
          },
          { 
            id: 'procurement', 
            label: 'Procurement', 
            icon: '🛍️',
            purpose: 'Purchase orders',
            quickStats: 'Automated procurement and supplier performance',
            disabled: true
          },
          { 
            id: 'materialPlanning', 
            label: 'Material Planning', 
            icon: '📋',
            purpose: 'Plan materials',
            quickStats: 'Production-driven material planning and optimization',
            disabled: true
          },
          { 
            id: 'stockReports', 
            label: 'Stock Reports', 
            icon: '📊',
            purpose: 'Stock insights',
            quickStats: 'Stock analysis and inventory insights',
            disabled: true
          }
        ],
        quickStats: `Inventory Status: Stock levels optimized • Materials allocated to ${activeOrders} orders • Supply chain modules coming soon`,
        nextAction: 'Inventory modules will provide complete supply chain management',
        voiceCommands: ['Stock Management', 'Procurement', 'Material Planning'],
        smartLinks: [
          { text: `Stock for production → Production`, action: () => handleCardClick('production') },
          { text: `Ready for dispatch → Fulfillment`, action: () => handleCardClick('fulfillment') }
        ]
      },
      'fulfillment': {
        title: 'FULFILLMENT & DELIVERY',
        icon: '🚚',
        tabs: [
          { 
            id: 'readyToShip', 
            label: 'Ready to Ship', 
            icon: '📦',
            purpose: 'Ready to ship',
            quickStats: 'Dispatch preparation and shipping coordination',
            actions: [
              { label: 'View All Fulfillment', action: onShowFulfillment ? onShowFulfillment : () => {}, primary: true },
              { label: 'Prepare Shipment', action: () => {} },
              { label: 'Track Delivery', action: () => {} },
              { label: 'Shipping Reports', action: () => {} }
            ]
          },
          { 
            id: 'dispatch', 
            label: 'Dispatch', 
            icon: '🚚',
            purpose: 'Process shipments',
            quickStats: 'Active shipments and carrier management',
            disabled: true
          },
          { 
            id: 'deliveryTracking', 
            label: 'Delivery Tracking', 
            icon: '🚛',
            purpose: 'Track deliveries',
            quickStats: 'Tracking status and delivery confirmation',
            disabled: true
          },
          { 
            id: 'fulfillmentReports', 
            label: 'Fulfillment Reports', 
            icon: '📊',
            purpose: 'Delivery insights',
            quickStats: 'Fulfillment metrics and performance analysis',
            disabled: true
          }
        ],
        quickStats: `Fulfillment Status: ${readyToShip} orders ready to ship • 95% on-time delivery rate • Logistics modules coming soon`,
        nextAction: 'Fulfillment modules will provide complete delivery workflow management',
        voiceCommands: ['Ready to Ship', 'Dispatch', 'Delivery Tracking'],
        smartLinks: [
          { text: `Collect customer feedback → Customers`, action: () => handleCardClick('customers') },
          { text: `Generate final invoices → Payments`, action: () => handleCardClick('payments') }
        ]
      },
      'customers': {
        title: 'CUSTOMERS',
        icon: '🤝',
        tabs: [
          { 
            id: 'customerList', 
            label: 'Customer List', 
            icon: '📋',
            purpose: 'Customer contacts',
            quickStats: `${totalCustomers} active customers • ${Math.floor(totalCustomers * 0.8)} with complete profiles • ${Math.floor(totalCustomers * 0.3)} VIP status • Contact management ready`,
            action: onShowCustomerList
          },
          { 
            id: 'customer360Details', 
            label: 'Customer 360° Details', 
            icon: '🤝',
            purpose: 'Customer profiles',
            quickStats: `Customer analytics • Purchase history • Relationship scoring • Payment patterns for ${totalCustomers} customers`,
            disabled: true
          },
          { 
            id: 'feedbackLoyalty', 
            label: 'Feedback & Loyalty', 
            icon: '💬',
            purpose: 'Customer feedback',
            quickStats: 'Customer feedback collection and loyalty tracking',
            disabled: true
          },
          { 
            id: 'relationshipReports', 
            label: 'Relationship Reports', 
            icon: '📊',
            purpose: 'Customer insights',
            quickStats: 'Customer profitability and relationship analysis',
            disabled: true
          }
        ],
        quickStats: `Customer Status: ${totalCustomers} active customers • ${Math.floor(totalCustomers * 1.5)} prospects • ${repeatCustomerOpportunities} repeat opportunities`,
        nextAction: 'Use Customer List for contact management or 360° Details for comprehensive insights',
        voiceCommands: ['Customer List', 'Customer Details', 'Feedback & Loyalty'],
        smartLinks: [
          { text: `${repeatCustomerOpportunities} repeat opportunities → Leads`, action: () => handleCardClick('leads') },
          { text: `Payment history → Payments`, action: () => handleCardClick('payments') }
        ]
      },
      'analytics': {
        title: 'BUSINESS ANALYTICS',
        icon: '📊',
        tabs: [
          { 
            id: 'businessReports', 
            label: 'Business Reports', 
            icon: '📊',
            purpose: 'Business reports',
            quickStats: 'Executive dashboards and operational reports',
            actions: [
              { label: 'View All Analytics', action: onShowAnalytics ? onShowAnalytics : () => {}, primary: true },
              { label: 'Generate Report', action: () => {} },
              { label: 'Export Data', action: () => {} },
              { label: 'KPI Dashboard', action: () => {} }
            ]
          },
          { 
            id: 'financialAnalytics', 
            label: 'Financial Analytics', 
            icon: '💰',
            purpose: 'Financial insights',
            quickStats: 'Revenue analysis and financial insights',
            disabled: true
          },
          { 
            id: 'performanceKPIs', 
            label: 'Performance KPIs', 
            icon: '📈',
            purpose: 'Performance KPIs',
            quickStats: 'Business KPIs and performance monitoring',
            disabled: true
          },
          { 
            id: 'businessIntelligence', 
            label: 'Business Intelligence', 
            icon: '🧠',
            purpose: 'Advanced insights',
            quickStats: 'AI-driven business intelligence and optimization',
            disabled: true
          }
        ],
        quickStats: `Analytics Status: ${conversionRate}% lead conversion rate • ₹${(totalRevenue/100000).toFixed(1)}L revenue pipeline • Business intelligence coming soon`,
        nextAction: 'Analytics modules will provide comprehensive business intelligence',
        voiceCommands: ['Business Reports', 'Financial Analytics', 'Performance KPIs'],
        smartLinks: [
          { text: `Lead conversion analytics → Leads`, action: () => handleCardClick('leads') },
          { text: `Customer profitability → Customers`, action: () => handleCardClick('customers') }
        ]
      }
    };

    return configurations[cardType as keyof typeof configurations] || configurations.leads;
  };

  // Prepare props for presentation components
  const presentationProps = {
    // Business metrics
    totalLeads,
    hotLeads,
    warmLeads,
    pendingQuotes,
    approvedQuotes,
    totalRevenue,
    totalCustomers,
    activeOrders,
    readyToShip,
    overduePayments,
    pendingAdvanceAmount,
    conversionRate,
    leadsReadyForQuotes,
    quotesReadyForAdvance,
    repeatCustomerOpportunities,
    
    // Navigation handlers
    onShowLeadManagement,
    onShowQuotationOrders,
    onShowSalesOrders,
    onShowPayments,
    onShowInvoices,
    onShowCustomerList,
    onShowInventory,
    onShowFulfillment,
    onShowAnalytics,
    
    // Tab navigation
    showTabNavigation,
    activeCardType,
    handleCardClick,
    closeTabNavigation,
    getTabConfiguration,
    
    // Theme and auth
    currentTheme,
    onThemeChange,
    onLogin,
    onSignUp,
    onGuestMode,
    onDemoMode,
    onLogout,
    isAuthenticated,
    userMode
  };

  if (mobile) {
    return <MobilePresentation {...presentationProps} />;
  }
  
  return <DesktopPresentation {...presentationProps} />;
}

export default Dashboard;