import { getCurrentTranslations, TranslationStrings } from '../utils/translations';

describe('Translation Utilities', () => {
  test('returns English translations by default', () => {
    const translations = getCurrentTranslations('en');
    
    expect(translations.businessPlatform).toBe('Complete end-to-end solution for textile manufacturing business');
    expect(translations.leadManagement).toBe('Lead Management');
    expect(translations.quotationOrders).toBe('Quotations & Orders');
    expect(translations.salesOrder).toBe('Sales Orders');
    expect(translations.customers).toBe('Customers');
    expect(translations.backToDashboard).toBe('← Back to Dashboard');
    expect(translations.call).toBe('📞 Call');
    expect(translations.whatsapp).toBe('📱 WhatsApp');
  });

  test('returns Gujarati translations correctly', () => {
    const translations = getCurrentTranslations('gu');
    
    expect(translations.businessPlatform).toBe('ટેક્સટાઈલ મેન્યુફેક્ચરિંગ બિઝનેસ માટે સંપૂર્ણ સોલ્યુશન');
    expect(translations.leadManagement).toBe('લીડ મેનેજમેન્ટ');
    expect(translations.quotationOrders).toBe('કોટેશન અને ઓર્ડર');
    expect(translations.salesOrder).toBe('સેલ્સ ઓર્ડર');
    expect(translations.customers).toBe('ગ્રાહકો');
    expect(translations.backToDashboard).toBe('← ડેશબોર્ડ પર પાછા જાઓ');
    expect(translations.call).toBe('📞 કૉલ');
    expect(translations.whatsapp).toBe('📱 વોટ્સએપ');
  });

  test('returns Hindi translations correctly', () => {
    const translations = getCurrentTranslations('hi');
    
    expect(translations.businessPlatform).toBe('टेक्सटाइल मैन्युफैक्चरिंग बिजनेस के लिए संपूर्ण समाधान');
    expect(translations.leadManagement).toBe('लीड प्रबंधन');
    expect(translations.quotationOrders).toBe('कोटेशन और ऑर्डर');
    expect(translations.salesOrder).toBe('सेल्स ऑर्डर');
    expect(translations.customers).toBe('ग्राहक');
    expect(translations.backToDashboard).toBe('← डैशबोर्ड पर वापस जाएं');
    expect(translations.call).toBe('📞 कॉल');
    expect(translations.whatsapp).toBe('📱 व्हाट्सऐप');
  });

  test('falls back to English for unknown language', () => {
    const translations = getCurrentTranslations('fr');
    
    expect(translations.businessPlatform).toBe('Complete end-to-end solution for textile manufacturing business');
    expect(translations.leadManagement).toBe('Lead Management');
    expect(translations.quotationOrders).toBe('Quotations & Orders');
  });

  test('returns proper dashboard translations for all languages', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    // Welcome message
    expect(enTranslations.welcome).toBe('Welcome to Your Business Hub');
    expect(guTranslations.welcome).toBe('તમારા બિઝનેસ હબમાં આપનું સ્વાગત');
    expect(hiTranslations.welcome).toBe('आपके बिजनेस हब में आपका स्वागत');
    
    // Tagline
    expect(enTranslations.tagline).toBe('360° Business Platform for Gujarat Textile Manufacturers');
    expect(guTranslations.tagline).toBe('ગુજરાત ટેક્સટાઈલ ઉત્પાદકો માટે 360° બિઝનેસ પ્લેટફોર્મ');
    expect(hiTranslations.tagline).toBe('गुजरात टेक्सटाइल निर्माताओं के लिए 360° बिजनेस प्लेटफॉर्म');
  });

  test('returns proper feature descriptions for all languages', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    // Lead Management descriptions
    expect(enTranslations.leadManagementDesc).toBe('Track and convert potential customers');
    expect(guTranslations.leadManagementDesc).toBe('સંભવિત ગ્રાહકોને ટ્રેક અને કન્વર્ટ કરો');
    expect(hiTranslations.leadManagementDesc).toBe('संभावित ग्राहकों को ट्रैक और कन्वर्ट करें');
    
    // Quotation descriptions
    expect(enTranslations.quotationOrdersDesc).toBe('Create quotes and manage approvals');
    expect(guTranslations.quotationOrdersDesc).toBe('કોટ બનાવો અને મંજૂરી મેનેજ કરો');
    expect(hiTranslations.quotationOrdersDesc).toBe('कोट बनाएं और अप्रूवल मैनेज करें');
  });

  test('returns proper lead types for all languages', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.hotLead).toBe('Hot Lead');
    expect(guTranslations.hotLead).toBe('હોટ લીડ');
    expect(hiTranslations.hotLead).toBe('हॉट लीड');
    
    expect(enTranslations.warmLead).toBe('Warm Lead');
    expect(guTranslations.warmLead).toBe('વોર્મ લીડ');
    expect(hiTranslations.warmLead).toBe('वार्म लीड');
    
    expect(enTranslations.coldLead).toBe('Cold Lead');
    expect(guTranslations.coldLead).toBe('કોલ્ડ લીડ');
    expect(hiTranslations.coldLead).toBe('कोल्ड लीड');
  });

  test('returns proper status translations for all languages', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.pending).toBe('Pending');
    expect(guTranslations.pending).toBe('પેન્ડિંગ');
    expect(hiTranslations.pending).toBe('पेंडिंग');
    
    expect(enTranslations.approved).toBe('Approved');
    expect(guTranslations.approved).toBe('મંજૂર');
    expect(hiTranslations.approved).toBe('अप्रूव्ड');
    
    expect(enTranslations.converted).toBe('Converted');
    expect(guTranslations.converted).toBe('કન્વર્ટ થયેલ');
    expect(hiTranslations.converted).toBe('कन्वर्ट किया गया');
  });

  test('returns proper order and quote field translations', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    // Quote fields
    expect(enTranslations.quoteNumber).toBe('Quote Number');
    expect(guTranslations.quoteNumber).toBe('કોટ નંબર');
    expect(hiTranslations.quoteNumber).toBe('कोट नंबर');
    
    expect(enTranslations.quoteDate).toBe('Quote Date');
    expect(guTranslations.quoteDate).toBe('કોટ તારીખ');
    expect(hiTranslations.quoteDate).toBe('कोट तारीख');
    
    // Order fields
    expect(enTranslations.orderNumber).toBe('Order Number');
    expect(guTranslations.orderNumber).toBe('ઓર્ડર નંબર');
    expect(hiTranslations.orderNumber).toBe('ऑर्डर नंबर');
    
    expect(enTranslations.orderDate).toBe('Order Date');
    expect(guTranslations.orderDate).toBe('ઓર્ડર તારીખ');
    expect(hiTranslations.orderDate).toBe('ऑर्डर तारीख');
  });

  test('returns proper business field translations', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.material).toBe('Material');
    expect(guTranslations.material).toBe('સામગ્રી');
    expect(hiTranslations.material).toBe('सामग्री');
    
    expect(enTranslations.specification).toBe('Specification');
    expect(guTranslations.specification).toBe('સ્પેસિફિકેશન');
    expect(hiTranslations.specification).toBe('स्पेसिफिकेशन');
    
    expect(enTranslations.budget).toBe('Budget');
    expect(guTranslations.budget).toBe('બજેટ');
    expect(hiTranslations.budget).toBe('बजट');
    
    expect(enTranslations.delivery).toBe('Delivery');
    expect(guTranslations.delivery).toBe('ડિલિવરી');
    expect(hiTranslations.delivery).toBe('डिलीवरी');
  });

  test('returns proper payment translations', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.totalAmount).toBe('Total Amount');
    expect(guTranslations.totalAmount).toBe('કુલ રકમ');
    expect(hiTranslations.totalAmount).toBe('कुल राशि');
    
    expect(enTranslations.pendingPayment).toBe('Pending Payment');
    expect(guTranslations.pendingPayment).toBe('પેન્ડિંગ પેમેન્ટ');
    expect(hiTranslations.pendingPayment).toBe('पेंडिंग पेमेंट');
    
    expect(enTranslations.paymentReceived).toBe('Payment Received');
    expect(guTranslations.paymentReceived).toBe('પેમેન્ટ મળેલ');
    expect(hiTranslations.paymentReceived).toBe('पेमेंट प्राप्त');
  });

  test('returns proper customer search translations', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.searchCustomers).toBe('Search customers by name, location, or specialization...');
    expect(guTranslations.searchCustomers).toBe('નામ, સ્થળ અથવા વિશેષતા દ્વારા ગ્રાહકો શોધો...');
    expect(hiTranslations.searchCustomers).toBe('नाम, स्थान या विशेषता के अनुसार ग्राहकों को खोजें...');
  });

  test('returns proper voice command translations', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    expect(enTranslations.voiceCommands).toBe('Voice Commands (Speak in Gujarati, Hindi, or English)');
    expect(guTranslations.voiceCommands).toBe('વૉઈસ કમાન્ડ્સ (ગુજરાતી, હિંદી, અથવા અંગ્રેજીમાં બોલો)');
    expect(hiTranslations.voiceCommands).toBe('वॉयस कमांड (गुजराती, हिंदी, या अंग्रेजी में बोलें)');
    
    expect(enTranslations.voiceExample1).toBe('Add new fabric inquiry from Mumbai');
    expect(guTranslations.voiceExample1).toBe('મુંબઈથી નવી ફેબ્રિક પૂછપરછ ઉમેરો');
    expect(hiTranslations.voiceExample1).toBe('मुंबई से नई फैब्रिक पूछताछ जोड़ें');
  });

  test('handles undefined language gracefully', () => {
    const translations = getCurrentTranslations(undefined as any);
    
    expect(translations.leadManagement).toBe('Lead Management');
    expect(translations.businessPlatform).toBe('Complete end-to-end solution for textile manufacturing business');
  });

  test('handles null language gracefully', () => {
    const translations = getCurrentTranslations(null as any);
    
    expect(translations.leadManagement).toBe('Lead Management');
    expect(translations.businessPlatform).toBe('Complete end-to-end solution for textile manufacturing business');
  });

  test('handles empty string language gracefully', () => {
    const translations = getCurrentTranslations('');
    
    expect(translations.leadManagement).toBe('Lead Management');
    expect(translations.businessPlatform).toBe('Complete end-to-end solution for textile manufacturing business');
  });

  test('all translation objects have the same keys', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    const enKeys = Object.keys(enTranslations).sort();
    const guKeys = Object.keys(guTranslations).sort();
    const hiKeys = Object.keys(hiTranslations).sort();
    
    expect(enKeys).toEqual(guKeys);
    expect(enKeys).toEqual(hiKeys);
    expect(guKeys).toEqual(hiKeys);
  });

  test('no translation strings are empty', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    Object.values(enTranslations).forEach(value => {
      expect(value.trim()).not.toBe('');
    });
    
    Object.values(guTranslations).forEach(value => {
      expect(value.trim()).not.toBe('');
    });
    
    Object.values(hiTranslations).forEach(value => {
      expect(value.trim()).not.toBe('');
    });
  });

  test('interface matches implementation for all languages', () => {
    const enTranslations = getCurrentTranslations('en');
    const guTranslations = getCurrentTranslations('gu');
    const hiTranslations = getCurrentTranslations('hi');
    
    // Check that all objects satisfy the TranslationStrings interface
    expect(enTranslations).toHaveProperty('backToDashboard');
    expect(enTranslations).toHaveProperty('businessPlatform');
    expect(enTranslations).toHaveProperty('leadManagement');
    expect(enTranslations).toHaveProperty('quotationOrders');
    expect(enTranslations).toHaveProperty('customers');
    
    expect(guTranslations).toHaveProperty('backToDashboard');
    expect(guTranslations).toHaveProperty('businessPlatform');
    expect(guTranslations).toHaveProperty('leadManagement');
    expect(guTranslations).toHaveProperty('quotationOrders');
    expect(guTranslations).toHaveProperty('customers');
    
    expect(hiTranslations).toHaveProperty('backToDashboard');
    expect(hiTranslations).toHaveProperty('businessPlatform');
    expect(hiTranslations).toHaveProperty('leadManagement');
    expect(hiTranslations).toHaveProperty('quotationOrders');
    expect(hiTranslations).toHaveProperty('customers');
  });
});