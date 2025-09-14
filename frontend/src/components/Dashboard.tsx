import React, { useState, useEffect } from 'react';
import ProductHeader from './ProductHeader';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import TabNavigation from './TabNavigation';
import ProcessMetrics from './ProcessMetrics';
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
  const { t, currentLanguage, setLanguage } = useTranslation();
  
  // Swipe navigation state
  const [currentProcess, setCurrentProcess] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  
  // Current process stage for voice assistant
  const [currentProcessStage, setCurrentProcessStage] = useState('dashboard');
  
  // Tab navigation state
  const [showTabNavigation, setShowTabNavigation] = useState(false);
  const [activeCardType, setActiveCardType] = useState<string | null>(null);
  
  // Process metrics state
  const [showProcessMetrics, setShowProcessMetrics] = useState(false);
  
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

  // Process metrics handlers
  const showMetrics = () => {
    setShowProcessMetrics(true);
  };

  const closeMetrics = () => {
    setShowProcessMetrics(false);
  };

  const handleMetricsStageClick = (stage: string) => {
    setShowProcessMetrics(false);
    handleCardClick(stage);
  };

  // Get tab configuration for each card type
  const getTabConfiguration = (cardType: string) => {
    const configurations = {
      'leads': {
        title: 'LEAD PIPELINE MANAGEMENT',
        icon: '🔥',
        tabs: [
          { id: 'all', label: 'All Leads', icon: '📋', count: totalLeads, action: onShowLeadManagement },
          { id: 'hot', label: 'Hot Leads', icon: '🔥', count: hotLeads },
          { id: 'followup', label: 'Follow-up', icon: '📞', count: warmLeads },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `${hotLeads} Hot • ${warmLeads} Warm • ${totalLeads - hotLeads - warmLeads} Cold`,
        nextAction: 'Call Surat Textiles',
        voiceCommands: ['Show hot leads', 'Add new lead', 'Call next lead'],
        smartLinks: [
          { text: `${leadsReadyForQuotes} leads ready for quotes`, action: () => handleCardClick('quotes') },
          { text: `${Math.floor(totalCustomers * 0.3)} leads from existing customers`, action: () => handleCardClick('customers') }
        ]
      },
      'quotes': {
        title: 'QUOTATIONS & ORDERS',
        icon: '📋',
        tabs: [
          { id: 'all', label: 'All Quotes', icon: '📋', count: mockQuotes.length, action: onShowQuotationOrders },
          { id: 'pending', label: 'Pending', icon: '⏳', count: pendingQuotes },
          { id: 'approved', label: 'Approved', icon: '✅', count: approvedQuotes },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `${pendingQuotes} Pending • ${approvedQuotes} Approved • ${Math.round((approvedQuotes/mockQuotes.length)*100)}% Success Rate`,
        nextAction: 'Follow up on Premium Cotton quote',
        voiceCommands: ['Create quote', 'Show pending quotes', 'Quote approval status'],
        smartLinks: [
          { text: `₹${(pendingAdvanceAmount/100000).toFixed(1)}L quotes approved, awaiting payment`, action: () => handleCardClick('payments') },
          { text: 'Quote for existing customer', action: () => handleCardClick('customers') }
        ]
      },
      'payments': {
        title: 'ADVANCE PAYMENTS',
        icon: '💰',
        tabs: [
          { id: 'all', label: 'All Payments', icon: '💰', action: onShowPayments },
          { id: 'pending', label: 'Outstanding', icon: '⏰', count: overduePayments },
          { id: 'received', label: 'Received', icon: '✅' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `₹${(pendingAdvanceAmount/100000).toFixed(1)}L Outstanding • ${overduePayments} Overdue Customers`,
        nextAction: 'Follow up with Gujarat Mills for ₹2.4L payment',
        voiceCommands: ['Record payment', 'Outstanding payments', 'Payment reminders'],
        smartLinks: [
          { text: 'Payment received, ready for production', action: () => handleCardClick('production') },
          { text: `${Math.floor(totalCustomers * 0.2)} customers created from payments`, action: () => handleCardClick('customers') }
        ]
      },
      'production': {
        title: 'PRODUCTION MANAGEMENT',
        icon: '🏭',
        tabs: [
          { id: 'all', label: 'All Orders', icon: '🏭', count: mockSalesOrders.length, action: onShowSalesOrders },
          { id: 'active', label: 'In Production', icon: '⚙️', count: activeOrders },
          { id: 'quality', label: 'Quality Check', icon: '🔍' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `${activeOrders} In Production • ${readyToShip} Ready to Ship • 92% On Time`,
        nextAction: 'Quality check for Ahmedabad Textiles order',
        voiceCommands: ['Production status', 'Start production', 'Quality check'],
        smartLinks: [
          { text: 'Materials needed for orders', action: () => handleCardClick('inventory') },
          { text: `${readyToShip} completed orders ready to ship`, action: () => handleCardClick('fulfillment') }
        ]
      },
      'inventory': {
        title: 'INVENTORY & MATERIALS',
        icon: '📦',
        tabs: [
          { id: 'all', label: 'All Stock', icon: '📦', action: onShowInventory },
          { id: 'low', label: 'Low Stock', icon: '⚠️', count: 3 },
          { id: 'procurement', label: 'Procurement', icon: '🛒' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: '85% Stock Health • 3 Items Low Stock • ₹12.5L Inventory Value',
        nextAction: 'Reorder Cotton 40s - only 2 days stock left',
        voiceCommands: ['Stock check', 'Material order', 'Stock allocation'],
        smartLinks: [
          { text: 'Stock reserved for orders', action: () => handleCardClick('production') },
          { text: 'Materials ready for dispatch', action: () => handleCardClick('fulfillment') }
        ]
      },
      'fulfillment': {
        title: 'FULFILLMENT & DELIVERY',
        icon: '🚚',
        tabs: [
          { id: 'all', label: 'All Shipments', icon: '🚚', action: onShowFulfillment },
          { id: 'ready', label: 'Ready to Ship', icon: '📦', count: readyToShip },
          { id: 'transit', label: 'In Transit', icon: '🚛', count: 2 },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `${readyToShip} Ready • 2 In Transit • 1 Delivered Today`,
        nextAction: 'Schedule pickup for Mumbai Exports order',
        voiceCommands: ['Ready to ship', 'Dispatch status', 'Delivery tracking'],
        smartLinks: [
          { text: 'Orders delivered, generate invoice', action: () => handleCardClick('analytics') },
          { text: 'Customer feedback pending', action: () => handleCardClick('customers') }
        ]
      },
      'customers': {
        title: 'CUSTOMER MANAGEMENT',
        icon: '🤝',
        tabs: [
          { id: 'all', label: 'All Customers', icon: '🤝', count: totalCustomers, action: onShowCustomerList },
          { id: 'vip', label: 'VIP Customers', icon: '⭐', count: Math.floor(totalCustomers * 0.25) },
          { id: 'feedback', label: 'Feedback', icon: '💬' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ],
        quickStats: `${totalCustomers} Total • ${Math.floor(totalCustomers * 0.25)} VIP • ${Math.floor(totalCustomers * 0.6)} Active This Month`,
        nextAction: 'Follow up with Rajkot Industries for repeat order',
        voiceCommands: ['Customer profile', 'VIP customers', 'Customer feedback'],
        smartLinks: [
          { text: `${repeatCustomerOpportunities} customers ready for repeat orders`, action: () => handleCardClick('leads') },
          { text: 'Payment due from customers', action: () => handleCardClick('payments') }
        ]
      },
      'analytics': {
        title: 'BUSINESS ANALYTICS',
        icon: '📊',
        tabs: [
          { id: 'overview', label: 'Overview', icon: '📊', action: onShowAnalytics },
          { id: 'financial', label: 'Financial', icon: '💰' },
          { id: 'operations', label: 'Operations', icon: '⚙️' },
          { id: 'reports', label: 'Reports', icon: '📋' }
        ],
        quickStats: `₹${(totalRevenue/100000).toFixed(1)}L Revenue • ${conversionRate}% Conversion • 94% Customer Satisfaction`,
        nextAction: 'Review monthly performance report',
        voiceCommands: ['Business performance', 'Monthly sales', 'Show KPIs'],
        smartLinks: [
          { text: 'View Process Metrics & KPIs', action: showMetrics },
          { text: 'Low conversion leads need attention', action: () => handleCardClick('leads') },
          { text: 'Production efficiency insights', action: () => handleCardClick('production') }
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
  
  // Process completion indicators
  const processHealth = {
    inquiries: hotLeads > 3 ? 'excellent' : hotLeads > 1 ? 'good' : 'attention',
    business: activeOrders > 2 ? 'excellent' : activeOrders > 0 ? 'good' : 'attention', 
    money: overduePayments === 0 ? 'excellent' : overduePayments < 3 ? 'good' : 'attention',
    customers: repeatCustomerOpportunities > 5 ? 'excellent' : repeatCustomerOpportunities > 2 ? 'good' : 'attention'
  };

  // Process navigation array for swipe navigation
  const processes = [
    { key: 'inquiries', name: 'NEW INQUIRIES', handler: onShowLeadManagement },
    { key: 'business', name: 'ACTIVE BUSINESS', handler: onShowSalesOrders },
    { key: 'money', name: 'MONEY MATTERS', handler: onShowPayments },
    { key: 'customers', name: 'CUSTOMERS', handler: onShowCustomerList }
  ];

  // Swipe navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentProcess < processes.length - 1) {
      setCurrentProcess(currentProcess + 1);
    } else if (isRightSwipe && currentProcess > 0) {
      setCurrentProcess(currentProcess - 1);
    }
  };




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

  // Utility function for dynamic date
  const getCurrentDateString = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  

  return (
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

        {/* Executive Business Intelligence Dashboard */}
        <div className={styles.executiveDashboard}>
          
          {/* Executive Summary Section - 40% of dashboard */}
          <div className={styles.executiveSummary}>
            <div className={styles.executiveSummaryHeader}>
              <h2>📊 Business Intelligence - {getCurrentDateString()}</h2>
              <button 
                className={styles.processIntelligenceButton}
                onClick={showMetrics}
                title="View Process Metrics & KPIs"
              >
                <span className={styles.buttonIcon}>🎯</span>
                <span className={styles.buttonText}>Process Intelligence</span>
              </button>
            </div>
            
            {/* Business Health Cards */}
            <div className={styles.businessHealthGrid}>
              
              {/* Financial Health */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>💰</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L</div>
                    <div className={styles.metricLabel}>Outstanding Payments</div>
                    <div className={styles.trendIndicator}>
                      <span className={overduePayments > 0 ? styles.trendNegative : styles.trendPositive}>
                        {overduePayments > 0 ? `${overduePayments} overdue` : 'All current'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={onShowPayments}>View Details →</button>
                </div>
              </div>

              {/* Sales Pipeline */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🔥</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>{hotLeads}</div>
                    <div className={styles.metricLabel}>Priority Leads</div>
                    <div className={styles.trendIndicator}>
                      <span className={styles.trendPositive}>
                        {totalLeads} Total Inquiries
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={onShowLeadManagement}>View Details →</button>
                </div>
              </div>

              {/* Operations Status */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🏭</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>{activeOrders}</div>
                    <div className={styles.metricLabel}>Active Orders</div>
                    <div className={styles.trendIndicator}>
                      <span className={styles.trendPositive}>
                        {readyToShip} Ready to Ship
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={onShowSalesOrders}>View Details →</button>
                </div>
              </div>

              {/* Customer Insights */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>🤝</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>{totalCustomers}</div>
                    <div className={styles.metricLabel}>Active Customers</div>
                    <div className={styles.trendIndicator}>
                      <span className={styles.trendPositive}>
                        95% Satisfaction Rate
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={onShowCustomerList}>View Details →</button>
                </div>
              </div>

              {/* Priority Alerts */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>⚠️</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>{overduePayments + hotLeads}</div>
                    <div className={styles.metricLabel}>Priority Items</div>
                    <div className={styles.trendIndicator}>
                      <span className={overduePayments > 0 ? styles.trendNegative : styles.trendPositive}>
                        Needs immediate attention
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={() => onShowLeadManagement()}>
                    Show Details →
                  </button>
                </div>
              </div>

              {/* Today's Summary */}
              <div className={styles.businessHealthCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricIcon}>📈</span>
                  <div className={styles.metricInfo}>
                    <div className={styles.metricValue}>₹{((activeOrders * 50000) / 100000).toFixed(1)}L</div>
                    <div className={styles.metricLabel}>Business Value</div>
                    <div className={styles.trendIndicator}>
                      <span className={styles.trendPositive}>
                        Active pipeline value
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.quickAction}>
                  <button onClick={() => onShowAnalytics?.()}>
                    Analytics →
                  </button>
                </div>
              </div>

            </div>
          </div>


          {/* Integrated Search */}
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

          {/* 8 Sequential Business Process Cards */}
          <div className={styles.businessProcesses}>
            <div className={styles.processHeader}>
              <h3>🔄 Business Process Flow</h3>
              <div className={styles.processSubtitle}>Sequential workflow from lead to customer - natural textile manufacturing process</div>
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
                  <span>{hotLeads} Hot • {warmLeads} Warm • {totalLeads - hotLeads - warmLeads} Cold</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Call {leadsReadyForQuotes} leads → Quotations
                </div>
                {leadsReadyForQuotes > 0 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('quotes')}>
                    <span className={styles.contextLinkIcon}>💡</span>
                    <span className={styles.contextLinkText}>{leadsReadyForQuotes} leads ready for quotes</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
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
                  <h4>QUOTATIONS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{pendingQuotes} Pending • {approvedQuotes} Approved</span>
                </div>
                <div className={styles.cardNext}>
                  Next: {quotesReadyForAdvance} quotes → Advance Payments
                </div>
                {quotesReadyForAdvance > 0 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('payments')}>
                    <span className={styles.contextLinkIcon}>💰</span>
                    <span className={styles.contextLinkText}>₹{((quotesReadyForAdvance * 50000) / 100000).toFixed(1)}L awaiting payment</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                )}
                <button onClick={() => handleCardClick('quotes')} className={styles.cardButton}>
                  Manage Quotes →
                </button>
              </div>

              {/* Card 3: Advance Payments (Financial Commitment Gate) */}
              <div className={`${styles.smartCard} ${styles.cardFinancials} ${styles['card-3']}`}>
                <div className={`${styles.stageIndicator} ${styles['stage-3']}`}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>💰</span>
                  <h4>ADVANCE PAYMENTS</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L Due • {overduePayments} Overdue</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Payment received → Production
                </div>
                {activeOrders > 0 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('production')}>
                    <span className={styles.contextLinkIcon}>🏭</span>
                    <span className={styles.contextLinkText}>{activeOrders} orders ready for production</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
                )}
                <button onClick={() => handleCardClick('payments')} className={styles.cardButton}>
                  Collect Payments →
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
                  <span>{activeOrders} In Production • {readyToShip} Completed</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Materials needed → Inventory
                </div>
                {activeOrders > 2 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('inventory')}>
                    <span className={styles.contextLinkIcon}>📦</span>
                    <span className={styles.contextLinkText}>Materials needed for production</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
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
                  <span>Cotton: Low • Yarn: Good • 2 Orders Reserved</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Stock ready → Fulfillment
                </div>
                {readyToShip > 0 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('fulfillment')}>
                    <span className={styles.contextLinkIcon}>🚚</span>
                    <span className={styles.contextLinkText}>{readyToShip} orders ready for dispatch</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
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
                  <span>{readyToShip} Ready to Ship • 2 Delivered</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Orders delivered → Customer feedback
                </div>
                {totalCustomers > 5 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('customers')}>
                    <span className={styles.contextLinkIcon}>🤝</span>
                    <span className={styles.contextLinkText}>Feedback pending from customers</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
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
                  <span>{totalCustomers} Active • {repeatCustomerOpportunities} Repeat Opportunities</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Repeat business → Lead Pipeline
                </div>
                {repeatCustomerOpportunities > 3 && (
                  <div className={styles.smartContextLink} onClick={() => handleCardClick('leads')}>
                    <span className={styles.contextLinkIcon}>🔥</span>
                    <span className={styles.contextLinkText}>{repeatCustomerOpportunities} repeat opportunities</span>
                    <span className={styles.contextLinkArrow}>→</span>
                  </div>
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
                  <span>{conversionRate}% Conversion • Pipeline Health: Good</span>
                </div>
                <div className={styles.cardNext}>
                  Next: Optimize → All process stages
                </div>
                {(hotLeads < 2 || overduePayments > 2) && (
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
        >
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
            <h3>Sub-module content will be loaded here</h3>
            <p>This is where the specific module interface ({activeCardType}) will be displayed with tabs and detailed functionality.</p>
          </div>
        </TabNavigation>
      )}

      {/* Process Metrics Overlay */}
      {showProcessMetrics && (
        <div className={styles.metricsOverlay}>
          <div className={styles.metricsContainer}>
            <div className={styles.metricsHeader}>
              <h2>Business Process Intelligence</h2>
              <button 
                className={styles.closeMetricsButton}
                onClick={closeMetrics}
                aria-label="Close Metrics"
              >
                ✕
              </button>
            </div>
            <div className={styles.metricsContent}>
              <ProcessMetrics onStageClick={handleMetricsStageClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;