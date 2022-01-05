"use strict";
/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
/**
 * This takes a single child and inserts a prop 'width' on it that is the
 * current width of the this container. This is handy if you want to surround
 * a chart or other svg diagram and have this drive the chart width.
 */
var Resizable = /** @class */ (function (_super) {
    __extends(Resizable, _super);
    function Resizable(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { width: 0 };
        _this.handleResize = _this.handleResize.bind(_this);
        return _this;
    }
    Resizable.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    };
    Resizable.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.handleResize);
    };
    Resizable.prototype.handleResize = function () {
        if (this.container) {
            this.setState({
                width: this.container.offsetWidth
            });
        }
    };
    Resizable.prototype.render = function () {
        var _this = this;
        var child = react_1["default"].Children.only(this.props.children);
        var childElement = this.state.width
            ? react_1["default"].cloneElement(child, { width: this.state.width })
            : null;
        return (react_1["default"].createElement("div", __assign({ ref: function (c) {
                _this.container = c;
            } }, this.props), childElement));
    };
    return Resizable;
}(react_1["default"].Component));
exports["default"] = Resizable;
