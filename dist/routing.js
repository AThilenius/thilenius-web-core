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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var qs = require("qs");
var React = require("react");
var objects_1 = require("./utils/objects");
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Page;
}(React.Component));
exports.Page = Page;
function StandardMatch(pageType) {
    var inst = new pageType({});
    return function (url) {
        var params = inst.urlPattern.match(url);
        if (!params) {
            return null;
        }
        return new pageType({ urlParams: params });
    };
}
exports.StandardMatch = StandardMatch;
var HistoryAction;
(function (HistoryAction) {
    HistoryAction[HistoryAction["None"] = 0] = "None";
    HistoryAction[HistoryAction["Push"] = 1] = "Push";
    HistoryAction[HistoryAction["Replace"] = 2] = "Replace";
    HistoryAction[HistoryAction["Default"] = 1] = "Default";
})(HistoryAction = exports.HistoryAction || (exports.HistoryAction = {}));
var Router = /** @class */ (function () {
    function Router(entries) {
        this.entries = entries;
        window.onpopstate = this.onPopState.bind(this);
    }
    Router.prototype.goto = function (page, historyAction) {
        if (historyAction === void 0) { historyAction = HistoryAction.Default; }
        // Reshape the query as is it likely missing default fields.
        var query = objects_1.shapeAny(page.defaultQuery, page.props.urlQuery);
        var newPage = page.constructor({
            urlParams: page.props.urlParams,
            urlQuery: query,
        });
        this.active = newPage;
        var pathname = this.active.urlPattern.stringify(page.props.urlParams);
        var urlStr = pathname +
            Router.serializeQuery(this.active.defaultQuery, page.props.urlQuery);
        // If the pathname didn't change, then it's always a history-replace.
        if (pathname === window.location.pathname) {
            window.history.replaceState(urlStr, page.title, urlStr);
            return;
        }
        switch (historyAction) {
            case HistoryAction.Push: {
                window.history.pushState(urlStr, page.title, urlStr);
                break;
            }
            case HistoryAction.Replace: {
                window.history.replaceState(urlStr, page.title, urlStr);
                break;
            }
            default:
                break;
        }
    };
    Router.prototype.gotoUrl = function (url, historyAction) {
        if (historyAction === void 0) { historyAction = HistoryAction.Default; }
        // Split the url
        var urlObj = new URL(url);
        // Trim start and end whitespace and slashes from pathname.
        var pathname = '/' + urlObj.pathname.replace(/^[\s\/]*/, '').replace(/[\s\/]*$/, '');
        var queryStr = urlObj.search.trim().replace(/^\?/, '');
        // Try to match it with any of the entries
        var entry = this.entries.map(function (e) { return e(pathname); }).find(function (e) { return e; });
        if (!entry) {
            console.error('No route matched the url:', url);
            return;
        }
        // Deserialize the query and shape it
        var queryObj = {};
        try {
            if (queryStr !== '') {
                queryObj = Router.deserializeQuery(queryStr);
            }
        }
        catch (e) {
            console.warn('Failed to parse query string:', e);
        }
        var shapedQuery = objects_1.shapeAny(entry.defaultQuery, queryObj);
        var props = __assign({}, entry.props, { urlQuery: shapedQuery });
        var newPage = entry.constructor(props);
        this.goto(newPage, historyAction);
    };
    Router.prototype.back = function () {
        window.history.back();
    };
    Router.prototype.forward = function () {
        window.history.forward();
    };
    Router.serializeQuery = function (defaultQuery, value) {
        var delta = objects_1.getDeltaObject(defaultQuery, value);
        if (delta === null) {
            return '';
        }
        return '?' + qs.stringify(delta);
    };
    Router.deserializeQuery = function (value) {
        return qs.parse(value);
    };
    Router.prototype.onPopState = function (event) {
        this.gotoUrl(window.location.href);
    };
    __decorate([
        mobx_1.observable
    ], Router.prototype, "active", void 0);
    __decorate([
        mobx_1.action
    ], Router.prototype, "goto", null);
    return Router;
}());
exports.Router = Router;
