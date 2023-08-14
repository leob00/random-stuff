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
  CasinoBlue,
} from 'components/themes/mainTheme'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'

export function getOptions(items: XyValues, raw: any[], isXSmall: boolean, palette: 'light' | 'dark' = 'light') {
  let lineColor = palette === 'dark' ? VeryLightBlue : CasinoBlue

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
      background: DarkModeBlue,
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
          return `${val.toFixed(1)} minutes`
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
      },
    },
  }
  return options
}
