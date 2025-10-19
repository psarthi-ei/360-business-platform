import React from 'react';

interface QualityControlManagementProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const QualityControlManagement = ({ filterState, onFilterChange }: QualityControlManagementProps) => {
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
        <p>🔍 Quality Control Management content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show quality inspections, grades, approvals, and rejection management</p>
      </div>
    </div>
  );
};

export default QualityControlManagement;