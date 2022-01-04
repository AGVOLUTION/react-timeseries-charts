"use strict";
/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var merge_1 = __importDefault(require("merge"));
var defaultBoxStyle = {
    fill: "#FEFEFE",
    stroke: "#DDD",
    opacity: 0.8
};
var defaultTextStyle = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#b0b0b0",
    pointerEvents: "none"
};
var defaultTextStyleCentered = {
    fontSize: 11,
    textAnchor: "middle",
    fill: "#bdbdbd",
    pointerEvents: "none"
};
function mergeStyles(style, isCentered) {
    return {
        boxStyle: (0, merge_1["default"])(true, defaultBoxStyle, style.box ? style.box : {}),
        labelStyle: (0, merge_1["default"])(true, isCentered ? defaultTextStyleCentered : defaultTextStyle, style.label ? style.label : {})
    };
}
/**
 * Renders a simple label surrounded by a box within in svg
 *
 *      +----------------+
 *      | My label       |
 *      |                |
 *      +----------------+
 */
var Label = function (_a) {
    var label = _a.label, style = _a.style, align = _a.align, width = _a.width, height = _a.height;
    var _b = mergeStyles(style, align === "center"), boxStyle = _b.boxStyle, labelStyle = _b.labelStyle;
    var posx = align === "center" ? parseInt(width / 2, 10) : 10;
    var text = (react_1["default"].createElement("text", { x: posx, y: 5, dy: "1.2em", style: labelStyle }, label));
    var box = react_1["default"].createElement("rect", { x: 0, y: 0, style: boxStyle, width: width, height: height });
    return (react_1["default"].createElement("g", null,
        box,
        text));
};
Label.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none"
};
Label.propTypes = {
    /**
     * Where to position the label, either "left" or "center" within the box
     */
    align: prop_types_1["default"].oneOf(["center", "left"]),
    /**
     * The label to render
     */
    label: prop_types_1["default"].string.isRequired,
    /**
     * The style of the label. This is the inline CSS applied directly
     * to the label box
     */
    style: prop_types_1["default"].object,
    /**
     * The width of the rectangle to render into
     */
    width: prop_types_1["default"].number,
    /**
     * The height of the rectangle to render into
     */
    height: prop_types_1["default"].number
};
exports["default"] = Label;
