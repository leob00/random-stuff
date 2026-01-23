import { Box } from '@mui/material'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItemData } from 'app/serverActions/aws/dynamo/dynamo'
import { getSesVerificationAttributes } from 'app/serverActions/aws/ses/ses'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import ProfileLayout from 'components/Organizms/user/profile/ProfileLayout'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser } from 'lib/backend/auth/userUtil'

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
  if (user) {
    result.userProfile = await getItemData<UserProfile>(constructUserProfileKey(user.email))
    if (result.userProfile) {
      const emailVerAttr = await getSesVerificationAttributes(result.userProfile.username)
      let verified = false
      try {
        if (emailVerAttr) {
          if (emailVerAttr.VerificationAttributes?.[result.userProfile.username]['VerificationStatus'] === 'Success') {
            verified = true
          }
        }
      } catch (err) {
        console.error(`error in UserProfileView: `, err)
      }
      result.userProfile.emailVerified = verified
    }
  }

  return result
}
export default async function UserProfileView() {
  const data = await getData()
  return <Box py={1}>{data.ticket && data.userProfile ? <ProfileLayout userProfile={data.userProfile} /> : <PleaseLogin />}</Box>
}
