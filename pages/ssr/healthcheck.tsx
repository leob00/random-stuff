import { Box, Button, Typography, Divider, Stack } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import RemoteImage from 'components/Atoms/RemoteImage'
import { BasicArticle } from 'lib/model'
import { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let article: BasicArticle = {
    title: 'Status: OK',
    imagePath: '',
    summary: 'System is operational',
    type: 'DailySilliness',
  }
  return {
    props: {
      data: article,
    },
  }
}

const healthcheck: NextPage<{ data: BasicArticle }> = ({ data }) => {
  return (
    <>
      <Box>
        <BackButton onClicked={() => router.back()} />

        <HorizontalDivider />
      </Box>
      <Stack direction='row' justifyContent='center' my={2}>
        <Typography variant='h6'>{data.title}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='center' my={2}>
        <Typography variant='body1'>{data.summary}</Typography>
      </Stack>
    </>
  )
}

export default healthcheck
