// Universal Language Configuration for Voice Commands
// Centralized multilingual support for India's diverse language landscape

/**
 * Language-agnostic voice command vocabulary
 * Supports mixed-language commands naturally
 * Easy to add new languages - just extend the configuration
 */

// Action word mappings for all supported languages
export const VOICE_ACTIONS = {
  // Search/Find Actions
  SEARCH: {
    en: ['search', 'find', 'look', 'locate', 'seek'],
    hi: ['खोजें', 'ढूंढें', 'देखें', 'पता', 'करो', 'ढूंढो'],
    gu: ['શોધો', 'લોકેટ', 'જુઓ', 'કરો', 'મળવા'],
    // Easy to extend: ta: ['தேடு', 'கண்டுபிடி', 'பார்'], te: ['వెతుకు', 'కనుగొను']
  },

  // Show/Display Actions  
  SHOW: {
    en: ['show', 'display', 'view', 'see', 'list'],
    hi: ['दिखाओ', 'दिखाएं', 'देखें', 'लिस्ट', 'सूची'],
    gu: ['બતાવો', 'દર્શાવો', 'જુઓ', 'યાદી', 'બતાવ'],
  },

  // Open/Navigate Actions
  OPEN: {
    en: ['open', 'go', 'navigate', 'goto', 'access'],
    hi: ['खोलो', 'खोलें', 'जाओ', 'चलो', 'पहुंचो'],
    gu: ['ખોલો', 'જાઓ', 'નેવિગેટ', 'પહોંચો', 'ઍક્સેસ'],
  },

  // Create/Add Actions
  CREATE: {
    en: ['create', 'add', 'new', 'make', 'generate'],
    hi: ['बनाओ', 'जोड़ो', 'नया', 'क्रिएट', 'बनाएं'],
    gu: ['બનાવો', 'ઉમેરો', 'નવું', 'ક્રિએટ', 'બનાવ'],
  },

  // Check/Verify Actions
  CHECK: {
    en: ['check', 'verify', 'validate', 'confirm', 'status'],
    hi: ['चेक', 'जांच', 'स्टेटस', 'पुष्टि', 'वेरिफाई'],
    gu: ['ચેક', 'તપાસ', 'સ્ટેટસ', 'પુષ્ટિ', 'વેરિફાય'],
  }
};

// Business entity targets
export const BUSINESS_TARGETS = {
  LEADS: {
    en: ['lead', 'leads', 'prospect', 'prospects', 'customer', 'client'],
    hi: ['लीड', 'लीड्स', 'ग्राहक', 'क्लाइंट', 'संभावना'],
    gu: ['લીડ', 'લીડ્સ', 'ગ્રાહક', 'ક્લાઇન્ટ', 'સંભાવના'],
  },

  PAYMENTS: {
    en: ['payment', 'payments', 'money', 'due', 'outstanding', 'paid'],
    hi: ['पेमेंट', 'पेमेंट्स', 'पैसा', 'बकाया', 'भुगतान'],
    gu: ['પેમેન્ટ', 'પેમેન્ટ્સ', 'પૈસા', 'બાકી', 'ભુગતાન'],
  },

  CUSTOMERS: {
    en: ['customer', 'customers', 'client', 'clients', 'buyer'],
    hi: ['कस्टमर', 'ग्राहक', 'खरीदार', 'क्लाइंट'],
    gu: ['કસ્ટમર', 'ગ્રાહક', 'ખરીદદાર', 'ક્લાઇન્ટ'],
  },

  ORDERS: {
    en: ['order', 'orders', 'sales', 'booking', 'purchase'],
    hi: ['ऑर्डर', 'ऑर्डर्स', 'सेल्स', 'बुकिंग', 'खरीद'],
    gu: ['ઓર્ડર', 'ઓર્ડર્સ', 'સેલ્સ', 'બુકિંગ', 'ખરીદ'],
  },

  INVENTORY: {
    en: ['inventory', 'stock', 'material', 'fabric', 'goods'],
    hi: ['इन्वेंटरी', 'स्टॉक', 'मटेरियल', 'कपड़ा', 'सामान'],
    gu: ['ઇન્વેન્ટરી', 'સ્ટોક', 'મટેરિયલ', 'કાપડ', 'સામાન'],
  },

  ANALYTICS: {
    en: ['analytics', 'report', 'reports', 'performance', 'data', 'insights'],
    hi: ['एनालिटिक्स', 'रिपोर्ट', 'परफॉर्मेंस', 'डेटा', 'जानकारी'],
    gu: ['એનાલિટિક્સ', 'રિપોર્ટ', 'પર્ફોર્મન્સ', 'ડેટા', 'માહિતી'],
  }
};

