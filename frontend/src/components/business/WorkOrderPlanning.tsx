import React from 'react';

interface WorkOrderPlanningProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const WorkOrderPlanning = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled 
}: WorkOrderPlanningProps) => {
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
        <p>📋 Work Order Planning content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show sales order breakdown, work order creation, and machine scheduling</p>
      </div>
    </div>
  );
};

export default WorkOrderPlanning;