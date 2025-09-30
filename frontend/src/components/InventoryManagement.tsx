import React from 'react';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import { mockLeads, mockSalesOrders, mockBusinessProfiles } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import { ActionParams } from '../services/nlp/types';
import styles from '../styles/PlaceholderScreen.module.css';

interface InventoryManagementProps {
  onBackToDashboard: () => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

function InventoryManagement({
  onBackToDashboard,
  onUniversalAction
}: InventoryManagementProps) {
  const { t } = useTranslation();

  // Action handler for inventory-specific commands only
  function handleAction(actionType: string, params?: ActionParams) {
    switch (actionType) {
      case 'CHECK_STOCK_LEVELS':
        // Future: Handle stock level checking
        // TODO: Implement check stock levels
        break;
      case 'UPDATE_INVENTORY':
        // Future: Handle inventory updates
        // TODO: Implement update inventory
        break;
      case 'CREATE_PURCHASE_ORDER':
        // Future: Handle purchase order creation
        // TODO: Implement create purchase order
        break;
      default:
        // TODO: Handle unhandled inventory action
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          📦 {t('inventory')} {t('manage')}
        </h1>
      </div>

      <div className={styles.content}>
        <div className={styles.placeholder}>
          <div className={styles.icon}>📦</div>
          <h2>{t('inventory')} {t('manage')}</h2>
          <p>Complete inventory management system for textile manufacturing:</p>
          
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <span>📋</span>
              <div>
                <strong>Stock Management</strong>
                <p>Track cotton, yarn, fabric inventory levels</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span>🛒</span>
              <div>
                <strong>Procurement</strong>
                <p>Purchase orders and supplier management</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span>📦</span>
              <div>
                <strong>Goods Receipt Note (GRN)</strong>
                <p>Material receiving and quality checks</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span>⚠️</span>
              <div>
                <strong>Stock Alerts</strong>
                <p>Low stock and reorder notifications</p>
              </div>
            </div>
          </div>
          
          <div className={styles.comingSoon}>
            <p>🚧 Implementation in Progress</p>
            <p>This module is part of our comprehensive 13-module MVP covering all textile business operations.</p>
          </div>

          {/* Voice Commands Section */}
          <div className={styles.voiceSection}>
            <h3>🎤 Voice Commands</h3>
            <div className={styles.voiceCommands}>
              <div className={styles.voiceCommand}>
                <strong>Commands:</strong> "Check stock levels" • "Update inventory" • "Create purchase order" • "Go to orders"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant for Inventory Management */}
      <FloatingVoiceAssistant
        currentProcessStage="inventory"
        onUniversalAction={onUniversalAction}
        onAction={handleAction}
        businessData={{
          hotLeads: mockLeads.filter(lead => lead.priority === 'hot').length,
          overduePayments: 0, // Mock data - in real app would calculate from payments
          readyToShip: mockSalesOrders.filter(order => order.status === 'completed').length,
          totalCustomers: mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length
        }}
        onPerformSearch={(query) => {
          // Search inventory by material name, supplier, or stock status
          // TODO: Implement inventory search
          // Future: Filter inventory items based on search query
        }}
      />
    </div>
  );
}

export default InventoryManagement;