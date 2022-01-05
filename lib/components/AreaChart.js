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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
require("array.prototype.fill");
var underscore_1 = __importDefault(require("underscore"));
var d3_shape_1 = require("d3-shape");
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var pondjs_1 = require("pondjs");
var util_1 = require("../js/util");
var styler_1 = require("../js/styler");
var curve_1 = __importDefault(require("../js/curve"));
var defaultStyle = {
    line: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    area: {
        normal: { fill: "steelblue", stroke: "none", opacity: 0.75 },
        highlighted: { fill: "#5a98cb", stroke: "none", opacity: 0.75 },
        selected: { fill: "steelblue", stroke: "none", opacity: 0.75 },
        muted: { fill: "steelblue", stroke: "none", opacity: 0.25 }
    }
};
/**
 * The `<AreaChart>` component is able to display single or multiple stacked
 * areas above or below the axis. It used throughout the
 * [My ESnet Portal](http://my.es.net).

 * The `<AreaChart>` should be used within a `<ChartContainer>` structure,
 * as this will construct the horizontal and vertical axis, and manage
 * other elements. Here is an example of an `<AreaChart>` with an up and down
 * network traffic visualization:
 *
 *  ```
 *   render() {
 *      return (
 *          ...
 *          <ChartContainer timeRange={trafficSeries.timerange()} width="1080">
 *              <ChartRow height="150">
 *                  <Charts>
 *                      <AreaChart
 *                          axis="traffic"
 *                          series={trafficSeries}
 *                          columns={{up: ["in"], down: ["out"]}}
 *                       />
 *                  </Charts>
 *                  <YAxis
 *                      id="traffic"
 *                      label="Traffic (bps)"
 *                      min={-max} max={max}
 *                      absolute={true}
 *                      width="60"
 *                      type="linear"
 *                  />
 *              </ChartRow>
 *          </ChartContainer>
 *          ...
 *      );
 *  }
 *  ```
 * The `<AreaChart>` takes a single `TimeSeries` object into its `series` prop. This
 * series can contain multiple columns and those columns can be referenced using the `columns`
 * prop. The `columns` props allows you to map columns in the series to the chart,
 * letting you specify the stacking and orientation of the data. In the above example
 * we map the "in" column in `trafficSeries` to the up direction and the "out" column to
 * the down direction. Each direction is specified as an array, so adding multiple
 * columns into a direction will stack the areas in that direction.
 *
 * Note: It is recommended that `<ChartContainer>`s be placed within a <Resizable> tag,
 * rather than hard coding the width as in the above example.
 *
 * Note 2 : Columns can't have periods because periods represent a path to deep data
 * in the underlying events (i.e. reference into nested data structures)
 *
 */
