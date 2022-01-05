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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var underscore_1 = __importDefault(require("underscore"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var d3_shape_1 = require("d3-shape");
var pondjs_1 = require("pondjs");
var curve_1 = __importDefault(require("../js/curve"));
var styler_1 = require("../js/styler");
var util_1 = require("../js/util");
var defaultFillStyle = {
    fill: "steelblue",
    stroke: "none"
};
var defaultMutedStyle = {
    fill: "grey",
    stroke: "none"
};
var defaultStyle = [
    {
        normal: __assign(__assign({}, defaultFillStyle), { opacity: 0.2 }),
        highlighted: __assign(__assign({}, defaultFillStyle), { opacity: 0.3 }),
        selected: __assign(__assign({}, defaultFillStyle), { opacity: 0.3 }),
        muted: __assign(__assign({}, defaultMutedStyle), { opacity: 0.1 })
    },
    {
        normal: __assign(__assign({}, defaultFillStyle), { opacity: 0.5 }),
        highlighted: __assign(__assign({}, defaultFillStyle), { opacity: 0.6 }),
        selected: __assign(__assign({}, defaultFillStyle), { opacity: 0.6 }),
        muted: __assign(__assign({}, defaultMutedStyle), { opacity: 0.2 })
    },
    {
        normal: __assign(__assign({}, defaultFillStyle), { opacity: 0.9 }),
        highlighted: __assign(__assign({}, defaultFillStyle), { opacity: 1.0 }),
        selected: __assign(__assign({}, defaultFillStyle), { opacity: 1.0 }),
        muted: __assign(__assign({}, defaultMutedStyle), { opacity: 0.2 })
    }
];
var defaultAggregation = {
    size: "5m",
    reducers: {
        outer: [(0, pondjs_1.min)(), (0, pondjs_1.max)()],
        inner: [(0, pondjs_1.percentile)(25), (0, pondjs_1.percentile)(75)],
        center: (0, pondjs_1.median)()
    }
};
function getSeries(series, column) {
    return series.map(function (e) {
        var v = e.get(column);
        var d = {};
        switch (v.length) {
            case 1:
                d.center = v[0];
                break;
            case 2:
                d.innerMin = v[0];
                d.innerMax = v[1];
                break;
            case 3:
                d.innerMin = v[0];
                d.center = v[1];
                d.innerMax = v[2];
                break;
            case 4:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.innerMax = v[2];
                d.outerMax = v[3];
                break;
            case 5:
                d.outerMin = v[0];
                d.innerMin = v[1];
                d.center = v[2];
                d.innerMax = v[3];
                d.outerMax = v[4];
                break;
            default:
                console.error("Tried to make boxchart from invalid array");
        }
        var ee = (0, pondjs_1.indexedEvent)(e.index(), d);
        return ee;
    });
}
function getAggregatedSeries(series, column, aggregation) {
    if (aggregation === void 0) { aggregation = defaultAggregation; }
    var size = aggregation.size, reducers = aggregation.reducers;
    var inner = reducers.inner, outer = reducers.outer, center = reducers.center;
    function mapColumn(c, r) {
        var obj = {};
        obj[c] = r;
        return obj;
    }
    var fixedWindowAggregation = {};
    if (inner) {
        fixedWindowAggregation.innerMin = mapColumn(column, inner[0]);
        fixedWindowAggregation.innerMax = mapColumn(column, inner[1]);
    }
    if (outer) {
        fixedWindowAggregation.outerMin = mapColumn(column, outer[0]);
        fixedWindowAggregation.outerMax = mapColumn(column, outer[1]);
    }
    if (center) {
        fixedWindowAggregation.center = mapColumn(column, center);
    }
    return series.fixedWindowRollup({
        windowSize: size,
        aggregation: fixedWindowAggregation
    });
}
/**
 * Renders a band chart.
 *
 * The TimeSeries supplied to the band chart, as the `series` prop can be one of two types:
 *
 *  1) It can be a TimeSeries containing IndexedEvents or TimeRangeEvents.
 *     In this case a `column` prop should be supplied to specify the
 *     data column containing the dimensions of the boxes. This props
 *     should be an array of size 1 to 5 elements. e.g. [12, 18, 22, 28]. The
 *     numbers should be ordered, lowest to greatest.
 *
 *  2) A TimeSeries containing timestamp based Events. In this case the
 *     band chart will be aggregated for you. To control the aggregation you can supply
 *     an `aggregation` prop: a structure to specify the window size and
 *     reducers used to determine the boxes.
 *
 * In both cases you are generating up to two ranges and a center marker. In the
 * first case you are defining this based on the array of numbers. The outer numbers
 * specify the outerRange, the inner numbers specify the innerRange and the middle
 * number specifies the center marker. In the second case you are building those ranges
 * from denser data, specifying a window and aggregation functions to build each
 * of the ranges and center maker.
 *
 * In both cases you do not need to supply all the values. For example if you
 * provide an array of 2 elements, that would define a single range, with no outer range
 * and no center marker. The Band Chart is pretty flexible in that way, so you
 * can use it in many situations.
 *
 * Here is an example of using it to display temperature ranges. The series
 * passed to this code would be a TimeSeries containing IndexedEvents. For
 * each event, the column `temp` contains an array of values used for the
 * box plot ranges:
 *
 * ```
 *     <BandChart
 *       axis="temperatureAxis"
 *       style={style}
 *       column="temp"
 *       series={series} />
 * ```
 *
 * While here is an example with a dense TimeSeries of Events supplied,
 * along with an aggregation specification. This code would produce an
 * outer range from the 5th percentile to the 95th, along with an inner
 * range for the interquantile, and a center marker at the median:
 *
 * ```
 *    <BandChart
 *      axis="speedaxis"
 *      series={speed}
 *      column="speed"
 *      style={style}
 *      aggregation={{
 *        size: this.state.rollup,
 *        reducers: {
 *          outer: [percentile(5), percentile(95)],
 *          inner: [percentile(25), percentile(75)],
 *          center: median(),
 *        },
 *      }}
 *    />
 * ```
 */
var BandChart = /** @class */ (function (_super) {
    __extends(BandChart, _super);
    function BandChart(props) {
        var _this = _super.call(this, props) || this;
        if (props.series._collection._type === pondjs_1.timeEvent // eslint-disable-line
        ) {
            _this.series = getAggregatedSeries(props.series, props.column, props.aggregation);
        }
        else {
            _this.series = getSeries(props.series, props.column);
        }
        return _this;
    }
    BandChart.prototype.componentWillReceiveProps = function (nextProps) {
        var aggregation = nextProps.aggregation;
        var aggregationChanged = false;
        if (underscore_1["default"].isUndefined(aggregation) !== underscore_1["default"].isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }
        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }
        if (aggregationChanged) {
            this.series = getAggregatedSeries(nextProps.series, nextProps.column, nextProps.aggregation);
        }
    };
    BandChart.prototype.shouldComponentUpdate = function (nextProps) {
        var newSeries = nextProps.series;
        var oldSeries = this.props.series;
        var width = nextProps.width;
        var timeScale = nextProps.timeScale;
        var yScale = nextProps.yScale;
        var column = nextProps.column;
        var style = nextProps.style;
        var aggregation = nextProps.aggregation;
        var highlighted = nextProps.highlighted;
        var selected = nextProps.selected;
        var widthChanged = this.props.width !== width;
        var timeScaleChanged = (0, util_1.scaleAsString)(this.props.timeScale) !== (0, util_1.scaleAsString)(timeScale);
        var yAxisScaleChanged = this.props.yScale !== yScale;
        var columnChanged = this.props.column !== column;
        var styleChanged = JSON.stringify(this.props.style) !== JSON.stringify(style);
        var highlightedChanged = this.props.highlighted !== highlighted;
        var selectedChanged = this.props.selected !== selected;
        var aggregationChanged = false;
        if (underscore_1["default"].isUndefined(aggregation) !== underscore_1["default"].isUndefined(this.props.aggregation)) {
            aggregationChanged = true;
        }
        if (aggregation && this.props.aggregation) {
            if (aggregation.size !== this.props.aggregation.size) {
                aggregationChanged = true;
            }
        }
        var seriesChanged = false;
        if (oldSeries.size() !== newSeries.size()) {
            seriesChanged = true;
        }
        else {
            seriesChanged = !pondjs_1.TimeSeries.is(oldSeries, newSeries);
        }
        // If the series changes we need to rebuild this.series with
        // the incoming props
        if (seriesChanged) {
            if (nextProps.series._collection._type === pondjs_1.timeEvent // eslint-disable-line
            ) {
                this.series = getAggregatedSeries(nextProps.series, nextProps.column, nextProps.aggregation);
            }
            else {
                this.series = getSeries(nextProps.series, nextProps.column);
            }
        }
        return (seriesChanged ||
            timeScaleChanged ||
            widthChanged ||
            columnChanged ||
            styleChanged ||
            yAxisScaleChanged ||
            aggregationChanged ||
            highlightedChanged ||
            selectedChanged);
    };
    BandChart.prototype.handleHover = function (e, event) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(event);
        }
    };
    BandChart.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    BandChart.prototype.handleClick = function (e, event) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(event);
        }
        e.stopPropagation();
    };
    BandChart.prototype.providedStyleArray = function (column) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.boxChartStyle()[column];
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
    BandChart.prototype.style = function (column, event, level) {
        var style;
        if (!this.providedStyle) {
            this.providedStyle = this.providedStyleArray(this.props.column);
        }
        if (!underscore_1["default"].isNull(this.providedStyle) &&
            (!underscore_1["default"].isArray(this.providedStyle) || this.providedStyle.length !== 3)) {
            console.warn("Provided style to BandChart should be an array of 3 objects");
            return defaultStyle;
        }
        var isHighlighted = this.props.highlighted && pondjs_1.Event.is(this.props.highlighted, event);
        var isSelected = this.props.selected && pondjs_1.Event.is(this.props.selected, event);
        if (this.props.selected) {
            if (isSelected) {
                if (!this.selectedStyle || !this.selectedStyle[level]) {
                    if (!this.selectedStyle) {
                        this.selectedStyle = [];
                    }
                    this.selectedStyle[level] = (0, merge_1["default"])(true, defaultStyle[level].selected, this.providedStyle[level].selected ? this.providedStyle[level].selected : {});
                }
                style = this.selectedStyle[level];
            }
            else if (isHighlighted) {
                if (!this.highlightedStyle || !this.highlightedStyle[level]) {
                    if (!this.highlightedStyle) {
                        this.highlightedStyle = [];
                    }
                    this.highlightedStyle[level] = (0, merge_1["default"])(true, defaultStyle[level].highlighted, this.providedStyle[level].highlighted
                        ? this.providedStyle[level].highlighted
                        : {});
                }
                style = this.highlightedStyle[level];
            }
            else {
                if (!this.mutedStyle) {
                    this.mutedStyle = [];
                }
                if (!this.mutedStyle[level]) {
                    this.mutedStyle[level] = (0, merge_1["default"])(true, defaultStyle[level].muted, this.providedStyle[level].muted ? this.providedStyle[level].muted : {});
                }
                style = this.mutedStyle[level];
            }
        }
        else if (isHighlighted) {
            style = (0, merge_1["default"])(true, defaultStyle[level].highlighted, this.providedStyle[level].highlighted ? this.providedStyle[level].highlighted : {});
        }
        else {
            if (!this.normalStyle) {
                this.normalStyle = [];
            }
            if (!this.normalStyle[level]) {
                this.normalStyle[level] = (0, merge_1["default"])(true, defaultStyle[level].normal, this.providedStyle[level].normal ? this.providedStyle[level].normal : {});
            }
            style = this.normalStyle[level];
        }
        return style;
    };
    BandChart.prototype.renderAreas = function () {
        var _this = this;
        var column = this.props.column;
        var areas = [];
        var styles = [];
        styles[0] = this.style(column, event, 0); // eslint-disable-line
        styles[1] = this.style(column, event, 1); // eslint-disable-line
        styles[2] = this.style(column, event, 2); // eslint-disable-line
        // Use D3 to build an area generation function
        var areaGenerator = (0, d3_shape_1.area)()
            .curve(curve_1["default"][this.props.interpolation])
            .x(function (_a) {
            var _b = __read(_a, 1), x = _b[0];
            return x;
        })
            .y0(function (_a) {
            var _b = __read(_a, 2), x = _b[0], y0 = _b[1];
            return y0;
        })
            .y1(function (_a) {
            var _b = __read(_a, 2), x = _b[0], y1 = _b[1];
            return y1;
        });
        var columns = this.series.columns();
        // How many areas are we drawing
        var hasInner = true;
        var hasOuter = true;
        if (underscore_1["default"].has(columns, "innerMin") || underscore_1["default"].has(columns, "innerMax")) {
            hasInner = false;
        }
        if (underscore_1["default"].has(columns, "outerMin") || underscore_1["default"].has(columns, "outerMax")) {
            hasOuter = false;
        }
        // Build the outer area if we have one
        if (hasOuter) {
            var level = 0;
            if (!hasInner) {
                level += 1;
            }
            var outerData = [];
            for (var j = 0; j < this.series.size(); j += 1) {
                var e = this.series.at(j);
                var timestamp = new Date(e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2);
                outerData.push({
                    x0: this.props.timeScale(timestamp),
                    y0: this.props.yScale(e.get("outerMin")),
                    y1: this.props.yScale(e.get("outerMax"))
                });
            }
            var outerAreaPath = areaGenerator(outerData);
            areas.push(react_1["default"].createElement("g", { key: "area-outer" },
                react_1["default"].createElement("path", { d: outerAreaPath, style: styles[level], onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
        }
        if (hasInner) {
            var level = 0;
            if (!hasInner) {
                level += 1;
            }
            var innerData = [];
            for (var j = 0; j < this.series.size(); j += 1) {
                var e = this.series.at(j);
                var timestamp = new Date(e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2);
                innerData.push({
                    x0: this.props.timeScale(timestamp),
                    y0: this.props.yScale(e.get("innerMin")),
                    y1: this.props.yScale(e.get("innerMax"))
                });
            }
            var innerAreaPath = areaGenerator(innerData);
            areas.push(react_1["default"].createElement("g", { key: "area-inner" },
                react_1["default"].createElement("path", { d: innerAreaPath, style: styles[level], onClick: function (e) { return _this.handleClick(e, column); }, onMouseLeave: function () { return _this.handleHoverLeave(); }, onMouseMove: function (e) { return _this.handleHover(e, column); } })));
        }
        return react_1["default"].createElement("g", null, areas);
    };
    BandChart.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderAreas());
    };
    BandChart.defaultProps = {
        column: "value",
        innerSpacing: 1.0,
        outerSpacing: 2.0,
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
        infoHeight: 30
    };
    return BandChart;
}(react_1["default"].Component));
exports["default"] = BandChart;
