export type ApiConfig = {
  url: string
  key: string
}

type Config = {
  qln: ApiConfig
  internal: ApiConfig & { appId: string }
  contentful: ApiConfig & { spaceId: string }
}

export function apiConnection() {
  const result: Config = {
    qln: {
      url: String(process.env.NEXT_PUBLIC_QLN_API_URL),
      key: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },

    contentful: {
      url: String(process.env.CONTENTFUL_GRAPH_BASE_URL),
      key: String(process.env.CONTENTFUL_ACCESS_TOKEN),
      spaceId: String(process.env.CONTENTFUL_SPACE_ID),
    },
    internal: {
      url: '',
      appId: String(process.env.NEXT_PUBLIC_APP_ID),
      key: String(process.env.NEXT_PUBLIC_API_TOKEN),
    },
  }
  return result
}
