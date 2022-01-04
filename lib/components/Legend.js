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
var underscore_1 = __importDefault(require("underscore"));
var merge_1 = __importDefault(require("merge"));
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var styler_1 = require("../js/styler");
var defaultStyle = {
    symbol: {
        normal: { stroke: "steelblue", fill: "none", strokeWidth: 1 },
        highlighted: { stroke: "#5a98cb", fill: "none", strokeWidth: 1 },
        selected: { stroke: "steelblue", fill: "none", strokeWidth: 2 },
        muted: { stroke: "steelblue", fill: "none", opacity: 0.4, strokeWidth: 1 }
    },
    label: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    },
    value: {
        normal: { fontSize: "normal", color: "#333" },
        highlighted: { fontSize: "normal", color: "#222" },
        selected: { fontSize: "normal", color: "#333" },
        muted: { fontSize: "normal", color: "#333", opacity: 0.4 }
    }
};
/**
 * Legends are simple to define.
 *
 * First specify the styles you want each item to have. This is either
 * the CSS that should be appied to rendered symbol. Or you can provide
 * a Styler object. See below for full styling details.
 *
 * ```
 * const style = Styler([
 *     {key: "aud", color: "steelblue", width: 1, dashed: true},
 *     {key: "euro", color: "#F68B24", width: 2}
 * ]);
 * ```
 *
 * Next build a list of categories you want in the legend.
 *
 * ```
 * const categories = [
 *     {key: "aust", label: "AUD", value: "1.52", disabled: true},
 *     {key: "usa", label: "USD", value: "1.43", disabled: false}
 * ];
 * ```
 * For each category to display you must provide a key, a label and
 * if it should be displayed disabled or not.
 *
 * Then render the legend, with type either "line", "swatch" or "dot":
 *
 * ```
 * <Legend type="line" style={style} categories={categories} />
 * ```
 *
 * Optionally you can also display a value below the label. This is
 * useful when hovering over another chart on the page, or to display
 * the current value of live data. You can see this defined in the
 * above categories.
 *
 * The legend can also be supplied with callback functions which will
 * tell you if the user has clicked or hovered over on one of the legend
 * items. You can use this to sync highlighting and selection to a
 * chart.
 *
 * ## Styling
 *
 * There are three methods of styling a legend:
 *  - using a Styler object
 *  - using an object containing inline styles
 *  - using a function which returns an inline style
 *
 * A Styler object can be supplied directly to the `style` prop
 * of the legend. This is the simplest approach, since you can
 * usually just use the same Styler as you use for your chart.
 *
 * Supplying an object to the `style` prop gives you more control
 * than the Styler, since you can provide the actual CSS properties
 * for each element of the legend. The format for the object is:
 *
 * ```
 * {
 *     columnName1: {
      symbol: {
        normal: {...styleSymbol},
        highlighted: {...styleSymbol},
        selected: {...styleSymbol},
        muted: {...styleSymbol}
      },
      label: {
        normal: {...labelStyle},
        highlighted: {...labelStyle},
        selected: {...labelStyle},
        muted: {...labelStyle}
      },
      value: {
        normal: {...valueStyle},
        highlighted: {...valueStyle},
        selected: {...valueStyle},
        muted: {...valueStyle}
      }
 *     },
 *     columnName2 : {
 *         ...
 *     },
 *     ...
 *  }
 *
 *  - symbolStyle is the CSS properties for the symbol, which
 * is either a swatch, dot or line. For a line, you'd want to
 * provide the SVG <line> properties, for a swatch you'd provide
 * the SVG <rect> properties and for a dot the <ellipse> properties.
 *  - labelStyle is the main label for the legend item. It is a
 *  SVG <text> element, so you can control the font properties.
 *  - valueStyle is the optional value. As with the labelStyle you
 *  this is an SVG <text> element.
 *
 * Finally, you can provide a function to the `style` prop. This
 * is similar to providing an object, except your function will
 * be called with the columnName and you should return the map
 * containing symbol, label and value styles.
 */