var AreaChart = /** @class */ (function (_super) {
    __extends(AreaChart, _super);
    function AreaChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var interpolation = nextProps.interpolation;
        var columns = nextProps.columns;
        var style = nextProps.style;
        var highlight = nextProps.highlight;
        var selection = nextProps.selection;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = (0, util_1.scaleAsString)(this.props.timeScale) !== (0, util_1.scaleAsString)(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var interpolationChanged = this.props.interpolation !== interpolation;
        var columnsChanged = JSON.stringify(this.props.columns) !== JSON.stringify(columns);
        var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        var highlightChanged = this.props.highlight !== highlight;
        var selectionChanged = this.props.selection !== selection;
        var seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        return (seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            interpolationChanged ||
            columnsChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            highlightChanged ||
            selectionChanged);
    };
    AreaChart.prototype.handleHover = function (e, column) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(column);
        }
    };
    AreaChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    AreaChart.prototype.handleClick = function (e, column) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(column);
        }
    };
    AreaChart.prototype.providedAreaStyleMap = function (column) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.areaChartStyle()[column];
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
    AreaChart.prototype.style = function (column, type) {
        var style;
        var styleMap = this.providedAreaStyleMap(column);
        var isHighlighted = this.props.highlight && column === this.props.highlight;
        var isSelected = this.props.selection && column === this.props.selection;
        if (!underscore_1["default"].has(styleMap, "line")) {
            console.error("Provided style for AreaChart does not define a style for the outline:", styleMap, column);
        }
        if (!underscore_1["default"].has(styleMap, "area")) {
            console.error("Provided style for AreaChart does not define a style for the area:", styleMap);
        }
        if (this.props.selection) {
            if (isSelected) {
                style = (0, merge_1["default"])(true, defaultStyle[type].selected, styleMap[type].selected ? styleMap[type].selected : {});
            }
            else if (isHighlighted) {
                style = (0, merge_1["default"])(true, defaultStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
            }
            else {
                style = (0, merge_1["default"])(true, defaultStyle[type].muted, styleMap[type].muted ? styleMap[type].muted : {});
            }
        }
        else if (isHighlighted) {
            style = (0, merge_1["default"])(true, defaultStyle[type].highlighted, styleMap[type].highlighted ? styleMap[type].highlighted : {});
        }
        else {
            style = (0, merge_1["default"])(true, defaultStyle[type].normal, styleMap[type].normal ? styleMap[type].normal : {});
        }
        return style;
    };
    AreaChart.prototype.pathStyle = function (column) {
        return this.style(column, "line");
    };
    AreaChart.prototype.areaStyle = function (column) {
        return this.style(column, "area");
    };
    AreaChart.prototype.renderArea = function (data, column, key) {
        var _this = this;
        // Use D3 to build an area generation function
        var style = this.areaStyle(column);
        var pathStyle = this.pathStyle(column);
        var areaGenerator = (0, d3_shape_1.area)()
            .curve(curve_1["default"][this.props.interpolation])
            .x(function (_a) {
            var _b = __read(_a, 2), x0 = _b[0], y1 = _b[1];
            return x0;
        })
            .y0(function (_a) {
            var _b = __read(_a, 2), x0 = _b[0], y0 = _b[1];
            return y0;
        })
            .y1(function (_a) {
            var _b = __read(_a, 2), x0 = _b[0], y1 = _b[1];
            return y1;
        });
        // Use the area generation function with our stacked data
        // to get an SVG path
        var areaPath = areaGenerator(data);
        // Outline the top of the curve
        var lineGenerator = (0, d3_shape_1.line)()
            .curve(curve_1["default"][this.props.interpolation])
            .x(function (_a) {
            var _b = __read(_a, 2), x0 = _b[0], y1 = _b[1];
            return x0;
        })
            .y(function (_a) {
            var _b = __read(_a, 2), x0 = _b[0], y1 = _b[1];
            return y1;
        });
        var outlinePath = lineGenerator(data);
        return (react_1["default"].createElement("g", { key: "area-".concat(key) },
            react_1["default"].createElement("path", { d: areaPath, style: style }),
            react_1["default"].createElement("path", { d: areaPath, style: style, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } }),
            react_1["default"].createElement("path", { d: outlinePath, style: pathStyle, onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
    };
    AreaChart.prototype.renderPaths = function (columnList, direction) {
        var _this = this;
        var dir = direction === "up" ? 1 : -1;
        var size = this.props.series.size();
        var offsets = new Array(size).fill(0);
        var len = columnList.length;
        return columnList.map(function (column, i) {
            // Stack the series columns to get our data in x0, y0, y1 format
            var pathAreas = [];
            var count = 1;
            if (_this.props.breakArea) {
                var currentPoints = null;
                for (var j = 0; j < _this.props.series.size(); j += 1) {
                    var seriesPoint = _this.props.series.at(j);
                    var value = seriesPoint.get(column);
                    var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || !underscore_1["default"].isFinite(value);
                    if (badPoint)
                        value = 0;
                    // Case 1:
                    // When stacking is present with multiple area charts, then mark bad points as 0
                    if (len > 1) {
                        if (!currentPoints)
                            currentPoints = [];
                        currentPoints.push({
                            x0: _this.props.timeScale(seriesPoint.timestamp()),
                            y0: _this.props.yScale(offsets[j]),
                            y1: _this.props.yScale(offsets[j] + dir * value)
                        });
                        if (_this.props.stack) {
                            offsets[j] += dir * value;
                        }
                    }
                    // Case Two
                    // When only one area chart is to be drawn, then create different areas for each area and ignore nulls and NaNs
                    else {
                        if (!badPoint) {
                            if (!currentPoints)
                                currentPoints = [];
                            currentPoints.push({
                                x0: _this.props.timeScale(seriesPoint.timestamp()),
                                y0: _this.props.yScale(offsets[j]),
                                y1: _this.props.yScale(offsets[j] + dir * value)
                            });
                            if (_this.props.stack) {
                                offsets[j] += dir * value;
                            }
                        }
                        else if (currentPoints) {
                            if (currentPoints.length > 1) {
                                pathAreas.push(_this.renderArea(currentPoints, column, count));
                                count += 1;
                            }
                            currentPoints = null;
                        }
                    }
                }
                if (currentPoints && currentPoints.length > 1) {
                    pathAreas.push(_this.renderArea(currentPoints, column, count));
                    count += 1;
                }
            }
            else {
                // Ignore nulls and NaNs in the area chart
                var cleanedPoints = [];
                for (var j = 0; j < _this.props.series.size(); j += 1) {
                    var seriesPoint = _this.props.series.at(j);
                    var value = seriesPoint.get(column);
                    var badPoint = underscore_1["default"].isNull(value) || underscore_1["default"].isNaN(value) || !underscore_1["default"].isFinite(value);
                    if (!badPoint) {
                        cleanedPoints.push({
                            x0: _this.props.timeScale(seriesPoint.timestamp()),
                            y0: _this.props.yScale(offsets[j]),
                            y1: _this.props.yScale(offsets[j] + dir * value)
                        });
                        if (_this.props.stack) {
                            offsets[j] += dir * value;
                        }
                    }
                }
                pathAreas.push(_this.renderArea(cleanedPoints, column, count));
                count += 1;
            }
            return react_1["default"].createElement("g", { key: column }, pathAreas);
        });
    };
    AreaChart.prototype.renderAreas = function () {
        var up = this.props.columns.up || [];
        var down = this.props.columns.down || [];
        return (react_1["default"].createElement("g", null,
            this.renderPaths(up, "up"),
            this.renderPaths(down, "down")));
    };
    AreaChart.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderAreas());
    };
    AreaChart.defaultProps = {
        visible: true,
        interpolation: "curveLinear",
        columns: {
            up: ["value"],
            down: []
        },
        stack: true,
        breakArea: true
    };
    return AreaChart;
}(react_1["default"].Component));
exports["default"] = AreaChart;
