import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  onstart: ((event: Event) => void) | null;
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
  onOpenAddLeadModal?: () => void;
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
  onOpenAddLeadModal,
  businessData,
  onPerformSearch
}: FloatingVoiceAssistantProps) {
  // const { t } = useTranslation(); // Translation available if needed
  
  // Voice recognition state machine
  type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [showVoiceResponse, setShowVoiceResponse] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  
  // Speech recognition instance ref to prevent multiple instances
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  // Unified target router - handles both navigation and creation
  const routeToTarget = useCallback((target: string | undefined, action: 'navigate' | 'create' = 'navigate') => {
    // Normalize target (handle both singular and plural)
    const normalizedTarget = target?.toLowerCase();
    
    switch (normalizedTarget) {
      case 'lead':
      case 'leads':
        if (action === 'create' && onOpenAddLeadModal) {
          onOpenAddLeadModal();
        } else {
          onNavigateToLeads?.();
        }
        break;
        
      case 'payment':
      case 'payments':
        onNavigateToPayments?.();
        break;
        
      case 'customer':
      case 'customers':
        onNavigateToCustomers?.();
        break;
        
      case 'order':
      case 'orders':
      case 'quote':
      case 'quotes':
        onNavigateToQuotes?.();
        break;
        
      case 'inventory':
        onNavigateToInventory?.();
        break;
        
      case 'analytics':
        onNavigateToAnalytics?.();
        break;
        
      case 'production':
        onNavigateToProduction?.();
        break;
        
      case 'fulfillment':
        onNavigateToFulfillment?.();
        break;
        
      default:
        // For unrecognized targets in CREATE mode, default to add lead
        if (action === 'create' && onOpenAddLeadModal) {
          onOpenAddLeadModal();
        }
        break;
    }
  }, [onNavigateToLeads, onNavigateToPayments, onNavigateToCustomers, onNavigateToQuotes, onNavigateToInventory, onNavigateToAnalytics, onNavigateToProduction, onNavigateToFulfillment, onOpenAddLeadModal]);

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
        const query = nlpResult.payload?.query;
        
        // If no specific target but has query, treat as search command
        if (!target && query && onPerformSearch) {
          // eslint-disable-next-line no-console
          console.log('🔍 SHOW_COMMAND with query but no target - treating as search:', query);
          onPerformSearch(query);
          setShowVoicePanel(false);
          break;
        }
        
        // Use unified router for navigation
        if (target) {
          routeToTarget(target, 'navigate');
        }
        break;
      
      // Create/Add command support
      case 'CREATE_COMMAND':
        const createTarget = nlpResult.payload?.target;
        // Use unified router for creation
        if (createTarget) {
          routeToTarget(createTarget, 'create');
        }
        break;
      case 'HELP_COMMAND':
        // Help response already generated
        break;
      default:
        // UNKNOWN_INTENT - no action needed, response already set
        break;
    }
  }, [onPerformSearch, extractSearchQuery, routeToTarget]);

  // Enhanced voice command processing with NLP
  const processVoiceCommand = useCallback(async (command: string) => {
    // eslint-disable-next-line no-console
    console.log('🧠 Processing voice command:', command);
    
    setVoiceState('PROCESSING'); // Show processing state
    
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
        setVoiceState('ERROR');
      } else {
        setVoiceState('IDLE');
      }
      
    } catch (error) {
      // Voice command processing error occurred
      setVoiceResponse('Sorry, I couldn\'t process that command. Please try again.');
      setShowVoiceResponse(true);
      setVoiceState('ERROR');
    }
  }, [businessData, currentProcessStage, executeVoiceAction]);

  // Initialize speech recognition instance once
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition started');
        setVoiceState('LISTENING');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition result:', transcript);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Process the command
        processVoiceCommand(transcript); 
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition error:', event.error);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Don't show error UI for "aborted" errors (natural after processing commands)
        if (event.error && typeof event.error === 'string' && event.error === 'aborted') {
          // Just reset to idle for aborted errors
          setVoiceState('IDLE');
          return;
        }
        
        // Show error UI only for real errors
        setVoiceState('ERROR');
        setVoiceResponse(`Voice recognition error: ${event.error || 'Unknown error'}`);
        setShowVoiceResponse(true);
        
        // Reset to idle after error
        setTimeout(() => setVoiceState('IDLE'), 2000);
      };

      recognition.onend = () => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition ended');
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Reset to idle (no need to check state as this is end)
        setVoiceState('IDLE');
      };

      recognitionRef.current = recognition;
      
      // Cleanup function
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Create recognition instance once, no dependencies (processVoiceCommand omitted intentionally to prevent abort)

  const startVoiceRecognition = () => {
    if (voiceState !== 'IDLE') {
      // eslint-disable-next-line no-console
      console.log('🚫 Voice recognition already active, state:', voiceState);
      return;
    }
    
    if (recognitionRef.current) {
      try {
        // eslint-disable-next-line no-console
        console.log('🎤 Starting voice recognition...');
        
        // Set timeout for recognition
        timeoutRef.current = setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log('⏰ Voice recognition timeout');
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
          setVoiceState('IDLE');
        }, 8000); // 8 second timeout
        
        recognitionRef.current.start();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('❌ Error starting voice recognition:', error);
        setVoiceState('ERROR');
        setVoiceResponse('Could not start voice recognition. Please try again.');
        setShowVoiceResponse(true);
        setTimeout(() => setVoiceState('IDLE'), 2000);
      }
    }
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
        className={`${styles.floatingVoiceAssistant} ${voiceState === 'LISTENING' ? styles.listening : ''} ${voiceState === 'PROCESSING' ? styles.processing : ''} ${voiceState === 'ERROR' ? styles.error : ''}`}
        onClick={startVoiceRecognition}
        onMouseEnter={() => setShowVoicePanel(true)}
        onMouseLeave={() => setShowVoicePanel(false)}
        disabled={voiceState !== 'IDLE'}
        aria-label="Voice Assistant"
        title={`Voice Assistant - ${voiceState}`}
      >
        {voiceState === 'PROCESSING' ? '⚡' : voiceState === 'LISTENING' ? '🎙️' : voiceState === 'ERROR' ? '❌' : '🎤'}
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