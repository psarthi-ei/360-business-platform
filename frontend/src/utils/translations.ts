export interface TranslationStrings {
  [key: string]: string;
  
  // Common UI Elements
  backToDashboard: string;
  call: string;
  whatsapp: string;
  contact: string;
  material: string;
  specification: string;
  budget: string;
  delivery: string;
  usage: string;
  pending: string;
  approved: string;
  converted: string;
  expired: string;
  
  // Dashboard
  title: string;
  company: string;
  founder: string;
  welcome: string;
  tagline: string;
  businessPlatform: string;
  voiceCommands: string;
  voiceExample1: string;
  voiceExample2: string;
  voiceExample3: string;
  
  // Feature Cards
  leadManagement: string;
  leadManagementDesc: string;
  quotationOrders: string;
  quotationOrdersDesc: string;
  salesOrder: string;
  salesOrderDesc: string;
  customers: string;
  customersDesc: string;
  workOrders: string;
  workOrdersDesc: string;
  smartProcurement: string;
  productionTracking: string;
  dispatchDelivery: string;
  invoiceFinance: string;
  customerFeedback: string;
  analyticsDashboard: string;
  production: string;
  productionDesc: string;
  inventory: string;
  inventoryDesc: string;
  dispatch: string;
  dispatchDesc: string;
  accounting: string;
  accountingDesc: string;
  analytics: string;
  analyticsDesc: string;
  reports: string;
  reportsDesc: string;
  communication: string;
  communicationDesc: string;
  
  // Lead Management
  addNewLead: string;
  showAll: string;
  showHotLeads: string;
  showWarmLeads: string;
  showColdLeads: string;
  hotLead: string;
  warmLead: string;
  coldLead: string;
  sendQuote: string;
  
  // Voice Commands
  voiceCommandsHint: string;
  addFabricInquiry: string;
  callRajesh: string;
  showCottonLeads: string;
  
  // Orders & Quotes
  quoteNumber: string;
  quoteDate: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  customerName: string;
  totalAmount: string;
  pendingPayment: string;
  paymentReceived: string;
  
  // Additional Translation Keys
  colors: string;
  inquiryDate: string;
  createQuoteRajesh: string;
  showApprovedQuotes: string;
  convertToOrder: string;
  addNewQuote: string;
  validUntil: string;
  status: string;
  viewPDF: string;
  approve: string;
  convertToCustomer: string;
  readyForProduction: string;
  filters: string;
  all: string;
  showPending: string;
  showExpired: string;
  showConverted: string;
  customerProfile: string;
  customerSince: string;
  totalBusiness: string;
  totalOrders: string;
  conversionRate: string;
  paymentScore: string;
  quoteHistory: string;
  orderHistory: string;
  businessInsights: string;
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
  customerList: string;
  addNewCustomer: string;
  advancePayments: string;

  // Customer Management
  searchCustomers: string;
  searchPlaceholder: string;
  
  // Additional missing keys
  showApproved: string;
}

