import React, { useState } from 'react';
import ProductHeader from './ProductHeader';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import TabNavigation from './TabNavigation';
import { mockLeads, mockQuotes, mockSalesOrders, mockBusinessProfiles, formatCurrency, getBusinessProfileById } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/Dashboard.module.css';

interface DashboardProps {
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  onShowLeadManagement: () => void;
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
  currentTheme,
  onThemeChange,
  onNavigateHome,
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
  // Use translation hook - no more props needed!
  const { currentLanguage, setLanguage } = useTranslation();
  
  // Swipe navigation state will be implemented in future
  
  // Current process stage for voice assistant
  const [currentProcessStage, setCurrentProcessStage] = useState('dashboard');
  
  // Tab navigation state
  const [showTabNavigation, setShowTabNavigation] = useState(false);
  const [activeCardType, setActiveCardType] = useState<string | null>(null);
  
  
  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Calculate business metrics from mock data
  const totalLeads = mockLeads.length;
  const hotLeads = mockLeads.filter(lead => lead.priority === 'hot').length;
  const warmLeads = mockLeads.filter(lead => lead.priority === 'warm').length;
  const pendingQuotes = mockQuotes.filter(quote => quote.status === 'pending').length;
  const approvedQuotes = mockQuotes.filter(quote => quote.status === 'approved').length;
  const totalRevenue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length;
  const activeOrders = mockSalesOrders.filter(order => order.status === 'production').length;
  const readyToShip = mockSalesOrders.filter(order => order.status === 'completed').length;
  const overduePayments = mockSalesOrders.filter(order => order.paymentStatus && order.paymentStatus.includes('overdue')).length;
  
  // Business data for voice assistant
  const businessData = {
    hotLeads,
    overduePayments,
    readyToShip,
    totalCustomers
  };

  // Tab navigation handlers
  const handleCardClick = (cardType: string) => {
    setActiveCardType(cardType);
    setShowTabNavigation(true);
    setCurrentProcessStage(cardType);
  };

