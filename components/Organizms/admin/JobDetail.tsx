import { Box, Stack, Typography } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import JobDetailChart from './JobDetailChart'

const JobDetails = ({ item, onClose }: { item: Job; onClose: () => void }) => {
  // console.log('chart: ', JSON.stringify(item.Chart))
  return (
    <InfoDialog show={true} title={item.Description} onCancel={() => onClose()}>
      <Box>
        <Stack>
          <Typography variant='caption'>{`name: ${item.Description}`}</Typography>
        </Stack>
        <Stack>
          <Typography variant='caption'>{`internal name: ${item.Name}`}</Typography>
        </Stack>
        {item.StartDate && (
          <Stack>
            <Typography variant='caption'>{`started: ${dayjs(item.StartDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
          </Stack>
        )}
        {item.EndRunDate && (
          <Stack>
            <Typography variant='caption'>{`ended: ${dayjs(item.EndRunDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
          </Stack>
        )}

        {item.Chart && (
          <Box pt={2}>
            <JobDetailChart data={item.Chart} />
          </Box>
        )}
      </Box>
    </InfoDialog>
  )
}

export default JobDetails
