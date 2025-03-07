'use client'
import { Box, Button } from '@mui/material'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import MenuIcon from '@mui/icons-material/Menu'
import { useRouteTracker } from './session/useRouteTracker'
import GroupedHomeMenu from './navigation/GroupedHomeMenu'
import { useUserController } from 'hooks/userController'
import { userHasRole } from 'lib/backend/auth/userUtil'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useState } from 'react'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { Navigation } from './session/useSessionSettings'
import { useSwrHelper } from 'hooks/useSwrHelper'

type Model = {
  isAdmin: boolean
  recentRoutes: Navigation[]
}

const HomeMenu = () => {
  const { allRoutes: recentRoutes } = useRouteTracker()
  const recentHistory = recentRoutes.filter((m) => m.name !== 'home')
  const [showDefaultMenu, setShowDefaultMenu] = useState(recentHistory.length < 4)
  const { ticket } = useUserController()

  const mutateKey = 'route-tracker'

  const fn = async () => {
    const result: Model = {
      isAdmin: userHasRole('Admin', ticket?.roles ?? []),
      recentRoutes: recentHistory,
    }
    return result
  }
  const { data } = useSwrHelper(mutateKey, fn, { revalidateOnFocus: false })
  return (
    <Box>
      {data && (
        <Box
          sx={{
            mt: 4,
            borderTopWidth: 3,
          }}
        >
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button size='small' aria-haspopup='true' onClick={() => setShowDefaultMenu(!showDefaultMenu)}>
              <MenuIcon color='primary' fontSize='small' />
            </Button>
          </Box>
          <Box pb={8}>
            <Box py={2}>
              <GroupedHomeMenu recentRoutes={data.recentRoutes} isAdmin={data.isAdmin} />
              {/* {showDefaultMenu ? (
                <GroupedHomeMenu recentRoutes={data.recentRoutes} isAdmin={data.isAdmin} />
              ) : (
                <>
                  <CenteredTitle title={'Recent History'} variant='h4' />
                  {data.recentRoutes.map((item, i) => (
                    <Box key={item.path}>
                      <Box display={'flex'} justifyContent={'center'} py={2}>
                        <FadeIn>
                          <NavigationButton path={item.path} name={item.name} category={item.category} variant='h6' />
                        </FadeIn>
                      </Box>
                      <HorizontalDivider />
                    </Box>
                  ))}
                </>
              )} */}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomeMenu
