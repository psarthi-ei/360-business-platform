import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface LeadManagementProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function LeadManagement(props: LeadManagementProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const onNavigateBack = props.onNavigateBack;
  const t = props.translations;
  const filterState = props.filterState;
  const onFilterChange = props.onFilterChange;

  function handleFilterClick(filter: string) {
    onFilterChange(filter);
  }

  const leads = [
    {
      id: '1',
      type: 'hot',
      company: 'Rajesh Textiles - Ahmedabad',
      priority: t.hotLead,
      material: '500 meters Bandhani Cotton Fabric, 44" width',
      specification: '100 GSM, Pre-shrunk, Natural dyes',
      usage: 'For saree manufacturing',
      budget: '₹180-200 per meter',
      delivery: '15 days required',
      contact: 'Rajesh Shah - 9876543210'
    },
    {
      id: '2',
      type: 'warm',
      company: 'Gujarat Garments - Surat',
      priority: t.warmLead,
      material: '750 meters Block Print Khadi, 42" width',
      specification: '120 GSM, Hand-woven, Natural dyes',
      usage: 'For kurta collection',
      budget: '₹150-170 per meter',
      delivery: '20 days timeline',
      contact: 'Meera Patel - 9876567890'
    },
    {
      id: '3',
      type: 'cold',
      company: 'Baroda Fashion House - Vadodara',
      priority: t.coldLead,
      material: '300 meters Premium Silk, 40" width',
      specification: '150 GSM, Mulberry silk, Lustrous finish',
      usage: 'For premium wear collection',
      budget: '₹400-450 per meter',
      delivery: '25 days acceptable',
      contact: 'Vikram Desai - 9876678901'
    }
  ];

  function getFilteredLeads() {
    if (filterState === 'all') return leads;
    return leads.filter(lead => lead.type === filterState.replace('leads', ''));
  }

  function shouldShowLead(leadType: string) {
    if (filterState === 'all') return true;
    return leadType === filterState.replace('leads', '');
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
        <h1>🎯 {t.leadManagement}</h1>
        <button className="add-button">+ Add New Lead</button>
      </div>

      <div className="filter-buttons">
        <button 
          className={filterState === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('all')}
        >
          Show All
        </button>
        <button 
          className={filterState === 'hotleads' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('hotleads')}
        >
          🔥 {t.hotLead}
        </button>
        <button 
          className={filterState === 'warmleads' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('warmleads')}
        >
          ⭐ {t.warmLead}
        </button>
        <button 
          className={filterState === 'coldleads' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('coldleads')}
        >
          ❄️ {t.coldLead}
        </button>
      </div>

      <div className="leads-container">
        {leads.map((lead) => (
          shouldShowLead(lead.type) && (
            <div key={lead.id} className={`lead-card ${lead.type}-lead`}>
              <div className="lead-header">
                <h3>{lead.company}</h3>
                <span className={`priority-badge ${lead.type}`}>
                  {lead.type === 'hot' && '🔥'} 
                  {lead.type === 'warm' && '⭐'} 
                  {lead.type === 'cold' && '❄️'} 
                  {lead.priority}
                </span>
              </div>
              <div className="lead-details">
                <p><strong>{t.material}:</strong> {lead.material}</p>
                <p><strong>{t.specification}:</strong> {lead.specification}</p>
                <p><strong>{t.usage}:</strong> {lead.usage}</p>
                <p><strong>{t.budget}:</strong> {lead.budget}</p>
                <p><strong>{t.delivery}:</strong> {lead.delivery}</p>
                <p><strong>{t.contact}:</strong> {lead.contact}</p>
              </div>
              <div className="lead-actions">
                <button className="action-btn call">{t.call}</button>
                <button className="action-btn whatsapp">{t.whatsapp}</button>
                <button className="action-btn quote">{t.sendQuote}</button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default LeadManagement;