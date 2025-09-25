import React, { useEffect, useRef } from 'react';
import { useGlobalSearch, SearchDataSources, SearchNavigationHandlers } from './useGlobalSearch';
import SearchResults from './SearchResults';
import styles from '../styles/GlobalSearch.module.css';

interface GlobalSearchProps {
  dataSources: SearchDataSources;
  navigationHandlers: SearchNavigationHandlers;
  placeholder?: string;
  className?: string;
}

function GlobalSearch({ 
  dataSources, 
  navigationHandlers, 
  placeholder = "Search or try voice commands...",
  className = ""
}: GlobalSearchProps) {
  const {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearchChange,
    closeSearchResults,
    clearSearch
  } = useGlobalSearch(dataSources, navigationHandlers);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        closeSearchResults();
      }
    }

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearchResults, closeSearchResults]);

  // Handle escape key to close search results
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeSearchResults();
        searchInputRef.current?.blur();
      }
    }

    if (showSearchResults) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [showSearchResults, closeSearchResults]);

  // Handle keyboard navigation in search results (future enhancement)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeSearchResults();
      searchInputRef.current?.blur();
    }
    // TODO: Add arrow key navigation for search results
  };

  return (
    <div className={`${styles.globalSearch} ${className}`} ref={searchContainerRef}>
      <div className={styles.integratedSearch}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
            autoComplete="off"
            aria-label="Global search"
            aria-haspopup="listbox"
          />
          {searchQuery && (
            <button 
              className={styles.clearSearch} 
              onClick={clearSearch}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Search Results */}
        {showSearchResults && (
          <SearchResults
            results={searchResults}
            searchQuery={searchQuery}
            onClose={closeSearchResults}
          />
        )}
      </div>
    </div>
  );
}

export default GlobalSearch;