import { Box } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { DarkBlueTransparent, DarkBlue, VeryLightBlueTransparent, CasinoBlueTransparent, CasinoBlue } from 'components/themes/mainTheme'
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

  //const data = mapHistory(history)
  //const [chartData, setChartData] = React.useState(data)
  const daySelect: DropdownItem[] = [
    { text: '1y', value: '365' },
    { text: '6m', value: '180' },
    { text: '3m', value: '90' },
    { text: '1m', value: '30' },
    { text: '1w', value: '7' },
  ]

  const handleDaysSelected = async (val: string) => {
    const result = await getStockChart(symbol, Number(val))
    const map = mapHistory(result)
    const options = mapOptions(map)
    setChartOptions(options)
    //console.log(val)
  }
  const [chartOptions, setChartOptions] = React.useState<ApexOptions | null>(null)

  const mapOptions = (items: XyValues) => {
    const options: ApexOptions = {
      series: [
        {
          name: '',
          data: items.y,
          color: DarkBlueTransparent,
        },
      ],
      stroke: {
        width: 2,
        colors: [DarkBlue],
      },
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        borderColor: VeryLightBlueTransparent,
      },
      yaxis: {
        labels: {
          style: {
            colors: [CasinoBlue],
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
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return `$${val.toFixed(2)}`
          },
        },
      },
    }
    return options
  }

  React.useEffect(() => {
    const map = mapHistory(history)
    setChartOptions(mapOptions(map))
  }, [])

  return (
    <Box>
      <Box textAlign={'right'} pr={1}>
        <DropdownList options={daySelect} selectedOption={'365'} onOptionSelected={handleDaysSelected} />
      </Box>
      {chartOptions && <ReactApexChart series={chartOptions.series} options={chartOptions} type='line' />}
    </Box>
  )
}

export default StockChart
