import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import RequireClaim from 'components/Organizms/user/RequireClaim'

export default async function AdminManageEarningsPage() {
  return (
    <>
      <RequireClaim claimType='rs-admin'>
        <Box py={2}>
          <CenterStack>
            <Typography>coming soon</Typography>
          </CenterStack>
        </Box>
      </RequireClaim>
    </>
  )
}
