import { Box } from '@mui/material'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItem, getItemData } from 'app/serverActions/aws/dynamo/dynamo'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getUserProfile } from 'lib/backend/csr/nextApiWrapper'

type Model = {
  ticket: AmplifyUser | null
  userProfile: UserProfile | null
}

async function getData() {
  const user = await getUserSSRAppRouteApi()
  const result: Model = {
    ticket: user,
    userProfile: null,
  }
  if (result.ticket) {
    result.userProfile = await getItemData<UserProfile>(constructUserProfileKey(result.ticket.email))
  }

  return result
}
export default async function UserProfileView() {
  const data = await getData()
  return (
    <Box py={1}>
      {data.ticket && data.userProfile && <ProfileLayout userProfile={data.userProfile} />}
      {!data.ticket || (!data.userProfile && <PleaseLogin />)}
    </Box>
  )
}
