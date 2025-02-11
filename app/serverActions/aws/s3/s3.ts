import { S3Client, PutObjectCommand, PutObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandInput, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3'
import { getAwsCredentials } from 'app/api/aws/awsHelper'
import { Bucket, S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({ region: 'us-east-1', credentials: getAwsCredentials() })
export async function putItem(bucket: Bucket, prefix: string, filename: string, mimeType: string, fileSize: number, body: any) {
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: `${prefix}/${filename}`,
    Body: body,
    ContentType: mimeType,
    ContentLength: fileSize,
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)
  const result: S3Object = {
    bucket: bucket,
    filename: filename,
    fullPath: `${prefix}/${filename}`,
    prefix: prefix,
    isFolder: false,
    size: fileSize,
  }
  return result
}

export async function deleteItem(item: S3Object) {
  const params: DeleteObjectCommandInput = {
    Bucket: item.bucket,
    Key: item.fullPath,
  }

  const command = new DeleteObjectCommand(params)
  const resp = (await s3Client.send(command)).$metadata
  return resp
}

export async function getPresignedUrl(item: S3Object) {
  const params: GetObjectCommandInput = {
    Bucket: item.bucket,
    Key: item.fullPath,
  }

  const command = new GetObjectCommand(params)
  const url = await getSignedUrl(s3Client, command)
  return url
}
