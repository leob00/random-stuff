import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { Box } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/router'
import { allRouteMap } from 'components/Organizms/session/RouteTracker'
import { Path } from 'components/Organizms/navigation/siteMap'
import LinkButton from '../Buttons/LinkButton'

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const currentRoute = router.asPath
  const map = allRouteMap()
  const { lastRoute } = useRouteTracker()
  const routes: Path[] = []
  // if (map.has(lastRoute)) {
  //   routes.push(map.get(lastRoute)!)
  // }
  // if (map.has(currentRoute)) {
  //   routes.push(map.get(currentRoute)!)
  // }
  console.log(lastRoute, ' ', currentRoute)

  return (
    <Box display={'flex'} gap={2}>
      {routes.map((route) => (
        <LinkButton
          key={route.route}
          onClick={() => {
            router.push(route.route)
          }}
        >
          {route.name}
        </LinkButton>
      ))}
    </Box>
    // <Breadcrumbs aria-label='breadcrumb'>
    //   <Link underline='hover' color='inherit' href='/'>
    //     MUI
    //   </Link>
    //   <Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
    //     Core
    //   </Link>
    //   <Typography color='text.primary'>Breadcrumbs</Typography>
    // </Breadcrumbs>
  )
}
export default BasicBreadcrumbs
