import React from 'react';
import { getWorkOrdersBySalesOrder } from '../../data/productionMockData';
import styles from './WorkOrdersList.module.css';

interface WorkOrdersListProps {
  salesOrderId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const WorkOrdersList: React.FC<WorkOrdersListProps> = ({
  salesOrderId,
  isExpanded,
  onToggle
}) => {
  const workOrders = getWorkOrdersBySalesOrder(salesOrderId);
  
  // Status mapping for work orders
  const getWorkOrderStatusIcon = (status: string, progress: number) => {
    if (status === 'completed' || progress === 100) return '✅';
    if (status === 'in_progress' && progress > 0) return '🟡';
    if (status === 'pending' || progress === 0) return '🔴';
    return '🟡';
  };
  
  const getWorkOrderStatusText = (status: string, progress: number) => {
    if (status === 'completed' || progress === 100) return 'Done';
    if (status === 'in_progress' && progress > 0) return 'Running';
    if (status === 'pending' || progress === 0) return 'Not Started';
    return 'Running';
  };

  return (
    <div className={styles.workOrdersSection}>
      {/* Direct Work Orders List - No toggle header needed */}
      <div className={styles.workOrdersList}>
          {workOrders.length === 0 ? (
            <div className={styles.emptyWorkOrders}>
              <p>No work orders created yet</p>
              <p>Click "Start Production" to create work orders</p>
            </div>
          ) : (
            workOrders.map(workOrder => {
              const statusIcon = getWorkOrderStatusIcon(workOrder.status, workOrder.progress);
              const statusText = getWorkOrderStatusText(workOrder.status, workOrder.progress);
              
              return (
                <div key={workOrder.id} className={styles.workOrderItem}>
                  <div className={styles.workOrderHeader}>
                    <span className={styles.workOrderId}>- {workOrder.id}</span>
                    <span className={styles.machineAssignment}>
                      {workOrder.assignedMachine} | {workOrder.targetQuantity}
                    </span>
                  </div>
                  <div className={styles.workOrderStatus}>
                    <span className={styles.statusIndicator}>
                      {statusIcon} {statusText}
                    </span>
                    {workOrder.progress > 0 && workOrder.progress < 100 && (
                      <span className={styles.progressInfo}>
                        ({workOrder.producedQuantity} / {workOrder.targetQuantity})
                      </span>
                    )}
                  </div>
                  {workOrder.assignedWorker && (
                    <div className={styles.workerAssignment}>
                      Worker: {workOrder.assignedWorker}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
    </div>
  );
};

export default WorkOrdersList;