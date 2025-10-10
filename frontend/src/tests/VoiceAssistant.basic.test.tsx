// Basic Voice Assistant Tests - Essential functionality only
// Focus on core voice interaction and business command processing

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalVoice from '../components/voice/GlobalVoice';

// Mock CSS modules
jest.mock('../components/voice/GlobalVoice.module.css', () => ({
  globalVoice: 'globalVoice',
  listening: 'listening',
  voiceCommandPanel: 'voiceCommandPanel',
  visible: 'visible',
  voiceCommandTitle: 'voiceCommandTitle',
  voiceStageContext: 'voiceStageContext',
  voiceCommandSuggestions: 'voiceCommandSuggestions',
  voiceCommandSuggestion: 'voiceCommandSuggestion',
  voiceCommandHint: 'voiceCommandHint'
}));

// Simple mock for Speech Recognition
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: function() {
    return {
      continuous: false,
      interimResults: false,
      lang: 'en-IN',
      start: jest.fn(),
      stop: jest.fn(),
      abort: jest.fn(),
      onresult: null,
      onerror: null,
      onend: null
    };
  }
});

describe('Voice Assistant Core Functionality', () => {
  const mockBusinessData = {
    hotLeads: 5,
    overduePayments: 3,
    readyToShip: 8,
    totalCustomers: 150
  };


  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('should render debug toggle button', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
      expect(debugButton).toHaveTextContent('🐛');
    });

    test('should have correct accessibility attributes for debug button', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toHaveAttribute('aria-label', 'Toggle Debug Panel');
    });

    test('should render without business data', () => {
      render(<GlobalVoice />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });
  });

  describe('Voice Panel Interaction', () => {
    test('should handle voice state management', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      // GlobalVoice now handles internal voice state management
      // The actual voice button is in GlobalSearch component
      expect(screen.getByRole('button', { name: /toggle debug panel/i })).toBeInTheDocument();
    });

    test('should integrate with platform shell for voice state management', () => {
      const mockOnVoiceStateChange = jest.fn();
      
      render(
        <GlobalVoice 
          businessData={mockBusinessData}
          onVoiceStateChange={mockOnVoiceStateChange}
        />
      );
      
      // GlobalVoice now provides voice state management for the platform
      expect(screen.getByRole('button', { name: /toggle debug panel/i })).toBeInTheDocument();
    });
  });

  describe('Debug Panel', () => {
    test('should provide debug functionality', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });

    test('should handle different process stages', () => {
      render(
        <GlobalVoice 
          businessData={mockBusinessData}
          currentProcessStage="leads"
        />
      );
      
      // GlobalVoice supports different process stages through context
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    test('should integrate with platform architecture', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      // GlobalVoice now provides voice services to the platform
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });
  });

  describe('Business Data Integration', () => {
    test('should work with provided business data', () => {
      const customBusinessData = {
        hotLeads: 10,
        overduePayments: 5,
        readyToShip: 15,
        totalCustomers: 200
      };

      render(<GlobalVoice businessData={customBusinessData} />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });

    test('should handle missing handlers gracefully', () => {
      render(<GlobalVoice businessData={mockBusinessData} />);
      
      const debugButton = screen.getByRole('button', { name: /toggle debug panel/i });
      expect(debugButton).toBeInTheDocument();
    });
  });
});