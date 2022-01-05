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
var moment_1 = __importDefault(require("moment"));
var react_1 = __importDefault(require("react"));
var d3_time_format_1 = require("d3-time-format");
require("moment-duration-format");
var ValueList_1 = __importDefault(require("./ValueList"));
var Label_1 = __importDefault(require("./Label"));
var TimeMarker = /** @class */ (function (_super) {
    __extends(TimeMarker, _super);
    function TimeMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeMarker.prototype.renderLine = function (posx) {
        return (react_1["default"].createElement("line", { style: this.props.infoStyle.line, x1: posx, y1: 0, x2: posx, y2: this.props.height }));
    };
    TimeMarker.prototype.renderTimeMarker = function (d) {
        var textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };
        var dateStr = "".concat(d);
        if (this.props.timeFormat === "day") {
            var formatter = (0, d3_time_format_1.timeFormat)("%d");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "month") {
            var formatter = (0, d3_time_format_1.timeFormat)("%B");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "year") {
            var formatter = (0, d3_time_format_1.timeFormat)("%Y");
            dateStr = formatter(d);
        }
        else if (this.props.timeFormat === "relative") {
            dateStr = moment_1["default"].duration(+d).format();
        }
        else if (typeof this.props.timeFormat === "string") {
            var formatter = (0, d3_time_format_1.timeFormat)(this.props.timeFormat);
            dateStr = formatter(d);
        }
        else if (typeof this.props.timeFormat === "function") {
            dateStr = this.props.timeFormat(d);
        }
        return (react_1["default"].createElement("text", { x: 0, y: 0, dy: "1.2em", style: textStyle }, dateStr));
    };
    TimeMarker.prototype.renderInfoBox = function (posx) {
        var w = this.props.infoWidth;
        var infoBoxProps = {
            align: "left",
            style: {
                box: this.props.infoStyle.box,
                label: this.props.infoStyle.label
            },
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };
        if (this.props.infoValues) {
            var infoBox = typeof this.props.infoValues === "string" ? (react_1["default"].createElement(Label_1["default"], __assign({}, infoBoxProps, { label: this.props.infoValues }))) : (react_1["default"].createElement(ValueList_1["default"], __assign({}, infoBoxProps, { values: this.props.infoValues })));
            if (posx + 10 + w < this.props.width - 50) {
                return (react_1["default"].createElement("g", { transform: "translate(".concat(posx + 10, ",").concat(5, ")") },
                    this.props.showTime ? this.renderTimeMarker(this.props.time) : null,
                    react_1["default"].createElement("g", { transform: "translate(0,".concat(this.props.showTime ? 20 : 0, ")") }, infoBox)));
            }
            return (react_1["default"].createElement("g", { transform: "translate(".concat(posx - w - 10, ",").concat(5, ")") },
                this.props.showTime ? this.renderTimeMarker(this.props.time) : null,
                react_1["default"].createElement("g", { transform: "translate(0,".concat(this.props.showTime ? 20 : 0, ")") }, infoBox)));
        }
        return react_1["default"].createElement("g", null);
    };
    TimeMarker.prototype.render = function () {
        var posx = this.props.timeScale(this.props.time);
        if (posx) {
            return (react_1["default"].createElement("g", null,
                this.props.showLine ? this.renderLine(posx) : null,
                this.props.showInfoBox ? this.renderInfoBox(posx) : null));
        }
        return null;
    };
    TimeMarker.defaultProps = {
        visible: true,
        showInfoBox: true,
        showLine: true,
        showTime: true,
        infoStyle: {
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
        },
        infoWidth: 90,
        infoHeight: 25
    };
    return TimeMarker;
}(react_1["default"].Component));
exports["default"] = TimeMarker;
