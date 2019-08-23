"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Event = /** @class */ (function () {
    function Event() {
        this.handlers = [];
    }
    Event.prototype.add = function (handler) {
        if (this.handlers.indexOf(handler) < 0) {
            this.handlers.push(handler);
        }
    };
    Event.prototype.remove = function (handler) {
        this.handlers = _.without(this.handlers, handler);
    };
    Event.prototype.fire = function (args) {
        for (var i = 0; i < this.handlers.length; i++) {
            this.handlers[i](args);
        }
    };
    return Event;
}());
exports.Event = Event;
