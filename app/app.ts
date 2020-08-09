import { Canvas } from './canvas';
import { Grid } from './grid';


class App {
    canvas: Canvas;
    grid: Grid;
    cw: number;
    ch: number;
    cx: any;
    fps: number;
    lastTime: number;
    currentTime: number;
    delta: number;
    ballX: number;
    mX: number;

    constructor() {
        this.canvas = new Canvas('canvas');
        this.grid = new Grid(this.canvas);

        this.cw = this.canvas.width,
        this.ch = this.canvas.height,
        this.cx = this.canvas.context;
        this.fps = 30,
        this.lastTime = (new Date()).getTime(),
        this.currentTime = 0,
        this.delta = 0;
        this.ballX = 128;
        this.mX = 150;
    }

    tick() {
        this.canvas.tick();
        this.grid.tick();
    }

    draw() {
        this.canvas.draw();
        this.grid.draw(); 
    }

    loop() {
        window.requestAnimationFrame(this.loop.bind(this));
        const currentTime = (new Date()).getTime();
        const delta = (currentTime - this.lastTime) / 1000;
        this.cx.clearRect(0, 0, this.cw, this.cw);

        this.tick();
        this.draw();
    }

    start() {
        this.loop(); 
    }
}

const app = new App();
app.start();
