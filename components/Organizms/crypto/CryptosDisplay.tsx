import { Alert, Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import StaticStockSearch from 'components/Atoms/Inputs/StaticStockSearch'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { DropdownItem } from 'lib/models/dropdown'
import numeral from 'numeral'
import StockChange from '../stocks/StockChange'
import { sortArray } from 'lib/util/collections'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const filtered = filterCryptos(data)

  const searchOptions: DropdownItem[] = filtered.map((m) => {
    return {
      text: `${m.Company}`,
      value: m.Symbol,
    }
  })

  const handleSelectQuote = async (item: DropdownItem) => {
    if (item.value) {
      console.log(item)
    }
  }

  return (
    <Box py={2}>
      <CenterStack>
        <StaticAutoComplete
          placeholder={`search ${numeral(searchOptions.length).format('###,###')} cryptos`}
          onSelected={handleSelectQuote}
          options={searchOptions}
          onChanged={() => {}}
        />
      </CenterStack>
      <Box pt={2}>
        <CenterStack>
          <AlertWithHeader severity='warning' text='prices are delayed by a day.' />
        </CenterStack>
      </Box>
      <Box py={2}>
        {filtered.map((item) => (
          <Box key={item.Symbol} py={1}>
            <ListHeader text={`${item.Company}`} />
            <StockChange item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function filterCryptos(data: StockQuote[]) {
  const displaySymbols = ['X:BTCUSD', 'X:ETHUSD', 'X:LTCUSD', 'X:XMRUSD', 'X:NEOUSD', 'X:XRPUSD', 'X:RONINUSD', 'X:SOLUSD', 'X:USDTUSD', 'X:XAUTUSD']
  const result = data.filter((m) => displaySymbols.includes(m.Symbol))
  return sortArray(result, ['Company'], ['asc'])
}

export default CryptosDisplay
