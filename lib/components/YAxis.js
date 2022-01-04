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
require("d3-transition");
var underscore_1 = __importDefault(require("underscore"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom")); // eslint-disable-line
var prop_types_1 = __importDefault(require("prop-types"));
var d3_array_1 = require("d3-array");
var d3_axis_1 = require("d3-axis");
var d3_ease_1 = require("d3-ease");
var d3_format_1 = require("d3-format");
var d3_selection_1 = require("d3-selection");
require("d3-selection-multi");
var util_1 = require("../js/util");
var MARGIN = 0;
var defaultStyle = {
    label: {
        stroke: "none",
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 12,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    values: {
        stroke: "none",
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        fill: "none",
        stroke: "#C0C0C0"
    }
};
/**
 * The `YAxis` widget displays a vertical axis to the left or right
 * of the charts. A `YAxis` always appears within a `ChartRow`, from
 * which it gets its height and positioning. You can have more than
 * one axis per row. You do control how wide it is.
 *
 * Here's a simple YAxis example:
 *
 * ```js
 * <YAxis
 *   id="price-axis"
 *   label="Price (USD)"
 *   min={0} max={100}
 *   width="60"
 *   type="linear"
 *   format="$,.2f"
 * />
 * ```
 *
 * Visually you can control the axis `label`, its size via the `width`
 * prop, its `format`, and `type` of scale (linear). You can quicky turn
 * it on and off with the `visible` prop.
 *
 * Each axis also defines a scale through a `min` and `max` prop. Chart
 * then refer to the axis by by citing the axis `id` in their `axis`
 * prop. Those charts will then use the axis scale for their y-scale.
 * This is what ties them together. Many charts can use the same axis,
 * or not.
 *
 * Here is an example of two line charts that each have their own axis:
 *
 * ```js
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis id="aud" label="AUD" min={0.5} max={1.5} width="60" format="$,.2f"/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis id="euro" label="Euro" min={0.5} max={1.5} width="80" format="$,.2f"/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 *  Note that there are two `<YAxis>` components defined here, one before
 *  the `<Charts>` block and one after. This defines that the first axis will
 *  appear to the left of the charts and the second will appear right of the charts.
 *  Each of the line charts uses its `axis` prop to identify the axis ("aud" or "euro")
 *  it will use for its vertical scale.
 */
var YAxis = /** @class */ (function (_super) {
    __extends(YAxis, _super);
    function YAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YAxis.prototype.componentDidMount = function () {
        this.renderAxis(this.props.align, this.props.scale, +this.props.width, +this.props.height, this.props.showGrid, +this.props.chartExtent, this.props.hideAxisLine, this.props.absolute, this.props.type, this.props.format, this.props.label, this.props.tickCount, this.props.min, this.props.max);
    };
    YAxis.prototype.componentWillReceiveProps = function (nextProps) {
        var scale = nextProps.scale, align = nextProps.align, width = nextProps.width, height = nextProps.height, chartExtent = nextProps.chartExtent, absolute = nextProps.absolute, format = nextProps.format, type = nextProps.type, showGrid = nextProps.showGrid, hideAxisLine = nextProps.hideAxisLine, label = nextProps.label, tickCount = nextProps.tickCount, min = nextProps.min, max = nextProps.max;
        if ((0, util_1.scaleAsString)(this.props.scale) !== (0, util_1.scaleAsString)(scale)) {
            this.updateAxis(align, scale, width, height, showGrid, chartExtent, hideAxisLine, absolute, type, format, label, tickCount, min, max);
        }
        else if (this.props.format !== format ||
            this.props.align !== align ||
            this.props.width !== width ||
            this.props.height !== height ||
            this.props.type !== type ||
            this.props.absolute !== absolute ||
            this.props.chartExtent !== chartExtent ||
            this.props.showGrid !== showGrid ||
            this.props.hideAxisLine !== hideAxisLine) {
            this.renderAxis(align, scale, +width, +height, showGrid, chartExtent, hideAxisLine, absolute, type, format, label, tickCount, min, max);
        }
        else if (this.props.label !== label) {
            this.updateLabel(label);
        }
    };
    YAxis.prototype.shouldComponentUpdate = function () {
        return false;
    };
    YAxis.prototype.yformat = function (fmt) {
        if (underscore_1["default"].isString(fmt)) {
            return (0, d3_format_1.format)(fmt);
        }
        else if (underscore_1["default"].isFunction(fmt)) {
            return fmt;
        }
        else {
            return (0, d3_format_1.format)("");
        }
    };
    YAxis.prototype.mergeStyles = function (style) {
        return {
            labelStyle: (0, merge_1["default"])(true, defaultStyle.label, this.props.style.label ? this.props.style.label : {}),
            valueStyle: (0, merge_1["default"])(true, defaultStyle.values, this.props.style.values ? this.props.style.values : {}),
            axisStyle: (0, merge_1["default"])(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {}),
            tickStyle: (0, merge_1["default"])(true, defaultStyle.ticks, this.props.style.ticks ? this.props.style.ticks : {})
        };
    };
    YAxis.prototype.postSelect = function (style, hideAxisLine, height) {
        var valueStyle = style.valueStyle, tickStyle = style.tickStyle, axisStyle = style.axisStyle;
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("text")
            .styles(valueStyle);
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select("g")
            .selectAll(".tick")
            .select("line")
            .styles(tickStyle);
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select("g")
            .selectAll(".domain")
            .remove();
        if (!hideAxisLine) {
            (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
                .select("g")
                .append("line")
                .styles(axisStyle)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", height);
        }
    };
    YAxis.prototype.generator = function (type, absolute, yformat, axis, scale, height, tickCount, min, max) {
        var axisGenerator;
        if (type === "linear" || type === "power") {
            if (tickCount > 0) {
                var stepSize = (max - min) / (tickCount - 1);
                axisGenerator = axis(scale)
                    .tickValues((0, d3_array_1.range)(min, max + max / 10000, stepSize))
                    .tickFormat(function (d) {
                    if (absolute) {
                        return yformat(Math.abs(d));
                    }
                    return yformat(d);
                })
                    .tickSizeOuter(0);
            }
            else {
                if (height <= 200) {
                    axisGenerator = axis(scale)
                        .ticks(4)
                        .tickFormat(function (d) {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        }
                        return yformat(d);
                    })
                        .tickSizeOuter(0);
                }
                else {
                    axisGenerator = axis(scale)
                        .tickFormat(function (d) {
                        if (absolute) {
                            return yformat(Math.abs(d));
                        }
                        return yformat(d);
                    })
                        .tickSizeOuter(0);
                }
            }
        }
        else if (type === "log") {
            if (min === 0) {
                throw Error("In a log scale, minimum value can't be 0");
            }
            axisGenerator = axis(scale)
                .ticks(10, ".2s")
                .tickSizeOuter(0);
        }
        return axisGenerator;
    };
    YAxis.prototype.renderAxis = function (align, scale, width, height, showGrid, chartExtent, hideAxisLine, absolute, type, fmt, label, tickCount, min, max) {
        var yformat = this.yformat(fmt);
        var axis = align === "left" ? d3_axis_1.axisLeft : d3_axis_1.axisRight;
        var style = this.mergeStyles(this.props.style);
        var labelStyle = style.labelStyle, valueStyle = style.valueStyle;
        var tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;
        var x = align === "left" ? width - MARGIN : 0;
        var labelOffset = align === "left" ? this.props.labelOffset - 50 : 40 + this.props.labelOffset;
        // Axis generator
        var axisGenerator = this.generator(type, absolute, yformat, axis, scale, height, tickCount, min, max);
        // Remove the old axis from under this DOM node
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .selectAll("*")
            .remove();
        // Add the new axis
        this.axis = (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .append("g")
            .attr("transform", "translate(".concat(x, ",0)"))
            .attr("class", "yaxis")
            .styles(valueStyle)
            .call(axisGenerator.tickSize(tickSize))
            .append("text")
            .text(label || this.props.label)
            .styles(labelStyle)
            .attr("transform", "rotate(-90)")
            .attr("class", "yaxislabel")
            .attr("y", labelOffset)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
        this.postSelect(style, hideAxisLine, height);
    };
    YAxis.prototype.updateAxis = function (align, scale, width, height, showGrid, chartExtent, hideAxisLine, absolute, type, fmt, label, tickCount, min, max) {
        var yformat = this.yformat(fmt);
        var axis = align === "left" ? d3_axis_1.axisLeft : d3_axis_1.axisRight;
        var style = this.mergeStyles(this.props.style);
        var tickSize = showGrid && this.props.isInnerAxis ? -chartExtent : 5;
        var axisGenerator = this.generator(type, absolute, yformat, axis, scale, height, tickCount, min, max);
        // Transition the existing axis
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select(".yaxis")
            .transition()
            .duration(this.props.transition)
            .ease(d3_ease_1.easeSinOut)
            .call(axisGenerator.tickSize(tickSize));
        this.updateLabel(label);
        this.postSelect(style, hideAxisLine, height);
    };
    YAxis.prototype.updateLabel = function (label) {
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select(".yaxislabel")
            .text(label);
    };
    YAxis.prototype.render = function () {
        return react_1["default"].createElement("g", null);
    };
    YAxis.defaultProps = {
        id: "yaxis",
        align: "left",
        min: 0,
        max: 1,
        showGrid: false,
        hideAxisLine: false,
        type: "linear",
        absolute: false,
        format: ".2s",
        labelOffset: 0,
        transition: 100,
        width: 80,
        style: defaultStyle
    };
    YAxis.propTypes = {
        isInnerAxis: prop_types_1["default"].any,
        chartExtent: prop_types_1["default"].any,
        /**
         * A name for the axis which can be used by a chart to reference the axis.
         * This is used by the ChartRow to match charts to this axis.
         */
        id: prop_types_1["default"].string.isRequired,
        /**
         * Show or hide this axis
         */
        visible: prop_types_1["default"].bool,
        /**
         * The label to be displayed alongside the axis.
         */
        label: prop_types_1["default"].string,
        /**
         * The scale type: linear, power, or log.
         */
        type: prop_types_1["default"].oneOf(["linear", "power", "log"]),
        /**
         * Minimum value, which combined with "max", define the scale of the axis.
         */
        min: prop_types_1["default"].number.isRequired,
        /**
         * Maximum value, which combined with "min", define the scale of the axis.
         */
        max: prop_types_1["default"].number.isRequired,
        /**
         * A d3 scale for the y-axis which you can use to transform your data in the y direction.
         * If omitted, the scale will be automatically computed based on the max and min props.
         */
        yScale: prop_types_1["default"].func,
        /**
         * Render all ticks on the axis as positive values.
         */
        absolute: prop_types_1["default"].bool,
        /**
         * Object specifying the CSS by which the axis can be styled. The object can contain:
         * "label", "values", "axis" and "ticks". Each of these is an inline CSS style applied
         * to the axis label, axis values, axis line and ticks respectively.
         *
         * Note that these are passed into d3's styling, so are regular CSS property names
         * and not React's camel case names (e.g. "stroke-dasharray" not strokeDasharray).
         */
        style: prop_types_1["default"].shape({
            label: prop_types_1["default"].object,
            axis: prop_types_1["default"].object,
            values: prop_types_1["default"].object,
            ticks: prop_types_1["default"].object // esline-disable-line
        }),
        /**
         * Render a horizontal grid by extending the axis ticks across the chart area. Note that this
         * can only be applied to an inner axis (one next to a chart). If you have multiple axes then
         * this can't be used on the outer axes. Also, if you have an axis on either side of the chart
         * then you can use this, but the UX not be ideal.
         */
        showGrid: prop_types_1["default"].bool,
        /**
         * Render the axis line. This is a nice option of you are also using `showGrid` as you may not
         * want both the vertical axis line and the extended ticks.
         */
        hideAxisLine: prop_types_1["default"].bool,
        /**
         * The transition time for moving from one scale to another
         */
        transition: prop_types_1["default"].number,
        /**
         * The width of the axis
         */
        width: prop_types_1["default"].oneOfType([prop_types_1["default"].string, prop_types_1["default"].number]),
        /**
         * Offset the axis label from its default position. This allows you to
         * fine tune the label location, which may be necessary depending on the
         * scale and how much room the tick labels take up. Maybe positive or
         * negative.
         */
        labelOffset: prop_types_1["default"].number,
        /**
         * If a string, the d3.format for the axis labels (e.g. `format=\"$,.2f\"`).
         * If a function, that function will be called with each tick value and
         * should generate a formatted string for that value to be used as the label
         * for that tick (e.g. `function (n) { return Number(n).toFixed(2) }`).
         */
        format: prop_types_1["default"].oneOfType([prop_types_1["default"].string, prop_types_1["default"].func]),
        /**
         * If the chart should be rendered to with the axis on the left or right.
         * If you are using the axis in a ChartRow, you do not need to provide this.
         */
        align: prop_types_1["default"].string,
        /**
         * [Internal] The scale supplied by the ChartRow
         */
        scale: prop_types_1["default"].func,
        /**
         * [Internal] The height supplied by the surrounding ChartContainer
         */
        height: prop_types_1["default"].number,
        /**
         * The number of ticks
         */
        tickCount: prop_types_1["default"].number
    };
    return YAxis;
}(react_1["default"].Component));
exports["default"] = YAxis;
