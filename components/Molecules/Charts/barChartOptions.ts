import { ChartData, ChartOptions } from 'chart.js'
import { uniq } from 'lodash'

export const getBarChartData = (labels: string[], numbers: number[], colors: string[]): ChartData<'bar', number[], unknown> | ((canvas: HTMLCanvasElement) => ChartData<'bar', number[], unknown>) => {
  //console.log('numbers: ' + numbers)
  //console.log('labels: ' + labels)
  return {
    labels: labels,
    datasets: [
      {
        borderColor: 'black',
        borderWidth: 0,
        data: numbers,
        backgroundColor: uniq(colors),
        type: 'bar',
        indexAxis: 'x',
      },
    ],
  }
}

export const getBarChartOptions = (): ChartOptions<'bar'> => {
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
      /* decimation: {
        enabled: true
      }   */
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(203, 241, 247, 0.932)',
        },
      },
      x: {
        display: true,
        ticks: {
          color: 'rgba(203, 241, 247, 0.932)',
        },
        grid: {
          //color: "red"
        },
      },
    },
  }
}
