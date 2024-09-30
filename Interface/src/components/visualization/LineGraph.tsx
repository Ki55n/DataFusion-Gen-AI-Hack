"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface LineGraphProps {
  data: { date: string; value: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  console.log(data);
  console.log("yoyoyo");

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const x = d3.scaleTime().range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    x.domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date]);
    y.domain([0, d3.max(data, (d) => d.value) || 0]);

    // Background
    // svg.append("rect").attr("width", width).attr("height", height);
    // .attr("fill", "#1a1a2e");

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#ffffff").attr("opacity", 0.1)
      );

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#ffffff").attr("opacity", 0.1)
      );

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => d3.timeFormat("%b %d")(d as Date))
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#8e9aaf")
          .attr("font-size", "12px")
      );

    // Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#8e9aaf")
          .attr("font-size", "12px")
      );

    // Line
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4cc9f0")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Animation
    const length = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Area
    const area = d3
      .area<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y0(height - margin.bottom)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#gradient)")
      .attr("d", area)
      .attr("opacity", 0.3);

    // Gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4cc9f0")
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4cc9f0")
      .attr("stop-opacity", 0);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "#ffffff")
      .style("color", "#1a1a2e")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    const bisect = d3.bisector(
      (d: { date: string; value: number }) => new Date(d.date)
    ).left;

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const x0 = x.invert(d3.pointer(event)[0]);
        const i = bisect(data, x0 as Date, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 >= new Date(d1.date) ? d1 : d0;
        tooltip
          .style("opacity", 1)
          .html(
            `Date: ${d3.timeFormat("%b %d, %Y")(new Date(d.date))}<br>Value: ${
              d.value
            }`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }, [data]);

  return (
    <div className=" h-full flex justify-center items-center p-4 rounded-lg shadow-lg">
      <svg ref={svgRef} width="100%" height="300" />
    </div>
  );
};

export default LineGraph;
