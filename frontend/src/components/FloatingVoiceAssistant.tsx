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

  // Browser/app context detection (used across multiple functions)
  const isGoogleApp = /GoogleApp/.test(navigator.userAgent);
  const isWebView = (window.navigator as any).standalone === false && /Mobile|Android/.test(navigator.userAgent);
  const isDesktop = window.innerWidth >= 768 && !('ontouchstart' in window);
  const confidenceThreshold = isGoogleApp || isWebView ? 0.4 : 0.6;

  // Initialize speech recognition instance once
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Enhanced recognition settings for better mobile compatibility
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      
      // Try to set maxAlternatives if supported
      try {
        (recognition as any).maxAlternatives = 3;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('maxAlternatives not supported in this browser');
      }
      
      // eslint-disable-next-line no-console
      console.log('🎤 Voice recognition config - GoogleApp:', isGoogleApp, 'WebView:', isWebView, 'Desktop:', isDesktop, 'Confidence threshold:', confidenceThreshold);

      recognition.onstart = () => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition started');
        setVoiceState('LISTENING');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Get all alternatives and find the best one
        const results = event.results[0];
        let bestTranscript = '';
        let bestConfidence = 0;
        const allAlternatives: Array<{transcript: string, confidence: number}> = [];
        
        // Collect all alternatives with confidence scores
        for (let i = 0; i < results.length; i++) {
          const alternative = results[i];
          allAlternatives.push({
            transcript: alternative.transcript,
            confidence: alternative.confidence
          });
          
          if (alternative.confidence > bestConfidence) {
            bestConfidence = alternative.confidence;
            bestTranscript = alternative.transcript;
          }
        }
        
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition results:', {
          best: { transcript: bestTranscript, confidence: bestConfidence },
          all: allAlternatives,
          threshold: confidenceThreshold
        });
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Check if confidence meets threshold
        if (bestConfidence >= confidenceThreshold) {
          // High confidence - process command
          processVoiceCommand(bestTranscript);
        } else if (allAlternatives.length > 1) {
          // Low confidence but multiple alternatives - try the next best
          const secondBest = allAlternatives.sort((a, b) => b.confidence - a.confidence)[1];
          if (secondBest && secondBest.confidence >= (confidenceThreshold * 0.8)) {
            // eslint-disable-next-line no-console
            console.log('🎤 Using second-best alternative:', secondBest);
            processVoiceCommand(secondBest.transcript);
          } else {
            // Show suggestions for unclear speech
            setVoiceResponse(`I didn't catch that clearly. Try: "Search Mumbai", "Show leads", or "Add new lead"`);
            setShowVoiceResponse(true);
            setVoiceState('ERROR');
          }
        } else {
          // Single low-confidence result - show suggestions
          setVoiceResponse(`Please speak clearly. Try: "Search [company]", "Show [leads/payments]", or "Add new lead"`);
          setShowVoiceResponse(true);
          setVoiceState('ERROR');
        }
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        // eslint-disable-next-line no-console
        console.log('🎤 Voice recognition error:', event.error, 'Context:', { isGoogleApp, isWebView });
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Handle different error types based on context
        if (event.error && typeof event.error === 'string') {
          switch (event.error) {
            case 'aborted':
              // Natural abort after processing - just reset
              setVoiceState('IDLE');
              return;
              
            case 'no-speech':
              // Common in Google App - provide helpful feedback
              if (isGoogleApp || isWebView) {
                setVoiceResponse('No speech detected. Please speak closer to the microphone and try again.');
              } else {
                setVoiceResponse('Please speak into the microphone. Try saying "Search Mumbai" or "Show leads".');
              }
              setShowVoiceResponse(true);
              setVoiceState('ERROR');
              return;
              
            case 'audio-capture':
              // Microphone access issues
              setVoiceResponse('Microphone access required. Please check your browser permissions.');
              setShowVoiceResponse(true);
              setVoiceState('ERROR');
              return;
              
            case 'network':
              // Network issues - more common in WebViews
              setVoiceResponse('Network error. Please check your connection and try again.');
              setShowVoiceResponse(true);
              setVoiceState('ERROR');
              return;
              
            default:
              // Other errors - show generic but helpful message
              setVoiceResponse('Voice recognition unavailable. Try typing your search or refresh the page.');
              setShowVoiceResponse(true);
              setVoiceState('ERROR');
              return;
          }
        }
        
        // Fallback for unknown errors
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
        
        // Adaptive timeout based on browser context
        const adaptiveTimeout = (() => {
          if (isGoogleApp || isWebView) return 12000; // 12s for Google App/WebView (often slower)
          if (isDesktop) return 6000; // 6s for desktop (usually faster)
          return 8000; // 8s for mobile Chrome (default)
        })();
        
        // Set timeout for recognition
        timeoutRef.current = setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log('⏰ Voice recognition timeout after', adaptiveTimeout + 'ms');
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
          setVoiceState('IDLE');
        }, adaptiveTimeout);
        
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