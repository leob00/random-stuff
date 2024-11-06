import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [loadingProfile, setLoadingProfile] = useState(true)
  const { authProfile, setProfile, fetchProfilePassive } = useUserController()

  const id = router.query.slug as string | undefined

  useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
      }
      setLoadingProfile(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      <Seo pageTitle={`Stock Details: ${id}`} />
      <ResponsiveContainer>
        <PageHeader text='' />
        {id && !loadingProfile && <StockDetailsLayout symbol={id} disableCollapse />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
