import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import Seo from 'components/Organizms/Seo'
import AnnualEarningsReportWrapper from 'components/Organizms/stocks/earnings/AnnualEarningsReportWrapper'
import QuarterlyEarningsReportWrapper from 'components/Organizms/stocks/earnings/QuarterlyEarningsReportWrapper'
import RecentEarningsReportWrapper from 'components/Organizms/stocks/earnings/RecentEarningsReportWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { useState } from 'react'

const Page = () => {
  const [selectedReport, setSelectedReport] = useState('recent-earnings')

  const reports: DropdownItem[] = [
    {
      text: 'recent',
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

  const handleReportSelect = (val: string) => {
    setSelectedReport(val)
  }

  return (
    <>
      <Seo pageTitle='Earnings Report' />

      <ResponsiveContainer>
        <PageHeader text='Earnings Report' />
        <Box display={'flex'} justifyContent={'flex-end'} pt={2}>
          <DropdownList options={reports} selectedOption={selectedReport} onOptionSelected={handleReportSelect} />
        </Box>
        {selectedReport === 'recent-earnings' && <RecentEarningsReportWrapper />}
        {selectedReport === 'quarterly' && <QuarterlyEarningsReportWrapper />}
        {selectedReport === 'annual' && <AnnualEarningsReportWrapper />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
