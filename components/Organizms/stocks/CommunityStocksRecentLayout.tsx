import { Box } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { useSessionSettings } from '../session/useSessionSettings'
import CommunityStocksLayout from './CommunityStocksLayout'
import CustomSortAlert from './CustomSortAlert'
import StocksCustomSortForm from './StocksCustomSortForm'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'
import { sortArray } from 'lib/util/collections'

const CommunityStocksRecentLayout = ({ data }: { data: StockQuote[] }) => {
  const router = useRouter()
  const settings = useSessionSettings()

  const [showCustomSortForm, setShowCustomSortForm] = React.useState(false)
  const [sorter, setSorter] = React.useState(settings.communityStocks?.defaultSort ?? [])

  const sortedData = applySort(data, sorter)

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuSort text={'sort'} />,
      fn: () => setShowCustomSortForm(true),
    },
    {
      item: <ContextMenuReport text={'reports'} />,
      fn: () => router.push('/ssg/stocks/reports/volume-leaders'),
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
      {settings.communityStocks?.defaultSort && <CustomSortAlert result={settings.communityStocks?.defaultSort} onModify={() => setShowCustomSortForm(true)} />}
      <CommunityStocksLayout data={sortedData} />
      <FormDialog show={showCustomSortForm} title={'sort'} onCancel={() => setShowCustomSortForm(false)} showActionButtons={false}>
        <StocksCustomSortForm result={settings.communityStocks?.defaultSort} onSubmitted={handleCustomSortSubmitted} />
      </FormDialog>
    </Box>
  )
}

function applySort(data: StockQuote[], sort: Sort[]) {
  if (sort.length === 0) {
    return [...data]
  }
  const result = sortArray(
    data,
    sort.map((m) => m.key),
    sort.map((m) => m.direction),
  )
  return result
}

export default CommunityStocksRecentLayout
