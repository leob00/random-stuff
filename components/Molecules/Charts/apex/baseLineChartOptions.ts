import { ApexOptions } from 'apexcharts'
import { CasinoGreen, CasinoLimeTransparent, CasinoRed, DarkBlue, DarkModeBlue, RedDarkMode, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import { XyValues } from './models/chartModes'

export function getBaseLineChartOptions(
  items: XyValues,
  raw: any[],
  isXSmall: boolean,
  palette: 'light' | 'dark' = 'light',
  yLabelPrefix: string = '$',
  toolTipFormatter?: (val: number, opts: any) => string,
) {
  const defaultTooltipFormatter = (val: number, opts: any) => {
    return ` ${val}`
  }

  const selectedTooltipFormatter = toolTipFormatter ?? defaultTooltipFormatter

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
      dropShadow: {
        enabled: true,
      },
      background: palette === 'dark' ? DarkModeBlue : 'transparent',
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
      borderColor: palette === 'dark' ? VeryLightBlueTransparent : VeryLightBlueTransparent,
      strokeDashArray: 3,
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
          colors: palette === 'dark' ? [VeryLightBlueTransparent] : [DarkBlue],
          fontWeight: isXSmall ? 300 : 600,
          fontSize: isXSmall ? '8px' : '15px',
        },

        formatter: (val: number) => {
          return `${yLabelPrefix}${val.toFixed(2)}`
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
        formatter: toolTipFormatter,
      },
    },
  }
  return options
}
