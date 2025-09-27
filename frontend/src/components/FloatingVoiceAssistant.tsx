import React, { useState, useEffect, useCallback } from 'react';
import { nlpService } from '../services/nlp/NLPService';
import { NLPResult } from '../services/nlp/types';
import styles from '../styles/FloatingVoiceAssistant.module.css';

// TypeScript declarations for Speech Recognition API
interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: string, listener: (event: SpeechRecognitionEvent) => void): void;
  removeEventListener(type: string, listener: (event: SpeechRecognitionEvent) => void): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  error?: { message: string };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognitionInterface;
    SpeechRecognition: new () => SpeechRecognitionInterface;
  }
}

interface FloatingVoiceAssistantProps {
  currentProcessStage?: string;
  onNavigateToLeads?: () => void;
  onNavigateToQuotes?: () => void;
  onNavigateToPayments?: () => void;
  onNavigateToProduction?: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToFulfillment?: () => void;
  onNavigateToCustomers?: () => void;
  onNavigateToAnalytics?: () => void;
  businessData?: {
    hotLeads: number;
    overduePayments: number;
    readyToShip: number;
    totalCustomers: number;
  };
  onPerformSearch?: (query: string) => void;
}

function FloatingVoiceAssistant({
  currentProcessStage = 'dashboard',
  onNavigateToLeads,
  onNavigateToQuotes,
  onNavigateToPayments,
  onNavigateToProduction,
  onNavigateToInventory,
  onNavigateToFulfillment,
  onNavigateToCustomers,
  onNavigateToAnalytics,
  businessData,
  onPerformSearch
}: FloatingVoiceAssistantProps) {
  // const { t } = useTranslation(); // Translation available if needed
  
  // Voice command state
  const [isListening, setIsListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState('');
  const [showVoiceResponse, setShowVoiceResponse] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  
  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (showVoicePanel && !target.closest(`.${styles.voiceCommandPanel}`) && !target.closest(`.${styles.floatingVoiceAssistant}`)) {
        setShowVoicePanel(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVoicePanel]);

  // Escape key detection
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && showVoicePanel) {
        setShowVoicePanel(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showVoicePanel]);

  // Process-aware voice command suggestions
  const getProcessVoiceCommands = (stage: string) => {
    const commands = {
      'dashboard': [
        'Search Mumbai cotton mills',
        'કોટન ઓર્ડર શોધો',
        'Show hot leads',
        'Pending orders दिखाएं',
        'Check payment status'
      ],
      'leads': [
        'Search Surat textile leads',
        'गुजरात के लीड्स खोजें',
        'Show hot leads',
        'Find cotton customers',
        'Add new lead'
      ],
      'quotes': [
        'Search pending quotes',
        'હાઈ વેલ્યુ ક્વોટ્સ શોધો',
        'Create new quote',
        'Outstanding orders दिखाएं',
        'Quote approval status'
      ],
      'payments': [
        'Search overdue payments',
        'બકાયા પેમેન્ટ શોધો',
        'Show pending payments',
        'Large payments ढूंढें',
        'Record payment'
      ],
      'production': [
        'Search production orders',
        'ઉત્પાદન સ્ટેટસ બતાવો',
        'Quality check करें',
        'Start production',
        'Production report'
      ],
      'inventory': [
        'Search cotton stock',
        'સ્ટોક ચેક કરો',
        'Material order दें',
        'Inventory status',
        'Stock allocation'
      ],
      'fulfillment': [
        'Search ready orders',
        'શિપિંગ સ્ટેટસ બતાવો',
        'Dispatch tracking करें',
        'Ready to ship',
        'Delivery confirmation'
      ],
      'customers': [
        'Search VIP customers',
        'વીઆઈપી ગ્રાહકો શોધો',
        'Repeat customers ढूंढें',
        'Customer profile',
        'Customer feedback'
      ],
      'analytics': [
        'Search business reports',
        'મંથલી સેલ્સ બતાવો',
        'Performance metrics दिखाएं',
        'Show KPIs',
        'Business analytics'
      ]
    };
    return commands[stage as keyof typeof commands] || commands.dashboard;
  };

  // Extract search query from NLP payload (replaces custom extraction logic)
  const extractSearchQuery = useCallback((result: NLPResult): string | null => {
    // Use new structured payload from Universal Command Processor
    if (result.payload && result.payload.query) {
      return result.payload.query;
    }
    
    // Fallback for legacy results without payload
    if (result.originalText) {
      // This should rarely happen with the new architecture
      return result.originalText.trim();
    }
    
    return null;
  }, []);

  // Execute actions based on detected intent and NLP result
  const executeVoiceAction = useCallback(async (nlpResult: NLPResult) => {
    const { intent } = nlpResult;
    // eslint-disable-next-line no-console
    console.log('🎯 executeVoiceAction called with intent:', intent, 'full result:', nlpResult);
    
    switch (intent) {
      case 'SEARCH_COMMAND':
        if (onPerformSearch) {
          const searchQuery = extractSearchQuery(nlpResult);
          // eslint-disable-next-line no-console
          console.log('🔍 Extracted search query:', searchQuery, 'from result:', nlpResult);
          if (searchQuery) {
            // eslint-disable-next-line no-console
            console.log('🚀 Calling onPerformSearch with query:', searchQuery);
            onPerformSearch(searchQuery);
            // Close voice panel to show search results
            setShowVoicePanel(false);
          } else {
            // eslint-disable-next-line no-console
            console.log('❌ No search query extracted - search not executed');
          }
        }
        break;
      
      // Universal command support
      case 'SHOW_COMMAND':
      case 'OPEN_COMMAND':
        // Determine target from payload
        const target = nlpResult.payload?.target;
        switch (target) {
          case 'leads':
            onNavigateToLeads?.();
            break;
          case 'payments':
            onNavigateToPayments?.();
            break;
          case 'customers':
            onNavigateToCustomers?.();
            break;
          case 'orders':
            onNavigateToQuotes?.(); // Map to quotes/sales orders
            break;
          case 'inventory':
            onNavigateToInventory?.();
            break;
          case 'analytics':
            onNavigateToAnalytics?.();
            break;
          default:
            // Handle unknown target
            break;
        }
        break;
      
      // Legacy intent support (backward compatibility)
      case 'OPEN_LEADS':
        onNavigateToLeads?.();
        break;
      case 'OPEN_PAYMENTS':
        onNavigateToPayments?.();
        break;
      case 'OPEN_CUSTOMERS':
        onNavigateToCustomers?.();
        break;
      case 'OPEN_INVENTORY':
        onNavigateToInventory?.();
        break;
      case 'OPEN_ORDERS':
        onNavigateToQuotes?.(); // Using quotes for orders
        break;
      case 'OPEN_ANALYTICS':
        onNavigateToAnalytics?.();
        break;
      case 'OPEN_PRODUCTION':
        onNavigateToProduction?.();
        break;
      case 'SHOW_BUSINESS_OVERVIEW':
        // Could navigate to dashboard overview or show summary
        break;
      case 'SHOW_PRIORITIES':
        // Already handled in response generation
        break;
      case 'HELP_COMMAND':
        // Help response already generated
        break;
      default:
        // UNKNOWN_INTENT - no action needed, response already set
        break;
    }
  }, [onNavigateToLeads, onNavigateToQuotes, onNavigateToPayments, onNavigateToProduction, onNavigateToInventory, onNavigateToCustomers, onNavigateToAnalytics, onPerformSearch, extractSearchQuery]);

  // Enhanced voice command processing with NLP
  const processVoiceCommand = useCallback(async (command: string) => {
    // eslint-disable-next-line no-console
    console.log('🧠 Processing voice command:', command);
    
    try {
      // Use new NLP service for command processing
      // eslint-disable-next-line no-console
      console.log('🔥 About to call nlpService.processVoiceCommand with:', command, 'nlpService:', nlpService);
      const result = await nlpService.processVoiceCommand(command, businessData, currentProcessStage);
      
      // eslint-disable-next-line no-console
      console.log('🧠 NLP result:', result);
      
      // Execute the appropriate action based on intent (pass full result)
      // eslint-disable-next-line no-console
      console.log('⚡ About to call executeVoiceAction with result:', result);
      await executeVoiceAction(result);
      // eslint-disable-next-line no-console
      console.log('✅ executeVoiceAction completed successfully');
      
      // Close suggestion panel after any voice command
      setShowVoicePanel(false);
      
      // Only show popup for unknown intents and errors
      if (result.intent === 'UNKNOWN_INTENT') {
        setVoiceResponse(result.response);
        setShowVoiceResponse(true);
      }
      // For successful commands: just execute action silently
      
    } catch (error) {
      // Voice command processing error occurred
      setVoiceResponse('Sorry, I couldn\'t process that command. Please try again.');
      setShowVoiceResponse(true);
    }
  }, [businessData, currentProcessStage, executeVoiceAction]);

  // Voice recognition setup - Language Agnostic
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Use English-India as primary language for best multilingual support
      // The NLP service will handle multilingual command processing
      recognition.lang = 'en-IN';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition result:', transcript);
        processVoiceCommand(transcript); 
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition ended');
        setIsListening(false);
      };

      if (isListening) {
        // eslint-disable-next-line no-console
        console.log('🎤 Starting voice recognition...');
        recognition.start();
      }
    }
  }, [isListening, processVoiceCommand]);

  const startVoiceRecognition = () => {
    setIsListening(true);
  };


  // Auto-hide voice response after 5 seconds
  useEffect(() => {
    if (showVoiceResponse) {
      const timer = setTimeout(() => {
        setShowVoiceResponse(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showVoiceResponse]);

  // Get process stage display name
  const getProcessStageDisplay = (stage: string) => {
    const stageNames = {
      'dashboard': '🔄 Dashboard Context',
      'leads': '🔥 Lead Pipeline Context',
      'quotes': '📋 Quotations Context',
      'payments': '💰 Payments Context',
      'production': '🏭 Production Context',
      'inventory': '📦 Inventory Context',
      'fulfillment': '🚚 Fulfillment Context',
      'customers': '🤝 Customers Context',
      'analytics': '📊 Analytics Context'
    };
    return stageNames[stage as keyof typeof stageNames] || '🔄 Dashboard Context';
  };

  return (
    <>

      {/* Voice Response Display */}
      {showVoiceResponse && (
        <div className={styles.voiceResponsePanel}>
          <div className={styles.voiceResponseContent}>
            <span className={styles.voiceResponseIcon}>💬</span>
            <div className={styles.voiceResponseText}>
              {voiceResponse}
            </div>
          </div>
          <button 
            className={styles.closeVoiceResponse} 
            onClick={() => setShowVoiceResponse(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Voice Assistant - WhatsApp Style */}
      <button 
        className={`${styles.floatingVoiceAssistant} ${isListening ? styles.listening : ''}`}
        onClick={startVoiceRecognition}
        onMouseEnter={() => setShowVoicePanel(true)}
        onMouseLeave={() => setShowVoicePanel(false)}
        disabled={isListening}
        aria-label="Voice Assistant"
      >
        {isListening ? '🎙️' : '🎤'}
      </button>

      {/* Voice Command Suggestions Panel */}
      {showVoicePanel && (
        <div className={`${styles.voiceCommandPanel} ${showVoicePanel ? styles.visible : ''}`}>
          <div className={styles.voiceCommandPanelHeader}>
            <span className={styles.voiceCommandTitle}>Voice Commands</span>
            <button 
              className={styles.closeVoicePanel}
              onClick={() => setShowVoicePanel(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.voiceStageContext}>
            {getProcessStageDisplay(currentProcessStage)}
          </div>
          
          <ul className={styles.voiceCommandSuggestions}>
            {getProcessVoiceCommands(currentProcessStage).map((command, index) => (
              <li 
                key={index}
                className={styles.voiceCommandSuggestion}
                onClick={() => {
                  processVoiceCommand(command);
                  setShowVoicePanel(false);
                }}
              >
                {command}
              </li>
            ))}
          </ul>
          
          <div className={styles.voiceCommandHint}>
            Try: "Search Mumbai cotton" • "Find hot leads" • "Show payments" • "Mumbai cotton खोजें"
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingVoiceAssistant;