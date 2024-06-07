import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { DropdownItem } from 'lib/models/dropdown'
import { useState } from 'react'

const qln = apiConnection().qln

const SearchAheadAutoComplete = ({ minChars }: { minChars: number }) => {
  const [searchResults, setSearchResults] = useState<DropdownItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearched = async (text: string) => {
    if (text.length === 0) {
      setSearchResults([])
      return
    }
    if (text.trim().length < minChars) {
      return
    }
    setIsLoading(true)
    const resp = await get(`/api/qln?url=${qln.url}/StocksAutoComplete?searchString=${text}`)
    const result = resp.Body as StockQuote[]
    const searchResult: DropdownItem[] = result.map((m) => {
      return { value: m.Symbol, text: `${m.Symbol}: ${m.Company}` }
    })
    setSearchResults(searchResult)
    setIsLoading(false)
    //const result: StockQuote[] = resp.
  }

  const handleSelected = (item: DropdownItem) => {}

  return (
    <Box py={2}>
      <CenteredHeader title='Search Ahead' />
      <CenterStack>
        <SearchAutoComplete onChanged={handleSearched} onSelected={handleSelected} searchResults={searchResults} isLoading={isLoading} />
      </CenterStack>
    </Box>
  )
}

export default SearchAheadAutoComplete
