import React, { useMemo, useState } from 'react';
import { mockDeliveryItems, DeliveryItem } from '../../data/deliveryMockData';
import { FinalInvoice, getFinalInvoicesBySalesOrderId } from '../../data/salesMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import ModalPortal from '../ui/ModalPortal';
import styles from './DeliveryFulfillment.module.css';

interface DeliveryFulfillmentProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const DeliveryFulfillment = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled
}: DeliveryFulfillmentProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  const [activeDeliveryForm, setActiveDeliveryForm] = useState<string | null>(null);
  const [activeInvoiceEdit, setActiveInvoiceEdit] = useState<string | null>(null);
  const [activeInvoiceView, setActiveInvoiceView] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<FinalInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<FinalInvoice | null>(null);
  const [parentModalState, setParentModalState] = useState<string | null>(null);

  // Filter delivery items based on status
  const filteredDeliveryItems = useMemo(() => {
    switch (filterState) {
      case 'ready_dispatch': 
        return mockDeliveryItems.filter(item => item.status === 'ready_dispatch');
      case 'delivery_scheduled': 
        return mockDeliveryItems.filter(item => item.status === 'delivery_scheduled');
      case 'dispatched': 
        return mockDeliveryItems.filter(item => item.status === 'dispatched');
      case 'delivered': 
        return mockDeliveryItems.filter(item => item.status === 'delivered');
      case 'failed_returned': 
        return mockDeliveryItems.filter(item => item.status === 'failed_returned');
      default: 
        return mockDeliveryItems;
    }
  }, [filterState]);

  // Toggle card details
  const toggleDetails = (deliveryId: string) => {
    toggleExpansion(deliveryId, 'data-card-id');
  };

  // Delivery Status mapping functions - returns global status classes
  const getDeliveryStatusClass = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'ready_dispatch': return 'ds-card-status-active';
      case 'delivery_scheduled': return 'ds-card-status-pending';
      case 'dispatched': return 'ds-card-priority-medium';
      case 'delivered': return 'ds-card-status-active';
      case 'failed_returned': return 'ds-card-status-inactive';
      default: return 'ds-card-status-pending';
    }
  };

  const getDeliveryStatusIcon = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'ready_dispatch': return '📦';
      case 'delivery_scheduled': return '📋';
      case 'dispatched': return '🚚';
      case 'delivered': return '✅';
      case 'failed_returned': return '❌';
      default: return '📦';
    }
  };

  const getDeliveryStatusText = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'ready_dispatch': return 'Ready for Dispatch';
      case 'delivery_scheduled': return 'Delivery Scheduled';
      case 'dispatched': return 'Dispatched';
      case 'delivered': return 'Delivered';
      case 'failed_returned': return 'Delivery Failed';
      default: return 'Ready for Dispatch';
    }
  };

  const getDeliveryPriorityText = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.priority) {
      case 'urgent': return 'Urgent Priority';
      case 'high': return 'High Priority';
      case 'normal': return '';
      default: return '';
    }
  };

  // Helper function to get invoice status based on delivery workflow
  const getInvoiceStatus = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'ready_dispatch': return '📄 Invoice Pending';
      case 'delivery_scheduled': return '📄 Invoice Generated';
      case 'dispatched': return '📄 Invoice Final';
      case 'delivered': return '📄 Invoice Final';
      case 'failed_returned': return '📄 Invoice Review';
      default: return '';
    }
  };


  // Delivery Workflow Functions
  const startDeliveryAction = (deliveryId: string, action: string) => {
    setActiveDeliveryForm(`${action}-${deliveryId}`);
  };

  const closeDeliveryForm = () => {
    setActiveDeliveryForm(null);
  };

  // Invoice Edit Workflow Functions
  const openInvoiceEdit = (deliveryItem: DeliveryItem) => {
    // Find the final invoice for this delivery item
    const invoices = getFinalInvoicesBySalesOrderId(deliveryItem.salesOrderId);
    if (invoices.length > 0) {
      // Save the current delivery modal state if it's open
      if (activeDeliveryForm) {
        setParentModalState(activeDeliveryForm);
      }
      setEditingInvoice(invoices[0]);
      setActiveInvoiceEdit(deliveryItem.id);
    }
  };

  const closeInvoiceEdit = () => {
    // Clear invoice edit state
    setActiveInvoiceEdit(null);
    setEditingInvoice(null);
    
    // Restore parent delivery modal if it was open when invoice was opened
    if (parentModalState) {
      setActiveDeliveryForm(parentModalState);
      setParentModalState(null);
    }
  };

  const saveInvoiceChanges = (updatedInvoice: FinalInvoice) => {
    // In a real app, this would make an API call
    // For now, we'll just update the local state and close
    closeInvoiceEdit();
  };

  // Invoice View Workflow Functions
  const openInvoiceView = (deliveryItem: DeliveryItem) => {
    // Find the final invoice for this delivery item
    const invoices = getFinalInvoicesBySalesOrderId(deliveryItem.salesOrderId);
    if (invoices.length > 0) {
      // Save the current delivery modal state if it's open
      if (activeDeliveryForm) {
        setParentModalState(activeDeliveryForm);
      }
      setViewingInvoice(invoices[0]);
      setActiveInvoiceView(deliveryItem.id);
    }
  };

  const closeInvoiceView = () => {
    // Clear invoice view state
    setActiveInvoiceView(null);
    setViewingInvoice(null);
    
    // Restore parent delivery modal if it was open when invoice was opened
    if (parentModalState) {
      setActiveDeliveryForm(parentModalState);
      setParentModalState(null);
    }
  };

  // Get action button text based on delivery status
  const getActionButtonText = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'ready_dispatch': return 'Plan Delivery';
      case 'delivery_scheduled': return 'Prepare Dispatch';
      case 'dispatched': return 'Track Delivery';
      case 'delivered': return 'View Proof';
      case 'failed_returned': return 'Reschedule';
      default: return null;
    }
  };

  const getSecondaryActionText = (deliveryItem: DeliveryItem) => {
    switch(deliveryItem.status) {
      case 'dispatched': return 'Call Driver';
      case 'delivered': return 'Get Feedback';
      case 'failed_returned': return 'Contact Customer';
      default: return null;
    }
  };

  // Check if delivery item needs action button
  const hasActionButton = (deliveryItem: DeliveryItem) => {
    return getActionButtonText(deliveryItem) !== null;
  };

  // Handle delivery action
  const handleDeliveryAction = (action: string, deliveryId: string) => {
    startDeliveryAction(deliveryId, action);
  };

  // Render delivery specifications for expanded view
  const renderDeliveryDetails = (deliveryItem: DeliveryItem) => {
    if (deliveryItem.status === 'ready_dispatch') {
      return (
        <>
          <h4>📦 Order Details</h4>
          <p><strong>Job Order:</strong> {deliveryItem.salesOrderId}</p>
          <p><strong>Lot Quantity:</strong> {deliveryItem.quantity}</p>
          <p><strong>Quality Grade:</strong> {deliveryItem.qcGrade}</p>
          <p><strong>Work Order (Lot):</strong> {deliveryItem.workOrderId}</p>

          <h4>📍 Delivery Information</h4>
          <p><strong>Customer:</strong> {deliveryItem.customer}</p>
          <p><strong>Business Profile ID:</strong> {deliveryItem.businessProfileId}</p>

          <h4>📋 Production Summary</h4>
          <p><strong>Ready Since:</strong> {deliveryItem.readyTime}</p>
          <p><strong>Priority:</strong> {deliveryItem.priority}</p>
        </>
      );
    } else if (deliveryItem.status === 'delivery_scheduled') {
      return (
        <>
          <h4>🚚 Logistics Details</h4>
          <p><strong>Vehicle:</strong> {deliveryItem.assignedVehicle}</p>
          <p><strong>Driver:</strong> {deliveryItem.assignedDriver}</p>
          <p><strong>Phone:</strong> {deliveryItem.driverPhone}</p>
          <p><strong>Scheduled Delivery:</strong> {deliveryItem.scheduledDelivery}</p>

          <h4>📍 Delivery Destination</h4>
          <p><strong>Customer:</strong> {deliveryItem.customer}</p>
          <p><strong>Job Order:</strong> {deliveryItem.salesOrderId}</p>
          <p><strong>Business Profile:</strong> {deliveryItem.businessProfileId}</p>
        </>
      );
    } else if (deliveryItem.status === 'dispatched' && deliveryItem.trackingInfo) {
      return (
        <>
          <h4>📍 Live Tracking</h4>
          <p><strong>Current Location:</strong> {deliveryItem.trackingInfo.currentLocation}</p>
          <p><strong>Distance Remaining:</strong> {deliveryItem.trackingInfo.distanceRemaining}</p>
          <p><strong>ETA:</strong> {deliveryItem.trackingInfo.eta}</p>
          <p><strong>Last Updated:</strong> {deliveryItem.trackingInfo.lastUpdated}</p>

          <h4>🛣️ Delivery Progress</h4>
          <p><strong>Route:</strong> {deliveryItem.trackingInfo.route}</p>
          <p><strong>Speed:</strong> {deliveryItem.trackingInfo.speed}</p>

          <h4>📞 Communication</h4>
          <p><strong>Driver:</strong> {deliveryItem.assignedDriver}</p>
          <p><strong>Phone:</strong> {deliveryItem.driverPhone}</p>
        </>
      );
    } else if (deliveryItem.status === 'delivered' && deliveryItem.deliveryProof) {
      return (
        <>
          <h4>📋 Delivery Confirmation</h4>
          <p><strong>Delivery Time:</strong> {deliveryItem.actualDelivery}</p>
          <p><strong>Received By:</strong> {deliveryItem.deliveryProof.receivedBy}</p>
          <p><strong>Designation:</strong> {deliveryItem.deliveryProof.receivedDesignation}</p>
          <p><strong>Condition:</strong> {deliveryItem.deliveryProof.condition}</p>

          <h4>📷 Proof of Delivery</h4>
          <p><strong>Photo Evidence:</strong> {deliveryItem.deliveryProof.photoEvidence ? 'Captured ✅' : 'Not Available'}</p>
          <p><strong>Customer Signature:</strong> {deliveryItem.deliveryProof.customerSignature ? 'Captured ✅' : 'Not Available'}</p>
          
          <h4>📝 Delivery Notes</h4>
          <p>"{deliveryItem.deliveryProof.deliveryNotes}"</p>
        </>
      );
    } else if (deliveryItem.status === 'failed_returned' && deliveryItem.failureInfo) {
      return (
        <>
          <h4>❌ Delivery Failure Details</h4>
          <p><strong>Reason:</strong> {deliveryItem.failureInfo.reason}</p>
          <p><strong>Attempt:</strong> {deliveryItem.failureInfo.attempt} of {deliveryItem.failureInfo.maxAttempts}</p>
          <p><strong>Driver Notes:</strong> "{deliveryItem.failureInfo.driverNotes}"</p>

          <h4>🔄 Return Information</h4>
          <p><strong>Return Status:</strong> {deliveryItem.failureInfo.returnStatus}</p>
          <p><strong>Next Attempt:</strong> {deliveryItem.failureInfo.nextAttemptDate}</p>

          <h4>📞 Customer Contact</h4>
          <p><strong>Customer:</strong> {deliveryItem.customer}</p>
          <p><strong>Business Profile:</strong> {deliveryItem.businessProfileId}</p>
        </>
      );
    }
    return null;
  };

  // Render delivery modal workflows based on action type
  const renderDeliveryModal = () => {
    if (!activeDeliveryForm) return null;

    const parts = activeDeliveryForm.split('-');
    const action = parts[0];
    const deliveryId = parts.slice(1).join('-');
    const deliveryItem = filteredDeliveryItems.find(item => item.id === deliveryId);
    
    if (!deliveryItem) {
      // eslint-disable-next-line no-console
      console.error('🚨 DELIVERY ITEM LOOKUP FAILED:');
      // eslint-disable-next-line no-console
      console.log('Active form:', activeDeliveryForm);
      // eslint-disable-next-line no-console
      console.log('Parsed action:', action);
      // eslint-disable-next-line no-console
      console.log('Parsed deliveryId:', deliveryId);
      // eslint-disable-next-line no-console
      console.log('Available delivery IDs:', filteredDeliveryItems.map(item => item.id));
      // eslint-disable-next-line no-console
      console.log('All delivery items:', filteredDeliveryItems);
      
      return (
        <>
          <div className={styles.modalHeader}>
            <h3>⚠️ Error — Check Console</h3>
            <button className={styles.closeButton} onClick={closeDeliveryForm}>×</button>
          </div>
          <div className={styles.modalBody}>
            <p>Debug info printed to console</p>
            <button className="ds-btn ds-btn-primary" onClick={closeDeliveryForm}>
              Close
            </button>
          </div>
        </>
      );
    }

    const getModalTitle = () => {
      switch (action) {
        case 'primary':
          switch (deliveryItem.status) {
            case 'ready_dispatch': return '📋 Plan Delivery';
            case 'delivery_scheduled': return '📦 Prepare Dispatch';
            case 'dispatched': return '📍 Track Delivery';
            case 'delivered': return '📋 Delivery Proof';
            case 'failed_returned': return '🔄 Reschedule Delivery';
            default: return 'Delivery Action';
          }
        case 'secondary':
          switch (deliveryItem.status) {
            case 'dispatched': return '📞 Call Driver';
            case 'delivered': return '💬 Get Feedback';
            case 'failed_returned': return '📞 Contact Customer';
            default: return 'Secondary Action';
          }
        default: return 'Delivery Action';
      }
    };

    return (
      <>
        <div className={styles.modalHeader}>
          <h3>{getModalTitle()} — {deliveryItem.salesOrderId}</h3>
          <button className={styles.closeButton} onClick={closeDeliveryForm}>×</button>
        </div>
        <div className={styles.modalBody}>
          {renderModalContent(action, deliveryItem)}
        </div>
      </>
    );
  };

  // Render specific modal content based on action and delivery status
  const renderModalContent = (action: string, deliveryItem: DeliveryItem) => {
    if (action === 'primary') {
      switch (deliveryItem.status) {
        case 'ready_dispatch':
          return (
            <div>
              <h4>🚚 Logistics Planning</h4>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Assign Vehicle:
                </label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                  <option>GJ-01-AB-1234 (Truck - Available)</option>
                  <option>GJ-01-CD-5678 (Van - Available)</option>
                  <option>GJ-01-EF-9012 (Mini Truck - Available)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Assign Driver:
                </label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                  <option>Ramesh Kumar (+91-9876543210)</option>
                  <option>Suresh Patel (+91-9876543211)</option>
                  <option>Vikram Shah (+91-9876543212)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Scheduled Delivery Date:
                </label>
                <input 
                  type="datetime-local" 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                  defaultValue="2024-10-25T10:00"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Delivery Instructions:
                </label>
                <textarea 
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  placeholder="Special delivery instructions, route preferences, customer contact notes..."
                />
              </div>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                <h5>📄 Final Tax Invoice</h5>
                <p style={{ marginBottom: '8px', color: '#4a5568', fontSize: '14px' }}>
                  Final tax invoice will be generated for dispatch compliance
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#4a5568' }}>
                  <div>
                    <strong>Invoice Details:</strong><br />
                    Job Order: {deliveryItem.salesOrderId}<br />
                    Amount: ₹{((parseFloat(deliveryItem.quantity.replace(/[^\d]/g, '')) || 1500) * 45).toLocaleString()}
                  </div>
                  <div>
                    <strong>Payment Terms:</strong><br />
                    Due: Net 30 days<br />
                    Method: Bank Transfer
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  ✅ Schedule Delivery & Generate Tax Invoice
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  💾 Save Draft
                </button>
              </div>
            </div>
          );

        case 'delivery_scheduled':
          return (
            <div>
              <h4>📦 Dispatch Preparation</h4>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafb', borderRadius: '6px' }}>
                <p><strong>Vehicle:</strong> {deliveryItem.assignedVehicle}</p>
                <p><strong>Driver:</strong> {deliveryItem.assignedDriver}</p>
                <p><strong>Scheduled:</strong> {deliveryItem.scheduledDelivery}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h5>📋 Pre-Dispatch Checklist</h5>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Vehicle inspection completed</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Goods loaded and secured</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" />
                  <span>Delivery documents prepared</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" />
                  <span>Customer notification sent</span>
                </label>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Loading Notes:
                </label>
                <textarea 
                  rows={2}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  placeholder="Loading condition, packaging notes, special handling..."
                />
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                <h5>📄 Tax Invoice Status</h5>
                <p style={{ marginBottom: '8px', color: '#4a5568', fontSize: '14px' }}>
                  Invoice generated - Last chance to update before dispatch
                </p>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ width: '100%', marginBottom: '8px' }}
                  onClick={() => {
                    closeDeliveryForm();
                    openInvoiceEdit(deliveryItem);
                  }}
                >
                  ✏️ Update Invoice Details
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  🚚 Mark Dispatched
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  ⏰ Delay Dispatch
                </button>
              </div>
            </div>
          );

        case 'dispatched':
          return (
            <div>
              <h4>📍 Live Delivery Tracking</h4>
              {deliveryItem.trackingInfo && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <p><strong>Current Location:</strong> {deliveryItem.trackingInfo.currentLocation}</p>
                  <p><strong>Distance Remaining:</strong> {deliveryItem.trackingInfo.distanceRemaining}</p>
                  <p><strong>ETA:</strong> {deliveryItem.trackingInfo.eta}</p>
                  <p><strong>Speed:</strong> {deliveryItem.trackingInfo.speed}</p>
                  <p><strong>Last Updated:</strong> {deliveryItem.trackingInfo.lastUpdated}</p>
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <h5>📞 Driver Contact</h5>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button 
                    className="ds-btn ds-btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    📞 Call Driver
                  </button>
                  <button 
                    className="ds-btn ds-btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    💬 Send Message
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5>👥 Customer Communication</h5>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button 
                    className="ds-btn ds-btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    📱 Send ETA Update
                  </button>
                  <button 
                    className="ds-btn ds-btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    📞 Call Customer
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Tracking Notes:
                </label>
                <textarea 
                  rows={2}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  placeholder="Route updates, delays, customer communications..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  🔄 Refresh Tracking
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  ❌ Report Issue
                </button>
              </div>
            </div>
          );

        case 'delivered':
          return (
            <div>
              <h4>✅ Delivery Confirmation</h4>
              {deliveryItem.deliveryProof && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <p><strong>Delivery Time:</strong> {deliveryItem.actualDelivery}</p>
                  <p><strong>Received By:</strong> {deliveryItem.deliveryProof.receivedBy}</p>
                  <p><strong>Designation:</strong> {deliveryItem.deliveryProof.receivedDesignation}</p>
                  <p><strong>Condition:</strong> {deliveryItem.deliveryProof.condition}</p>
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <h5>📷 Proof of Delivery</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '20px', background: '#f8fafb', borderRadius: '6px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                    📷<br />Photo Evidence<br />
                    <small style={{ color: '#718096' }}>Available</small>
                  </div>
                  <div style={{ padding: '20px', background: '#f8fafb', borderRadius: '6px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                    ✍️<br />Customer Signature<br />
                    <small style={{ color: '#718096' }}>Captured</small>
                  </div>
                </div>
              </div>

              {deliveryItem.deliveryProof?.deliveryNotes && (
                <div style={{ marginBottom: '16px' }}>
                  <h5>📝 Delivery Notes</h5>
                  <div style={{ padding: '12px', background: '#f8fafb', borderRadius: '6px', fontStyle: 'italic' }}>
                    "{deliveryItem.deliveryProof.deliveryNotes}"
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    openInvoiceView(deliveryItem);
                  }}
                >
                  📄 View Tax Invoice
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📊 Delivery Report
                </button>
              </div>
            </div>
          );

        case 'failed_returned':
          return (
            <div>
              <h4>🔄 Reschedule Delivery</h4>
              {deliveryItem.failureInfo && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  <p><strong>Failure Reason:</strong> {deliveryItem.failureInfo.reason}</p>
                  <p><strong>Attempt:</strong> {deliveryItem.failureInfo.attempt} of {deliveryItem.failureInfo.maxAttempts}</p>
                  <p><strong>Driver Notes:</strong> "{deliveryItem.failureInfo.driverNotes}"</p>
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  New Delivery Date:
                </label>
                <input 
                  type="datetime-local" 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                  defaultValue="2024-10-26T14:00"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Customer Contact Status:
                </label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                  <option>Customer contacted - agreed to reschedule</option>
                  <option>Awaiting customer response</option>
                  <option>Customer requested different time</option>
                  <option>Customer unavailable - trying alternate contact</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Reschedule Notes:
                </label>
                <textarea 
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  placeholder="Customer preferences, alternative arrangements, special instructions..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📅 Reschedule Delivery
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📞 Contact Customer
                </button>
              </div>
            </div>
          );

        default:
          return <p>Unknown delivery status: {deliveryItem.status}</p>;
      }
    } else if (action === 'secondary') {
      switch (deliveryItem.status) {
        case 'dispatched':
          return (
            <div>
              <h4>📞 Call Driver</h4>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px' }}>
                <p><strong>Driver:</strong> {deliveryItem.assignedDriver}</p>
                <p><strong>Phone:</strong> {deliveryItem.driverPhone}</p>
                <p><strong>Vehicle:</strong> {deliveryItem.assignedVehicle}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h5>🎯 Call Purpose</h5>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="radio" name="callPurpose" defaultChecked />
                  <span>Check delivery progress</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="radio" name="callPurpose" />
                  <span>Provide route guidance</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="radio" name="callPurpose" />
                  <span>Customer contact information</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="radio" name="callPurpose" />
                  <span>Emergency assistance</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📞 Call Now
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  💬 Send Message
                </button>
              </div>
            </div>
          );

        case 'delivered':
          return (
            <div>
              <h4>💬 Customer Feedback</h4>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '6px' }}>
                <p><strong>Delivery Completed:</strong> {deliveryItem.actualDelivery}</p>
                <p><strong>Customer:</strong> {deliveryItem.customer}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Feedback Request Method:
                </label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                  <option>SMS with feedback link</option>
                  <option>WhatsApp message</option>
                  <option>Phone call</option>
                  <option>Email survey</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Custom Message:
                </label>
                <textarea 
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  defaultValue="Thank you for choosing us! How was your delivery experience? Please rate our service and share your feedback."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📤 Send Feedback Request
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📞 Call Customer
                </button>
              </div>
            </div>
          );

        case 'failed_returned':
          return (
            <div>
              <h4>📞 Contact Customer</h4>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#fef2f2', borderRadius: '6px' }}>
                <p><strong>Customer:</strong> {deliveryItem.customer}</p>
                <p><strong>Failed Attempt:</strong> {deliveryItem.failureInfo?.attempt} of {deliveryItem.failureInfo?.maxAttempts}</p>
                <p><strong>Failure Reason:</strong> {deliveryItem.failureInfo?.reason}</p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Contact Method:
                </label>
                <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                  <option>Primary phone number</option>
                  <option>Alternative phone number</option>
                  <option>WhatsApp message</option>
                  <option>Email notification</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Message Template:
                </label>
                <textarea 
                  rows={4}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                  defaultValue="Dear Customer, We attempted to deliver your order but were unable to complete the delivery. Please contact us to reschedule at your convenience. Order: SO-XXX"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="ds-btn ds-btn-primary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  📞 Call Customer
                </button>
                <button 
                  className="ds-btn ds-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={closeDeliveryForm}
                >
                  💬 Send Message
                </button>
              </div>
            </div>
          );

        default:
          return <p>Unknown secondary action for status: {deliveryItem.status}</p>;
      }
    }

    return <p>Unknown action: {action}</p>;
  };

  return (
    <div className={styles.deliveryFulfillmentScreen}>
      <div className={styles.pageContent}>
        <div className={styles.deliveryContainer}>
          {filteredDeliveryItems.map(deliveryItem => {
            const statusInfo = {
              icon: getDeliveryStatusIcon(deliveryItem),
              label: getDeliveryStatusText(deliveryItem)
            };

            return (
              <div key={deliveryItem.id} className="ds-card-container" data-card-id={deliveryItem.id}>
                <div 
                  className={`ds-card ${hasActionButton(deliveryItem) ? 'ds-card-with-actions' : ''} ${getDeliveryStatusClass(deliveryItem)} ${isExpanded(deliveryItem.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(deliveryItem.id)}
                >
                  {/* Card Header - Job Order context */}
                  <div className="ds-card-header" title={`${deliveryItem.salesOrderId} - ${deliveryItem.customer} | ${deliveryItem.product}`}>
                    {deliveryItem.salesOrderId} — {deliveryItem.customer}
                  </div>

                  {/* Card Status - Delivery status + due date */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label} • Due: {deliveryItem.dueDate}{getDeliveryPriorityText(deliveryItem) && ` • ${getDeliveryPriorityText(deliveryItem)}`} • {getInvoiceStatus(deliveryItem)}
                  </div>

                  {/* Card Meta - product + quantity + timing */}
                  <div className="ds-card-meta" title={`${deliveryItem.product} • ${deliveryItem.quantity} • Ready: ${deliveryItem.readyTime}`}>
                    {deliveryItem.product} • {deliveryItem.quantity}<br />
                    {deliveryItem.status === 'ready_dispatch' && `Ready Since: ${deliveryItem.readyTime}`}
                    {deliveryItem.status === 'delivery_scheduled' && `Delivery: ${deliveryItem.scheduledDelivery}`}
                    {deliveryItem.status === 'dispatched' && `ETA: ${deliveryItem.estimatedDelivery}`}
                    {deliveryItem.status === 'delivered' && `Delivered: ${deliveryItem.actualDelivery}`}
                    {deliveryItem.status === 'failed_returned' && `Attempt: ${deliveryItem.failureInfo?.attempt}/${deliveryItem.failureInfo?.maxAttempts}`}
                  </div>

                  {/* Card Actions - Surface level delivery actions */}
                  {hasActionButton(deliveryItem) && (
                    <div className="ds-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="ds-btn ds-btn-primary"
                        onClick={() => handleDeliveryAction('primary', deliveryItem.id)}
                      >
                        {getActionButtonText(deliveryItem)}
                      </button>
                      {getSecondaryActionText(deliveryItem) && (
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handleDeliveryAction('secondary', deliveryItem.id)}
                        >
                          {getSecondaryActionText(deliveryItem)}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(deliveryItem.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded(deliveryItem.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      {renderDeliveryDetails(deliveryItem)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Delivery Modal Workflows - 6 Complete Forms */}
        {activeDeliveryForm && !activeInvoiceEdit && !activeInvoiceView && (
          <ModalPortal isOpen={!!activeDeliveryForm} onBackdropClick={closeDeliveryForm}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              {renderDeliveryModal()}
            </div>
          </ModalPortal>
        )}

        {/* Invoice Edit Modal */}
        {activeInvoiceEdit && editingInvoice && (
          <ModalPortal isOpen={!!activeInvoiceEdit} onBackdropClick={closeInvoiceEdit}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <h3>✏️ Edit Tax Invoice — {editingInvoice.id}</h3>
                  {parentModalState && (
                    <span className={styles.breadcrumb}>
                      Delivery Details → Invoice Edit
                    </span>
                  )}
                </div>
                <button className={styles.closeButton} onClick={closeInvoiceEdit}>×</button>
              </div>
              <div className={styles.modalBody}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  
                  // Parse items data
                  const itemsData = editingInvoice.items.map((item, index) => ({
                    ...item,
                    itemCode: formData.get(`itemCode_${index}`) as string || item.itemCode,
                    description: formData.get(`itemDescription_${index}`) as string || item.description,
                    hsnCode: formData.get(`hsnCode_${index}`) as string || item.hsnCode,
                    quantity: parseFloat(formData.get(`quantity_${index}`) as string || '0'),
                    rate: parseFloat(formData.get(`rate_${index}`) as string || '0'),
                    discount: parseFloat(formData.get(`discount_${index}`) as string || '0'),
                    taxableAmount: parseFloat(formData.get(`quantity_${index}`) as string || '0') * parseFloat(formData.get(`rate_${index}`) as string || '0') - parseFloat(formData.get(`discount_${index}`) as string || '0')
                  }));

                  // Calculate totals
                  const subtotal = itemsData.reduce((sum, item) => sum + item.taxableAmount, 0);
                  const totalDiscount = itemsData.reduce((sum, item) => sum + item.discount, 0);
                  const isInterstate = formData.get('isInterstate') === 'true';
                  const gstRate = isInterstate ? 5 : 5; // 5% total (or split CGST+SGST)
                  const totalTax = (subtotal * gstRate) / 100;

                  const updatedInvoice: FinalInvoice = {
                    ...editingInvoice,
                    invoiceDate: formData.get('invoiceDate') as string,
                    dueDate: formData.get('dueDate') as string,
                    
                    company: {
                      ...editingInvoice.company,
                      name: formData.get('companyName') as string || editingInvoice.company.name,
                      address: formData.get('companyAddress') as string || editingInvoice.company.address,
                      gstNumber: formData.get('companyGst') as string || editingInvoice.company.gstNumber,
                      phone: formData.get('companyPhone') as string || editingInvoice.company.phone,
                      email: formData.get('companyEmail') as string || editingInvoice.company.email
                    },
                    
                    customer: {
                      ...editingInvoice.customer,
                      name: formData.get('customerName') as string || editingInvoice.customer.name,
                      billingAddress: formData.get('customerAddress') as string || editingInvoice.customer.billingAddress,
                      gstNumber: formData.get('customerGst') as string || editingInvoice.customer.gstNumber,
                      phone: formData.get('customerPhone') as string || editingInvoice.customer.phone
                    },
                    
                    items: itemsData,
                    
                    taxDetails: {
                      isInterstate,
                      cgstRate: isInterstate ? 0 : 2.5,
                      sgstRate: isInterstate ? 0 : 2.5,
                      igstRate: isInterstate ? 5 : 0,
                      cgstAmount: isInterstate ? 0 : totalTax / 2,
                      sgstAmount: isInterstate ? 0 : totalTax / 2,
                      igstAmount: isInterstate ? totalTax : 0
                    },
                    
                    paymentDetails: {
                      ...editingInvoice.paymentDetails,
                      advanceReceived: parseFloat(formData.get('advanceReceived') as string || '0'),
                      balanceDue: subtotal + totalTax - parseFloat(formData.get('advanceReceived') as string || '0'),
                      paymentTerms: formData.get('paymentTerms') as string || editingInvoice.paymentDetails.paymentTerms
                    },
                    
                    subtotal,
                    totalDiscount,
                    taxableAmount: subtotal,
                    totalTax,
                    totalAmount: subtotal + totalTax,
                    notes: formData.get('notes') as string || ''
                  };
                  
                  saveInvoiceChanges(updatedInvoice);
                }}>
                  
                  {/* Basic Invoice Information */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafb', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📄 Invoice Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Invoice Date:
                        </label>
                        <input 
                          type="date" 
                          name="invoiceDate"
                          defaultValue={editingInvoice.invoiceDate}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Due Date:
                        </label>
                        <input 
                          type="date" 
                          name="dueDate"
                          defaultValue={editingInvoice.dueDate}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>🏭 Company Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Company Name:
                        </label>
                        <input 
                          type="text" 
                          name="companyName"
                          defaultValue={editingInvoice.company.name}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          GST Number:
                        </label>
                        <input 
                          type="text" 
                          name="companyGst"
                          defaultValue={editingInvoice.company.gstNumber}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Address:
                      </label>
                      <textarea 
                        name="companyAddress"
                        defaultValue={editingInvoice.company.address}
                        rows={2}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Phone:
                        </label>
                        <input 
                          type="tel" 
                          name="companyPhone"
                          defaultValue={editingInvoice.company.phone}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Email:
                        </label>
                        <input 
                          type="email" 
                          name="companyEmail"
                          defaultValue={editingInvoice.company.email}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>👤 Customer Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Customer Name:
                        </label>
                        <input 
                          type="text" 
                          name="customerName"
                          defaultValue={editingInvoice.customer.name}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Customer GST:
                        </label>
                        <input 
                          type="text" 
                          name="customerGst"
                          defaultValue={editingInvoice.customer.gstNumber}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Billing Address:
                      </label>
                      <textarea 
                        name="customerAddress"
                        defaultValue={editingInvoice.customer.billingAddress}
                        rows={2}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Phone:
                      </label>
                      <input 
                        type="tel" 
                        name="customerPhone"
                        defaultValue={editingInvoice.customer.phone}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Items Section */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbeb', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📦 Invoice Items</h4>
                    {editingInvoice.items.map((item, index) => (
                      <div key={index} style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Item Code:
                            </label>
                            <input 
                              type="text" 
                              name={`itemCode_${index}`}
                              defaultValue={item.itemCode}
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              HSN Code:
                            </label>
                            <input 
                              type="text" 
                              name={`hsnCode_${index}`}
                              defaultValue={item.hsnCode}
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Unit:
                            </label>
                            <input 
                              type="text" 
                              name={`unit_${index}`}
                              defaultValue={item.unit}
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                              required
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                            Description:
                          </label>
                          <input 
                            type="text" 
                            name={`itemDescription_${index}`}
                            defaultValue={item.description}
                            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                            required
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Quantity:
                            </label>
                            <input 
                              type="number" 
                              name={`quantity_${index}`}
                              defaultValue={item.quantity}
                              step="0.01"
                              min="0"
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Rate (₹):
                            </label>
                            <input 
                              type="number" 
                              name={`rate_${index}`}
                              defaultValue={item.rate}
                              step="0.01"
                              min="0"
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Discount (₹):
                            </label>
                            <input 
                              type="number" 
                              name={`discount_${index}`}
                              defaultValue={item.discount}
                              step="0.01"
                              min="0"
                              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #e1e8ed', fontSize: '14px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>
                              Amount (₹):
                            </label>
                            <div style={{ padding: '6px', background: '#f3f4f6', borderRadius: '4px', fontSize: '14px', fontWeight: '600' }}>
                              ₹{item.taxableAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tax Configuration */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#fef3f2', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📊 GST Configuration</h4>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          name="isInterstate"
                          defaultChecked={editingInvoice.taxDetails.isInterstate}
                          value="true"
                        />
                        <span style={{ fontWeight: '500' }}>Interstate Transaction (IGST)</span>
                      </label>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#6b7280' }}>
                        Check if customer is in a different state
                      </p>
                    </div>
                    <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                      <h5 style={{ margin: '0 0 8px 0' }}>Tax Breakdown:</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '14px' }}>
                        <div>
                          <strong>CGST (2.5%):</strong><br />
                          ₹{editingInvoice.taxDetails.cgstAmount.toLocaleString()}
                        </div>
                        <div>
                          <strong>SGST (2.5%):</strong><br />
                          ₹{editingInvoice.taxDetails.sgstAmount.toLocaleString()}
                        </div>
                        <div>
                          <strong>IGST (5%):</strong><br />
                          ₹{editingInvoice.taxDetails.igstAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f4ff', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>💰 Payment Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Advance Received (₹):
                        </label>
                        <input 
                          type="number" 
                          name="advanceReceived"
                          defaultValue={editingInvoice.paymentDetails.advanceReceived}
                          step="0.01"
                          min="0"
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Payment Terms:
                        </label>
                        <select 
                          name="paymentTerms"
                          defaultValue={editingInvoice.paymentDetails.paymentTerms}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed' }}
                        >
                          <option value="Net 15 days">Net 15 days</option>
                          <option value="Net 30 days">Net 30 days</option>
                          <option value="Immediate">Immediate</option>
                          <option value="On Delivery">On Delivery</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                      <h5 style={{ margin: '0 0 8px 0' }}>Amount Summary:</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '14px' }}>
                        <div>
                          <strong>Subtotal:</strong><br />
                          ₹{editingInvoice.subtotal.toLocaleString()}
                        </div>
                        <div>
                          <strong>Total Tax:</strong><br />
                          ₹{editingInvoice.totalTax.toLocaleString()}
                        </div>
                        <div>
                          <strong>Total Amount:</strong><br />
                          ₹{editingInvoice.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', padding: '8px', background: '#f3f4f6', borderRadius: '4px' }}>
                        <strong>Balance Due: ₹{editingInvoice.paymentDetails.balanceDue.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Invoice Notes:
                    </label>
                    <textarea 
                      name="notes"
                      defaultValue={editingInvoice.notes}
                      rows={3}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e1e8ed', resize: 'vertical' }}
                      placeholder="Payment terms, special instructions, additional details..."
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="submit"
                      className="ds-btn ds-btn-primary" 
                      style={{ flex: 1 }}
                    >
                      💾 Save Changes
                    </button>
                    <button 
                      type="button"
                      className="ds-btn ds-btn-secondary" 
                      style={{ flex: 1 }}
                      onClick={closeInvoiceEdit}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Invoice View Modal */}
        {activeInvoiceView && viewingInvoice && (
          <ModalPortal isOpen={!!activeInvoiceView} onBackdropClick={closeInvoiceView}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <h3>📄 Tax Invoice — {viewingInvoice.invoiceNumber}</h3>
                  {parentModalState && (
                    <span className={styles.breadcrumb}>
                      Delivery Details → Invoice View
                    </span>
                  )}
                </div>
                <button className={styles.closeButton} onClick={closeInvoiceView}>×</button>
              </div>
              <div className={styles.modalBody}>
                {/* Read-only Invoice Display */}
                <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '8px' }}>
                  
                  {/* Invoice Header */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafb', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📄 Invoice Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px', color: '#4a5568' }}>
                          Invoice Number:
                        </label>
                        <div style={{ fontSize: '16px', color: '#1a202c' }}>{viewingInvoice.invoiceNumber}</div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px', color: '#4a5568' }}>
                          Invoice Date:
                        </label>
                        <div style={{ fontSize: '16px', color: '#1a202c' }}>{viewingInvoice.invoiceDate}</div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px', color: '#4a5568' }}>
                          Due Date:
                        </label>
                        <div style={{ fontSize: '16px', color: '#1a202c' }}>{viewingInvoice.dueDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>🏢 From</h4>
                    <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{viewingInvoice.company.name}</div>
                      <div style={{ marginBottom: '8px' }}>{viewingInvoice.company.address}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
                        <div><strong>GST:</strong> {viewingInvoice.company.gstNumber}</div>
                        <div><strong>PAN:</strong> {viewingInvoice.company.panNumber}</div>
                        <div><strong>Phone:</strong> {viewingInvoice.company.phone}</div>
                        <div><strong>Email:</strong> {viewingInvoice.company.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>👤 Bill To</h4>
                    <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{viewingInvoice.customer.name}</div>
                      <div style={{ marginBottom: '8px' }}>{viewingInvoice.customer.billingAddress}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
                        <div><strong>GST:</strong> {viewingInvoice.customer.gstNumber}</div>
                        <div><strong>PAN:</strong> {viewingInvoice.customer.panNumber}</div>
                        <div><strong>Phone:</strong> {viewingInvoice.customer.phone}</div>
                        <div><strong>State:</strong> {viewingInvoice.customer.stateCode}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#fefce8', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>📦 Items</h4>
                    {viewingInvoice.items.map((item, index) => (
                      <div key={index} style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #e1e8ed' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>{item.description}</div>
                            <div style={{ fontSize: '14px', color: '#4a5568' }}>Code: {item.itemCode} | HSN: {item.hsnCode}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: '#4a5568' }}>Quantity</div>
                            <div style={{ fontWeight: '500' }}>{item.quantity} {item.unit}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: '#4a5568' }}>Rate</div>
                            <div style={{ fontWeight: '500' }}>₹{item.rate.toLocaleString()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: '#4a5568' }}>Amount</div>
                            <div style={{ fontWeight: '600' }}>₹{item.taxableAmount.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tax Details */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#fdf2f8', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: '#374151' }}>💰 Tax Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '14px' }}>
                      <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {viewingInvoice.taxDetails.isInterstate ? 'IGST' : 'CGST'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                          ₹{viewingInvoice.taxDetails.isInterstate ? viewingInvoice.taxDetails.igstAmount.toLocaleString() : viewingInvoice.taxDetails.cgstAmount.toLocaleString()}
                        </div>
                      </div>
                      {!viewingInvoice.taxDetails.isInterstate && (
                        <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                          <div style={{ fontWeight: '600', color: '#374151' }}>SGST</div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                            ₹{viewingInvoice.taxDetails.sgstAmount.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#f1f5f9', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>📊 Invoice Summary</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', fontSize: '14px' }}>
                      <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>Subtotal</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                          ₹{viewingInvoice.subtotal.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>Total Tax</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>
                          ₹{viewingInvoice.totalTax.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>Total Amount</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1f2937' }}>
                          ₹{viewingInvoice.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '8px', background: 'white', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>Balance Due</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#7c2d12' }}>
                          ₹{viewingInvoice.paymentDetails.balanceDue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>💳 Payment Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                      <div>
                        <strong>Advance Received:</strong> ₹{viewingInvoice.paymentDetails.advanceReceived.toLocaleString()}
                      </div>
                      <div>
                        <strong>Payment Terms:</strong> {viewingInvoice.paymentDetails.paymentTerms}
                      </div>
                    </div>
                    {viewingInvoice.notes && (
                      <div style={{ marginTop: '12px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                        <strong>Notes:</strong> {viewingInvoice.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    className="ds-btn ds-btn-primary" 
                    style={{ flex: 1 }}
                    onClick={closeInvoiceView}
                  >
                    ✅ Close
                  </button>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}
      </div>
    </div>
  );
};

export default DeliveryFulfillment;