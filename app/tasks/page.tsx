'use client'
import { Box, Typography } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import React from 'react'
import navigation from 'next/navigation'

const Page = () => {
  const handleBackClick = () => {
    navigation.redirect('/protected/csr/dashboard')
  }
  return (
    <Box>
      <BackButton onClicked={handleBackClick} />
      <Typography>Hello from ssr!</Typography>
    </Box>
  )
}

export default Page
