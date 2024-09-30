"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  x: number;
  y: number;
}

interface LineGraphProps {
  data: {
    xValues: string[];
    yValues: { data: number[]; label: string }[];
  };
  width?: string;
}

export default function Component({ data, width = "30%" }: LineGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = Math.min(400, width * 0.75) - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const chartData: DataPoint[] = data.xValues.map((x, i) => ({
      x: parseFloat(x),
      y: data.yValues[0].data[i],
    }));

    const x = d3
      .scaleLinear()
      .domain(d3.extent(chartData, (d) => d.x) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("color", "#8899A6")
      .selectAll("text")
      .attr("fill", "#8899A6");

    chart
      .append("g")
      .call(d3.axisLeft(y))
      .attr("color", "#8899A6")
      .selectAll("text")
      .attr("fill", "#8899A6");

    chart
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#1DA1F2")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    chart
      .selectAll(".dot")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 3.5)
      .attr("fill", "#1DA1F2");

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#8899A6")
      .text("Survival Rate");

    chart
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .style("text-anchor", "middle")
      .style("fill", "#8899A6")
      .text("Time");
  }, [data]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div
        className={`w-full ${width} min-w-[300px] bg-gray-800 p-4 rounded-lg shadow-lg`}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-200">
          Survival Rate Over Time
        </h2>
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </div>
  );
}
