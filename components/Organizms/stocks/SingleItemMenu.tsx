import React from 'react'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { StockQuote } from 'lib/backend/api/models/zModels'
import ContextMenuMoveToTop from 'components/Molecules/Menus/ContextMenuMoveToTop'

const SingleItemMenu = ({
  quote,
  index,
  itemCount,
  onEdelete,
  onEdit,
  onMoveToTop,
}: {
  quote: StockQuote
  index: number
  itemCount: number
  onEdelete: (symbol: string) => void
  onEdit: (quote: StockQuote) => void
  onMoveToTop: (quote: StockQuote) => void
}) => {
  const contextMenu: ContextMenuItem[] = []
  if (itemCount > 1) {
    if (index > 0) {
      contextMenu.push({
        item: <ContextMenuMoveToTop />,
        fn: () => {
          onMoveToTop(quote)
        },
      })
    }
  }
  contextMenu.push({
    item: <ContextMenuEdit />,
    fn: () => {
      onEdit(quote)
    },
  })
  contextMenu.push({
    item: <ContextMenuDelete />,
    fn: () => {
      onEdelete(quote.Symbol)
    },
  })

  return (
    <>
      <ContextMenu items={contextMenu} />
    </>
  )
}

export default SingleItemMenu
