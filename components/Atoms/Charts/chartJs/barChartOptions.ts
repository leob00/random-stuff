import { ChartData, ChartOptions } from 'chart.js'
import {
  CasinoBlackTransparent,
  CasinoBlue,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  DarkBlue,
  DarkModeBlue,
  DarkModeBlueTransparent,
  VeryLightBlue,
  VeryLightBlueOpaque,
  VeryLightBlueOpaqueLight,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { max } from 'lodash'

export interface LineChart {
  labels: string[]
  numbers: number[]
}

export interface BarChart extends LineChart {
  colors: string[]
  borderColors?: string[]
  rawData?: unknown[]
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
      },
    ],
  }
}

export const getBarChartOptions = (
  title: string,
  yAxisDecorator = '',
  palette: 'light' | 'dark',
  isHorizontal?: boolean,
  showXvalues?: boolean,
): ChartOptions<'bar'> => {
  return {
    responsive: true,
    animation: {
      easing: 'linear',
      duration: 1500,
    },
    maintainAspectRatio: true,
    indexAxis: isHorizontal ? 'y' : 'x',
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
          weight: 200,
        },
        color: palette === 'light' ? DarkBlue : VeryLightBlue,
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
        footerAlign: 'left',
        footerSpacing: 10,
        footerMarginTop: 1,
        footerFont: {
          weight: 200,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        bodySpacing: 10,
        bodyAlign: 'left',
        usePointStyle: true,
        footerColor: palette === 'light' ? DarkBlue : VeryLightBlue,
        bodyColor: palette === 'light' ? DarkBlue : VeryLightBlue,
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
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: false,
        },

        ticks: {
          color: palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 12,
          },
          autoSkip: true,
        },
      },
      x: {
        display: showXvalues ?? true,
        ticks: {
          padding: 0,
          color: palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 12,
          },
        },
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: true,
        },
      },
    },
  }
}

export type BarchartSettings = {
  palette: 'light' | 'dark'
  showLegend: boolean
  title?: string
  ySuffix?: string
}

export function getMultiDatasetBarChartOptions(settings: BarchartSettings): ChartOptions<'bar'> {
  const result: ChartOptions<'bar'> = {
    animation: {
      easing: 'linear',
      duration: 1000,
    },
    scales: {
      x: {
        grid: {
          color: VeryLightBlueOpaque,
          drawTicks: true,
        },
        ticks: {
          color: settings.palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: false,
        },
        ticks: {
          color: settings.palette === 'light' ? CasinoBlue : VeryLightBlue,
          font: {
            size: 11,
          },

          callback: (tickValue, index, ticks) => {
            return `${tickValue}${settings.ySuffix ?? '%'}`
          },
        },
      },
    },
    indexAxis: 'x',
    responsive: true,
    plugins: {
      title: {
        padding: {
          bottom: 50,
          top: 10,
        },
        font: {
          size: 18,
          weight: 300,
        },
        display: !!settings.title,
        text: settings.title ?? '',
        color: settings.palette === 'light' ? CasinoBlue : VeryLightBlue,
      },
      legend: {
        display: settings.showLegend,
        fullSize: true,
        position: 'top',
        labels: {
          padding: 8,
          color: settings.palette === 'light' ? CasinoBlue : VeryLightBlue,
        },
      },
      tooltip: {
        padding: 16,
        backgroundColor: CasinoMoreBlackTransparent,
        titleColor: VeryLightBlue,
        footerAlign: 'left',
        footerSpacing: 8,
        footerMarginTop: 4,
        footerFont: {
          weight: 200,
        },
        bodyFont: {
          size: 16,
          weight: 'bold',
        },
        bodySpacing: 10,
        bodyAlign: 'left',
        usePointStyle: true,
        footerColor: VeryLightBlue,
        bodyColor: VeryLightBlue,
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}`
          },
          labelPointStyle: (tooltiipItems) => {
            return {
              pointStyle: 'circle',
              rotation: 0,
              border: 4,
            }
          },
        },
      },
    },
  }
  return result
}
