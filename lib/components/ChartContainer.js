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
var invariant_1 = __importDefault(require("invariant"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var d3_scale_1 = require("d3-scale");
var react_hot_loader_1 = require("react-hot-loader");
var Brush_1 = __importDefault(require("./Brush"));
var MultiBrush_1 = __importDefault(require("./MultiBrush"));
var ChartRow_1 = __importDefault(require("./ChartRow"));
var Charts_1 = __importDefault(require("./Charts"));
var EventHandler_1 = __importDefault(require("./EventHandler"));
var TimeAxis_1 = __importDefault(require("./TimeAxis"));
var TimeMarker_1 = __importDefault(require("./TimeMarker"));
var Label_1 = __importDefault(require("./Label"));
var defaultTimeAxisStyle = {
    axis: {
        fill: "none",
        stroke: "#C0C0C0",
        pointerEvents: "none"
    }
};
var defaultTitleStyle = {
    fontWeight: 100,
    fontSize: 14,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#C0C0C0"
};
var defaultChartRowTitleLabelStyle = {
    fontWeight: 100,
    fontSize: 13,
    font: '"Goudy Bookletter 1911", sans-serif"',
    fill: "#000"
};
var defaultChartRowTitleBoxStyle = {
    fill: "white",
    stroke: "none"
};
var defaultTrackerStyle = {
    line: {
        stroke: "#999",
        cursor: "crosshair",
        pointerEvents: "none"
    },
    box: {
        fill: "white",
        opacity: 0.9,
        stroke: "#999",
        pointerEvents: "none"
    },
    dot: {
        fill: "#999"
    }
};
/**
 * The `<ChartContainer>` is the outer most element of a chart and is
 * responsible for generating and arranging its sub-elements. Specifically,
 * it is a container for one or more `<ChartRows>` (each of which contains
 * charts, axes etc) and in addition it manages the overall time range of
 * the chart and so also is responsible for the time axis, which is always
 * shared by all the rows.
 *
 * Here is an example:
 *
 * ```xml
 * <ChartContainer timeRange={audSeries.timerange()} width="800">
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 *     <ChartRow>
 *         ...
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
var ChartContainer = /** @class */ (function (_super) {
    __extends(ChartContainer, _super);
    function ChartContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleTrackerChanged = _this.handleTrackerChanged.bind(_this);
        _this.handleTimeRangeChanged = _this.handleTimeRangeChanged.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);
        _this.handleContextMenu = _this.handleContextMenu.bind(_this);
        _this.handleBackgroundClick = _this.handleBackgroundClick.bind(_this);
        _this.handleZoom = _this.handleZoom.bind(_this);
        _this.saveSvgRef = _this.saveSvgRef.bind(_this);
        return _this;
    }
    //
    // Event handlers
    //
    ChartContainer.prototype.handleTrackerChanged = function (t) {
        var _this = this;
        if (this.props.onTrackerChanged) {
            this.props.onTrackerChanged(t, 
            // Adjust the scaled time so that the result
            // is the true x position relative to the whole chart
            function (t) { return _this.timeScale(t) + _this.leftWidth; });
        }
    };
    /**
     * Within the charts library the time range of the x axis is kept as a begin
     * and end time (Javascript Date objects). But the interface is Pond based,
     * so this callback returns a Pond TimeRange.
     */
    ChartContainer.prototype.handleTimeRangeChanged = function (timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    };
    ChartContainer.prototype.handleMouseMove = function (x, y) {
        this.handleTrackerChanged(this.timeScale.invert(x));
        if (this.props.onMouseMove) {
            this.props.onMouseMove(x, y);
        }
    };
    ChartContainer.prototype.handleMouseOut = function (e) {
        this.handleTrackerChanged(null);
    };
    ChartContainer.prototype.handleContextMenu = function (x, y) {
        if (this.props.onContextMenu) {
            var t = this.props.scale ? this.props.scale.invert(x) : this.timeScale.invert(x);
            this.props.onContextMenu(x, y, t);
        }
    };
    ChartContainer.prototype.handleBackgroundClick = function (x, y) {
        if (this.props.onBackgroundClick) {
            var t = this.props.scale ? this.props.scale.invert(x) : this.timeScale.invert(x);
            this.props.onBackgroundClick(x, y, t);
        }
    };
    ChartContainer.prototype.handleZoom = function (timerange) {
        if (this.props.onTimeRangeChanged) {
            this.props.onTimeRangeChanged(timerange);
        }
    };
    ChartContainer.prototype.saveSvgRef = function (c) {
        this.svg = c;
    };
    //
    // Render
    //
    ChartContainer.prototype.render = function () {
        var _this = this;
        var _a = this.props.padding, padding = _a === void 0 ? 0 : _a;
        var _b = this.props, _c = _b.paddingLeft, paddingLeft = _c === void 0 ? padding : _c, _d = _b.paddingRight, paddingRight = _d === void 0 ? padding : _d;
        var _e = this.props, _f = _e.paddingTop, paddingTop = _f === void 0 ? padding : _f, _g = _e.paddingBottom, paddingBottom = _g === void 0 ? padding : _g;
        var _h = this.props.titleHeight, titleHeight = _h === void 0 ? 28 : _h;
        if (underscore_1["default"].isUndefined(this.props.title)) {
            titleHeight = 0;
        }
        var chartRows = [];
        var chartRowTitles = [];
        var leftAxisWidths = [];
        var rightAxisWidths = [];
        //
        // How much room does the axes of all the charts take up on the right
        // and left. The result is an array for left and right axis which
        // contain the min column width needed to hold the axes widths at the
        // pos for all rows.
        //
        // pos   1      0        <charts>     0        1        2
        //     | Axis | Axis |   CHARTS    |  Axis  |                      Row 1
        //            | Axis |   CHARTS    |  Axis  |  Axis  |  Axis |     Row 2
        //     ...............              ..........................
        //          left cols              right cols
        //
        react_1["default"].Children.forEach(this.props.children, function (childRow) {
            if ((0, react_hot_loader_1.areComponentsEqual)(childRow.type, ChartRow_1["default"])) {
                //
                // Within this row, count the number of columns that will be
                // left and right of the Charts tag, as well as the total number
                // of Charts tags for error handling
                //
                var countLeft_1 = 0;
                var countCharts_1 = 0;
                var align_1 = "left";
                react_1["default"].Children.forEach(childRow.props.children, function (child) {
                    if (child === null)
                        return;
                    if (child.type === Charts_1["default"]) {
                        countCharts_1 += 1;
                        align_1 = "right";
                    }
                    else if (child.type !== Brush_1["default"] &&
                        child.type !== MultiBrush_1["default"]) {
                        if (align_1 === "left") {
                            countLeft_1 += 1;
                        }
                    }
                });
                if (countCharts_1 !== 1) {
                    var msg = "ChartRow should have one and only one <Charts> tag within it";
                    (0, invariant_1["default"])(false, msg, childRow.constructor.name);
                }
                align_1 = "left";
                var pos_1 = countLeft_1 - 1;
                react_1["default"].Children.forEach(childRow.props.children, function (child) {
                    if (child === null)
                        return;
                    if (child.type === Charts_1["default"] ||
                        child.type === Brush_1["default"] ||
                        child.type === MultiBrush_1["default"]) {
                        if (child.type === Charts_1["default"]) {
                            align_1 = "right";
                            pos_1 = 0;
                        }
                    }
                    else {
                        var width = Number(child.props.width) || 40;
                        var visible = !underscore_1["default"].has(child.props, "visible") || child.props.visible;
                        if (!visible)
                            width = 0;
                        if (align_1 === "left") {
                            leftAxisWidths[pos_1] = leftAxisWidths[pos_1]
                                ? Math.max(width, leftAxisWidths[pos_1])
                                : width;
                            pos_1 -= 1;
                        }
                        else if (align_1 === "right") {
                            rightAxisWidths[pos_1] = rightAxisWidths[pos_1]
                                ? Math.max(width, rightAxisWidths[pos_1])
                                : width;
                            pos_1 += 1;
                        }
                    }
                });
            }
        });
        // Space used by columns on left and right of charts
        var leftWidth = (this.leftWidth = underscore_1["default"].reduce(leftAxisWidths, function (a, b) { return a + b; }, 0));
        var rightWidth = (this.rightWidth = underscore_1["default"].reduce(rightAxisWidths, function (a, b) { return a + b; }, 0));
        //
        // Time scale
        //
        var _j = this.props.timeAxisHeight, timeAxisHeight = _j === void 0 ? 35 : _j;
        if (this.props.hideTimeAxis) {
            timeAxisHeight = 0;
        }
        var timeAxisWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        if (!this.props.timeRange) {
            throw Error("Invalid timerange passed to ChartContainer");
        }
        var timeScale = (this.timeScale = this.props.utc
            ? (0, d3_scale_1.scaleUtc)()
                .domain(this.props.timeRange.toJSON())
                .range([0, timeAxisWidth])
            : (0, d3_scale_1.scaleTime)()
                .domain(this.props.timeRange.toJSON())
                .range([0, timeAxisWidth]));
        var chartsWidth = this.props.width - leftWidth - rightWidth - paddingLeft - paddingRight;
        var i = 0;
        var yPosition = paddingTop;
        // Chart title
        var transform = "translate(".concat(leftWidth + paddingLeft, ",").concat(yPosition, ")");
        var titleStyle = (0, merge_1["default"])(true, defaultTitleStyle, this.props.titleStyle ? this.props.titleStyle : {});
        var title = this.props.title ? (react_1["default"].createElement("g", { transform: transform },
            react_1["default"].createElement(Label_1["default"], { align: "center", label: this.props.title, style: { label: titleStyle, box: { fill: "none", stroke: "none" } }, width: chartsWidth, height: titleHeight }))) : (react_1["default"].createElement("g", null));
        var trackerStyle = (0, merge_1["default"])(true, defaultTrackerStyle, this.props.trackerStyle ? this.props.trackerStyle : {});
        //yPosition += titleHeight;
        var chartsHeight = 0;
        react_1["default"].Children.forEach(this.props.children, function (child) {
            if (child.type === ChartRow_1["default"]) {
                var chartRow = child;
                var rowKey = "chart-row-row-".concat(i);
                var firstRow = i === 0;
                var isVisible = child.props.visible;
                var props = {
                    timeScale: timeScale,
                    paddingLeft: paddingLeft,
                    paddingRight: paddingRight,
                    leftAxisWidths: leftAxisWidths,
                    rightAxisWidths: rightAxisWidths,
                    width: _this.props.width,
                    minTime: _this.props.minTime,
                    maxTime: _this.props.maxTime,
                    transition: _this.props.transition,
                    enablePanZoom: _this.props.enablePanZoom,
                    minDuration: _this.props.minDuration,
                    showGrid: _this.props.showGrid,
                    timeFormat: _this.props.format,
                    trackerShowTime: firstRow,
                    trackerTime: _this.props.trackerPosition,
                    trackerTimeFormat: _this.props.format,
                    trackerStyle: trackerStyle,
                    onTimeRangeChanged: _this.handleTimeRangeChanged,
                    onTrackerChanged: _this.handleTrackerChanged
                };
                var _a = child.props.titleHeight, titleHeight_1 = _a === void 0 ? 28 : _a;
                if (underscore_1["default"].isUndefined(child.props.title)) {
                    titleHeight_1 = 0;
                }
                var transform_1 = "translate(".concat(-leftWidth - paddingLeft, ",").concat(yPosition +
                    titleHeight_1, ")");
                if (isVisible) {
                    chartRows.push(react_1["default"].createElement("g", { transform: transform_1, key: rowKey }, react_1["default"].cloneElement(chartRow, props)));
                    if (!underscore_1["default"].isUndefined(child.props.title)) {
                        var rowTitleKey = "chart-row-row-title-".concat(i);
                        var titleLabelStyle = (0, merge_1["default"])(true, defaultChartRowTitleLabelStyle, child.props.titleStyle ? child.props.titleStyle : {});
                        var titleBoxStyle = (0, merge_1["default"])(true, defaultChartRowTitleBoxStyle, child.props.titleBoxStyle ? child.props.titleBoxStyle : {});
                        var titleTransform = "translate(".concat(-leftWidth -
                            paddingLeft, ",").concat(yPosition, ")");
                        var title_1 = (react_1["default"].createElement("g", { transform: titleTransform, key: rowTitleKey },
                            react_1["default"].createElement(Label_1["default"], { align: "left", label: child.props.title, style: {
                                    label: titleLabelStyle,
                                    box: titleBoxStyle
                                }, width: props.width, height: titleHeight_1 })));
                        chartRowTitles.push(title_1);
                    }
                    var height = parseInt(child.props.height, 10) + titleHeight_1;
                    yPosition += height;
                    chartsHeight += height;
                }
            }
            i += 1;
        });
        // Hover tracker line
        var tracker;
        if (this.props.trackerPosition &&
            this.props.timeRange.contains(this.props.trackerPosition)) {
            tracker = (react_1["default"].createElement("g", { key: "tracker-group", style: { pointerEvents: "none" }, transform: "translate(".concat(leftWidth + paddingLeft, ",").concat(paddingTop + titleHeight, ")") },
                react_1["default"].createElement(TimeMarker_1["default"], { width: chartsWidth, height: chartsHeight, showInfoBox: !!this.props.trackerValues, time: this.props.trackerPosition, timeScale: timeScale, timeFormat: this.props.format, infoWidth: this.props.trackerHintWidth, infoHeight: this.props.trackerHintHeight, infoValues: this.props.trackerValues, infoStyle: trackerStyle })));
        }
        //
        // TimeAxis
        //
        var timeAxisStyle;
        if (this.props.hideTimeAxis) {
            timeAxisStyle = {
                axis: {
                    display: "none"
                }
            };
        }
        else {
            timeAxisStyle = (0, merge_1["default"])(true, defaultTimeAxisStyle.axis, this.props.timeAxisStyle.axis ? this.props.timeAxisStyle.axis : {});
        }
        var timeAxis = (react_1["default"].createElement("g", { transform: "translate(".concat(leftWidth + paddingLeft, ",").concat(paddingTop +
                titleHeight +
                chartsHeight, ")") },
            react_1["default"].createElement("line", { x1: -leftWidth, y1: 0.5, x2: chartsWidth + rightWidth, y2: 0.5, style: timeAxisStyle }),
            react_1["default"].createElement(TimeAxis_1["default"], { scale: timeScale, utc: this.props.utc, angled: this.props.timeAxisAngledLabels, style: this.props.timeAxisStyle, format: this.props.format, showGrid: this.props.showGrid, gridHeight: chartsHeight, tickCount: this.props.timeAxisTickCount })));
        //
        // Event handler
        //
        var rows = (react_1["default"].createElement("g", { transform: "translate(".concat(leftWidth + paddingLeft, ",").concat(paddingTop + titleHeight, ")") },
            react_1["default"].createElement(EventHandler_1["default"], { key: "event-handler", width: chartsWidth, height: chartsHeight + timeAxisHeight, scale: timeScale, enablePanZoom: this.props.enablePanZoom, enableDragZoom: this.props.enableDragZoom, minDuration: this.props.minDuration, minTime: this.props.minTime, maxTime: this.props.maxTime, onMouseOut: this.handleMouseOut, onMouseMove: this.handleMouseMove, onMouseClick: this.handleBackgroundClick, onContextMenu: this.handleContextMenu, onZoom: this.handleZoom }, chartRows)));
        var rowTitles = (react_1["default"].createElement("g", { transform: "translate(".concat(leftWidth + paddingLeft, ",").concat(paddingTop + titleHeight, ")") }, chartRowTitles));
        //
        // Final render of the ChartContainer is composed of a number of
        // chartRows, a timeAxis and the tracker indicator
        //
        var svgWidth = this.props.width;
        var svgHeight = chartsHeight + timeAxisHeight + paddingTop + paddingBottom + titleHeight;
        var svgStyle = (0, merge_1["default"])(true, { display: "block" }, this.props.style ? this.props.style : {});
        return this.props.showGridPosition === "over" ? (react_1["default"].createElement("svg", { width: svgWidth, height: svgHeight, style: svgStyle, ref: this.saveSvgRef },
            title,
            rows,
            tracker,
            timeAxis,
            rowTitles)) : (react_1["default"].createElement("svg", { width: svgWidth, height: svgHeight, style: { display: "block" }, ref: this.saveSvgRef },
            title,
            timeAxis,
            rows,
            rowTitles,
            tracker));
    };
    ChartContainer.defaultProps = {
        width: 800,
        padding: 0,
        enablePanZoom: false,
        enableDragZoom: false,
        utc: false,
        showGrid: false,
        showGridPosition: "over",
        timeAxisStyle: defaultTimeAxisStyle,
        titleStyle: defaultTitleStyle,
        trackerStyle: defaultTrackerStyle,
        hideTimeAxis: false
    };
    return ChartContainer;
}(react_1["default"].Component));
exports["default"] = ChartContainer;
