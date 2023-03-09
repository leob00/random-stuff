import React from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import NewsLayout from '../../../components/Organizms/news/NewsLayout'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

const Page = () => {
  const router = useRouter()
  return (
    <ResponsiveContainer>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}
      >
        &#8592; back
      </Button>
      <HorizontalDivider />
      <NewsLayout />
    </ResponsiveContainer>
  )
}

export default Page
