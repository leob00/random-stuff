import { Breakpoint } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { getBaseGrid, getBaseXAxis } from 'components/Atoms/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import theme, { DarkBlue, VeryLightBlue, DarkModeBlue, CasinoBlue, LightBlue } from 'components/themes/mainTheme'
import { getPagedArray } from 'lib/util/collections'

export function getOptions(items: XyValues, raw: any[], isXSmall: boolean, palette: 'light' | 'dark' = 'light', showXTooltip = true) {
  let lineColor = palette === 'dark' ? LightBlue : CasinoBlue

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
        top: 16,
        left: 7,
        blur: 10,
      },
      type: 'area',
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeout',
      },
      foreColor: palette === 'dark' ? VeryLightBlue : DarkModeBlue,
    },
    grid: getBaseGrid(theme.palette.mode),
    yaxis: {
      labels: {
        style: {
          colors: palette === 'dark' ? [VeryLightBlue] : [DarkBlue],
          fontWeight: isXSmall ? 300 : 400,
          fontSize: isXSmall ? '10px' : '15px',
        },

        formatter: (val: number) => {
          return `${val}`
        },
      },
    },
    xaxis: {
      ...getBaseXAxis(items.x),
      tooltip: {
        enabled: showXTooltip,
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

export function shrinkList<T>(array: T[], maxItems: number) {
  if (array.length <= maxItems) {
    return [...array]
  }

  const chunkSize = Math.ceil(array.length / maxItems)

  const chunks = getPagedArray(array, chunkSize)
  let result: T[] = []
  if (chunks.length > maxItems) {
  }
  if (chunks.length > 1) {
    chunks.forEach((chunk, i) => {
      if (i === 0) {
        result.push(chunk.items[0])
        if (chunk.items.length > 1) {
          result.push(chunk.items[chunk.items.length - 1])
        }
      } else {
        result.push(chunk.items[chunk.items.length - 1])
      }
    })
  } else {
    result = [...array]
  }
  return result
}

export function shrinkListByViewportSize<T>(array: T[], viewportSize: Breakpoint) {
  const isXSmallDevice = viewportSize === 'xs'
  let shrinkSize = isXSmallDevice ? 18 : 36
  if (viewportSize == 'md') {
    shrinkSize = 72
  } else if (viewportSize === 'lg' || viewportSize === 'xl') {
    shrinkSize = 120
  }
  return shrinkList(array, shrinkSize)
}
