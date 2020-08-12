import { TCellState, TPlayerState, GameState, EPlayer } from './types';

const newCell = (): TCellState => null;

export const PLAYERS: TPlayerState[] = [EPlayer.X, EPlayer.O];

export const mkGameState = (): GameState => ({
    playerIndex: 0,
    turn: EPlayer.X,
    board: [
        [newCell(), newCell(), newCell()],
        [newCell(), newCell(), newCell()],
        [newCell(), newCell(), newCell()]
    ],
    winLock: false,
    winningCells: [],
});

export const nextPlayer = (gameState: GameState) => {
    gameState.playerIndex = gameState.playerIndex < (PLAYERS.length - 1) ? gameState.playerIndex + 1 : 0;
    gameState.turn = PLAYERS[gameState.playerIndex]; 
}

export let GAME_STATE = mkGameState();

export const setGameState = (newGameState: GameState) => { GAME_STATE = newGameState; return GAME_STATE; };
