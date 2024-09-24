"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 450;
    const height = 320;
    const margin = { top: 40, right: 30, bottom: 70, left: 60 };

    const x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    x.domain(data.map((d) => d.label));
    y.domain([0, d3.max(data, (d) => d.value) || 0]);

    // Create subtle grid lines
    const yGrid = d3
      .axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => "");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yGrid)
      .selectAll(".tick line")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .style("opacity", 0.5);

    // Create colorful gradient for the bars
    const barGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    barGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(194, 57, 219, 0.8)");

    barGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "rgba(129, 34, 143, 0.8)");

    barGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(74, 14, 78, 0.8)");

    // Create bars with colorful gradient and animation
    svg
      .selectAll("rect.bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "url(#barGradient)")
      .attr("rx", 4)
      .attr("ry", 4)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - margin.bottom - y(d.value));

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "rgba(255, 255, 255, 0.8)")
      .style("font-size", "12px");

    // Add Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10))
      .selectAll("text")
      .style("fill", "rgba(255, 255, 255, 0.8)")
      .style("font-size", "12px");

    // Remove axis lines
    svg.selectAll(".domain").remove();

    // Add bar labels with animation
    svg
      .selectAll("text.bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", height - margin.bottom)
      .attr("text-anchor", "middle")
      .text((d) => d.value)
      .style("fill", "rgba(255, 255, 255, 0.9)")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("y", (d) => y(d.value) - 5);

    // Add chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .text("Bar Chart")
      .style("fill", "rgba(255, 255, 255, 0.9)")
      .style("font-size", "18px")
      .style("font-weight", "bold");

    // Add X-axis title
    svg
      .append("text")
      .attr("class", "x-axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .text("Categories")
      .style("fill", "rgba(255, 255, 255, 0.7)")
      .style("font-size", "14px");

    // Add Y-axis title
    svg
      .append("text")
      .attr("class", "y-axis-title")
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .text("Values")
      .style("fill", "rgba(255, 255, 255, 0.7)")
      .style("font-size", "14px");
  }, [data]);

  return (
    <div className="w-full h-[320px] rounded-lg overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default BarChart;
