import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import SearchEarningsForm, { EarningsSearchFields } from './SearchEarningsForm'
import { StockEarning, getStockQuote, serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import StockEarningsTable from './StockEarningsTable'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockListItem from '../StockListItem'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const StockEarningsSearchDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchResults, setSearchResults] = useState<StockEarning[] | null>(null)
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchSubmit = async (data: EarningsSearchFields) => {
    setIsLoading(true)
    const earnResp = await serverGetFetch(`/StockEarnings?symbol=${data.symbol}`)
    const earnings = earnResp.Body as StockEarning[]

    const quote = await getStockQuote(data.symbol)
    setStockQuote(quote)

    setSearchResults(earnings)
    setIsExpanded(false)
    setIsLoading(false)
  }
  return (
    <Box py={2}>
      <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderBottom: `solid 1px ${CasinoGrayTransparent}` }}>
          <Typography variant='subtitle1'>search parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box minHeight={200}>
            <SearchEarningsForm onSubmitted={handleSearchSubmit} />
          </Box>
        </AccordionDetails>
      </Accordion>
      {isLoading && <BackdropLoader />}
      {stockQuote && (
        <Box py={2}>
          <StockListItem item={stockQuote} expand={false} disabled isStock />
        </Box>
      )}
      {searchResults && (
        <Box py={2}>
          <StockEarningsTable data={searchResults} />
        </Box>
      )}
    </Box>
  )
}

export default StockEarningsSearchDisplay
