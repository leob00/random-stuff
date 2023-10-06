import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuView from 'components/Molecules/Menus/ContextMenuView'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const FileMenu = ({
  item,
  readOnly = false,
  onView,
  onDelete,
}: {
  item: S3Object
  readOnly?: boolean
  onView: (item: S3Object) => void
  onDelete: (item: S3Object) => void
}) => {
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuView />,
      fn: () => onView(item),
    },
  ]
  if (!readOnly) {
    menu.push({
      item: <ContextMenuDelete />,
      fn: () => onDelete(item),
    })
  }
  return <ContextMenu items={menu} />
}

export default FileMenu
