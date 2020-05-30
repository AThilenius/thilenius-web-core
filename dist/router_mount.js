"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterMount = void 0;
var react_1 = require("react");
var mobx_react_1 = require("mobx-react");
var RouterMount = /** @class */ (function (_super) {
    __extends(RouterMount, _super);
    function RouterMount(props) {
        var _this = _super.call(this, props) || this;
        // Go to the current URL of the page.
        props.router.gotoUrl(window.location.href);
        return _this;
    }
    RouterMount.prototype.componentDidMount = function () {
        var _a, _b;
        (_b = (_a = this.props.router.active) === null || _a === void 0 ? void 0 : _a.componentDidMount) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    RouterMount.prototype.render = function () {
        var _a;
        return (_a = this.props.router.active) === null || _a === void 0 ? void 0 : _a.render();
    };
    RouterMount = __decorate([
        mobx_react_1.observer
    ], RouterMount);
    return RouterMount;
}(react_1.Component));
exports.RouterMount = RouterMount;
