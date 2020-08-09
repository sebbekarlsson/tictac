(function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
    define("canvas", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        exports.Canvas = void 0;
        var Canvas = /** @class */ (function () {
            function Canvas(elementId) {
                this.elementId = elementId;
                this.element = document.getElementById(elementId);
                this.width = this.element.width;
                this.height = this.element.height;
                this.context = this.element.getContext('2d');
            }
            Canvas.prototype.tick = function () {
            };
            Canvas.prototype.draw = function () {
            };
            return Canvas;
        }());
        exports.Canvas = Canvas;
    });
    define("grid", ["require", "exports"], function (require, exports) {
        "use strict";
        exports.__esModule = true;
        exports.Grid = exports.ECellState = void 0;
        var ECellState;
        (function (ECellState) {
            ECellState[ECellState["zero"] = 0] = "zero";
            ECellState[ECellState["P1"] = 1] = "P1";
            ECellState[ECellState["P2"] = 2] = "P2";
        })(ECellState = exports.ECellState || (exports.ECellState = {}));
        var PLAYERS = [ECellState.P1, ECellState.P2];
        var Grid = /** @class */ (function () {
            function Grid(canvas) {
                var _this = this;
                this.columnToText = function (state) {
                    return state === ECellState.zero ? null : state === ECellState.P1 ? 'X' : state === ECellState.P2 ? 'O' : null;
                };
                this.getWinnerVertical = function () {
                    for (var xI = 0; xI < _this.cells.length; xI++) {
                        var row = _this.cells[xI];
                        var _loop_1 = function (pI) {
                            var player = PLAYERS[pI];
                            var rowMembers = row.filter(function (col) { return col === player; });
                            if (rowMembers.length === _this.cells.length) {
                                return { value: player };
                            }
                        };
                        for (var pI = 0; pI < PLAYERS.length; pI++) {
                            var state_1 = _loop_1(pI);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                    }
                    ;
                    return null;
                };
                this.getWinnerHorizontal = function () {
                    var _loop_2 = function (yI) {
                        var horizontalRow = [];
                        for (var xI = 0; xI < _this.cells.length; xI++) {
                            horizontalRow.push(_this.cells[xI][yI]);
                        }
                        return { value: PLAYERS.map(function (player) { return ({ player: player, rowMembers: horizontalRow.filter(function (col) { return col === player; }) }); }).find(function (item) { return item.rowMembers.length === _this.cells.length; }) };
                    };
                    for (var yI = 0; yI < _this.cells.length; yI++) {
                        var state_2 = _loop_2(yI);
                        if (typeof state_2 === "object")
                            return state_2.value;
                    }
                    ;
                    return null;
                };
                this.getWinner = function () {
                    var winnerHorizontal = _this.getWinnerHorizontal();
                    var winnerVertical = _this.getWinnerVertical();
                    return winnerHorizontal || winnerVertical;
                };
                this.canvas = canvas;
                this.canvas.element.onclick = this.onClick.bind(this);
                this.playerIndex = 0;
                this.currentPlayer = PLAYERS[this.playerIndex];
                this.cells = [
                    [ECellState.zero, ECellState.zero, ECellState.zero],
                    [ECellState.zero, ECellState.zero, ECellState.zero],
                    [ECellState.zero, ECellState.zero, ECellState.zero],
                ];
                this.cellWidth = this.canvas.width / 3;
                this.cellHeight = this.canvas.height / 3;
            }
            Grid.prototype.drawText = function (x, y, text) {
                var context = this.canvas.context;
                context.font = "30px Arial";
                text && context.fillText(text, x, y);
            };
            Grid.prototype.nextPlayer = function () {
                this.playerIndex = this.playerIndex < (PLAYERS.length - 1) ? this.playerIndex + 1 : 0;
                this.currentPlayer = PLAYERS[this.playerIndex];
            };
            Grid.prototype.onClick = function (event) {
                var _this = this;
                var mx = event.clientX;
                var my = event.clientY;
                this.cells.forEach(function (row, xI) {
                    row.forEach(function (col, yI) {
                        if (col === ECellState.zero) {
                            var cellW = _this.cellWidth;
                            var cellH = _this.cellHeight;
                            var x = xI * cellW;
                            var y = yI * cellH;
                            if ((mx > x && mx < x + cellW) && (my > y && my < y + cellH)) {
                                _this.cells[xI][yI] = _this.currentPlayer;
                                _this.nextPlayer();
                            }
                        }
                    });
                });
            };
            Grid.prototype.tick = function () {
                var winner = this.getWinner();
                if (winner)
                    console.log(winner);
            };
            Grid.prototype.draw = function () {
                var _this = this;
                this.cells.forEach(function (row, xI) {
                    row.forEach(function (col, yI) {
                        var cellW = _this.cellWidth;
                        var cellH = _this.cellHeight;
                        var x = xI * cellW;
                        var y = yI * cellH;
                        var context = _this.canvas.context;
                        context.strokeStyle = "#975";
                        context.strokeRect(x, y, _this.cellWidth, _this.cellHeight);
                        _this.drawText(x + (cellW / 2) - (30 / 2), y + (cellH / 2), _this.columnToText(col));
                    });
                });
            };
            return Grid;
        }());
        exports.Grid = Grid;
    });
    define("app", ["require", "exports", "canvas", "grid"], function (require, exports, canvas_1, grid_1) {
        "use strict";
        exports.__esModule = true;
        var App = /** @class */ (function () {
            function App() {
                this.canvas = new canvas_1.Canvas('canvas');
                this.grid = new grid_1.Grid(this.canvas);
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
            App.prototype.tick = function () {
                this.canvas.tick();
                this.grid.tick();
            };
            App.prototype.draw = function () {
                this.canvas.draw();
                this.grid.draw();
            };
            App.prototype.loop = function () {
                window.requestAnimationFrame(this.loop.bind(this));
                var currentTime = (new Date()).getTime();
                var delta = (currentTime - this.lastTime) / 1000;
                this.cx.clearRect(0, 0, this.cw, this.cw);
                this.tick();
                this.draw();
            };
            App.prototype.start = function () {
                this.loop();
            };
            return App;
        }());
        var app = new App();
        app.start();
    });
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports["default"] : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();