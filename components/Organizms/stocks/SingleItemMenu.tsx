import React from 'react'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'

const SingleItemMenu = ({ symbol, onEdelete }: { symbol: string; onEdelete: (symbol: string) => void }) => {
  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuDelete />,
      fn: () => {
        onEdelete(symbol)
      },
    },
  ]
  return (
    //
    <ContextMenu items={contextMenu} />
  )
}

export default SingleItemMenu
