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
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { mutate } from 'swr'
import { sleep } from 'lib/util/timers'

const UserDashboardLayout = () => {
  const router = useRouter()
  const { dashboardWidgets } = useLocalStore()

  const mutatkeKey = 'user-dashboard'
  const dataFn = async () => {
    const result = dashboardWidgets.filter((m) => m.display)
    await sleep(1000)
    return result
  }

  const { data: visibleWidgets, isLoading } = useSwrHelper(mutatkeKey, dataFn, { revalidateOnFocus: false })

  const onEdit = () => {
    router.push('/protected/csr/dashboard/edit')
  }
  const onRefresh = () => {
    mutate(mutatkeKey)
  }

  const menu: ContextMenuItem[] = [
    {
      fn: onRefresh,
      item: <ContextMenuRefresh />,
    },
    {
      fn: onEdit,
      item: <ContextMenuEdit />,
    },
  ]

  return (
    <Box>
      {visibleWidgets && !isLoading && (
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
