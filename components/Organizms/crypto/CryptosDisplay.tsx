import { Box, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockChange from '../stocks/StockChange'
import { sortArray } from 'lib/util/collections'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { DateRange, HistoricalAggregate, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useState } from 'react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StockChartWithVolume from '../stocks/StockChartWithVolume'
import StockChartDaySelect, { getYearToDateDays } from '../stocks/StockChartDaySelect'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import HistoricalAggregateDisplay from '../stocks/HistoricalAggregateDisplay'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'

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
  const scroller = useScrollTop(0)

  const loadDetails = async (quote: StockQuote, days: number) => {
    setIsLoading(true)
    const histDays = days === 0 ? getYearToDateDays() : days
    const resp = await serverPostFetch({ body: { key: quote.Symbol, HistoryDays: histDays } }, '/Crypto')
    setIsLoading(false)
    const result = resp.Body as DetailsModel
    result.Details.Company = filtered.find((m) => m.Symbol === result.Details.Symbol)!.Company
    setDetails(result)
    scroller.scroll()
  }

  const handleDaysSelected = async (arg: number) => {
    setSelectedDays(arg)
    saveCryptoSettings({ ...cryptoSettings, chartSelectedDays: arg })
    if (details) {
      await loadDetails(details?.Details, arg)
    }
  }

  const handleItemClick = async (item: StockQuote) => {
    loadDetails(item, selectedDays)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      {!details && (
        <Box py={2}>
          <Box py={2}>
            {filtered.map((item) => (
              <Box key={item.Symbol} py={1}>
                <FadeIn>
                  <ListHeader
                    text={`${item.Company}`}
                    onClicked={() => {
                      handleItemClick(item)
                    }}
                  />
                  <StockChange item={item} />
                </FadeIn>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {details && (
        <Box py={2}>
          <ScrollTop scroller={scroller} marginTop={-18} />
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box>
              <Typography px={2} variant='h5'>
                {details.Details.Company}
              </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <CloseIconButton onClicked={() => setDetails(null)} />
            </Box>
          </Box>
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
        </Box>
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
