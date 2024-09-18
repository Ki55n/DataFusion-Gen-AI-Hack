"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface LineGraphProps {
  data: { date: string; value: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3.scaleTime().range([margin.left, width - margin.right]);

    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    x.domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date]);
    y.domain([0, d3.max(data, (d) => d.value) || 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }, [data]);

  return <svg ref={svgRef} width="100%" height="200" />;
};

export default LineGraph;
