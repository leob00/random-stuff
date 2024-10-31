'use client'
import DraggableWidget from './DraggableWidget'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Box, Typography } from '@mui/material'
import { getMapFromArray } from 'lib/util/collectionsNative'
import CenterStack from 'components/Atoms/CenterStack'
import { StrictModeDroppable } from '../stocks/StrictModeDroppable'
import { DashboardWidgetWithSettings } from './dashboardModel'

export type DraggableListProps = {
  items: DashboardWidgetWithSettings[]
  onPushChanges: (items: DashboardWidgetWithSettings[]) => void
}

const DraggableWidgetList = ({ items, onPushChanges }: DraggableListProps) => {
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

  const pushChanges = (newMap: Map<any, DashboardWidgetWithSettings>) => {
    onPushChanges(Array.from(newMap.values()))
  }

  const handleUpdateItem = (item: DashboardWidgetWithSettings) => {
    const newItems = [...items]
    const idx = newItems.findIndex((m) => m.id === item.id)
    if (idx > -1) {
      newItems[idx] = item
    } else {
      newItems.push(item)
    }
    onPushChanges(newItems)
  }

  return (
    <>
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <Box pb={2}>
        <CenterStack>
          <Typography variant='body2'>You can reorder your list by dragging and dropping items.</Typography>
        </CenterStack>
      </Box>
      {/* @ts-expect-error needs to be reviewed */}
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId='droppable-dashboard-list'>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <DraggableWidget item={item} index={index} key={item.id} onUpdate={handleUpdateItem} disableShowHide={false} />
              ))}
              <>{provided.placeholder}</>
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  )
}
export default DraggableWidgetList
