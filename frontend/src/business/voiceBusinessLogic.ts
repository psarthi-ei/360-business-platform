import { NavigateFunction } from 'react-router-dom';
import { ActionParams } from '../services/nlp/types';

// Single source of truth for universal action handling
export function createUniversalActionHandler(
  navigate: NavigateFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  voiceCommandRouter: any,
  handleUniversalSearch: (query: string) => void
) {
  return (actionType: string, params?: ActionParams) => {
    // eslint-disable-next-line no-console
    console.log('🎯 Universal action triggered:', actionType, params);
    
    // Handle search commands locally for immediate UI response
    // Search needs direct access to local state (search results, input state)
    // and immediate UI updates that don't require routing through VoiceCommandRouter
    if (actionType === 'SEARCH' || actionType === 'GLOBAL_SEARCH') {
      if (params && 'query' in params) {
        handleUniversalSearch(params.query as string);
      }
      return;
    }
    
    // Route all other commands through VoiceCommandRouter service
    voiceCommandRouter.routeVoiceCommand(actionType, params);
  };
}
