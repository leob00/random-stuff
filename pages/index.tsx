import HomeMenu from 'components/Organizms/HomeMenu'
import Seo from 'components/Organizms/Seo'
import { GetStaticProps, NextPage } from 'next'
import React from 'react'

interface PageProps {
  title: string
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  return {
    props: {
      title: 'Home',
    },
  }
}

const Page: NextPage<PageProps> = ({ title }) => {
  return (
    <>
      <Seo pageTitle={title} />
      <HomeMenu />
    </>
  )
}

export default Page
