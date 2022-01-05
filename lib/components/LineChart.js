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
var d3_shape_1 = require("d3-shape");
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var pondjs_1 = require("pondjs");
var styler_1 = require("../js/styler");
var util_1 = require("../js/util");
var curve_1 = __importDefault(require("../js/curve"));
var defaultStyle = {
    normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
    highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
    selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
    muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
};
/**
 * The `<LineChart>` component is able to display multiple columns of a TimeSeries
 * as separate line charts.
 *
 * The `<LineChart>` should be used within `<ChartContainer>` etc., as this will
 * construct the horizontal and vertical axis, and manage other elements.
 *
 * Here is an example of two columns of a TimeSeries being plotted with the `<LineChart>`:
 *
 * ```
  <ChartContainer timeRange={this.state.timerange} >
    <ChartRow height="200">
      <YAxis id="y" label="Price ($)" min={0.5} max={1.5} format="$,.2f" />
      <Charts>
        <LineChart
          axis="y"
          breakLine={false}
          series={currencySeries}
          columns={["aud", "euro"]}
          style={style}
          interpolation="curveBasis" />
      </Charts>
    </ChartRow>
  </ChartContainer>
 * ```
 */
var LineChart = /** @class */ (function (_super) {
    __extends(LineChart, _super);
    function LineChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolation = nextProps.interpolation;
        var highlight = nextProps.highlight;
        var selection = nextProps.selection;
        var columns = nextProps.columns;
        // What changed?
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = (0, util_1.scaleAsString)(this.props.timeScale) !== (0, util_1.scaleAsString)(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var interpolationChanged = this.props.interpolation !== interpolation;
        var highlightChanged = this.props.highlight !== highlight;
        var selectionChanged = this.props.selection !== selection;
        var columnsChanged = this.props.columns !== columns;
        var seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        return (widthChanged ||
            seriesChanged ||
            timeScaleChanged ||
            yAxisScaleChanged ||
            interpolationChanged ||
            highlightChanged ||
            selectionChanged ||
            columnsChanged);
    };
    LineChart.prototype.handleHover = function (e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    };
    LineChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    LineChart.prototype.handleClick = function (e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    };
    LineChart.prototype.providedPathStyleMap = function (column) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.lineChartStyle()[column];
            }
            else if (typeof this.props.style === "function") {
                style = this.props.style(column);
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
    LineChart.prototype.pathStyle = function (column) {
        var style;
        var styleMap = this.providedPathStyleMap(column);
        var isHighlighted = this.props.highlight && column === this.props.highlight;
        var isSelected = this.props.selection && column === this.props.selection;
        if (this.props.selection) {
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
            style = (0, merge_1["default"])(true, defaultStyle.normal, styleMap.normal);
        }
        style.pointerEvents = "none";
        return style;
    };
    LineChart.prototype.renderPath = function (data, column, key) {
        var _this = this;
        var hitStyle = {
            stroke: "white",
            fill: "none",
            opacity: 0.0,
            strokeWidth: 7,
            cursor: "crosshair",
            pointerEvents: "stroke"
        };
        // D3 generates each path
        var path = (0, d3_shape_1.line)()
            .curve(curve_1["default"][this.props.interpolation])
            .x(function (_a) {
            var _b = __read(_a, 1), x = _b[0];
            return _this.props.timeScale(x);
        })
            .y(function (_a) {
            var _b = __read(_a, 1), y = _b[0];
            return _this.props.yScale(y);
        })(data);
        return (react_1["default"].createElement("g", { key: key },
            react_1["default"].createElement("path", { d: path, style: this.pathStyle(column) }),
            react_1["default"].createElement("path", { d: path, style: hitStyle, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
    };
    LineChart.prototype.renderLines = function () {
        var _this = this;
        return underscore_1["default"].map(this.props.columns, function (column) { return _this.renderLine(column); });
    };
    LineChart.prototype.renderLine = function (column) {
        var e_1, _a, e_2, _b;
        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line by generating a break in the line
            var currentPoints = null;
            try {
                for (var _c = __values(this.props.series.eventList()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var d = _d.value;
                    var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
                    var value = d.get(column);
                    var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || !underscore_1["default"].isFinite(value);
                    if (!badPoint) {
                        if (!currentPoints)
                            currentPoints = [];
                        currentPoints.push({ x: timestamp, y: value });
                    }
                    else if (currentPoints) {
                        if (currentPoints.length > 1) {
                            pathLines.push(this.renderPath(currentPoints, column, count));
                            count += 1;
                        }
                        currentPoints = null;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
                count += 1;
            }
        }
        else {
            // Ignore nulls and NaNs in the line
            var cleanedPoints = [];
            try {
                for (var _e = __values(this.props.series.eventList()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var d = _f.value;
                    var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
                    var value = d.get(column);
                    var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || !underscore_1["default"].isFinite(value);
                    if (!badPoint) {
                        cleanedPoints.push({ x: timestamp, y: value });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            pathLines.push(this.renderPath(cleanedPoints, column, count));
            count += 1;
        }
        return react_1["default"].createElement("g", { key: column }, pathLines);
    };
    LineChart.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderLines());
    };
    LineChart.defaultProps = {
        visible: true,
        columns: ["value"],
        smooth: true,
        interpolation: "curveLinear",
        breakLine: true
    };
    return LineChart;
}(react_1["default"].Component));
exports["default"] = LineChart;
