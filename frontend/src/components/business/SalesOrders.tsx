import React, { useCallback } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockSalesOrders, 
  mockJobOrders,
  mockQuotes, 
  mockLeads,
  mockProformaInvoices,
  OrderItem,
  SalesOrder
} from '../../data/salesMockData';
import { useTranslation } from '../../contexts/TranslationContext';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './SalesOrders.module.css';

// Unified order type for processing both sales orders and job orders
// Use base SalesOrder interface with additional discriminator fields
type UnifiedOrder = SalesOrder & {
  orderType: 'sales_order' | 'job_order';
  materialOwnership: 'company' | 'client';
  paymentType: 'advance' | 'credit';
  // Job order specific fields (optional for sales orders)
  serviceType?: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  creditTerms?: 15 | 30 | 45;
  expectedClientMaterialNames?: string[];
};

interface SalesOrdersProps {
  onShowLeadManagement?: () => void;
  onShowQuotationOrders?: () => void;
  onShowPayments?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  includeJobOrders?: boolean; // New prop to control job order inclusion
}

function SalesOrders({
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowPayments,
  filterState,
  onFilterChange,
  includeJobOrders = true // Default to include both types
}: SalesOrdersProps) {
  const { t } = useTranslation();
  
  // Use terminology hook for local terminology
  const { 
    customer, lead, quote, order: orderTerm 
  } = useTerminologyTerms();
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = useCallback((orderId: string) => {
    toggleExpansion(orderId, 'data-order-id');
    
    // Items now shown directly - no separate collapse needed
  }, [toggleExpansion]);
  
  // Removed nested items expansion - items now shown directly in main expanded view
  
  // ✅ NEW: Unified order processing
  const getAllOrders = useCallback((): UnifiedOrder[] => {
    // Convert sales orders to unified format
    const salesOrders: UnifiedOrder[] = mockSalesOrders.map(order => ({
      ...order,
      orderType: 'sales_order' as const,
      materialOwnership: 'company' as const,
      paymentType: 'advance' as const
    }));
    
    // Convert job orders to unified format  
    const jobOrders: UnifiedOrder[] = includeJobOrders ? mockJobOrders.map(order => ({
      ...order,
      orderType: 'job_order' as const,
      materialOwnership: 'client' as const,
      paymentType: 'credit' as const
    })) : [];
    
    // Merge and sort by date
    return [...salesOrders, ...jobOrders].sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }, [includeJobOrders]);
  
  // ✅ NEW: Enhanced filtering for dual order types
  const getFilteredOrders = useCallback((): UnifiedOrder[] => {
    const allOrders = getAllOrders();
    
    return allOrders.filter(order => {
      // Apply existing filter logic
      if (filterState === 'all') return true;
      if (filterState === 'pending' && order.status === 'order_confirmed') return true;
      if (filterState === 'production' && order.status === 'production_started') return true;
      return false;
    });
  }, [getAllOrders, filterState]);
  
  // Helper function to get payment details for an order from ProformaInvoice data
  const getOrderPaymentDetails = (orderId: string, totalAmount: number, quoteId?: string, orderType?: string) => {
    // Job Orders are credit-based - check actual receivables data for payment status
    if (orderType === 'job_order') {
      // Import receivables data and final payments to get actual payment status
      const { mockReceivables, mockFinalPayments, mockFinalInvoices } = require('../../data/salesMockData');
      const receivableRecord = mockReceivables.find((rec: { orderId: string }) => rec.orderId === orderId);
      
      if (receivableRecord) {
        // Get actual payments made for this invoice
        const invoice = mockFinalInvoices?.find((inv: { salesOrderId: string }) => inv.salesOrderId === orderId);
        const payments = invoice ? mockFinalPayments?.filter((payment: { finalInvoiceId: string }) => payment.finalInvoiceId === invoice.id) || [] : [];
        
        // Calculate actual amount received from payment records
        const actualAmountReceived = payments.reduce((total: number, payment: { amount: number; status: string }) => {
          return payment.status === 'reconciled' || payment.status === 'verified' || payment.status === 'received' 
            ? total + payment.amount 
            : total;
        }, 0);
        
        // Use receivableRecord.receivedAmount if available, otherwise use calculated amount
        const amountReceived = receivableRecord.receivedAmount || actualAmountReceived;
        const balanceAmount = receivableRecord.originalAmount - amountReceived;
        
        let paymentStatus = 'pending';
        
        if (balanceAmount === 0) {
          paymentStatus = 'received'; // Fully paid
        } else if (receivableRecord.daysPastDue > 0) {
          paymentStatus = 'overdue'; // Overdue payment
        } else if (amountReceived > 0) {
          paymentStatus = 'partial'; // Partial payment received
        }
        
        return {
          advanceAmount: 0, // No advance for Job Orders
          advanceReceived: amountReceived,
          balanceAdvance: balanceAmount,
          paymentStatus: paymentStatus as 'pending' | 'received' | 'overdue' | 'partial',
          advancePercentage: 0
        };
      }
      
      // Fallback if no receivable record found
      return {
        advanceAmount: 0, // No advance for Job Orders
        advanceReceived: 0,
        balanceAdvance: totalAmount, // Full amount pending until completion
        paymentStatus: 'pending' as 'pending',
        advancePercentage: 0
      };
    }
    
    // Sales Orders logic - advance payment model
    let advanceAmount = 0;
    let advancePercentage = 0;
    
    // Find related ProformaInvoice through quote
    if (quoteId) {
      const relatedProformaInvoice = mockProformaInvoices.find(pi => pi.quoteId === quoteId);
      if (relatedProformaInvoice) {
        advanceAmount = relatedProformaInvoice.advanceAmount;
        advancePercentage = Math.round((advanceAmount / relatedProformaInvoice.totalAmount) * 100);
      }
    }
    
    // Sales Order payment simulation based on ID
    let advanceReceived = 0;
    let paymentStatus = 'pending';
    
    if (orderId === 'SO-001') {
      paymentStatus = 'overdue';
      advanceReceived = 0;
    } else if (orderId === 'SO-002') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
    } else if (orderId === 'SO-003') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
    }
    
    return {
      advanceAmount,
      advanceReceived,
      balanceAdvance: advanceAmount - advanceReceived,
      paymentStatus,
      advancePercentage
    };
  };
  
  // Helper function to check if order has structured items
  const hasStructuredItems = (order: { items: OrderItem[] }): boolean => {
    return !!(order.items && order.items.length > 0);
  };
  
  // Get formatted items display for header (concise)
  const getOrderItemsHeader = (order: { items: OrderItem[] }): string => {
    if (hasStructuredItems(order)) {
      const items = order.items as OrderItem[];
      if (items.length === 1) {
        return `${items[0].description} (${items[0].quantity} ${items[0].unit})`;
      } else {
        // Show first item details + more count for multiple items
        const firstItem = items[0];
        const remainingCount = items.length - 1;
        return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
      }
    }
    // Fallback display
    return "No items";
  };
  
  // Get formatted items display for details (comprehensive with production tracking)
  const renderOrderItemsDetails = (order: { items: OrderItem[]; progressPercentage?: number }) => {
    if (hasStructuredItems(order)) {
      const items = order.items as OrderItem[];
      
      return (
        <div className={styles.itemsEnhanced}>
          <div className={styles.itemsList}>
            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemRowHeader}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCodeBadge}>
                        {item.itemCode}
                      </span>
                      <span className={styles.itemDescription}>
                        {item.description}
                      </span>
                    </div>
                    <div className={styles.itemDetails}>
                      <span>
                        <strong>HSN:</strong> {item.hsnCode}
                      </span>
                      <span>
                        <strong>Qty:</strong> {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      <span>
                        <strong>Rate:</strong> {formatCurrency(item.rate)}/{item.unit}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemAmount}>
                    <div className={styles.itemAmountValue}>
                      {formatCurrency(item.taxableAmount)}
                    </div>
                    {item.discount > 0 && (
                      <div className={styles.itemDiscount}>
                        -{item.discount}% discount
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Fallback display
    return (
      <div className={styles.basicItemsDisplay}>
        <p><strong>Items:</strong> No items available</p>
        {order.progressPercentage !== undefined && (
          <div className={styles.basicProgress}>
            <span>Production Progress: {order.progressPercentage}%</span>
            <div className={styles.basicProgressBar}>
              <div 
                className={styles.basicProgressFill}
                style={{ width: `${order.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.salesOrdersScreen}>
      <div className={styles.pageContent}>
      
      
      <div className={styles.ordersContainer}>
        {getFilteredOrders().map(order => {

          const statusIcons = {
            // Core customer-facing states
            order_confirmed: '✅',
            payment_pending: '💳',
            materials_pending: '📦',
            in_process: '🔄',
            quality_check: '🔍',
            ready_to_ship: '🚚',
            shipped: '🛫',
            delivered: '📍',
            completed: '🎉',
            on_hold: '⏸️',
            cancelled: '❌',
            
            // Legacy SalesOrder status values (compatibility)
            production_planning: '📋',
            pending_materials: '📦',
            production_started: '🏭',
            production_completed: '✅',
            in_transit: '🚛',
            
            // Legacy JobOrder status values (compatibility)
            awaiting_client_materials: '📥',
            materials_acknowledged: '✅',
            service_completed: '🎯',
            ready_for_invoice: '💰'
          };

          const statusLabels = {
            // Core customer-facing states
            order_confirmed: 'Order Confirmed',
            payment_pending: 'Payment Pending',
            materials_pending: 'Materials Pending',
            in_process: 'In Process',
            quality_check: 'Quality Check',
            ready_to_ship: 'Ready to Ship',
            shipped: 'Shipped',
            delivered: 'Delivered',
            completed: t('completed') || 'Completed',
            on_hold: 'On Hold',
            cancelled: 'Cancelled',
            
            // Legacy SalesOrder status values (compatibility)
            production_planning: 'Planning Production',
            pending_materials: 'Awaiting Materials',
            production_started: t('inProduction') || 'In Production',
            production_completed: 'Production Done',
            in_transit: 'In Transit',
            
            // Legacy JobOrder status values (compatibility)
            awaiting_client_materials: `Awaiting ${customer} Materials`,
            materials_acknowledged: 'Materials Received',
            service_completed: 'Service Completed',
            ready_for_invoice: 'Ready for Invoice'
          };

          const relatedQuote = mockQuotes.find(quote => quote.id === order.quoteId);
          const relatedLead = relatedQuote ? mockLeads.find(lead => lead.id === relatedQuote.leadId) : null;
          const paymentDetails = getOrderPaymentDetails(order.id, order.totalAmount, order.quoteId, order.orderType);

          const businessProfile = getBusinessProfileById(order.businessProfileId);
          const companyName = businessProfile?.companyName || 'Unknown Company';

          return (
            <div key={order.id} className="ds-card-container" data-order-id={order.id}>
              {/* Clickable Card Summary - Global Design System 140px Template */}
              <div 
                className={`ds-card ${order.status === 'completed' || order.status === 'delivered' ? 'ds-card-status-active' : order.status === 'order_confirmed' || order.status === 'production_started' || order.status === 'shipped' ? 'ds-card-status-pending' : 'ds-card-priority-medium'} ${isExpanded(order.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(order.id)}
              >
                {/* Enhanced Header - Company Name + Items Context + Order Type */}
                <div 
                  className="ds-card-header"
                  title={`${companyName} - ${getOrderItemsHeader(order)} (${order.orderType === 'job_order' ? 'Job Work' : 'Sales Order'} ID: ${order.id})`}
                >
                  {order.orderType === 'job_order' ? '🔧' : '📦'} {companyName} — {getOrderItemsHeader(order)}
                </div>
                
                {/* Optimized Status - Primary Order Status Only */}
                <div className="ds-card-status">
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </div>
                
                {/* Business-Optimized Meta - Value + Urgency + Delivery Timeline */}
                <div 
                  className="ds-card-meta"
                  title={`${formatCurrency(order.totalAmount)} • Due: ${order.deliveryDate} • ${order.orderDate}`}
                >
                  {formatCurrency(order.totalAmount)} • Due: {order.deliveryDate}<br />
                  {order.id} • {order.orderDate}
                </div>

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {isExpanded(order.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Progressive Disclosure - Professional Sectioned Layout */}
              {isExpanded(order.id) && (
                <div className={styles.expandedSection}>
                  <>
                    {/* SECTION 1: Order Summary (Top Priority) */}
                  <div className={order.orderType === 'job_order' ? styles.jobOrderSummarySection : styles.salesOrderSummarySection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>{order.orderType === 'job_order' ? '🔧' : '📦'}</span>
                        {order.orderType === 'job_order' ? `${orderTerm} Summary` : `${orderTerm} Summary`}
                      </h4>
                    </div>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryDetails}>
                        {order.orderType === 'job_order' && (
                          <p><strong>Service Type:</strong> {('serviceType' in order && order.serviceType) ? order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1) : 'Standard Processing'}</p>
                        )}
                        <p><strong>{order.orderType === 'job_order' ? `${orderTerm} Value:` : `${orderTerm} Value:`}</strong> {formatCurrency(order.totalAmount)}</p>
                        <p><strong>{order.orderType === 'job_order' ? 'Credit Terms:' : 'Payment Terms:'}</strong> {order.orderType === 'job_order' && 'creditTerms' in order && order.creditTerms ? `${order.creditTerms} days` : 'Standard Terms'}</p>
                        <p><strong>Material Ownership:</strong> {order.materialOwnership === 'client' ? `👤 ${customer} Owned Materials` : '🏭 Company Materials'}</p>
                      </div>
                      <div className={styles.statusDetails}>
                        <p><strong>Current Status:</strong> {order.statusMessage}</p>
                        <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                        {order.progressPercentage !== undefined && (
                          <div className={styles.progressSection}>
                            {order.status === 'materials_pending' ? (
                              <p><strong>Progress:</strong> Awaiting materials delivery</p>
                            ) : (
                              <>
                                <p><strong>Progress:</strong> {order.progressPercentage}% completed</p>
                                <div className={styles.progressBar}>
                                  <div 
                                    className={styles.progressFill}
                                    style={{ width: `${order.progressPercentage}%` }}
                                  ></div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Service Requirements & Processing Details (Job Orders Only) */}
                  {order.orderType === 'job_order' && 'serviceRequirements' in order && order.serviceRequirements && 
                   typeof order.serviceRequirements === 'object' && 'materialType' in order.serviceRequirements && (
                    <div className={styles.serviceRequirementsSection}>
                      <div className={styles.sectionHeader}>
                        <h4 className={styles.sectionTitle}>
                          <span className={styles.sectionIcon}>⚙️</span>
                          Service Requirements
                        </h4>
                      </div>
                      <div className={styles.requirementsGrid}>
                        <div className={styles.serviceDetails}>
                          <p><strong>Material Type:</strong> {(order.serviceRequirements as any).materialType || 'Not specified'}</p>
                          <p><strong>Quantity:</strong> {((order.serviceRequirements as any).quantity || 0).toLocaleString()} {(order.serviceRequirements as any).unit || 'units'}</p>
                          <p><strong>Delivery Timeline:</strong> {(order.serviceRequirements as any).deliveryTimeline || 'Not specified'}</p>
                        </div>
                        <div className={styles.specifications}>
                          {(order.serviceRequirements as any).customerSpecifications && (
                            <>
                              <p><strong>{customer} Specifications:</strong></p>
                              <ul className={styles.specsList}>
                                {Object.entries((order.serviceRequirements as any).customerSpecifications).map(([key, value]) => (
                                  <li key={key}>
                                    <span>
                                      {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(value) ? value.join(', ') : value}`}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                          {(order.serviceRequirements as any).specialInstructions && (
                            <p><strong>Special Instructions:</strong> {(order.serviceRequirements as any).specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: Party Materials & Tracking */}
                  {order.orderType === 'job_order' && 'expectedClientMaterialNames' in order && order.expectedClientMaterialNames && (
                    <div className={styles.clientMaterialsSection}>
                      <div className={styles.sectionHeader}>
                        <h4 className={styles.sectionTitle}>
                          <span className={styles.sectionIcon}>📦</span>
                          {customer} Materials Tracking
                        </h4>
                      </div>
                      <div className={styles.materialsContent}>
                        <p><strong>Expected Materials:</strong></p>
                        <ul className={styles.materialsList}>
                          {order.expectedClientMaterialNames.map((material, index) => (
                            <li key={index} className={styles.materialItem}>
                              <span className={styles.materialStatus}>📥</span>
                              {material}
                            </li>
                          ))}
                        </ul>
                        <p className={styles.materialNote}>
                          <strong>Material Status:</strong> {order.status === 'order_confirmed' ? 'Awaiting material receipt' : 
                          order.status === 'production_started' ? 'Materials received and in process' : 'Processing stage'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: Financial & Payment Information */}
                  <div className={styles.financialSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>💳</span>
                        Financial & Payment Information
                      </h4>
                    </div>
                    <div className={styles.financialGrid}>
                      <div className={styles.paymentDetails}>
                        <p>
                          <strong>Payment Status:</strong> 
                          <span 
                            className={styles.mappingLink} 
                            onClick={() => onShowPayments && onShowPayments()}
                            title="View payment details"
                            style={{ marginLeft: '8px' }}
                          >
                            {order.orderType === 'job_order' ? (
                              // Use actual payment status from receivables data for job orders
                              paymentDetails.paymentStatus === 'received' ? (
                                <span style={{ color: '#27ae60' }}>
                                  ✅ Paid {formatCurrency(paymentDetails.advanceReceived)} / {formatCurrency(order.totalAmount)}
                                </span>
                              ) : paymentDetails.paymentStatus === 'overdue' ? (
                                <span style={{ color: '#e74c3c' }}>
                                  🔴 Overdue {formatCurrency(paymentDetails.balanceAdvance)} pending
                                </span>
                              ) : paymentDetails.paymentStatus === 'partial' ? (
                                <span style={{ color: '#f39c12' }}>
                                  💳 Partial Payment {formatCurrency(paymentDetails.advanceReceived)} / {formatCurrency(order.totalAmount)}
                                </span>
                              ) : (
                                <span style={{ color: '#f39c12' }}>
                                  💳 Credit Order - Bill on Completion ({formatCurrency(order.totalAmount)})
                                </span>
                              )
                            ) : paymentDetails.paymentStatus === 'received' ? (
                              <span style={{ color: '#27ae60' }}>
                                ✅ Received {formatCurrency(paymentDetails.advanceReceived)} / {formatCurrency(paymentDetails.advanceAmount)}
                              </span>
                            ) : paymentDetails.paymentStatus === 'overdue' ? (
                              <span style={{ color: '#e74c3c' }}>
                                🔴 Overdue {formatCurrency(paymentDetails.balanceAdvance)} pending
                              </span>
                            ) : (
                              <span style={{ color: '#f39c12' }}>
                                ⏳ Pending {formatCurrency(paymentDetails.balanceAdvance)} of {formatCurrency(paymentDetails.advanceAmount)}
                              </span>
                            )}
                          </span>
                        </p>
                        {order.balancePaymentDue && order.balancePaymentDue > 0 && (
                          <p><strong>Balance Due:</strong> {formatCurrency(order.balancePaymentDue)}</p>
                        )}
                        {order.orderType === 'job_order' && 'creditApprovalStatus' in order && (
                          <p><strong>Credit Approval:</strong> {(order as any).creditApprovalStatus} {(order as any).creditApprovalBy && `by ${(order as any).creditApprovalBy}`}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: Service Item Details */}
                  {hasStructuredItems(order) && (
                    <div className={styles.serviceItemsSection}>
                      <div className={styles.sectionHeader}>
                        <h4 className={styles.sectionTitle}>
                          <span className={styles.sectionIcon}>📋</span>
                          Service Item Details
                        </h4>
                      </div>
                      {renderOrderItemsDetails(order)}
                    </div>
                  )}
                  
                  {/* SECTION 6: Related Records & Actions */}
                  <div className={styles.relatedRecordsSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🔗</span>
                        Related Records
                      </h4>
                    </div>
                    <div className={styles.relatedContent}>
                      {relatedLead && (
                        <p><strong>📋 Original {lead}:</strong> 
                          <span className={styles.mappingLink} onClick={() => onShowLeadManagement?.()}>
                            {relatedLead.id}
                          </span> 
                        - {relatedLead.priority} priority (Budget: {relatedLead.budget})</p>
                      )}
                      {relatedQuote && (
                        <p><strong>📄 From {quote}:</strong> 
                          <span className={styles.mappingLink} onClick={() => onShowQuotationOrders?.()}>
                            {relatedQuote.id}
                          </span> 
                        - {relatedQuote.quoteDate} ({relatedQuote.status})</p>
                      )}
                      <p><strong>{customer}:</strong> {companyName}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only visible when expanded */}
                  <div className={styles.cardActions}>
                    {/* Single-row button layout with natural wrapping */}
                    <div className={styles.actionButtons}>
                      <button className="ds-btn ds-btn-primary">
                        📞 Call
                      </button>
                      <button className="ds-btn ds-btn-primary">
                        📱 WhatsApp
                      </button>
                      <button className="ds-btn ds-btn-secondary">
                        📄 {t('viewPDF')}
                      </button>
                      {order.status === 'order_confirmed' && (
                        <>
                          <button 
                            className="ds-btn ds-btn-secondary"
                            onClick={() => onShowPayments && onShowPayments()}
                          >
                            💳 {t('viewPaymentStatus')}
                          </button>
                          <button className="ds-btn ds-btn-secondary">
                            🏭 {t('readyForProduction')}
                          </button>
                        </>
                      )}
                      {order.status === 'production_started' && (
                        <button className="ds-btn ds-btn-secondary">
                          🏭 Production Status
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <button className="ds-btn ds-btn-secondary">
                          📋 Delivery Receipt
                        </button>
                      )}
                    </div>
                  </div>
                  </>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default SalesOrders;