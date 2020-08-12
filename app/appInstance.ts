import { mkApp, startApp } from 'engine/app';
import { mkCanvas } from 'engine/canvas';
import { handleAppActions } from './actions';
import { EActionType } from './actionTypes';
import { mkGameState } from './gameState';
import { GameState } from './types';
import { gridDraw, gridUpdate, mkGridState } from './grid';


// exposed user API, it is okay if we have a dependency to the document here.
// The code below would not be included in a distributed version of this
// application.
const canvas = mkCanvas(document.getElementById('canvas') as HTMLCanvasElement)
export const APP = mkApp<GameState>(
    handleAppActions,
    canvas,
    (app) => {
        // @ts-ignore
        gridDraw(app.gameState.gridState); 
    },
    (app)  => {
        // @ts-ignore
        gridUpdate(app.gameState.gridState); 
    },
    mkGameState,
);

                                               
startApp(APP, (app: any, newState: any) => app.gridState = mkGridState(app.canvas, newState));
