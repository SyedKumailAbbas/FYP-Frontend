import * as d3 from "d3";

export default function LinePlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 40
}) {
  // X scale maps index positions to pixel positions
  const x = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([marginLeft, width - marginRight]);

  // Y scale maps data values to pixel positions
  const y = d3.scaleLinear()
    .domain(d3.extent(data)) // Automatically finds min/max of data
    .range([height - marginBottom, marginTop]);

  // D3 line generator
  const line = d3.line()
    .x((d, i) => x(i))
    .y(d => y(d));

  return (
    <svg width={width} height={height}>
      {/* Line path */}
      <path 
        d={line(data)} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
      />

      {/* Data points as circles */}
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="3" />
        ))}
      </g>
    </svg>
  );
}
