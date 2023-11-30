import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()

  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const id = router.query['id'] as string
  const returnUrl = router.query['returnUrl'] as string | undefined

  React.useEffect(() => {
    let isLoaded = false
    if (!isLoaded) {
      const fn = async () => {
        if (!authProfile) {
          const p = await fetchProfilePassive(900)
          setProfile(p)
        }
        setLoading(false)
      }
      fn()
    }
    return () => {
      isLoaded = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile?.username])

  return (
    <>
      <Seo pageTitle={`Stock Details: ${id}`} />
      <ResponsiveContainer>
        {loading && <BackdropLoader />}
        <BackButton route={returnUrl} />
        {id && <StockDetailsLayout symbol={id} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
