import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useGlobalSearch, SearchDataSources, SearchNavigationHandlers, SearchResult } from './useGlobalSearch';
import SearchResults from './SearchResults';
// import FloatingVoiceAssistant from './FloatingVoiceAssistant';
// import { ActionParams } from '../services/nlp/types';
import styles from '../styles/GlobalSearch.module.css';

interface GlobalSearchProps {
  searchScope?: string[];  // ADD: Accept scope from configuration
  dataSources: SearchDataSources;
  navigationHandlers: SearchNavigationHandlers;
  placeholder?: string;
  className?: string;
  // Optional search state - if provided, use external state instead of internal
  searchState?: {
    searchQuery: string;
    searchResults: SearchResult[];
    showSearchResults: boolean;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    closeSearchResults: () => void;
    clearSearch: () => void;
    performGlobalSearch: (query: string) => void;
  };
}

// Ref interface for parent components to control scrolling and search
export interface GlobalSearchRef {
  scrollToSearch: () => void;
  focusSearch: () => void;
  performSearch: (query: string) => void;
}

const GlobalSearch = forwardRef<GlobalSearchRef, GlobalSearchProps>(({ 
  searchScope, // Accept scope from configuration
  dataSources, 
  navigationHandlers, 
  placeholder = "Search across platform...",
  className = "",
  searchState
}, ref) => {
  // Use external search state if provided, otherwise create internal state
  const internalSearchState = useGlobalSearch(dataSources, navigationHandlers);
  const {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearchChange,
    closeSearchResults,
    clearSearch
  } = searchState || internalSearchState;

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Expose scroll and focus methods to parent components
  useImperativeHandle(ref, () => ({
    scrollToSearch: () => {
      // eslint-disable-next-line no-console
      console.log('🎯 scrollToSearch called, searchContainer exists:', !!searchContainerRef.current);
      
      if (searchContainerRef.current) {
        try {
          // First try modern scrollIntoView with smooth behavior
          searchContainerRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          // eslint-disable-next-line no-console
          console.log('✅ scrollIntoView executed successfully');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('⚠️ scrollIntoView failed, trying fallback method:', error);
          
          // Fallback: Use getBoundingClientRect + window.scrollTo
          try {
            const rect = searchContainerRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - 20; // 20px offset from top
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            // eslint-disable-next-line no-console
            console.log('✅ Fallback scroll executed to position:', targetPosition);
          } catch (fallbackError) {
            // eslint-disable-next-line no-console
            console.log('❌ Both scroll methods failed:', fallbackError);
            
            // Last resort: Instant scroll
            const rect = searchContainerRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - 20;
            window.scrollTo(0, targetPosition);
          }
        }
      }
    },
    focusSearch: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    performSearch: (query: string) => {
      // Use the internal search state's performGlobalSearch function
      internalSearchState.performGlobalSearch(query);
    }
  }), [internalSearchState]);

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

  // Debug logging
  // eslint-disable-next-line no-console
  console.log('GlobalSearch rendered with:', { searchQuery, searchResults: searchResults.length, showSearchResults });
  
  // Debug search state
  // eslint-disable-next-line no-console
  console.log('🔧 GlobalSearch internalSearchState:', { 
    hasPerformGlobalSearch: !!internalSearchState.performGlobalSearch,
    searchState: !!searchState,
    searchStateFunction: !!searchState?.performGlobalSearch
  });
  
  // Additional debug: Check if SearchResults should render
  // eslint-disable-next-line no-console
  console.log('Should render SearchResults?', showSearchResults && searchResults.length > 0);

  return (
    <div className={styles.universalSearchContainer}>
      <div className={styles.universalSearch} style={{ width: '100%', maxWidth: '700px' }}>
        <div className={`${styles.globalSearch} ${className}`} ref={searchContainerRef} style={{ width: '100%', maxWidth: '100%' }}>
          <div className={styles.integratedSearch} style={{ width: '75%', maxWidth: '600px' }}>
            <div className={styles.searchInputWrapper} style={{ width: '100%', maxWidth: '100%' }}>
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
        
        {/* Voice functionality removed - now handled by universal FloatingVoiceAssistant in App.tsx */}
      </div>
    </div>
  );
});

GlobalSearch.displayName = 'GlobalSearch';

export default GlobalSearch;