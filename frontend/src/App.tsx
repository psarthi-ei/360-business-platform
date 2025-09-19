import React, { useState, useEffect } from 'react';
import './App.css';
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
import ExternalProfileForm from './components/ExternalProfileForm';
import InventoryManagement from './components/InventoryManagement';
import FulfillmentManagement from './components/FulfillmentManagement';
import AnalyticsManagement from './components/AnalyticsManagement';
import ProductHeader from './components/ProductHeader';
import Authentication from './components/Authentication';
import ServicesHub from './website/components/ServicesHub';
import BlogHome from './website/components/BlogHome';
import AboutPage from './website/components/AboutPage';
import ContactPage from './website/components/ContactPage';
import { TranslationProvider } from './contexts/TranslationContext';
import { themes, applyTheme } from './styles/themes';
import { safeLocalStorageSetItem, safeLocalStorageGetItem } from './utils/unicodeUtils';

type Language = 'en' | 'gu' | 'hi';
type UserMode = 'guest' | 'demo' | 'authenticated';

function App() {
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



  function switchLanguage(language: string) {
    setCurrentLanguage(language as Language);
  }

  function switchTheme(themeName: string) {
    setCurrentTheme(themeName);
    safeLocalStorageSetItem('selectedTheme', themeName);
  }

  useEffect(() => {
    const savedTheme = safeLocalStorageGetItem('selectedTheme', 'light');
    setCurrentTheme(savedTheme);
    const theme = themes[savedTheme] || themes['light'];
    applyTheme(theme);
  }, []);

  useEffect(() => {
    const theme = themes[currentTheme] || themes['light'];
    applyTheme(theme);
  }, [currentTheme]);

  // Scroll to top when screen changes
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [currentScreen]);

  function showHomePage() {
    setCurrentScreen('homepage');
  }

  function showLogin() {
    setCurrentScreen('login');
  }

  function showSignUp() {
    setCurrentScreen('signup');
  }

  function handleAuthSuccess() {
    setIsAuthenticated(true);
    setUserMode('authenticated');
    setCurrentScreen('dashboard');
  }

  function handleGuestMode() {
    setUserMode('guest');
    setIsAuthenticated(false);
    setCurrentScreen('dashboard');
  }

  function handleDemoMode() {
    setUserMode('demo');
    setIsAuthenticated(false);
    setCurrentScreen('dashboard');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setUserMode('guest');
    setCurrentScreen('homepage');
  }

  function showDashboard() {
    setCurrentScreen('dashboard');
  }

  function showLeadManagement() {
    setCurrentScreen('leads');
  }

  function showQuotationOrders() {
    setCurrentScreen('quotations');
  }

  function showQuoteFromLead(leadId: string) {
    // In a real app, this would pass the lead ID to create a new quote
    setCurrentScreen('quotations');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function showLeadFromQuote(leadId: string) {
    // In a real app, this would highlight the specific lead
    setCurrentScreen('leads');
  }

  function showSalesOrders() {
    setCurrentScreen('salesorders');
  }

  function showPayments() {
    setCurrentScreen('advancepayment');
  }

  function showInvoices() {
    setCurrentScreen('invoices');
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function convertToCustomer(quoteId: string) {
    // In a real app, this would convert quote to customer and create sales order
    setCurrentScreen('salesorders');
  }

  function showCustomerProfile(customerId: string) {
    setSelectedCustomerId(customerId);
    setCurrentScreen('customerprofile');
  }

  function showCustomerList() {
    setCurrentScreen('customerlist');
  }

  function showInventory() {
    setCurrentScreen('inventory');
  }

  function showFulfillment() {
    setCurrentScreen('fulfillment');
  }

  function showAnalytics() {
    setCurrentScreen('analytics');
  }


  function showServicesHub() {
    setCurrentScreen('services-hub');
  }

  function showServicePage() {
    setCurrentScreen('service-page');
  }

  function showBlogHome() {
    setCurrentScreen('blog-home');
  }

  function showBlogPost() {
    setCurrentScreen('blog-post');
  }

  function showAbout() {
    setCurrentScreen('about');
  }

  function showContact() {
    setCurrentScreen('contact');
  }


  function renderDashboard() {
    return (
      <div style={{ paddingTop: '80px' }}>
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
      <LeadManagement
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        onShowCustomerProfile={showCustomerProfile}
        onShowQuoteFromLead={showQuoteFromLead}
        onShowQuotationOrders={showQuotationOrders}
        onShowSalesOrders={showSalesOrders}
        filterState={leadFilter}
        onFilterChange={setLeadFilter}
      />
    );
  }

  function renderQuotationOrders() {
    return (
      <QuotationOrders
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerProfile={showCustomerProfile}
        onShowLeadManagement={showLeadManagement}
        filterState={quoteFilter}
        onFilterChange={setQuoteFilter}
      />
    );
  }

  function renderSalesOrders() {
    return (
      <SalesOrders
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        onShowLeadManagement={showLeadManagement}
        onShowQuotationOrders={showQuotationOrders}
        onShowPayments={showPayments}
        filterState={orderFilter}
        onFilterChange={setOrderFilter}
      />
    );
  }

  function renderPayments() {
    return (
      <Payments
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerProfile={showCustomerProfile}
        filterState={paymentFilter}
        onFilterChange={setPaymentFilter}
      />
    );
  }

  function renderInvoices() {
    return (
      <Invoices
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
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
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        customerId={selectedCustomerId}
      />
    );
  }

  function renderCustomerList() {
    return (
      <CustomerList
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onNavigateHome={showHomePage}
        onShowCustomerProfile={showCustomerProfile}
        customerSearch={customerSearch}
        onCustomerSearchChange={setCustomerSearch}
      />
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
    function handleProfileSubmit(profileData: any) {
      console.log('Profile submitted:', profileData);
      // Show success message and redirect to homepage
      setTimeout(() => {
        alert('Profile created successfully! Our team will contact you soon.');
        showHomePage();
      }, 2000);
    }

    function handleProfileSuccess(businessProfileId: string) {
      console.log('Business profile created:', businessProfileId);
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
        onBackToDashboard={showDashboard}
      />
    );
  }


  function renderServicesHub() {
    return (
      <ServicesHub
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }

  function renderServicePage() {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Individual Service Page - Coming Soon</h1>
        <button onClick={showServicesHub} style={{ padding: '1rem', marginTop: '1rem' }}>
          Back to Services Hub
        </button>
      </div>
    );
  }

  function renderBlogHome() {
    return (
      <BlogHome
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
      />
    );
  }

  function renderBlogPost() {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Individual Blog Post - Coming Soon</h1>
        <button onClick={showBlogHome} style={{ padding: '1rem', marginTop: '1rem' }}>
          Back to Blog Home
        </button>
      </div>
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
    <TranslationProvider defaultLanguage={currentLanguage}>
      <div className="App">
        <div className="App-content">
        <ProductHeader
            currentLanguage={currentLanguage}
            onLanguageChange={switchLanguage}
            currentTheme={currentTheme}
            onThemeChange={switchTheme}
            onHome={showHomePage}
            onLogin={showLogin}
            onSignUp={showSignUp}
            onGuestMode={handleGuestMode}
            onDemoMode={handleDemoMode}
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
            userMode={userMode}
            // Website Navigation Props
            showWebsiteNavigation={['homepage', 'services-hub', 'service-page', 'blog-home', 'blog-post', 'about', 'contact'].includes(currentScreen)}
            onServicesHub={showServicesHub}
            onBlogHome={showBlogHome}
            onAbout={showAbout}
            onContact={showContact}
          />
        {currentScreen === 'homepage' && renderHomePage()}
        {(currentScreen === 'login' || currentScreen === 'signup') && renderAuthentication()}
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'leads' && renderLeadManagement()}
        {currentScreen === 'quotations' && renderQuotationOrders()}
        {currentScreen === 'salesorders' && renderSalesOrders()}
        {currentScreen === 'advancepayment' && renderPayments()}
        {currentScreen === 'invoices' && renderInvoices()}
        {currentScreen === 'customerprofile' && renderCustomerProfile()}
        {currentScreen === 'customerlist' && renderCustomerList()}
        {currentScreen === 'profilecompletion' && renderProfileCompletion()}
        {currentScreen === 'inventory' && renderInventoryManagement()}
        {currentScreen === 'fulfillment' && renderFulfillmentManagement()}
        {currentScreen === 'analytics' && renderAnalyticsManagement()}
        {currentScreen === 'services-hub' && renderServicesHub()}
        {currentScreen === 'service-page' && renderServicePage()}
        {currentScreen === 'blog-home' && renderBlogHome()}
        {currentScreen === 'blog-post' && renderBlogPost()}
        {currentScreen === 'about' && renderAbout()}
        {currentScreen === 'contact' && renderContact()}
        
        </div>
      </div>
    </TranslationProvider>
  );
}

export default App;
