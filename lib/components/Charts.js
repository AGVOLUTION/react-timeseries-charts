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
/**
 *
 * The `<Charts>` element is a grouping for charts within a row.
 * It takes no props. Each chart within the group will be overlaid
 * on top of each other.
 *
 * Here is an example of two line charts within a `<Charts>` group:
 *
 * ```xml
 * <ChartContainer timeRange={audSeries.timerange()}>
 *     <ChartRow height="200">
 *         <YAxis/>
 *         <Charts>
 *             <LineChart axis="aud" series={audSeries} style={audStyle}/>
 *             <LineChart axis="euro" series={euroSeries} style={euroStyle}/>
 *         </Charts>
 *         <YAxis/>
 *     </ChartRow>
 * </ChartContainer>
 * ```
 *
 * ## Making your own chart
 *
 * Anything within this grouping is considered a chart, meaning it will have
 * certain props injected into it. As a result you can easily implement your own chart
 * by simply expecting to have these props available and rendering as such.
 *
 * For your own chart, the render() method should return a SVG group `<g>` at the
 * top level, and then your chart rendering within that.
 *
 * In addition to any props you add to your chart, the following props are passed into
 * each chart automatically:
 *
 * #### timeScale
 *
 * A d3 scale for the time axis which you can use to transform your data in the x direction
 *
 * #### yScale
 *
 * A d3 scale for the y-axis which you can use to transform your data in the y direction
 *
 * #### width
 *
 * A the width your chart will render into
 */
var Charts = /** @class */ (function (_super) {
    __extends(Charts, _super);
    function Charts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Charts.prototype.render = function () {
        return "".concat(this.constructor.name, " elements are for configuration only\nand should not be rendered");
    };
    return Charts;
}(react_1["default"].Component));
exports["default"] = Charts;
