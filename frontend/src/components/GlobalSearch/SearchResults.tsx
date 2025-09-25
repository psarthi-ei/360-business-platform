import React from 'react';
import { SearchResult } from './useGlobalSearch';
import styles from './GlobalSearch.module.css';

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onClose: () => void;
}

function SearchResults({ results, searchQuery, onClose }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={styles.searchResults}>
      <div className={styles.searchResultsHeader}>
        <span>Found {results.length} results</span>
        <div className={styles.voiceSearchSuggestion}>
          🎤 Try: "Show me {searchQuery}"
        </div>
        <button className={styles.closeResults} onClick={onClose} aria-label="Close search results">
          ×
        </button>
      </div>
      
      <div className={styles.searchResultsList}>
        {results.slice(0, 4).map((result, index) => (
          <div 
            key={index}
            className={styles.searchResultItem}
            onClick={() => {
              result.action();
              onClose();
            }}
          >
            <div className={styles.resultContent}>
              <div className={styles.resultCategory}>{result.category}</div>
              <div className={styles.resultTitle}>{result.title}</div>
              <div className={styles.resultSubtitle}>{result.subtitle}</div>
            </div>
            
            <div className={styles.resultStatus}>
              {result.priority && (
                <span className={`${styles.priorityBadge} ${styles[result.priority]}`}>
                  {result.priority === 'hot' && '🔥'} 
                  {result.priority === 'warm' && '🔶'} 
                  {result.priority === 'cold' && '🔵'} 
                  {result.priority.toUpperCase()}
                </span>
              )}
              {result.status && (
                <span className={styles.statusBadge}>
                  {result.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {results.length > 4 && (
          <div className={styles.searchResultItem} style={{ opacity: 0.7, cursor: 'default' }}>
            <div className={styles.resultContent}>
              <div className={styles.resultTitle}>
                +{results.length - 4} more results...
              </div>
              <div className={styles.resultSubtitle}>
                Refine your search to see more specific results
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;