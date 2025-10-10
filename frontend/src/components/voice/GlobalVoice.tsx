import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { nlpService } from '../../services/nlp/NLPService';
import { NLPResult, ActionParams } from '../../services/nlp/types';
import styles from './GlobalVoice.module.css';

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

// Voice control interface for external components
export interface VoiceControlRef {
  startVoiceRecognition: () => void;
  showVoiceSuggestions?: (buttonPosition: { x: number; y: number; width: number; height: number }) => void;
  voiceState: 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';
}

interface GlobalVoiceProps {
  currentProcessStage?: string;
  // Universal action handler for all voice commands
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
  businessData?: {
    hotLeads: number;
    overduePayments: number;
    readyToShip: number;
    totalCustomers: number;
  };
  onPerformSearch?: (query: string) => void;
  // External debug control for mobile header integration
  externalDebugState?: boolean;
  onDebugToggle?: (isOpen: boolean) => void;
  // Voice state synchronization for external components
  onVoiceStateChange?: (state: 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR') => void;
}

// Simplified Universal Routing - All commands go through VoiceCommandRouter
// No context detection needed - App.tsx VoiceCommandRouter handles all routing logic
function routeUniversalAction(
  actionType: string, 
  params: ActionParams, 
  onUniversalAction?: (actionType: string, params?: ActionParams) => void
): void {
  // eslint-disable-next-line no-console
  console.log(`🎯 Universal routing: action=${actionType}`);
  
  if (onUniversalAction) {
    onUniversalAction(actionType, params);
  } else {
    // eslint-disable-next-line no-console
    console.warn('⚠️ No universal action handler provided');
  }
}

const GlobalVoice = forwardRef<VoiceControlRef, GlobalVoiceProps>(function GlobalVoice({
  currentProcessStage = 'dashboard',
  onUniversalAction,
  businessData,
  onPerformSearch,
  externalDebugState,
  onDebugToggle,
  onVoiceStateChange
}, ref) {
  // const { t } = useTranslation(); // Translation available if needed
  
  // Voice recognition state machine
  type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [voiceResponse, setVoiceResponse] = useState('');
  const [showVoiceResponse, setShowVoiceResponse] = useState(false);
  const [voicePanelPosition, setVoicePanelPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Helper function to update voice state and sync with external components
  const syncVoiceState = useCallback((newState: VoiceState) => {
    setVoiceState(newState);
    onVoiceStateChange?.(newState);
  }, [onVoiceStateChange]);
  
  // Speech recognition instance ref to prevent multiple instances
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (voicePanelPosition && !target.closest(`.${styles.voiceCommandPanel}`)) {
        setVoicePanelPosition(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [voicePanelPosition]);

  // Escape key detection
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && voicePanelPosition) {
        setVoicePanelPosition(null);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [voicePanelPosition]);

  // External voice state propagation - separate from recognition event handlers for performance
  useEffect(() => {
    onVoiceStateChange?.(voiceState);
  }, [voiceState, onVoiceStateChange]);

  // Context-aware voice command suggestions - shows universal + page-specific commands
  const getProcessVoiceCommands = (stage: string) => {
    // Universal commands that work from any page
    const universalCommands = [
      'Go to dashboard',
      'हॉट लीड्स खोजें',
      'Add new lead'
    ];
    
    // Page-specific commands for current context
    const contextCommands = {
      'dashboard': [
        'Search Mumbai cotton mills',
        'કોટન ઓર્ડર શોધો'
      ],
      'leads': [
        'Set priority to hot',
        'गुजरात के लीड्स खोजें'
      ],
      'quotes': [
        'Approve this quote',
        'હાઈ વેલ્યુ ક્વોટ્સ શોધો'
      ],
      'orders': [
        'प्रोडक्शन के लिए तैयार करें',
        'ઉત્પાદન સ્ટેટસ બતાવો'
      ],
      'payments': [
        'पेमेंट रिकॉर्ड करें',
        'બકાયા પેમેન્ટ શોધો'
      ],
      'inventory': [
        'स्टॉक चेक करें',
        'સ્ટોક ચેક કરો'
      ],
      'fulfillment': [
        'शिपमेंट तैयार करें',
        'શિપિંગ સ્ટેટસ બતાવો'
      ],
      'customers': [
        'कस्टमर प्रोफाइल देखें',
        'વીઆઈપી ગ્રાહકો શોધો'
      ],
      'invoices': [
        'Send invoice',
        'बकाया इनवॉइस खोजें'
      ],
      'analytics': [
        'Generate report',
        'મંથલી સેલ્સ બતાવો'
      ]
    };
    
    // Combine universal commands with context-specific ones
    const contextSpecific = contextCommands[stage as keyof typeof contextCommands] || contextCommands.dashboard;
    return [...universalCommands, ...contextSpecific];
  };

  // Modern navigation helper - uses only context-aware routing
  const navigateToTarget = useCallback((target: string | undefined) => {
    if (!target || !onUniversalAction) return;
    
    // Normalize target (handle both singular and plural)
    const normalizedTarget = target.toLowerCase();
    
    // Convert to universal navigation action type
    let actionType = '';
    
    switch (normalizedTarget) {
      case 'lead':
      case 'leads':
        actionType = 'NAVIGATE_TO_LEADS';
        break;
      case 'payment':
      case 'payments':
        actionType = 'NAVIGATE_TO_PAYMENTS';
        break;
      case 'customer':
      case 'customers':
        actionType = 'NAVIGATE_TO_CUSTOMERS';
        break;
      case 'order':
      case 'orders':
        actionType = 'NAVIGATE_TO_ORDERS';
        break;
      case 'quote':
      case 'quotes':
        actionType = 'NAVIGATE_TO_QUOTES';
        break;
      case 'invoice':
      case 'invoices':
        actionType = 'NAVIGATE_TO_INVOICES';
        break;
      case 'inventory':
        actionType = 'NAVIGATE_TO_INVENTORY';
        break;
      case 'analytics':
        actionType = 'NAVIGATE_TO_ANALYTICS';
        break;
      case 'production':
        actionType = 'NAVIGATE_TO_ORDERS'; // Production is handled by orders page
        break;
      case 'fulfillment':
        actionType = 'NAVIGATE_TO_FULFILLMENT';
        break;
      case 'dashboard':
        actionType = 'NAVIGATE_TO_DASHBOARD';
        break;
      default:
        return; // Unknown target
    }
    
    onUniversalAction(actionType, { target: normalizedTarget });
  }, [onUniversalAction]);

  const extractSearchQuery = useCallback((result: NLPResult): string | null => {
    // Use new structured payload from Universal Command Processor
    // eslint-disable-next-line no-console
    console.log('🔧 extractSearchQuery called with result:', result);
    if (result.payload && result.payload.query) {
      // eslint-disable-next-line no-console
      console.log('✅ Found query in payload:', result.payload.query);
      return result.payload.query;
    }
    
    // Fallback for legacy results without payload
    if (result.originalText) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Using fallback originalText:', result.originalText);
      // This should rarely happen with the new architecture
      return result.originalText.trim();
    }
    
    // eslint-disable-next-line no-console
    console.log('❌ No query found in result');
    return null;
  }, []);

  // Execute actions based on detected intent and NLP result
  const executeVoiceAction = useCallback(async (nlpResult: NLPResult) => {
    // Handle both possible structures: nlpResult.intent as string or as object with intent property
    const intent = typeof nlpResult.intent === 'string' ? nlpResult.intent : (nlpResult.intent as { intent?: string })?.intent;
    // eslint-disable-next-line no-console
    console.log('🎯 executeVoiceAction called with intent:', intent, 'full result:', nlpResult);
    
    switch (intent) {
      case 'SEARCH_COMMAND':
        // eslint-disable-next-line no-console
        console.log('🔍 SEARCH_COMMAND case reached, onPerformSearch:', !!onPerformSearch);
        if (onPerformSearch) {
          const searchQuery = extractSearchQuery(nlpResult);
          // eslint-disable-next-line no-console
          console.log('🔍 Extracted search query:', searchQuery, 'from result:', nlpResult);
          if (searchQuery) {
            // eslint-disable-next-line no-console
            console.log('🚀 Calling onPerformSearch with query:', searchQuery);
            onPerformSearch(searchQuery);
            // Close voice panel to show search results
            setVoicePanelPosition(null);
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
          setVoicePanelPosition(null);
          break;
        }
        
        // Use modern navigation for page routing
        if (target) {
          navigateToTarget(target);
        }
        break;
      
      // Create/Add command support - context-aware routing only
      case 'CREATE_COMMAND':
        const createTarget = nlpResult.payload?.target;
        if (createTarget) {
          // Map target to action type for context detection
          let actionType = '';
          switch (createTarget.toLowerCase()) {
            case 'lead':
            case 'leads':
              actionType = 'ADD_NEW_LEAD';
              break;
            case 'quote':
            case 'quotes':
              actionType = 'CREATE_QUOTE';
              break;
            case 'order':
            case 'orders':
              actionType = 'CREATE_ORDER';
              break;
            case 'customer':
            case 'customers':
              actionType = 'ADD_NEW_CUSTOMER';
              break;
            default:
              // For unknown create targets, default to lead creation
              actionType = 'ADD_NEW_LEAD';
              break;
          }
          
          // Use universal routing for all create commands
          routeUniversalAction(actionType, nlpResult.payload || {}, onUniversalAction);
        }
        break;
      
      // Generic action dispatcher - supports all business page actions with context awareness
      case 'SET_PRIORITY_COMMAND':
        if (nlpResult.payload) {
          // eslint-disable-next-line no-console
          console.log('🎯 Dispatching SET_PRIORITY action with universal routing:', nlpResult.payload);
          routeUniversalAction('SET_PRIORITY', nlpResult.payload || {}, onUniversalAction);
        }
        break;
        
      case 'HELP_COMMAND':
        // Help response already generated
        break;
      default:
        // UNKNOWN_INTENT - no action needed, response already set
        break;
    }
  }, [onPerformSearch, extractSearchQuery, navigateToTarget, onUniversalAction]);

  // Enhanced voice command processing with NLP
  const processVoiceCommand = useCallback(async (command: string) => {
    // eslint-disable-next-line no-console
    console.log('🧠 Processing voice command:', command);
    
    // Debug logging for NLP processing
    addDebugLog('NLP-Input', `=== PROCESSING VOICE COMMAND ===`);
    addDebugLog('NLP-Input', `Original: "${command}" (length: ${command.length})`);
    addDebugLog('NLP-Input', `Languages detected: ${command.match(/[\u0900-\u097F]/) ? 'Hindi ' : ''}${command.match(/[\u0A80-\u0AFF]/) ? 'Gujarati ' : ''}${command.match(/[a-zA-Z]/) ? 'English' : ''}`.trim());
    
    syncVoiceState('PROCESSING'); // Show processing state
    
    try {
      // Use new NLP service for command processing
      // eslint-disable-next-line no-console
      console.log('🔥 About to call nlpService.processVoiceCommand with:', command, 'nlpService:', nlpService);
      const result = await nlpService.processVoiceCommand(command, businessData, currentProcessStage);
      
      // eslint-disable-next-line no-console
      console.log('🧠 NLP result:', result);
      
      // Detailed NLP result logging
      addDebugLog('NLP-Result', `Intent: ${result.intent} (confidence: ${result.confidence})`);
      addDebugLog('NLP-Result', `Language: ${result.language}, Method: ${result.processingMethod || 'local'}`);
      
      // Log payload details if available
      if (result.payload) {
        const payload = result.payload;
        addDebugLog('NLP-Payload', `Action: ${payload.action || 'none'}, Target: ${payload.target || 'none'}`);
        addDebugLog('NLP-Payload', `Query: "${payload.query || 'none'}" (extracted content)`);
        
        if (payload.filters && payload.filters.length > 0) {
          addDebugLog('NLP-Payload', `Filters: [${payload.filters.join(', ')}]`);
        }
        
        if (payload.parameters && Object.keys(payload.parameters).length > 0) {
          addDebugLog('NLP-Payload', `Parameters: ${JSON.stringify(payload.parameters)}`);
        }
      }
      
      // Log fuzzy matching usage (inferred from confidence patterns)
      if (result.confidence === 0.95) {
        addDebugLog('NLP-Fuzzy', 'Fuzzy matching used - normalized form matched');
      } else if (result.confidence >= 0.7 && result.confidence < 1.0) {
        addDebugLog('NLP-Fuzzy', 'Possible fuzzy matching or pattern recognition');
      } else if (result.confidence === 1.0) {
        addDebugLog('NLP-Fuzzy', 'Exact match found - no fuzzy processing needed');
      }
      
      // Execute the appropriate action based on intent (pass full result)
      // eslint-disable-next-line no-console
      console.log('⚡ About to call executeVoiceAction with result:', result);
      
      if (result.intent !== 'UNKNOWN_INTENT') {
        addDebugLog('NLP-Action', `Executing ${result.intent} with extracted data`);
        if (result.payload?.query) {
          addDebugLog('NLP-Action', `Search query: "${result.payload.query}"`);
        }
        if (result.payload?.target) {
          addDebugLog('NLP-Action', `Target system: ${result.payload.target}`);
        }
      }
      
      await executeVoiceAction(result);
      // eslint-disable-next-line no-console
      console.log('✅ executeVoiceAction completed successfully');
      
      addDebugLog('NLP-Action', `✅ Command executed successfully`);
      
      // Close suggestion panel after any voice command
      setVoicePanelPosition(null);
      
      // Only show popup for unknown intents and errors
      if (result.intent === 'UNKNOWN_INTENT') {
        addDebugLog('NLP-Result', `❌ Unknown intent - command not recognized`);
        setVoiceResponse(result.response);
        setShowVoiceResponse(true);
        syncVoiceState('ERROR');
      } else {
        syncVoiceState('IDLE');
      }
      
    } catch (error) {
      // Voice command processing error occurred
      addDebugLog('NLP-Error', `❌ Processing failed: ${error}`);
      addDebugLog('NLP-Error', `Command: "${command}"`);
      setVoiceResponse('Sorry, I couldn\'t process that command. Please try again.');
      setShowVoiceResponse(true);
      syncVoiceState('ERROR');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData, currentProcessStage, executeVoiceAction]);

  // Debug logging state - with external control support
  const [internalDebugPanel, setInternalDebugPanel] = useState(false);
  const showDebugPanel = externalDebugState !== undefined ? externalDebugState : internalDebugPanel;
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [debugFilter, setDebugFilter] = useState<'all' | 'voice' | 'audio' | 'permission' | 'capability' | 'nlp'>('all');

  // Debug panel toggle handler
  const handleDebugToggle = (newState: boolean) => {
    if (onDebugToggle) {
      onDebugToggle(newState);
    } else {
      setInternalDebugPanel(newState);
    }
  };
  
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
      audio: ['Mic-Test', 'Audio-Test', 'Audio-Level'],
      nlp: ['NLP-Input', 'NLP-Result', 'NLP-Payload', 'NLP-Fuzzy', 'NLP-Action', 'NLP-Error']
    } as const;
    
    const keywords = categoryKeywords[debugFilter as keyof typeof categoryKeywords] || [];
    return debugLogs.filter(log => 
      keywords.some((keyword: string) => log.includes(`] ${keyword}:`))
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

  // Direct speech recognition test - bypasses all integration
  const testDirectSpeechRecognition = useCallback(() => {
    addDebugLog('Test', '=== DIRECT SPEECH RECOGNITION TEST ===');
    addDebugLog('Test', 'Starting isolated speech recognition test...');
    
    if (recognitionRef.current && voiceState === 'IDLE') {
      try {
        // Direct recognition start without going through integration
        addDebugLog('Test', 'Starting recognition directly...');
        (window as unknown as { voiceStartTime: number }).voiceStartTime = Date.now();
        
        // Set listening state
        syncVoiceState('LISTENING');
        
        // Start recognition directly
        recognitionRef.current.start();
        
        // Add test timeout
        setTimeout(() => {
          addDebugLog('Test', `Voice state after 5 seconds: ${voiceState}`);
        }, 5000);
        
      } catch (error) {
        addDebugLog('Test', `Direct test failed: ${error}`);
        syncVoiceState('ERROR');
      }
    } else {
      addDebugLog('Test', `Cannot test: Recognition=${!!recognitionRef.current}, State=${voiceState}`);
    }
  }, [addDebugLog, voiceState, syncVoiceState]);

  // Initialize speech recognition instance once
  useEffect(() => {
    // Check for existing instances
    if (recognitionRef.current) {
      addDebugLog('Instance', 'Recognition already exists, cleaning up...');
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    
    // Track global instances for debugging
    if (!(window as any).speechRecognitionInstances) {
      (window as any).speechRecognitionInstances = 0;
    }
    (window as any).speechRecognitionInstances++;
    addDebugLog('Instance', `Creating recognition instance #${(window as any).speechRecognitionInstances}`);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Simple, universal recognition settings - PRODUCTION WORKING CONFIG
      recognition.continuous = false;  // Single-shot recognition (working in production)
      recognition.interimResults = false;  // Final results only (working in production)
      recognition.lang = 'en-IN';  // Original working language from production
      
      // Enhanced device and configuration logging
      addDebugLog('Voice-Init', '=== VOICE RECOGNITION SETUP ===');
      addDebugLog('Config', 'Language: en-IN, Continuous: false, InterimResults: false, Timeout: 10s');

      recognition.onstart = () => {
        addDebugLog('Voice', 'Started');
        addDebugLog('Voice-Events', 'onstart event fired - recognition successfully started');
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
          addDebugLog('Voice-Events', '✅ onaudiostart - Microphone audio detected');
          // Track audio events
          (window as any).voiceAudioEvents = ((window as any).voiceAudioEvents || 0) + 1;
        };
        
        extendedRecognition.onspeechstart = () => {
          addDebugLog('Voice', 'Speech detected');
          addDebugLog('Voice-Events', '✅ onspeechstart - Speech input detected');
        };
        
        extendedRecognition.onspeechend = () => {
          addDebugLog('Voice', 'Speech ended');
          addDebugLog('Voice-Events', '⏹️ onspeechend - Speech input ended');
        };
        
        extendedRecognition.onaudioend = () => {
          addDebugLog('Voice', 'Audio ended');
          addDebugLog('Voice-Events', '⏹️ onaudioend - Microphone audio ended');
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
        // eslint-disable-next-line no-console
        console.log('🎯 Speech Recognition Error:', errorType, event);
        addDebugLog('Voice-Error', `=== ERROR EVENT DETAILS ===`);
        addDebugLog('Voice-Error', `Error type: ${errorType}`);
        addDebugLog('Voice-Error', `Error message: ${event.error?.message || 'none'}`);
        addDebugLog('Voice-Error', `Event object: ${JSON.stringify(event)}`);
        addDebugLog('Voice-Error', `Error occurred during recognition`);
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
        
        // Enhanced logging to understand why it ended
        addDebugLog('Voice-End', `=== RECOGNITION END ANALYSIS ===`);
        addDebugLog('Voice-End', `Timeout active: ${!!timeoutRef.current}`);
        addDebugLog('Voice-End', `Recognition continuous: ${recognitionRef.current?.continuous}`);
        addDebugLog('Voice-End', `Recognition lang: ${recognitionRef.current?.lang}`);
        addDebugLog('Voice-End', `Global instances count: ${(window as any).speechRecognitionInstances || 'unknown'}`);
        
        // Check if any audio events were fired
        const audioEventsDetected = (window as any).voiceAudioEvents || 0;
        addDebugLog('Voice-End', `Audio events detected: ${audioEventsDetected}`);
        
        // Check if this is an unexpected early end
        const now = Date.now();
        const timeSinceStart = now - ((window as unknown as { voiceStartTime?: number }).voiceStartTime || 0);
        addDebugLog('Voice-End', `Time since start: ${timeSinceStart}ms`);
        
        if (timeSinceStart < 1000) {
          addDebugLog('Voice-End', '⚠️ EARLY END: Recognition ended within 1 second!');
          addDebugLog('Voice-End', 'This suggests a configuration or permission issue');
        } else if (timeSinceStart < 5000) {
          addDebugLog('Voice-End', '⚠️ SHORT SESSION: Recognition ended quickly');
        } else {
          addDebugLog('Voice-End', '✅ NORMAL END: Recognition ran for reasonable time');
        }
        
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependencies like production - initialize once only

  const startVoiceRecognition = useCallback(() => {
    if (voiceState !== 'IDLE') {
      addDebugLog('Voice', `Already active, state: ${voiceState}`);
      return;
    }
    
    if (recognitionRef.current) {
      try {
        addDebugLog('Voice', 'Starting...');
        
        // Track start time for end analysis
        (window as unknown as { voiceStartTime: number }).voiceStartTime = Date.now();
        
        // Simple 10 second timeout for all devices
        timeoutRef.current = setTimeout(() => {
          addDebugLog('Voice', 'Timeout after 10s');
          if (recognitionRef.current) {
            recognitionRef.current.abort();
          }
          syncVoiceState('IDLE');
        }, 10000);
        
        recognitionRef.current.start();
      } catch (error) {
        addDebugLog('Voice', `Start error: ${error}`);
        syncVoiceState('ERROR');
        setVoiceResponse('Could not start voice recognition. Please try again.');
        setShowVoiceResponse(true);
        setTimeout(() => syncVoiceState('IDLE'), 2000);
      }
    }
  }, [voiceState, addDebugLog, syncVoiceState]);

  // Calculate optimal panel position based on viewport bounds and device type
  const calculatePanelPosition = (buttonPosition: { x: number; y: number; width: number; height: number }) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Panel dimensions (approximate)
    const panelWidth = 280; // Base panel width
    const panelHeight = 200; // Approximate panel height
    const isMobile = viewport.width <= 768;
    
    if (isMobile) {
      // Mobile: Position below search bar, center horizontally relative to search bar
      let x = Math.max(10, (viewport.width - panelWidth) / 2); // Center with margins
      let y = buttonPosition.y + buttonPosition.height + 8; // 8px below search bar
      
      // Ensure panel doesn't overflow right edge
      if (x + panelWidth > viewport.width - 10) {
        x = viewport.width - panelWidth - 10;
      }
      
      // Ensure panel doesn't overflow bottom (push up if needed)
      if (y + panelHeight > viewport.height - 60) { // 60px margin for bottom nav
        y = viewport.height - panelHeight - 60;
      }
      
      return {
        x,
        y,
        width: Math.min(panelWidth, viewport.width - 20), // Max width with margins
        height: buttonPosition.height
      };
    } else {
      // Desktop: Smart positioning relative to button
      let x = buttonPosition.x;
      let y = buttonPosition.y + buttonPosition.height + 8;
      
      // Prevent overflow right
      if (x + panelWidth > viewport.width - 20) {
        x = viewport.width - panelWidth - 20;
      }
      
      // Prevent overflow left
      if (x < 20) {
        x = 20;
      }
      
      // Prevent overflow bottom
      if (y + panelHeight > viewport.height - 20) {
        y = buttonPosition.y - panelHeight - 8; // Position above button
      }
      
      return {
        x,
        y,
        width: buttonPosition.width,
        height: buttonPosition.height
      };
    }
  };

  // Expose voice control interface to parent components
  useImperativeHandle(ref, () => ({
    startVoiceRecognition,
    showVoiceSuggestions: (buttonPosition: { x: number; y: number; width: number; height: number }) => {
      const optimizedPosition = calculatePanelPosition(buttonPosition);
      setVoicePanelPosition(optimizedPosition);
    },
    voiceState
  }), [startVoiceRecognition, voiceState]);

  // Auto-hide voice response after 5 seconds
  useEffect(() => {
    if (showVoiceResponse) {
      const timer = setTimeout(() => {
        setShowVoiceResponse(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showVoiceResponse]);

  // Auto-hide voice panel when voice interaction completes (timeout, error, or success)
  useEffect(() => {
    if (voiceState === 'IDLE' || voiceState === 'ERROR') {
      // Small delay to allow user to see the final state before hiding panel
      const timer = setTimeout(() => {
        setVoicePanelPosition(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voiceState]);

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

      {/* Voice Command Suggestions Panel - Positioned based on triggering search button */}
      {voicePanelPosition && (
        <div 
          className={`${styles.voiceCommandPanel} ${styles.visible}`}
          style={{
            '--panel-x': `${voicePanelPosition.x}px`,
            '--panel-y': `${voicePanelPosition.y + 8}px`,
          } as React.CSSProperties}
        >
          <div className={styles.voiceCommandPanelHeader}>
            <span className={styles.voiceCommandTitle}>Voice Commands</span>
            <button 
              className={styles.closeVoicePanel}
              onClick={() => setVoicePanelPosition(null)}
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
                  setVoicePanelPosition(null);
                }}
              >
                {command}
              </li>
            ))}
          </ul>
          
          <div className={styles.voiceCommandHint}>
            🔍 <strong>Search anywhere:</strong> "Search Mumbai cotton" • "Search hot leads" • "Add new lead" • "Go to payments"
          </div>
        </div>
      )}

      {/* Debug Toggle Button - Desktop Only */}
      <button 
        className={`${styles.debugToggleButton} ${showDebugPanel ? styles.active : ''}`}
        onClick={() => handleDebugToggle(!showDebugPanel)}
        aria-label="Toggle Debug Panel"
        title="Toggle Voice Debug Panel"
      >
        🐛
      </button>

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
                className={styles.testButton}
                onClick={testDirectSpeechRecognition}
                title="Direct Speech Recognition Test"
              >
                🗣️
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
                onClick={() => handleDebugToggle(false)}
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
              { key: 'voice', label: 'Voice', icon: '🎙️' },
              { key: 'nlp', label: 'NLP', icon: '🧠' },
              { key: 'audio', label: 'Audio', icon: '🔊' },
              { key: 'permission', label: 'Permission', icon: '🔐' },
              { key: 'capability', label: 'Capability', icon: '🔧' }
            ].map(filter => (
              <button
                key={filter.key}
                className={`${styles.filterTab} ${debugFilter === filter.key ? styles.activeFilter : ''}`}
                onClick={() => setDebugFilter(filter.key as 'all' | 'voice' | 'audio' | 'permission' | 'capability' | 'nlp')}
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
});

export default GlobalVoice;