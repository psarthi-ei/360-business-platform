import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component - Dashboard', () => {
  test('renders main dashboard elements', () => {
    render(<App />);
    
    // Check if main dashboard elements are present
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/ElevateIdea Technologies/i)).toBeInTheDocument();
    expect(screen.getByText(/Lead Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Quotations & Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Sales Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Work Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Production Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory \(3-Tier\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dispatch & Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Invoice & Finance/i)).toBeInTheDocument();
    expect(screen.getByText(/Voice Commands/i)).toBeInTheDocument();
  });

  test('displays feature descriptions correctly', () => {
    render(<App />);
    
    expect(screen.getByText('Track and convert potential customers')).toBeInTheDocument();
    expect(screen.getByText('Create quotes and manage approvals')).toBeInTheDocument();
    expect(screen.getByText('Track confirmed orders and payments')).toBeInTheDocument();
    expect(screen.getByText('Customer relationship management')).toBeInTheDocument();
    expect(screen.getByText('Production planning and scheduling')).toBeInTheDocument();
  });

  test('displays voice command examples', () => {
    render(<App />);
    
    expect(screen.getByText(/Voice Commands/i)).toBeInTheDocument();
    expect(screen.getByText(/Add new fabric inquiry from Mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/Call Rajesh Textiles/i)).toBeInTheDocument();
    expect(screen.getByText(/Show cotton fabric leads only/i)).toBeInTheDocument();
  });
});

describe('App Component - Language Switching', () => {
  test('language switcher displays all languages', () => {
    render(<App />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('ગુજરાતી')).toBeInTheDocument();
    expect(screen.getByText('हिंदी')).toBeInTheDocument();
  });

  test('switches to Gujarati language', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('ગુજરાતી'));
    expect(screen.getByText(/360° બિઝનેસ પ્લેટફોર્મ/i)).toBeInTheDocument();
    expect(screen.getByText(/લીડ મેનેજમેન્ટ/i)).toBeInTheDocument();
    expect(screen.getByText(/કોટેશન અને ઓર્ડર/i)).toBeInTheDocument();
    expect(screen.getByText(/ગ્રાહકો/i)).toBeInTheDocument();
  });

  test('switches to Hindi language', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('हिंदी'));
    expect(screen.getByText(/360° बिजनेस प्लेटफॉर्म/i)).toBeInTheDocument();
    expect(screen.getByText(/लीड प्रबंधन/i)).toBeInTheDocument();
    expect(screen.getByText(/कोटेशन और ऑर्डर/i)).toBeInTheDocument();
    expect(screen.getByText(/ग्राहक/i)).toBeInTheDocument();
  });

  test('switches back to English', () => {
    render(<App />);
    
    // Switch to Gujarati first
    fireEvent.click(screen.getByText('ગુજરાતી'));
    expect(screen.getByText(/લીડ મેનેજમેન્ટ/i)).toBeInTheDocument();
    
    // Switch back to English
    fireEvent.click(screen.getByText('English'));
    expect(screen.getByText(/Lead Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Quotations & Orders/i)).toBeInTheDocument();
  });
});

