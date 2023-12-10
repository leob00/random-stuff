import { Box, Stack, Typography } from '@mui/material'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'
import JobDetailChart from './JobDetailChart'

const JobDetails = ({ item, onClose }: { item: Job; onClose: () => void }) => {
  return (
    <InfoDialog show={true} title={item.Description} onCancel={() => onClose()}>
      <Box>
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
        {item.NextRunDate && (
          <Stack>
            <Typography variant='caption'>{`next run: ${dayjs(item.NextRunDate).format('MM/DD/YYYY hh:mm a')}`}</Typography>
          </Stack>
        )}
        {item.RecordsProcessed !== undefined && item.RecordsProcessed > 0 && (
          <Stack>
            <Typography variant='caption'>{`records processed: ${numeral(item.RecordsProcessed).format('###,###')}`}</Typography>
          </Stack>
        )}
        {item.Chart && (
          <Box pt={2} width={{ xs: '95%', md: 'unset' }}>
            <JobDetailChart data={item.Chart} />
          </Box>
        )}
        <Stack>
          <Typography variant='caption'>{`internal name: ${item.Name}`}</Typography>
        </Stack>
        {item.Executer && (
          <Stack>
            <Typography variant='caption'>{`executer: ${item.Executer.substring(item.Executer.lastIndexOf('.') + 1)}`}</Typography>
          </Stack>
        )}
        {item.LastMessage && (
          <Stack>
            <Typography variant='caption'>{`message: ${item.LastMessage}`}</Typography>
          </Stack>
        )}
      </Box>
    </InfoDialog>
  )
}

export default JobDetails
