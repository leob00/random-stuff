import { Box, Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobInProgress from './JobInProgress'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import JobDetail from './JobDetail'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import useSWR, { Fetcher, mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import { CasinoBlue } from 'components/themes/mainTheme'
import { apiConnection } from 'lib/backend/api/config'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const config = apiConnection().qln
  const [pollCounter, setPollCounter] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<Job | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const apiUrl = `${config.url}/BatchJobList?Apikey=${config.key}`
  const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)
  const { data, isLoading } = useSWR(apiUrl, fetcher)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      setPollCounter(pollCounter + 1)
    }, 5000)
  }

  const handleItemClicked = async (item: Job) => {
    setIsLoadingDetail(true)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const result = await getJob(item.Name)
    setSelectedItem(result)
    setIsLoadingDetail(false)
  }
  const handleClose = () => {
    setSelectedItem(null)
    poll()
  }

  React.useEffect(() => {
    poll()
    mutate(apiUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollCounter])

  const RenderDisplay = (response: QlnApiResponse) => {
    let jobs = response.Body as Job[]
    jobs = orderBy(jobs, ['Status', 'NextRunDate'], ['asc', 'asc'])
    return jobs.map((item) => (
      <Box key={item.Name}>
        <Paper elevation={item.Status == 1 ? 2 : 0} sx={{ color: CasinoBlue }}>
          <ListHeader text={item.Description} item={item} onClicked={handleItemClicked} />
          {item.Status === 1 ? (
            <JobInProgress item={item} />
          ) : (
            <Box minHeight={50} pt={1} pl={2} pb={1}>
              <Box>
                {item.EndRunDate && (
                  <Stack>
                    <Typography variant='caption'>{`last run: ${dayjs().to(dayjs(item.EndRunDate))}`}</Typography>
                  </Stack>
                )}
                {item.NextRunDate && (
                  <Stack>
                    <Typography variant='caption'>{`next run: ${dayjs().to(dayjs(item.NextRunDate))}`}</Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    ))
  }

  return (
    <Box>
      {isLoading ? (
        <LargeGridSkeleton />
      ) : (
        <>
          {isLoadingDetail && <BackdropLoader />}
          {selectedItem && <JobDetail item={selectedItem} onClose={handleClose} />}
          {data && RenderDisplay(data)}
        </>
      )}
    </Box>
  )
}

export default JobsLayout
