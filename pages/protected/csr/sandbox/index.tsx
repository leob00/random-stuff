import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { useUserController } from 'hooks/userController'
import useSWR, { Fetcher, preload } from 'swr'
import { Box, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { BasicArticle } from 'lib/model'

const apiUrl = '/api/edgeRandomAnimals?id=dogs'
const fetcher: Fetcher<BasicArticle[]> = (url: string) => fetch(url).then((res) => res.json())

const Page = () => {
  const ticket = useUserController().ticket
  const { data, error, isLoading, isValidating } = useSWR(apiUrl, fetcher)

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' backButtonRoute={`${ticket ? '/protected/csr/dashboard' : '/'}`} />
        <Typography>useSWR example</Typography>
        <Box maxHeight={324} sx={{ overflowY: 'auto' }}>
          {isValidating && <BackdropLoader />}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page