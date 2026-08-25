import { Box } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { usePolling } from 'hooks/usePolling'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import { useEffect } from 'react'
import { mutate } from 'swr'
import SectorsTable from '../../SectorsTable'
import SummaryTitle from '../SummaryTitle'
import { sleep } from 'lib/util/timers'

const TopSectorsSummary = () => {
  const { pollCounter } = usePolling(1000 * 360) // 3 minutes
  const mutateKey = 'all-sectors'
  const dataFn = async () => {
    await sleep(500)
    const resp = await serverGetFetch(`/Sectors`)
    return resp.Body as SectorIndustry[]
  }
  const { isLoading, data } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  useEffect(() => {
    if (pollCounter >= 1) {
      mutate(mutateKey)
    }
  }, [pollCounter])
  return (
    <Box>
      {isLoading && <ComponentLoader />}
      <>
        {!isLoading && data && (
          <>
            <SummaryTitle
              title={'Top Sectors'}
              //onRefresh={onRefreshRequest}
              //onGoToPage={onGoToPage}
              //searchSettings={{ allowSearch: true, searchOn: showSearch }}
              //setSearchSettings={(settings) => {
              //  setShowSearch(settings.searchOn)
              //}}
            />
            <SectorsTable data={data} category='Sector' />
          </>
        )}
      </>
    </Box>
  )
}

export default TopSectorsSummary
