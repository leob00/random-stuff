type envKeys = 'awsApiGatewayUrl' | 'awsApiGatewayKey'

export const envVariables = new Map<envKeys, { val: string }>([
  ['awsApiGatewayUrl', { val: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL! }],
  ['awsApiGatewayKey', { val: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY! }],
])

export function getEnvVariable(key: envKeys) {
  return envVariables.get(key)?.val!
}
