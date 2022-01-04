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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var underscore_1 = __importDefault(require("underscore"));
var d3_shape_1 = require("d3-shape");
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
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
            else if (underscore_1["default"].isFunction(this.props.style)) {
                style = this.props.style(column);
            }
            else if (underscore_1["default"].isObject(this.props.style)) {
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
            .x(function (d) { return _this.props.timeScale(d.x); })
            .y(function (d) { return _this.props.yScale(d.y); })(data);
        return (react_1["default"].createElement("g", { key: key },
            react_1["default"].createElement("path", { d: path, style: this.pathStyle(column) }),
            react_1["default"].createElement("path", { d: path, style: hitStyle, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
    };
    LineChart.prototype.renderLines = function () {
        var _this = this;
        return underscore_1["default"].map(this.props.columns, function (column) { return _this.renderLine(column); });
    };
    LineChart.prototype.renderLine = function (column) {
        var pathLines = [];
        var count = 1;
        if (this.props.breakLine) {
            // Remove nulls and NaNs from the line by generating a break in the line
            var currentPoints = null;
            for (var _i = 0, _a = this.props.series.events(); _i < _a.length; _i++) {
                var d = _a[_i];
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
            if (currentPoints && currentPoints.length > 1) {
                pathLines.push(this.renderPath(currentPoints, column, count));
                count += 1;
            }
        }
        else {
            // Ignore nulls and NaNs in the line
            var cleanedPoints = [];
            for (var _b = 0, _c = this.props.series.events(); _b < _c.length; _b++) {
                var d = _c[_b];
                var timestamp = new Date(d.begin().getTime() + (d.end().getTime() - d.begin().getTime()) / 2);
                var value = d.get(column);
                var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || !underscore_1["default"].isFinite(value);
                if (!badPoint) {
                    cleanedPoints.push({ x: timestamp, y: value });
                }
            }
            pathLines.push(this.renderPath(cleanedPoints, column, count));
            count += 1;
        }
        return react_1["default"].createElement("g", { key: column }, pathLines);
    };
    LineChart.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderLines());
    };
    LineChart.propTypes = {
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
         * Reference to the axis which provides the vertical scale for drawing.
         * e.g. specifying `axis="trafficRate"` would refer the y-scale of the YAxis
         * with id="trafficRate".
         */
        axis: prop_types_1["default"].string.isRequired,
        /**
         * Which columns from the series to draw.
         *
         * NOTE : Columns can't have periods because periods
         * represent a path to deep data in the underlying events
         * (i.e. reference into nested data structures)
         */
        columns: prop_types_1["default"].arrayOf(prop_types_1["default"].string),
        /**
         * The styles to apply to the underlying SVG lines. This is a mapping
         * of column names to objects with style attributes, in the following
         * format:
         *
         * ```
         * const style: any = {
         *     in: {
         *         normal: {stroke: "steelblue", fill: "none", strokeWidth: 1},
         *         highlighted: {stroke: "#5a98cb", fill: "none", strokeWidth: 1},
         *         selected: {stroke: "steelblue", fill: "none", strokeWidth: 1},
         *         muted: {stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1}
         *     },
         *     out: {
         *         ...
         *     }
         * };
         *
         *  <LineChart style={style} ... />
         * ```
         *
         * Alternatively, you can pass in a `Styler`. For example:
         *
         * ```
         * const currencyStyle = Styler([
         *     {key: "aud", color: "steelblue", width: 1, dashed: true},
         *     {key: "euro", color: "#F68B24", width: 2}
         * ]);
         *
         * <LineChart columns={["aud", "euro"]} style={currencyStyle} ... />
         *
         * ```
         */
        style: prop_types_1["default"].oneOfType([prop_types_1["default"].object, prop_types_1["default"].func, prop_types_1["default"].instanceOf(styler_1.Styler)]),
        /**
         * Any of D3's interpolation modes.
         */
        interpolation: prop_types_1["default"].oneOf([
            "curveBasis",
            "curveBasisOpen",
            "curveBundle",
            "curveCardinal",
            "curveCardinalOpen",
            "curveCatmullRom",
            "curveCatmullRomOpen",
            "curveLinear",
            "curveMonotoneX",
            "curveMonotoneY",
            "curveNatural",
            "curveRadial",
            "curveStep",
            "curveStepAfter",
            "curveStepBefore"
        ]),
        /**
         * The determines how to handle bad/missing values in the supplied
         * TimeSeries. A missing value can be null or NaN. If breakLine
         * is set to true (the default) then the line will be broken on either
         * side of the bad value(s). If breakLine is false bad values
         * are simply removed and the adjoining points are connected.
         */
        breakLine: prop_types_1["default"].bool,
        /**
         * The selected item, which will be rendered in the "selected" style.
         * If a line is selected, all other lines will be rendered in the "muted" style.
         *
         * See also `onSelectionChange`
         */
        selection: prop_types_1["default"].string,
        /**
         * A callback that will be called when the selection changes. It will be called
         * with the column corresponding to the line being clicked.
         */
        onSelectionChange: prop_types_1["default"].func,
        /**
         * The highlighted column, which will be rendered in the "highlighted" style.
         *
         * See also `onHighlightChange`
         */
        highlight: prop_types_1["default"].string,
        /**
         * A callback that will be called when the hovered over line changes.
         * It will be called with the corresponding column.
         */
        onHighlightChange: prop_types_1["default"].func,
        /**
         * [Internal] The timeScale supplied by the surrounding ChartContainer
         */
        timeScale: prop_types_1["default"].func,
        /**
         * [Internal] The yScale supplied by the associated YAxis
         */
        yScale: prop_types_1["default"].func,
        /**
         * [Internal] The width supplied by the surrounding ChartContainer
         */
        width: prop_types_1["default"].number
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
