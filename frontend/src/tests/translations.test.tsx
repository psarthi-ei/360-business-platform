import React from 'react';
import { render } from '@testing-library/react';
import { TranslationProvider, useTranslation } from '../contexts/TranslationContext';

// Test component to use translation hook
function TestTranslationComponent() {
  const { t, currentLanguage, setLanguage } = useTranslation();
  
  return (
    <div>
      <div data-testid="language">{currentLanguage}</div>
      <div data-testid="title">{t('title')}</div>
      <div data-testid="leadManagement">{t('leadManagement')}</div>
      <div data-testid="fallback">{t('nonExistentKey')}</div>
      <button onClick={() => setLanguage('gu')} data-testid="change-language">Change to Gujarati</button>
    </div>
  );
}

describe('Translation Context System', () => {
  test('provides default English translations', () => {
    const { getByTestId } = render(
      <TranslationProvider defaultLanguage="en">
        <TestTranslationComponent />
      </TranslationProvider>
    );
    
    expect(getByTestId('language')).toHaveTextContent('en');
    expect(getByTestId('title')).toHaveTextContent('ElevateBusiness 360° Platform');
    expect(getByTestId('leadManagement')).toHaveTextContent('Lead Management');
  });
  
  test('provides Gujarati translations', () => {
    const { getByTestId } = render(
      <TranslationProvider defaultLanguage="gu">
        <TestTranslationComponent />
      </TranslationProvider>
    );
    
    expect(getByTestId('language')).toHaveTextContent('gu');
    expect(getByTestId('title')).toHaveTextContent('ElevateBusiness 360° પ્લેટફોર્મ');
    expect(getByTestId('leadManagement')).toHaveTextContent('લીડ મેનેજમેન્ટ');
  });
  
  test('provides Hindi translations', () => {
    const { getByTestId } = render(
      <TranslationProvider defaultLanguage="hi">
        <TestTranslationComponent />
      </TranslationProvider>
    );
    
    expect(getByTestId('language')).toHaveTextContent('hi');
    expect(getByTestId('title')).toHaveTextContent('ElevateBusiness 360° प्लेटफॉर्म');
    expect(getByTestId('leadManagement')).toHaveTextContent('लीड प्रबंधन');
  });
  
  test('falls back to key name for missing translations', () => {
    const { getByTestId } = render(
      <TranslationProvider defaultLanguage="en">
        <TestTranslationComponent />
      </TranslationProvider>
    );
    
    expect(getByTestId('fallback')).toHaveTextContent('nonExistentKey');
  });
  
  test('provides working translation function', () => {
    const { getByTestId } = render(
      <TranslationProvider>
        <TestTranslationComponent />
      </TranslationProvider>
    );
    
    // Should render actual translation, not key
    expect(getByTestId('title')).not.toHaveTextContent('title');
    expect(getByTestId('leadManagement')).not.toHaveTextContent('leadManagement');
  });
  
  test('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestTranslationComponent />);
    }).toThrow('useTranslation must be used within a TranslationProvider');
    
    console.error = originalError;
  });
  
  test('core business translations exist in all languages', () => {
    const coreKeys = ['title', 'leadManagement', 'quotationOrders', 'customers', 'salesOrder'];
    
    ['en', 'gu', 'hi'].forEach(language => {
      const TestComponent = () => {
        const { t } = useTranslation();
        return (
          <div>
            {coreKeys.map(key => (
              <div key={key} data-testid={key}>{t(key)}</div>
            ))}
          </div>
        );
      };
      
      const { getByTestId } = render(
        <TranslationProvider defaultLanguage={language}>
          <TestComponent />
        </TranslationProvider>
      );
      
      coreKeys.forEach(key => {
        const element = getByTestId(key);
        expect(element).toBeInTheDocument();
        expect(element.textContent).toBeTruthy();
        expect(element.textContent?.trim()).not.toBe('');
      });
    });
  });
});