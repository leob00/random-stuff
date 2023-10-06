import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { Bucket, deleteS3Object, getS3ObjectPresignedUrl, listS3Objects, putS3 } from 'lib/backend/api/aws/apiGateway'
import { postDelete } from 'lib/backend/api/fetchFunctions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  type Arg = {
    bucket: string
    prefix: string
    filename?: string
    expiration?: number
  }
  if (user) {
    if (req.method === 'POST') {
      const postArgs: Arg = req.body
      const response = await getS3ObjectPresignedUrl(postArgs.bucket, postArgs.prefix, postArgs.filename!, postArgs.expiration!)
      return res.status(200).json(response)
    }
    if (req.method === 'GET') {
      const getArgs: Arg = {
        bucket: String(req.query['bucket']),
        prefix: String(req.query['prefix']),
      }
      const response = await listS3Objects(getArgs.bucket as Bucket, getArgs.prefix)

      return res.status(200).json(response)
    }
    if (req.method === 'DELETE') {
      const deletArgs: Arg = {
        bucket: String(req.query['bucket']),
        prefix: String(req.query['prefix']),
        filename: String(req.query['filename']),
      }

      const response = await deleteS3Object(deletArgs.bucket as Bucket, deletArgs.prefix, deletArgs.filename!)
      return res.status(202).json(response)
    }
  }

  return res.status(403).json({ message: 'unauthorized' })
}
