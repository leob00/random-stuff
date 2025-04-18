import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/router'
import ContextMenuPortfolio from 'components/Molecules/Menus/ContextMenuPortfolio'
import ContextMenuPeople from 'components/Molecules/Menus/ContextMenuPeople'
import ContextMenuAlert from 'components/Molecules/Menus/ContextMenuAlert'
import ContextMenuReport from 'components/Molecules/Menus/ContextMenuReport'
import ContextMenuEarnings from 'components/Molecules/Menus/ContextMenuEarnings'

const GroupedListMenu = ({ onEdit, onShowAsGroup }: { onEdit: () => void; onShowAsGroup?: (show: boolean) => void }) => {
  const router = useRouter()
  const handleClick = (event: 'edit' | 'showAsGroup') => {
    switch (event) {
      case 'showAsGroup':
        onShowAsGroup?.(true)
        break
      case 'edit':
        onEdit()
        break
    }
  }

  const handleShowGrouped = (grouped: boolean) => {
    onShowAsGroup?.(grouped)
  }

  const contextMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: () => handleClick('edit'),
    },
    {
      item: (
        <>
          <ListItemIcon>
            <FormatListBulletedIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='view as flat list' />
        </>
      ),
      fn: () => handleShowGrouped(false),
    },
    {
      item: <ContextMenuPeople text={'community stocks'} />,
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: (
        <>
          <ContextMenuPortfolio text={'portfolio'} />
        </>
      ),
      fn: () => router.push('/csr/stocks/stock-porfolios'),
    },
    {
      item: (
        <>
          <ContextMenuAlert text={'manage alerts'} />
        </>
      ),
      fn: () => router.push('/csr/stocks/alerts'),
    },
    {
      item: (
        <>
          <ContextMenuReport text='reports' />
        </>
      ),
      fn: () => router.push(`/ssg/stocks/reports/volume-leaders`),
    },
    {
      item: <ContextMenuEarnings text={'earnings calendar'} />,
      fn: () => router.push('/csr/stocks/earnings-calendar'),
    },
  ]

  return <ContextMenu items={contextMenu} />
}

export default GroupedListMenu
