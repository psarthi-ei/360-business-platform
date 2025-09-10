export interface TranslationStrings {
  [key: string]: string;
  
  // Authentication
  welcomeBack: string;
  signInToContinue: string;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signIn: string;
  signingIn: string;
  signUp: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  tryAsGuest: string;
  
  // Dashboard
  title: string;
  company: string;
  founder: string;
  welcome: string;
  tagline: string;
  businessPlatform: string;
  voiceCommands: string;
  
  // Business Categories
  salesCustomerCategory: string;
  financialCategory: string;
  productionCategory: string;
  fulfillmentCategory: string;
  analyticsCategory: string;
  
  // Module Names
  leadManagement: string;
  quotationOrders: string;
  salesOrder: string;
  customers: string;
  workOrders: string;
  smartProcurement: string;
  inventory: string;
  productionTracking: string;
  dispatchDelivery: string;
  invoiceFinance: string;
  customerFeedback: string;
  analyticsDashboard: string;
  leads: string;
  quotes: string;
  loyalty: string;
  payments: string;
  reports: string;
  cashFlow: string;
  procurement: string;
  production: string;
  dispatch: string;
  voiceAI: string;
  analytics: string;
  
  // Metrics Labels
  newLeads: string;
  pendingQuotes: string;
  activeCustomers: string;
  pendingPayments: string;
  totalRevenue: string;
  overdue: string;
  readyToShip: string;
  inTransit: string;
  delivered: string;
  qualityIssues: string;
  inProduction: string;
  
  // Category Status
  liveBadge: string;
  comingBadge: string;
  moduleCount: string;
  
  // Common UI
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
  
  // Customer Management
  customerProfile: string;
  createNewQuote: string;
  customerSince: string;
  totalBusiness: string;
  totalOrders: string;
  conversionRate: string;
  paymentScore: string;
  businessInsights: string;
  searchCustomers: string;
  showAll: string;
  voiceCommandsHint: string;
  quoteHistory: string;
  orderHistory: string;
  transactionHistory: string;
  
  // Action Buttons
  viewPDF: string;
  approve: string;
  convertToOrder: string;
  showExpired: string;
  showApproved: string;
  showHotLeads: string;
  showWarmLeads: string;
  showColdLeads: string;
  addNewLead: string;
  addNewQuote: string;
  showPending: string;
}

