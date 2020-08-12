import { Canvas, mkCanvas } from './canvas';
import { AppState } from './types';
import { getActionHandler } from './actionHandler';
import { TActionHandler, ActionHandler, TickFunction, DrawFunction } from './types';

const ACTION_HANDLER = getActionHandler();

export const mkApp = <T>(
    actionHandler: ActionHandler,
    canvas: Canvas,
    tick: TickFunction,
    draw: DrawFunction,
    gameStateMaker: (canvas: Canvas) => any,
): AppState<T> => {
    const gameState = gameStateMaker(canvas);

    return {
        canvas: canvas,
        lastTime: (new Date()).getTime(),
        currentTime: 0,
        fps: 0,
        gameState: gameState,
        actionHandler: actionHandler,
        tick: tick,
        draw: draw,
        gameStateMaker: gameStateMaker,
    }
}

export const startApp = (app: AppState<any>, postAction: (app: AppState<any>, newState: any) => any) => {
    const listenForActions = () => {
        ACTION_HANDLER.actions.forEach((action) => {
            const newGameState = app.actionHandler(app.canvas, app.gameState, action);
            app.gameState = newGameState;
            postAction(app, newGameState);
            ACTION_HANDLER.actions = ACTION_HANDLER.actions.filter((existingAct) => existingAct !== action) || [];
        });
    }

    const updateApp = () => {
        window.requestAnimationFrame(updateApp);
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - app.lastTime) / 1000;
        app.canvas.ctx.clearRect(0, 0, app.canvas.element.width, app.canvas.element.height);

        listenForActions();

        app.tick(app);
        app.draw(app);
    }

    updateApp();
};
