import { AppState } from './appTypes';
import { TAction, GameState } from './types';
import { mkGameState } from './gameState';

export const mkActionHandler = () => ({actions: []});

export let ACTION_HANDLER = mkActionHandler();

export const getActionHandler = () => {
    if (ACTION_HANDLER) {
        return ACTION_HANDLER;
    } else {
        ACTION_HANDLER = mkActionHandler();
    }

    return ACTION_HANDLER;
}

export const handleAppActions = (gameState: GameState, action: TAction): GameState => {
   switch (action.type) {
       case 'GAMESTATE_SET_WINNING_CELLS':
          return {
              ...gameState,
              winningCells: action.data || [],
          }
       case 'GAMESTATE_RESET':
          return mkGameState() 
       default:
           return gameState;
   } 
}
