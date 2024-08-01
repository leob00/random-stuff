import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()

  const id = router.query['id'] as string
  const returnUrl = router.query['returnUrl'] as string | undefined
  return (
    <>
      <Seo pageTitle={`Stock Details: ${id}`} />
      <ResponsiveContainer>
        <BackButton route={returnUrl} />
        {id && <StockDetailsLayout symbol={id} disableCollapse />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
