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
      .padding(0.2);

    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    x.domain(data.map((d) => d.label));
    y.domain([0, d3.max(data, (d) => d.value) || 0]);

    // Dark background

    // Create neon grid lines
    const yGrid = d3
      .axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => "");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yGrid)
      .selectAll(".tick line")
      .attr("stroke", "#444") // Dim gridlines for dark mode
      .style("opacity", 0.5);

    // Create neon gradient for the bars
    const neonGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "neonGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    neonGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0516ab"); // Neon green at the top

    neonGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00e0ff"); // Neon blue at the bottom

    // Create bars with neon effect
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(0)) // Start bars from zero
      .attr("width", x.bandwidth())
      .attr("height", 0) // Start height at zero for transition
      .attr("fill", "url(#neonGradient)") // Apply neon gradient
      .attr("stroke", "#9c108e") // Neon green border for glow effect
      .attr("stroke-width", 1.5)
      .attr("filter", "drop-shadow(0px 0px 6px #9c108e)") // Glow effect
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - margin.bottom - y(d.value));

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#e0e0e0"); // Light text color for dark mode

    // Add Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0))
      .selectAll("text")
      .style("fill", "#e0e0e0"); // Light text color for dark mode

    // Add bar labels with light color
    svg
      .selectAll("text.bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value)
      .style("fill", "#e0e0e0") // Light label color for dark mode
      .style("font-size", "12px");

    // Add X-axis title
    svg
      .append("text")
      .attr("class", "x-axis-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .text("Categories") // Customize this title
      .style("fill", "#e0e0e0")
      .style("font-size", "14px");

    // Add Y-axis title
    svg
      .append("text")
      .attr("class", "y-axis-title")
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .text("Values") // Customize this title
      .style("fill", "#e0e0e0")
      .style("font-size", "14px");
  }, [data]);

  return <svg ref={svgRef} width="100%" height="300" />;
};

export default BarChart;
