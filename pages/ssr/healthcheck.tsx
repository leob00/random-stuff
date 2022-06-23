import { Box, Button, Typography, Divider, Stack } from '@mui/material'
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
    type: '',
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
        <Button
          variant='text'
          onClick={() => {
            router.push('/')
          }}>
          &#8592; back
        </Button>
        <Typography variant='h6'>Health check: SSR</Typography>
        <Divider />
      </Box>
      <Stack direction='row' justifyContent='center' my={2}>
        <Typography variant='h6'>{data.title}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='center' my={2}>
        <Typography variant='body1'>{data.summary}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='center' my={2}>
        <RemoteImage url='/images/logo-with-text.png' title={'logo'} height={220} width={320} />
      </Stack>
    </>
  )
}

export default healthcheck
