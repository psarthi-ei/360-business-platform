import React, { useState } from 'react';
import './App.css';
import LanguageSwitcher from './components/LanguageSwitcher';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import QuotationOrders from './components/QuotationOrders';
import SalesOrders from './components/SalesOrders';
import CustomerList from './components/CustomerList';
import CustomerProfile from './components/CustomerProfile';
import { getCurrentTranslations } from './utils/translations';

type Language = 'en' | 'gu' | 'hi';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [leadFilter, setLeadFilter] = useState('all');
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('rajesh-textiles');


  function getTranslations() {
    return getCurrentTranslations(currentLanguage);
  }

  function switchLanguage(language: string) {
    setCurrentLanguage(language as Language);
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

  function showLeadFromQuote(leadId: string) {
    // In a real app, this would highlight the specific lead
    setCurrentScreen('leads');
  }

  function showSalesOrders() {
    setCurrentScreen('salesorders');
  }

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
      <Dashboard
        currentLanguage={currentLanguage}
        onLanguageChange={switchLanguage}
        onShowLeadManagement={showLeadManagement}
        onShowQuotationOrders={showQuotationOrders}
        onShowSalesOrders={showSalesOrders}
        onShowCustomerList={showCustomerList}
        translations={t}
      />
    );
  }

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
        translations={t}
        filterState={orderFilter}
        onFilterChange={setOrderFilter}
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

  return (
    <div className="App">
      <div className="App-content">
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'leads' && renderLeadManagement()}
        {currentScreen === 'quotations' && renderQuotationOrders()}
        {currentScreen === 'salesorders' && renderSalesOrders()}
        {currentScreen === 'customerprofile' && renderCustomerProfile()}
        {currentScreen === 'customerlist' && renderCustomerList()}
      </div>
    </div>
  );
}

export default App;
