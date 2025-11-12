import React, { useMemo } from 'react';
import { 
  filterInventory,
  InventoryItem
} from '../../data/inventoryMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './InventoryManagement.module.css';

interface InventoryManagementProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const InventoryManagement = ({ 
  filterState, 
  onFilterChange 
}: InventoryManagementProps) => {
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Get terminology for local language support
  const { customer: party, orders: jobOrders } = useTerminologyTerms();
  
  // Filter inventory based on filter state
  const filteredInventory = useMemo(() => {
    return filterInventory(filterState);
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (materialName: string) => {
    toggleExpansion(materialName, 'data-inventory-id');
  };
  
  // Get stock status information with icon and styling
  const getStockStatusInfo = (item: InventoryItem) => {
    switch (item.stockStatus) {
      case 'healthy':
        return { icon: '✅', label: 'Healthy Stock', className: 'ds-card-status-active' };
      case 'low':
        return { icon: '⚠️', label: 'Low Stock', className: 'ds-card-status-pending' };
      case 'critical':
        return { icon: '🔴', label: 'Critical', className: 'ds-card-priority-high' };
      case 'excess':
        return { icon: '📈', label: 'Excess Stock', className: 'ds-card-priority-medium' };
      default:
        return { icon: '📦', label: 'Unknown', className: 'ds-card-status-inactive' };
    }
  };

  // Get ownership display using local terminology
  const getOwnershipDisplay = (item: InventoryItem) => {
    return item.materialOwnership === 'company' ? '🏢 Company' : `👤 ${party}`;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chemicals': return '🧪';
      case 'yarns': return '🧶';
      case 'threads': return '🧵';
      case 'accessories': return '📎';
      case 'packaging': return '📦';
      case 'fabrics': return '🧵';
      default: return '📦';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  // Calculate value for display (only for company materials)
  const getValueDisplay = (item: InventoryItem): string => {
    if (item.materialOwnership === 'client') return 'Client Material';
    if (!item.costPerUnit) return 'No Cost Data';
    const value = item.onHandStock * item.costPerUnit;
    return formatCurrency(value);
  };

  // Inventory action handlers
  const handleUpdateStock = (materialName: string) => {
    alert(`📊 Update Stock for ${materialName} - Functionality coming soon!`);
  };

  const handleViewHistory = (materialName: string) => {
    alert(`📋 View Movement History for ${materialName} - Functionality coming soon!`);
  };

  const handleCreatePR = (materialName: string) => {
    alert(`📝 Create Purchase Request for ${materialName} - Functionality coming soon!`);
  };

  const handleViewJobOrder = (jobOrderId: string) => {
    alert(`🔍 Navigate to ${jobOrders.slice(0, -1)} ${jobOrderId} - Functionality coming soon!`);
  };

  // Calculate inventory summary for alert header
  const criticalCount = filteredInventory.filter(item => item.stockStatus === 'critical').length;
  const lowStockCount = filteredInventory.filter(item => item.stockStatus === 'low').length;
  const alertCount = criticalCount + lowStockCount;

  return (
    <div className={styles.inventoryScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when critical/low stock items exist */}
        {alertCount > 0 && (
          <div className={styles.alertHeader}>
            ⚠️ {criticalCount} CRITICAL + {lowStockCount} LOW STOCK ALERTS
            <small>Immediate attention required for material procurement</small>
          </div>
        )}

        <div className={styles.inventoryContainer}>
          {filteredInventory.map(item => {
            const statusInfo = getStockStatusInfo(item);
            const ownershipDisplay = getOwnershipDisplay(item);
            const categoryIcon = getCategoryIcon(item.category);

            return (
              <div key={item.materialName} className="ds-card-container" data-inventory-id={item.materialName}>
                {/* Clickable Card Summary - Global 140px Template */}
                <div 
                  className={`ds-card ${statusInfo.className} ${isExpanded(item.materialName) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(item.materialName)}
                >
                  {/* Header - Material Name with Category Icon */}
                  <div 
                    className="ds-card-header"
                    title={`${item.materialName} - ${item.onHandStock} ${item.unit} available`}
                  >
                    {categoryIcon} {item.materialName}
                  </div>
                  
                  {/* Status - Stock Status and Ownership */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label} • {ownershipDisplay}
                  </div>
                  
                  {/* Meta - Stock Information */}
                  <div 
                    className="ds-card-meta"
                    title={`Current: ${item.onHandStock} ${item.unit} | Location: ${item.location || 'Not specified'}`}
                  >
                    Stock: {item.onHandStock} {item.unit}{item.reorderLevel ? ` | Min: ${item.reorderLevel}` : ''}<br />
                    {item.location} • {getValueDisplay(item)}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(item.materialName) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Detailed Information */}
                {isExpanded(item.materialName) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📦 Inventory Details</h4>
                      
                      {/* Section 1: Stock Management Metrics */}
                      <div className={styles.metricsSection}>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Current Stock</span>
                          <span className={styles.metricValue}>{item.onHandStock} {item.unit}</span>
                        </div>
                        {item.reorderLevel && (
                          <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Reorder Level</span>
                            <span className={styles.metricValue}>{item.reorderLevel} {item.unit}</span>
                          </div>
                        )}
                        {item.maxStock && (
                          <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Max Stock</span>
                            <span className={styles.metricValue}>{item.maxStock} {item.unit}</span>
                          </div>
                        )}
                        {item.materialOwnership === 'company' && item.totalValue > 0 && (
                          <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Total Value</span>
                            <span className={styles.metricValue}>{formatCurrency(item.totalValue)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Professional Context Cards Layout */}
                      <div className={styles.contextSection}>
                        {/* Material Information Card */}
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>📋 Material Information</div>
                          <div className={styles.contextContent}>
                            <div><strong>Category:</strong> {item.category} • {item.subCategory || 'General'}</div>
                            <div><strong>Location:</strong> {item.location || 'Not specified'}</div>
                            {item.batchNumber && <div><strong>Batch Number:</strong> {item.batchNumber}</div>}
                            {item.qualityGrade && <div><strong>Quality Grade:</strong> {item.qualityGrade}</div>}
                            {item.supplierName && <div><strong>Supplier:</strong> {item.supplierName}</div>}
                          </div>
                        </div>

                        {/* Cost Information Card (Company Materials Only) */}
                        {item.materialOwnership === 'company' && item.costPerUnit && (
                          <div className={styles.contextCard}>
                            <div className={styles.contextHeader}>💰 Cost Analysis</div>
                            <div className={styles.contextContent}>
                              <div><strong>Cost per Unit:</strong> {formatCurrency(item.costPerUnit)}/{item.unit}</div>
                              {item.averageCostPerUnit && <div><strong>Average Cost:</strong> {formatCurrency(item.averageCostPerUnit)}/{item.unit}</div>}
                              <div><strong>Total Value:</strong> {formatCurrency(item.totalValue)}</div>
                              {item.monthlyConsumption && <div><strong>Monthly Usage:</strong> {item.monthlyConsumption} {item.unit}</div>}
                            </div>
                          </div>
                        )}

                        {/* Client Information Card (Client Materials Only) */}
                        {item.materialOwnership === 'client' && (
                          <div className={styles.contextCard}>
                            <div className={styles.contextHeader}>👤 {party} Material Information</div>
                            <div className={styles.contextContent}>
                              <div><strong>{party} ID:</strong> {item.clientId}</div>
                              {item.jobOrderId && <div><strong>{jobOrders.slice(0, -1)}:</strong> {item.jobOrderId}</div>}
                              {item.lastReceivedDate && <div><strong>Received:</strong> {formatDate(item.lastReceivedDate)}</div>}
                            </div>
                          </div>
                        )}

                        {/* Recent Activity Card */}
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>📈 Recent Activity</div>
                          <div className={styles.contextContent}>
                            {item.lastReceivedDate && <div><strong>Last Received:</strong> {formatDate(item.lastReceivedDate)}</div>}
                            {item.lastIssuedDate && <div><strong>Last Issued:</strong> {formatDate(item.lastIssuedDate)}</div>}
                            {item.daysSinceLastMovement !== undefined && <div><strong>Days Since Movement:</strong> {item.daysSinceLastMovement} days</div>}
                            {item.expiryDate && <div><strong>Expiry Date:</strong> {formatDate(item.expiryDate)}</div>}
                          </div>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className={styles.notesSection}>
                          <strong>📝 Notes:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Inventory Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {/* Universal actions */}
                        <button 
                          className="ds-btn ds-btn-primary"
                          onClick={() => handleUpdateStock(item.materialName)}
                        >
                          📊 Update Stock
                        </button>
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handleViewHistory(item.materialName)}
                        >
                          📋 View History
                        </button>
                        
                        {/* Company material specific actions */}
                        {item.materialOwnership === 'company' && (item.stockStatus === 'low' || item.stockStatus === 'critical') && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handleCreatePR(item.materialName)}
                          >
                            📝 Create Purchase Request
                          </button>
                        )}
                        
                        {/* Party material specific actions */}
                        {item.materialOwnership === 'client' && item.jobOrderId && (
                          <button 
                            className="ds-btn ds-btn-secondary"
                            onClick={() => handleViewJobOrder(item.jobOrderId!)}
                          >
                            🔍 View {jobOrders.slice(0, -1)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;