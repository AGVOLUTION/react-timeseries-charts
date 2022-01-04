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
var prop_types_1 = __importDefault(require("prop-types"));
var pondjs_1 = require("pondjs");
/**
 * Renders a band with extents defined by the supplied TimeRange. This
 * is a super simple component right now which just renders a simple
 * rectangle, in the style of the prop `style` across the timerange
 * specified. However, this is useful for highlighting a timerange to
 * correspond with another part of the your UI.
 *
 * See also the Brush component for a TimeRange marker that you can
 * resize interactively.
 */
var TimeRangeMarker = /** @class */ (function (_super) {
    __extends(TimeRangeMarker, _super);
    function TimeRangeMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeRangeMarker.prototype.renderBand = function () {
        var timerange = this.props.timerange;
        var timeScale = this.props.timeScale;
        // Viewport bounds
        var viewBeginTime = timeScale.invert(0);
        var viewEndTime = timeScale.invert(this.props.width);
        var viewport = new pondjs_1.TimeRange(viewBeginTime, viewEndTime);
        var bandStyle;
        if (this.props.style) {
            bandStyle = this.props.style;
        }
        else {
            bandStyle = { fill: "steelblue" };
        }
        if (!viewport.disjoint(timerange)) {
            var range = timerange.intersection(viewport);
            var begin = range.begin();
            var end = range.end();
            var beginPos = timeScale(begin);
            var endPos = timeScale(end);
            var width = endPos - beginPos;
            if (width < 1) {
                width = 1;
            }
            return (react_1["default"].createElement("rect", { x: beginPos, y: 0, width: width, height: this.props.height, style: bandStyle }));
        }
        return react_1["default"].createElement("g", null);
    };
    TimeRangeMarker.prototype.render = function () {
        return react_1["default"].createElement("g", null, this.renderBand());
    };
    TimeRangeMarker.propTypes = {
        /**
         * Show or hide this marker
         */
        visible: prop_types_1["default"].bool,
        /**
         * The timerange to mark. This is in the form of a
         * [Pond TimeRange](https://esnet-pondjs.appspot.com/#/timerange)
         */
        timerange: prop_types_1["default"].any.isRequired,
        /**
         * The style of the rect that will be rendered as a SVG <Rect>. This
         * object is the inline CSS for that rect.
         */
        style: prop_types_1["default"].object,
        /**
         * [Internal] The timeScale supplied by the surrounding ChartContainer
         */
        timeScale: prop_types_1["default"].any.isRequired,
        /**
         * [Internal] The width supplied by the surrounding ChartContainer
         */
        width: prop_types_1["default"].number.isRequired,
        /**
         * [Internal] The height supplied by the surrounding ChartContainer
         */
        height: prop_types_1["default"].number.isRequired
    };
    TimeRangeMarker.defaultProps = {
        visible: true,
        spacing: 1,
        offset: 0,
        style: { fill: "rgba(70, 130, 180, 0.25);" }
    };
    return TimeRangeMarker;
}(react_1["default"].Component));
exports["default"] = TimeRangeMarker;
