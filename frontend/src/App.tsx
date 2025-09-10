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
import ProductHeader from './components/ProductHeader';
import Authentication from './components/Authentication';
import { getCurrentTranslations } from './utils/translations';
import { themes, applyTheme } from './styles/themes';

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


  function getTranslations() {
    return getCurrentTranslations(currentLanguage);
  }

  function switchLanguage(language: string) {
    setCurrentLanguage(language as Language);
  }

  function switchTheme(themeName: string) {
    setCurrentTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
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

  function renderDashboard() {
    const t = getTranslations();
    
    return (
      <div style={{ paddingTop: '80px' }}>
        <Dashboard
          currentLanguage={currentLanguage}
          onLanguageChange={switchLanguage}
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
          translations={t}
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
    const t = getTranslations();
    
    return (
      <LeadManagement
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowCustomerProfile={showCustomerProfile}
        onShowQuoteFromLead={showQuoteFromLead}
        onShowQuotationOrders={showQuotationOrders}
        onShowSalesOrders={showSalesOrders}
        translations={t}
        filterState={leadFilter}
        onFilterChange={setLeadFilter}
      />
    );
  }

  function renderQuotationOrders() {
    const t = getTranslations();
    
    return (
      <QuotationOrders
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerProfile={showCustomerProfile}
        onShowLeadManagement={showLeadManagement}
        translations={t}
        filterState={quoteFilter}
        onFilterChange={setQuoteFilter}
      />
    );
  }

  function renderSalesOrders() {
    const t = getTranslations();
    
    return (
      <SalesOrders
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowLeadManagement={showLeadManagement}
        onShowQuotationOrders={showQuotationOrders}
        onShowAdvancePaymentManagement={showAdvancePaymentManagement}
        translations={t}
        filterState={orderFilter}
        onFilterChange={setOrderFilter}
      />
    );
  }

  function renderAdvancePaymentManagement() {
    const t = getTranslations();
    
    return (
      <AdvancePaymentManagement
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerProfile={showCustomerProfile}
        translations={t}
        filterState={paymentFilter}
        onFilterChange={setPaymentFilter}
      />
    );
  }

  function renderCustomerProfile() {
    const t = getTranslations();
    
    return (
      <CustomerProfile
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        customerId={selectedCustomerId}
        translations={t}
      />
    );
  }

  function renderCustomerList() {
    const t = getTranslations();
    
    return (
      <CustomerList
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onNavigateBack={showDashboard}
        onShowCustomerProfile={showCustomerProfile}
        translations={t}
        customerSearch={customerSearch}
        onCustomerSearchChange={setCustomerSearch}
      />
    );
  }

  function renderAuthentication() {
    const t = getTranslations();
    
    return (
      <Authentication
        onAuthSuccess={handleAuthSuccess}
        onGuestMode={handleGuestMode}
        onDemoMode={handleDemoMode}
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        translations={t}
      />
    );
  }

  function renderHomePage() {
    const t = getTranslations();
    
    return (
      <HomePage
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onLogin={showLogin}
        onSignUp={showSignUp}
        onGuestMode={handleGuestMode}
        onDemoMode={handleDemoMode}
        translations={t}
      />
    );
  }

  return (
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
      </div>
    </div>
  );
}

export default App;
