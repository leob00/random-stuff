import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import AdminEarningsWrapper from 'components/Organizms/admin/data-quality/earnings/AdminEarningsWrapper'
import RequireClaim from 'components/Organizms/user/RequireClaim'

const Page = () => {
  return (
    <ResponsiveContainer>
      <RequireClaim claimType='rs-admin'>
        <Box minHeight={500}>
          <PageHeader text='Data Quality - Earnings' />
          <AdminEarningsWrapper />
        </Box>
      </RequireClaim>
    </ResponsiveContainer>
  )
}

export default Page
