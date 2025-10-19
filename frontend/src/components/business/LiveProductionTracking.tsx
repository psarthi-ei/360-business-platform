import React from 'react';

interface LiveProductionTrackingProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const LiveProductionTracking = ({ filterState, onFilterChange }: LiveProductionTrackingProps) => {
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
        <p>🔄 Live Production Tracking content coming soon</p>
        <p>Filter: {filterState}</p>
        <p>This will show real-time work order progress, machine status, and worker performance</p>
      </div>
    </div>
  );
};

export default LiveProductionTracking;