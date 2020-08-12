import { GridState, mkGridState } from './grid';
import { Canvas } from './engine/canvas';

import { TCellState, TPlayerState, GameState, EPlayer } from './types';

const newCell = (): TCellState => null;

const _mkGameState = (): GameState => ({
    gridState: null,
    playerIndex: 0,
    turn: EPlayer.X,
    board: [
        [newCell(), newCell(), newCell()],
        [newCell(), newCell(), newCell()],
        [newCell(), newCell(), newCell()]
    ],
    winLock: false,
    winningCells: [],
    availablePlayers: [EPlayer.X, EPlayer.O]
});

export const mkGameState = (canvas: Canvas): GameState => {
    const state = _mkGameState();
    return { ...state, gridState: mkGridState(canvas, state) };
}
