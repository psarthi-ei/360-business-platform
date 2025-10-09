import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { companyName, tagline, logoAlt } from '../../config/brand';
import logoImage from '../../assets/images/logo.png';
import styles from './LeftSidebarNavigation.module.css';

interface LeftSidebarNavigationProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const LeftSidebarNavigation: React.FC<LeftSidebarNavigationProps> = ({ 
  className = '',
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  // Navigation items matching BottomNavigation for consistency
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
      return ['/platform/procurement', '/platform/purchase-orders', '/platform/inventory', '/platform/suppliers'].includes(currentPath);
    }
    
    if (path === '/platform/customers') {
      return ['/platform/crm', '/platform/customers'].includes(currentPath) || currentPath.startsWith('/platform/customers/');
    }
    
    return currentPath === path;
  };

  return (
    <aside className={`${styles.leftSidebar} ${collapsed ? styles.collapsed : ''} ${className}`}>
      {/* Brand Section */}
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <img src={logoImage} alt={logoAlt} className={styles.brandLogo} />
          {!collapsed && (
            <div className={styles.brandInfo}>
              <div className={styles.brandName}>{companyName}</div>
              <div className={styles.brandTagline}>{tagline}</div>
            </div>
          )}
        </div>
        <button 
          className={styles.collapseButton}
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className={styles.navigation}>
        {navigationItems.map((item) => (
          <button
            key={item.path}
            className={`${styles.navItem} ${isActiveItem(item.path) ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.description : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && (
              <>
                <span className={styles.navLabel}>{item.label}</span>
                <span className={styles.navDescription}>{item.description}</span>
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Business Context */}
      {!collapsed && (
        <div className={styles.businessContext}>
          <div className={styles.contextHeader}>Current Business</div>
          <div className={styles.businessInfo}>
            <div className={styles.businessName}>Gujarat Textiles Ltd.</div>
            <div className={styles.businessStatus}>Production Active</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default LeftSidebarNavigation;