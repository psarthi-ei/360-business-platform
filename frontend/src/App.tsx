import React, { useState, useEffect, useCallback } from 'react';
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
import { ActionParams, NavigateAndExecuteParams } from './services/nlp/types';
import GlobalSearch from './components/GlobalSearch';
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
    'quotations',
    'salesorders',
    'advancepayment',
    'invoices',
    'customerprofile',
    'customerlist',
    'inventory',
    'fulfillment',
    'analytics'
  ];
  return platformPages.includes(currentScreen);
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
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
    // TODO: Pass actionParams to LeadManagement for compound actions
    // console.log('showLeadManagement called with:', autoAction, actionParams);
  }, [navigate]);

  // Centralized search function for voice commands
  const handleUniversalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Universal search triggered with query:', query);
    
    // If we're on Dashboard, navigate to Lead Management with search
    if (currentScreen === 'dashboard') {
      showLeadManagement('search', { query });
      return;
    }
    
    // If we're on a platform page with search functionality, trigger search directly
    const platformPagesWithSearch = ['leads', 'quotes', 'sales-orders', 'customers'];
    if (platformPagesWithSearch.includes(currentScreen)) {
      // The GlobalSearch component on these pages will handle the search
      // We just need to ensure the query gets to the search component
      // This will be handled by the GlobalSearch component's onPerformSearch
      // eslint-disable-next-line no-console
      console.log('🎯 On platform page with search, query will be handled by GlobalSearch');
    } else {
      // For other pages, navigate to Lead Management with search
      showLeadManagement('search', { query });
    }
  }, [currentScreen, showLeadManagement]);

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
    else if (path === '/quotes') setCurrentScreen('quotations');
    else if (path === '/orders') setCurrentScreen('salesorders');
    else if (path === '/payments') setCurrentScreen('advancepayment');
    else if (path === '/invoices') setCurrentScreen('invoices');
    else if (path.startsWith('/customers/')) setCurrentScreen('customerprofile');
    else if (path === '/customers') setCurrentScreen('customerlist');
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

  function showDashboard() {
    navigate('/dashboard');
  }

  // Universal action handler - routes cross-page voice commands
  function handleUniversalAction(actionType: string, params?: ActionParams) {
    switch (actionType) {
      case 'NAVIGATE_TO_LEADS':
        showLeadManagement();
        break;
      case 'NAVIGATE_TO_QUOTES':
        showQuotationOrders();
        break;
      case 'NAVIGATE_TO_ORDERS':
        showSalesOrders();
        break;
      case 'NAVIGATE_TO_PAYMENTS':
        showPayments();
        break;
      case 'NAVIGATE_TO_INVOICES':
        showInvoices();
        break;
      case 'NAVIGATE_TO_CUSTOMERS':
        showCustomerList();
        break;
      case 'NAVIGATE_TO_INVENTORY':
        showInventory();
        break;
      case 'NAVIGATE_TO_FULFILLMENT':
        showFulfillment();
        break;
      case 'NAVIGATE_TO_ANALYTICS':
        showAnalytics();
        break;
      case 'NAVIGATE_TO_DASHBOARD':
        showDashboard();
        break;
      case 'NAVIGATE_AND_EXECUTE':
        // Handle compound actions from voice commands
        if (params && 'targetContext' in params && 'action' in params) {
          const navParams = params as NavigateAndExecuteParams;
          if (navParams.targetContext === 'leads' && navParams.action === 'ADD_NEW_LEAD') {
            showLeadManagement('ADD_NEW_LEAD', navParams.params);
          } else {
            // TODO: Handle unhandled NAVIGATE_AND_EXECUTE
          }
        }
        break;
      default:
        // TODO: Handle unhandled universal action
    }
  }

  function showQuotationOrders() {
    navigate('/quotes');
  }

  function showQuoteFromLead(leadId: string) {
    // In a real app, this would pass the lead ID to create a new quote
    navigate('/quotes');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function showLeadFromQuote(leadId: string) {
    // In a real app, this would highlight the specific lead
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
    // In a real app, this would convert quote to customer and create sales order
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
          onUniversalSearch={handleUniversalSearch}
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
          onShowCustomerProfile={showCustomerProfile}
          onShowQuoteFromLead={showQuoteFromLead}
          onShowQuotationOrders={showQuotationOrders}
          onShowSalesOrders={showSalesOrders}
          filterState={leadFilter}
          onFilterChange={setLeadFilter}
          onUniversalAction={handleUniversalAction}
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
          onUniversalAction={handleUniversalAction}
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
          onUniversalAction={handleUniversalAction}
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
          onUniversalAction={handleUniversalAction}
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
        onUniversalAction={handleUniversalAction}
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
          onShowCustomerProfile={showCustomerProfile}
          customerSearch={customerSearch}
          onCustomerSearchChange={setCustomerSearch}
          onUniversalAction={handleUniversalAction}
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
      // Profile submitted successfully
      // Show success message and redirect to homepage
      setTimeout(() => {
        alert('Profile created successfully! Our team will contact you soon.');
        showHomePage();
      }, 2000);
    }

    function handleProfileSuccess(businessProfileId: string) {
      // Business profile created successfully
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
        onUniversalAction={handleUniversalAction}
      />
    );
  }

  function renderFulfillmentManagement() {
    return (
      <FulfillmentManagement
        onBackToDashboard={showDashboard}
        onUniversalAction={handleUniversalAction}
      />
    );
  }

  function renderAnalyticsManagement() {
    return (
      <AnalyticsManagement
        onBackToDashboard={showDashboard}
        onUniversalAction={handleUniversalAction}
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
            // Website Navigation Props - Always show for consistent UX
            showWebsiteNavigation={true}
            currentScreen={currentScreen}
            onServicesHub={showServicesHub}
            onTurnaroundStories={showTurnaroundStories}
            onBlogHome={showBlogHome}
            onAbout={showAbout}
            onContact={showContact}
          />
        
        {/* Universal Search Bar - Only on Platform Pages */}
        {isPlatformPage(currentScreen) && (
          <GlobalSearch
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
            onUniversalAction={handleUniversalAction}
            placeholder="Search or try voice commands..."
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
        
        {/* Single Footer for All Pages */}
        <Footer
          currentLanguage={currentLanguage}
          onLanguageChange={switchLanguage}
          onAbout={showAbout}
          onContact={showContact}
        />
        
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