describe('App Component - Navigation', () => {
  test('navigates to Lead Management screen', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Lead Management/i));
    expect(screen.getByText(/🎯 Lead Management/i)).toBeInTheDocument();
    expect(screen.getByText(/← Back to Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ Add New Lead/i)).toBeInTheDocument();
    expect(screen.getByText(/Show All/i)).toBeInTheDocument();
    expect(screen.getByText(/🔥 Hot Lead/i)).toBeInTheDocument();
  });

  test('navigates to Quotation Orders screen', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    expect(screen.getByText(/📄 Quotations & Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ Create New Quote/i)).toBeInTheDocument();
    expect(screen.getByText(/⏳ Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Approved/i)).toBeInTheDocument();
    expect(screen.getByText(/🎉 Converted/i)).toBeInTheDocument();
  });

  test('navigates to Sales Orders screen', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Sales Orders/i));
    expect(screen.getByText(/📋 Sales Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ Add New Order/i)).toBeInTheDocument();
    expect(screen.getByText(/💳 Pending Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Payment Received/i)).toBeInTheDocument();
    expect(screen.getByText(/🔴 Overdue/i)).toBeInTheDocument();
  });

  test('navigates to Customer List screen', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Customers/i));
    expect(screen.getByText(/👥 Customer List/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search customers by name, location, or specialization/i)).toBeInTheDocument();
    expect(screen.getByText(/🏆 Premium/i)).toBeInTheDocument();
    expect(screen.getByText(/🎉 New Customers/i)).toBeInTheDocument();
  });

  test('back to dashboard navigation works from all screens', () => {
    render(<App />);
    
    // Test from Lead Management
    fireEvent.click(screen.getByText(/Lead Management/i));
    expect(screen.getByText(/🎯 Lead Management/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
    
    // Test from Quotations
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    expect(screen.getByText(/📄 Quotations & Orders/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
    
    // Test from Sales Orders
    fireEvent.click(screen.getByText(/Sales Orders/i));
    expect(screen.getByText(/📋 Sales Orders/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
  });
});

describe('App Component - Lead Management Features', () => {
  test('displays lead data correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Lead Management/i));
    
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
    expect(screen.getByText('Baroda Fashion House - Vadodara')).toBeInTheDocument();
  });

  test('lead filtering works correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Lead Management/i));
    
    // Test hot leads filter
    fireEvent.click(screen.getByText(/🔥 Hot Lead/i));
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    
    // Test warm leads filter
    fireEvent.click(screen.getByText(/⭐ Warm Lead/i));
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
    
    // Test cold leads filter
    fireEvent.click(screen.getByText(/❄️ Cold Lead/i));
    expect(screen.getByText('Baroda Fashion House - Vadodara')).toBeInTheDocument();
  });
});

describe('App Component - Quotation Management Features', () => {
  test('displays quotation data correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    
    expect(screen.getByText('QT-001 -')).toBeInTheDocument();
    expect(screen.getByText('QT-002 -')).toBeInTheDocument();
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
  });

  test('quotation filtering works correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    
    // Test converted quotes filter
    fireEvent.click(screen.getByText(/🎉 Converted/i));
    expect(screen.getByText('🎉 Converted')).toBeInTheDocument();
    
    // Test pending quotes filter  
    fireEvent.click(screen.getByText(/⏳ Pending/i));
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
  });

  test('navigation to sales orders from quotes works', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    
    const salesOrderLink = screen.getByText(/🎉 SO-001/i);
    fireEvent.click(salesOrderLink);
    expect(screen.getByText(/📋 Sales Orders/i)).toBeInTheDocument();
  });
});

