import { DynamoKeys, LambdaResponse } from 'lib/backend/api/aws/apiGateway'
import { get } from 'lib/backend/api/fetchFunctions'
import { getEnvVariable } from 'lib/backend/envVariables'
import { BasicArticle } from 'lib/model'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge', // this is a pre-requisite
}

export default async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const arg: DynamoKeys | null = searchParams.get('id') ?? 'dogs'
  const url = `${getEnvVariable('awsApiGatewayUrl')}/animals?key=${arg}`
  //const url = `${urlVar}/animals?key=${arg}`
  const body = await get(url)
  const data = body as LambdaResponse
  const result = JSON.parse(data.body.data) as BasicArticle[]
  console.log(`api @edge: edgeRandomAnimals - id: ${arg}`)
  return NextResponse.json(result)
}
