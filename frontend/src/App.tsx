import React, { useState, useEffect } from 'react';
import './App.css';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import QuotationOrders from './components/QuotationOrders';
import SalesOrders from './components/SalesOrders';
import AdvancePaymentManagement from './components/AdvancePaymentManagement';
import CustomerList from './components/CustomerList';
import CustomerProfile from './components/CustomerProfile';
import ExternalProfileForm from './components/ExternalProfileForm';
import ProductHeader from './components/ProductHeader';
import Authentication from './components/Authentication';
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
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('rajesh-textiles');
  const [profileLinkId, setProfileLinkId] = useState('');
  const [profileQuoteId, setProfileQuoteId] = useState('');
  const [profileCompanyName, setProfileCompanyName] = useState('');



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

  function showAdvancePaymentManagement() {
    setCurrentScreen('advancepayment');
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

  function showProfileCompletion(linkId: string, quoteId: string, companyName: string) {
    setProfileLinkId(linkId);
    setProfileQuoteId(quoteId);
    setProfileCompanyName(companyName);
    setCurrentScreen('profilecompletion');
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
          onShowAdvancePaymentManagement={showAdvancePaymentManagement}
          onShowCustomerList={showCustomerList}
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
        onShowLeadManagement={showLeadManagement}
        onShowQuotationOrders={showQuotationOrders}
        onShowAdvancePaymentManagement={showAdvancePaymentManagement}
        filterState={orderFilter}
        onFilterChange={setOrderFilter}
      />
    );
  }

  function renderAdvancePaymentManagement() {
    return (
      <AdvancePaymentManagement
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerProfile={showCustomerProfile}
        filterState={paymentFilter}
        onFilterChange={setPaymentFilter}
      />
    );
  }

  function renderCustomerProfile() {
    return (
      <CustomerProfile
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
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

  return (
    <TranslationProvider defaultLanguage={currentLanguage}>
      <div className="App">
        <div className="App-content">
        <ProductHeader
          currentLanguage={currentLanguage}
          onLanguageChange={switchLanguage}
          currentTheme={currentTheme}
          onThemeChange={switchTheme}
          // Context-aware navigation: Homepage -> Dashboard when demo/authenticated, Dashboard/Pages -> Homepage
          onContextNavigation={
            currentScreen === 'homepage' && (userMode === 'demo' || isAuthenticated) ? showDashboard :
            currentScreen !== 'homepage' ? showHomePage : 
            undefined
          }
          contextNavigationText={
            currentScreen === 'homepage' && (userMode === 'demo' || isAuthenticated) ? "Dashboard" : "Home"
          }
          contextNavigationIcon={
            currentScreen === 'homepage' && (userMode === 'demo' || isAuthenticated) ? "📊" : "🏠"
          }
          showContextNavigation={
            (currentScreen === 'homepage' && (userMode === 'demo' || isAuthenticated)) ||
            currentScreen !== 'homepage'
          }
          onLogin={showLogin}
          onSignUp={showSignUp}
          onGuestMode={handleGuestMode}
          onDemoMode={handleDemoMode}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          userMode={userMode}
        />
        {currentScreen === 'homepage' && renderHomePage()}
        {(currentScreen === 'login' || currentScreen === 'signup') && renderAuthentication()}
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'leads' && renderLeadManagement()}
        {currentScreen === 'quotations' && renderQuotationOrders()}
        {currentScreen === 'salesorders' && renderSalesOrders()}
        {currentScreen === 'advancepayment' && renderAdvancePaymentManagement()}
        {currentScreen === 'customerprofile' && renderCustomerProfile()}
        {currentScreen === 'customerlist' && renderCustomerList()}
        {currentScreen === 'profilecompletion' && renderProfileCompletion()}
        </div>
      </div>
    </TranslationProvider>
  );
}

export default App;
