'use client'
import { Box } from '@mui/material'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredHeader from '../Boxes/CenteredHeader'
import BasicBreadcrumbs from '../Navigation/Breadcrumbs'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import { Context } from '@dnd-kit/sortable/dist/components'

const PageHeader = ({
  text,
  backButtonRoute,
  forceShowBackButton,
  generateBackButton = false,
  menu,
}: {
  text: string
  backButtonRoute?: string
  forceShowBackButton?: boolean
  generateBackButton?: boolean
  menu?: ContextMenuItem[]
}) => {
  const { previousRoute } = useRouteTracker()

  return (
    <Box pb={4}>
      <BasicBreadcrumbs />
      {forceShowBackButton && (
        <Box display={'flex'}>{backButtonRoute ? <BackButton route={backButtonRoute} /> : <BackButton route={previousRoute.path} />}</Box>
      )}
      <Box display={'flex'} alignItems={'center'} pt={4} pb={2}>
        <Box flexGrow={1}>
          <CenteredHeader title={text} />
        </Box>
        <Box>
          <Box>{menu && <ContextMenu items={menu} />}</Box>
        </Box>
      </Box>

      <HorizontalDivider />
    </Box>
  )
}

export default PageHeader
