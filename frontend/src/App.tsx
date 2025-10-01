import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomePage from './website/components/HomePage';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import QuotationOrders from './components/QuotationOrders';
import SalesOrders from './components/SalesOrders';
import Payments from './components/Payments';
import Invoices from './components/Invoices';
import CustomerList from './components/CustomerList';
import CustomerProfile from './components/CustomerProfile';
import ExternalProfileForm, { BusinessProfileFormData } from './components/ExternalProfileForm';
import InventoryManagement from './components/InventoryManagement';
import FulfillmentManagement from './components/FulfillmentManagement';
import AnalyticsManagement from './components/AnalyticsManagement';
import ProductHeader from './components/ProductHeader';
import Authentication from './components/Authentication';
import ServicesHub from './website/components/ServicesHub';
import TurnaroundStories from './website/components/TurnaroundStories';
import BlogHome from './website/components/BlogHome';
import BlogPost from './website/components/BlogPost';
import AboutPage from './website/components/AboutPage';
import ContactPage from './website/components/ContactPage';
import Footer from './website/components/Footer';
import { TranslationProvider } from './contexts/TranslationContext';
import { UserProvider } from './contexts/UserContext';
import { HelmetProvider } from 'react-helmet-async';
import { themes, applyTheme } from './styles/themes';
import { safeLocalStorageSetItem, safeLocalStorageGetItem } from './utils/unicodeUtils';
import { scrollToTop } from './utils/scrollUtils';
import { ActionParams } from './services/nlp/types';
import { createVoiceCommandRouter } from './services/voice/VoiceCommandRouter';
import GlobalSearch, { GlobalSearchRef } from './components/GlobalSearch';
import FloatingVoiceAssistant from './components/FloatingVoiceAssistant';
import { getSearchScope /*, getVoiceScope*/ } from './utils/scopeResolver';
import { useResponsive } from './hooks/useResponsive';
import MobileAppShell from './components/MobileAppShell';
import { 
  mockLeads, 
  mockQuotes, 
  mockSalesOrders, 
  mockBusinessProfiles,
  formatCurrency,
  getBusinessProfileById
} from './data/mockData';

type Language = 'en' | 'gu' | 'hi';
type UserMode = 'guest' | 'demo' | 'authenticated';

