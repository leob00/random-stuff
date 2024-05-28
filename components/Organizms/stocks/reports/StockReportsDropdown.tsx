import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { useRouter } from 'next/router'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'

export const stockReportsDropdown: DropdownItem[] = [
  { text: 'Volume Leaders', value: 'volume-leaders' },
  { text: 'Market Cap Leaders', value: 'market-cap-leaders' },
  { text: 'Sectors', value: 'sectors' },
  { text: 'Industries', value: 'industries' },
  { text: 'Dividend Payers', value: 'dividend-payers' },
  { text: 'Stock Tags', value: 'stock-tags' },
]

const StockReportsDropdown = ({ selectedValue }: { selectedValue: string }) => {
  const router = useRouter()

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuPeople text='community stocks' />,
      fn: () => {
        router.push('/csr/community-stocks')
      },
    },
    {
      item: <ContextMenuPortfolio text='my stocks' />,
      fn: () => {
        router.push('/csr/my-stocks')
      },
    },
  ]

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
      case 'stock-tags':
        router.push('/csr/stocks/stock-tags')
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
        <ContextMenu items={menu} />
      </CenterStack>
    </Box>
  )
}

export default StockReportsDropdown
