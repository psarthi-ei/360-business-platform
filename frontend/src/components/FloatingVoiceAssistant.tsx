import React, { useState, useEffect, useCallback } from 'react';
import { nlpService } from '../services/nlp/NLPService';
import styles from '../styles/FloatingVoiceAssistant.module.css';

// TypeScript declarations for Speech Recognition API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    webkitSpeechRecognition: any; // Browser API
    SpeechRecognition: any; // Browser API
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

  // Process-aware voice command suggestions
  const getProcessVoiceCommands = (stage: string) => {
    const commands = {
      'dashboard': [
        'Show business overview',
        'What needs attention today',
        'Go to hot leads',
        'Check payment status',
        'बिजनेस ओवरव्यू दिखाएं',
        'आज क्या attention चाहिए'
      ],
      'leads': [
        'Show hot leads',
        'Add new lead',
        'Call next lead',
        'Lead conversion rate',
        'हॉट लीड्स दिखाएं',
        'नया लीड जोड़ें'
      ],
      'quotes': [
        'Create quote',
        'Show pending quotes',
        'Quote approval status',
        'Send quote to customer'
      ],
      'payments': [
        'Record payment',
        'Outstanding payments',
        'Customer conversion',
        'Payment reminders'
      ],
      'production': [
        'Production status',
        'Start production',
        'Quality check',
        'Production report'
      ],
      'inventory': [
        'Stock check',
        'Material order',
        'Stock allocation',
        'Inventory report'
      ],
      'fulfillment': [
        'Ready to ship',
        'Dispatch status',
        'Delivery tracking',
        'Confirm delivery'
      ],
      'customers': [
        'Customer profile',
        'VIP customers',
        'Customer feedback',
        'Repeat opportunities'
      ],
      'analytics': [
        'Business performance',
        'Monthly sales',
        'Process efficiency',
        'Show KPIs'
      ]
    };
    return commands[stage as keyof typeof commands] || commands.dashboard;
  };

  // Extract search term from voice command
  const extractSearchTerm = useCallback((command: string): string => {
    const lowerCommand = command.toLowerCase().trim();
    
    // English patterns
    if (lowerCommand.includes('search for ')) {
      return command.substring(command.toLowerCase().indexOf('search for ') + 11).trim();
    }
    if (lowerCommand.includes('find ')) {
      return command.substring(command.toLowerCase().indexOf('find ') + 5).trim();
    }
    if (lowerCommand.includes('look for ')) {
      return command.substring(command.toLowerCase().indexOf('look for ') + 9).trim();
    }
    if (lowerCommand.includes('locate ')) {
      return command.substring(command.toLowerCase().indexOf('locate ') + 7).trim();
    }
    
    // Hindi patterns
    if (lowerCommand.includes(' खोजें')) {
      return command.replace(/\s+खोजें.*$/i, '').trim();
    }
    if (lowerCommand.includes(' ढूंढें')) {
      return command.replace(/\s+ढूंढें.*$/i, '').trim();
    }
    
    // Gujarati patterns  
    if (lowerCommand.includes(' શોધો')) {
      return command.replace(/\s+શોધો.*$/i, '').trim();
    }
    
    // If no specific pattern found, use the whole command as search term
    return command.trim();
  }, []);

  // Execute actions based on detected intent
  const executeVoiceAction = useCallback(async (intent: string, originalCommand?: string) => {
    // Execute action based on detected intent
    
    switch (intent) {
      case 'SEARCH_COMMAND':
        if (onPerformSearch && originalCommand) {
          const searchTerm = extractSearchTerm(originalCommand);
          if (searchTerm) {
            onPerformSearch(searchTerm);
          }
        }
        break;
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
  }, [onNavigateToLeads, onNavigateToQuotes, onNavigateToPayments, onNavigateToProduction, onNavigateToInventory, onNavigateToCustomers, onNavigateToAnalytics, onPerformSearch, extractSearchTerm]);

  // Enhanced voice command processing with NLP
  const processVoiceCommand = useCallback(async (command: string) => {
    try {
      // Use new NLP service for command processing
      const result = await nlpService.processVoiceCommand(command, businessData, currentProcessStage);
      
      // Debug information in development mode
      // Voice command processed successfully
      
      // Execute the appropriate action based on intent
      await executeVoiceAction(result.intent, command);
      
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript); 
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
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
            Try: "Go to production" • "Show hot leads" • "लीड्स दिखाएं" • "पेमेंट्स दिखाएं"
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingVoiceAssistant;