"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface BarChartProps {
  data: { label: string; value: number }[];
}

export default function BarChart({ data }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  console.log("Bar Chart Render");
  console.log("Data:", data);
  console.log("Dimensions:", dimensions);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        console.log("Container size:", { width, height });
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) {
      console.log("SVG or dimensions not ready");
      return;
    }

    console.log("Rendering chart");
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, chartWidth]).padding(0.3);
    const y = d3.scaleLinear().range([chartHeight, 0]);

    x.domain(data.map((d) => d.label));
    y.domain([0, d3.max(data, (d) => d.value) || 0]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("transition", "opacity 0.2s ease")
      .style("z-index", "10");

    // Create bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartHeight - y(d.value))
      .attr("fill", "#60A5FA")
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mousemove", function (event, d) {
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        d3.select(this).attr("fill", "#3B82F6").attr("cursor", "pointer");
        tooltip
          .style("opacity", 1)
          .html(`${d.label}: ${d.value}`)
          .style("left", `${mouseX}px`)
          .style("top", `${mouseY - 40}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#60A5FA").attr("cursor", "default");
        tooltip.style("opacity", 0);
      });

    // Add X Axis
    chart
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("fill", "rgba(255, 255, 255, 0.8)")
      .style("font-size", "12px");

    // Add Y Axis
    chart
      .append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-chartWidth))
      .selectAll("text")
      .style("fill", "rgba(255, 255, 255, 0.8)")
      .style("font-size", "12px");

    // Style axis lines
    chart.selectAll(".domain").remove();
    chart.selectAll(".tick line").attr("stroke", "rgba(255, 255, 255, 0.1)");

    // Add title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("fill", "rgba(255, 255, 255, 0.9)")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Interactive Bar Chart");

    // Add aria-label for accessibility
    svg.attr("aria-label", "Interactive bar chart showing data distribution");
  }, [data, dimensions]);

  if (!data || data.length === 0) {
    return <div className="text-white">No data available for the chart.</div>;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ minHeight: "400px" }}
    >
      {dimensions.width === 0 || dimensions.height === 0 ? (
        <div className="text-white">Loading chart...</div>
      ) : (
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
