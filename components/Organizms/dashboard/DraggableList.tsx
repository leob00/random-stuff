'use client'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Box, Typography } from '@mui/material'
import { getMapFromArray } from 'lib/util/collectionsNative'
import CenterStack from 'components/Atoms/CenterStack'
import { StrictModeDroppable } from '../stocks/StrictModeDroppable'
import { useState } from 'react'
import { DashboardWidget } from './dashboardModel'

export type DraggableListProps = {
  items: DashboardWidget[]
  onPushChanges: (items: DashboardWidget[]) => void
}

const DraggableList = ({ items, onPushChanges }: DraggableListProps) => {
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }
    const newItems = [...items]
    const [removed] = newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, removed)
    const newMap = getMapFromArray(newItems, 'id')
    pushChanges(newMap)
  }

  const pushChanges = (newMap: Map<any, DashboardWidget>) => {
    const list = Array.from(newMap.values())
    list.forEach((m, index) => {
      m.waitToRenderMs = index * 400
    })

    const newList: DashboardWidget[] = list.map((item) => {
      return {
        id: item.id,
        title: item.title,
        waitToRenderMs: item.waitToRenderMs,
        display: item.display,
      }
    })

    onPushChanges(newList)
  }

  const handleUpdateShowHide = (item: DashboardWidget, display: boolean) => {
    const newItem = items.find((m) => m.id === item.id)
    if (newItem) {
      const map = getMapFromArray(items, 'id')
      const toUpdate = { ...map.get(item.id)!, display: display }
      map.set(item.id, toUpdate)
      onPushChanges(Array.from(map.values()))
    }
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <Box py={2}>
        <CenterStack>
          <Typography variant='caption'>You can reorder your list by dragging and dropping items.</Typography>
        </CenterStack>
      </Box>
      {/* @ts-expect-error needs to be reviewed */}
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='droppable-dashboard-list'>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <DraggableListItem item={item} index={index} key={item.id} onShowHide={handleUpdateShowHide} />
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
