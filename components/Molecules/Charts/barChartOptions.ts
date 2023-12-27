import { ChartData, ChartOptions } from 'chart.js'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  ChartBackground,
  DarkBlue,
  VeryLightBlue,
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

        //indexAxis: 'y',
      },
    ],
  }
}

export const getBarChartOptions = (
  title: string,
  data: BarChart,
  yAxisDecorator = '',
  colors: string[],
  palette: 'light' | 'dark',
  isHorizontal?: boolean,
): ChartOptions<'bar'> => {
  return {
    responsive: true,
    indexAxis: isHorizontal ? 'y' : 'x',
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      title: {
        display: true,
        text: title,
        color: palette === 'light' ? CasinoRedTransparent : VeryLightBlue,
      },
      legend: {
        display: false,
        labels: {
          color: palette === 'light' ? 'rgba(203, 241, 247, 0.932)' : VeryLightBlueTransparent,
        },
        title: {
          display: true,
          color: palette === 'light' ? 'rgba(203, 241, 247, 0.932)' : VeryLightBlueTransparent,
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
          //padding: 2,
          color: palette === 'light' ? CasinoBlue : VeryLightBlueTransparent,
          font: {
            // size: 10,
            //weight: '400',
          },
          // callback(tickValue, index, ticks) {
          //   return `${tickValue}${yAxisDecorator}`
          // },
          autoSkip: true,
          //stepSize: 20,
          //precision: 1,
          maxTicksLimit: max(data?.numbers),
        },
        grid: {
          display: !isHorizontal,
          //color: VeryLightBlueTransparent,
          //color: "red"
        },
      },
      x: {
        display: true,

        ticks: {
          padding: 0,
          color: palette === 'light' ? CasinoBlue : VeryLightBlueTransparent,
          // font: {
          //   size: 14,
          //   weight: '600',
          // },

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
