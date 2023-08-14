import { ApexOptions } from 'apexcharts'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import {
  CasinoGreen,
  CasinoRed,
  VeryLightBlueTransparent,
  DarkBlue,
  VeryLightBlue,
  DarkModeBlue,
  RedDarkMode,
  CasinoLimeTransparent,
  CasinoRedTransparent,
} from 'components/themes/mainTheme'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'

export function getOptions(items: XyValues, raw: StockHistoryItem[], isXSmall: boolean, palette: 'light' | 'dark' = 'light') {
  let lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreen

  if (items.y.length > 0) {
    if (items.y[0] > items.y[items.y.length - 1]) {
      lineColor = palette === 'dark' ? RedDarkMode : CasinoRed
    }
  }
  let strokeWidth = 3
  if (raw.length <= 200) {
    strokeWidth = 2
  } else {
    if (raw.length >= 60) {
      strokeWidth = 1.75
    } else if (raw.length >= 10) {
      strokeWidth = 2
    } else {
      strokeWidth = 3.3
    }
  }

  const options: ApexOptions = {
    series: [
      {
        name: '',
        data: items.y,
        color: lineColor,
      },
    ],
    stroke: {
      width: strokeWidth,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 4,
        opacityFrom: 0.9,
        opacityTo: 0.1,
        stops: [10, 99, 100],
      },
    },
    chart: {
      //height: 280,
      //background: VeryLightBlueTransparent,
      type: 'area',
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeout',
      },
      foreColor: lineColor,
    },
    grid: {
      show: true,
      borderColor: palette === 'dark' ? VeryLightBlueTransparent : VeryLightBlue,
      strokeDashArray: 1,
      // column: {
      //   colors: palette === 'dark' ? [DarkModeBlue] : [DarkModeBlue],
      //   opacity: 0.5,
      // },
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: palette === 'dark' ? [VeryLightBlue] : [DarkBlue],
          fontWeight: isXSmall ? 300 : 600,
          fontSize: isXSmall ? '8px' : '15px',
        },

        formatter: (val: number) => {
          return `$${val.toFixed(2)}`
        },
      },
    },
    xaxis: {
      //type: 'datetime',
      //max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: false,
        formatter: (val) => {
          return val
        },
      },
      //tickAmount: Math.floor(items.x.length / (items.x.length / 12)),
      categories: items.x,
      axisTicks: { show: false, borderType: 'none', color: 'red' },
      //tickAmount: 20,
      axisBorder: {
        show: false,
        //color: CasinoBlueTransparent,
      },
    },
    tooltip: {
      cssClass: 'arrow_box',
      fillSeriesColor: false,
      theme: undefined,
      marker: {
        fillColors: [lineColor],
      },
      style: {
        //fontFamily: '-apple-system, Roboto',
        fontSize: '16px',
      },

      y: {
        title: {
          formatter(seriesName) {
            return ` ${seriesName}`
          },
        },
        formatter: (val: number, opts: any) => {
          if (raw.length === 0) {
            return ''
          }

          const change =
            raw[opts.dataPointIndex].Change! > 0 ? `+$${raw[opts.dataPointIndex].Change?.toFixed(2)}` : `${raw[opts.dataPointIndex].Change?.toFixed(2)}`
          return `$${raw[opts.dataPointIndex].Price.toFixed(2)}   ${change}   ${raw[opts.dataPointIndex].ChangePercent}% `
        },
      },
    },
  }
  return options
}