var LegendItem = /** @class */ (function (_super) {
    __extends(LegendItem, _super);
    function LegendItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LegendItem.prototype.handleClick = function (e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    };
    LegendItem.prototype.handleHover = function (e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    };
    LegendItem.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    LegendItem.prototype.renderLine = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        return (react_1["default"].createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            react_1["default"].createElement("line", { style: style, x1: 0, y1: parseInt(symbolWidth / 2, 10), x2: symbolWidth, y2: parseInt(symbolWidth / 2, 10), stroke: "black", strokeWidth: "2" })));
    };
    LegendItem.prototype.renderSwatch = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        return (react_1["default"].createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            react_1["default"].createElement("rect", { style: style, x: 2, y: 2, width: symbolWidth - 4, height: symbolHeight - 4, rx: 2, ry: 2 })));
    };
    LegendItem.prototype.renderDot = function (style) {
        var _a = this.props, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        var w = parseInt(symbolWidth / 2, 10);
        var h = parseInt(symbolHeight / 2, 10);
        var radius = w * 0.75;
        return (react_1["default"].createElement("svg", { style: { float: "left" }, width: symbolWidth, height: symbolHeight },
            react_1["default"].createElement("circle", { style: style, cx: w, cy: h, r: radius })));
    };
    LegendItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, symbolStyle = _a.symbolStyle, labelStyle = _a.labelStyle, valueStyle = _a.valueStyle, itemKey = _a.itemKey, symbolType = _a.symbolType;
        var symbol;
        switch (symbolType) {
            case "swatch":
                symbol = this.renderSwatch(symbolStyle);
                break;
            case "line":
                symbol = this.renderLine(symbolStyle);
                break;
            case "dot":
                symbol = this.renderDot(symbolStyle);
                break;
            default:
            //pass
        }
        // TODO: We shouldn't be adding interactions to a element like this.
        //       The alternative it to put it on a <a> or something?
        return (react_1["default"].createElement("div", { style: {
                display: "flex",
                flexDirection: "column"
            }, key: itemKey, onClick: function (e) { return _this.handleClick(e, itemKey); }, onMouseMove: function (e) { return _this.handleHover(e, itemKey); }, onMouseLeave: function () { return _this.handleHoverLeave(); } },
            react_1["default"].createElement("div", { style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                } },
                react_1["default"].createElement("div", { style: { width: "20px" } }, symbol),
                react_1["default"].createElement("div", { style: {
                        display: "flex",
                        flexDirection: "column"
                    } },
                    react_1["default"].createElement("div", { style: labelStyle }, this.props.label),
                    react_1["default"].createElement("div", { style: valueStyle }, this.props.value)))));
    };
    return LegendItem;
}(react_1["default"].Component));
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Legend.prototype.handleClick = function (e, key) {
        e.stopPropagation();
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(key);
        }
    };
    Legend.prototype.handleHover = function (e, key) {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(key);
        }
    };
    Legend.prototype.handleHoverLeave = function () {
        if (this.props.onHighlightChange) {
            this.props.onHighlightChange(null);
        }
    };
    /**
     * For each category item we get the users stle preference. This
     * can be supplied in a number of ways:
     *  * Typically you would get the legend stle from a Style instance
     *  * Alternatively, you can pass in a style object which has your
     *    category in it and the associated style
     *  * Finally, the provided style can also be a function
     */
    Legend.prototype.providedStyle = function (category, type) {
        var style = {};
        if (this.props.style) {
            if (this.props.style instanceof styler_1.Styler) {
                style = this.props.style.legendStyle(category.key, type);
            }
            else if (underscore_1["default"].isFunction(this.props.style)) {
                style = this.props.style(category.key);
            }
            else if (underscore_1["default"].isObject(this.props.style)) {
                style = this.props.style ? this.props.style[category.key] : defaultStyle;
            }
        }
        return style;
    };
    /**
     * For each category this function takes the current
     * selected and highlighted item, along with the disabled
     * state of the item, and returns the mode it should be
     * rendered in: normal, selected, highlighted, or muted
     */
    Legend.prototype.styleMode = function (category) {
        var isHighlighted = this.props.highlight && category.key === this.props.highlight;
        var isSelected = this.props.selection && category.key === this.props.selection;
        var isDisabled = category.disabled;
        var mode = "normal";
        if (this.props.selection) {
            if (isSelected) {
                mode = "selected";
            }
            else if (isHighlighted) {
                mode = "highlighted";
            }
            else {
                mode = "muted";
            }
        }
        else if (isHighlighted) {
            mode = "highlighted";
        }
        else if (isDisabled) {
            mode = "muted";
        }
        return mode;
    };
    Legend.prototype.symbolStyle = function (category, type) {
        var styleMap = this.providedStyle(category, type);
        var styleMode = this.styleMode(category);
        return (0, merge_1["default"])(true, defaultStyle[styleMode], styleMap.symbol ? styleMap.symbol[styleMode] : {});
    };
    Legend.prototype.labelStyle = function (category) {
        var styleMap = this.providedStyle(category);
        var styleMode = this.styleMode(category);
        return (0, merge_1["default"])(true, defaultStyle[styleMode], styleMap.label ? styleMap.label[styleMode] : {});
    };
    Legend.prototype.valueStyle = function (category) {
        var styleMap = this.providedStyle(category);
        var styleMode = this.styleMode(category);
        return (0, merge_1["default"])(true, defaultStyle[styleMode], styleMap.value ? styleMap.value[styleMode] : {});
    };
    Legend.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.type, type = _b === void 0 ? "swatch" : _b, symbolWidth = _a.symbolWidth, symbolHeight = _a.symbolHeight;
        var items = this.props.categories.map(function (category) {
            var key = category.key, label = category.label, value = category.value, _a = category.symbolType, symbolType = _a === void 0 ? type : _a;
            var symbolStyle = _this.symbolStyle(category, symbolType);
            var labelStyle = _this.labelStyle(category);
            var valueStyle = _this.valueStyle(category);
            return (react_1["default"].createElement(LegendItem, { key: key, type: type, itemKey: key, label: label, value: value, symbolType: symbolType, symbolWidth: symbolWidth, symbolHeight: symbolHeight, symbolStyle: symbolStyle, labelStyle: labelStyle, valueStyle: valueStyle, onSelectionChange: _this.props.onSelectionChange, onHighlightChange: _this.props.onHighlightChange }));
        });
        var align = this.props.align === "left" ? "flex-start" : "flex-end";
        if (this.props.stack) {
            return (react_1["default"].createElement("div", { style: {
                    display: "flex",
                    justifyContent: align,
                    flexDirection: "column",
                    marginBottom: this.props.marginBottom
                } }, items));
        }
        else {
            return (react_1["default"].createElement("div", { style: {
                    display: "flex",
                    justifyContent: align,
                    flexWrap: "wrap",
                    marginBottom: this.props.marginBottom
                } }, items));
        }
    };
    Legend.propTypes = {
        /**
         * The overall style of the legend items, either a color "swatch", a
         * colored "line", or a "dot".
         */
        type: prop_types_1["default"].oneOf(["swatch", "line", "dot"]),
        /**
         * Alignment of the legend within the available space. Either left or right.
         */
        align: prop_types_1["default"].oneOf(["left", "right"]),
        style: prop_types_1["default"].oneOfType([prop_types_1["default"].object, prop_types_1["default"].func, prop_types_1["default"].instanceOf(styler_1.Styler)]),
        /**
         * The categories array specifies details and style for each item in the legend. For each item:
         *  * "key" - (required) the name by which the legend will be known
         *  * "label" - (required) the displayed label
         *  * "style" - the swatch, dot, or line style. Typically you'd just
         *              specify {backgroundColor: "#1f77b4"}
         *  * "labelStyle" - the label style
         *  * "disabled" - a disabled state
         *
         * ```
         * const categories = [
         *    {key: "aust", label: "AUD", disabled: this.state.disabled["aust"],
         *      style: {backgroundColor: "#1f77b4"}},
         *    {key: "usa", label: "USD", disabled: this.state.disabled["usa"],
         *      style: {backgroundColor: "#aec7e8"}}
         * ];
         * ```
         */
        categories: prop_types_1["default"].arrayOf(prop_types_1["default"].shape({
            key: prop_types_1["default"].string.isRequired,
            label: prop_types_1["default"].string.isRequired,
            disabled: prop_types_1["default"].bool,
            style: prop_types_1["default"].object,
            labelStyle: prop_types_1["default"].object,
            value: prop_types_1["default"].any,
            symbolType: prop_types_1["default"].any
        })).isRequired,
        /**
         * The width of the legend symbol
         */
        symbolWidth: prop_types_1["default"].number,
        /**
         * The height of the legend symbol
         */
        symbolHeight: prop_types_1["default"].number,
        /**
         * Which item, specified by its key, should be rendered as highlighted
         */
        highlight: prop_types_1["default"].string,
        /**
         * Which item, specified by its key, should be rendered as selected
         */
        selection: prop_types_1["default"].string,
        /**
         * Callback will be called with a legend item is selected (i.e. it is clicked
         * on by the user)
         */
        onSelectionChange: prop_types_1["default"].func,
        /**
         * Callback will be called with a legend item is highlighted (i.e. it is hovered
         * over by the user)
         */
        onHighlightChange: prop_types_1["default"].func,
        /**
         * Defines whether to stack legend items vertically or not
         */
        stack: prop_types_1["default"].bool,
        /**
         * The margin at the bottom. Default value is 20px
         */
        marginBottom: prop_types_1["default"].string
    };
    Legend.defaultProps = {
        style: {},
        labelStyle: {},
        type: "swatch",
        align: "left",
        symbolWidth: 16,
        symbolHeight: 16,
        stack: false,
        marginBottom: "20px"
    };
    return Legend;
}(react_1["default"].Component));
exports["default"] = Legend;
