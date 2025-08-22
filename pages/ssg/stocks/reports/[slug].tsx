import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import StockReportsDropdown, { stockReportsDropdown } from 'components/Organizms/stocks/reports/StockReportsDropdown'
import { Box } from '@mui/material'
import TopMovingAvg from 'components/Organizms/stocks/reports/TopMovingAvg'
import StockReportsWrapper from 'components/Organizms/stocks/reports/StockReportsWrapper'

const Page = () => {
  const router = useRouter()

  const id = String(router.query.slug)

  let selectedOption = stockReportsDropdown.find((m) => m.value === id)
  if (!selectedOption) {
    selectedOption = stockReportsDropdown[0]
  }

  return (
    <>
      <Seo pageTitle={`Stock reports - ${selectedOption.text}`} />
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      <ResponsiveContainer>
        <StockReportsDropdown selectedValue={selectedOption.value} />

        <Box py={2}>
          {selectedOption.value !== 'topmvgavg' ? <StockReportsWrapper reportType={selectedOption.value as StockReportTypes} /> : <TopMovingAvg />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
