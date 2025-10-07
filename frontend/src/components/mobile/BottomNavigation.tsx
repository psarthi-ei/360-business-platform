import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FloatingActionButton from './FloatingActionButton';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
  className?: string;
  onFABAction?: (action: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  className = '', 
  onFABAction 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 5-Tab Navigation - Visual Design Specification
  const tabs = [
    { 
      path: '/home', 
      icon: '🏠', 
      label: 'Home',
      description: 'Business Intelligence Dashboard'
    },
    { 
      path: '/sales', 
      icon: '💼', 
      label: 'Sales',
      description: 'Leads → Quotes → Orders'
    },
    { 
      path: '/production', 
      icon: '🏭', 
      label: 'Production',
      description: 'Manufacturing & Work Orders'
    },
    { 
      path: '/procurement', 
      icon: '📦', 
      label: 'Procurement',
      description: 'Purchasing & Materials'
    },
    { 
      path: '/customers', 
      icon: '👥', 
      label: 'Customers',
      description: 'CRM & Customer Management'
    }
  ];

  const isActiveTab = (path: string) => {
    // Enhanced logic for workflow-based navigation
    const currentPath = location.pathname;
    
    if (path === '/home') {
      return currentPath === '/home' || currentPath === '/' || currentPath === '/dashboard';
    }
    
    if (path === '/sales') {
      return ['/leads', '/quotes', '/orders', '/payments', '/sales'].includes(currentPath);
    }
    
    if (path === '/production') {
      return ['/production', '/work-orders', '/manufacturing'].includes(currentPath);
    }
    
    if (path === '/procurement') {
      return ['/procurement', '/purchase-orders', '/inventory', '/suppliers'].includes(currentPath);
    }
    
    if (path === '/customers') {
      return ['/crm', '/customers', '/customer-profile'].includes(currentPath);
    }
    
    return currentPath === path;
  };

  // Get currently active tab for FAB context
  const getActiveTab = () => {
    // Find the active tab based on current path
    const activeTab = tabs.find(tab => isActiveTab(tab.path));
    return activeTab?.path || '/home';
  };

  return (
    <div className={styles.bottomNavigationContainer}>
      <FloatingActionButton 
        activeTab={getActiveTab()}
        onClick={onFABAction}
      />
      <nav className={`${styles.bottomTabs} ${className}`}>
        {tabs.map((tab, index) => {
          const workflowNames = ['home', 'sales', 'production', 'procurement', 'customers'];
          return (
            <button 
              key={tab.path}
              className={`${styles.tabButton} ${isActiveTab(tab.path) ? styles.active : ''}`}
              data-workflow={workflowNames[index]}
              onClick={() => navigate(tab.path)}
              title={tab.description}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;