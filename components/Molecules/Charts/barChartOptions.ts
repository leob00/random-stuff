import { ChartData, ChartOptions } from 'chart.js'
import { DarkBlue } from 'components/themes/mainTheme'

export interface BarChart {
  labels: string[]
  numbers: number[]
  colors: string[]
}

export const getBarChartData = (labels: string[], numbers: number[], colors: string[]): ChartData<'bar', number[], unknown> => {
  return {
    labels: labels,
    datasets: [
      {
        borderColor: 'black',
        borderWidth: 0,
        data: numbers,
        backgroundColor: colors,
        type: 'bar',
        indexAxis: 'x',
      },
    ],
  }
}

export const getBarChartOptions = (title?: string): ChartOptions<'bar'> => {
  return {
    responsive: true,
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: 'rgba(203, 241, 247, 0.932)',
        },
        title: {
          display: true,
          color: 'rgba(203, 241, 247, 0.932)',
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        ticks: {
          color: DarkBlue,
          //sautoSkip: true,
          stepSize: 1,
          precision: 1,
        },
      },
      x: {
        display: true,
        ticks: {
          color: DarkBlue,
        },
        grid: {
          //color: "red"
        },
      },
    },
  }
}
