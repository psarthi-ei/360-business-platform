import React from 'react';
import styles from './FloatingActionButton.module.css';

interface FloatingActionButtonProps {
  activeTab: string;
  onClick?: (action: string) => void;
  className?: string;
}

interface FABAction {
  action: string;
  label: string;
  icon: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  activeTab, 
  onClick,
  className = '' 
}) => {
  // Contextual actions per tab - Visual Design Specification
  const fabActions: Record<string, FABAction> = {
    '/home': {
      action: 'quick-action',
      label: 'Quick Action',
      icon: '⚡'
    },
    '/sales': {
      action: 'new-lead',
      label: 'New Lead',
      icon: '👤'
    },
    '/production': {
      action: 'work-order',
      label: 'Work Order',
      icon: '📋'
    },
    '/procurement': {
      action: 'purchase-request',
      label: 'Purchase Request',
      icon: '🛒'
    },
    '/customers': {
      action: 'new-customer',
      label: 'New Customer',
      icon: '👥'
    }
  };

  // Get current FAB configuration based on active tab
  const currentFAB = fabActions[activeTab] || fabActions['/home'];

  const handleClick = () => {
    if (onClick) {
      onClick(currentFAB.action);
    }
    // Default behavior - could be enhanced with specific actions
    // eslint-disable-next-line no-console
    console.log(`FAB Action: ${currentFAB.action} for tab: ${activeTab}`);
  };

  return (
    <button 
      className={`${styles.fab} ${className}`}
      onClick={handleClick}
      title={`+ ${currentFAB.label}`}
      aria-label={`Add ${currentFAB.label}`}
    >
      <span className={styles.fabIcon}>{currentFAB.icon}</span>
      <span className={styles.plusIcon}>+</span>
    </button>
  );
};

export default FloatingActionButton;