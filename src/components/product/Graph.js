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

const Graph = () => {
  const prices1 = [150, 200, 170, 220, 190, 230];
  const prices2 = [230, 250, 260, 230, 280, 290, 300];

  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Actual Price',
        data: [...prices1, null, null, null, null, null],
        borderColor: 'blue',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Projected Price',
        data: [null, null, null, null, null, ...prices2],
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
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
        loop: false
      },
      x: {
        duration: 4000,
        easing: 'linear',
      },
      y: {
        duration: 0, // y axis fixed immediately
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0, // no dots during draw
        hoverRadius: 5,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 0, // no hover re-draw
    },
    responsiveAnimationDuration: 0,
  };

  return <Line data={data} options={options} />;
};

export default Graph;
