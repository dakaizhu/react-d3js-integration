import React, { FC, useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { interpolateSpectral } from "d3-scale-chromatic";

import data from "./population-data.json";

import { Source, Dimensions } from "./types";
import { pie, arc, DefaultArcObject } from "d3-shape";
import { quantize } from "d3-interpolate";
import { scaleOrdinal } from "d3-scale";
import "./pie-chart-population.scss";

/*
    reference: https://observablehq.com/@d3/pie-chart
*/
export const PopulationPiechart : FC = () => {

    const svgRef = useRef(null); 

    useEffect(() => {
       let dimensions : Dimensions = {
          width : 750,
          height: 750,
          margin: 50,
          areaHeight : 0,
          areaWidth: 0,
       }

       dimensions.areaHeight = dimensions.height - dimensions.margin * 2;
       dimensions.areaWidth = dimensions.width - dimensions.margin * 2;

       select(svgRef.current)
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)      
            .attr("viewBox", [0, 0,  dimensions.width, dimensions.height])  
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

       if(data) draw(data.map(d => d as Source), dimensions);

    }, [])


    const draw = (populations: Source[], dimensions : Dimensions) => {
        const svg = select(svgRef.current);
        const container = svg.append("g").attr("transform", `translate(${dimensions.margin}, ${dimensions.margin})`);
        const innerRadius = 0;
        const outerRadius = Math.min(dimensions.width, dimensions.height) / 2; 
        const labelRadius = (innerRadius * 0.02 + outerRadius * 0.8);
        const padAngle = 1 / outerRadius;

        //scales
        const populationPie = pie<Source>().padAngle(padAngle)
                                           .value((d) => d.population)
                                           .sort(null);
        
        const slices = populationPie(populations);


        const populationArc = arc().outerRadius(outerRadius).innerRadius(innerRadius);
        const populationArcLabel = arc().outerRadius(labelRadius).innerRadius(labelRadius);

        const colors = quantize(t => interpolateSpectral(t * 0.8 + 0.1), populations.length);
        const colorScale = scaleOrdinal().domain(populations.map(p => p.range)).range(colors);

        //drawing shape
        const group = container.append("g")
                               .attr("transform", `translate(${dimensions.areaHeight / 2}, ${dimensions.areaWidth / 2 })`);
        
        const stroke = innerRadius > 0 ? "none" : "#fff";
      
        group.selectAll("path").data(slices)
                               .join("path")
                               //@ts-ignore
                               .attr("d", populationArc)
                               //@ts-ignore
                               .attr("fill", src => colorScale(src.data.population))
                               .attr("stroke", stroke)
                               .attr("stroke-width", 1)
                               .attr("stroke-linejoin", "round");

        const labels = container.append("g").attr("transform", `translate(${dimensions.areaHeight / 2}, ${dimensions.areaWidth / 2 })`).classed("pie-label", true);

        labels.selectAll("text")
              .data(slices)
              .join("text")
              .attr("transform", d => `translate(${populationArcLabel.centroid((d as unknown) as DefaultArcObject)})`)
              .call(
                text => text.append("tspan")
                            .style("font-weight", "bold")
                            .attr("y", -2)
                            .text(src => src.data.range)
              )
              .call(
                text => text.filter((d) => (d.endAngle - d.startAngle) > 0.25)
                            .append("tspan")
                            .attr("x", 0)
                            .attr("y", 24)
                            .text(src => src.data.population)
              );

    }

    return (
        <div className="pie-chart"> 
            <svg  ref={svgRef}/>
        </div>
    )
}