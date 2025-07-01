import { ApexOptions } from 'apexcharts'
import {
  CasinoBlack,
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoGreenTransparent,
  CasinoLimeTransparent,
  CasinoRedTransparent,
  DarkBlue,
  DarkModeBlue,
  RedDarkMode,
  VeryLightBlue,
  VeryLightBlueTransparent,
} from 'components/themes/mainTheme'
import numeral from 'numeral'
import { XyValues } from './chartModels'

export type LineChartOptions = {
  raw: any[]
  isXSmall: boolean
  palette: 'light' | 'dark'
  yLabelPrefix: string
  toolTipFormatter?: (val: number, opts: any) => string
  changePositiveColor?: boolean
  seriesName?: string
  groupName?: string
  chartId?: string
  numericFormatter?: (num: number) => string
  enableAxisXTooltip?: boolean
  reverseColor?: boolean
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
  let lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreenTransparent
  if (items.length > 0) {
    if (items[0] > items[items.length - 1]) {
      lineColor = palette === 'dark' ? RedDarkMode : CasinoRedTransparent
    }
  }
  return lineColor
}

export function getPositiveNegativeLineColorReverse(palette: 'light' | 'dark' = 'light', items: number[]) {
  let lineColor = palette === 'dark' ? RedDarkMode : CasinoRedTransparent
  if (items.length > 0) {
    if (items[0] > items[items.length - 1]) {
      lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreenTransparent
    }
  }
  return lineColor
}

export function getBaseLineChartOptions(items: XyValues, lineOptions: LineChartOptions) {
  const defaultTooltipFormatter = (val: number, opts: any) => {
    if (lineOptions.numericFormatter) {
      return lineOptions.numericFormatter(val)
    }
    return ` ${numeral(val).format('###,###.00')} `
  }

  const selectedTooltipFormatter = lineOptions.toolTipFormatter ?? defaultTooltipFormatter
  let lineColor = lineOptions.palette === 'dark' ? CasinoBlue : CasinoBlueTransparent

  if (lineOptions.changePositiveColor) {
    lineColor = !lineOptions.reverseColor
      ? getPositiveNegativeLineColor(lineOptions.palette, items.y)
      : getPositiveNegativeLineColorReverse(lineOptions.palette, items.y)
  }
  let strokeWidth = 2

  if (lineOptions.raw.length >= 300) {
    strokeWidth = 1.2
  } else if (lineOptions.raw.length >= 60) {
    strokeWidth = 1.75
  }

  const options: ApexOptions = {
    chart: { ...getBaseChart(lineOptions.groupName ?? 'group', lineOptions.palette, lineOptions.chartId), zoom: { enabled: false } },
    title: {
      text: lineOptions.seriesName,
      align: 'center',
      style: {
        fontWeight: 100,
      },
    },
    series: [
      {
        name: lineOptions.seriesName ?? '',
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

    grid: getBaseGrid(lineOptions.palette),
    yaxis: getBaseYAxis(lineOptions),
    xaxis: {
      ...getBaseXAxis(items.x),
      tooltip: {
        enabled: lineOptions.enableAxisXTooltip ?? true,
      },
    },
    tooltip: {
      //cssClass: 'arrow_box',
      theme: undefined,
      marker: {
        fillColors: [lineColor],
      },
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
  // if (changePositiveColor) {
  //   lineColor = palette === 'dark' ? CasinoLimeTransparent : CasinoGreen
  // }

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
  const yAxis = getBaseYAxis({
    isXSmall: isXSmall,
    palette: palette,
    raw: raw,
    yLabelPrefix: yLabelPrefix,
  })
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
    xaxis: { ...getBaseXAxis(items[items.length - 1].x), tooltip: { enabled: false } },
    tooltip: {
      cssClass: 'arrow_box',
      fillSeriesColor: false,
      theme: undefined,
      marker: {},
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

export function getBaseChart(groupName: string, palette: 'light' | 'dark', chartId?: string) {
  const chart: ApexChart = {
    locales: [
      {
        name: 'es',
      },
    ],
    defaultLocale: 'es',
    type: 'line',
    id: chartId,
    group: groupName,
    dropShadow: {
      enabled: true,
      top: 2,
      left: 1,
      blur: 1,
      color: CasinoBlack,
    },
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

export function getBaseGrid(palette: 'light' | 'dark') {
  const result: ApexGrid = {
    show: true,
    borderColor: palette === 'dark' ? VeryLightBlueTransparent : VeryLightBlueTransparent,
    strokeDashArray: 0,
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

function getBaseYAxis(opts: LineChartOptions) {
  const result: ApexYAxis = {
    forceNiceScale: true,

    labels: {
      show: true,
      style: {
        colors: opts.palette === 'dark' ? [VeryLightBlue] : [DarkBlue],
        fontWeight: opts.isXSmall ? 300 : 400,
        fontSize: opts.isXSmall ? '10px' : '15px',
      },
      minWidth: 40,
      formatter: (val: number) => {
        if (opts.numericFormatter) {
          return opts.numericFormatter(val)
        }
        return `${opts.yLabelPrefix}${numeral(val).format('###,###.00')}`
      },
    },
  }
  return result
}

export function getBaseXAxis(categories: string[]) {
  const result: ApexXAxis = {
    labels: {
      show: false,
      formatter: (val, timestamp, opts) => {
        return val
      },
    },
    categories: categories,
    axisTicks: { show: false, borderType: 'none', color: 'red' },
    axisBorder: {
      show: false,
    },
    tooltip: {
      enabled: true,
    },
  }
  return result
}
