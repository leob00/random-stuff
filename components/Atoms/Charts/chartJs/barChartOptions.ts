import { ChartData, ChartOptions } from 'chart.js'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoMoreBlackTransparent,
  CasinoRed,
  DarkBlue,
  TooltipBkg,
  VeryLightBlue,
  VeryLightBlueOpaque,
  VeryLightBlueOpaqueLight,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { max, min } from 'lodash'

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
export const getLineChartData = (labels: string[], numbers: number[], colors: string[]): ChartData<'line', number[], unknown> => {
  return {
    labels: labels,
    datasets: [
      {
        borderColor: CasinoBlue,
        borderWidth: 2,
        data: numbers,
        type: 'line',
        animation: {
          easing: 'linear',
        },
        tension: 0.2,
        pointStyle: 'circle',
      },
    ],
  }
}

interface MultiSeriesChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    type: 'bar' | 'line'
    backgroundColor?: string
    borderColor?: string
  }[]
}

export const getBarLineChartConfig = (labels: string[], numbers: number[], colors: string[]) => {
  const result: MultiSeriesChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Bar',
        borderColor: 'black',
        data: numbers,
        backgroundColor: colors[0],
        type: 'bar' as const,
      },
      {
        label: 'Line',
        backgroundColor: colors[0],
        borderColor: CasinoBlueTransparent,
        data: numbers,
        type: 'line' as const,
      },
    ],
  }
  return result
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
          color: palette === 'light' ? 'rgba(203, 241, 247, 0.932)' : VeryLightBlue,
        },
        title: {
          display: true,
          color: palette === 'light' ? 'rgba(203, 241, 247, 0.932)' : VeryLightBlue,
        },
      },
      tooltip: {
        padding: 16,
        backgroundColor: TooltipBkg,
        titleColor: VeryLightBlue,
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
        footerColor: palette === 'light' ? VeryLightBlue : VeryLightBlue,
        bodyColor: palette === 'light' ? VeryLightBlue : VeryLightBlue,
        mode: 'nearest',
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}: ${Number(tooltipItems.formattedValue).toFixed(2)}${yAxisDecorator}`
          },
          labelPointStyle: (context) => {
            return {
              pointStyle: 'circle',
              rotation: 180,
              borderColor: 'rgba(0,0,0,0)',
              border: 0,
              backgroundColor: context.dataset.backgroundColor,
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
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          font: {
            size: 12,
          },
          autoSkip: true,
          padding: 8,
          callback: function (value) {
            return `${value}${yAxisDecorator}`
          },
        },
      },
      x: {
        type: 'category',
        display: showXvalues ?? true,
        ticks: {
          padding: 0,
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          font: {
            size: 11,
          },
          autoSkip: true,
        },
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: true,
        },
      },
    },
  }
}

export const getLineChartOptions = (
  lineChartData: LineChart,
  title: string,
  yAxisDecorator = '',
  palette: 'light' | 'dark',
  showXvalues?: boolean,
): ChartOptions<'line'> => {
  return {
    responsive: true,
    animation: {
      easing: 'linear',
      duration: 1500,
    },
    // layout: {
    //   autoPadding: true,
    // },
    //maintainAspectRatio: true,
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
        titleColor: VeryLightBlue,
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
        footerColor: palette === 'light' ? VeryLightBlue : VeryLightBlue,
        bodyColor: palette === 'light' ? VeryLightBlue : VeryLightBlue,
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
        // min: 0, // Math.floor(min(lineChartData.numbers)!),
        //max: Math.ceil(max(lineChartData.numbers)!) + 8,
        suggestedMax: Math.ceil(max(lineChartData.numbers)!) + 8,
        suggestedMin: min(lineChartData.numbers)! > 0 ? min(lineChartData.numbers)! - 1 : Math.floor(min(lineChartData.numbers)! - 9),
        ticks: {
          align: 'start',
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          font: {
            size: 12,
          },
          padding: 12,
          autoSkip: true,
          callback: function (value) {
            return `${value}${yAxisDecorator}`
          },
        },
      },
      x: {
        display: showXvalues ?? true,
        type: 'category',
        ticks: {
          //align: 'end',
          padding: 20,
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          autoSkipPadding: 4,
          font: {
            size: 11,
          },
          // callback(tickValue, index, ticks) {
          //   if (index % 2 === 0) {
          //     return lineChartData.labels[index]
          //   }

          //   return ''
          // },
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
