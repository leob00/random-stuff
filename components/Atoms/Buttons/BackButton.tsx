'use client'
import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/navigation'

const BackButton = ({ route, text }: { route?: string; text?: string }) => {
  const router = useRouter()
  const { previousRoute } = useRouteTracker()

  const handleClick = () => {
    if (route) {
      router.push(route)
      return
    }

    if (!route) {
      router.push(previousRoute.path)
      return
    }
  }
  return (
    <Button variant='text' onClick={handleClick} color='primary'>
      &#8592; {`${text ?? 'back'}`}
    </Button>
  )
}

export default BackButton
