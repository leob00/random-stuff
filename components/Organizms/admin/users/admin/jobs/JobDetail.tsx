import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { useRouter } from 'next/router'
import JobPerformanceBarChart from './JobPerformanceBarChart'
import CopyableText from 'components/Atoms/Text/CopyableText'
import JobPerformanceLineChart from './JobPerformanceLineChart'

const JobDetails = ({ item }: { item: Job }) => {
  const router = useRouter()

  const handleManageClick = () => {
    router.push(`/protected/csr/admin/job/edit/${item.Name}`)
  }

  return (
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
        <Box pb={2}>
          <JobPerformanceLineChart data={item} />
        </Box>
      )}
      <Box display={'flex'}>
        <CopyableText variant='caption' label='internal name:' value={item.Name} showValue />
      </Box>
      {item.Executer && (
        // <Stack>
        //   <Typography variant='caption'>{`executer: ${item.Executer.substring(item.Executer.lastIndexOf('.') + 1)}`}</Typography>
        // </Stack>
        <Box display={'flex'}>
          <CopyableText variant='caption' label='executer:' value={`${item.Executer.substring(item.Executer.lastIndexOf('.') + 1)}`} showValue />
        </Box>
      )}
      {item.LastMessage && (
        <Stack>
          <Typography variant='caption'>{`message: ${item.LastMessage}`}</Typography>
        </Stack>
      )}
      <Box py={4}>
        <SuccessButton text='Manage' onClick={handleManageClick} />
      </Box>
    </Box>
  )
}

export default JobDetails
