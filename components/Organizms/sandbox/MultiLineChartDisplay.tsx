import { Box, useMediaQuery, useTheme } from '@mui/material'
import BasicLineChart from 'components/Atoms/Charts/BasicLineChart'
import ComparisonLineChart from 'components/Atoms/Charts/ComparisonLineChart'
import MultiLineChart from 'components/Atoms/Charts/MultiLineChart'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { getEconDataReportDowJones, getEconDataReportSnp } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import StockChart from '../stocks/StockChart'

const MultiLineChartDisplay = () => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
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
  const stockChartFn = async () => {
    const history = await getStockOrFutureChart('META', 90, true)
    const results: XyValues[] = []
    const x = history.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY'))
    results.push({
      x: x,
      y: history.map((m) => m.Price),
    })
    results.push({
      x: history.map((m) => dayjs(m.TradeDate).format('MM/DD/YYYY')),
      y: history.map((m) => Number(m.Volume)),
    })
    return results
  }

  const econChartMutateKey = `/api/baseRoute?id=DJSNP`
  const stockChartMutateKey = `/api/baseRoute?id=META`

  const { data: econData, isLoading } = useSwrHelper(econChartMutateKey, econChartFn, { revalidateOnFocus: false })
  const { data: stockData } = useSwrHelper(stockChartMutateKey, stockChartFn, { revalidateOnFocus: false })

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box>
        {stockData && (
          <>
            <BasicLineChart xyValues={stockData[0]} rawData={[]} yLabelPrefix={'$'} changePositiveColor={true} isXSmall={isXSmall} />
            <Box mt={-2}>
              <BasicLineChart xyValues={stockData[1]} rawData={[]} height={160} title={'Volume'} isXSmall={true} />
            </Box>
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
