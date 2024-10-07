'use client'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, DropResult, PreDragActions, SensorAPI, SnapDragActions } from 'react-beautiful-dnd'
import { Box, Typography } from '@mui/material'
import { getMapFromArray } from 'lib/util/collectionsNative'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenterStack from 'components/Atoms/CenterStack'
import { StrictModeDroppable } from '../stocks/StrictModeDroppable'
import { useState } from 'react'
import { DashboardWidget } from './dashboardModel'

export type DraggableListProps = {
  items: DashboardWidget[]
  onPushChanges: (items: DashboardWidget[]) => void
}

const DraggableList = ({ items, onPushChanges }: DraggableListProps) => {
  const [allItems, setAllItems] = useState(items)

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return
    }
    const items = [...allItems]
    const [removed] = items.splice(source.index, 1)
    items.splice(destination.index, 0, removed)
    setAllItems(items)
    const newMap = getMapFromArray(items, 'id')
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
      }
    })

    onPushChanges(newList)
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
              {allItems.map((item, index) => (
                <DraggableListItem item={item} index={index} key={item.id} />
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
