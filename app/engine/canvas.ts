export type Canvas =
	{ element: HTMLCanvasElement, ctx: CanvasRenderingContext2D };

export const mkCanvas = (element: HTMLCanvasElement): Canvas =>
    ({ element, ctx: element.getContext('2d') });
