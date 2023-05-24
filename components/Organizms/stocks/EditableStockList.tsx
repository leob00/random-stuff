import { Box, ListItemText, Stack } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import SingleItemMenu from './SingleItemMenu'

const EditableStockList = ({
  items,
  handleRemoveItem,
  handleEditSingleItem,
}: {
  items: StockQuote[]
  handleRemoveItem: (id: string) => void
  handleEditSingleItem: (quote: StockQuote) => void
}) => {
  return (
    <Box pt={4}>
      <HorizontalDivider />
      {items.map((item, i) => (
        <Box key={item.Symbol} py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <ListItemText primary={`${item.Company} (${item.Symbol})`} secondary={`Group name: ${item.GroupName ?? ''}`} />
          </Box>
          <Stack alignItems={'flex-end'} flexGrow={1} pr={2}>
            <SingleItemMenu onEdelete={handleRemoveItem} quote={item} onEdit={handleEditSingleItem} />
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

export default EditableStockList
