import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import {
  VeryLightBlueTransparent,
  CasinoBlueTransparent,
  CasinoBlue,
  CasinoGreen,
  CasinoRed,
  CasinoGreenTransparent,
  CasinoRedTransparent,
  TransparentBlue,
  DarkBlueTransparent,
  DarkBlue,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const StockChart = ({ symbol, history }: { symbol: string; history: StockHistoryItem[] }) => {
  //const [rawData, setRawData] = React.useState(history)
  const mapHistory = (items: StockHistoryItem[]) => {
    const data: XyValues = {
      x: items.map((o) => dayjs(o.TradeDate).format('MM/DD/YYYY')),
      y: items.map((o) => o.Price),
    }
    return data
  }

  const daySelect: DropdownItem[] = [
    { text: '1 year', value: '365' },
    { text: '6 months', value: '180' },
    { text: '3 months', value: '90' },
    { text: '1 month', value: '30' },
    { text: '1 week', value: '7' },
  ]

  const handleDaysSelected = async (val: string) => {
    const result = await getStockChart(symbol, Number(val))
    //console.log(`send: ${val}, received count: ${result.length}`)
    //setRawData(result)
    const map = mapHistory(result)
    const options = mapOptions(map, result)
    setChartOptions(options)

    //console.log(val)
  }
  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const mapOptions = (items: XyValues, raw: StockHistoryItem[]) => {
    let lineColor = CasinoGreen
    if (items.y.length > 0) {
      if (items.y[0] > items.y[items.y.length - 1]) {
        lineColor = CasinoRed
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
        width: 3.2,
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
            fontWeight: 600,
            fontSize: '14px',
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
            //console.log(history[opts.dataPointIndex].Price)
            if (raw.length === 0) {
              return ''
            }
            // const foundChange = rawData[opts.dataPointIndex].Change
            // console.log(`item length: ${raw.length}, opt index: ${opts.dataPointIndex}`)
            const change =
              raw[opts.dataPointIndex].Change! > 0 ? `+$${raw[opts.dataPointIndex].Change?.toFixed(2)}` : `${raw[opts.dataPointIndex].Change?.toFixed(2)}`
            return `$${raw[opts.dataPointIndex].Price.toFixed(2)}   ${change}   ${raw[opts.dataPointIndex].ChangePercent}% `
          },
        },
      },
    }
    return options
  }

  React.useEffect(() => {
    const map = mapHistory(history)

    setChartOptions(mapOptions(map, history))
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <>
        <Box textAlign={'right'} pr={1} pt={1} pb={2}>
          <DropdownList options={daySelect} selectedOption={'90'} onOptionSelected={handleDaysSelected} />
        </Box>
        {isLoading ? (
          <Box minHeight={300}>
            <WarmupBox text='loading chart...' />
          </Box>
        ) : (
          <>
            {chartOptions && (
              <Box
                borderRadius={3}
                p={1}
                // sx={{ backgroundColor: VeryLightBlueTransparent }}
              >
                <ReactApexChart series={chartOptions.series} options={chartOptions} type='area' />
              </Box>
            )}
          </>
        )}
      </>
    </Box>
  )
}

export default StockChart