// Helper function to determine if current screen is a platform page (needs universal search)
function isPlatformPage(currentScreen: string): boolean {
  const platformPages = [
    'dashboard',
    'leads', 
    'quotes',
    'orders',
    'payments',
    'invoices',
    'customerprofile',
    'customers',
    'inventory',
    'fulfillment',
    'analytics'
  ];
  return platformPages.includes(currentScreen);
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [currentScreen, setCurrentScreen] = useState('homepage');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [userMode, setUserMode] = useState<UserMode>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leadFilter, setLeadFilter] = useState('all');
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('rajesh-textiles');
  const [profileLinkId] = useState('');
  const [profileQuoteId] = useState('');
  
  // Ref to GlobalSearch component for direct search calls
  const globalSearchRef = useRef<GlobalSearchRef>(null);
  const [profileCompanyName] = useState('');
  const [servicesHubResetKey, setServicesHubResetKey] = useState(0);
  const [currentBlogPostSlug, setCurrentBlogPostSlug] = useState('');



  function switchLanguage(language: string) {
    setCurrentLanguage(language as Language);
  }

  function switchTheme(themeName: string) {
    setCurrentTheme(themeName);
    safeLocalStorageSetItem('selectedTheme', themeName);
  }

  const showLeadManagement = useCallback((autoAction?: string, actionParams?: ActionParams) => {
    if (autoAction === 'add-lead' || autoAction === 'ADD_NEW_LEAD') {
      navigate('/leads?action=add-lead');
    } else {
      navigate('/leads');
    }
  }, [navigate]);

  // Universal search function - Execute search on current page
  const handleUniversalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Universal search triggered with query:', query);
    
    // Trigger search on current page via GlobalSearch component
    if (globalSearchRef.current) {
      globalSearchRef.current.performSearch(query);
    } else {
      // eslint-disable-next-line no-console
      console.warn('⚠️ GlobalSearch ref not available, search cannot be executed');
    }
  }, []);

  // Create VoiceCommandRouter instance
  const voiceCommandRouter = useMemo(() => 
    createVoiceCommandRouter(navigate), [navigate]
  );

  // Navigation functions - defined before handleUniversalAction
  const showDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const showQuotationOrders = useCallback(() => {
    navigate('/quotes');
  }, [navigate]);

  // Simplified universal action handler - delegates to VoiceCommandRouter service
  const handleUniversalAction = useCallback((actionType: string, params?: ActionParams) => {
    // eslint-disable-next-line no-console
    console.log('🎯 Universal action triggered:', actionType, params);
    
    // Handle search commands locally (not routed through VoiceCommandRouter)
    if (actionType === 'SEARCH' || actionType === 'GLOBAL_SEARCH') {
      if (params && 'query' in params) {
        handleUniversalSearch(params.query as string);
      }
      return;
    }
    
    // Route all other commands through VoiceCommandRouter service
    voiceCommandRouter.routeVoiceCommand(actionType, params);
  }, [handleUniversalSearch, voiceCommandRouter]);

  useEffect(() => {
    const savedTheme = safeLocalStorageGetItem('selectedTheme', 'light') as string;
    setCurrentTheme(savedTheme);
    const theme = themes[savedTheme] || themes['light'];
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const theme = themes[currentTheme] || themes['light'];
    applyTheme(theme);
  }, [currentTheme]);

  // Sync currentScreen with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentScreen('homepage');
    else if (path === '/login') setCurrentScreen('login');
    else if (path === '/signup') setCurrentScreen('signup');
    else if (path === '/dashboard') setCurrentScreen('dashboard');
    else if (path === '/leads') setCurrentScreen('leads');
    else if (path === '/quotes') setCurrentScreen('quotes');
    else if (path === '/orders') setCurrentScreen('orders');
    else if (path === '/payments') setCurrentScreen('payments');
    else if (path === '/invoices') setCurrentScreen('invoices');
    else if (path.startsWith('/customers/')) setCurrentScreen('customerprofile');
    else if (path === '/customers') setCurrentScreen('customers');
    else if (path === '/inventory') setCurrentScreen('inventory');
    else if (path === '/fulfillment') setCurrentScreen('fulfillment');
    else if (path === '/analytics') setCurrentScreen('analytics');
    else if (path === '/services') setCurrentScreen('services-hub');
    else if (path === '/turnaround-stories') setCurrentScreen('turnaround-stories');
    else if (path === '/blog') setCurrentScreen('blog-home');
    else if (path.startsWith('/blog/')) setCurrentScreen('blog-post');
    else if (path === '/about') setCurrentScreen('about');
    else if (path === '/contact') setCurrentScreen('contact');
    else if (path === '/profile-completion') setCurrentScreen('profilecompletion');
  }, [location.pathname]);

  // Global scroll to top when screen changes
  useEffect(() => {
    // Immediate scroll to top when screen changes
    scrollToTop({ behavior: 'auto' });
    
    // Follow up with smooth scroll after content renders
    setTimeout(() => {
      scrollToTop({ behavior: 'smooth' });
    }, 200);
  }, [currentScreen]);

  // Extract blog slug and customer ID from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      setCurrentBlogPostSlug(slug);
    } else if (path.startsWith('/customers/')) {
      const customerId = path.replace('/customers/', '');
      setSelectedCustomerId(customerId);
    }
  }, [location.pathname]);

  // Additional scroll effect for dynamic content changes within the same screen
  useEffect(() => {
    if (currentBlogPostSlug) {
      // Immediate scroll for blog post changes
      scrollToTop({ behavior: 'auto' });
      
      setTimeout(() => {
        scrollToTop({ behavior: 'smooth' });
      }, 200);
    }
  }, [currentBlogPostSlug]);

  function showHomePage() {
    navigate('/');
  }

  function showLogin() {
    navigate('/login');
  }

  function showSignUp() {
    navigate('/signup');
  }

  function handleAuthSuccess() {
    setIsAuthenticated(true);
    setUserMode('authenticated');
    navigate('/dashboard');
  }

  function handleGuestMode() {
    setUserMode('guest');
    setIsAuthenticated(false);
    navigate('/dashboard');
  }

  function handleDemoMode() {
    setUserMode('demo');
    setIsAuthenticated(false);
    navigate('/dashboard');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setUserMode('guest');
    navigate('/');
  }

  function showQuoteFromLead(leadId: string) {
    navigate('/quotes');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function showLeadFromQuote(leadId: string) {
    navigate('/leads');
  }

  function showSalesOrders() {
    navigate('/orders');
  }

  function showPayments() {
    navigate('/payments');
  }

  function showInvoices() {
    navigate('/invoices');
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function convertToCustomer(quoteId: string) {
    navigate('/orders');
  }

  function showCustomerProfile(customerId: string) {
    setSelectedCustomerId(customerId);
    navigate('/customers/' + customerId);
  }

  function showCustomerList() {
    navigate('/customers');
  }

  function showInventory() {
    navigate('/inventory');
  }

  function showFulfillment() {
    navigate('/fulfillment');
  }

  function showAnalytics() {
    navigate('/analytics');
  }


  function showServicesHub() {
    navigate('/services');
    setServicesHubResetKey(prev => prev + 1); // Force ServicesHub to reset to overview
  }

  function showTurnaroundStories() {
    navigate('/turnaround-stories');
  }


  function showBlogHome() {
    navigate('/blog');
  }

  function showBlogPost(slug: string) {
    setCurrentBlogPostSlug(slug);
    navigate('/blog/' + slug);
  }


  function showAbout() {
    navigate('/about');
  }

  function showContact() {
    navigate('/contact');
  }


  function renderDashboard() {
    return (
      <div className="platformPageContent">
        <Dashboard
          mobile={isMobile}
          currentTheme={currentTheme}
          onThemeChange={switchTheme}
          onNavigateHome={showHomePage}
          onShowLeadManagement={showLeadManagement}
          onShowQuotationOrders={showQuotationOrders}
          onShowSalesOrders={showSalesOrders}
          onShowPayments={showPayments}
          onShowInvoices={showInvoices}
          onShowCustomerList={showCustomerList}
          onShowInventory={showInventory}
          onShowFulfillment={showFulfillment}
          onShowAnalytics={showAnalytics}
          onLogin={showLogin}
          onSignUp={showSignUp}
          onGuestMode={handleGuestMode}
          onDemoMode={handleDemoMode}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          userMode={userMode}
          // onUniversalSearch={handleUniversalSearch}
        />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function renderLanguageSwitcher() {
    return (
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={switchLanguage} 
      />
    );
  }

  function renderLeadManagement() {
    return (
      <div className="platformPageContent">
        <LeadManagement
          mobile={isMobile}
          onShowCustomerProfile={showCustomerProfile}
          onShowQuoteFromLead={showQuoteFromLead}
          onShowQuotationOrders={showQuotationOrders}
          onShowSalesOrders={showSalesOrders}
          filterState={leadFilter}
          onFilterChange={setLeadFilter}
        />
      </div>
    );
  }

  function renderQuotationOrders() {
    return (
      <div className="platformPageContent">
        <QuotationOrders
          onShowSalesOrders={showSalesOrders}
          onShowCustomerProfile={showCustomerProfile}
          onShowLeadManagement={showLeadManagement}
          filterState={quoteFilter}
          onFilterChange={setQuoteFilter}
        />
      </div>
    );
  }

  function renderSalesOrders() {
    return (
      <div className="platformPageContent">
        <SalesOrders
          onShowLeadManagement={showLeadManagement}
          onShowQuotationOrders={showQuotationOrders}
          onShowPayments={showPayments}
          filterState={orderFilter}
          onFilterChange={setOrderFilter}
        />
      </div>
    );
  }

  function renderPayments() {
    return (
      <div className="platformPageContent">
        <Payments
          onShowSalesOrders={showSalesOrders}
          onShowInvoices={showInvoices}
          onShowCustomerProfile={showCustomerProfile}
          filterState={paymentFilter}
          onFilterChange={setPaymentFilter}
        />
      </div>
    );
  }

  function renderInvoices() {
    return (
      <Invoices
        onShowQuotationOrders={showQuotationOrders}
        onShowPayments={showPayments}
        onShowCustomerProfile={showCustomerProfile}
        filterState={invoiceFilter}
        onFilterChange={setInvoiceFilter}
      />
    );
  }

  function renderCustomerProfile() {
    return (
      <CustomerProfile
        customerId={selectedCustomerId}
      />
    );
  }

  function renderCustomerList() {
    return (
      <div className="platformPageContent">
        <CustomerList
          mobile={isMobile}
          onShowCustomerProfile={showCustomerProfile}
          customerSearch={customerSearch}
          onCustomerSearchChange={setCustomerSearch}
        />
      </div>
    );
  }

  function renderAuthentication() {
    return (
      <Authentication
        onAuthSuccess={handleAuthSuccess}
        onGuestMode={handleGuestMode}
        onDemoMode={handleDemoMode}
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }

  function renderHomePage() {
    return (
      <HomePage
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onLogin={showLogin}
        onSignUp={showSignUp}
        onGuestMode={handleGuestMode}
        onDemoMode={handleDemoMode}
        onServicesHub={showServicesHub}
        onBlogHome={showBlogHome}
        onAbout={showAbout}
        onContact={showContact}
      />
    );
  }

  function renderProfileCompletion() {
    function handleProfileSubmit(profileData: BusinessProfileFormData) {
      setTimeout(() => {
        alert('Profile created successfully! Our team will contact you soon.');
        showHomePage();
      }, 2000);
    }

    function handleProfileSuccess(businessProfileId: string) {
    }

    return (
      <ExternalProfileForm
        quoteId={profileQuoteId}
        companyName={profileCompanyName}
        linkId={profileLinkId}
        onSubmit={handleProfileSubmit}
        onSuccess={handleProfileSuccess}
        onCancel={() => showHomePage()}
      />
    );
  }

  function renderInventoryManagement() {
    return (
      <InventoryManagement
        onBackToDashboard={showDashboard}
      />
    );
  }

  function renderFulfillmentManagement() {
    return (
      <FulfillmentManagement
        onBackToDashboard={showDashboard}
      />
    );
  }

  function renderAnalyticsManagement() {
    return (
      <AnalyticsManagement
        mobile={isMobile}
        onBackToDashboard={showDashboard}
      />
    );
  }


  function renderServicesHub() {
    return (
      <ServicesHub
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        resetKey={servicesHubResetKey}
        onAbout={showAbout}
      />
    );
  }

  function renderTurnaroundStories() {
    return (
      <TurnaroundStories
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }


  function renderBlogHome() {
    return (
      <BlogHome
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onBlogPostClick={(day: number) => showBlogPost(`day${day}`)}
      />
    );
  }

  function renderBlogPost() {
    return (
      <BlogPost
        slug={currentBlogPostSlug}
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onBackClick={showBlogHome}
        onNavigateToPost={showBlogPost}
      />
    );
  }

  function renderAbout() {
    return (
      <AboutPage
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }

  function renderContact() {
    return (
      <ContactPage
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }

  return (
    <HelmetProvider>
      <TranslationProvider defaultLanguage={currentLanguage}>
        <UserProvider>
          <div className="App">
          <div className="App-content">
        
        {/* Responsive Layout: Mobile vs Desktop */}
        {isMobile && isPlatformPage(currentScreen) ? (
          // Mobile Layout with MobileAppShell for Platform Pages
          <MobileAppShell>
            <Routes>
              <Route path="/dashboard" element={renderDashboard()} />
              <Route path="/leads" element={renderLeadManagement()} />
              <Route path="/quotes" element={renderQuotationOrders()} />
              <Route path="/orders" element={renderSalesOrders()} />
              <Route path="/payments" element={renderPayments()} />
              <Route path="/invoices" element={renderInvoices()} />
              <Route path="/customers/:customerId" element={renderCustomerProfile()} />
              <Route path="/customers" element={renderCustomerList()} />
              <Route path="/inventory" element={renderInventoryManagement()} />
              <Route path="/fulfillment" element={renderFulfillmentManagement()} />
              <Route path="/analytics" element={renderAnalyticsManagement()} />
              <Route path="*" element={renderDashboard()} />
            </Routes>
          </MobileAppShell>
        ) : (
          // Desktop Layout or Website Pages
          <>
            <ProductHeader
                currentLanguage={currentLanguage}
                onLanguageChange={switchLanguage}
                currentTheme={currentTheme}
                onThemeChange={switchTheme}
                onHome={showHomePage}
                onDashboard={showDashboard}
                onLogin={showLogin}
                onSignUp={showSignUp}
                onGuestMode={handleGuestMode}
                onDemoMode={handleDemoMode}
                onLogout={handleLogout}
                isAuthenticated={isAuthenticated}
                userMode={userMode}
                showWebsiteNavigation={true}
                currentScreen={currentScreen}
                onServicesHub={showServicesHub}
                onTurnaroundStories={showTurnaroundStories}
                onBlogHome={showBlogHome}
                onAbout={showAbout}
                onContact={showContact}
              />
            
            {/* Universal Search Bar - Only on Platform Pages (Desktop) */}
            {isPlatformPage(currentScreen) && (
              <GlobalSearch
                ref={globalSearchRef}
                searchScope={getSearchScope(currentScreen)}
                dataSources={{
                  leads: mockLeads,
                  quotes: mockQuotes,
                  salesOrders: mockSalesOrders,
                  customers: mockBusinessProfiles
                }}
                navigationHandlers={{
                  onShowLeadManagement: showLeadManagement,
                  onShowQuotationOrders: showQuotationOrders,
                  onShowSalesOrders: showSalesOrders,
                  onShowCustomerList: showCustomerList,
                  formatCurrency,
                  getBusinessProfileById
                }}
                placeholder="Search across platform..."
              />
            )}
            
            {/* Universal Voice Assistant - Only on Platform Pages (Desktop) */}
            {isPlatformPage(currentScreen) && (
              <FloatingVoiceAssistant
                currentProcessStage={currentScreen}
                onUniversalAction={handleUniversalAction}
                onPerformSearch={handleUniversalSearch}
                businessData={{
                  hotLeads: mockLeads.filter(lead => lead.priority === 'hot').length,
                  overduePayments: 0, // TODO: Calculate from actual payment data
                  readyToShip: mockSalesOrders.filter(order => order.status === 'ready_to_ship').length,
                  totalCustomers: mockBusinessProfiles.length
                }}
              />
            )}
            
            <Routes>
              <Route path="/" element={renderHomePage()} />
              <Route path="/login" element={renderAuthentication()} />
              <Route path="/signup" element={renderAuthentication()} />
              <Route path="/dashboard" element={renderDashboard()} />
              <Route path="/leads" element={renderLeadManagement()} />
              <Route path="/quotes" element={renderQuotationOrders()} />
              <Route path="/orders" element={renderSalesOrders()} />
              <Route path="/payments" element={renderPayments()} />
              <Route path="/invoices" element={renderInvoices()} />
              <Route path="/customers/:customerId" element={renderCustomerProfile()} />
              <Route path="/customers" element={renderCustomerList()} />
              <Route path="/profile-completion" element={renderProfileCompletion()} />
              <Route path="/inventory" element={renderInventoryManagement()} />
              <Route path="/fulfillment" element={renderFulfillmentManagement()} />
              <Route path="/analytics" element={renderAnalyticsManagement()} />
              <Route path="/services" element={renderServicesHub()} />
              <Route path="/services/:framework" element={renderServicesHub()} />
              <Route path="/turnaround-stories" element={renderTurnaroundStories()} />
              <Route path="/turnaround-stories/:story" element={renderTurnaroundStories()} />
              <Route path="/blog" element={renderBlogHome()} />
              <Route path="/blog/:slug" element={renderBlogPost()} />
              <Route path="/about" element={renderAbout()} />
              <Route path="/contact" element={renderContact()} />
              <Route path="*" element={renderHomePage()} />
            </Routes>
            
            {/* Single Footer for All Pages (Desktop) */}
            <Footer
              currentLanguage={currentLanguage}
              onLanguageChange={switchLanguage}
              onAbout={showAbout}
              onContact={showContact}
            />
          </>
        )}
        
          </div>
        </div>
        </UserProvider>
      </TranslationProvider>
      <Analytics />
    </HelmetProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
