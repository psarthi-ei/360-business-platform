import React, { useState, useEffect } from 'react';
import ProductHeader from './ProductHeader';
import { mockLeads, mockQuotes, mockSalesOrders, mockBusinessProfiles, formatCurrency } from '../data/mockData';
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

  // Voice command processing
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Gujarati commands
    if (lowerCommand.includes('નવી પૂછપરછ') || lowerCommand.includes('લીડ્સ')) {
      onShowLeadManagement();
    } else if (lowerCommand.includes('ચાલતો બિઝનેસ') || lowerCommand.includes('ઓર્ડર')) {
      onShowSalesOrders();
    } else if (lowerCommand.includes('પૈસો') || lowerCommand.includes('પેમેન્ટ')) {
      onShowPayments();
    } else if (lowerCommand.includes('ગ્રાહક') || lowerCommand.includes('કસ્ટમર')) {
      onShowCustomerList();
    }
    // English commands
    else if (lowerCommand.includes('leads') || lowerCommand.includes('inquiry')) {
      onShowLeadManagement();
    } else if (lowerCommand.includes('orders') || lowerCommand.includes('business')) {
      onShowSalesOrders();
    } else if (lowerCommand.includes('money') || lowerCommand.includes('payment')) {
      onShowPayments();
    } else if (lowerCommand.includes('customer')) {
      onShowCustomerList();
    }
    // Hindi commands  
    else if (lowerCommand.includes('लीड') || lowerCommand.includes('पूछताछ')) {
      onShowLeadManagement();
    } else if (lowerCommand.includes('व्यापार') || lowerCommand.includes('ऑर्डर')) {
      onShowSalesOrders();
    } else if (lowerCommand.includes('पैसा') || lowerCommand.includes('पेमेंट')) {
      onShowPayments();
    } else if (lowerCommand.includes('ग्राहक')) {
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
          lead.material.toLowerCase().includes(lowerQuery) ||
          lead.priority.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'lead',
          title: lead.companyName,
          subtitle: `${lead.contactPerson} - ${lead.material}`,
          priority: lead.priority,
          action: () => onShowLeadManagement(),
          category: 'NEW INQUIRIES'
        });
      }
    });

    // Search in quotes
    mockQuotes.forEach(quote => {
      if (quote.customerName.toLowerCase().includes(lowerQuery) ||
          quote.material.toLowerCase().includes(lowerQuery) ||
          quote.status.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'quote',
          title: `Quote #${quote.quoteNumber}`,
          subtitle: `${quote.customerName} - ${quote.material}`,
          status: quote.status,
          action: () => onShowQuotationOrders(),
          category: 'ACTIVE BUSINESS'
        });
      }
    });

    // Search in sales orders
    mockSalesOrders.forEach(order => {
      if (order.customerName.toLowerCase().includes(lowerQuery) ||
          order.material.toLowerCase().includes(lowerQuery) ||
          order.status.toLowerCase().includes(lowerQuery) ||
          order.paymentStatus.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'order',
          title: `Order #${order.orderNumber}`,
          subtitle: `${order.customerName} - ${order.material}`,
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

        {/* Business Owner's Daily View */}
        <div className={styles.ownerDashboard}>
          
          {/* Today's Business Snapshot */}
          <div className={styles.todaysSnapshot}>
            <div className={styles.snapshotHeader}>
              <h3>Today's Business</h3>
              <span className={styles.date}>Monday, Sep 9</span>
            </div>
            
            <div className={styles.keyNumbers}>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>₹2.4L</span>
                <span className={styles.label}>Payment Due Today</span>
                <span className={styles.action}>3 customers</span>
              </div>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>{hotLeads}</span>
                <span className={styles.label}>Hot Leads to Call</span>
                <span className={styles.action}>Follow up now</span>
              </div>
              <div className={styles.keyMetric}>
                <span className={styles.amount}>2,500m</span>
                <span className={styles.label}>Fabric in Production</span>
                <span className={styles.action}>On schedule</span>
              </div>
            </div>
          </div>

          {/* This Month's Performance */}
          <div className={styles.monthlyPerformance}>
            <div className={styles.performanceHeader}>
              <h3>September Performance</h3>
              <span className={styles.trend}>↗️ Growing</span>
            </div>
            
            <div className={styles.performanceGrid}>
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{formatCurrency(totalRevenue / 100000)}L</div>
                <div className={styles.perfLabel}>Total Revenue</div>
                <div className={styles.perfChange}>+18% vs last month</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{totalLeads}</div>
                <div className={styles.perfLabel}>New Inquiries</div>
                <div className={styles.perfChange}>{hotLeads} very interested</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{conversionRate}%</div>
                <div className={styles.perfLabel}>Inquiry to Order</div>
                <div className={styles.perfChange}>Better than industry</div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.perfNumber}>{totalCustomers}</div>
                <div className={styles.perfLabel}>Happy Customers</div>
                <div className={styles.perfChange}>5 repeat orders</div>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className={styles.globalSearch}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder={t('globalSearchPlaceholder') || 'Search customers, orders, leads, quotes...'}
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
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  <div className={styles.searchResultsHeader}>
                    <span>Found {searchResults.length} results for "{searchQuery}"</span>
                    <button onClick={closeSearchResults} className={styles.closeResults}>✕</button>
                  </div>
                  <div className={styles.searchResultsList}>
                    {searchResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`${styles.searchResultItem} ${styles[`result${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`]}`}
                        onClick={() => {
                          result.action();
                          closeSearchResults();
                        }}
                      >
                        <div className={styles.resultContent}>
                          <div className={styles.resultTitle}>{result.title}</div>
                          <div className={styles.resultSubtitle}>{result.subtitle}</div>
                          <div className={styles.resultCategory}>{result.category}</div>
                        </div>
                        <div className={`${styles.resultStatus} ${styles[`status${result.priority || result.status || ''}`.replace(/\s/g, '')]}`}>
                          {result.priority || result.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process-Driven Business Entry Points - 4 Core Processes */}
          <div className={styles.processEntryPoints}>
            <h3>Your Business Processes</h3>
            
            {/* Swipe Navigation Indicators */}
            <div className={styles.swipeIndicators}>
              {processes.map((process, index) => (
                <div 
                  key={process.key}
                  className={`${styles.swipeIndicator} ${index === currentProcess ? styles.active : ''}`}
                  onClick={() => setCurrentProcess(index)}
                >
                  <span className={styles.indicatorDot}></span>
                  <span className={styles.indicatorLabel}>{process.name}</span>
                </div>
              ))}
            </div>

            {/* Process Entry Points Grid - 4 Business Processes */}
            <div 
              className={styles.processGrid}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              
              {/* Process 1: NEW INQUIRIES */}
              <div className={`${styles.processCard} ${styles.processInquiries}`}>
                <div className={styles.processHeader}>
                  <div className={styles.processIcon}>🔥</div>
                  <div className={styles.processTitle}>
                    <h4>NEW INQUIRIES</h4>
                    <p className={styles.processSubtitle}>નવી પૂછપરછ</p>
                    <p className={styles.businessQuestion}>Who called today? What quotes need to be sent?</p>
                  </div>
                </div>
                
                <div className={styles.processMetrics}>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{hotLeads}</span>
                    <span className={styles.metricLabel}>Hot Leads</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{totalLeads}</span>
                    <span className={styles.metricLabel}>Total Inquiries</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{conversionRate}%</span>
                    <span className={styles.metricLabel}>Conversion Rate</span>
                  </div>
                </div>
                
                <div className={styles.processActions}>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowLeadManagement}
                    title="Call hot inquiries needing immediate response"
                  >
                    📞 CALL NOW
                    <span className={styles.actionSubtext}>Hot inquiries needing response</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowQuotationOrders}
                    title="Create quotes for leads ready for pricing"
                  >
                    ✍️ CREATE QUOTES
                    <span className={styles.actionSubtext}>Leads ready for pricing</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowLeadManagement}
                    title="Follow up with warm leads"
                  >
                    📋 FOLLOW UP
                    <span className={styles.actionSubtext}>Warm leads to nurture</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Source analysis and conversion tracking"
                  >
                    📊 INQUIRY REPORTS
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                </div>
                
                <div className={`${styles.smartContext} ${styles[`health${processHealth.inquiries.charAt(0).toUpperCase() + processHealth.inquiries.slice(1)}`]}`}>
                  <div className={styles.contextSuggestion}>
                    💡 <strong>{leadsReadyForQuotes} leads ready for quotes</strong> → Navigate to ACTIVE BUSINESS
                  </div>
                  <div className={styles.processHealthIndicator}>
                    <span className={styles.healthLabel}>Process Health:</span>
                    <span className={`${styles.healthBadge} ${styles[`health${processHealth.inquiries.charAt(0).toUpperCase() + processHealth.inquiries.slice(1)}`]}`}>
                      {processHealth.inquiries.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Process 2: ACTIVE BUSINESS */}
              <div className={`${styles.processCard} ${styles.processBusiness}`}>
                <div className={styles.processHeader}>
                  <div className={styles.processIcon}>💼</div>
                  <div className={styles.processTitle}>
                    <h4>ACTIVE BUSINESS</h4>
                    <p className={styles.processSubtitle}>ચાલતો બિઝનેસ</p>
                    <p className={styles.businessQuestion}>What orders am I working on? What payments should I collect?</p>
                  </div>
                </div>
                
                <div className={styles.processMetrics}>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{mockSalesOrders.length}</span>
                    <span className={styles.metricLabel}>Active Orders</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{mockSalesOrders.filter(o => o.status === 'production').length}</span>
                    <span className={styles.metricLabel}>In Production</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{mockSalesOrders.filter(o => o.status === 'completed').length}</span>
                    <span className={styles.metricLabel}>Ready to Ship</span>
                  </div>
                </div>
                
                <div className={styles.processActions}>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowQuotationOrders}
                    title="Collect 30% advance from approved quotes"
                  >
                    💰 COLLECT ADVANCE
                    <span className={styles.actionSubtext}>Approved quotes ready for payment</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowSalesOrders}
                    title="Track active orders in production"
                  >
                    🔧 IN PRODUCTION
                    <span className={styles.actionSubtext}>Active orders tracking</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowSalesOrders}
                    title="Process completed orders ready for shipment"
                  >
                    📤 READY TO SHIP
                    <span className={styles.actionSubtext}>Completed orders</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Production efficiency and delay analysis"
                  >
                    📊 ORDER REPORTS
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                </div>
                
                <div className={`${styles.smartContext} ${styles[`health${processHealth.business.charAt(0).toUpperCase() + processHealth.business.slice(1)}`]}`}>
                  <div className={styles.contextSuggestion}>
                    💰 <strong>₹{(pendingAdvanceAmount / 100000).toFixed(1)}L advance pending</strong> → Navigate to MONEY MATTERS
                  </div>
                  <div className={styles.processHealthIndicator}>
                    <span className={styles.healthLabel}>Process Health:</span>
                    <span className={`${styles.healthBadge} ${styles[`health${processHealth.business.charAt(0).toUpperCase() + processHealth.business.slice(1)}`]}`}>
                      {processHealth.business.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Process 3: MONEY MATTERS */}
              <div className={`${styles.processCard} ${styles.processMoney}`}>
                <div className={styles.processHeader}>
                  <div className={styles.processIcon}>💳</div>
                  <div className={styles.processTitle}>
                    <h4>MONEY MATTERS</h4>
                    <p className={styles.processSubtitle}>પૈસાનો મામલો</p>
                    <p className={styles.businessQuestion}>Who owes me money? What invoices should I send?</p>
                  </div>
                </div>
                
                <div className={styles.processMetrics}>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>₹{(mockSalesOrders.reduce((sum, o) => sum + (o.status === 'pending' ? o.totalAmount * 0.3 : 0), 0) / 100000).toFixed(1)}L</span>
                    <span className={styles.metricLabel}>Pending Payments</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>₹{(totalRevenue / 100000).toFixed(1)}L</span>
                    <span className={styles.metricLabel}>Total Revenue</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{mockSalesOrders.filter(o => o.paymentStatus.includes('overdue')).length}</span>
                    <span className={styles.metricLabel}>Overdue</span>
                  </div>
                </div>
                
                <div className={styles.processActions}>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowPayments}
                    title="Collect payments due today with overdue reminders"
                  >
                    💰 COLLECT TODAY
                    <span className={styles.actionSubtext}>Due payments priority</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowInvoices}
                    title="Send proforma and final invoices"
                  >
                    📄 SEND INVOICES
                    <span className={styles.actionSubtext}>Proforma & final billing</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Cash flow analysis and monthly trends"
                  >
                    📊 MONEY REPORTS
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Account reconciliation and transaction tracking"
                  >
                    🏦 BANK STATUS
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                </div>
                
                <div className={`${styles.smartContext} ${styles[`health${processHealth.money.charAt(0).toUpperCase() + processHealth.money.slice(1)}`]}`}>
                  <div className={styles.contextSuggestion}>
                    📋 <strong>{overduePayments} overdue payments</strong> → Automatic alerts from ACTIVE BUSINESS
                  </div>
                  <div className={styles.processHealthIndicator}>
                    <span className={styles.healthLabel}>Process Health:</span>
                    <span className={`${styles.healthBadge} ${styles[`health${processHealth.money.charAt(0).toUpperCase() + processHealth.money.slice(1)}`]}`}>
                      {processHealth.money.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Process 4: CUSTOMERS */}
              <div className={`${styles.processCard} ${styles.processCustomers}`}>
                <div className={styles.processHeader}>
                  <div className={styles.processIcon}>🤝</div>
                  <div className={styles.processTitle}>
                    <h4>CUSTOMERS</h4>
                    <p className={styles.processSubtitle}>મારા ગ્રાહકો</p>
                    <p className={styles.businessQuestion}>Who are my best customers? Who should I call for repeat business?</p>
                  </div>
                </div>
                
                <div className={styles.processMetrics}>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{totalCustomers}</span>
                    <span className={styles.metricLabel}>Total Customers</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{Math.floor(totalCustomers * 0.25)}</span>
                    <span className={styles.metricLabel}>VIP Customers</span>
                  </div>
                  <div className={styles.processMetric}>
                    <span className={styles.metricValue}>{Math.floor(totalCustomers * 0.4)}</span>
                    <span className={styles.metricLabel}>Repeat Opportunities</span>
                  </div>
                </div>
                
                <div className={styles.processActions}>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowCustomerList}
                    title="Manage high-value regular customers"
                  >
                    👑 VIP CUSTOMERS
                    <span className={styles.actionSubtext}>High-value regulars</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    onClick={onShowCustomerList}
                    title="Target customers ready for next order"
                  >
                    🎯 TARGET REPEAT
                    <span className={styles.actionSubtext}>Ready for next order</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Collect service satisfaction feedback"
                  >
                    ⭐ GET FEEDBACK
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                  <button 
                    className={styles.processActionCard} 
                    disabled
                    title="Purchase pattern analysis and loyalty metrics"
                  >
                    📊 CUSTOMER REPORTS
                    <span className={styles.actionSubtext}>{t('comingBadge')}</span>
                  </button>
                </div>
                
                <div className={`${styles.smartContext} ${styles[`health${processHealth.customers.charAt(0).toUpperCase() + processHealth.customers.slice(1)}`]}`}>
                  <div className={styles.contextSuggestion}>
                    🎯 <strong>{repeatCustomerOpportunities} repeat order opportunities</strong> → Drive revenue growth
                  </div>
                  <div className={styles.processHealthIndicator}>
                    <span className={styles.healthLabel}>Process Health:</span>
                    <span className={`${styles.healthBadge} ${styles[`health${processHealth.customers.charAt(0).toUpperCase() + processHealth.customers.slice(1)}`]}`}>
                      {processHealth.customers.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Enhanced Voice Assistant with Commands */}
          <div className={styles.voiceAssistant}>
            <div className={styles.voiceContent}>
              <span className={`${styles.voiceIcon} ${isListening ? styles.listening : ''}`}>
                {isListening ? '🎙️' : '🎤'}
              </span>
              <div className={styles.voiceText}>
                <h4>Voice Commands Ready</h4>
                {voiceCommand ? (
                  <p className={styles.lastCommand}>
                    <strong>Last command:</strong> "{voiceCommand}"
                  </p>
                ) : (
                  <p>"આજે કેટલા leads આવ્યા?" • "Payment કોની બાકી છે?" • "Production કેમ ચાલે છે?"</p>
                )}
                <div className={styles.voiceCommands}>
                  <span>Try: "Leads" • "Orders" • "Payment" • "Customers"</span>
                </div>
              </div>
            </div>
            <button 
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              onClick={startVoiceRecognition}
              disabled={isListening}
            >
              {isListening ? 'Listening...' : 'Start Voice'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;