import { Box } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/navigation'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import WidgetsDisplay from '../widgets/WidgetsDisplay'

const UserDashboardLayout = () => {
  const router = useRouter()
  const { dashboardWidgets } = useLocalStore()
  const visibleWidgets = dashboardWidgets.filter((m) => m.display)

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
      <Box display={'flex'} justifyContent={'flex-end'}>
        <ContextMenu items={menu} />
      </Box>
      <WidgetsDisplay widgets={visibleWidgets} />
    </Box>
  )
}

export default UserDashboardLayout
