import React, { useState, useEffect } from 'react';
import ProductHeader from './ProductHeader';
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
  
  // Voice command state
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [showVoiceResponse, setShowVoiceResponse] = useState(false);
  
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

  // Enhanced voice command processing with business intelligence
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    
    // Business intelligence queries
    if (lowerCommand.includes('what needs attention') || lowerCommand.includes('શું attention') || lowerCommand.includes('क्या attention')) {
      response = `Today's priorities: ${hotLeads} hot leads need calls, ${overduePayments} overdue payments, ${readyToShip} orders ready to ship`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      return;
    }
    
    // Payment queries
    if (lowerCommand.includes('payment કોની બાકી') || lowerCommand.includes('who owes money') || lowerCommand.includes('pending payments')) {
      const overdueCustomers = mockSalesOrders.filter(order => order.paymentStatus && order.paymentStatus.includes('overdue'));
      const topCustomer = overdueCustomers.length > 0 ? getBusinessProfileById(overdueCustomers[0].businessProfileId)?.companyName : 'None';
      response = `${overdueCustomers.length} customers have overdue payments. Top priority: ${topCustomer}`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      onShowPayments();
      return;
    }
    
    // Hot leads queries
    if (lowerCommand.includes('call hot leads') || lowerCommand.includes('કૉલ કરવા') || lowerCommand.includes('गर्म लीड')) {
      response = `${hotLeads} hot leads ready for calls. Opening lead management...`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      onShowLeadManagement();
      return;
    }
    
    // Order status queries
    if (lowerCommand.includes('order status') || lowerCommand.includes('production status') || lowerCommand.includes('ઓર્ડર status')) {
      response = `${activeOrders} orders in production, ${readyToShip} ready to ship. Opening order tracking...`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      onShowSalesOrders();
      return;
    }
    
    // Customer queries
    if (lowerCommand.includes('best customers') || lowerCommand.includes('vip customers') || lowerCommand.includes('ગ્રાહક કોણ')) {
      response = `You have ${totalCustomers} customers, ${Math.floor(totalCustomers * 0.25)} are VIP customers. Opening customer management...`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      onShowCustomerList();
      return;
    }
    
    // Navigation commands (fallback)
    if (lowerCommand.includes('નવી પૂછપરછ') || lowerCommand.includes('લીડ્સ') || lowerCommand.includes('leads') || lowerCommand.includes('inquiry') || lowerCommand.includes('लीड')) {
      onShowLeadManagement();
    } else if (lowerCommand.includes('ચાલતો બિઝનેસ') || lowerCommand.includes('ઓર્ડર') || lowerCommand.includes('orders') || lowerCommand.includes('business') || lowerCommand.includes('ऑर्डर')) {
      onShowSalesOrders();
    } else if (lowerCommand.includes('પૈસો') || lowerCommand.includes('પેમેન્ટ') || lowerCommand.includes('money') || lowerCommand.includes('payment') || lowerCommand.includes('पैसा')) {
      onShowPayments();
    } else if (lowerCommand.includes('ગ્રાહક') || lowerCommand.includes('કસ્ટમર') || lowerCommand.includes('customer') || lowerCommand.includes('ग्राहक')) {
      onShowCustomerList();
    }
  };

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'gu' ? 'gu-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceCommand(transcript);
        processVoiceCommand(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
        recognition.start();
      }
    }
  }, [isListening, currentLanguage]);

  const startVoiceRecognition = () => {
    setIsListening(true);
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

  // Auto-hide voice response after 5 seconds
  useEffect(() => {
    if (showVoiceResponse) {
      const timer = setTimeout(() => {
        setShowVoiceResponse(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showVoiceResponse]);
  

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
                  <button onClick={() => processVoiceCommand('what needs attention today')}>
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
                  <button onClick={() => processVoiceCommand('business performance')}>
                    Analytics →
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Voice Response Display */}
          {showVoiceResponse && (
            <div className={styles.voiceResponsePanel}>
              <div className={styles.voiceResponseContent}>
                <span className={styles.voiceResponseIcon}>💬</span>
                <div className={styles.voiceResponseText}>
                  <strong>Business Assistant:</strong> {voiceResponse}
                </div>
              </div>
              <button 
                className={styles.closeVoiceResponse} 
                onClick={() => setShowVoiceResponse(false)}
              >
                ✕
              </button>
            </div>
          )}

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

          {/* 8 Smart Business Cards - Complete Business Coverage */}
          <div className={styles.businessProcesses}>
            <div className={styles.processHeader}>
              <h3>Business Operations</h3>
              <div className={styles.processSubtitle}>Complete business management access</div>
            </div>
            
            {/* 8 Smart Business Cards Grid */}
            <div className={styles.smartCardsGrid}>
              
              {/* Card 1: Sales Pipeline */}
              <div className={`${styles.smartCard} ${styles.cardSales}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🔥</span>
                  <h4>{t('salesManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{hotLeads} Hot Leads • {totalLeads} Total</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Follow Up
                </div>
                <button onClick={onShowLeadManagement} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 2: Quotations */}
              <div className={`${styles.smartCard} ${styles.cardQuotes}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📋</span>
                  <h4>{t('quotationManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{pendingQuotes} Pending • {approvedQuotes} Approved</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Send Quotes
                </div>
                <button onClick={onShowQuotationOrders} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 3: Production */}
              <div className={`${styles.smartCard} ${styles.cardProduction}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🏭</span>
                  <h4>{t('productionManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{activeOrders} Active • {readyToShip} Ready</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Quality Check
                </div>
                <button onClick={onShowSalesOrders} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 4: Financials */}
              <div className={`${styles.smartCard} ${styles.cardFinancials}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>💰</span>
                  <h4>{t('financialManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L Due • {overduePayments} Overdue</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Collect Payment
                </div>
                <button onClick={onShowPayments} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 5: Inventory */}
              <div className={`${styles.smartCard} ${styles.cardInventory}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📦</span>
                  <h4>{t('inventoryManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>Cotton: Low • Yarn: Good</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Order Cotton
                </div>
                <button onClick={onShowInventory || (() => console.log('Navigate to Inventory'))} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 6: Fulfillment */}
              <div className={`${styles.smartCard} ${styles.cardFulfillment}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🚚</span>
                  <h4>{t('fulfillmentManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{readyToShip} Ready • 2 Shipped</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Ship Orders
                </div>
                <button onClick={onShowFulfillment || (() => console.log('Navigate to Fulfillment'))} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 7: Customers */}
              <div className={`${styles.smartCard} ${styles.cardCustomers}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🤝</span>
                  <h4>{t('customerManagement')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>{totalCustomers} Active • {Math.floor(totalCustomers * 0.25)} Premium</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: Follow Up
                </div>
                <button onClick={onShowCustomerList} className={styles.cardButton}>
                  {t('manage')} →
                </button>
              </div>

              {/* Card 8: Analytics */}
              <div className={`${styles.smartCard} ${styles.cardAnalytics}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📊</span>
                  <h4>{t('analyticsReports')}</h4>
                </div>
                <div className={styles.cardMetrics}>
                  <span>85% On-Time • 12 Reports</span>
                </div>
                <div className={styles.cardNext}>
                  {t('priorityAction')}: View Reports
                </div>
                <button onClick={onShowAnalytics || (() => console.log('Navigate to Analytics'))} className={styles.cardButton}>
                  View Reports →
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;