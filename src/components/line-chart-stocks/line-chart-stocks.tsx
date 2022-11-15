import React, { FC, useRef, useEffect } from "react";
import { select, pointer } from "d3-selection";
import { scaleLinear, scaleUtc }  from "d3-scale";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; 
import { bisector } from "d3-array";

import data from "./stocks.json";
import { LinePoint } from "./types";
import "./line-chart-stocks.scss";
import { timeFormat, timeParse } from "d3-time-format";
import { Dimensions } from "./types";
import { line } from "d3-shape";

/* 
    https://observablehq.com/@d3/line-with-tooltip?collection=@d3/charts 
*/

export const StocksLineChart : FC = () => {
    const linechartSvgRef = useRef(null);
    const linechartTooltipRef = useRef(null);

    useEffect(() =>{
        const dimensions : Dimensions = {
            width: 1100,
            height: 800,
            margin: 100,
            areaHeight: 0,
            areaWidth: 0
        }

        dimensions.areaHeight = dimensions.height - dimensions.margin * 2;
        dimensions.areaWidth = dimensions.width - dimensions.margin * 2;  

        select(linechartSvgRef.current) 
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

        if(data) draw(data.map(d => d as LinePoint), dimensions);
    }, [])

    const draw = (linepoints: LinePoint[], dimensions: Dimensions) : void => {
        
        const svg = select(linechartSvgRef.current); 
        const tooltip = select(linechartTooltipRef.current);

        //X & Y axis Accessors
        const xAccessor = (d: LinePoint) => timeParse("%Y-%m-%d")(d.date) as Date ;
        const yAccessor = (d: LinePoint) => d.price;

        const ctr = svg.append('g')
                       .attr('transform', `translate(${dimensions.margin}, ${dimensions.margin})`);

        const dot = ctr.append('circle')
            .attr('r', 5)
            .attr('fill', "red")
            .attr('stroke', "#000")
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .style('pointer-events', 'none')

        //scales
        const xScale = scaleUtc().domain(extent(linepoints, xAccessor) as [Date, Date]).range([0, dimensions.areaWidth]);
        const yScale = scaleLinear().domain(extent(linepoints, yAccessor) as number[]).range([dimensions.areaHeight, 0]).nice();
 
        const lineGenerator = line()
                                .x((d) => xScale(xAccessor((d as unknown) as LinePoint)))
                                .y((d) => yScale(yAccessor((d as unknown) as LinePoint)));
        

        ctr.append("path")
           .datum(linepoints)
           //@ts-ignore
           .attr("d", lineGenerator)
           .attr("fill", "none")
           .attr("stroke", "#fff")
           .attr("stroke-width", 2)  

        //axis
        const yAxis = axisLeft(yScale).tickFormat(d => `$${d}`);
        const xAxis = axisBottom(xScale);

        const yAxisGroup = ctr.append("g").call(yAxis).classed("line-chart-axis", true);
        yAxisGroup.append('text')
        .attr('x', -dimensions.areaHeight / 2)
        .attr('y', -dimensions.margin + 25)
        .attr('fill', "#fff")
        .text('Stock Price')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle'); 
        
        const xAxisGroup = ctr.append("g")
           .style("transform", `translateY(${dimensions.areaHeight}px)`)
           .call(xAxis)
           .classed('line-chart-axis', true);

        xAxisGroup.append('text')
        .attr('x', dimensions.areaWidth / 2)
        .attr('y', dimensions.margin - 50)
        .attr('fill', "#fff")
        .text('Stock Date')

        //tooltip
        ctr.append("rect")
           .attr("width", dimensions.areaWidth)
           .attr("height", dimensions.areaHeight)
           .style("opacity", 0)
           .on("touchmouse mousemove", function(event){
                const pos = pointer(event, this);
                const date = xScale.invert(pos[0]);

                const indexBisector = bisector(xAccessor).left;
                const index = indexBisector(linepoints, date);

                const stock = linepoints[index - 1];
                dot.style("opacity", 1)
                   .attr("cx", xScale(xAccessor(stock)))
                   .attr("cy", yScale(yAccessor(stock)))
                   .raise();
                
                tooltip.style("display", "block")
                       .style("top", yScale(yAccessor(stock)) + 35 + "px")
                       .style("left", xScale(xAccessor(stock)) + "px");
                
                tooltip.select(".price").text(`price: $${yAccessor(stock)}`);
                tooltip.select(".date").text(`date: ${timeFormat("%B %-d, %Y")(xAccessor(stock))}`);                
           })
           .on("mouseleave", function(event){
                dot.style("opacity", 0);
                tooltip.style("display", "none");
           }) 
    }

    return (
        <div className="line-chart" >
            <div ref={linechartTooltipRef} className="line-chart-tooltip">
                <div className="price"></div>
                <div className="date"></div>
            </div> 
            <svg ref={linechartSvgRef} />
        </div>
    )
}