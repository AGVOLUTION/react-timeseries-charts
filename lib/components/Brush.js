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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var pondjs_1 = require("pondjs");
var util_1 = require("../js/util");
/**
 * Renders a brush with the range defined in the prop `timeRange`.
 */
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isBrushing: false
        };
        _this.handleBrushMouseDown = _this.handleBrushMouseDown.bind(_this);
        _this.handleOverlayMouseDown = _this.handleOverlayMouseDown.bind(_this);
        _this.handleHandleMouseDown = _this.handleHandleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        return _this;
    }
    Brush.prototype.viewport = function () {
        var _a = this.props, width = _a.width, timeScale = _a.timeScale;
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(width);
        return new pondjs_1.TimeRange(viewBeginTime, viewEndTime);
    };
    //
    // Event handlers
    //
    Brush.prototype.handleBrushMouseDown = function (e) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = +this.props.timeRange.begin();
        var end = +this.props.timeRange.end();
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "brush",
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    };
    Brush.prototype.handleOverlayMouseDown = function (e) {
        e.preventDefault();
        var offset = (0, util_1.getElementOffset)(this.overlay);
        var x = e.pageX - offset.left;
        var t = this.props.timeScale.invert(x).getTime();
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "overlay",
            initialBrushBeginTime: t,
            initialBrushEndTime: t,
            initialBrushXYPosition: null
        });
    };
    Brush.prototype.handleHandleMouseDown = function (e, handle) {
        e.preventDefault();
        var x = e.pageX, y = e.pageY;
        var xy0 = [Math.round(x), Math.round(y)];
        var begin = this.props.timeRange.begin().getTime();
        var end = this.props.timeRange.end().getTime();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: true,
            brushingInitializationSite: "handle-".concat(handle),
            initialBrushBeginTime: begin,
            initialBrushEndTime: end,
            initialBrushXYPosition: xy0
        });
    };
    Brush.prototype.handleMouseUp = function (e) {
        e.preventDefault();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        this.setState({
            isBrushing: false,
            brushingInitializationSite: null,
            initialBrushBeginTime: null,
            initialBrushEndTime: null,
            initialBrushXYPosition: null
        });
    };
    /**
   * Handles clearing the TimeRange if the user clicks on the overlay (but
   * doesn't drag to create a new brush). This will send a null as the
   * new TimeRange. The user of this code can react to that however they
   * see fit, but the most logical response is to reset the timerange to
   * some initial value. This behavior is optional.
   */
    Brush.prototype.handleClick = function () {
        if (this.props.allowSelectionClear && this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(null);
        }
    };
    Brush.prototype.handleMouseMove = function (e) {
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
                if (tb - timeOffset < viewport.begin()) {
                    startOffsetConstraint = tb - viewport.begin().getTime();
                }
                if (te - timeOffset > viewport.end()) {
                    endOffsetConstrain = te - viewport.end().getTime();
                }
                newBegin = this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-left"
                    ? parseInt((tb - startOffsetConstraint), 10)
                    : tb;
                newEnd = this.state.brushingInitializationSite === "brush" ||
                    this.state.brushingInitializationSite === "handle-right"
                    ? parseInt((te - endOffsetConstrain), 10)
                    : te;
                // Swap if needed
                if (newBegin > newEnd)
                    _a = [newEnd, newBegin], newBegin = _a[0], newEnd = _a[1];
            }
            if (this.props.onTimeRangeChanged) {
                this.props.onTimeRangeChanged(new pondjs_1.TimeRange(newBegin, newEnd));
            }
        }
    };
    //
    // Render
    //
    Brush.prototype.renderOverlay = function () {
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
                cursor = "crosshair";
        }
        var overlayStyle = {
            fill: "white",
            opacity: 0,
            cursor: cursor
        };
        return (react_1["default"].createElement("rect", { ref: function (c) {
                _this.overlay = c;
            }, x: 0, y: 0, width: width, height: height, style: overlayStyle, onMouseDown: this.handleOverlayMouseDown, onMouseUp: this.handleMouseUp, onClick: this.handleClick }));
    };
    Brush.prototype.renderBrush = function () {
        var _a = this.props, timeRange = _a.timeRange, timeScale = _a.timeScale, height = _a.height, style = _a.style;
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
                cursor = "crosshair";
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
        var brushStyle = (0, merge_1["default"])(true, brushDefaultStyle, style);
        if (!this.viewport().disjoint(timeRange)) {
            var range = timeRange.intersection(this.viewport());
            var begin = range.begin();
            var end = range.end();
            var _b = [timeScale(begin), 0], x = _b[0], y = _b[1];
            var endPos = timeScale(end);
            var width = endPos - x;
            if (width < 1) {
                width = 1;
            }
            var bounds = { x: x, y: y, width: width, height: height };
            return (react_1["default"].createElement("rect", __assign({}, bounds, { style: brushStyle, pointerEvents: "all", onMouseDown: this.handleBrushMouseDown, onMouseUp: this.handleMouseUp })));
        }
        return react_1["default"].createElement("g", null);
    };
    Brush.prototype.renderHandles = function () {
        var _this = this;
        var _a = this.props, timeRange = _a.timeRange, timeScale = _a.timeScale, height = _a.height;
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
            var _b = range.toJSON(), begin = _b[0], end = _b[1];
            var _c = [timeScale(begin), 0], x = _c[0], y = _c[1];
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
                react_1["default"].createElement("rect", __assign({}, leftHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "left"); }, onMouseUp: this.handleMouseUp })),
                react_1["default"].createElement("rect", __assign({}, rightHandleBounds, { style: handleStyle, pointerEvents: "all", onMouseDown: function (e) { return _this.handleHandleMouseDown(e, "right"); }, onMouseUp: this.handleMouseUp }))));
        }
        return react_1["default"].createElement("g", null);
    };
    Brush.prototype.render = function () {
        return (react_1["default"].createElement("g", { onMouseMove: this.handleMouseMove },
            this.renderOverlay(),
            this.renderBrush(),
            this.renderHandles()));
    };
    Brush.propTypes = {
        /**
     * The timerange for the brush. Typically you would maintain this
     * as state on the surrounding page, since it would likely control
     * another page element, such as the range of the main chart. See
     * also `onTimeRangeChanged()` for receiving notification of the
     * brush range being changed by the user.
     *
     * Takes a Pond TimeRange object.
     */
        // timeRange: PropTypes.instanceOf(TimeRange),
        timeRange: prop_types_1["default"].any,
        /**
     * The brush is rendered as an SVG rect. You can specify the style
     * of this rect using this prop.
     */
        style: prop_types_1["default"].object,
        /**
     * The size of the invisible side handles. Defaults to 6 pixels.
     */
        handleSize: prop_types_1["default"].number,
        allowSelectionClear: prop_types_1["default"].bool,
        /**
     * A callback which will be called if the brush range is changed by
     * the user. It is called with a Pond TimeRange object. Note that if
     * `allowSelectionClear` is set to true, then this can also be called
     * when the user performs a simple click outside the brush area. In
     * this case it will be called with null as the TimeRange. You can
     * use this to reset the selection, perhaps to some initial range.
     */
        onTimeRangeChanged: prop_types_1["default"].func,
        /**
     * [Internal] The timeScale supplied by the surrounding ChartContainer
     */
        timeScale: prop_types_1["default"].any,
        /**
     * [Internal] The width supplied by the surrounding ChartContainer
     */
        width: prop_types_1["default"].number,
        /**
     * [Internal] The height supplied by the surrounding ChartContainer
     */
        height: prop_types_1["default"].number
    };
    Brush.defaultProps = {
        handleSize: 6,
        allowSelectionClear: false
    };
    return Brush;
}(react_1["default"].Component));
exports["default"] = Brush;
