/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import _ from "underscore";
import merge from "merge";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom"; // eslint-disable-line
import PropTypes, { InferProps } from "prop-types";
import { axisBottom } from "d3-axis";
import { select } from "d3-selection";
import "d3-selection-multi";
import { timeDay, utcDay, timeMonth, utcMonth, timeYear, utcYear } from "d3-time";
import { timeFormat } from "d3-time-format";

import "moment-duration-format";

function scaleAsString(scale) {
    return `${scale.domain().toString()}-${scale.range().toString()}`;
}

const defaultStyle: any = {
    values: {
        stroke: "none",
        fill: "#8B7E7E", // Default value color
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
    },
    ticks: {
        fill: "none",
        stroke: "#C0C0C0"
    },
    axis: {
        fill: "none",
        stroke: "#C0C0C0"
    }
};

type TimeAxisProps = {
        scale: Function,
        showGrid?: boolean,
        angled?: boolean,
        gridHeight: number,
        format: string | Function,
        utc?: boolean,
        style: {
            label?: object, // eslint-disable-line
            values: object, // eslint-disable-line
            axis: object, // eslint-disable-line
            ticks: any // eslint-disable-line
        },
        tickCount: number
    }

/**
 * Renders a horizontal time axis. This is used internally by the ChartContainer
 * as a result of you specifying the timerange for the chart. Please see the API
 * docs for ChartContainer for more information.
 */
export default class TimeAxis extends React.Component<TimeAxisProps> {
    componentDidMount() {
        const { scale, format, showGrid, gridHeight } = this.props;
        this.renderTimeAxis(scale, format, showGrid, gridHeight);
    }

    componentWillReceiveProps(nextProps) {
        const { scale, utc, format, showGrid, gridHeight } = nextProps;
        if (
            scaleAsString(this.props.scale) !== scaleAsString(scale) ||
            this.props.utc !== utc ||
            this.props.showGrid !== showGrid ||
            this.props.gridHeight !== gridHeight
        ) {
            this.renderTimeAxis(scale, format, showGrid, gridHeight);
        }
    }

    // Force the component not to update because d3 will control the
    // DOM from this point down.
    shouldComponentUpdate() {
        // eslint-disable-line
        return false;
    }

    mergeStyles(style) {
        return {
            valueStyle: merge(
                true,
                defaultStyle.values,
                this.props.style.values ? this.props.style.values : {}
            ),
            tickStyle: merge(
                true,
                defaultStyle.ticks,
                this.props.style.ticks ? this.props.style.ticks : {}
            )
        };
    }

    renderTimeAxis(scale, format, showGrid, gridHeight) {
        let axis;

        const tickSize = showGrid ? -gridHeight : 10;
        const utc = this.props.utc;
        const tickCount = this.props.tickCount;
        const style = this.mergeStyles(this.props.style);
        const { tickStyle, valueStyle } = style;

        if (tickCount > 0) {
            if (format === "day") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcDay : timeDay, 1, tickCount])
                    .tickFormat(timeFormat("%d"))
                    .tickSizeOuter(0);
            } else if (format === "month") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcMonth : timeMonth, 1, tickCount])
                    .tickFormat(timeFormat("%B"))
                    .tickSizeOuter(0);
            } else if (format === "year") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcYear : timeYear, 1, tickCount])
                    .tickFormat(timeFormat("%Y"))
                    .tickSizeOuter(0);
            } else if (format === "relative") {
                axis = axisBottom(scale)
                    .ticks(tickCount)
                    .tickFormat(d => (moment.duration(+d) as any).format())
                    .tickSizeOuter(0);
            } else if (typeof format === "string") {
                axis = axisBottom(scale)
                    .ticks(tickCount)
                    .tickFormat(timeFormat(format))
                    .tickSizeOuter(0);
            } else if (typeof format === "function") {
                axis = axisBottom(scale)
                    .ticks(tickCount)
                    .tickFormat(format)
                    .tickSizeOuter(0);
            } else {
                axis = axisBottom(scale)
                    .ticks(tickCount)
                    .tickSize(0);
            }
        } else {
            if (format === "day") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcDay : timeDay, 1])
                    .tickFormat(timeFormat("%d"))
                    .tickSizeOuter(0);
            } else if (format === "month") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcMonth : timeMonth, 1])
                    .tickFormat(timeFormat("%B"))
                    .tickSizeOuter(0);
            } else if (format === "year") {
                axis = axisBottom(scale)
                    .tickArguments([utc ? utcYear : timeYear, 1])
                    .tickFormat(timeFormat("%Y"))
                    .tickSizeOuter(0);
            } else if (format === "relative") {
                axis = axisBottom(scale)
                    .tickFormat(d => (moment.duration(+d) as any).format())
                    .tickSizeOuter(0);
            } else if (typeof format === "string") {
                axis = axisBottom(scale)
                    .tickFormat(timeFormat(format))
                    .tickSizeOuter(0);
            } else if (typeof format === "function") {
                axis = axisBottom(scale)
                    .tickFormat(format)
                    .tickSizeOuter(0);
            } else {
                axis = axisBottom(scale).tickSize(0);
            }
        }

        // Remove the old axis from under this DOM node
        select(ReactDOM.findDOMNode(this))
            .selectAll("*")
            .remove(); // eslint-disable-line
        //
        // Draw the new axis
        //
        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .append("g")
            .attr("class", "x axis")
            .style("stroke", "none")
            ["styles"](valueStyle)
            .call(axis.tickSize(tickSize));

        if (this.props.angled) {
            select(ReactDOM.findDOMNode(this)) // eslint-disable-line
                .select("g")
                .selectAll(".tick")
                .select("text")
                ["styles"](valueStyle)
                .style("text-anchor", "end")
                .attr("dx", "-1.2em")
                .attr("dy", "0em")
                .attr("transform", function(d) {
                    return "rotate(-65)";
                });
        } else {
            select(ReactDOM.findDOMNode(this)) // eslint-disable-line
                .select("g")
                .selectAll(".tick")
                .select("text")
                ["styles"](valueStyle)
        }
        select(ReactDOM.findDOMNode(this)) // eslint-disable-line
            .select("g")
            .selectAll(".tick")
            .select("line")
            ["styles"](tickStyle)

        select(ReactDOM.findDOMNode(this))
            .select("g")
            .select("path")
            .remove();
    }

    render() {
        return <g />;
    }
    
    static defaultProps = {
        showGrid: false,
        style: defaultStyle,
        angled: false
    };

}
