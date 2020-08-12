import { Canvas } from './canvas';
import { GridState } from './grid';
import { GameState, TAction } from './types';

export type AppState = {
    canvas: Canvas,
    grid: GridState,
    lastTime: number,
    currentTime: number,
    fps: number
    gameState: GameState,
};
