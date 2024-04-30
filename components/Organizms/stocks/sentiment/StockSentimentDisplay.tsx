import JsonView from 'components/Atoms/Boxes/JsonView'
import { StockStats } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const StockSentimentDisplay = ({ data }: { data: StockStats[] }) => {
  return (
    <>
      <JsonView obj={data} />
    </>
  )
}

export default StockSentimentDisplay
