import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import SearchEarningsBySymbolForm, { EarningsSearchFields } from './SearchEarningsBySymbolForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'

const SearchBySymbolAccordion = ({ handelSubmit }: { handelSubmit: (item: EarningsSearchFields) => void }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const handleSearchSubmitSearchBySymbol = (item: EarningsSearchFields) => {
    setIsExpanded(false)
    handelSubmit(item)
  }
  return (
    <Accordion expanded={isExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderBottom: `solid 1px ${CasinoGrayTransparent}` }}>
        <Typography variant='subtitle1'>by symbol</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box minHeight={200} py={4}>
          <SearchEarningsBySymbolForm onSubmitted={handleSearchSubmitSearchBySymbol} />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default SearchBySymbolAccordion
