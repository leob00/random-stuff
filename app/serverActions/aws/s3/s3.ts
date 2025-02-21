import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  CopyObjectCommand,
  CopyObjectCommandInput,
} from '@aws-sdk/client-s3'
import { Bucket, S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { awsCreds } from 'app/api/aws/awsHelper'

const s3Client = new S3Client({ region: 'us-east-1', credentials: awsCreds })
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

export async function listObjects(bucket: Bucket, prefix: string) {
  let folder = prefix

  if (!folder.endsWith('/')) {
    folder = `${folder}/`
  }
  const params: ListObjectsCommandInput = {
    Bucket: bucket,
    Prefix: folder,
  }

  const command = new ListObjectsCommand(params)
  const result = (await s3Client.send(command)).Contents
  return result
}

export async function copyItem(oldItem: S3Object, newPath: string) {
  const oldFullPath = !oldItem.fullPath.startsWith('/') ? oldItem.fullPath : oldItem.fullPath.substring(1)
  const newFullPath = !newPath.startsWith('/') ? newPath : newPath.substring(1)
  const params: CopyObjectCommandInput = {
    Bucket: oldItem.bucket,
    Key: newFullPath,
    CopySource: `${oldItem.bucket}/${oldFullPath}`,
  }

  const command = new CopyObjectCommand(params)
  const resp = (await s3Client.send(command)).$metadata
  return resp
}