// Contextual words and connectors (removed during extraction)
export const CONTEXTUAL_MARKERS = {
  POSSESSIVE: {
    en: ['of', 'from', 'in', 'at', 'with'],
    hi: ['का', 'की', 'के', 'में', 'से', 'वाला', 'वाले', 'वाली'],
    gu: ['ના', 'નું', 'ની', 'માં', 'થી', 'વાળા', 'વાળું', 'વાળી'],
  },

  CONNECTORS: {
    en: ['for', 'to', 'and', 'or', 'with', 'about'],
    hi: ['के लिए', 'को', 'और', 'या', 'के साथ', 'के बारे में'],
    gu: ['માટે', 'ને', 'અને', 'અથવા', 'સાથે', 'વિશે'],
  }
};

// Priority/filter words
export const FILTER_WORDS = {
  PRIORITY: {
    en: ['hot', 'warm', 'cold', 'urgent', 'high', 'low', 'priority'],
    hi: ['हॉट', 'गर्म', 'ठंड', 'जरूरी', 'उच्च', 'कम', 'प्राथमिकता'],
    gu: ['હૉટ', 'ગરમ', 'ઠંડ', 'જરૂરી', 'ઉચ્ચ', 'ઓછું', 'પ્રાથમિકતા'],
  },

  STATUS: {
    en: ['pending', 'approved', 'rejected', 'completed', 'active'],
    hi: ['पेंडिंग', 'अप्रूवड', 'रिजेक्ट', 'पूरा', 'एक्टिव'],
    gu: ['પેન્ડિંગ', 'એપ્રુવ્ડ', 'રિજેક્ટ', 'પૂર્ણ', 'એક્ટિવ'],
  },

  LOCATION: {
    en: ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'surat', 'ahmedabad', 'vadodara', 'gujarat', 'maharashtra'],
    hi: ['मुंबई', 'दिल्ली', 'बेंगलुरु', 'चेन्नई', 'कोलकाता', 'सूरत', 'अहमदाबाद', 'वडोदरा', 'गुजरात', 'महाराष्ट्र'],
    gu: ['મુંબઈ', 'દિલ્લી', 'બેંગલુરુ', 'ચેન્નઈ', 'કોલકાતા', 'સુરત', 'અમદાવાદ', 'વડોદરા', 'ગુજરાત', 'મહારાષ્ટ્ર'],
  }
};

/**
 * Get all action words across all languages for a specific action type
 */
export function getAllActionWords(actionType: keyof typeof VOICE_ACTIONS): string[] {
  const actionConfig = VOICE_ACTIONS[actionType];
  return Object.values(actionConfig).flat();
}

/**
 * Get all target words across all languages for a specific target type
 */
export function getAllTargetWords(targetType: keyof typeof BUSINESS_TARGETS): string[] {
  const targetConfig = BUSINESS_TARGETS[targetType];
  return Object.values(targetConfig).flat();
}

/**
 * Get all contextual markers that should be removed during extraction
 */
export function getAllContextualMarkers(): string[] {
  const possessive = Object.values(CONTEXTUAL_MARKERS.POSSESSIVE).flat();
  const connectors = Object.values(CONTEXTUAL_MARKERS.CONNECTORS).flat();
  return [...possessive, ...connectors];
}

/**
 * Get all filter words for a specific filter type
 */
export function getAllFilterWords(filterType: keyof typeof FILTER_WORDS): string[] {
  const filterConfig = FILTER_WORDS[filterType];
  return Object.values(filterConfig).flat();
}

/**
 * Detect the primary language of a text input
 */
export function detectPrimaryLanguage(text: string): 'en' | 'hi' | 'gu' | 'mixed' {
  const hindiChars = /[\u0900-\u097F]/;
  const gujaratiChars = /[\u0A80-\u0AFF]/;
  const englishChars = /[a-zA-Z]/;
  
  const hasHindi = hindiChars.test(text);
  const hasGujarati = gujaratiChars.test(text);
  const hasEnglish = englishChars.test(text);

  // Count language occurrences
  const languageCount = [hasHindi, hasGujarati, hasEnglish].filter(Boolean).length;
  
  if (languageCount > 1) {
    return 'mixed';
  }
  
  if (hasHindi) return 'hi';
  if (hasGujarati) return 'gu';
  return 'en';
}

/**
 * Helper function to add new language support
 * Example: addLanguageSupport('ta', { SEARCH: ['தேடு', 'கண்டுபிடி'] })
 */
export function addLanguageSupport(
  languageCode: string, 
  vocabulary: Partial<{ [K in keyof typeof VOICE_ACTIONS]: string[] }>
): void {
  // Add new language to existing action types
  Object.entries(vocabulary).forEach(([actionType, words]) => {
    if (actionType in VOICE_ACTIONS) {
      (VOICE_ACTIONS[actionType as keyof typeof VOICE_ACTIONS] as any)[languageCode] = words;
    }
  });
  
  // Language support added successfully
}