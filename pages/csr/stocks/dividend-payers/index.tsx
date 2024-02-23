import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockDividendsTable from 'components/Organizms/stocks/StockDividendsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockDividendItem } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const Page = () => {
  const apiConn = apiConnection().qln
  const dataFn = async () => {
    const resp = await get(`${apiConn.url}/StockDividends`)
    return resp.Body as StockDividendItem[]
  }
  const { isLoading, data } = useSwrHelper('/api/baseUrl?id=alldividends', dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Sectors' />
      <PageHeader text='Dividend paying stocks' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <Box py={2}>{data && <StockDividendsTable data={data} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
