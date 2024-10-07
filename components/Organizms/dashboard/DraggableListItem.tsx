import { ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { DashboardWidget } from './dashboardModel'

export type DraggableListItemProps = {
  item: DashboardWidget
  index: number
}

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  return (
    <>
      {/* @ts-expect-error needs to be reviewed */}
      <Draggable draggableId={item.id} index={index} key={item.id}>
        {(provided, snapshot) => (
          <>
            <ListItem id={item.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <ListItemAvatar>
                <DragIndicator />
              </ListItemAvatar>
              <ListItemText primary={`${item.title}`} secondary={` `} sx={{ mt: -0.5 }} />
              <Stack alignItems={'flex-end'} flexGrow={1} pr={2}></Stack>
            </ListItem>
            <HorizontalDivider />
          </>
        )}
      </Draggable>
    </>
  )
}

export default DraggableListItem
