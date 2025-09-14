import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/FloatingVoiceAssistant.module.css';

interface FloatingVoiceAssistantProps {
  currentScreen?: string; // Current screen context for context-aware commands
  onVoiceCommand?: (command: string) => void; // Callback for voice commands
}

export function FloatingVoiceAssistant({ 
  currentScreen = 'dashboard', 
  onVoiceCommand 
}: FloatingVoiceAssistantProps) {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsVoiceSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'hi-IN'; // Support Hindi, Gujarati, English
      
      recognitionInstance.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        setTranscript(command);
        processVoiceCommand(command);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Context-aware commands based on current screen
    const commands = {
      // Navigation commands (universal)
      dashboard: () => navigateToScreen('dashboard'),
      leads: () => navigateToScreen('leads'),
      quotations: () => navigateToScreen('quotations'),
      production: () => navigateToScreen('production'),
      financials: () => navigateToScreen('financials'),
      inventory: () => navigateToScreen('inventory'),
      fulfillment: () => navigateToScreen('fulfillment'),
      customers: () => navigateToScreen('customers'),
      analytics: () => navigateToScreen('analytics'),
      
      // Screen-specific commands
      search: () => performSearch(command),
      call: () => performCall(),
      whatsapp: () => openWhatsApp(),
    };

    // Universal navigation commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('डैशबोर्ड') || lowerCommand.includes('ડેશબોર્ડ')) {
      navigateToScreen('dashboard');
    } else if (lowerCommand.includes('lead') || lowerCommand.includes('लीड') || lowerCommand.includes('લીડ')) {
      navigateToScreen('leads');
    } else if (lowerCommand.includes('quote') || lowerCommand.includes('कोटेशन') || lowerCommand.includes('કોટેશન')) {
      navigateToScreen('quotations');
    } else if (lowerCommand.includes('production') || lowerCommand.includes('उत्पादन') || lowerCommand.includes('ઉત્પાદન')) {
      navigateToScreen('production');
    } else if (lowerCommand.includes('financial') || lowerCommand.includes('वित्तीय') || lowerCommand.includes('નાણાકીય')) {
      navigateToScreen('financials');
    } else if (lowerCommand.includes('inventory') || lowerCommand.includes('इन्वेंटरी') || lowerCommand.includes('ઇન્વેન્ટરી')) {
      navigateToScreen('inventory');
    } else if (lowerCommand.includes('customer') || lowerCommand.includes('ग्राहक') || lowerCommand.includes('ગ્રાહક')) {
      navigateToScreen('customers');
    } else if (lowerCommand.includes('analytics') || lowerCommand.includes('विश्लेषण') || lowerCommand.includes('વિશ્લેષણ')) {
      navigateToScreen('analytics');
    } else if (lowerCommand.includes('search') || lowerCommand.includes('खोजें') || lowerCommand.includes('શોધ')) {
      performSearch(command);
    }
    
    // Call the parent component's voice command handler
    if (onVoiceCommand) {
      onVoiceCommand(command);
    }
  };

  const navigateToScreen = (screen: string) => {
    // This would integrate with React Router for navigation
    console.log(`Voice command: Navigate to ${screen}`);
    // Implementation would depend on the router setup
    window.location.hash = `#/${screen}`;
  };

  const performSearch = (query: string) => {
    // Extract search term from voice command
    const searchTerm = query.replace(/search|खोजें|શોધ/gi, '').trim();
    console.log(`Voice search: ${searchTerm}`);
    // Implementation would trigger global search
  };

  const performCall = () => {
    console.log('Voice command: Make a call');
    // Implementation would show call interface
  };

  const openWhatsApp = () => {
    console.log('Voice command: Open WhatsApp');
    // Implementation would open WhatsApp interface
  };

  const startListening = () => {
    if (recognition && isVoiceSupported) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isVoiceSupported) {
    return null; // Don't show if voice is not supported
  }

  return (
    <div className={styles.floatingVoiceContainer}>
      <button
        onClick={handleVoiceToggle}
        className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
        aria-label={t('voiceAssistant')}
        title={isListening ? t('voiceListening') : t('voiceClick')}
      >
        {isListening ? (
          <div className={styles.listeningIcon}>
            <div className={styles.pulseRing}></div>
            🎤
          </div>
        ) : (
          '🎤'
        )}
      </button>
      
      {transcript && (
        <div className={styles.transcriptBubble}>
          <p>{transcript}</p>
        </div>
      )}
      
      {isListening && (
        <div className={styles.listeningIndicator}>
          <p>{t('voiceListening')}...</p>
          <div className={styles.soundWave}>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
        </div>
      )}
    </div>
  );
}