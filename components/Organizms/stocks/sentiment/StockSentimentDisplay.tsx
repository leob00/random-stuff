import JsonView from 'components/Atoms/Boxes/JsonView'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import React from 'react'
import StockMarketStatsChart from '../charts/StockMarketStatsChart'
import { mean } from 'lodash'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const StockSentimentDisplay = ({ data }: { data: StockStats[] }) => {
  return (
    <>
      <CenteredHeader title={'1 Week'} />
      <StockMarketStatsChart data={getSentiment(data, 5)} />
      <HorizontalDivider />
      <CenteredHeader title={'2 Week'} />
      <StockMarketStatsChart data={getSentiment(data, 10)} />
      <HorizontalDivider />
      <CenteredHeader title={'1 Month'} />
      <StockMarketStatsChart data={getSentiment(data, 30)} />
    </>
  )
}

function getSentiment(data: StockStats[], days: number) {
  const all = [...data]
  const items = all.slice(0, days)
  const upAvg = mean(items.map((m) => m.TotalUpPercent))
  const downAvg = mean(items.map((m) => m.TotalDownPercent))
  const unchangedAvg = mean(items.map((m) => m.TotalUnchangedPercent))
  const result: StockStats = {
    TotalUp: 0,
    TotalDown: 0,
    TotalUnchanged: 0,
    TotalUpPercent: upAvg,
    TotalDownPercent: downAvg,
    TotalUnchangedPercent: unchangedAvg,
    MarketDate: '',
    DateModified: '',
  }
  return result
}

export default StockSentimentDisplay
