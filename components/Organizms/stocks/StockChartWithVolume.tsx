import { Box, useMediaQuery, useTheme } from '@mui/material'
import LineChartsSynced from 'components/Atoms/Charts/LineChartsSynced'
import { LineChartOptions } from 'components/Molecules/Charts/apex/baseLineChartOptions'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { StockHistoryItem } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import React from 'react'
import { stockChartTooltipFormatter } from './stockLineChartOptions'
interface SyncedChartModel {
  xyValues: XyValues[]
  options: LineChartOptions[]
}

const StockChartWithVolume = ({ symbol, data, isLoading }: { symbol: string; data: StockHistoryItem[]; isLoading: boolean }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))

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
      chartId: `main-chart-${symbol}`,
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
      chartId: `child-chart-${symbol}`,
      groupName: `stock-chart-${symbol}`,
      numericFormatter: (num: number) => {
        return `${numeral(num).format('###,###')}`
      },
      enableAxisXTooltip: false,
    })
    const result: SyncedChartModel = {
      xyValues: newXYValues,
      options: opts,
    }
    return result
  }

  const model = mapModel(symbol, data)

  return (
    <Box>
      <LineChartsSynced xYValues={model.xyValues} lineOptions={model.options} isLoading={isLoading} />
    </Box>
  )
}

export default StockChartWithVolume
