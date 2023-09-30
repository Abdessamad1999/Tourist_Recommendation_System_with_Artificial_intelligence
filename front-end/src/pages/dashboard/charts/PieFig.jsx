import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const labels = ['Like', 'Dislike']

function PieFig(props) {

  const data = {
    labels,
    datasets: [
      {
        label: '# of Votes',
        data: Object.values(props.data),
        backgroundColor: ['rgba(102,102,255,1)', 'rgba(255,102,102,1)'],
      },
    ],
  };

  return (
    <Doughnut options={options} data={data} />
  )
}

export default PieFig