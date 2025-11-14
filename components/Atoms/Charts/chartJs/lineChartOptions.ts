import { ChartOptions } from 'chart.js'
import { LineChart } from './barChartOptions'
import { DarkBlue, TooltipBkg, VeryLightBlue, VeryLightBlueOpaqueLight, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { max, min } from 'lodash'

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
    scales: {
      y: {
        grid: {
          color: VeryLightBlueOpaqueLight,
          drawTicks: false,
        },
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
        min: lineChartData.labels[0],
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
          padding: 20,
          color: palette === 'light' ? DarkBlue : VeryLightBlue,

          font: {
            size: 11,
          },
          callback(tickValue, index, ticks) {
            if (index % 2 !== 0) {
              return lineChartData.labels[index]
            }

            return ''
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
