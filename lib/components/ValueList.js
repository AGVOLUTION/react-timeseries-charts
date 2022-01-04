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
ValueList.propTypes = {
    /**
     * Where to position the label, either "left" or "center" within the box
     */
    align: prop_types_1["default"].oneOf(["center", "left"]),
    /**
     * An array of label value pairs to render
     */
    values: prop_types_1["default"].arrayOf(prop_types_1["default"].shape({
        label: prop_types_1["default"].string,
        value: prop_types_1["default"].oneOfType([
            // eslint-disable-line
            prop_types_1["default"].number,
            prop_types_1["default"].string
        ])
    })).isRequired,
    /**
     * CSS object to be applied to the ValueList surrounding box and the label (text).
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
exports["default"] = ValueList;
