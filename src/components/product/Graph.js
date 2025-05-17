import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ prices1 = [], prices2 = [] }) => {
  // Fallback hardcoded values if needed
  const fallbackPrices1 = [
    { date: '2024-11-03', meanPrice: 45000 },
    { date: '2024-11-10', meanPrice: 46000 },
    { date: '2024-11-17', meanPrice: 47000 },
  ];
  const fallbackPrices2 = [
    { date: '2025-01-01', meanPrice: 45000 },
    { date: '2025-01-08', meanPrice: 45000 },
    { date: '2025-01-15', meanPrice: 41000 },
    { date: '2025-01-22', meanPrice: 41000 },
    { date: '2025-02-06', meanPrice: 41000 },
    { date: '2025-02-13', meanPrice: 41500 },
    { date: '2025-02-21', meanPrice: 44000 },
    { date: '2025-02-28', meanPrice: 41300 },
    { date: '2025-03-05', meanPrice: 45100 },
  ];

  // Use fallback if data is empty or invalid
  const validPrices1 = Array.isArray(prices1) && prices1.length > 0 ? prices1 : fallbackPrices1;
  const validPrices2 = Array.isArray(prices2) && prices2.length > 0 ? prices2 : fallbackPrices2;

  // Extract labels and data from price arrays
  const labels = validPrices1
    .map(item => item.date)
    .concat(
      validPrices2.filter(p => !validPrices1.some(d => d.date === p.date)).map(item => item.date)
    );

  const actualDataMap = Object.fromEntries(validPrices1.map(item => [item.date, item.meanPrice]));
  const projectedDataMap = Object.fromEntries(validPrices2.map(item => [item.date, item.PredictedPrice]));

  const actualData = labels.map(label => actualDataMap[label] ?? null);
  const projectedData = labels.map(label => projectedDataMap[label] ?? null);

  const data = {
    labels,
    datasets: [
      {
        label: 'Actual Price',
        data: actualData,
        borderColor: 'blue',
        fill: false,
        tension: 0.4,
        pointRadius: 0,  // Make the points invisible by default
        borderWidth: 2,
        hoverRadius: 6,  // Increase radius on hover
        hoverBorderWidth: 3,
        hoverBackgroundColor: 'rgba(0,0,255,0.3)',  // Slight blue color on hover
        borderJoinStyle: 'round',
      },
      {
        label: 'Projected Price',
        data: projectedData,
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,  // Make the points invisible by default
        borderWidth: 2,
        hoverRadius: 6,  // Increase radius on hover
        hoverBorderWidth: 3,
        hoverBackgroundColor: 'rgba(255,0,0,0.3)',  // Slight red color on hover
        borderJoinStyle: 'round',
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      tension: {
        duration: 2000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: false,
      },
      x: {
        duration: 4000,
        easing: 'linear',
      },
      y: {
        duration: 0,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price Over Time',
      },
      tooltip: {
        callbacks: {
          // Custom tooltip to show date and price
          label: (tooltipItem) => {
            const date = tooltipItem.label;
            const price = tooltipItem.raw;
            return `${date}: ${price.toLocaleString()} PKR`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        // Adding shadow to create the glow effect
        borderColor: 'rgba(0, 0, 255, 0.7)', // default blue line color
        backgroundColor: 'rgba(0, 0, 255, 0.1)', // slight glow behind the line
        shadowBlur: 10,  // Create the glow effect
        shadowColor: 'blue',  // Blue glow effect
      },
      point: {
        radius: 0,  // Make the points invisible by default
        hoverRadius: 6,  // Make points visible on hover
        hoverBackgroundColor: 'rgba(0,0,255,0.3)', // Blue glow on hover
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false, // Allow hover detection even if the cursor is not directly over a point
      animationDuration: 0,
      axis: 'xy',  // Consider both X and Y axes for the hover mode
      distance: 10, // Increase the hover distance for more flexibility when hovering near points
    },
    responsiveAnimationDuration: 0,
  };

  return <Line data={data} options={options} />;
};

export default Graph;
