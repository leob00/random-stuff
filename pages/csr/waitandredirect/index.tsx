import WarmupBox from 'components/Atoms/WarmupBox'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    router.push(`/${id}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <WarmupBox />
    </>
  )
}

export default Page
