import { EActionType } from './actionTypes';
import { GridState } from './grid';

export enum EPlayer { X, O };
export type TCellState = EPlayer | null;

export type TPlayerState = EPlayer.X | EPlayer.O;
export type TWinnerResult = { player: TPlayerState, cells: TCellState[] };

export type BoardState = TCellState[][];
export type GameState = {
    playerIndex: number,
    turn: EPlayer,
    board: BoardState,
    winLock: boolean,
    winningCells: TCellState[],
    gridState: GridState | null,
    availablePlayers: TPlayerState[]
};

export type Rect = { width: number, height: number };
