import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import HomePage from './website/components/HomePage';
import Dashboard from './components/dashboard/Dashboard';
import LeadManagement from './components/business/LeadManagement';
import QuotationOrders from './components/business/QuotationOrders';
import SalesOrders from './components/business/SalesOrders';
import Payments from './components/business/Payments';
import Invoices from './components/business/Invoices';
import CustomerList from './components/business/CustomerList';
import CustomerProfile from './components/business/CustomerProfile';
import ExternalProfileForm, { BusinessProfileFormData } from './components/auth/ExternalProfileForm';
import InventoryManagement from './components/business/InventoryManagement';
import FulfillmentManagement from './components/business/FulfillmentManagement';
import AnalyticsManagement from './components/business/AnalyticsManagement';
import WebsiteHeader from './components/ui/WebsiteHeader';
import Authentication from './components/auth/Authentication';
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
// Theme-related imports removed for MVP simplicity
import { scrollToTop } from './utils/scrollUtils';
import { createVoiceCommandRouter } from './services/voice/VoiceCommandRouter';
// GlobalSearch and FloatingVoiceAssistant now handled by PlatformShell
import { useResponsive } from './hooks/useResponsive';
import PlatformShell from './components/platform/PlatformShell';
import { createNavigationHelpers } from './core/navigationBusinessLogic';
import { createUniversalActionHandler } from './core/voiceBusinessLogic';
import { createPlatformRoutes, createWebsiteRoutes, RenderFunctions } from './core/routeBusinessLogic';

type Language = 'en' | 'gu' | 'hi';
type UserMode = 'guest' | 'demo' | 'authenticated';

