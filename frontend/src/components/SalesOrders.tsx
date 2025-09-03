import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface SalesOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowQuotationOrders: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function SalesOrders(props: SalesOrdersProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const onNavigateBack = props.onNavigateBack;
  const onShowQuotationOrders = props.onShowQuotationOrders;
  const onShowCustomerProfile = props.onShowCustomerProfile;
  const t = props.translations;
  const filterState = props.filterState;
  const onFilterChange = props.onFilterChange;

  function handleFilterClick(filter: string) {
    onFilterChange(filter);
  }

  const orders = [
    {
      id: '1',
      status: 'pendingpayment',
      orderNumber: 'SO-2025-001',
      company: 'Rajesh Textiles - Ahmedabad',
      quoteSource: 'QT-2025-001 (Sep 1, 2025)',
      customerStatus: 'New Customer (Converted from Lead)',
      material: '500 meters Bandhani Cotton Fabric, 44" width',
      specification: '100 GSM, Pre-shrunk, Natural dyes',
      orderDate: 'September 3, 2025',
      totalAmount: '₹95,000 (500m × ₹190/meter)',
      advancePayment: '₹47,500 (50% of order value)',
      orderStatus: '🔴 Waiting for Advance Payment',
      contact: 'Rajesh Shah - 9876543210'
    },
    {
      id: '2',
      status: 'paymentreceived',
      orderNumber: 'SO-2025-002',
      company: 'Premium Fabrics Ltd - Mumbai',
      quoteSource: 'QT-2025-006 (Aug 25, 2025)',
      customerStatus: 'Repeat Customer',
      material: '750 meters Silk Cotton Blend, 42" width',
      specification: '110 GSM, Mercerized, Dye-friendly',
      orderDate: 'August 28, 2025',
      totalAmount: '₹1,35,000 (750m × ₹180/meter)',
      paymentReceived: '✅ ₹1,35,000 received on Aug 30, 2025',
      orderStatus: '🟢 Ready for Production',
      contact: 'Suresh Kumar - 9876554321'
    },
    {
      id: '3',
      status: 'overdue',
      orderNumber: 'SO-2025-003',
      company: 'Textile Innovation Co - Surat',
      quoteSource: 'QT-2025-007 (Aug 20, 2025)',
      customerStatus: 'Payment Delayed',
      material: '400 meters Organic Cotton, 46" width',
      specification: '140 GSM, GOTS Certified, Natural finish',
      orderDate: 'August 22, 2025',
      totalAmount: '₹92,000 (400m × ₹230/meter)',
      advancePayment: '❌ ₹46,000 overdue by 12 days',
      orderStatus: '🔴 Payment Follow-up Required',
      contact: 'Kiran Patel - 9876567890'
    }
  ];

  function shouldShowOrder(orderStatus: string) {
    if (filterState === 'all') return true;
    return orderStatus === filterState;
  }

  function getStatusIcon(status: string) {
    switch(status) {
      case 'pendingpayment': return '💳';
      case 'paymentreceived': return '✅';
      case 'overdue': return '🔴';
      case 'readyforproduction': return '🟢';
      default: return '';
    }
  }

  function getStatusText(status: string) {
    switch(status) {
      case 'pendingpayment': return t.pendingPayment;
      case 'paymentreceived': return t.paymentReceived;
      case 'overdue': return 'Overdue';
      case 'readyforproduction': return 'Ready for Production';
      default: return status;
    }
  }

  return (
    <div className="lead-management-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>📋 {t.salesOrder}</h1>
        <button className="add-button">+ Add New Order</button>
      </div>

      <div className="filter-buttons">
        <button 
          className={filterState === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('all')}
        >
          Show All
        </button>
        <button 
          className={filterState === 'pendingpayment' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('pendingpayment')}
        >
          💳 {t.pendingPayment}
        </button>
        <button 
          className={filterState === 'paymentreceived' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('paymentreceived')}
        >
          ✅ {t.paymentReceived}
        </button>
        <button 
          className={filterState === 'overdue' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('overdue')}
        >
          🔴 Overdue
        </button>
        <button 
          className={filterState === 'readyforproduction' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleFilterClick('readyforproduction')}
        >
          🟢 Ready for Production
        </button>
      </div>

      <div className="leads-container">
        {orders.map((order) => (
          shouldShowOrder(order.status) && (
            <div key={order.id} className={`lead-card ${order.status === 'paymentreceived' ? 'cold' : order.status === 'pendingpayment' ? 'warm' : 'hot'}-lead`}>
              <div className="lead-header">
                <h3>{order.orderNumber} - {order.company}</h3>
                <span className={`priority-badge ${order.status === 'paymentreceived' ? 'cold' : order.status === 'pendingpayment' ? 'warm' : 'hot'}`}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </span>
              </div>
              <div className="lead-details">
                <p><strong>{t.orderNumber}:</strong> {order.orderNumber}</p>
                <p><strong>Quote Source:</strong> 
                  <span 
                    onClick={onShowQuotationOrders} 
                    style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                  >
                    ✅ {order.quoteSource}
                  </span>
                </p>
                <p><strong>{t.customerName}:</strong> 
                  <span 
                    onClick={() => onShowCustomerProfile(order.id)} 
                    style={{cursor: 'pointer', color: '#ffd700', textDecoration: 'underline'}}
                  >
                    {order.company}
                  </span>
                </p>
                <p><strong>Customer Status:</strong> 
                  {order.customerStatus.includes('New') && <span> 🎉 <span style={{color: '#2ed573', fontWeight: 'bold'}}>{order.customerStatus}</span></span>}
                  {order.customerStatus.includes('Repeat') && <span> 🏆 <span style={{color: '#5352ed', fontWeight: 'bold'}}>{order.customerStatus}</span></span>}
                  {order.customerStatus.includes('Delayed') && <span> ⚠️ <span style={{color: '#ff4757', fontWeight: 'bold'}}>{order.customerStatus}</span></span>}
                </p>
                <p><strong>{t.material}:</strong> {order.material}</p>
                <p><strong>{t.specification}:</strong> {order.specification}</p>
                <p><strong>{t.orderDate}:</strong> {order.orderDate}</p>
                <p><strong>{t.totalAmount}:</strong> {order.totalAmount}</p>
                {order.advancePayment && (
                  <p><strong>Advance Payment Required:</strong> {order.advancePayment}</p>
                )}
                {order.paymentReceived && (
                  <p><strong>Payment Status:</strong> {order.paymentReceived}</p>
                )}
                <p><strong>{t.orderStatus}:</strong> {order.orderStatus}</p>
                <p><strong>{t.contact}:</strong> {order.contact}</p>
              </div>
              <div className="lead-actions">
                <button className="action-btn call">{t.call}</button>
                <button className="action-btn whatsapp">{t.whatsapp}</button>
                <button className="action-btn quote">📄 View Order PDF</button>
                {order.status === 'pendingpayment' && (
                  <button className="action-btn approve">💳 Collect Payment</button>
                )}
                {order.status === 'overdue' && (
                  <button className="action-btn approve">📞 Follow Up Payment</button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default SalesOrders;