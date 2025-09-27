// Basic NLP Core Tests - Essential business functionality only
// Focus on textile industry voice commands and business workflows

import { LocalNLPProvider } from '../services/nlp/LocalNLPProvider';

describe('Core NLP Business Functionality', () => {
  let localProvider: LocalNLPProvider;

  beforeEach(() => {
    localProvider = new LocalNLPProvider();
  });

  describe('Essential Voice Commands', () => {
    test('should recognize basic search commands', async () => {
      const result = await localProvider.processCommand('search Mumbai cotton');
      expect(result.intent).toBe('SEARCH_COMMAND');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should recognize show commands', async () => {
      const result = await localProvider.processCommand('show leads');
      expect(result.intent).toBe('SHOW_COMMAND');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should recognize create commands', async () => {
      const result = await localProvider.processCommand('create lead');
      expect(result.intent).toBe('CREATE_COMMAND');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should handle unknown commands', async () => {
      const result = await localProvider.processCommand('play music');
      expect(result.intent).toBe('UNKNOWN_INTENT');
      expect(result.confidence).toBeLessThanOrEqual(0.1);
    });
  });

  describe('Multilingual Support', () => {
    test('should detect English commands', async () => {
      const result = await localProvider.processCommand('search Mumbai cotton');
      expect(result.language).toBe('en');
    });

    test('should handle Hindi commands', async () => {
      const result = await localProvider.processCommand('खोजें कंपनी');
      expect(['hi', 'mixed']).toContain(result.language);
    });

    test('should handle Gujarati commands', async () => {
      const result = await localProvider.processCommand('શોધો કંપની');
      expect(['gu', 'mixed']).toContain(result.language);
    });
  });

  describe('Business Context', () => {
    test('should handle textile terminology', async () => {
      const result = await localProvider.processCommand('search cotton mills');
      expect(result.intent).toBe('SEARCH_COMMAND');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should work with Indian business locations', async () => {
      const result = await localProvider.processCommand('find Surat mills');
      expect(result.intent).toBe('SEARCH_COMMAND');
    });
  });

  describe('Performance', () => {
    test('should process commands quickly', async () => {
      const startTime = Date.now();
      await localProvider.processCommand('search Mumbai cotton');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});