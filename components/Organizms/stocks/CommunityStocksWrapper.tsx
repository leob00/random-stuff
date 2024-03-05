import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import CommunityStocksLayout from './CommunityStocksLayout'

const CommunityStocksWrapper = ({ data }: { data: StockQuote[] | undefined }) => {
  if (!data) {
    return <BackdropLoader />
  }
  return (
    <>
      <CommunityStocksLayout data={data} />
    </>
  )
}

export default CommunityStocksWrapper
