import React, { FC, useRef, useEffect, useLayoutEffect } from "react";
import { select } from "d3-selection";
import { scaleLinear  }  from "d3-scale";
import { bin, map, range, sum, max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; 

import data from "./data.json"; 
import "./histogram.scss";
import { Dimensions, Unemployment } from "./types"
 

 
export const HistogramChart : FC = () => {

    const histogramSvgRef = useRef(null);

    const dimensions : Dimensions = {
        width: 1000,
        height: 500,
        margins: {
            left: 40,
            right: 30,
            top: 20,
            bottom: 30
        } 
    };
 
    useEffect(() => { 
        draw(dimensions, data.map(d => d as Unemployment));
    }, []);
 
    const draw = (dim: Dimensions, sources : Unemployment[]) => {

        const X = map(sources, d => d.rate);
        const Y0 = map(sources, d => 1);
        const I = range(X.length); 

        const b = bin().thresholds(40).value(i => X[i])(I);
        const Y = Array.from(b, I => sum(I, i => Y0[i]));

        const total = sum(Y);
        for(let i = 0; i < Y.length; ++i) Y[i] /= total;

        const xDomain = [b[0].x0, b[b.length - 1].x1] as number[];
        const yDomain = [0, max(Y)] as number[];

        const xScale = scaleLinear(xDomain, [dim.margins.left, dim.width - dim.margins.right]);
        const yScale = scaleLinear(yDomain, [dim.height - dim.margins.bottom, dim.margins.top]);
        const xAxis = axisBottom(xScale).ticks(dim.width / 80).tickSizeOuter(0);
        const yAxis = axisLeft(yScale).ticks(dim.height / 40, "%"); 

        const container = select(histogramSvgRef.current)
            .attr("width", dim.width)
            .attr("height", dim.height)
            .attr("viewBox", [0, 0, dim.width, dim.height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .append("g");

        container.append("g")
            .attr("transform", `translate(${dim.margins.left},0)`)
            .call(yAxis)
            //.call((g) => g.select(".domain").remove())
            .call((g) => g.selectAll(".tick line")
                          .clone()
                          .attr("x2", dim.width - dim.margins.left - dim.margins.right)
                          .attr("stroke-opacity", 0.1)
            )
            .call((g) => g.append("text")
                          .attr("x", -dim.margins.left)
                          .attr("y", 10)
                          .attr("fill", "currentColor")
                          .attr("text-anchor", "start")
                          .text("↑ Frequency")
            );

           container.append("g")
                    .attr("fill", "steelblue")
                    .selectAll("rect")
                    .data(b)
                    .join("rect")
                    .attr("x", (d) => xScale(d.x0 as number) + 0.5)
                    .attr("width", (d) => Math.max(0, xScale(d.x1 as number) - xScale(d.x0 as number) - 1))
                    .attr("y", (d, i) => yScale(Y[i]))
                    .attr("height", (d, i) => yScale(0) - yScale(Y[i]))
                    .append("title") 
                    .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`, yScale.tickFormat(100, "%")(Y[i])].join("\n"));

        container.append("g")
                 .attr("transform", `translate(0,${dim.height - dim.margins.bottom})`)
                 .call(xAxis)
                 .call((g) => g
                    .append("text")
                    .attr("x", dim.width - dim.margins.right)
                    .attr("y", 27)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text("Unemployment rate (%) →")
                ); 
    } 

 

    return (
        <div className="histogram">
            <svg ref={histogramSvgRef} />
        </div>
    )
}