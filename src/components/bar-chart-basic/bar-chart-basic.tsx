import React, { FC, useEffect, useRef } from "react";
import { select } from "d3-selection";
 
import data from "./data.json";
import "./bar-chart-basic.scss";
import { BarchartDimensions, Source } from "./types";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; 
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale"; 
import { schemeCategory10  } from "d3-scale-chromatic";

export const BasicBarchart : FC = () => {

    const svgRef = useRef(null); 

    useEffect(() => {  
 
        let dimensions : BarchartDimensions = {
            width: 1100,
            height: 600,
            margins: {
                top: 20,
                buttom: 20,
                left: 20,
                right: 20
            },
            containerWidth: 0,
            containerHeight: 0
        };

        dimensions.containerHeight = dimensions.height - dimensions.margins.top - dimensions.margins.buttom;
        dimensions.containerWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right;

        select(svgRef.current)
         .attr("width", dimensions.width)
         .attr("height", dimensions.height) 
         .attr("viewBox", [0, 0,  dimensions.width, dimensions.height])  
         .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

         const sources = data.map(d => d as Source);
 
         draw(sources, dimensions);   
  
    }, []);
   

    const draw = (sources : Source[], dimensions: BarchartDimensions) => {
        const svg = select(svgRef.current);
        const container = svg.append("g")
                             .attr("transform", `translate(${dimensions.margins.top}, ${dimensions.margins.left})`);
       
        const xScale = scaleBand().domain(sources.map(src => src.framework)).range([dimensions.margins.left, dimensions.containerWidth]).padding(0.1);
        const yScale = scaleLinear().domain([0, max(sources.map(src => src.score))] as number[]).range([dimensions.containerHeight, 0]);
       
        const colorScale = scaleOrdinal(schemeCategory10); 
       
        container.selectAll("rect")
                 .data(sources)
                 .join("rect")
                 .attr("x", d => xScale(d.framework) || 0)
                 .attr("y", d => yScale(d.score))
                 .attr("width", xScale.bandwidth)
                 .attr("height", d => dimensions.containerHeight - yScale(d.score))
                 .attr("fill", d => colorScale(d.framework))
        
        const xAxis = axisBottom(xScale);
        const yAxis = axisLeft(yScale);

        container.append("g").attr("transform", `translate(0, ${dimensions.containerHeight})`).call(xAxis).classed('bar-chart-axis', true);;
        container.append("g").attr("transform", `translate(${dimensions.margins.top}, 0)`).call(yAxis);
    }

    return (
        <div className="bar-chart"> 
            <svg ref={svgRef}/>
        </div>
    )

}