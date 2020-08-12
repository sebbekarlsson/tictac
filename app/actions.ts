import { GameState } from './types';
import { TAction, TActionHandler, ActionHandler } from 'engine/types';
import { mkGameState } from './gameState';
import { EActionType } from './actionTypes';
import { Canvas } from 'engine/canvas';


export const handleAppActions:ActionHandler =(canvas: Canvas, gameState: GameState, action: TAction): GameState => {
   switch (action.type) {
       case EActionType.GAMESTATE_SET_WINNING_CELLS:
          return {
              ...gameState,
              winningCells: action.data || [],
          }
       case EActionType.GAMESTATE_NEXT_PLAYER:
          const playerIndex = gameState.playerIndex < (gameState.availablePlayers.length - 1) ? gameState.playerIndex + 1 : 0;
          const turn = gameState.availablePlayers[playerIndex];
          return {
              ...gameState,
              playerIndex: playerIndex,
              turn: turn
          }
       case EActionType.GAMESTATE_RESET:
          return mkGameState(canvas) 
       default:
           return gameState;
   } 
}
