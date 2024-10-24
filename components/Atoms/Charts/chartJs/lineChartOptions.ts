import { ChartOptions } from 'chart.js'
import { LineChart } from './barChartOptions'
import {
  CasinoBlue,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  VeryLightBlue,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { max } from 'lodash'

export const getLineChartOptions = (title: string, data: LineChart, yAxisDecorator = '', palette: 'light' | 'dark'): ChartOptions<'line'> => {
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
        //color: palette === 'light' ? CasinoRedTransparent : VeryLightBlue,
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
        //backgroundColor: CasinoMoreBlackTransparent,
        //titleColor: CasinoWhiteTransparent,
        footerAlign: 'center',
        footerSpacing: 2,
        footerMarginTop: 10,
        footerFont: {
          size: 15,
        },

        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        //sePointStyle: true,
        //footerColor: 'white',

        callbacks: {
          title: (tooltipItems) => {
            return 'title'
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}`
          },
          labelPointStyle: (tooltiipItems) => {
            return {
              pointStyle: 'circle',
              rotation: 0,
              border: 2,
            }
          },
          afterTitle: (tooltipItems) => {
            return `after title`
          },
          afterLabel: (tooltipItems) => {
            return `after label`
          },

          afterBody: (tooltipItems) => {
            return tooltipItems[0].formattedValue
          },
          footer: (tooltipItems) => {
            //return 'yo'
            return tooltipItems[0].formattedValue
          },
          afterFooter: (tooltipItems) => {
            return 'after footer'
          },
        },
      },
    },
    // interaction: {
    //   mode: 'index',
    //   intersect: false,
    // },
    scales: {
      y: {
        ticks: {
          //padding: 2,
          color: palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 12,
          },

          // callback(tickValue, index, ticks) {
          //   return `${tickValue}${yAxisDecorator}`
          // },
          //autoSkip: true,
          //stepSize: 20,
          //precision: 1,
          //maxTicksLimit: max(data?.numbers),
        },
        grid: {
          display: true,
          color: VeryLightBlueTransparent,
          //color: "red"
        },
      },
      x: {
        display: false,

        ticks: {
          //precision: 250,
          //sampleSize: 300,
          // padding: 20,
          // autoSkip: true,
          // maxTicksLimit: 10,
          //autoSkip: true,
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
          display: true,
          color: VeryLightBlueTransparent,
          //color: "red"
        },
      },
    },
  }
}
