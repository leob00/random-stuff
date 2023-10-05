import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import formidable, { errors as formidableErrors } from 'formidable'
export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserSSRApi(req)
  if (user) {
    const form = formidable({})
    try {
      const [fields, files] = await form.parse(req)
      const file = files.file![0]
      //console.log(`uploading ${file.originalFilename}`)
      return res.json({ message: `uploaded ${file.originalFilename}` })
    } catch (err) {
      return res.status(500).json({ message: err })
    }
  } else {
    return res.status(403).json({ message: 'unauthorized' })
  }
}
