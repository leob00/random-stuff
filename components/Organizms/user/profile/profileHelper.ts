import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { postBody } from 'lib/backend/api/fetchFunctions'
export async function getEmailVerificationStatus(userProfile: UserProfile) {
  const response = await postBody('/api/aws/ses/verificationStatus', 'POST', userProfile.username)
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
