import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🏭 360° Business Platform</h1>
        <h2>ElevateIdea Technologies</h2>
        <p className="founder-info">
          Built by <strong>Partha Sarthi</strong> for Gujarat Textile Manufacturers
        </p>
        
        <div className="features-grid">
          <div className="feature-card">📋 Lead Management</div>
          <div className="feature-card">📑 Quotation & Orders</div>
          <div className="feature-card">💳 Advance Payments</div>
          <div className="feature-card">📋 Work Orders</div>
          <div className="feature-card">🛒 Smart Procurement</div>
          <div className="feature-card">📦 Inventory (3-Tier)</div>
          <div className="feature-card">⚙️ Production Tracking</div>
          <div className="feature-card">🚚 Dispatch & Delivery</div>
          <div className="feature-card">🧾 Invoice & Finance</div>
          <div className="feature-card">⭐ Customer Feedback</div>
          <div className="feature-card">🎤 Voice Commands</div>
          <div className="feature-card">📊 Analytics Dashboard</div>
        </div>
        
        <p className="languages">
          <span>🗣️ Gujarati</span> | <span>🗣️ Hindi</span> | <span>🗣️ English</span>
        </p>
        
        <div className="status">
          <p>🚧 MVP in Development - Coming Soon!</p>
        </div>
      </header>
    </div>
  );
}

export default App;
