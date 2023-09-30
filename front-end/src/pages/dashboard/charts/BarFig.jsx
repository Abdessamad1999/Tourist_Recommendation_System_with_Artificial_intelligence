import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart',
        },
    },
};

const labels = ['Bad', 'Not good', 'Good', 'Very good', 'Excellent']


function BarFig(props) {

    const data = {
        labels,
        datasets: [
            {
                label: '# of Votes',
                data: Object.values(props.data),
                backgroundColor: 'rgba(255,178,102,1)',
            },
        ],
    };

    return (
        <Bar options={options} data={data} />
    )
}

export default BarFig