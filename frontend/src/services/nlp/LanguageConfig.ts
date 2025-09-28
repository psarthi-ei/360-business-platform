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
    hi: ['khojo', 'dhundo', 'dekho', 'pata', 'karo', 'dhundo'],
    gu: ['shodho', 'locate', 'juo', 'karo', 'malva'],
    // Easy to extend: ta: ['தேடு', 'கண்டுபிடி', 'பார்'], te: ['వెతుకు', 'కనుగొను']
  },

  // Show/Display Actions  
  SHOW: {
    en: ['show', 'display', 'view', 'see', 'list'],
    hi: ['dikhao', 'dikhaye', 'dekhe', 'list', 'suchi'],
    gu: ['batavo', 'darshavo', 'juo', 'yadi', 'batav'],
  },

  // Open/Navigate Actions
  OPEN: {
    en: ['open', 'go', 'navigate', 'goto', 'access'],
    hi: ['kholo', 'khole', 'jao', 'chalo', 'pahuncho'],
    gu: ['kholo', 'jao', 'navigate', 'pahoncho', 'access'],
  },

  // Create/Add Actions
  CREATE: {
    en: ['create', 'add', 'new', 'make', 'generate'],
    hi: ['banao', 'jodo', 'naya', 'create', 'banaye'],
    gu: ['banavo', 'umero', 'navu', 'create', 'banav'],
  },

  // Check/Verify Actions
  CHECK: {
    en: ['check', 'verify', 'validate', 'confirm', 'status'],
    hi: ['check', 'janch', 'status', 'pushti', 'verify'],
    gu: ['check', 'tapas', 'status', 'pushti', 'verify'],
  }
};

// Business entity targets
export const BUSINESS_TARGETS = {
  LEADS: {
    en: ['lead', 'leads', 'prospect', 'prospects', 'customer', 'client'],
    hi: ['lead', 'leads', 'grahak', 'client', 'sambhavna'],
    gu: ['lead', 'leads', 'grahak', 'client', 'sambhavna'],
  },

  PAYMENTS: {
    en: ['payment', 'payments', 'money', 'due', 'outstanding', 'paid'],
    hi: ['payment', 'payments', 'paisa', 'bakaya', 'bhugtan'],
    gu: ['payment', 'payments', 'paisa', 'baki', 'bhugtan'],
  },

  CUSTOMERS: {
    en: ['customer', 'customers', 'client', 'clients', 'buyer'],
    hi: ['customer', 'grahak', 'kharidar', 'client'],
    gu: ['customer', 'grahak', 'kharidar', 'client'],
  },

  ORDERS: {
    en: ['order', 'orders', 'sales', 'booking', 'purchase'],
    hi: ['order', 'orders', 'sales', 'booking', 'kharid'],
    gu: ['order', 'orders', 'sales', 'booking', 'kharid'],
  },

  INVENTORY: {
    en: ['inventory', 'stock', 'material', 'fabric', 'goods'],
    hi: ['inventory', 'stock', 'material', 'kapda', 'saman'],
    gu: ['inventory', 'stock', 'material', 'kapad', 'saman'],
  },

  ANALYTICS: {
    en: ['analytics', 'report', 'reports', 'performance', 'data', 'insights'],
    hi: ['analytics', 'report', 'performance', 'data', 'jankari'],
    gu: ['analytics', 'report', 'performance', 'data', 'mahiti'],
  },

  DASHBOARD: {
    en: ['dashboard', 'home', 'main', 'overview', 'summary'],
    hi: ['dashboard', 'home', 'mukhya', 'overview', 'saransh'],
    gu: ['dashboard', 'home', 'mukhya', 'overview', 'saransh'],
  }
};

