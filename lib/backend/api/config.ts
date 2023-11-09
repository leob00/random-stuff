export type ApiConfig = {
  url: string
  key: string
}

type Config = {
  aws: ApiConfig
  qln: ApiConfig
}

export function apiConnection() {
  const result: Config = {
    qln: {
      url: String(process.env.NEXT_PUBLIC_QLN_API_URL_LOCAL),
      key: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },
    aws: {
      url: String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL),
      key: String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
    },
  }

  return result
}
