import React from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import NewsLayout from '../../../components/Organizms/news/NewsLayout'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const Page = () => {
  return (
    <ResponsiveContainer>
      <PageHeader text='News' backButtonRoute='/' />
      <NewsLayout />
    </ResponsiveContainer>
  )
}

export default Page
