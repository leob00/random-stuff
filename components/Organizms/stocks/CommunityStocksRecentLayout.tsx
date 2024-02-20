import { Box, ListItemText } from '@mui/material'
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
import { usePager } from 'hooks/usePager'
import { orderBy } from 'lodash'
import { sortArray } from 'lib/util/collections'

const CommunityStocksRecentLayout = ({ data, isLoading }: { data: StockQuote[]; isLoading: boolean }) => {
  const router = useRouter()
  const settings = useSessionSettings()
  const sortedData = settings.communityStocks?.defaultSort
    ? sortArray(
        data,
        settings.communityStocks.defaultSort.map((m) => m.key),
        settings.communityStocks.defaultSort.map((m) => m.direction),
      )
    : [...data]

  const [showCustomSortForm, setShowCustomSortForm] = React.useState(false)
  const pager = usePager(sortedData, 5)
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
    const sorted =
      sort && sort.length > 0
        ? orderBy(
            data,
            sort.map((k) => k.key),
            sort.map((d) => d.direction),
          )
        : [...data]
    pager.reset(sorted)
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
      {!isLoading && <CommunityStocksLayout data={sortedData} pager={pager} isLoading={isLoading} />}
      <FormDialog show={showCustomSortForm} title={'sort'} onCancel={() => setShowCustomSortForm(false)} showActionButtons={false}>
        <StocksCustomSortForm result={settings.communityStocks?.defaultSort} onSubmitted={handleCustomSortSubmitted} />
      </FormDialog>
    </Box>
  )
}

export default CommunityStocksRecentLayout
