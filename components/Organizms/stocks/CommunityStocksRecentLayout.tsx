import { Box } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useSessionSettings } from '../session/useSessionSettings'
import CommunityStocksLayout from './CommunityStocksLayout'
import CustomSortAlert from './CustomSortAlert'
import StocksCustomSortForm from './StocksCustomSortForm'
import { useRouter } from 'next/router'
import { sortArray } from 'lib/util/collections'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import { useState } from 'react'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'

const CommunityStocksRecentLayout = ({ data, onRefresh }: { data: StockQuote[]; onRefresh: () => void }) => {
  const router = useRouter()
  const settings = useSessionSettings()

  const [showCustomSortForm, setShowCustomSortForm] = useState(false)
  const defaultSort = settings.communityStocks?.defaultSort ?? []
  const [sorter, setSorter] = useState(defaultSort)

  const sortedData = applySort(data, sorter)

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuRefresh text={'refresh'} />,
      fn: () => {
        onRefresh()
      },
    },
    {
      item: <ContextMenuSort text={'sort'} />,
      fn: () => setShowCustomSortForm(true),
    },
    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuReport text={'reports'} />,
      fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/csr/stocks/earnings-calendar'),
    },
  ]
  const handleCustomSortSubmitted = (sort?: Sort[]) => {
    settings.saveCommunityStocksSort(sort)
    setShowCustomSortForm(false)
    setSorter(sort ?? [])
  }

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box></Box>
        <Box justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
      </Box>
      {settings.communityStocks?.defaultSort && (
        <CustomSortAlert result={settings.communityStocks?.defaultSort} onModify={() => setShowCustomSortForm(true)} translateDefaultMessage />
      )}
      <CommunityStocksLayout data={sortedData} />
      <FormDialog show={showCustomSortForm} title={'sort'} onCancel={() => setShowCustomSortForm(false)} showActionButtons={false}>
        <StocksCustomSortForm result={settings.communityStocks?.defaultSort} onSubmitted={handleCustomSortSubmitted} />
      </FormDialog>
    </Box>
  )
}

function applySort(data: StockQuote[], sort: Sort[]) {
  if (sort.length === 0) {
    return data
  }
  const result = sortArray(
    data,
    sort.map((m) => m.key),
    sort.map((m) => m.direction),
  )
  return result
}

export default CommunityStocksRecentLayout
