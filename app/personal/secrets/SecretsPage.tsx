import { Box, Typography } from '@mui/material'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { getItemData, searchItems } from 'app/serverActions/aws/dynamo/dynamo'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserProfileKey, constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { UserSecret, userSecretArraySchema } from 'lib/backend/api/models/zModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { redirect } from 'next/navigation'
import SecretsDisplay from './SecretsDisplay'

export type SecretsUiModel = {
  results: UserSecret[]
  enterPin: boolean
  createPin: boolean
  pinLastEnterDate?: string
}

async function getData() {
  const result: SecretsUiModel = {
    createPin: false,
    enterPin: false,
    results: [],
  }
  const ticket = await getUserSSRAppRouteApi()

  if (ticket) {
    const profile = await getItemData<UserProfile>(constructUserProfileKey(ticket.email))
    if (profile) {
      result.createPin = !profile.pin
      if (profile.pin) {
        const utcNow = getUtcNow()
        result.pinLastEnterDate = profile.pin.lastEnterDate
        const expDate = dayjs(profile.pin.lastEnterDate).add(10, 'minutes')
        if (expDate.isBefore(utcNow)) {
          result.enterPin = true
          redirect(`/account/profile/pin/validate?target=${encodeURIComponent('/personal/secrets')}`)
        } else {
          const secretsResponse = await searchItems(constructUserSecretSecondaryKey(profile.username))
          const secrets = userSecretArraySchema.parse(secretsResponse.map((item) => JSON.parse(item.data)))
          result.results = secrets
        }
      } else {
        redirect('/account/profile')
      }
    }
  }

  return result
}

export default async function SecretsPage() {
  const data = await getData()
  return (
    <Box>
      <SecretsDisplay data={data} />
    </Box>
  )
}
