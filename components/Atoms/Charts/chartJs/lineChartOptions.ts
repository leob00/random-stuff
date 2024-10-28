import { ChartOptions } from 'chart.js'
import { LineChart } from './barChartOptions'
import { CasinoBlue, DarkBlue, VeryLightBlue, VeryLightBlueTransparent } from 'components/themes/mainTheme'

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
        color: palette === 'light' ? DarkBlue : VeryLightBlue,
      },
      filler: {
        propagate: false,
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
    interaction: {
      intersect: true,
    },
    scales: {
      y: {
        ticks: {
          color: palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 12,
          },
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
          color: palette === 'light' ? CasinoBlue : VeryLightBlueTransparent,
        },
        grid: {
          display: true,
          color: VeryLightBlueTransparent,
        },
      },
    },
  }
}
