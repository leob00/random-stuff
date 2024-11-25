import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import SearchEarningsBySymbolForm, { EarningsSearchFields } from './SearchEarningsBySymbolForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import StocksAutoComplete from 'components/Atoms/Inputs/StocksAutoComplete'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'

const SearchBySymbolAccordion = ({
  handelSubmit,
  isExpanded,
  setIsExpanded,
}: {
  handelSubmit: (item: StockQuote) => void
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
}) => {
  const handleSearchSubmitSearchBySymbol = (item: StockQuote) => {
    handelSubmit(item)
  }
  return (
    <Accordion
      expanded={isExpanded}
      onChange={(e, expanded) => {
        setIsExpanded(expanded)
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderBottom: `solid 1px ${CasinoGrayTransparent}` }}>
        <Typography variant='subtitle1'>by symbol</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box minHeight={200} py={4}>
          <StockSearch onSymbolSelected={handleSearchSubmitSearchBySymbol} />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default SearchBySymbolAccordion
