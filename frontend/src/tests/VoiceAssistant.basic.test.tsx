// Basic Voice Assistant Tests - Essential functionality only
// Focus on core voice interaction and business command processing

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FloatingVoiceAssistant from '../components/FloatingVoiceAssistant';

// Mock CSS modules
jest.mock('../styles/FloatingVoiceAssistant.module.css', () => ({
  floatingVoiceAssistant: 'floatingVoiceAssistant',
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
    test('should render voice assistant button', () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      expect(voiceButton).toBeInTheDocument();
      expect(voiceButton).toHaveTextContent('🎤');
    });

    test('should have correct accessibility attributes', () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      expect(voiceButton).toHaveAttribute('aria-label', 'Voice Assistant');
    });

    test('should render without business data', () => {
      render(<FloatingVoiceAssistant />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      expect(voiceButton).toBeInTheDocument();
    });
  });

  describe('Voice Panel Interaction', () => {
    test('should show voice panel on hover', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Voice Commands')).toBeInTheDocument();
      });
    });

    test('should show default dashboard context', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('🔄 Dashboard Context')).toBeInTheDocument();
      });
    });

    test('should show leads context for leads stage', async () => {
      render(
        <FloatingVoiceAssistant 
          businessData={mockBusinessData}
          currentProcessStage="leads"
        />
      );
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('🔥 Lead Pipeline Context')).toBeInTheDocument();
      });
    });

    test('should hide panel on mouse leave', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      
      fireEvent.mouseEnter(voiceButton);
      await waitFor(() => {
        expect(screen.getByText('Voice Commands')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(voiceButton);
      await waitFor(() => {
        expect(screen.queryByText('Voice Commands')).not.toBeInTheDocument();
      });
    });
  });

  describe('Process Stage Commands', () => {
    test('should show dashboard-specific commands', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Search Mumbai cotton mills')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Show hot leads')).toBeInTheDocument();
      expect(screen.getByText('Check payment status')).toBeInTheDocument();
    });

    test('should show leads-specific commands', async () => {
      render(
        <FloatingVoiceAssistant 
          businessData={mockBusinessData}
          currentProcessStage="leads"
        />
      );
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Search Surat textile leads')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Add new lead')).toBeInTheDocument();
    });

    test('should show multilingual commands', async () => {
      render(
        <FloatingVoiceAssistant 
          businessData={mockBusinessData}
          currentProcessStage="leads"
        />
      );
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('गुजरात के लीड्स खोजें')).toBeInTheDocument();
      });
    });

    test('should show inventory-specific commands', async () => {
      render(
        <FloatingVoiceAssistant 
          businessData={mockBusinessData}
          currentProcessStage="inventory"
        />
      );
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Search cotton stock')).toBeInTheDocument();
      });
      
      expect(screen.getByText('સ્ટોક ચેક કરો')).toBeInTheDocument();
    });
  });

  describe('Keyboard Interaction', () => {
    test('should close panel on Escape key', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Voice Commands')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Voice Commands')).not.toBeInTheDocument();
      });
    });

    test('should ignore non-escape keys', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText('Voice Commands')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(document, { key: 'Enter' });
      
      // Panel should still be visible
      expect(screen.getByText('Voice Commands')).toBeInTheDocument();
    });
  });

  describe('Textile Industry Context', () => {
    test('should show textile-specific command suggestions', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        const mumbaiTexts = screen.getAllByText(/Mumbai cotton/);
        expect(mumbaiTexts.length).toBeGreaterThan(0);
      });
      
      expect(screen.getByText(/કોટન ઓર્ડર/)).toBeInTheDocument();
    });

    test('should show location-specific suggestions', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        // Should contain references to Indian business locations
        const commands = screen.getAllByText(/Mumbai|Surat|Gujarat/i);
        expect(commands.length).toBeGreaterThan(0);
      });
    });

    test('should show multilingual hint', async () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      fireEvent.mouseEnter(voiceButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Mumbai cotton खोजें/)).toBeInTheDocument();
      });
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

      render(<FloatingVoiceAssistant businessData={customBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      expect(voiceButton).toBeInTheDocument();
    });

    test('should handle missing handlers gracefully', () => {
      render(<FloatingVoiceAssistant businessData={mockBusinessData} />);
      
      const voiceButton = screen.getByRole('button', { name: /voice assistant/i });
      expect(voiceButton).toBeInTheDocument();
    });
  });
});