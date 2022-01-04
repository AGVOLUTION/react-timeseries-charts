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
var underscore_1 = __importDefault(require("underscore"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var pondjs_1 = require("pondjs");
/**
 * Renders an event view that shows the supplied set of events along a time axis.
 * The events should be supplied as a Pond TimeSeries.
 * That series may contain regular TimeEvents, TimeRangeEvents
 * or IndexedEvents.
 */
var EventChart = /** @class */ (function (_super) {
    __extends(EventChart, _super);
    function EventChart(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hover: null
        };
        return _this;
    }
    /**
     * Continues a hover event on a specific bar of the bar chart.
     */
    EventChart.prototype.onMouseOver = function (e, event) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(event);
        }
        this.setState({ hover: event });
    };
    /**
     * Handle mouse leave and calls onMouseLeave callback if one is provided
     */
    EventChart.prototype.onMouseLeave = function () {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(this.state.hover);
        }
        this.setState({ hover: null });
    };
    /**
     * Handle click will call the onSelectionChange callback if one is provided
     * as a prop. It will be called with the event selected.
     */
    EventChart.prototype.handleClick = function (e, event) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
    };
    EventChart.prototype.render = function () {
        var _this = this;
        var _a = this.props, series = _a.series, textOffsetX = _a.textOffsetX, textOffsetY = _a.textOffsetY, hoverMarkerWidth = _a.hoverMarkerWidth;
        var scale = this.props.timeScale;
        var eventMarkers = [];
        // Create and array of markers, one for each event
        var i = 0;
        var _loop_1 = function (event_1) {
            var begin = event_1.begin();
            var end = event_1.end();
            var beginPos = scale(begin) >= 0 ? scale(begin) : 0;
            var endPos = scale(end) <= this_1.props.width ? scale(end) : this_1.props.width;
            var transform = "translate(".concat(beginPos, ",0)");
            var isHover = this_1.state.hover ? pondjs_1.Event.is(event_1, this_1.state.hover) : false;
            var state = void 0;
            if (isHover) {
                state = "hover";
            }
            else {
                state = "normal";
            }
            var barNormalStyle = {};
            var barStyle = {};
            if (this_1.props.style) {
                barNormalStyle = this_1.props.style(event_1, "normal");
                barStyle = this_1.props.style(event_1, state);
            }
            var label = "";
            if (this_1.props.label) {
                if (underscore_1["default"].isString(this_1.props.label)) {
                    label = this_1.props.label;
                }
                else if (underscore_1["default"].isFunction(this_1.props.label)) {
                    label = this_1.props.label(event_1);
                }
            }
            var x = this_1.props.spacing;
            var y = 0;
            var width = endPos - beginPos - 2 * this_1.props.spacing;
            width = width < 0 ? 0 : width;
            var height = this_1.props.size;
            var eventLabelStyle = {
                fontWeight: 100,
                fontSize: 11
            };
            var text = null;
            if (isHover) {
                text = (react_1["default"].createElement("g", null,
                    react_1["default"].createElement("rect", { className: "eventchart-marker", x: x, y: y, width: hoverMarkerWidth, height: height + 4, style: (0, merge_1["default"])(true, barNormalStyle, { pointerEvents: "none" }) }),
                    react_1["default"].createElement("text", { style: __assign({ pointerEvents: "none", fill: "#444" }, eventLabelStyle), x: 8 + textOffsetX, y: 15 + textOffsetY }, label)));
            }
            eventMarkers.push(react_1["default"].createElement("g", { transform: transform, key: i },
                react_1["default"].createElement("rect", { className: "eventchart-marker", x: x, y: y, width: width, height: height, style: barStyle, onClick: function (e) { return _this.handleClick(e, event_1); }, onMouseLeave: function () { return _this.onMouseLeave(); }, onMouseOver: function (e) { return _this.onMouseOver(e, event_1); } }),
                text));
            i += 1;
        };
        var this_1 = this;
        for (var _i = 0, _b = series.events(); _i < _b.length; _i++) {
            var event_1 = _b[_i];
            _loop_1(event_1);
        }
        return react_1["default"].createElement("g", null, eventMarkers);
    };
    EventChart.defaultProps = {
        visible: true,
        size: 30,
        spacing: 0,
        textOffsetX: 0,
        textOffsetY: 0,
        hoverMarkerWidth: 5
    };
    EventChart.propTypes = {
        /**
         * Show or hide this chart
         */
        visible: prop_types_1["default"].bool,
        /**
         * What [Pond TimeSeries](https://esnet-pondjs.appspot.com/#/timeseries) data to visualize
         */
        // series: PropTypes.instanceOf(TimeSeries).isRequired,
        series: prop_types_1["default"].any.isRequired,
        /**
         * Set hover label text
         * When label is function callback it will be called with current event.
         */
        label: prop_types_1["default"].any,
        /**
         * The height in pixels for the event bar
         */
        size: prop_types_1["default"].number,
        /**
         * The distance in pixels to inset the event bar from its actual timerange
         */
        spacing: prop_types_1["default"].number,
        /**
         * Marker width on hover
         */
        hoverMarkerWidth: prop_types_1["default"].number,
        /**
         * Hover text offset position X
         */
        textOffsetX: prop_types_1["default"].number,
        /**
         * Hover text offset position Y
         */
        textOffsetY: prop_types_1["default"].number,
        /**
         * A function that should return the style of the event box
         */
        style: prop_types_1["default"].func,
        /**
         * Event selection on click. Will be called with selected event.
         */
        onSelectionChange: prop_types_1["default"].func,
        /**
         * Mouse leave at end of hover event
         */
        onMouseLeave: prop_types_1["default"].func,
        /**
         * Mouse over event callback
         */
        onMouseOver: prop_types_1["default"].func,
        /**
         * [Internal] The timeScale supplied by the surrounding ChartContainer
         */
        timeScale: prop_types_1["default"].func,
        /**
         * [Internal] The width supplied by the surrounding ChartContainer
         */
        width: prop_types_1["default"].number
    };
    return EventChart;
}(react_1["default"].Component));
exports["default"] = EventChart;
