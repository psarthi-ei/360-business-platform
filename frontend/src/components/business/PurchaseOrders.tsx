import React from 'react';

interface PurchaseOrdersProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PurchaseOrders = ({ 
  filterState, 
  onFilterChange 
}: PurchaseOrdersProps) => {
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
        <p>🛒 Purchase Orders (POs) content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show supplier orders, delivery tracking, and payment status</p>
      </div>
    </div>
  );
};

export default PurchaseOrders;