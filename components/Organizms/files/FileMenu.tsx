import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuMove from 'components/Molecules/Menus/ContextMenuMove'
import ContextMenuView from 'components/Molecules/Menus/ContextMenuView'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import React from 'react'

const FileMenu = ({
  item,
  onView,
  onDelete,
  onRename,
  onMovefile,
}: {
  item: S3Object
  onView: (item: S3Object) => void
  onDelete: (item: S3Object) => void
  onMovefile: (item: S3Object) => void
  onRename?: (item: S3Object) => void
}) => {
  const menu: ContextMenuItem[] = []
  if (!item.isFolder) {
    menu.push({
      item: <ContextMenuView />,
      fn: () => onView(item),
    })
  }
  menu.push({
    item: <ContextMenuEdit text={'rename'} />,
    fn: () => onRename?.(item),
  })
  menu.push({
    item: <ContextMenuMove text={'move'} />,
    fn: () => onMovefile(item),
  })
  menu.push({
    item: <ContextMenuDelete text={'delete'} />,
    fn: () => onDelete(item),
  })
  return <ContextMenu items={menu} />
}

export default FileMenu
