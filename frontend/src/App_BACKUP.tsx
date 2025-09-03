import React, { useState } from 'react';
import './App.css';

type Language = 'english' | 'gujarati' | 'hindi';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [leadFilter, setLeadFilter] = useState('all');
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');

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
    convertToCustomer: string;
    salesOrder: string;
    customerName: string;
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    pendingPayment: string;
    paymentReceived: string;
    readyForProduction: string;
    filters: string;
    all: string;
    showAll: string;
    showHotLeads: string;
    showWarmLeads: string;
    showColdLeads: string;
    showPending: string;
    showApproved: string;
    showExpired: string;
    showConverted: string;
    customerProfile: string;
    customerSince: string;
    totalBusiness: string;
    conversionRate: string;
    averageOrderSize: string;
    paymentHistory: string;
    onTime: string;
    delayed: string;
    transactionHistory: string;
    allQuotes: string;
    allOrders: string;
    communicationLog: string;
    businessInformation: string;
    preferredMaterials: string;
    volumePatterns: string;
    paymentTerms: string;
    deliveryPreferences: string;
    createNewQuote: string;
    followUpPending: string;
    viewPaymentStatus: string;
    sendPaymentReminder: string;
    searchCustomers: string;
    searchPlaceholder: string;
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
      convertToOrder: "🔄 Convert to Order",
      convertToCustomer: "👤 Convert to Customer",
      salesOrder: "Sales Orders",
      customerName: "Customer Name",
      orderNumber: "Order Number",
      orderDate: "Order Date",
      orderStatus: "Order Status",
      pendingPayment: "Pending Payment",
      paymentReceived: "Payment Received",
      readyForProduction: "Ready for Production",
      filters: "Filters",
      all: "All",
      showAll: "Show All",
      showHotLeads: "🔥 Hot Leads",
      showWarmLeads: "⭐ Warm Leads",
      showColdLeads: "❄️ Cold Leads",
      showPending: "⏳ Pending",
      showApproved: "✅ Approved",
      showExpired: "❌ Expired",
      showConverted: "🎉 Converted",
      customerProfile: "Customer Profile",
      customerSince: "Customer Since",
      totalBusiness: "Total Business",
      conversionRate: "Conversion Rate",
      averageOrderSize: "Average Order Size",
      paymentHistory: "Payment History",
      onTime: "On Time",
      delayed: "Delayed",
      transactionHistory: "Transaction History",
      allQuotes: "All Quotes",
      allOrders: "All Orders",
      communicationLog: "Communication Log",
      businessInformation: "Business Information",
      preferredMaterials: "Preferred Materials",
      volumePatterns: "Volume Patterns",
      paymentTerms: "Payment Terms",
      deliveryPreferences: "Delivery Preferences",
      createNewQuote: "Create New Quote",
      followUpPending: "Follow Up Pending",
      viewPaymentStatus: "View Payment Status",
      sendPaymentReminder: "Send Payment Reminder",
      customers: "Customers",
      customerList: "Customer List",
      addNewCustomer: "+ Add New Customer",
      searchCustomers: "Search Customers",
      searchPlaceholder: "Search by name, location, or material..."
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
      convertToOrder: "🔄 ઓર્ડરમાં ફેરવો",
      convertToCustomer: "👤 કસ્ટમરમાં ફેરવો",
      salesOrder: "સેલ્સ ઓર્ડર",
      customerName: "કસ્ટમરનું નામ",
      orderNumber: "ઓર્ડર નંબર",
      orderDate: "ઓર્ડરની તારીખ",
      orderStatus: "ઓર્ડરની સ્થિતિ",
      pendingPayment: "બાકી પેમેન્ટ",
      paymentReceived: "પેમેન્ટ મળી",
      readyForProduction: "પ્રોડક્શન માટે તૈયાર",
      filters: "ફિલ્ટર્સ",
      all: "બધા",
      showAll: "બધા બતાવો",
      showHotLeads: "🔥 હોટ લીડ્સ",
      showWarmLeads: "⭐ વોર્મ લીડ્સ",
      showColdLeads: "❄️ કોલ્ડ લીડ્સ",
      showPending: "⏳ બાકી",
      showApproved: "✅ મંજૂર",
      showExpired: "❌ સમાપ્ત",
      showConverted: "🎉 રૂપાંતરિત",
      customerProfile: "કસ્ટમર પ્રોફાઇલ",
      customerSince: "કસ્ટમર થઈ",
      totalBusiness: "કુલ બિઝનેસ",
      conversionRate: "રૂપાંતર દર",
      averageOrderSize: "ઓર્ડરનો એવરેજ સાઇઝ",
      paymentHistory: "પેમેન્ટનો ઇતિહાસ",
      onTime: "સમયસર",
      delayed: "વિલંબ",
      transactionHistory: "ટ્રાન્સેક્શનનો ઇતિહાસ",
      allQuotes: "બધા કોટ્સ",
      allOrders: "બધા ઓર્ડર",
      communicationLog: "સંપર્ક લોગ",
      businessInformation: "બિઝનેસ માહિતી",
      preferredMaterials: "પસંદીદા સામગ્રી",
      volumePatterns: "વોલ્યુમ પેટર્ન",
      paymentTerms: "પેમેન્ટ નિયમો",
      deliveryPreferences: "ડિલિવરી પસંદગી",
      createNewQuote: "નવું કોટ બનાવો",
      followUpPending: "ફોલો-અપ બાકી",
      viewPaymentStatus: "પેમેન્ટ સ્થિતિ જુઓ",
      sendPaymentReminder: "પેમેન્ટ રિમાઇન્ડર મોકલો",
      customers: "કસ્ટમર્સ",
      customerList: "કસ્ટમર લિસ્ટ",
      addNewCustomer: "+ નવા કસ્ટમર ાડો",
      searchCustomers: "કસ્ટમર શોધો",
      searchPlaceholder: "નામ, સ્થળ, અથવા સામગ્રી દ્વારા શોધો..."
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
      convertToOrder: "🔄 ऑर्डर में बदलें",
      convertToCustomer: "👤 कस्टमर में बदलें",
      salesOrder: "सेल्स ऑर्डर",
      customerName: "कस्टमर का नाम",
      orderNumber: "ऑर्डर नंबर",
      orderDate: "ऑर्डर की तारीख",
      orderStatus: "ऑर्डर स्थिति",
      pendingPayment: "पेंडिंग पेमेंट",
      paymentReceived: "पेमेंट प्राप्त",
      readyForProduction: "प्रोडक्शन के लिए तैयार",
      filters: "फिल्टर",
      all: "सभी",
      showAll: "सभी दिखाएं",
      showHotLeads: "🔥 हॉट लीड्स",
      showWarmLeads: "⭐ वार्म लीड्स",
      showColdLeads: "❄️ कोल्ड लीड्स",
      showPending: "⏳ पेंडिंग",
      showApproved: "✅ अप्रूव्ड",
      showExpired: "❌ एक्सपायर्ड",
      showConverted: "🎉 कन्वर्ट किए गए",
      customerProfile: "कस्टमर प्रोफाइल",
      customerSince: "कस्टमर बने",
      totalBusiness: "कुल बिज़नेस",
      conversionRate: "कन्वर्जन रेट",
      averageOrderSize: "औसत ऑर्डर साइज",
      paymentHistory: "पेमेंट हिस्टरी",
      onTime: "समय पर",
      delayed: "देरी",
      transactionHistory: "ट्रांजैक्शन हिस्टरी",
      allQuotes: "सभी कोट्स",
      allOrders: "सभी ऑर्डर",
      communicationLog: "कम्यूनिकेशन लॉग",
      businessInformation: "बिज़नेस जानकारी",
      preferredMaterials: "पसंदीदा सामग्री",
      volumePatterns: "वॉल्यूम पैटर्न",
      paymentTerms: "पेमेंट शर्तें",
      deliveryPreferences: "डिलीवरी प्राथमिकताएं",
      createNewQuote: "नया कोट बनाएं",
      followUpPending: "फॉलो-अप पेंडिंग",
      viewPaymentStatus: "पेमेंट स्टेटस देखें",
      sendPaymentReminder: "पेमेंट रिमाइंडर भेजें",
      customers: "कस्टमर",
      customerList: "कस्टमर लिस्ट",
      addNewCustomer: "+ नए कस्टमर जोड़ें",
      searchCustomers: "कस्टमर खोजें",
      searchPlaceholder: "नाम, स्थान, या सामग्री से खोजें..."
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

  function showSalesOrders() {
    setCurrentScreen('salesorders');
  }

  function convertToCustomer(quoteId: string) {
    // In a real app, this would convert quote to customer and create sales order
    setCurrentScreen('salesorders');
  }

  function showCustomerProfile(customerId: string) {
    // In a real app, this would load specific customer data
    setCurrentScreen('customerprofile');
  }

  function showCustomerList() {
    setCurrentScreen('customerlist');
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
          <div className="feature-card clickable" onClick={showSalesOrders}>💳 {t.salesOrder}</div>
          <div className="feature-card clickable" onClick={showCustomerList}>👥 {t.customers}</div>
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

        <div className="filters-section">
          <div className="filter-buttons">
            <button 
              className={leadFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setLeadFilter('all')}
            >
              {t.showAll}
            </button>
            <button 
              className={leadFilter === 'hot' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setLeadFilter('hot')}
            >
              {t.showHotLeads}
            </button>
            <button 
              className={leadFilter === 'warm' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setLeadFilter('warm')}
            >
              {t.showWarmLeads}
            </button>
            <button 
              className={leadFilter === 'cold' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setLeadFilter('cold')}
            >
              {t.showColdLeads}
            </button>
          </div>
        </div>

        <div className="leads-container">
          {(leadFilter === 'all' || leadFilter === 'hot') && (
          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>
                <span 
                  onClick={() => showCustomerProfile('rajesh-textiles')}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  Rajesh Textiles - Ahmedabad
                </span>
              </h3>
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
                  ✅ QT-2025-001 (Sep 1) → 🎉 SO-2025-001
                </span>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ffa502', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ⏳ QT-2025-004 (Sep 2)
                </span>
              </div>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('rajesh-textiles')}>{t.sendQuote}</button>
            </div>
          </div>
          )}

          {(leadFilter === 'all' || leadFilter === 'warm') && (
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
              <p><strong>{t.inquiryDate}:</strong> 5 days ago</p>
              <p><strong>Quote Status:</strong></p>
              <div style={{marginLeft: '10px'}}>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ff4757', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ❌ QT-2025-002 (Aug 29)
                </span>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ffa502', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ⏳ QT-2025-005 (Sep 3)
                </span>
              </div>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Priya Patel - 9123456789</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('gujarat-garments')}>{t.sendQuote}</button>
            </div>
          </div>
          )}

          {(leadFilter === 'all' || leadFilter === 'cold') && (
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
              <p><strong>{t.inquiryDate}:</strong> 1 week ago</p>
              <p><strong>Quote Status:</strong></p>
              <div style={{marginLeft: '10px'}}>
                <span 
                  onClick={() => showQuotationOrders()}
                  style={{color: '#ff4757', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'block'}}
                >
                  ❌ QT-2025-003 (Aug 15)
                </span>
                <span style={{color: '#666', fontSize: '0.9rem', display: 'block'}}>
                  💡 Ready for new quote
                </span>
              </div>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Amit Sharma - 9988776655</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showQuoteFromLead('baroda-fashion')}>{t.sendQuote}</button>
            </div>
          </div>
          )}
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

        <div className="filters-section">
          <div className="filter-buttons">
            <button 
              className={quoteFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setQuoteFilter('all')}
            >
              {t.showAll}
            </button>
            <button 
              className={quoteFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setQuoteFilter('pending')}
            >
              {t.showPending}
            </button>
            <button 
              className={quoteFilter === 'approved' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setQuoteFilter('approved')}
            >
              {t.showApproved}
            </button>
            <button 
              className={quoteFilter === 'converted' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setQuoteFilter('converted')}
            >
              {t.showConverted}
            </button>
            <button 
              className={quoteFilter === 'expired' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setQuoteFilter('expired')}
            >
              {t.showExpired}
            </button>
          </div>
        </div>

        <div className="leads-container">
          <div className="lead-card warm-lead">
            <div className="lead-header">
              <h3>QT-2025-001 - Rajesh Textiles</h3>
              <span className="priority-badge warm">⭐ Converted to Customer</span>
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
              <p><strong>Sales Order:</strong> 
                <span 
                  onClick={() => showSalesOrders()} 
                  style={{cursor: 'pointer', color: '#2ed573', textDecoration: 'underline', fontWeight: 'bold'}}
                >
                  🎉 SO-2025-001 (Sep 3)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> Rajesh Textiles - Ahmedabad</p>
              <p><strong>{t.material}:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
              <p><strong>{t.specification}:</strong> 100 GSM, Pre-shrunk, Natural dyes</p>
              <p><strong>{t.quoteDate}:</strong> September 1, 2025</p>
              <p><strong>{t.validUntil}:</strong> September 15, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹95,000 (500m × ₹190/meter)</p>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
              <button className="action-btn approve" disabled style={{opacity: 0.6}}>✅ Customer Created</button>
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
              <button className="action-btn whatsapp">{t.whatsapp}</button>
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
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
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
              <button className="action-btn whatsapp">{t.whatsapp}</button>
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
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">{t.viewPDF}</button>
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

  function renderSalesOrders() {
    const t = getCurrentTranslations();
    
    return (
      <div className="lead-management-screen">
        {renderLanguageSwitcher()}
        <div className="screen-header">
          <button className="back-button" onClick={showDashboard}>
            {t.backToDashboard}
          </button>
          <h1>📋 {t.salesOrder}</h1>
          <button className="add-button">+ Add New Order</button>
        </div>

        <div className="leads-container">
          <div className="lead-card warm-lead">
            <div className="lead-header">
              <h3>SO-2025-001 - Rajesh Textiles</h3>
              <span className="priority-badge warm">⭐ {t.pendingPayment}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.orderNumber}:</strong> SO-2025-001</p>
              <p><strong>Quote Source:</strong> 
                <span 
                  onClick={() => showQuotationOrders()} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  ✅ QT-2025-001 (Sep 1, 2025)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> 
                <span 
                  onClick={() => showCustomerProfile('1')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  Rajesh Textiles - Ahmedabad
                </span>
              </p>
              <p><strong>Customer Status:</strong> 🎉 <span style={{color: '#2ed573', fontWeight: 'bold'}}>New Customer (Converted from Lead)</span></p>
              <p><strong>{t.material}:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
              <p><strong>{t.specification}:</strong> 100 GSM, Pre-shrunk, Natural dyes</p>
              <p><strong>{t.orderDate}:</strong> September 3, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹95,000 (500m × ₹190/meter)</p>
              <p><strong>Advance Payment Required:</strong> ₹47,500 (50% of order value)</p>
              <p><strong>{t.orderStatus}:</strong> 🔴 Waiting for Advance Payment</p>
              <p><strong>{t.contact}:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">📄 View Order PDF</button>
              <button className="action-btn approve">💳 Collect Payment</button>
            </div>
          </div>

          <div className="lead-card cold-lead">
            <div className="lead-header">
              <h3>SO-2025-002 - Premium Fabrics Ltd</h3>
              <span className="priority-badge cold">❄️ {t.paymentReceived}</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.orderNumber}:</strong> SO-2025-002</p>
              <p><strong>Quote Source:</strong> 
                <span style={{color: '#666', fontSize: '0.9rem'}}>
                  ✅ QT-2025-006 (Aug 25, 2025)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> 
                <span 
                  onClick={() => showCustomerProfile('2')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  Premium Fabrics Ltd - Mumbai
                </span>
              </p>
              <p><strong>Customer Status:</strong> 🏆 <span style={{color: '#5352ed', fontWeight: 'bold'}}>Repeat Customer</span></p>
              <p><strong>{t.material}:</strong> 750 meters Silk Cotton Blend, 42" width</p>
              <p><strong>{t.specification}:</strong> 110 GSM, Mercerized, Dye-friendly</p>
              <p><strong>{t.orderDate}:</strong> August 28, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹1,35,000 (750m × ₹180/meter)</p>
              <p><strong>Advance Payment:</strong> ✅ ₹67,500 received on Aug 30</p>
              <p><strong>{t.orderStatus}:</strong> 🟢 {t.readyForProduction}</p>
              <p><strong>{t.contact}:</strong> Meera Jain - 9988112233</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">📄 View Order PDF</button>
              <button className="action-btn approve">🔄 Create Work Order</button>
            </div>
          </div>

          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>SO-2025-003 - Textile Innovation Co</h3>
              <span className="priority-badge hot">🔥 Payment Overdue</span>
            </div>
            <div className="lead-details">
              <p><strong>{t.orderNumber}:</strong> SO-2025-003</p>
              <p><strong>Quote Source:</strong> 
                <span style={{color: '#666', fontSize: '0.9rem'}}>
                  ✅ QT-2025-007 (Aug 20, 2025)
                </span>
              </p>
              <p><strong>{t.customerName}:</strong> 
                <span 
                  onClick={() => showCustomerProfile('3')} 
                  style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                >
                  Textile Innovation Co - Surat
                </span>
              </p>
              <p><strong>Customer Status:</strong> ⚠️ <span style={{color: '#ff4757', fontWeight: 'bold'}}>Payment Delayed</span></p>
              <p><strong>{t.material}:</strong> 400 meters Organic Cotton, 46" width</p>
              <p><strong>{t.specification}:</strong> 140 GSM, GOTS Certified, Natural finish</p>
              <p><strong>{t.orderDate}:</strong> August 22, 2025</p>
              <p><strong>{t.totalAmount}:</strong> ₹92,000 (400m × ₹230/meter)</p>
              <p><strong>Advance Payment:</strong> ❌ ₹46,000 overdue by 12 days</p>
              <p><strong>{t.orderStatus}:</strong> 🔴 Payment Follow-up Required</p>
              <p><strong>{t.contact}:</strong> Kiran Patel - 9876567890</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">📄 View Order PDF</button>
              <button className="action-btn approve">⚠️ Payment Reminder</button>
            </div>
          </div>
        </div>

        <div className="voice-commands">
          <p className="voice-hint">
            🎤 <strong>{t.voiceCommandsHint}</strong> 
            "Show pending payments" • "Call payment overdue customers" • "Create work order for SO-002"
          </p>
        </div>
      </div>
    );
  }

  function renderCustomerProfile() {
    const t = getCurrentTranslations();
    
    return (
      <div className="lead-management-screen">
        {renderLanguageSwitcher()}
        <div className="screen-header">
          <button className="back-button" onClick={showDashboard}>
            {t.backToDashboard}
          </button>
          <h1>👤 {t.customerProfile}</h1>
          <button className="add-button">{t.createNewQuote}</button>
        </div>

        {/* Customer Header Section */}
        <div className="customer-header">
          <div className="customer-main-info">
            <h2>🏭 Rajesh Textiles - Ahmedabad</h2>
            <p className="customer-since">🎉 {t.customerSince}: September 3, 2025</p>
            <p className="customer-type">🏆 <strong>Premium Customer</strong> - Regular Orders</p>
          </div>
          <div className="customer-contact-header">
            <p><strong>Primary Contact:</strong> Rajesh Shah - 9876543210</p>
            <div className="header-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
            </div>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="customer-stats">
          <div className="stat-card">
            <h3>💰 {t.totalBusiness}</h3>
            <p className="stat-value">₹95,000</p>
            <p className="stat-detail">1 order completed</p>
          </div>
          <div className="stat-card">
            <h3>📊 {t.conversionRate}</h3>
            <p className="stat-value">100%</p>
            <p className="stat-detail">1/1 quotes converted</p>
          </div>
          <div className="stat-card">
            <h3>📦 {t.averageOrderSize}</h3>
            <p className="stat-value">₹95,000</p>
            <p className="stat-detail">500 meters avg</p>
          </div>
          <div className="stat-card">
            <h3>⏰ {t.paymentHistory}</h3>
            <p className="stat-value">{t.onTime}</p>
            <p className="stat-detail">Advance pending</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transaction-history">
          <h3>📋 {t.transactionHistory}</h3>
          
          <div className="history-section">
            <h4>📑 {t.allQuotes}</h4>
            <div className="history-item">
              <div className="history-header">
                <span className="quote-number">QT-2025-001</span>
                <span className="quote-status approved">✅ Approved → 🎉 Converted</span>
                <span className="quote-date">Sep 1, 2025</span>
              </div>
              <div className="history-details">
                <p><strong>Material:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
                <p><strong>Amount:</strong> ₹95,000 (₹190/meter)</p>
                <p><strong>Converted to:</strong> 
                  <span 
                    onClick={() => showSalesOrders()}
                    style={{cursor: 'pointer', color: '#2ed573', textDecoration: 'underline'}}
                  >
                    SO-2025-001
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h4>🛒 {t.allOrders}</h4>
            <div className="history-item">
              <div className="history-header">
                <span className="order-number">SO-2025-001</span>
                <span className="order-status pending">⏳ Pending Advance Payment</span>
                <span className="order-date">Sep 3, 2025</span>
              </div>
              <div className="history-details">
                <p><strong>Material:</strong> 500 meters Bandhani Cotton Fabric</p>
                <p><strong>Order Value:</strong> ₹95,000</p>
                <p><strong>Advance Required:</strong> ₹47,500 (50%)</p>
                <p><strong>Status:</strong> 🔴 Waiting for advance payment</p>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h4>💬 {t.communicationLog}</h4>
            <div className="history-item">
              <div className="comm-entry">
                <span className="comm-date">Sep 3, 2025 - 2:30 PM</span>
                <span className="comm-type">📞 Phone Call</span>
                <p className="comm-note">Discussed order confirmation and advance payment timeline</p>
              </div>
              <div className="comm-entry">
                <span className="comm-date">Sep 2, 2025 - 11:15 AM</span>
                <span className="comm-type">📱 WhatsApp</span>
                <p className="comm-note">Sent revised quote QT-2025-004 with reduced quantity</p>
              </div>
              <div className="comm-entry">
                <span className="comm-date">Sep 1, 2025 - 4:45 PM</span>
                <span className="comm-type">📧 Quote Sent</span>
                <p className="comm-note">Initial quote QT-2025-001 for 500m Bandhani cotton</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="business-info">
          <h3>📊 {t.businessInformation}</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🧵 {t.preferredMaterials}</h4>
              <p>• Bandhani Cotton (Traditional patterns)</p>
              <p>• 44-45" width preferred</p>
              <p>• Natural dyes, pre-shrunk finishing</p>
            </div>
            <div className="info-item">
              <h4>📈 {t.volumePatterns}</h4>
              <p>• Typical Order: 300-500 meters</p>
              <p>• Frequency: Monthly orders expected</p>
              <p>• Peak Season: Oct-Feb (festival season)</p>
            </div>
            <div className="info-item">
              <h4>💳 {t.paymentTerms}</h4>
              <p>• 50% advance payment required</p>
              <p>• Balance on delivery</p>
              <p>• Credit limit: ₹2,00,000</p>
            </div>
            <div className="info-item">
              <h4>🚚 {t.deliveryPreferences}</h4>
              <p>• Location: Ahmedabad textile market</p>
              <p>• Timeline: 15-20 days acceptable</p>
              <p>• Preferred delivery: Morning hours</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="customer-quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button className="quick-action-btn primary">{t.createNewQuote}</button>
            <button className="quick-action-btn">{t.followUpPending}</button>
            <button className="quick-action-btn">{t.viewPaymentStatus}</button>
            <button className="quick-action-btn warning">{t.sendPaymentReminder}</button>
          </div>
        </div>

        <div className="voice-commands">
          <p className="voice-hint">
            🎤 <strong>{t.voiceCommandsHint}</strong> 
            "Create quote for Rajesh" • "Check payment status" • "Call customer" • "Send payment reminder"
          </p>
        </div>
      </div>
    );
  }

  function renderCustomerList() {
    const t = getCurrentTranslations();
    
    return (
      <div className="lead-management-screen">
        {renderLanguageSwitcher()}
        <div className="screen-header">
          <button className="back-button" onClick={showDashboard}>
            {t.backToDashboard}
          </button>
          <h1>👥 {t.customerList}</h1>
          <button className="add-button">{t.addNewCustomer}</button>
        </div>

        <div className="search-section">
          <input 
            type="text" 
            className="search-input"
            placeholder={t.searchPlaceholder}
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
        </div>

        <div className="filters-section">
          <div className="filter-buttons">
            <button className="filter-btn active">{t.showAll}</button>
            <button className="filter-btn">🏆 Premium</button>
            <button className="filter-btn">🎉 New Customers</button>
            <button className="filter-btn">⚡ Active</button>
            <button className="filter-btn">⚠️ Payment Issues</button>
          </div>
        </div>

        <div className="leads-container">
          <div className="lead-card warm-lead">
            <div className="lead-header">
              <h3>
                <span 
                  onClick={() => showCustomerProfile('rajesh-textiles')}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  🏭 Rajesh Textiles - Ahmedabad
                </span>
              </h3>
              <span className="priority-badge warm">🏆 Premium Customer</span>
            </div>
            <div className="lead-details">
              <p><strong>Customer Since:</strong> September 3, 2025</p>
              <p><strong>Total Business:</strong> ₹95,000 (1 order)</p>
              <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
              <p><strong>Payment Status:</strong> 🔴 Advance payment pending</p>
              <p><strong>Preferred Materials:</strong> Bandhani Cotton, Traditional patterns</p>
              <p><strong>Last Contact:</strong> Sep 3, 2025 - Phone call about payment</p>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Rajesh Shah - 9876543210</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showCustomerProfile('rajesh-textiles')}>👤 View Profile</button>
            </div>
          </div>

          <div className="lead-card cold-lead">
            <div className="lead-header">
              <h3>
                <span 
                  onClick={() => showCustomerProfile('premium-fabrics')}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  🏭 Premium Fabrics Ltd - Mumbai
                </span>
              </h3>
              <span className="priority-badge cold">⭐ Repeat Customer</span>
            </div>
            <div className="lead-details">
              <p><strong>Customer Since:</strong> August 28, 2025</p>
              <p><strong>Total Business:</strong> ₹1,35,000 (1 order)</p>
              <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
              <p><strong>Payment Status:</strong> ✅ Payment received, ready for production</p>
              <p><strong>Preferred Materials:</strong> Silk Cotton Blend, Mercerized finish</p>
              <p><strong>Last Contact:</strong> Aug 30, 2025 - Payment confirmation</p>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Meera Jain - 9988112233</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showCustomerProfile('premium-fabrics')}>👤 View Profile</button>
            </div>
          </div>

          <div className="lead-card hot-lead">
            <div className="lead-header">
              <h3>
                <span 
                  onClick={() => showCustomerProfile('textile-innovation')}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  🏭 Textile Innovation Co - Surat
                </span>
              </h3>
              <span className="priority-badge hot">⚠️ Payment Overdue</span>
            </div>
            <div className="lead-details">
              <p><strong>Customer Since:</strong> August 22, 2025</p>
              <p><strong>Total Business:</strong> ₹92,000 (1 order)</p>
              <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
              <p><strong>Payment Status:</strong> 🔴 ₹46,000 overdue by 12 days</p>
              <p><strong>Preferred Materials:</strong> Organic Cotton, GOTS Certified</p>
              <p><strong>Last Contact:</strong> Aug 28, 2025 - Payment reminder sent</p>
            </div>
            <div className="customer-contact">
              <p><strong>Contact:</strong> Kiran Patel - 9876567890</p>
            </div>
            <div className="lead-actions">
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote" onClick={() => showCustomerProfile('textile-innovation')}>👤 View Profile</button>
            </div>
          </div>
        </div>

        <div className="voice-commands">
          <p className="voice-hint">
            🎤 <strong>{t.voiceCommandsHint}</strong> 
            "Show premium customers" • "Call overdue payments" • "View Rajesh profile" • "Send payment reminders"
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
        {currentScreen === 'salesorders' && renderSalesOrders()}
        {currentScreen === 'customerprofile' && renderCustomerProfile()}
        {currentScreen === 'customerlist' && renderCustomerList()}
      </div>
    </div>
  );
}

export default App;
