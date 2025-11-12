import React from 'react';
import InwardEntryManagement from './InwardEntryManagement';

interface InwardManagementProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const InwardManagement = ({ 
  filterState, 
  onFilterChange 
}: InwardManagementProps) => {
  
  return (
    <InwardEntryManagement
      filterState={filterState}
      onFilterChange={onFilterChange}
    />
  );
};

export default InwardManagement;