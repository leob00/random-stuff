import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, getJobs, Job } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobInProgress from './JobInProgress'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import JobDetails from './JobDetails'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const [data, setData] = React.useState<Job[]>([])
  const [pollCounter, setPollCounter] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<Job | null>(null)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      setPollCounter(pollCounter + 1)
    }, 5000)
  }

  const loadData = async () => {
    const jobs = orderBy(await getJobs(), ['Status', 'NextRunDate'], ['asc', 'asc'])
    setData(jobs)
    poll()
  }
  const handleItemClicked = async (item: Job) => {
    const result = await getJob(item.Name)
    console.log(result)
    setSelectedItem(item)
  }

  React.useEffect(() => {
    loadData()
  }, [pollCounter])
  return (
    <Box>
      {selectedItem && <JobDetails item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {data.map((item) => (
        <Box pl={2} key={item.Name}>
          <>
            <ListHeader text={item.Description} item={item} onClicked={handleItemClicked} />
            {item.Status === 1 ? (
              <JobInProgress item={item} />
            ) : (
              <Box minHeight={50} pt={1} pl={1}>
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
    </Box>
  )
}

export default JobsLayout
