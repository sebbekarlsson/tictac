import { Canvas } from './canvas';

export enum ECellState {
    'zero' = 0,
    'P1' = 1,
    'P2' = 2
}

export type TCellState = { state: ECellState, isWinner: boolean };
export type TPlayerState = ECellState.P1 | ECellState.P2;
export type TWinnerResult = { player: TPlayerState, cells: TCellState[] };

const newCell = (): TCellState => ({ state: ECellState.zero, isWinner: false });

const PLAYERS: TPlayerState[] = [ECellState.P1, ECellState.P2];

export class Grid {
    canvas: Canvas;
    playerIndex: number;
    currentPlayer: TPlayerState;
    cells: TCellState[][];
    cellWidth: number;
    cellHeight: number;
    winLock: boolean;

    setState() {
        this.playerIndex = 0;
        this.currentPlayer = PLAYERS[this.playerIndex];
        this.cells = [
            [newCell(), newCell(), newCell()],
            [newCell(), newCell(), newCell()],
            [newCell(), newCell(), newCell()],
        ];
        this.winLock = false;
    }

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.canvas.element.onclick = this.onClick.bind(this);
        this.cellWidth = this.canvas.width / 3;
        this.cellHeight = this.canvas.height / 3;
        this.setState();
    }

    columnToText = (state: TCellState): string | null =>
        state.state === ECellState.zero ? null : state.state === ECellState.P1 ? 'X' : state.state === ECellState.P2 ? 'O': null;

    drawText(x: number, y: number, text: string | null | undefined) {
        const context = this.canvas.context;
        context.save();
        context.font = "30px Arial";
        text && context.fillText(text, x, y);
        context.restore();
    }

    getWinnerVertical = ():TWinnerResult | null => {
        for (let xI = 0; xI < this.cells.length; xI++) {
            const row = this.cells[xI];

            for (let pI = 0; pI < PLAYERS.length; pI++) {
                const player = PLAYERS[pI];

                const rowMembers = row.filter(col => col.state === player);

                if (rowMembers.length === this.cells.length) {
                    return { player, cells: row};
                }
            }
        };

        return null;
    }

    getWinnerHorizontal = ():TWinnerResult | null => {
        for (let yI = 0; yI < this.cells.length; yI++) {
            const horizontalRow: TCellState[] = this.cells.map((row, xI) => this.cells[xI][yI]);

            const winner = PLAYERS.map((player) => ({
                player, rowMembers: horizontalRow.filter(col => col.state === player)
            })).find(item => item.rowMembers.length === this.cells.length);

            if (winner)
                return { player: winner.player, cells: horizontalRow};
        };

        return null;
    }

    getWinner = ():TWinnerResult | null => {
        const winnerHorizontal = this.getWinnerHorizontal();
        const winnerVertical = this.getWinnerVertical();

        return winnerHorizontal || winnerVertical;
    }
    
    nextPlayer()  {
        this.playerIndex = this.playerIndex < (PLAYERS.length - 1) ? this.playerIndex + 1 : 0;
        this.currentPlayer = PLAYERS[this.playerIndex]; 
    }

    onClick(event) {
        const mx = event.clientX;
        const my = event.clientY;

        this.cells.forEach((row, xI) => {
            row.forEach((col, yI) => {
                if (col.state === ECellState.zero) {
                    const cellW = this.cellWidth;
                    const cellH = this.cellHeight;
                    const x = xI * cellW;
                    const y = yI * cellH;

                    if ((mx > x && mx < x + cellW) && (my > y && my < y + cellH)) {
                        this.cells[xI][yI].state = this.currentPlayer;
                        this.nextPlayer();
                    }
                }
            });
        });
    }

    setWinnerCells(cells: TCellState[]) {
        for (let i = 0; i < cells.length; i++)
            cells[i].isWinner = true; 
    }
    
    onWin(result: TWinnerResult) {
        this.setWinnerCells(result.cells);
        alert(`The winner is: ${result.player}`);
        setTimeout((() => {
            this.setState();  
        }).bind(this), 3000); 
    }

    tick() {
        const winner = this.getWinner();
        
        if (winner && !this.winLock) {
            this.winLock = true;
            this.onWin(winner);
        }
    }

    draw() {
        this.cells.forEach((row, xI) => {
            row.forEach((col, yI) => {
                const cellW = this.cellWidth;
                const cellH = this.cellHeight;
                const x = xI * cellW;
                const y = yI * cellH;

                const context = this.canvas.context;

                if (col.isWinner) {
                    context.save();
                    context.beginPath();
                    context.fillStyle = "red";
                    context.fillRect(x, y, this.cellWidth, this.cellHeight); 
                    context.fillStyle = "transparent";
                    context.restore();
                } else {
                    context.save();
                    context.beginPath();
                    context.strokeStyle = "black";
                    context.strokeRect(x, y, this.cellWidth, this.cellHeight);
                    context.strokeStyle = "transparent";
                    context.restore();
                }

                this.drawText(x + (cellW / 2) - (30 / 2), y + (cellH / 2), this.columnToText(col));
            });
        })
    }
}
