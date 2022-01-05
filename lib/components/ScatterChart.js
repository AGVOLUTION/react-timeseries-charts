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
var underscore_1 = __importDefault(require("underscore"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var pondjs_1 = require("pondjs");
var EventMarker_1 = __importDefault(require("./EventMarker"));
var util_1 = require("../js/util");
var styler_1 = require("../js/styler");
var defaultStyle = {
    normal: { fill: "steelblue", opacity: 0.8 },
    highlighted: { fill: "steelblue", opacity: 1.0 },
    selected: { fill: "steelblue", opacity: 1.0 },
    muted: { fill: "steelblue", opacity: 0.4 }
};
/**
 * The `<ScatterChart >` widget is able to display multiple columns of a series
 * scattered across a time axis.
 *
 * The ScatterChart should be used within `<ChartContainer>` etc.,
 * as this will construct the horizontal and vertical axis, and
 * manage other elements. As with other charts, this lets them be stacked or
 * overlaid on top of each other.
 *
 * A custom info overlay lets you hover over the data and examine points. Points
 * can be selected or highlighted.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()}>
 *     <ChartRow height="150">
 *         <YAxis id="wind" label="Wind gust (mph)" labelOffset={-5}
 *                min={0} max={series.max()} width="100" type="linear" format=",.1f"/>
 *         <Charts>
 *             <ScatterChart
 *               axis="wind"
 *               series={series}
 *               style={{color: "steelblue", opacity: 0.5}} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 * ### Styling
 *
 * A scatter chart supports per-column or per-event styling. Styles can be set for
 * each of the four states that are possible for each event: normal, highlighted,
 * selected or muted. To style per-column, supply an object. For per-event styling
 * supply a function: `(event, column) => {}` The functon will return a style object.
 * See the `style` prop in the API documentation for more information.
 *
 * Separately the size of the dots can be controlled with the `radius` prop. This
 * can either be a fixed value (e.g. 2.0), or a function. If a function is supplied
 * it will be called as `(event, column) => {}` and should return the size.
 *
 * The hover info for each point is also able to be styled using the info style.
 * This enables you to control the drawing of the box and connecting lines. Using
 * the `infoWidth` and `infoHeight` props you can control the size of the box, which
 * is fixed.
 */
var ScatterChart = /** @class */ (function (_super) {
    __extends(ScatterChart, _super);
    function ScatterChart(props) {
        var _this = _super.call(this, props) || this;
        _this.handleHover = _this.handleHover.bind(_this);
        _this.handleHoverLeave = _this.handleHoverLeave.bind(_this);
        return _this;
    }
    // get the event mouse position relative to the event rect
    ScatterChart.prototype.getOffsetMousePosition = function (e) {
        var offset = (0, util_1.getElementOffset)(this.eventrect);
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [Math.round(x), Math.round(y)];
    };
    //
    // Event handlers
    //
    ScatterChart.prototype.handleClick = function (e, event, column) {
        var point = { event: event, column: column };
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(point);
        }
    };
    ScatterChart.prototype.handleHover = function (e) {
        var e_1, _a, e_2, _b;
        var _c = __read(this.getOffsetMousePosition(e), 2), x = _c[0], y = _c[1];
        var point;
        var minDistance = Infinity;
        try {
            for (var _d = __values(this.props.columns), _e = _d.next(); !_e.done; _e = _d.next()) {
                var column = _e.value;
                try {
                    for (var _f = (e_2 = void 0, __values(this.props.series.eventList())), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var event_1 = _g.value;
                        var t = event_1.timestamp();
                        var value = event_1.get(column);
                        var px = this.props.timeScale(t);
                        var py = this.props.yScale(value);
                        var distance = Math.sqrt((px - x) * (px - x) + (py - y) * (py - y));
                        if (distance < minDistance) {
                            point = { event: event_1, column: column };
                            minDistance = distance;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (this.props.onMouseNear) {
            this.props.onMouseNear(point);
        }
    };
    ScatterChart.prototype.handleHoverLeave = function () {
        if (this.props.onMouseNear) {
            this.props.onMouseNear(null);
        }
    };
    //
    // Internal methods
    //
    ScatterChart.prototype.providedStyleMap = function (column, event) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.scatterChartStyle()[column];
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
    ScatterChart.prototype.style = function (column, event) {
        var style;
        var styleMap = this.providedStyleMap(column, event);
        var isHighlighted = this.props.highlight &&
            column === this.props.highlight.column &&
            pondjs_1.Event.is(this.props.highlight.event, event);
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
    //
    // Render
    //
    ScatterChart.prototype.renderScatter = function () {
        var _this = this;
        var _a = this.props, series = _a.series, timeScale = _a.timeScale, yScale = _a.yScale;
        var points = [];
        var hoverOverlay;
        // if selectionChange is enabled, pointerEvents should be enabled as well
        var pointerEvents = this.props.onSelectionChange ? "auto" : "none";
        this.props.columns.forEach(function (column) {
            var e_3, _a;
            var key = 1;
            var _loop_1 = function (event_2) {
                var t = new Date(event_2.begin().getTime() + (event_2.end().getTime() - event_2.begin().getTime()) / 2);
                var value = event_2.get(column);
                var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || underscore_1["default"].isUndefined(value);
                var style = _this.style(column, event_2);
                if (!badPoint) {
                    var x = timeScale(t);
                    var y = yScale(value);
                    var radius = typeof _this.props.radius === "function"
                        ? _this.props.radius(event_2, column)
                        : +_this.props.radius;
                    var isHighlighted = _this.props.highlight &&
                        pondjs_1.Event.is(_this.props.highlight.event, event_2) &&
                        column === _this.props.highlight.column;
                    // Hover info. Note that we just pass all of our props down
                    // into the EventMarker here, but the interesting ones are:
                    // * the info values themselves
                    // * the infoStyle
                    // * infoWidth and infoHeight
                    if (isHighlighted && _this.props.info) {
                        hoverOverlay = (react_1["default"].createElement(EventMarker_1["default"], __assign({}, _this.props, { event: event_2, column: column, marker: "circle", markerRadius: 0 })));
                    }
                    points.push(react_1["default"].createElement("circle", { key: "".concat(column, "-").concat(key), cx: x, cy: y, r: radius, style: style, pointerEvents: pointerEvents, onMouseMove: _this.handleHover, onClick: function (e) { return _this.handleClick(e, event_2, column); } }));
                    key += 1;
                }
            };
            try {
                for (var _b = __values(series.eventList()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var event_2 = _c.value;
                    _loop_1(event_2);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
        return (react_1["default"].createElement("g", null,
            points,
            hoverOverlay));
    };
    ScatterChart.prototype.render = function () {
        var _this = this;
        return (react_1["default"].createElement("g", null,
            react_1["default"].createElement("rect", { key: "scatter-hit-rect", ref: function (c) {
                    _this.eventrect = c;
                }, style: { opacity: 0.0 }, x: 0, y: 0, width: this.props.width, height: this.props.height, onMouseMove: this.handleHover, onMouseLeave: this.handleHoverLeave }),
            this.renderScatter()));
    };
    ScatterChart.defaultProps = {
        visible: true,
        columns: ["value"],
        radius: 2.0,
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
        infoWidth: 90,
        infoHeight: 30,
        infoOffsetY: 20
    };
    return ScatterChart;
}(react_1["default"].Component));
exports["default"] = ScatterChart;
