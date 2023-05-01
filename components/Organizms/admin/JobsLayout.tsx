import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, getJobs, Job } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobInProgress from './JobInProgress'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import JobDetail from './JobDetail'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const [data, setData] = React.useState<Job[]>([])
  const [pollCounter, setPollCounter] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<Job | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false)

  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      console.log('polling finished: ', dayjs().format('MM/DD/YYYY hh:mm:ss a'))
      setPollCounter(pollCounter + 1)
    }, 5000)
  }

  const loadData = async () => {
    const jobs = orderBy(await getJobs(), ['Status', 'NextRunDate'], ['asc', 'asc'])
    setData(jobs)
    poll()
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
    const fn = async () => {
      await loadData()
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollCounter])
  return (
    <Box>
      {isLoading ? (
        <LargeGridSkeleton />
      ) : (
        <>
          {isLoadingDetail && <WarmupBox />}
          {selectedItem && <JobDetail item={selectedItem} onClose={handleClose} />}
          {data.map((item) => (
            <Box key={item.Name}>
              <>
                <ListHeader text={item.Description} item={item} onClicked={handleItemClicked} />
                {item.Status === 1 ? (
                  <JobInProgress item={item} />
                ) : (
                  <Box minHeight={50} pt={1} pl={2}>
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
              </>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

export default JobsLayout
