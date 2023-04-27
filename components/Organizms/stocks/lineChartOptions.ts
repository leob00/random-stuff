import { ApexOptions } from 'apexcharts'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { VeryLightBlueTransparent, DarkBlue, CasinoBlue, VeryLightBlue } from 'components/themes/mainTheme'

export function getOptions(items: XyValues, raw: any[], isXSmall: boolean) {
  let lineColor = CasinoBlue
  //console.log('raw length: ', raw.length)
  let strokeWidth = 2.4
  if (raw.length >= 100) {
    strokeWidth = 1.5
  } else {
    if (raw.length >= 50) {
      strokeWidth = 1.8
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
      //foreColor: lineColor,
    },
    grid: {
      show: true,
      borderColor: VeryLightBlueTransparent,
      strokeDashArray: 0,
      column: {
        colors: [VeryLightBlue],
        opacity: 0.5,
      },
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
          colors: [DarkBlue],
          fontWeight: isXSmall ? 300 : 600,
          fontSize: isXSmall ? '8px' : '15px',
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
