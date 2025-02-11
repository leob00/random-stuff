import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import formidable from 'formidable'
import fs from 'fs'
import { putS3 } from 'lib/backend/api/aws/apiGateway/apiGateway'
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
      let rawData = fs.readFileSync(file.filepath!)

      let userFileName = fields.userFilename![0]
      if (!userFileName || userFileName.length === 0) {
        userFileName = file.originalFilename!
      }

      const resp = await putS3('rs-files', `${user.email}`, `${userFileName}`, file.mimetype!, file.size, rawData)
      //console.log('resp: ', resp)
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
