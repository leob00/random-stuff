import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { Bucket, S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getS3ObjectPresignedUrl, listS3Objects, deleteS3Object, renameS3Object } from 'lib/backend/api/aws/apiGateway/s3/s3functions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req, res)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }
  interface Arg extends S3Object {
    expiration?: number
  }
  if (req.method === 'POST') {
    const postArgs: Arg = req.body
    const response = await getS3ObjectPresignedUrl(postArgs.bucket, postArgs.fullPath, postArgs.expiration!)
    return res.status(200).json(response)
  }
  if (req.method === 'GET') {
    const getArgs: Arg = {
      bucket: String(req.query['bucket']) as Bucket,
      prefix: String(req.query['prefix']),
      filename: '',
      fullPath: String(req.query['fullPath']),
    }
    const response = await listS3Objects(getArgs.bucket, getArgs.prefix)
    return res.status(200).json(response)
  }
  if (req.method === 'DELETE') {
    const deleteArgs: Arg = {
      bucket: String(req.query['bucket']) as Bucket,
      prefix: String(req.query['prefix']),
      filename: String(req.query['filename']),
      fullPath: String(req.query['fullPath']),
    }

    const response = await deleteS3Object(deleteArgs.bucket, deleteArgs.fullPath)
    return res.status(202).json(response)
  }

  if (req.method === 'PATCH') {
    const patchArgs = req.body
    const response = await renameS3Object(patchArgs.bucket, patchArgs.oldPath, patchArgs.newPath)
    return res.status(200).json(response)
  }
}
