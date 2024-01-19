import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import formidable, { errors as formidableErrors } from 'formidable'
import fs from 'fs'
import { getS3ObjectPresignedUrlForWrite, putS3, putS3Large, S3Object } from 'lib/backend/api/aws/apiGateway'
export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)

  if (user) {
    const form = formidable({})
    try {
      const [fields, files] = await form.parse(req)
      if (files.file) {
        const file = files.file![0]
        let rawData = fs.readFileSync(file.filepath!)
        let userFileName = fields.userFilename![0]
        if (!userFileName || userFileName.length === 0) {
          userFileName = file.originalFilename!
        }
        const prefix = fields.prefix![0]
        const fullPath = `${prefix}/${userFileName}`

        //const presignedUrl = JSON.parse(presignedUrlResp) as string
        //const presignedUrlResp = await getS3ObjectPresignedUrlForWrite('rs-files', fullPath, 1000, file.mimetype!)
        //console.log('presignedUrlResp: ', presignedUrlResp)
        //console.log('presigndUrl: ', presignedUrl)
        //const resp = await putS3('rs-files', `${user.email}`, `${userFileName}`, file.mimetype!, rawData)
        // TODO: not working yet
        //const presignedUrlResp = await getS3ObjectPresignedUrlForWrite('rs-files', fullPath, 1000, file.mimetype!)

        //const resp = await putS3Large('rs-files', userFileName, fullPath, presignedUrlResp!, file.mimetype!, rawData)
        const resp = await putS3('rs-files', `${user.email}`, `${userFileName}`, file.mimetype!, rawData)
        if (resp) {
          return res.status(200).json(resp)
        }
        if (resp) {
          return res.status(200).json(resp)
        }
      }
      return res.status(500).json({ message: `failed to put object to S3` })
    } catch (err) {
      return res.status(500).json({ message: `internal server error: ${err}` })
    }
  } else {
    return res.status(403).json({ message: 'unauthorized' })
  }
}
