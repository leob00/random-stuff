import WarmupBox from 'components/Atoms/WarmupBox'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Waitandredirect = () => {
  const router = useRouter()
  const { id } = router.query
  const [redirectPath, setRedirectPath] = useState('')
  //let id = query

  return (
    <>
      <WarmupBox />
    </>
  )
}

export default Waitandredirect
