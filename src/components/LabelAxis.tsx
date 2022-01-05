/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes, { InferProps } from "prop-types";
import { format } from "d3-format";
import merge from "merge";

import ValueList from "./ValueList";

const defaultStyle: any = {
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

type LabelAxisProps = {
        /**
         * The label to show as the axis.
         */
        label: string,

        /**
         * Show or hide the max/min values that appear alongside the label
         */
        hideScale?: boolean,

        /**
         * Supply a list of label value pairs to render within the LabelAxis.
         * This expects an array of objects. Each object is of the form:
         *     {label: "Speed", value: "26.2 mph"}.
         */
        values: {
                label: string, // eslint-disable-line
                value: number | string
            }[],

        /**
         * Width to provide the values
         */
        valWidth: number,

        /**
         * Max value of the axis scale
         */
        max: number,

        /**
         * Min value of the axis scale
         */
        min: number,

        /**
         * If values are numbers, use this format string
         */
        format: string,

        /**
         * The width of the axis
         */
        width: number,

        /**
         * The height of the axis
         */
        height: number,

        /**
         * Object specifying the CSS by which the label axis can be styled. The object can contain:
         * "label", "values" and "axis". Each of these is an inline CSS style applied
         * to the axis label, axis values and axis line respectively.
         *
         */
        style: {
            axis: object, // eslint-disable-line
            label: object, // eslint-disable-line
            values: object // esline-disable-line
        }
    }

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
export default class LabelAxis extends React.Component<LabelAxisProps> {
    mergeStyles(style) {
        return {
            axisStyle: merge(
                true,
                defaultStyle.axis,
                this.props.style.axis ? this.props.style.axis : {}
            ),
            labelStyle: merge(
                true,
                defaultStyle.label,
                this.props.style.label ? this.props.style.label : {}
            ),
            valueStyle: merge(
                true,
                defaultStyle.values,
                this.props.style.values ? this.props.style.values : {}
            )
        };
    }

    renderAxis(axisStyle) {
        const valueWidth = this.props.valWidth;
        const rectWidth = this.props.width - valueWidth;

        if (this.props.hideScale) {
            return <g />;
        }
        const valXPos = rectWidth + 3; // padding
        const fmt = this.props.format;
        const maxStr = format(fmt)(this.props.max);
        const minStr = format(fmt)(this.props.min);

        return (
            <g>
                <text x={valXPos} y={0} dy="1.2em" style={axisStyle}>
                    {maxStr}
                </text>
                <text x={valXPos} y={this.props.height} style={axisStyle}>
                    {minStr}
                </text>
            </g>
        );
    }

    render() {
        const valueWidth = this.props.valWidth;
        const rectWidth = this.props.width - valueWidth;

        const style = this.mergeStyles(this.props.style);
        const { axisStyle, labelStyle, valueStyle } = style;

        let valueList = null;
        let labelYPos;
        if (this.props.values) {
            labelYPos = Math.max(parseInt(this.props.height / 4 as any, 10), 10);
            valueList = (
                <ValueList style={valueStyle} values={this.props.values} width={rectWidth} />
            );
        } else {
            labelYPos = parseInt(this.props.height / 2 as any, 10);
        }

        return (
            <g>
                <rect
                    x="0"
                    y="0"
                    width={rectWidth}
                    height={this.props.height}
                    style={{ fill: "none", stroke: "none" }}
                />
                <text x={parseInt(rectWidth / 2 as any, 10)} y={labelYPos} style={labelStyle}>
                    {this.props.label}
                </text>
                <g transform={`translate(0,${labelYPos + 2})`}>{valueList}</g>

                {this.renderAxis(axisStyle)}
            </g>
        );
    }
    
    static defaultProps = {
        hideScale: false,
        values: [],
        valWidth: 40,
        format: ".2f",
        style: defaultStyle
    }
}
