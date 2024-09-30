"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  x: number;
  y: number;
  id: number;
}

interface Series {
  data: DataPoint[];
  label: string;
}

interface ScatterPlotProps {
  data: {
    series: Series[];
  };
}

export default function D3ScatterPlot({ data }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.series.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.series[0].data, (d) => d.x) as number])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickPadding(10))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#888").attr("opacity", 0.2)
      )
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text("X Axis");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(-width).tickPadding(10))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#888").attr("opacity", 0.2)
      )
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text("Y Axis");

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(data.series[0].data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5)
      .style("fill", "#8884d8")
      .style("opacity", 0.7)
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("r", 8);

        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", xScale(d.x) + 10)
          .attr("y", yScale(d.y) - 10)
          .text(`(${d.x.toFixed(2)}, ${d.y.toFixed(2)})`)
          .style("font-size", "12px")
          .style("fill", "#fff");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(100).attr("r", 5);

        svg.selectAll(".tooltip").remove();
      });
  }, [data]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          D3 Scatter Plot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg ref={svgRef}></svg>
      </CardContent>
    </Card>
  );
}
