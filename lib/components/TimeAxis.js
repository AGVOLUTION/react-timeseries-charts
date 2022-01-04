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
var merge_1 = __importDefault(require("merge"));
var moment_1 = __importDefault(require("moment"));
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom")); // eslint-disable-line
var prop_types_1 = __importDefault(require("prop-types"));
var d3_axis_1 = require("d3-axis");
var d3_selection_1 = require("d3-selection");
require("d3-selection-multi");
var d3_time_1 = require("d3-time");
var d3_time_format_1 = require("d3-time-format");
require("moment-duration-format");
function scaleAsString(scale) {
    return "".concat(scale.domain().toString(), "-").concat(scale.range().toString());
}
var defaultStyle = {
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
 * Renders a horizontal time axis. This is used internally by the ChartContainer
 * as a result of you specifying the timerange for the chart. Please see the API
 * docs for ChartContainer for more information.
 */
var TimeAxis = /** @class */ (function (_super) {
    __extends(TimeAxis, _super);
    function TimeAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeAxis.prototype.componentDidMount = function () {
        var _a = this.props, scale = _a.scale, format = _a.format, showGrid = _a.showGrid, gridHeight = _a.gridHeight;
        this.renderTimeAxis(scale, format, showGrid, gridHeight);
    };
    TimeAxis.prototype.componentWillReceiveProps = function (nextProps) {
        var scale = nextProps.scale, utc = nextProps.utc, format = nextProps.format, showGrid = nextProps.showGrid, gridHeight = nextProps.gridHeight;
        if (scaleAsString(this.props.scale) !== scaleAsString(scale) ||
            this.props.utc !== utc ||
            this.props.showGrid !== showGrid ||
            this.props.gridHeight !== gridHeight) {
            this.renderTimeAxis(scale, format, showGrid, gridHeight);
        }
    };
    // Force the component not to update because d3 will control the
    // DOM from this point down.
    TimeAxis.prototype.shouldComponentUpdate = function () {
        // eslint-disable-line
        return false;
    };
    TimeAxis.prototype.mergeStyles = function (style) {
        return {
            valueStyle: (0, merge_1["default"])(true, defaultStyle.values, this.props.style.values ? this.props.style.values : {}),
            tickStyle: (0, merge_1["default"])(true, defaultStyle.ticks, this.props.style.ticks ? this.props.style.ticks : {})
        };
    };
    TimeAxis.prototype.renderTimeAxis = function (scale, format, showGrid, gridHeight) {
        var axis;
        var tickSize = showGrid ? -gridHeight : 10;
        var utc = this.props.utc;
        var tickCount = this.props.tickCount;
        var style = this.mergeStyles(this.props.style);
        var tickStyle = style.tickStyle, valueStyle = style.valueStyle;
        if (tickCount > 0) {
            if (format === "day") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcDay : d3_time_1.timeDay, 1, tickCount])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%d"))
                    .tickSizeOuter(0);
            }
            else if (format === "month") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcMonth : d3_time_1.timeMonth, 1, tickCount])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%B"))
                    .tickSizeOuter(0);
            }
            else if (format === "year") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcYear : d3_time_1.timeYear, 1, tickCount])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%Y"))
                    .tickSizeOuter(0);
            }
            else if (format === "relative") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .ticks(tickCount)
                    .tickFormat(function (d) { return moment_1["default"].duration(+d).format(); })
                    .tickSizeOuter(0);
            }
            else if (underscore_1["default"].isString(format)) {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .ticks(tickCount)
                    .tickFormat((0, d3_time_format_1.timeFormat)(format))
                    .tickSizeOuter(0);
            }
            else if (underscore_1["default"].isFunction(format)) {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .ticks(tickCount)
                    .tickFormat(format)
                    .tickSizeOuter(0);
            }
            else {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .ticks(tickCount)
                    .tickSize(0);
            }
        }
        else {
            if (format === "day") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcDay : d3_time_1.timeDay, 1])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%d"))
                    .tickSizeOuter(0);
            }
            else if (format === "month") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcMonth : d3_time_1.timeMonth, 1])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%B"))
                    .tickSizeOuter(0);
            }
            else if (format === "year") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickArguments([utc ? d3_time_1.utcYear : d3_time_1.timeYear, 1])
                    .tickFormat((0, d3_time_format_1.timeFormat)("%Y"))
                    .tickSizeOuter(0);
            }
            else if (format === "relative") {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickFormat(function (d) { return moment_1["default"].duration(+d).format(); })
                    .tickSizeOuter(0);
            }
            else if (underscore_1["default"].isString(format)) {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickFormat((0, d3_time_format_1.timeFormat)(format))
                    .tickSizeOuter(0);
            }
            else if (underscore_1["default"].isFunction(format)) {
                axis = (0, d3_axis_1.axisBottom)(scale)
                    .tickFormat(format)
                    .tickSizeOuter(0);
            }
            else {
                axis = (0, d3_axis_1.axisBottom)(scale).tickSize(0);
            }
        }
        // Remove the old axis from under this DOM node
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .selectAll("*")
            .remove(); // eslint-disable-line
        //
        // Draw the new axis
        //
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this)) // eslint-disable-line
            .append("g")
            .attr("class", "x axis")
            .style("stroke", "none")
            .styles(valueStyle)
            .call(axis.tickSize(tickSize));
        if (this.props.angled) {
            (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this)) // eslint-disable-line
                .select("g")
                .selectAll(".tick")
                .select("text")
                .styles(valueStyle)
                .style("text-anchor", "end")
                .attr("dx", "-1.2em")
                .attr("dy", "0em")
                .attr("transform", function (d) {
                return "rotate(-65)";
            });
        }
        else {
            (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this)) // eslint-disable-line
                .select("g")
                .selectAll(".tick")
                .select("text")
                .styles(valueStyle);
        }
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("line")
            .styles(tickStyle);
        (0, d3_selection_1.select)(react_dom_1["default"].findDOMNode(this))
            .select("g")
            .select("path")
            .remove();
    };
    TimeAxis.prototype.render = function () {
        return react_1["default"].createElement("g", null);
    };
    TimeAxis.defaultProps = {
        showGrid: false,
        style: defaultStyle,
        angled: false
    };
    TimeAxis.propTypes = {
        scale: prop_types_1["default"].func.isRequired,
        showGrid: prop_types_1["default"].bool,
        angled: prop_types_1["default"].bool,
        gridHeight: prop_types_1["default"].number,
        format: prop_types_1["default"].oneOfType([prop_types_1["default"].string, prop_types_1["default"].func]),
        utc: prop_types_1["default"].bool,
        style: prop_types_1["default"].shape({
            label: prop_types_1["default"].object,
            values: prop_types_1["default"].object,
            axis: prop_types_1["default"].object,
            ticks: prop_types_1["default"].any // eslint-disable-line
        }),
        tickCount: prop_types_1["default"].number
    };
    return TimeAxis;
}(react_1["default"].Component));
exports["default"] = TimeAxis;
