import { Canvas } from './canvas';

export type ActionHandler = (canvas: Canvas, state: any, action: any) => any

export type TickFunction = <T>(state: AppState<T>) => any;
export type DrawFunction = <T>(state: AppState<T>) => any;

export type AppState<T> = {
    canvas: Canvas,
    lastTime: number,
    currentTime: number,
    fps: number
    gameState: T,
    actionHandler: ActionHandler,
    tick: TickFunction,
    draw: DrawFunction,
    gameStateMaker: (canvas: Canvas) => any,
};

export type TAction = { type: any, data?: any }

export type TActionHandler = { actions: TAction[] };
