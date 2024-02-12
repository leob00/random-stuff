import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const Page = () => {
  const apiConn = apiConnection().qln
  const dataFn = async () => {
    const resp = await get(`${apiConn.url}/Sectors`)
    return resp.Body as SectorIndustry[]
  }
  const { isLoading, data } = useSwrHelper('/api/baseUrl?id=sectors', dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Sectors' />
      <PageHeader text='Sectors' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <Box>{data && <SectorsTable data={data} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
