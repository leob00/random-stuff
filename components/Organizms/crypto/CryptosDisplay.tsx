import { Box } from '@mui/material'
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

const CryptosDisplay = ({ data, userProfile }: { data: StockQuote[]; userProfile: UserProfile | null }) => {
  const searchOptions: DropdownItem[] = data.map((m) => {
    return {
      text: `${m.Symbol}: ${m.Company}`,
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
      <Box py={2}>
        {data.map((item) => (
          <Box key={item.Symbol} py={1}>
            <ListHeader text={`${item.Symbol} : ${item.Company}`} />
            <StockChange item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CryptosDisplay
