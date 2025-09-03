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
    hotLead: string;
    warmLead: string;
    coldLead: string;
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
      hotLead: "Hot Lead",
      warmLead: "Warm Lead",
      coldLead: "Cold Lead"
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
      hotLead: "હોટ લીડ",
      warmLead: "વોર્મ લીડ",
      coldLead: "કોલ્ડ લીડ"
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
      hotLead: "हॉट लीड",
      warmLead: "वार्म लीड",
      coldLead: "कोल्ड लीड"
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
          <div className="feature-card">📑 {t.quotationOrders}</div>
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
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.sendQuote}</button>
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
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.sendQuote}</button>
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
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn quote">{t.sendQuote}</button>
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

  return (
    <div className="App">
      <div className="App-content">
        {currentScreen === 'dashboard' && renderDashboard()}
        {currentScreen === 'leads' && renderLeadManagement()}
      </div>
    </div>
  );
}

export default App;
