import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/FloatingVoiceAssistant.module.css';

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
  businessData
}: FloatingVoiceAssistantProps) {
  const { currentLanguage } = useTranslation();
  
  // Voice command state
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
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
        'Check payment status'
      ],
      'leads': [
        'Show hot leads',
        'Add new lead',
        'Call next lead',
        'Lead conversion rate'
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

  // Enhanced voice command processing
  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    
    // Business intelligence queries
    if (businessData && (lowerCommand.includes('what needs attention') || lowerCommand.includes('શું attention') || lowerCommand.includes('क्या attention'))) {
      response = `Today's priorities: ${businessData.hotLeads} hot leads need calls, ${businessData.overduePayments} overdue payments, ${businessData.readyToShip} orders ready to ship`;
      setVoiceResponse(response);
      setShowVoiceResponse(true);
      return;
    }
    
    // Process-specific navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('show') || lowerCommand.includes('જાઓ') || lowerCommand.includes('બતાવો')) {
      if (lowerCommand.includes('lead') || lowerCommand.includes('લીડ')) {
        onNavigateToLeads?.();
        response = 'Opening Lead Pipeline management';
      } else if (lowerCommand.includes('quote') || lowerCommand.includes('કોટ')) {
        onNavigateToQuotes?.();
        response = 'Opening Quotations management';
      } else if (lowerCommand.includes('payment') || lowerCommand.includes('પેમેન્ટ')) {
        onNavigateToPayments?.();
        response = 'Opening Payment management';
      } else if (lowerCommand.includes('production') || lowerCommand.includes('પ્રોડક્શન')) {
        onNavigateToProduction?.();
        response = 'Opening Production management';
      } else if (lowerCommand.includes('inventory') || lowerCommand.includes('સ્ટોક')) {
        onNavigateToInventory?.();
        response = 'Opening Inventory management';
      } else if (lowerCommand.includes('customer') || lowerCommand.includes('ગ્રાહક')) {
        onNavigateToCustomers?.();
        response = 'Opening Customer management';
      } else if (lowerCommand.includes('analytics') || lowerCommand.includes('રિપોર્ટ')) {
        onNavigateToAnalytics?.();
        response = 'Opening Business Analytics';
      }
      
      if (response) {
        setVoiceResponse(response);
        setShowVoiceResponse(true);
        return;
      }
    }
  };

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'gu' ? 'gu-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceCommand(transcript);
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
  }, [isListening, currentLanguage]);

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
              <strong>Business Assistant:</strong> {voiceResponse}
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
            Try: "Go to production" or "Show hot leads"
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingVoiceAssistant;