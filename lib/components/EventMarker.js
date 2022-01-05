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
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var merge_1 = __importDefault(require("merge"));
var pondjs_1 = require("pondjs");
var d3_time_format_1 = require("d3-time-format");
var Label_1 = __importDefault(require("./Label"));
var ValueList_1 = __importDefault(require("./ValueList"));
var EventTime = function (_a) {
    var time = _a.time, _b = _a.format, format = _b === void 0 ? "%m/%d/%y %X" : _b;
    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };
    var text;
    if (typeof format === "function") {
        text = format(time);
    }
    else {
        var fmt = (0, d3_time_format_1.timeFormat)(format);
        text = fmt(time);
    }
    return (react_1["default"].createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, text));
};
EventTime.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};
var EventTimeRange = function (_a) {
    var timerange = _a.timerange, _b = _a.format, format = _b === void 0 ? "%m/%d/%y %X" : _b;
    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };
    var d1 = timerange.begin();
    var d2 = timerange.end();
    var beginText;
    var endText;
    if (typeof format === "function") {
        beginText = format(d1);
        endText = format(d2);
    }
    else {
        var fmt = (0, d3_time_format_1.timeFormat)(format);
        beginText = fmt(d1);
        endText = fmt(d2);
    }
    return (react_1["default"].createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, "".concat(beginText, " to ").concat(endText)));
};
EventTimeRange.propTypes = {
    timerange: pondjs_1.TimeRange,
    format: prop_types_1["default"].any
};
EventTimeRange.defaultProps = {
    infoTimeFormat: "%m/%d/%y %X"
};
var EventIndex = function (_a) {
    var index = _a.index, format = _a.format;
    var textStyle = {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd",
        pointerEvents: "none"
    };
    var text;
    if (typeof format === "function") {
        text = format(index);
    }
    else if (typeof format === "string") {
        var fmt = (0, d3_time_format_1.timeFormat)(format);
        text = fmt(index.begin());
    }
    else {
        text = index.toString();
    }
    return (react_1["default"].createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, text));
};
EventIndex.propTypes = {
    index: pondjs_1.Index,
    format: prop_types_1["default"].any
};
/**
 * Renders a marker at a specific event on the chart.
 *
 * To explain how EventMarkers work, it's useful to explain a little
 * terminology used here. A marker has several parts:
 *
 *  * the "marker" itself which appears at the (value, time) of the event.
 *    This is a dot which whose radius is defined by markerRadius, and
 *    whose style is set with markerStyle
 *  * the "markerLabel" which is a string that will be rendered next to
 *    the marker. The label can be aligned with markerAlign and also
 *    styled with markerLabelStyle
 *  * the "info box" which is a box containing values that hovers that the
 *    top of the chart. Optionally it can show the time above the box.
 *    The values themselves are supplied as an array of objects using
 *    the `info` prop. The info box can be styled with `infoStyle`,
 *    sized with `infoWidth` and `infoHeight`, and the time formatted
 *    with `infoTimeFormat`
 *  * the "stem" which is a connector between the marker and the
 *    info box to visually link the two
 *
 * Combining these attributes, Event markers fall into two flavors, either
 * you want to omit the infoBox and mark the event with a dot and optionally
 * a label, or you want to omit the label (and perhaps marker dot) and show
 * a flag style marker with the infoBox connected to the event with the stem.
 *
 * As with other IndexedEvents or TimeRangeEvents, the marker will appear at
 * the center of the timerange represented by that event. You can, however,
 * override either the x or y position by a number of pixels.
 */
var EventMarker = /** @class */ (function (_super) {
    __extends(EventMarker, _super);
    function EventMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventMarker.prototype.renderTime = function (event) {
        if (event.getKey() instanceof pondjs_1.Time) {
            return react_1["default"].createElement(EventTime, { time: event.timestamp(), format: this.props.infoTimeFormat });
        }
        else if (event.getKey() instanceof pondjs_1.Index) {
            return react_1["default"].createElement(EventIndex, { index: event.index(), format: this.props.infoTimeFormat });
        }
        else if (event.getKey() instanceof pondjs_1.TimeRange) {
            return (react_1["default"].createElement(EventTimeRange, { timerange: event.timerange(), format: this.props.infoTimeFormat }));
        }
        return react_1["default"].createElement("g", null);
    };
    EventMarker.prototype.renderMarker = function (event, column, info) {
        var t;
        if (event.getKey() instanceof pondjs_1.Time) {
            t = event.timestamp();
        }
        else {
            t = new Date(event.begin().getTime() + (event.end().getTime() - event.begin().getTime()) / 2);
        }
        var value;
        if (this.props.yValueFunc) {
            value = this.props.yValueFunc(event, column);
        }
        else {
            value = event.get(column);
        }
        // Allow overrides on the x and y position. This is useful for the barchart
        // tracker because bars maybe be offset from their actual event position in
        // order to display them side by side.
        var posx = this.props.timeScale(t) + this.props.offsetX;
        var posy = this.props.yScale(value) - this.props.offsetY;
        var infoOffsetY = this.props.infoOffsetY;
        var infoBoxProps = {
            align: "left",
            style: this.props.infoStyle,
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };
        var w = this.props.infoWidth;
        var lineBottom = posy - 10;
        var verticalStem;
        var horizontalStem;
        var dot;
        var infoBox;
        var transform;
        var label;
        if (info) {
            if (typeof this.props.info === "string") {
                infoBox = react_1["default"].createElement(Label_1["default"], __assign({}, infoBoxProps, { label: info }));
            }
            else {
                infoBox = react_1["default"].createElement(ValueList_1["default"], __assign({}, infoBoxProps, { values: info }));
            }
        }
        //
        // Marker on right of event
        //
        if (this.props.type === "point") {
            var textDefaultStyle = {
                fontSize: 11,
                pointerEvents: "none",
                paintOrder: "stroke",
                fill: "#b0b0b0",
                strokeWidth: 2,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                fontWeight: 800
            };
            var dx = 0;
            var dy = 0;
            switch (this.props.markerLabelAlign) {
                case "left":
                    dx = 5;
                    textDefaultStyle.textAnchor = "start";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "right":
                    dx = -5;
                    textDefaultStyle.textAnchor = "end";
                    textDefaultStyle.alignmentBaseline = "central";
                    break;
                case "top":
                    dy = -5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "bottom";
                    break;
                case "bottom":
                    dy = 5;
                    textDefaultStyle.textAnchor = "middle";
                    textDefaultStyle.alignmentBaseline = "hanging";
                    break;
                default:
                //pass
            }
            var tstyle = (0, merge_1["default"])(true, textDefaultStyle, this.props.markerLabelStyle);
            dot = (react_1["default"].createElement("circle", { cx: posx, cy: posy, r: this.props.markerRadius, pointerEvents: "none", style: this.props.markerStyle }));
            label = (react_1["default"].createElement("text", { x: posx, y: posy, dx: dx, dy: dy, style: tstyle }, this.props.markerLabel));
            return (react_1["default"].createElement("g", null,
                dot,
                label));
        }
        else {
            if (posx + 10 + w < (this.props.width * 3) / 4) {
                if (info) {
                    verticalStem = (react_1["default"].createElement("line", { pointerEvents: "none", style: this.props.stemStyle, x1: -10, y1: lineBottom, x2: -10, y2: infoOffsetY }));
                    horizontalStem = (react_1["default"].createElement("line", { pointerEvents: "none", style: this.props.stemStyle, x1: -10, y1: infoOffsetY, x2: -2, y2: infoOffsetY }));
                }
                dot = (react_1["default"].createElement("circle", { cx: -10, cy: lineBottom, r: this.props.markerRadius, pointerEvents: "none", style: this.props.markerStyle }));
                transform = "translate(".concat(posx + 10, ",").concat(10, ")");
            }
            else {
                if (info) {
                    verticalStem = (react_1["default"].createElement("line", { pointerEvents: "none", style: this.props.stemStyle, x1: w + 10, y1: lineBottom, x2: w + 10, y2: infoOffsetY }));
                    horizontalStem = (react_1["default"].createElement("line", { pointerEvents: "none", style: this.props.stemStyle, x1: w + 10, y1: infoOffsetY, x2: w + 2, y2: infoOffsetY }));
                }
                dot = (react_1["default"].createElement("circle", { cx: w + 10, cy: lineBottom, r: this.props.markerRadius, pointerEvents: "none", style: this.props.markerStyle }));
                transform = "translate(".concat(posx - w - 10, ",").concat(10, ")");
            }
            return (react_1["default"].createElement("g", { transform: transform },
                verticalStem,
                horizontalStem,
                dot,
                react_1["default"].createElement("g", { transform: "translate(0,".concat(infoOffsetY - 20, ")") }, this.renderTime(event)),
                react_1["default"].createElement("g", { transform: "translate(0,".concat(infoOffsetY, ")") }, infoBox)));
        }
    };
    EventMarker.prototype.render = function () {
        var _a = this.props, event = _a.event, column = _a.column, info = _a.info;
        if (!event) {
            return react_1["default"].createElement("g", null);
        }
        return react_1["default"].createElement("g", null, this.renderMarker(event, column, info));
    };
    EventMarker.defaultProps = {
        type: "flag",
        column: "value",
        infoWidth: 90,
        infoHeight: 25,
        infoStyle: {
            fill: "white",
            opacity: 0.9,
            stroke: "#999",
            pointerEvents: "none"
        },
        stemStyle: {
            stroke: "#999",
            cursor: "crosshair",
            pointerEvents: "none"
        },
        markerStyle: {
            fill: "#999"
        },
        markerRadius: 2,
        markerLabelAlign: "left",
        markerLabelStyle: {
            fill: "#999"
        },
        offsetX: 0,
        offsetY: 0,
        infoOffsetY: 20
    };
    return EventMarker;
}(react_1["default"].Component));
exports["default"] = EventMarker;