  const closeTabNavigation = () => {
    setShowTabNavigation(false);
    setActiveCardType(null);
    setCurrentProcessStage('dashboard');
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
              { label: 'Add New Lead', action: () => console.log('Add New Lead') },
              { label: 'Export Leads', action: () => console.log('Export Leads') },
              { label: 'Lead Analytics', action: () => console.log('Lead Analytics') }
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
              { label: 'Add New Customer', action: () => console.log('Add New Customer') },
              { label: 'Customer Insights', action: () => console.log('Customer Insights') },
              { label: 'Relationship Mapping', action: () => console.log('Relationship Mapping') }
            ]
          },
          { 
            id: 'leadAnalytics', 
            label: 'Lead Analytics', 
            icon: '📊',
            purpose: 'Lead insights',
            quickStats: 'Conversion insights and performance metrics',
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
            disabled: true
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
            disabled: true
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
            disabled: true
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
            disabled: true
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
  
  // Quick metrics
  const conversionRate = Math.round((mockSalesOrders.length / totalLeads) * 100);
  
  // Smart contextual intelligence calculations
  const leadsReadyForQuotes = warmLeads + Math.floor(hotLeads * 0.7);
  const quotesReadyForAdvance = approvedQuotes;
  const pendingAdvanceAmount = mockSalesOrders.reduce((sum, order) => 
    sum + (order.status === 'pending' ? order.totalAmount * 0.3 : 0), 0);
  const repeatCustomerOpportunities = Math.floor(totalCustomers * 0.4);
  

  // Process navigation will be implemented for future swipe functionality





  // Global search functionality
  const performGlobalSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: any[] = [];
    const lowerQuery = query.toLowerCase();

    // Search in leads
    mockLeads.forEach(lead => {
      if (lead.companyName.toLowerCase().includes(lowerQuery) ||
          lead.contactPerson.toLowerCase().includes(lowerQuery) ||
          lead.inquiry.toLowerCase().includes(lowerQuery) ||
          lead.priority.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'lead',
          title: lead.companyName,
          subtitle: `${lead.contactPerson} - ${lead.inquiry}`,
          priority: lead.priority,
          action: () => onShowLeadManagement(),
          category: 'NEW INQUIRIES'
        });
      }
    });

    // Search in quotes
    mockQuotes.forEach(quote => {
      if (quote.companyName.toLowerCase().includes(lowerQuery) ||
          quote.items.toLowerCase().includes(lowerQuery) ||
          quote.status.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'quote',
          title: quote.companyName,
          subtitle: `${quote.items.split(' - ')[0]} - ${formatCurrency(quote.totalAmount)}`,
          status: quote.status,
          action: () => onShowQuotationOrders(),
          category: 'ACTIVE BUSINESS'
        });
      }
    });

    // Search in sales orders
    mockSalesOrders.forEach(order => {
      const customer = getBusinessProfileById(order.businessProfileId);
      const customerName = customer?.companyName || 'Unknown Customer';
      if (customerName.toLowerCase().includes(lowerQuery) ||
          order.items.toLowerCase().includes(lowerQuery) ||
          order.status.toLowerCase().includes(lowerQuery) ||
          (order.paymentStatus && order.paymentStatus.toLowerCase().includes(lowerQuery))) {
        results.push({
          type: 'order',
          title: customerName,
          subtitle: `${order.items.split(' - ')[0]} - ${formatCurrency(order.totalAmount)}`,
          status: order.status,
          action: () => onShowSalesOrders(),
          category: 'ACTIVE BUSINESS'
        });
      }
    });

    // Search in customers
    mockBusinessProfiles.forEach(profile => {
      if (profile.companyName.toLowerCase().includes(lowerQuery) ||
          profile.contactPerson.toLowerCase().includes(lowerQuery) ||
          profile.businessType.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'customer',
          title: profile.companyName,
          subtitle: `${profile.contactPerson} - ${profile.businessType}`,
          status: profile.customerStatus,
          action: () => onShowCustomerList(),
          category: 'CUSTOMERS'
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowSearchResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performGlobalSearch(query);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  // Date formatting utilities will be added when needed

  

  return (
    <>
      <div className={styles.dashboard}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={setLanguage}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onContextNavigation={onNavigateHome}
        contextNavigationText="Home"
        contextNavigationIcon="🏠"
        showContextNavigation={true}
        showThemeSelector={true}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onGuestMode={onGuestMode}
        onDemoMode={onDemoMode}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        userMode={userMode}
      />
      
      <div className={styles.dashboardContainer}>

        {/* Integrated Search - TOP PRIORITY */}
        <div className={styles.integratedSearch}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search or try voice commands..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearSearch} onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearchResults(false);
              }}>
                ✕
              </button>
            )}
          </div>
          
          {/* Voice-Enhanced Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <div className={styles.searchResultsHeader}>
                <span>Found {searchResults.length} results</span>
                <div className={styles.voiceSearchSuggestion}>
                  🎤 Try: "Show me {searchQuery}"
                </div>
              </div>
              <div className={styles.searchResultsList}>
                {searchResults.slice(0, 4).map((result, index) => (
                  <div 
                    key={index}
                    className={styles.searchResultItem}
                    onClick={() => {
                      result.action();
                      closeSearchResults();
                    }}
                  >
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitle}>{result.title}</div>
                      <div className={styles.resultSubtitle}>{result.subtitle}</div>
                    </div>
                    <span className={styles.voiceHint}>🎤</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compact Business Intelligence Metrics Bar */}
        <div className={styles.compactMetricsBar}>
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>💰</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L</div>
              <div className={styles.compactLabel}>Outstanding</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>🔥</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{hotLeads}</div>
              <div className={styles.compactLabel}>Hot Leads</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>🏭</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{activeOrders}</div>
              <div className={styles.compactLabel}>Active Orders</div>
            </div>
          </div>
          
          <div className={styles.compactMetric}>
            <span className={styles.compactIcon}>⚠️</span>
            <div className={styles.compactInfo}>
              <div className={styles.compactValue}>{overduePayments + hotLeads}</div>
              <div className={styles.compactLabel}>Priority Items</div>
            </div>
          </div>
        </div>

        {/* 8 Sequential Business Process Cards */}
        <div className={styles.businessProcesses}>
            <div className={styles.processHeader}>
              <h3>🔄 Textile Business Pipeline</h3>
            </div>
            
            {/* Sequential 8-Card Layout with Process Flow */}
            <div className={styles.smartCardsGrid}>
              
              {/* Process Flow Arrows */}
              <div className={`${styles.processFlowArrow} ${styles['arrow-1-2']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-2-3']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-3-4']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-4-5']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-5-6']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-6-7']}`}>→</div>
              <div className={`${styles.processFlowArrow} ${styles['arrow-7-8']}`}>→</div>
              
              {/* Card 1: Lead Pipeline (Business Entry Point) */}
              <div className={`${styles.smartCard} ${styles.cardSales} ${styles['card-1']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-1']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🔥</span>
                  <h4>LEAD PIPELINE</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Pipeline {hotLeads > 3 ? 'Strong' : hotLeads > 1 ? 'Good' : 'Needs Attention'}</span>
                  <span className={styles.keyInsight}>{hotLeads} hot leads worth ₹{((hotLeads * 80000) / 100000).toFixed(1)}L ready for quotes</span>
                  <span className={styles.businessTrend}>↗ {Math.round((hotLeads / totalLeads) * 100)}% hot conversion this month</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Follow up with {Math.max(1, warmLeads)} overdue leads
                </div>
                {leadsReadyForQuotes > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('quotes')}>
                    <span className={styles.contextLinkIcon}>💡</span>
                    <span className={styles.contextLinkText}>{leadsReadyForQuotes} leads ready for quotes</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('leads')} className={styles.cardButton}>
                  Manage Leads →
                </button>
              </div>

              {/* Card 2: Quotations & Orders (Conversion Stage) */}
              <div className={`${styles.smartCard} ${styles.cardQuotes} ${styles['card-2']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-2']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📋</span>
                  <h4>QUOTATIONS & ORDERS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Quote Conversion: {Math.round((approvedQuotes / Math.max(1, mockQuotes.length)) * 100)}%</span>
                  <span className={styles.keyInsight}>₹{((pendingQuotes * 60000 + approvedQuotes * 70000) / 100000).toFixed(1)}L in pending approvals</span>
                  <span className={styles.businessTrend}>↗ {approvedQuotes > pendingQuotes ? 'Faster' : 'Standard'} quote turnaround this week</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: {Math.max(1, mockQuotes.filter(q => new Date(q.validUntil) < new Date(Date.now() + 86400000)).length)} quotes expiring soon
                </div>
                {quotesReadyForAdvance > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('payments')}>
                    <span className={styles.contextLinkIcon}>💰</span>
                    <span className={styles.contextLinkText}>₹{((quotesReadyForAdvance * 50000) / 100000).toFixed(1)}L awaiting payment</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('quotes')} className={styles.cardButton}>
                  Manage Quotes →
                </button>
              </div>

              {/* Card 3: Payments (Complete Financial Workflow Hub) */}
              <div className={`${styles.smartCard} ${styles.cardFinancials} ${styles['card-3']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-3']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>💰</span>
                  <h4>PAYMENTS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Cash Flow: {overduePayments === 0 ? 'Healthy' : overduePayments < 3 ? 'Good' : 'Needs Attention'}</span>
                  <span className={styles.keyInsight}>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L advance payments overdue</span>
                  <span className={styles.businessTrend}>→ Collection rate stable at {Math.round((1 - overduePayments / Math.max(1, approvedQuotes)) * 100)}%</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Chase {Math.max(1, overduePayments)} overdue payments
                </div>
                {approvedQuotes > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('quotes')}>
                    <span className={styles.contextLinkIcon}>📋</span>
                    <span className={styles.contextLinkText}>{approvedQuotes} quotes ready for proforma invoices</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('payments')} className={styles.cardButton}>
                  Manage Payments →
                </button>
              </div>

              {/* Card 4: Production (Manufacturing Stage) */}
              <div className={`${styles.smartCard} ${styles.cardProduction} ${styles['card-4']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-4']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🏭</span>
                  <h4>PRODUCTION</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Production: {activeOrders > 2 ? 'Active' : activeOrders > 0 ? 'Moderate' : 'Planning Phase'}</span>
                  <span className={styles.keyInsight}>₹{((activeOrders * 45000 + readyToShip * 50000) / 100000).toFixed(1)}L orders in manufacturing pipeline</span>
                  <span className={styles.businessTrend}>→ {Math.round((readyToShip / Math.max(1, activeOrders + readyToShip)) * 100)}% completion rate this cycle</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Production modules being developed
                </div>
                {activeOrders > 2 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('inventory')}>
                    <span className={styles.contextLinkIcon}>📦</span>
                    <span className={styles.contextLinkText}>Materials needed for production</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('production')} className={styles.cardButton}>
                  Manage Production →
                </button>
              </div>

              {/* Card 5: Inventory & Materials (Supply Chain) */}
              <div className={`${styles.smartCard} ${styles.cardInventory} ${styles['card-5']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-5']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📦</span>
                  <h4>INVENTORY</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Stock Health: 85% Good</span>
                  <span className={styles.keyInsight}>3 critical materials need immediate reorder attention</span>
                  <span className={styles.businessTrend}>→ ₹{((activeOrders * 15000) / 100000).toFixed(1)}L materials allocated to active orders</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Inventory management modules being developed
                </div>
                {readyToShip > 0 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('fulfillment')}>
                    <span className={styles.contextLinkIcon}>🚚</span>
                    <span className={styles.contextLinkText}>{readyToShip} orders ready for dispatch</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('inventory')} className={styles.cardButton}>
                  Manage Stock →
                </button>
              </div>

              {/* Card 6: Fulfillment (Delivery & Completion) */}
              <div className={`${styles.smartCard} ${styles.cardFulfillment} ${styles['card-6']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-6']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🚚</span>
                  <h4>FULFILLMENT</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Delivery Performance: {readyToShip > 2 ? 'On Track' : readyToShip > 0 ? 'Good' : 'Planning Phase'}</span>
                  <span className={styles.keyInsight}>₹{((readyToShip * 50000) / 100000).toFixed(1)}L orders ready for customer delivery</span>
                  <span className={styles.businessTrend}>→ 95% on-time delivery rate maintained</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Fulfillment modules being developed
                </div>
                {totalCustomers > 5 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('customers')}>
                    <span className={styles.contextLinkIcon}>🤝</span>
                    <span className={styles.contextLinkText}>Feedback pending from customers</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('fulfillment')} className={styles.cardButton}>
                  Manage Delivery →
                </button>
              </div>

              {/* Card 7: Customers (Relationship Management) */}
              <div className={`${styles.smartCard} ${styles.cardCustomers} ${styles['card-7']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-7']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🤝</span>
                  <h4>CUSTOMERS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Customer Health: {repeatCustomerOpportunities > 5 ? 'Excellent' : repeatCustomerOpportunities > 2 ? 'Good' : 'Building'}</span>
                  <span className={styles.keyInsight}>{repeatCustomerOpportunities} customers showing strong repeat business potential</span>
                  <span className={styles.businessTrend}>↗ {Math.round((repeatCustomerOpportunities / totalCustomers) * 100)}% loyalty rate growing</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Review customer list for business opportunities
                </div>
                {repeatCustomerOpportunities > 3 ? (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('leads')}>
                    <span className={styles.contextLinkIcon}>🔥</span>
                    <span className={styles.contextLinkText}>{repeatCustomerOpportunities} repeat opportunities</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('customers')} className={styles.cardButton}>
                  Manage Relations →
                </button>
              </div>

              {/* Card 8: Business Analytics (Intelligence & Optimization) */}
              <div className={`${styles.smartCard} ${styles.cardAnalytics} ${styles['card-8']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-8']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📊</span>
                  <h4>BUSINESS ANALYTICS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span className={styles.businessHealth}>Business Health Score: {conversionRate > 20 ? 'Excellent' : conversionRate > 10 ? 'Good' : 'Improving'}</span>
                  <span className={styles.keyInsight}>{conversionRate}% lead to customer conversion with ₹{(totalRevenue/100000).toFixed(1)}L revenue pipeline</span>
                  <span className={styles.businessTrend}>↗ Cross-process efficiency gaining momentum</span>
                </div>
                <div className={styles.cardNext}>
                  Next Action: Business analytics modules being developed
                </div>
                {(hotLeads < 2 || overduePayments > 2) ? (
                  <div className={styles.smartContextLink} onClick={() => {
                    if (hotLeads < 2) onShowLeadManagement();
                    else if (overduePayments > 2) onShowPayments();
                  }}>
                    <span className={styles.contextLinkIcon}>⚠️</span>
                    <span className={styles.contextLinkText}>
                      {hotLeads < 2 ? 'Low lead conversion needs attention' : 'Payment issues need focus'}
                    </span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                ) : (
                  <div className={styles.cardSpacer}></div>
                )}
                <button onClick={() => handleCardClick('analytics')} className={styles.cardButton}>
                  View Analytics →
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>

      {/* Floating Voice Assistant */}
      <FloatingVoiceAssistant
        currentProcessStage={currentProcessStage}
        onNavigateToLeads={() => { setCurrentProcessStage('leads'); onShowLeadManagement(); }}
        onNavigateToQuotes={() => { setCurrentProcessStage('quotes'); onShowQuotationOrders(); }}
        onNavigateToPayments={() => { setCurrentProcessStage('payments'); onShowPayments(); }}
        onNavigateToProduction={() => { setCurrentProcessStage('production'); onShowSalesOrders(); }}
        onNavigateToInventory={() => { setCurrentProcessStage('inventory'); onShowInventory?.(); }}
        onNavigateToFulfillment={() => { setCurrentProcessStage('fulfillment'); onShowFulfillment?.(); }}
        onNavigateToCustomers={() => { setCurrentProcessStage('customers'); onShowCustomerList(); }}
        onNavigateToAnalytics={() => { setCurrentProcessStage('analytics'); onShowAnalytics?.(); }}
        businessData={businessData}
      />

      {/* Tab Navigation Overlay */}
      {showTabNavigation && activeCardType && (
        <TabNavigation
          {...getTabConfiguration(activeCardType)}
          onClose={closeTabNavigation}
          activeTabContent={activeCardType}
        />
      )}
    </>
  );
}

export default Dashboard;