import React from 'react';

interface PurchaseRequestsProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PurchaseRequests = ({ 
  filterState, 
  onFilterChange 
}: PurchaseRequestsProps) => {
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
        <p>📋 Purchase Requests (PRs) content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show internal purchase requests, approvals, and workflow status</p>
      </div>
    </div>
  );
};

export default PurchaseRequests;