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
    showApproved: "Show Approved",

    // HomePage Translations
    heroTitle: "Business Benefits",
    heroSubtitle: "Complete business visibility for Indian MSME textile manufacturers - from lead generation to customer loyalty",
    voiceControl: "Voice Control",
    threeLanguages: "3 Languages",
    mobileFirst: "Mobile First",
    getStarted: "Get Started",
    todayBusiness: "Today's Business",
    newLeads: "New Leads",
    todaySales: "Today's Sales",
    ordersReady: "Orders Ready",
    speakCommand: "Speak your command...",
    
    // Workflow Section
    workflowTitle: "Complete Business Workflow",
    workflowSubtitle: "From lead to payment - manage everything with voice commands",
    leadCapture: "Lead Capture",
    quotation: "Quotation",
    payment: "Payment",
    
    // Impact Statistics
    impactTitle: "Real Business Impact",
    hoursDaily: "Hours Saved Daily",
    hoursDesc: "Automate manual tasks",
    voiceAccuracy: "Voice Accuracy",
    accuracyDesc: "In Gujarati & Hindi",
    efficiency: "Efficiency Gain",
    efficiencyDesc: "Faster order processing",
    satisfaction: "User Satisfaction",
    satisfactionDesc: "Love the simplicity",
    
    // Benefits Section
    benefitsTitle: "Built for Indian MSME Textile Manufacturers",
    voiceBenefitTitle: "Voice-First Interface",
    voiceBenefitDesc: "Complete tasks with simple voice commands in your language",
    multilingualBenefitTitle: "True Multilingual",
    multilingualBenefitDesc: "Seamlessly switch between Gujarati, Hindi, and English",
    mobileBenefitTitle: "Mobile Optimized",
    mobileBenefitDesc: "Access from anywhere - factory floor, office, or on the go",
    speedBenefitTitle: "Lightning Fast",
    speedBenefitDesc: "Complete orders 70% faster than traditional methods",
    
    // Features Section
    featuresTitle: "Everything You Need to Run Your Business",
    salesCategory: "Sales & Orders",
    productionCategory: "Production",
    inventoryCategory: "Inventory",
    orderManagement: "Complete Order Management",
    intelligentWorkOrders: "Intelligent Work Orders",
    qualityControl: "Quality Control & Grading",
    efficiencyMetrics: "Efficiency Metrics",
    rawMaterials: "Raw Material Management",
    workInProgress: "Work-in-Progress Tracking",
    finishedGoods: "Finished Goods Inventory",
    procurement: "Smart Procurement with GRN",
    
    // Testimonials
    storiesTitle: "Trusted by Gujarat's Leading Manufacturers",
    testimonial1Name: "Rajesh Patel",
    testimonial1Business: "Surat Silk Mills",
    testimonial1Quote: "This platform revolutionized our operations. We save 3 hours daily and our order accuracy improved by 95%",
    testimonial2Name: "Mehul Shah",
    testimonial2Business: "Ahmedabad Textiles",
    testimonial2Quote: "Voice commands in Gujarati made it so easy for our team. Even our senior staff adopted it within days",
    
    // CTA Section
    ctaTitle: "Ready to Transform Your Textile Business?",
    ctaSubtitle: "Join leading manufacturers who are already saving 3+ hours daily",
    startFreeTrial: "Start Free Trial",
    watchDemo: "Watch Demo",
    ctaNote: "No credit card required • Free 30-day trial • Full support in Gujarati",
    
    // Footer
    footerTagline: "Scaling Business with Technology",
    contactTitle: "Contact",
    linkedinTitle: "Connect",
    supportTitle: "Support",
    servicesTitle: "Services",
    languagesTitle: "Languages",
    allRights: "All rights reserved."
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
    showApproved: "મંજૂર બતાવો",

    // HomePage Translations
    heroTitle: "બિઝનેસ બેનિફિટ્સ",
    heroSubtitle: "ગુજરાતના ટેક્સટાઈલ ઉત્પાદકો માટે બનાવેલ સંપૂર્ણ બિઝનેસ મેનેજમેન્ટ પ્લેટફોર્મ",
    voiceControl: "વૉઇસ કંટ્રોલ",
    threeLanguages: "3 ભાષાઓ",
    mobileFirst: "મોબાઈલ ફર્સ્ટ",
    getStarted: "શરૂઆત કરો",
    todayBusiness: "આજનો ધંધો",
    newLeads: "નવા લીડ્સ",
    todaySales: "આજની સેલ્સ",
    ordersReady: "ઓર્ડર્સ તૈયાર",
    speakCommand: "તમારો આદેશ બોલો...",
    
    // Workflow Section
    workflowTitle: "સંપૂર્ણ બિઝનેસ વર્કફ્લો",
    workflowSubtitle: "લીડથી પેમેન્ટ સુધી - બધું વૉઇસ કમાન્ડ્સથી મેનેજ કરો",
    leadCapture: "લીડ કેપ્ચર",
    quotation: "કોટેશન",
    payment: "પેમેન્ટ",
    
    // Impact Statistics
    impactTitle: "વાસ્તવિક બિઝનેસ ઇમ્પેક્ટ",
    hoursDaily: "દૈનિક કલાકો બચાવો",
    hoursDesc: "મેન્યુઅલ કામ ઓટોમેટ કરો",
    voiceAccuracy: "વૉઇસ એક્યુરસી",
    accuracyDesc: "ગુજરાતી અને હિન્દીમાં",
    efficiency: "કાર્યક્ષમતા વધારો",
    efficiencyDesc: "ઝડપી ઓર્ડર પ્રોસેસિંગ",
    satisfaction: "યુઝર સંતોષ",
    satisfactionDesc: "સરળતા પસંદ કરે છે",
    
    // Benefits Section
    benefitsTitle: "ભારતીય MSME ટેક્સટાઈલ ઉત્પાદકો માટે બનાવેલ",
    voiceBenefitTitle: "વૉઇસ-ફર્સ્ટ ઇન્ટરફેસ",
    voiceBenefitDesc: "તમારી ભાષામાં સરળ વૉઇસ કમાન્ડ્સથી કામ પૂર્ણ કરો",
    multilingualBenefitTitle: "સાચું બહુભાષી",
    multilingualBenefitDesc: "ગુજરાતી, હિન્દી અને અંગ્રેજી વચ્ચે સરળતાથી સ્વિચ કરો",
    mobileBenefitTitle: "મોબાઈલ ઓપ્ટિમાઇઝ્ડ",
    mobileBenefitDesc: "ક્યાંયથી ઍક્સેસ કરો - ફેક્ટરી ફ્લોર, ઓફિસ અથવા મુસાફરીમાં",
    speedBenefitTitle: "વીજળીની ઝડપે",
    speedBenefitDesc: "પરંપરાગત પદ્ધતિઓ કરતાં 70% ઝડપી ઓર્ડર પૂર્ણ કરો",
    
    // Features Section
    featuresTitle: "તમારો ધંધો ચલાવવા માટે જરૂરી બધું",
    salesCategory: "સેલ્સ અને ઓર્ડર્સ",
    productionCategory: "પ્રોડક્શન",
    inventoryCategory: "ઇન્વેન્ટરી",
    orderManagement: "સંપૂર્ણ ઓર્ડર મેનેજમેન્ટ",
    intelligentWorkOrders: "ઇન્ટેલિજન્ટ વર્ક ઓર્ડર્સ",
    qualityControl: "ક્વોલિટી કંટ્રોલ અને ગ્રેડિંગ",
    efficiencyMetrics: "કાર્યક્ષમતા મેટ્રિક્સ",
    rawMaterials: "કાચા માલ મેનેજમેન્ટ",
    workInProgress: "વર્ક-ઇન-પ્રોગ્રેસ ટ્રેકિંગ",
    finishedGoods: "તૈયાર માલ ઇન્વેન્ટરી",
    procurement: "GRN સાથે સ્માર્ટ પ્રોક્યુરમેન્ટ",
    
    // Testimonials
    storiesTitle: "ગુજરાતના અગ્રણી ઉત્પાદકો દ્વારા વિશ્વસનીય",
    testimonial1Name: "રાજેશ પટેલ",
    testimonial1Business: "સુરત સિલ્ક મિલ્સ",
    testimonial1Quote: "આ પ્લેટફોર્મે અમારી કામગીરીમાં ક્રાંતિ લાવી. અમે દરરોજ 3 કલાક બચાવીએ છીએ અને અમારી ઓર્ડર એક્યુરસી 95% સુધારી",
    testimonial2Name: "મેહુલ શાહ",
    testimonial2Business: "અમદાવાદ ટેક્સટાઈલ્સ",
    testimonial2Quote: "ગુજરાતીમાં વૉઇસ કમાન્ડ્સે અમારી ટીમ માટે તેને ખૂબ સરળ બનાવ્યું. અમારા વરિષ્ઠ સ્ટાફે પણ દિવસોમાં તેને અપનાવ્યું",
    
    // CTA Section
    ctaTitle: "તમારા ટેક્સટાઈલ બિઝનેસને ટ્રાન્સફોર્મ કરવા તૈયાર છો?",
    ctaSubtitle: "અગ્રણી ઉત્પાદકો સાથે જોડાઓ જે પહેલેથી જ દરરોજ 3+ કલાક બચાવી રહ્યા છે",
    startFreeTrial: "ફ્રી ટ્રાયલ શરૂ કરો",
    watchDemo: "ડેમો જુઓ",
    ctaNote: "કોઈ ક્રેડિટ કાર્ડની જરૂર નથી • 30-દિવસનું ફ્રી ટ્રાયલ • ગુજરાતીમાં સંપૂર્ણ સપોર્ટ",
    
    // Footer
    footerTagline: "ટેકનોલોજી સાથે બિઝનેસ સ્કેલિંગ",
    contactTitle: "સંપર્ક",
    linkedinTitle: "કનેક્ટ",
    supportTitle: "સપોર્ટ",
    servicesTitle: "સેવાઓ",
    languagesTitle: "ભાષાઓ",
    allRights: "બધા અધિકારો સુરક્ષિત."
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
    showApproved: "अप्रूव्ड दिखाएं",

    // HomePage Translations
    heroTitle: "बिजनेस बेनिफिट्स",
    heroSubtitle: "गुजरात के टेक्सटाइल निर्माताओं के लिए बनाया गया पूर्ण बिजनेस मैनेजमेंट प्लेटफॉर्म",
    voiceControl: "वॉयस कंट्रोल",
    threeLanguages: "3 भाषाएं",
    mobileFirst: "मोबाइल फर्स्ट",
    getStarted: "शुरू करें",
    todayBusiness: "आज का धंधा",
    newLeads: "नए लीड्स",
    todaySales: "आज की सेल्स",
    ordersReady: "ऑर्डर तैयार",
    speakCommand: "अपनी आज्ञा बोलें...",
    
    // Workflow Section
    workflowTitle: "पूर्ण बिजनेस वर्कफ्लो",
    workflowSubtitle: "लीड से पेमेंट तक - सब कुछ वॉयस कमांड से मैनेज करें",
    leadCapture: "लीड कैप्चर",
    quotation: "कोटेशन",
    payment: "पेमेंट",
    
    // Impact Statistics
    impactTitle: "वास्तविक बिजनेस इंपैक्ट",
    hoursDaily: "दैनिक घंटे बचाएं",
    hoursDesc: "मैन्युअल कार्य ऑटोमेट करें",
    voiceAccuracy: "वॉयस एक्यूरेसी",
    accuracyDesc: "गुजराती और हिंदी में",
    efficiency: "दक्षता वृद्धि",
    efficiencyDesc: "तेज़ ऑर्डर प्रोसेसिंग",
    satisfaction: "उपयोगकर्ता संतुष्टि",
    satisfactionDesc: "सरलता पसंद करते हैं",
    
    // Benefits Section
    benefitsTitle: "भारतीय MSME टेक्सटाइल निर्माताओं के लिए बनाया गया",
    voiceBenefitTitle: "वॉयस-फर्स्ट इंटरफेस",
    voiceBenefitDesc: "अपनी भाषा में सरल वॉयस कमांड के साथ कार्य पूर्ण करें",
    multilingualBenefitTitle: "सच्चा बहुभाषी",
    multilingualBenefitDesc: "गुजराती, हिंदी और अंग्रेजी के बीच आसानी से स्विच करें",
    mobileBenefitTitle: "मोबाइल ऑप्टिमाइज़्ड",
    mobileBenefitDesc: "कहीं से भी एक्सेस करें - फैक्ट्री फ्लोर, ऑफिस या यात्रा में",
    speedBenefitTitle: "बिजली की गति",
    speedBenefitDesc: "पारंपरिक तरीकों से 70% तेज़ ऑर्डर पूर्ण करें",
    
    // Features Section
    featuresTitle: "आपका धंधा चलाने के लिए सब कुछ",
    salesCategory: "सेल्स और ऑर्डर्स",
    productionCategory: "प्रोडक्शन",
    inventoryCategory: "इन्वेंटरी",
    orderManagement: "पूर्ण ऑर्डर मैनेजमेंट",
    intelligentWorkOrders: "इंटेलिजेंट वर्क ऑर्डर्स",
    qualityControl: "क्वालिटी कंट्रोल और ग्रेडिंग",
    efficiencyMetrics: "दक्षता मेट्रिक्स",
    rawMaterials: "कच्चा माल मैनेजमेंट",
    workInProgress: "वर्क-इन-प्रोग्रेस ट्रैकिंग",
    finishedGoods: "तैयार माल इन्वेंटरी",
    procurement: "GRN के साथ स्मार्ट प्रोक्योरमेंट",
    
    // Testimonials
    storiesTitle: "गुजरात के अग्रणी निर्माताओं द्वारा विश्वसनीय",
    testimonial1Name: "राजेश पटेल",
    testimonial1Business: "सूरत सिल्क मिल्स",
    testimonial1Quote: "इस प्लेटफॉर्म ने हमारे संचालन में क्रांति ला दी। हम रोज 3 घंटे बचाते हैं और हमारी ऑर्डर एक्यूरेसी 95% बेहतर हुई",
    testimonial2Name: "मेहुल शाह",
    testimonial2Business: "अहमदाबाद टेक्सटाइल्स",
    testimonial2Quote: "गुजराती में वॉयस कमांड ने हमारी टीम के लिए इसे बहुत आसान बना दिया। हमारे वरिष्ठ कर्मचारियों ने भी दिनों में इसे अपनाया",
    
    // CTA Section
    ctaTitle: "अपने टेक्सटाइल बिजनेस को बदलने के लिए तैयार हैं?",
    ctaSubtitle: "अग्रणी निर्माताओं से जुड़ें जो पहले से ही रोज 3+ घंटे बचा रहे हैं",
    startFreeTrial: "फ्री ट्रायल शुरू करें",
    watchDemo: "डेमो देखें",
    ctaNote: "कोई क्रेडिट कार्ड नहीं चाहिए • 30-दिन का फ्री ट्रायल • गुजराती में पूर्ण सहायता",
    
    // Footer
    footerTagline: "प्रौद्योगिकी के साथ बिजनेस स्केलिंग",
    contactTitle: "संपर्क",
    linkedinTitle: "कनेक्ट",
    supportTitle: "सहायता",
    servicesTitle: "सेवाएं",
    languagesTitle: "भाषाएं",
    allRights: "सभी अधिकार सुरक्षित।"
  }
};

export function getCurrentTranslations(language: string): TranslationStrings {
  return translations[language] || translations.en;
}

export default translations;