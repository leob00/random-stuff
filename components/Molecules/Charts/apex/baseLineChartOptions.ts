import { ApexOptions } from 'apexcharts'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoGreen,
  CasinoLimeTransparent,
  CasinoRed,
  DarkBlue,
  DarkModeBlue,
  RedDarkMode,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import { XyValues } from './models/chartModes'

export function getPositiveNegativeLineColor(palette: 'light' | 'dark' = 'light', items: number[]) {
  let lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreen
  if (items.length > 0) {
    if (items[0] > items[items.length - 1]) {
      lineColor = palette === 'dark' ? RedDarkMode : CasinoRed
    }
  }
  return lineColor
}

export function getBaseLineChartOptions(
  items: XyValues,
  raw: any[],
  isXSmall: boolean,
  palette: 'light' | 'dark' = 'light',
  yLabelPrefix: string = '$',
  toolTipFormatter?: (val: number, opts: any) => string,
  changePositiveColor = true,
  seriesName = '',
) {
  const defaultTooltipFormatter = (val: number, opts: any) => {
    return ` ${val}`
  }

  const selectedTooltipFormatter = toolTipFormatter ?? defaultTooltipFormatter
  let lineColor = palette === 'dark' ? CasinoBlue : CasinoBlueTransparent
  if (changePositiveColor) {
    lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreen
  }

  if (changePositiveColor) {
    lineColor = getPositiveNegativeLineColor(palette, items.y)
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
  const series: ApexAxisChartSeries = [
    {
      name: seriesName ?? '',
      data: items.y,
      color: lineColor,
    },
  ]

  const options: ApexOptions = {
    series: series,
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
        formatter: selectedTooltipFormatter,
      },
    },
  }
  return options
}

export function getMulitiLineChartOptions(
  items: XyValues[],
  raw: any[],
  isXSmall: boolean,
  palette: 'light' | 'dark' = 'light',
  yLabelPrefix: string = '$',
  toolTipFormatter?: (val: number, opts: any) => string,
  changePositiveColor = true,
) {
  const defaultTooltipFormatter = (val: number, opts: any) => {
    return ` ${val}`
  }

  const selectedTooltipFormatter = toolTipFormatter ?? defaultTooltipFormatter
  let lineColor = palette === 'dark' ? CasinoBlue : CasinoBlueTransparent
  if (changePositiveColor) {
    lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreen
  }

  if (changePositiveColor) {
    lineColor = getPositiveNegativeLineColor(palette, items[0].y)
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
  const series: ApexAxisChartSeries = items.map((item) => {
    return {
      name: item.name ?? '',
      data: item.y,
      color: changePositiveColor ? getPositiveNegativeLineColor(palette, item.y) : lineColor,
    }
  })

  const options: ApexOptions = {
    series: series,
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
      categories: items[0].x,
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
          formatter(seriesName: string) {
            return ` ${seriesName}`
          },
        },
        formatter: selectedTooltipFormatter,
      },
    },
  }
  return options
}
