// components/ArchetypePieChart.tsx
import React from 'react'
import { ArchetypeData, Archetype } from '@/lib/types'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale
} from 'chart.js'
import { PolarArea } from 'react-chartjs-2'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, LinearScale)

interface ArchetypePieChartProps {
  data: ArchetypeData
}

const ArchetypePieChart: React.FC<ArchetypePieChartProps> = ({ data }) => {
  // Extract the titles and weights from the archetypes
  const labels = data.archetypes.map((item: Archetype) => item.title)
  const weights = data.archetypes.map((item: Archetype) => item.weight * 100)
  // Define the colors
  const colors = [
    'rgb(223,240,106)',
    'rgb(182,196,91)',
    'rgb(128,139,69)',
    '#FFCA00',
    '#FFB900'
  ]

  // Create the data structure for the chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: weights,
        label: 'weight',
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        hoverOffset: 4
      }
    ]
  }

  const options = {
    responsive: true,
    scales: {
      r: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'right' as const
      }
    }
  }

  return (
    <>
      <PolarArea data={chartData} options={options} />
    </>
  )
}

export default ArchetypePieChart
