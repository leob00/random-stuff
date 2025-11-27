import { ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { LineChart } from './barChartOptions'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  DarkBlue,
  TooltipBkg,
  VeryLightBlue,
  VeryLightBlueOpaque,
  VeryLightBlueOpaqueLight,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { max, min } from 'lodash'
import numeral from 'numeral'
import dayjs from 'dayjs'
import { calculateTotalByPercent } from 'lib/util/numberUtil'

export const getLineChartOptions = (
  lineChartData: LineChart,
  title: string,
  yAxisSuffix = '',
  palette: 'light' | 'dark',
  showXvalues?: boolean,
  isExtraSmall?: boolean,
  isXSmallDevice?: boolean,
): ChartOptions<'line'> => {
  let yMin = min(lineChartData.numbers) ?? 0

  if (yMin > 0) {
    yMin = Math.floor(calculateTotalByPercent(yMin, -1))
  }
  let yMax = max(lineChartData.numbers) ?? 0
  if (yMax > 0) {
    yMax = calculateTotalByPercent(yMax, 1)
  }

  return {
    //aspectRatio: 1,
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      easing: 'linear',
      duration: 1500,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      y: {
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: false,
        },
        suggestedMax: yMax,
        suggestedMin: yMin, //min(lineChartData.numbers),
        ticks: {
          align: 'start',
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          font: {
            size: isExtraSmall || isXSmallDevice ? 10 : 11,
          },
          padding: isExtraSmall || isXSmallDevice ? 6 : 8,
          autoSkip: true,
          callback: function (value) {
            return `${numeral(value).format('###,### 0.00')}${yAxisSuffix}`
          },
        },
      },
      x: {
        min: lineChartData.labels[0],
        max: lineChartData.labels[lineChartData.labels.length - 1],
        display: showXvalues ?? true,
        type: 'category',

        // time: {
        //   unit: 'day',
        //   displayFormats: {
        //     day: 'MM/DD/YYYY',
        //   },
        // },
        ticks: {
          //source: 'data',
          align: isExtraSmall || isXSmallDevice ? 'inner' : 'start',
          maxTicksLimit: isExtraSmall || isXSmallDevice ? 2 : 8,
          padding: isExtraSmall || isXSmallDevice ? 8 : 20,
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          //minRotation: isExtraSmall ? 1 : 0,
          font: {
            size: !isExtraSmall ? 11 : 12,
          },
          callback(tickValue, index, ticks) {
            if (showXvalues) {
              //return dayjs(lineChartData.labels[index]).format('MM/DD/YYYY')
              if (isExtraSmall || isXSmallDevice) {
                if (index === 0 || index === lineChartData.labels.length - 1) {
                  return dayjs(lineChartData.labels[index]).format('MM/DD/YYYY')
                }
              } else {
                return dayjs(lineChartData.labels[index]).format('MM/DD/YYYY')
              }
            }
          },
        },

        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: true,
        },
      },
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
        callbacks: {
          title: (tooltipItems) => {
            return ''
          },
          label: (tooltipItems) => {
            return ` ${[tooltipItems.label]}: ${Number(tooltipItems.formattedValue).toFixed(2)}${yAxisSuffix}`
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
  }
}

export const getLineChartData = (labels: string[], numbers: number[], colors: string[], isXSmallDevice?: boolean): ChartData<'line', number[], unknown> => {
  return {
    labels: labels,
    datasets: [
      {
        borderColor: colors ?? CasinoBlue,
        borderWidth: 1,
        data: numbers,
        type: 'line',
        animation: {
          easing: 'linear',
        },
        tension: 0.4,
        pointStyle: 'circle',
        pointBorderWidth: 0,
        pointRadius: isXSmallDevice ? 3.4 : 3,
        pointBackgroundColor: colors ?? CasinoBlue,
        pointHoverRadius: 8,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(10, 10, 10, 500)
          gradient.addColorStop(0, CasinoBlueTransparent)
          gradient.addColorStop(1, VeryLightBlueOpaque)
          return gradient
        },
        fill: true,
      },
    ],
  }
}
