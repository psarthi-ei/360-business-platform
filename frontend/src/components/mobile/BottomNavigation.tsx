import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 5-Tab Navigation - Visual Design Specification
  const tabs = [
    { 
      path: '/dashboard', 
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
    
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
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

  return (
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
  );
};

export default BottomNavigation;