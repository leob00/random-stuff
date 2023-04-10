import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { VeryLightBlueTransparent, CasinoBlueTransparent, CasinoBlue, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import dynamic from 'next/dynamic'
import React from 'react'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const StockChart = ({ symbol, history }: { symbol: string; history: StockHistoryItem[] }) => {
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
    const map = mapHistory(result)
    const options = mapOptions(map)
    setChartOptions(options)
    //console.log(val)
  }
  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const mapOptions = (items: XyValues) => {
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
        width: 2.2,
      },
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
        foreColor: lineColor,
      },
      grid: {
        show: true,
        borderColor: VeryLightBlueTransparent,
      },
      yaxis: {
        labels: {
          style: {
            colors: [CasinoBlue],
            fontWeight: 400,
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
        tickAmount: Math.floor(items.x.length / (items.x.length / 12)),
        categories: items.x,
        axisTicks: { show: false },
        axisBorder: {
          show: false,
          color: CasinoBlueTransparent,
        },
      },
      tooltip: {
        fillSeriesColor: false,

        marker: {
          fillColors: [lineColor],
        },

        style: {
          fontSize: '14px',
        },

        y: {
          title: {
            formatter(seriesName) {
              return ` ${seriesName}`
            },
          },
          formatter: (val: number, opts: any) => {
            //console.log(history[opts.dataPointIndex].Price)
            const change =
              history[opts.dataPointIndex].Change > 0
                ? `+$${history[opts.dataPointIndex].Change.toFixed(2)}`
                : `${history[opts.dataPointIndex].Change.toFixed(2)}`
            return `$${history[opts.dataPointIndex].Price.toFixed(2)}  ${change} ${history[opts.dataPointIndex].ChangePercent}%`
          },
        },
      },
    }
    return options
  }

  React.useEffect(() => {
    const map = mapHistory(history)
    setChartOptions(mapOptions(map))
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
              <Box borderRadius={6} p={1}>
                <ReactApexChart series={chartOptions.series} options={chartOptions} type='line' />
              </Box>
            )}
          </>
        )}
      </>
    </Box>
  )
}

export default StockChart
