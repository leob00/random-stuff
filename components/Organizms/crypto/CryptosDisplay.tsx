import { Box, Typography, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockChange from '../stocks/StockChange'
import { sortArray } from 'lib/util/collections'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { DateRange, DateRangeFilter, HistoricalAggregate, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useState } from 'react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StockChartWithVolume from '../stocks/StockChartWithVolume'
import StockChartDaySelect from '../stocks/StockChartDaySelect'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import { calculateStockMovePercent } from 'lib/util/numberUtil'
import { getPositiveNegativeColor } from '../stocks/StockListItem'
import HistoricalAggregateDisplay from '../stocks/HistoricalAggregateDisplay'

interface DetailsModel {
  Details: StockQuote
  History: StockQuote[]
  AvailableDates: DateRange
  Aggregate: HistoricalAggregate
}

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const filtered = filterCryptos(data)
  const [isLoading, setIsLoading] = useState(false)
  const [details, setDetails] = useState<DetailsModel | null>(null)

  const { cryptoSettings, saveCryptoSettings } = useLocalStore()
  const [selectedDays, setSelectedDays] = useState(cryptoSettings?.chartSelectedDays ?? 30)

  const loadDetails = async (quote: StockQuote, days: number) => {
    setIsLoading(true)
    const resp = await serverPostFetch({ body: { key: quote.Symbol, HistoryDays: days } }, '/Crypto')
    setIsLoading(false)
    const result = resp.Body as DetailsModel
    result.Details.Company = filtered.find((m) => m.Symbol === result.Details.Symbol)!.Company
    setDetails(result)
  }

  const handleDaysSelected = async (arg: number) => {
    setSelectedDays(arg)
    saveCryptoSettings({ ...cryptoSettings, chartSelectedDays: arg })
    if (details) {
      await loadDetails(details?.Details, arg)
    }
  }

  return (
    <>
      <Box py={2}>
        {isLoading && <BackdropLoader />}
        <Box py={2}>
          {filtered.map((item) => (
            <Box key={item.Symbol} py={1}>
              <FadeIn>
                <ListHeader
                  text={`${item.Company}`}
                  onClicked={() => {
                    loadDetails(item, selectedDays)
                  }}
                />
                <StockChange item={item} />
              </FadeIn>
            </Box>
          ))}
        </Box>
      </Box>
      {details && (
        <InfoDialog show={!!details} title={details.Details.Company} onCancel={() => setDetails(null)}>
          <FadeIn>
            <StockChange item={details.Details} />
            <Box px={2}>
              <ReadOnlyField label='Date' val={`${dayjs(details.Details.TradeDate).format('MM/DD/YYYY')}`} variant='caption' />
            </Box>
          </FadeIn>

          <Box>
            <StockChartDaySelect selectedDays={selectedDays} onSelected={handleDaysSelected} availableDates={details.AvailableDates} />
          </Box>
          {details.Aggregate && <HistoricalAggregateDisplay aggregate={details.Aggregate} isLoading={isLoading} />}

          <StockChartWithVolume data={details.History} symbol={details.Details.Symbol} isLoading={isLoading} />
        </InfoDialog>
      )}
    </>
  )
}

function filterCryptos(data: StockQuote[]) {
  const displaySymbols = [
    'X:BTCUSD',
    'X:ETHUSD',
    'X:LTCUSD',
    'X:XMRUSD',
    'X:NEOUSD',
    'X:XRPUSD',
    'X:RONINUSD',
    'X:SOLUSD',
    'X:USDTUSD',
    'X:XAUTUSD',
    'X:AVAXUSD',
  ]
  const result = data.filter((m) => displaySymbols.includes(m.Symbol))
  return sortArray(result, ['Company'], ['asc'])
}

export default CryptosDisplay
