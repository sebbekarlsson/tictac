"use strict";
exports.__esModule = true;
exports.Canvas = void 0;
var Canvas = /** @class */ (function () {
    function Canvas(elementId) {
        this.elementId = elementId;
        this.element = document.getElementById(elementId);
    }
    Canvas.prototype.tick = function () {
    };
    Canvas.prototype.draw = function () {
    };
    return Canvas;
}());
exports.Canvas = Canvas;
