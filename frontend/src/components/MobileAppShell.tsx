import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MobileAppShell.css';

interface MobileAppShellProps {
  children: React.ReactNode;
}

interface SearchResult {
  id: number;
  type: string;
  title: string;
  description: string;
}

interface SearchOverlayProps {
  onClose: () => void;
  onResultSelect: (result: SearchResult) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const performSearch = (searchQuery: string) => {
    // Mock search results - will be replaced with actual search logic
    const mockResults = [
      { id: 1, type: 'lead', title: 'Surat Textiles', description: 'Cotton fabric order - 500 meters' },
      { id: 2, type: 'customer', title: 'Gujarat Mills', description: 'Active customer - 15 orders this year' },
      { id: 3, type: 'order', title: 'Order #2023-156', description: 'Bandhani fabric - ₹45,000' }
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(mockResults);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      performSearch(value);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-header">
        <input 
          type="text"
          placeholder="Search customers, leads, orders..."
          value={query}
          onChange={handleInputChange}
          autoFocus
        />
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="search-results">
        {results.map(result => (
          <div 
            key={result.id} 
            className="search-result"
            onClick={() => onResultSelect(result)}
          >
            <div className="result-type">{result.type}</div>
            <div className="result-title">{result.title}</div>
            <div className="result-description">{result.description}</div>
          </div>
        ))}
        {query && results.length === 0 && (
          <div className="no-results">No results found for "{query}"</div>
        )}
      </div>
    </div>
  );
};

const MobileAppShell: React.FC<MobileAppShellProps> = ({ children }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const startVoiceSearch = () => {
    // Placeholder for voice search functionality
    alert('Voice search will be implemented with actual voice recognition');
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    // Navigate based on result type
    switch(result.type) {
      case 'lead':
        navigate('/leads');
        break;
      case 'customer':
        navigate('/crm');
        break;
      case 'order':
        navigate('/orders');
        break;
      default:
        break;
    }
    setSearchVisible(false);
  };

  const tabs = [
    { path: '/dashboard', icon: '📊', label: 'Dash' },
    { path: '/leads', icon: '🎯', label: 'Lead' },
    { path: '/quotes', icon: '📋', label: 'Quote' },
    { path: '/payments', icon: '💰', label: 'Pay' },
    { path: '/production', icon: '🏭', label: 'Prod' },
    { path: '/inventory', icon: '📦', label: 'Inv' },
    { path: '/shipping', icon: '🚚', label: 'Ship' },
    { path: '/crm', icon: '👥', label: 'CRM' }
  ];

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="mobile-shell">
      {/* Mobile Header */}
      <header className="mobile-header">
        <h1>ElevateBusiness</h1>
        <div className="header-actions">
          <button className="voice-btn" onClick={startVoiceSearch} title="Voice Search">
            🎤
          </button>
          <button 
            className="search-btn" 
            onClick={() => setSearchVisible(true)}
            title="Search"
          >
            🔍
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="mobile-content">
        {children}
      </main>
      
      {/* Bottom Tab Navigation */}
      <nav className="bottom-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.path}
            className={`tab-button ${isActiveTab(tab.path) ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Search Overlay */}
      {searchVisible && (
        <SearchOverlay 
          onClose={() => setSearchVisible(false)}
          onResultSelect={handleSearchResultSelect}
        />
      )}
    </div>
  );
};

export default MobileAppShell;