import { apiConnection } from './config'

const config = apiConnection()
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
        'x-api-key': config.aws.key,
        ApiKey: String(config.qln.key),
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

export async function post(url: string, body: any, contentType: string = 'application/json') {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': contentType,
        'x-api-key': config.aws.key,
        ApiKey: String(config.qln.key),
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
  try {
    const resp = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.aws.key,
        ApiKey: String(config.qln.key),
      },
    })

    const data = await resp.json()
    if (!data) {
      return resp
    } else {
      return data
    }
  } catch (err) {
    console.error(`error in ${method}: `, err)
    return null
  }
}

export async function postDelete(url: string, params: any) {
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
        'x-api-key': config.aws.key,
        ApiKey: String(config.qln.key),
      },
    })

    return resp.json()
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
