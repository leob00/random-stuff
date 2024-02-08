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
  VeryLightBlue,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import numeral from 'numeral'
import { XyValues } from './models/chartModes'

function getBaseChart(groupName: string, palette: 'light' | 'dark', chartId?: string) {
  const chart: ApexChart = {
    id: chartId,
    group: groupName,
    dropShadow: {
      enabled: true,
      top: 16,
      left: 7,
      blur: 10,
      //opacity: 0.2,
    },
    background: palette === 'dark' ? DarkModeBlue : 'transparent',
    type: 'area',
    toolbar: {
      show: false,
    },
    animations: {
      easing: 'easeout',
    },
    foreColor: palette === 'dark' ? VeryLightBlue : DarkModeBlue,
  }
  return chart
}

function getBaseGrid(palette: 'light' | 'dark') {
  const result: ApexGrid = {
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
  }
  return result
}

function getBaseYAxis(palette: 'light' | 'dark', isXSmall: boolean, yLabelPrefix: string) {
  const result: ApexYAxis = {
    labels: {
      style: {
        colors: palette === 'dark' ? [VeryLightBlue] : [DarkBlue],
        fontWeight: isXSmall ? 300 : 600,
        fontSize: isXSmall ? '8px' : '15px',
      },
      formatter: (val: number) => {
        return `${yLabelPrefix}${numeral(val).format('###,###.00')}`
      },
    },
  }
  return result
}

function getBaseXAxis(categories: string[]) {
  const result: ApexXAxis = {
    labels: {
      show: false,
      formatter: (val) => {
        return val
      },
    },
    categories: categories,
    axisTicks: { show: false, borderType: 'none', color: 'red' },
    axisBorder: {
      show: false,
    },
  }
  return result
}

const lineFill: ApexFill = {
  type: 'gradient',
  gradient: {
    shadeIntensity: 4,
    opacityFrom: 0.9,
    opacityTo: 0.1,
    stops: [10, 99, 100],
  },
}

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
  groupName = 'group',
  chartId?: string,
) {
  const defaultTooltipFormatter = (val: number, opts: any) => {
    if (!opts) {
      return ''
    }
    return ` ${numeral(val).format('###,###.00')}`
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

  const options: ApexOptions = {
    title: {
      text: seriesName,
      align: 'center',
    },
    series: [
      {
        name: seriesName ?? '',
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
    fill: lineFill,
    chart: { ...getBaseChart(groupName, palette, chartId), zoom: { enabled: false } },
    grid: getBaseGrid(palette),
    yaxis: getBaseYAxis(palette, isXSmall, yLabelPrefix),
    xaxis: getBaseXAxis(items.x),
    tooltip: {
      cssClass: 'arrow_box',
      fillSeriesColor: false,
      theme: undefined,
      // marker: {
      //   fillColors: [lineColor],
      // },
      style: {
        fontSize: '16px',
      },
      y: {
        title: {
          formatter(val) {
            return ` ${val}`
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
  const result: ApexOptions = {}

  const defaultTooltipFormatter = (val: number, opts: any) => {
    return ` ${numeral(val).format('###,###.00')}`
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
  const series: ApexAxisChartSeries = items.map((item, i) => {
    let color = item.color ?? (changePositiveColor ? getPositiveNegativeLineColor(palette, item.y) : lineColor)
    return {
      name: item.name ?? '',
      data: item.y,
      color: color,
    }
  })
  //console.log('max: ', max(items.flatMap((m) => m.y)))
  const yAxis = getBaseYAxis(palette, isXSmall, '')
  const options: ApexOptions = {
    series: series,
    stroke: {
      width: strokeWidth,
    },
    dataLabels: {
      enabled: false,
    },
    fill: lineFill,
    chart: { ...getBaseChart('group', palette), zoom: { enabled: false } },
    grid: getBaseGrid(palette),
    yaxis: { ...yAxis, forceNiceScale: true },
    xaxis: { ...getBaseXAxis(items[items.length - 1].x) },
    tooltip: {
      cssClass: 'arrow_box',
      fillSeriesColor: false,
      theme: undefined,
      marker: {
        //fillColors: [lineColor],
      },
      style: {
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
