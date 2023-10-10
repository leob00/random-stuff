import { ListItemText } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuView from 'components/Molecules/Menus/ContextMenuView'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const FileMenu = ({ item, readOnly = false, onView, onDelete, onRename }: { item: S3Object; readOnly?: boolean; onView: (item: S3Object) => void; onDelete: (item: S3Object) => void; onRename?: (item: S3Object) => void }) => {
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuView />,
      fn: () => onView(item),
    },
  ]
  if (!readOnly) {
    menu.push({
      item: <ContextMenuEdit text={'rename'} />,
      fn: () => onRename?.(item),
    })
    menu.push({
      item: <ContextMenuDelete />,
      fn: () => onDelete(item),
    })
  }
  return <ContextMenu items={menu} />
}

export default FileMenu
