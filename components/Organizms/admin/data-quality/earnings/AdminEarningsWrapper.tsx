import { Box } from '@mui/material'
import SearchBySymbolAccordion from 'components/Organizms/stocks/earnings/SearchBySymbolAccordion'
import { EarningsSearchFields } from 'components/Organizms/stocks/earnings/SearchEarningsBySymbolForm'
import { useState } from 'react'

const AdminEarningsWrapper = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const handelSubmit = (item: EarningsSearchFields) => {
    setIsExpanded(false)
  }
  return (
    <Box py={2}>
      <SearchBySymbolAccordion handelSubmit={handelSubmit} />
    </Box>
  )
}

export default AdminEarningsWrapper
