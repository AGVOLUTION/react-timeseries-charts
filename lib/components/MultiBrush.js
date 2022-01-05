"use strict";
/**
 *  Copyright (c) 2016, The Regents of the University of California,
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var pondjs_1 = require("pondjs");
var util_1 = require("../js/util");
/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
var MultiBrush = /** @class */ (function (_super) {
    __extends(MultiBrush, _super);
    function MultiBrush(props) {
        var _this = _super.call(this, props) || this;
        _this.hasNullBrush = function () {
            return ((_this.props.timeRanges || []).length > 0 &&
                _this.props.timeRanges[_this.props.timeRanges.length - 1] == null);
        };
        _this.handleMouseClick = function (e, brushIndex) {
            if (_this.props.onTimeRangeClicked) {
                _this.props.onTimeRangeClicked(brushIndex);
            }
        };
        _this.state = {
            isBrushing: false
        };
        _this.handleBrushMouseDown = _this.handleBrushMouseDown.bind(_this);
        _this.handleOverlayMouseDown = _this.handleOverlayMouseDown.bind(_this);
        _this.handleHandleMouseDown = _this.handleHandleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }
    MultiBrush.prototype.viewport = function () {
        var _a = this.props, width = _a.width, timeScale = _a.timeScale;
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(width);
        return new pondjs_1.TimeRange(viewBeginTime, viewEndTime);
    };
    //
    // Event handlers
    //
    MultiBrush.prototype.handleBrushMouseDown = function (e, brush_idx) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = +this.props.timeRanges[brush_idx].begin();
        var end = +this.props.timeRanges[brush_idx].end();
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brush_idx
        });
    };
    MultiBrush.prototype.handleOverlayMouseDown = function (e) {
        if (this.props.allowFreeDrawing || this.hasNullBrush()) {
            e.preventDefault();
            var offset = (0, util_1.getElementOffset)(this.overlay);
            var x = e.pageX - offset.left;
            var t = this.props.timeScale.invert(x).getTime();
            document.addEventListener("mouseup", this.handleMouseUp);
            var drawingPosition = this.props.allowFreeDrawing
                ? this.props.timeRanges.length
                : this.props.timeRanges.length - 1;
            this.setState({
                isBrushing: true,
                brushingInitializationSite: "overlay",
                initialBrushBeginTime: t,
                initialBrushEndTime: t,
                initialBrushXYPosition: null,
                brushIndex: drawingPosition
            });
        }
    };
    MultiBrush.prototype.handleHandleMouseDown = function (e, handle, brushIndex) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = this.props.timeRanges[brushIndex].begin().getTime();
        var end = this.props.timeRanges[brushIndex].end().getTime();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "handle-".concat(handle),
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0,
            brushIndex: brushIndex
        });
    };
    MultiBrush.prototype.handleMouseUp = function (e) {
        var _this = this;
        e.preventDefault();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        var brushing_is = this.state.brushIndex;
        this.setState({
            isBrushing: false,
            brushingInitializationSite: null,
            initialBrushBeginTime: null,
            initialBrushEndTime: null,
            initialBrushXYPosition: null,
            brushIndex: null
        }, function () {
            if (_this.props.onUserMouseUp) {
                _this.props.onUserMouseUp(brushing_is);
            }
        });
    };
    MultiBrush.prototype.handleMouseMove = function (e) {
        var _a;
        e.preventDefault();
        var x = e.pageX;
        var y = e.pageY;
        var xy = [Math.round(x), Math.round(y)];
        var viewport = this.viewport();
        if (this.state.isBrushing) {
            var newBegin = void 0;
            var newEnd = void 0;
            var tb = this.state.initialBrushBeginTime;
            var te = this.state.initialBrushEndTime;
            if (this.state.brushingInitializationSite === "overlay") {
                var offset = (0, util_1.getElementOffset)(this.overlay);
                var xx = e.pageX - offset.left;
                var t = this.props.timeScale.invert(xx).getTime();
                if (t < tb) {
                    newBegin = t < viewport.begin().getTime() ? viewport.begin() : t;
                    newEnd = tb > viewport.end().getTime() ? viewport.end() : tb;
                }
                else {
                    newBegin = tb < viewport.begin().getTime() ? viewport.begin() : tb;
                    newEnd = t > viewport.end().getTime() ? viewport.end() : t;
                }
            }
            else {
                var xy0 = this.state.initialBrushXYPosition;
                var timeOffset = this.props.timeScale.invert(xy0[0]).getTime() -
                    this.props.timeScale.invert(xy[0]).getTime();
                // Constrain
                var startOffsetConstraint = timeOffset;
                var endOffsetConstrain = timeOffset;
                if (tb - timeOffset < viewport.begin().valueOf()) {
                    startOffsetConstraint = tb - viewport.begin().getTime();
                }
                if (te - timeOffset > viewport.end().valueOf()) {
                    endOffsetConstrain = te - viewport.end().getTime();
                }
                newBegin =
                    this.state.brushingInitializationSite === "brush" ||
                        this.state.brushingInitializationSite === "handle-left"
                        ? parseInt(tb - startOffsetConstraint, 10)
                        : tb;
                newEnd =
                    this.state.brushingInitializationSite === "brush" ||
                        this.state.brushingInitializationSite === "handle-right"
                        ? parseInt(te - endOffsetConstrain, 10)
                        : te;
                // Swap if needed
                if (newBegin > newEnd)
                    _a = __read([newEnd, newBegin], 2), newBegin = _a[0], newEnd = _a[1];
            }
            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new pondjs_1.TimeRange(newBegin, newEnd), this.state.brushIndex);
            }
        }
    };
    //
    // Render
    //
    MultiBrush.prototype.renderOverlay = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height;
        var cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "brush":
                cursor = "move";
                break;
            default:
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
        }
        var overlayStyle = {
            fill: "white",
            opacity: 0,
            cursor: cursor
        };
        return (react_1["default"].createElement("rect", { ref: function (c) {
                _this.overlay = c;
            }, x: 0, y: 0, width: width, height: height, style: overlayStyle, onClick: this.handleMouseClick, onMouseDown: this.handleOverlayMouseDown, onMouseUp: this.handleMouseUp }));
    };
    MultiBrush.prototype.renderBrush = function (timeRange, idx) {
        var _this = this;
        var _a = this.props, timeScale = _a.timeScale, height = _a.height;
        if (!timeRange) {
            return react_1["default"].createElement("g", null);
        }
        var cursor;
        switch (this.state.brushingInitializationSite) {
            case "handle-right":
            case "handle-left":
                cursor = "ew-resize";
                break;
            case "overlay":
                cursor =
                    this.props.allowFreeDrawing || this.hasNullBrush() ? "crosshair" : "default";
                break;
            default:
                cursor = "move";
        }
        // Style of the brush area
        var brushDefaultStyle = {
            fill: "#777",
            fillOpacity: 0.3,
            stroke: "#fff",
            shapeRendering: "crispEdges",
            cursor: cursor
        };
        var userStyle = this.props.style ? this.props.style(idx) : {};
        var brushStyle = (0, merge_1["default"])(true, brushDefaultStyle, userStyle);
        if (!this.viewport().disjoint(timeRange)) {
            var range = timeRange.intersection(this.viewport());
            var begin = range.begin();
            var end = range.end();
            var _b = __read([timeScale(begin), 0], 2), x = _b[0], y = _b[1];
            var endPos = timeScale(end);
            var width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            var bounds = { x: x, y: y, width: width, height: height };
            return (react_1["default"].createElement("rect", __assign({}, bounds, { key: "".concat(idx, "-").concat(brushStyle), style: brushStyle, pointerEvents: "all", onClick: function (e) { return _this.handleMouseClick(e, idx); }, onMouseDown: function (e) { return _this.handleBrushMouseDown(e, idx); }, onMouseUp: this.handleMouseUp })));
        }
        return react_1["default"].createElement("g", null);
    };
    MultiBrush.prototype.renderHandles = function (timeRange, idx) {
        var _this = this;
        var _a = this.props, timeScale = _a.timeScale, height = _a.height;
        if (!timeRange) {
            return react_1["default"].createElement("g", null);
        }
        // Style of the handles
        var handleStyle = {
            fill: "white",
            opacity: 0,
            cursor: "ew-resize"
        };
        if (!this.viewport().disjoint(timeRange)) {
            var range = timeRange.intersection(this.viewport());
            var _b = __read(range.toJSON(), 2), begin = _b[0], end = _b[1];
            var _c = __read([timeScale(begin), 0], 2), x = _c[0], y = _c[1];
            var endPos = timeScale(end);
            var width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            var handleSize = this.props.handleSize;
            var leftHandleBounds = { x: x - 1, y: y, width: handleSize, height: height };
            var rightHandleBounds = {
                x: x + (width - handleSize),
                y: y,
                width: handleSize + 1,
                height: height
            };
            return (react_1["default"].createElement("g", null,
                react_1["default"].createElement("rect", __assign({}, leftHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "left", idx); }, onMouseUp: this.handleMouseUp })),
                react_1["default"].createElement("rect", __assign({}, rightHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "right", idx); }, onMouseUp: this.handleMouseUp }))));
        }
        return react_1["default"].createElement("g", null);
    };
    MultiBrush.prototype.render = function () {
        var _this = this;
        return (react_1["default"].createElement("g", { onMouseMove: this.handleMouseMove },
            this.renderOverlay(),
            (this.props.timeRanges || []).map(function (timeRange, idx) {
                return (react_1["default"].createElement("g", { key: "multibrush_".concat(idx) },
                    _this.renderBrush(timeRange, idx),
                    _this.renderHandles(timeRange, idx)));
            })));
    };
    MultiBrush.defaultProps = {
        handleSize: 6,
        allowFreeDrawing: true
    };
    return MultiBrush;
}(react_1["default"].Component));
exports["default"] = MultiBrush;
