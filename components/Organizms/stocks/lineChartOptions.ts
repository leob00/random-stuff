import { ApexOptions } from 'apexcharts'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoGreen, CasinoRed, VeryLightBlueTransparent, DarkBlue, CasinoBlueTransparent } from 'components/themes/mainTheme'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'

export function getOptions(items: XyValues, raw: StockHistoryItem[], isXSmall: boolean) {
  let lineColor = CasinoGreen
  if (items.y.length > 0) {
    if (items.y[0] > items.y[items.y.length - 1]) {
      lineColor = CasinoRed
    }
  }
  let strokeWidth = 3
  if (raw.length >= 90) {
    strokeWidth = 1
  } else {
    if (raw.length >= 90) {
      strokeWidth = 0.05
    } else if (raw.length >= 30) {
      strokeWidth = 2
    } else {
      strokeWidth = 2.3
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
        shadeIntensity: 10,
        opacityFrom: 0.9,
        opacityTo: 0.8,
        stops: [10, 99, 100],
      },
    },
    chart: {
      //height: 280,
      type: 'area',
      toolbar: {
        show: false,
      },
      //foreColor: lineColor,
    },
    grid: {
      show: true,
      borderColor: VeryLightBlueTransparent,
    },
    yaxis: {
      labels: {
        style: {
          colors: [DarkBlue],
          fontWeight: isXSmall ? 500 : 600,
          fontSize: isXSmall ? '14px' : '16px',
        },
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`
        },
      },
    },
    xaxis: {
      //max: yAxisDecorator === '%' ? 100 : undefined,
      labels: {
        show: false,
        formatter: (val) => {
          return val
        },
      },
      //tickAmount: Math.floor(items.x.length / (items.x.length / 12)),
      categories: items.x,
      axisTicks: { show: false },
      axisBorder: {
        show: false,
        color: CasinoBlueTransparent,
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
