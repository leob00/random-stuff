import { ChartData, ChartOptions } from 'chart.js'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoGreen,
  CasinoMoreBlackTransparent,
  CasinoWhiteTransparent,
  CasinoYellowTransparent,
  DarkBlue,
  DarkBlueTransparent,
} from 'components/themes/mainTheme'
import { max } from 'lodash'

export interface BarChart {
  labels: string[]
  numbers: number[]
  colors: string[]
}

export const getPieChartData = (labels: string[], numbers: number[], colors: string[], borderColors?: string[]): ChartData<'doughnut', number[], unknown> => {
  return {
    labels: labels,
    datasets: [
      {
        borderColor: borderColors,
        borderWidth: borderColors && borderColors.length > 0 ? 1 : 0,
        data: numbers,
        backgroundColor: colors,
        type: 'doughnut',
        indexAxis: 'x',
      },
    ],
  }
}

export const getPieChartOptions = (title: string, data: BarChart): ChartOptions<'doughnut'> => {
  return {
    responsive: true,
    rotation: 180,

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
        display: true,
        labels: {
          color: DarkBlue,
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

    /* scales: {
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
    }, */
  }
}