// Helper function to get screen name from pathname
function getScreenFromPath(pathname: string): string {
  // Website routes
  if (pathname === '/') return 'homepage';
  if (pathname === '/login') return 'login';
  if (pathname === '/signup') return 'signup';
  if (pathname === '/services') return 'services-hub';
  if (pathname === '/turnaround-stories') return 'turnaround-stories';
  if (pathname === '/blog') return 'blog-home';
  if (pathname.startsWith('/blog/')) return 'blog-post';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/profile-completion') return 'profilecompletion';
  
  // Platform routes - /platform/* pattern with nested routing
  if (pathname === '/platform' || pathname === '/platform/' || pathname === '/platform/dashboard') return 'dashboard';
  if (pathname === '/platform/home') return 'home';
  if (pathname === '/platform/leads') return 'leads';
  if (pathname === '/platform/quotes') return 'quotes';
  if (pathname === '/platform/orders') return 'orders';
  if (pathname === '/platform/payments') return 'payments';
  if (pathname === '/platform/invoices') return 'invoices';
  if (pathname.startsWith('/platform/customers/')) return 'customerprofile';
  if (pathname === '/platform/customers') return 'customers';
  if (pathname === '/platform/inventory') return 'inventory';
  if (pathname === '/platform/fulfillment') return 'fulfillment';
  if (pathname === '/platform/analytics') return 'analytics';
  if (pathname === '/platform/sales') return 'sales';
  if (pathname === '/platform/production') return 'production';
  if (pathname === '/platform/procurement') return 'procurement';
  
  return 'homepage';
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();
  
  // Initialize currentScreen based on current URL to prevent timing issues
  const [currentScreen, setCurrentScreen] = useState(() => getScreenFromPath(location.pathname));
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
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
  
  // GlobalSearch ref now handled within PlatformShell
  const [profileCompanyName] = useState('');
  const [servicesHubResetKey, setServicesHubResetKey] = useState(0);
  const [currentBlogPostSlug, setCurrentBlogPostSlug] = useState('');



  function switchLanguage(language: string) {
    setCurrentLanguage(language as Language);
  }

  // Shared navigation helpers - single source of truth
  const navigationHelpers = createNavigationHelpers(navigate, {
    setSelectedCustomerId,
    setServicesHubResetKey,
    setCurrentBlogPostSlug
  });


  // Navigation functions destructured from shared helpers
  const {
    showHomePage,
    showDashboard,
    showLeadManagement,
    showQuotationOrders,
    showSalesOrders,
    showPayments,
    showInvoices,
    showCustomerList,
    showInventory,
    showFulfillment,
    showAnalytics,
    showLogin,
    showSignUp,
    showTurnaroundStories,
    showBlogHome,
    showAbout,
    showContact,
    showQuoteFromLead,
    // Enhanced navigation functions with state management
    showCustomerProfileWithState,
    showServicesHubWithReset,
    showBlogPostWithState
  } = navigationHelpers;

  // Universal search function - Now handled by PlatformShell
  const handleUniversalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Universal search triggered with query:', query);
    // Note: Actual search execution now handled within PlatformShell
  }, []);

  // Create VoiceCommandRouter instance
  const voiceCommandRouter = useMemo(() => 
    createVoiceCommandRouter(navigate), [navigate]
  );


  // Universal action handler using shared business logic
  const handleUniversalAction = useMemo(() => 
    createUniversalActionHandler(navigate, voiceCommandRouter, handleUniversalSearch), 
    [navigate, voiceCommandRouter, handleUniversalSearch]
  );



  // Sync currentScreen with URL path
  useEffect(() => {
    setCurrentScreen(getScreenFromPath(location.pathname));
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


  function handleAuthSuccess() {
    setIsAuthenticated(true);
    setUserMode('authenticated');
    showDashboard();
  }

  function handleGuestMode() {
    setUserMode('guest');
    setIsAuthenticated(false);
    showDashboard();
  }

  function handleDemoMode() {
    setUserMode('demo');
    setIsAuthenticated(false);
    showDashboard();
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setUserMode('guest');
    navigate('/');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function showLeadFromQuote(leadId: string) {
    navigate('/leads');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function convertToCustomer(quoteId: string) {
    navigate('/orders');
  }



  function renderDashboard() {
    return (
      <div className="platformPageContent">
        <Dashboard
          onShowLeadManagement={showLeadManagement}
          onShowQuotationOrders={showQuotationOrders}
          onShowSalesOrders={showSalesOrders}
          onShowPayments={showPayments}
          onShowInvoices={showInvoices}
          onShowCustomerList={showCustomerList}
          onShowInventory={showInventory}
          onShowFulfillment={showFulfillment}
          onShowAnalytics={showAnalytics}
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
          onShowCustomerProfile={showCustomerProfileWithState}
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
          onShowCustomerProfile={showCustomerProfileWithState}
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
          onShowCustomerProfile={showCustomerProfileWithState}
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
        onShowCustomerProfile={showCustomerProfileWithState}
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
          onShowCustomerProfile={showCustomerProfileWithState}
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
        onServicesHub={showServicesHubWithReset}
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
        onBlogPostClick={(day: number) => showBlogPostWithState(`day${day}`)}
      />
    );
  }

  function renderBlogPost() {
    // Create a wrapper component that can use useParams
    const BlogPostWrapper = () => {
      const { slug } = useParams<{ slug: string }>();
      
      // Update state with the URL parameter
      useEffect(() => {
        if (slug) {
          setCurrentBlogPostSlug(slug);
        }
      }, [slug]);
      
      return (
        <BlogPost
          slug={slug || ''}
          currentLanguage={currentLanguage}
          onLanguageChange={switchLanguage}
          onBackClick={showBlogHome}
          onNavigateToPost={showBlogPostWithState}
        />
      );
    };
    
    return <BlogPostWrapper />;
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

  function renderExternalProfileForm() {
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

  // Render functions object for shared route configuration
  const renderFunctions: RenderFunctions = {
    renderHomePage,
    renderDashboard,
    renderLeadManagement,
    renderQuotationOrders,
    renderSalesOrders,
    renderPayments,
    renderInvoices,
    renderCustomerList,
    renderCustomerProfile,
    renderInventoryManagement,
    renderFulfillmentManagement,
    renderAnalyticsManagement,
    renderAuthentication,
    renderProfileCompletion,
    renderServicesHub,
    renderTurnaroundStories,
    renderBlogHome,
    renderBlogPost,
    renderAbout,
    renderContact,
    renderExternalProfileForm
  };

  return (
    <HelmetProvider>
      <TranslationProvider defaultLanguage={currentLanguage}>
        <UserProvider>
          <div className="App">
          <div className="App-content">
        
        {/* Clean Layout Routes: Platform vs Website */}
        <Routes>
          {/* Platform Layout Route */}
          <Route path="/platform/*" element={
            <PlatformShell
              currentLanguage={currentLanguage}
              onLanguageChange={switchLanguage}
              onHome={showHomePage}
              onLogin={showLogin}
              onSignUp={showSignUp}
              onGuestMode={handleGuestMode}
              onDemoMode={handleDemoMode}
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
              userMode={userMode}
              currentScreen={currentScreen}
              onUniversalAction={handleUniversalAction}
              onPerformSearch={handleUniversalSearch}
            >
              <Outlet />
            </PlatformShell>
          }>
            {createPlatformRoutes(renderFunctions)}
          </Route>
          
          {/* Website Layout Route */}
          <Route path="/*" element={
            <>
              <WebsiteHeader
                currentLanguage={currentLanguage}
                onLanguageChange={switchLanguage}
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
                onServicesHub={showServicesHubWithReset}
                onTurnaroundStories={showTurnaroundStories}
                onBlogHome={showBlogHome}
                onAbout={showAbout}
                onContact={showContact}
              />
              <Outlet />
              <Footer
                currentLanguage={currentLanguage}
                onLanguageChange={switchLanguage}
                onAbout={showAbout}
                onContact={showContact}
              />
            </>
          }>
            {createWebsiteRoutes(renderFunctions)}
          </Route>
        </Routes>
        
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
