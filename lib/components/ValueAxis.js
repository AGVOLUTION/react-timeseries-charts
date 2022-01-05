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
/**
 * Renders a 'axis' that display a label for a current tracker value:
 * ```
 *      ----+----------------+
 *          |     56.2G      |
 *          |      bps       |
 *          |                |
 *      ----+----------------+
 * ```
 * This would be used when you have many rows of data and the user is required
 * to interact with the data to see actual values. You would use this at the
 * end of the row and supply it with the current value. See the cycling example
 * for how that would all work.
 */
var ValueAxis = function (_a) {
    var width = _a.width, height = _a.height, value = _a.value, detail = _a.detail;
    var labelStyle = {
        fill: "#666",
        fontSize: 20,
        textAnchor: "middle"
    };
    var detailStyle = {
        fontSize: 12,
        textAnchor: "middle",
        fill: "#9a9a9a"
    };
    return (react_1["default"].createElement("g", null,
        react_1["default"].createElement("rect", { key: "background", x: "0", y: "0", width: width, height: height, style: { fill: "none", stroke: "none" } }),
        react_1["default"].createElement("text", { key: "value", x: parseInt(width / 2, 10), y: height / 2, style: labelStyle }, value),
        react_1["default"].createElement("text", { key: "detail", x: parseInt(width / 2, 10), y: height / 2, dy: "1.2em", style: detailStyle }, detail)));
};
ValueAxis.defaultProps = {
    visible: true
};
exports["default"] = ValueAxis;
