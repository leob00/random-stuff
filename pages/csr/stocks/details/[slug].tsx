import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()

  const id = router.query.slug as string
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
