import { Canvas } from 'engine/canvas';
import { TCellState, TPlayerState, EPlayer, TWinnerResult, Rect, GameState } from './types';
import { dispatch } from 'engine/dispatch';
import { EActionType } from './actionTypes';

const getCellSize = (canvas: Canvas):Rect => ({ width: canvas.element.width / 3, height: canvas.element.height / 3 })

export type GridState = {
    canvas: Canvas,
    cellSize: Rect,
};

export const columnToText = (state: TCellState): string | null =>
        state === null ? null : state === EPlayer.X ? 'X' : state === EPlayer.O ? 'O': null;

export const drawText = (canvas: Canvas, x: number, y: number, text: string | null | undefined) => {
    const context = canvas.ctx;
    context.save();
    context.font = "30px Arial";
    text && context.fillText(text, x, y);
    context.restore();
}

export const getWinnerVertical = (gameState: GameState):TWinnerResult | null => {
    for (let xI = 0; xI < gameState.board.length; xI++) {
        const row = gameState.board[xI];

        const winner = gameState.availablePlayers.map((player) => ({
            player, rowMembers: row.filter(col => col === player)
        })).find(item => item.rowMembers.length === gameState.board.length);

        if (winner)
            return { player: winner.player, cells: row };
    }

    return null;
}

const getWinnerHorizontal = (gameState: GameState):TWinnerResult | null => {
    for (let yI = 0; yI < gameState.board.length; yI++) {
        const horizontalRow: TCellState[] = gameState.board.map((row, xI) => gameState.board[xI][yI]);

        const winner = gameState.availablePlayers.map((player) => ({
            player, rowMembers: horizontalRow.filter(col => col === player)
        })).find(item => item.rowMembers.length === gameState.board.length);

        if (winner)
            return { player: winner.player, cells: horizontalRow };
    }

    return null;
}

const getWinnerDiag = (gameState: GameState):TWinnerResult | null => {
    return ([
        /**
        * x = y 
        *
        * [X][ ][ ]
        * [ ][X][ ]
        * [ ][ ][X]
        */
        gameState.board.map((record: TCellState[], yI: number) =>
                            // x
            record[Math.min(yI, gameState.board.length - 1)]),

        /**
        * x = (numberOfCells - y)
        *
        * [ ][ ][X]
        * [ ][X][ ]
        * [X][ ][ ]
        */
        gameState.board.map((record: TCellState[], yI: number) =>
                            // x
            record[Math.min((gameState.board.length - 1) - yI, gameState.board.length - 1)]),
        
    ]).map(aCase => gameState.availablePlayers.map((player) => ({
        player: player,
        cells: aCase.filter(col => col === player)
    })).find(item => item.cells.length === gameState.board.length)).find(winner => !!winner) || null;
}

export const getWinner = (gameState: GameState):TWinnerResult | null =>
    getWinnerHorizontal(gameState) || getWinnerVertical(gameState) || getWinnerDiag(gameState);

export const onClick = (event, gridState: GridState, gameState: GameState) => {
    const canvasX = event.target.offsetLeft;
    const canvasY = event.target.offsetTop;
    
    const mx = event.clientX + canvasX;
    const my = event.clientY + canvasY;

    gameState.board.forEach((row, xI) => {
        row.forEach((col, yI) => {
            if (col === null) {
                const cellW = gridState.cellSize.width;
                const cellH = gridState.cellSize.height;
                const x = xI * cellW;
                const y = yI * cellH;

                if ((mx > x && mx < x + cellW) && (my > y && my < y + cellH)) {
                    gameState.board[xI][yI] = gameState.turn;
                    dispatch({ type: EActionType.GAMESTATE_NEXT_PLAYER })
                }
            }
        });
    });
}

export const onWin = (result: TWinnerResult) => {
    dispatch({ type: EActionType.GAMESTATE_SET_WINNING_CELLS, data: result.cells || [] });

    alert(`The winner is: ${result.player}`);

    setTimeout((() => dispatch({ type: EActionType.GAMESTATE_RESET })).bind(this), 3000); 
}

export const gridUpdate = (gameState: GameState) => {
    const winner = getWinner(gameState);
    
    if (winner && !gameState.winLock) {
        gameState.winLock = true;
        onWin(winner);
    }
};

export const gridDraw = (gameState: GameState) => {
    const gridState = gameState.gridState;

    gameState.board.forEach((row, xI) => {
        row.forEach((col, yI) => {
            const cellW = gridState.cellSize.width;
            const cellH = gridState.cellSize.height;
            const x = xI * cellW;
            const y = yI * cellH;

            const context = gridState.canvas.ctx;

            if (gameState.winningCells.includes(col)) {
                context.save();
                context.beginPath();
                context.fillStyle = "red";
                context.fillRect(x, y, gridState.cellSize.width, gridState.cellSize.height); 
                context.fillStyle = "transparent";
                context.restore();
            } else {
                context.save();
                context.beginPath();
                context.strokeStyle = "black";
                context.strokeRect(x, y, gridState.cellSize.width, gridState.cellSize.height);
                context.strokeStyle = "transparent";
                context.restore();
            }

            drawText(gridState.canvas, x + (cellW / 2) - (30 / 2), y + (cellH / 2), columnToText(col));
        });
    })
};

export const initGridState = (gridState: GridState, gameState: GameState): GridState => {
    gridState.canvas.element.onclick = (event) => onClick(event, gridState, gameState);
    return gridState;
};

export const mkGridState = (canvas: Canvas, gameState: GameState):GridState =>
    initGridState({ canvas, cellSize: getCellSize(canvas)}, gameState);
