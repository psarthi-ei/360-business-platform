import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  percentage: number;
  showText?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  showText = true, 
  size = 'md',
  className = '' 
}) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Generate visual bar representation
  const totalBlocks = 10;
  const filledBlocks = Math.round((clampedPercentage / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  
  const filledBar = '█'.repeat(filledBlocks);
  const emptyBar = '░'.repeat(emptyBlocks);
  const visualBar = filledBar + emptyBar;

  return (
    <div className={`${styles.progressContainer} ${styles[size]} ${className}`}>
      <div className={styles.progressBar}>
        <span className={styles.visualBar}>{visualBar}</span>
        {showText && (
          <span className={styles.percentageText}>{clampedPercentage}%</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;