describe('App Component - Sales Order Features', () => {
  test('displays sales order data correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Sales Orders/i));
    
    expect(screen.getByText('SO-001 - Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('SO-002 - Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    expect(screen.getByText('SO-003 - Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('sales order filtering works correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Sales Orders/i));
    
    // Test pending payment filter
    fireEvent.click(screen.getByText(/💳 Pending Payment/i));
    expect(screen.getByText('SO-001 - Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    
    // Test payment received filter
    fireEvent.click(screen.getByText(/✅ Payment Received/i));
    expect(screen.getByText('SO-002 - Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    
    // Test overdue filter
    fireEvent.click(screen.getByText(/🔴 Overdue/i));
    expect(screen.getByText('SO-003 - Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('navigation to quotations from sales orders works', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Sales Orders/i));
    
    const quoteLink = screen.getAllByText(/✅ QT-/i)[0];
    fireEvent.click(quoteLink);
    expect(screen.getByText(/📄 Quotations & Orders/i)).toBeInTheDocument();
  });
});

describe('App Component - Customer Management Features', () => {
  test('displays customer list correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Customers/i));
    
    expect(screen.getByText('🏭 Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('🏭 Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    expect(screen.getByText('🏭 Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('customer search functionality works', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Customers/i));
    
    const searchInput = screen.getByPlaceholderText(/Search customers by name, location, or specialization/i);
    expect(searchInput).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'Rajesh' } });
    expect((searchInput as HTMLInputElement).value).toBe('Rajesh');
  });

  test('navigation to customer profile works', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Customers/i));
    
    const customerLink = screen.getByText('🏭 Rajesh Textiles - Ahmedabad');
    fireEvent.click(customerLink);
    expect(screen.getByText(/👤 Customer Profile/i)).toBeInTheDocument();
  });
});

describe('App Component - Customer Profile Features', () => {
  test('displays customer profile correctly', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Customers/i));
    fireEvent.click(screen.getByText('🏭 Rajesh Textiles - Ahmedabad'));
    
    expect(screen.getByText(/👤 Customer Profile/i)).toBeInTheDocument();
    expect(screen.getByText('🏭 Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText(/Premium Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Since/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Business/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion Rate/i)).toBeInTheDocument();
  });

  test('displays customer history sections', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Customers/i));
    fireEvent.click(screen.getByText('🏭 Rajesh Textiles - Ahmedabad'));
    
    expect(screen.getByText(/Quote History/i)).toBeInTheDocument();
    expect(screen.getByText(/Order History/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction History/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Insights/i)).toBeInTheDocument();
  });
});

describe('App Component - Integration Tests', () => {
  test('complete user flow: dashboard -> leads -> quotes -> sales orders -> customers', () => {
    render(<App />);
    
    // Start at dashboard
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
    
    // Go to Lead Management
    fireEvent.click(screen.getByText(/Lead Management/i));
    expect(screen.getByText(/🎯 Lead Management/i)).toBeInTheDocument();
    
    // Go to Quotations
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    fireEvent.click(screen.getByText(/Quotations & Orders/i));
    expect(screen.getByText(/📄 Quotations & Orders/i)).toBeInTheDocument();
    
    // Go to Sales Orders via quote link
    const salesOrderLink = screen.getByText(/🎉 SO-001/i);
    fireEvent.click(salesOrderLink);
    expect(screen.getByText(/📋 Sales Orders/i)).toBeInTheDocument();
    
    // Go to Customer List
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    fireEvent.click(screen.getByText(/Customers/i));
    expect(screen.getByText(/👥 Customer List/i)).toBeInTheDocument();
    
    // Go to Customer Profile
    fireEvent.click(screen.getByText('🏭 Rajesh Textiles - Ahmedabad'));
    expect(screen.getByText(/👤 Customer Profile/i)).toBeInTheDocument();
    
    // Return to dashboard
    fireEvent.click(screen.getByText(/← Back to Dashboard/i));
    expect(screen.getByText(/360° Business Platform/i)).toBeInTheDocument();
  });

  test('language switching persists across screens', () => {
    render(<App />);
    
    // Switch to Gujarati on dashboard
    fireEvent.click(screen.getByText('ગુજરાતી'));
    expect(screen.getByText(/લીડ મેનેજમેન્ટ/i)).toBeInTheDocument();
    
    // Navigate to leads and verify language persists
    fireEvent.click(screen.getByText(/લીડ મેનેજમેન્ટ/i));
    expect(screen.getByText(/🎯 લીડ મેનેજમેન્ટ/i)).toBeInTheDocument();
    expect(screen.getByText(/← ડેશબોર્ડ પર પાછા જાઓ/i)).toBeInTheDocument();
    
    // Go to quotations and verify language persists
    fireEvent.click(screen.getByText(/← ડેશબોર્ડ પર પાછા જાઓ/i));
    fireEvent.click(screen.getByText(/કોટેશન અને ઓર્ડર/i));
    expect(screen.getByText(/📄 કોટેશન અને ઓર્ડર/i)).toBeInTheDocument();
  });
});
