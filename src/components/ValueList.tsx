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
import PropTypes from "prop-types";
import merge from "merge";

const defaultBoxStyle: any = {
    fill: "#FEFEFE",
    stroke: "#DDD",
    opacity: 0.8
};

const defaultTextStyle: any = {
    fontSize: 11,
    textAnchor: "left",
    fill: "#b0b0b0",
    pointerEvents: "none"
};

const defaultTextStyleCentered: any = {
    fontSize: 11,
    textAnchor: "middle",
    fill: "#bdbdbd",
    pointerEvents: "none"
};

function mergeStyles(style, isCentered) {
    return {
        boxStyle: merge(true, defaultBoxStyle, style.box ? style.box : {}),
        labelStyle: merge(
            true,
            isCentered ? defaultTextStyleCentered : defaultTextStyle,
            style.label ? style.label : {}
        )
    };
}

type ValueListProps = {
    /**
     * Where to position the label, either "left" or "center" within the box
     */
    align: "center" | "left",

    /**
     * An array of label value pairs to render
     */
    values: {
            label: string, // eslint-disable-line
            value: number | string
        }[],

    /**
     * CSS object to be applied to the ValueList surrounding box and the label (text).
     */
    style: object, // eslint-disable-line

    /**
     * The width of the rectangle to render into
     */
    width: number,

    /**
     * The height of the rectangle to render into
     */
    height: number
}

/**
 * Renders a list of values in svg
 *
 *      +----------------+
 *      | Max 100 Gbps   |
 *      | Avg 26 Gbps    |
 *      +----------------+
 */
const ValueList = (props: ValueListProps) => {
    const { align, style, width, height } = props;
    const { boxStyle, labelStyle } = mergeStyles(style, align === "center");

    if (!props.values.length) {
        return <g />;
    }

    const values = props.values.map((item, i) => {
        if (align === "left") {
            return (
                <g key={i}>
                    <text x={10} y={5} dy={`${(i + 1) * 1.2}em`} style={labelStyle}>
                        <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                        <tspan>{`${item.value}`}</tspan>
                    </text>
                </g>
            );
        }

        const posx = parseInt(props.width / 2 as any, 10);
        return (
            <g key={i}>
                <text x={posx} y={5} dy={`${(i + 1) * 1.2}em`} style={labelStyle}>
                    <tspan style={{ fontWeight: 700 }}>{`${item.label}: `}</tspan>
                    <tspan>{`${item.value}`}</tspan>
                </text>
            </g>
        );
    });

    const box = <rect style={boxStyle} x={0} y={0} width={width} height={height} />;

    return (
        <g>
            {box}
            {values}
        </g>
    );
};

ValueList.defaultProps = {
    align: "center",
    width: 100,
    height: 100,
    pointerEvents: "none",
    style: { fill: "#FEFEFE", stroke: "#DDD", opacity: 0.8 }
};

export default ValueList;
