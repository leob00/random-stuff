import { Box } from '@mui/material'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { useRouter } from 'next/router'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'
import ContextMenuCommodities from 'components/Molecules/Menus/ContextMenuCommodities'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'

export const stockReportsDropdown: DropdownItem[] = [
  { text: 'Volume Leaders', value: 'volume-leaders' },
  { text: 'Market Cap Leaders', value: 'market-cap-leaders' },
  { text: 'Top Movers', value: 'topmvgavg' },
  { text: 'Sectors', value: 'sectors' },
  { text: 'Industries', value: 'industries' },
  { text: 'Dividend Payers', value: 'dividend-payers' },
  { text: 'Stock Tags', value: 'stock-tags' },
  { text: 'Indices and ETFs', value: 'indicesAndEtfs' },
]

const StockReportsDropdown = ({ selectedValue }: { selectedValue: string }) => {
  const router = useRouter()
  const selectedOption = stockReportsDropdown.find((m) => m.value === selectedValue)

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuPeople text='community stocks' />,
      fn: () => {
        router.push('/csr/community-stocks')
      },
    },
    {
      item: <ContextMenuMyStocks text='my stocks' />,
      fn: () => {
        router.push('/csr/my-stocks')
      },
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/csr/stocks/earnings-calendar'),
    },
    {
      item: <ContextMenuCommodities text={'commodities'} />,
      fn: () => router.push('/csr/commodities'),
    },
    {
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/csr/crypto'),
    },
  ]

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
        router.replace(`/ssg/stocks/reports/${value}`, undefined, { scroll: false })
        break
    }
  }
  return (
    <Box pt={2}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box></Box>
        <Box display={'flex'}>
          <StaticAutoComplete options={stockReportsDropdown} selectedItem={selectedOption} onSelected={handleReportSelected} disableClearable />
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
      </Box>
      <Box maxWidth={{ xs: '75%', sm: '67%', md: '79%', lg: '73%' }}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <SiteLink text={'advanced search'} href='/csr/stocks/advanced-search' />
        </Box>
      </Box>
    </Box>
  )
}

export default StockReportsDropdown
