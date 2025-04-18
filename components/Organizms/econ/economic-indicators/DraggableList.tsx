'use client'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Box, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { cloneDeep } from 'lodash'
import CenterStack from 'components/Atoms/CenterStack'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { useState } from 'react'
import { StrictModeDroppable } from 'components/Organizms/stocks/StrictModeDroppable'
import DraggableListItem from './DraggableListItem'

export type DraggableListProps = {
  items: EconomicDataItem[]
  onPushChanges: (item: EconomicDataItem[]) => void
}

const DraggableList = ({ items, onPushChanges }: DraggableListProps) => {
  const selecteableItems: EconomicDataItem[] = items.map((item) => item)
  const itemMap = getMapFromArray(selecteableItems, 'InternalId')
  const [map, setMap] = useState(itemMap)
  const [allItems, setAllItems] = useState(items)

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }
    const items = [...allItems]
    const [removed] = items.splice(source.index, 1)
    items.splice(destination.index, 0, removed)
    setAllItems(items)
    const newMap = getMapFromArray(items, 'InternalId')
    setMap(newMap)
    pushChanges(newMap)
  }

  const pushChanges = (newMap: Map<any, EconomicDataItem>) => {
    const list = Array.from(newMap.values())
    const newList: EconomicDataItem[] = list.map((item) => {
      return {
        InternalId: item.InternalId,
        Notes: item.Notes,
        Title: item.Title,
        Units: item.Units,
        Chart: null,
        Value: item.Value,
      }
    })
    setMap(newMap)
    onPushChanges(newList)
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <HorizontalDivider />
      <Box py={2}>
        <CenterStack>
          <Typography variant='caption'>You can reorder your list by dragging and dropping items.</Typography>
        </CenterStack>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='droppable-econ-list'>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {allItems.map((item, index) => (
                <DraggableListItem item={item} index={index} key={String(item.InternalId)} />
              ))}
              <>{provided.placeholder}</>
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  )
}
export default DraggableList
