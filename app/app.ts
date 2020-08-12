import { Canvas, mkCanvas } from './canvas';
import { GridState, mkGridState, gridDraw, gridUpdate } from './grid';
import { EPlayer, TCellState, TPlayerState, GameState } from './types';
import { AppState } from './appTypes';
import { mkGameState, setGameState } from './gameState';
import { handleAppActions, getActionHandler } from './actions';

const ACTION_HANDLER = getActionHandler();

export const mkApp = (canvas: Canvas): AppState => {
    const gameState = mkGameState();

    return {
        canvas: canvas,
        grid: mkGridState(canvas, gameState),
        lastTime: (new Date()).getTime(),
        currentTime: 0,
        fps: 0,
        gameState: gameState,
    }
}

const appTick = (app: AppState) => {
    gridUpdate(app.grid);
    gridDraw(app.grid);
}

export const startApp = (app: AppState) => {
    const listenForActions = () => {
        ACTION_HANDLER.actions.forEach((action) => {
            const newGameState = handleAppActions(app.gameState, action);
            app.gameState = newGameState;
            app.grid = mkGridState(app.canvas, setGameState(newGameState));
            ACTION_HANDLER.actions = ACTION_HANDLER.actions.filter((existingAct) => existingAct !== action) || [];
        });
    }

    const updateApp = () => {
        window.requestAnimationFrame(updateApp);
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - app.lastTime) / 1000;
        app.canvas.ctx.clearRect(0, 0, app.canvas.element.width, app.canvas.element.height);

        listenForActions();
        appTick(app);
    }

    updateApp();
};
