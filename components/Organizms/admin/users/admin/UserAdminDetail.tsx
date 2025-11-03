import { Box, Typography } from '@mui/material'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const UserAdminDetail = ({ userProfile }: { userProfile: UserProfile }) => {
  return (
    <Box px={2} py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Box display={'flex'} gap={1}>
          <Typography width={120} textAlign={'right'}>
            id:
          </Typography>
          <Typography>{userProfile.id}</Typography>
        </Box>
        <Box display={'flex'} gap={1}>
          <Typography width={120} textAlign={'right'}>
            username:
          </Typography>
          <Typography>{userProfile.username}</Typography>
        </Box>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography width={120} textAlign={'right'}>
            email verified:
          </Typography>
          {userProfile.emailVerified ? <AlertWithHeader severity='success' header='' /> : <Typography>false</Typography>}
        </Box>
      </Box>
    </Box>
  )
}

export default UserAdminDetail
