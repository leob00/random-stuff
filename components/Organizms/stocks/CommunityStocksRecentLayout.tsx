import { Box, ListItemText } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import { Sort } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { useSessionSettings } from '../session/useSessionSettings'
import CommunityStocksLayout from './CommunityStocksLayout'
import CustomSortAlert from './CustomSortAlert'
import StocksCustomSortForm from './StocksCustomSortForm'
import { useRouter } from 'next/router'

const CommunityStocksRecentLayout = ({ data }: { data: StockQuote[] }) => {
  const router = useRouter()
  const settings = useSessionSettings()
  const [showCustomSortForm, setShowCustomSortForm] = React.useState(false)

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuSort text={'sort'} />,
      fn: () => setShowCustomSortForm(true),
    },
    {
      item: <ContextMenuReport text={'reports'} />,
      fn: () => router.push('/ssg/stocks/reports/volumeleaders'),
    },
  ]
  const handleCustomSortSubmitted = (sort?: Sort[]) => {
    settings.saveCommunityStocksSort(sort)
    setShowCustomSortForm(false)
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
      <CommunityStocksLayout data={data} defaultSort={settings.communityStocks?.defaultSort ?? []} />
      <FormDialog show={showCustomSortForm} title={'sort'} onCancel={() => setShowCustomSortForm(false)} showActionButtons={false}>
        <StocksCustomSortForm result={settings.communityStocks?.defaultSort} onSubmitted={handleCustomSortSubmitted} />
      </FormDialog>
    </Box>
  )
}

export default CommunityStocksRecentLayout
