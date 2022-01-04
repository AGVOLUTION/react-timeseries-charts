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
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var underscore_1 = __importDefault(require("underscore"));
var defaultStyle = {
    label: {
        fill: "#8B7E7E",
        fontWeight: 100,
        fontSize: 11,
        pointerEvents: "none"
    },
    line: {
        stroke: "#626262",
        strokeWidth: 1,
        strokeDasharray: "5,3",
        pointerEvents: "none"
    }
};
/**
 *
 * The BaseLine component displays a simple horizontal line at a value.
 *
 * For example the following code overlays Baselines for the mean and stdev
 * of a series on top of another chart.
 *
 * ```
 * <ChartContainer timeRange={series.timerange()} >
 *     <ChartRow height="150">
 *         <YAxis
 *           id="price"
 *           label="Price ($)"
 *           min={series.min()} max={series.max()}
 *           width="60" format="$,.2f"
 *         />
 *         <Charts>
 *             <LineChart axis="price" series={series} style={style} />
 *             <Baseline axis="price" value={series.avg()} label="Avg" position="right" />
 *             <Baseline axis="price" value={series.avg()-series.stdev()} />
 *             <Baseline axis="price" value={series.avg()+series.stdev()} />
 *         </Charts>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 */
var Baseline = /** @class */ (function (_super) {
    __extends(Baseline, _super);
    function Baseline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Baseline.prototype.render = function () {
        var _a = this.props, vposition = _a.vposition, yScale = _a.yScale, value = _a.value, position = _a.position, style = _a.style, width = _a.width;
        if (!yScale || underscore_1["default"].isUndefined(value)) {
            return null;
        }
        var y = yScale(value);
        var transform = "translate(0 ".concat(y, ")");
        var textAnchor;
        var textPositionX;
        var pts = [];
        var labelBelow = (vposition === "auto" && y < 15) || vposition === "below";
        var textPositionY = labelBelow ? 2 : -2;
        var alignmentBaseline = labelBelow ? "hanging" : "auto";
        if (position === "left") {
            textAnchor = "start";
            textPositionX = 5;
        }
        if (position === "right") {
            textAnchor = "end";
            textPositionX = width - 5;
        }
        pts.push("0 0");
        pts.push("".concat(width, " 0"));
        var points = pts.join(" ");
        //
        // Style
        //
        var baseLabelStyle = __assign(__assign({}, defaultStyle.label), { alignmentBaseline: alignmentBaseline });
        var labelStyle = (0, merge_1["default"])(true, baseLabelStyle, style.label ? style.label : {});
        var lineStyle = (0, merge_1["default"])(true, defaultStyle.line, style.line ? style.line : {});
        return (react_1["default"].createElement("g", { className: "baseline", transform: transform },
            react_1["default"].createElement("polyline", { points: points, style: lineStyle }),
            react_1["default"].createElement("text", { style: labelStyle, x: textPositionX, y: textPositionY, textAnchor: textAnchor }, this.props.label)));
    };
    Baseline.defaultProps = {
        visible: true,
        value: 0,
        label: "",
        position: "left",
        vposition: "auto",
        style: defaultStyle
    };
    Baseline.propTypes = {
        /**
         * Show or hide this chart
         */
        visible: prop_types_1["default"].bool,
        /**
         * Reference to the axis which provides the vertical scale for drawing. e.g.
         * specifying axis="trafficRate" would refer the y-scale to the YAxis of id="trafficRate".
         */
        axis: prop_types_1["default"].string.isRequired,
        /**
         * An object describing the style of the baseline of the form
         * { label, line }. "label" and "line" are both objects containing
         * the inline CSS for that part of the baseline.
         */
        style: prop_types_1["default"].shape({
            label: prop_types_1["default"].object,
            line: prop_types_1["default"].object // eslint-disable-line
        }),
        /**
         * The y-value to display the line at.
         */
        value: prop_types_1["default"].number,
        /**
         * The label to display with the axis.
         */
        label: prop_types_1["default"].string,
        /**
         * Whether to display the label on the "left" or "right".
         */
        position: prop_types_1["default"].oneOf(["left", "right"]),
        /**
         * Whether to display the label above or below the line. The default is "auto",
         * which will show it above the line unless the position is near to the top
         * of the chart.
         */
        vposition: prop_types_1["default"].oneOf(["above", "below", "auto"]),
        /**
         * [Internal] The yScale supplied by the associated YAxis
         */
        yScale: prop_types_1["default"].func,
        /**
         * [Internal] The width supplied by the surrounding ChartContainer
         */
        width: prop_types_1["default"].number
    };
    return Baseline;
}(react_1["default"].Component));
exports["default"] = Baseline;
