import { Canvas, mkCanvas } from './canvas';
import { GridState, mkGridState, gridDraw, gridUpdate } from './grid';
import { EPlayer, TCellState, TPlayerState, GameState } from './types';
import { mkGameState } from './gameState';

type AppState = {
    canvas: Canvas,
    grid: GridState,
    lastTime: number,
    currentTime: number,
    fps: number
    gameState: GameState,
};

const mkApp = (canvas: Canvas): AppState => {
    const gameState = mkGameState();

    return {
        canvas: canvas,
        grid: mkGridState(gameState, canvas),
        lastTime: (new Date()).getTime(),
        currentTime: 0,
        fps: 0,
        gameState: gameState
    }
}

const appTick = (app: AppState) => {
    gridUpdate(app.grid);
    gridDraw(app.grid);
}

const startApp = (app: AppState) => {
    const updateApp = () => {
        window.requestAnimationFrame(updateApp);
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - app.lastTime) / 1000;
        app.canvas.ctx.clearRect(0, 0, app.canvas.element.width, app.canvas.element.height);

        appTick(app);
    }

    updateApp();
};

// exposed user API, it is okay if we have a dependency to the document here.
// The code below would not be included in a distributed version of this
// application.
const canvas = mkCanvas(document.getElementById('canvas') as HTMLCanvasElement)
const APP = mkApp(canvas);
startApp(APP);
