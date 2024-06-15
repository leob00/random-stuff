import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import StockDividendsTable, { StockDividendItem } from 'components/Organizms/stocks/StockDividendsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import React from 'react'

const Page = () => {
  const apiConn = apiConnection().qln
  const dataFn = async () => {
    const resp = await get(`${apiConn.url}/StockDividends`)
    const result = resp.Body as StockDividendItem[]
    return result.filter((m) => m.Frequency !== 'irregular')
  }
  const { isLoading, data } = useSwrHelper('/api/baseUrl?id=alldividends', dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Sectors' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
        <StockReportsDropdown selectedValue='dividend-payers' />

        <Box pt={2} pb={8}>
          {data && <StockDividendsTable data={data} />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
