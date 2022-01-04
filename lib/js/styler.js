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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Styler = void 0;
var underscore_1 = __importDefault(require("underscore"));
var colorbrewer_1 = __importDefault(require("colorbrewer"));
/**
 * For our Style we want to represent two things:
 *
 *   1. The overall style of an AreaChart should be consistent across a site
 *   2. The specific style of a columnName (e.g. "pressure") should be consistent
 *
 * The overall style is implemented with methods specific to
 * each chart type or entity:
 *
 *   - lineChartStyle()
 *   - areaChartStyle()
 *   - legendStyle()
 *   - etc
 *
 * These will render out an object that can be passed into the
 * charts themselves and will control the visual appearance,
 * keyed by columnName. This abstracts away the SVG details of the
 * underlying DOM elements.
 *
 * For the specific style we define here three out of the box parameters
 * by which one column can be different from another when rendered:
 *   - color
 *   - width (of a line)
 *   - dashed or not
 *
 */
var Styler = /** @class */ (function () {
    /**
     * The columns define the style associated with a particular
     * quantity, such as "inTraffic" or "temperature". The columns
     * are an array, with each element being either a string, or
     * and object defining the style.
     *
     *  * Using a string makes the assumption that you want to use a
     * color scheme, so you need to define that if you don't want the
     * default. A color will be then assigned to each column based
     * on the scheme. The string is the column name.
     *
     *  * In the second case of providing an object, you define properties
     * of the style yourself. Each object should contain a "key" property
     * which is the column name and optionally the `width` and `dashed`
     * property. If you don't supply the color, then the color
     * will come from the scheme.
     *
     */
    function Styler(columns, scheme) {
        var _this = this;
        if (scheme === void 0) { scheme = "Paired"; }
        this.columnStyles = {};
        if (underscore_1["default"].isArray(columns)) {
            columns.forEach(function (column) {
                if (underscore_1["default"].isString(column)) {
                    _this.columnStyles[column] = { key: column };
                }
                else if (underscore_1["default"].isObject(column)) {
                    var key = column.key, style = __rest(column, ["key"]);
                    _this.columnStyles[key] = style;
                }
            });
        }
        this.columnNames = underscore_1["default"].map(columns, function (c) {
            var cc = underscore_1["default"].isString(c) ? c : c.key;
            return cc;
        });
        if (scheme && !underscore_1["default"].has(colorbrewer_1["default"], scheme)) {
            throw new Error("Unknown scheme '".concat(scheme, "' supplied to Style constructor"));
        }
        this.colorScheme = scheme;
    }
    Styler.prototype.numColumns = function () {
        return this.columnNames.length;
    };
    /**
     * Returns the color scheme with the appropiate number of colors.
     * If there are more columns than the largest set in the scheme then
     * just the largest scheme set will be returned.
     * If there are less columns than the smallest set in the scheme then
     * just the smallest scheme will be returned.
     * @param  {number} columnCount The number of columns to apply the scheme to
     * @return {array}              An array with the scheme colors in it.
     */
    Styler.prototype.colorLookup = function (columnCount) {
        var colorSchemeKeys = underscore_1["default"].keys(colorbrewer_1["default"][this.colorScheme]);
        var minSchemeSize = underscore_1["default"].min(colorSchemeKeys);
        var maxSchemeSize = underscore_1["default"].max(colorSchemeKeys);
        var colorLookupSize = columnCount > maxSchemeSize ? maxSchemeSize : columnCount;
        colorLookupSize = underscore_1["default"].max([colorLookupSize, minSchemeSize]);
        return this.colorScheme ? colorbrewer_1["default"][this.colorScheme][colorLookupSize] : [];
    };
    /**
     */
    Styler.prototype.legendStyle = function (column, type) {
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = underscore_1["default"].indexOf(this.columnNames, column);
        var columnName = this.columnNames[i];
        var _a = this.columnStyles[columnName], color = _a.color, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
        var c = color || colorLookup[i % colorLookup.length];
        var styleSymbol = {};
        if (type === "swatch" || type === "dot") {
            styleSymbol = {
                fill: c,
                opacity: 0.9,
                stroke: c,
                cursor: "pointer"
            };
        }
        else if (type === "line") {
            styleSymbol = {
                opacity: 0.9,
                stroke: c,
                strokeWidth: width,
                cursor: "pointer"
            };
            if (dashed) {
                styleSymbol.strokeDasharray = "4,2";
            }
        }
        var labelStyle = {
            fontSize: "normal",
            color: "#333",
            paddingRight: 10,
            cursor: "pointer"
        };
        var valueStyle = {
            fontSize: "smaller",
            color: "#999",
            cursor: "pointer"
        };
        var legendStyle = {
            symbol: {
                normal: __assign(__assign({}, styleSymbol), { opacity: 0.7 }),
                highlighted: __assign(__assign({}, styleSymbol), { opacity: 0.8 }),
                selected: __assign(__assign({}, styleSymbol), { opacity: 0.8 }),
                muted: __assign(__assign({}, styleSymbol), { opacity: 0.2 })
            },
            label: {
                normal: __assign(__assign({}, labelStyle), { opacity: 0.7 }),
                highlighted: __assign(__assign({}, labelStyle), { opacity: 0.8 }),
                selected: __assign(__assign({}, labelStyle), { opacity: 0.8 }),
                muted: __assign(__assign({}, labelStyle), { opacity: 0.5 })
            },
            value: {
                normal: __assign(__assign({}, valueStyle), { opacity: 0.7 }),
                highlighted: __assign(__assign({}, valueStyle), { opacity: 0.8 }),
                selected: __assign(__assign({}, valueStyle), { opacity: 0.8 }),
                muted: __assign(__assign({}, valueStyle), { opacity: 0.5 })
            }
        };
        return legendStyle;
    };
    Styler.prototype.areaChartStyle = function () {
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = 0;
        underscore_1["default"].forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
            var c = color || colorLookup[i % colorLookup.length];
            var styleLine = {
                stroke: c,
                fill: "none",
                strokeWidth: width
            };
            var styleSelectedLine = {
                stroke: selected || color,
                fill: "none",
                strokeWidth: width
            };
            if (dashed) {
                styleLine.strokeDasharray = "4,2";
            }
            var styleArea = {
                fill: c,
                stroke: "none"
            };
            var styleSelectedArea = {
                fill: selected || color,
                stroke: "none"
            };
            style[column] = {
                line: {
                    normal: __assign(__assign({}, styleLine), { opacity: 0.9 }),
                    highlighted: __assign(__assign({}, styleLine), { opacity: 1.0 }),
                    selected: __assign(__assign({}, styleSelectedLine), { opacity: 1.0 }),
                    muted: __assign(__assign({}, styleLine), { opacity: 0.4 })
                },
                area: {
                    normal: __assign(__assign({}, styleArea), { opacity: 0.7 }),
                    highlighted: __assign(__assign({}, styleArea), { opacity: 0.8 }),
                    selected: __assign(__assign({}, styleSelectedArea), { opacity: 0.8 }),
                    muted: __assign(__assign({}, styleArea), { opacity: 0.2 })
                }
            };
            i += 1;
        });
        return style;
    };
    Styler.prototype.lineChartStyle = function () {
        var _this = this;
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var style = {};
        underscore_1["default"].forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected, _b = _a.width, width = _b === void 0 ? 1 : _b, _c = _a.dashed, dashed = _c === void 0 ? false : _c;
            var i = underscore_1["default"].indexOf(_this.columnNames, column);
            var c = color || colorLookup[i % colorLookup.length];
            var styleLine = {
                stroke: c,
                strokeWidth: width,
                fill: "none"
            };
            var styleSelectedLine = {
                stroke: selected || c,
                strokeWidth: width,
                fill: "none"
            };
            if (dashed) {
                styleLine.strokeDasharray = "4,2";
            }
            style[column] = {
                normal: __assign(__assign({}, styleLine), { opacity: 0.8, strokeWidth: width }),
                highlighted: __assign(__assign({}, styleLine), { opacity: 1.0, strokeWidth: width }),
                selected: __assign(__assign({}, styleSelectedLine), { opacity: 1.0, strokeWidth: width }),
                muted: __assign(__assign({}, styleLine), { opacity: 0.2, strokeWidth: width })
            };
        });
        return style;
    };
    Styler.prototype.barChartStyle = function () {
        var _this = this;
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var style = {};
        underscore_1["default"].forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected;
            var i = underscore_1["default"].indexOf(_this.columnNames, column);
            var c = color || colorLookup[i % colorLookup.length];
            var fillStyle = {
                fill: c
            };
            var selectedStyle = {
                fill: selected || c
            };
            style[column] = {
                normal: __assign(__assign({}, fillStyle), { opacity: 0.8 }),
                highlighted: __assign(__assign({}, fillStyle), { opacity: 1.0 }),
                selected: __assign(__assign({}, selectedStyle), { opacity: 1.0 }),
                muted: __assign(__assign({}, fillStyle), { opacity: 0.2 })
            };
        });
        return style;
    };
    Styler.prototype.scatterChartStyle = function () {
        var _this = this;
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var style = {};
        underscore_1["default"].forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected;
            var i = underscore_1["default"].indexOf(_this.columnNames, column);
            var c = color || colorLookup[i % colorLookup.length];
            var fillStyle = {
                fill: c
            };
            var selectedStyle = {
                fill: selected || c
            };
            style[column] = {
                normal: __assign(__assign({}, fillStyle), { opacity: 0.8 }),
                highlighted: __assign(__assign({}, fillStyle), { opacity: 1.0 }),
                selected: __assign(__assign({}, selectedStyle), { opacity: 1.0 }),
                muted: __assign(__assign({}, fillStyle), { opacity: 0.2 })
            };
        });
        return style;
    };
    Styler.prototype.axisStyle = function (column) {
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = underscore_1["default"].indexOf(this.columnNames, column);
        var columnName = this.columnNames[i];
        var color = this.columnStyles[columnName].color;
        var c = color || colorLookup[i % colorLookup.length];
        return {
            label: {
                fill: c
            }
        };
    };
    Styler.prototype.boxChartStyle = function () {
        var style = {};
        var numColumns = this.numColumns();
        var colorLookup = this.colorLookup(numColumns);
        var i = 0;
        underscore_1["default"].forEach(this.columnStyles, function (_a, column) {
            var color = _a.color, selected = _a.selected;
            var c = color || colorLookup[i % colorLookup.length];
            var styleArea = {
                fill: c,
                stroke: "none"
            };
            var styleSelectedArea = {
                fill: selected || color,
                stroke: "none"
            };
            style[column] = [
                {
                    normal: __assign(__assign({}, styleArea), { opacity: 0.2 }),
                    highlighted: __assign(__assign({}, styleArea), { opacity: 0.3 }),
                    selected: __assign(__assign({}, styleSelectedArea), { opacity: 0.3 }),
                    muted: __assign(__assign({}, styleArea), { opacity: 0.1 })
                },
                {
                    normal: __assign(__assign({}, styleArea), { opacity: 0.5 }),
                    highlighted: __assign(__assign({}, styleArea), { opacity: 0.6 }),
                    selected: __assign(__assign({}, styleSelectedArea), { opacity: 0.6 }),
                    muted: __assign(__assign({}, styleArea), { opacity: 0.2 })
                },
                {
                    normal: __assign(__assign({}, styleArea), { opacity: 0.9 }),
                    highlighted: __assign(__assign({}, styleArea), { opacity: 1.0 }),
                    selected: __assign(__assign({}, styleSelectedArea), { opacity: 1.0 }),
                    muted: __assign(__assign({}, styleArea), { opacity: 0.2 })
                }
            ];
            i += 1;
        });
        return style;
    };
    return Styler;
}());
exports.Styler = Styler;
function styler(columns, scheme) {
    return new Styler(columns, scheme);
}
exports["default"] = styler;
