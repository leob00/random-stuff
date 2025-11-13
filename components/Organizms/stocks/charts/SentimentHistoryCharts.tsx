'use client'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { BarChart, getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import dayjs from 'dayjs'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import SimpleLineChart from 'components/Atoms/Charts/chartJs/SimpleLineChart'
import numeral from 'numeral'
import { useMarketColors } from 'components/themes/marketColors'
import { max, mean, min, take } from 'lodash'
import { sortArray } from 'lib/util/collections'
import { useClientPager } from 'hooks/useClientPager'
import { useMemo } from 'react'
import BackForwardPager from 'components/Molecules/Buttons/BackForwardPager'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { getLineChartOptions } from 'components/Atoms/Charts/chartJs/lineChartOptions'
dayjs.extend(isSameOrBefore)

const SentimentHistoryCharts = ({ data }: { data: StockStats[] }) => {
  const limit = 10
  interface PagingModel {
    backButtonDisabled: boolean
    middleText: string
    nextButtonDisabled: boolean
    results: StockStats[]
  }
  const { pagerModel, getPagedItems, allItems, setPage } = useClientPager(data, limit, true)

  const model = useMemo(() => {
    const result: PagingModel = {
      backButtonDisabled: pagerModel.page <= 1,
      nextButtonDisabled: pagerModel.page >= pagerModel.totalNumberOfPages,
      middleText: '',
      results: [],
    }
    // last page
    if (pagerModel.page === pagerModel.totalNumberOfPages) {
      const sorted = take(sortArray(data, ['MarketDate'], ['desc']), limit)
      let results = sortArray(sorted, ['MarketDate'], ['asc'])
      result.results = results
      result.middleText = `${dayjs(results[0].MarketDate).format('MM/DD/YYYY')} - ${dayjs(results[results.length - 1].MarketDate).format('MM/DD/YYYY')}`
      return result
    }
    const pagedItems = getPagedItems(allItems, pagerModel.page)
    result.results = pagedItems
    result.middleText = `${dayjs(pagedItems[0].MarketDate).format('MM/DD/YYYY')} - ${dayjs(pagedItems[pagedItems.length - 1].MarketDate).format('MM/DD/YYYY')}`

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagerModel.page])

  const theme = useTheme()
  const { chart } = useMarketColors()
  const colors = model.results.map((m) => {
    return m.TotalUpPercent >= 50 ? chart.positiveColor : chart.negativeColor
  })
  const bar: BarChart = {
    colors: colors,
    labels: model.results.map((m) => dayjs(m.MarketDate).format('MM/DD/YYYY')),
    numbers: model.results.map((m) => m.TotalUpPercent),
  }
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('md'))

  let height = 90
  if (isXSmall) {
    height = 240
  }
  if (isLarge) {
    height = 90
  }
  const barchartOptions = getBarChartOptions('', '%', theme.palette.mode)
  barchartOptions.plugins!.tooltip! = {
    ...barchartOptions.plugins?.tooltip,
    callbacks: {
      title: (tooltipItems) => {
        return ''
      },
      label: (tooltipItems) => {
        return ` ${dayjs(tooltipItems.label).format('dddd')}, ${tooltipItems.label}`
      },
      beforeBody: () => {
        return ''
      },
      afterLabel: (tooltipItems) => {
        return ' '
      },
      beforeFooter: (tooltipItems) => {
        return ` up: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUpPercent).format('0.000')}%`
      },
      footer: (tooltipItems) => {
        return ` down: ${numeral(model.results[tooltipItems[0].dataIndex].TotalDownPercent).format('0.000')}%`
      },
      afterFooter: (tooltipItems) => {
        return ` unchanged: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUnchangedPercent).format('0.000')}%`
      },
    },
  }

  const lineChartOptions = getLineChartOptions({ labels: bar.labels, numbers: bar.numbers }, '', '%', theme.palette.mode, true)
  lineChartOptions.plugins!.tooltip! = {
    ...lineChartOptions.plugins?.tooltip,
    callbacks: {
      title: (tooltipItems) => {
        return ''
      },
      label: (tooltipItems) => {
        return ` ${dayjs(tooltipItems.label).format('dddd')}, ${tooltipItems.label}`
      },
      beforeBody: () => {
        return ''
      },
      afterLabel: (tooltipItems) => {
        return ' '
      },
      beforeFooter: (tooltipItems) => {
        return ` up: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUpPercent).format('0.000')}%`
      },
      footer: (tooltipItems) => {
        return ` down: ${numeral(model.results[tooltipItems[0].dataIndex].TotalDownPercent).format('0.000')}%`
      },
      afterFooter: (tooltipItems) => {
        return ` unchanged: ${numeral(model.results[tooltipItems[0].dataIndex].TotalUnchangedPercent).format('0.000')}%`
      },
    },
  }
  const minNum = min(bar.numbers)
  const minNumIdx = bar.numbers.findIndex((m) => m === minNum)
  const maxNum = max(bar.numbers)
  const maxNumIdx = bar.numbers.findIndex((m) => m === maxNum)
  const avg = mean(bar.numbers)

  lineChartOptions.plugins!.annotation = {
    annotations: {
      line1: {
        type: 'point',
        xValue: minNumIdx,
        yValue: minNum,
        borderColor: chart.negativeColor,
        borderWidth: 3,
        backgroundColor: chart.negativeColor,
        pointStyle: 'circle',
      },
      line2: {
        type: 'point',
        xValue: maxNumIdx,
        yValue: maxNum,
        borderColor: chart.positiveColor,
        borderWidth: 3,
        backgroundColor: chart.positiveColor,
        pointStyle: 'circle',
      },
      line3: {
        type: 'line',
        yMin: avg,
        yMax: avg,
        borderColor: CasinoBlueTransparent,
        borderDash: [bar.labels.length / 2],
        borderWidth: 1,
      },
    },
  }

  const handleBackClick = () => {
    const newPageNum = pagerModel.page - 1
    if (newPageNum < pagerModel.totalNumberOfPages) {
      setPage(newPageNum)
    }
  }
  const handleNextClick = () => {
    const newPageNum = pagerModel.page + 1
    if (newPageNum <= pagerModel.totalNumberOfPages) {
      setPage(newPageNum)
    }
  }

  return (
    <Box>
      <Typography pt={4} textAlign={'center'}>{`Sentiment History`}</Typography>
      <BackForwardPager
        backButtonDisabled={model.backButtonDisabled}
        nextButtonDisabled={model.nextButtonDisabled}
        middleText={model.middleText}
        handleBackClick={handleBackClick}
        handleNextClick={handleNextClick}
      />
      <SimpleBarChart barChart={bar} chartOptions={barchartOptions} height={height} />
      <SimpleLineChart barChart={bar} chartOptions={lineChartOptions} height={height - 5} />
    </Box>
  )
}

export default SentimentHistoryCharts
