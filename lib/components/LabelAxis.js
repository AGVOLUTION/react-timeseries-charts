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
var react_1 = __importDefault(require("react"));
var d3_format_1 = require("d3-format");
var merge_1 = __importDefault(require("merge"));
var ValueList_1 = __importDefault(require("./ValueList"));
var defaultStyle = {
    axis: {
        fontSize: 11,
        textAnchor: "left",
        fill: "#bdbdbd"
    },
    label: {
        fontSize: 12,
        textAnchor: "middle",
        fill: "#838383"
    },
    values: {
        fill: "none",
        stroke: "none"
    }
};
/**
 * Renders an 'axis' that displays a label for a data channel along with a
 * max and average value:
 * ```
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 * ```
 *
 * This can be used for data channel style displays where the user will see many
 * rows of data stacked on top of each other and will need to interact with the
 * data to see actual values. You can combine this with the `ValueAxis` to help
 * do that. See the Cycling example for exactly how to arrange that.
 *
 */
var LabelAxis = /** @class */ (function (_super) {
    __extends(LabelAxis, _super);
    function LabelAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelAxis.prototype.mergeStyles = function (style) {
        return {
            axisStyle: (0, merge_1["default"])(true, defaultStyle.axis, this.props.style.axis ? this.props.style.axis : {}),
            labelStyle: (0, merge_1["default"])(true, defaultStyle.label, this.props.style.label ? this.props.style.label : {}),
            valueStyle: (0, merge_1["default"])(true, defaultStyle.values, this.props.style.values ? this.props.style.values : {})
        };
    };
    LabelAxis.prototype.renderAxis = function (axisStyle) {
        var valueWidth = this.props.valWidth;
        var rectWidth = this.props.width - valueWidth;
        if (this.props.hideScale) {
            return react_1["default"].createElement("g", null);
        }
        var valXPos = rectWidth + 3; // padding
        var fmt = this.props.format;
        var maxStr = (0, d3_format_1.format)(fmt)(this.props.max);
        var minStr = (0, d3_format_1.format)(fmt)(this.props.min);
        return (react_1["default"].createElement("g", null,
            react_1["default"].createElement("text", { x: valXPos, y: 0, dy: "1.2em", style: axisStyle }, maxStr),
            react_1["default"].createElement("text", { x: valXPos, y: this.props.height, style: axisStyle }, minStr)));
    };
    LabelAxis.prototype.render = function () {
        var valueWidth = this.props.valWidth;
        var rectWidth = this.props.width - valueWidth;
        var style = this.mergeStyles(this.props.style);
        var axisStyle = style.axisStyle, labelStyle = style.labelStyle, valueStyle = style.valueStyle;
        var valueList = null;
        var labelYPos;
        if (this.props.values) {
            labelYPos = Math.max(parseInt(this.props.height / 4, 10), 10);
            valueList = (react_1["default"].createElement(ValueList_1["default"], { style: valueStyle, values: this.props.values, width: rectWidth }));
        }
        else {
            labelYPos = parseInt(this.props.height / 2, 10);
        }
        return (react_1["default"].createElement("g", null,
            react_1["default"].createElement("rect", { x: "0", y: "0", width: rectWidth, height: this.props.height, style: { fill: "none", stroke: "none" } }),
            react_1["default"].createElement("text", { x: parseInt(rectWidth / 2, 10), y: labelYPos, style: labelStyle }, this.props.label),
            react_1["default"].createElement("g", { transform: "translate(0,".concat(labelYPos + 2, ")") }, valueList),
            this.renderAxis(axisStyle)));
    };
    LabelAxis.defaultProps = {
        hideScale: false,
        values: [],
        valWidth: 40,
        format: ".2f",
        style: defaultStyle
    };
    return LabelAxis;
}(react_1["default"].Component));
exports["default"] = LabelAxis;
