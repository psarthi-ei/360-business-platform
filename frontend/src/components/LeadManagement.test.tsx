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

  test('renders lead management screen with header', () => {
    render(<LeadManagement {...mockProps} />);
    
    expect(screen.getByText('🎯 Lead Management')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('+ Add New Lead')).toBeInTheDocument();
  });

  test('displays all filter buttons', () => {
    render(<LeadManagement {...mockProps} />);
    
    expect(screen.getByText('Show All')).toBeInTheDocument();
    expect(screen.getByText('🔥 Hot Lead')).toBeInTheDocument();
    expect(screen.getByText('⭐ Warm Lead')).toBeInTheDocument();
    expect(screen.getByText('❄️ Cold Lead')).toBeInTheDocument();
  });

  test('shows all leads by default', () => {
    render(<LeadManagement {...mockProps} />);
    
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
    expect(screen.getByText('Baroda Fashion House - Vadodara')).toBeInTheDocument();
  });

  test('filters hot leads correctly', () => {
    const hotLeadProps = { ...mockProps, filterState: 'hotleads' };
    render(<LeadManagement {...hotLeadProps} />);
    
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.queryByText('Gujarat Garments - Surat')).not.toBeInTheDocument();
    expect(screen.queryByText('Baroda Fashion House - Vadodara')).not.toBeInTheDocument();
  });

  test('filters warm leads correctly', () => {
    const warmLeadProps = { ...mockProps, filterState: 'warmleads' };
    render(<LeadManagement {...warmLeadProps} />);
    
    expect(screen.queryByText('Rajesh Textiles - Ahmedabad')).not.toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
    expect(screen.queryByText('Baroda Fashion House - Vadodara')).not.toBeInTheDocument();
  });

  test('filters cold leads correctly', () => {
    const coldLeadProps = { ...mockProps, filterState: 'coldleads' };
    render(<LeadManagement {...coldLeadProps} />);
    
    expect(screen.queryByText('Rajesh Textiles - Ahmedabad')).not.toBeInTheDocument();
    expect(screen.queryByText('Gujarat Garments - Surat')).not.toBeInTheDocument();
    expect(screen.getByText('Baroda Fashion House - Vadodara')).toBeInTheDocument();
  });

  test('filter buttons trigger onFilterChange callback', () => {
    render(<LeadManagement {...mockProps} />);
    
    fireEvent.click(screen.getByText('🔥 Hot Lead'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('hotleads');

    fireEvent.click(screen.getByText('⭐ Warm Lead'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('warmleads');

    fireEvent.click(screen.getByText('❄️ Cold Lead'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('coldleads');

    fireEvent.click(screen.getByText('Show All'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays correct lead details for each lead type', () => {
    render(<LeadManagement {...mockProps} />);
    
    // Hot lead details
    expect(screen.getByText('500 meters Bandhani Cotton Fabric, 44" width')).toBeInTheDocument();
    expect(screen.getByText('100 GSM, Pre-shrunk, Natural dyes')).toBeInTheDocument();
    expect(screen.getByText('₹180-200 per meter')).toBeInTheDocument();

    // Warm lead details
    expect(screen.getByText('750 meters Block Print Khadi, 42" width')).toBeInTheDocument();
    expect(screen.getByText('120 GSM, Hand-woven, Natural dyes')).toBeInTheDocument();
    expect(screen.getByText('₹150-170 per meter')).toBeInTheDocument();

    // Cold lead details
    expect(screen.getByText('300 meters Premium Silk, 40" width')).toBeInTheDocument();
    expect(screen.getByText('150 GSM, Mulberry silk, Lustrous finish')).toBeInTheDocument();
    expect(screen.getByText('₹400-450 per meter')).toBeInTheDocument();
  });

  test('action buttons are present for each lead', () => {
    render(<LeadManagement {...mockProps} />);
    
    const callButtons = screen.getAllByText('📞 Call');
    const whatsappButtons = screen.getAllByText('📱 WhatsApp');
    const quoteButtons = screen.getAllByText('📑 Send Quote');

    expect(callButtons).toHaveLength(3);
    expect(whatsappButtons).toHaveLength(3);
    expect(quoteButtons).toHaveLength(3);
  });

  test('back to dashboard button triggers navigation callback', () => {
    render(<LeadManagement {...mockProps} />);
    
    fireEvent.click(screen.getByText('← Back to Dashboard'));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter button has correct CSS class', () => {
    const activeHotProps = { ...mockProps, filterState: 'hotleads' };
    render(<LeadManagement {...activeHotProps} />);
    
    const hotButton = screen.getByText('🔥 Hot Lead');
    expect(hotButton).toHaveClass('filter-btn', 'active');
  });

  test('renders with Gujarati translations', () => {
    const guProps = {
      ...mockProps,
      currentLanguage: 'gu',
      translations: getCurrentTranslations('gu')
    };
    
    render(<LeadManagement {...guProps} />);
    
    expect(screen.getByText('🎯 લીડ મેનેજમેન્ટ')).toBeInTheDocument();
    expect(screen.getByText('← ડેશબોર્ડ પર પાછા જાઓ')).toBeInTheDocument();
    expect(screen.getByText('📞 કૉલ')).toBeInTheDocument();
    expect(screen.getByText('📱 વોટ્સએપ')).toBeInTheDocument();
  });

  test('renders with Hindi translations', () => {
    const hiProps = {
      ...mockProps,
      currentLanguage: 'hi',
      translations: getCurrentTranslations('hi')
    };
    
    render(<LeadManagement {...hiProps} />);
    
    expect(screen.getByText('🎯 लीड प्रबंधन')).toBeInTheDocument();
    expect(screen.getByText('← डैशबोर्ड पर वापस जाएं')).toBeInTheDocument();
    expect(screen.getByText('📞 कॉल')).toBeInTheDocument();
    expect(screen.getByText('📱 व्हाट्सऐप')).toBeInTheDocument();
  });
});