import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { getWorkflowStatusText } from 'lib/util/textUtil'
import JobInProgress from '../JobInProgress'
import StopJobDisplay from './StopJobDisplay'
import EditJobDisplay from './EditJobDisplay'

const ManageJobLayout = ({ data, onSave }: { data: Job; onSave: (item: Job) => void }) => {
  const statusText = getWorkflowStatusText(data.Status)

  return (
    <Box py={2}>
      <CenteredTitle title={`Manage job: ${data.Description}`} />
      <HorizontalDivider />
      <Box py={2}>
        <JobInProgress item={data} />
      </Box>
      <Box display={'flex'} alignItems={{ xs: 'flex-start', md: 'center' }} gap={{ xs: 0, md: 2 }} flexDirection={{ xs: 'column', md: 'row' }}>
        <ReadOnlyField label='status' val={statusText} />
        <ReadOnlyField label='last finished' val={data.EndRunDate ? dayjs(data.EndRunDate).format('MM/DD/YYYY hh:mm A') : ''} />
        <ReadOnlyField label='next start' val={data.NextRunDate ? dayjs(data.NextRunDate).format('MM/DD/YYYY hh:mm A') : ''} />
      </Box>
      {data.Status === 1 && <StopJobDisplay data={data} onSave={onSave} />}
      {data.Status === 2 && <EditJobDisplay data={data} onSave={onSave} />}
    </Box>
  )
}

export default ManageJobLayout
