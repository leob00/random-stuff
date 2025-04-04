'use client'
import { Box, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouteTracker } from './session/useRouteTracker'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'
import { useUserController } from 'hooks/userController'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { useState } from 'react'
import { Navigation } from './session/useSessionSettings'
import { useSwrHelper } from 'hooks/useSwrHelper'
import StaticAutoCompleteFreeSolo from 'components/Atoms/Inputs/StaticAutoCompleteFreeSolo'
import { DropdownItem } from 'lib/models/dropdown'
import { flatSiteMap } from './navigation/siteMap'
import { useRouter } from 'next/navigation'

type Model = {
  isAdmin: boolean
  recentRoutes: Navigation[]
}

const HomeMenu = () => {
  const { allRoutes: recentRoutes } = useRouteTracker()
  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const [showDefaultMenu, setShowDefaultMenu] = useState(recentHistory.length < 4)
  const { ticket } = useUserController()
  const allRoutes = flatSiteMap.filter((m) => m.category !== 'Home')
  const router = useRouter()

  const mutateKey = 'route-tracker'

  const fn = async () => {
    const isAdmin = userHasRole('Admin', ticket?.roles ?? [])
    const result: Model = {
      isAdmin: userHasRole('Admin', ticket?.roles ?? []),
      recentRoutes: recentHistory,
    }
    return result
  }
  const { data } = useSwrHelper(mutateKey, fn, { revalidateOnFocus: false })

  const searchItems: DropdownItem[] = allRoutes.map((m) => {
    return { text: m.name, value: m.path }
  })

  const handleSelected = (item: DropdownItem) => {
    router.push(item.value)
  }

  return (
    <Box>
      {data && (
        <Box
          sx={{
            mt: 4,
            borderTopWidth: 3,
          }}
        >
          <Box display={'flex'} justifyContent={'center'}>
            <StaticAutoCompleteFreeSolo searchResults={searchItems} onSelected={handleSelected} placeholder='search' />
          </Box>
          <Box pb={8}>
            <Box py={2}>
              <GroupedHomeMenu all={allRoutes} recentRoutes={data.recentRoutes} isAdmin={data.isAdmin} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomeMenu
