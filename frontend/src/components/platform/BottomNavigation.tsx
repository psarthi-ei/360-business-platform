import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 5-Tab Navigation - Visual Design Specification (Platform Routes)
  const tabs = [
    { 
      path: '/platform/home', 
      icon: '🏠', 
      label: 'Home',
      description: 'Business Intelligence Dashboard'
    },
    { 
      path: '/platform/sales', 
      icon: '💼', 
      label: 'Sales',
      description: 'Leads → Quotes → Orders'
    },
    { 
      path: '/platform/production', 
      icon: '🏭', 
      label: 'Production',
      description: 'Manufacturing & Work Orders'
    },
    { 
      path: '/platform/procurement', 
      icon: '📦', 
      label: 'Procurement',
      description: 'Purchasing & Materials'
    },
    { 
      path: '/platform/customers', 
      icon: '👥', 
      label: 'Customers',
      description: 'CRM & Customer Management'
    }
  ];

  const isActiveTab = (path: string) => {
    // Enhanced logic for workflow-based navigation with platform routes
    const currentPath = location.pathname;
    
    if (path === '/platform/home') {
      return ['/platform/home', '/platform', '/platform/dashboard'].includes(currentPath);
    }
    
    if (path === '/platform/sales') {
      return ['/platform/leads', '/platform/quotes', '/platform/orders', '/platform/payments', '/platform/sales'].includes(currentPath);
    }
    
    if (path === '/platform/production') {
      return ['/platform/production', '/platform/work-orders', '/platform/manufacturing'].includes(currentPath);
    }
    
    if (path === '/platform/procurement') {
      return ['/platform/procurement', '/platform/purchase-orders', '/platform/inventory', '/platform/suppliers'].includes(currentPath);
    }
    
    if (path === '/platform/customers') {
      return ['/platform/crm', '/platform/customers'].includes(currentPath) || currentPath.startsWith('/platform/customers/');
    }
    
    return currentPath === path;
  };

  return (
    <div className={styles.bottomNavigationContainer}>
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