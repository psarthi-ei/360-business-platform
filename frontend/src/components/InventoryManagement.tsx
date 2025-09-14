import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/PlaceholderScreen.module.css';

interface InventoryManagementProps {
  onBackToDashboard: () => void;
}

function InventoryManagement({ onBackToDashboard }: InventoryManagementProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBackToDashboard} className={styles.backButton}>
          ← {t('backToDashboard')}
        </button>
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
        </div>
      </div>
    </div>
  );
}

export default InventoryManagement;