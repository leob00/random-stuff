import WarmupBox from 'components/Atoms/WarmupBox'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const { id } = router.query
  const [redirectPath, setRedirectPath] = useState('')
  //let id = query

  useEffect(() => {
    //const { id } = router.query
    //console.log('id: ' + id)
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
