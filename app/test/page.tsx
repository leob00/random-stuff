'use client'
import { Box, Typography } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <ResponsiveContainer>
      <Suspense>
        <Typography>hello!</Typography>
      </Suspense>
    </ResponsiveContainer>
  )
}

export default Page
