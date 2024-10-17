import { Box } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/navigation'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import WidgetsDisplay from '../widgets/WidgetsDisplay'
import { allWidgets } from './EditDashboard'

const UserDashboardLayout = () => {
  const router = useRouter()
  const { dashboardWidgets } = useLocalStore()
  const visibleWidgets = dashboardWidgets.filter((m) => m.display)
  const widgets = visibleWidgets.length > 0 ? visibleWidgets : allWidgets.filter((m) => m.display)

  const onEdit = () => {
    router.push('/protected/csr/dashboard/edit')
  }

  const menu: ContextMenuItem[] = [
    {
      fn: onEdit,
      item: <ContextMenuEdit />,
    },
  ]

  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-end'} pb={1}>
        <ContextMenu items={menu} />
      </Box>
      <WidgetsDisplay widgets={widgets} />
    </Box>
  )
}

export default UserDashboardLayout
