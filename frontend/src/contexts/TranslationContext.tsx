import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hasProblematicUnicode, debugUnicodeIssues } from '../utils/unicodeUtils';

// Translation data structure - no rigid interface
interface TranslationData {
  [language: string]: {
    [key: string]: string;
  };
}

// Context type
interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  getLanguageCoverage: () => { [language: string]: number };
}

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation data - flexible structure
const translations: TranslationData = {
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
    pleaseEnterBothFields: "Please enter both email and password",
    invalidCredentials: "Invalid credentials. Try demo@suratextiles.com / demo123",
    demoAccount: "Demo Account",
    demoInstructions: "Use demo@suratextiles.com with password demo123",
    fillDemoCredentials: "Fill Demo Credentials",
    textileManufacturers: "For textile manufacturers across India",
    
    // Dashboard
    title: "ElevateBusiness 360° Platform",
    company: "ElevateBusiness 360°",
    founder: "Built by Partha Sarthi for India's MSME Textile Manufacturers",
    welcome: "Welcome to Your Business Hub",
    tagline: "Complete 360° Business Platform for India's Textile Manufacturers",
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
    customers: "CRM - 360° Customer View",
    workOrders: "Work Orders",
    smartProcurement: "Smart Procurement",
    inventory: "Inventory (3-Tier)",
    productionTracking: "Production Tracking",
    dispatchDelivery: "Dispatch & Delivery",
    invoiceFinance: "Invoice & Finance",
    customerFeedback: "Customer Feedback",
    analyticsDashboard: "Analytics - 360° Business Insights",
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
    
    // Floating Voice Assistant
    voiceAssistant: "Voice Assistant",
    voiceListening: "Listening",
    voiceClick: "Click to speak",
    
    // Professional Business Card Titles
    salesManagement: "Sales Pipeline",
    quotationManagement: "Quotations & Orders", 
    productionManagement: "Production",
    financialManagement: "Financial Operations",
    inventoryManagement: "Inventory & Stock",
    fulfillmentManagement: "Dispatch & Delivery",
    customerManagement: "Customer Relations",
    analyticsReports: "Business Analytics",
    priorityAction: "Action",
    manage: "Manage",
    
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
    hotLead: "Hot Lead",
    warmLead: "Warm Lead",
    coldLead: "Cold Lead",
    addFabricInquiry: "Add fabric inquiry",
    callRajesh: "Call Rajesh",
    showCottonLeads: "Show cotton leads",
    addNewLead: "+ Add New Lead",
    addNewQuote: "+ Add New Quote",
    showPending: "Show Pending",
    readyForProduction: "Ready for Production",
    primaryContact: "Primary Contact",
    amount: "Amount",
    items: "Items",
    status: "Status",
    totalAmount: "Total Amount",
    completed: "Completed",
    customerName: "Customer Name",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    sendPaymentReminder: "Send payment reminder",
    validUntil: "Valid Until",
    paymentStatus: "Payment Status",
    productionStatus: "Production Status",
    expectedDelivery: "Expected Delivery",
    activeOrders: "active orders",
    reliablePayments: "Reliable payments",
    followUpRequired: "Follow-up required",
    viewPaymentStatus: "View Payment Status",
    
    // SignUp specific translations
    createAccount: "Create Account", 
    joinThousandsManufacturers: "Join thousands of textile manufacturers",
    businessInfo: "Business Information",
    accountSetup: "Account Setup",
    tellUsAboutBusiness: "Tell us about your business",
    ownerName: "Owner Name",
    ownerNamePlaceholder: "Enter owner's full name",
    companyName: "Company Name", 
    companyNamePlaceholder: "Enter your company name",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    businessType: "Business Type",
    textileManufacturing: "Textile Manufacturing",
    garmentManufacturing: "Garment Manufacturing", 
    textileTrading: "Textile Trading",
    location: "Location",
    locationPlaceholder: "Enter your location", 
    setupYourAccount: "Setup Your Account",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password", 
    pleaseFillAllFields: "Please fill all required fields",
    pleaseFillRequiredFields: "Please fill all required fields",
    passwordsDontMatch: "Passwords don't match",
    creatingAccount: "Creating Account...",
    continue: "Continue",
    back: "Back",
    trustedByManufacturers: "Trusted by textile manufacturers across Gujarat",
    
    // HomePage specific translations
    transformationTitle: "360° Business Visibility Drives Results",
    transformationSubtitle: "Complete visibility across your entire business cycle improves efficiency, saves costs, enhances customer satisfaction, and grows revenue",
    businessVisibility: "Complete Business",
    visibility: "Visibility", 
    drivesResults: "Drives Results",
    watchDemo: "Watch Demo",
    heroTitle: "Business Benefits",
    efficiencyBenefit: "Improved Efficiency",
    efficiencyDetail: "360° visibility eliminates manual tracking and duplicate work",
    costBenefit: "Reduced Costs", 
    costDetail: "Complete visibility prevents waste and optimizes resources",
    satisfactionBenefit: "Higher Customer Satisfaction",
    satisfactionDetail: "End-to-end visibility ensures on-time delivery and quality",
    revenueBenefit: "Increased Revenue",
    revenueDetail: "360° insights help identify opportunities and optimize pricing",
    impactTitle: "Real Business Impact",
    hoursDaily: "Hours Saved Daily",
    hoursDesc: "Automate manual tasks",
    voiceAccuracy: "Voice Accuracy", 
    accuracyDesc: "In Gujarati & Hindi",
    efficiency: "Efficiency Gain",
    efficiencyDesc: "Faster order processing",
    satisfaction: "User Satisfaction",
    satisfactionDesc: "Love the simplicity",
    benefitsTitle: "Built for Indian MSME Textile Manufacturers",
    voiceBenefitTitle: "Voice Commands in Your Language",
    voiceBenefitDesc: "Speak naturally in Gujarati, Hindi, or English - no typing needed on the factory floor",
    multilingualBenefitTitle: "True Multilingual Support", 
    multilingualBenefitDesc: "Complete interface in your preferred language with authentic regional support",
    mobileBenefitTitle: "Mobile-First Design",
    mobileBenefitDesc: "Optimized for smartphones - manage your entire business from anywhere",
    speedBenefitTitle: "Lightning Fast Operations",
    speedBenefitDesc: "Designed for quick operations with minimal clicks and maximum efficiency",
    ctaTitle: "Ready for 360° View of Your Business?",
    ctaSubtitle: "Join MSME textile manufacturers who improved efficiency, saved costs, and grew revenue with complete business visibility", 
    ctaNote: "Rich demo data included • No sign-up required • Full Gujarat textile business showcase",
    footerTagline: "360° Business Platform for MSME Textile Manufacturers",
    contactTitle: "Contact",
    linkedinTitle: "Connect", 
    allRights: "All rights reserved."
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
    pleaseEnterBothFields: "કૃપા કરીને ઈમેલ અને પાસવર્ડ બંને દાખલ કરો",
    invalidCredentials: "ખોટી વિગતો. demo@suratextiles.com / demo123 અજમાવો",
    demoAccount: "ડેમો એકાઉન્ટ",
    demoInstructions: "demo@suratextiles.com સાથે પાસવર્ડ demo123 વાપરો",
    fillDemoCredentials: "ડેમો વિગતો ભરો",
    textileManufacturers: "સમગ્ર ભારતમાં ટેક્સટાઇલ ઉત્પાદકો માટે",
    
    // Dashboard
    title: "ElevateBusiness 360° પ્લેટફોર્મ",
    company: "ElevateBusiness 360°",
    founder: "ભારતના MSME ટેક્સટાઇલ ઉત્પાદકો માટે પાર્થ સાર્થી દ્વારા બનાવેલ",
    welcome: "તમારા બિઝનેસ હબમાં આપનું સ્વાગત",
    tagline: "ભારતના ટેક્સટાઈલ ઉત્પાદકો માટે સંપૂર્ણ 360° બિઝનેસ પ્લેટફોર્મ",
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
    customers: "CRM - 360° ગ્રાહક દૃશ્ય",
    workOrders: "વર્ક ઓર્ડર",
    smartProcurement: "સ્માર્ટ પ્રોક્યુરમેન્ટ",
    inventory: "ઇન્વેન્ટરી (3-ટિયર)",
    productionTracking: "પ્રોડક્શન ટ્રેકિંગ",
    dispatchDelivery: "ડિસ્પેચ અને ડિલિવરી",
    invoiceFinance: "ઇન્વોઇસ અને ફાઇનાન્સ",
    customerFeedback: "ગ્રાહક ફીડબેક",
    analyticsDashboard: "Analytics - 360° બિઝનેસ ઇન્સાઇટ્સ",
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
    
    // Floating Voice Assistant
    voiceAssistant: "વૉઇસ આસિસ્ટન્ટ",
    voiceListening: "સાંભળી રહ્યું છે",
    voiceClick: "બોલવા માટે ક્લિક કરો",
    
    // Professional Business Card Titles
    salesManagement: "સેલ્સ પાઇપલાઇન",
    quotationManagement: "કોટેશન અને ઓર્ડર", 
    productionManagement: "ઉત્પાદન",
    financialManagement: "નાણાકીય કામકાજ",
    inventoryManagement: "ઇન્વેન્ટરી અને સ્ટોક",
    fulfillmentManagement: "ડિસ્પેચ અને ડિલિવરી",
    customerManagement: "ગ્રાહક સંબંધો",
    analyticsReports: "બિઝનેસ એનાલિટિક્સ",
    priorityAction: "ક્રિયા",
    manage: "મેનેજ કરો",
    
    // Common UI
    backToDashboard: "← ડેશબોર્ડ પર પાછા જાઓ",
    call: "📞 કૉલ",
    whatsapp: "📱 વોટ્સએપ",
    contact: "સંપર્ક",
    material: "સામગ્રી",
    showAll: "સબ બતાવો",
    voiceCommandsHint: "વાત કરનાર કહો:",
    showHotLeads: "🔥 હોટ લીડ્સ",
    showWarmLeads: "⭐ વોર્મ લીડ્સ",
    showColdLeads: "❄️ કોલ્ડ લીડ્સ",
    hotLead: "હોટ લીડ",
    warmLead: "વોર્મ લીડ",
    coldLead: "કોલ્ડ લીડ",
    addFabricInquiry: "ફેબ્રિક પૂછપરછ ઉમેરો",
    callRajesh: "રાજેશને ફોન કરો",
    showCottonLeads: "કપાસ લીડ્સ બતાવો",
    addNewLead: "+ નવી લીડ ઉમેરો",
    addNewQuote: "+ નવો કોટ ઉમેરો",
    completed: "પૂર્ણ થયેલ",
    customerName: "ગ્રાહકનું નામ",
    orderDate: "ઓર્ડરની તારીખ",
    orderStatus: "ઓર્ડર સ્થિતિ",
    sendPaymentReminder: "પેમેન્ટ રિમાઇન્ડર મોકલો",
    
    // SignUp specific translations 
    createAccount: "ખાતું બનાવો",
    joinThousandsManufacturers: "હજારો ટેક્સટાઇલ ઉત્પાદકો સાથે જોડાઓ",
    businessInfo: "બિઝનેસ માહિતી",
    accountSetup: "ખાતા સેટઅપ",
    tellUsAboutBusiness: "તમારા બિઝનેસ વિશે કહો",
    ownerName: "માલિકનું નામ",
    ownerNamePlaceholder: "માલિકનું સંપૂર્ણ નામ દાખલ કરો",
    companyName: "કંપનીનું નામ",
    companyNamePlaceholder: "તમારી કંપનીનું નામ દાખલ કરો", 
    phoneNumber: "ફોન નંબર",
    phonePlaceholder: "તમારો ફોન નંબર દાખલ કરો",
    businessType: "બિઝનેસ પ્રકાર",
    textileManufacturing: "ટેક્સટાઇલ મેન્યુફેક્ચરિંગ",
    garmentManufacturing: "ગાર્મેન્ટ મેન્યુફેક્ચરિંગ",
    textileTrading: "ટેક્સટાઇલ ટ્રેડિંગ",
    location: "સ્થાન",
    locationPlaceholder: "તમારું સ્થાન દાખલ કરો",
    setupYourAccount: "તમારું ખાતું સેટ કરો",
    confirmPassword: "પાસવર્ડ પુષ્ટિ કરો",
    confirmPasswordPlaceholder: "પાસવર્ડ ફરીથી દાખલ કરો",
    pleaseFillAllFields: "કૃપા કરીને બધા જરૂરી ક્ષેત્રો ભરો",
    pleaseFillRequiredFields: "કૃપા કરીને જરૂરી ક્ષેત્રો ભરો", 
    passwordsDontMatch: "પાસવર્ડ મેળ ખાતા નથી",
    creatingAccount: "ખાતું બનાવી રહ્યા છીએ...",
    continue: "આગળ વધો",
    back: "પાછળ",
    trustedByManufacturers: "ગુજરાતમાં ટેક્સટાઇલ ઉત્પાદકો દ્વારા વિશ્વસનીય",
    
    // HomePage specific translations
    transformationTitle: "360° બિઝનેસ દૃશ્યતા પરિણામો લાવે છે",
    transformationSubtitle: "તમારા સમગ્ર બિઝનેસ ચક્રમાં સંપૂર્ણ દૃશ્યતા કાર્યક્ષમતા સુધારે છે, ખર્ચ બચાવે છે, ગ્રાહક સંતુષ્ટિ વધારે છે અને આવક વધારે છે",
    businessVisibility: "સંપૂર્ણ બિઝનેસ",
    visibility: "દૃશ્યતા",
    drivesResults: "પરિણામો લાવે છે", 
    watchDemo: "ડેમો જુઓ",
    heroTitle: "બિઝનેસ લાભો",
    efficiencyBenefit: "સુધારેલી કાર્યક્ષમતા",
    efficiencyDetail: "360° દૃશ્યતા મેન્યુઅલ ટ્રેકિંગ અને ડુપ્લિકેટ કામ દૂર કરે છે",
    costBenefit: "ઘટાડેલા ખર્ચ",
    costDetail: "સંપૂર્ણ દૃશ્યતા બગાડ અટકાવે છે અને સંસાધનોને ઑપ્ટિમાઇઝ કરે છે",
    satisfactionBenefit: "વધારે ગ્રાહક સંતુષ્ટિ",
    satisfactionDetail: "એન્ડ-ટુ-એન્ડ દૃશ્યતા સમયસર ડિલિવરી અને ગુણવત્તા સુનિશ્ચિત કરે છે",
    revenueBenefit: "વધારેલી આવક",
    revenueDetail: "360° આંતરદૃષ્ટિ તકો ઓળખવામાં અને કિંમત ઑપ્ટિમાઇઝ કરવામાં મદદ કરે છે",
    impactTitle: "વાસ્તવિક બિઝનેસ પ્રભાવ",
    hoursDaily: "દૈનિક બચત કલાકો", 
    hoursDesc: "મેન્યુઅલ કાર્યોનું ઓટોમેશન",
    voiceAccuracy: "વૉઇસ સચોટતા",
    accuracyDesc: "ગુજરાતી અને હિંદીમાં",
    efficiency: "કાર્યક્ષમતા વૃદ્ધિ",
    efficiencyDesc: "ઝડપી ઓર્ડર પ્રક્રિયા",
    satisfaction: "વપરાશકર્તા સંતુષ્ટિ",
    satisfactionDesc: "સરળતાને પ્રેમ કરો",
    benefitsTitle: "ભારતના MSME ટેક્સટાઇલ ઉત્પાદકો માટે બનાવેલ",
    voiceBenefitTitle: "તમારી ભાષામાં વૉઇસ કમાન્ડ્સ",
    voiceBenefitDesc: "ગુજરાતી, હિંદી અથવા અંગ્રેજીમાં કુદરતી રીતે બોલો - ફેક્ટરી ફ્લોર પર ટાઇપિંગની જરૂર નથી",
    multilingualBenefitTitle: "સાચો બહુભાષી આધાર",
    multilingualBenefitDesc: "પ્રામાણિક પ્રાદેશિક આધાર સાથે તમારી પસંદીદા ભાષામાં સંપૂર્ણ ઇન્ટરફેસ",
    mobileBenefitTitle: "મોબાઇલ-ફર્સ્ટ ડિઝાઇન", 
    mobileBenefitDesc: "સ્માર્ટફોન માટે ઑપ્ટિમાઇઝ્ડ - ગમે ત્યાંથી તમારા સમગ્ર બિઝનેસનું સંચાલન કરો",
    speedBenefitTitle: "વીજળી ઝડપી કામગીરી",
    speedBenefitDesc: "ન્યૂનતમ ક્લિક અને મહત્તમ કાર્યક્ષમતા સાથે ઝડપી કામગીરી માટે ડિઝાઇન કરેલ",
    ctaTitle: "તમારા બિઝનેસના 360° દૃશ્ય માટે તૈયાર છો?",
    ctaSubtitle: "MSME ટેક્સટાઇલ ઉત્પાદકો સાથે જોડાઓ જેમણે સંપૂર્ણ બિઝનેસ દૃશ્યતા સાથે કાર્યક્ષમતા સુધારી, ખર્ચ બચાવ્યો અને આવક વધારી",
    ctaNote: "સમૃદ્ધ ડેમો ડેટા સામેલ • સાઇન-અપની જરૂર નથી • સંપૂર્ણ ગુજરાત ટેક્સટાઇલ બિઝનેસ શોકેસ",
    footerTagline: "MSME ટેક્સટાઇલ ઉત્પાદકો માટે 360° બિઝનેસ પ્લેટફોર્મ",
    contactTitle: "સંપર્ક", 
    linkedinTitle: "કનેક્ટ",
    allRights: "બધા અધિકારો આરક્ષિત."
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
    pleaseEnterBothFields: "कृपया ईमेल और पासवर्ड दोनों दर्ज करें",
    invalidCredentials: "गलत विवरण। demo@suratextiles.com / demo123 आज़माएं",
    demoAccount: "डेमो खाता",
    demoInstructions: "demo@suratextiles.com के साथ पासवर्ड demo123 का उपयोग करें",
    fillDemoCredentials: "डेमो विवरण भरें",
    textileManufacturers: "पूरे भारत में टेक्सटाइल निर्माताओं के लिए",
    
    // Dashboard
    title: "ElevateBusiness 360° प्लेटफॉर्म",
    company: "ElevateBusiness 360°",
    founder: "भारत के MSME टेक्सटाइल निर्माताओं के लिए पार्थ सार्थी द्वारा निर्मित",
    welcome: "आपके बिजनेस हब में आपका स्वागत",
    tagline: "भारत के टेक्सटाइल निर्माताओं के लिए संपूर्ण 360° बिजनेस प्लेटफॉर्म",
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
    customers: "CRM - 360° ग्राहक दृश्य",
    workOrders: "वर्क ऑर्डर",
    smartProcurement: "स्मार्ट प्रोक्यूरमेंट",
    inventory: "इन्वेंटरी (3-टियर)",
    productionTracking: "प्रोडक्शन ट्रैकिंग",
    dispatchDelivery: "डिस्पैच और डिलीवरी",
    invoiceFinance: "इनवॉइस और फाइनेंस",
    customerFeedback: "कस्टमर फीडबैक",
    analyticsDashboard: "Analytics - 360° बिजनेस इनसाइट्स",
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
    
    // Floating Voice Assistant
    voiceAssistant: "वॉइस असिस्टेंट",
    voiceListening: "सुन रहा है",
    voiceClick: "बोलने के लिए क्लिक करें",
    
    // Professional Business Card Titles
    salesManagement: "सेल्स पाइपलाइन",
    quotationManagement: "कोटेशन और ऑर्डर", 
    productionManagement: "उत्पादन",
    financialManagement: "वित्तीय कार्य",
    inventoryManagement: "इन्वेंटरी और स्टॉक",
    fulfillmentManagement: "डिस्पैच और डिलीवरी",
    customerManagement: "ग्राहक संबंध",
    analyticsReports: "बिजनेस एनालिटिक्स",
    priorityAction: "कार्य",
    manage: "प्रबंधन करें",
    
    // Common UI
    backToDashboard: "← डैशबोर्ड पर वापस जाएं",
    call: "📞 कॉल",
    whatsapp: "📱 व्हाट्सऐप",
    contact: "संपर्क",
    material: "सामग्री",
    showAll: "सभी दिखाएं",
    voiceCommandsHint: "कहते हुए कोशिश करें:",
    showHotLeads: "🔥 हॉट लीड्स",
    showWarmLeads: "⭐ वार्म लीड्स",
    showColdLeads: "❄️ कोल्ड लीड्स",
    hotLead: "हॉट लीड",
    warmLead: "वार्म लीड",
    coldLead: "कोल्ड लीड",
    addFabricInquiry: "फैब्रिक पूछताछ जोड़ें",
    callRajesh: "राजेश को कॉल करें",
    showCottonLeads: "कॉटन लीड्स दिखाएं",
    addNewLead: "+ नया लीड जोड़ें",
    addNewQuote: "+ नया कोट जोड़ें",
    completed: "पूर्ण",
    customerName: "ग्राहक का नाम",
    orderDate: "ऑर्डर तारीख",
    orderStatus: "ऑर्डर स्थिति",
    sendPaymentReminder: "भुगतान रिमाइंडर भेजें",
    
    // SignUp specific translations
    createAccount: "खाता बनाएं",
    joinThousandsManufacturers: "हजारों टेक्सटाइल निर्माताओं के साथ जुड़ें", 
    businessInfo: "व्यावसायिक जानकारी",
    accountSetup: "खाता सेटअप",
    tellUsAboutBusiness: "अपने व्यवसाय के बारे में बताएं",
    ownerName: "मालिक का नाम",
    ownerNamePlaceholder: "मालिक का पूरा नाम दर्ज करें",
    companyName: "कंपनी का नाम",
    companyNamePlaceholder: "अपनी कंपनी का नाम दर्ज करें",
    phoneNumber: "फोन नंबर", 
    phonePlaceholder: "अपना फोन नंबर दर्ज करें",
    businessType: "व्यवसाय प्रकार",
    textileManufacturing: "टेक्सटाइल मैन्युफैक्चरिंग",
    garmentManufacturing: "गारमेंट मैन्युफैक्चरिंग",
    textileTrading: "टेक्सटाइल ट्रेडिंग",
    location: "स्थान",
    locationPlaceholder: "अपना स्थान दर्ज करें",
    setupYourAccount: "अपना खाता सेट करें",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड फिर से दर्ज करें",
    pleaseFillAllFields: "कृपया सभी आवश्यक फील्ड भरें",
    pleaseFillRequiredFields: "कृपया आवश्यक फील्ड भरें",
    passwordsDontMatch: "पासवर्ड मेल नहीं खा रहे",
    creatingAccount: "खाता बना रहे हैं...",
    continue: "जारी रखें", 
    back: "वापस",
    trustedByManufacturers: "गुजरात में टेक्सटाइल निर्माताओं द्वारा विश्वसनीय",
    
    // HomePage specific translations
    transformationTitle: "360° बिजनेस दृश्यता परिणाम लाती है",
    transformationSubtitle: "आपके संपूर्ण बिजनेस चक्र में पूर्ण दृश्यता दक्षता में सुधार करती है, लागत बचाती है, ग्राहक संतुष्टि बढ़ाती है और आय बढ़ाती है",
    businessVisibility: "संपूर्ण बिजनेस",
    visibility: "दृश्यता",
    drivesResults: "परिणाम लाती है",
    watchDemo: "डेमो देखें",
    heroTitle: "बिजनेस लाभ",
    efficiencyBenefit: "बेहतर दक्षता",
    efficiencyDetail: "360° दृश्यता मैनुअल ट्रैकिंग और डुप्लिकेट काम को खत्म करती है",
    costBenefit: "कम लागत",
    costDetail: "पूर्ण दृश्यता बर्बादी को रोकती है और संसाधनों को अनुकूलित करती है",
    satisfactionBenefit: "अधिक ग्राहक संतुष्टि",
    satisfactionDetail: "एंड-टू-एंड दृश्यता समय पर डिलीवरी और गुणवत्ता सुनिश्चित करती है",
    revenueBenefit: "बढ़ी आय",
    revenueDetail: "360° अंतर्दृष्टि अवसरों की पहचान करने और मूल्य निर्धारण को अनुकूलित करने में मदद करती है",
    impactTitle: "वास्तविक बिजनेस प्रभाव",
    hoursDaily: "दैनिक बचे घंटे",
    hoursDesc: "मैनुअल कार्यों का स्वचालन",
    voiceAccuracy: "आवाज सटीकता",
    accuracyDesc: "गुजराती और हिंदी में",
    efficiency: "दक्षता वृद्धि",
    efficiencyDesc: "तेज़ ऑर्डर प्रक्रिया",
    satisfaction: "उपयोगकर्ता संतुष्टि",
    satisfactionDesc: "सरलता से प्रेम",
    benefitsTitle: "भारत के MSME टेक्सटाइल निर्माताओं के लिए बना",
    voiceBenefitTitle: "आपकी भाषा में आवाज कमांड",
    voiceBenefitDesc: "गुजराती, हिंदी या अंग्रेजी में प्राकृतिक रूप से बोलें - फैक्ट्री फ्लोर पर टाइपिंग की जरूरत नहीं",
    multilingualBenefitTitle: "सच्चा बहुभाषी समर्थन", 
    multilingualBenefitDesc: "प्रामाणिक क्षेत्रीय समर्थन के साथ आपकी पसंदीदा भाषा में पूरा इंटरफेस",
    mobileBenefitTitle: "मोबाइल-फर्स्ट डिज़ाइन",
    mobileBenefitDesc: "स्मार्टफोन के लिए अनुकूलित - कहीं से भी अपने पूरे बिजनेस का प्रबंधन करें",
    speedBenefitTitle: "बिजली की तेज़ गति",
    speedBenefitDesc: "न्यूनतम क्लिक और अधिकतम दक्षता के साथ तेज़ संचालन के लिए डिज़ाइन किया गया",
    ctaTitle: "अपने बिजनेस के 360° दृश्य के लिए तैयार हैं?",
    ctaSubtitle: "MSME टेक्सटाइल निर्माताओं के साथ जुड़ें जिन्होंने संपूर्ण बिजनेस दृश्यता के साथ दक्षता में सुधार किया, लागत बचाई और आय बढ़ाई",
    ctaNote: "समृद्ध डेमो डेटा शामिल • साइन-अप की आवश्यकता नहीं • पूर्ण गुजरात टेक्सटाइल बिजनेस शोकेस",
    footerTagline: "MSME टेक्सटाइल निर्माताओं के लिए 360° बिजनेस प्लेटफॉर्म",
    contactTitle: "संपर्क",
    linkedinTitle: "कनेक्ट",
    allRights: "सभी अधिकार सुरक्षित।"
  }
};

