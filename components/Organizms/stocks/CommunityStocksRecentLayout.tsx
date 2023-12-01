import { Box, ListItemText } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import { Sort } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { useSessionSettings } from '../session/useSessionSettings'
import CommunityStocksLayout from './CommunityStocksLayout'
import CustomSortAlert from './CustomSortAlert'
import StocksCustomSortForm from './StocksCustomSortForm'

const CommunityStocksRecentLayout = ({ data }: { data: StockQuote[] }) => {
  const settings = useSessionSettings()
  const [showCustomSortForm, setShowCustomSortForm] = React.useState(false)

  const menu: ContextMenuItem[] = [
    {
      fn: () => setShowCustomSortForm(true),
      item: <ContextMenuSort text={'sort'} />,
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
