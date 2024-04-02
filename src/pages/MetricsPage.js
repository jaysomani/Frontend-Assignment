import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3'; // Import D3.js library
import moment from 'moment';
import { MimicMetrics } from '../api-mimic';
import './GraphsContainer.css'; // Import CSS for styling

const GraphsContainer = () => {
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsData = await MimicMetrics.fetchMetrics({
          startTs: new Date().getTime() - 24 * 60 * 60 * 1000, // Example: 24 hours ago
          endTs: new Date().getTime(), // Example: Current time
        });
        setData(metricsData);
        const end = new Date();
        const start = new Date(end - 24 * 60 * 60 * 1000); // Example: 24 hours ago
        setStartTime(start);
        setEndTime(end);
        setIsLoading(false); // Set loading to false after data fetching
        console.log('Metrics Data:', metricsData); // Log metrics data to console
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {!isLoading && (
        <div className="title-container flex p-2">
          <h1 className="text-2xl font-bold pl-2">Metrics</h1>
          <span className="text-sm mt-2 pl-4">Showing logs from {startTime && startTime.toLocaleString()} - {endTime && endTime.toLocaleString()}</span>
        </div>
      )}

      {isLoading ? ( // Render loading indicator if data is loading
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pl-10 border-2">
          {data.map(metricData => (
            <div key={metricData.name} className="bg-gray-100 p-4 rounded-md border-2">
              <h2 className="text-xl font-bold mb-4">{metricData.name}</h2>
              <Graph
                lines={metricData.graphLines}
              />
              <Legend lines={metricData.graphLines} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Graph = ({ lines }) => {
  const svgRef = useRef(null);
  const width = 400; // Define width outside of useEffect
  const height = 200; 

  useEffect(() => {
    if (!lines || lines.length === 0) return; // Add error handling

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c']; // Example colors for lines

    const values = lines.map(line => ({
      name: line.name,
      values: line.values.map(entry => ({
        timestamp: moment(entry.timestamp).toDate(),
        value: entry.value,
      })),
    }));

    const x = d3.scaleTime().range([margin.left, width - margin.right])
      .domain(d3.extent(values[0].values, d => d.timestamp));
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top])
      .domain([0, d3.max(values.flatMap(line => line.values), d => d.value)]);

    const lineGenerator = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.value));

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    values.forEach((line, index) => {
      svg.append("path")
        .datum(line.values)
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 1.5)
        .attr("d", lineGenerator);
    });
  }, [lines]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const Legend = ({ lines }) => {
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c']; // Example colors for lines

  return (
    <div className="legend-container">
      <ul className="legend-list">
        <li className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors[0] }}></span>
          <span className="legend-text">Limits</span>
        </li>
        <li className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors[1] }}></span>
          <span className="legend-text">Requested</span>
        </li>
        <li className="legend-item">
          <span className="legend-color" style={{ backgroundColor: colors[2] }}></span>
          <span className="legend-text">Usage</span>
        </li>
      </ul>
    </div>
  );
};

export default GraphsContainer;
