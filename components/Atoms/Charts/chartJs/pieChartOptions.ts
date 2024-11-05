import { ChartData, ChartOptions } from 'chart.js'
import { CasinoBlue, CasinoMoreBlackTransparent, CasinoWhiteTransparent, DarkBlue, VeryLightBlue } from 'components/themes/mainTheme'

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

export const getPieChartOptions = (title: string, palette: 'light' | 'dark'): ChartOptions<'doughnut'> => {
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
        color: palette === 'light' ? CasinoBlue : VeryLightBlue,
        font: {
          size: 18,
          weight: 300,
        },
      },
      legend: {
        display: true,
        labels: {
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
        },
        title: {
          display: true,
          color: CasinoWhiteTransparent,
        },
      },
      tooltip: {
        padding: 16,
        backgroundColor: CasinoMoreBlackTransparent,
        titleColor: VeryLightBlue,
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
        usePointStyle: true,
        footerColor: VeryLightBlue,
        bodyColor: VeryLightBlue,
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}: ${tooltipItems.formattedValue}%`
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
