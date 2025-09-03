import React, { useState } from 'react';
import './App.css';

type Language = 'english' | 'gujarati' | 'hindi';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  // Language translations
  const translations: Record<Language, {
    title: string;
    company: string;
    founder: string;
    leadManagement: string;
    quotationOrders: string;
    advancePayments: string;
    workOrders: string;
    smartProcurement: string;
    inventory: string;
    productionTracking: string;
    dispatchDelivery: string;
    invoiceFinance: string;
    customerFeedback: string;
    voiceCommands: string;
    analyticsDashboard: string;
    backToDashboard: string;
    addNewLead: string;
    material: string;
    specification: string;
    colors: string;
    usage: string;
    budget: string;
    delivery: string;
    contact: string;
    inquiryDate: string;
    call: string;
    sendQuote: string;
    whatsapp: string;
    voiceCommandsHint: string;
    addFabricInquiry: string;
    callRajesh: string;
    showCottonLeads: string;
    createQuoteRajesh: string;
    showApprovedQuotes: string;
    convertToOrder: string;
    hotLead: string;
    warmLead: string;
    coldLead: string;
    addNewQuote: string;
    quoteNumber: string;
    customerName: string;
    quoteDate: string;
    validUntil: string;
    totalAmount: string;
    status: string;
    viewPDF: string;
    approve: string;
    pending: string;
    approved: string;
    expired: string;
    convertToOrder: string;
  }> = {
    english: {
      title: "360° Business Platform",
      company: "ElevateIdea Technologies",
      founder: "Built by Partha Sarthi for Gujarat Textile Manufacturers",
      leadManagement: "Lead Management",
      quotationOrders: "Quotation & Orders",
      advancePayments: "Advance Payments",
      workOrders: "Work Orders",
      smartProcurement: "Smart Procurement",
      inventory: "Inventory (3-Tier)",
      productionTracking: "Production Tracking",
      dispatchDelivery: "Dispatch & Delivery",
      invoiceFinance: "Invoice & Finance",
      customerFeedback: "Customer Feedback",
      voiceCommands: "Voice Commands",
      analyticsDashboard: "Analytics Dashboard",
      backToDashboard: "← Back to Dashboard",
      addNewLead: "+ Add New Lead",
      material: "Material",
      specification: "Specification",
      colors: "Colors",
      usage: "Usage",
      budget: "Budget",
      delivery: "Delivery",
      contact: "Contact",
      inquiryDate: "Inquiry Date",
      call: "📞 Call",
      sendQuote: "📑 Send Quote",
      whatsapp: "📱 WhatsApp",
      voiceCommandsHint: "Voice Commands:",
      addFabricInquiry: "Add new fabric inquiry from Mumbai",
      callRajesh: "Call Rajesh Textiles",
      showCottonLeads: "Show cotton fabric leads only",
      createQuoteRajesh: "Create new quote for Rajesh Textiles",
      showApprovedQuotes: "Show approved quotes only",
      convertToOrder: "Convert QT-001 to order",
      hotLead: "Hot Lead",
      warmLead: "Warm Lead",
      coldLead: "Cold Lead",
      addNewQuote: "+ Add New Quote",
      quoteNumber: "Quote Number",
      customerName: "Customer Name",
      quoteDate: "Quote Date",
      validUntil: "Valid Until",
      totalAmount: "Total Amount",
      status: "Status",
      viewPDF: "📄 View PDF",
      approve: "✅ Approve",
      pending: "Pending",
      approved: "Approved",
      expired: "Expired",
      convertToOrder: "🔄 Convert to Order"
    },
    gujarati: {
      title: "360° બિઝનેસ પ્લેટફોર્મ",
      company: "એલિવેટઆઈડિયા ટેકનોલોજીઝ",
      founder: "ગુજરાત ટેક્સટાઈલ મેન્યુફેક્ચરર્સ માટે પાર્થ સારથી દ્વારા બનાવાયેલ",
      leadManagement: "લીડ મેનેજમેન્ટ",
      quotationOrders: "કોટેશન અને ઓર્ડર",
      advancePayments: "એડવાન્સ પેમેન્ટ",
      workOrders: "વર્ક ઓર્ડર",
      smartProcurement: "સ્માર્ટ પ્રોક્યોરમેન્ટ",
      inventory: "ઇન્વેન્ટરી (3-ટાયર)",
      productionTracking: "પ્રોડક્શન ટ્રેકિંગ",
      dispatchDelivery: "ડિસ્પેચ અને ડેલિવરી",
      invoiceFinance: "ઇન્વોઇસ અને ફાઇનાન્સ",
      customerFeedback: "કસ્ટમર ફીડબેક",
      voiceCommands: "વૉઇસ કમાંડ્સ",
      analyticsDashboard: "એનાલિટિક્સ ડેશબોર્ડ",
      backToDashboard: "← ડેશબોર્ડ પર પાછા જાઓ",
      addNewLead: "+ નવી લીડ ઉમેરો",
      material: "સામગ્રી",
      specification: "સ્પેસિફિકેશન",
      colors: "રંગો",
      usage: "ઉપયોગ",
      budget: "બજેટ",
      delivery: "ડેલિવરી",
      contact: "સંપર્ક",
      inquiryDate: "પૂછપરછની તારીખ",
      call: "📞 કૉલ",
      sendQuote: "📑 કોટ મોકલો",
      whatsapp: "📱 WhatsApp",
      voiceCommandsHint: "વૉઇસ કમાંડ્સ:",
      addFabricInquiry: "મુંબઈથી નવી ફેબ્રિક પૂછપરછ ઉમેરો",
      callRajesh: "રાજેશ ટેક્સટાઈલ્સને કૉલ કરો",
      showCottonLeads: "માત્ર કપાસ ફેબ્રિક લીડ્સ બતાવો",
      createQuoteRajesh: "રાજેશ ટેક્સટાઈલ્સ માટે નવું કોટ બનાવો",
      showApprovedQuotes: "માત્ર મંજૂર કોટેશન્સ બતાવો",
      convertToOrder: "QT-001 ને ઓર્ડરમાં ફેરવો",
      hotLead: "હોટ લીડ",
      warmLead: "વોર્મ લીડ",
      coldLead: "કોલ્ડ લીડ",
      addNewQuote: "+ નવું કોટ ઉમેરો",
      quoteNumber: "કોટ નંબર",
      customerName: "કસ્ટમરનું નામ",
      quoteDate: "કોટની તારીખ",
      validUntil: "આ સુધી માન્ય",
      totalAmount: "કુલ રકમ",
      status: "સ્થિતિ",
      viewPDF: "📄 PDF જુઓ",
      approve: "✅ મંજૂર કરો",
      pending: "બાકી",
      approved: "મંજૂર",
      expired: "સમાપ્ત",
      convertToOrder: "🔄 ઓર્ડરમાં ફેરવો"
    },
    hindi: {
      title: "360° बिज़नेस प्लेटफॉर्म",
      company: "एलिवेटआइडिया टेक्नोलॉजीज",
      founder: "गुजरात टेक्सटाइल मैन्युफैक्चरर्स के लिए पार्थ सारथी द्वारा निर्मित",
      leadManagement: "लीड प्रबंधन",
      quotationOrders: "कोटेशन और ऑर्डर",
      advancePayments: "एडवांस पेमेंट",
      workOrders: "वर्क ऑर्डर",
      smartProcurement: "स्मार्ट प्रोक्योरमेंट",
      inventory: "इन्वेंटरी (3-टायर)",
      productionTracking: "प्रोडक्शन ट्रैकिंग",
      dispatchDelivery: "डिस्पैच और डिलीवरी",
      invoiceFinance: "इनवॉइस और वित्त",
      customerFeedback: "कस्टमर फीडबैक",
      voiceCommands: "वॉइस कमांड्स",
      analyticsDashboard: "एनालिटिक्स डैशबोर्ड",
      backToDashboard: "← डैशबोर्ड पर वापस जाएं",
      addNewLead: "+ नई लीड जोड़ें",
      material: "सामग्री",
      specification: "स्पेसिफिकेशन",
      colors: "रंग",
      usage: "उपयोग",
      budget: "बजट",
      delivery: "डिलीवरी",
      contact: "संपर्क",
      inquiryDate: "पूछताछ की तारीख",
      call: "📞 कॉल",
      sendQuote: "📑 कोट भेजें",
      whatsapp: "📱 WhatsApp",
      voiceCommandsHint: "वॉइस कमांड्स:",
      addFabricInquiry: "मुंबई से नई फैब्रिक पूछताछ जोड़ें",
      callRajesh: "राजेश टेक्सटाइल्स को कॉल करें",
      showCottonLeads: "केवल कपास फैब्रिक लीड्स दिखाएं",
      createQuoteRajesh: "राजेश टेक्सटाइल्स के लिए नया कोट बनाएं",
      showApprovedQuotes: "केवल अप्रूव्ड कोट्स दिखाएं",
      convertToOrder: "QT-001 को ऑर्डर में बदलें",
      hotLead: "हॉट लीड",
      warmLead: "वार्म लीड",
      coldLead: "कोल्ड लीड",
      addNewQuote: "+ नया कोट जोड़ें",
      quoteNumber: "कोट नंबर",
      customerName: "कस्टमर का नाम",
      quoteDate: "कोट की तारीख",
      validUntil: "इस तक मान्य",
      totalAmount: "कुल राशि",
      status: "स्थिति",
      viewPDF: "📄 PDF देखें",
      approve: "✅ अप्रूव करें",
      pending: "पेंडिंग",
      approved: "अप्रूव्ड",
      expired: "एक्सपायर्ड",
      convertToOrder: "🔄 ऑर्डर में बदलें"
    }
  };

  function getCurrentTranslations() {
    return translations[currentLanguage];
  }

  function switchLanguage(language: Language) {
    setCurrentLanguage(language);
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

  function renderDashboard() {
    const t = getCurrentTranslations();
    
    return (
      <div className="dashboard">
        {renderLanguageSwitcher()}

        <h1>🏭 {t.title}</h1>
        <h2>{t.company}</h2>
        <p className="founder-info">
          {t.founder}
        </p>
        
        <div className="features-grid">
          <div className="feature-card clickable" onClick={showLeadManagement}>
            📋 {t.leadManagement}
          </div>
          <div className="feature-card clickable" onClick={showQuotationOrders}>
            📑 {t.quotationOrders}
          </div>
          <div className="feature-card">💳 {t.advancePayments}</div>
          <div className="feature-card">📋 {t.workOrders}</div>
          <div className="feature-card">🛒 {t.smartProcurement}</div>
          <div className="feature-card">📦 {t.inventory}</div>
          <div className="feature-card">⚙️ {t.productionTracking}</div>
          <div className="feature-card">🚚 {t.dispatchDelivery}</div>
          <div className="feature-card">🧾 {t.invoiceFinance}</div>
          <div className="feature-card">⭐ {t.customerFeedback}</div>
          <div className="feature-card">🎤 {t.voiceCommands}</div>
          <div className="feature-card">📊 {t.analyticsDashboard}</div>
        </div>
        
        <p className="languages">
          <span>🗣️ ગુજરાતી</span> | <span>🗣️ हिंदी</span> | <span>🗣️ English</span>
        </p>
        
        <div className="status">
          <p>🚧 MVP in Development - Coming Soon!</p>
        </div>
      </div>
    );
  }

  function renderLanguageSwitcher() {
    return (
      <div className="language-switcher">
        <button 
          className={currentLanguage === 'english' ? 'lang-btn active' : 'lang-btn'}
          onClick={() => switchLanguage('english')}
        >
          English
        </button>
        <button 
          className={currentLanguage === 'gujarati' ? 'lang-btn active' : 'lang-btn'}
          onClick={() => switchLanguage('gujarati')}
        >
          ગુજરાતી
        </button>
        <button 
          className={currentLanguage === 'hindi' ? 'lang-btn active' : 'lang-btn'}
          onClick={() => switchLanguage('hindi')}
        >
          हिंदी
        </button>
      </div>
    );
  }

  function renderLeadManagement() {
    const t = getCurrentTranslations();
    
    return (
      <div className="lead-management-screen">
        {renderLanguageSwitcher()}
        <div className="screen-header">
          <button className="back-button" onClick={showDashboard}>
            {t.backToDashboard}
          </button>
          <h1>📋 {t.leadManagement}</h1>
          <button className="add-button">{t.addNewLead}</button>
        </div>

        <div className="leads-container">
          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>Rajesh Textiles - Ahmedabad</h3>
              <span className="priority-badge hot">🔥 {t.hotLead}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.material}:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
              <p><strong>{t.specification}:</strong> 100 GSM, Pre-shrunk, Natural dyes</p>
              <p><strong>{t.colors}:</strong> Red, Blue, Yellow, Green base</p>
              <p><strong>{t.usage}:</strong> For saree manufacturing</p>
              <p><strong>{t.budget}:</strong> ₹180-200 per meter</p>
              <p><strong>{t.delivery}:</strong> 15 days required</p>
              <p><strong>{t.contact}:</strong> Rajesh Shah - 9876543210</p>
              <p><strong>{t.inquiryDate}:</strong> 2 days ago</p>
              <p><strong>Quote Status:</strong></p>
              <div style={{marginLeft: '10px'}}>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#2ed573', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ✅ QT-2025-001 (Sep 1, 2025)
                </span>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ffa502', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ⏳ QT-2025-004 (Sep 2, 2025)
                </span>
              </div>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('rajesh-textiles')}>{t.sendQuote}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>

          <div className="lead-card warm-lead">
            <div className="lead-header">
              <h3>Gujarat Garments - Surat</h3>
              <span className="priority-badge warm">⭐ {t.warmLead}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.material}:</strong> 300 meters Block Print Khadi Fabric, 42" width</p>
              <p><strong>{t.specification}:</strong> 120 GSM, Hand-spun, Organic cotton</p>
              <p><strong>{t.colors}:</strong> Earth tones (Brown, Beige, Cream)</p>
              <p><strong>{t.usage}:</strong> For kurta and palazzo manufacturing</p>
              <p><strong>{t.budget}:</strong> ₹150-180 per meter</p>
              <p><strong>{t.delivery}:</strong> 20 days flexible</p>
              <p><strong>{t.contact}:</strong> Priya Patel - 9123456789</p>
              <p><strong>{t.inquiryDate}:</strong> 5 days ago</p>
              <p><strong>Quote Status:</strong></p>
              <div style={{marginLeft: '10px'}}>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ff4757', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ❌ QT-2025-002 (Aug 29, 2025)
                </span>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ffa502', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ⏳ QT-2025-005 (Sep 3, 2025)
                </span>
              </div>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('gujarat-garments')}>{t.sendQuote}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>

          <div className="lead-card cold-lead">
            <div className="lead-header">
              <h3>Baroda Fashion House - Vadodara</h3>
              <span className="priority-badge cold">❄️ {t.coldLead}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.material}:</strong> 200 meters Pure Silk Fabric, 45" width</p>
              <p><strong>{t.specification}:</strong> 80 GSM, Mulberry silk, Zari border ready</p>
              <p><strong>{t.colors}:</strong> Royal Blue, Maroon, Gold accents</p>
              <p><strong>{t.usage}:</strong> For premium saree manufacturing</p>
              <p><strong>{t.budget}:</strong> ₹400-500 per meter</p>
              <p><strong>{t.delivery}:</strong> 30 days flexible</p>
              <p><strong>{t.contact}:</strong> Amit Sharma - 9988776655</p>
              <p><strong>{t.inquiryDate}:</strong> 1 week ago</p>
              <p><strong>Quote Status:</strong></p>
              <div style={{marginLeft: '10px'}}>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ff4757', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ❌ QT-2025-003 (Aug 15, 2025)
                </span>
                <span style={{color: '#666', fontSize: '0.9rem', display: 'block'}}>
                  💡 Ready for new quote
                </span>
              </div>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('baroda-fashion')}>{t.sendQuote}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>
        </div>

        <div className="voice-commands">
          <p className="voice-hint">
            🎤 <strong>{t.voiceCommandsHint}</strong> 
            "{t.addFabricInquiry}" • "{t.callRajesh}" • "{t.showCottonLeads}"
          </p>
        </div>
      </div>
    );
  }

  function renderQuotationOrders() {
    const t = getCurrentTranslations();
    
    return (
      <div className="lead-management-screen">
        {renderLanguageSwitcher()}
        <div className="screen-header">
          <button className="back-button" onClick={showDashboard}>
            {t.backToDashboard}
          </button>
          <h1>📑 {t.quotationOrders}</h1>
          <button className="add-button">{t.addNewQuote}</button>
        </div>

        <div className="leads-container">
          <div className="lead-card warm-lead">
            <div className="lead-header">
              <h3>QT-2025-001 - Rajesh Textiles</h3>
              <span className="priority-badge warm">⭐ {t.approved}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.quoteNumber}:</strong> QT-2025-001</p>
              <p><strong>Lead Source:</strong> 
                <span 
                  onClick={() => showLeadFromQuote('rajesh-textiles')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  🔥 Hot Lead - Rajesh Textiles (Sep 1)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Rajesh Textiles - Ahmedabad</p>
              <p><strong>{t.material}:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
              <p><strong>{t.specification}:</strong> 100 GSM, Pre-shrunk, Natural dyes</p>
              <p><strong>{t.quoteDate}:</strong> September 1, 2025</p>
              <p><strong>{t.validUntil}:</strong> September 15, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹95,000 (500m × ₹190/meter)</p>
              <p><strong>{t.contact}:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn whatsapp">{t.convertToOrder}</button>
            </div>
          </div>

          <div className="lead-card cold-lead">
            <div className="lead-header">
              <h3>QT-2025-004 - Rajesh Textiles</h3>
              <span className="priority-badge cold">❄️ {t.pending}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.quoteNumber}:</strong> QT-2025-004</p>
              <p><strong>Lead Source:</strong> 
                <span 
                  onClick={() => showLeadFromQuote('rajesh-textiles')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  🔥 Hot Lead - Rajesh Textiles (Sep 1)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Rajesh Textiles - Ahmedabad</p>
              <p><strong>{t.material}:</strong> 250 meters Bandhani Cotton Fabric, 44" width</p>
              <p><strong>{t.specification}:</strong> 100 GSM, Pre-shrunk, Natural dyes</p>
              <p><strong>{t.quoteDate}:</strong> September 2, 2025</p>
              <p><strong>{t.validUntil}:</strong> September 16, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹48,750 (250m × ₹195/meter)</p>
              <p><strong>{t.contact}:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn approve">{t.approve}</button>
            </div>
          </div>

          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>QT-2025-002 - Gujarat Garments</h3>
              <span className="priority-badge hot">🔥 Rejected</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.quoteNumber}:</strong> QT-2025-002</p>
              <p><strong>Lead Source:</strong> 
                <span 
                  onClick={() => showLeadFromQuote('gujarat-garments')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  ⭐ Warm Lead - Gujarat Garments (Aug 28)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Gujarat Garments - Surat</p>
              <p><strong>{t.material}:</strong> 300 meters Block Print Khadi Fabric, 42" width</p>
              <p><strong>{t.specification}:</strong> 120 GSM, Hand-spun, Organic cotton</p>
              <p><strong>{t.quoteDate}:</strong> August 29, 2025</p>
              <p><strong>{t.validUntil}:</strong> September 12, 2025 (REJECTED)</p>
              <p><strong>{t.totalAmount}:</strong> ₹48,000 (300m × ₹160/meter)</p>
              <p><strong>{t.contact}:</strong> Priya Patel - 9123456789</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>

          <div className="lead-card cold-lead">
            <div className="lead-header">
              <h3>QT-2025-005 - Gujarat Garments</h3>
              <span className="priority-badge cold">❄️ {t.pending}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.quoteNumber}:</strong> QT-2025-005</p>
              <p><strong>Lead Source:</strong> 
                <span 
                  onClick={() => showLeadFromQuote('gujarat-garments')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  ⭐ Warm Lead - Gujarat Garments (Aug 28)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Gujarat Garments - Surat</p>
              <p><strong>{t.material}:</strong> 300 meters Block Print Khadi Fabric, 42" width</p>
              <p><strong>{t.specification}:</strong> 110 GSM, Hand-spun, Natural dyes (revised)</p>
              <p><strong>{t.quoteDate}:</strong> September 3, 2025</p>
              <p><strong>{t.validUntil}:</strong> September 17, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹45,000 (300m × ₹150/meter)</p>
              <p><strong>{t.contact}:</strong> Priya Patel - 9123456789</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn approve">{t.approve}</button>
            </div>
          </div>

          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>QT-2025-003 - Baroda Fashion House</h3>
              <span className="priority-badge hot">🔥 {t.expired}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.quoteNumber}:</strong> QT-2025-003</p>
              <p><strong>Lead Source:</strong> 
                <span 
                  onClick={() => showLeadFromQuote('baroda-fashion')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  ❄️ Cold Lead - Baroda Fashion House (Aug 12)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Baroda Fashion House - Vadodara</p>
              <p><strong>{t.material}:</strong> 200 meters Pure Silk Fabric, 45" width</p>
              <p><strong>{t.specification}:</strong> 80 GSM, Mulberry silk, Zari border ready</p>
              <p><strong>{t.quoteDate}:</strong> August 15, 2025</p>
              <p><strong>{t.validUntil}:</strong> August 30, 2025 (EXPIRED)</p>
              <p><strong>{t.totalAmount}:</strong> ₹88,000 (200m × ₹440/meter)</p>
              <p><strong>{t.contact}:</strong> Amit Sharma - 9988776655</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>
        </div>

        <div className="voice-commands">
          <p className="voice-hint">
            🎤 <strong>{t.voiceCommandsHint}</strong> 
            "{t.createQuoteRajesh}" • "{t.showApprovedQuotes}" • "{t.convertToOrder}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-content">
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'leads' && renderLeadManagement()}
        {currentScreen === 'quotations' && renderQuotationOrders()}
      </div>
    </div>
  );
}

export default App;
