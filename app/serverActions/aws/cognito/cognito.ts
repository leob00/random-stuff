import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider'
import { awsCreds } from 'app/api/aws/awsHelper'

const client = new CognitoIdentityProviderClient({ region: 'us-east-1', credentials: awsCreds })

export async function updateUserRoles(username: string, rolesValue: string) {
  const command = new AdminUpdateUserAttributesCommand({
    Username: username,
    UserPoolId: 'us-east-1_z9KjmhXvD',
    UserAttributes: [
      {
        Name: 'custom:roles',
        Value: rolesValue,
      },
    ],
  })

  try {
    const response = (await client.send(command)).$metadata
    console.log('Update successful:', response)
  } catch (error) {
    console.error('Failed to update roles:', error)
    throw error
  }
}
