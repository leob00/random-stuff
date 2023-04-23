import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { ChartBackground, DarkBlue } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { getJobs, Job } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const [data, setData] = React.useState<Job[]>([])
  const [pollCounter, setPollCounter] = React.useState(0)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      setPollCounter(pollCounter + 1)
      console.log('polling finished: ', dayjs().format('MM/DD/YYYY hh:mm:ss a'))
    }, 5000)
  }

  const loadData = async () => {
    const jobs = orderBy(await getJobs(), ['Status', 'NextRunDate'], ['asc', 'asc'])
    setData(jobs)
    poll()

    //console.log(jobs)
  }

  React.useEffect(() => {
    loadData()
  }, [pollCounter])
  return (
    <Box>
      {data.map((item) => (
        <Box pl={2} key={item.Name}>
          <>
            <Stack direction={'row'} alignItems={'flex-start'} display={'flex'} pt={1} justifyContent={'space-between'}>
              <Stack sx={{ backgroundColor: ChartBackground }} direction={'row'} flexGrow={1} ml={-2} px={2} py={1}>
                <LinkButton onClick={(e) => {}}>
                  <Typography textAlign={'left'} variant='h6' fontWeight={600} color={DarkBlue} sx={{ textDecoration: 'unset' }}>
                    {`${item.Description}`}
                  </Typography>
                </LinkButton>
              </Stack>
            </Stack>
            {item.Status === 1 ? (
              <Box minHeight={50} pt={2}>
                <Box>
                  <DefaultTooltip text={`${item.ProgressPercent}%`}>
                    <LinearProgress variant='determinate' value={item.ProgressPercent} color='secondary' />
                  </DefaultTooltip>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box>
                      <Typography variant='caption' sx={{ p: 1 }}>
                        {item.LastMessage}
                      </Typography>
                    </Box>
                    <Box pr={1}>{item.ProgressPercent && <Typography variant='caption'>{`${item.ProgressPercent.toFixed(1)}%`}</Typography>}</Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box minHeight={50} pt={1} pl={1}>
                <Box>{item.NextRunDate && <Typography variant='caption'>{`next run: ${dayjs().to(dayjs(item.NextRunDate))}`}</Typography>}</Box>
              </Box>
            )}
          </>
        </Box>
      ))}
    </Box>
  )
}

export default JobsLayout
