import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { useRouter } from 'next/navigation'
import CopyableText from 'components/Atoms/Text/CopyableText'
import JobPerformanceLineChart from './JobPerformanceLineChart'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import KeyValueList from 'components/Molecules/Lists/KeyValueList'

const JobDetails = ({ item }: { item: Job }) => {
  const router = useRouter()

  const handleManageClick = () => {
    router.push(`/admin/job/edit/${item.Name}`)
  }

  const keyValues = new Map<string, string>()

  if (item.StartDate) {
    keyValues.set('start', `${dayjs(item.StartDate).format('MM/DD/YYYY hh:mm a')}`)
  }
  if (item.EndRunDate) {
    keyValues.set('end', `${dayjs(item.EndRunDate).format('MM/DD/YYYY hh:mm a')}`)
  }
  if (item.NextRunDate) {
    keyValues.set('next run', `${dayjs(item.NextRunDate).format('MM/DD/YYYY hh:mm a')}`)
  }
  if (item.RecordsProcessed && item.RecordsProcessed > 0) {
    keyValues.set('records processed', `${numeral(item.RecordsProcessed).format('###,###')}`)
  }

  return (
    <Box py={2}>
      <KeyValueList map={keyValues} />
      <Box py={2}>
        <HorizontalDivider />
        {item.Chart && (
          <Box pb={2}>
            <JobPerformanceLineChart data={item} />
          </Box>
        )}
        <Box display={'flex'}>
          <CopyableText variant='caption' label='internal name:' value={item.Name} showValue />
        </Box>
        {item.Executer && (
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
    </Box>
  )
}

export default JobDetails
