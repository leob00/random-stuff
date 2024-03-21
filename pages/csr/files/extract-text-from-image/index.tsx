import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import OcrLocal from 'components/Organizms/files/OcrLocal'
import Seo from 'components/Organizms/Seo'
import React from 'react'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Extract text from image' />
      <PageHeader text='Extract text from image' backButtonRoute='/' />
      <ResponsiveContainer>
        <Box py={2}>
          <OcrLocal />
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
