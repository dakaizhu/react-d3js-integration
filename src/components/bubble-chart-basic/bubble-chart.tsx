import React, { FC, useEffect, useRef } from "react";
import { select } from "d3-selection";

import data from "./data.json";

import { BubbleData, Dimensions, DrawParameters } from "./types";
import "./bubble-chart.scss";
 
import { map, range, InternSet } from "d3-array";
import { scaleOrdinal } from "d3-scale"; 
import { schemeTableau10 } from "d3-scale-chromatic";
import "./bubble-chart.scss";
import { hierarchy, pack } from "d3-hierarchy";

/*
    reference: https://observablehq.com/@d3/bubble-chart
*/
export const BubbleChart : FC = () => {

    const svgRef = useRef(null); 

    useEffect(() => {
       let dimensions : Dimensions = {
          width : 1600,
          height: 900,
          margin: 10,
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


        const drawParams : DrawParameters= {
            label: (d: BubbleData) => [...(d.id.split(".").pop() as string).split(/(?=[A-Z][a-z])/g), d.value?.toLocaleString("en")].join("\n"),
            value: (d: BubbleData) => d.value,
            group: (d: BubbleData) => d.id.split(".")[1],
            title: (d: BubbleData) => `${d.id}\n${d.value?.toLocaleString("en")}`  
        }


       if(data) draw(data.filter(d => d.value !== null).map(d => d as BubbleData), dimensions, drawParams);

    }, [])
 
    const draw = (bubbles: BubbleData[], dimensions : Dimensions, params :DrawParameters) => { 

        const {  label, value, group, title } = params; 

        // Compute the values.
        const V = map(bubbles, value) as number[];
        const G = map(bubbles, group);
        const I = range(V.length).filter(i => V[i] > 0);
       
        // Unique the groups
        const groups = new InternSet(I.map(i => G[i]));                        
        
        // Construct scales
        const color = scaleOrdinal(groups, schemeTableau10);

         // Compute layout: create a 1-deep hierarchy, and pack it.
        const root = pack().size([dimensions.areaWidth, dimensions.areaHeight]).padding(3)(hierarchy({children: I}).sum(p => V[(p as unknown) as number]));

        const svg = select(svgRef.current);
        const container = svg.append("g")
                             .attr("transform", `translate(${dimensions.margin}, ${dimensions.margin})`)
                             .classed("container", true);
 
        const leaf = container.selectAll("g")
                        .data(root.leaves())
                        .join("g")
                        .attr("transform", d => `translate(${d.x},${d.y})`);
        
        leaf.append("circle")          
            .attr("fill", d => color(G[d.data as number]))
            .attr("fill-opacity", 0.7)
            .attr("r", d => d.r);  

         // Compute labels and titles.
        const L = map(bubbles, label);
        const T = map(bubbles, title);
     
        T && leaf.append("title").text(d => T[d.data as number]); 
       
        L && leaf.append("text") 
                 .selectAll("tspan")
                 .data(d => `${L[d.data as number]}`.split(/\n/g))
                 .join("tspan")
                 .attr("x", 0)
                 .attr("y", (d, i, D) => `${i - D.length / 2 + 0.75}em`)
                 .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7: null)
                 .classed("label", true) 
                 .text(d => d);
    }

    return (
        <div className="bubble-chart"> 
            <svg ref={svgRef}/>
        </div>
    )
}