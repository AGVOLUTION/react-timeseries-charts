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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
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
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 */
var ValueList = function (props) {
    var align = props.align, style = props.style, width = props.width, height = props.height;
    var _a = mergeStyles(style, align === "center"), boxStyle = _a.boxStyle, labelStyle = _a.labelStyle;
    if (!props.values.length) {
        return react_1["default"].createElement("g", null);
    }
    var values = props.values.map(function (item, i) {
        if (align === "left") {
            return (react_1["default"].createElement("g", { key: i },
                react_1["default"].createElement("text", { x: 10, y: 5, dy: "".concat((i + 1) * 1.2, "em"), style: labelStyle },
                    react_1["default"].createElement("tspan", { style: { fontWeight: 700 } }, "".concat(item.label, ": ")),
                    react_1["default"].createElement("tspan", null, "".concat(item.value)))));
        }
        var posx = parseInt(props.width / 2, 10);
        return (react_1["default"].createElement("g", { key: i },
            react_1["default"].createElement("text", { x: posx, y: 5, dy: "".concat((i + 1) * 1.2, "em"), style: labelStyle },
                react_1["default"].createElement("tspan", { style: { fontWeight: 700 } }, "".concat(item.label, ": ")),
                react_1["default"].createElement("tspan", null, "".concat(item.value)))));
    });
    var box = react_1["default"].createElement("rect", { style: boxStyle, x: 0, y: 0, width: width, height: height });
    return (react_1["default"].createElement("g", null,
        box,
        values));
};
ValueList.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none",
    style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8 }
};
exports["default"] = ValueList;
