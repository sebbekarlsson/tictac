import { mkApp, startApp } from './app';
import { mkCanvas } from './canvas';


// exposed user API, it is okay if we have a dependency to the document here.
// The code below would not be included in a distributed version of this
// application.
const canvas = mkCanvas(document.getElementById('canvas') as HTMLCanvasElement)
export const APP = mkApp(canvas);
startApp(APP);
