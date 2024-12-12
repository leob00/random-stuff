import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { get } from 'lib/backend/api/fetchFunctions'
export async function getEmailVerificationStatus(userProfile: UserProfile) {
  const response: { VerificationAttributes: any } = await get('/api/ses')
  let verified = false
  try {
    if (response.VerificationAttributes[userProfile.username]['VerificationStatus'] === 'Success') {
      verified = true
    }
  } catch (err) {
  } finally {
    return verified
  }
}
