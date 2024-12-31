import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { DropdownItem } from 'lib/models/dropdown'
import StockChange from '../stocks/StockChange'
import { sortArray } from 'lib/util/collections'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useState } from 'react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StockChartWithVolume from '../stocks/StockChartWithVolume'

interface DetailsModel {
  Details: StockQuote
  History: StockQuote[]
}

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const filtered = filterCryptos(data)
  const [isLoading, setIsLoading] = useState(false)
  const [details, setDetails] = useState<DetailsModel | null>(null)

  const searchOptions: DropdownItem[] = filtered.map((m) => {
    return {
      text: `${m.Company}`,
      value: m.Symbol,
    }
  })

  const loadDetails = async (quote: StockQuote) => {
    setIsLoading(true)
    const resp = await serverPostFetch({ body: { key: quote.Symbol, HistoryDays: 30 } }, '/Crypto')
    setIsLoading(false)
    const result = resp.Body as DetailsModel
    result.History = sortArray(result.History, ['TradeDate'], ['asc'])
    result.Details.Company = filtered.find((m) => m.Symbol === result.Details.Symbol)!.Company
    setDetails(result)
  }

  return (
    <>
      <Box py={2}>
        {isLoading && <BackdropLoader />}
        <Box pt={2}>
          <CenterStack>
            <AlertWithHeader severity='warning' text='prices are delayed by a day.' />
          </CenterStack>
        </Box>
        <Box py={2}>
          {filtered.map((item) => (
            <Box key={item.Symbol} py={1}>
              <FadeIn>
                <ListHeader
                  text={`${item.Company}`}
                  onClicked={() => {
                    loadDetails(item)
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
          </FadeIn>
          <StockChartWithVolume data={details.History} symbol={details.Details.Symbol} isLoading={isLoading} />
        </InfoDialog>
      )}
    </>
  )
}

function filterCryptos(data: StockQuote[]) {
  const displaySymbols = ['X:BTCUSD', 'X:ETHUSD', 'X:LTCUSD', 'X:XMRUSD', 'X:NEOUSD', 'X:XRPUSD', 'X:RONINUSD', 'X:SOLUSD', 'X:USDTUSD', 'X:XAUTUSD']
  const result = data.filter((m) => displaySymbols.includes(m.Symbol))
  return sortArray(result, ['Company'], ['asc'])
}

export default CryptosDisplay
