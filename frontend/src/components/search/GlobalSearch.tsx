import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useGlobalSearch, SearchDataSources, SearchNavigationHandlers, SearchResult } from './useGlobalSearch';
import SearchResults from './SearchResults';
// import FloatingVoiceAssistant from './FloatingVoiceAssistant';
// import { ActionParams } from '../services/nlp/types';
import styles from './GlobalSearch.module.css';

interface GlobalSearchProps {
  searchScope?: string[];  // ADD: Accept scope from configuration
  dataSources: SearchDataSources;
  navigationHandlers: SearchNavigationHandlers;
  placeholder?: string;
  className?: string;
  onVoiceSearch?: () => void;  // Voice search handler
  voiceState?: 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';  // Voice state for visual feedback
  onVoiceHover?: (buttonPosition: { x: number; y: number; width: number; height: number }) => void;  // Voice hover handler
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
  searchScope,
  dataSources,
  navigationHandlers,
  placeholder = "Search leads, customers, orders...",
  className = "",
  onVoiceSearch,
  voiceState = 'IDLE',
  onVoiceHover,
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
  const voiceButtonRef = useRef<HTMLButtonElement>(null);

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

  // Keep essential voice state logging for debug panel
  // eslint-disable-next-line no-console
  console.log('🎙️ GlobalSearch voiceState:', voiceState);

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
          <button 
            ref={voiceButtonRef}
            className={`${styles.voiceIcon} ${voiceState === 'LISTENING' ? styles.listening : ''} ${voiceState === 'PROCESSING' ? styles.processing : ''} ${voiceState === 'ERROR' ? styles.error : ''}`}
            title={`Voice search - ${voiceState}`}
            aria-label={`Voice search - ${voiceState}`}
            type="button"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('🎯 Voice button clicked in GlobalSearch - showing panel AND starting voice');
              
              // Show voice suggestions panel first
              if (onVoiceHover && voiceButtonRef.current) {
                const rect = voiceButtonRef.current.getBoundingClientRect();
                onVoiceHover({
                  x: rect.left,
                  y: rect.bottom,
                  width: rect.width,
                  height: rect.height
                });
              }
              
              // Blur search input to prevent focus conflicts with voice recognition
              if (searchInputRef.current) {
                searchInputRef.current.blur();
              }
              
              // Small delay to ensure focus is cleared before starting voice recognition
              setTimeout(() => {
                onVoiceSearch?.();
              }, 50);
            }}
            disabled={voiceState !== 'IDLE'}
          >
            {voiceState === 'PROCESSING' ? '⚡' : voiceState === 'LISTENING' ? '🎙️' : voiceState === 'ERROR' ? '❌' : '🎙'}
          </button>
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
});

GlobalSearch.displayName = 'GlobalSearch';

export default GlobalSearch;