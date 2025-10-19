import React from 'react';

interface MaterialRequirementsProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const MaterialRequirements = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled
}: MaterialRequirementsProps) => {
  return (
    <div style={{ 
      padding: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '200px',
      color: '#6B7280',
      fontSize: '14px',
      textAlign: 'center'
    }}>
      <div>
        <p>📦 Material Requirements (MR) content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show material shortages, order requirements, and inventory status</p>
      </div>
    </div>
  );
};

export default MaterialRequirements;