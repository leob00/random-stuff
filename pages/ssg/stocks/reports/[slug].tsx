import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getReport, serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
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
    const reportName = selectedOption?.value.replaceAll('-', '') as StockReportTypes
    const result: Model = {
      type: reportName,
      items: [],
    }
    let take = 100
    if (reportName === 'indicesAndEtfs') {
      take = 2000
    }
    let days = 30
    if (reportName === 'topmvgavg') {
      days = 1
      const resp = await serverPostFetch(
        {
          body: {
            Take: 100,
            Days: 1,
            MarketCap: {
              Items: ['mega'],
            },
          },
        },
        `/StockMovingAvg`,
      )
      result.items = resp.Body as StockQuote[]
      return result
    }
    const report = await serverGetFetch(`/StockReports?id=${reportName}&take=${take}&days=${days}`)
    result.items = report.Body as StockQuote[]

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