// Translation Provider Component
interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

export function TranslationProvider({ children, defaultLanguage = 'en' }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);

  // Validate translation data for Unicode issues on initialization
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      debugUnicodeIssues(translations, 'translations');
    }
  }, []);

  // Translation function with automatic fallback and Unicode safety
  const t = (key: string): string => {
    // Try current language first
    const currentLangTranslation = translations[currentLanguage]?.[key];
    if (currentLangTranslation) {
      // Check for Unicode issues in development
      if (process.env.NODE_ENV === 'development' && hasProblematicUnicode(currentLangTranslation)) {
        // Unicode issue detected in translation
      }
      return currentLangTranslation;
    }

    // Fall back to English
    const englishTranslation = translations.en?.[key];
    if (englishTranslation) {
      // Log missing translation in development
      if (process.env.NODE_ENV === 'development' && currentLanguage !== 'en') {
        // Translation missing, using English fallback
      }
      return englishTranslation;
    }

    // Last resort: return the key itself
    if (process.env.NODE_ENV === 'development') {
      // Translation missing for key in all languages
    }
    return key;
  };

  // Language coverage analysis
  const getLanguageCoverage = (): { [language: string]: number } => {
    const englishKeys = Object.keys(translations.en || {});
    const coverage: { [language: string]: number } = {};

    Object.keys(translations).forEach(lang => {
      const langKeys = Object.keys(translations[lang] || {});
      coverage[lang] = englishKeys.length > 0 ? (langKeys.length / englishKeys.length) * 100 : 0;
    });

    return coverage;
  };

  // Set language function
  const setLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language);
    } else {
      // Language not supported
    }
  };

  const contextValue: TranslationContextType = {
    currentLanguage,
    setLanguage,
    t,
    getLanguageCoverage
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
}

// Development helper: log language coverage
export function logLanguageCoverage() {
  if (process.env.NODE_ENV === 'development') {
    // Language coverage calculation removed for production
    
    // Language coverage data available
  }
}