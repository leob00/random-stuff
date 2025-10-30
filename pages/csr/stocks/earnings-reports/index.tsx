import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import StockMarketMenu from 'components/Molecules/Menus/StockMarketMenu'
import Seo from 'components/Organizms/Seo'
import AnnualEarningsReportWrapper from 'components/Organizms/stocks/earnings/AnnualEarningsReportWrapper'
import QuarterlyEarningsReportWrapper from 'components/Organizms/stocks/earnings/QuarterlyEarningsReportWrapper'
import RecentEarningsReportWrapper from 'components/Organizms/stocks/earnings/RecentEarningsReportWrapper'
import { DropdownItem } from 'lib/models/dropdown'
import { useState } from 'react'

const Page = () => {
  const [selectedReport, setSelectedReport] = useState('recent-earnings')
  const handleReportSelect = (val: string) => {
    setSelectedReport(val)
  }

  return (
    <>
      <Seo pageTitle='Earnings Report' />

      <ResponsiveContainer>
        <PageHeader text='Earnings Report' />
        <Box display={'flex'} justifyContent={'flex-end'}>
          <StockMarketMenu />
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} pt={2}>
          <Box>
            <NavigationButton path={'/csr/stocks/earnings-calendar'} name={'earnings calendar'} category='Stock Reports' variant='body2' />
          </Box>
          <Box>
            <DropdownList options={reports} selectedOption={selectedReport} onOptionSelected={handleReportSelect} />
          </Box>
        </Box>
        {selectedReport === 'recent-earnings' && <RecentEarningsReportWrapper />}
        {selectedReport === 'quarterly' && <QuarterlyEarningsReportWrapper />}
        {selectedReport === 'annual' && <AnnualEarningsReportWrapper />}
      </ResponsiveContainer>
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
export default Page
