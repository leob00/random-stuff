import { ChartData, ChartOptions } from 'chart.js'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoMoreBlackTransparent,
  CasinoWhiteTransparent,
  ChartBackground,
  DarkBlue,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { max } from 'lodash'

export interface BarChart {
  labels: string[]
  numbers: number[]
  colors: string[]
  borderColors?: string[]
}

export const getBarChartData = (labels: string[], numbers: number[], colors: string[], yAxisDecorator = ''): ChartData<'bar', number[], unknown> => {
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

export const getBarChartOptions = (title: string, data: BarChart, yAxisDecorator = '', colors: string[]): ChartOptions<'bar'> => {
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
            return ` ${[tooltipItems.label]}: ${Number(tooltipItems.formattedValue).toFixed(2)}${yAxisDecorator}`
          },
          labelPointStyle: (tooltiipItems) => {
            return {
              pointStyle: 'circle',
              rotation: 0,
              border: 4,
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
          color: CasinoBlue,
          font: {
            size: 14,
            weight: '400',
          },
          callback(tickValue, index, ticks) {
            return `${tickValue}${yAxisDecorator}`
          },
          autoSkip: true,
          stepSize: 10,
          //precision: 1,
          maxTicksLimit: max(data?.numbers),
        },
        grid: {
          display: true,
          color: VeryLightBlueTransparent,
          //color: "red"
        },
      },
      x: {
        display: true,
        ticks: {
          color: CasinoBlue,
          font: {
            size: 14,
            weight: '600',
          },

          // textStrokeColor(ctx, options) {
          //   return `${colors[ctx.index]}`
          // },
        },
        grid: {
          display: false,
          color: VeryLightBlueTransparent,
          //color: "red"
        },
      },
    },
  }
}
