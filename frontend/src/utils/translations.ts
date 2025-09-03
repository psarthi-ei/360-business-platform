export interface TranslationStrings {
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
  hotLead: string;
  warmLead: string;
  coldLead: string;
  sendQuote: string;
  
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
  
  // Customer Management
  searchCustomers: string;
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
    production: "Production",
    productionDesc: "Track manufacturing progress",
    inventory: "Inventory",
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
    hotLead: "Hot Lead",
    warmLead: "Warm Lead",
    coldLead: "Cold Lead",
    sendQuote: "📑 Send Quote",
    
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
    
    // Customer Management
    searchCustomers: "Search customers by name, location, or specialization..."
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
    production: "ઉત્પાદન",
    productionDesc: "મેન્યુફેક્ચરિંગ પ્રોગ્રેસ ટ્રેક કરો",
    inventory: "ઇન્વેન્ટરી",
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
    hotLead: "હોટ લીડ",
    warmLead: "વોર્મ લીડ",
    coldLead: "કોલ્ડ લીડ",
    sendQuote: "📑 કોટ મોકલો",
    
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
    
    // Customer Management
    searchCustomers: "નામ, સ્થળ અથવા વિશેષતા દ્વારા ગ્રાહકો શોધો..."
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
    production: "उत्पादन",
    productionDesc: "मैन्युफैक्चरिंग प्रोग्रेस ट्रैक करें",
    inventory: "इन्वेंटरी",
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
    hotLead: "हॉट लीड",
    warmLead: "वार्म लीड",
    coldLead: "कोल्ड लीड",
    sendQuote: "📑 कोट भेजें",
    
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
    
    // Customer Management
    searchCustomers: "नाम, स्थान या विशेषता के अनुसार ग्राहकों को खोजें..."
  }
};

export function getCurrentTranslations(language: string): TranslationStrings {
  return translations[language] || translations.en;
}

export default translations;