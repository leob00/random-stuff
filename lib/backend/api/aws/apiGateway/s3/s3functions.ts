import { apiConnection } from 'lib/backend/api/config'
import { post, postBody } from 'lib/backend/api/fetchFunctions'
import { Bucket, PresignedUrlPost } from '../../models/apiGatewayModels'

const connection = apiConnection().aws
const apiGatewayUrl = connection.url
export async function getS3ObjectPresignedUrl(bucket: string, fullPath: string, expirationInSeconds: number) {
  const url = `${apiGatewayUrl}/s3/presignedurl`
  try {
    const body = { bucket: bucket, fullPath: fullPath, expiration: expirationInSeconds }
    const result = await post(url, body)
    return result.body
  } catch (err) {
    console.error('error occurred in presignedurl: ', err)
  }
  return []
}

export async function getS3ObjectPresignedUrlForWrite(bucket: string, fullPath: string, expirationInSeconds: number, contentType: string) {
  const url = `${apiGatewayUrl}/s3/presignedUrlWrite`
  try {
    const body = { bucket: bucket, fullPath: fullPath, contentType: contentType, expiration: expirationInSeconds }
    const result = await post(url, body)
    //console.log(result.body)
    return JSON.parse(result.body) as PresignedUrlPost
  } catch (err) {
    console.error('error occurred in presignedurl: ', err)
  }
  return null
}
export async function listS3Objects(bucket: Bucket, prefix: string) {
  const url = `${apiGatewayUrl}/s3/list`
  try {
    const body = { bucket: bucket, prefix: prefix }
    const result = await post(url, body)
    return result.body
  } catch (err) {
    console.error('error occurred in presignedurl: ', err)
  }
  return []
}

export async function deleteS3Object(bucket: string, fullPath: string) {
  const url = `${apiGatewayUrl}/s3/object`
  try {
    const result = await postBody(url, 'DELETE', { bucket: bucket, fullPath: fullPath })
    return result
  } catch (err) {
    console.error('error occurred in postDelete: ', err)
  }
  return null
}

export async function renameS3Object(bucket: Bucket, oldPath: string, newPath: string) {
  const url = `${apiGatewayUrl}/s3/object`
  try {
    const result = await postBody(url, 'PATCH', {
      bucket: bucket,
      oldPath: oldPath,
      newPath: newPath,
    })
    return result
  } catch (err) {
    console.error('error occurred in postBody: ', err)
  }
  return null
}
