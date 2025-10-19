import React from 'react';

interface GoodsReceiptNotesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const GoodsReceiptNotes = ({ 
  filterState, 
  onFilterChange 
}: GoodsReceiptNotesProps) => {
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
        <p>📥 Goods Receipt Notes (GRNs) content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show delivery receipts, quality inspection, and stock updates</p>
      </div>
    </div>
  );
};

export default GoodsReceiptNotes;