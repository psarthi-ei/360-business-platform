import React, { useState, useCallback, useEffect } from 'react';
import { ActionParams } from '../../services/nlp/types';
import styles from './Customers.module.css';
import CustomerListManagement from './CustomerListManagement';
import SupportTicketManagement from './SupportTicketManagement';
import Customer360View from './Customer360View';
import SupportTicketFormModal from './SupportTicketFormModal';
import { BusinessProfile, SupportTicket } from '../../data/customerMockData';

interface CustomersProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

type CustomerSectionType = 'customers' | 'support';

// CTA visibility configuration - following Production pattern
const CTA_CONFIG = {
  customers: { showCTA: false },   // Hide CTA - customers created via lead conversion only
  support: { showCTA: true }       // Support tickets can be created manually
} as const;

// Mock data counts for dynamic filtering
const calculateCustomerCounts = () => ({
  all: 25,
  premium: 8,
  new: 5,
  active: 12,
  payment_issues: 3
});

const calculateSupportCounts = () => ({
  all: 18,
  open: 6,
  in_progress: 4,
  resolved: 8
});

const Customers = ({ mobile, onShowCustomerProfile, onUniversalAction }: CustomersProps) => {
  // State Management
  const [activeSection, setActiveSection] = useState<CustomerSectionType>('customers');
  const [customerFilterState, setCustomerFilterState] = useState('all');
  const [supportFilterState, setSupportFilterState] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');
  
  // 360° view state management
  const [show360View, setShow360View] = useState(false);
  const [selected360Customer, setSelected360Customer] = useState<BusinessProfile | null>(null);
  
  // Support ticket modal state management
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  
  // Intelligent scroll behavior state
  const [shouldShowScrollbar, setShouldShowScrollbar] = useState(false);
  
  // Timeline filter configuration (Filter 2)
  const timelineFilterConfig = [
    { value: 'all', label: '📅 All' },
    { value: 'recent', label: '📅 Recent' },
    { value: 'thisweek', label: '📅 Week' },
    { value: 'thismonth', label: '📅 Month' }
  ];
  
  // Dynamic count calculations
  const customerCounts = calculateCustomerCounts();
  const supportCounts = calculateSupportCounts();
  
  // Status filter configurations for each section (Filter 1) - Dynamic counts
  const statusFilterConfigs = {
    customers: [
      { value: 'all', label: 'All', count: customerCounts.all },
      { value: 'premium', label: '🏆 Premium', count: customerCounts.premium },
      { value: 'new', label: '🎉 New', count: customerCounts.new },
      { value: 'active', label: '⚡ Active', count: customerCounts.active },
      { value: 'payment_issues', label: '⚠️ Payment', count: customerCounts.payment_issues }
    ],
    support: [
      { value: 'all', label: 'All', count: supportCounts.all },
      { value: 'open', label: '🔴 Open', count: supportCounts.open },
      { value: 'in_progress', label: '🟡 Progress', count: supportCounts.in_progress },
      { value: 'resolved', label: '✅ Resolved', count: supportCounts.resolved }
    ]
  };

  // Get current filter state based on active section
  const getCurrentFilterState = () => {
    switch(activeSection) {
      case 'customers': return customerFilterState;
      case 'support': return supportFilterState;
      default: return 'all';
    }
  };

  // Set filter state based on active section
  const handleFilterChange = (filter: string) => {
    switch(activeSection) {
      case 'customers': setCustomerFilterState(filter); break;
      case 'support': setSupportFilterState(filter); break;
    }
  };

  // Calculate dynamic count based on current filters
  const getFilteredCount = useCallback(() => {
    // Inline getCurrentFilterState logic to avoid external dependency
    const currentStatusFilter = (() => {
      switch(activeSection) {
        case 'customers': return customerFilterState;
        case 'support': return supportFilterState;
        default: return 'all';
      }
    })();
    
    // Inline statusFilterConfigs access with count calculations to avoid external dependency
    const getStatusFilters = () => {
      switch(activeSection) {
        case 'customers': {
          const customerCounts = { all: 25, premium: 8, new: 5, active: 12, payment_issues: 3 };
          return [
            { value: 'all', label: 'All Customers', count: customerCounts.all },
            { value: 'premium', label: '🏆 Premium', count: customerCounts.premium },
            { value: 'new', label: '🎉 New Customers', count: customerCounts.new },
            { value: 'active', label: '⚡ Active', count: customerCounts.active },
            { value: 'payment_issues', label: '⚠️ Payment Issues', count: customerCounts.payment_issues }
          ];
        }
        case 'support': {
          const supportCounts = { all: 18, open: 6, in_progress: 4, resolved: 8 };
          return [
            { value: 'all', label: 'All Tickets', count: supportCounts.all },
            { value: 'open', label: '🔴 Open', count: supportCounts.open },
            { value: 'in_progress', label: '🟡 In Progress', count: supportCounts.in_progress },
            { value: 'resolved', label: '✅ Resolved', count: supportCounts.resolved }
          ];
        }
        default: return [];
      }
    };
    
    const currentStatusFilters = getStatusFilters();
    
    // Find the selected status filter's count
    const statusFilter = currentStatusFilters.find(filter => filter.value === currentStatusFilter);
    const baseCount = statusFilter ? statusFilter.count : 0;
    
    // Apply timeline filter modifier (simplified calculation)
    let timelineModifier = 1;
    switch(timelineFilter) {
      case 'recent': timelineModifier = 0.2; break;
      case 'thisweek': timelineModifier = 0.3; break;
      case 'thismonth': timelineModifier = 0.7; break;
      case 'all': 
      default: timelineModifier = 1; break;
    }
    
    return Math.round(baseCount * timelineModifier);
  }, [activeSection, customerFilterState, supportFilterState, timelineFilter]);

  // Intelligent scroll calculation
  const calculateScrollBehavior = useCallback(() => {
    const filteredCount = getFilteredCount();
    
    // Card template specifications (140px template)
    const cardHeight = 140;
    const cardSpacing = 16; // Gap between cards
    const containerPadding = 32; // Top/bottom padding in container
    
    // Calculate total content height needed
    const totalContentHeight = filteredCount > 0 
      ? (filteredCount * cardHeight) + ((filteredCount - 1) * cardSpacing) + containerPadding
      : 200; // Minimum height for empty state
    
    // Calculate available height (viewport minus fixed elements)
    const sectionHeight = 48;
    const filterHeight = 44;  
    const ctaHeight = 56;
    const availableHeight = window.innerHeight - sectionHeight - filterHeight - ctaHeight;
    
    // Show scrollbar if content exceeds available space
    const needsScroll = totalContentHeight > availableHeight;
    setShouldShowScrollbar(needsScroll);
  }, [getFilteredCount]);

  // Update scroll behavior when filters or section changes
  useEffect(() => {
    calculateScrollBehavior();
    
    // Also recalculate on window resize
    const handleResize = () => calculateScrollBehavior();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateScrollBehavior]);

  // Render business filters for current section
  const renderSectionFilters = () => {
    const currentStatusFilters = statusFilterConfigs[activeSection];
    const currentStatusFilter = getCurrentFilterState();
    const filteredCount = getFilteredCount();

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterDropdowns}>
          {/* Status/Priority Dropdown */}
          <select 
            className={styles.filterDropdown}
            value={currentStatusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {currentStatusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          
          {/* Timeline Filter Dropdown */}
          <select 
            className={styles.filterDropdown} 
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value)}
          >
            {timelineFilterConfig.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Count Indicator - Dynamic */}
        <div className={styles.countIndicator}>
          👥 {filteredCount}
        </div>
      </div>
    );
  };

  // Clean render function using configuration - TypeScript-safe approach
  const renderSectionContent = () => {
    // Show 360° view if active
    if (show360View && selected360Customer) {
      return (
        <Customer360View
          customer={selected360Customer}
          onClose={handleClose360View}
        />
      );
    }

    // Show normal section content
    switch(activeSection) {
      case 'customers':
        return (
          <CustomerListManagement
            mobile={mobile}
            onShowCustomerProfile={onShowCustomerProfile}
            filterState={customerFilterState}
            onFilterChange={setCustomerFilterState}
            onShow360View={handleShow360View}
          />
        );
      case 'support':
        return (
          <SupportTicketManagement
            filterState={supportFilterState}
            onFilterChange={setSupportFilterState}
            onOpenTicketModal={handleOpenTicketModal}
          />
        );
      default:
        return null;
    }
  };

  // Get contextual CTA text for current section
  const getContextualCTA = (section: CustomerSectionType): string => {
    switch(section) {
      case 'customers': return '+ Add Customer';
      case 'support': return '+ Create Ticket';
      default: return '+ Add';
    }
  };

  // Handle CTA click based on active section
  const handleCTAClick = () => {
    switch(activeSection) {
      case 'support':
        setIsTicketModalOpen(true);
        setEditingTicket(null); // Create mode
        break;
      default:
        // Unknown section - no action needed
    }
  };
  
  // Handle support ticket modal actions
  const handleOpenTicketModal = (ticket?: SupportTicket) => {
    setEditingTicket(ticket || null);
    setIsTicketModalOpen(true);
  };
  
  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setEditingTicket(null);
  };
  
  const handleTicketSubmit = (ticketData: any) => {
    // TODO: Implement actual ticket creation/update logic
    // For now, show success message
    const action = editingTicket ? 'updated' : 'created';
    alert(`Support ticket ${action} successfully!`);
    handleCloseTicketModal();
  };

  // 360° view handlers
  const handleShow360View = (customer: BusinessProfile) => {
    setSelected360Customer(customer);
    setShow360View(true);
  };

  const handleClose360View = () => {
    setShow360View(false);
    setSelected360Customer(null);
  };

  // Dynamic CTA visibility control - following Production pattern
  const shouldHideCTA = !CTA_CONFIG[activeSection]?.showCTA;

  return (
    <div className={`${styles.customersModule} ${shouldHideCTA ? styles.noCTA : ''} ${show360View ? styles.view360Mode : ''}`}>
      {/* 48px Section Navigation - Visual Design Spec */}
      <div className={styles.customersSections}>
        <button 
          className={`${styles.sectionButton} ${activeSection === 'customers' ? styles.active : ''}`}
          onClick={() => {
            setActiveSection('customers');
            if (show360View) {
              setShow360View(false);
              setSelected360Customer(null);
            }
          }}
        >
          Customers
        </button>
        <button 
          className={`${styles.sectionButton} ${activeSection === 'support' ? styles.active : ''}`}
          onClick={() => {
            setActiveSection('support');
            if (show360View) {
              setShow360View(false);
              setSelected360Customer(null);
            }
          }}
        >
          Support
        </button>
      </div>
      
      {/* 44px Business Filters - Hide during 360° view */}
      {!show360View && (
        <div className={styles.customersFilters}>
          {renderSectionFilters()}
        </div>
      )}
      
      {/* Content Area */}
      <div className={`${styles.customersContent} ${shouldShowScrollbar ? styles.scrollable : ''}`}>
        {renderSectionContent()}
      </div>
      
      {/* 56px Bottom CTA - Configuration-driven visibility */}
      {!shouldHideCTA && (
        <div className={styles.customersCTA}>
          <button className={styles.customersCTAButton} onClick={handleCTAClick}>
            {getContextualCTA(activeSection)}
          </button>
        </div>
      )}
      
      {/* Support Ticket Form Modal */}
      {activeSection === 'support' && (
        <SupportTicketFormModal
          isOpen={isTicketModalOpen}
          onClose={handleCloseTicketModal}
          onSubmit={handleTicketSubmit}
          editingTicket={editingTicket}
        />
      )}
    </div>
  );
};

export default Customers;