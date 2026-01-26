'use client'
import { Box } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/navigation'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { stockReportsDropdown } from 'app/market/stocks/reports/StockReportsPage'

const StockReportsDropdown = ({ selectedValue }: { selectedValue: string }) => {
  const router = useRouter()
  const selectedOption = stockReportsDropdown.find((m) => m.value === selectedValue)

  const handleReportSelected = (item: DropdownItem) => {
    const value = item.value
    switch (value) {
      case 'sectors':
        router.push('/csr/stocks/sectors')
        break
      case 'industries':
        router.push('/csr/stocks/industries')
        break
      case 'dividend-payers':
        router.push('/csr/stocks/dividend-payers')
        break
      case 'stock-tags':
        router.push('/csr/stocks/stock-tags')
        break
      default:
        router.push(`/market/stocks/reports/${value}`)
        break
    }
  }
  return (
    <Box pt={2}>
      <Box display={'flex'} justifyContent={'center'}>
        <StaticAutoComplete options={stockReportsDropdown} selectedItem={selectedOption} onSelected={handleReportSelected} disableClearable />
      </Box>
      {/* <Box maxWidth={{ xs: '98%', sm: '98%', md: '77%', lg: '69%' }}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <SiteLink text={'advanced search'} href='/csr/stocks/advanced-search' />
        </Box>
      </Box> */}
    </Box>
  )
}

export default StockReportsDropdown
