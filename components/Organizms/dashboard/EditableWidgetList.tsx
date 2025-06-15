'use client'
import { Box, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material'
import { DashboardWidget, DashboardWidgetWithSettings, WidgetSize } from './dashboardModel'
import React from 'react'
import OnOffSwitch from 'components/Atoms/Inputs/OnOffSwitch'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { DropdownItem } from 'lib/models/dropdown'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { getSortablePropsFromArray, SortableItem } from 'components/dnd/dndUtil'

export type DraggableListProps = {
  items: DashboardWidgetWithSettings[]
  onPushChanges: (items: SortableItem[]) => void
  disableShowHide?: boolean
}

const DraggableWidgetList = ({ items, onPushChanges, disableShowHide }: DraggableListProps) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const handleUpdateItem = (item: DashboardWidgetWithSettings) => {
    const newItems = [...items]
    const idx = newItems.findIndex((m) => m.id === item.id)
    if (idx > -1) {
      newItems[idx] = item
    } else {
      newItems.push(item)
    }
    const sortableItems = getSortablePropsFromArray(newItems, 'id', 'title')
    onPushChanges(sortableItems)
  }

  const onUpdateDisplay = (item: DashboardWidget, checked: boolean) => {
    const newItem = { ...item, display: checked }
    handleUpdateItem(newItem)
  }
  const onUpdateSize = (item: DashboardWidget, size: WidgetSize) => {
    const newItem = { ...item, size: size }
    handleUpdateItem(newItem)
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
      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}></Box>
      <Box pb={2}></Box>

      {items.map((item) => (
        <React.Fragment key={item.id}>
          <ListItem id={item.id}>
            <ListItemText primary={`${item.title}`} secondary={``} />
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
          <HorizontalDivider />
        </React.Fragment>
      ))}
    </>
  )
}
export default DraggableWidgetList
