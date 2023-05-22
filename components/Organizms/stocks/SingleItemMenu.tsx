import React from 'react'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { StockQuote } from 'lib/backend/api/models/zModels'

const SingleItemMenu = ({ quote, onEdelete, onEdit }: { quote: StockQuote; onEdelete: (symbol: string) => void; onEdit: (quote: StockQuote) => void }) => {
  // const handleClose = () => {
  //   setShowEdit(false)
  // }
  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: () => {
        onEdit(quote)
      },
    },
    {
      item: <ContextMenuDelete />,
      fn: () => {
        onEdelete(quote.Symbol)
      },
    },
  ]
  return (
    <>
      <ContextMenu items={contextMenu} />
    </>
  )
}

export default SingleItemMenu
