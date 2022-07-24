import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { BasicArticle } from 'lib/model'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { useRouter } from 'next/router'
import { getRandomDog } from 'lib/backend/api/randomAnimalsApi'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let article = await getRandomDog()
  return {
    props: {
      data: article,
    },
  }
}

const Dogs: NextPage<{ data: BasicArticle }> = ({ data }) => {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
  return <RandomAnimalLayout data={data} onRefresh={refreshData} />
}

export default Dogs
