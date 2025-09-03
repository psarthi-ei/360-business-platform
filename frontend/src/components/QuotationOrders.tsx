import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface QuotationOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function QuotationOrders(props: QuotationOrdersProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const onNavigateBack = props.onNavigateBack;
  const onShowSalesOrders = props.onShowSalesOrders;
  const onShowCustomerProfile = props.onShowCustomerProfile;
  const t = props.translations;
  const filterState = props.filterState;
  const onFilterChange = props.onFilterChange;

  function handleFilterClick(filter: string) {
    onFilterChange(filter);
  }

  const quotes = [
    {
      id: '1',
      status: 'converted',
      quoteNumber: 'QT-2025-001',
      company: 'Rajesh Textiles - Ahmedabad',
      customerStatus: 'New Customer (Converted from Lead)',
      salesOrder: 'SO-2025-001',
      material: '500 meters Bandhani Cotton Fabric, 44" width',
      specification: '100 GSM, Pre-shrunk, Natural dyes',
      quoteDate: 'September 1, 2025',
      validUntil: 'September 15, 2025',
      totalAmount: '₹95,000',
      contact: 'Rajesh Shah - 9876543210'
    },
    {
      id: '2',
      status: 'pending',
      quoteNumber: 'QT-2025-002',
      company: 'Gujarat Garments - Surat',
      customerStatus: 'Warm Lead',
      material: '750 meters Block Print Khadi, 42" width',
      specification: '120 GSM, Hand-woven, Natural dyes',
      quoteDate: 'September 2, 2025',
      validUntil: 'September 16, 2025',
      totalAmount: '₹1,20,000',
      contact: 'Meera Patel - 9876567890'
    }
  ];

  function shouldShowQuote(quoteStatus: string) {
    if (filterState === 'all') return true;
    return quoteStatus === filterState;
  }

  function getStatusIcon(status: string) {
    switch(status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'converted': return '🎉';
      case 'expired': return '❌';
      default: return '';
    }
  }

  function getStatusText(status: string) {
    switch(status) {
      case 'pending': return t.pending;
      case 'approved': return t.approved;
      case 'converted': return t.converted;
      case 'expired': return t.expired;
      default: return status;
    }
  }

  return (
    <div className="lead-management-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>📄 {t.quotationOrders}</h1>
        <button className="add-button">+ Create New Quote</button>
      </div>

      <div className="filter-buttons">
        <button 
          className={filterState === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('all')}
        >
          Show All
        </button>
        <button 
          className={filterState === 'pending' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('pending')}
        >
          ⏳ {t.pending}
        </button>
        <button 
          className={filterState === 'approved' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('approved')}
        >
          ✅ {t.approved}
        </button>
        <button 
          className={filterState === 'converted' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('converted')}
        >
          🎉 {t.converted}
        </button>
        <button 
          className={filterState === 'expired' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('expired')}
        >
          ❌ {t.expired}
        </button>
      </div>

      <div className="leads-container">
        {quotes.map((quote) => (
          shouldShowQuote(quote.status) && (
            <div key={quote.id} className={`lead-card ${quote.status === 'converted' ? 'warm' : quote.status === 'pending' ? 'cold' : 'hot'}-lead`}>
              <div className="lead-header">
                <h3>{quote.quoteNumber} - 
                  <span 
                    onClick={() => onShowCustomerProfile(quote.id)} 
                    style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                  >
                    {quote.company}
                  </span>
                </h3>
                <span className={`priority-badge ${quote.status === 'converted' ? 'warm' : quote.status === 'pending' ? 'cold' : 'hot'}`}>
                  {getStatusIcon(quote.status)} {getStatusText(quote.status)}
                </span>
              </div>
              <div className="lead-details">
                <p><strong>{t.quoteNumber}:</strong> {quote.quoteNumber}</p>
                {quote.salesOrder && (
                  <p><strong>Sales Order:</strong> 
                    <span 
                      onClick={onShowSalesOrders} 
                      style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                    >
                      🎉 {quote.salesOrder} (Sep 3, 2025)
                    </span>
                  </p>
                )}
                <p><strong>Customer Status:</strong> 🎉 <span style={{color: '#2ed573', fontWeight: 'bold'}}>{quote.customerStatus}</span></p>
                <p><strong>{t.material}:</strong> {quote.material}</p>
                <p><strong>{t.specification}:</strong> {quote.specification}</p>
                <p><strong>{t.quoteDate}:</strong> {quote.quoteDate}</p>
                <p><strong>Valid Until:</strong> {quote.validUntil}</p>
                <p><strong>{t.totalAmount}:</strong> {quote.totalAmount}</p>
                <p><strong>{t.contact}:</strong> {quote.contact}</p>
              </div>
              <div className="lead-actions">
                <button className="action-btn call">{t.call}</button>
                <button className="action-btn whatsapp">{t.whatsapp}</button>
                <button className="action-btn quote">📄 View PDF</button>
                {quote.status === 'pending' && (
                  <button className="action-btn approve">✅ Approve</button>
                )}
                {quote.status === 'approved' && (
                  <button className="action-btn approve">👤 Convert to Customer</button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default QuotationOrders;