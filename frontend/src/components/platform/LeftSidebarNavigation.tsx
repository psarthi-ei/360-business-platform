import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './LeftSidebarNavigation.module.css';

interface LeftSidebarNavigationProps {
  className?: string;
}

const LeftSidebarNavigation: React.FC<LeftSidebarNavigationProps> = ({ 
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, leads, quotes, workOrders } = useTerminologyTerms();

  // Navigation items matching BottomNavigation for consistency
  // Core paths maintained for backend compatibility, labels use regional terminology
  const navigationItems = [
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
      description: `${leads} → ${quotes} → Orders`
    },
    { 
      path: '/platform/procurement', 
      icon: '📦', 
      label: 'Procurement',
      description: 'Purchasing & Materials'
    },
    { 
      path: '/platform/production', 
      icon: '🏭', 
      label: 'Production',
      description: `Manufacturing & ${workOrders}`
    },
    { 
      path: '/platform/customers', 
      icon: '👥', 
      label: customers,  // Display regional terminology (e.g., "Parties")
      description: `CRM & ${customers} Management`
    }
  ];

  const isActiveItem = (path: string) => {
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
      return ['/platform/procurement', '/platform/purchase-orders', '/platform/suppliers'].includes(currentPath);
    }
    
    if (path === '/platform/customers') {
      return ['/platform/crm', '/platform/customers'].includes(currentPath) || currentPath.startsWith('/platform/customers/');
    }
    
    return currentPath === path;
  };

  return (
    <aside className={`${styles.leftSidebar} ${className}`}>

      {/* Navigation Items */}
      <nav className={styles.navigation}>
        {navigationItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.navItem} ${isActiveItem(item.path) ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            title={item.description}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  );
};

export default LeftSidebarNavigation;