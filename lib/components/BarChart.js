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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var pondjs_1 = require("pondjs");
var EventMarker_1 = __importDefault(require("./EventMarker"));
var styler_1 = require("../js/styler");
var defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
};
/**
 * Renders a bar chart based on IndexedEvents within a TimeSeries.
 *
 * This BarChart implementation is a little different that other time axis
 * bar charts in that it will render across a the time range of the event
 * rather than rendering to specific categories. As a result,
 * a Aug-2014 bar will render between the Aug 2014 tick mark and
 * the Sept 2014 tickmark. However, this allows it to play well with other
 * types of charts that maybe integrated into the same visualization.
 *
 * The BarChart will render a single TimeSeries. You can specify the columns
 * you want to render with the `columns` prop. Each column will be stacked on
 * the other, in the order specified in the `columns` array.
 *
 * ### IndexedEvents
 *
 * BarCharts are supposed to be for aggregated values (e.g. average of
 * many points over an hour), so the hours themselves are specified
 * with an "Index". An Index is a string that represents that range of time,
 * rather than a specific time like a timestamp would.
 *
 * Pond provides several mechanisms for building aggregated series from
 * a TimeSeries, and the BarChart code is suited to visualizing that
 * output. See Pond for more details (especially TimeSeries.fixedWindowRollup
 * and the Pipeline processing facilities). The realtime example in this
 * library also shows how to do this on incoming streams of data.
 *
 * If you have one timestamped point per hour and really want to represent
 * those with a BarChart, you can use the Pond static method
 * `Index.getIndexString(period, date)` to take the Date and return an
 * Index string. Say if those points were hourly, you'll end up with
 * strings that look like "1h-412715". This represents a specific hour
 * in time (the 412,715th hour since midnight 1 Jan 1970, actually).
 * Note that for larger time periods, index strings can be partial
 * dates, like "2016-08-31" for Aug 31st, 2016 or "2016-08" for Aug 2016.
 *
 * Use those index strings to build your timeseries instead of timestamps.
 * Here's the Pond code needed to convert a date to an index string:
 *
 * ```
 *   import { Index } from "pondjs";
 *   const d = new Date("2017-01-30T11:58:38.741Z");
 *   const index = Index.getIndexString("1h", d);   // '1h-412715'
 * ```
 *
 * With either the aggregated approach, or the above timestamped
 * conversion, you will want a `TimeSeries` of `IndexedEvent`s that
 * looks like this:
 * ```
 *   const series = new TimeSeries({
 *     name: "myseries",
 *     columns: ["index", "value"],
 *     points: [
 *       ["1h-41275", 22],
 *       ["1h-41276", 35],
 *       ["1h-41277", 72],
 *       ...
 *     ]
 *   })
 * ```
 *
 * Note: the first column of the timeseries should be "index" (not "time")
 * and each point should have an index string at the beginning.
 *
 * ### Interactivity
 *
 * The BarChart supports selection of individual bars. To control this use
 * `onSelectionChange` to get a callback of selection changed. Your callback
 * will be called with the selection (an object containing the event
 * and column). You can pass this back into the BarChart as `selection`. For
 * example:
 *
 * ```
 *  <BarChart
 *      ...
 *      selection={this.state.selection}
 *      onSelectionChange={selection => this.setState({selection})} />
 * ```
 *
 * Similarly you can monitor which bar is being hovered over with the
 * `onHighlightChange` callback. This can be used to determine the info box
 * to display. Info box will display a box (like a tooltip) with a line
 * connecting it to the bar. You use the `info` prop to evoke this and to
 * supply the text for the info box. See the styling notes below for more
 * information on this.
 *
 * ### Styling
 *
 * A BarChart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible: normal, highlighted,
 * selected and muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon should return a style object.
 *
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the bars can be controlled with the `spacing` and
 * `offset` props. Spacing controls the gap between the bars. Offset moves the
 * bars left or right by the given number of pixels. You can use this to place
 * bars along side each other. Alternatively, you can give each column a fixed width
 * using the `size` prop. In this case this size will be used in preference to the size
 * determined from the timerange of the event and the `spacing`.
 *
 * The info box is also able to be styled using `infoStyle`, `stemStyle` and
 * `markerStyle` This enables you to control the drawing of the box, the connecting
 * lines (stem) and dot respectively. Using the `infoWidth` and `infoHeight`
 * props you can control the size of the box, which is fixed. For the info inside
 * the box, it's up to you: it can either be a simple string or an array of
 * {label, value} pairs.
 */
