"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: { label: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    const colorScheme = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F3A712",
      "#5D737E",
      "#C06C84",
    ];

    const color = d3.scaleOrdinal(colorScheme);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(8);

    const labelArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label) as string)
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 2)
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = interpolate(t);
          return arc(d) || "";
        };
      });

    const text = arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em");

    text
      .append("tspan")
      .attr("x", 0)
      .attr("y", "-0.7em")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => d.data.label);

    text
      .filter((d) => d.endAngle - d.startAngle > 0.25)
      .append("tspan")
      .attr("x", 0)
      .attr("y", "1em")
      .style("fill", "#fff")
      .style("font-size", "10px")
      .text((d) => d.data.value.toString());

    const gradient = svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "pieGradient");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0);

    g.append("circle").attr("r", radius).style("fill", "url(#pieGradient)");
  }, [data]);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="overflow-visible"
      />
    </div>
  );
};

export default PieChart;
