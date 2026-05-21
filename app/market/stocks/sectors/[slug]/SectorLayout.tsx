'use client'
import { Box } from '@mui/material'
import { SectorDetailsModel } from './page'
import MovingAvgValues from 'components/Organizms/stocks/movingAvg/MovingAvgValues'
import SortableStockContainer from 'components/Organizms/stocks/SortableStockContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useEffect } from 'react'

const SectorsLayout = ({ data }: { data: SectorDetailsModel }) => {
  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [data.container.ContainerId])
  return (
    <Box py={2}>
      <ScrollIntoView margin={-30} />
      {data.quotes.length > 0 ? (
        <Box>
          <Box py={2}>
            <MovingAvgValues values={data.container.MovingAvg} />
            <SortableStockContainer data={data.quotes} />
          </Box>
        </Box>
      ) : (
        <>
          <PageHeader text={``} backButtonRoute={'/market/stocks/sectors'} />
          <NoDataFound />
        </>
      )}
    </Box>
  )
}

export default SectorsLayout
