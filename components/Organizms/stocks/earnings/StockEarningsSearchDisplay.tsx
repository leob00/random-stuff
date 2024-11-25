import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import SearchEarningsBySymbolForm, { EarningsSearchFields } from './SearchEarningsBySymbolForm'
import { StockEarning, getStockQuote, serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import StockEarningsTable from './StockEarningsTable'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockListItem from '../StockListItem'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import SearchEarningsByDatesForm, { EarningsSearchDateFields } from './SearchEarningsByDatesForm'
import SearchBySymbolAccordion from './SearchBySymbolAccordion'

const StockEarningsSearchDisplay = () => {
  const [isBySymbolExpanded, setIsBySymbolExpanded] = useState(false)
  const [isByDateExpanded, setIsByDateExpanded] = useState(false)
  const [searchResults, setSearchResults] = useState<StockEarning[] | null>(null)
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchSubmitSearchBySymbol = async (data: StockQuote) => {
    if (data.Symbol.length > 0) {
      setIsLoading(true)
      const earnResp = await serverGetFetch(`/StockEarnings?symbol=${data.Symbol}`)
      const earnings = earnResp.Body as StockEarning[]
      const quote = await getStockQuote(data.Symbol)
      setStockQuote(quote)
      setSearchResults(earnings)
      setIsBySymbolExpanded(false)
      setIsByDateExpanded(false)
      setIsLoading(false)
    }
  }
  const handleSearchSubmitSearchByDates = async (data: EarningsSearchDateFields) => {
    setIsLoading(true)
    const earnResp = await serverPostFetch(
      {
        body: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
      },
      `/EarningsSearch`,
    )
    const earnings = earnResp.Body as StockEarning[]

    setSearchResults(earnings)
    setIsBySymbolExpanded(false)
    setIsByDateExpanded(false)
    setIsLoading(false)
  }
  return (
    <ResponsiveContainer>
      {isLoading && <BackdropLoader />}
      <PageHeader text='Earnings Search' backButtonRoute='/csr/my-stocks' />
      <Box py={2} flexDirection={'column'} gap={2} display={'flex'}>
        <SearchBySymbolAccordion isExpanded={isBySymbolExpanded} setIsExpanded={setIsBySymbolExpanded} handelSubmit={handleSearchSubmitSearchBySymbol} />
        <>
          {stockQuote && (
            <Box py={2}>
              <StockListItem item={stockQuote} expand={false} disabled isStock />
            </Box>
          )}
        </>
        <Accordion expanded={isByDateExpanded} onChange={() => setIsByDateExpanded(!isByDateExpanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderBottom: `solid 1px ${CasinoGrayTransparent}` }}>
            <Typography variant='subtitle1'>by dates</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box minHeight={200} py={4}>
              <SearchEarningsByDatesForm onSubmitted={handleSearchSubmitSearchByDates} />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        {searchResults && (
          <Box py={2}>
            <StockEarningsTable data={searchResults} showCompany />
          </Box>
        )}
      </Box>
    </ResponsiveContainer>
  )
}

export default StockEarningsSearchDisplay
