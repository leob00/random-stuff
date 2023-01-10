import { DynamoKeys, getAnimals, LambdaBody, LambdaResponse } from 'lib/backend/api/aws/apiGateway'
import { BasicArticle } from 'lib/model'
import { shuffle } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'experimental-edge', // this is a pre-requisite
}

export default async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  const arg: DynamoKeys | null = searchParams.get('id') ?? 'dogs'

  const url = `${process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL}/animals?key=${arg}`
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_PUBLIC_KEY),
    },
  })
  const body = await resp.json()
  const data = body as LambdaResponse
  const result = JSON.parse(data.body.data) as BasicArticle[]
  const shuffled = shuffle(result)

  // console.log(result)
  //console.log('response: ', await resp.json())
  //const result = (await resp.json()) as BasicArticle
  //console.log(result)
  //var d = await getAnimals('dogs')

  // const shuffled = shuffle(result)
  return NextResponse.json(shuffled)
  //res.status(200).json(shuffled)
}
