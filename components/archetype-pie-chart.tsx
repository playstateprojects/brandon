// components/ArchetypePieChart.tsx
import React from 'react'
import { Pie } from 'react-chartjs-2'
import { ArchetypeData, Archetype } from '@/lib/types'
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement)
interface ArchetypePieChartProps {
  data: ArchetypeData
}

const ArchetypePieChart: React.FC<ArchetypePieChartProps> = ({ data }) => {
  // Extract the titles and weights from the archetypes
  const labels = data.archetypes.map((item: Archetype) => item.title)
  const weights = data.archetypes.map((item: Archetype) => item.weight * 100)
  // Define the colors
  const colors = ['#E6FE52', '#13191B', '#EFEFEF', '#FFFFFF']

  // Create the data structure for the chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: weights,
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const
      }
    }
  }

  return (
    <>
      <Pie data={chartData} options={options} />
      <h3>This chart isn't working yet</h3>
    </>
  )
}

export default ArchetypePieChart
