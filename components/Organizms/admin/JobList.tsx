import { Box, Paper, Stack, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { CasinoBlue } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import JobInProgress from './JobInProgress'

const JobList = ({ response, onJobSelected }: { response: QlnApiResponse; onJobSelected: (item: Job) => void }) => {
  let jobs = response.Body as Job[]
  jobs = sortArray(jobs, ['Status', 'NextRunDate'], ['asc', 'asc'])
  return (
    <>
      {jobs.map((item) => (
        <Box key={item.Name}>
          <Paper elevation={item.Status == 1 ? 2 : 0}>
            <ListHeader text={item.Description} item={item} onClicked={onJobSelected} backgroundColor={item.Status == 1 ? 'transparent' : undefined} />
            {item.Status === 1 ? (
              <JobInProgress item={item} />
            ) : (
              <Box minHeight={50} pt={1} pl={2} pb={1}>
                <Box>
                  {item.EndRunDate && (
                    <Stack>
                      <Typography variant='caption' color='primary'>{`last run: ${dayjs().to(dayjs(item.EndRunDate))}`}</Typography>
                    </Stack>
                  )}
                  {item.NextRunDate && (
                    <Stack>
                      <Typography variant='caption' color='primary'>{`next run: ${dayjs().to(dayjs(item.NextRunDate))}`}</Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      ))}
    </>
  )
}

export default JobList
