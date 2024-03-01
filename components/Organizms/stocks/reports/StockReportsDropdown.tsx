import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { useRouter } from 'next/router'

export const stockReportsDropdown: DropdownItem[] = [
  { text: 'Volume Leaders', value: 'volume-leaders' },
  { text: 'Market Cap Leaders', value: 'market-cap-leaders' },
  { text: 'Sectors', value: 'sectors' },
  { text: 'Industries', value: 'industries' },
  { text: 'Dividend Payers', value: 'dividend-payers' },
]
const StockReportsDropdown = ({ selectedValue }: { selectedValue: string }) => {
  const router = useRouter()

  const handleReportSelected = (value: string) => {
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
      default:
        router.replace(`/ssg/stocks/reports/${value}`, undefined, { scroll: false })
        break
    }
  }
  return (
    <Box pt={2}>
      <CenterStack>
        <UncontrolledDropdownList options={stockReportsDropdown} selectedOption={selectedValue} onOptionSelected={handleReportSelected} />
      </CenterStack>
    </Box>
  )
}

export default StockReportsDropdown
