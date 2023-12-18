export async function get(url: string, params?: any) {
  let args = ''
  if (params) {
    const keys = Object.keys(params)
    const values = Object.values(params)
    keys.forEach((p, i) => {
      if (i === 0) {
        args = `?${p}=${values[i]}`
      } else {
        args = args + `&${p}=${values[i]}`
      }
    })
  }
  const postUrl = `${url}${args}`
  try {
    const resp = await fetch(postUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
        ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
      },
    })
    if (resp.status !== 200) {
      console.error('authentication failed')
      return resp
    }
    const data = await resp.json()
    return data
  } catch (err) {
    console.error(err)
    return err
  }
}

export async function post(url: string, body: any) {
  const awsApiKey = String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY)
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': awsApiKey,
        ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
      },
    })

    const data = await resp.json()
    return data
  } catch (err) {
    console.error('error in post: ', err)
    return null
  }
}

export async function postBody(url: string, method: 'PATCH' | 'POST' | 'DELETE' | 'PUT', body: any) {
  const awsApiKey = String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY)
  try {
    const resp = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': awsApiKey,
        ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
      },
    })

    const data = await resp.json()
    return data
  } catch (err) {
    console.error('error in post: ', err)
    return null
  }
}

export async function postDelete(url: string, params: any) {
  const awsApiKey = String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY)
  let args = ''
  if (params) {
    const keys = Object.keys(params)
    const values = Object.values(params)
    keys.forEach((p, i) => {
      if (i === 0) {
        args = `?${p}=${values[i]}`
      } else {
        args = args + `&${p}=${values[i]}`
      }
    })
  }
  const postUrl = `${url}${args}`
  try {
    const resp = await fetch(postUrl, {
      method: 'DELETE',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': awsApiKey,
        ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
      },
    })

    return resp
  } catch (err) {
    console.error('error in delete: ', err)
    return null
  }
}

export async function getList<T>(url: string, params?: any): Promise<T[]> {
  const resp = await get(url, params)
  const data = await resp.json()
  return data as T[]
}