const baseTranslations: Record<string, Partial<TranslationStrings>> = {
  en: {
    // Authentication
    welcomeBack: "Welcome Back",
    signInToContinue: "Sign in to continue managing your textile business",
    email: "Email Address",
    password: "Password",
    emailPlaceholder: "Enter your email address",
    passwordPlaceholder: "Enter your password",
    signIn: "Sign In",
    signingIn: "Signing In...",
    signUp: "Sign Up",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    tryAsGuest: "Try as Guest",
    
    // Dashboard
    title: "360° Business Platform",
    company: "ElevateBusiness",
    founder: "Built by Partha Sarthi for Gujarat Textile Manufacturers",
    welcome: "Welcome to Your Business Hub",
    tagline: "360° Business Platform for Gujarat Textile Manufacturers",
    businessPlatform: "Complete end-to-end solution for textile manufacturing business",
    voiceCommands: "Voice Commands (Speak in Gujarati, Hindi, or English)",
    
    // Business Categories
    salesCustomerCategory: "Sales & Customer Management",
    financialCategory: "Financial Management",
    productionCategory: "Production & Operations",
    fulfillmentCategory: "Fulfillment & Delivery",
    analyticsCategory: "Business Intelligence",
    
    // Module Names
    leadManagement: "Lead Management",
    quotationOrders: "Quotations & Orders",
    salesOrder: "Sales Orders",
    customers: "Customers",
    workOrders: "Work Orders",
    smartProcurement: "Smart Procurement",
    inventory: "Inventory (3-Tier)",
    productionTracking: "Production Tracking",
    dispatchDelivery: "Dispatch & Delivery",
    invoiceFinance: "Invoice & Finance",
    customerFeedback: "Customer Feedback",
    analyticsDashboard: "Analytics Dashboard",
    leads: "Leads",
    quotes: "Quotes",
    loyalty: "Loyalty",
    payments: "Payments",
    reports: "Reports",
    cashFlow: "Cash Flow",
    procurement: "Procurement",
    production: "Production",
    dispatch: "Dispatch",
    voiceAI: "Voice AI",
    analytics: "Analytics",
    
    // Metrics Labels
    newLeads: "New Leads",
    pendingQuotes: "Pending Quotes",
    activeCustomers: "Active Customers",
    pendingPayments: "Pending Payments",
    totalRevenue: "Total Revenue",
    overdue: "Overdue",
    readyToShip: "Ready to Ship",
    inTransit: "In Transit",
    delivered: "Delivered",
    qualityIssues: "Quality Issues",
    inProduction: "In Production",
    
    // Category Status
    liveBadge: "Live",
    comingBadge: "Coming",
    moduleCount: "modules",
    
    // Common UI
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
    
    // Customer Management
    customerProfile: "Customer Profile",
    createNewQuote: "Create New Quote",
    customerSince: "Customer Since",
    totalBusiness: "Total Business",
    totalOrders: "Total Orders",
    conversionRate: "Conversion Rate",
    paymentScore: "Payment Score",
    businessInsights: "Business Insights",
    searchCustomers: "Search customers by name, location, or specialization...",
    showAll: "Show All",
    voiceCommandsHint: "Try saying:",
    quoteHistory: "Quote History",
    orderHistory: "Order History",
    transactionHistory: "Transaction History",
    
    // Action Buttons
    viewPDF: "View PDF",
    approve: "Approve", 
    convertToOrder: "Convert to Order",
    showExpired: "Show Expired",
    showApproved: "Show Approved",
    showHotLeads: "🔥 Hot Leads",
    showWarmLeads: "⭐ Warm Leads",
    showColdLeads: "❄️ Cold Leads",
    addNewLead: "+ Add New Lead",
    addNewQuote: "+ Add New Quote",
    showPending: "Show Pending"
  },
  
  gu: {
    // Authentication
    welcomeBack: "ફરી સ્વાગત છે",
    signInToContinue: "ચાલુ રાખવા માટે સાઇન ઇન કરો",
    email: "ઈમેલ",
    password: "પાસવર્ડ",
    emailPlaceholder: "તમારો ઈમેલ દાખલ કરો",
    passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
    signIn: "સાઇન ઇન",
    signingIn: "સાઇન ઇન કરી રહ્યા છીએ...",
    signUp: "સાઇન અપ",
    dontHaveAccount: "એકાઉન્ટ નથી?",
    alreadyHaveAccount: "પહેલેથી જ એકાઉન્ટ છે?",
    tryAsGuest: "ગેસ્ટ તરીકે પ્રયાસ કરો",
    
    // Dashboard
    title: "360° બિઝનેસ પ્લેટફોર્મ",
    company: "એલિવેટબિઝનેસ",
    founder: "ગુજરાત ટેક્સટાઇલ ઉત્પાદકો માટે પાર્થ સાર્થી દ્વારા બનાવેલ",
    welcome: "તમારા બિઝનેસ હબમાં આપનું સ્વાગત",
    tagline: "ગુજરાત ટેક્સટાઈલ ઉત્પાદકો માટે 360° બિઝનેસ પ્લેટફોર્મ",
    businessPlatform: "ટેક્સટાઈલ મેન્યુફેક્ચરિંગ બિઝનેસ માટે સંપૂર્ણ સોલ્યુશન",
    voiceCommands: "વૉઈસ કમાન્ડ્સ (ગુજરાતી, હિંદી, અથવા અંગ્રેજીમાં બોલો)",
    
    // Business Categories
    salesCustomerCategory: "સેલ્સ અને ગ્રાહક મેનેજમેન્ટ",
    financialCategory: "નાણાકીય મેનેજમેન્ટ",
    productionCategory: "ઉત્પાદન અને કામગીરી",
    fulfillmentCategory: "પૂર્ણતા અને ડિલિવરી",
    analyticsCategory: "બિઝનેસ ઇન્ટેલિજન્સ",
    
    // Module Names
    leadManagement: "લીડ મેનેજમેન્ટ",
    quotationOrders: "કોટેશન અને ઓર્ડર",
    salesOrder: "સેલ્સ ઓર્ડર",
    customers: "ગ્રાહકો",
    workOrders: "વર્ક ઓર્ડર",
    smartProcurement: "સ્માર્ટ પ્રોક્યુરમેન્ટ",
    inventory: "ઇન્વેન્ટરી (3-ટિયર)",
    productionTracking: "પ્રોડક્શન ટ્રેકિંગ",
    dispatchDelivery: "ડિસ્પેચ અને ડિલિવરી",
    invoiceFinance: "ઇન્વોઇસ અને ફાઇનાન્સ",
    customerFeedback: "ગ્રાહક ફીડબેક",
    analyticsDashboard: "એનાલિટિક્સ ડેશબોર્ડ",
    leads: "લીડ્સ",
    quotes: "કોટ્સ",
    loyalty: "વફાદારી",
    payments: "પેમેન્ટ્સ",
    reports: "રિપોર્ટ્સ",
    cashFlow: "કેશ ફ્લો",
    procurement: "પ્રોક્યુરમેન્ટ",
    production: "ઉત્પાદન",
    dispatch: "ડિસ્પેચ",
    voiceAI: "વૉઇસ એઆઇ",
    analytics: "એનાલિટિક્સ",
    
    // Metrics Labels
    newLeads: "નવા લીડ્સ",
    pendingQuotes: "બાકી કોટ્સ",
    activeCustomers: "સક્રિય ગ્રાહકો",
    pendingPayments: "બાકી પેમેન્ટ્સ",
    totalRevenue: "કુલ આવક",
    overdue: "મુદતવીતી",
    readyToShip: "મોકલવા તૈયાર",
    inTransit: "રસ્તામાં",
    delivered: "ડિલિવર થયું",
    qualityIssues: "ક્વૉલિટી સમસ્યા",
    inProduction: "ઉત્પાદનમાં",
    
    // Category Status
    liveBadge: "લાઇવ",
    comingBadge: "આવી રહ્યું છે",
    moduleCount: "મોડ્યુલ્સ",
    
    // Common UI
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
    
    // Customer Management
    customerProfile: "ગ્રાહક પ્રોફાઇલ",
    createNewQuote: "નવો કોટ બનાવો",
    customerSince: "ગ્રાહક બન્યા ત્યારથી",
    totalBusiness: "કુલ બિઝનેસ",
    totalOrders: "કુલ ઓર્ડર્સ",
    conversionRate: "કન્વર્ઝન રેટ",
    paymentScore: "પેમેન્ટ સ્કોર",
    businessInsights: "બિઝનેસ ઇન્સાઇટ્સ",
    searchCustomers: "નામ, સ્થળ અથવા વિશેષતા દ્વારા ગ્રાહકો શોધો...",
    showAll: "સબ બતાવો",
    voiceCommandsHint: "આ કહીને ટ્રાઇ કરો:",
    quoteHistory: "ક્વોટ હિસ્ટ્રી",
    orderHistory: "ઓર્ડર હિસ્ટ્રી",
    transactionHistory: "ટ્રાન્ઝેક્શન હિસ્ટ્રી",
    
    // Action Buttons
    viewPDF: "PDF જુઓ",
    approve: "મંજૂરી આપો",
    convertToOrder: "ઓર્ડરમાં કન્વર્ટ કરો",
    showExpired: "એક્સપાયર બતાવો",
    showApproved: "મંજૂર બતાવો",
    showHotLeads: "🔥 હોટ લીડ્સ",
    showWarmLeads: "⭐ વોર્મ લીડ્સ",
    showColdLeads: "❄️ કોલ્ડ લીડ્સ",
    addNewLead: "+ નવી લીડ ઉમેરો",
    addNewQuote: "+ નવો કોટ ઉમેરો",
    showPending: "પેન્ડિંગ બતાવો"
  },
  
  hi: {
    // Authentication
    welcomeBack: "फिर से स्वागत है",
    signInToContinue: "जारी रखने के लिए साइन इन करें",
    email: "ईमेल",
    password: "पासवर्ड",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    signIn: "साइन इन",
    signingIn: "साइन इन कर रहे हैं...",
    signUp: "साइन अप",
    dontHaveAccount: "खाता नहीं है?",
    alreadyHaveAccount: "पहले से खाता है?",
    tryAsGuest: "गेस्ट के रूप में आज़माएं",
    
    // Dashboard
    title: "360° बिजनेस प्लेटफॉर्म",
    company: "एलेवेटबिजनेस",
    founder: "गुजरात टेक्सटाइल निर्माताओं के लिए पार्थ सार्थी द्वारा निर्मित",
    welcome: "आपके बिजनेस हब में आपका स्वागत",
    tagline: "गुजरात टेक्सटाइल निर्माताओं के लिए 360° बिजनेस प्लेटफॉर्म",
    businessPlatform: "टेक्सटाइल मैन्युफैक्चरिंग बिजनेस के लिए संपूर्ण समाधान",
    voiceCommands: "वॉयस कमांड (गुजराती, हिंदी, या अंग्रेजी में बोलें)",
    
    // Business Categories
    salesCustomerCategory: "बिक्री और ग्राहक प्रबंधन",
    financialCategory: "वित्तीय प्रबंधन",
    productionCategory: "उत्पादन और परिचालन",
    fulfillmentCategory: "पूर्णता और डिलीवरी",
    analyticsCategory: "व्यावसायिक बुद्धिमत्ता",
    
    // Module Names
    leadManagement: "लीड प्रबंधन",
    quotationOrders: "कोटेशन और ऑर्डर",
    salesOrder: "सेल्स ऑर्डर",
    customers: "ग्राहक",
    workOrders: "वर्क ऑर्डर",
    smartProcurement: "स्मार्ट प्रोक्यूरमेंट",
    inventory: "इन्वेंटरी (3-टियर)",
    productionTracking: "प्रोडक्शन ट्रैकिंग",
    dispatchDelivery: "डिस्पैच और डिलीवरी",
    invoiceFinance: "इनवॉइस और फाइनेंस",
    customerFeedback: "कस्टमर फीडबैक",
    analyticsDashboard: "एनालिटिक्स डैशबोर्ड",
    leads: "लीड्स",
    quotes: "कोट्स",
    loyalty: "वफादारी",
    payments: "भुगतान",
    reports: "रिपोर्ट्स",
    cashFlow: "कैश फ्लो",
    procurement: "प्रोक्यूरमेंट",
    production: "उत्पादन",
    dispatch: "डिस्पैच",
    voiceAI: "वॉइस एआई",
    analytics: "एनालिटिक्स",
    
    // Metrics Labels
    newLeads: "नए लीड्स",
    pendingQuotes: "लंबित कोट्स",
    activeCustomers: "सक्रिय ग्राहक",
    pendingPayments: "लंबित भुगतान",
    totalRevenue: "कुल आय",
    overdue: "देय",
    readyToShip: "भेजने के लिए तैयार",
    inTransit: "ट्रांजिट में",
    delivered: "डिलीवर हुआ",
    qualityIssues: "गुणवत्ता समस्याएं",
    inProduction: "उत्पादन में",
    
    // Category Status
    liveBadge: "लाइव",
    comingBadge: "आ रहा है",
    moduleCount: "मॉड्यूल",
    
    // Common UI
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
    
    // Customer Management
    customerProfile: "ग्राहक प्रोफाइल",
    createNewQuote: "नया कोट बनाएं",
    customerSince: "ग्राहक बने तब से",
    totalBusiness: "कुल बिजनेस",
    totalOrders: "कुल ऑर्डर्स",
    conversionRate: "कन्वर्जन रेट",
    paymentScore: "पेमेंट स्कोर",
    businessInsights: "बिजनेस इनसाइट्स",
    searchCustomers: "नाम, स्थान या विशेषता के अनुसार ग्राहकों को खोजें...",
    showAll: "सभी दिखाएं",
    voiceCommandsHint: "कहने की कोशिश करें:",
    quoteHistory: "कोट हिस्ट्री",
    orderHistory: "ऑर्डर हिस्ट्री",
    transactionHistory: "ट्रांजेक्शन हिस्ट्री",
    
    // Action Buttons
    viewPDF: "PDF देखें",
    approve: "अप्रूव करें",
    convertToOrder: "ऑर्डर में कन्वर्ट करें",
    showExpired: "एक्सपायर दिखाएं",
    showApproved: "अप्रूव्ड दिखाएं",
    showHotLeads: "🔥 हॉट लीड्स",
    showWarmLeads: "⭐ वार्म लीड्स",
    showColdLeads: "❄️ कोल्ड लीड्स",
    addNewLead: "+ नया लीड जोड़ें",
    addNewQuote: "+ नया कोट जोड़ें",
    showPending: "पेंडिंग दिखाएं"
  }
};

// Helper function to get translations with fallback to English
export function getCurrentTranslations(language: string): TranslationStrings {
  const englishTranslations = baseTranslations.en as TranslationStrings;
  const targetTranslations = baseTranslations[language] || {};
  
  // Merge target language with English fallbacks
  const translations: TranslationStrings = { ...englishTranslations };
  
  // Override with target language translations where available
  Object.keys(targetTranslations).forEach(key => {
    const value = targetTranslations[key];
    if (value && typeof value === 'string') {
      translations[key] = value;
    }
  });
  
  return translations;
}

// Default export for backward compatibility
const translations: Record<string, TranslationStrings> = {
  en: getCurrentTranslations('en'),
  gu: getCurrentTranslations('gu'),
  hi: getCurrentTranslations('hi')
};

export default translations;