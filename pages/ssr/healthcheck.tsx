import { Box, Button, Typography, Divider, Stack } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import RemoteImage from 'components/Atoms/RemoteImage'
import { BasicArticle } from 'lib/model'
import { GetServerSideProps, NextPage } from 'next'
import router from 'next/router'
import { ApiStatus } from 'pages/api/status'
import React, { Suspense } from 'react'
import useSWR, { Fetcher, SWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let article: BasicArticle = {
    title: 'Status: OK',
    imagePath: '',
    summary: 'System is operational',
    type: 'DailySilliness',
  }
  return {
    props: {
      article: article,
    },
  }
}

const fetcherFn = async (url: string) => {
  let resp = await fetch(url)
  const data = (await resp.json()) as ApiStatus
  return data
}

const Page: NextPage<{ article: BasicArticle }> = ({ article }) => {
  const fetcher: Fetcher<ApiStatus> = () => fetcherFn('/api/edgeStatus')
  const { data } = useSWR('/api/edgeStatus', fetcherFn)
  return (
    <>
      <Box>
        <BackButton />
        <HorizontalDivider />
      </Box>
      <SWRConfig value={{ fetcher: fetcher }}>
        <Suspense fallback={<BackdropLoader />}>
          <Box justifyContent='center' my={2} display='flex' alignItems={'center'} gap={1}>
            <Typography>Status: </Typography>
            <Typography variant='h5'>{`${data?.status}`}</Typography>
          </Box>
        </Suspense>
        {/* <Stack direction='row' justifyContent='center' my={2}>
          <Typography variant='h6'>{article.title}</Typography>
        </Stack>
        <Stack direction='row' justifyContent='center' my={2}>
          <Typography variant='body1'>{article.summary}</Typography>
        </Stack> */}
      </SWRConfig>
    </>
  )
}

export default Page
