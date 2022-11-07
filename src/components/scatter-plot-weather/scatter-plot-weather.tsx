import React, { FC, useRef, useEffect } from "react";
import { select } from "d3-selection";
import { scaleLinear }  from "d3-scale";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { Delaunay } from "d3-delaunay"; 

import data from "./weather-data.json";
import { Weather, Dimensions } from "./data-types";
import "./scatter-plot-weather.scss";
import { timeFormat } from "d3-time-format";
 
export const WeatherScatterPlot : FC = () => { 
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {   
        const dimensions = {
            width: 800,
            height: 800,
            margin: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            },
            areaHeight: 0,
            areaWidth: 0
        };

        dimensions.areaHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
        dimensions.areaWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;  

        select(svgRef.current)
          .attr("width", dimensions.width)
          .attr("height", dimensions.height); 
          
        if(data) { 
            draw(data.map(d => d as Weather), dimensions);
        } 
    }, []) 

    const draw = (weathers: Weather[], dimensions: Dimensions) : void => {

        const xAccessor = (d: Weather) => d.currently.humidity;
        const yAccessor = (d: Weather) => d.currently.apparentTemperature;   
        const svg = select(svgRef.current);

        const ctr = svg.append('g')
                       .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        // Scales
        const xScale = scaleLinear() 
        .domain(extent(weathers, xAccessor) as [Number, Number])
        .rangeRound([0, dimensions.areaWidth])
        .clamp(true)
        
        const yScale = scaleLinear()
        .domain(extent(weathers, yAccessor) as [Number, Number])
        .rangeRound([dimensions.areaHeight, 0])
        .nice()
        .clamp(true)

        // Draw Circles
        ctr.selectAll('circle')
            .data(weathers)
            .join('circle')
            .attr('cx', d => xScale(xAccessor(d)))
            .attr('cy', d => yScale(yAccessor(d)))
            .attr('r', 5)
            .attr('fill', "#fff")
            .attr('data-temp', yAccessor)

      // Axes
     const xAxis = axisBottom(xScale)
                     .ticks(5)
                     .tickFormat((d) => d.valueOf() * 100 + '%')
     
     const xAxisGroup = ctr.append('g')
                     .call(xAxis)
                     .style('transform', `translateY(${dimensions.areaHeight}px)`)
                     .classed('axis', true)
                 
     xAxisGroup.append('text')
               .attr('x', dimensions.areaWidth / 2)
               .attr('y', dimensions.margin.bottom - 10)
               .attr('fill', "#fff")
               .text('Humidity')
      
    const yAxis = axisLeft(yScale)

    const yAxisGroup = ctr.append('g')
        .call(yAxis)
        .classed('axis', true)

    yAxisGroup.append('text')
        .attr('x', -dimensions.areaHeight / 2)
        .attr('y', -dimensions.margin.left + 15)
        .attr('fill', "#fff")
        .html('Temperature &deg; F')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle');
        
    const delaunay = Delaunay.from(weathers, (d) => xScale(xAccessor(d)), (d) => yScale(yAccessor(d)));
    
    const voronoi = delaunay.voronoi();
    voronoi.xmax = dimensions.areaWidth;
    voronoi.ymax = dimensions.areaHeight;

    const tooltip = select(tooltipRef.current) 

    ctr.append('g')
    .selectAll('path')
    .data(weathers)
    .join('path') 
    .attr('fill', 'transparent')
    .attr('d', (d, i) => voronoi.renderCell(i))
    .on('mouseenter', function (event, datum) {
      ctr.append('circle')
        .classed('dot-hovered', true)
        .attr('fill', 'red')
        .attr('r', 8)
        .attr('cx', d => xScale(xAccessor(datum)))
        .attr('cy', d => yScale(yAccessor(datum)))
        .style('pointer-events', 'none') 
 
      const ytop = yScale(yAccessor(datum)) + 50 + "px";
      const xleft = xScale(xAccessor(datum)) + 480 + "px";
 
      tooltip.style('opacity', 1)
         .style('top', ytop)
         .style('left', xleft)

      const formatter = format('.2f');
      const dateFormatter = timeFormat('%B %-d, %Y');

      tooltip.select("#metric_humidity")
        .text(formatter(xAccessor(datum)));

      tooltip.select("#metric_temperature")
        .text(formatter(yAccessor(datum)));

      tooltip.select("#metric_date")
        .text(dateFormatter(new Date(datum.currently.time * 1000)))  //convert second to millisecond
    })
    .on('mouseleave', function (event) {
      ctr.select('.dot-hovered').remove();
      tooltip.style('opacity', 0);
    })

}

    return ( 
        <div className="chart">
          <div className="tooltip" ref={tooltipRef}>
            <div>
              Date: <span id="metric_date"></span>
            </div>
            <div>
                Humidity: <span id="metric_humidity"></span>
            </div>
            <div>
                Temperature: <span id="metric_temperature"></span>
            </div>
          </div>
          <svg ref={svgRef} /> 
        </div>
    )
}