// Contextual words and connectors (removed during extraction) - Extensive vocabulary
export const CONTEXTUAL_MARKERS = {
  POSSESSIVE: {
    en: ['of', 'from', 'in', 'at', 'with', 'by', 'on', 'under', 'over', 'through', 'across', 'behind', 'beside', 'below', 'above', 'around', 'between', 'among', 'within', 'without'],
    hi: ['ka', 'ki', 'ke', 'mein', 'se', 'vala', 'vale', 'vali', 'par', 'tak', 'sath', 'dwara', 'andar', 'bahar', 'upar', 'niche', 'aaspas', 'bich', 'taraf', 'jariye', 'madhyam', 'vajah', 'karan'],
    gu: ['na', 'nu', 'ni', 'ma', 'thi', 'vala', 'valu', 'vali', 'par', 'sudhi', 'sathe', 'dwara', 'andar', 'bahar', 'upar', 'niche', 'aaspas', 'vacche', 'taraf', 'marfate', 'madhyam', 'vajah', 'karan'],
  },

  CONNECTORS: {
    en: ['for', 'to', 'and', 'or', 'with', 'about', 'but', 'also', 'then', 'now', 'here', 'there', 'while', 'since', 'until', 'before', 'after', 'during', 'except', 'unless'],
    hi: ['ke liye', 'ko', 'aur', 'ya', 'ke sath', 'ke bare mein', 'lekin', 'bhi', 'phir', 'ab', 'yaha', 'vaha', 'jabki', 'jab se', 'tab tak', 'pahle', 'baad', 'dauran', 'sivay', 'jab tak'],
    gu: ['mate', 'ne', 'ane', 'athva', 'sathe', 'vishe', 'parantu', 'pan', 'pachhi', 'have', 'ahi', 'tya', 'jyare', 'tyarthi', 'tya sudhi', 'pahela', 'pachhi', 'daramiyan', 'sivay', 'jya sudhi']
  }
};

// Conversation fillers - Natural speech patterns to remove during processing
export const CONVERSATION_FILLERS = {
  ACTION_EMPHASIS: {
    en: ['please', 'can', 'you', 'will', 'would', 'could', 'should', 'just', 'now', 'then', 'okay', 'ok', 'well', 'right', 'sure', 'maybe', 'perhaps'],
    hi: ['karo', 'kar', 'kijiye', 'please', 'ab', 'to', 'phir', 'jara', 'thoda', 'jaldi', 'dhire', 'thik', 'accha', 'ha', 'shayad', 'sambhav', 'jarur'],
    gu: ['karo', 'kar', 'karje', 'please', 'have', 'to', 'pachhi', 'jara', 'thodu', 'jaldi', 'dhime', 'thik', 'saru', 'ha', 'kadach', 'shakya', 'jarur']
  },

  QUESTION_WORDS: {
    en: ['what', 'how', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had', 'where', 'when', 'why', 'which', 'who', 'whose', 'whom'],
    hi: ['kya', 'kaise', 'hai', 'hain', 'tha', 'the', 'kar', 'karte', 'kiya', 'kuch', 'kaha', 'kab', 'kyo', 'kaun', 'kiska', 'kise', 'jo', 'jis'],
    gu: ['shu', 'kevi', 'che', 'che', 'hata', 'hati', 'kar', 'karta', 'karyu', 'kai', 'kya', 'kyare', 'kem', 'kon', 'kona', 'kone', 'je', 'jena']
  },

  CONVERSATION_FLOW: {
    en: ['like', 'you know', 'i mean', 'actually', 'basically', 'really', 'very', 'quite', 'pretty', 'sort of', 'kind of', 'a bit', 'a little'],
    hi: ['jaise', 'pata', 'matlab', 'yani', 'vastav', 'sach', 'bahut', 'kafi', 'thoda', 'kuch', 'ek tarah', 'jara sa'],
    gu: ['jevu', 'khabar', 'matlab', 'etle', 'vastav', 'sach', 'khub', 'ghanu', 'thodu', 'kaik', 'ek prakar', 'jara']
  }
};

// Priority/filter words
export const FILTER_WORDS = {
  PRIORITY: {
    en: ['hot', 'warm', 'cold', 'urgent', 'high', 'low', 'priority'],
    hi: ['hot', 'garm', 'thand', 'jaruri', 'uchh', 'kam', 'prathmikta'],
    gu: ['hot', 'garam', 'thand', 'jaruri', 'uchh', 'ochu', 'prathmikta'],
  },

  STATUS: {
    en: ['pending', 'approved', 'rejected', 'completed', 'active'],
    hi: ['pending', 'approved', 'reject', 'pura', 'active'],
    gu: ['pending', 'approved', 'reject', 'purn', 'active'],
  },

  LOCATION: {
    en: ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'surat', 'ahmedabad', 'vadodara', 'gujarat', 'maharashtra'],
    hi: ['mumbai', 'delhi', 'bengaluru', 'chennai', 'kolkata', 'surat', 'ahmedabad', 'vadodara', 'gujarat', 'maharashtra'],
    gu: ['mumbai', 'delhi', 'bengaluru', 'chennai', 'kolkata', 'surat', 'ahmedabad', 'vadodara', 'gujarat', 'maharashtra'],
  }
};

