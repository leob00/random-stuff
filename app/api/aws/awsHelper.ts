import { AwsCredentialIdentity } from '@aws-sdk/types'

export const getAwsCredentials = () => {
  const result: AwsCredentialIdentity = {
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_ACCESS_KEY_SECRET),
  }
  return result
}
