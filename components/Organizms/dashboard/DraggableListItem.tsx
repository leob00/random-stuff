import { Box, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { DashboardWidget } from './dashboardModel'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'

export type DraggableListItemProps = {
  item: DashboardWidget
  index: number
  onShowHide: (item: DashboardWidget, display: boolean) => void
}

const DraggableListItem = ({ item, index, onShowHide }: DraggableListItemProps) => {
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
              <Box>
                <OnOffSwitch
                  label='show'
                  isChecked={item.display}
                  onChanged={(checked) => {
                    onShowHide(item, checked)
                  }}
                />
              </Box>
            </ListItem>

            <HorizontalDivider />
          </>
        )}
      </Draggable>
    </>
  )
}

export default DraggableListItem
