import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface CustomerProfileProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  translations: any;
}

function CustomerProfile(props: CustomerProfileProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const onNavigateBack = props.onNavigateBack;
  const t = props.translations;

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
        <h1>👤 Customer Profile</h1>
      </div>

      <div className="customer-profile">
        <div className="customer-header">
          <div className="customer-basic-info">
            <h2>🏢 Rajesh Textiles</h2>
            <p className="customer-location">📍 Ahmedabad, Gujarat</p>
            <p className="customer-type">🎉 <span style={{color: '#2ed573', fontWeight: 'bold'}}>New Customer</span> (Joined Sep 3, 2025)</p>
          </div>
          <div className="customer-stats">
            <div className="stat-card">
              <h3>₹95,000</h3>
              <p>Total Business</p>
            </div>
            <div className="stat-card">
              <h3>1</h3>
              <p>Active Orders</p>
            </div>
            <div className="stat-card">
              <h3>15</h3>
              <p>Days Relationship</p>
            </div>
          </div>
        </div>

        <div className="customer-details-grid">
          <div className="customer-contact">
            <h3>📞 Contact Information</h3>
            <div className="contact-details">
              <p><strong>Primary Contact:</strong> Rajesh Shah</p>
              <p><strong>Phone:</strong> 9876543210</p>
              <p><strong>Email:</strong> rajesh@rasejtextiles.com</p>
              <p><strong>Address:</strong> 123 Textile Street, Ahmedabad, Gujarat 380001</p>
              <p><strong>GST Number:</strong> 24ABCDE1234F1Z5</p>
            </div>
            <div className="contact-actions">
              <button className="action-btn call">📞 {t.call}</button>
              <button className="action-btn whatsapp">📱 {t.whatsapp}</button>
              <button className="action-btn">📧 Email</button>
            </div>
          </div>

          <div className="business-profile">
            <h3>🏭 Business Profile</h3>
            <div className="business-details">
              <p><strong>Business Type:</strong> Cotton Fabric Manufacturing</p>
              <p><strong>Specialization:</strong> Bandhani & Traditional Prints</p>
              <p><strong>Monthly Volume:</strong> 2000-3000 meters</p>
              <p><strong>Preferred Materials:</strong> Cotton, Khadi</p>
              <p><strong>Quality Requirements:</strong> GSM 80-120, Natural dyes</p>
              <p><strong>Payment Terms:</strong> 50% advance, 50% on delivery</p>
            </div>
          </div>

          <div className="transaction-history">
            <h3>💼 Transaction History</h3>
            <div className="transaction-list">
              <div className="transaction-item">
                <div className="transaction-header">
                  <span className="transaction-type">📋 Sales Order</span>
                  <span className="transaction-date">Sep 3, 2025</span>
                </div>
                <p><strong>SO-2025-001:</strong> 500m Bandhani Cotton - ₹95,000</p>
                <p className="transaction-status">🔴 Pending Payment (₹47,500 advance due)</p>
              </div>
              
              <div className="transaction-item">
                <div className="transaction-header">
                  <span className="transaction-type">📄 Quote</span>
                  <span className="transaction-date">Sep 1, 2025</span>
                </div>
                <p><strong>QT-2025-001:</strong> 500m Bandhani Cotton - ₹95,000</p>
                <p className="transaction-status">🎉 Converted to Sales Order</p>
              </div>
              
              <div className="transaction-item">
                <div className="transaction-header">
                  <span className="transaction-type">🎯 Lead</span>
                  <span className="transaction-date">Aug 28, 2025</span>
                </div>
                <p><strong>Initial Inquiry:</strong> Bandhani Cotton requirements</p>
                <p className="transaction-status">✅ Converted to Customer</p>
              </div>
            </div>
          </div>

          <div className="communication-log">
            <h3>💬 Communication Log</h3>
            <div className="communication-list">
              <div className="communication-item">
                <div className="communication-header">
                  <span className="communication-type">📞 Phone Call</span>
                  <span className="communication-date">Sep 2, 2025 2:30 PM</span>
                </div>
                <p>Discussed quote details and delivery timeline. Customer agreed to 15-day delivery.</p>
              </div>
              
              <div className="communication-item">
                <div className="communication-header">
                  <span className="communication-type">📱 WhatsApp</span>
                  <span className="communication-date">Sep 1, 2025 11:45 AM</span>
                </div>
                <p>Sent quotation PDF. Customer requested minor specification changes.</p>
              </div>
              
              <div className="communication-item">
                <div className="communication-header">
                  <span className="communication-type">📞 Phone Call</span>
                  <span className="communication-date">Aug 30, 2025 4:15 PM</span>
                </div>
                <p>Initial inquiry call. Customer explained Bandhani fabric requirements for saree manufacturing.</p>
              </div>
            </div>
          </div>

          <div className="business-intelligence">
            <h3>📊 Business Intelligence</h3>
            <div className="intelligence-insights">
              <div className="insight-item">
                <h4>🎯 Customer Behavior</h4>
                <p>• Prefers advance payment model (shows financial stability)</p>
                <p>• Responds quickly to WhatsApp communication</p>
                <p>• Values traditional fabric quality over price</p>
              </div>
              
              <div className="insight-item">
                <h4>💡 Business Opportunities</h4>
                <p>• High potential for repeat orders (saree manufacturing is ongoing)</p>
                <p>• May need silk fabrics for premium collections</p>
                <p>• Could introduce to eco-friendly organic cotton options</p>
              </div>
              
              <div className="insight-item">
                <h4>⚠️ Risk Assessment</h4>
                <p>• Payment pending - follow up required by Sep 5</p>
                <p>• New customer - establish strong relationship early</p>
                <p>• Seasonal business - plan for festival season demands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;