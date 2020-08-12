import { Canvas } from './canvas';
import { TCellState, TPlayerState, EPlayer, TWinnerResult, Rect, GameState } from './types';
import { PLAYERS, nextPlayer } from './gameState';
import { dispatch } from './dispatch';

const getCellSize = (canvas: Canvas):Rect => ({ width: canvas.element.width / 3, height: canvas.element.height / 3 })

export type GridState = {
    canvas: Canvas,
    cellSize: Rect,
    gameState: GameState
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

        for (let pI = 0; pI < PLAYERS.length; pI++) {
            const player = PLAYERS[pI];

            const rowMembers = row.filter(col => col === player);

            if (rowMembers.length === gameState.board.length) {
                return { player, cells: row };
            }
        }
    };

    return null;
}

const getWinnerHorizontal = (gameState: GameState):TWinnerResult | null => {
    for (let yI = 0; yI < gameState.board.length; yI++) {
        const horizontalRow: TCellState[] = gameState.board.map((row, xI) => gameState.board[xI][yI]);

        const winner = PLAYERS.map((player) => ({
            player, rowMembers: horizontalRow.filter(col => col === player)
        })).find(item => item.rowMembers.length === gameState.board.length);

        if (winner)
            return { player: winner.player, cells: horizontalRow };
    };

    return null;
}

export const getWinner = (gameState: GameState):TWinnerResult | null =>
    getWinnerHorizontal(gameState) || getWinnerVertical(gameState);

export const onClick = (event, gridState: GridState) => {
    const mx = event.clientX;
    const my = event.clientY;

    gridState.gameState.board.forEach((row, xI) => {
        row.forEach((col, yI) => {
            if (col === null) {
                const cellW = gridState.cellSize.width;
                const cellH = gridState.cellSize.height;
                const x = xI * cellW;
                const y = yI * cellH;

                if ((mx > x && mx < x + cellW) && (my > y && my < y + cellH)) {
                    gridState.gameState.board[xI][yI] = gridState.gameState.turn;
                    nextPlayer(gridState.gameState);
                }
            }
        });
    });
}

export const onWin = (result: TWinnerResult) => {
    dispatch({ type: 'GAMESTATE_SET_WINNING_CELLS', data: result.cells || [] });

    alert(`The winner is: ${result.player}`);
    setTimeout((() => {
        dispatch({ type: 'GAMESTATE_RESET' })
    }).bind(this), 3000); 
}

export const gridUpdate = (gridState: GridState) => {
    const winner = getWinner(gridState.gameState);
    
    if (winner && !gridState.gameState.winLock) {
        gridState.gameState.winLock = true;
        onWin(winner);
    }
};

export const gridDraw = (gridState: GridState) => {
    gridState.gameState.board.forEach((row, xI) => {
        row.forEach((col, yI) => {
            const cellW = gridState.cellSize.width;
            const cellH = gridState.cellSize.height;
            const x = xI * cellW;
            const y = yI * cellH;

            const context = gridState.canvas.ctx;

            if (gridState.gameState.winningCells.includes(col)) {
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

export const initGridState = (gridState: GridState): GridState => {
    gridState.canvas.element.onclick = (event) => onClick(event, gridState);
    return gridState;
};

export const mkGridState = (canvas: Canvas, gameState: GameState):GridState =>
    initGridState({ canvas, cellSize: getCellSize(canvas), gameState});
