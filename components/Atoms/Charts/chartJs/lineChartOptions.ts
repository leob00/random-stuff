import { ChartOptions } from 'chart.js'
import { LineChart } from './barChartOptions'
import { DarkBlue, TooltipBkg, VeryLightBlue, VeryLightBlueOpaqueLight, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { max, min } from 'lodash'
import numeral from 'numeral'
import dayjs from 'dayjs'

export const getLineChartOptions = (
  lineChartData: LineChart,
  title: string,
  yAxisDecorator = '',
  palette: 'light' | 'dark',
  showXvalues?: boolean,
  isExtraSmall?: boolean,
  isXSmallDevice?: boolean,
): ChartOptions<'line'> => {
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
        suggestedMax: Math.ceil(max(lineChartData.numbers)!) + 0.1,
        suggestedMin: min(lineChartData.numbers)! > 0 ? min(lineChartData.numbers)! - 1 : Math.floor(min(lineChartData.numbers)! - 3),
        ticks: {
          align: 'start',
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          font: {
            size: isExtraSmall || isXSmallDevice ? 10 : 11,
          },
          padding: isExtraSmall || isXSmallDevice ? 6 : 8,
          autoSkip: true,
          callback: function (value) {
            return `${numeral(value).format('###,### 0.00')}${yAxisDecorator}`
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
          maxTicksLimit: isExtraSmall || isXSmallDevice ? 4 : 8,
          padding: isExtraSmall || isXSmallDevice ? 8 : 20,
          color: palette === 'light' ? DarkBlue : VeryLightBlue,
          //minRotation: isExtraSmall ? 1 : 0,
          font: {
            size: !isExtraSmall ? 11 : 12,
          },
          callback(tickValue, index, ticks) {
            if (showXvalues) {
              if (isExtraSmall || isXSmallDevice) {
                if (index === 0 || index === lineChartData.labels.length - 1) {
                  return lineChartData.labels[index]
                }
              } else {
                return lineChartData.labels[index]
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
  }
}
