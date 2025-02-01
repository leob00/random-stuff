import { Box, Typography } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { useRouter } from 'next/navigation'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import WidgetsDisplay from '../widgets/WidgetsDisplay'
import CenterStack from 'components/Atoms/CenterStack'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useEffect, useState } from 'react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const UserDashboardLayout = () => {
  const router = useRouter()
  const { dashboardWidgets } = useLocalStore()
  const visibleWidgets = dashboardWidgets.filter((m) => m.display)
  const [isLoading, setIsLoading] = useState(true)

  const onEdit = () => {
    router.push('/protected/csr/dashboard/edit')
  }

  const menu: ContextMenuItem[] = [
    {
      fn: onEdit,
      item: <ContextMenuEdit />,
    },
  ]
  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {!isLoading && (
        <>
          <Box display={'flex'} justifyContent={'flex-end'} pb={1}>
            <ContextMenu items={menu} />
          </Box>
          {visibleWidgets.length === 0 && (
            <Box>
              <CenterStack>
                <Typography>You currently do not have any widgets set up.</Typography>
              </CenterStack>
              <Box py={2}>
                <CenterStack>
                  <PrimaryButton
                    text='edit widgets'
                    onClick={() => {
                      router.push('/protected/csr/dashboard/edit')
                    }}
                  />
                </CenterStack>
              </Box>
            </Box>
          )}
          {!!visibleWidgets && visibleWidgets.length > 0 && <WidgetsDisplay widgets={visibleWidgets} />}
        </>
      )}
    </Box>
  )
}

export default UserDashboardLayout
