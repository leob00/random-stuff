import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const userController = useUserController()

  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const router = useRouter()
  const id = router.query['id'] as string
  const returnUrl = router.query['returnUrl'] as string | undefined

  React.useEffect(() => {
    let isLoaded = false
    if (!isLoaded) {
      const fn = async () => {
        if (!userController.authProfile) {
          const p = await userController.fetchProfilePassive(900)
          userController.setProfile(p)
          setUserProfile(p)
        }
        setLoading(false)
      }
      fn()
    }
    return () => {
      isLoaded = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.authProfile?.username])

  return (
    <>
      <Seo pageTitle={`Stock Details: ${id}`} />
      <ResponsiveContainer>
        {loading && <BackdropLoader />}
        <BackButton route={returnUrl} />
        {id && <StockDetailsLayout userProfile={userProfile} symbol={id} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
