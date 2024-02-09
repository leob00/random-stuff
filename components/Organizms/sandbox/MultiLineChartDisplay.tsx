import { Box, useMediaQuery, useTheme } from '@mui/material'
import BasicLineChart from 'components/Atoms/Charts/BasicLineChart'
import ComparisonLineChart from 'components/Atoms/Charts/ComparisonLineChart'
import LineChartsSynced from 'components/Atoms/Charts/LineChartsSynced'
import MultiLineChart from 'components/Atoms/Charts/MultiLineChart'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { LineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { getEconDataReportDowJones, getEconDataReportSnp } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'
import { mutate } from 'swr'
import StockChartDaysSelect from '../stocks/StockChartDaysSelect'
import { stockChartTooltipFormatter } from '../stocks/stockLineChartOptions'

interface SyncedChartModel {
  xyValues: XyValues[]
  options: LineChartOptions[]
}

const MultiLineChartDisplay = () => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))

  const [selectedChartDays, setSelectedChartDays] = React.useState(90)
  const [isMutating, setIsMutating] = React.useState(false)

  const econChartFn = async () => {
    const xyVaues: XyValues[] = []
    const startYear = dayjs().add(-1, 'years').year()
    const endYear = dayjs().year()
    const snp = await getEconDataReportSnp(startYear, endYear)
    const snpChart: XyValues = {
      name: 'S&P 500',
      x: snp.Chart!.XValues,
      y: snp.Chart!.YValues.map((m) => Number(m)),
    }
    const dj = await getEconDataReportDowJones(startYear, endYear)
    const djChart: XyValues = {
      name: 'Dow Jones Industrial Average',
      x: dj.Chart!.XValues,
      y: dj.Chart!.YValues.map((m) => Number(m)),
    }
    xyVaues.push(djChart)
    xyVaues.push(snpChart)
    return xyVaues
  }

  const mapModel = (symbol: string, history: StockHistoryItem[]) => {
    const newXYValues: XyValues[] = []
    const opts: LineChartOptions[] = []

    const x = history.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY hh:mm a'))
    newXYValues.push({
      x: x,
      y: history.map((m) => m.Price),
    })
    newXYValues.push({
      x: x,
      y: history.map((m) => Number(m.Volume)),
    })
    opts.push({
      isXSmall: isXSmall,
      palette: theme.palette.mode,
      raw: history,
      changePositiveColor: true,
      yLabelPrefix: '$',
      chartId: `main-chart`,
      groupName: `stock-chart-${symbol}`,
      toolTipFormatter: (val: number, opts: any) => {
        return stockChartTooltipFormatter(val, opts, history)
      },
    })
    opts.push({
      seriesName: 'Volume',
      isXSmall: true,
      palette: theme.palette.mode,
      raw: history,
      yLabelPrefix: '',
      changePositiveColor: false,
      chartId: `child-chart`,
      groupName: `stock-chart-${symbol}`,
      numericFormatter: (num: number) => {
        return `${numeral(num).format('###,###')}`
      },
    })
    const result: SyncedChartModel = {
      xyValues: newXYValues,
      options: opts,
    }
    return result
  }

  const refreshModel = async (symbol: string, days: number) => {
    const history = await getStockOrFutureChart(symbol, days, true)
    return mapModel(symbol, history)
  }

  const stockChartFn = async () => {
    const symbol = 'META'
    return await refreshModel(symbol, selectedChartDays)
  }

  const econChartMutateKey = `/api/baseRoute?id=DJSNP`
  const stockChartMutateKey = `/api/baseRoute?id=META`

  const { data: econData, isLoading } = useSwrHelper(econChartMutateKey, econChartFn, { revalidateOnFocus: false })
  const { data: stockData } = useSwrHelper(stockChartMutateKey, stockChartFn, { revalidateOnFocus: false })

  const handleChartRangeSelect = async (val: string) => {
    setSelectedChartDays(Number(val))
  }
  React.useEffect(() => {
    const fn = async () => {
      console.log('effect fired: ', selectedChartDays)
      setIsMutating(true)
      const newModel = await refreshModel('META', selectedChartDays)
      mutate(stockChartMutateKey, newModel, { revalidate: false })
      setIsMutating(false)
    }
    fn()
  }, [selectedChartDays])

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box>
        {stockData && (
          <>
            <Box textAlign={'right'}>
              <StockChartDaysSelect selectedOption={String(selectedChartDays)} onSelected={handleChartRangeSelect} />
            </Box>
            <Box>
              <LineChartsSynced xYValues={stockData.xyValues} lineOptions={stockData.options} isLoading={isMutating} />
            </Box>
            {/* <BasicLineChart xyValues={stockData.xyValues[0]} rawData={[]} yLabelPrefix={'$'} changePositiveColor={true} isXSmall={isXSmall} />
            <Box mt={-4}>
              <BasicLineChart xyValues={stockData.xyValues[1]} rawData={[]} height={160} title={'Volume'} isXSmall={true} />
            </Box> */}
          </>
        )}
        {econData && (
          <>
            <MultiLineChart xYValues={econData} yLabelPrefix={''} />
            <ComparisonLineChart xYValues={econData} yLabelPrefix={''} />
          </>
        )}
      </Box>
    </>
  )
}

export default MultiLineChartDisplay
