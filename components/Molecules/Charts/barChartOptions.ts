import { ChartData, ChartOptions } from 'chart.js'
import { CasinoMoreBlackTransparent, CasinoWhiteTransparent, DarkBlue } from 'components/themes/mainTheme'
import { max } from 'lodash'

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

export const getBarChartOptions = (title: string, data: BarChart): ChartOptions<'bar'> => {
  return {
    responsive: true,
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      title: {
        display: true,
        text: title,
      },
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
      tooltip: {
        padding: 16,
        backgroundColor: CasinoMoreBlackTransparent,
        titleColor: CasinoWhiteTransparent,
        footerAlign: 'center',
        footerSpacing: 2,
        footerMarginTop: 10,
        footerFont: {
          weight: '',
          size: 15,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        usePointStyle: true,
        footerColor: 'white',
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}: ${tooltipItems.formattedValue}`
          },
          labelPointStyle: (tooltiipItems) => {
            return {
              pointStyle: 'circle',
              rotation: 0,
              border: 0,
            }
          },
          footer: (tooltipItems) => {
            return ''
            //return tooltipItems[0].formattedValue
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: DarkBlue,
          autoSkip: true,
          //stepSize: 1,
          precision: 1,
          maxTicksLimit: max(data?.numbers),
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
