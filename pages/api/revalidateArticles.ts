import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const blogInv = async () => {
      await res.revalidate('/ssg/articles')
      return res.json({ revalidated: true })
    }
    blogInv()
  } catch (err) {
    console.error(err)
    return res.status(500).send('Error revalidating')
  }
}
