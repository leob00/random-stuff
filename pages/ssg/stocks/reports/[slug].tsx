import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getReport, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StockReportDisplay from 'components/Organizms/stocks/StockReportDisplay'
import StockReportsDropdown, { stockReportsDropdown } from 'components/Organizms/stocks/reports/StockReportsDropdown'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Box } from '@mui/material'

interface Model {
  type: StockReportTypes
  items: StockQuote[]
}

const Page = () => {
  const router = useRouter()

  const id = String(router.query.slug)

  let selectedOption = stockReportsDropdown.find((m) => m.value === id)
  if (!selectedOption) {
    selectedOption = stockReportsDropdown[0]
  }

  const dataFn = async () => {
    const arg = selectedOption?.value.replaceAll('-', '') as StockReportTypes
    let take = 100
    if (arg === 'indicesAndEtfs') {
      take = 2000
    }
    const report = await serverGetFetch(`/StockReports?id=${arg}&take=100`)
    let stocks = report.Body as StockQuote[]
    const result: Model = {
      type: arg,
      items: stocks, //await getReport(arg),
    }

    return result
  }

  const { data, isLoading } = useSwrHelper(selectedOption.value, dataFn, { revalidateOnFocus: false })

  return (
    <>
      <Seo pageTitle={`Stock reports - ${selectedOption.text}`} />
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      <ResponsiveContainer>
        <StockReportsDropdown selectedValue={selectedOption.value} />
        {isLoading && <BackdropLoader />}
        {data && (
          <Box py={2}>
            <StockReportDisplay data={data.items} reportType={data.type} />
          </Box>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
