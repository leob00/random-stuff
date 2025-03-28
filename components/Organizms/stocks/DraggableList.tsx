'use client'
import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StrictModeDroppable } from './StrictModeDroppable'
import { Box, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import FormTextBox from 'components/Atoms/Inputs/FormTextBox'
import { cloneDeep } from 'lodash'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import AutoCompleteSolo from 'components/Atoms/Inputs/AutoCompleteSolo'
import CenterStack from 'components/Atoms/CenterStack'

export type DraggableListProps = {
  items: StockQuote[]
  onPushChanges: (quotes: StockQuote[]) => void
  onEditSingleItem: (quote: StockQuote) => void
  isLoading: boolean
}

export interface SelectableQuote extends StockQuote {
  selected?: boolean
}

const DraggableList = ({ items, onPushChanges, onEditSingleItem, isLoading }: DraggableListProps) => {
  const [deleteItem, setDeleteItem] = React.useState<StockQuote | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const [showConfirmDeleteMulti, setShowConfirmDeleteMulti] = React.useState(false)
  const selecteableItems: SelectableQuote[] = items.map((item) => item)
  const itemMap = getMapFromArray(selecteableItems, 'Symbol')
  const [map, setMap] = React.useState(itemMap)
  const [selectedItems, setSelectedItems] = React.useState(selecteableItems.filter((item) => item.selected))
  const [showMultiMenu, setShowMultiMenu] = React.useState(true)
  const [allStocks, setAllStocks] = React.useState(items)

  const handleRemoveQuote = (symbol: string) => {
    const list = allStocks.filter((m) => m.Symbol !== symbol)
    const map = getMapFromArray(list, 'Symbol')
    setMap(map)
    setAllStocks(list)
    onPushChanges(list)
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }
    const items = cloneDeep(allStocks)
    const [removed] = items.splice(source.index, 1)
    items.splice(destination.index, 0, removed)
    setAllStocks(items)
    const newMap = getMapFromArray(items, 'Symbol')
    setMap(newMap)
    pushChanges(newMap)
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
    setShowConfirmDeleteMulti(false)
    setDeleteItem(null)
    setShowMultiMenu(true)
  }
  const pushChanges = (newMap: Map<any, SelectableQuote>) => {
    const list = Array.from(newMap.values())
    const newList: StockQuote[] = list.map((item) => {
      return {
        Change: item.Change,
        ChangePercent: item.ChangePercent,
        Company: item.Company,
        Price: item.Price,
        Symbol: item.Symbol,
        TradeDate: item.TradeDate,
        GroupName: item.GroupName,
        MarketCapShort: item.MarketCapShort,
        PeRatio: item.PeRatio,
        Sector: item.Sector,
        SectorId: item.SectorId,
        AnnualDividendYield: item.AnnualDividendYield,
      }
    })
    setMap(newMap)

    onPushChanges(newList)
  }

  const handleDeleteMulti = () => {
    setShowConfirmDelete(false)
    setShowConfirmDeleteMulti(false)
    const newMap = map
    selectedItems.forEach((item) => {
      newMap.delete(item.Symbol)
    })
    setSelectedItems([])

    pushChanges(newMap)
  }
  const handleShowConfirmDeleteMulti = () => {
    setShowConfirmDeleteMulti(true)
  }

  const handleCheckItem = (symbol: string, checked: boolean) => {
    const quote = map.get(symbol)!
    quote.selected = checked
    map.set(symbol, quote)
    setMap(map)
    const selected = getListFromMap(map).filter((item) => item.selected)
    setSelectedItems(selected)
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuDelete />,
      fn: handleShowConfirmDeleteMulti,
    },
  ]

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          {selectedItems.length > 0 && showMultiMenu && (
            <Box>
              <ContextMenu items={contextMenu} />
            </Box>
          )}
        </Box>
      </Box>
      <HorizontalDivider />
      <Box py={2}>
        <CenterStack>
          <Typography variant='caption'>
            You can reorder your list by dragging and dropping items, or you can edit each item by using its corresponding menu. The order will only be applied
            if sort is turned off.
          </Typography>
        </CenterStack>
      </Box>
      {/* @ts-expect-error needs to be reviewed */}
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='droppable-list'>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {allStocks.map((item, index) => (
                <DraggableListItem
                  isLoading={isLoading}
                  item={item}
                  index={index}
                  key={`${item.Symbol}${item.GroupName}`}
                  onRemoveItem={() => {
                    handleShowConfirmDelete(item)
                  }}
                  onCheckItem={(checked: boolean) => {
                    handleCheckItem(item.Symbol, checked)
                  }}
                  onEdit={onEditSingleItem}
                />
              ))}
              <>{provided.placeholder}</>
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <ConfirmDeleteDialog
        show={showConfirmDelete}
        text={`Are you sure you want to remove ${deleteItem?.Company}?`}
        onConfirm={() => handleRemoveItem(deleteItem!.Symbol)}
        onCancel={handleCancelDelete}
      />
      <ConfirmDeleteDialog
        show={showConfirmDeleteMulti}
        text={`are you sure you want to remove all selected quotes?`}
        onConfirm={handleDeleteMulti}
        onCancel={handleCancelDelete}
      />
    </>
  )
}
export default DraggableList
