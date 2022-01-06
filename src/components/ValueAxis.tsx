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
const ValueAxis = ({ width, height, value, detail }: {
    /**
     * Show or hide this
     */
    visible?: boolean,

    /**
     * If values are numbers, use this format string
     */
    value?: string | number

    /**
     * Use this to show what units are being used. It will appear below
     * the value.
     */
    detail?: string,

    /**
     * The width of the axis
     */
    width?: number,

    /**
     * [Internal] The height of the axis
     */
    height?: number
}) => {
    const labelStyle: any = {
        fill: "#666",
        fontSize: 20,
        textAnchor: "middle"
    };
    const detailStyle: any = {
        fontSize: 12,
        textAnchor: "middle",
        fill: "#9a9a9a"
    };
    return (
        <g>
            <rect
                key="background"
                x="0"
                y="0"
                width={width}
                height={height}
                style={{ fill: "none", stroke: "none" }}
            />
            <text key="value" x={parseInt(width / 2 as any, 10)} y={height / 2} style={labelStyle}>
                {value}
            </text>
            <text
                key="detail"
                x={parseInt(width / 2 as any, 10)}
                y={height / 2}
                dy="1.2em"
                style={detailStyle}
            >
                {detail}
            </text>
        </g>
    );
};

ValueAxis.defaultProps = {
    visible: true
};

export default ValueAxis;
