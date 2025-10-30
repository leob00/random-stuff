'use client'
import { Box } from '@mui/material'
import { useRouteTracker } from './session/useRouteTracker'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'
import { useUserController } from 'hooks/userController'
import { userHasRole } from 'lib/backend/auth/userUtil'
import { Navigation } from './session/useSessionSettings'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { DropdownItem } from 'lib/models/dropdown'
import { flatSiteMap } from './navigation/siteMap'
import { useRouter } from 'next/navigation'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { sortArray } from 'lib/util/collections'

type Model = {
  isAdmin: boolean
  recentRoutes: Navigation[]
}

const HomeMenu = () => {
  const { allRoutes: recentRoutes } = useRouteTracker()
  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const { ticket } = useUserController()
  const allRoutes = flatSiteMap.filter((m) => m.category !== 'Home')
  const router = useRouter()

  const mutateKey = 'route-tracker'

  const fn = async () => {
    const result: Model = {
      isAdmin: userHasRole('Admin', ticket?.roles ?? []),
      recentRoutes: recentHistory,
    }
    return result
  }
  const { data } = useSwrHelper(mutateKey, fn, { revalidateOnFocus: false })

  const searchItems: DropdownItem[] = sortArray(
    allRoutes.map((m) => {
      return { text: m.name, value: m.path }
    }),
    ['text'],
    ['asc'],
  )

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
            <StaticAutoComplete options={searchItems} onSelected={handleSelected} placeholder='search' />
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
