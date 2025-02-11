import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import formidable from 'formidable'
import fs from 'fs'
import { putItem } from 'app/serverActions/aws/s3/s3'
export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req, res)
  if (!user) {
    return res.status(403).json({ message: 'unauthorized' })
  }

  const form = formidable({})
  try {
    const [fields, files] = await form.parse(req)
    if (files.file) {
      const file = files.file![0]
      const rawData = fs.readFileSync(file.filepath!)
      let userFileName = fields.userFilename![0]
      const prefix = fields.prefix![0]
      if (!userFileName || userFileName.length === 0) {
        userFileName = file.originalFilename!
      }
      const resp = await putItem('rs-files', prefix, `${userFileName}`, file.mimetype!, file.size, rawData)
      if (resp) {
        return res.status(200).json(resp)
      }
    }
    console.error(`failed to put object to S3! Body: ${req.body}`)
    return res.status(500).json({ message: `failed to put object to S3` })
  } catch (err) {
    console.error('error in upload file: ', err)
    return res.status(500).json({ message: `internal server error: ${err}` })
  }
}
