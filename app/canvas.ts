export class Canvas {
    element: HTMLCanvasElement;
    elementId: string;
    width: number;
    height: number;
    context: any;

    constructor(elementId: string) {
        this.elementId = elementId;
        this.element = document.getElementById(elementId) as HTMLCanvasElement;
        this.width = this.element.width;
        this.height = this.element.height;
        this.context = this.element.getContext('2d');
    }

    tick() {
    
    }

    draw() {
    
    }
}
