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
            width: 1200,
            height: 800,
            margins: {
                top: 100,
                buttom: 100,
                left: 100,
                right: 20
            },
            containerWidth: 0,
            containerHeight: 0
        };

        dimensions.containerHeight = dimensions.height - dimensions.margins.top - dimensions.margins.buttom;
        dimensions.containerWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right;



         const sources = data.map(d => d as Source).sort((a,b) => a.score - b.score);
 
         draw(sources, dimensions);   
  
    }, []);
   

    const draw = (sources : Source[], dimensions: BarchartDimensions) => {
    
        const container = select(svgRef.current)
                            .attr("width", dimensions.width)
                            .attr("height", dimensions.height) 
                            .attr("viewBox", [0, 0,  dimensions.width, dimensions.height])  
                            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                            .append("g")
                            .attr("transform", `translate(${dimensions.margins.top}, ${dimensions.margins.left})`);
       
        const xScale = scaleBand().domain(sources.map(src => src.framework)).range([dimensions.margins.left, dimensions.containerWidth]).padding(0.1);
        const yScale = scaleLinear().domain([0, max(sources.map(src => src.score))] as number[]).nice().range([dimensions.containerHeight, 0]);
       
        //const colorScale = scaleOrdinal(schemeCategory10); 
       
        container.selectAll("rect")
                 .data(sources)
                 .join("rect")
                 .attr("x", d => xScale(d.framework) || 0)
                 .attr("y", d => yScale(d.score))
                 .attr("width", xScale.bandwidth)
                 .attr("height", d => dimensions.containerHeight - yScale(d.score))
                 .attr("fill", "#6495ED")
                 //.attr("fill", d => colorScale(d.framework)) 
        
        container.selectAll("text")
                .data(sources)
                .join("text")
                .text(d => d.score)
                .attr("x", d => xScale.bandwidth()/2 + (xScale(d.framework) as number))
                .attr("y", d => yScale(d.score) - 5)
                .classed("score", true)

        const xAxis = axisBottom(xScale);
        const yAxis = axisLeft(yScale);

       const xAxisGroup = container.append("g").attr("transform", `translate(0, ${dimensions.containerHeight})`).call(xAxis).classed('bar-chart-axis', true);
       const yAxisGroup = container.append("g").attr("transform", `translate(${dimensions.margins.top}, 0)`).call(yAxis).classed('bar-chart-axis', true);
    
       xAxisGroup.append('text')
       .attr('x', dimensions.containerWidth / 2)
       .attr('y', dimensions.margins.buttom - 50)
       .classed("axis-label", true)
       .text('Frameworks / Libraries');

       yAxisGroup.append('text')
       .attr('x', -dimensions.containerHeight / 2)
       .attr('y', -dimensions.margins.left + 50)
       .classed("axis-label", true)
       .text('Score')
       .style('transform', 'rotate(270deg)')
       .style('text-anchor', 'middle'); 
    
    }

    return (
        <div className="bar-chart"> 
            <svg ref={svgRef}/>
        </div>
    )

}