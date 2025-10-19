import { useState } from 'react';

/**
 * Custom hook for managing single-card expansion behavior
 * Provides consistent single-card expansion logic across all components
 * with smooth animation sequencing and auto-scroll functionality
 */
export const useCardExpansion = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  /**
   * Sequential expansion toggle function with smooth visual flow
   * Only one card can be expanded at a time for better UX focus
   * 
   * @param cardId - The ID of the card to toggle
   * @param dataAttribute - The data attribute to use for auto-scroll (default: 'data-card-id')
   * @param animationDelay - Delay between collapse and expand animations in ms (default: 200)
   */
  const toggleExpansion = async (
    cardId: string, 
    dataAttribute: string = 'data-card-id',
    animationDelay: number = 200
  ) => {
    if (expandedCard === cardId) {
      // Simple collapse - no sequencing needed
      setExpandedCard(null);
    } else {
      // Sequential: First collapse any open card
      if (expandedCard !== null) {
        setExpandedCard(null);
        // Wait for collapse animation to complete
        await new Promise(resolve => setTimeout(resolve, animationDelay));
      }
      
      // Then expand the new card
      setExpandedCard(cardId);
      
      // Scroll to ensure the card is visible
      setTimeout(() => {
        const cardElement = document.querySelector(`[${dataAttribute}="${cardId}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'start'
          });
        }
      }, 50);
    }
  };

  /**
   * Check if a specific card is expanded
   * @param cardId - The ID of the card to check
   * @returns true if the card is expanded, false otherwise
   */
  const isExpanded = (cardId: string): boolean => {
    return expandedCard === cardId;
  };

  /**
   * Collapse all cards
   */
  const collapseAll = () => {
    setExpandedCard(null);
  };

  return {
    expandedCard,
    toggleExpansion,
    isExpanded,
    collapseAll
  };
};

export default useCardExpansion;