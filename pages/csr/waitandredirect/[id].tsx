import WarmupBox from 'components/Atoms/WarmupBox'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Waitandredirect = () => {
  const router = useRouter()
  const { id } = router.query
  const [redirectPath, setRedirectPath] = useState('')
  //let id = query

  useEffect(() => {
    //setRedirectPath(id)
    /* let redirect = id as string
    if (redirect) {
      switch (redirect.toLowerCase()) {
        case 'home':
          router.push('/')
          break
        default:
          router.push(`/${redirect}`)
          break
      }
    } */
    console.log(`id: ${id}`)
  }, [])

  return (
    <>
      <WarmupBox />
    </>
  )
}

export default Waitandredirect
