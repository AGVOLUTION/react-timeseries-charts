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
var react_1 = __importDefault(require("react"));
var d3_ease_1 = require("d3-ease");
var d3_scale_1 = require("d3-scale");
var Brush_1 = __importDefault(require("./Brush"));
var YAxis_1 = __importDefault(require("./YAxis"));
var Charts_1 = __importDefault(require("./Charts"));
var MultiBrush_1 = __importDefault(require("./MultiBrush"));
var TimeMarker_1 = __importDefault(require("./TimeMarker"));
var interpolators_1 = __importDefault(require("../js/interpolators"));
function createScale(yaxis, type, min, max, y0, y1) {
    var scale;
    if (underscore_1["default"].isUndefined(min) || underscore_1["default"].isUndefined(max)) {
        scale = null;
    }
    else if (type === "linear") {
        scale = (0, d3_scale_1.scaleLinear)()
            .domain([min, max])
            .range([y0, y1])
            .nice();
    }
    else if (type === "log") {
        var base = yaxis.props.logBase || 10;
        scale = (0, d3_scale_1.scaleLog)()
            .base(base)
            .domain([min, max])
            .range([y0, y1]);
    }
    else if (type === "power") {
        var power = yaxis.props.powerExponent || 2;
        scale = (0, d3_scale_1.scalePow)()
            .exponent(power)
            .domain([min, max])
            .range([y0, y1]);
    }
    return scale;
}
/**
 * A ChartRow is a container for a set of YAxis and multiple charts
 * which are overlaid on each other in a central canvas.
 *
 * Here is an example where a single `<ChartRow>` is defined within
 * the `<ChartContainer>`. Of course you can have any number of rows.
 *
 * For this row we specify the one prop `height` as 200 pixels high.
 *
 * Within the `<ChartRow>` we add:
 *
 * * `<YAxis>` elements for axes to the left of the chart
 * * `<Chart>` block containing our central chart area
 * * `<YAxis>` elements for our axes to the right of the charts
 *
 * ```
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis />
 *         <YAxis />
 *         <Charts>
 *             charts...
 *        </Charts>
 *         <YAxis />
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
var ChartRow = /** @class */ (function (_super) {
    __extends(ChartRow, _super);
    function ChartRow(props) {
        var _this = _super.call(this, props) || this;
        _this.isChildYAxis = function (child) {
            return child.type === YAxis_1["default"] ||
                (underscore_1["default"].has(child.props, "min") && underscore_1["default"].has(child.props, "max"));
        };
        // id of clipping rectangle we will generate and use for each child
        // chart. Lives in state to ensure just one clipping rectangle and
        // id per chart row instance; we don't want a fresh id generated on
        // each render.
        var clipId = underscore_1["default"].uniqueId("clip_");
        var clipPathURL = "url(#".concat(clipId, ")");
        _this.state = {
            clipId: clipId,
            clipPathURL: clipPathURL
        };
        _this.mounted = true;
        return _this;
    }
    ChartRow.prototype.updateScales = function (props) {
        var _this = this;
        var axisMargin = props.axisMargin;
        var innerHeight = +props.height - axisMargin * 2;
        var rangeTop = axisMargin;
        var rangeBottom = innerHeight - axisMargin;
        react_1["default"].Children.forEach(props.children, function (child) {
            if (child === null)
                return;
            if (_this.isChildYAxis(child)) {
                var _a = child.props, id_1 = _a.id, max = _a.max, min = _a.min, _b = _a.transition, transition = _b === void 0 ? 0 : _b, _c = _a.type, type = _c === void 0 ? "linear" : _c;
                if (!underscore_1["default"].has(_this.scaleMap, id_1)) {
                    // If necessary, initialize a ScaleInterpolator for this y-axis.
                    // When the yScale changes, we will update this interpolator.
                    _this.scaleMap[id_1] = new interpolators_1["default"](transition, d3_ease_1.easeSinOut, function (s) {
                        var yAxisScalerMap = _this.state.yAxisScalerMap;
                        yAxisScalerMap[id_1] = s;
                        if (_this.mounted)
                            _this.setState(yAxisScalerMap);
                    });
                }
                // Get the vertical scale for this y-axis.
                var scale = void 0;
                if (underscore_1["default"].has(child.props, "yScale")) {
                    // If the yScale prop is passed explicitly, use that.
                    scale = child.props.yScale;
                }
                else {
                    // Otherwise, compute the scale based on the max and min props.
                    scale = createScale(child, type, min, max, rangeBottom, rangeTop);
                }
                // Update the scale on the interpolator for this y-axis.
                var cacheKey = "".concat(type, "-").concat(min, "-").concat(max, "-").concat(rangeBottom, "-").concat(rangeTop);
                _this.scaleMap[id_1].setScale(cacheKey, scale);
            }
        });
        // Update the state with the newly interpolated scaler for each y-axis.
        var scalerMap = {};
        underscore_1["default"].forEach(this.scaleMap, function (interpolator, id) {
            scalerMap[id] = interpolator.scaler();
        });
        if (this.mounted)
            this.setState({ yAxisScalerMap: scalerMap });
    };
    ChartRow.prototype.componentWillMount = function () {
        // Our chart scales are driven off a mapping between id of the axis
        // and the scale that axis represents. Depending on the transition time,
        // this scale will animate over time. The controller of this animation is
        // the ScaleInterpolator. We create new Scale Interpolators here for each
        // axis id.
        this.scaleMap = {};
        this.updateScales(this.props);
    };
    /**
     * When we get changes to the row's props we update our map of
     * axis scales.
     */
    ChartRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.updateScales(nextProps);
    };
    ChartRow.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    ChartRow.prototype.render = function () {
        var _this = this;
        var _a = this.props, paddingLeft = _a.paddingLeft, paddingRight = _a.paddingRight;
        var axes = []; // Contains all the yAxis elements used in the render
        var chartList = []; // Contains all the Chart elements used in the render
        // Dimensions
        var innerHeight = +this.props.height - this.props.axisMargin * 2;
        //
        // Build a map of elements that occupy left or right slots next to the
        // chart.
        //
        // If an element has both and id and a min/max range, then we consider
        // it to be a y axis. For those we calculate a d3 scale that can be
        // reference by a chart. That scale will also be available to the axis
        // when it renders.
        //
        // For this row, we will need to know how many axis slots we are using.
        //
        var yAxisMap = {}; // Maps axis id -> axis element
        var leftAxisList = []; // Ordered list of left axes ids
        var rightAxisList = []; // Ordered list of right axes ids
        var alignLeft = true;
        react_1["default"].Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (child.type === Charts_1["default"]) {
                alignLeft = false;
            }
            else {
                var id_2 = child.props.id;
                // Check to see if we think this 'axis' is actually an axis
                if (_this.isChildYAxis(child)) {
                    var yaxis = child;
                    if (yaxis.props.id && yaxis.props.visible !== false) {
                        // Relate id to the axis
                        yAxisMap[yaxis.props.id] = yaxis;
                    }
                    // Columns counts
                    if (alignLeft) {
                        leftAxisList.push(id_2);
                    }
                    else {
                        rightAxisList.push(id_2);
                    }
                }
            }
        });
        // Since we'll be building the left axis items from the inside to the outside
        leftAxisList.reverse();
        //
        // Push each axis onto the axes, transforming each into its
        // column location
        //
        var transform;
        var id;
        var props;
        var axis;
        var posx = 0;
        // Space used by columns on left and right of charts
        var leftWidth = underscore_1["default"].reduce(this.props.leftAxisWidths, function (a, b) { return a + b; }, 0);
        var rightWidth = underscore_1["default"].reduce(this.props.rightAxisWidths, function (a, b) { return a + b; }, 0);
        var chartWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        posx = leftWidth;
        for (var leftColumnIndex = 0; leftColumnIndex < this.props.leftAxisWidths.length; leftColumnIndex += 1) {
            var colWidth = this.props.leftAxisWidths[leftColumnIndex];
            posx -= colWidth;
            if (colWidth > 0 && leftColumnIndex < leftAxisList.length) {
                id = leftAxisList[leftColumnIndex];
                if (underscore_1["default"].has(yAxisMap, id)) {
                    transform = "translate(".concat(posx + paddingLeft, ",0)");
                    // Additional props for left aligned axes
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        isInnerAxis: leftColumnIndex === 0,
                        align: "left",
                        scale: this.scaleMap[id].latestScale()
                    };
                    // Cloned left axis
                    axis = react_1["default"].cloneElement(yAxisMap[id], props);
                    axes.push(react_1["default"].createElement("g", { key: "y-axis-left-".concat(leftColumnIndex), transform: transform }, axis));
                }
            }
        }
        posx = this.props.width - rightWidth - paddingRight;
        for (var rightColumnIndex = 0; rightColumnIndex < this.props.rightAxisWidths.length; rightColumnIndex += 1) {
            var colWidth = this.props.rightAxisWidths[rightColumnIndex];
            if (colWidth > 0 && rightColumnIndex < rightAxisList.length) {
                id = rightAxisList[rightColumnIndex];
                if (underscore_1["default"].has(yAxisMap, id)) {
                    transform = "translate(".concat(posx + paddingLeft, ",0)");
                    // Additional props for right aligned axes
                    props = {
                        width: colWidth,
                        height: innerHeight,
                        chartExtent: chartWidth,
                        //showGrid: this.props.showGrid,
                        isInnerAxis: rightColumnIndex === 0,
                        align: "right",
                        scale: this.scaleMap[id].latestScale()
                    };
                    // Cloned right axis
                    axis = react_1["default"].cloneElement(yAxisMap[id], props);
                    axes.push(react_1["default"].createElement("g", { key: "y-axis-right-".concat(rightColumnIndex), transform: transform }, axis));
                }
            }
            posx += colWidth;
        }
        //
        // Push each chart onto the chartList, transforming each to the right
        // of the left axis slots and specifying its width. Each chart is passed
        // its time and y-scale. The y-scale is looked up in scaleMap, whose
        // current value is stored in the component state.
        //
        var chartTransform = "translate(".concat(leftWidth + paddingLeft, ",0)");
        var keyCount = 0;
        react_1["default"].Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (child.type === Charts_1["default"]) {
                var charts_1 = child;
                react_1["default"].Children.forEach(charts_1.props.children, function (chart) {
                    if (!underscore_1["default"].has(chart.props, "visible") || chart.props.visible) {
                        var scale = null;
                        if (underscore_1["default"].has(_this.state.yAxisScalerMap, chart.props.axis)) {
                            scale = _this.state.yAxisScalerMap[chart.props.axis];
                        }
                        var ytransition = null;
                        if (underscore_1["default"].has(_this.scaleMap, chart.props.axis)) {
                            ytransition = _this.scaleMap[chart.props.axis];
                        }
                        var chartProps = {
                            key: keyCount,
                            width: chartWidth,
                            height: innerHeight,
                            timeScale: _this.props.timeScale,
                            timeFormat: _this.props.timeFormat
                        };
                        if (scale) {
                            chartProps.yScale = scale;
                        }
                        if (ytransition) {
                            chartProps.transition = ytransition;
                        }
                        chartList.push(react_1["default"].cloneElement(chart, chartProps));
                        keyCount += 1;
                    }
                });
            }
        });
        //
        // Push each child Brush on to the brush list.  We need brushed to be
        // rendered last (on top) of everything else in the Z order, both for
        // visual correctness and to ensure that the brush gets mouse events
        // before anything underneath
        //
        var brushList = [];
        var multiBrushList = [];
        keyCount = 0;
        react_1["default"].Children.forEach(this.props.children, function (child) {
            if (child === null)
                return;
            if (child.type === Brush_1["default"] ||
                child.type === MultiBrush_1["default"]) {
                var brushProps = {
                    key: "brush-".concat(keyCount),
                    width: chartWidth,
                    height: innerHeight,
                    timeScale: _this.props.timeScale
                };
                if (child.type === Brush_1["default"]) {
                    brushList.push(react_1["default"].cloneElement(child, brushProps));
                }
                else {
                    multiBrushList.push(react_1["default"].cloneElement(child, brushProps));
                }
            }
            keyCount += 1;
        });
        var charts = (react_1["default"].createElement("g", { transform: chartTransform, key: "event-rect-group" },
            react_1["default"].createElement("g", { key: "charts", clipPath: this.state.clipPathURL }, chartList)));
        //
        // Clipping
        //
        var clipper = (react_1["default"].createElement("defs", null,
            react_1["default"].createElement("clipPath", { id: this.state.clipId },
                react_1["default"].createElement("rect", { x: "0", y: "0", style: { strokeOpacity: 0.0 }, width: chartWidth, height: innerHeight }))));
        //
        // Brush
        //
        var brushes = (react_1["default"].createElement("g", { transform: chartTransform, key: "brush-group" }, brushList));
        //
        // Multi Brush
        //
        var multiBrushes = (react_1["default"].createElement("g", { transform: chartTransform, key: "multi-brush-group" }, multiBrushList));
        //
        // TimeMarker used as a tracker
        //
        var tracker;
        if (this.props.trackerTime) {
            var timeFormat = this.props.trackerTimeFormat || this.props.timeFormat;
            var timeMarkerProps = {
                timeFormat: timeFormat,
                showLine: false,
                showTime: this.props.trackerShowTime,
                time: this.props.trackerTime,
                timeScale: this.props.timeScale,
                width: chartWidth,
                infoStyle: this.props.trackerStyle
            };
            if (this.props.trackerInfoValues) {
                timeMarkerProps.infoWidth = this.props.trackerInfoWidth;
                timeMarkerProps.infoHeight = this.props.trackerInfoHeight;
                timeMarkerProps.infoValues = this.props.trackerInfoValues;
                timeMarkerProps.timeFormat = this.props.trackerTimeFormat;
            }
            var trackerStyle = {
                pointerEvents: "none"
            };
            var trackerTransform = "translate(".concat(leftWidth + paddingLeft, ",0)");
            tracker = (react_1["default"].createElement("g", { key: "tracker-group", style: trackerStyle, transform: trackerTransform },
                react_1["default"].createElement(TimeMarker_1["default"], __assign({}, timeMarkerProps))));
        }
        return (react_1["default"].createElement("g", null,
            clipper,
            axes,
            charts,
            brushes,
            multiBrushes,
            tracker));
    };
    ChartRow.defaultProps = {
        trackerTimeFormat: "%b %d %Y %X",
        enablePanZoom: false,
        height: 100,
        axisMargin: 5,
        visible: true
    };
    return ChartRow;
}(react_1["default"].Component));
exports["default"] = ChartRow;
