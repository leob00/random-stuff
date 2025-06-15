'use client'
import * as React from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Box, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import CenterStack from 'components/Atoms/CenterStack'
import SingleItemMenu from './SingleItemMenu'

export type DraggableListProps = {
  items: StockQuote[]
  onPushChanges: (quotes: StockQuote[]) => void
  onEditSingleItem: (quote: StockQuote) => void
  isLoading: boolean
}

export interface SelectableQuote extends StockQuote {
  selected?: boolean
}

const EditableStockListNew = ({ items, onPushChanges, onEditSingleItem, isLoading }: DraggableListProps) => {
  const [deleteItem, setDeleteItem] = React.useState<StockQuote | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)

  const handleRemoveQuote = (symbol: string) => {
    const list = items.filter((m) => m.Symbol !== symbol)
    onPushChanges(list)
  }

  const handleRemoveItem = (id: string) => {
    setDeleteItem(null)
    setShowConfirmDelete(false)
    handleRemoveQuote(id)
  }
  const handleShowConfirmDelete = (item: StockQuote) => {
    setDeleteItem(item)
    setShowConfirmDelete(true)
  }
  const handleCancelDelete = () => {
    setShowConfirmDelete(false)
    setDeleteItem(null)
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <HorizontalDivider />
      <Box py={2}>
        <CenterStack>
          <Typography variant='caption'>You can edit each item by using its corresponding menu.</Typography>
        </CenterStack>
      </Box>

      <Box>
        {items.map((item, index) => (
          <Box key={item.Symbol}>
            <Box display='flex' justifyContent={'space-between'}>
              <Box>
                <ListItem>
                  <ListItemText primary={`${item.Company} (${item.Symbol})`} secondary={`Group name: ${item.GroupName ?? ''}`} />
                </ListItem>
              </Box>
              <Box>
                <SingleItemMenu onEdelete={handleRemoveItem} quote={item} onEdit={onEditSingleItem} />
              </Box>
            </Box>
            <HorizontalDivider />
          </Box>
        ))}
      </Box>

      <ConfirmDeleteDialog
        show={showConfirmDelete}
        text={`Are you sure you want to remove ${deleteItem?.Company}?`}
        onConfirm={() => handleRemoveItem(deleteItem!.Symbol)}
        onCancel={handleCancelDelete}
      />
    </>
  )
}
export default EditableStockListNew
