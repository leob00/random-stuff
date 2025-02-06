import { Box, ListItem, ListItemAvatar, ListItemText, useMediaQuery, useTheme } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import DragIndicator from '@mui/icons-material/DragIndicator'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { DashboardWidget, WidgetSize } from './dashboardModel'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import { DropdownItem } from 'lib/models/dropdown'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import FadeIn from 'components/Atoms/Animations/FadeIn'

export type DraggableListItemProps = {
  item: DashboardWidget
  index: number
  onUpdate: (item: DashboardWidget) => void
  disableShowHide: boolean
}

const DraggableWidget = ({ item, index, onUpdate, disableShowHide }: DraggableListItemProps) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const onUpdateDisplay = (item: DashboardWidget, checked: boolean) => {
    const newItem = { ...item, display: checked }
    onUpdate(newItem)
  }
  const onUpdateSize = (item: DashboardWidget, size: WidgetSize) => {
    const newItem = { ...item, size: size }
    onUpdate(newItem)
  }

  const widgetSizeOptions: DropdownItem[] = [
    {
      text: 'small',
      value: 'sm',
    },
    {
      text: 'medium',
      value: 'md',
    },
    {
      text: 'large',
      value: 'lg',
    },
  ]

  return (
    <>
      {/* @ts-expect-error needs to be reviewed */}
      <Draggable draggableId={item.id} index={index} key={item.id}>
        {(provided, snapshot) => (
          <>
            <FadeIn>
              <ListItem id={item.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <ListItemAvatar>
                  <DragIndicator />
                </ListItemAvatar>
                <ListItemText primary={`${item.title}`} secondary={` `} sx={{ mt: -0.5 }} />
                <Box>
                  <OnOffSwitch
                    label='show'
                    isChecked={item.display}
                    onChanged={(checked) => {
                      onUpdateDisplay(item, checked)
                    }}
                    disabled={disableShowHide}
                  />
                </Box>
                {!isXSmall && (
                  <Box>
                    <DropdownList
                      disabled={!item.allowSizeChange}
                      options={widgetSizeOptions}
                      selectedOption={item.size ?? ''}
                      onOptionSelected={(val) => {
                        onUpdateSize(item, val as WidgetSize)
                      }}
                    />
                  </Box>
                )}
              </ListItem>
            </FadeIn>
            <HorizontalDivider />
          </>
        )}
      </Draggable>
    </>
  )
}

export default DraggableWidget
