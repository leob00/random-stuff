import React, { useEffect } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import router from 'next/router'
import WarmupBox from 'components/Atoms/WarmupBox'

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {},
    },
  }
}

const WarmUp: NextPage<{ data: any }> = ({ data }) => {
  useEffect(() => {
    router.push('/ssr/warmup')
  }, [])

  return (
    <>
      <WarmupBox />
    </>
  )
}

export default WarmUp
