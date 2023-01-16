export async function get(url: string, params?: any) {
  const resp = await fetch(url, {
    method: 'GET',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
    },
  })
  const data = await resp.json()
  return data
}