const translations: Record<string, TranslationStrings> = {
  en: {
    // Common UI Elements
    backToDashboard: "← Back to Dashboard",
    call: "📞 Call",
    whatsapp: "📱 WhatsApp",
    contact: "Contact",
    material: "Material",
    specification: "Specification",
    budget: "Budget",
    delivery: "Delivery",
    usage: "Usage",
    pending: "Pending",
    approved: "Approved",
    converted: "Converted",
    expired: "Expired",
    
    // Dashboard
    title: "360° Business Platform",
    company: "ElevateIdea Technologies",
    founder: "Built by Partha Sarthi for Gujarat Textile Manufacturers",
    welcome: "Welcome to Your Business Hub",
    tagline: "360° Business Platform for Gujarat Textile Manufacturers",
    businessPlatform: "Complete end-to-end solution for textile manufacturing business",
    voiceCommands: "Voice Commands (Speak in Gujarati, Hindi, or English)",
    voiceExample1: "Add new fabric inquiry from Mumbai",
    voiceExample2: "Call Rajesh Textiles",
    voiceExample3: "Show cotton fabric leads only",
    
    // Feature Cards
    leadManagement: "Lead Management",
    leadManagementDesc: "Track and convert potential customers",
    quotationOrders: "Quotations & Orders",
    quotationOrdersDesc: "Create quotes and manage approvals",
    salesOrder: "Sales Orders",
    salesOrderDesc: "Track confirmed orders and payments",
    customers: "Customers",
    customersDesc: "Customer relationship management",
    workOrders: "Work Orders",
    workOrdersDesc: "Production planning and scheduling",
    smartProcurement: "Smart Procurement",
    productionTracking: "Production Tracking",
    dispatchDelivery: "Dispatch & Delivery",
    invoiceFinance: "Invoice & Finance",
    customerFeedback: "Customer Feedback",
    analyticsDashboard: "Analytics Dashboard",
    production: "Production",
    productionDesc: "Track manufacturing progress",
    inventory: "Inventory (3-Tier)",
    inventoryDesc: "Raw materials and finished goods",
    dispatch: "Dispatch",
    dispatchDesc: "Shipping and delivery management",
    accounting: "Accounting",
    accountingDesc: "Financial tracking and invoicing",
    analytics: "Analytics",
    analyticsDesc: "Business insights and reporting",
    reports: "Reports",
    reportsDesc: "Generate business reports",
    communication: "Communication",
    communicationDesc: "WhatsApp and voice integration",
    
    // Lead Management
    addNewLead: "+ Add New Lead",
    showAll: "Show All",
    showHotLeads: "🔥 Hot Lead",
    showWarmLeads: "⭐ Warm Lead",
    showColdLeads: "❄️ Cold Lead",
    hotLead: "Hot Lead",
    warmLead: "Warm Lead",
    coldLead: "Cold Lead",
    sendQuote: "📑 Send Quote",
    
    // Voice Commands
    voiceCommandsHint: "Try saying:",
    addFabricInquiry: "Add new fabric inquiry from Mumbai",
    callRajesh: "Call Rajesh Textiles",
    showCottonLeads: "Show cotton fabric leads only",
    
    // Orders & Quotes
    quoteNumber: "Quote Number",
    quoteDate: "Quote Date",
    orderNumber: "Order Number",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    customerName: "Customer Name",
    totalAmount: "Total Amount",
    pendingPayment: "Pending Payment",
    paymentReceived: "Payment Received",
    
    // Additional Translation Keys
    colors: "Colors",
    inquiryDate: "Inquiry Date",
    createQuoteRajesh: "Create quote for Rajesh",
    showApprovedQuotes: "Show approved quotes",
    convertToOrder: "Convert to Order",
    addNewQuote: "+ Add New Quote",
    validUntil: "Valid Until",
    status: "Status",
    viewPDF: "View PDF",
    approve: "Approve",
    convertToCustomer: "Convert to Customer",
    readyForProduction: "Ready for Production",
    filters: "Filters",
    all: "All",
    showPending: "Show Pending",
    showExpired: "Show Expired",
    showConverted: "Show Converted",
    customerProfile: "Customer Profile",
    customerSince: "Customer Since",
    totalBusiness: "Total Business",
    totalOrders: "Total Orders",
    conversionRate: "Conversion Rate",
    paymentScore: "Payment Score",
    quoteHistory: "Quote History",
    orderHistory: "Order History",
    businessInsights: "Business Insights",
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
    followUpPending: "Follow-up Pending",
    viewPaymentStatus: "View Payment Status",
    sendPaymentReminder: "Send Payment Reminder",
    customerList: "Customer List",
    addNewCustomer: "+ Add New Customer",
    advancePayments: "Advance Payments",

    // Customer Management
    searchCustomers: "Search customers by name, location, or specialization...",
    searchPlaceholder: "Search customers by name, location, or specialization...",
    
    // Additional missing keys
    showApproved: "Show Approved"
  },
  
  gu: {
    // Common UI Elements
    backToDashboard: "← ડેશબોર્ડ પર પાછા જાઓ",
    call: "📞 કૉલ",
    whatsapp: "📱 વોટ્સએપ",
    contact: "સંપર્ક",
    material: "સામગ્રી",
    specification: "સ્પેસિફિકેશન",
    budget: "બજેટ",
    delivery: "ડિલિવરી",
    usage: "ઉપયોગ",
    pending: "પેન્ડિંગ",
    approved: "મંજૂર",
    converted: "કન્વર્ટ થયેલ",
    expired: "એક્સપાયર",
    
    // Dashboard
    title: "360° બિઝનેસ પ્લેટફોર્મ",
    company: "એલિવેટઆઈડિયા ટેકનોલોજીઝ",
    founder: "ગુજરાત ટેક્સટાઇલ ઉત્પાદકો માટે પાર્થ સાર્થી દ્વારા બંધ બનાવેલ",
    welcome: "તમારા બિઝનેસ હબમાં આપનું સ્વાગત",
    tagline: "ગુજરાત ટેક્સટાઈલ ઉત્પાદકો માટે 360° બિઝનેસ પ્લેટફોર્મ",
    businessPlatform: "ટેક્સટાઈલ મેન્યુફેક્ચરિંગ બિઝનેસ માટે સંપૂર્ણ સોલ્યુશન",
    voiceCommands: "વૉઈસ કમાન્ડ્સ (ગુજરાતી, હિંદી, અથવા અંગ્રેજીમાં બોલો)",
    voiceExample1: "મુંબઈથી નવી ફેબ્રિક પૂછપરછ ઉમેરો",
    voiceExample2: "રાજેશ ટેક્સટાઈલ્સને કૉલ કરો",
    voiceExample3: "માત્ર કપાસ ફેબ્રિક લીડ્સ બતાવો",
    
    // Feature Cards
    leadManagement: "લીડ મેનેજમેન્ટ",
    leadManagementDesc: "સંભવિત ગ્રાહકોને ટ્રેક અને કન્વર્ટ કરો",
    quotationOrders: "કોટેશન અને ઓર્ડર",
    quotationOrdersDesc: "કોટ બનાવો અને મંજૂરી મેનેજ કરો",
    salesOrder: "સેલ્સ ઓર્ડર",
    salesOrderDesc: "કન્ફર્મ ઓર્ડર અને પેમેન્ટ ટ્રેક કરો",
    customers: "ગ્રાહકો",
    customersDesc: "ગ્રાહક સંબંધ મેનેજમેન્ટ",
    workOrders: "વર્ક ઓર્ડર",
    workOrdersDesc: "ઉત્પાદન આયોજન અને શિડ્યૂલિંગ",
    smartProcurement: "સ્માર્ટ પ્રોક્યુરમેન્ટ",
    productionTracking: "પ્રોડક્શન ટ્રેકિંગ",
    dispatchDelivery: "ડિસ્પેચ અને ડિલિવરી",
    invoiceFinance: "ઇન્વોઇસ અને ફાઇનાન્સ",
    customerFeedback: "ગ્રાહક ફીડબેક",
    analyticsDashboard: "એનાલિટિક્સ ડેશબોર્ડ",
    production: "ઉત્પાદન",
    productionDesc: "મેન્યુફેક્ચરિંગ પ્રોગ્રેસ ટ્રેક કરો",
    inventory: "ઇન્વેન્ટરી (3-ટિયર)",
    inventoryDesc: "કાચો માલ અને તૈયાર માલ",
    dispatch: "ડિસ્પેચ",
    dispatchDesc: "શિપિંગ અને ડિલિવરી મેનેજમેન્ટ",
    accounting: "એકાઉન્ટિંગ",
    accountingDesc: "ફાઈનાન્શિયલ ટ્રેકિંગ અને ઇન્વોઇસિંગ",
    analytics: "એનાલિટિક્સ",
    analyticsDesc: "બિઝનેસ ઇનસાઇટ્સ અને રિપોર્ટિંગ",
    reports: "રિપોર્ટ્સ",
    reportsDesc: "બિઝનેસ રિપોર્ટ્સ જનરેટ કરો",
    communication: "કમ્યુનિકેશન",
    communicationDesc: "વોટ્સએપ અને વૉઈસ ઇન્ટિગ્રેશન",
    
    // Lead Management
    addNewLead: "+ નવી લીડ ઉમેરો",
    showAll: "સબ બતાવો",
    showHotLeads: "🔥 હોટ લીડ",
    showWarmLeads: "⭐ વોર્મ લીડ",
    showColdLeads: "❄️ કોલ્ડ લીડ",
    hotLead: "હોટ લીડ",
    warmLead: "વોર્મ લીડ",
    coldLead: "કોલ્ડ લીડ",
    sendQuote: "📑 કોટ મોકલો",
    
    // Voice Commands
    voiceCommandsHint: "આ કહીને ટ્રાઇ કરો:",
    addFabricInquiry: "મુંબઈથી નવી ફેબ્રિક પૂછપરછ ઉમેરો",
    callRajesh: "રાજેશ ટેક્સટાઈલ્સને કૉલ કરો",
    showCottonLeads: "માત્ર કપાસ ફેબ્રિક લીડ્સ બતાવો",
    
    // Orders & Quotes
    quoteNumber: "કોટ નંબર",
    quoteDate: "કોટ તારીખ",
    orderNumber: "ઓર્ડર નંબર",
    orderDate: "ઓર્ડર તારીખ",
    orderStatus: "ઓર્ડર સ્ટેટસ",
    customerName: "ગ્રાહકનું નામ",
    totalAmount: "કુલ રકમ",
    pendingPayment: "પેન્ડિંગ પેમેન્ટ",
    paymentReceived: "પેમેન્ટ મળેલ",
    
    // Additional Translation Keys
    colors: "રંગો",
    inquiryDate: "પૂછપરછની તારીખ",
    createQuoteRajesh: "રાજેશ માટે કોટ બનાવો",
    showApprovedQuotes: "મંજૂર કોટ્સ બતાવો",
    convertToOrder: "ઓર્ડરમાં કન્વર્ટ કરો",
    addNewQuote: "+ નવો કોટ ઉમેરો",
    validUntil: "સુધી માન્ય",
    status: "સ્ટેટસ",
    viewPDF: "PDF જુઓ",
    approve: "મંજૂરી",
    convertToCustomer: "ગ્રાહકમાં કન્વર્ટ કરો",
    readyForProduction: "ઉત્પાદન માટે તૈયાર",
    filters: "ફિલ્ટર્સ",
    all: "બધા",
    showPending: "પેન્ડિંગ બતાવો",
    showExpired: "એક્સપાયર બતાવો",
    showConverted: "કન્વર્ટેડ બતાવો",
    customerProfile: "ગ્રાહક પ્રોફાઇલ",
    customerSince: "ગ્રાહક બન્યા ત્યારથી",
    totalBusiness: "કુલ બિઝનેસ",
    totalOrders: "કુલ ઓર્ડર્સ",
    conversionRate: "કન્વર્ઝન રેટ",
    paymentScore: "પેમેન્ટ સ્કોર",
    quoteHistory: "ક્વોટ હિસ્ટરી",
    orderHistory: "ઓર્ડર હિસ્ટરી",
    businessInsights: "બિઝનેસ ઇન્સાઇટ્સ",
    averageOrderSize: "સરેરાશ ઓર્ડર સાઇઝ",
    paymentHistory: "પેમેન્ટ હિસ્ટરી",
    onTime: "સમયસર",
    delayed: "વિલંબિત",
    transactionHistory: "ટ્રાન્ઝેક્શન હિસ્ટરી",
    allQuotes: "બધા કોટ્સ",
    allOrders: "બધા ઓર્ડર્સ",
    communicationLog: "કમ્યુનિકેશન લોગ",
    businessInformation: "બિઝનેસ માહિતી",
    preferredMaterials: "પસંદગીની સામગ્રી",
    volumePatterns: "વોલ્યુમ પેટર્ન",
    paymentTerms: "પેમેન્ટ શરતો",
    deliveryPreferences: "ડિલિવરી પસંદગીઓ",
    createNewQuote: "નવો કોટ બનાવો",
    followUpPending: "ફોલો-અપ પેન્ડિંગ",
    viewPaymentStatus: "પેમેન્ટ સ્ટેટસ જુઓ",
    sendPaymentReminder: "પેમેન્ટ રિમાઇન્ડર મોકલો",
    customerList: "ગ્રાહક યાદી",
    addNewCustomer: "+ નવો ગ્રાહક ઉમેરો",
    advancePayments: "એડવાન્સ પેમેન્ટ્સ",

    // Customer Management
    searchCustomers: "નામ, સ્થળ અથવા વિશેષતા દ્વારા ગ્રાહકો શોધો...",
    searchPlaceholder: "નામ, સ્થળ અથવા વિશેષતા દ્વારા ગ્રાહકો શોધો...",
    
    // Additional missing keys
    showApproved: "મંજૂર બતાવો"
  },
  
  hi: {
    // Common UI Elements
    backToDashboard: "← डैशबोर्ड पर वापस जाएं",
    call: "📞 कॉल",
    whatsapp: "📱 व्हाट्सऐप",
    contact: "संपर्क",
    material: "सामग्री",
    specification: "स्पेसिफिकेशन",
    budget: "बजट",
    delivery: "डिलीवरी",
    usage: "उपयोग",
    pending: "पेंडिंग",
    approved: "अप्रूव्ड",
    converted: "कन्वर्ट किया गया",
    expired: "एक्सपायर",
    
    // Dashboard
    title: "360° बिजनेस प्लेटफॉर्म",
    company: "एलेवेटआईडिया टेक्नोलॉजीज",
    founder: "गुजरात टेक्सटाइल निर्माताओं के लिए पार्थ सार्थी द्वारा निर्मित",
    welcome: "आपके बिजनेस हब में आपका स्वागत",
    tagline: "गुजरात टेक्सटाइल निर्माताओं के लिए 360° बिजनेस प्लेटफॉर्म",
    businessPlatform: "टेक्सटाइल मैन्युफैक्चरिंग बिजनेस के लिए संपूर्ण समाधान",
    voiceCommands: "वॉयस कमांड (गुजराती, हिंदी, या अंग्रेजी में बोलें)",
    voiceExample1: "मुंबई से नई फैब्रिक पूछताछ जोड़ें",
    voiceExample2: "राजेश टेक्सटाइल्स को कॉल करें",
    voiceExample3: "केवल कपास फैब्रिक लीड्स दिखाएं",
    
    // Feature Cards
    leadManagement: "लीड प्रबंधन",
    leadManagementDesc: "संभावित ग्राहकों को ट्रैक और कन्वर्ट करें",
    quotationOrders: "कोटेशन और ऑर्डर",
    quotationOrdersDesc: "कोट बनाएं और अप्रूवल मैनेज करें",
    salesOrder: "सेल्स ऑर्डर",
    salesOrderDesc: "कन्फर्म ऑर्डर और पेमेंट ट्रैक करें",
    customers: "ग्राहक",
    customersDesc: "ग्राहक संबंध प्रबंधन",
    workOrders: "वर्क ऑर्डर",
    workOrdersDesc: "उत्पादन योजना और शेड्यूलिंग",
    smartProcurement: "स्मार्ट प्रोक्यूरमेंट",
    productionTracking: "प्रोडक्शन ट्रैकिंग",
    dispatchDelivery: "डिस्पैच और डिलीवरी",
    invoiceFinance: "इनवॉइस और फाइनेंस",
    customerFeedback: "कस्टमर फीडबैक",
    analyticsDashboard: "एनालिटिक्स डैशबोर्ड",
    production: "उत्पादन",
    productionDesc: "मैन्युफैक्चरिंग प्रोग्रेस ट्रैक करें",
    inventory: "इन्वेंटरी (3-टियर)",
    inventoryDesc: "कच्चा माल और तैयार माल",
    dispatch: "डिस्पैच",
    dispatchDesc: "शिपिंग और डिलीवरी मैनेजमेंट",
    accounting: "अकाउंटिंग",
    accountingDesc: "फाइनेंशियल ट्रैकिंग और इनवॉइसिंग",
    analytics: "एनालिटिक्स",
    analyticsDesc: "बिजनेस इनसाइट्स और रिपोर्टिंग",
    reports: "रिपोर्ट्स",
    reportsDesc: "बिजनेस रिपोर्ट्स जनरेट करें",
    communication: "कम्युनिकेशन",
    communicationDesc: "व्हाट्सऐप और वॉयस इंटीग्रेशन",
    
    // Lead Management
    addNewLead: "+ नया लीड जोड़ें",
    showAll: "सभी दिखाएं",
    showHotLeads: "🔥 हॉट लीड",
    showWarmLeads: "⭐ वार्म लीड",
    showColdLeads: "❄️ कोल्ड लीड",
    hotLead: "हॉट लीड",
    warmLead: "वार्म लीड",
    coldLead: "कोल्ड लीड",
    sendQuote: "📑 कोट भेजें",
    
    // Voice Commands
    voiceCommandsHint: "कहने की कोशिश करें:",
    addFabricInquiry: "मुंबई से नई फैब्रिक पूछताछ जोड़ें",
    callRajesh: "राजेश टेक्सटाइल्स को कॉल करें",
    showCottonLeads: "केवल कपास फैब्रिक लीड्स दिखाएं",
    
    // Orders & Quotes
    quoteNumber: "कोट नंबर",
    quoteDate: "कोट तारीख",
    orderNumber: "ऑर्डर नंबर",
    orderDate: "ऑर्डर तारीख",
    orderStatus: "ऑर्डर स्टेटस",
    customerName: "ग्राहक का नाम",
    totalAmount: "कुल राशि",
    pendingPayment: "पेंडिंग पेमेंट",
    paymentReceived: "पेमेंट प्राप्त",
    
    // Additional Translation Keys
    colors: "रंग",
    inquiryDate: "पूछताछ की तारीख",
    createQuoteRajesh: "राजेश के लिए कोट बनाएं",
    showApprovedQuotes: "अप्रूव्ड कोट्स दिखाएं",
    convertToOrder: "ऑर्डर में कन्वर्ट करें",
    addNewQuote: "+ नया कोट जोड़ें",
    validUntil: "तक मान्य",
    status: "स्टेटस",
    viewPDF: "PDF देखें",
    approve: "अप्रूव करें",
    convertToCustomer: "ग्राहक में कन्वर्ट करें",
    readyForProduction: "प्रोडक्शन के लिए तैयार",
    filters: "फिल्टर्स",
    all: "सभी",
    showPending: "पेंडिंग दिखाएं",
    showExpired: "एक्सपायर दिखाएं",
    showConverted: "कन्वर्टेड दिखाएं",
    customerProfile: "ग्राहक प्रोफाइल",
    customerSince: "ग्राहक बने तब से",
    totalBusiness: "कुल बिजनेस",
    totalOrders: "कुल ऑर्डर्स",
    conversionRate: "कन्वर्जन रेट",
    paymentScore: "पेमेंट स्कोर",
    quoteHistory: "कोट हिस्ट्री",
    orderHistory: "ऑर्डर हिस्ट्री",
    businessInsights: "बिजनेस इनसाइट्स",
    averageOrderSize: "औसत ऑर्डर साइज",
    paymentHistory: "पेमेंट हिस्ट्री",
    onTime: "समय पर",
    delayed: "विलंबित",
    transactionHistory: "ट्रांजेक्शन हिस्ट्री",
    allQuotes: "सभी कोट्स",
    allOrders: "सभी ऑर्डर्स",
    communicationLog: "कम्युनिकेशन लॉग",
    businessInformation: "बिजनेस जानकारी",
    preferredMaterials: "पसंदीदा सामग्री",
    volumePatterns: "वॉल्यूम पैटर्न",
    paymentTerms: "पेमेंट शर्तें",
    deliveryPreferences: "डिलीवरी प्राथमिकताएं",
    createNewQuote: "नया कोट बनाएं",
    followUpPending: "फॉलो-अप पेंडिंग",
    viewPaymentStatus: "पेमेंट स्टेटस देखें",
    sendPaymentReminder: "पेमेंट रिमाइंडर भेजें",
    customerList: "ग्राहक सूची",
    addNewCustomer: "+ नया ग्राहक जोड़ें",
    advancePayments: "एडवांस पेमेंट्स",

    // Customer Management
    searchCustomers: "नाम, स्थान या विशेषता के अनुसार ग्राहकों को खोजें...",
    searchPlaceholder: "नाम, स्थान या विशेषता के अनुसार ग्राहकों को खोजें...",
    
    // Additional missing keys
    showApproved: "अप्रूव्ड दिखाएं"
  }
};

export function getCurrentTranslations(language: string): TranslationStrings {
  return translations[language] || translations.en;
}

export default translations;