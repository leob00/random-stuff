import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import JsonView from 'components/Atoms/Boxes/JsonView'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { data } from 'components/Molecules/Charts/MultiDatasetBarchartExmple'
import Seo from 'components/Organizms/Seo'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import StockSentimentDisplay from 'components/Organizms/stocks/sentiment/StockSentimentDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'

const Page = () => {
  const monthlyKey: DynamoKeys = 'stocks-monthly-market-sentiment'
  const dataFn = async () => {
    const record = await getRecord<StockStats[]>(monthlyKey)
    return record
  }
  const { data, isLoading } = useSwrHelper(monthlyKey, dataFn)
  return (
    <>
      <Seo pageTitle='Sectors' />

      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Sentiment' backButtonRoute='/csr/stocks' />
        <CenteredHeader title={'Monthly'} />
        <Box pb={8}>{data && <StockSentimentDisplay data={data} />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
