import WarmupBox from 'components/Atoms/WarmupBox'
import React, { useEffect, useState } from 'react'
import router from 'next/router'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}
const Waitandredirect: NextPage<{}> = ({}) => {
  useEffect(() => {
    const { id } = router.query
    //console.log('id: ' + id)
    router.push(`/${id}`)
  }, [])

  return <WarmupBox />
}

export default Waitandredirect
