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

  // Debug logging state
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [debugFilter, setDebugFilter] = useState<'all' | 'capability' | 'permission' | 'voice' | 'audio'>('all');
  
  // Enhanced debug logger with capability detection
  const addDebugLog = useCallback((type: string, message: string) => {
    const time = new Date().toLocaleTimeString();
    const log = `[${time}] ${type}: ${message}`;
    setDebugLogs(prev => [...prev.slice(-49), log]); // Keep more logs for filtering
    // eslint-disable-next-line no-console
    console.log(log);
  }, []);

  // Filter logs by category
  const getFilteredLogs = useCallback(() => {
    if (debugFilter === 'all') return debugLogs;
    
    const categoryKeywords = {
      capability: ['System', 'Browser', 'Platform', 'SpeechAPI', 'SR-Props', 'SR-Error', 'AudioAPI', 'Device'],
      permission: ['Mic-Perm', 'Audio-Dev'],
      voice: ['Voice', 'Voice-Init', 'Voice-Result', 'Voice-Alt', 'Voice-Analysis', 'Voice-Decision'],
      audio: ['Mic-Test', 'Audio-Test', 'Audio-Level']
    };
    
    const keywords = categoryKeywords[debugFilter] || [];
    return debugLogs.filter(log => 
      keywords.some(keyword => log.includes(`] ${keyword}:`))
    );
  }, [debugLogs, debugFilter]);

  // Capability detection function
  const detectCapabilities = useCallback(() => {
    addDebugLog('System', '=== CAPABILITY DETECTION ===');
    
    // Browser and version detection
    const ua = navigator.userAgent;
    const isGoogleApp = /GoogleApp/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isChrome = /Chrome/.test(ua);
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const iosVersion = ua.match(/OS (\d+)_(\d+)/);
    
    addDebugLog('Browser', `GoogleApp: ${isGoogleApp}, Safari: ${isSafari}, Chrome: ${isChrome}`);
    addDebugLog('Platform', `iOS: ${isIOS}${iosVersion ? ` v${iosVersion[1]}.${iosVersion[2]}` : ''}`);
    
    // Speech Recognition API detection
    const hasWebkitSR = 'webkitSpeechRecognition' in window;
    const hasStandardSR = 'SpeechRecognition' in window;
    const srConstructor = hasWebkitSR ? 'webkitSpeechRecognition' : hasStandardSR ? 'SpeechRecognition' : 'none';
    
    addDebugLog('SpeechAPI', `Webkit: ${hasWebkitSR}, Standard: ${hasStandardSR}, Using: ${srConstructor}`);
    
    // Test Speech Recognition instance creation
    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const testRecognition = new SpeechRecognition();
      
      // Test property availability
      const supportsContinuous = 'continuous' in testRecognition;
      const supportsInterimResults = 'interimResults' in testRecognition;
      const supportsMaxAlternatives = 'maxAlternatives' in testRecognition;
      const supportsServiceURI = 'serviceURI' in testRecognition;
      
      addDebugLog('SR-Props', `continuous: ${supportsContinuous}, interim: ${supportsInterimResults}, maxAlts: ${supportsMaxAlternatives}, serviceURI: ${supportsServiceURI}`);
      
      // Clean up test instance
      testRecognition.abort();
    } catch (error) {
      addDebugLog('SR-Error', `Failed to create SpeechRecognition: ${error}`);
    }
    
    // Audio/Media API detection
    const hasGetUserMedia = navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices;
    const hasAudioContext = 'AudioContext' in window || 'webkitAudioContext' in window;
    const hasMediaRecorder = 'MediaRecorder' in window;
    
    addDebugLog('AudioAPI', `getUserMedia: ${hasGetUserMedia}, AudioContext: ${hasAudioContext}, MediaRecorder: ${hasMediaRecorder}`);
    
    // Screen and device info
    const screenInfo = `${window.screen.width}x${window.screen.height}, pixelRatio: ${window.devicePixelRatio}`;
    const isStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
    
    addDebugLog('Device', `Screen: ${screenInfo}, Standalone: ${isStandalone}`);
    
  }, [addDebugLog]);

  // Microphone permission and audio testing
  const testMicrophoneCapabilities = useCallback(async () => {
    addDebugLog('Mic-Test', '=== MICROPHONE TESTING ===');
    
    // Check microphone permission
    try {
      if ('permissions' in navigator) {
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        addDebugLog('Mic-Perm', `Permission state: ${micPermission.state}`);
      } else {
        addDebugLog('Mic-Perm', 'Permissions API not available');
      }
    } catch (error) {
      addDebugLog('Mic-Perm', `Permission check failed: ${error}`);
    }
    
    // Test audio device enumeration
    try {
      if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        addDebugLog('Audio-Dev', `Found ${audioInputs.length} audio input devices`);
        
        audioInputs.forEach((device, index) => {
          addDebugLog('Audio-Dev', `${index + 1}: ${device.label || 'Unnamed'} (${device.deviceId.substring(0, 8)}...)`);
        });
      } else {
        addDebugLog('Audio-Dev', 'Device enumeration not available');
      }
    } catch (error) {
      addDebugLog('Audio-Dev', `Device enumeration failed: ${error}`);
    }
    
    // Test getUserMedia access
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        addDebugLog('Audio-Test', 'Testing microphone access...');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        if (stream) {
          const track = stream.getAudioTracks()[0];
          if (track) {
            const settings = track.getSettings();
            const sampleRate = (settings as unknown as { sampleRate?: number }).sampleRate || 'unknown';
            const channelCount = (settings as unknown as { channelCount?: number }).channelCount || 'unknown';
            addDebugLog('Audio-Test', `Success! Sample rate: ${sampleRate}, Channels: ${channelCount}`);
            addDebugLog('Audio-Test', `Echo cancel: ${settings.echoCancellation}, Noise suppress: ${settings.noiseSuppression}`);
            
            // Test audio levels
            const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // Quick audio level check
            setTimeout(() => {
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              addDebugLog('Audio-Level', `Audio input level: ${average.toFixed(2)} (0-255 scale)`);
              
              // Cleanup
              stream.getTracks().forEach(track => track.stop());
              audioContext.close();
            }, 1000);
          } else {
            addDebugLog('Audio-Test', 'Stream created but no audio track found');
          }
        }
      } else {
        addDebugLog('Audio-Test', 'getUserMedia not available');
      }
    } catch (error) {
      addDebugLog('Audio-Test', `Microphone test failed: ${error}`);
    }
  }, [addDebugLog]);

  // Initialize speech recognition instance once
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Simple, universal recognition settings
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      
      // Enhanced device and configuration logging
      addDebugLog('Voice-Init', '=== VOICE RECOGNITION SETUP ===');
      detectCapabilities();
      addDebugLog('Config', 'Language: en-IN, Continuous: false, Timeout: 10s');

      recognition.onstart = () => {
        addDebugLog('Voice', 'Started');
        setVoiceState('LISTENING');
      };
      
      // Add audio start event to detect when speech is detected (with type assertion)
      try {
        const extendedRecognition = recognition as unknown as {
          onaudiostart?: () => void;
          onspeechstart?: () => void;
          onspeechend?: () => void;
          onaudioend?: () => void;
        };
        
        extendedRecognition.onaudiostart = () => {
          addDebugLog('Voice', 'Audio detected');
        };
        
        extendedRecognition.onspeechstart = () => {
          addDebugLog('Voice', 'Speech detected');
        };
        
        extendedRecognition.onspeechend = () => {
          addDebugLog('Voice', 'Speech ended');
        };
        
        extendedRecognition.onaudioend = () => {
          addDebugLog('Voice', 'Audio ended');
        };
      } catch (e) {
        addDebugLog('Warning', 'Some audio events not supported');
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Enhanced result analysis
        const results = event.results[0];
        const transcript = results[0]?.transcript || '';
        const confidence = results[0]?.confidence || 0;
        
        // Log detailed result information
        addDebugLog('Voice-Result', `=== RECOGNITION RESULT ===`);
        addDebugLog('Voice-Result', `Transcript: "${transcript}" (length: ${transcript.length})`);
        addDebugLog('Voice-Result', `Confidence: ${confidence.toFixed(3)} (${confidence === 0 ? 'unreliable' : confidence < 0.5 ? 'low' : confidence < 0.8 ? 'medium' : 'high'})`);
        const isFinal = (event.results[0] as unknown as { isFinal?: boolean }).isFinal ?? 'unknown';
        addDebugLog('Voice-Result', `Final: ${isFinal}, Results count: ${event.results.length}`);
        
        // Log all alternatives if available
        for (let i = 0; i < results.length; i++) {
          const alt = results[i];
          addDebugLog('Voice-Alt', `${i + 1}: "${alt.transcript}" (conf: ${alt.confidence.toFixed(3)})`);
        }
        
        // Analyze result quality
        const hasText = transcript && transcript.trim().length > 0;
        const hasReliableConfidence = confidence > 0;
        const isLikelyValid = hasText && (confidence > 0.3 || confidence === 0);
        
        addDebugLog('Voice-Analysis', `HasText: ${hasText}, ReliableConf: ${hasReliableConfidence}, LikelyValid: ${isLikelyValid}`);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Decision logic with detailed logging
        if (hasText && isLikelyValid) {
          addDebugLog('Voice-Decision', 'PROCESSING - Valid transcript detected');
          processVoiceCommand(transcript.trim());
        } else if (hasText && !isLikelyValid) {
          addDebugLog('Voice-Decision', 'REJECTED - Low confidence transcript');
          setVoiceResponse('Speech unclear. Please speak more clearly and try again.');
          setShowVoiceResponse(true);
          setVoiceState('ERROR');
        } else {
          addDebugLog('Voice-Decision', 'REJECTED - No valid transcript');
          setVoiceResponse('No speech detected. Please speak clearly and try again.');
          setShowVoiceResponse(true);
          setVoiceState('ERROR');
        }
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        const errorType = event.error || 'unknown';
        addDebugLog('Voice', `Error - ${errorType}`);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Simple error handling
        switch (errorType) {
          case 'not-allowed':
            setVoiceResponse('Microphone access denied. Please enable microphone permissions.');
            break;
          case 'no-speech':
            setVoiceResponse('No speech detected. Please speak clearly and try again.');
            break;
          case 'network':
            setVoiceResponse('Network error. Please check your connection and try again.');
            break;
          case 'aborted':
            // Don't show error for user-initiated abort
            return;
          default:
            setVoiceResponse('Voice recognition error. Please try again.');
            break;
        }
        
        setShowVoiceResponse(true);
        setVoiceState('ERROR');
        
        // Reset to idle after error
        setTimeout(() => setVoiceState('IDLE'), 2000);
      };

      recognition.onend = () => {
        addDebugLog('Voice', 'Ended');
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Reset to idle
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
  }, [addDebugLog, detectCapabilities, processVoiceCommand]); // Dependencies for debug logging

  const startVoiceRecognition = () => {
    if (voiceState !== 'IDLE') {
      addDebugLog('Voice', `Already active, state: ${voiceState}`);
      return;
    }
    
    if (recognitionRef.current) {
      try {
        addDebugLog('Voice', 'Starting...');
        
        // Simple 10 second timeout for all devices
        timeoutRef.current = setTimeout(() => {
          addDebugLog('Voice', 'Timeout after 10s');
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
          setVoiceState('IDLE');
        }, 10000);
        
        recognitionRef.current.start();
      } catch (error) {
        addDebugLog('Voice', `Start error: ${error}`);
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

      {/* Debug Toggle Button */}
      <button 
        className={`${styles.debugToggleButton} ${showDebugPanel ? styles.active : ''}`}
        onClick={() => setShowDebugPanel(!showDebugPanel)}
        aria-label="Toggle Debug Panel"
        title="Toggle Voice Debug Panel"
      >
        🐛
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

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className={styles.debugPanel}>
          <div className={styles.debugPanelHeader}>
            <span className={styles.debugTitle}>🐛 Voice Debug</span>
            <div className={styles.debugControls}>
              <button 
                className={styles.testButton}
                onClick={detectCapabilities}
                title="Run Capability Detection"
              >
                🔍
              </button>
              <button 
                className={styles.testButton}
                onClick={testMicrophoneCapabilities}
                title="Test Microphone"
              >
                🎤
              </button>
              <button 
                className={styles.clearLogsButton}
                onClick={() => setDebugLogs([])}
                title="Clear Logs"
              >
                🗑️
              </button>
              <button 
                className={styles.closeDebugPanel}
                onClick={() => setShowDebugPanel(false)}
                title="Close Debug Panel"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className={styles.debugFilterTabs}>
            {[
              { key: 'all', label: 'All', icon: '📋' },
              { key: 'capability', label: 'Capability', icon: '🔧' },
              { key: 'permission', label: 'Permission', icon: '🔐' },
              { key: 'voice', label: 'Voice', icon: '🎙️' },
              { key: 'audio', label: 'Audio', icon: '🔊' }
            ].map(filter => (
              <button
                key={filter.key}
                className={`${styles.filterTab} ${debugFilter === filter.key ? styles.activeFilter : ''}`}
                onClick={() => setDebugFilter(filter.key as any)}
                title={`Filter ${filter.label} logs`}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
          
          <div className={styles.debugLogContainer}>
            {(() => {
              const filteredLogs = getFilteredLogs();
              return filteredLogs.length === 0 ? (
                <div className={styles.debugEmptyState}>
                  {debugLogs.length === 0 
                    ? "No debug logs yet. Try voice recognition or click test buttons..."
                    : `No ${debugFilter} logs found. Try a different filter or run tests.`
                  }
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div key={index} className={styles.debugLogEntry}>
                    {log}
                  </div>
                ))
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingVoiceAssistant;