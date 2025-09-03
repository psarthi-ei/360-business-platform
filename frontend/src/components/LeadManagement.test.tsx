import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LeadManagement from './LeadManagement';
import { getCurrentTranslations } from '../utils/translations';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: getCurrentTranslations('en'),
  filterState: 'all',
  onFilterChange: jest.fn()
};

describe('LeadManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI structure', () => {
    render(<LeadManagement {...mockProps} />);
    
    // Test that core UI elements exist
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/lead management/i)).toBeInTheDocument();
    expect(screen.getByText(/add new lead/i)).toBeInTheDocument();
  });

  test('renders filter functionality', () => {
    render(<LeadManagement {...mockProps} />);
    
    // Test that filter buttons exist and are functional
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hot lead/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /warm lead/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cold lead/i })).toBeInTheDocument();
  });

  test('filter buttons are interactive', () => {
    render(<LeadManagement {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hot lead/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('hotleads');

    fireEvent.click(screen.getByRole('button', { name: /warm lead/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('warmleads');

    fireEvent.click(screen.getByRole('button', { name: /cold lead/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('coldleads');

    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays leads container', () => {
    render(<LeadManagement {...mockProps} />);
    
    // Test that leads are displayed (without caring about specific content)
    expect(document.querySelector('.leads-container')).toBeInTheDocument();
    expect(document.querySelectorAll('.lead-card').length).toBeGreaterThan(0);
  });

  test('leads have action buttons', () => {
    render(<LeadManagement {...mockProps} />);
    
    // Test that action buttons exist (without caring about exact count or specific leads)
    expect(screen.getAllByText(/call now|call/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/whatsapp/i)).toBeInTheDocument();
    expect(screen.getAllByText(/send quote|quote/i).length).toBeGreaterThan(0);
  });

  test('navigation works', () => {
    render(<LeadManagement {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter is highlighted', () => {
    const activeHotProps = { ...mockProps, filterState: 'hotleads' };
    render(<LeadManagement {...activeHotProps} />);
    
    const hotButton = screen.getByRole('button', { name: /hot lead/i });
    expect(hotButton).toHaveClass('active');
  });

  test('language switcher is present', () => {
    render(<LeadManagement {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ગુજરાતી/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  test('language switching works', () => {
    render(<LeadManagement {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /ગુજરાતી/i }));
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('gu');

    fireEvent.click(screen.getByRole('button', { name: /हिंदी/i }));
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('hi');
  });

  test('voice commands section exists', () => {
    render(<LeadManagement {...mockProps} />);
    
    expect(document.querySelector('.voice-commands')).toBeInTheDocument();
    expect(screen.getByText(/try saying|voice commands/i)).toBeInTheDocument();
  });

  test('renders with different languages', () => {
    const guProps = {
      ...mockProps,
      currentLanguage: 'gu',
      translations: getCurrentTranslations('gu')
    };
    
    render(<LeadManagement {...guProps} />);
    
    // Test that Gujarati translations are used
    expect(screen.getByText(/લીડ મેનેજમેન્ટ/)).toBeInTheDocument();
    expect(screen.getByText(/ડેશબોર્ડ પર પાછા જાઓ/)).toBeInTheDocument();
  });
});