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
var prop_types_1 = __importDefault(require("prop-types"));
var pondjs_1 = require("pondjs");
var util_1 = require("../js/util");
/**
 * Internal component which provides the top level event catcher for the charts.
 * This is a higher order component. It wraps a tree of SVG elements below it,
 * passed in as this.props.children, and catches events that they do not handle.
 *
 * The EventHandler is responsible for pan and zoom events as well as other click
 * and hover actions.
 */
var EventHandler = /** @class */ (function (_super) {
    __extends(EventHandler, _super);
    function EventHandler(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isPanning: false,
            initialPanBegin: null,
            initialPanEnd: null,
            initialPanPosition: null
        };
        _this.handleScrollWheel = _this.handleScrollWheel.bind(_this);
        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleContextMenu = _this.handleContextMenu.bind(_this);
        return _this;
    }
    EventHandler.prototype.componentDidMount = function () {
        this.eventHandlerRef.addEventListener("wheel", this.handleScrollWheel, { passive: false });
    };
    // get the event mouse position relative to the event rect
    EventHandler.prototype.getOffsetMousePosition = function (e) {
        var offset = (0, util_1.getElementOffset)(this.eventRect);
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    };
    //
    // Event handlers
    //
    EventHandler.prototype.handleScrollWheel = function (e) {
        if (!this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }
        e.preventDefault();
        var SCALE_FACTOR = 0.001;
        var scale = 1 + e.deltaY * SCALE_FACTOR;
        if (scale > 3) {
            scale = 3;
        }
        if (scale < 0.1) {
            scale = 0.1;
        }
        var xy = this.getOffsetMousePosition(e);
        var begin = this.props.scale.domain()[0].getTime();
        var end = this.props.scale.domain()[1].getTime();
        var center = this.props.scale.invert(xy[0]).getTime();
        var beginScaled = center - parseInt(((center - begin) * scale), 10);
        var endScaled = center + parseInt(((end - center) * scale), 10);
        // Duration constraint
        var duration = (end - begin) * scale;
        if (this.props.minDuration) {
            var minDuration = parseInt(this.props.minDuration, 10);
            if (duration < this.props.minDuration) {
                beginScaled = center - ((center - begin) / (end - begin)) * minDuration;
                endScaled = center + ((end - center) / (end - begin)) * minDuration;
            }
        }
        if (this.props.minTime && this.props.maxTime) {
            var maxDuration = this.props.maxTime.getTime() - this.props.minTime.getTime();
            if (duration > maxDuration) {
                duration = maxDuration;
            }
        }
        // Range constraint
        if (this.props.minTime && beginScaled < this.props.minTime.getTime()) {
            beginScaled = this.props.minTime.getTime();
            endScaled = beginScaled + duration;
        }
        if (this.props.maxTime && endScaled > this.props.maxTime.getTime()) {
            endScaled = this.props.maxTime.getTime();
            beginScaled = endScaled - duration;
        }
        var newBegin = new Date(beginScaled);
        var newEnd = new Date(endScaled);
        var newTimeRange = new pondjs_1.TimeRange(newBegin, newEnd);
        if (this.props.onZoom) {
            this.props.onZoom(newTimeRange);
        }
    };
    EventHandler.prototype.handleMouseDown = function (e) {
        if (!this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }
        if (e.button === 2) {
            return;
        }
        e.preventDefault();
        document.addEventListener("mouseover", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        if (this.props.enableDragZoom) {
            var offsetxy = this.getOffsetMousePosition(e);
            this.setState({
                isDragging: true,
                initialDragZoom: offsetxy[0],
                currentDragZoom: offsetxy[0]
            });
        }
        if (this.props.enablePanZoom) {
            var x = e.pageX;
            var y = e.pageY;
            var xy0 = [Math.round(x), Math.round(y)];
            var begin = this.props.scale.domain()[0].getTime();
            var end = this.props.scale.domain()[1].getTime();
            this.setState({
                isPanning: true,
                initialPanBegin: begin,
                initialPanEnd: end,
                initialPanPosition: xy0
            });
        }
        return false;
    };
    EventHandler.prototype.handleMouseUp = function (e) {
        if (!this.props.onMouseClick && !this.props.enablePanZoom && !this.props.enableDragZoom) {
            return;
        }
        e.stopPropagation();
        document.removeEventListener("mouseover", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        var offsetxy = this.getOffsetMousePosition(e);
        var x = e.pageX;
        var isPanning = this.state.initialPanPosition && Math.abs(x - this.state.initialPanPosition[0]) > 2;
        var isDragging = this.state.initialDragZoom && Math.abs(offsetxy[0] - this.state.initialDragZoom) > 2;
        if (this.props.onMouseClick && !isPanning && !isDragging) {
            this.props.onMouseClick(offsetxy[0], offsetxy[1]);
        }
        if (this.props.enableDragZoom) {
            if (isDragging) {
                var start = this.props.scale.invert(this.state.initialDragZoom).getTime();
                var end = this.props.scale.invert(this.state.currentDragZoom).getTime();
                var newBegin = parseInt(start, 10);
                var newEnd = parseInt(end, 10);
                if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                    newBegin = this.props.minTime.getTime();
                }
                if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                    newEnd = this.props.maxTime.getTime();
                }
                var newTimeRange = new pondjs_1.TimeRange([newBegin, newEnd].sort());
                if (this.props.onZoom) {
                    this.props.onZoom(newTimeRange);
                }
            }
            this.setState({
                isDragging: false,
                initialDragZoom: null,
                initialPanEnd: null,
                currentDragZoom: null
            });
        }
        if (this.props.enablePanZoom) {
            this.setState({
                isPanning: false,
                initialPanBegin: null,
                initialPanEnd: null,
                initialPanPosition: null
            });
        }
    };
    EventHandler.prototype.handleMouseOut = function (e) {
        e.preventDefault();
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    };
    EventHandler.prototype.handleMouseMove = function (e) {
        e.preventDefault();
        var x = e.pageX;
        var y = e.pageY;
        var xy = [Math.round(x), Math.round(y)];
        var offsetxy = this.getOffsetMousePosition(e);
        if (this.state.isDragging) {
            this.setState({
                currentDragZoom: offsetxy[0]
            });
        }
        if (this.state.isPanning) {
            var xy0 = this.state.initialPanPosition;
            var timeOffset = this.props.scale.invert(xy[0]).getTime() -
                this.props.scale.invert(xy0[0]).getTime();
            var newBegin = parseInt((this.state.initialPanBegin - timeOffset), 10);
            var newEnd = parseInt((this.state.initialPanEnd - timeOffset), 10);
            var duration = parseInt((this.state.initialPanEnd - this.state.initialPanBegin), 10);
            if (this.props.minTime && newBegin < this.props.minTime.getTime()) {
                newBegin = this.props.minTime.getTime();
                newEnd = newBegin + duration;
            }
            if (this.props.maxTime && newEnd > this.props.maxTime.getTime()) {
                newEnd = this.props.maxTime.getTime();
                newBegin = newEnd - duration;
            }
            var newTimeRange = new pondjs_1.TimeRange(newBegin, newEnd);
            if (this.props.onZoom) {
                this.props.onZoom(newTimeRange);
            }
        }
        else if (this.props.onMouseMove) {
            var mousePosition = this.getOffsetMousePosition(e);
            if (this.props.onMouseMove) {
                this.props.onMouseMove(mousePosition[0], mousePosition[1]);
            }
        }
    };
    EventHandler.prototype.handleContextMenu = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        if (this.props.onContextMenu) {
            this.props.onContextMenu(x, y);
        }
    };
    //
    // Render
    //
    EventHandler.prototype.render = function () {
        var _this = this;
        var cursor = this.state.isPanning ? "-webkit-grabbing" : "default";
        var handlers = {
            onMouseDown: this.handleMouseDown,
            onMouseMove: this.handleMouseMove,
            onMouseOut: this.handleMouseOut,
            onMouseUp: this.handleMouseUp,
            onContextMenu: this.handleContextMenu
        };
        return (react_1["default"].createElement("g", __assign({ pointerEvents: "all", ref: function (c) {
                _this.eventHandlerRef = c;
            } }, handlers),
            react_1["default"].createElement("rect", { key: "handler-hit-rect", ref: function (c) {
                    _this.eventRect = c;
                }, style: { fill: "#000", opacity: 0.0, cursor: cursor }, x: 0, y: 0, width: this.props.width, height: this.props.height }),
            this.props.children,
            this.state.isDragging && (react_1["default"].createElement("rect", { style: { opacity: 0.3, fill: "grey" }, x: Math.min(this.state.currentDragZoom, this.state.initialDragZoom), y: 0, width: Math.abs(this.state.currentDragZoom - this.state.initialDragZoom), height: this.props.height, pointerEvents: "none" }))));
    };
    EventHandler.propTypes = {
        children: prop_types_1["default"].oneOfType([prop_types_1["default"].arrayOf(prop_types_1["default"].node), prop_types_1["default"].node]),
        enablePanZoom: prop_types_1["default"].bool,
        enableDragZoom: prop_types_1["default"].bool,
        scale: prop_types_1["default"].any.isRequired,
        width: prop_types_1["default"].number.isRequired,
        height: prop_types_1["default"].number.isRequired,
        maxTime: prop_types_1["default"].instanceOf(Date),
        minTime: prop_types_1["default"].instanceOf(Date),
        minDuration: prop_types_1["default"].number,
        onZoom: prop_types_1["default"].func,
        onMouseMove: prop_types_1["default"].func,
        onMouseOut: prop_types_1["default"].func,
        onMouseClick: prop_types_1["default"].func,
        onContextMenu: prop_types_1["default"].func
    };
    EventHandler.defaultProps = {
        enablePanZoom: false,
        enableDragZoom: false
    };
    return EventHandler;
}(react_1["default"].Component));
exports["default"] = EventHandler;