var BarChart = /** @class */ (function (_super) {
    __extends(BarChart, _super);
    function BarChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarChart.prototype.handleHover = function (e, event, column) {
        var bar = { event: event, column: column };
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(bar);
        }
    };
    BarChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    BarChart.prototype.handleClick = function (e, event, column) {
        var bar = { event: event, column: column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(bar);
        }
        e.stopPropagation();
    };
    BarChart.prototype.providedStyleMap = function (column, event) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.barChartStyle()[column];
            }
            else if (typeof this.props.style === "function") {
                style = this.props.style(column, event);
            }
            else if (typeof this.props.style === "object") {
                style = this.props.style ? this.props.style[column] : defaultStyle;
            }
        }
        return style;
    };
    /**
     * Returns the style used for drawing the path
     */
    BarChart.prototype.style = function (column, event) {
        var style;
        var styleMap = this.providedStyleMap(column, event);
        var isHighlighted = this.props.highlighted &&
            ((column === this.props.highlighted.column &&
                pondjs_1.Event.is(this.props.highlighted.event, event)) ||
                (this.props.highlightEntireEvent && pondjs_1.Event.is(this.props.highlighted.event, event)));
        var isSelected = this.props.selected &&
            column === this.props.selected.column &&
            pondjs_1.Event.is(this.props.selected.event, event);
        if (this.props.selected) {
            if (isSelected) {
                style = (0, merge_1["default"])(true, defaultStyle.selected, styleMap.selected ? styleMap.selected : {});
            }
            else if (isHighlighted) {
                style = (0, merge_1["default"])(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
            }
            else {
                style = (0, merge_1["default"])(true, defaultStyle.muted, styleMap.muted ? styleMap.muted : {});
            }
        }
        else if (isHighlighted) {
            style = (0, merge_1["default"])(true, defaultStyle.highlighted, styleMap.highlighted ? styleMap.highlighted : {});
        }
        else {
            style = (0, merge_1["default"])(true, defaultStyle.normal, styleMap.normal ? styleMap.normal : {});
        }
        return style;
    };
    BarChart.prototype.renderBars = function () {
        var e_1, _a;
        var _this = this;
        var spacing = +this.props.spacing;
        var offset = +this.props.offset;
        var minBarHeight = this.props.minBarHeight;
        var series = this.props.series;
        var timeScale = this.props.timeScale;
        var yScale = this.props.yScale;
        var columns = this.props.columns || ["value"];
        var bars = [];
        var eventMarker;
        var _loop_1 = function (event_1) {
            var e_2, _d;
            var begin = event_1.begin();
            var end = event_1.end();
            var beginPos = timeScale(begin) + spacing;
            var endPos = timeScale(end) - spacing;
            var width = void 0;
            if (this_1.props.size) {
                width = this_1.props.size;
            }
            else {
                width = endPos - beginPos;
            }
            if (width < 1) {
                width = 1;
            }
            var x = void 0;
            if (this_1.props.size) {
                var center = timeScale(begin) + (timeScale(end) - timeScale(begin)) / 2;
                x = center - this_1.props.size / 2 + offset;
            }
            else {
                x = timeScale(begin) + spacing + offset;
            }
            var yBase = yScale(0);
            var yposPositive = yBase;
            var yposNegative = yBase;
            if (columns) {
                var _loop_2 = function (column) {
                    var index = event_1.index();
                    var key = "".concat(series.name(), "-").concat(index, "-").concat(column);
                    var value = event_1.get(column);
                    var style = this_1.style(column, event_1);
                    var height = yScale(0) - yScale(value);
                    // Allow negative values. Minimum bar height = 1 pixel.
                    // Stack negative bars below X-axis and positive above X-Axis
                    var positiveBar = height >= 0;
                    height = Math.max(Math.abs(height), minBarHeight);
                    var y = positiveBar ? yposPositive - height : yposNegative;
                    // Don't draw a rect when height and minBarHeight are both 0
                    if (height === 0)
                        return "break";
                    // Event marker if info provided and hovering
                    var isHighlighted = this_1.props.highlighted &&
                        column === this_1.props.highlighted.column &&
                        pondjs_1.Event.is(this_1.props.highlighted.event, event_1);
                    if (isHighlighted && this_1.props.info) {
                        eventMarker = (react_1["default"].createElement(EventMarker_1["default"], __assign({}, this_1.props, { event: event_1, column: column, offsetX: offset, offsetY: yBase - (positiveBar ? yposPositive : yposNegative) })));
                    }
                    var box = { x: x, y: y, width: width, height: height };
                    var barProps = __assign(__assign({ key: key }, box), { style: style });
                    if (this_1.props.onSelectionChange) {
                        barProps.onClick = function (e) { return _this.handleClick(e, event_1, column); };
                    }
                    if (this_1.props.onHighlightChange) {
                        barProps.onMouseMove = function (e) { return _this.handleHover(e, event_1, column); };
                        barProps.onMouseLeave = function () { return _this.handleHoverLeave(); };
                    }
                    bars.push(react_1["default"].createElement("rect", __assign({}, barProps)));
                    if (positiveBar) {
                        yposPositive -= height;
                    }
                    else {
                        yposNegative += height;
                    }
                };
                try {
                    for (var columns_1 = (e_2 = void 0, __values(columns)), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
                        var column = columns_1_1.value;
                        var state_1 = _loop_2(column);
                        if (state_1 === "break")
                            break;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (columns_1_1 && !columns_1_1.done && (_d = columns_1["return"])) _d.call(columns_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        var this_1 = this;
        try {
            for (var _b = __values(series.eventList()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var event_1 = _c.value;
                _loop_1(event_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return (react_1["default"].createElement("g", null,
            bars,
            eventMarker));
    };
    BarChart.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderBars());
    };
    BarChart.defaultProps = {
        visible: true,
        columns: ["value"],
        highlightEntireEvent: false,
        spacing: 1.0,
        offset: 0,
        minBarHeight: 1,
        infoStyle: {
            stroke: "#999",
            fill: "white",
            opacity: 0.9,
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
        infoWidth: 90,
        infoHeight: 30,
        infoOffsetY: 20
    };
    return BarChart;
}(react_1["default"].Component));
exports["default"] = BarChart;
