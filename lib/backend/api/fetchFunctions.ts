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
  //console.log('calling url: ', postUrl)
  const resp = await fetch(postUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
      ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },
  })
  //console.log('response: ', resp)
  const data = await resp.json()
  // console.log('data: ', data)
  return data
}

export async function post(url: string, body: any) {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
      ApiKey: String(process.env.NEXT_PUBLIC_QLN_API_PUBLIC_KEY),
    },
  })
  const data = await resp.json()
  //console.log(data)
  return data
}
