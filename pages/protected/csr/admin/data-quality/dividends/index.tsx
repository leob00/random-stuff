import { Box, Typography } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const Page = () => {
  return (
    <ResponsiveContainer>
      <Box minHeight={500}>
        <PageHeader text='Data Quality - Earnings' />
        <Box py={2}>
          <CenterStack>
            <Typography>coming soon</Typography>
          </CenterStack>
        </Box>
      </Box>
    </ResponsiveContainer>
  )
}

export default Page