/**
 * Get all action words across all languages for a specific action type
 */
export function getAllActionWords(actionType: keyof typeof VOICE_ACTIONS): string[] {
  const actionConfig = VOICE_ACTIONS[actionType];
  const allWords = Object.values(actionConfig).flat();
  // Remove duplicates using Set
  return [...new Set(allWords)];
}

/**
 * Get all target words across all languages for a specific target type
 */
export function getAllTargetWords(targetType: keyof typeof BUSINESS_TARGETS): string[] {
  const targetConfig = BUSINESS_TARGETS[targetType];
  const allWords = Object.values(targetConfig).flat();
  // Remove duplicates using Set
  return [...new Set(allWords)];
}

/**
 * Get all contextual markers that should be removed during extraction
 */
export function getAllContextualMarkers(): string[] {
  const possessive = Object.values(CONTEXTUAL_MARKERS.POSSESSIVE).flat();
  const connectors = Object.values(CONTEXTUAL_MARKERS.CONNECTORS).flat();
  const allMarkers = [...possessive, ...connectors];
  // Remove duplicates using Set
  return [...new Set(allMarkers)];
}

/**
 * Get all filter words for a specific filter type
 */
export function getAllFilterWords(filterType: keyof typeof FILTER_WORDS): string[] {
  const filterConfig = FILTER_WORDS[filterType];
  const allWords = Object.values(filterConfig).flat();
  // Remove duplicates using Set
  return [...new Set(allWords)];
}

/**
 * Get all conversation filler words across all languages
 */
export function getAllConversationFillers(): string[] {
  const actionEmphasis = Object.values(CONVERSATION_FILLERS.ACTION_EMPHASIS).flat();
  const questionWords = Object.values(CONVERSATION_FILLERS.QUESTION_WORDS).flat();
  const conversationFlow = Object.values(CONVERSATION_FILLERS.CONVERSATION_FLOW).flat();
  
  const allFillers = [...actionEmphasis, ...questionWords, ...conversationFlow];
  // Remove duplicates using Set
  return [...new Set(allFillers)];
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
 * Example: addLanguageSupport('ta', { SEARCH: ['தேடু', 'கண்டுபிடி'] })
 */
export function addLanguageSupport(
  languageCode: string, 
  vocabulary: Partial<{ [K in keyof typeof VOICE_ACTIONS]: string[] }>
): void {
  // Add new language to existing action types
  Object.entries(vocabulary).forEach(([actionType, words]) => {
    if (actionType in VOICE_ACTIONS) {
      const actionKey = actionType as keyof typeof VOICE_ACTIONS;
      const actionConfig = VOICE_ACTIONS[actionKey] as Record<string, string[]>;
      actionConfig[languageCode] = words || [];
    }
  });
  
  // Language support added successfully
}