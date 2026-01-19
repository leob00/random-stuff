'use client'
import { Box } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import AnnualEarningsReportWrapper from 'components/Organizms/stocks/earnings/AnnualEarningsReportWrapper'
import QuarterlyEarningsReportWrapper from 'components/Organizms/stocks/earnings/QuarterlyEarningsReportWrapper'
import RecentEarningsReportWrapper from 'components/Organizms/stocks/earnings/RecentEarningsReportWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { useState } from 'react'

const EarningsCalendarReportsLayout = () => {
  const [selectedReport, setSelectedReport] = useState('recent-earnings')
  const handleReportSelect = (val: string) => {
    setSelectedReport(val)
  }
  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} pt={2}>
        <Box>
          <NavigationButton path={'/market/stocks/earnings/calendar'} name={'earnings calendar'} category='Stock Reports' variant='body2' />
        </Box>
        <Box>
          <DropdownList options={reports} selectedOption={selectedReport} onOptionSelected={handleReportSelect} />
        </Box>
      </Box>
      {selectedReport === 'recent-earnings' && <RecentEarningsReportWrapper />}
      {selectedReport === 'quarterly' && <QuarterlyEarningsReportWrapper />}
      {selectedReport === 'annual' && <AnnualEarningsReportWrapper />}
    </>
  )
}

const reports: DropdownItem[] = [
  {
    text: 'weekly',
    value: 'recent-earnings',
  },
  {
    text: 'quarterly',
    value: 'quarterly',
  },
  {
    text: 'annual',
    value: 'annual',
  },
]

export default EarningsCalendarReportsLayout
